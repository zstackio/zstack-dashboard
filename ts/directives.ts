/// <reference path="d.ts/angularjs/angular.d.ts" />
/// <reference path="d.ts/kendo.all.d.ts" />
/// <reference path="d.ts/sprintf.d.ts" />

module Directive {
    export class PanelHeaderIn implements ng.IDirective {
        link: (scope: ng.IScope,
               instanceElement: ng.IAugmentedJQuery,
               instanceAttributes: ng.IAttributes,
               controller: any,
               transclude: ng.ITranscludeFunction
            ) => void;
        scope : any;
        restrict: string;
        replace: boolean;

        constructor() {
            this.scope = false;
            this.link = ($scope, $element, $attrs, $ctrl, $transclude) => {
                var collapse = $element.find('.collapse');
                var i = $element.find('i.z-collapse');
                collapse.on('show.bs.collapse', ()=>{
                    $scope.$apply(()=>{
                        i.removeClass('fa fa-chevron-right');
                        i.addClass('fa fa-chevron-down');
                    });
                });
                collapse.on('hide.bs.collapse', ()=>{
                    i.removeClass('fa fa-chevron-down');
                    i.addClass('fa fa-chevron-right');
                });
            };
            this.restrict = 'EA';
            this.replace = false;
        }
    }

    class PopoverImpl {
        popover: any;
        options: any;
        id: string;
        isOpen: boolean = false;

        toggle() {
            if (!this.isOpen) {
                this.popover.popover('show');
            } else {
                this.popover.popover('hide');
            }

            this.isOpen = !this.isOpen;
        }

        constructor(private $scope : any, private $attrs : any, private $element: any) {
            this.id = '#' + $attrs.id;
            if (Utils.notNullnotUndefined($attrs.zOptions)) {
                this.options = $scope[$attrs.zOptions];
            } else {
                this.options = {
                    html: true,
                    trigger: 'click',
                    placement: 'bottom',
                    container: 'body'
                };
            }

            var contentId = $attrs.zContentId;
            var content = $element.parent().find('#' + contentId);
            content.hide();
            this.options.content = ():any=> {
                content.show();
                return content;
            };
            this.popover = $(this.id);
            this.popover.popover(this.options);
        }
    }

    export class Popover implements ng.IDirective {
        link: (scope: ng.IScope,
               instanceElement: ng.IAugmentedJQuery,
               instanceAttributes: ng.IAttributes,
               controller: any,
               transclude: ng.ITranscludeFunction
            ) => void;
        scope : any;
        restrict: string;
        replace: boolean;

        constructor() {
            this.scope = true;
            this.restrict = 'EA';
            this.replace = false;
            this.link = ($scope : any, $element, $attrs : any, $ctrl, $transclude) => {
                var parent = $scope.$parent;
                parent[$attrs.zPopover] =  new PopoverImpl($scope, $attrs, $element);
            }
        }
    }


    export class SearchBoxSchema {
        static VALUE_TYPE_TEXT = "text";
        static VALUE_TYPE_LIST = "list";
        static VALUE_TYPE_TIMESTAMP = "timeStamp";

        type: string;
        list: string[];
        getQueryableFields: (value: string)=>string[];
        removeCascade: any;
    }

    class SearchCondition {
        name: string;
        op: string;
        value: string;
        listValue: string;
        dateTimeValue: string;
        type: string;

        equals(obj) : boolean {
            return obj.name === this.name && obj.op === this.op && obj.value === this.value;
        }

        setListValue(val : string) {
            this.type = SearchBoxSchema.VALUE_TYPE_LIST;
            this.listValue = val;
        }

        setTextValue(val : string) {
            this.type = SearchBoxSchema.VALUE_TYPE_TEXT;
            this.value = val;
        }

        setDateTimeValue(val : string) {
            this.type = SearchBoxSchema.VALUE_TYPE_TIMESTAMP;
            this.value = val;
        }

        toQueryCondition() : ApiHeader.QueryCondition {
            var ret = new ApiHeader.QueryCondition();
            ret.name = this.name;
            ret.op = this.op;
            if (this.type == SearchBoxSchema.VALUE_TYPE_TEXT) {
                ret.value = this.value;
            } else if (this.type == SearchBoxSchema.VALUE_TYPE_LIST) {
                ret.value = this.listValue;
            } else if (this.type == SearchBoxSchema.VALUE_TYPE_TIMESTAMP) {
                ret.value = this.dateTimeValue;
            }
            return ret;
        }

        hasValue() : boolean {
            if (this.type == SearchBoxSchema.VALUE_TYPE_TEXT) {
                return Utils.notNullnotUndefined(this.value);
            } else if (this.type == SearchBoxSchema.VALUE_TYPE_LIST) {
                return Utils.notNullnotUndefined(this.listValue);
            } else if (this.type == SearchBoxSchema.VALUE_TYPE_TIMESTAMP) {
                return Utils.notNullnotUndefined(this.dateTimeValue);
            }
        }
    }


    export class SearchBox implements ng.IDirective {
        link: (scope: ng.IScope,
               instanceElement: ng.IAugmentedJQuery,
               instanceAttributes: ng.IAttributes,
               controller: any,
               transclude: ng.ITranscludeFunction
            ) => void;
        scope : any;
        restrict: string;
        replace: boolean;
        templateUrl: string;

        conditions: any = {};
        $scope : any;
        options : any;
        fieldNames: string[];

        private static OPS = ["=", "!=", ">", "<", ">=", "<=", "in", "not in", "is null", "is not null", "like", "not like"];
        private static TAG_OPS = ['in', 'not in'];
        private static USER_TAG_CONDITION_NAME = '__userTag__';

        newCurrentCondition() {
            this.$scope.currentCondition = new SearchCondition();
            this.$scope.currentCondition.name = this.$scope.fieldCombo__.value();
            this.$scope.currentCondition.op = this.$scope.opDropdown__.value();
            var schema = this.getSchema();
            if (Utils.notNullnotUndefined(schema)) {
                if (schema.type == SearchBoxSchema.VALUE_TYPE_LIST) {
                    this.$scope.currentCondition.setListValue(this.$scope.valueList__.value());
                } else if (schema.type == SearchBoxSchema.VALUE_TYPE_TIMESTAMP) {
                    this.$scope.valueDateTime__.value(null);
                    this.$scope.currentCondition.setDateTimeValue(null);
                } else {
                    this.$scope.currentCondition.setTextValue(null);
                }
            } else {
                this.$scope.currentCondition.setTextValue(null);
            }
        }

        open() {
            this.conditions = {};
            this.newCurrentCondition();
            this.$scope.optionsField.dataSource.data(this.fieldNames);
            this.$scope.fieldCombo__.value(this.fieldNames[0]);
            this.$scope.winSearch__.center();
            this.$scope.winSearch__.open();
        }

        getSchema() : SearchBoxSchema {
            return this.options.schema[this.$scope.currentCondition.name];
        }

        constructor(private $compile : ng.ICompileService) {
            this.scope = true;
            this.restrict = 'EA';
            this.replace = true;
            this.templateUrl = '/static/templates/directives/search.html';
            this.link = ($scope : any, $element, $attrs : any, $ctrl, $transclude) => {
                var instanceName = $attrs.zSearch;
                var parentScope = $scope.$parent;
                parentScope[instanceName] = this;
                var options = parentScope[$attrs.zOptions];

                this.$scope = $scope;
                this.options = options;

                $scope.currentCondition = new SearchCondition();

                $scope.funcValueShow = (type : string) => {
                    var schema = this.getSchema();
                    if (!Utils.notNullnotUndefined(schema)) {
                        return type == SearchBoxSchema.VALUE_TYPE_TEXT;
                    }
                    return schema.type == type;
                };

                $scope.valueListOptions__ = {};

                $scope.name = options.name;

                $scope.funcCancel = () => {
                    $scope.winSearch__.close();
                };

                $scope.funcSearch = () => {
                    var ret = [];
                    var tmp = {};
                    angular.forEach(this.conditions, (cond : ApiHeader.QueryCondition)=> {
                        if (cond.op != 'in' && cond.op != 'not in') {
                            if (cond.op == 'like' || cond.op == 'not like') {
                                cond.value = '%' + cond.value + '%';
                            }
                            ret.push(cond);
                        } else {
                            var queue = tmp[cond.name];
                            if (!Utils.notNullnotUndefined(queue)) {
                                queue = {};
                                tmp[cond.name] = queue;
                            }

                            if (cond.op == 'in') {
                                var inq = queue['in'];
                                if (!Utils.notNullnotUndefined(inq)) {
                                    inq = [];
                                    queue['in'] = inq;
                                }
                                inq.push(cond.value);
                            } else {
                                var notinq = queue['not in'];
                                if (!Utils.notNullnotUndefined(notinq)) {
                                    notinq = [];
                                    queue['not in'] = notinq;
                                }
                                notinq.push(cond.value);
                            }
                        }
                    });

                    for (var k in tmp) {
                        var queue = tmp[k];
                        var inq = queue['in'];
                        if (Utils.notNullnotUndefined(inq)) {
                            ret.push({
                                name: k,
                                op: 'in',
                                value: inq.join()
                            });
                        }
                        var notinq = queue['not in'];
                        if (Utils.notNullnotUndefined(notinq)) {
                            ret.push({
                                name: k,
                                op: 'not in',
                                value: notinq.join()
                            });
                        }
                    }

                    if (Utils.notNullnotUndefined(this.options.done)) {
                        this.options.done(ret);
                    }

                    $scope.winSearch__.close();
                };

                $scope.funcCanAdd = ()=> {
                    if ($scope.currentCondition.op != 'is null' && $scope.currentCondition.op != 'is not null') {
                        return Utils.notNullnotUndefined($scope.currentCondition.name) && Utils.notNullnotUndefined($scope.currentCondition.op)
                            && $scope.currentCondition.hasValue();
                    } else {
                        return Utils.notNullnotUndefined($scope.currentCondition.name) && Utils.notNullnotUndefined($scope.currentCondition.op);
                    }
                };

                $scope.funcCanConditionsShow = ()=> {
                    return !Utils.isEmptyObject(this.conditions);
                };

                $scope.duplicateCondition = false;

                $scope.funcAddCondition = () => {
                    $scope.duplicateCondition = false;
                    var cur = $scope.currentCondition;
                    for (var k in this.conditions) {
                        var c = this.conditions[k];
                        if (c.name == cur.name && c.op == cur.op && c.value == cur.value) {
                            $scope.duplicateCondition = true;
                            return;
                        }
                    }

                    this.conditions[Utils.uuid()] = $scope.currentCondition.toQueryCondition();
                    this.newCurrentCondition();
                };

                $scope.optionsSearch__ = {
                    width:"680px",
                    animation: false,
                    resizable: false
                };

                $scope.valueTimestampOptions__ = {
                    value: null,
                    format: 'yyyy-MM-dd HH:mm:ss',
                    timeFormat: "HH:mm"
                };

                $scope.valueListOptions__ = {
                    dataSource: {
                        data: []
                    }
                };

                var fieldNames =  [];
                fieldNames = fieldNames.concat(options.fields);
                fieldNames.push(SearchBox.USER_TAG_CONDITION_NAME);
                this.fieldNames = fieldNames;
                $scope.optionsField = {
                    dataSource: new kendo.data.DataSource({
                        data: fieldNames
                    }),

                    change: (e)=> {
                        var list = e.sender;
                        Utils.safeApply($scope, ()=> {
                            $scope.currentCondition.name = list.value();

                            if ($scope.currentCondition.name === SearchBox.USER_TAG_CONDITION_NAME) {
                                $scope.optionsOp.setData(SearchBox.TAG_OPS);
                            } else {
                                $scope.optionsOp.setData(SearchBox.OPS);
                            }

                            var schema = this.getSchema();
                            if (!Utils.notNullnotUndefined(schema) || schema.type == SearchBoxSchema.VALUE_TYPE_TEXT) {
                                $scope.currentCondition.setTextValue($scope.currentCondition.value);
                            } else if (schema.type == SearchBoxSchema.VALUE_TYPE_LIST) {
                                $scope.valueList__.dataSource.data(schema.list);
                                $scope.currentCondition.setListValue(schema.list[0]);
                            } else if (schema.type == SearchBoxSchema.VALUE_TYPE_TIMESTAMP) {
                                $scope.currentCondition.setDateTimeValue($scope.currentCondition.dateTimeValue);
                            }
                        });
                    }
                };

                $scope.optionsOp = {
                    dataSource: new kendo.data.DataSource({
                        data: SearchBox.OPS
                    }),

                    setData: (data : any[]) => {
                        $scope.optionsOp.dataSource.data(data);
                        $scope.currentCondition.op = data[0];
                    },

                    change: (e)=> {
                        var list = e.sender;
                        Utils.safeApply($scope, ()=> {
                            $scope.currentCondition.op = list.value();
                        });
                    }
                };

                $scope.$watch(()=>{
                    return this.conditions;
                }, ()=>{
                    for (var k in this.conditions) {
                        var c = this.conditions[k];
                        if (c.op != '=') {
                            continue;
                        }

                        var schema = this.options.schema[c.name];
                        if (!Utils.notNullnotUndefined(schema)) {
                            continue;
                        }

                        if (!Utils.notNullnotUndefined(schema.getQueryableFields)) {
                            continue;
                        }

                        var newFieldNames = [];
                        newFieldNames = newFieldNames.concat(schema.getQueryableFields(c.value));
                        newFieldNames.push(SearchBox.USER_TAG_CONDITION_NAME);
                        $scope.optionsField.dataSource.data(newFieldNames);
                        return;
                    }

                    $scope.optionsField.dataSource.data(fieldNames);
                    if (Utils.notNullnotUndefined($scope.fieldCombo__)) {
                        $scope.fieldCombo__.value(fieldNames[0]);
                    }
                }, true);

                $scope.funcRemoveCondition = (uuid: string) => {
                    var cond = this.conditions[uuid];
                    var schema = this.options.schema[cond.name];
                    if (!Utils.notNullnotUndefined(schema) || !Utils.notNullnotUndefined(schema.removeCascade)) {
                        delete this.conditions[uuid];
                        return;
                    }

                    for (var k in schema.removeCascade) {
                        if (k != cond.name) {
                            continue;
                        }

                        angular.forEach(schema.removeCascade[k], (cascadeField: string)=>{
                            for (var ck in this.conditions) {
                                var cv = this.conditions[ck];
                                if (cv.name == cascadeField) {
                                    delete this.conditions[ck];
                                }
                            }
                        });
                    }
                    delete this.conditions[uuid];
                };

                var conditionTable = $element.find('#conditionTable');

                $scope.$watch(()=> {
                    return this.conditions;
                }, ()=> {
                    angular.forEach(conditionTable.children(), (child)=> {
                        child.remove();
                    });

                    if (Utils.isEmptyObject(this.conditions)) {
                        return;
                    }

                    var header : any = '<tr><th class="z-label">CONDITIONS</th><th></th></tr>';
                    header = $compile(header)($scope);
                    conditionTable.append(header);

                    angular.forEach(this.conditions, (cond : SearchCondition, uuid: string)=> {
                        var tr : any = '<tr>'
                            + '<td>'
                            + '<span class="z-search-condition">' + cond.name + '</span>'
                            + '<span class="z-search-condition">' + cond.op + '</span>'
                            + '<span class="z-search-condition">' + cond.value + '</span>'
                            + '</td>'
                            + '<td><button type="button" class="btn btn-xs btn-danger pull-right" ng-click="funcRemoveCondition(\'' + uuid + '\')"><i class="fa fa-minus"></i></button></td>'
                            + '</tr>';
                        tr = $compile(tr)($scope);
                        conditionTable.append(tr);
                    });

                }, true);
            }
        }
    }

    export class GridDoubleClick implements ng.IDirective {
        link: (scope: ng.IScope,
               instanceElement: ng.IAugmentedJQuery,
               instanceAttributes: ng.IAttributes,
               controller: any,
               transclude: ng.ITranscludeFunction
            ) => void;
        scope : any;
        restrict: string;
        replace: boolean;

        constructor() {
            this.scope = false;
            this.restrict = 'EA';
            this.replace = false;
            this.link = ($scope : any, $element, $attrs : any, $ctrl, $transclude) => {
                var method = $scope[$attrs.zGridDoubleClick];
                var grid = $($element);
                grid.delegate("tbody>tr", "dblclick", (e)=>{
                    Utils.safeApply($scope, ()=>{
                        if (Utils.notNullnotUndefined(method)) {
                            method(e);
                        }
                    });
                });
            };
        }
    }

    export class SortByData {
        field: string;
        direction: string;

        isValid() : boolean {
            return Utils.notNullnotUndefined(this.field);
        }

        toString() : string {
            if (!this.isValid()) {
                return 'Sort By';
            }

            return Utils.sprintf('{0}:{1}', this.field, this.direction);
        }
    }

    export class SortBy implements ng.IDirective {
        link: (scope: ng.IScope,
               instanceElement: ng.IAugmentedJQuery,
               instanceAttributes: ng.IAttributes,
               controller: any,
               transclude: ng.ITranscludeFunction
            ) => void;
        scope : any;
        restrict: string;
        replace: boolean;
        templateUrl: string;

        static NO_SORT_BY_NAME = '-- No Sort --';

        constructor() {
            this.scope = true;
            this.restrict = 'EA';
            this.replace = true;
            this.templateUrl = "/static/templates/directives/sort.html";
            this.link = ($scope : any, $element, $attrs : any, $ctrl, $transclude) => {
                $scope.funcShow = (popover : any)=> {
                    popover.toggle();
                };

                var parent = $scope.$parent;
                var options = parent[$attrs.zOptions];
                var fields = [
                    {
                        name: SortBy.NO_SORT_BY_NAME,
                        value:'__null__'
                    }
                ];

                fields = fields.concat(options.fields);
                $scope.optionsSortBy__ = {
                    dataSource: new kendo.data.DataSource({
                        data: fields
                    }),
                    dataTextField: 'name',
                    dataValueField: 'value'
                };

                $scope.field = fields[0].value;
                $scope.direction = "desc";
                $scope.buttonName = "Sort By";

                $scope.funcSortByConfirm = (popover : any) => {
                    popover.toggle();
                    var ret = new SortByData();
                    ret.direction = $scope.direction;
                    ret.field = $scope.field == '__null__' ? null : $scope.field;
                    $scope.buttonName = ret.toString();
                    options.done(ret);
                };
            };
        }
    }

    export class DeleteConfirmOptions {
        title: string;
        description: string;
        cancel: ()=>void;
        confirm: ()=>void;
        html: string;
    }

    class DeleteConfirmImpl {
        open() {
            this.$scope.ok = null;
            this.$scope.winDelete__.center();
            this.$scope.winDelete__.open();
        }

        constructor(private $scope : any,  $attrs : any, $element : any) {
            var options : DeleteConfirmOptions = $scope.$parent[$attrs.zOptions];

            $scope.optionsDelete__ = {
                animation: false,
                modal: true,
                draggable: false,
                resizable: false,
                width: "500px"
            };

            $scope.title = options.title;
            $scope.description = options.description;
            if (Utils.notNullnotUndefined(options.html)) {
                var desc = $element.find('#description');
                var el = $(options.html);
                desc.append(el);
            }

            $scope.confirm = ()=> {
                options.confirm();
                $scope.winDelete__.close();
            };

            $scope.cancel = () => {
                var c = options.cancel;
                if (Utils.notNullnotUndefined(c)) {
                    c();
                }
                $scope.winDelete__.close();
            };
        }
    }

    export class DeleteConfirm implements ng.IDirective {
        link: (scope: ng.IScope,
               instanceElement: ng.IAugmentedJQuery,
               instanceAttributes: ng.IAttributes,
               controller: any,
               transclude: ng.ITranscludeFunction
            ) => void;
        scope : any;
        controller: any;
        restrict: string;
        replace: boolean;
        templateUrl: any;

        constructor() {
            this.scope = true;
            this.replace = true;
            this.restrict = 'EA';
            this.templateUrl = '/static/templates/directives/deleteConfirm.html';
            this.link = ($scope : any, $element, $attrs : any, $ctrl, $transclude) => {
                $scope.$parent[$attrs.zDeleteConfirm] = new DeleteConfirmImpl($scope, $attrs, $element);
            };
        }
    }


    class ConfirmBoxImpl {
        options: any;

        open() {
            if (Utils.notNullnotUndefined(this.options.description)) {
                this.$scope.description = this.options.description();
            }

            this.$scope.confirmBox__.center();
            this.$scope.confirmBox__.open();
        }

        constructor(private $scope : any,  $attrs : any, $element : any) {
            var options  = this.options = $scope.$parent[$attrs.zOptions];

            $scope.optionsConfirmBox__ = {
                animation: false,
                modal: true,
                draggable: false,
                resizable: false,
                width: Utils.notNullnotUndefined(options.width) ? options.width : '500px'
            };

            $scope.btnType = Utils.notNullnotUndefined(options.btnType) ? options.btnType : 'btn-primary';
            $scope.title = options.title;

            if (Utils.notNullnotUndefined(options.html)) {
                var desc = $element.find('#description');
                var el = $(options.html);
                desc.append(el);
            }

            $scope.confirm = ()=> {
                options.confirm();
                $scope.confirmBox__.close();
            };

            $scope.canProceed = ()=> {
                if (Utils.notNullnotUndefined(options.canProceed)) {
                    return options.canProceed();
                }
                return true;
            };

            $scope.cancel = () => {
                var c = options.cancel;
                if (Utils.notNullnotUndefined(c)) {
                    c();
                }
                $scope.confirmBox__.close();
            };
        }
    }

    export class ConfirmBox implements ng.IDirective {
        link:(scope:ng.IScope, instanceElement:ng.IAugmentedJQuery, instanceAttributes:ng.IAttributes, controller:any, transclude:ng.ITranscludeFunction) => void;
        scope:any;
        controller:any;
        restrict:string;
        replace:boolean;
        templateUrl:any;

        options:any;
        $scope:any;

        constructor() {
            this.scope = true;
            this.restrict = 'EA';
            this.replace = true;
            this.templateUrl = '/static/templates/directives/confirmBox.html';
            this.link = ($scope : any, $element, $attrs : any, $ctrl, $transclude) => {
                $scope.$parent[$attrs.zConfirm] = new ConfirmBoxImpl($scope, $attrs, $element);
            }
        }
    }
}

angular.module('root')
    .directive("zPanelHeaderIn", () => {
        return new Directive.PanelHeaderIn();
    }).directive('zPopover', ()=> {
        return new Directive.Popover();
    }).directive('zSearch', ['$compile', ($compile)=> {
        return new Directive.SearchBox($compile);
    }]).directive('zGridDoubleClick', ()=> {
        return new Directive.GridDoubleClick();
    }).directive('zSortBy', ()=> {
        return new Directive.SortBy();
    }).directive('zDeleteConfirm', ()=> {
        return new Directive.DeleteConfirm();
    }).directive('zConfirm', ()=>{
        return new Directive.ConfirmBox();
    }).filter('size', [function() {
        return Utils.toSizeString;
    }]).filter('VCPU', [function () {
        return Utils.toVCPUString;
    }]).filter('percent', [function () {
        return Utils.toPercentageString;
    }]).filter('commas', [function () {
        return Utils.commaString;
    }]);


/// <reference path="d.ts/angularjs/angular.d.ts" />
/// <reference path="d.ts/kendo.all.d.ts" />

module MGlobalConfig {
    export class GlobalConfigManager {
        static $inject = ['Api', '$rootScope'];

        constructor(private api : Utils.Api, private $rootScope: ng.IRootScopeService) {
        }

        private sortBy : Directive.SortByData;

        setSortBy(sortBy : Directive.SortByData) {
            this.sortBy = sortBy;
        }

        query(qobj : ApiHeader.QueryObject, callback : (configs : ApiHeader.GlobalConfigInventory[], total: number) => void) : void {
            var msg = new ApiHeader.APIQueryGlobalConfigMsg();
            msg.count = qobj.count === true;
            msg.start = qobj.start;
            msg.limit = qobj.limit;
            msg.replyWithCount = true;
            msg.conditions = qobj.conditions ? qobj.conditions : [];
            if (Utils.notNullnotUndefined(this.sortBy) && this.sortBy.isValid()) {
                msg.sortBy = this.sortBy.field;
                msg.sortDirection = this.sortBy.direction;
            }
            this.api.syncApi(msg, (ret : ApiHeader.APIQueryGlobalConfigReply)=>{
                callback(ret.inventories, ret.total);
            });
        }

        update(config: any, done:(inv: ApiHeader.GlobalConfigInventory)=>void) {
            var msg = new ApiHeader.APIUpdateGlobalConfigMsg();
            msg.name = config.name;
            msg.category = config.category;
            msg.value = config.value;
            this.api.asyncApi(msg, (ret : ApiHeader.APIUpdateGlobalConfigEvent)=> {
                if (Utils.notNullnotUndefined(done)) {
                    done(ret.inventory);
                }
            });
        }
    }

    export class GlobalConfigModel extends Utils.Model {
        constructor() {
            super();
            this.current = null;
        }
    }

    class OGlobalConfigGrid extends Utils.OGrid {
        constructor($scope: any, private globalConfigMgr : GlobalConfigManager) {
            super();
            super.init($scope, $scope.globalConfigGrid);
            this.options.columns = [
                {
                    field: 'name',
                    title: '{{"globalConfig.ts.NAME" | translate}}',
                    width: '20%'
                },
                {
                    field: 'category',
                    title: '{{"globalConfig.ts.CATEGORY" | translate}}',
                    width: '20%'
                },
                {
                    field: 'description',
                    title: '{{"globalConfig.ts.DESCRIPTION" | translate}}',
                    width: '40%'
                },
                {
                    field: 'value',
                    title: '{{"globalConfig.ts.VALUE" | translate}}',
                    width: '20%'
                }
            ];

            this.options.dataSource.transport.read = (options)=> {
                var qobj = new ApiHeader.QueryObject();
                qobj.limit = options.data.take;
                qobj.start = options.data.pageSize * (options.data.page - 1);
                globalConfigMgr.query(qobj, (configs: ApiHeader.GlobalConfigInventory[], total:number)=> {
                    options.success({
                        data: configs,
                        total: total
                    });
                });
            };

            this.options.dataSource.pageSize(30);
        }
    }

    class Action {
        edit() {
            this.$scope.editGlobalConfigWin.open();
        }

        constructor(private $scope : any, private globalConfigMgr : GlobalConfigManager) {
        }
    }

    class FilterBy {
        fieldList: kendo.ui.DropDownListOptions;
        valueList: kendo.ui.DropDownListOptions;
        field: string;
        value: string;
        name: string;

        static NONE = 'none';
        static CATEGORY = 'category';

        constructor(private $scope : any, private categories: string[]) {
            this.fieldList = {
                dataSource: new kendo.data.DataSource({
                    data: [
                        {
                            name: '{{"globalConfig.ts.None" | translate}}',
                            value: FilterBy.NONE
                        },
                        {
                            name: '{{"globalConfig.ts.Category" | translate}}',
                            value: FilterBy.CATEGORY
                        }
                    ]
                }),
                dataTextField: 'name',
                dataValueField: 'value'
            };

            this.valueList = {
                dataSource: new kendo.data.DataSource({
                    data: []
                })
            };

            this.field = FilterBy.NONE;
            $scope.$watch(()=> {
                return this.field;
            }, ()=> {
                if (this.isFieldNone()) {
                    this.valueList.dataSource.data([]);
                } else if (this.field == FilterBy.CATEGORY) {
                    this.valueList.dataSource.data(this.categories);
                }
            });
        }

        isFieldNone() :boolean {
            return this.field == FilterBy.NONE;
        }

        confirm (popover : any) {
            this.$scope.oGlobalConfigGrid.setFilter(this.toKendoFilter());
            this.name = this.isFieldNone() ? null : Utils.sprintf('{0}:{1}', this.field, this.value);
            popover.toggle();
        }

        open (popover: any) {
            popover.toggle();
        }

        isValueListDisabled() : boolean {
            return !Utils.notNullnotUndefined(this.value);
        }

        getButtonName() {
            return this.name;
        }

        private toKendoFilter() : any {
            if (this.isFieldNone()) {
                return null;
            }

            return {
                field: this.field,
                operator: 'eq',
                value: this.value
            };
        }
    }

    export class DetailsController {
        static $inject = ['$scope', 'GlobalConfigManager', '$routeParams', 'current'];

        private loadSelf(current: any) {
            var qobj = new ApiHeader.QueryObject();
            qobj.conditions = [
                {
                    name: 'category',
                    op: '=',
                    value: current.category
                },
                {
                    name: 'name',
                    op: '=',
                    value: current.name
                }
            ];
            this.gMgr.query(qobj, (globalConfigs : ApiHeader.GlobalConfigInventory[], total:number)=> {
                this.$scope.model.current = globalConfigs[0];
            });
        }

        constructor(private $scope : any, private gMgr : GlobalConfigManager, private $routeParams : any,
                    current: ApiHeader.GlobalConfigInventory) {
            $scope.model = new GlobalConfigModel();
            $scope.model.current = current;

            $scope.action = new Action($scope, gMgr);

            $scope.funcRefresh = ()=> {
                this.loadSelf($scope.model.current);
            };

            $scope.funcToolbarShow = ()=> {
                return Utils.notNullnotUndefined($scope.model.current);
            };

            $scope.editGlobalConfigOptions = {
                config: current,
                done: (inv: ApiHeader.GlobalConfigInventory)=>{
                    $scope.model.current = inv;
                }
            };
        }
    }

    export class Controller {
        static $inject = ['$scope', 'GlobalConfigManager', 'configs', '$location'];

        constructor(private $scope : any, private gMgr : GlobalConfigManager, private configs: ApiHeader.GlobalConfigInventory[], private $location : ng.ILocationService) {
            $scope.model = new GlobalConfigModel();
            $scope.oGlobalConfigGrid = new OGlobalConfigGrid($scope, gMgr);
            $scope.action = new Action($scope, gMgr);
            $scope.optionsSortBy = {
                fields: [
                    {
                        name: '{{"globalConfig.ts.Name" | translate}}',
                        value: 'name'
                    },
                    {
                        name: '{{"globalConfig.ts.Category" | translate}}',
                        value: 'category'
                    },
                    {
                        name: '{{"globalConfig.ts.Description" | translate}}',
                        value: 'description'
                    }
                ],

                done: (ret : Directive.SortByData) => {
                    gMgr.setSortBy(ret);
                    $scope.oGlobalConfigGrid.refresh();
                }
            };

            $scope.optionsSearch = {
                fields: ApiHeader.GlobalConfigInventoryQueryable,
                name: 'GlobalConfig',
                schema: {
                    createDate: {
                        type: Directive.SearchBoxSchema.VALUE_TYPE_TIMESTAMP
                    },
                    lastOpDate: {
                        type: Directive.SearchBoxSchema.VALUE_TYPE_TIMESTAMP
                    }
                },

                done: (ret : ApiHeader.QueryCondition[])=> {
                    var qobj = new ApiHeader.QueryObject();
                    qobj.conditions = ret;
                    gMgr.query(qobj, (configs : ApiHeader.GlobalConfigInventory[], total:number)=> {
                        $scope.oGlobalConfigGrid.refresh(configs);
                    });
                }
            };

            $scope.funcGridDoubleClick = (e) => {
                if (Utils.notNullnotUndefined($scope.model.current)) {
                    var url = Utils.sprintf('/globalConfig/{0}/{1}', $scope.model.current.category, $scope.model.current.name);
                    $location.path(url);
                    e.preventDefault();
                }
            };

            var categories = {};
            angular.forEach(configs, (it)=>{
                categories[it.category] = it;
            });

            var categoryNames = [];
            for (var k in categories) {
                categoryNames.push(k);
            }

            $scope.filterBy = new FilterBy($scope, categoryNames);

            $scope.funcSearch = (win : any) => {
                win.open();
            };

            $scope.funcRefresh = ()=> {
                $scope.oGlobalConfigGrid.refresh();
            };

            $scope.funcIsActionShow = ()=> {
                return !Utils.isEmptyObject($scope.model.current);
            };

            $scope.funcIsActionDisabled = ()=> {
                return !Utils.notNullnotUndefined($scope.model.current);
            };

            $scope.editGlobalConfigOptions = {
                config: null,
                done: ()=> {
                   $scope.oGlobalConfigGrid.refresh();
                }
            };

            $scope.$watch(()=>{
                return $scope.model.current;
            }, ()=>{
                if (Utils.notNullnotUndefined($scope.model.current)) {
                    $scope.editGlobalConfigOptions.config = $scope.model.current;
                }
            });
        }
    }

    export class EditGlobalConfig implements ng.IDirective {
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

        options: any;
        $scope: any;

        open() {
            this.$scope.name = this.options.config.name;
            this.$scope.category = this.options.config.category;
            this.$scope.currentValue = this.options.config.value;
            this.$scope.newValue = this.options.config.value;

            this.$scope.editGlobalConfig__.center();
            this.$scope.editGlobalConfig__.open();
        }

        constructor(private gMgr: MGlobalConfig.GlobalConfigManager) {
            this.scope = true;
            this.restrict = 'EA';
            this.replace = true;
            this.templateUrl = '/static/templates/globalConfig/editGlobalConfig.html';
            this.link = ($scope : any, $element, $attrs : any, $ctrl, $transclude) => {
                var parent = $scope.$parent;
                parent[$attrs.zEditGlobalConfig] = this;
                this.options = parent[$attrs.zOptions];

                $scope.name = null;
                $scope.category = null;
                $scope.currentValue = null;
                $scope.newValue = null;

                $scope.canProceed = ()=> {
                    return Utils.notNullnotUndefined($scope.newValue) && $scope.newValue != $scope.currentValue;
                };

                $scope.cancel = () => {
                    $scope.editGlobalConfig__.close();
                };

                $scope.done = () => {
                    gMgr.update({
                        name: $scope.name,
                        category: $scope.category,
                        value: $scope.newValue
                    }, (inv: ApiHeader.GlobalConfigInventory)=>{
                        if (Utils.notNullnotUndefined(this.options.done)) {
                            this.options.done(inv);
                        }
                    });

                    $scope.editGlobalConfig__.close();
                };

                this.$scope = $scope;

                $scope.editGlobalConfigOptions__ = {
                    width: '550px'
                };
            }
        }
    }
}

angular.module('root').factory('GlobalConfigManager', ['Api', '$rootScope', (api, $rootScope)=> {
    return new MGlobalConfig.GlobalConfigManager(api, $rootScope);
}]).directive('zEditGlobalConfig', ['GlobalConfigManager', function(gMgr: MGlobalConfig.GlobalConfigManager) {
    return new MGlobalConfig.EditGlobalConfig(gMgr);
}]).config(['$routeProvider', function(route) {
    route.when('/globalConfig', {
        templateUrl: '/static/templates/globalConfig/globalConfig.html',
        controller: 'MGlobalConfig.Controller',
        resolve: {
            configs: function($q : ng.IQService, GlobalConfigManager : MGlobalConfig.GlobalConfigManager) {
                var defer = $q.defer();
                var qobj = new ApiHeader.QueryObject();
                GlobalConfigManager.query(qobj, (configs: ApiHeader.GlobalConfigInventory[])=>{
                    defer.resolve(configs);
                });
                return defer.promise;
            }
        }
    }).when('/globalConfig/:category/:name', {
        templateUrl: '/static/templates/globalConfig/details.html',
        controller: 'MGlobalConfig.DetailsController',
        resolve: {
            current: function($q : ng.IQService, $route: any, GlobalConfigManager: MGlobalConfig.GlobalConfigManager) {
                var defer = $q.defer();
                var qobj = new ApiHeader.QueryObject();
                var category = $route.current.params.category;
                var name = $route.current.params.name;
                qobj.conditions = [{
                    name: 'category',
                    op:  '=',
                    value: category
                }, {
                    name: 'name',
                    op: '=',
                    value: name
                }];
                GlobalConfigManager.query(qobj, (globalConfigs: ApiHeader.GlobalConfigInventory[])=>{
                    var globalConfig = globalConfigs[0];
                    defer.resolve(globalConfig);
                });
                return defer.promise;
            }
        }
    });
}]);


/// <reference path="d.ts/angularjs/angular.d.ts" />
/// <reference path="d.ts/kendo.all.d.ts" />

module MInstanceOffering {
    export class InstanceOffering extends ApiHeader.InstanceOfferingInventory {
        private inProgress : boolean;

        progressOn() {
            this.inProgress = true;
        }

        progressOff() {
            this.inProgress = false;
        }

        isInProgress() {
            return this.inProgress;
        }

        isEnableShow() : boolean {
            return this.state == 'Disabled';
        }

        isDisableShow() : boolean {
            return this.state == 'Enabled';
        }
        stateLabel() : string {
            if (this.state == 'Enabled') {
                return 'label label-success';
            } else if (this.state == 'Disabled') {
                return 'label label-danger';
            } else {
                return 'label label-default';
            }
        }

        updateObservableObject(inv : ApiHeader.InstanceOfferingInventory) {
            // self : ObservableObject
            var self : any = this;
            self.set('uuid', inv.uuid);
            self.set('name', inv.name);
            self.set('description', inv.description);
            self.set('state', inv.state);
            self.set('cpuNum', inv.cpuNum);
            self.set('cpuSpeed', inv.cpuSpeed);
            self.set('memorySize', inv.memorySize);
            self.set('allocatorStrategy', inv.allocatorStrategy);
            self.set('createDate', inv.createDate);
            self.set('lastOpDate', inv.lastOpDate);
        }
    }

    export class InstanceOfferingManager {
        static $inject = ['Api', '$rootScope'];

        constructor(private api : Utils.Api, private $rootScope: ng.IRootScopeService) {
        }

        private sortBy : Directive.SortByData;

        setSortBy(sortBy : Directive.SortByData) {
            this.sortBy = sortBy;
        }

        private wrap(InstanceOffering : InstanceOffering) : any {
            return new kendo.data.ObservableObject(InstanceOffering);
        }

        create(instanceOffering : any, done : (ret : InstanceOffering)=>void) {
            var msg : any = new ApiHeader.APICreateInstanceOfferingMsg();
            msg.name = instanceOffering.name;
            msg.description = instanceOffering.description;
            msg.cpuNum = instanceOffering.cpuNum;
            msg.cpuSpeed = 1;
            msg.memorySize = instanceOffering.memorySize;
            msg.allocatorStrategy = instanceOffering.allocatorStrategy;
            this.api.asyncApi(msg, (ret : ApiHeader.APICreateInstanceOfferingEvent)=> {
                var c = new InstanceOffering();
                angular.extend(c, ret.inventory);
                done(this.wrap(c));
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Added new Instance Offering: {0}',c.name),
                    link: Utils.sprintf('/#/instanceOffering/{0}', c.uuid)
                });
            });
        }

        query(qobj : ApiHeader.QueryObject, callback : (instanceOfferings : InstanceOffering[], total: number) => void) : void {
            var msg = new ApiHeader.APIQueryInstanceOfferingMsg();
            msg.count = qobj.count === true;
            msg.start = qobj.start;
            msg.limit = qobj.limit;
            msg.replyWithCount = true;
            msg.conditions = qobj.conditions ? qobj.conditions : [];
            if (Utils.notNullnotUndefined(this.sortBy) && this.sortBy.isValid()) {
                msg.sortBy = this.sortBy.field;
                msg.sortDirection = this.sortBy.direction;
            }
            msg.conditions.push({
                name: 'type',
                op: '=',
                value: 'UserVm'
            });
            this.api.syncApi(msg, (ret : ApiHeader.APIQueryInstanceOfferingReply)=>{
                var pris = [];
                ret.inventories.forEach((inv : ApiHeader.InstanceOfferingInventory)=> {
                    var c = new InstanceOffering();
                    angular.extend(c, inv);
                    pris.push(this.wrap(c));
                });
                callback(pris, ret.total);
            });
        }

        disable(instanceOffering : InstanceOffering) {
            instanceOffering.progressOn();
            var msg = new ApiHeader.APIChangeInstanceOfferingStateMsg();
            msg.stateEvent = 'disable';
            msg.uuid = instanceOffering.uuid;
            this.api.asyncApi(msg, (ret : ApiHeader.APIChangeInstanceOfferingStateEvent) => {
                instanceOffering.updateObservableObject(ret.inventory);
                instanceOffering.progressOff();
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Disabled Instance Offering: {0}',instanceOffering.name),
                    link: Utils.sprintf('/#/instanceOffering/{0}', instanceOffering.uuid)
                });
            });
        }

        enable(instanceOffering : InstanceOffering) {
            instanceOffering.progressOn();
            var msg = new ApiHeader.APIChangeInstanceOfferingStateMsg();
            msg.stateEvent = 'enable';
            msg.uuid = instanceOffering.uuid;
            this.api.asyncApi(msg, (ret : ApiHeader.APIChangeInstanceOfferingStateEvent) => {
                instanceOffering.updateObservableObject(ret.inventory);
                instanceOffering.progressOff();
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Enabled Instance Offering: {0}', instanceOffering.name),
                    link: Utils.sprintf('/#/instanceOffering/{0}', instanceOffering.uuid)
                });
            });
        }

        delete(instanceOffering : InstanceOffering, done : (ret : any)=>void) {
            instanceOffering.progressOn();
            var msg = new ApiHeader.APIDeleteInstanceOfferingMsg();
            msg.uuid = instanceOffering.uuid;
            this.api.asyncApi(msg, (ret : any)=> {
                instanceOffering.progressOff();
                done(ret);
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Deleted Instance Offering: {0}', instanceOffering.name)
                });
            });
        }
    }

    export class InstanceOfferingModel extends Utils.Model {
        constructor() {
            super();
            this.current = new InstanceOffering();
        }
    }

    class OInstanceOfferingGrid extends Utils.OGrid {
        constructor($scope: any, private instanceOfferingMgr : InstanceOfferingManager) {
            super();
            super.init($scope, $scope.instanceOfferingGrid);
            this.options.columns = [
                {
                    field: 'name',
                    title: '{{"instanceOffering.ts.NAME" | translate}}',
                    width: '10%',
                    template: '<a href="/\\#/instanceOffering/{{dataItem.uuid}}">{{dataItem.name}}</a>'
                },
                {
                    field: 'description',
                    title: '{{"instanceOffering.ts.DESCRIPTION" | translate}}',
                    width: '20%'
                },
                {
                    field: 'cpuNum',
                    title: '{{"instanceOffering.ts.CPU NUMBER" | translate}}',
                    width: '10%'
                },
                {
                    field: 'memorySize',
                    title: '{{"instanceOffering.ts.MEMORY" | translate}}',
                    width: '15%',
                    template: '<span>{{dataItem.memorySize | size}}</span>'
                },
                {
                    field: 'state',
                    title: '{{"instanceOffering.ts.STATE" | translate}}',
                    width: '15%',
                    template: '<span class="{{dataItem.stateLabel()}}">{{dataItem.state}}</span>'
                },

                {
                    field: 'uuid',
                    title: '{{"instanceOffering.ts.UUID" | translate}}',
                    width: '20%'
                }
            ];

            this.options.dataSource.transport.read = (options)=> {
                var qobj = new ApiHeader.QueryObject();
                qobj.limit = options.data.take;
                qobj.start = options.data.pageSize * (options.data.page - 1);
                instanceOfferingMgr.query(qobj, (instanceOfferings:InstanceOffering[], total:number)=> {
                    options.success({
                        data: instanceOfferings,
                        total: total
                    });
                });
            };
        }
    }

    class Action {
        enable() {
            this.instanceOfferingMgr.enable(this.$scope.model.current);
        }

        disable() {
            this.instanceOfferingMgr.disable(this.$scope.model.current);
        }

        constructor(private $scope : any, private instanceOfferingMgr : InstanceOfferingManager) {
        }
    }

    class FilterBy {
        fieldList: kendo.ui.DropDownListOptions;
        valueList: kendo.ui.DropDownListOptions;
        field: string;
        value: string;
        name: string;

        static NONE = 'none';
        static STATE = 'state';

        constructor(private $scope : any, private hypervisorTypes: string[]) {
            this.fieldList = {
                dataSource: new kendo.data.DataSource({
                    data: [
                        {
                            name: '{{"instanceOffering.ts.None" | translate}}',
                            value: FilterBy.NONE
                        },
                        {
                            name: '{{"instanceOffering.ts.State" | translate}}',
                            value: FilterBy.STATE
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
                if (this.field == FilterBy.NONE) {
                    this.valueList.dataSource.data([]);
                    this.value = null;
                } else if (this.field == FilterBy.STATE) {
                    this.valueList.dataSource.data(['Enabled', 'Disabled']);
                }
            });
        }

        confirm (popover : any) {
            this.$scope.oInstanceOfferingGrid.setFilter(this.toKendoFilter());
            this.name = !Utils.notNullnotUndefined(this.value) ? null : Utils.sprintf('{0}:{1}', this.field, this.value);
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
            if (!Utils.notNullnotUndefined(this.value)) {
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
        static $inject = ['$scope', 'InstanceOfferingManager', '$routeParams', 'Tag', 'current'];

        private loadSelf(uuid : string) {
            var qobj = new ApiHeader.QueryObject();
            qobj.addCondition({name: 'uuid', op: '=', value: uuid});
            this.instanceOfferingMgr.query(qobj, (instanceOfferings : InstanceOffering[], total:number)=> {
                this.$scope.model.current = instanceOfferings[0];
            });
        }

        constructor(private $scope : any, private instanceOfferingMgr : InstanceOfferingManager, private $routeParams : any,
                    private tagService : Utils.Tag, current: InstanceOffering) {
            $scope.model = new InstanceOfferingModel();
            $scope.model.current = current;

            $scope.funcDelete = (win : any) => {
                win.open();
            };

            $scope.action = new Action($scope, instanceOfferingMgr);

            $scope.funcRefresh = ()=> {
                this.loadSelf($scope.model.current.uuid);
            };

            $scope.funcToolbarShow = ()=> {
                return Utils.notNullnotUndefined($scope.model.current);
            };

            $scope.optionsDeleteInstanceOffering = {
                title: 'DELETE INSTANCE OFFERING',
                btnType: 'btn-danger',
                width: '350px',
                description: ()=>{
                    return current.name;
                },
                confirm: ()=> {
                    instanceOfferingMgr.delete($scope.model.current, (ret : any)=> {
                        $scope.model.resetCurrent();
                    });
                }
            };

            $scope.optionsTag = {
                tags: [],
                createTag: (item)=> {
                    this.tagService.createTag(item.tag, $scope.model.current.uuid, ApiHeader.TagResourceTypeInstanceOfferingVO, (ret : ApiHeader.TagInventory)=> {
                        angular.forEach($scope.optionsTag.tags, (it)=> {
                            if (it.tag === item.tag) {
                                angular.extend(it, ret);
                            }
                        });
                    });
                },
                deleteTag: (item)=> {
                    this.tagService.deleteTag(item.uuid);
                },
                isShow : ()=> {
                    return Utils.notNullnotUndefined($scope.model.current);
                }
            };

            this.tagService.queryTag($scope.model.current.uuid, (tags : ApiHeader.TagInventory[])=> {
                $scope.optionsTag.tags = tags;
            });

        }
    }

    export class Controller {
        static $inject = ['$scope', 'InstanceOfferingManager', 'hypervisorTypes', '$location'];

        constructor(private $scope : any, private instanceOfferingMgr : InstanceOfferingManager, private hypervisorTypes: string[], private $location : ng.ILocationService) {
            $scope.model = new InstanceOfferingModel();
            $scope.oInstanceOfferingGrid = new OInstanceOfferingGrid($scope, instanceOfferingMgr);
            $scope.action = new Action($scope, instanceOfferingMgr);
            $scope.optionsSortBy = {
                fields: [
                    {
                        name: '{{"instanceOffering.ts.Name" | translate}}',
                        value: 'name'
                    },
                    {
                        name: '{{"instanceOffering.ts.Description" | translate}}',
                        value: 'description'
                    },
                    {
                        name: '{{"instanceOffering.ts.CPU Number" | translate}}',
                        value: 'cpuNum'
                    },
                    {
                        name: '{{"instanceOffering.ts.Memory" | translate}}',
                        value: 'memorySize'
                    },
                    {
                        name: '{{"instanceOffering.ts.State" | translate}}',
                        value: 'state'
                    },
                    {
                        name: '{{"instanceOffering.ts.Created Date" | translate}}',
                        value: 'createDate'
                    },
                    {
                        name: '{{"instanceOffering.ts.Last Updated Date" | translate}}',
                        value: 'lastOpDate'
                    }
                ],

                done: (ret : Directive.SortByData) => {
                    instanceOfferingMgr.setSortBy(ret);
                    $scope.oInstanceOfferingGrid.refresh();
                }
            };

            $scope.optionsSearch = {
                fields: ApiHeader.InstanceOfferingInventoryQueryable,
                name: 'InstanceOffering',
                schema: {
                    state: {
                        type: Directive.SearchBoxSchema.VALUE_TYPE_LIST,
                        list: ['Enabled', 'Disabled']
                    },
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
                    instanceOfferingMgr.query(qobj, (InstanceOfferings : InstanceOffering[], total:number)=> {
                        $scope.oInstanceOfferingGrid.refresh(InstanceOfferings);
                    });
                }
            };

            $scope.funcGridDoubleClick = (e) => {
                if (Utils.notNullnotUndefined($scope.model.current)) {
                    var url = Utils.sprintf('/instanceOffering/{0}', $scope.model.current.uuid);
                    $location.path(url);
                    e.preventDefault();
                }
            };

            $scope.filterBy = new FilterBy($scope, this.hypervisorTypes);

            $scope.funcSearch = (win : any) => {
                win.open();
            };

            $scope.funcCreateInstanceOffering = (win : any) => {
                win.open();
            };

            $scope.funcDeleteInstanceOffering = () => {
                $scope.deleteInstanceOffering.open();
            };

            $scope.optionsDeleteInstanceOffering = {
                title: 'DELETE INSTANCE OFFERING',
                btnType: 'btn-danger',
                width: '350px',
                description: ()=>{
                    return $scope.model.current.name;
                },

                confirm: ()=> {
                    instanceOfferingMgr.delete($scope.model.current, (ret : any)=> {
                        $scope.oInstanceOfferingGrid.deleteCurrent();
                    });
                }
            };

            $scope.funcRefresh = ()=> {
                $scope.oInstanceOfferingGrid.refresh();
            };

            $scope.funcIsActionShow = ()=> {
                return !Utils.isEmptyObject($scope.model.current);
            };

            $scope.funcIsActionDisabled = ()=> {
                return Utils.notNullnotUndefined($scope.model.current) && $scope.model.current.isInProgress();
            };

            $scope.optionsCreateInstanceOffering = {
                done: (instanceOffering : InstanceOffering) => {
                    $scope.oInstanceOfferingGrid.add(instanceOffering);
                }
            };
        }
    }

    export class CreateInstanceOfferingOptions {
        zone : MZone.Zone;
        done : (InstanceOffering : InstanceOffering)=>void;
    }


    export class CreateInstanceOfferingModel {
        name: string;
        description: string;
        cpuNum: number;
        memorySize: number;
        allocatorStrategy: string;

        canCreate() : boolean {
            return Utils.notNullnotUndefined(this.name) && Utils.notNullnotUndefined(this.cpuNum) &&
               Utils.notNullnotUndefined(this.memorySize);
        }
    }

    export class CreateInstanceOffering implements ng.IDirective {
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
        options: CreateInstanceOfferingOptions;
        $scope: any;

        open() {
            var win = this.$scope.winCreateInstanceOffering__;
            this.$scope.button.reset();
            this.api.getInstanceOfferingAllocatorStrategies((ret: string[])=> {
                ret.unshift("");
                this.$scope.allocatorStrategyOptions__.dataSource.data(ret);
                win.center();
                win.open();
            });

        }

        constructor(private api : Utils.Api, private instanceOfferingMgr : InstanceOfferingManager) {
            this.scope = true;
            this.link = ($scope : any, $element, $attrs : any, $ctrl, $transclude) => {
                var instanceName = $attrs.zCreateInstanceOffering;
                var parentScope = $scope.$parent;
                parentScope[instanceName] = this;
                this.options = new CreateInstanceOfferingOptions();
                var optionName = $attrs.zOptions;
                if (angular.isDefined(optionName)) {
                    this.options = parentScope[optionName];
                    $scope.$watch(()=> {
                        return parentScope[optionName];
                    }, ()=> {
                        this.options = parentScope[optionName];
                    });
                }

                var infoPage: Utils.WizardPage = $scope.infoPage  = {
                    activeState: true,

                    name: null,
                    description: null,
                    memorySize: null,
                    cpuNum: null,
                    allocatorStrategy: null,

                    canMoveToPrevious(): boolean {
                        return false;
                    },

                    canMoveToNext(): boolean {
                        return Utils.notNullnotUndefined(this.name) && Utils.notNullnotUndefined(this.memorySize) && Utils.notNullnotUndefined(this.cpuNum)
                            && this.isCpuNumValid() && this.isMemoryValid();
                    },

                    show(): void {
                        this.getAnchorElement().tab('show');
                    },

                    getAnchorElement() : any {
                        return $('.nav a[data-target="#createInstanceOfferingInfo"]');
                    },

                    active(): void {
                        this.activeState = true;
                    },

                    isActive(): boolean {
                        return this.activeState;
                    },

                    getPageName(): string {
                        return 'createInstanceOfferingInfo';
                    },

                    isCpuNumValid(): boolean {
                        if (Utils.notNullnotUndefinedNotEmptyString(this.cpuNum)) {
                            return !isNaN(this.cpuNum);
                        }
                        return true;
                    },

                    isMemoryValid() {
                        if (Utils.notNullnotUndefinedNotEmptyString(this.memorySize)) {
                            return Utils.isValidSizeStr(this.memorySize);
                        }
                        return true;
                    },

                    reset() : void {
                        this.name = Utils.shortHashName('ioffering');
                        this.memorySize = null;
                        this.cpuNum = null;
                        this.allocatorStrategy = null;
                        this.description = null;
                        this.activeState = false;
                    }
                } ;

                var mediator : Utils.WizardMediator = $scope.mediator = {
                    currentPage: infoPage,
                    movedToPage: (page: Utils.WizardPage) => {
                        $scope.mediator.currentPage = page;
                    },

                    finishButtonName: (): string =>{
                        return "Create";
                    },

                    finish: ()=> {
                        var resultInstanceOffering : InstanceOffering;
                        var chain = new Utils.Chain();
                        chain.then(()=> {
                            if (Utils.notNullnotUndefined($scope.infoPage.allocatorStrategy) && $scope.infoPage.allocatorStrategy == "") {
                                $scope.infoPage.allocatorStrategy = null;
                            }

                            $scope.infoPage.memorySize = Utils.parseSize($scope.infoPage.memorySize);
                            instanceOfferingMgr.create(infoPage, (ret : InstanceOffering)=> {
                                resultInstanceOffering = ret;
                                chain.next();
                            });
                        }).done(()=> {
                            if (Utils.notNullnotUndefined(this.options.done)) {
                                this.options.done(resultInstanceOffering);
                            }

                            $scope.winCreateInstanceOffering__.close();
                        }).start();
                    }
                };

                $scope.button = new Utils.WizardButton([
                    infoPage
                ], mediator);

                $scope.winCreateInstanceOfferingOptions__ = {
                    width: '700px',
                    //height: '620px',
                    animation: false,
                    modal: true,
                    draggable: false,
                    resizable: false
                };

                $scope.allocatorStrategyOptions__ = {
                    dataSource: new kendo.data.DataSource({data: []})
                };

                this.$scope = $scope;
            };
            this.restrict = 'EA';
            this.replace = true;
            this.templateUrl = '/static/templates/instanceOffering/addInstanceOffering.html';
        }
    }
}

angular.module('root').factory('InstanceOfferingManager', ['Api', '$rootScope', (api, $rootScope)=> {
    return new MInstanceOffering.InstanceOfferingManager(api, $rootScope);
}]).directive('zCreateInstanceOffering', ['Api', 'InstanceOfferingManager', (api, instanceOfferingMgr)=> {
    return new MInstanceOffering.CreateInstanceOffering(api, instanceOfferingMgr);
}]).config(['$routeProvider', function(route) {
    route.when('/instanceOffering', {
        templateUrl: '/static/templates/instanceOffering/instanceOffering.html',
        controller: 'MInstanceOffering.Controller',
        resolve: {
            hypervisorTypes: function($q : ng.IQService, Api : Utils.Api) {
                var defer = $q.defer();
                Api.getHypervisorTypes((hypervisorTypes: string[])=> {
                    defer.resolve(hypervisorTypes);
                });
                return defer.promise;
            }
        }
    }).when('/instanceOffering/:uuid', {
        templateUrl: '/static/templates/instanceOffering/details.html',
        controller: 'MInstanceOffering.DetailsController',
        resolve: {
            current: function($q : ng.IQService, $route: any, InstanceOfferingManager: MInstanceOffering.InstanceOfferingManager) {
                var defer = $q.defer();
                var qobj = new ApiHeader.QueryObject();
                var uuid = $route.current.params.uuid;
                qobj.addCondition({name: 'uuid', op: '=', value: uuid});
                InstanceOfferingManager.query(qobj, (instanceOfferings: MInstanceOffering.InstanceOffering[])=>{
                    var instanceOffering = instanceOfferings[0];
                    defer.resolve(instanceOffering);
                });
                return defer.promise;
            }
        }
    });
}]);

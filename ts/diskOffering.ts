
/// <reference path="d.ts/angularjs/angular.d.ts" />
/// <reference path="d.ts/kendo.all.d.ts" />

module MDiskOffering {
    export class DiskOffering extends ApiHeader.DiskOfferingInventory {
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

        updateObservableObject(inv : ApiHeader.DiskOfferingInventory) {
            // self : ObservableObject
            var self : any = this;
            self.set('uuid', inv.uuid);
            self.set('name', inv.name);
            self.set('description', inv.description);
            self.set('state', inv.state);
            self.set('diskSize', inv.diskSize);
            self.set('allocatorStrategy', inv.allocatorStrategy);
            self.set('createDate', inv.createDate);
            self.set('lastOpDate', inv.lastOpDate);
        }
    }

    export class DiskOfferingManager {
        static $inject = ['Api', '$rootScope'];

        constructor(private api : Utils.Api, private $rootScope: ng.IRootScopeService) {
        }

        private sortBy : Directive.SortByData;

        setSortBy(sortBy : Directive.SortByData) {
            this.sortBy = sortBy;
        }

        private wrap(DiskOffering : DiskOffering) : any {
            return new kendo.data.ObservableObject(DiskOffering);
        }

        create(diskOffering : any, done : (ret : DiskOffering)=>void) {
            var msg : any = new ApiHeader.APICreateDiskOfferingMsg();
            msg.name = diskOffering.name;
            msg.description = diskOffering.description;
            msg.diskSize = diskOffering.diskSize;
            msg.allocatorStrategy = diskOffering.allocatorStrategy;
            this.api.asyncApi(msg, (ret : ApiHeader.APICreateDiskOfferingEvent)=> {
                var c = new DiskOffering();
                angular.extend(c, ret.inventory);
                done(this.wrap(c));
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Added new Disk Offering: {0}',c.name),
                    link: Utils.sprintf('/#/diskOffering/{0}', c.uuid)
                });
            });
        }

        query(qobj : ApiHeader.QueryObject, callback : (diskOfferings : DiskOffering[], total: number) => void) : void {
            var msg = new ApiHeader.APIQueryDiskOfferingMsg();
            msg.count = qobj.count === true;
            msg.start = qobj.start;
            msg.limit = qobj.limit;
            msg.replyWithCount = true;
            msg.conditions = qobj.conditions ? qobj.conditions : [];
            if (Utils.notNullnotUndefined(this.sortBy) && this.sortBy.isValid()) {
                msg.sortBy = this.sortBy.field;
                msg.sortDirection = this.sortBy.direction;
            }
            this.api.syncApi(msg, (ret : ApiHeader.APIQueryDiskOfferingReply)=>{
                var pris = [];
                ret.inventories.forEach((inv : ApiHeader.DiskOfferingInventory)=> {
                    var c = new DiskOffering();
                    angular.extend(c, inv);
                    pris.push(this.wrap(c));
                });
                callback(pris, ret.total);
            });
        }

        disable(diskOffering : DiskOffering) {
            diskOffering.progressOn();
            var msg = new ApiHeader.APIChangeDiskOfferingStateMsg();
            msg.stateEvent = 'disable';
            msg.uuid = diskOffering.uuid;
            this.api.asyncApi(msg, (ret : ApiHeader.APIChangeDiskOfferingStateEvent) => {
                diskOffering.updateObservableObject(ret.inventory);
                diskOffering.progressOff();
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Disabled Disk Offering: {0}',diskOffering.name),
                    link: Utils.sprintf('/#/diskOffering/{0}', diskOffering.uuid)
                });
            });
        }

        enable(diskOffering : DiskOffering) {
            diskOffering.progressOn();
            var msg = new ApiHeader.APIChangeDiskOfferingStateMsg();
            msg.stateEvent = 'enable';
            msg.uuid = diskOffering.uuid;
            this.api.asyncApi(msg, (ret : ApiHeader.APIChangeDiskOfferingStateEvent) => {
                diskOffering.updateObservableObject(ret.inventory);
                diskOffering.progressOff();
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Enabled Disk Offering: {0}', diskOffering.name),
                    link: Utils.sprintf('/#/diskOffering/{0}', diskOffering.uuid)
                });
            });
        }

        delete(diskOffering : DiskOffering, done : (ret : any)=>void) {
            diskOffering.progressOn();
            var msg = new ApiHeader.APIDeleteDiskOfferingMsg();
            msg.uuid = diskOffering.uuid;
            this.api.asyncApi(msg, (ret : any)=> {
                diskOffering.progressOff();
                done(ret);
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Deleted Disk Offering: {0}', diskOffering.name)
                });
            });
        }
    }

    export class DiskOfferingModel extends Utils.Model {
        constructor() {
            super();
            this.current = new DiskOffering();
        }
    }

    class ODiskOfferingGrid extends Utils.OGrid {
        constructor($scope: any, private diskOfferingMgr : DiskOfferingManager) {
            super();
            super.init($scope, $scope.diskOfferingGrid);
            this.options.columns = [
                {
                    field: 'name',
                    title: '{{"diskOffering.ts.NAME" | translate}}',
                    width: '20%',
                    template: '<a href="/\\#/diskOffering/{{dataItem.uuid}}">{{dataItem.name}}</a>'
                },
                {
                    field: 'description',
                    title: '{{"diskOffering.ts.DESCRIPTION" | translate}}',
                    width: '20%'
                },
                {
                    field: 'diskSize',
                    title: '{{"diskOffering.ts.DISK SIZE" | translate}}',
                    width: '20%',
                    template: '<span>{{dataItem.diskSize | size}}</span>'
                },
                {
                    field: 'state',
                    title: '{{"diskOffering.ts.STATE" | translate}}',
                    width: '20%',
                    template: '<span class="{{dataItem.stateLabel()}}">{{dataItem.state}}</span>'
                },

                {
                    field: 'uuid',
                    title: '{{"diskOffering.ts.UUID" | translate}}',
                    width: '20%'
                }
            ];

            this.options.dataSource.transport.read = (options)=> {
                var qobj = new ApiHeader.QueryObject();
                qobj.limit = options.data.take;
                qobj.start = options.data.pageSize * (options.data.page - 1);
                diskOfferingMgr.query(qobj, (diskOfferings:DiskOffering[], total:number)=> {
                    options.success({
                        data: diskOfferings,
                        total: total
                    });
                });
            };
        }
    }

    class Action {
        enable() {
            this.diskOfferingMgr.enable(this.$scope.model.current);
        }

        disable() {
            this.diskOfferingMgr.disable(this.$scope.model.current);
        }

        constructor(private $scope : any, private diskOfferingMgr : DiskOfferingManager) {
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

        constructor(private $scope : any) {
            this.fieldList = {
                dataSource: new kendo.data.DataSource({
                    data: [
                        {
                            name: '{{"diskOffering.ts.None" | translate}}',
                            value: FilterBy.NONE
                        },
                        {
                            name: '{{"diskOffering.ts.State" | translate}}',
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
            this.$scope.oDiskOfferingGrid.setFilter(this.toKendoFilter());
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
        static $inject = ['$scope', 'DiskOfferingManager', '$routeParams', 'Tag', 'current'];

        private loadSelf(uuid : string) {
            var qobj = new ApiHeader.QueryObject();
            qobj.addCondition({name: 'uuid', op: '=', value: uuid});
            this.diskOfferingMgr.query(qobj, (diskOfferings : DiskOffering[], total:number)=> {
                this.$scope.model.current = diskOfferings[0];
            });
        }

        constructor(private $scope : any, private diskOfferingMgr : DiskOfferingManager, private $routeParams : any,
                    private tagService : Utils.Tag, current: DiskOffering) {
            $scope.model = new DiskOfferingModel();
            $scope.model.current = current;

            $scope.funcDelete = (win : any) => {
                win.open();
            };

            $scope.action = new Action($scope, diskOfferingMgr);

            $scope.funcRefresh = ()=> {
                this.loadSelf($scope.model.current.uuid);
            };

            $scope.funcToolbarShow = ()=> {
                return Utils.notNullnotUndefined($scope.model.current);
            };

            $scope.optionsDeleteDiskOffering = {
                title: 'DELETE DISK OFFERING',
                description: ()=>{
                    return current.name;
                },
                btnType: 'btn-danger',
                width: '350px',

                confirm: ()=> {
                    diskOfferingMgr.delete($scope.model.current, (ret : any)=> {
                        $scope.model.resetCurrent();
                    });
                }
            };

            $scope.optionsTag = {
                tags: [],
                createTag: (item)=> {
                    this.tagService.createTag(item.tag, $scope.model.current.uuid, ApiHeader.TagResourceTypeDiskOfferingVO, (ret : ApiHeader.TagInventory)=> {
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
        static $inject = ['$scope', 'DiskOfferingManager', '$location'];

        constructor(private $scope : any, private diskOfferingMgr : DiskOfferingManager, private $location : ng.ILocationService) {
            $scope.model = new DiskOfferingModel();
            $scope.oDiskOfferingGrid = new ODiskOfferingGrid($scope, diskOfferingMgr);
            $scope.action = new Action($scope, diskOfferingMgr);
            $scope.optionsSortBy = {
                fields: [
                    {
                        name: '{{"diskOffering.ts.Name" | translate}}',
                        value: 'name'
                    },
                    {
                        name: '{{"diskOffering.ts.Description" | translate}}',
                        value: 'description'
                    },
                    {
                        name: '{{"diskOffering.ts.Disk Size" | translate}}',
                        value: 'diskSize'
                    },
                    {
                        name: '{{"diskOffering.ts.State" | translate}}',
                        value: 'state'
                    },
                    {
                        name: '{{"diskOffering.ts.Created Date" | translate}}',
                        value: 'createDate'
                    },
                    {
                        name: '{{"diskOffering.ts.Last Updated Date" | translate}}',
                        value: 'lastOpDate'
                    }
                ],

                done: (ret : Directive.SortByData) => {
                    diskOfferingMgr.setSortBy(ret);
                    $scope.oDiskOfferingGrid.refresh();
                }
            };

            $scope.optionsSearch = {
                fields: ApiHeader.DiskOfferingInventoryQueryable,
                name: 'DiskOffering',
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
                    diskOfferingMgr.query(qobj, (DiskOfferings : DiskOffering[], total:number)=> {
                        $scope.oDiskOfferingGrid.refresh(DiskOfferings);
                    });
                }
            };

            $scope.funcGridDoubleClick = (e) => {
                if (Utils.notNullnotUndefined($scope.model.current)) {
                    var url = Utils.sprintf('/diskOffering/{0}', $scope.model.current.uuid);
                    $location.path(url);
                    e.preventDefault();
                }
            };

            $scope.filterBy = new FilterBy($scope);

            $scope.funcSearch = (win : any) => {
                win.open();
            };

            $scope.funcCreateDiskOffering = (win : any) => {
                win.open();
            };

            $scope.funcDeleteDiskOffering = () => {
                $scope.deleteDiskOffering.open();
            };

            $scope.optionsDeleteDiskOffering = {
                title: 'DELETE DISK OFFERING',
                description: ()=>{
                    return $scope.model.current.name;
                },
                btnType: 'btn-danger',
                width: '350px',


                confirm: ()=> {
                    diskOfferingMgr.delete($scope.model.current, (ret : any)=> {
                        $scope.oDiskOfferingGrid.deleteCurrent();
                    });
                }
            };

            $scope.funcRefresh = ()=> {
                $scope.oDiskOfferingGrid.refresh();
            };

            $scope.funcIsActionShow = ()=> {
                return !Utils.isEmptyObject($scope.model.current);
            };

            $scope.funcIsActionDisabled = ()=> {
                return Utils.notNullnotUndefined($scope.model.current) && $scope.model.current.isInProgress();
            };

            $scope.optionsCreateDiskOffering = {
                done: (diskOffering : DiskOffering) => {
                    $scope.oDiskOfferingGrid.add(diskOffering);
                }
            };
        }
    }

    export class CreateDiskOfferingOptions {
        zone : MZone.Zone;
        done : (DiskOffering : DiskOffering)=>void;
    }


    export class CreateDiskOfferingModel {
        name: string;
        description: string;
        diskSize: number;
        allocatorStrategy: string;

        canCreate() : boolean {
            return Utils.notNullnotUndefined(this.name) && Utils.notNullnotUndefined(this.diskSize);
        }
    }

    export class CreateDiskOffering implements ng.IDirective {
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
        options: CreateDiskOfferingOptions;
        $scope: any;

        open() {
            var win = this.$scope.winCreateDiskOffering__;
            this.$scope.button.reset();
            this.api.getDiskOfferingAllocatorStrategies((ret: string[])=> {
                ret.unshift("");
                this.$scope.allocatorStrategyOptions__.dataSource.data(ret);
                win.center();
                win.open();
            });

        }

        constructor(private api : Utils.Api, private diskOfferingMgr : DiskOfferingManager) {
            this.scope = true;
            this.link = ($scope : any, $element, $attrs : any, $ctrl, $transclude) => {
                var instanceName = $attrs.zCreateDiskOffering;
                var parentScope = $scope.$parent;
                parentScope[instanceName] = this;
                this.options = new CreateDiskOfferingOptions();
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
                    diskSize: null,
                    allocatorStrategy: null,

                    canMoveToPrevious(): boolean {
                        return false;
                    },

                    canMoveToNext(): boolean {
                        return Utils.notNullnotUndefined(this.name) && Utils.notNullnotUndefined(this.diskSize);
                    },

                    show(): void {
                        this.getAnchorElement().tab('show');
                    },

                    getAnchorElement() : any {
                        return $('.nav a[data-target="#createDiskOfferingInfo"]');
                    },

                    active(): void {
                        this.activeState = true;
                    },

                    isActive(): boolean {
                        return this.activeState;
                    },

                    getPageName(): string {
                        return 'createDiskOfferingInfo';
                    },

                    reset() : void {
                        this.name = Utils.shortHashName('diskOffering');
                        this.diskSize = null;
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
                        var resultDiskOffering : DiskOffering;
                        var chain = new Utils.Chain();
                        chain.then(()=> {
                            if (Utils.notNullnotUndefined($scope.infoPage.allocatorStrategy) && $scope.infoPage.allocatorStrategy == "") {
                                $scope.infoPage.allocatorStrategy = null;
                            }

                            $scope.infoPage.diskSize = Utils.parseSize($scope.infoPage.diskSize);
                            diskOfferingMgr.create(infoPage, (ret : DiskOffering)=> {
                                resultDiskOffering = ret;
                                chain.next();
                            });
                        }).done(()=> {
                            if (Utils.notNullnotUndefined(this.options.done)) {
                                this.options.done(resultDiskOffering);
                            }
                        }).start();

                        $scope.winCreateDiskOffering__.close();
                    }
                };

                $scope.button = new Utils.WizardButton([
                    infoPage
                ], mediator);

                $scope.winCreateDiskOfferingOptions__ = {
                    width: '700px',
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
            this.templateUrl = '/static/templates/diskOffering/addDiskOffering.html';
        }
    }
}

angular.module('root').factory('DiskOfferingManager', ['Api', '$rootScope', (api, $rootScope)=> {
    return new MDiskOffering.DiskOfferingManager(api, $rootScope);
}]).directive('zCreateDiskOffering', ['Api', 'DiskOfferingManager', (api, diskOfferingMgr)=> {
    return new MDiskOffering.CreateDiskOffering(api, diskOfferingMgr);
}]).config(['$routeProvider', function(route) {
    route.when('/diskOffering', {
        templateUrl: '/static/templates/diskOffering/diskOffering.html',
        controller: 'MDiskOffering.Controller'
    }).when('/diskOffering/:uuid', {
        templateUrl: '/static/templates/diskOffering/details.html',
        controller: 'MDiskOffering.DetailsController',
        resolve: {
            current: function($q : ng.IQService, $route: any, DiskOfferingManager: MDiskOffering.DiskOfferingManager) {
                var defer = $q.defer();
                var qobj = new ApiHeader.QueryObject();
                var uuid = $route.current.params.uuid;
                qobj.addCondition({name: 'uuid', op: '=', value: uuid});
                DiskOfferingManager.query(qobj, (diskOfferings: MDiskOffering.DiskOffering[])=>{
                    var diskOffering = diskOfferings[0];
                    defer.resolve(diskOffering);
                });
                return defer.promise;
            }
        }
    });
}]);

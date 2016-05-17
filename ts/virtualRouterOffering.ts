
/// <reference path="d.ts/angularjs/angular.d.ts" />
/// <reference path="d.ts/kendo.all.d.ts" />

module MVirtualRouterOffering {
    export class VirtualRouterOffering extends ApiHeader.VirtualRouterOfferingInventory {
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

        isDefaultLabel() : string{
            if (this.isDefault) {
                return 'label label-primary';
            }
            return null;
        }

        updateObservableObject(inv : any) {
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
            self.set('publicNetworkUuid', inv.publicNetworkUuid);
            self.set('managementL3NetworkUuid', inv.managementNetworkUuid);
            self.set('zoneUuid', inv.zoneUuid);
            self.set('isDefault', inv.isDefault);
            self.set('imageUuid', inv.imageUuid);
        }
    }

    export class VirtualRouterOfferingManager {
        static $inject = ['Api', '$rootScope'];

        constructor(private api : Utils.Api, private $rootScope: ng.IRootScopeService) {
        }

        private sortBy : Directive.SortByData;

        setSortBy(sortBy : Directive.SortByData) {
            this.sortBy = sortBy;
        }

        private wrap(VirtualRouterOffering : VirtualRouterOffering) : any {
            return new kendo.data.ObservableObject(VirtualRouterOffering);
        }

        create(virtualRouterOffering : any, done : (ret : VirtualRouterOffering)=>void) {
            var msg : any = new ApiHeader.APICreateVirtualRouterOfferingMsg();
            msg.name = virtualRouterOffering.name;
            msg.description = virtualRouterOffering.description;
            msg.cpuNum = virtualRouterOffering.cpuNum;
            msg.cpuSpeed = 1;
            msg.memorySize = virtualRouterOffering.memorySize;
            msg.allocatorStrategy = virtualRouterOffering.allocatorStrategy;
            msg.managementNetworkUuid = virtualRouterOffering.managementNetworkUuid;
            msg.publicNetworkUuid = virtualRouterOffering.publicNetworkUuid;
            msg.zoneUuid = virtualRouterOffering.zoneUuid;
            msg.isDefault = virtualRouterOffering.isDefault;
            msg.imageUuid = virtualRouterOffering.imageUuid;
            this.api.asyncApi(msg, (ret : ApiHeader.APICreateInstanceOfferingEvent)=> {
                var c = new VirtualRouterOffering();
                angular.extend(c, ret.inventory);
                done(this.wrap(c));
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Added new virtual router offering: {0}',c.name),
                    link: Utils.sprintf('/#/virtualRouterOffering/{0}', c.uuid)
                });
            });
        }

        query(qobj : ApiHeader.QueryObject, callback : (virtualRouterOfferings : VirtualRouterOffering[], total: number) => void) : void {
            var msg = new ApiHeader.APIQueryVirtualRouterOfferingMsg();
            msg.count = qobj.count === true;
            msg.start = qobj.start;
            msg.limit = qobj.limit;
            msg.replyWithCount = true;
            msg.conditions = qobj.conditions ? qobj.conditions : [];
            msg.conditions.push({
                name: "type",
                op: "=",
                value: "VirtualRouterOffering"
            });
            if (Utils.notNullnotUndefined(this.sortBy) && this.sortBy.isValid()) {
                msg.sortBy = this.sortBy.field;
                msg.sortDirection = this.sortBy.direction;
            }
            this.api.syncApi(msg, (ret : ApiHeader.APIQueryVirtualRouterOfferingReply)=>{
                var pris = [];
                ret.inventories.forEach((inv : ApiHeader.VirtualRouterOfferingInventory)=> {
                    var c = new VirtualRouterOffering();
                    angular.extend(c, inv);
                    pris.push(this.wrap(c));
                });
                callback(pris, ret.total);
            });
        }

        disable(virtualRouterOffering : VirtualRouterOffering) {
            virtualRouterOffering.progressOn();
            var msg = new ApiHeader.APIChangeInstanceOfferingStateMsg();
            msg.stateEvent = 'disable';
            msg.uuid = virtualRouterOffering.uuid;
            this.api.asyncApi(msg, (ret : ApiHeader.APIChangeInstanceOfferingStateEvent) => {
                virtualRouterOffering.updateObservableObject(ret.inventory);
                virtualRouterOffering.progressOff();
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Disabled Instance Offering: {0}',virtualRouterOffering.name),
                    link: Utils.sprintf('/#/virtualRouterOffering/{0}', virtualRouterOffering.uuid)
                });
            });
        }

        enable(virtualRouterOffering : VirtualRouterOffering) {
            virtualRouterOffering.progressOn();
            var msg = new ApiHeader.APIChangeInstanceOfferingStateMsg();
            msg.stateEvent = 'enable';
            msg.uuid = virtualRouterOffering.uuid;
            this.api.asyncApi(msg, (ret : ApiHeader.APIChangeInstanceOfferingStateEvent) => {
                virtualRouterOffering.updateObservableObject(ret.inventory);
                virtualRouterOffering.progressOff();
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Enabled virtual router offering: {0}', virtualRouterOffering.name),
                    link: Utils.sprintf('/#/virtualRouterOffering/{0}', virtualRouterOffering.uuid)
                });
            });
        }

        delete(virtualRouterOffering : VirtualRouterOffering, done : (ret : any)=>void) {
            virtualRouterOffering.progressOn();
            var msg = new ApiHeader.APIDeleteInstanceOfferingMsg();
            msg.uuid = virtualRouterOffering.uuid;
            this.api.asyncApi(msg, (ret : any)=> {
                virtualRouterOffering.progressOff();
                done(ret);
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Deleted virtual router offering: {0}', virtualRouterOffering.name)
                });
            });
        }
    }

    export class VirtualRouterOfferingModel extends Utils.Model {
        constructor() {
            super();
            this.current = new VirtualRouterOffering();
        }
    }

    class OVirtualRouterOfferingGrid extends Utils.OGrid {
        constructor($scope: any, private virtualRouterOfferingMgr : VirtualRouterOfferingManager) {
            super();
            super.init($scope, $scope.virtualRouterOfferingGrid);
            this.options.columns = [
                {
                    field: 'name',
                    title: '{{"virtualRouterOffering.ts.NAME" | translate}}',
                    width: '10%',
                    template: '<a href="/\\#/virtualRouterOffering/{{dataItem.uuid}}">{{dataItem.name}}</a>'
                },
                {
                    field: 'description',
                    title: '{{"virtualRouterOffering.ts.DESCRIPTION" | translate}}',
                    width: '15%'
                },
                {
                    field: 'cpuNum',
                    title: '{{"virtualRouterOffering.ts.CPU NUMBER" | translate}}',
                    width: '10%'
                },
                {
                    field: 'memorySize',
                    title: '{{"virtualRouterOffering.ts.MEMORY" | translate}}',
                    width: '15%',
                    template: '<span>{{dataItem.memorySize | size}}</span>'
                },
                {
                    field: 'state',
                    title: '{{"virtualRouterOffering.ts.STATE" | translate}}',
                    width: '10%',
                    template: '<span class="{{dataItem.stateLabel()}}">{{dataItem.state}}</span>'
                },
                {
                    field: 'isDefault',
                    title: '{{"virtualRouterOffering.ts.DEFAULT OFFERING" | translate}}',
                    width: '10%',
                    template: '<span class="{{dataItem.isDefaultLabel()}}">{{dataItem.isDefault ? "TRUE" : "" }}</span>'
                },
                {
                    field: 'uuid',
                    title: '{{"virtualRouterOffering.ts.UUID" | translate}}',
                    width: '20%'
                }
            ];

            this.options.dataSource.transport.read = (options)=> {
                var qobj = new ApiHeader.QueryObject();
                qobj.limit = options.data.take;
                qobj.start = options.data.pageSize * (options.data.page - 1);
                virtualRouterOfferingMgr.query(qobj, (virtualRouterOfferings:VirtualRouterOffering[], total:number)=> {
                    options.success({
                        data: virtualRouterOfferings,
                        total: total
                    });
                });
            };
        }
    }

    class Action {
        enable() {
            this.virtualRouterOfferingMgr.enable(this.$scope.model.current);
        }

        disable() {
            this.virtualRouterOfferingMgr.disable(this.$scope.model.current);
        }

        constructor(private $scope : any, private virtualRouterOfferingMgr : VirtualRouterOfferingManager) {
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
                            name: '{{"virtualRouterOffering.ts.None" | translate}}',
                            value: FilterBy.NONE
                        },
                        {
                            name: '{{"virtualRouterOffering.ts.State" | translate}}',
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
            this.$scope.oVirtualRouterOfferingGrid.setFilter(this.toKendoFilter());
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
        static $inject = ['$scope', 'VirtualRouterOfferingManager', '$routeParams', 'Tag', 'current'];

        private loadSelf(uuid : string) {
            var qobj = new ApiHeader.QueryObject();
            qobj.addCondition({name: 'uuid', op: '=', value: uuid});
            this.virtualRouterOfferingMgr.query(qobj, (virtualRouterOfferings : VirtualRouterOffering[], total:number)=> {
                this.$scope.model.current = virtualRouterOfferings[0];
            });
        }

        constructor(private $scope : any, private virtualRouterOfferingMgr : VirtualRouterOfferingManager, private $routeParams : any,
                    private tagService : Utils.Tag, current: any) {
            $scope.model = new VirtualRouterOfferingModel();
            $scope.model.current = current.offering;
            $scope.mgmtL3 = current.mgmtL3;
            $scope.pubL3 = current.pubL3;

            $scope.funcDelete = (win : any) => {
                win.open();
            };

            $scope.action = new Action($scope, virtualRouterOfferingMgr);

            $scope.funcRefresh = ()=> {
                this.loadSelf($scope.model.current.uuid);
            };

            $scope.funcToolbarShow = ()=> {
                return Utils.notNullnotUndefined($scope.model.current);
            };

            $scope.optionsDeleteVirtualRouterOffering = {
                title: 'DELETE VIRTUAL ROUTER OFFERING',
                btnType: 'btn-danger',
                description: ()=>{
                    return $scope.model.current.name;
                },
                width: '400px',
                confirm: ()=> {
                    virtualRouterOfferingMgr.delete($scope.model.current, (ret : any)=> {
                        $scope.model.resetCurrent();
                    });
                }
            };

            $scope.optionsTag = {
                tags: [],
                createTag: (item)=> {
                    this.tagService.createTag(item.tag, $scope.model.current.uuid, ApiHeader.TagResourceTypeVirtualRouterOfferingVO, (ret : ApiHeader.TagInventory)=> {
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
        static $inject = ['$scope', 'VirtualRouterOfferingManager', 'hypervisorTypes', '$location'];

        constructor(private $scope : any, private virtualRouterOfferingMgr : VirtualRouterOfferingManager, private hypervisorTypes: string[], private $location : ng.ILocationService) {
            $scope.model = new VirtualRouterOfferingModel();
            $scope.oVirtualRouterOfferingGrid = new OVirtualRouterOfferingGrid($scope, virtualRouterOfferingMgr);
            $scope.action = new Action($scope, virtualRouterOfferingMgr);
            $scope.optionsSortBy = {
                fields: [
                    {
                        name: '{{"virtualRouterOffering.ts.Name" | translate}}',
                        value: 'name'
                    },
                    {
                        name: '{{"virtualRouterOffering.ts.Description" | translate}}',
                        value: 'description'
                    },
                    {
                        name: '{{"virtualRouterOffering.ts.CPU Number" | translate}}',
                        value: 'cpuNum'
                    },
                    {
                        name: '{{"virtualRouterOffering.ts.Memory" | translate}}',
                        value: 'memorySize'
                    },
                    {
                        name: '{{"virtualRouterOffering.ts.State" | translate}}',
                        value: 'state'
                    },
                    {
                        name: '{{"virtualRouterOffering.ts.Created Date" | translate}}',
                        value: 'createDate'
                    },
                    {
                        name: '{{"virtualRouterOffering.ts.Last Updated Date" | translate}}',
                        value: 'lastOpDate'
                    }
                ],

                done: (ret : Directive.SortByData) => {
                    virtualRouterOfferingMgr.setSortBy(ret);
                    $scope.oVirtualRouterOfferingGrid.refresh();
                }
            };

            $scope.optionsSearch = {
                fields: ApiHeader.VirtualRouterOfferingInventoryQueryable,
                name: 'VirtualRouterOffering',
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
                    virtualRouterOfferingMgr.query(qobj, (VirtualRouterOfferings : VirtualRouterOffering[], total:number)=> {
                        $scope.oVirtualRouterOfferingGrid.refresh(VirtualRouterOfferings);
                    });
                }
            };

            $scope.funcGridDoubleClick = (e) => {
                if (Utils.notNullnotUndefined($scope.model.current)) {
                    var url = Utils.sprintf('/virtualRouterOffering/{0}', $scope.model.current.uuid);
                    $location.path(url);
                    e.preventDefault();
                }
            };

            $scope.filterBy = new FilterBy($scope, this.hypervisorTypes);

            $scope.funcSearch = (win : any) => {
                win.open();
            };

            $scope.funcCreateVirtualRouterOffering = (win : any) => {
                win.open();
            };

            $scope.funcDeleteVirtualRouterOffering = () => {
                $scope.deleteVirtualRouterOffering.open();
            };

            $scope.optionsDeleteVirtualRouterOffering = {
                title: 'DELETE VIRTUAL ROUTER OFFERING',
                btnType: 'btn-danger',
                description: ()=>{
                    return $scope.model.current.name;
                },
                width: '400px',

                confirm: ()=> {
                    virtualRouterOfferingMgr.delete($scope.model.current, (ret : any)=> {
                        $scope.oVirtualRouterOfferingGrid.deleteCurrent();
                    });
                }
            };

            $scope.funcRefresh = ()=> {
                $scope.oVirtualRouterOfferingGrid.refresh();
            };

            $scope.funcIsActionShow = ()=> {
                return !Utils.isEmptyObject($scope.model.current);
            };

            $scope.funcIsActionDisabled = ()=> {
                return Utils.notNullnotUndefined($scope.model.current) && $scope.model.current.isInProgress();
            };

            $scope.optionsCreateVirtualRouterOffering = {
                done: (virtualRouterOffering : VirtualRouterOffering) => {
                    $scope.oVirtualRouterOfferingGrid.refresh();
                }
            };
        }
    }

    export class CreateVirtualRouterOfferingOptions {
        zone : MZone.Zone;
        done : (VirtualRouterOffering : VirtualRouterOffering)=>void;
    }

    export class CreateVirtualRouterOffering implements ng.IDirective {
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
        options: CreateVirtualRouterOfferingOptions;
        $scope: any;

        open() {
            var win = this.$scope.winCreateVirtualRouterOffering__;
            this.$scope.button.reset();
            var chain = new Utils.Chain();
            chain.then(()=>{
                this.api.getInstanceOfferingAllocatorStrategies((ret: string[])=> {
                    ret.unshift("");
                    this.$scope.allocatorStrategyOptions__.dataSource.data(ret);
                    chain.next();
                });
            }).then(()=>{
                var qobj = new ApiHeader.QueryObject();
                qobj.conditions = [];
                this.zoneMgr.query(qobj, (zones: ApiHeader.ZoneInventory[])=>{
                    this.$scope.zoneOptions__.dataSource.data(zones);
                    if (zones.length > 0) {
                        this.$scope.infoPage.zoneUuid = zones[0].uuid;
                    }
                    chain.next();
                });
            }).done(()=>{
                win.center();
                win.open();
            }).start();
        }

        constructor(private api : Utils.Api, private virtualRouterOfferingMgr : VirtualRouterOfferingManager,
                    private l3Mgr: ML3Network.L3NetworkManager, private imgMgr: MImage.ImageManager, private zoneMgr: MZone.ZoneManager,
                    private bsMgr: MBackupStorage.BackupStorageManager) {
            this.scope = true;
            this.link = ($scope : any, $element, $attrs : any, $ctrl, $transclude) => {
                var instanceName = $attrs.zCreateVirtualRouterOffering;
                var parentScope = $scope.$parent;
                parentScope[instanceName] = this;
                this.options = new CreateVirtualRouterOfferingOptions();
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
                    zoneUuid: null,
                    managementNetworkUuid: null,
                    publicNetworkUuid: null,
                    imageUuid: null,
                    system: null,

                    hasZone() : boolean {
                        return $scope.zoneOptions__.dataSource.data().length > 0;
                    },

                    hasL3Network() : boolean {
                        return $scope.mgmtL3Options__.dataSource.data().length > 0;
                    },

                    hasImage() : boolean {
                        return $scope.imageOptions__.dataSource.data().length > 0;
                    },

                    isCpuNumValid() : boolean {
                        if (Utils.notNullnotUndefined(this.cpuNum)) {
                            return !isNaN(this.cpuNum);
                        }
                        return true;
                    },

                    isMemoryValid() : boolean {
                        if (Utils.notNullnotUndefined(this.memorySize)) {
                            return Utils.isValidSizeStr(this.memorySize);
                        }
                        return true;
                    },

                    canMoveToPrevious(): boolean {
                        return false;
                    },

                    canMoveToNext(): boolean {
                        return Utils.notNullnotUndefined(this.name) && Utils.notNullnotUndefined(this.memorySize) && Utils.notNullnotUndefined(this.cpuNum)
                            && Utils.notNullnotUndefined(this.zoneUuid) && Utils.notNullnotUndefined(this.managementNetworkUuid)
                            && Utils.notNullnotUndefined(this.publicNetworkUuid) && Utils.notNullnotUndefined(this.imageUuid)
                            && this.isCpuNumValid() && this.isMemoryValid();
                    },

                    show(): void {
                        this.getAnchorElement().tab('show');
                    },

                    getAnchorElement() : any {
                        return $('.nav a[data-target="#createVirtualRouterOfferingInfo"]');
                    },

                    active(): void {
                        this.activeState = true;
                    },

                    isActive(): boolean {
                        return this.activeState;
                    },

                    getPageName(): string {
                        return 'createVirtualRouterOfferingInfo';
                    },

                    reset() : void {
                        this.name = Utils.shortHashName('vrOffering');
                        this.memorySize = null;
                        this.cpuNum = null;
                        this.allocatorStrategy = null;
                        this.description = null;
                        this.managementNetworkUuid = null;
                        this.publicNetworkUuid = null;
                        this.system = false;
                        this.imageUuid = null;
                        this.zoneUuid = null;
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
                        if (Utils.notNullnotUndefined($scope.infoPage.allocatorStrategy) && $scope.infoPage.allocatorStrategy == "") {
                            $scope.infoPage.allocatorStrategy = null;
                        }

                        $scope.infoPage.memorySize = Utils.parseSize($scope.infoPage.memorySize);
                        virtualRouterOfferingMgr.create(infoPage, (ret : VirtualRouterOffering)=> {
                            if (Utils.notNullnotUndefined(this.options.done)) {
                                this.options.done(ret);
                            }
                        });
                        $scope.winCreateVirtualRouterOffering__.close();
                    }
                };

                $scope.button = new Utils.WizardButton([
                    infoPage
                ], mediator);

                $scope.winCreateVirtualRouterOfferingOptions__ = {
                    width: '700px',
                    animation: false,
                    modal: true,
                    draggable: false,
                    resizable: false
                };

                $scope.allocatorStrategyOptions__ = {
                    dataSource: new kendo.data.DataSource({data: []})
                };

                $scope.mgmtL3Options__ = {
                    dataSource: new kendo.data.DataSource({data: []}),
                    dataTextField: "name",
                    dataValueField: "uuid",
                    template: '<div style="color: black"><span class="z-label">{{"virtualRouterOffering.ts.Name" | translate}}:</span><span>#: name #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"virtualRouterOffering.ts.UUID" | translate}}:</span><span>#: uuid #</span></div>'
                };

                $scope.pubL3Options__ = {
                    dataSource: new kendo.data.DataSource({data: []}),
                    dataTextField: "name",
                    dataValueField: "uuid",
                    template: '<div style="color: black"><span class="z-label">{{"virtualRouterOffering.ts.Name" | translate}}:</span><span>#: name #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"virtualRouterOffering.ts.UUID" | translate}}:</span><span>#: uuid #</span></div>'
                };

                $scope.imageOptions__ = {
                    dataSource: new kendo.data.DataSource({data: []}),
                    dataTextField: "name",
                    dataValueField: "uuid",
                    template: '<div style="color: black"><span class="z-label">{{"virtualRouterOffering.ts.Name" | translate}}:</span><span>#: name #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"virtualRouterOffering.ts.Format" | translate}}:</span><span>#: format #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"virtualRouterOffering.ts.UUID" | translate}}:</span><span>#: uuid #</span></div>'
                };

                $scope.zoneOptions__ = {
                    dataSource: new kendo.data.DataSource({data: []}),
                    dataTextField: "name",
                    dataValueField: "uuid",
                    template: '<div style="color: black"><span class="z-label">{{"virtualRouterOffering.ts.Name" | translate}}</span>: #: name #</div>'+'<div style="color: black"><span class="z-label">{{"virtualRouterOffering.ts.state" | translate}}:</span>#: state #</div>'+'<div style="color: black"><span class="z-label">{{"virtualRouterOffering.ts.UUID" | translate}}:</span> #: uuid #</div>'
                };

                $scope.$watch(()=>{
                    return $scope.infoPage.zoneUuid;
                }, ()=> {
                    var zoneUuid = $scope.infoPage.zoneUuid;
                    if (!Utils.notNullnotUndefined(zoneUuid)) {
                        return;
                    }

                    var qobj = new ApiHeader.QueryObject();
                    qobj.conditions = [
                        {
                            name: 'zoneUuid',
                            op: '=',
                            value: zoneUuid
                        }
                    ];
                    l3Mgr.query(qobj, (l3s:ML3Network.L3Network[])=> {
                        $scope.mgmtL3Options__.dataSource.data(l3s);
                        $scope.pubL3Options__.dataSource.data(l3s);
                        if (l3s.length > 0) {
                            $scope.infoPage.publicNetworkUuid = l3s[0].uuid;
                            $scope.infoPage.managementNetworkUuid = l3s[0].uuid;
                        }
                    });

                    var chain = new Utils.Chain();
                    var bsUuids = [];
                    chain.then(()=> {
                        qobj = new ApiHeader.QueryObject();
                        qobj.conditions = [
                            {
                                name: 'attachedZoneUuids',
                                op: 'in',
                                value: zoneUuid
                            }
                        ];
                        bsMgr.query(qobj, (bss:ApiHeader.BackupStorageInventory[])=> {
                            angular.forEach(bss, (it)=> {
                                bsUuids.push(it.uuid);
                            });
                            chain.next();
                        });
                    }).then(()=> {
                        if (bsUuids.length == 0) {
                            chain.next();
                            return;
                        }

                        qobj = new ApiHeader.QueryObject();
                        qobj.conditions = [
                            {
                                name: 'backupStorageRefs.backupStorageUuid',
                                op: 'in',
                                value: bsUuids.join()
                            },
                            {
                                name: 'status',
                                op: '=',
                                value: 'Ready'
                            }
                        ];

                        imgMgr.query(qobj, (imgs: MImage.Image[])=>{
                            $scope.imageOptions__.dataSource.data(imgs);
                            if (imgs.length > 0) {
                                $scope.infoPage.imageUuid = imgs[0].uuid;
                            }
                            chain.next();
                        });
                    }).start();
                });

                this.$scope = $scope;
            };
            this.restrict = 'EA';
            this.replace = true;
            this.templateUrl = '/static/templates/virtualRouterOffering/addVirtualRouterOffering.html';
        }
    }
}

angular.module('root').factory('VirtualRouterOfferingManager', ['Api', '$rootScope', (api, $rootScope)=> {
    return new MVirtualRouterOffering.VirtualRouterOfferingManager(api, $rootScope);
}]).directive('zCreateVirtualRouterOffering', ['Api', 'VirtualRouterOfferingManager', 'L3NetworkManager', 'ImageManager', 'ZoneManager', 'BackupStorageManager',
    (api, virtualRouterOfferingMgr, l3Mgr, imgMgr, zoneMgr, bsMgr)=> {
    return new MVirtualRouterOffering.CreateVirtualRouterOffering(api, virtualRouterOfferingMgr, l3Mgr, imgMgr, zoneMgr, bsMgr);
}]).config(['$routeProvider', function(route) {
    route.when('/virtualRouterOffering', {
        templateUrl: '/static/templates/virtualRouterOffering/virtualRouterOffering.html',
        controller: 'MVirtualRouterOffering.Controller',
        resolve: {
            hypervisorTypes: function($q : ng.IQService, Api : Utils.Api) {
                var defer = $q.defer();
                Api.getHypervisorTypes((hypervisorTypes: string[])=> {
                    defer.resolve(hypervisorTypes);
                });
                return defer.promise;
            }
        }
    }).when('/virtualRouterOffering/:uuid', {
        templateUrl: '/static/templates/virtualRouterOffering/details.html',
        controller: 'MVirtualRouterOffering.DetailsController',
        resolve: {
            current: function($q : ng.IQService, $route: any, VirtualRouterOfferingManager: MVirtualRouterOffering.VirtualRouterOfferingManager, L3NetworkManager: ML3Network.L3NetworkManager) {
                var defer = $q.defer();
                var chain = new Utils.Chain();
                var ret = {
                    offering: null,
                    mgmtL3: null,
                    pubL3: null
                };
                chain.then(()=>{
                    var qobj = new ApiHeader.QueryObject();
                    var uuid = $route.current.params.uuid;
                    qobj.addCondition({name: 'uuid', op: '=', value: uuid});
                    VirtualRouterOfferingManager.query(qobj, (virtualRouterOfferings: MVirtualRouterOffering.VirtualRouterOffering[])=>{
                        ret.offering = virtualRouterOfferings[0];
                        chain.next();
                    });
                }).then(()=>{
                    var qobj = new ApiHeader.QueryObject();
                    qobj.conditions = [{
                        name: "uuid",
                        op: "=",
                        value: ret.offering.managementNetworkUuid
                    }];
                    L3NetworkManager.query(qobj, (l3s: ML3Network.L3Network[])=>{
                        ret.mgmtL3 = l3s[0];
                        chain.next();
                    });
                }).then(()=>{
                    var qobj = new ApiHeader.QueryObject();
                    qobj.conditions = [{
                        name: "uuid",
                        op: "=",
                        value: ret.offering.publicNetworkUuid
                    }];
                    L3NetworkManager.query(qobj, (l3s: ML3Network.L3Network[])=>{
                        ret.pubL3 = l3s[0];
                        chain.next();
                    });
                }).done(()=>{
                    defer.resolve(ret);
                }).start();

                return defer.promise;
            }
        }
    });
}]);


/// <reference path="d.ts/angularjs/angular.d.ts" />
/// <reference path="d.ts/kendo.all.d.ts" />

module MHost {
    export class Host extends ApiHeader.HostInventory {
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
            return this.state == 'Disabled' || this.state == 'Maintenance' || this.state == 'PreMaintenance';
        }

        isDisableShow() : boolean {
            return this.state == 'Enabled' || this.state == 'Maintenance' || this.state == 'PreMaintenance';
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

        statusLabel() : string {
            if (this.status == 'Connected') {
                return 'label label-success';
            } else if (this.status == 'Disconnected') {
                return 'label label-danger';
            } else {
                return 'label label-default';
            }
        }

        updateObservableObject(inv : ApiHeader.HostInventory) {
            // self : ObservableObject
            var self : any = this;
            self.set('uuid', inv.uuid);
            self.set('name', inv.name);
            self.set('description', inv.description);
            self.set('zoneUuid', inv.zoneUuid);
            self.set('hypervisorType', inv.hypervisorType);
            self.set('managementIp', inv.managementIp);
            self.set('state', inv.state);
            self.set('clusterUuid', inv.clusterUuid);
            self.set('zoneUuid', inv.zoneUuid);
            self.set('status', inv.status);
            self.set('createDate', inv.createDate);
            self.set('lastOpDate', inv.lastOpDate);
            self.set('sshPort', inv.sshPort);
        }
    }

    export class HostManager {
        static $inject = ['Api', '$rootScope'];

        constructor(private api : Utils.Api, private $rootScope: ng.IRootScopeService) {
        }

        private sortBy : Directive.SortByData;

        setSortBy(sortBy : Directive.SortByData) {
            this.sortBy = sortBy;
        }

        private wrap(Host : Host) : any {
            return new kendo.data.ObservableObject(Host);
        }

        create(host : any, done : (ret : Host)=>void) {
            var msg : any = null;
            if (host.hypervisorType == 'KVM') {
                msg = new ApiHeader.APIAddKVMHostMsg();
                msg.username  = host.username;
                msg.password = host.password;
                msg.sshPort = host.port;
            } else if (host.hypervisorType == 'Simulator') {
                msg = new ApiHeader.APIAddSimulatorHostMsg();
            }
            msg.name = host.name;
            msg.description = host.description;
            msg.clusterUuid = host.clusterUuid;
            msg.managementIp = host.managementIp;
            this.api.asyncApi(msg, (ret : ApiHeader.APIAddHostEvent)=> {
                var c = new Host();
                angular.extend(c, ret.inventory);
                done(this.wrap(c));
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Added new Host: {0}',c.name),
                    link: Utils.sprintf('/#/host/{0}', c.uuid)
                });
            });
        }

        query(qobj : ApiHeader.QueryObject, callback : (hosts : Host[], total: number) => void) : void {
            var msg = new ApiHeader.APIQueryHostMsg();
            msg.count = qobj.count === true;
            msg.start = qobj.start;
            msg.limit = qobj.limit;
            msg.replyWithCount = true;
            msg.conditions = qobj.conditions ? qobj.conditions : [];
            if (Utils.notNullnotUndefined(this.sortBy) && this.sortBy.isValid()) {
                msg.sortBy = this.sortBy.field;
                msg.sortDirection = this.sortBy.direction;
            }
            this.api.syncApi(msg, (ret : ApiHeader.APIQueryHostReply)=>{
                var pris = [];
                ret.inventories.forEach((inv : ApiHeader.HostInventory)=> {
                    var c = new Host();
                    angular.extend(c, inv);
                    pris.push(this.wrap(c));
                });
                callback(pris, ret.total);
            });
        }

        disable(host : Host) {
            host.progressOn();
            var msg = new ApiHeader.APIChangeHostStateMsg();
            msg.stateEvent = 'disable';
            msg.uuid = host.uuid;
            this.api.asyncApi(msg, (ret : ApiHeader.APIChangeHostStateEvent) => {
                host.updateObservableObject(ret.inventory);
                host.progressOff();
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Disabled Host: {0}',host.name),
                    link: Utils.sprintf('/#/host/{0}', host.uuid)
                });
            });
        }

        enable(host : Host) {
            host.progressOn();
            var msg = new ApiHeader.APIChangeHostStateMsg();
            msg.stateEvent = 'enable';
            msg.uuid = host.uuid;
            this.api.asyncApi(msg, (ret : ApiHeader.APIChangeHostStateEvent) => {
                host.updateObservableObject(ret.inventory);
                host.progressOff();
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Enabled Host: {0}', host.name),
                    link: Utils.sprintf('/#/host/{0}', host.uuid)
                });
            });
        }

        maintain(host: Host) {
            host.progressOn();
            var msg = new ApiHeader.APIChangeHostStateMsg();
            msg.stateEvent = 'maintain';
            msg.uuid = host.uuid;
            this.api.asyncApi(msg, (ret : ApiHeader.APIChangeHostStateEvent) => {
                host.updateObservableObject(ret.inventory);
                host.progressOff();
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Put Host into maintenance mode: {0}', host.name),
                    link: Utils.sprintf('/#/host/{0}', host.uuid)
                });
            }, ()=>{
                host.progressOff();
            });
        }

        reconnect(host: Host) {
            host.progressOn();
            var msg = new ApiHeader.APIReconnectHostMsg();
            msg.uuid = host.uuid;
            host.status = 'Connecting';
            this.api.asyncApi(msg, (ret: ApiHeader.APIReconnectHostEvent)=> {
                host.updateObservableObject(ret.inventory);
                host.progressOff();
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Reconnected Host: {0}', host.name),
                    link: Utils.sprintf('/#/host/{0}', host.uuid)
                });
            });
        }

        delete(host : Host, done : (ret : any)=>void) {
            host.progressOn();
            var msg = new ApiHeader.APIDeleteHostMsg();
            msg.uuid = host.uuid;
            this.api.asyncApi(msg, (ret : any)=> {
                host.progressOff();
                done(ret);
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Deleted Host: {0}', host.name)
                });
            });
        }
    }

    export class HostModel extends Utils.Model {
        constructor() {
            super();
            this.current = new Host();
        }
    }

    class OHostGrid extends Utils.OGrid {
        constructor($scope: any, private hostMgr : HostManager) {
            super();
            super.init($scope, $scope.hostGrid);
            this.options.columns = [
                {
                    field: 'name',
                    title: '{{"host.ts.NAME" | translate}}',
                    width: '10%',
                    template: '<a href="/\\#/host/{{dataItem.uuid}}">{{dataItem.name}}</a>'
                },
                {
                    field: 'description',
                    title: '{{"host.ts.DESCRIPTION" | translate}}',
                    width: '20%'
                },
                {
                    field: 'managementIp',
                    title: '{{"host.ts.MANAGEMENT IP" | translate}}',
                    width: '15%'
                },
                {
                    field: 'hypervisorType',
                    title: '{{"host.ts.HYPERVISOR" | translate}}',
                    width: '15%'
                },
                {
                    field: 'state',
                    title: '{{"host.ts.STATE" | translate}}',
                    width: '10%',
                    template: '<span class="{{dataItem.stateLabel()}}">{{dataItem.state}}</span>'
                },
                {
                    field: 'status',
                    title: '{{"host.ts.STATUS" | translate}}',
                    width: '10%',
                    template: '<span class="{{dataItem.statusLabel()}}">{{dataItem.status}}</span>'
                },
                {
                    field: 'uuid',
                    title: '{{"host.ts.UUID" | translate}}',
                    width: '20%'
                }
            ];

            this.options.dataSource.transport.read = (options)=> {
                var qobj = new ApiHeader.QueryObject();
                qobj.limit = options.data.take;
                qobj.start = options.data.pageSize * (options.data.page - 1);
                hostMgr.query(qobj, (hosts:Host[], total:number)=> {
                    options.success({
                        data: hosts,
                        total: total
                    });
                });
            };
        }
    }

    class Action {
        enable() {
            this.hostMgr.enable(this.$scope.model.current);
        }

        disable() {
            this.hostMgr.disable(this.$scope.model.current);
        }

        reconnect() {
            this.hostMgr.reconnect(this.$scope.model.current);
        }

        maintain() {
            this.hostMgr.maintain(this.$scope.model.current);
        }

        isMaintainShow() {
            if (Utils.notNullnotUndefined(this.$scope.model.current)) {
                return this.$scope.model.current.state != 'PreMaintenance' && this.$scope.model.current.state != 'Maintenance';
            } else {
                return false;
            }
        }

        constructor(private $scope : any, private hostMgr : HostManager) {
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
        static STATUS = 'status';
        static TYPE = 'hypervisorType';

        constructor(private $scope : any, private hypervisorTypes: string[]) {
            this.fieldList = {
                dataSource: new kendo.data.DataSource({
                    data: [
                        {
                            name: '{{"host.ts.None" | translate}}',
                            value: FilterBy.NONE
                        },
                        {
                            name: '{{"host.ts.State" | translate}}',
                            value: FilterBy.STATE
                        },
                        {
                            name: '{{"host.ts.Status" | translate}}',
                            value: FilterBy.STATUS
                        },
                        {
                            name: '{{"host.ts.HypervisorType" | translate}}',
                            value: FilterBy.TYPE
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
                } else if (this.field == FilterBy.STATUS) {
                    this.valueList.dataSource.data(['Connecting', 'Connected', 'Disconnected']);
                } else if (this.field == FilterBy.STATE) {
                    this.valueList.dataSource.data(['Enabled', 'Disabled', 'PreMaintenance', 'Maintenance']);
                } else if (this.field == FilterBy.TYPE) {
                    this.valueList.dataSource.data(this.hypervisorTypes);
                }
            });
        }

        confirm (popover : any) {
            this.$scope.oHostGrid.setFilter(this.toKendoFilter());
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
        static $inject = ['$scope', 'HostManager', '$routeParams', 'Tag', 'current', 'ClusterManager', 'Api'];

        private loadSelf(uuid : string) {
            var qobj = new ApiHeader.QueryObject();
            qobj.addCondition({name: 'uuid', op: '=', value: uuid});
            this.hostMgr.query(qobj, (hosts : Host[], total:number)=> {
                this.$scope.model.current = hosts[0];
            });
        }

        constructor(private $scope : any, private hostMgr : HostManager, private $routeParams : any,
                    private tagService : Utils.Tag, current: Host, clusterMgr: MCluster.ClusterManager,
                    private api: Utils.Api) {
            $scope.model = new HostModel();
            $scope.model.current = current;

            $scope.funcDelete = (win : any) => {
                win.open();
            };

            $scope.action = new Action($scope, hostMgr);

            $scope.funcRefresh = ()=> {
                this.loadSelf($scope.model.current.uuid);
            };

            $scope.funcToolbarShow = ()=> {
                return Utils.notNullnotUndefined($scope.model.current);
            };

            $scope.optionsDeleteHost = {
                title: 'DELETE HOST',
                description: "Deleting Host will cause all VMs on this host being stopped",
                confirm: ()=> {
                    hostMgr.delete($scope.model.current, (ret : any)=> {
                        $scope.model.resetCurrent();
                    });
                }
            };

            $scope.optionsTag = {
                tags: [],
                createTag: (item)=> {
                    this.tagService.createTag(item.tag, $scope.model.current.uuid, ApiHeader.TagResourceTypeHostVO, (ret : ApiHeader.TagInventory)=> {
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

            $scope.systemTags = [];
            this.api.getSystemTags('HostVO', current.uuid, (tags: ApiHeader.SystemTagInventory[])=>{
                $scope.systemTags = tags;
            });
        }
    }

    export class Controller {
        static $inject = ['$scope', 'HostManager', 'hypervisorTypes', '$location'];

        constructor(private $scope : any, private hostMgr : HostManager, private hypervisorTypes: string[], private $location : ng.ILocationService) {
            $scope.model = new HostModel();
            $scope.oHostGrid = new OHostGrid($scope, hostMgr);
            $scope.action = new Action($scope, hostMgr);
            $scope.optionsSortBy = {
                fields: [
                    {
                        name: '{{"host.ts.Name" | translate}}',
                        value: 'name'
                    },
                    {
                        name: '{{"host.ts.Description" | translate}}',
                        value: 'description'
                    },
                    {
                        name: '{{"host.ts.State" | translate}}',
                        value: 'state'
                    },
                    {
                        name: '{{"host.ts.Status" | translate}}',
                        value: 'status'
                    },
                    {
                        name: '{{"host.ts.Hypervisor" | translate}}',
                        value: 'hypervisorType'
                    },
                    {
                        name: '{{"host.ts.Created Date" | translate}}',
                        value: 'createDate'
                    },
                    {
                        name: '{{"host.ts.Last Updated Date" | translate}}',
                        value: 'lastOpDate'
                    }
                ],

                done: (ret : Directive.SortByData) => {
                    hostMgr.setSortBy(ret);
                    $scope.oHostGrid.refresh();
                }
            };

            $scope.optionsSearch = {
                fields: ApiHeader.HostInventoryQueryable,
                name: 'Host',
                schema: {
                    state: {
                        type: Directive.SearchBoxSchema.VALUE_TYPE_LIST,
                        list: ['Enabled', 'Disabled', 'PreMaintenance', 'Maintenance']
                    },
                    status: {
                        type: Directive.SearchBoxSchema.VALUE_TYPE_LIST,
                        list: ['Connecting', 'Connected', 'Disconnected']
                    },
                    hypervisorType: {
                        type: Directive.SearchBoxSchema.VALUE_TYPE_LIST,
                        list: this.hypervisorTypes
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
                    hostMgr.query(qobj, (Hosts : Host[], total:number)=> {
                        $scope.oHostGrid.refresh(Hosts);
                    });
                }
            };

            $scope.funcGridDoubleClick = (e) => {
                if (Utils.notNullnotUndefined($scope.model.current)) {
                    var url = Utils.sprintf('/host/{0}', $scope.model.current.uuid);
                    $location.path(url);
                    e.preventDefault();
                }
            };

            $scope.filterBy = new FilterBy($scope, this.hypervisorTypes);

            $scope.funcSearch = (win : any) => {
                win.open();
            };

            $scope.funcCreateHost = (win : any) => {
                win.open();
            };

            $scope.funcDeleteHost = () => {
                $scope.deleteHost.open();
            };

            $scope.optionsDeleteHost = {
                title: 'DELETE HOST',
                description: "Deleting Host will cause all VMs on this host being stopped",

                confirm: ()=> {
                    hostMgr.delete($scope.model.current, (ret : any)=> {
                        $scope.oHostGrid.deleteCurrent();
                    });
                }
            };

            $scope.funcRefresh = ()=> {
                $scope.oHostGrid.refresh();
            };

            $scope.funcIsActionShow = ()=> {
                return !Utils.isEmptyObject($scope.model.current);
            };

            $scope.funcIsActionDisabled = ()=> {
                return Utils.notNullnotUndefined($scope.model.current) && $scope.model.current.isInProgress();
            };

            $scope.optionsCreateHost = {
                done: (infoPage : any) => {
                    infoPage.uuid = infoPage.resourceUuid = Utils.uuid();
                    infoPage.state = 'Enabled';
                    infoPage.status = 'Connecting';
                    var host = new Host();
                    angular.extend(host, infoPage);
                    $scope.oHostGrid.add(host);
                    hostMgr.create(infoPage, (ret : Host)=> {
                        $scope.oHostGrid.refresh();
                    });
                }
            };
        }
    }

    export class CreateHostOptions {
        zone : MZone.Zone;
        done : (info : any)=>void;
    }


    export class CreateHostModel {
        name: string;
        clusterUuid: string;
        description: string;
        hypervisorType: string;
        managementIp: string;
        username: string;
        password: string;
        clusterList: kendo.ui.DropDownListOptions;
        zoneList: kendo.ui.DropDownListOptions;

        canCreate() : boolean {
            if (this.hypervisorType == 'KVM') {
                return angular.isDefined(this.name) && angular.isDefined(this.description) &&
                    angular.isDefined(this.clusterUuid) && Utils.notNullnotUndefined(this.managementIp) &&
                    Utils.notNullnotUndefined(this.username) && Utils.notNullnotUndefined(this.password);
            } else {
                return angular.isDefined(this.name) && angular.isDefined(this.description) &&
                    angular.isDefined(this.clusterUuid) && Utils.notNullnotUndefined(this.managementIp);
            }
        }
    }

    export class CreateHost implements ng.IDirective {
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
        options: CreateHostOptions;
        $scope: any;

        private queryClusters(zoneUuid: string, done:(clusters: MCluster.Cluster[])=>void) {
            var qobj = new ApiHeader.QueryObject();
            qobj.conditions = [
                {
                    name: 'zoneUuid',
                    op: '=',
                    value: zoneUuid
                }
            ];

            this.clusterMgr.query(qobj, (clusters: MCluster.Cluster[])=>{
                done(clusters);
            });
        }

        open() {
            var win = this.$scope.winCreateHost__;
            var chain = new Utils.Chain();
            this.$scope.clusterListOptions__.dataSource.data([]);
            this.$scope.button.reset();
            chain.then(()=> {
                if (Utils.notNullnotUndefined(this.options.zone)) {
                    this.$scope.zoneList.dataSource.data(new kendo.data.ObservableArray([this.options.zone]));
                    this.$scope.infoPage.zoneUuid = this.options.zone.uuid;
                    chain.next();
                } else {
                    this.zoneMgr.query(new ApiHeader.QueryObject(), (zones : MZone.Zone[], total:number)=> {
                        this.$scope.zoneList.dataSource.data(zones);
                        if (zones) {
                            this.$scope.infoPage.zoneUuid = zones[0].uuid;
                        }
                        chain.next();
                    });
                }
            }).then(()=>{
                if (Utils.notNullnotUndefined(this.$scope.infoPage.zoneUuid)) {
                    this.queryClusters(this.$scope.infoPage.zoneUuid, (clusters:MCluster.Cluster[])=> {
                        this.$scope.clusterListOptions__.dataSource.data(clusters);
                        var c = clusters[0];
                        if (Utils.notNullnotUndefined(c)) {
                            this.$scope.infoPage.hypervisorType = c.hypervisorType;
                        }
                        chain.next();
                    });
                } else {
                    chain.next();
                }
            }).done(()=> {
                win.center();
                win.open();
            }).start();
        }

        constructor(private api : Utils.Api, private zoneMgr : MZone.ZoneManager,
                    private hostMgr : HostManager, private clusterMgr: MCluster.ClusterManager) {
            this.scope = true;
            this.link = ($scope : any, $element, $attrs : any, $ctrl, $transclude) => {
                var instanceName = $attrs.zCreateHost;
                var parentScope = $scope.$parent;
                parentScope[instanceName] = this;
                this.options = new CreateHostOptions();
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
                    clusterUuid: null,
                    description: null,
                    hypervisorType: null,
                    managementIp: null,
                    username: 'root',
                    password: null,

                    canMoveToPrevious(): boolean {
                        return false;
                    },

                    hasCluster(): boolean {
                        return $scope.clusterListOptions__.dataSource.data().length > 0;
                    },

                    canMoveToNext(): boolean {
                        if (this.hypervisorType == 'KVM') {
                            return Utils.notNullnotUndefined(this.name)
                                && Utils.notNullnotUndefined(this.clusterUuid) && Utils.notNullnotUndefined(this.managementIp) &&
                                Utils.notNullnotUndefined(this.username) && Utils.notNullnotUndefined(this.password);
                        } else {
                            return Utils.notNullnotUndefined(this.name)
                                && Utils.notNullnotUndefined(this.clusterUuid) && Utils.notNullnotUndefined(this.managementIp);
                        }
                    },

                    show(): void {
                        this.getAnchorElement().tab('show');
                    },

                    getAnchorElement() : any {
                        return $('.nav a[data-target="#createHostInfo"]');
                    },

                    active(): void {
                        this.activeState = true;
                    },

                    isActive(): boolean {
                        return this.activeState;
                    },

                    getPageName(): string {
                        return 'createHostInfo';
                    },

                    reset() : void {
                        this.name = Utils.shortHashName('host');
                        this.clusterUuid = null;
                        this.description = null;
                        this.hypervisorType = null;
                        this.username = 'root';
                        this.password = null;
                        this.managementIp = null;
                        this.activeState = false;
                    }
                } ;

                var mediator : Utils.WizardMediator = $scope.mediator = {
                    currentPage: infoPage,
                    movedToPage: (page: Utils.WizardPage) => {
                        $scope.mediator.currentPage = page;
                    },

                    finishButtonName: (): string =>{
                        return "Add";
                    },

                    finish: ()=> {
                        if (Utils.notNullnotUndefined(this.options.done)) {
                            this.options.done($scope.infoPage);
                        }

                        $scope.winCreateHost__.close();
                    }
                };

                $scope.button = new Utils.WizardButton([
                    infoPage
                ], mediator);

                $scope.$watch(()=>{
                    return $scope.infoPage.zoneUuid;
                }, ()=>{
                    var zuuid = $scope.infoPage.zoneUuid;
                    if (Utils.notNullnotUndefined(zuuid)) {
                        this.queryClusters(zuuid, (clusters:MCluster.Cluster[])=> {
                            $scope.clusterListOptions__.dataSource.data(clusters);
                            var c = clusters[0];
                            if (Utils.notNullnotUndefined(c)) {
                                $scope.infoPage.hypervisorType = c.hypervisorType;
                            }
                        });
                    }
                });

                $scope.zoneList = {
                    dataSource: new kendo.data.DataSource({data: []}),
                    dataTextField: "name",
                    dataValueField: "uuid",
                    template: '<div style="color: black"><span class="z-label">{{"host.ts.Name" | translate}}</span>: #: name #</div>'+'<div style="color: black"><span class="z-label">{{"host.ts.State" | translate}}</span>#: state #</div>'+'<div style="color: black"><span class="z-label">{{"host.ts.UUID" | translate}}</span> #: uuid #</div>'
                };

                $scope.winCreateHostOptions__ = {
                    width: '700px',
                    //height: '620px',
                    animation: false,
                    modal: true,
                    draggable: false,
                    resizable: false
                };

                $scope.clusterListOptions__ = {
                    dataSource: new kendo.data.DataSource({data: []}),
                    dataTextField: "name",
                    dataValueField: "uuid",
                    template: '<div style="color: black"><span class="z-label">{{"host.ts.Name" | translate}}</span><span>#: name #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"host.ts.HYPERVISOR" | translate}}</span><span>#: hypervisorType #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"host.ts.UUID" | translate}}</span><span>#: uuid #</span></div>',

                    change: (e)=>{
                        var list = e.sender;
                        var cluster = list.dataItem();
                        Utils.safeApply($scope, ()=> {
                            $scope.infoPage.hypervisorType = cluster.hypervisorType;
                        });
                    }
                };

                this.$scope = $scope;
            };
            this.restrict = 'EA';
            this.replace = true;
            this.templateUrl = '/static/templates/host/createHost.html';
        }
    }
}

angular.module('root').factory('HostManager', ['Api', '$rootScope', (api, $rootScope)=> {
    return new MHost.HostManager(api, $rootScope);
}]).directive('zCreateHost', ['Api', 'ZoneManager', 'HostManager', 'ClusterManager', (api, zoneMgr, hostMgr, clusterMgr)=> {
    return new MHost.CreateHost(api, zoneMgr, hostMgr, clusterMgr);
}]).config(['$routeProvider', function(route) {
    route.when('/host', {
        templateUrl: '/static/templates/host/host.html',
        controller: 'MHost.Controller',
        resolve: {
            hypervisorTypes: function($q : ng.IQService, Api : Utils.Api) {
                var defer = $q.defer();
                Api.getHypervisorTypes((hypervisorTypes: string[])=> {
                    defer.resolve(hypervisorTypes);
                });
                return defer.promise;
            }
        }
    }).when('/host/:uuid', {
        templateUrl: '/static/templates/host/details.html',
        controller: 'MHost.DetailsController',
        resolve: {
            current: function($q : ng.IQService, $route: any, HostManager: MHost.HostManager) {
                var defer = $q.defer();
                var qobj = new ApiHeader.QueryObject();
                var uuid = $route.current.params.uuid;
                qobj.addCondition({name: 'uuid', op: '=', value: uuid});
                HostManager.query(qobj, (hosts: MHost.Host[])=>{
                    var host = hosts[0];
                    defer.resolve(host);
                });
                return defer.promise;
            }
        }
    });
}]);

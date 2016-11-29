
/// <reference path="d.ts/angularjs/angular.d.ts" />
/// <reference path="d.ts/kendo.all.d.ts" />

module MVirtualRouter {
    export class VmNic extends ApiHeader.VmNicInventory {
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

        updateObservableObject(inv : ApiHeader.VmNicInventory) {
            // self : ObservableObject
            var self : any = this;
            self.set('uuid', inv.uuid);
            self.set('vmInstanceUuid', inv.vmInstanceUuid);
            self.set('l3NetworkUuid', inv.l3NetworkUuid);
            self.set('ip', inv.ip);
            self.set('mac', inv.mac);
            self.set('netmask', inv.netmask);
            self.set('gateway', inv.gateway);
            self.set('metaData', inv.metaData);
            self.set('deviceId', inv.deviceId);
            self.set('createDate', inv.createDate);
            self.set('lastOpDate', inv.lastOpDate);
        }
    }

    export class VirtualRouter extends ApiHeader.ApplianceVmInventory {
        static STATES = ['Running', 'Starting', 'Stopping', 'Stopped', 'Rebooting', 'Migrating', 'Unknown', 'Created'];
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

        stateLabel() : string {
            if (this.state == 'Running') {
                return 'label label-success';
            } else if (this.state == 'Stopped') {
                return 'label label-danger';
            } else if (this.state == 'Unknown') {
                return 'label label-warning';
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

        updateObservableObject(inv : any) {
            // self : ObservableObject
            var self : any = this;
            self.set('uuid', inv.uuid);
            self.set('name', inv.name);
            self.set('description', inv.description);
            self.set('zoneUuid', inv.zoneUuid);
            self.set('clusterUuid', inv.clusterUuid);
            self.set('hypervisorType', inv.hypervisorType);
            self.set('state', inv.state);
            self.set('status', inv.status);
            self.set('hostUuid', inv.hostUuid);
            self.set('lastHostUuid', inv.lastHostUuid);
            self.set('rootVolumeUuid', inv.rootVolumeUuid);
            self.set('vmNics', inv.vmNics);
            self.set('type', inv.type);
            self.set('imageUuid', inv.imageUuid);
            self.set('allVolumes', inv.allVolumes);
            self.set('createDate', inv.createDate);
            self.set('lastOpDate', inv.lastOpDate);
        }
    }

    export class VirtualRouterManager {
        static $inject = ['Api', '$rootScope'];

        constructor(private api : Utils.Api, private $rootScope: ng.IRootScopeService) {
        }

        private sortBy : Directive.SortByData;

        setSortBy(sortBy : Directive.SortByData) {
            this.sortBy = sortBy;
        }

        private wrap(obj: any) : any {
            return new kendo.data.ObservableObject(obj);
        }

        query(qobj : ApiHeader.QueryObject, callback : (vms : VirtualRouter[], total: number) => void) : void {
            var msg = new ApiHeader.APIQueryApplianceVmMsg();
            msg.count = qobj.count === true;
            msg.start = qobj.start;
            msg.limit = qobj.limit;
            msg.replyWithCount = true;
            msg.conditions = qobj.conditions ? qobj.conditions : [];
            msg.conditions.push({
                name: "type",
                op: "=",
                value: "ApplianceVm"
            });
            if (Utils.notNullnotUndefined(this.sortBy) && this.sortBy.isValid()) {
                msg.sortBy = this.sortBy.field;
                msg.sortDirection = this.sortBy.direction;
            }
            this.api.syncApi(msg, (ret : ApiHeader.APIQueryApplianceVmReply)=>{
                var pris = [];
                ret.inventories.forEach((inv : ApiHeader.ApplianceVmInventory)=> {
                    var c = new VirtualRouter();
                    angular.extend(c, inv);
                    pris.push(this.wrap(c));
                });
                callback(pris, ret.total);
            });
        }

        getConsole(vm: VirtualRouter, done: (ret: ApiHeader.ConsoleInventory)=>void) {
            var msg = new ApiHeader.APIRequestConsoleAccessMsg();
            msg.vmInstanceUuid = vm.uuid;
            this.api.asyncApi(msg, (ret: ApiHeader.APIRequestConsoleAccessEvent)=>{
                done(ret.inventory);
            });
        }

        stop(vm : VirtualRouter) {
            vm.progressOn();
            vm.state = 'Stopping';
            var msg = new ApiHeader.APIStopVmInstanceMsg();
            msg.uuid = vm.uuid;
            this.api.asyncApi(msg, (ret : ApiHeader.APIStopVmInstanceEvent) => {
                vm.updateObservableObject(ret.inventory);
                vm.progressOff();
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Stopped virtual router: {0}',vm.name),
                    link: Utils.sprintf('/#/virtualRouter/{0}', vm.uuid)
                });
            });
        }

        start(vm : VirtualRouter) {
            vm.progressOn();
            vm.state = 'Starting';
            var msg = new ApiHeader.APIStartVmInstanceMsg();
            msg.uuid = vm.uuid;
            this.api.asyncApi(msg, (ret : ApiHeader.APIStartVmInstanceEvent) => {
                vm.updateObservableObject(ret.inventory);
                vm.progressOff();
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Started virtual router: {0}', vm.name),
                    link: Utils.sprintf('/#/virtualRouter/{0}', vm.uuid)
                });
            });
        }

        reboot(vm: VirtualRouter) {
            vm.progressOn();
            vm.state = 'Rebooting';
            var msg = new ApiHeader.APIRebootVmInstanceMsg();
            msg.uuid = vm.uuid;
            this.api.asyncApi(msg, (ret : ApiHeader.APIRebootVmInstanceEvent) => {
                vm.updateObservableObject(ret.inventory);
                vm.progressOff();
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Rebooted virtual router: {0}', vm.name),
                    link: Utils.sprintf('/#/virtualRouter/{0}', vm.uuid)
                });
            }, ()=>{
                vm.progressOff();
            });
        }

        delete(vm : VirtualRouter, done : (ret : any)=>void) {
            vm.progressOn();
            vm.state = 'Destroying';
            var msg = new ApiHeader.APIDestroyVmInstanceMsg();
            msg.uuid = vm.uuid;
            this.api.asyncApi(msg, (ret : any)=> {
                vm.progressOff();
                done(ret);
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Deleted virtual router: {0}', vm.name)
                });
            });
        }

        migrate(vm: VirtualRouter, hostUuid: string, done: ()=>void) {
            vm.progressOn();
            vm.state = 'Migrating';
            var msg = new ApiHeader.APIMigrateVmMsg();
            msg.hostUuid = hostUuid;
            msg.vmInstanceUuid = vm.uuid;
            this.api.asyncApi(msg, (ret: ApiHeader.APIMigrateVmEvent)=>{
                vm.updateObservableObject(ret.inventory);
                vm.progressOff();
                if (Utils.notNullnotUndefined(done)) {
                    done();
                }
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Migrated virtual router: {0}', vm.name),
                    link: Utils.sprintf('/#/virtualRouter/{0}', vm.uuid)
                });
            });
        }

        reconnect(vm: VirtualRouter, done: ()=>void) {
            vm.progressOn();
            vm.status = 'Connecting';
            var msg = new ApiHeader.APIReconnectVirtualRouterMsg();
            msg.vmInstanceUuid = vm.uuid;
            this.api.asyncApi(msg, (ret: ApiHeader.APIReconnectVirtualRouterEvent)=>{
                vm.updateObservableObject(ret.inventory);
                vm.progressOff();
                if (Utils.notNullnotUndefined(done)) {
                    done();
                }
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Reconnected virtual router: {0}', vm.name),
                    link: Utils.sprintf('/#/virtualRouter/{0}', vm.uuid)
                });
            });
        }
    }

    export class VirtualRouterModel extends Utils.Model {
        constructor() {
            super();
            this.current = new VirtualRouter();
        }
    }

    class OVirtualRouterGrid extends Utils.OGrid {
        constructor($scope: any, private vmMgr : VirtualRouterManager) {
            super();
            super.init($scope, $scope.vmGrid);
            this.options.columns = [
                {
                    field: 'name',
                    title: '{{"virtualRouter.ts.NAME" | translate}}',
                    width: '20%',
                    template: '<a href="/\\#/virtualRouter/{{dataItem.uuid}}">{{dataItem.name}}</a>'
                },
                {
                    field: 'description',
                    title: '{{"virtualRouter.ts.DESCRIPTION" | translate}}',
                    width: '20%'
                },
                {
                    field: 'hypervisorType',
                    title: '{{"virtualRouter.ts.HYPERVISOR" | translate}}',
                    width: '20%'
                },
                {
                    field: 'state',
                    title: '{{"virtualRouter.ts.STATE" | translate}}',
                    width: '10%',
                    template: '<span class="{{dataItem.stateLabel()}}">{{dataItem.state}}</span>'
                },
                {
                    field: 'status',
                    title: '{{"virtualRouter.ts.STATUS" | translate}}',
                    width: '10%',
                    template: '<span class="{{dataItem.statusLabel()}}">{{dataItem.status}}</span>'
                },
                {
                    field: 'uuid',
                    title: '{{"virtualRouter.ts.UUID" | translate}}',
                    width: '20%'
                }
            ];

            this.options.dataSource.transport.read = (options)=> {
                var qobj = new ApiHeader.QueryObject();
                qobj.limit = options.data.take;
                qobj.start = options.data.pageSize * (options.data.page - 1);
                vmMgr.query(qobj, (vms:VirtualRouter[], total:number)=> {
                    options.success({
                        data: vms,
                        total: total
                    });
                });
            };
        }
    }

    class Action {
        start() {
            this.vmMgr.start(this.$scope.model.current);
        }

        stop() {
            this.vmMgr.stop(this.$scope.model.current);
        }

        reboot() {
            this.vmMgr.reboot(this.$scope.model.current);
        }

        migrate() {
            this.$scope.migrateVm.open();
        }

        delete() {
            this.$scope.deleteVirtualRouter.open();
        }

        reconnect() {
            this.$scope.reconnectVirtualRouter.open();
        }

        console() {
            this.$scope.console();
        }

        isActionShow(action) {
            if (!Utils.notNullnotUndefined(this.$scope.model.current) || Utils.isEmptyObject(this.$scope.model.current)) {
                return false;
            }

            if (action == 'start') {
                return this.$scope.model.current.state == 'Stopped';
            } else if (action == 'stop') {
                return this.$scope.model.current.state == 'Running';
            } else if (action == 'reboot') {
                return this.$scope.model.current.state == 'Running';
            } else if (action == 'migrate') {
                return this.$scope.model.current.state == 'Running';
            } else if (action == 'reconnect') {
                return this.$scope.model.current.state == 'Running';
            } else if (action == 'console' && Utils.notNullnotUndefined(this.$scope.model.current)) {
                return this.$scope.model.current.state == 'Starting' || this.$scope.model.current.state == 'Running' || this.$scope.model.current.state == 'Rebooting' || this.$scope.model.current.state == 'Stopping';
            } else {
                return false;
            }
        }

        constructor(private $scope : any, private vmMgr : VirtualRouterManager) {
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
        static TYPE = 'hypervisorType';

        constructor(private $scope : any, private hypervisorTypes: string[]) {
            this.fieldList = {
                dataSource: new kendo.data.DataSource({
                    data: [
                        {
                            name: '{{"virtualRouter.ts.None" | translate}}',
                            value: FilterBy.NONE
                        },
                        {
                            name: '{{"virtualRouter.ts.State" | translate}}',
                            value: FilterBy.STATE
                        },
                        {
                            name: '{{"virtualRouter.ts.HypervisorType" | translate}}',
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
                } else if (this.field == FilterBy.STATE) {
                    this.valueList.dataSource.data(VirtualRouter.STATES);
                } else if (this.field == FilterBy.TYPE) {
                    this.valueList.dataSource.data(this.hypervisorTypes);
                }
            });
        }

        confirm (popover : any) {
            this.$scope.oVirtualRouterGrid.setFilter(this.toKendoFilter());
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
        static $inject = ['$scope', 'VirtualRouterManager', '$routeParams', 'Tag', 'current', 'ClusterManager', '$rootScope', '$window'];

        private loadSelf(uuid : string) {
            var qobj = new ApiHeader.QueryObject();
            qobj.addCondition({name: 'uuid', op: '=', value: uuid});
            this.vmMgr.query(qobj, (vms : VirtualRouter[], total:number)=> {
                this.$scope.model.current = vms[0];
            });
        }

        constructor(private $scope : any, private vmMgr : VirtualRouterManager, private $routeParams : any,
                    private tagService : Utils.Tag, current: VirtualRouter, clusterMgr: MCluster.ClusterManager,
                    private $rootScope : any, private $window : any) {
            $scope.model = new VirtualRouterModel();
            $scope.model.current = current;

            $scope.console = ()=> {
                var current = $scope.model.current;
                vmMgr.getConsole(current, (inv: ApiHeader.ConsoleInventory)=>{
                    var windowName = current.name + current.uuid;
                    $window.open(Utils.sprintf('/static/templates/console/vnc_auto.html?host={0}&port={1}&token={2}&title={3}', inv.hostname, inv.port, inv.token, current.name), windowName);
                });
            };

            $scope.funcDelete = (win : any) => {
                win.open();
            };

            $scope.action = new Action($scope, vmMgr);

            $scope.funcRefresh = ()=> {
                this.loadSelf($scope.model.current.uuid);
            };

            $scope.funcToolbarShow = ()=> {
                return Utils.notNullnotUndefined($scope.model.current);
            };

            $scope.optionsDeleteVirtualRouter = {
                title: 'DELETE VIRTUAL ROUTER',
                confirm: ()=> {
                    vmMgr.delete($scope.model.current, (ret : any)=> {
                        $scope.model.resetCurrent();
                    });
                }
            };

            $scope.optionsTag = {
                tags: [],
                createTag: (item)=> {
                    this.tagService.createTag(item.tag, $scope.model.current.uuid, ApiHeader.TagResourceTypeApplianceVmVO, (ret : ApiHeader.TagInventory)=> {
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

            $scope.optionsMigrateVm = {
                vm: current
            };

            $scope.optionsNicGrid = {
                pageSize: 20,
                resizable: true,
                scrollable: true,
                pageable: true,
                columns: [
                    {
                        field: 'deviceId',
                        title: '{{"virtualRouter.ts.DEVICE ID" | translate}}',
                        width: '4%'
                    },
                    {
                        field: 'l3NetworkUuid',
                        title: '{{"virtualRouter.ts.L3 Network" | translate}}',
                        width: '20%',
                        template: '<a href="/\\#/l3Network/{{dataItem.l3NetworkUuid}}">{{dataItem.l3NetworkUuid}}</a>'
                    },
                    {
                        field: 'ip',
                        title: '{{"virtualRouter.ts.IP" | translate}}',
                        width: '14%'
                    },
                    {
                        field: 'netmask',
                        title: '{{"virtualRouter.ts.NETMASK" | translate}}',
                        width: '14%'
                    },
                    {
                        field: 'gateway',
                        title: '{{"virtualRouter.ts.GATEWAY" | translate}}',
                        width: '14%'
                    },
                    {
                        field: 'mac',
                        title: '{{"virtualRouter.ts.MAC" | translate}}',
                        width: '14%'

                    },
                    {
                        field: 'uuid',
                        title: '{{"virtualRouter.ts.UUID" | translate}}',
                        width: '20%'
                    }
                ],

                dataBound: (e)=> {
                    var grid = e.sender;
                    if (grid.dataSource.totalPages() == 1) {
                        grid.pager.element.hide();
                    }
                },

                dataSource: new kendo.data.DataSource({
                    data: current.vmNics
                })
            };

            $scope.optionsVolumeGrid = {
                pageSize: 20,
                resizable: true,
                scrollable: true,
                pageable: true,
                columns: [
                    {
                        field: 'deviceId',
                        title: '{{"virtualRouter.ts.DEVICE ID" | translate}}',
                        width: '10%',
                        template: '<a href="/\\#/volume/{{dataItem.uuid}}">{{dataItem.deviceId}}</a>'
                    },
                    {
                        field: 'name',
                        title: '{{"virtualRouter.ts.NAME" | translate}}',
                        width: '18%'

                    },
                    {
                        field: 'type',
                        title: '{{"virtualRouter.ts.TYPE" | translate}}',
                        width: '18%'
                    },
                    {
                        field: 'state',
                        title: '{{"virtualRouter.ts.STATE" | translate}}',
                        width: '18%'
                    },
                    {
                        field: 'status',
                        title: '{{"virtualRouter.ts.STATUS" | translate}}',
                        width: '18%'
                    },
                    {
                        field: 'uuid',
                        title: '{{"virtualRouter.ts.UUID" | translate}}',
                        width: '18%'
                    }
                ],

                dataBound: (e)=> {
                    var grid = e.sender;
                    if (grid.dataSource.totalPages() == 1) {
                        grid.pager.element.hide();
                    }
                },

                dataSource: new kendo.data.DataSource({
                    data: current.allVolumes
                })
            };

            $scope.optionsReconnectVirtualRouter = {
                title: '{{"virtualRouter.ts.RECONNECT VIRTUAL ROUTER" | translate}}',
                btnType: 'btn-primary',
                width: '350px',

                description: ()=> {
                    return "Reconnect agent on virtual router: " + current.name
                },

                confirm: ()=> {
                    vmMgr.reconnect($scope.model.current, ()=>{
                        $scope.model.resetCurrent();
                    });
                }
            };
        }
    }

    export class Controller {
        static $inject = ['$scope', 'VirtualRouterManager', 'hypervisorTypes', '$location', '$rootScope', '$window'];

        constructor(private $scope : any, private vmMgr : VirtualRouterManager,
                    private hypervisorTypes: string[], private $location : ng.ILocationService,
                    private $rootScope : any, private $window: any) {
            $scope.model = new VirtualRouterModel();
            $scope.oVirtualRouterGrid = new OVirtualRouterGrid($scope, vmMgr);
            $scope.action = new Action($scope, vmMgr);
            $scope.optionsSortBy = {
                fields: [
                    {
                        name: '{{"virtualRouter.ts.Name" | translate}}',
                        value: 'name'
                    },
                    {
                        name: '{{"virtualRouter.ts.Description" | translate}}',
                        value: 'Description'
                    },
                    {
                        name: '{{"virtualRouter.ts.State" | translate}}',
                        value: 'state'
                    },
                    {
                        name: '{{"virtualRouter.ts.Hypervisor" | translate}}',
                        value: 'hypervisorType'
                    },
                    {
                        name: '{{"virtualRouter.ts.Created Date" | translate}}',
                        value: 'createDate'
                    },
                    {
                        name: '{{"virtualRouter.ts.Last Updated Date" | translate}}',
                        value: 'lastOpDate'
                    }
                ],

                done: (ret : Directive.SortByData) => {
                    vmMgr.setSortBy(ret);
                    $scope.oVirtualRouterGrid.refresh();
                }
            };

            $scope.optionsSearch = {
                fields: ApiHeader.ApplianceVmInventoryQueryable,
                name: 'VirtualRouter',
                schema: {
                    state: {
                        type: Directive.SearchBoxSchema.VALUE_TYPE_LIST,
                        list: VirtualRouter.STATES
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
                    vmMgr.query(qobj, (VirtualRouters : VirtualRouter[], total:number)=> {
                        $scope.oVirtualRouterGrid.refresh(VirtualRouters);
                    });
                }
            };

            $scope.funcGridDoubleClick = (e) => {
                if (Utils.notNullnotUndefined($scope.model.current)) {
                    var url = Utils.sprintf('/virtualRouter/{0}', $scope.model.current.uuid);
                    $location.path(url);
                    e.preventDefault();
                }
            };

            $scope.filterBy = new FilterBy($scope, this.hypervisorTypes);

            $scope.funcSearch = (win : any) => {
                win.open();
            };

            $scope.funcCreateVirtualRouter = (win : any) => {
                win.open();
            };

            $scope.funcDeleteVirtualRouter = () => {
                $scope.deleteVirtualRouter.open();
            };

            $scope.optionsDeleteVirtualRouter = {
                title: 'DELETE VIRTUAL ROUTER',

                confirm: ()=> {
                    vmMgr.delete($scope.model.current, (ret : any)=> {
                        $scope.oVirtualRouterGrid.deleteCurrent();
                    });
                }
            };

            $scope.funcRefresh = ()=> {
                $scope.oVirtualRouterGrid.refresh();
            };

            $scope.funcIsActionShow = ()=> {
                return !Utils.isEmptyObject($scope.model.current);
            };

            $scope.funcIsActionDisabled = ()=> {
                return Utils.notNullnotUndefined($scope.model.current) && $scope.model.current.isInProgress();
            };

            $scope.optionsCreateVirtualRouter = {
                done: (vm : VirtualRouter) => {
                    $scope.oVirtualRouterGrid.add(vm);
                }
            };

            $scope.optionsMigrateVm = {
                vm: null
            };

            $scope.$watch(()=>{
                return $scope.model.current;
            },()=>{
                if (Utils.notNullnotUndefined($scope.model.current)) {
                    $scope.optionsMigrateVm.vm = $scope.model.current;
                }
            });

            $scope.optionsReconnectVirtualRouter = {
                title: 'RECONNECT VIRTUAL ROUTER',
                btnType: 'btn-primary',
                width: '350px',

                description: ()=> {
                    return "Reconnect agent on virtual router: " + $scope.model.current.name;
                },

                confirm: ()=> {
                    vmMgr.reconnect($scope.model.current, ()=>{
                        $scope.model.resetCurrent();
                    });
                }
            };

            $scope.console = ()=> {
                var current = $scope.model.current;
                vmMgr.getConsole(current, (inv: ApiHeader.ConsoleInventory)=>{
                    var windowName = current.name + current.uuid;
                    $window.open(Utils.sprintf('/static/templates/console/vnc_auto.html?host={0}&port={1}&token={2}&title={3}', inv.hostname, inv.port, inv.token, current.name), windowName);
                });
            };
        }
    }
}

angular.module('root').factory('VirtualRouterManager', ['Api', '$rootScope', (api, $rootScope)=> {
    return new MVirtualRouter.VirtualRouterManager(api, $rootScope);
}]).config(['$routeProvider', function(route) {
    route.when('/virtualRouter', {
        templateUrl: '/static/templates/virtualRouter/virtualRouter.html',
        controller: 'MVirtualRouter.Controller',
        resolve: {
            hypervisorTypes: function($q : ng.IQService, Api : Utils.Api) {
                var defer = $q.defer();
                Api.getHypervisorTypes((hypervisorTypes: string[])=> {
                    defer.resolve(hypervisorTypes);
                });
                return defer.promise;
            }
        }
    }).when('/virtualRouter/:uuid', {
        templateUrl: '/static/templates/virtualRouter/details.html',
        controller: 'MVirtualRouter.DetailsController',
        resolve: {
            current: function($q : ng.IQService, $route: any, VirtualRouterManager: MVirtualRouter.VirtualRouterManager) {
                var defer = $q.defer();
                var qobj = new ApiHeader.QueryObject();
                var uuid = $route.current.params.uuid;
                qobj.addCondition({name: 'uuid', op: '=', value: uuid});
                VirtualRouterManager.query(qobj, (vms: MVirtualRouter.VirtualRouter[])=>{
                    var vm = vms[0];
                    defer.resolve(vm);
                });
                return defer.promise;
            }
        }
    });
}]);

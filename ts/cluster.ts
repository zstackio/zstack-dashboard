/// <reference path="d.ts/angularjs/angular.d.ts" />
/// <reference path="d.ts/kendo.all.d.ts" />

module MCluster {
    export class Cluster extends ApiHeader.ClusterInventory {
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
        gridColumnLabel() : string {
            if (this.state == 'Enabled') {
                return 'z-color-box-green';
            } else if (this.state == 'Disabled') {
                return 'z-color-box-red';
            }
        }
        updateObservableObject(inv : ApiHeader.ClusterInventory) {
            // self : ObservableObject
            var self : any = this;
            self.set('name', inv.name);
            self.set('description', inv.description);
            self.set('hypervisorType', inv.hypervisorType);
            self.set('state', inv.state);
            self.set('createDate', inv.createDate);
            self.set('lastOpDate', inv.lastOpDate);
        }
    }

    export class ClusterManager {
        static $inject = ['Api', '$rootScope'];

        constructor(private api : Utils.Api, private $rootScope: ng.IRootScopeService) {
        }

        private sortBy : Directive.SortByData;

        setSortBy(sortBy : Directive.SortByData) {
            this.sortBy = sortBy;
        }

        private wrap(cluster : Cluster) : any {
            return new kendo.data.ObservableObject(cluster);
        }

        create(cluster : any, done : (ret : Cluster)=>void) {
            var msg = new ApiHeader.APICreateClusterMsg();
            msg.name = cluster.name;
            msg.description = cluster.description;
            msg.hypervisorType = cluster.hypervisorType;
            msg.zoneUuid = cluster.zoneUuid;
            this.api.asyncApi(msg, (ret : ApiHeader.APICreateClusterEvent)=> {
                var c = new Cluster();
                angular.extend(c, ret.inventory);
                done(this.wrap(c));
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Created new cluster: {0}',c.name),
                    link: Utils.sprintf('/#/cluster/{0}', c.uuid)
                });
            });
        }

        query(qobj : ApiHeader.QueryObject, callback : (clusters : Cluster[], total: number) => void) : void {
            var msg = new ApiHeader.APIQueryClusterMsg();
            msg.count = qobj.count === true;
            msg.start = qobj.start;
            msg.limit = qobj.limit;
            msg.replyWithCount = true;
            msg.conditions = qobj.conditions ? qobj.conditions : [];
            if (Utils.notNullnotUndefined(this.sortBy) && this.sortBy.isValid()) {
                msg.sortBy = this.sortBy.field;
                msg.sortDirection = this.sortBy.direction;
            }
            this.api.syncApi(msg, (ret : ApiHeader.APIQueryClusterReply)=>{
                var clusters = [];
                ret.inventories.forEach((inv : ApiHeader.ClusterInventory)=> {
                    var c = new Cluster();
                    angular.extend(c, inv);
                    clusters.push(this.wrap(c));
                });
                callback(clusters, ret.total);
            });
        }


        detachPrimaryStorage(cluster: Cluster, ps: MPrimaryStorage.PrimaryStorage, done:()=>void=null) {
            cluster.progressOn();
            var msg = new ApiHeader.APIDetachPrimaryStorageFromClusterMsg();
            msg.primaryStorageUuid = ps.uuid;
            msg.clusterUuid = cluster.uuid;
            this.api.asyncApi(msg, (ret: ApiHeader.APIDetachPrimaryStorageFromClusterEvent)=> {
                cluster.progressOff();
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Detached cluster: {0} from primary storage: {1}',cluster.name, ps.name),
                    link: Utils.sprintf('/#/cluster/{0}', cluster.uuid)
                });
                if (Utils.notNullnotUndefined(done)) {
                    done();
                }
            });
        }

        attachPrimaryStorage(cluster: Cluster, ps: MPrimaryStorage.PrimaryStorage, callback:()=>void=null) {
            cluster.progressOn();
            var msg = new ApiHeader.APIAttachPrimaryStorageToClusterMsg();
            msg.clusterUuid = cluster.uuid;
            msg.primaryStorageUuid = ps.uuid;
            this.api.asyncApi(msg, (ret: ApiHeader.APIAttachPrimaryStorageToClusterEvent)=>{
                cluster.progressOff();
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Attached cluster: {0} to primary storage: {1}',cluster.name, ps.name),
                    link: Utils.sprintf('/#/cluster/{0}', cluster.uuid)
                });
                if (Utils.notNullnotUndefined(callback)) {
                    callback();
                }
            });
        }

        attachL2Network(cluster: Cluster, l2: ML2Network.L2Network, done: ()=>void=null) {
            cluster.progressOn();
            var msg = new ApiHeader.APIAttachL2NetworkToClusterMsg();
            msg.clusterUuid = cluster.uuid;
            msg.l2NetworkUuid = l2.uuid;
            this.api.asyncApi(msg, (ret: ApiHeader.APIAttachL2NetworkToClusterEvent)=> {
                cluster.progressOff();
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Attached cluster: {0} to l2 network: {1}',cluster.name, l2.name),
                    link: Utils.sprintf('/#/cluster/{0}', cluster.uuid)
                });
                if (Utils.notNullnotUndefined(done)) {
                    done();
                }
            });
        }

        detachL2Network(cluster: Cluster, l2: ML2Network.L2Network, done: ()=>void=null) {
            cluster.progressOn();
            var msg = new ApiHeader.APIDetachL2NetworkFromClusterMsg();
            msg.clusterUuid = cluster.uuid;
            msg.l2NetworkUuid = l2.uuid;
            this.api.asyncApi(msg, (ret: ApiHeader.APIDetachL2NetworkFromClusterEvent)=> {
                cluster.progressOff();
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Detached cluster: {0} from l2 network: {1}',cluster.name, l2.name),
                    link: Utils.sprintf('/#/cluster/{0}', cluster.uuid)
                });
                if (Utils.notNullnotUndefined(done)) {
                    done();
                }
            });
        }

        disable(cluster : Cluster) {
            cluster.progressOn();
            var msg = new ApiHeader.APIChangeClusterStateMsg();
            msg.stateEvent = 'disable';
            msg.uuid = cluster.uuid;
            this.api.asyncApi(msg, (ret : ApiHeader.APIChangeClusterStateEvent) => {
                cluster.updateObservableObject(ret.inventory);
                cluster.progressOff();
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Disabled cluster: {0}',cluster.name),
                    link: Utils.sprintf('/#/cluster/{0}', cluster.uuid)
                });
            });
        }

        enable(cluster : Cluster) {
            cluster.progressOn();
            var msg = new ApiHeader.APIChangeClusterStateMsg();
            msg.stateEvent = 'enable';
            msg.uuid = cluster.uuid;
            this.api.asyncApi(msg, (ret : ApiHeader.APIChangeClusterStateEvent) => {
                cluster.updateObservableObject(ret.inventory);
                cluster.progressOff();
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Enabled cluster: {0}',cluster.name),
                    link: Utils.sprintf('/#/cluster/{0}', cluster.uuid)
                });
            });
        }

        delete(cluster : Cluster, done : (ret : any)=>void) {
            cluster.progressOn();
            var msg = new ApiHeader.APIDeleteClusterMsg();
            msg.uuid = cluster.uuid;
            this.api.asyncApi(msg, (ret : any)=> {
                cluster.progressOff();
                done(ret);
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Deleted cluster: {0}',cluster.name)
                });
            });
        }
    }

    export class ClusterModel extends Utils.Model {
        constructor() {
            super();
            this.current = new Cluster();
        }
    }

    class OClusterGrid extends Utils.OGrid {
        constructor($scope: any, private clusterMgr : ClusterManager) {
            super();
            super.init($scope, $scope.clusterGrid);
            this.options.columns = [
                {
                    field: 'name',
                    title: '{{"cluster.ts.NAME" | translate}}',
                    width: '15%',
                    template: '<a href="/\\#/cluster/{{dataItem.uuid}}">{{dataItem.name}}</a>'
                },
                {
                    field: 'description',
                    title: '{{"cluster.ts.DESCRIPTION" | translate}}',
                    width: '25%'
                },
                {
                    field: 'hypervisorType',
                    title: '{{"cluster.ts.HYPERVISOR" | translate}}',
                    width: '15%'
                },
                {
                    field: 'state',
                    title: '{{"cluster.ts.STATE" | translate}}',
                    width: '15%',
                    template: '<span class="{{dataItem.stateLabel()}}">{{dataItem.state}}</span>'
                },
                {
                    field: 'uuid',
                    title: '{{"cluster.ts.UUID" | translate}}',
                    width: '30%'
                }
            ];

            this.options.dataSource.transport.read = (options)=> {
                var qobj = new ApiHeader.QueryObject();
                qobj.limit = options.data.take;
                qobj.start = options.data.pageSize * (options.data.page-1);
                clusterMgr.query(qobj, (clusters: Cluster[], total:number)=> {
                    options.success({
                        data: clusters,
                        total: total
                    });
                });
            };
        }
    }

    class Action {
        enable() {
            this.clusterMgr.enable(this.$scope.model.current);
        }

        disable() {
            this.clusterMgr.disable(this.$scope.model.current);
        }

        addHost() {
            this.$scope.winNewHost.open();
        }

        attachL2Network() {
            this.$scope.winAttachL2Network.open();
        }

        detachL2Network() {
            this.$scope.winDetachL2Network.open();
        }

        attachPrimaryStorage() {
            this.$scope.winAttachPrimaryStorage.open();
        }

        detachPrimaryStorage() {
            this.$scope.winDetachPrimaryStorage.open();
        }

        constructor(private $scope : any, private clusterMgr : ClusterManager) {
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
        static HYPERVISOR = 'hypervisorType';

        constructor(private $scope : any, private hypervisorTypes: string[]) {
            this.fieldList = {
                dataSource: new kendo.data.DataSource({
                    data: [
                        {
                            name: '{{"cluster.ts.None" | translate}}',
                            value: FilterBy.NONE
                        },
                        {
                            name: '{{"cluster.ts.State" | translate}}',
                            value: FilterBy.STATE
                        },
                        {
                            name: '{{"cluster.ts.Hypervisor" | translate}}',
                            value: FilterBy.HYPERVISOR
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
                } else if (this.field == FilterBy.HYPERVISOR) {
                    this.valueList.dataSource.data(this.hypervisorTypes);
                }
            });
        }

        confirm (popover : any) {
            console.log(JSON.stringify(this.toKendoFilter()));
            this.$scope.oClusterGrid.setFilter(this.toKendoFilter());
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
        static $inject = ['$scope', 'ClusterManager', '$routeParams', 'Tag', 'PrimaryStorageManager', 'current', 'L2NetworkManager', 'HostManager'];

        private loadSelf(uuid : string) {
            var qobj = new ApiHeader.QueryObject();
            qobj.addCondition({name: 'uuid', op: '=', value: uuid});
            this.clusterMgr.query(qobj, (clusters : Cluster[], total:number)=> {
                this.$scope.model.current = clusters[0];
            });
        }

        constructor(private $scope : any, private clusterMgr : ClusterManager, private $routeParams : any,
                    private tagService : Utils.Tag, private psMgr: MPrimaryStorage.PrimaryStorageManager,  private current: Cluster,
                    private l2Mgr: ML2Network.L2NetworkManager, private hostMgr : MHost.HostManager) {
            $scope.model = new ClusterModel();
            $scope.model.current= current;


            $scope.funcDelete = (win : any) => {
                win.open();
            };

            $scope.action = new Action($scope, clusterMgr);

            $scope.funcRefresh = ()=> {
                this.loadSelf($scope.model.current.uuid);
            };

            $scope.funcToolbarShow = ()=> {
                return Utils.notNullnotUndefined($scope.model.current);
            };

            $scope.optionsDeleteCluster = {
                title: 'DELETE CLUSTER',
                description: 'Deleting cluster will cause all sub resources(e.g Host, VM) being deleted and no way to recover',
                confirm: ()=> {
                    clusterMgr.delete($scope.model.current, (ret : any)=> {
                        $scope.model.resetCurrent();
                    });
                }
            };

            $scope.optionsTag = {
                tags: [],
                createTag: (item)=> {
                    this.tagService.createTag(item.tag, $scope.model.current.uuid, ApiHeader.TagResourceTypeClusterVO, (ret : ApiHeader.TagInventory)=> {
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

            $scope.optionsAttachL2Network = {
                cluster: $scope.model.current,
                done: (l2: any) => {
                    $scope.optionsL2NetworkGrid.dataSource.insert(0, l2);
                }
            };

            $scope.optionsDetachL2Network = {
                cluster: $scope.model.current,
                done: (l2: any) => {
                    var ds = $scope.optionsL2NetworkGrid.dataSource;
                    var l2s = ds.data();
                    for (var i=0; i<l2s.length; i++) {
                        var tl2 = l2s[i];
                        if (l2.uuid == tl2.uuid) {
                            var row = ds.getByUid(tl2.uid);
                            ds.remove(row);
                            break;
                        }
                    }
                }
            };

            $scope.optionsAttachPrimaryStorage = {
                cluster: $scope.model.current,
                done: (ps: any) => {
                    $scope.optionsPrimaryStorageGrid.dataSource.insert(0, ps);
                }
            };

            $scope.optionsDetachPrimaryStorage = {
                cluster: $scope.model.current,
                done: (ps: any) => {
                    var ds = $scope.optionsPrimaryStorageGrid.dataSource;
                    var pss = ds.data();
                    for (var i=0; i<pss.length; i++) {
                        var tps = pss[i];
                        if (ps.uuid == tps.uuid) {
                            var row = ds.getByUid(tps.uid);
                            ds.remove(row);
                            break;
                        }
                    }
                }
            };

            $scope.optionsCreateHost = {
                done: (info : any) => {
                    hostMgr.create(info, (ret : any)=> {
                        $scope.optionsHostGrid.dataSource.read();
                    });
                }
            };

            $scope.optionsHostGrid = {
                pageSize: 20,
                resizable: true,
                scrollable: true,
                pageable: true,
                columns: [
                    {
                        field: 'name',
                        title: '{{"cluster.ts.NAME" | translate}}',
                        width: '25%',
                        template: '<a href="/\\#/host/{{dataItem.uuid}}">{{dataItem.name}}</a>'
                    },
                    {
                        field: 'description',
                        title: '{{"cluster.ts.DESCRIPTION" | translate}}',
                        width: '25%'
                    },
                    {
                        field: 'managementIp',
                        title: '{{"cluster.ts.MANAGEMENT IP" | translate}}',
                        width: '25%'
                    },
                    {
                        field: 'uuid',
                        title: '{{"cluster.ts.UUID" | translate}}',
                        width: '25%'
                    }
                ],

                dataBound: (e)=> {
                    var grid = e.sender;
                    if (grid.dataSource.totalPages() <= 1) {
                        grid.pager.element.hide();
                    }
                },

                dataSource: new kendo.data.DataSource({
                    schema: {
                        data: 'data',
                        total: 'total'
                    },

                    transport: {
                        read: (options)=> {
                            if (!Utils.notNullnotUndefined($scope.model.current.uuid)) {
                                options.success({
                                    data: [],
                                    total: 0
                                });
                                return;
                            }

                            var qobj = new ApiHeader.QueryObject();
                            qobj.limit = options.data.take;
                            qobj.start = options.data.pageSize * (options.data.page-1);
                            qobj.addCondition({
                                name: 'clusterUuid',
                                op: '=',
                                value: $scope.model.current.uuid
                            });
                            hostMgr.query(qobj, (hosts: MHost.Host[], total:number)=> {
                                options.success({
                                    data: hosts,
                                    total: total
                                });
                            });
                        }
                    }
                })
            };

            $scope.optionsL2NetworkGrid = {
                pageSize: 20,
                resizable: true,
                scrollable: true,
                pageable: true,
                columns: [
                    {
                        field: 'name',
                        title: '{{"cluster.ts.NAME" | translate}}',
                        width: '10%',
                        template: '<a href="/\\#/l2Network/{{dataItem.uuid}}">{{dataItem.name}}</a>'
                    },
                    {
                        field: 'description',
                        title: '{{"cluster.ts.DESCRIPTION" | translate}}',
                        width: '25%'
                    },
                    {
                        field: 'physicalInterface',
                        title: '{{"cluster.ts.PHYSICAL INTERFACE" | translate}}',
                        width: '25%'
                    },
                    {
                        field: 'type',
                        title: '{{"cluster.ts.TYPE" | translate}}',
                        width: '20%'
                    },
                    {
                        field: 'uuid',
                        title: '{{"cluster.ts.UUID" | translate}}',
                        width: '20%'
                    }
                ],

                dataBound: (e)=> {
                    var grid = e.sender;
                    if (grid.dataSource.totalPages() <= 1) {
                        grid.pager.element.hide();
                    }
                },

                dataSource: new kendo.data.DataSource({
                    schema: {
                        data: 'data',
                        total: 'total'
                    },

                    transport: {
                        read: (options)=> {
                            if (!Utils.notNullnotUndefined($scope.model.current.uuid)) {
                                options.success({
                                    data: [],
                                    total: 0
                                });
                                return;
                            }

                            var qobj = new ApiHeader.QueryObject();
                            qobj.limit = options.data.take;
                            qobj.start = options.data.pageSize * (options.data.page-1);
                            qobj.addCondition({
                                name: 'attachedClusterUuids',
                                op: 'in',
                                value: $scope.model.current.uuid
                            });
                            l2Mgr.query(qobj, (l2s: ML2Network.L2Network[], total:number)=> {
                                options.success({
                                    data: l2s,
                                    total: total
                                });
                            });
                        }
                    }
                })
            };

            $scope.funcLoadPrimaryStorage = ()=> {
                $scope.optionsPrimaryStorageGrid.dataSource.read();
            };

            $scope.optionsPrimaryStorageGrid = {
                pageSize: 20,
                resizable: true,
                scrollable: true,
                pageable: true,
                columns: [
                    {
                        field: 'name',
                        title: '{{"cluster.ts.NAME" | translate}}',
                        width: '10%',
                        template: '<a href="/\\#/primaryStorage/{{dataItem.uuid}}">{{dataItem.name}}</a>'
                    },
                    {
                        field: 'description',
                        title: '{{"cluster.ts.DESCRIPTION" | translate}}',
                        width: '15%'
                    },
                    {
                        field: 'url',
                        title: '{{"cluster.ts.URL" | translate}}',
                        width: '16%'
                    },
                    {
                        field: 'totalCapacity',
                        title: '{{"cluster.ts.TOTAL CAPACITY" | translate}}',
                        width: '8%'
                    },
                    {
                        field: 'availableCapacity',
                        title: '{{"cluster.ts.AVAILABLE CAPACITY" | translate}}',
                        width: '8%'
                    },
                    {
                        field: 'type',
                        title: '{{"cluster.ts.TYPE" | translate}}',
                        width: '10%'
                    },
                    {
                        field: 'state',
                        title: '{{"cluster.ts.STATE" | translate}}',
                        width: '15%',
                        template: '<span class="{{dataItem.stateLabel()}}">{{dataItem.state}}</span>'
                    },
                    {
                        field: 'uuid',
                        title: '{{"cluster.ts.UUID" | translate}}',
                        width: '20%'
                    }
                ],

                dataBound: (e)=> {
                    var grid = e.sender;
                    if (grid.dataSource.totalPages() <= 1) {
                        grid.pager.element.hide();
                    }
                },

                dataSource: new kendo.data.DataSource({
                    schema: {
                        data: 'data',
                        total: 'total'
                    },

                    transport: {
                        read: (options)=> {
                            if (!Utils.notNullnotUndefined($scope.model.current.uuid)) {
                                options.success({
                                    data: [],
                                    total: 0
                                });
                                return;
                            }

                            var qobj = new ApiHeader.QueryObject();
                            qobj.limit = options.data.take;
                            qobj.start = options.data.pageSize * (options.data.page-1);
                            qobj.addCondition({
                                name: 'attachedClusterUuids',
                                op: 'in',
                                value: $scope.model.current.uuid
                            });
                            psMgr.query(qobj, (pss: MPrimaryStorage.PrimaryStorage[], total:number)=> {
                                options.success({
                                    data: pss,
                                    total: total
                                });
                            });
                        }
                    }
                })
            };
        }
    }

    export class Controller {
        static $inject = ['$scope', 'ClusterManager', 'hypervisorTypes', '$location', 'HostManager'];

        constructor(private $scope : any, private clusterMgr : ClusterManager, private hypervisorTypes: string[],
                    private $location : ng.ILocationService, private hostMgr: MHost.HostManager) {
            $scope.model = new ClusterModel();
            $scope.oClusterGrid = new OClusterGrid($scope, clusterMgr);
            $scope.action = new Action($scope, clusterMgr);
            $scope.optionsSortBy = {
                fields: [
                    {
                        name: '{{"cluster.ts.Name" | translate}}',
                        value: 'name'
                    },
                    {
                        name: '{{"cluster.ts.Description" | translate}}',
                        value: 'Description'
                    },
                    {
                        name: '{{"cluster.ts.State" | translate}}',
                        value: 'state'
                    },
                    {
                        name: '{{"cluster.ts.Hypervisor" | translate}}',
                        value: 'hypervisorType'
                    },
                    {
                        name: '{{"cluster.ts.Created Date" | translate}}',
                        value: 'createDate'
                    },
                    {
                        name: '{{"cluster.ts.Last Updated Date" | translate}}',
                        value: 'lastOpDate'
                    }
                ],

                done: (ret : Directive.SortByData) => {
                    clusterMgr.setSortBy(ret);
                    $scope.oClusterGrid.refresh();
                }
            };

            $scope.optionsSearch = {
                fields: ApiHeader.ClusterInventoryQueryable,
                name: 'CLUSTER',
                schema: {
                    state: {
                        type: Directive.SearchBoxSchema.VALUE_TYPE_LIST,
                        list: ['Enabled', 'Disabled']
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
                    clusterMgr.query(qobj, (clusters : Cluster[], total:number)=> {
                        $scope.oClusterGrid.refresh(clusters);
                    });
                }
            };

            $scope.optionsAttachPrimaryStorage = {
                cluster: $scope.model.current,
                done: (ps: any) => {
                }
            };

            $scope.optionsDetachPrimaryStorage = {
                cluster: $scope.model.current,
                done: (ps: any) => {
                }
            };

            $scope.optionsAttachL2Network = {
                cluster: $scope.model.current,
                done: (l2: any) => {
                }
            };

            $scope.optionsDetachL2Network = {
                cluster: $scope.model.current,
                done: (l2: any) => {
                }
            };

            $scope.$watch(()=> {
                return $scope.model.current;
            }, ()=>{
                $scope.optionsAttachPrimaryStorage.cluster = $scope.model.current;
                $scope.optionsDetachPrimaryStorage.cluster = $scope.model.current;
                $scope.optionsAttachL2Network.cluster = $scope.model.current;
                $scope.optionsDetachL2Network.cluster = $scope.model.current;
            });

            $scope.funcClusterGridDoubleClick = (e) => {
                if (Utils.notNullnotUndefined($scope.model.current)) {
                    var url = Utils.sprintf('/cluster/{0}', $scope.model.current.uuid);
                    $location.path(url);
                    e.preventDefault();
                }
            };

            $scope.filterBy = new FilterBy($scope, this.hypervisorTypes);

            $scope.funcSearch = (win : any) => {
                win.open();
            };

            $scope.funcCreateCluster = (win : any) => {
                win.open();
            };

            $scope.funcDeleteCluster = (win : any) => {
                $scope.deleteCluster.open();
            };

            $scope.optionsDeleteCluster = {
                title: 'DELETE CLUSTER',
                description: 'Deleting cluster will cause all sub resources(e.g Host, VM) being deleted and no way to recover',
                confirm: ()=> {
                    clusterMgr.delete($scope.model.current, (ret : any)=> {
                        $scope.oClusterGrid.deleteCurrent();
                    });
                }
            };

            $scope.funcRefresh = ()=> {
                $scope.oClusterGrid.refresh();
            };

            $scope.funcIsActionShow = ()=> {
                return !Utils.isEmptyObject($scope.model.current);
            };

            $scope.funcIsActionDisabled = ()=> {
                return Utils.notNullnotUndefined($scope.model.current) && $scope.model.current.isInProgress();
            };

            $scope.optionsCreateCluster = {
                done: (cluster : Cluster) => {
                    $scope.oClusterGrid.add(cluster);
                }
            };

            $scope.optionsCreateHost = {
                done: (info: any) => {
                    hostMgr.create(info, (ret : any)=> {
                    });
                }
            };
        }
    }

    export class CreateClusterOptions {
        zone : MZone.Zone;
        done : (cluster : Cluster)=>void;
    }

    export class CreateCluster implements ng.IDirective {
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
        options: CreateClusterOptions;
        $scope: any;

        private queryPrimaryStorages(zoneUuid: string, done:(pss: MPrimaryStorage.PrimaryStorage[])=>void) {
            var qobj = new ApiHeader.QueryObject();
            qobj.conditions = [
                {
                    name: 'zoneUuid',
                    op: '=',
                    value: zoneUuid
                }
            ];

            this.psMgr.query(qobj, (pss: MPrimaryStorage.PrimaryStorage[])=>{
                done(pss);
            });
        }

        private queryL2Networks(zoneUuid: string, done:(l2s: ML2Network.L2Network[])=>void) {
            var qobj = new ApiHeader.QueryObject();
            qobj.conditions = [
                {
                    name: 'zoneUuid',
                    op: '=',
                    value: zoneUuid
                }
            ];

            this.l2Mgr.query(qobj, (l2s: ML2Network.L2Network[])=>{
                done(l2s);
            });
        }

        open() {
            var win = this.$scope.winCreateCluster__;
            this.$scope.primaryStorageList__.value([]);
            this.$scope.l2NetworkList__.value([]);
            this.$scope.button.reset();
            var chain = new Utils.Chain();
            chain.then(()=> {
                if (Utils.notNullnotUndefined(this.options.zone)) {
                    this.$scope.zoneList.dataSource.data(new kendo.data.ObservableArray([this.options.zone]));
                    this.$scope.infoPage.zoneUuid = this.options.zone.uuid;
                    chain.next();
                } else {
                    this.zoneMgr.query(new ApiHeader.QueryObject(), (zones : MZone.Zone[], total:number)=> {
                        this.$scope.zoneList.dataSource.data(zones);
                        if (zones.length > 0) {
                            this.$scope.infoPage.zoneUuid = zones[0].uuid;
                        }
                        chain.next();
                    });
                }
            }).then(()=> {
                this.api.getHypervisorTypes((hvTypes: string[])=> {
                    var types = [];
                    angular.forEach(hvTypes, (item)=> {
                        types.push({type: item});
                    });
                    this.$scope.hypervisorList.dataSource.data(new kendo.data.ObservableArray(types));
                    this.$scope.model.hypervisorType = hvTypes[0];
                    chain.next();
                });
            }).done(()=> {
                win.center();
                win.open();
            }).start();
        }

        constructor(private api : Utils.Api, private zoneMgr : MZone.ZoneManager, private clusterMgr : ClusterManager,
                    private psMgr: MPrimaryStorage.PrimaryStorageManager, private l2Mgr: ML2Network.L2NetworkManager) {
            this.scope = true;
            this.link = ($scope : any, $element, $attrs : any, $ctrl, $transclude) => {
                var instanceName = $attrs.zCreateCluster;
                var parentScope = $scope.$parent;
                parentScope[instanceName] = this;
                this.options = new CreateClusterOptions();
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
                    zoneUuid: null,
                    description: null,
                    hypervisorType: null,

                    canMoveToPrevious(): boolean {
                        return false;
                    },

                    hasZone() : boolean {
                        return $scope.zoneList.dataSource.data().length > 0;
                    },

                    canMoveToNext(): boolean {
                        return Utils.notNullnotUndefined(this.name) && Utils.notNullnotUndefined(this.zoneUuid)
                            && Utils.notNullnotUndefined(this.hypervisorType);
                    },

                    show(): void {
                        this.getAnchorElement().tab('show');
                    },

                    getAnchorElement() : any {
                        return $('.nav a[data-target="#createClusterInfo"]');
                    },

                    active(): void {
                        this.activeState = true;
                    },

                    isActive(): boolean {
                        return this.activeState;
                    },

                    getPageName(): string {
                        return 'createClusterInfo';
                    },

                    reset() : void {
                        this.name = Utils.shortHashName("cluster");
                        this.zoneUuid = null;
                        this.description = null;
                        this.hypervisorType = null;
                        this.activeState = false;
                    }
                } ;

                var psPage: Utils.WizardPage = $scope.psPage = {
                    activeState: false,

                    canMoveToPrevious(): boolean {
                        return true;
                    },
                    canMoveToNext(): boolean {
                        return true;
                    },

                    getAnchorElement() : any {
                        return $('.nav a[data-target="#createClusterPrimaryStorage"]');
                    },

                    hasPrimaryStorage() : boolean {
                        return $scope.primaryStorageListOptions__.dataSource.data().length > 0;
                    },

                    show(): void {
                        this.getAnchorElement().tab('show');
                    },

                    active(): void {
                        this.activeState = true;
                    },

                    isActive(): boolean {
                        return this.activeState;
                    },

                    getPageName(): string {
                        return 'createClusterPrimaryStorage';
                    },

                    reset() : void {
                        this.activeState = false;
                    }
                };

                var l2Page: Utils.WizardPage = $scope.l2Page = {
                    activeState: false,

                    hasL2Netwwork(): boolean {
                        return $scope.l2NetworkListOptions__.dataSource.data().length > 0;
                    },

                    canMoveToPrevious(): boolean {
                        return true;
                    },
                    canMoveToNext(): boolean {
                        return true;
                    },

                    getAnchorElement() : any {
                        return $('.nav a[data-target="#createClusterL2Network"]');
                    },

                    show(): any {
                        this.getAnchorElement().tab('show');
                    },

                    active(): void {
                        this.activeState = true;
                    },

                    isActive(): boolean {
                        return this.activeState;
                    },

                    getPageName(): string {
                        return 'createClusterL2Network';
                    },

                    reset() : void {
                        this.activeState = false;
                    }
                };

                var mediator : Utils.WizardMediator = $scope.mediator = {
                    currentPage: infoPage,
                    movedToPage: (page: Utils.WizardPage) => {
                        $scope.mediator.currentPage = page;
                    },

                    finishButtonName: (): string =>{
                        return "Create";
                    },

                    finish: ()=> {
                        var resultCluster : Cluster;
                        var chain = new Utils.Chain();
                        chain.then(()=> {
                            clusterMgr.create(infoPage, (ret : Cluster)=> {
                                resultCluster = ret;
                                chain.next();
                            });
                        }).then(()=>{
                            var pss = $scope.primaryStorageList__.dataItems();
                            angular.forEach(pss, (ps)=> {
                                clusterMgr.attachPrimaryStorage(resultCluster, ps);
                            });
                            chain.next();
                        }).then(()=>{
                            var l2s = $scope.l2NetworkList__.dataItems();
                            angular.forEach(l2s, (l2)=> {
                                clusterMgr.attachL2Network(resultCluster, l2);
                            });
                            chain.next();
                        }).done(()=> {
                            if (Utils.notNullnotUndefined(this.options.done)) {
                                this.options.done(resultCluster);
                            }
                        }).start();
                        $scope.winCreateCluster__.close();
                    }
                };

                $scope.button = new Utils.WizardButton([
                    infoPage, psPage, l2Page
                ], mediator);


                $scope.$watch(()=>{
                    return $scope.infoPage.zoneUuid;
                }, ()=>{
                    if (Utils.notNullnotUndefined($scope.primaryStorageList__)) {
                        $scope.primaryStorageList__.value([]);
                    }

                    var zuuid = $scope.infoPage.zoneUuid;
                    if (Utils.notNullnotUndefined(zuuid)) {
                        this.queryPrimaryStorages(zuuid, (pss:MPrimaryStorage.PrimaryStorage[])=> {
                            $scope.primaryStorageListOptions__.dataSource.data(pss);
                        });

                        this.queryL2Networks(zuuid, (l2s: ML2Network.L2Network[])=> {
                            $scope.l2NetworkListOptions__.dataSource.data(l2s);
                        });
                    }
                });

                $scope.zoneList = {
                    dataSource: new kendo.data.DataSource({data: []}),
                    dataTextField: "name",
                    dataValueField: "uuid",
                    template: '<div style="color: black"><span class="z-label">{{"cluster.ts.Name" | translate}}</span>: #: name #</div>'+'<div style="color: black"><span class="z-label">{{"cluster.ts.State" | translate}}</span>#: state #</div>'+'<div style="color: black"><span class="z-label">{{"cluster.ts.UUID" | translate}}</span> #: uuid #</div>'
                };

                $scope.hypervisorList = {
                    dataSource: new kendo.data.DataSource({data: []}),
                    dataTextField: "type",
                    dataValueField: "type"
                };

                $scope.winCreateClusterOptions__ = {
                    width: "700px",
                    //height: "518px",
                    animation: false,
                    modal: true,
                    draggable: false,
                    resizable: false
                };

                $scope.primaryStorageListOptions__ = {
                    dataSource: new kendo.data.DataSource({data: []}),
                    dataTextField: "name",
                    dataValueField: "uuid",
                    itemTemplate: '<div style="color: black"><span class="z-label">Name:</span><span>#: name #</span></div>' +
                        '<div style="color: black"><span class="z-label">UUID:</span><span>#: uuid #</span></div>' +
                        '<div style="color: black"><span class="z-label">Type:</span><span>#: type #</span></div>' +
                        '<div style="color: black"><span class="z-label">URL:</span><span>#: url #</span></div>'
                };

                $scope.l2NetworkListOptions__ = {
                    dataSource: new kendo.data.DataSource({data: []}),
                    dataTextField: "name",
                    dataValueField: "uuid",
                    itemTemplate: '<div style="color: black"><span class="z-label">Name:</span><span>#: name #</span></div>' +
                        '<div style="color: black"><span class="z-label">UUID:</span><span>#: uuid #</span></div>' +
                        '<div style="color: black"><span class="z-label">Type:</span><span>#: type #</span></div>' +
                        '<div style="color: black"><span class="z-label">Physical Interface:</span><span>#: physicalInterface #</span></div>'
                };

                this.$scope = $scope;
            };
            this.restrict = 'EA';
            this.replace = true;
            this.templateUrl = '/static/templates/cluster/createCluster.html';
        }
    }

    export class AttachL2NetworkOptions {
        cluster: Cluster;
        done: (ps : any)=>void;
    }


    export class ClusterAttachL2Network implements ng.IDirective {
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
        templateUrl: string;

        options : AttachL2NetworkOptions;
        l2NetworkListOptions: kendo.ui.DropDownListOptions;
        $scope: any;

        open() {
            this.$scope.l2NetworkList__.value([]);
            var chain  = new Utils.Chain();
            chain.then(()=> {
                var qobj = new ApiHeader.QueryObject();
                qobj.conditions = [
                    {
                        name: 'zoneUuid',
                        op: '=',
                        value: this.options.cluster.zoneUuid
                    },
                    {
                        name: 'attachedClusterUuids',
                        op: 'not in',
                        value: this.options.cluster.uuid
                    }
                ];

                this.l2Mgr.query(qobj, (l2s: ML2Network.L2Network[])=>{
                    this.l2NetworkListOptions.dataSource.data(l2s);
                    chain.next();
                });
            }).done(()=>{
                this.$scope.attachL2Network__.center();
                this.$scope.attachL2Network__.open();
            }).start();
        }


        constructor(private l2Mgr : ML2Network.L2NetworkManager, private clusterMgr: ClusterManager) {
            this.scope = true;
            this.restrict = 'EA';
            this.replace = true;
            this.templateUrl = '/static/templates/cluster/attachL2Network.html';
            this.link = ($scope : any, $element, $attrs : any, $ctrl, $transclude) => {
                var parent = $scope.$parent;
                parent[$attrs.zClusterAttachL2Network] = this;
                this.options = parent[$attrs.zOptions];
                this.$scope = $scope;

                $scope.uuid = null;
                this.l2NetworkListOptions = $scope.l2NetworkListOptions__ = {
                    dataSource: new kendo.data.DataSource({data: []}),
                    dataTextField: "name",
                    dataValueField: "uuid",
                    itemTemplate: '<div style="color: black"><span class="z-label">Name:</span><span>#: name #</span></div>' +
                        '<div style="color: black"><span class="z-label">UUID:</span><span>#: uuid #</span></div>' +
                        '<div style="color: black"><span class="z-label">Type:</span><span>#: type #</span></div>' +
                        '<div style="color: black"><span class="z-label">Physical Interface:</span><span>#: physicalInterface #</span></div>',

                    change: (e)=> {
                        var select = e.sender;
                        Utils.safeApply($scope, ()=> {
                            $scope.selectItemNum = select.dataItems().length;
                        });
                    }
                };

                $scope.hasL2Network = ()=> {
                    return $scope.l2NetworkListOptions__.dataSource.data().length > 0;
                };

                $scope.selectItemNum = 0;

                $scope.canProceed = ()=> {
                    return $scope.selectItemNum > 0;
                };

                $scope.cancel = () => {
                    $scope.attachL2Network__.close();
                };

                $scope.done = () => {
                    var l2s = $scope.l2NetworkList__.dataItems();
                    angular.forEach(l2s, (l2: ML2Network.L2Network)=> {
                        clusterMgr.attachL2Network(this.options.cluster, l2, ()=>{
                            if (Utils.notNullnotUndefined(this.options.done)) {
                                this.options.done(l2);
                            }
                        });
                    });

                    $scope.attachL2Network__.close();
                };
            }
        }
    }

    export class DetachL2NetworkOptions {
        cluster: Cluster;
        done: (ps : any)=>void;
    }

    export class ClusterDetachL2Network implements ng.IDirective {
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
        templateUrl: string;

        options : DetachL2NetworkOptions;
        $scope: any;

        open() {
            this.$scope.l2NetworkList__.value([]);
            var chain  = new Utils.Chain();
            chain.then(()=> {
                var qobj = new ApiHeader.QueryObject();
                qobj.conditions = [
                    {
                        name: 'attachedClusterUuids',
                        op: 'in',
                        value: this.options.cluster.uuid
                    }
                ];

                this.l2Mgr.query(qobj, (l2s: ML2Network.L2Network[])=>{
                    this.$scope.l2NetworkListOptions__.dataSource.data(l2s);
                    chain.next();
                });
            }).done(()=>{
                this.$scope.detachL2Network__.center();
                this.$scope.detachL2Network__.open();
            }).start();
        }


        constructor(private l2Mgr : ML2Network.L2NetworkManager, private clusterMgr: ClusterManager) {
            this.scope = true;
            this.restrict = 'EA';
            this.replace = true;
            this.templateUrl = '/static/templates/cluster/detachL2Network.html';
            this.link = ($scope : any, $element, $attrs : any, $ctrl, $transclude) => {
                var parent = $scope.$parent;
                parent[$attrs.zClusterDetachL2Network] = this;
                this.options = parent[$attrs.zOptions];
                this.$scope = $scope;

                $scope.uuid = null;
                $scope.l2NetworkListOptions__ = {
                    dataSource: new kendo.data.DataSource({data: []}),
                    dataTextField: "name",
                    dataValueField: "uuid",
                    itemTemplate: '<div style="color: black"><span class="z-label">Name:</span><span>#: name #</span></div>' +
                        '<div style="color: black"><span class="z-label">UUID:</span><span>#: uuid #</span></div>' +
                        '<div style="color: black"><span class="z-label">Type:</span><span>#: type #</span></div>' +
                        '<div style="color: black"><span class="z-label">Physical Interface:</span><span>#: physicalInterface #</span></div>',

                    change: (e)=> {
                        var select = e.sender;
                        Utils.safeApply($scope, ()=> {
                            $scope.selectItemNum = select.dataItems().length;
                        });
                    }
                };

                $scope.hasL2Network = () => {
                    return $scope.l2NetworkListOptions__.dataSource.data().length > 0;
                };

                $scope.selectItemNum = 0;

                $scope.canProceed = ()=> {
                    return $scope.selectItemNum > 0;
                };

                $scope.cancel = () => {
                    $scope.detachL2Network__.close();
                };

                $scope.done = () => {
                    var l2s : ML2Network.L2Network = $scope.l2NetworkList__.dataItems();
                    angular.forEach(l2s, (l2: ML2Network.L2Network)=> {
                        clusterMgr.detachL2Network(this.options.cluster, l2, ()=>{
                            if (Utils.notNullnotUndefined(this.options.done)) {
                                this.options.done(l2);
                            }
                        });
                    });

                    $scope.detachL2Network__.close();
                };

                $scope.detachL2NetworkOptions__ = {
                    width: '600px'
                };
            }
        }
    }

    export class AttachPrimaryStorageOptions {
        cluster: Cluster;
        done: (ps : any)=>void;
    }


    export class ClusterAttachPrimaryStorage implements ng.IDirective {
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
        templateUrl: string;

        options : AttachPrimaryStorageOptions;
        primaryStorageListOptions: kendo.ui.DropDownListOptions;
        $scope: any;

        open() {
            this.$scope.primaryStorageList__.value([]);
            var chain  = new Utils.Chain();
            chain.then(()=> {
                var qobj = new ApiHeader.QueryObject();
                qobj.conditions = [
                    {
                        name: 'zoneUuid',
                        op: '=',
                        value: this.options.cluster.zoneUuid
                    },
                    {
                        name: 'attachedClusterUuids',
                        op: 'not in',
                        value: this.options.cluster.uuid
                    }
                ];

                this.psMgr.query(qobj, (pss: MPrimaryStorage.PrimaryStorage[])=>{
                    this.primaryStorageListOptions.dataSource.data(pss);
                    chain.next();
                });
            }).done(()=>{
                this.$scope.attachPrimaryStorage__.center();
                this.$scope.attachPrimaryStorage__.open();
            }).start();
        }


        constructor(private psMgr : MPrimaryStorage.PrimaryStorageManager, private clusterMgr: ClusterManager) {
            this.scope = true;
            this.restrict = 'EA';
            this.replace = true;
            this.templateUrl = '/static/templates/cluster/attachPrimaryStorage.html';
            this.link = ($scope : any, $element, $attrs : any, $ctrl, $transclude) => {
                var parent = $scope.$parent;
                parent[$attrs.zClusterAttachPrimaryStorage] = this;
                this.options = parent[$attrs.zOptions];
                this.$scope = $scope;

                $scope.uuid = null;
                this.primaryStorageListOptions = $scope.primaryStorageListOptions__ = {
                    dataSource: new kendo.data.DataSource({data: []}),
                    dataTextField: "name",
                    dataValueField: "uuid",
                    itemTemplate: '<div style="color: black"><span class="z-label">Name:</span><span>#: name #</span></div>' +
                        '<div style="color: black"><span class="z-label">UUID:</span><span>#: uuid #</span></div>' +
                        '<div style="color: black"><span class="z-label">Type:</span><span>#: type #</span></div>' +
                        '<div style="color: black"><span class="z-label">URL:</span><span>#: url #</span></div>',

                    change: (e)=> {
                        var select = e.sender;
                        Utils.safeApply($scope, ()=> {
                            $scope.selectItemNum = select.dataItems().length;
                        });
                    }
                };

                $scope.hasPrimaryStorage = () => {
                    return $scope.primaryStorageListOptions__.dataSource.data().length > 0;
                };

                $scope.selectItemNum = 0;

                $scope.canProceed = ()=> {
                    return $scope.selectItemNum > 0;
                };

                $scope.cancel = () => {
                    $scope.attachPrimaryStorage__.close();
                };

                $scope.done = () => {
                    var pss : MPrimaryStorage.PrimaryStorage = $scope.primaryStorageList__.dataItems();
                    angular.forEach(pss, (ps: MPrimaryStorage.PrimaryStorage)=> {
                        clusterMgr.attachPrimaryStorage(this.options.cluster, ps, ()=>{
                            if (Utils.notNullnotUndefined(this.options.done)) {
                                this.options.done(ps);
                            }
                        });
                    });

                    $scope.attachPrimaryStorage__.close();
                };
            }
        }
    }

    export class DetachPrimaryStorageOptions {
        cluster: Cluster;
        done: (ps : any)=>void;
    }


    export class ClusterDetachPrimaryStorage implements ng.IDirective {
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
        templateUrl: string;

        options : DetachPrimaryStorageOptions;
        $scope: any;

        open() {
            this.$scope.primaryStorageList__.value([]);
            var chain  = new Utils.Chain();
            chain.then(()=> {
                var qobj = new ApiHeader.QueryObject();
                qobj.conditions = [
                    {
                        name: 'attachedClusterUuids',
                        op: 'in',
                        value: this.options.cluster.uuid
                    }
                ];

                this.psMgr.query(qobj, (pss: MPrimaryStorage.PrimaryStorage[])=>{
                    this.$scope.primaryStorageListOptions__.dataSource.data(pss);
                    chain.next();
                });
            }).done(()=>{
                this.$scope.detachPrimaryStorage__.center();
                this.$scope.detachPrimaryStorage__.open();
            }).start();
        }


        constructor(private psMgr : MPrimaryStorage.PrimaryStorageManager, private clusterMgr: ClusterManager) {
            this.scope = true;
            this.restrict = 'EA';
            this.replace = true;
            this.templateUrl = '/static/templates/cluster/detachPrimaryStorage.html';
            this.link = ($scope : any, $element, $attrs : any, $ctrl, $transclude) => {
                var parent = $scope.$parent;
                parent[$attrs.zClusterDetachPrimaryStorage] = this;
                this.options = parent[$attrs.zOptions];
                this.$scope = $scope;

                $scope.uuid = null;
                $scope.primaryStorageListOptions__ = {
                    dataSource: new kendo.data.DataSource({data: []}),
                    dataTextField: "name",
                    dataValueField: "uuid",
                    itemTemplate: '<div style="color: black"><span class="z-label">Name:</span><span>#: name #</span></div>' +
                        '<div style="color: black"><span class="z-label">UUID:</span><span>#: uuid #</span></div>' +
                        '<div style="color: black"><span class="z-label">Type:</span><span>#: type #</span></div>' +
                        '<div style="color: black"><span class="z-label">URL:</span><span>#: url #</span></div>',

                    change: (e)=> {
                        var select = e.sender;
                        Utils.safeApply($scope, ()=> {
                            $scope.selectItemNum = select.dataItems().length;
                        });
                    }
                };

                $scope.hasPrimaryStorage = () => {
                    return $scope.primaryStorageListOptions__.dataSource.data().length > 0;
                };

                $scope.selectItemNum = 0;

                $scope.canProceed = ()=> {
                    return $scope.selectItemNum > 0;
                };

                $scope.cancel = () => {
                    $scope.detachPrimaryStorage__.close();
                };

                $scope.done = () => {
                    var pss : MPrimaryStorage.PrimaryStorage = $scope.primaryStorageList__.dataItems();
                    angular.forEach(pss, (ps: MPrimaryStorage.PrimaryStorage)=> {
                        clusterMgr.detachPrimaryStorage(this.options.cluster, ps, ()=>{
                            if (Utils.notNullnotUndefined(this.options.done)) {
                                this.options.done(ps);
                            }
                        });
                    });

                    $scope.detachPrimaryStorage__.close();
                };

                $scope.detachPrimaryStorageOptions__ = {
                    width: '600px'
                };
            }
        }
    }
}

angular.module('root').factory('ClusterManager', ['Api', '$rootScope', (api, $rootScope)=> {
    return new MCluster.ClusterManager(api, $rootScope);
}]).directive('zCreateCluster', ['Api', 'ZoneManager', 'ClusterManager', 'PrimaryStorageManager', 'L2NetworkManager',
    (api, zoneMgr, clusterMgr, psMgr, l2Mgr)=> {
    return new MCluster.CreateCluster(api, zoneMgr, clusterMgr, psMgr, l2Mgr);
}]).directive('zClusterAttachPrimaryStorage', ['PrimaryStorageManager', 'ClusterManager', (psMgr, clusterMgr)=>{
    return new MCluster.ClusterAttachPrimaryStorage(psMgr, clusterMgr);
}]).directive('zClusterDetachPrimaryStorage', ['PrimaryStorageManager', 'ClusterManager', (psMgr, clusterMgr)=>{
    return new MCluster.ClusterDetachPrimaryStorage(psMgr, clusterMgr);
}]).directive('zClusterDetachL2Network', ['L2NetworkManager', 'ClusterManager', (l2Mgr, clusterMgr)=> {
    return new MCluster.ClusterDetachL2Network(l2Mgr, clusterMgr);
}]).directive('zClusterAttachL2Network', ['L2NetworkManager', 'ClusterManager', (l2Mgr, clusterMgr)=> {
    return new MCluster.ClusterAttachL2Network(l2Mgr, clusterMgr);
}]).config(['$routeProvider', function(route) {
    route.when('/cluster', {
        templateUrl: '/static/templates/cluster/cluster.html',
        controller: 'MCluster.Controller',
        resolve: {
            hypervisorTypes: function($q : ng.IQService, Api : Utils.Api) {
                var defer = $q.defer();
                Api.getHypervisorTypes((hvTypes: string[])=> {
                    defer.resolve(hvTypes);
                });
                return defer.promise;
            }
        }
    }).when('/cluster/:uuid', {
        templateUrl: '/static/templates/cluster/details.html',
        controller: 'MCluster.DetailsController',
        resolve: {
            current: function($q : ng.IQService, ClusterManager: MCluster.ClusterManager, $route) {
                var defer = $q.defer();
                var qobj = new ApiHeader.QueryObject();
                var uuid = $route.current.params.uuid;
                qobj.addCondition({name: 'uuid', op: '=', value: uuid});
                ClusterManager.query(qobj, (clusters : MCluster.Cluster[], total:number)=> {
                    defer.resolve(clusters[0]);
                });
                return defer.promise;
            }
        }
    });
}]);

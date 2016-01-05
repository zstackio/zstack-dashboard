/// <reference path="d.ts/angularjs/angular.d.ts" />
/// <reference path="d.ts/kendo.all.d.ts" />

module MZone {
    export class Zone extends ApiHeader.ZoneInventory {
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
        updateObservableObject(inv : ApiHeader.ZoneInventory) {
            // self : ObservableObject
            var self : any = this;
            self.set('name', inv.name);
            self.set('description', inv.description);
            self.set('state', inv.state);
            self.set('createDate', inv.createDate);
            self.set('lastOpDate', inv.lastOpDate);
        }
    }

    export class ZoneManager {
        static $inject = ['Api'];

        constructor(private api : Utils.Api, private $rootScope : ng.IRootScopeService) {
        }

        private sortBy : Directive.SortByData;

        setSortBy(sortBy : Directive.SortByData) {
            this.sortBy = sortBy;
        }

        query(qobj : ApiHeader.QueryObject, callback : (zones : Zone[], total:number) => void) : void {
            var msg = new ApiHeader.APIQueryZoneMsg();
            msg.count = qobj.count === true;
            msg.start = qobj.start;
            msg.limit = qobj.limit;
            msg.replyWithCount = true;
            msg.conditions = qobj.conditions ? qobj.conditions : [];
            if (Utils.notNullnotUndefined(this.sortBy) && this.sortBy.isValid()) {
                msg.sortBy = this.sortBy.field;
                msg.sortDirection = this.sortBy.direction;
            }
            this.api.syncApi(msg, (ret : ApiHeader.APIQueryZoneReply)=>{
                var zones = [];
                ret.inventories.forEach((inv : ApiHeader.ZoneInventory)=> {
                    var z = new Zone();
                    angular.extend(z, inv);
                    zones.push(new kendo.data.ObservableObject(z));
                });
                callback(zones, ret.total);
            });
        }

        create(zone: {name:string; description?:string}, done: (ret : any)=>void) {
            var msg  = new ApiHeader.APICreateZoneMsg();
            msg.name = zone.name;
            msg.description = zone.description
            this.api.asyncApi(msg, (ret : ApiHeader.APICreateZoneEvent)=>{
                var z = new Zone();
                angular.extend(z, ret.inventory);
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Created new zone: {0}',z.name),
                    link: Utils.sprintf('/#/zone/{0}', z.uuid)
                });
                done(new kendo.data.ObservableObject(z));
            });
        }

        disable(zone : Zone) {
            zone.progressOn();
            var msg = new ApiHeader.APIChangeZoneStateMsg();
            msg.stateEvent = 'disable';
            msg.uuid = zone.uuid;
            this.api.asyncApi(msg, (ret : ApiHeader.APIChangeZoneStateEvent) => {
                zone.updateObservableObject(ret.inventory);
                zone.progressOff();
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Disabled zone: {0}',zone.name),
                    link: Utils.sprintf('/#/zone/{0}', zone.uuid)
                });
            });
        }

        enable(zone : Zone) {
            zone.progressOn();
            var msg = new ApiHeader.APIChangeZoneStateMsg();
            msg.stateEvent = 'enable';
            msg.uuid = zone.uuid;
            this.api.asyncApi(msg, (ret : ApiHeader.APIChangeZoneStateEvent) => {
                zone.updateObservableObject(ret.inventory);
                zone.progressOff();
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Enabled zone: {0}',zone.name),
                    link: Utils.sprintf('/#/zone/{0}', zone.uuid)
                });
            });
        }

        delete(zone : Zone, done : (ret : any)=>void) {
            zone.progressOn();
            var msg = new ApiHeader.APIDeleteZoneMsg();
            msg.uuid = zone.uuid;
            this.api.asyncApi(msg, (ret : any)=> {
                zone.progressOff();
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Deleted zone: {0}',zone.name)
                });
                done(ret);
            });
        }
    }

    export class ZoneModel {
        current : any = new Zone();
        resetCurrent() {
            this.current = null;
        }

        setCurrent($scope : any, zone:Zone) {
            this.current = zone;
        }
    }

    export class CreateZoneModel {
        name: string = Utils.shortHashName('zone');
        description: string;
        canCreate() : boolean {
            return angular.isDefined(this.name);
        }
    }

    class Action {
        enable() {
            this.zoneMgr.enable(this.$scope.model.current);
        }

        disable() {
            this.zoneMgr.disable(this.$scope.model.current);
        }

        createCluster(win : any) {
            this.$scope.optionsCreateCluster.zone = this.$scope.model.current;
            win.open();
        }

        createL2Network() {
            this.$scope.optionsCreateL2Network.zone = this.$scope.model.current;
            this.$scope.winNewL2Network.open();
        }

        addPrimaryStorage() {
            this.$scope.winNewPrimaryStorage.open();
        }

        attachBackupStorage() {

        }

        constructor(private $scope : any, private zoneMgr : ZoneManager) {
        }
    }

    export class DetailsController {
        static $inject = ['$scope', 'ZoneManager', 'Api', 'ClusterManager', '$location', '$routeParams', 'Tag',
            'PrimaryStorageManager', 'current', 'L2NetworkManager', 'BackupStorageManager'];

        private loadSelf(uuid : string) {
            var qobj = new ApiHeader.QueryObject();
            qobj.addCondition({name: 'uuid', op: '=', value: uuid});
            this.zoneMgr.query(qobj, (zones : Zone[], total:number)=> {
                this.$scope.model.current = zones[0];
            });
        }

        constructor(private $scope : any, private zoneMgr : ZoneManager, private api : Utils.Api,
                    private clusterMgr : MCluster.ClusterManager, private $location : ng.ILocationService,
                    private $routeParams : any, private tagService : Utils.Tag, private psMgr : MPrimaryStorage.PrimaryStorageManager,
                    current: Zone, private l2Mgr: ML2Network.L2NetworkManager, private bsMgr : MBackupStorage.BackupStorageManager) {
            $scope.model = new ZoneModel();
            $scope.model.current = current;
            $scope.optionsCreateCluster = new MCluster.CreateClusterOptions();

            $scope.funcDelete = (win : any) => {
                win.open();
            };

            $scope.action = new Action($scope, zoneMgr);

            $scope.funcRefresh = ()=> {
                this.loadSelf($scope.model.current.uuid);
            };

            $scope.funcToolbarShow = ()=> {
                return Utils.notNullnotUndefined($scope.model.current);
            };

            $scope.funcLoadClusters = ()=> {
                if (!Utils.notNullnotUndefined($scope.model.current)) {
                    return;
                }

                var qobj = new ApiHeader.QueryObject();
                qobj.addCondition({name: 'zoneUuid', op:'=', value:$scope.model.current.uuid});
                this.clusterMgr.query(qobj, (clusters: MCluster.Cluster[])=> {
                    $scope.optionsClusterGrid.dataSource.data(new kendo.data.ObservableArray(clusters));
                });
            };

            $scope.optionsDeleteZone = {
                confirm: ()=> {
                    zoneMgr.delete($scope.model.current, (ret : any)=> {
                        $scope.model.current = null;
                    });
                },
                title: 'DELETE ZONE',
                description: 'Deleting zone will cause all sub resources(e.g Cluster, Host, VM) being deleted and no way to recover'
            };

            $scope.optionsCreateL2Network = {
                zone: null,
                done: (l2 : ML2Network.L2Network) => {
                    $scope.optionsL2NetworkGrid.dataSource.insert(0, l2);
                }
            };

            $scope.optionsClusterGrid = {
                pageSize: 20,
                resizable: true,
                scrollable: true,
                pageable: true,
                columns: [
                    {
                        field: 'name',
                        title: '{{"zone.ts.NAME" | translate}}',
                        width: '20%',
                        template: '<a href="/\\#/cluster/{{dataItem.uuid}}">{{dataItem.name}}</a>'
                    },
                    {
                        field: 'description',
                        title: '{{"zone.ts.DESCRIPTION" | translate}}',
                        width: '20%'
                    },
                    {
                        field: 'state',
                        title: '{{"zone.ts.STATE" | translate}}',
                        width: '20%',
                        template: '<span class="{{dataItem.stateLabel()}}">{{dataItem.state}}</span>'

                    },
                    {
                        field: 'hypervisorType',
                        title: '{{"zone.ts.HYPERVISOR" | translate}}',
                        width: '20%'
                    },
                    {
                        field: 'uuid',
                        title: '{{"zone.ts.UUID" | translate}}',
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
                    data: new kendo.data.ObservableArray([])
                })
            };

            $scope.optionsCreatePrimaryStorage = {
                zone: current,
                done: (ps : MPrimaryStorage.PrimaryStorage) => {
                    $scope.optionsPrimaryStorageGrid.dataSource.insert(0, ps);
                }
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
                        title: '{{"zone.ts.NAME" | translate}}',
                        width: '10%',
                        template: '<a href="/\\#/primaryStorage/{{dataItem.uuid}}">{{dataItem.name}}</a>'
                    },
                    {
                        field: 'description',
                        title: '{{"zone.ts.DESCRIPTION" | translate}}',
                        width: '15%'
                    },
                    {
                        field: 'url',
                        title: '{{"zone.ts.URL" | translate}}',
                        width: '16%'
                    },
                    {
                        field: 'totalCapacity',
                        title: '{{"zone.ts.TOTAL CAPACITY" | translate}}',
                        width: '8%'
                    },
                    {
                        field: 'availableCapacity',
                        title: '{{"zone.ts.AVAILABLE CAPACITY" | translate}}',
                        width: '8%'
                    },
                    {
                        field: 'type',
                        title: '{{"zone.ts.TYPE" | translate}}',
                        width: '10%'
                    },
                    {
                        field: 'state',
                        title: '{{"zone.ts.STATE" | translate}}',
                        width: '15%',
                        template: '<span class="{{dataItem.stateLabel()}}">{{dataItem.state}}</span>'
                    },
                    {
                        field: 'uuid',
                        title: '{{"zone.ts.UUID" | translate}}',
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
                                name: 'zoneUuid',
                                op: '=',
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

            $scope.optionsL2NetworkGrid = {
                pageSize: 20,
                resizable: true,
                scrollable: true,
                pageable: true,
                columns: [
                    {
                        field: 'name',
                        title: '{{"zone.ts.NAME" | translate}}',
                        width: '10%',
                        template: '<a href="/\\#/l2Network/{{dataItem.uuid}}">{{dataItem.name}}</a>'
                    },
                    {
                        field: 'description',
                        title: '{{"zone.ts.DESCRIPTION" | translate}}',
                        width: '25%'
                    },
                    {
                        field: 'physicalInterface',
                        title: '{{"zone.ts.PHYSICAL INTERFACE" | translate}}',
                        width: '25%'
                    },
                    {
                        field: 'type',
                        title: '{{"zone.ts.TYPE" | translate}}',
                        width: '20%'
                    },
                    {
                        field: 'uuid',
                        title: '{{"zone.ts.UUID" | translate}}',
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
                                name: 'zoneUuid',
                                op: '=',
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

            $scope.optionsTag = {
                tags: [],
                createTag: (item)=> {
                    this.tagService.createTag(item.tag, $scope.model.current.uuid, ApiHeader.TagResourceTypeZoneVO, (ret : ApiHeader.TagInventory)=> {
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

            $scope.optionsBackupStorageGrid = {
                pageSize: 20,
                resizable: true,
                scrollable: true,
                pageable: true,
                columns: [
                    {
                        field: 'name',
                        title: '{{"zone.ts.NAME" | translate}}',
                        width: '10%',
                        template: '<a href="/\\#/backupStorage/{{dataItem.uuid}}">{{dataItem.name}}</a>'
                    },
                    {
                        field: 'totalCapacity',
                        title: '{{"zone.ts.TOTAL CAPACITY" | translate}}',
                        width: '10%'
                    },
                    {
                        field: 'availableCapacity',
                        title: '{{"zone.ts.AVAILABLE CAPACITY" | translate}}',
                        width: '10%'
                    },
                    {
                        field: 'type',
                        title: '{{"zone.ts.TYPE" | translate}}',
                        width: '10%'
                    },
                    {
                        field: 'state',
                        title: '{{"zone.ts.STATE" | translate}}',
                        width: '20%',
                        template: '<span class="{{dataItem.stateLabel()}}">{{dataItem.state}}</span>'
                    },
                    {
                        field: 'status',
                        title: '{{"zone.ts.STATUS" | translate}}',
                        width: '20%',
                        template: '<span class="{{dataItem.statusLabel()}}">{{dataItem.status}}</span>'
                    },
                    {
                        field: 'uuid',
                        title: '{{"zone.ts.UUID" | translate}}',
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
                            var qobj = new ApiHeader.QueryObject();
                            qobj.limit = options.data.take;
                            qobj.start = options.data.pageSize * (options.data.page-1);
                            qobj.addCondition({
                                name: 'attachedZoneUuids',
                                op: 'in',
                                value: [current.uuid].join()
                            });

                            bsMgr.query(qobj, (bss: MBackupStorage.BackupStorage[], total:number)=> {
                                options.success({
                                    data: bss,
                                    total: total
                                });
                            });
                        }
                    }
                })
            };
        }
    }

    export class FilterBy {
        state: string = 'All';
        buttonName: string;

        useState() : string {
            if (this.state == 'All') {
                this.buttonName = 'state:all';
            } else if (this.state == 'Enabled') {
                this.buttonName = 'state:Enabled';
            } else if (this.state == 'Disabled') {
                this.buttonName = 'state:Disabled';
            }
            return this.state;
        }
    }


    export class Controller {
        static $inject = ['$scope', 'ZoneManager', 'Api', '$location'];

        constructor(private $scope : any, private zoneMgr : ZoneManager, private api : Utils.Api, private $location : ng.ILocationService) {
            $scope.action = new Action($scope, zoneMgr);

            $scope.funcCreateZone = (win : kendo.ui.Window) => {
                $scope.modelCreateZone = new CreateZoneModel();
                win.center();
                win.open();
            };

            $scope.funcCreateZoneDone = (win : kendo.ui.Window)=>{
                zoneMgr.create($scope.modelCreateZone, (ret : any)=> {
                    $scope.model.resetCurrent();
                    $scope.optionsZoneGrid.dataSource.insert(0, ret);
                });

                win.close();
            };

            $scope.funcCreateZoneCancel = (win : kendo.ui.Window)=>{
                win.close();
            };

            $scope.funcRefresh = ()=> {
                var grid = $scope.zoneGrid;
                grid.dataSource.read();
            };

            $scope.funcIsActionShow = ()=> {
                return !Utils.isEmptyObject($scope.model.current);
            };

            $scope.funcIsActionDisabled = () : boolean => {
                if ($scope.model.current == null) {
                    return true;
                }

                return $scope.model.current.isInProgress();
            };

            $scope.funcShowPopoverSortedBy = (popover: any) => {
                popover.toggle();
            };

            $scope.filterBy = new FilterBy();
            $scope.filterBy.useState();

            $scope.funcShowPopoverFilterBy = (popover : any) => {
                popover.toggle();
            };

            $scope.funcFilterByConfirm = (popover : any) => {
                var grid = $scope.zoneGrid;
                var state = $scope.filterBy.useState();
                if (state === 'All') {
                    grid.dataSource.filter(null);
                } else {
                    grid.dataSource.filter({
                        field: 'state',
                        operator: 'eq',
                        value: state
                    });
                }
                popover.toggle();
            };

            $scope.popoverFilterBy = (popover : any)=> {
                popover.toggle();
            };

            $scope.funcSearch = (search : any) => {
                search.open();
            };

            $scope.optionsCreateL2Network = {
                zone: null,
                done: (l2 : ML2Network.L2Network) => {
                }
            };

            $scope.optionsSearch = {
                fields: ApiHeader.ZoneInventoryQueryable,
                name: 'ZONE',
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
                    console.log(JSON.stringify(ret));
                    var qobj = new ApiHeader.QueryObject();
                    qobj.conditions = ret;
                    zoneMgr.query(qobj, (zones : Zone[], total:number)=> {
                        $scope.model.resetCurrent();
                        $scope.optionsZoneGrid.dataSource.data(zones);
                    });
                }
            };

            $scope.optionsCreatePrimaryStorage = {
                zone: null,
                done: (ps : MPrimaryStorage.PrimaryStorage) => {
                }
            };

            $scope.$watch(()=> {
                return $scope.model.current;
            }, ()=>{
                $scope.optionsCreatePrimaryStorage.zone = $scope.model.current;
            });

            $scope.optionsNewZone = {
                width:"480px",
                animation: false,
                modal: true,
                draggable: false,
                resizable: false
            };

            $scope.model = new ZoneModel();

            $scope.optionsDeleteZone = {
                confirm : ()=>{
                    zoneMgr.delete($scope.model.current, (ret : any)=> {
                        var row = $scope.optionsZoneGrid.dataSource.getByUid(this.$scope.model.current.uid);
                        $scope.model.resetCurrent();
                        $scope.optionsZoneGrid.dataSource.remove(row);
                    });
                },
                title: 'DELETE ZONE',
                description: 'Deleting zone will cause all sub resources(e.g Cluster, Host, VM) being deleted and no way to recover'
            };

            $scope.funcDeleteZone = (win : any) => {
                win.open();
            };

            $scope.optionsCreateCluster = new MCluster.CreateClusterOptions();

            $scope.optionsSortBy = {
                done: (ret : Directive.SortByData) => {
                    zoneMgr.setSortBy(ret);
                    $scope.optionsZoneGrid.dataSource.read();
                    $scope.model.resetCurrent();
                },
                fields: [
                    {
                        name: '{{"zone.ts.Name" | translate}}',
                        value: 'name'
                    },
                    {
                        name: '{{"zone.ts.State" | translate}}',
                        value: 'state'
                    },
                    {
                        name: '{{"zone.ts.Created Date" | translate}}',
                        value: 'createDate'
                    },
                    {
                        name: '{{"zone.ts.Last Updated Date" | translate}}',
                        value: 'lastOpDate'
                    }
                ]
            };

            $scope.funcZoneGridDoubleClick = (e)=> {
                if (Utils.notNullnotUndefined($scope.model.current)) {
                    var url = Utils.sprintf('/zone/{0}', $scope.model.current.uuid);
                    $location.path(url);
                    e.preventDefault();
                }
            };

            $scope.optionsZoneGrid = {
                change: (e)=> {
                    var grid : kendo.ui.Grid = e.sender;
                    var selected = grid.select();
                    Utils.safeApply($scope, ()=>{
                        $scope.model.setCurrent($scope, grid.dataItem(selected));
                    });
                },

                columns: [
                    {
                        field: 'name',
                        title: '{{"zone.ts.NAME" | translate}}',
                        width: '20%',
                        template: '<span><div class="{{dataItem.gridColumnLabel()}}"></div><i class="fa fa-spinner fa-spin" ng-show="dataItem.isInProgress()"></i><a href="/\\#/zone/{{dataItem.uuid}}"><span>#: name #</span></a></span>'
                    },
                    {
                        field: 'description',
                        title: '{{"zone.ts.DESCRIPTION" | translate}}',
                        width: '30%'
                    },
                    {
                        field: 'state',
                        title: '{{"zone.ts.STATE" | translate}}',
                        width: '20%',
                        template: '<span class="{{dataItem.stateLabel()}}">{{dataItem.state}}</span>'
                    },
                    {
                        field: 'uuid',
                        title: '{{"zone.ts.UUID" | translate}}',
                        width: '30%'
                    }
                ],
                resizable: true,
                scrollable: true,
                selectable: true,
                pageable: true,
                dataBound: (e)=> {
                    var grid = e.sender;
                    if (grid.dataSource.totalPages() == 1) {
                        grid.pager.element.hide();
                    }

                    var selected = null;
                    if ($scope.model.current) {
                        selected = $scope.model.current;
                    } else {
                        selected = grid.dataSource.data()[0];
                    }

                    if (selected) {
                        var row = grid.table.find('tr[data-uid="' + selected.uid + '"]');
                        grid.select(row);
                    }
                },
                dataSource: new kendo.data.DataSource({
                    transport: {
                        read: (options)=> {
                            console.log(JSON.stringify(options));
                            var qobj = new ApiHeader.QueryObject();
                            qobj.limit = options.data.take;
                            qobj.start = options.data.pageSize * (options.data.page-1);
                            zoneMgr.query(qobj, (zones: Zone[], total:number)=> {
                                options.success({
                                    data: zones,
                                    total: total
                                });
                            });
                        }
                    },
                    serverPaging: true,
                    pageSize: 20,
                    schema: {
                        data: 'data',
                        total: 'total'
                    }
                })
            };


        }
    }
}

angular.module('root').factory('ZoneManager', ['Api', '$rootScope', (api, $rootScope)=> {
    return new MZone.ZoneManager(api, $rootScope);
}]).config(['$routeProvider', function(route) {
    route.when('/zone', {
        templateUrl: '/static/templates/zone/zone.html',
        controller: 'MZone.Controller'
    }).when('/zone/:uuid', {
        templateUrl: '/static/templates/zone/details.html',
        controller: 'MZone.DetailsController',
        resolve: {
            current: function($q : ng.IQService, $route: any, ZoneManager: MZone.ZoneManager) {
                var defer = $q.defer();
                var qobj = new ApiHeader.QueryObject();
                var uuid = $route.current.params.uuid;
                qobj.addCondition({name: 'uuid', op: '=', value: uuid});
                ZoneManager.query(qobj, (zones: MZone.Zone[])=> {
                    var z = zones[0];
                    defer.resolve(z);
                });
                return defer.promise;
            }
        }
    });
}]);

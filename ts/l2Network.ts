
/// <reference path="d.ts/angularjs/angular.d.ts" />
/// <reference path="d.ts/kendo.all.d.ts" />

module ML2Network {
    export class L2Network extends ApiHeader.L2NetworkInventory {
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

        updateObservableObject(inv : ApiHeader.L2NetworkInventory) {
            // self : ObservableObject
            var self : any = this;
            self.set('uuid', inv.uuid);
            self.set('name', inv.name);
            self.set('description', inv.description);
            self.set('zoneUuid', inv.zoneUuid);
            self.set('physicalInterface', inv.physicalInterface);
            self.set('type', inv.type);
            self.set('attachedClusterUuids', inv.attachedClusterUuids);
            self.set('createDate', inv.createDate);
            self.set('lastOpDate', inv.lastOpDate);
        }
    }

    export class L2NetworkManager {
        static $inject = ['Api', '$rootScope'];

        constructor(private api : Utils.Api, private $rootScope: ng.IRootScopeService) {
        }

        private sortBy : Directive.SortByData;

        setSortBy(sortBy : Directive.SortByData) {
            this.sortBy = sortBy;
        }

        private wrap(l2 : L2Network) : any {
            return new kendo.data.ObservableObject(l2);
        }

        create(l2 : any, done : (ret : L2Network)=>void) {
            var msg : any = null;
            if (l2.type == 'L2NoVlanNetwork') {
                msg = new ApiHeader.APICreateL2NoVlanNetworkMsg();
                msg.type = 'L2NoVlanNetwork';
            } else if (l2.type == 'L2VlanNetwork') {
                msg = new ApiHeader.APICreateL2VlanNetworkMsg();
                msg.type = 'L2VlanNetwork';
                msg.vlan = l2.vlan;
            }
            msg.name = l2.name;
            msg.description = l2.description;
            msg.zoneUuid = l2.zoneUuid;
            msg.physicalInterface = l2.physicalInterface;
            this.api.asyncApi(msg, (ret : ApiHeader.APICreateL2NetworkEvent)=> {
                var c = new L2Network();
                angular.extend(c, ret.inventory);
                done(this.wrap(c));
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Created new L2 Network: {0}',c.name),
                    link: Utils.sprintf('/#/l2Network/{0}', c.uuid)
                });
            });
        }

        query(qobj : ApiHeader.QueryObject, callback : (pss : L2Network[], total: number) => void) : void {
            var msg = new ApiHeader.APIQueryL2NetworkMsg();
            msg.count = qobj.count === true;
            msg.start = qobj.start;
            msg.limit = qobj.limit;
            msg.replyWithCount = true;
            msg.conditions = qobj.conditions ? qobj.conditions : [];
            if (Utils.notNullnotUndefined(this.sortBy) && this.sortBy.isValid()) {
                msg.sortBy = this.sortBy.field;
                msg.sortDirection = this.sortBy.direction;
            }
            this.api.syncApi(msg, (ret : ApiHeader.APIQueryL2NetworkReply)=>{
                var pris = [];
                ret.inventories.forEach((inv : ApiHeader.L2NetworkInventory)=> {
                    var c = new L2Network();
                    angular.extend(c, inv);
                    pris.push(this.wrap(c));
                });
                callback(pris, ret.total);
            });
        }

        attach(l2: L2Network, cluster: MCluster.Cluster, done: ()=>void=null) {
            l2.progressOn();
            var msg = new ApiHeader.APIAttachL2NetworkToClusterMsg();
            msg.clusterUuid = cluster.uuid;
            msg.l2NetworkUuid = l2.uuid;
            this.api.asyncApi(msg, (ret: ApiHeader.APIAttachL2NetworkToClusterEvent)=> {
                l2.updateObservableObject(ret.inventory);
                l2.progressOff();
                if (Utils.notNullnotUndefined(done)) {
                    done();
                }
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Attached L2 Network: {0} to Cluster: {1}', l2.name, cluster.name),
                    link: Utils.sprintf('/#/l2Network/{0}', l2.uuid)
                });
            });
        }

        detach(l2: L2Network, cluster: MCluster.Cluster, done: ()=>void=null) {
            l2.progressOn();
            var msg = new ApiHeader.APIDetachL2NetworkFromClusterMsg();
            msg.clusterUuid = cluster.uuid;
            msg.l2NetworkUuid = l2.uuid;
            this.api.asyncApi(msg, (ret: ApiHeader.APIDetachL2NetworkFromClusterEvent)=> {
                l2.updateObservableObject(ret.inventory);
                l2.progressOff();
                if (Utils.notNullnotUndefined(done)) {
                    done();
                }
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Detached L2 Network: {0} from Cluster: {1}', l2.name, cluster.name),
                    link: Utils.sprintf('/#/l2Network/{0}', l2.uuid)
                });
            });
        }

        delete(l2 : L2Network, done : (ret : any)=>void) {
            l2.progressOn();
            var msg = new ApiHeader.APIDeleteL2NetworkMsg();
            msg.uuid = l2.uuid;
            this.api.asyncApi(msg, (ret : any)=> {
                l2.progressOff();
                done(ret);
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Deleted L2 Network: {0}', l2.name)
                });
            });
        }
    }

    export class L2NetworkModel extends Utils.Model {
        constructor() {
            super();
            this.current = new L2Network();
        }
    }

    class OL2NetworkGrid extends Utils.OGrid {
        constructor($scope: any, private l2Mgr : L2NetworkManager) {
            super();
            super.init($scope, $scope.l2NetworkGrid);
            this.options.columns = [
                {
                    field: 'name',
                    title: '{{"l2Network.ts.NAME" | translate}}',
                    width: '10%',
                    template: '<a href="/\\#/l2Network/{{dataItem.uuid}}">{{dataItem.name}}</a>'
                },
                {
                    field: 'description',
                    title: '{{"l2Network.ts.DESCRIPTION" | translate}}',
                    width: '25%'
                },
                {
                    field: 'physicalInterface',
                    title: '{{"l2Network.ts.PHYSICAL INTERFACE" | translate}}',
                    width: '25%'
                },
                {
                    field: 'type',
                    title: '{{"l2Network.ts.TYPE" | translate}}',
                    width: '20%'
                },
                {
                    field: 'uuid',
                    title: '{{"l2Network.ts.UUID" | translate}}',
                    width: '20%'
                }
            ];

            this.options.dataSource.transport.read = (options)=> {
                var qobj = new ApiHeader.QueryObject();
                qobj.limit = options.data.take;
                qobj.start = options.data.pageSize * (options.data.page - 1);
                l2Mgr.query(qobj, (l2s:L2Network[], total:number)=> {
                    options.success({
                        data: l2s,
                        total: total
                    });
                });
            };
        }
    }

    class Action {
        attachCluster() {
            this.$scope.attachCluster.open();
        }

        detachCluster() {
            this.$scope.detachCluster.open();
        }

        constructor(private $scope : any, private l2Mgr : L2NetworkManager) {
        }
    }

    class FilterBy {
        fieldList: kendo.ui.DropDownListOptions;
        valueList: kendo.ui.DropDownListOptions;
        field: string;
        value: string;
        name: string;

        static NONE = 'none';
        static TYPE = 'type';

        constructor(private $scope : any, private l2Types: string[]) {
            this.fieldList = {
                dataSource: new kendo.data.DataSource({
                    data: [
                        {
                            name: '{{"l2Network.ts.None" | translate}}',
                            value: FilterBy.NONE
                        },
                        {
                            name: '{{"l2Network.ts.Type" | translate}}',
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
                } else if (this.field == FilterBy.TYPE) {
                    this.valueList.dataSource.data(this.l2Types);
                }
            });
        }

        confirm (popover : any) {
            this.$scope.oL2NetworkGrid.setFilter(this.toKendoFilter());
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
        static $inject = ['$scope', 'L2NetworkManager', '$routeParams', 'Tag', 'current', 'ClusterManager'];

        private loadSelf(uuid : string) {
            var qobj = new ApiHeader.QueryObject();
            qobj.addCondition({name: 'uuid', op: '=', value: uuid});
            this.l2Mgr.query(qobj, (l2s : L2Network[], total:number)=> {
                this.$scope.model.current = l2s[0];
            });
        }

        constructor(private $scope : any, private l2Mgr : L2NetworkManager, private $routeParams : any,
                    private tagService : Utils.Tag, current: L2Network, clusterMgr: MCluster.ClusterManager) {
            $scope.model = new L2NetworkModel();
            $scope.model.current = current;

            $scope.funcDelete = (win : any) => {
                win.open();
            };

            $scope.action = new Action($scope, l2Mgr);

            $scope.funcRefresh = ()=> {
                this.loadSelf($scope.model.current.uuid);
            };

            $scope.funcToolbarShow = ()=> {
                return Utils.notNullnotUndefined($scope.model.current);
            };

            $scope.optionsDeleteL2Network = {
                title: 'DELETE L2 NETWORK',
                html: '<strong><p>Deleting L2 Network will cause:</p></strong>' +
                    '<ul><li><strong>Clusters to which this l2Network has attached will be detached</strong></li>' +
                    '<li><strong>l3Networks on this l2Network will be detached</strong></li>' +
                    '<li><strong>VMs whose nic on l3Network belonging to this l2Network will be stopped</strong></li></ul>' +
                    '<strong><p>those results are not recoverable</p></strong>',
                confirm: ()=> {
                    l2Mgr.delete($scope.model.current, (ret : any)=> {
                        $scope.model.resetCurrent();
                    });
                }
            };

            $scope.optionsTag = {
                tags: [],
                createTag: (item)=> {
                    this.tagService.createTag(item.tag, $scope.model.current.uuid, ApiHeader.TagResourceTypeL2NetworkVO, (ret : ApiHeader.TagInventory)=> {
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

            $scope.optionsAttachCluster = {
                l2Network: $scope.model.current,
                done: (cluster: MCluster.Cluster)=> {
                    $scope.optionsClusterGrid.dataSource.insert(0, cluster);
                }
            };

            $scope.optionsDetachCluster = {
                l2Network: $scope.model.current,
                done: (cluster: MCluster.Cluster)=> {
                    var ds = $scope.optionsClusterGrid.dataSource;
                    var cs = ds.data();
                    for (var i=0; i<cs.length; i++) {
                        var tcs = cs[i];
                        if (cluster.uuid == tcs.uuid) {
                            var row = ds.getByUid(tcs.uid);
                            ds.remove(row);
                            break;
                        }
                    }
                }
            };

            $scope.funcLoadClusters = ()=> {
                $scope.optionsClusterGrid.dataSource.read();
            };

            $scope.optionsClusterGrid = {
                pageSize: 20,
                resizable: true,
                scrollable: true,
                pageable: true,
                columns: [
                    {
                        field: 'name',
                        title: '{{"l2Network.ts.NAME" | translate}}',
                        width: '20%',
                        template: '<a href="/\\#/cluster/{{dataItem.uuid}}">{{dataItem.name}}</a>'
                    },
                    {
                        field: 'description',
                        title: '{{"l2Network.ts.DESCRIPTION" | translate}}',
                        width: '20%'
                    },
                    {
                        field: 'state',
                        title: '{{"l2Network.ts.STATE" | translate}}',
                        width: '20%',
                        template: '<span class="{{dataItem.stateLabel()}}">{{dataItem.state}}</span>'

                    },
                    {
                        field: 'hypervisorType',
                        title: '{{"l2Network.ts.HYPERVISOR" | translate}}',
                        width: '20%'
                    },
                    {
                        field: 'uuid',
                        title: '{{"l2Network.ts.UUID" | translate}}',
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
                    schema: {
                        data: 'data',
                        total: 'total'
                    },

                    transport: {
                        read: function(options) {
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
                                name: 'uuid',
                                op: 'in',
                                value: $scope.model.current.attachedClusterUuids.join()
                            });

                            clusterMgr.query(qobj, (clusters: MCluster.Cluster[], total:number)=> {
                                options.success({
                                    data: clusters,
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
        static $inject = ['$scope', 'L2NetworkManager', 'l2NetworkTypes', '$location'];

        constructor(private $scope : any, private l2Mgr : L2NetworkManager, private l2NetworkTypes: string[], private $location : ng.ILocationService) {
            $scope.model = new L2NetworkModel();
            $scope.oL2NetworkGrid = new OL2NetworkGrid($scope, l2Mgr);
            $scope.action = new Action($scope, l2Mgr);
            $scope.optionsSortBy = {
                fields: [
                    {
                        name: '{{"l2Network.ts.Name" | translate}}',
                        value: 'name'
                    },
                    {
                        name: '{{"l2Network.ts.Description" | translate}}',
                        value: 'Description'
                    },
                    {
                        name: '{{"l2Network.ts.Physical Interface" | translate}}',
                        value: 'physicalInterface'
                    },
                    {
                        name: '{{"l2Network.ts.Type" | translate}}',
                        value: 'type'
                    },
                    {
                        name: '{{"l2Network.ts.Created Date" | translate}}',
                        value: 'createDate'
                    },
                    {
                        name: '{{"l2Network.ts.Last Updated Date" | translate}}',
                        value: 'lastOpDate'
                    }
                ],

                done: (ret : Directive.SortByData) => {
                    l2Mgr.setSortBy(ret);
                    $scope.oL2NetworkGrid.refresh();
                }
            };

            $scope.optionsSearch = {
                fields: ApiHeader.L2NetworkInventoryQueryable,
                name: 'L2Network',
                schema: {
                    type: {
                        type: Directive.SearchBoxSchema.VALUE_TYPE_LIST,
                        list: this.l2NetworkTypes,
                        getQueryableFields: (value: string)=> {
                            if (value == 'L2VlanNetwork') {
                                return ApiHeader.L2VlanNetworkInventoryQueryable;
                            } else if (value == 'L2NoVlanNetwork') {
                                return ApiHeader.L2VlanNetworkInventoryQueryable;
                            }
                        },
                        removeCascade: {
                            type: ['vlan']
                        }
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
                    l2Mgr.query(qobj, (l2s : L2Network[], total:number)=> {
                        $scope.oL2NetworkGrid.refresh(l2s);
                    });
                }
            };

            $scope.funcGridDoubleClick = (e) => {
                if (Utils.notNullnotUndefined($scope.model.current)) {
                    var url = Utils.sprintf('/l2Network/{0}', $scope.model.current.uuid);
                    $location.path(url);
                    e.preventDefault();
                }
            };

            $scope.filterBy = new FilterBy($scope, this.l2NetworkTypes);

            $scope.funcSearch = (win : any) => {
                win.open();
            };

            $scope.funcCreateL2Network = (win : any) => {
                win.open();
            };

            $scope.funcDeleteL2Network = () => {
                $scope.deleteL2Network.open();
            };

            $scope.optionsDeleteL2Network = {
                title: 'DELETE L2 NETWORK',
                html: '<strong><p>Deleting L2 Network will cause:</p></strong>' +
                    '<ul><li><strong>Clusters to which this l2Network has attached will be detached</strong></li>' +
                    '<li><strong>l3Networks on this l2Network will be detached</strong></li>' +
                    '<li><strong>VMs whose nic on l3Network belonging to this l2Network will be stopped</strong></li></ul>' +
                    '<strong><p>those results are not recoverable</p></strong>',

                confirm: ()=> {
                    l2Mgr.delete($scope.model.current, (ret : any)=> {
                        $scope.oL2NetworkGrid.deleteCurrent();
                    });
                }
            };

            $scope.funcRefresh = ()=> {
                $scope.oL2NetworkGrid.refresh();
            };

            $scope.funcIsActionShow = ()=> {
                return !Utils.isEmptyObject($scope.model.current);
            };

            $scope.funcIsActionDisabled = ()=> {
                return Utils.notNullnotUndefined($scope.model.current) && $scope.model.current.isInProgress();
            };

            $scope.optionsCreateL2Network = {
                done: (l2 : L2Network) => {
                    $scope.oL2NetworkGrid.add(l2);
                }
            };

            $scope.optionsAttachCluster = {
                l2Network: $scope.model.current,
                done: (cluster: MCluster.Cluster)=> {
                }
            };

            $scope.optionsDetachCluster = {
                l2Network: $scope.model.current,
                done: (cluster: MCluster.Cluster)=> {
                }
            };

            $scope.$watch(()=>{
                return $scope.model.current;
            }, ()=> {
                $scope.optionsAttachCluster.l2Network = $scope.model.current;
                $scope.optionsDetachCluster.l2Network = $scope.model.current;
            });
        }
    }

    export class CreateL2NetworkOptions {
        zone : MZone.Zone;
        done : (L2Network : L2Network)=>void;
    }


    export class CreateL2NetworkModel {
        name: string;
        zoneUuid: string;
        description: string;
        type: string;
        zoneList: kendo.ui.DropDownListOptions;
        physicalInterface: string;
        canCreate() : boolean {
            return angular.isDefined(this.name) && angular.isDefined(this.type) &&
                angular.isDefined(this.zoneUuid) && Utils.notNullnotUndefined(this.physicalInterface);
        }
    }

    export class CreateL2Network implements ng.IDirective {
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
        options: CreateL2NetworkOptions;
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
            var win = this.$scope.winCreateL2Network__;
            var chain = new Utils.Chain();
            this.$scope.clusterList__.value([]);
            this.$scope.button.reset();
            chain.then(()=> {
                if (Utils.notNullnotUndefined(this.options.zone)) {
                    this.$scope.zoneList.dataSource.data(new kendo.data.ObservableArray([this.options.zone]));
                    this.$scope.infoPage.zoneUuid = this.options.zone.uuid;
                    chain.next();
                } else {
                    this.zoneMgr.query(new ApiHeader.QueryObject(), (zones : MZone.Zone[], total:number)=> {
                        this.$scope.zoneList.dataSource.data(zones);
                        if (zones && zones.length > 0) {
                            this.$scope.infoPage.zoneUuid = zones[0].uuid;
                        }
                        chain.next();
                    });
                }
            }).then(()=> {
                this.api.getL2NetworkTypes((l2Types: string[])=> {
                    var types = [];
                    angular.forEach(l2Types, (item)=> {
                        types.push({type: item});
                    });
                    this.$scope.typeList.dataSource.data(new kendo.data.ObservableArray(types));
                    this.$scope.infoPage.type = l2Types[0];
                    chain.next();
                });
            }).done(()=> {
                win.center();
                win.open();
            }).start();
        }

        constructor(private api : Utils.Api, private zoneMgr : MZone.ZoneManager,
                    private l2Mgr : L2NetworkManager, private clusterMgr: MCluster.ClusterManager) {
            this.scope = true;
            this.link = ($scope : any, $element, $attrs : any, $ctrl, $transclude) => {
                var instanceName = $attrs.zCreateL2Network;
                var parentScope = $scope.$parent;
                parentScope[instanceName] = this;
                this.options = new CreateL2NetworkOptions();
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
                    type: null,
                    physicalInterface: null,
                    vlan: null,

                    hasZone() : boolean {
                        return $scope.zoneList.dataSource.data().length > 0;
                    },

                    isVlanValid() : boolean {
                        if (this.type == 'L2VlanNetwork' && Utils.notNullnotUndefined(this.vlan)) {
                            if (isNaN(this.vlan)) {
                                return false;
                            }

                            var vlan = parseInt(this.vlan);
                            return vlan >= 0 && vlan <= 4095;
                        }
                        return true;
                    },

                    canMoveToPrevious(): boolean {
                        return false;
                    },

                    canMoveToNext(): boolean {
                        if (this.type == 'L2NoVlanNetwork') {
                            return Utils.notNullnotUndefined(this.name) && Utils.notNullnotUndefined(this.zoneUuid)
                                && Utils.notNullnotUndefined(this.type) && Utils.notNullnotUndefined(this.physicalInterface);
                        } else if (this.type == 'L2VlanNetwork') {
                            return Utils.notNullnotUndefined(this.name) && Utils.notNullnotUndefined(this.zoneUuid)
                                && Utils.notNullnotUndefined(this.type) && Utils.notNullnotUndefined(this.physicalInterface)
                                && Utils.notNullnotUndefined(this.vlan) && this.isVlanValid();
                        } else {
                            return false;
                        }

                    },

                    show(): void {
                        this.getAnchorElement().tab('show');
                    },

                    getAnchorElement() : any {
                        return $('.nav a[data-target="#createL2NetworkInfo"]');
                    },

                    active(): void {
                        this.activeState = true;
                    },

                    isActive(): boolean {
                        return this.activeState;
                    },

                    getPageName(): string {
                        return 'createL2NetworkInfo';
                    },

                    reset() : void {
                        this.name = Utils.shortHashName('l2');
                        this.zoneUuid = null;
                        this.description = null;
                        this.type = null;
                        this.physicalInterface = null;
                        this.vlan = null;
                        this.activeState = false;
                    },

                    normalize() : void {
                        if (this.type == 'L2NoVlanNetwork') {
                            this.vlan = null;
                        } else {
                            this.vlan = parseInt(this.vlan);
                        }
                    }

                } ;

                var clusterPage: Utils.WizardPage = $scope.clusterPage = {
                    activeState: false,

                    canMoveToPrevious(): boolean {
                        return true;
                    },
                    canMoveToNext(): boolean {
                        return true;
                    },

                    getAnchorElement() : any {
                        return $('.nav a[data-target="#createL2NetworkCluster"]');
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
                        return 'createL2NetworkCluster';
                    },

                    reset() : void {
                        this.activeState = false;
                    },

                    hasCluster() : boolean {
                        return $scope.clusterListOptions__.dataSource.data().length > 0;
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
                        var resultPs : L2Network;
                        var chain = new Utils.Chain();
                        chain.then(()=> {
                            $scope.infoPage.normalize();
                            l2Mgr.create(infoPage, (ret : L2Network)=> {
                                resultPs = ret;
                                chain.next();
                            });
                        }).then(()=>{
                            var clusters = $scope.clusterList__.dataItems();
                            angular.forEach(clusters, (cluster)=> {
                                l2Mgr.attach(resultPs, cluster);
                            });
                            chain.next();
                        }).done(()=> {
                            if (Utils.notNullnotUndefined(this.options.done)) {
                                this.options.done(resultPs);
                            }
                        }).start();

                        $scope.winCreateL2Network__.close();
                    }
                };

                $scope.button = new Utils.WizardButton([
                    infoPage, clusterPage
                ], mediator);

                $scope.$watch(()=>{
                    return $scope.infoPage.zoneUuid;
                }, ()=>{
                    if (Utils.notNullnotUndefined($scope.clusterList__)) {
                        $scope.clusterList__.value([]);
                    }

                    var zuuid = $scope.infoPage.zoneUuid;
                    if (Utils.notNullnotUndefined(zuuid)) {
                        this.queryClusters(zuuid, (clusters:MCluster.Cluster[])=> {
                            $scope.clusterListOptions__.dataSource.data(clusters);
                        });
                    }
                });

                $scope.zoneList = {
                    dataSource: new kendo.data.DataSource({data: []}),
                    dataTextField: "name",
                    dataValueField: "uuid",
                    template: '<div style="color: black"><span class="z-label">{{"l2Network.ts.Name" | translate}}</span>: #: name #</div>'+'<div style="color: black"><span class="z-label">{{"l2Network.ts.State" | translate}}:</span>#: state #</div>'+'<div style="color: black"><span class="z-label">{{"l2Network.ts.UUID" | translate}}:</span> #: uuid #</div>'
                };

                $scope.typeList = {
                    dataSource: new kendo.data.DataSource({data: []}),
                    dataTextField: "type",
                    dataValueField: "type",
                    change: (e)=> {
                        var list = e.sender;
                        Utils.safeApply($scope, ()=> {
                            $scope.model.type = list.value();
                        });
                    }
                };

                $scope.winCreateL2NetworkOptions__ = {
                    width: '700px',
                    //height: '680px',
                    animation: false,
                    modal: true,
                    draggable: false,
                    resizable: false
                };

                $scope.clusterListOptions__ = {
                    dataSource: new kendo.data.DataSource({data: []}),
                    dataTextField: "name",
                    dataValueField: "uuid",
                    itemTemplate: '<div style="color: black"><span class="z-label">Name:</span><span>#: name #</span></div>' +
                        '<div style="color: black"><span class="z-label">HYPERVISOR:</span><span>#: hypervisorType #</span></div>' +
                        '<div style="color: black"><span class="z-label">UUID:</span><span>#: uuid #</span></div>'
                };

                this.$scope = $scope;
            };
            this.restrict = 'EA';
            this.replace = true;
            this.templateUrl = '/static/templates/l2Network/createL2Network.html';
        }
    }

    export class AttachCluster implements ng.IDirective {
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
            this.$scope.clusterList__.value([]);
            var chain  = new Utils.Chain();
            chain.then(()=> {
                var qobj = new ApiHeader.QueryObject();
                qobj.conditions = [
                    {
                        name: 'uuid',
                        op: 'not in',
                        value: this.options.l2Network.attachedClusterUuids.join()
                    },
                    {
                        name: 'zoneUuid',
                        op: '=',
                        value: this.options.l2Network.zoneUuid
                    }
                ];

                this.clusterMgr.query(qobj, (clusters: MCluster.Cluster[])=>{
                    this.$scope.clusterListOptions__.dataSource.data(clusters);
                    chain.next();
                });
            }).done(()=>{
                this.$scope.attachCluster__.center();
                this.$scope.attachCluster__.open();
            }).start();
        }

        constructor(private clusterMgr: MCluster.ClusterManager, private l2Mgr: L2NetworkManager) {
            this.scope = true;
            this.restrict = 'EA';
            this.replace = true;
            this.templateUrl = '/static/templates/l2Network/attachCluster.html';
            this.link = ($scope : any, $element, $attrs : any, $ctrl, $transclude) => {
                var parent = $scope.$parent;
                parent[$attrs.zL2NetworkAttachCluster] = this;
                this.options = parent[$attrs.zOptions];

                $scope.clusterListOptions__ = {
                    dataSource: new kendo.data.DataSource({data: []}),
                    dataTextField: "name",
                    dataValueField: "uuid",
                    itemTemplate: '<div style="color: black"><span class="z-label">Name:</span><span>#: name #</span></div>' +
                        '<div style="color: black"><span class="z-label">HYPERVISOR:</span><span>#: hypervisorType #</span></div>' +
                        '<div style="color: black"><span class="z-label">UUID:</span><span>#: uuid #</span></div>',

                    change: (e)=> {
                        var select = e.sender;
                        Utils.safeApply($scope, ()=> {
                            $scope.selectItemNum = select.dataItems().length;
                        });
                    }
                };

                $scope.selectItemNum = 0;

                $scope.hasCluster = ()=> {
                    return $scope.clusterListOptions__.dataSource.data().length > 0;
                };

                $scope.canProceed = ()=> {
                    return $scope.selectItemNum > 0;
                };

                $scope.cancel = () => {
                    $scope.attachCluster__.close();
                };

                $scope.done = () => {
                    var clusters : MCluster.Cluster = $scope.clusterList__.dataItems();
                    angular.forEach(clusters, (cluster: MCluster.Cluster)=> {
                        l2Mgr.attach(this.options.l2Network, cluster, ()=> {
                            if (Utils.notNullnotUndefined(this.options.done)) {
                                this.options.done(cluster);
                            }
                        });
                    });

                    $scope.attachCluster__.close();
                };

                this.$scope = $scope;
            }
        }
    }

    export class DetachClusterOptions {
        l2Network: L2Network;
        done: (l2 : any)=>void;
    }


    export class DetachCluster implements ng.IDirective {
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

        options : DetachClusterOptions;
        $scope: any;

        open() {
            this.$scope.clusterList__.value([]);
            var chain  = new Utils.Chain();
            chain.then(()=> {
                var qobj = new ApiHeader.QueryObject();
                qobj.conditions = [
                    {
                        name: 'uuid',
                        op: 'in',
                        value: this.options.l2Network.attachedClusterUuids.join()
                    }
                ];

                this.clusterMgr.query(qobj, (clusters: MCluster.Cluster[])=>{
                    this.$scope.clusterListOptions__.dataSource.data(clusters);
                    chain.next();
                });
            }).done(()=>{
                this.$scope.detachCluster__.center();
                this.$scope.detachCluster__.open();
            }).start();
        }


        constructor(private l2Mgr : ML2Network.L2NetworkManager, private clusterMgr: MCluster.ClusterManager) {
            this.scope = true;
            this.restrict = 'EA';
            this.replace = true;
            this.templateUrl = '/static/templates/l2Network/detachCluster.html';
            this.link = ($scope : any, $element, $attrs : any, $ctrl, $transclude) => {
                var parent = $scope.$parent;
                parent[$attrs.zL2NetworkDetachCluster] = this;
                this.options = parent[$attrs.zOptions];
                this.$scope = $scope;

                $scope.uuid = null;
                $scope.clusterListOptions__ = {
                    dataSource: new kendo.data.DataSource({data: []}),
                    dataTextField: "name",
                    dataValueField: "uuid",
                    itemTemplate: '<div style="color: black"><span class="z-label">Name:</span><span>#: name #</span></div>' +
                        '<div style="color: black"><span class="z-label">UUID:</span><span>#: uuid #</span></div>' +
                        '<div style="color: black"><span class="z-label">Hypervisor:</span><span>#: hypervisorType #</span></div>',

                    change: (e)=> {
                        var select = e.sender;
                        Utils.safeApply($scope, ()=> {
                            $scope.selectItemNum = select.dataItems().length;
                        });
                    }
                };

                $scope.selectItemNum = 0;

                $scope.hasCluster = ()=> {
                    return $scope.clusterListOptions__.dataSource.data().length > 0;
                };

                $scope.canProceed = ()=> {
                    return $scope.selectItemNum > 0;
                };

                $scope.cancel = () => {
                    $scope.detachCluster__.close();
                };

                $scope.done = () => {
                    var clusters : MCluster.Cluster[] = $scope.clusterList__.dataItems();
                    angular.forEach(clusters, (cluster: MCluster.Cluster)=> {
                        l2Mgr.detach(this.options.l2Network, cluster, ()=>{
                            if (Utils.notNullnotUndefined(this.options.done)) {
                                this.options.done(cluster);
                            }
                        });
                    });

                    $scope.detachCluster__.close();
                };

                $scope.detachClusterOptions__ = {
                    width: '600px'
                };
            }
        }
    }
}

angular.module('root').factory('L2NetworkManager', ['Api', '$rootScope', (api, $rootScope)=> {
    return new ML2Network.L2NetworkManager(api, $rootScope);
}]).directive('zCreateL2Network', ['Api', 'ZoneManager', 'L2NetworkManager', 'ClusterManager', (api, zoneMgr, l2Mgr, clusterMgr)=> {
    return new ML2Network.CreateL2Network(api, zoneMgr, l2Mgr, clusterMgr);
}]).directive('zL2NetworkAttachCluster', ['ClusterManager', 'L2NetworkManager', (clusterMgr, l2Mgr)=> {
    return new ML2Network.AttachCluster(clusterMgr, l2Mgr);
}]).directive('zL2NetworkDetachCluster', ['L2NetworkManager', 'ClusterManager', (l2Mgr, clusterMgr)=> {
    return new ML2Network.DetachCluster(l2Mgr, clusterMgr);
}]).config(['$routeProvider', function(route) {
    route.when('/l2Network', {
        templateUrl: '/static/templates/l2Network/l2Network.html',
        controller: 'ML2Network.Controller',
        resolve: {
            l2NetworkTypes: function($q : ng.IQService, Api : Utils.Api) {
                var defer = $q.defer();
                Api.getL2NetworkTypes((l2Types: string[])=> {
                    defer.resolve(l2Types);
                });
                return defer.promise;
            }
        }
    }).when('/l2Network/:uuid', {
        templateUrl: '/static/templates/l2Network/details.html',
        controller: 'ML2Network.DetailsController',
        resolve: {
            current: function($q : ng.IQService, $route: any, L2NetworkManager: ML2Network.L2NetworkManager) {
                var defer = $q.defer();
                var qobj = new ApiHeader.QueryObject();
                var uuid = $route.current.params.uuid;
                qobj.addCondition({name: 'uuid', op: '=', value: uuid});
                L2NetworkManager.query(qobj, (l2s: ML2Network.L2Network[])=>{
                    var l2 = l2s[0];
                    defer.resolve(l2);
                });
                return defer.promise;
            }
        }
    });
}]);

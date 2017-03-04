
/// <reference path="d.ts/angularjs/angular.d.ts" />
/// <reference path="d.ts/kendo.all.d.ts" />

module ML3Network {
    export class L3Network extends ApiHeader.L3NetworkInventory {
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
        systemLabel() : string{
            if (this.system) {
                return 'label label-primary';
            }
            return null;
        }

        updateObservableObject(inv : ApiHeader.L3NetworkInventory) {
            // self : ObservableObject
            var self : any = this;
            self.set('uuid', inv.uuid);
            self.set('name', inv.name);
            self.set('description', inv.description);
            self.set('state', inv.state);
            self.set('zoneUuid', inv.zoneUuid);
            self.set('l2NetworkUuid', inv.l2NetworkUuid);
            self.set('dnsDomain', inv.dnsDomain);
            self.set('type', inv.type);
            self.set('createDate', inv.createDate);
            self.set('lastOpDate', inv.lastOpDate);
            self.set('dns', inv.dns);
            self.set('ipRanges', inv.ipRanges);
            self.set('system', inv.system);
            self.set('networkServices', inv.networkServices);
        }
    }

    export class L3NetworkManager {
        static $inject = ['Api', '$rootScope'];

        constructor(private api : Utils.Api, private $rootScope: ng.IRootScopeService) {
        }

        private sortBy : Directive.SortByData;

        setSortBy(sortBy : Directive.SortByData) {
            this.sortBy = sortBy;
        }

        private wrap(l3 : L3Network) : any {
            return new kendo.data.ObservableObject(l3);
        }


        disable(l3 : L3Network) {
            l3.progressOn();
            var msg = new ApiHeader.APIChangeL3NetworkStateMsg();
            msg.stateEvent = 'disable';
            msg.uuid = l3.uuid;
            this.api.asyncApi(msg, (ret : ApiHeader.APIChangeL3NetworkStateEvent) => {
                l3.updateObservableObject(ret.inventory);
                l3.progressOff();
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Disabled L3Network: {0}',l3.name),
                    link: Utils.sprintf('/#/l3/{0}', l3.uuid)
                });
            });
        }

        enable(l3 : L3Network) {
            l3.progressOn();
            var msg = new ApiHeader.APIChangeL3NetworkStateMsg();
            msg.stateEvent = 'enable';
            msg.uuid = l3.uuid;
            this.api.asyncApi(msg, (ret : ApiHeader.APIChangeL3NetworkStateEvent) => {
                l3.updateObservableObject(ret.inventory);
                l3.progressOff();
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Enabled L3Network: {0}', l3.name),
                    link: Utils.sprintf('/#/l3/{0}', l3.uuid)
                });
            });
        }

        queryNetworkServiceProvider(providerUuids: string[], done: (providers: ApiHeader.NetworkServiceProviderInventory[])=>void) {
            var msg = new ApiHeader.APIQueryNetworkServiceProviderMsg();
            if (providerUuids.length !=0) {
                msg.conditions = [
                    {
                        name: 'uuid',
                        op: 'in',
                        value: providerUuids.join()
                    }
                ];
            } else {
                msg.conditions = [];
            }

            this.api.syncApi(msg, (ret: ApiHeader.APIQueryNetworkServiceProviderReply)=> {
                done(ret.inventories);
            });
        }

        addDns(l3: L3Network, dns: any, done: ()=>void) {
            var msg = new ApiHeader.APIAddDnsToL3NetworkMsg();
            msg.dns = dns;
            msg.l3NetworkUuid = l3.uuid;
            this.api.asyncApi(msg, (ret: ApiHeader.APIAddDnsToL3NetworkEvent)=> {
                done();
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Added DNS{0} to L3 Network: {1}', dns, l3.name),
                    link: Utils.sprintf('/#/l3Network/{0}', l3.uuid)
                });
            });
        }

        deleteDns(l3: L3Network, dns:string, done:()=>void) {
            var msg = new ApiHeader.APIRemoveDnsFromL3NetworkMsg();
            msg.l3NetworkUuid = l3.uuid;
            msg.dns = dns;
            this.api.asyncApi(msg, (ret: ApiHeader.APIRemoveDnsFromL3NetworkEvent)=> {
                if (Utils.notNullnotUndefined(done)) {
                    done();
                }
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Removed ip DNS{0} from L3 Network: {1}', dns, l3.name),
                    link: Utils.sprintf('/#/l3Network/{0}', l3.uuid)
                });
            });
        }

        addIpRangeByCidr(l3: L3Network, ipr: any, done: (ipr: ApiHeader.IpRangeInventory)=>void) {
            var msg = new ApiHeader.APIAddIpRangeByNetworkCidrMsg();
            msg.l3NetworkUuid  = l3.uuid;
            msg.name = ipr.name;
            msg.description = ipr.description;
            msg.networkCidr = ipr.networkCidr;
            this.api.asyncApi(msg, (ret: ApiHeader.APIAddIpRangeByNetworkCidrEvent)=> {
                done(ret.inventory);
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Add ip range to L3 Network: {0}',l3.name),
                    link: Utils.sprintf('/#/l3Network/{0}', l3.uuid)
                });
            });
        }

        addIpRange(l3: L3Network, ipr: any, done: (ipr: ApiHeader.IpRangeInventory)=>void) {
            var msg = new ApiHeader.APIAddIpRangeMsg();
            msg.l3NetworkUuid = l3.uuid;
            msg.startIp = ipr.startIp;
            msg.endIp = ipr.endIp;
            msg.gateway = ipr.gateway;
            msg.netmask = ipr.netmask;
            msg.name = ipr.name;
            msg.description = ipr.description;
            this.api.asyncApi(msg, (ret: ApiHeader.APIAddIpRangeEvent)=> {
                done(ret.inventory);
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Add ip range to L3 Network: {0}',l3.name),
                    link: Utils.sprintf('/#/l3Network/{0}', l3.uuid)
                });
            });
        }

        deleteIpRange(ipr: ApiHeader.IpRangeInventory, done:()=>void) {
            var msg = new ApiHeader.APIDeleteIpRangeMsg();
            msg.uuid = ipr.uuid;
            this.api.asyncApi(msg, (ret: ApiHeader.APIDeleteIpRangeEvent)=> {
                if (Utils.notNullnotUndefined(done)) {
                    done();
                    this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                        msg: Utils.sprintf('Deleted ip range: {0}',ipr.name),
                        link: Utils.sprintf('/#/l3Network/{0}', ipr.l3NetworkUuid)
                    });
                }
            });
        }

        attachNetworkService(l3 : L3Network, ns:any, done: ()=>void) {
            var msg = new ApiHeader.APIAttachNetworkServiceToL3NetworkMsg();
            msg.l3NetworkUuid = l3.uuid;
            msg.networkServices = ns;
            this.api.asyncApi(msg, (ret: ApiHeader.APIAttachNetworkServiceToL3NetworkEvent)=> {
                done();
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Attached network services to L3 Network: {0}',l3.name),
                    link: Utils.sprintf('/#/l3Network/{0}', l3.uuid)
                });
            });
        }

        create(l3 : any, done : (ret : L3Network)=>void) {
            var msg : any = null;
            msg = new ApiHeader.APICreateL3NetworkMsg();
            msg.type = 'L3BasicNetwork';
            msg.name = l3.name;
            msg.description = l3.description;
            msg.l2NetworkUuid = l3.l2NetworkUuid;
            msg.system = l3.system;
            msg.dnsDomain = l3.dnsDomain;
            this.api.asyncApi(msg, (ret : ApiHeader.APICreateL3NetworkEvent)=> {
                var c = new L3Network();
                angular.extend(c, ret.inventory);
                done(this.wrap(c));
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Created new L3 Network: {0}',c.name),
                    link: Utils.sprintf('/#/l3Network/{0}', c.uuid)
                });
            });
        }

        query(qobj : ApiHeader.QueryObject, callback : (pss : L3Network[], total: number) => void) : void {
            var msg = new ApiHeader.APIQueryL3NetworkMsg();
            msg.count = qobj.count === true;
            msg.start = qobj.start;
            msg.limit = qobj.limit;
            msg.replyWithCount = true;
            msg.conditions = qobj.conditions ? qobj.conditions : [];
            if (Utils.notNullnotUndefined(this.sortBy) && this.sortBy.isValid()) {
                msg.sortBy = this.sortBy.field;
                msg.sortDirection = this.sortBy.direction;
            }
            this.api.syncApi(msg, (ret : ApiHeader.APIQueryL3NetworkReply)=>{
                var pris = [];
                ret.inventories.forEach((inv : ApiHeader.L3NetworkInventory)=> {
                    var c = new L3Network();
                    angular.extend(c, inv);
                    pris.push(this.wrap(c));
                });
                callback(pris, ret.total);
            });
        }

        delete(l3 : L3Network, done : (ret : any)=>void) {
            l3.progressOn();
            var msg = new ApiHeader.APIDeleteL3NetworkMsg();
            msg.uuid = l3.uuid;
            this.api.asyncApi(msg, (ret : any)=> {
                l3.progressOff();
                done(ret);
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Deleted L2 Network: {0}', l3.name)
                });
            });
        }
    }

    export class L3NetworkModel extends Utils.Model {
        constructor() {
            super();
            this.current = new L3Network();
        }
    }

    class OL3NetworkGrid extends Utils.OGrid {
        constructor($scope: any, private l3Mgr : L3NetworkManager) {
            super();
            super.init($scope, $scope.l3NetworkGrid);
            this.options.columns = [
                {
                    field: 'name',
                    title: '{{"l3Network.ts.NAME" | translate}}',
                    width: '15%',
                    template: '<a href="/\\#/l3Network/{{dataItem.uuid}}">{{dataItem.name}}</a>'
                },
                {
                    field: 'description',
                    title: '{{"l3Network.ts.DESCRIPTION" | translate}}',
                    width: '20%'
                },
                {
                    field: 'state',
                    title: '{{"l3Network.ts.STATE" | translate}}',
                    width: '10%',
                    template: '<span class="{{dataItem.stateLabel()}}">{{dataItem.state}}</span>'
                },
                {
                    field: 'type',
                    title: '{{"l3Network.ts.TYPE" | translate}}',
                    width: '15%'
                },
                {
                    field: 'system',
                    title: '{{"l3Network.ts.SYSTEM NETWORK" | translate}}',
                    width: '15%',
                    template: '<span class="{{dataItem.systemLabel()}}">{{dataItem.system ? "TRUE" : "" }}</span>'
                },
                {
                    field: 'uuid',
                    title: '{{"l3Network.ts.UUID" | translate}}',
                    width: '25%'
                }
            ];

            this.options.dataSource.transport.read = (options)=> {
                var qobj = new ApiHeader.QueryObject();
                qobj.limit = options.data.take;
                qobj.start = options.data.pageSize * (options.data.page - 1);
                l3Mgr.query(qobj, (l3s:L3Network[], total:number)=> {
                    options.success({
                        data: l3s,
                        total: total
                    });
                });
            };
        }
    }

    class Action {
        constructor(private $scope : any, private l3Mgr : L3NetworkManager) {
        }

        enable() {
            this.l3Mgr.enable(this.$scope.model.current);
        }

        disable() {
            this.l3Mgr.disable(this.$scope.model.current);
        }

        addIpRange() {
            this.$scope.winAddIpRange.open();
        }

        deleteIpRange() {
            this.$scope.winDeleteIpRange.open();
        }

        addDns() {
            this.$scope.winAddDns.open();
        }

        deleteDns() {
            this.$scope.winDeleteDns.open();
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
        static STATE = 'state';

        constructor(private $scope : any, private l3Types: string[]) {
            this.fieldList = {
                dataSource: new kendo.data.DataSource({
                    data: [
                        {
                            name: '{{"l3Network.ts.None" | translate}}',
                            value: FilterBy.NONE
                        },
                        {
                            name: '{{"l3Network.ts.Type" | translate}}',
                            value: FilterBy.TYPE
                        },
                        {
                            name: '{{"l3Network.ts.State" | translate}}',
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
                } else if (this.field == FilterBy.TYPE) {
                    this.valueList.dataSource.data(this.l3Types);
                } else if (this.field == FilterBy.STATE) {
                    this.valueList.dataSource.data(['Enabled', 'Disabled']);
                }
            });
        }

        confirm (popover : any) {
            this.$scope.oL3NetworkGrid.setFilter(this.toKendoFilter());
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
        static $inject = ['$scope', 'L3NetworkManager', '$routeParams', 'Tag', 'current'];

        private loadSelf(uuid : string) {
            var qobj = new ApiHeader.QueryObject();
            qobj.addCondition({name: 'uuid', op: '=', value: uuid});
            this.l3Mgr.query(qobj, (l3s : L3Network[], total:number)=> {
                this.$scope.model.current = l3s[0];
            });
        }

        constructor(private $scope : any, private l3Mgr : L3NetworkManager, private $routeParams : any,
                    private tagService : Utils.Tag, current: L3Network) {
            $scope.model = new L3NetworkModel();
            $scope.model.current = current;

            $scope.funcDelete = (win : any) => {
                win.open();
            };

            $scope.action = new Action($scope, l3Mgr);

            $scope.funcRefresh = ()=> {
                this.loadSelf($scope.model.current.uuid);
            };

            $scope.funcToolbarShow = ()=> {
                return Utils.notNullnotUndefined($scope.model.current);
            };

            $scope.optionsDeleteL3Network = {
                title: 'DELETE L3 NETWORK',
                html: '<strong><p>Deleting L2 Network will cause:</p></strong>' +
                    '<ul><li><strong>Ip ranges on this l3Network will be deleted</strong></li>' +
                    '<li><strong>DNS on this l3Network will be deleted</strong></li>' +
                    '<li><strong>Virtual Router on this l3Network will be deleted</strong></li>' +
                    '<li><strong>VMs whose nic belongs to this l3Network will be stopped</strong></li></ul>' +
                    '<strong><p>those results are not recoverable</p></strong>',
                confirm: ()=> {
                    l3Mgr.delete($scope.model.current, (ret : any)=> {
                        $scope.model.resetCurrent();
                    });
                }
            };

            $scope.optionsTag = {
                tags: [],
                createTag: (item)=> {
                    this.tagService.createTag(item.tag, $scope.model.current.uuid, ApiHeader.TagResourceTypeL3NetworkVO, (ret : ApiHeader.TagInventory)=> {
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

            $scope.optionsIpRangeGrid = {
                pageSize: 20,
                resizable: true,
                scrollable: true,
                pageable: true,
                columns: [
                    {
                        field: 'name',
                        title: '{{"l3Network.ts.NAME" | translate}}',
                        width: '10%'
                    },
                    {
                        field: 'startIp',
                        title: '{{"l3Network.ts.START IP" | translate}}',
                        width: '18%'

                    },
                    {
                        field: 'endIp',
                        title: '{{"l3Network.ts.END IP" | translate}}',
                        width: '18%'
                    },
                    {
                        field: 'netmask',
                        title: '{{"l3Network.ts.NETMASK" | translate}}',
                        width: '18%'
                    },
                    {
                        field: 'gateway',
                        title: '{{"l3Network.ts.GATEWAY" | translate}}',
                        width: '18%'
                    },
                    {
                        field: 'networkCidr',
                        title: '{{"l3Network.ts.NETWORK CIDR" | translate}}',
                        width: '18%'
                    }
                ],

                dataBound: (e)=> {
                    var grid = e.sender;
                    if (grid.dataSource.totalPages() == 1) {
                        grid.pager.element.hide();
                    }
                },

                dataSource: new kendo.data.DataSource([])
            };

            $scope.optionsIpRangeGrid.dataSource.data(current.ipRanges);

            $scope.optionsDnsGrid = {
                pageSize: 20,
                resizable: true,
                scrollable: true,
                pageable: true,
                columns: [
                    {
                        field: 'dns',
                        title: 'DNS',
                        width: '100%'
                    }
                ],

                dataBound: (e)=> {
                    var grid = e.sender;
                    if (grid.dataSource.totalPages() == 1) {
                        grid.pager.element.hide();
                    }
                },

                dataSource: new kendo.data.DataSource([])
            };

            var dns = [];
            angular.forEach(current.dns, (it)=>{
                dns.push({
                    dns: it
                });
            });
            $scope.optionsDnsGrid.dataSource.data(dns);

            $scope.optionsNetworkServiceGrid = {
                pageSize: 20,
                resizable: true,
                scrollable: true,
                pageable: true,
                columns: [
                    {
                        field: 'service',
                        title: '{{"l3Network.ts.SERVICE" | translate}}',
                        width: '50%'
                    },
                    {
                        field: 'provider',
                        title: '{{"l3Network.ts.PROVIDER" | translate}}',
                        width: '50%'
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
                            if (!Utils.notNullnotUndefined(current.uuid)) {
                                options.success({
                                    data: [],
                                    total: 0
                                });
                                return;
                            }

                            var providerUuids: string[] = [];
                            angular.forEach(current.networkServices, (nws)=> {
                                providerUuids.push(nws.networkServiceProviderUuid);
                            });

                            l3Mgr.queryNetworkServiceProvider(providerUuids, (providers: ApiHeader.NetworkServiceProviderInventory[])=> {
                                var names = {};
                                angular.forEach(providers, (it)=> {
                                    names[it.uuid] = it;
                                });

                                var data = [];
                                angular.forEach(current.networkServices, (it)=> {
                                    data.push({
                                        service: it.networkServiceType,
                                        provider: names[it.networkServiceProviderUuid].name
                                    });
                                });

                                options.success({
                                    data: data,
                                    total: data.length
                                });
                            });
                        }
                    }
                })
            };

            $scope.optionsAddDns = {
                l3Network: current,
                done: (dns: string) => {
                    $scope.optionsDnsGrid.dataSource.insert(0, {dns: dns});
                }
            };

            $scope.optionsAddIpRange = {
                l3Network: current,
                done: (ipr : ApiHeader.IpRangeInventory)=> {
                    $scope.optionsIpRangeGrid.dataSource.insert(0, ipr);
                }
            };

            $scope.optionsDeleteIpRange = {
                l3Network: current,
                done: (ipr : ApiHeader.IpRangeInventory)=> {
                    var ds = $scope.optionsIpRangeGrid.dataSource;
                    var cs = ds.data();
                    for (var i=0; i<cs.length; i++) {
                        var tcs = cs[i];
                        if (ipr.uuid == tcs.uuid) {
                            var row = ds.getByUid(tcs.uid);
                            ds.remove(row);
                            break;
                        }
                    }
                }
            };

            $scope.optionsDeleteDns = {
                l3Network: current,
                done: (dns : string)=> {
                    var ds = $scope.optionsDnsGrid.dataSource;
                    var cs = ds.data();
                    for (var i=0; i<cs.length; i++) {
                        var tcs = cs[i];
                        if (dns == tcs.dns) {
                            var row = ds.getByUid(tcs.uid);
                            ds.remove(row);
                            break;
                        }
                    }
                }
            };
        }
    }

    export class Controller {
        static $inject = ['$scope', 'L3NetworkManager', 'l3NetworkTypes', '$location'];

        constructor(private $scope : any, private l3Mgr : L3NetworkManager, private l3NetworkTypes: string[], private $location : ng.ILocationService) {
            $scope.model = new L3NetworkModel();
            $scope.oL3NetworkGrid = new OL3NetworkGrid($scope, l3Mgr);
            $scope.action = new Action($scope, l3Mgr);
            $scope.optionsSortBy = {
                fields: [
                    {
                        name: '{{"l3Network.ts.Name" | translate}}',
                        value: 'name'
                    },
                    {
                        name: '{{"l3Network.ts.Description" | translate}}',
                        value: 'description'
                    },
                    {
                        name: '{{"l3Network.ts.State" | translate}}',
                        value: 'state'
                    },
                    {
                        name: '{{"l3Network.ts.Type" | translate}}',
                        value: 'type'
                    },
                    {
                        name: '{{"l3Network.ts.Created Date" | translate}}',
                        value: 'createDate'
                    },
                    {
                        name: '{{"l3Network.ts.Last Updated Date" | translate}}',
                        value: 'lastOpDate'
                    }
                ],

                done: (ret : Directive.SortByData) => {
                    l3Mgr.setSortBy(ret);
                    $scope.oL3NetworkGrid.refresh();
                }
            };

            $scope.optionsSearch = {
                fields: ApiHeader.L3NetworkInventoryQueryable,
                name: 'L3Network',
                schema: {
                    type: {
                        type: Directive.SearchBoxSchema.VALUE_TYPE_LIST,
                        list: this.l3NetworkTypes
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
                    l3Mgr.query(qobj, (l3s : L3Network[], total:number)=> {
                        $scope.oL3NetworkGrid.refresh(l3s);
                    });
                }
            };

            $scope.funcGridDoubleClick = (e) => {
                if (Utils.notNullnotUndefined($scope.model.current)) {
                    var url = Utils.sprintf('/l3Network/{0}', $scope.model.current.uuid);
                    $location.path(url);
                    e.preventDefault();
                }
            };

            $scope.filterBy = new FilterBy($scope, this.l3NetworkTypes);

            $scope.funcSearch = (win : any) => {
                win.open();
            };

            $scope.funcCreateL3Network = (win : any) => {
                win.open();
            };

            $scope.funcDeleteL3Network = () => {
                $scope.deleteL3Network.open();
            };

            $scope.optionsDeleteL3Network = {
                title: 'DELETE L3 NETWORK',
                html: '<strong><p>Deleting L2 Network will cause:</p></strong>' +
                    '<ul><li><strong>Ip ranges on this l3Network will be deleted</strong></li>' +
                    '<li><strong>DNS on this l3Network will be deleted</strong></li>' +
                    '<li><strong>Virtual Router on this l3Network will be deleted</strong></li>' +
                    '<li><strong>VMs whose nic belongs to this l3Network will be stopped</strong></li></ul>' +
                    '<strong><p>those results are not recoverable</p></strong>',

                confirm: ()=> {
                    l3Mgr.delete($scope.model.current, (ret : any)=> {
                        $scope.oL3NetworkGrid.deleteCurrent();
                    });
                }
            };

            $scope.funcRefresh = ()=> {
                $scope.oL3NetworkGrid.refresh();
            };

            $scope.funcIsActionShow = ()=> {
                return !Utils.isEmptyObject($scope.model.current);
            };

            $scope.funcIsActionDisabled = ()=> {
                return Utils.notNullnotUndefined($scope.model.current) && $scope.model.current.isInProgress();
            };

            $scope.optionsCreateL3Network = {
                done: (l3 : L3Network) => {
                    $scope.oL3NetworkGrid.add(l3);
                }
            };

            $scope.optionsAddIpRange = {
                l3Network: null
            };

            $scope.optionsDeleteIpRange = {
                l3Network: null
            };

            $scope.optionsAddDns = {
                l3Network: null,
                done: (dns: string)=> {
                    $scope.model.current.dns.push(dns);
                }
            };

            $scope.optionsDeleteDns = {
                l3Network: null
            };

            $scope.$watch(()=>{
                return $scope.model.current;
            }, ()=>{
                if (Utils.notNullnotUndefined($scope.model.current)) {
                    $scope.optionsAddIpRange.l3Network = $scope.model.current;
                    $scope.optionsDeleteIpRange.l3Network = $scope.model.current;
                    $scope.optionsAddDns.l3Network = $scope.model.current;
                    $scope.optionsDeleteDns.l3Network = $scope.model.current;
                }
            });
        }
    }

    export class AddDnsOptions {
        l3Network: L3Network;
        done: (dns: string)=>void;
    }

    export class AddDns implements ng.IDirective {
        link:(scope:ng.IScope, instanceElement:ng.IAugmentedJQuery, instanceAttributes:ng.IAttributes, controller:any, transclude:ng.ITranscludeFunction) => void;
        scope:any;
        controller:any;
        restrict:string;
        replace:boolean;
        templateUrl:any;
        options:AddDnsOptions;
        $scope:any;

        open() {
            this.$scope.dns = null;
            this.$scope.addDns__.center();
            this.$scope.addDns__.open();
        }

        constructor(l3Mgr: L3NetworkManager) {
            this.scope = true;
            this.link = ($scope : any, $element, $attrs : any, $ctrl, $transclude) => {
                var instanceName = $attrs.zAddDns;
                var parentScope = $scope.$parent;
                parentScope[instanceName] = this;
                this.options = new AddDnsOptions();
                var optionName = $attrs.zOptions;
                if (angular.isDefined(optionName)) {
                    this.options = parentScope[optionName];
                    $scope.$watch(()=> {
                        return parentScope[optionName];
                    }, ()=> {
                        this.options = parentScope[optionName];
                    });
                }

                $scope.optionsAddDns__ = {
                    width: 500
                };

                $scope.canProceed = ():boolean => {
                    return Utils.notNullnotUndefined($scope.dns);
                };

                $scope.cancel = () => {
                    $scope.addDns__.close();
                };

                $scope.done = () => {
                    l3Mgr.addDns(this.options.l3Network, $scope.dns, ()=>{
                        if (Utils.notNullnotUndefined(this.options.done)) {
                            this.options.done($scope.dns);
                        }
                    });
                    $scope.addDns__.close();
                };

                $scope.isDnsValid = () => {
                    if (Utils.notNullnotUndefined($scope.dns)) {
                        return Utils.isIpv4Address($scope.dns);
                    }
                    return true;
                };

                this.$scope = $scope;
            };

            this.restrict = 'EA';
            this.replace = true;
            this.templateUrl = '/static/templates/l3Network/addDns.html';
        }
    }

    export class AddIpRangeOptions {
        l3Network: L3Network;
        done: (ipr: ApiHeader.IpRangeInventory)=>void;
    }

    export class AddIpRange implements ng.IDirective {
        link:(scope:ng.IScope, instanceElement:ng.IAugmentedJQuery, instanceAttributes:ng.IAttributes, controller:any, transclude:ng.ITranscludeFunction) => void;
        scope:any;
        controller:any;
        restrict:string;
        replace:boolean;
        templateUrl:any;
        options:AddIpRangeOptions;
        $scope:any;

        open() {
            this.$scope.info = {};
            this.$scope.info.startIp = null;
            this.$scope.info.description = null;
            this.$scope.info.name = Utils.shortHashName('ipr');
            this.$scope.info.endIp = null;
            this.$scope.info.netmask = null;
            this.$scope.info.gateway = null;
            this.$scope.info.method = 'cidr';
            this.$scope.info.cidr = null;
            this.$scope.addIpRange__.center();
            this.$scope.addIpRange__.open();
        }

        constructor(l3Mgr: L3NetworkManager) {
            this.scope = true;
            this.link = ($scope : any, $element, $attrs : any, $ctrl, $transclude) => {
                var instanceName = $attrs.zAddIpRange;
                var parentScope = $scope.$parent;
                parentScope[instanceName] = this;
                this.options = new AddIpRangeOptions();
                var optionName = $attrs.zOptions;
                if (angular.isDefined(optionName)) {
                    this.options = parentScope[optionName];
                    $scope.$watch(()=> {
                        return parentScope[optionName];
                    }, ()=> {
                        this.options = parentScope[optionName];
                    });
                }

                $scope.info = {
                    name: null,
                    description: null,
                    startIp: null,
                    endIp: null,
                    gateway: null,
                    netmask: null,
                    method: 'cidr',
                    cidr: null
                };

                $scope.optionsAddIpRange__ = {
                    width: "500px"
                };

                $scope.methodOptions__ = {
                    dataSource: new kendo.data.DataSource({
                        data: [{
                            name: "Add By CIDR",
                            field: "cidr"
                        },{
                            name: "Add By IP Range",
                            field: "range"
                        }]
                    }),
                    dataTextField: "name",
                    dataValueField: "field"
                };

                $scope.isNetworkCidrValid = () => {
                    if (Utils.notNullnotUndefined($scope.info.cidr)) {
                        return Utils.isValidCidr($scope.info.cidr);
                    }
                    return true;
                };

                $scope.canProceed = () => {
                    if ($scope.info.method == 'range') {
                        return Utils.notNullnotUndefined($scope.info.name) && Utils.notNullnotUndefined($scope.info.startIp)
                            && Utils.notNullnotUndefined($scope.info.endIp) && Utils.notNullnotUndefined($scope.info.netmask)
                            && Utils.notNullnotUndefined($scope.info.gateway) && $scope.isStartIpValid()
                            && $scope.isEndIpValid() && $scope.isNetmaskValid() && $scope.isGatewayValid();
                    } else {
                        return Utils.notNullnotUndefined($scope.info.cidr) && $scope.isNetworkCidrValid();
                    }
                };

                $scope.cancel = () => {
                    $scope.addIpRange__.close();
                };

                $scope.done = () => {
                    if ($scope.info.method == 'range') {
                        l3Mgr.addIpRange(this.options.l3Network, {
                            name: $scope.info.name,
                            description: $scope.info.description,
                            startIp: $scope.info.startIp,
                            endIp: $scope.info.endIp,
                            netmask: $scope.info.netmask,
                            gateway: $scope.info.gateway
                        }, (ipr:ApiHeader.IpRangeInventory)=>{
                            if (Utils.notNullnotUndefined(this.options.done)) {
                                this.options.done(ipr);
                            }
                        });
                    } else {
                        l3Mgr.addIpRangeByCidr(this.options.l3Network, {
                            name: $scope.info.name,
                            description: $scope.info.description,
                            networkCidr: $scope.info.cidr,
                        }, (ipr:ApiHeader.IpRangeInventory)=>{
                            if (Utils.notNullnotUndefined(this.options.done)) {
                                this.options.done(ipr);
                            }
                        });
                    }

                    $scope.addIpRange__.close();
                };

                $scope.isStartIpValid = () => {
                    if (Utils.notNullnotUndefined($scope.info.startIp)) {
                        return Utils.isIpv4Address($scope.info.startIp);
                    }
                    return true;
                },

                $scope.isEndIpValid = () => {
                    if (Utils.notNullnotUndefined($scope.info.endIp)) {
                        return Utils.isIpv4Address($scope.info.endIp);
                    }
                    return true;
                },

                $scope.isNetmaskValid = () => {
                    if (Utils.notNullnotUndefined($scope.info.netmask)) {
                        return Utils.isIpv4Address($scope.info.netmask);
                    }
                    return true;
                },

                $scope.isGatewayValid = () => {
                    if (Utils.notNullnotUndefined($scope.info.gateway)) {
                        return Utils.isIpv4Address($scope.info.gateway);
                    }
                    return true;
                },

                this.$scope = $scope;
            };

            this.restrict = 'EA';
            this.replace = true;
            this.templateUrl = '/static/templates/l3Network/addIpRange.html';
        }
    }

    export class CreateL3NetworkOptions {
        zone : MZone.Zone;
        done : (L3Network : L3Network)=>void;
    }

    export class CreateL3NetworkModel {
        name: string;
        description: string;
        type: string;
        l2NetworkUuid: string;
        zoneList: kendo.ui.DropDownListOptions;
        canCreate() : boolean {
            return angular.isDefined(this.name) && angular.isDefined(this.type) &&
                angular.isDefined(this.l2NetworkUuid);
        }
    }

    export class CreateL3Network implements ng.IDirective {
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
        options: CreateL3NetworkOptions;
        $scope: any;
        networkServiceProviders : any;

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
            var win = this.$scope.winCreateL3Network__;
            var chain = new Utils.Chain();
            this.$scope.infoPage.zoneUuid = null;
            this.$scope.optionsL2NetworkList__.dataSource.data([]);
            this.$scope.optionsIpRangeGrid__.dataSource.data([]);
            this.$scope.button.reset();
            chain.then(()=> {
                if (Utils.notNullnotUndefined(this.options.zone)) {
                    this.$scope.optionsZoneList__.dataSource.data(new kendo.data.ObservableArray([this.options.zone]));
                    this.$scope.infoPage.zoneUuid = this.options.zone.uuid;
                    chain.next();
                } else {
                    this.zoneMgr.query(new ApiHeader.QueryObject(), (zones : MZone.Zone[], total:number)=> {
                        this.$scope.optionsZoneList__.dataSource.data(zones);
                        if (zones.length > 0) {
                            this.$scope.infoPage.zoneUuid = zones[0].uuid;
                        }
                        chain.next();
                    });
                }
            }).then(()=> {
                this.api.getL3NetworkTypes((l3Types: string[])=> {
                    var types = [];
                    angular.forEach(l3Types, (item)=> {
                        types.push({type: item});
                    });
                    this.$scope.optionsL3NetworkTypeList__.dataSource.data(types);
                    this.$scope.infoPage.type = l3Types[0];
                    chain.next();
                });
            }).then(()=> {
                this.l3Mgr.queryNetworkServiceProvider([], (providers: ApiHeader.NetworkServiceProviderInventory[])=> {
                    this.networkServiceProviders = {};
                    angular.forEach(providers, (pro : ApiHeader.NetworkServiceProviderInventory)=> {
                        if ((pro.type == "vrouter") && (pro.networkServiceTypes.indexOf("IPsec") > -1)){
                            pro.networkServiceTypes.splice(pro.networkServiceTypes.indexOf("IPsec"), 1);
                        }
                        this.networkServiceProviders[pro.uuid] = pro;
                    });

                    this.$scope.optionsProviderList__.dataSource.data(providers);
                    var cpro = providers[0];
                    this.$scope.optionsServiceList__.dataSource.data(cpro.networkServiceTypes);
                    chain.next();
                });
            }).done(()=> {
                win.center();
                win.open();
            }).start();
        }

        constructor(private api : Utils.Api, private zoneMgr : MZone.ZoneManager,
                    private l3Mgr : L3NetworkManager, private l2Mgr: ML2Network.L2NetworkManager) {
            this.scope = true;
            this.link = ($scope : any, $element, $attrs : any, $ctrl, $transclude) => {
                var instanceName = $attrs.zCreateL3Network;
                var parentScope = $scope.$parent;
                parentScope[instanceName] = this;
                this.options = new CreateL3NetworkOptions();
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
                    type: null,
                    l2NetworkUuid: null,
                    system: false,
                    dnsDomain: null,

                    hasL2Network() : boolean {
                        return $scope.optionsL2NetworkList__.dataSource.data().length > 0;
                    },

                    canMoveToPrevious(): boolean {
                        return false;
                    },

                    canMoveToNext(): boolean {
                        return Utils.notNullnotUndefined(this.name) && Utils.notNullnotUndefined(this.l2NetworkUuid)
                            && Utils.notNullnotUndefined(this.type);
                    },

                    show(): void {
                        this.getAnchorElement().tab('show');
                    },

                    getAnchorElement() : any {
                        return $('.nav a[data-target="#createL3NetworkInfo"]');
                    },

                    active(): void {
                        this.activeState = true;
                    },

                    isActive(): boolean {
                        return this.activeState;
                    },

                    getPageName(): string {
                        return 'createL3NetworkInfo';
                    },

                    reset() : void {
                        this.name = Utils.shortHashName('l3');
                        this.l2NetworkUuid = null;
                        this.description = null;
                        this.type = null;
                        this.system = false;
                        this.activeState = false;
                        this.dnsDomain = null;
                    },
                };

                var ipRangePage: Utils.WizardPage = $scope.ipRangePage = {
                    activeState: false,
                    startIp: null,
                    endIp: null,
                    netmask: null,
                    gateway: null,
                    name: null,
                    description: null,
                    cidr: null,
                    method: 'cidr',

                    isStartIpValid(): boolean {
                        if (Utils.notNullnotUndefined(this.startIp)) {
                            return Utils.isIpv4Address(this.startIp);
                        }
                        return true;
                    },

                    isEndIpValid(): boolean {
                        if (Utils.notNullnotUndefined(this.endIp)) {
                            return Utils.isIpv4Address(this.endIp);
                        }
                        return true;
                    },

                    isNetmaskValid(): boolean {
                        if (Utils.notNullnotUndefined(this.netmask)) {
                            return Utils.isIpv4Address(this.netmask);
                        }
                        return true;
                    },

                    isGatewayValid(): boolean {
                        if (Utils.notNullnotUndefined(this.gateway)) {
                            return Utils.isIpv4Address(this.gateway);
                        }
                        return true;
                    },

                    isCidrValid() : boolean {
                        if (Utils.notNullnotUndefined(this.cidr)) {
                            return Utils.isValidCidr(this.cidr);
                        }
                        return true;
                    },

                    canMoveToPrevious(): boolean {
                        return true;
                    },
                    canMoveToNext(): boolean {
                        return true;
                    },

                    getAnchorElement() : any {
                        return $('.nav a[data-target="#createL3NetworkIpRange"]');
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
                        return 'createL3NetworkIpRange';
                    },

                    reset() : void {
                        this.activeState = false;
                        this.startIp = null;
                        this.endIp = null;
                        this.netmask = null;
                        this.gateway = null;
                        this.name = Utils.shortHashName('ipr');
                        this.description = null;
                        this.method = 'cidr';
                        this.cidr = null;
                    },

                    add() : void {
                        $scope.optionsIpRangeGrid__.dataSource.insert(0, {
                            startIp: this.startIp,
                            endIp: this.endIp,
                            netmask: this.netmask,
                            gateway: this.gateway,
                            name: this.name,
                            description: this.description,
                            networkCidr: this.cidr
                        });

                        this.startIp = null;
                        this.endIp = null;
                        this.netmask = null;
                        this.gateway = null;
                        this.name = Utils.shortHashName('ipr');
                        this.description = null;
                        this.cidr = null;
                    },

                    canAdd() : boolean {
                        if (this.method == 'range') {
                            return Utils.notNullnotUndefined(this.name) && Utils.notNullnotUndefined(this.startIp)
                                && Utils.notNullnotUndefined(this.endIp) && Utils.notNullnotUndefined(this.netmask)
                                && Utils.notNullnotUndefined(this.gateway) && this.isStartIpValid()
                                && this.isEndIpValid() && this.isNetmaskValid() && this.isGatewayValid();
                        } else {
                            return Utils.notNullnotUndefined(this.name) && Utils.notNullnotUndefinedNotEmptyString(this.cidr) && this.isCidrValid();
                        }
                    },

                    isGridShow() : boolean {
                        return $scope.optionsIpRangeGrid__.dataSource.data().length > 0;
                    },

                    del(uid: string) : void {
                        var row = $scope.optionsIpRangeGrid__.dataSource.getByUid(uid);
                        $scope.optionsIpRangeGrid__.dataSource.remove(row);
                    }
                };

                var dnsPage: Utils.WizardPage = $scope.dnsPage = {
                    activeState: false,
                    dns: null,

                    isDnsValid(): boolean {
                        if (Utils.notNullnotUndefined(this.dns)) {
                            return Utils.isIpv4Address(this.dns);
                        }
                        return true;
                    },

                    canMoveToPrevious(): boolean {
                        return true;
                    },
                    canMoveToNext(): boolean {
                        return true;
                    },

                    getAnchorElement() : any {
                        return $('.nav a[data-target="#createL3NetworkDns"]');
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
                        return 'createL3NetworkDns';
                    },

                    reset() : void {
                        this.activeState = false;
                        this.dns = null;
                    },

                    add() : void {
                        $scope.optionsDnsGrid__.dataSource.insert(0, {
                            dns: this.dns
                        });

                        this.dns = null;
                    },

                    canAdd() : boolean {
                        return Utils.notNullnotUndefined(this.dns) && this.isDnsValid();
                    },

                    isGridShow() : boolean {
                        return $scope.optionsDnsGrid__.dataSource.data().length > 0;
                    },

                    del(uid: string) : void {
                        var row = $scope.optionsDnsGrid__.dataSource.getByUid(uid);
                        $scope.optionsDnsGrid__.dataSource.remove(row);
                    }
                };

                var self = this;
                var servicePage: Utils.WizardPage = $scope.servicePage = {
                    activeState: false,
                    providerUuid: null,
                    serviceType: null,

                    canMoveToPrevious(): boolean {
                        return true;
                    },
                    canMoveToNext(): boolean {
                        return true;
                    },

                    getAnchorElement() : any {
                        return $('.nav a[data-target="#createL3NetworkService"]');
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
                        return 'createL3NetworkService';
                    },

                    reset() : void {
                        this.activeState = false;
                    },

                    add() : void {
                        var pro = self.networkServiceProviders[this.providerUuid];
                        var data = $scope.optionsNetworkServiceGrid__.dataSource.data();
                        for (var i=0; i<data.length; i++) {
                            var item = data[i];
                            if (item.providerUuid == this.providerUuid && item.serviceType ==  this.serviceType) {
                                return;
                            }
                        }

                        $scope.optionsNetworkServiceGrid__.dataSource.insert(0, {
                            providerName: pro.name,
                            providerUuid: pro.uuid,
                            serviceType: this.serviceType
                        });
                    },

                    canAdd() : boolean {
                        return Utils.notNullnotUndefined(this.providerUuid) && Utils.notNullnotUndefined(this.serviceType);
                    },

                    isGridShow() : boolean {
                        return $scope.optionsNetworkServiceGrid__.dataSource.data().length > 0;
                    },

                    del(uid: string) : void {
                        var row = $scope.optionsNetworkServiceGrid__.dataSource.getByUid(uid);
                        $scope.optionsNetworkServiceGrid__.dataSource.remove(row);
                    }
                };

                $scope.$watch(()=> {
                    return $scope.servicePage.providerUuid;
                }, ()=> {
                    if (Utils.notNullnotUndefined($scope.servicePage.providerUuid)) {
                        var pro = this.networkServiceProviders[$scope.servicePage.providerUuid];
                        if (Utils.notNullnotUndefined(pro)) {
                            $scope.optionsServiceList__.dataSource.data(pro.networkServiceTypes);
                        }
                    }
                });

                var mediator : Utils.WizardMediator = $scope.mediator = {
                    currentPage: infoPage,
                    movedToPage: (page: Utils.WizardPage) => {
                        $scope.mediator.currentPage = page;
                    },

                    finishButtonName: (): string =>{
                        return "Create";
                    },

                    finish: ()=> {
                        var resultL3 : L3Network;
                        var chain = new Utils.Chain();
                        chain.then(()=> {
                            l3Mgr.create(infoPage, (ret : L3Network)=> {
                                resultL3 = ret;
                                chain.next();
                            });
                        }).then(()=>{
                            var iprs = $scope.optionsIpRangeGrid__.dataSource.data();
                            if (iprs.length == 0) {
                                chain.next();
                                return;
                            }
                            
                            var add = ()=> {
                                var ipr = iprs.shift();
                                if (!Utils.notNullnotUndefined(ipr)) {
                                    chain.next();
                                    return;
                                }

                                if (Utils.notNullnotUndefined(ipr.networkCidr)) {
                                    this.l3Mgr.addIpRangeByCidr(resultL3, ipr, ()=>{
                                        add();
                                    });
                                } else {
                                    this.l3Mgr.addIpRange(resultL3, ipr, ()=>{
                                        add();
                                    });
                                }
                            };

                            add();

                        }).then(()=> {
                            var dns = $scope.optionsDnsGrid__.dataSource.data();
                            if (dns.length == 0) {
                                chain.next();
                                return;
                            }

                            var add = () => {
                                var d = dns.shift();
                                if (!Utils.notNullnotUndefined(d)) {
                                    chain.next();
                                    return;
                                }

                                this.l3Mgr.addDns(resultL3, d.dns, ()=>{
                                    add();
                                });
                            };

                            add();
                        }).then(()=> {
                            var nws = $scope.optionsNetworkServiceGrid__.dataSource.data();
                            if (nws.length == 0) {
                                chain.next();
                                return;
                            }

                            var networkServices = {};
                            angular.forEach(nws, (n)=> {
                                var providerUuid = n.providerUuid;
                                var services = networkServices[providerUuid];
                                if (!Utils.notNullnotUndefined(services)) {
                                    services = [];
                                    networkServices[providerUuid] = services;
                                }

                                services.push(n.serviceType);
                            });

                            this.l3Mgr.attachNetworkService(resultL3, networkServices, ()=> {
                                chain.next();
                            });
                        }).done(()=> {
                            if (Utils.notNullnotUndefined(this.options.done)) {
                                this.options.done(resultL3);
                            }

                        }).start();

                        $scope.winCreateL3Network__.close();
                    }
                };

                $scope.button = new Utils.WizardButton([
                    infoPage, ipRangePage, dnsPage, servicePage
                ], mediator);

                $scope.$watch(()=>{
                    return $scope.infoPage.zoneUuid;
                }, ()=>{
                    var zuuid = $scope.infoPage.zoneUuid;
                    if (Utils.notNullnotUndefined(zuuid)) {
                        this.queryL2Networks(zuuid, (l2s:ML2Network.L2Network[])=> {
                            $scope.optionsL2NetworkList__.dataSource.data(l2s);
                            var l2 = l2s[0];
                            if (Utils.notNullnotUndefined(l2)) {
                                $scope.infoPage.l2NetworkUuid = l2.uuid;
                            }
                        });
                    }
                });

                $scope.methodOptions__ = {
                    dataSource: new kendo.data.DataSource({
                        data: [{
                            name: "Add By CIDR",
                            field: "cidr"
                        },{
                            name: "Add By IP Range",
                            field: "range"
                        }]
                    }),
                    dataTextField: "name",
                    dataValueField: "field"
                };

                $scope.optionsL2NetworkList__ = {
                    dataSource: new kendo.data.DataSource({data: []}),
                    dataTextField: "name",
                    dataValueField: "uuid",
                    template: '<div style="color: black"><span class="z-label">{{"l3Network.ts.Name" | translate}}:</span><span>#: name #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"l3Network.ts.Type" | translate}}:</span><span>#: type #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"l3Network.ts.UUID" | translate}}:</span><span>#: uuid #</span></div>'
                };

                $scope.optionsZoneList__ = {
                    dataSource: new kendo.data.DataSource({data: []}),
                    dataTextField: "name",
                    dataValueField: "uuid",
                    template: '<div style="color: black"><span class="z-label">{{"l3Network.ts.Name" | translate}}</span>: #: name #</div>'+'<div style="color: black"><span class="z-label">{{"l3Network.ts.State" | translate}}:</span>#: state #</div>'+'<div style="color: black"><span class="z-label">{{"l3Network.ts.UUID" | translate}}:</span> #: uuid #</div>'
                };

                $scope.optionsL3NetworkTypeList__ = {
                    dataSource: new kendo.data.DataSource({data: []}),
                    dataTextField: "type",
                    dataValueField: "type"
                };

                $scope.optionsIpRangeGrid__ = {
                    pageSize: 20,
                    resizable: true,
                    scrollable: true,
                    pageable: true,
                    columns: [
                        {
                            width: '12%',
                            title: '',
                            template: '<button type="button" class="btn btn-xs btn-default" ng-click="ipRangePage.del(dataItem.uid)"><i class="fa fa-times"></i></button>'
                        },
                        {
                            field: 'networkCidr',
                            title: '{{"l3Network.ts.CIDR" | translate}}',
                            width: '22%'
                        },
                        {
                            field: 'startIp',
                            title: '{{"l3Network.ts.START IP" | translate}}',
                            width: '22%'
                        },
                        {
                            field: 'endIp',
                            title: '{{"l3Network.ts.END IP" | translate}}',
                            width: '22%'
                        },
                        {
                            field: 'gateway',
                            title: '{{"l3Network.ts.GATEWAY" | translate}}',
                            width: '22%'
                        }
                    ],

                    dataBound: (e)=> {
                        var grid = e.sender;
                        if (grid.dataSource.totalPages() == 1) {
                            grid.pager.element.hide();
                        }
                    },

                    dataSource: new kendo.data.DataSource([])
                };

                $scope.optionsDnsGrid__ = {
                    pageSize: 20,
                    resizable: true,
                    scrollable: true,
                    pageable: true,
                    columns: [
                        {
                            field: 'dns',
                            title: '{{"l3Network.ts.DNS" | translate}}',
                            width: '80%'
                        },
                        {
                            width: '20%',
                            title: '',
                            template: '<button type="button" class="btn btn-xs btn-default" ng-click="dnsPage.del(dataItem.uid)"><i class="fa fa-times"></i></button>'
                        }
                    ],

                    dataBound: (e)=> {
                        var grid = e.sender;
                        if (grid.dataSource.totalPages() == 1) {
                            grid.pager.element.hide();
                        }
                    },

                    dataSource: new kendo.data.DataSource([])
                };

                $scope.optionsProviderList__ = {
                    dataSource: new kendo.data.DataSource({data: []}),
                    dataTextField: "name",
                    dataValueField: "uuid"
                };

                $scope.optionsServiceList__ = {
                    dataSource: new kendo.data.DataSource({data: []})
                };

                $scope.optionsNetworkServiceGrid__ = {
                    pageSize: 20,
                    resizable: true,
                    scrollable: true,
                    pageable: true,
                    columns: [
                        {
                            field: 'providerName',
                            title: '{{"l3Network.ts.PROVIDER" | translate}}',
                            width: '40%'
                        },
                        {
                            field: 'serviceType',
                            title: '{{"l3Network.ts.SERVICE" | translate}}',
                            width: '40%'
                        },
                        {
                            width: '10%',
                            title: '',
                            template: '<button type="button" class="btn btn-xs btn-default" ng-click="servicePage.del(dataItem.uid)"><i class="fa fa-times"></i></button>'
                        }
                    ],

                    dataBound: (e)=> {
                        var grid = e.sender;
                        if (grid.dataSource.totalPages() == 1) {
                            grid.pager.element.hide();
                        }
                    },

                    dataSource: new kendo.data.DataSource([])
                };

                $scope.winCreateL3NetworkOptions__ = {
                    width: '800px',
                    //height: '680px',
                    animation: false,
                    modal: true,
                    draggable: false,
                    resizable: false
                };



                this.$scope = $scope;
            };
            this.restrict = 'EA';
            this.replace = true;
            this.templateUrl = '/static/templates/l3Network/createL3Network.html';
        }
    }

    export class DeleteIpRangeOptions {
        l3Network: L3Network;
        done: (ipr : any)=>void;
    }


    export class DeleteIpRange implements ng.IDirective {
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

        options : DeleteIpRangeOptions;
        $scope: any;

        open() {
            this.$scope.ipRangeListOptions__.dataSource.data(this.options.l3Network.ipRanges);
            this.$scope.deleteIpRange__.center();
            this.$scope.deleteIpRange__.open();
        }

        constructor(private l3Mgr : L3NetworkManager) {
            this.scope = true;
            this.restrict = 'EA';
            this.replace = true;
            this.templateUrl = '/static/templates/l3Network/deleteIpRange.html';
            this.link = ($scope : any, $element, $attrs : any, $ctrl, $transclude) => {
                var parent = $scope.$parent;
                parent[$attrs.zDeleteIpRange] = this;
                this.options = parent[$attrs.zOptions];
                this.$scope = $scope;

                $scope.uuid = null;
                $scope.ipRangeListOptions__ = {
                    dataSource: new kendo.data.DataSource([]),
                    dataTextField: "name",
                    dataValueField: "uuid",
                    itemTemplate: '<div style="color: black"><span class="z-label">Name:</span><span>#: name #</span></div>' +
                        '<div style="color: black"><span class="z-label">Start IP:</span><span>#: startIp #</span></div>' +
                        '<div style="color: black"><span class="z-label">End IP:</span><span>#: endIp #</span></div>' +
                        '<div style="color: black"><span class="z-label">Netmask:</span><span>#: netmask #</span></div>' +
                        '<div style="color: black"><span class="z-label">Gateway:</span><span>#: gateway #</span></div>',

                    change: (e)=> {
                        var select = e.sender;
                        Utils.safeApply($scope, ()=> {
                            $scope.selectItemNum = select.dataItems().length;
                        });
                    }
                };

                $scope.selectItemNum = 0;

                $scope.canProceed = ()=> {
                    return $scope.selectItemNum > 0;
                };

                $scope.cancel = () => {
                    $scope.deleteIpRange__.close();
                };

                $scope.done = () => {
                    var iprs : ApiHeader.IpRangeInventory[] = $scope.ipRangeList__.dataItems();
                    angular.forEach(iprs, (ipr: ApiHeader.IpRangeInventory)=> {
                        l3Mgr.deleteIpRange(ipr, ()=> {
                            if (Utils.notNullnotUndefined(this.options.done)) {
                                this.options.done(ipr);
                            }
                        });
                    });

                    $scope.deleteIpRange__.close();
                };

                $scope.deleteIpRangeOptions__ = {
                    width: '550px'
                };
            }
        }
    }


    export class DeleteDnsOptions {
        l3Network: L3Network;
        done: (dns : string)=>void;
    }


    export class DeleteDns implements ng.IDirective {
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

        options : DeleteDnsOptions;
        $scope: any;

        open() {
            this.$scope.dnsOptions__.dataSource.data((():any=>{
                var dns = [];
                angular.forEach(this.options.l3Network.dns, (it)=>{
                    dns.push({dns: it});
                })
                return dns;
            })());
            this.$scope.deleteDns__.center();
            this.$scope.deleteDns__.open();
        }

        constructor(private l3Mgr : L3NetworkManager) {
            this.scope = true;
            this.restrict = 'EA';
            this.replace = true;
            this.templateUrl = '/static/templates/l3Network/deleteDns.html';
            this.link = ($scope : any, $element, $attrs : any, $ctrl, $transclude) => {
                var parent = $scope.$parent;
                parent[$attrs.zDeleteDns] = this;
                this.options = parent[$attrs.zOptions];
                this.$scope = $scope;

                $scope.uuid = null;
                $scope.dnsOptions__ = {
                    dataSource: new kendo.data.DataSource([]),
                    dataTextField: "dns",
                    dataValueField: "dns",

                    change: (e)=> {
                        var select = e.sender;
                        Utils.safeApply($scope, ()=> {
                            $scope.selectItemNum = select.dataItems().length;
                        });
                    }
                };

                $scope.selectItemNum = 0;

                $scope.canProceed = ()=> {
                    return $scope.selectItemNum > 0;
                };

                $scope.cancel = () => {
                    $scope.deleteDns__.close();
                };

                $scope.done = () => {
                    var dnss = $scope.dnsList__.dataItems();
                    angular.forEach(dnss, (it)=> {
                        l3Mgr.deleteDns(this.options.l3Network, it.dns, ()=> {
                            if (Utils.notNullnotUndefined(this.options.done)) {
                                this.options.done(it.dns);
                            }
                        });
                    });

                    $scope.deleteDns__.close();
                };

                $scope.deleteDnsOptions__ = {
                    width: '550px'
                };
            }
        }
    }
}

angular.module('root').factory('L3NetworkManager', ['Api', '$rootScope', (api, $rootScope)=> {
    return new ML3Network.L3NetworkManager(api, $rootScope);
}]).directive('zCreateL3Network', ['Api', 'ZoneManager', 'L3NetworkManager', 'L2NetworkManager', (api, zoneMgr, l3Mgr, l2Mgr)=> {
    return new ML3Network.CreateL3Network(api, zoneMgr, l3Mgr, l2Mgr);
}]).directive('zAddIpRange', ['L3NetworkManager', (l3Mgr)=>{
    return new ML3Network.AddIpRange(l3Mgr);
}]).directive('zDeleteIpRange', ['L3NetworkManager', (l3Mgr)=>{
    return new ML3Network.DeleteIpRange(l3Mgr);
}]).directive('zAddDns', ['L3NetworkManager', (l3Mgr)=> {
    return new ML3Network.AddDns(l3Mgr);
}]).directive('zDeleteDns', ['L3NetworkManager', (l3Mgr)=> {
    return new ML3Network.DeleteDns(l3Mgr);
}]).config(['$routeProvider', function(route) {
    route.when('/l3Network', {
        templateUrl: '/static/templates/l3Network/l3Network.html',
        controller: 'ML3Network.Controller',
        resolve: {
            l3NetworkTypes: function($q : ng.IQService, Api : Utils.Api) {
                var defer = $q.defer();
                Api.getL3NetworkTypes((l3Types: string[])=> {
                    defer.resolve(l3Types);
                });
                return defer.promise;
            }
        }
    }).when('/l3Network/:uuid', {
        templateUrl: '/static/templates/l3Network/details.html',
        controller: 'ML3Network.DetailsController',
        resolve: {
            current: function($q : ng.IQService, $route: any, L3NetworkManager: ML3Network.L3NetworkManager) {
                var defer = $q.defer();
                var qobj = new ApiHeader.QueryObject();
                var uuid = $route.current.params.uuid;
                qobj.addCondition({name: 'uuid', op: '=', value: uuid});
                L3NetworkManager.query(qobj, (l3s: ML3Network.L3Network[])=>{
                    var l3 = l3s[0];
                    defer.resolve(l3);
                });
                return defer.promise;
            }
        }
    });
}]);

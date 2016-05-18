/// <reference path="d.ts/angularjs/angular.d.ts" />
/// <reference path="d.ts/kendo.all.d.ts" />

module MDashboard {

    export class DashboardManager {
        static $inject = ['Api'];

        constructor(private api : Utils.Api, private $rootScope : ng.IRootScopeService) {
        }
    }

    export class Controller {
        static $inject = ['$scope', 'Api', '$location', 'ZoneManager', 'Translator', '$translate'];

        constructor(private $scope: any, private api: Utils.Api, private $location: ng.ILocationService, private zoneMgr: MZone.ZoneManager, private Translator: Utils.Translator, private $translate: any) {
             var cpu = new kendo.data.ObservableObject({
                 total: 0,
                 available: 0,
                 percent: 0
             });
             Translator.addProperty(cpu, 'name', 'dashboard.CPU');
             var memory =  new kendo.data.ObservableObject({
                 total: 0,
                 available: 0,
                 percent: 0
             });
             Translator.addProperty(memory, 'name', 'dashboard.MEMORY');
             var priCap = new kendo.data.ObservableObject({
                 total: 0,
                 available: 0,
                 percent: 0
             });
             Translator.addProperty(priCap, 'name', 'dashboard.PRIMARY STORAGE');
             var backupCap = new kendo.data.ObservableObject({
                 total: 0,
                 available: 0,
                 percent: 0
             });
             Translator.addProperty(backupCap, 'name', 'dashboard.BACKUP STORAGE');
             var ip = new kendo.data.ObservableObject({
                 total: 0,
                 available: 0,
                 percent: 0
             });
             Translator.addProperty(ip, 'name', 'dashboard.IP ADDRESS');
 
             $scope.capacityGrid = {
                 resizable: true,
                 scrollable: true,
                 pageable: false,
                 columns: [
                     {
                         field: 'name',
                         title: '{{ "dashboard.CAPACITY NAME" | translate }}',
                         width: '25%'
                     },
                     {
                         field: 'total',
                         title: '{{ "dashboard.TOTAL CAPACITY" | translate }}',
                         width: '25%'
                     },
                     {
                         field: 'available',
                         title: '{{ "dashboard.AVAILABLE CAPACITY" | translate }}',
                         width: '25%'
                     },
                     {
                         field: 'percent',
                         title: '{{ "dashboard.AVAILABLE PERCENTAGE" | translate }}',
                         width: '25%'
                     }
                 ],

                dataSource: new kendo.data.DataSource({
                    schema: {
                        data: 'data',
                        total: 'total'
                    },

                    transport: {
                        read: (options)=> {
                            var chain = new Utils.Chain();
                            chain.then(()=>{
                                api.getMemoryCpuCapacityByAll((ret: ApiHeader.APIGetCpuMemoryCapacityReply)=>{
                                    cpu.set('total', Utils.toVCPUString(ret.totalCpu));
                                    cpu.set('available', Utils.toVCPUString(ret.availableCpu));
                                    cpu.set('percent', Utils.toPercentageString(ret.totalCpu == 0 ? 0 : ret.availableCpu / ret.totalCpu));

                                    memory.set('total',Utils.toSizeString(ret.totalMemory));
                                    memory.set('available',Utils.toSizeString(ret.availableMemory));
                                    memory.set('percent', Utils.toPercentageString(ret.totalMemory == 0 ? 0 : ret.availableMemory / ret.totalMemory));
                                });
                                chain.next();
                            }).then(()=>{
                                api.getPirmaryStorageCapacityByAll((ret: ApiHeader.APIGetPrimaryStorageCapacityReply)=>{
                                    priCap.set('total', Utils.toSizeString(ret.totalCapacity));
                                    priCap.set('available', Utils.toSizeString(ret.availableCapacity));
                                    priCap.set('percent', Utils.toPercentageString(ret.totalCapacity == 0 ? 0 : ret.availableCapacity / ret.totalCapacity));
                                });
                                chain.next();
                            }).then(()=>{
                                api.getBackupStorageCapacityByAll((ret: ApiHeader.APIGetBackupStorageCapacityReply)=>{
                                    backupCap.set('total', Utils.toSizeString(ret.totalCapacity));
                                    backupCap.set('available', Utils.toSizeString(ret.availableCapacity));
                                    backupCap.set('percent', Utils.toPercentageString(ret.totalCapacity == 0 ? 0 : ret.availableCapacity / ret.totalCapacity));
                                });
                                chain.next();
                            }).then(()=>{
                                api.getIpAddressCapacityByAll((ret: ApiHeader.APIGetIpAddressCapacityReply)=>{
                                    ip.set('total', ret.totalCapacity);
                                    ip.set('available', ret.availableCapacity);
                                    ip.set('percent', Utils.toPercentageString(ret.totalCapacity == 0 ? 0 : ret.availableCapacity / ret.totalCapacity));
                                });
                                chain.next();
                            }).start();

                            options.success({
                                data: [
                                    cpu,
                                    memory,
                                    priCap,
                                    backupCap,
                                    ip
                                ],
                                total: 5
                            });
                        }
                    }
                })
            };

            var vm = new kendo.data.ObservableObject({
                name: 'VM INSTANCE',
                link: 'vmInstance',
                amount: 0
            });
            var volume = new kendo.data.ObservableObject({
                name: 'VOLUME',
                link: 'volume',
                amount: 0
            });
            var securityGroup = new kendo.data.ObservableObject({
                name: 'SECURITY GROUP',
                link: 'securityGroup',
                amount: 0
            });
            var eip = new kendo.data.ObservableObject({
                name: 'EIP',
                link: 'eip',
                amount: 0
            });
            var portForwarding = new kendo.data.ObservableObject({
                name: 'PORT FORWARDING',
                link: 'portForwarding',
                amount: 0
            });
            var zone = new kendo.data.ObservableObject({
                name: 'ZONE',
                link: 'zone',
                amount: 0
            });
            var cluster = new kendo.data.ObservableObject({
                name: 'CLUSTER',
                link: 'cluster',
                amount: 0
            });
            var host = new kendo.data.ObservableObject({
                name: 'HOST',
                link: 'host',
                amount: 0
            });
            var primaryStorage = new kendo.data.ObservableObject({
                name: 'PRIMARY STORAGE',
                link: 'primaryStorage',
                amount: 0
            });
            var backupStorage = new kendo.data.ObservableObject({
                name: 'BACKUP STORAGE',
                link: 'backupStorage',
                amount: 0
            });
            var l2Network = new kendo.data.ObservableObject({
                name: 'L2 NETWORK',
                link: 'l2Network',
                amount: 0
            });
            var l3Network = new kendo.data.ObservableObject({
                name: 'L3 NETWORK',
                link: 'l3Network',
                amount: 0
            });
            var instanceOffering = new kendo.data.ObservableObject({
                name: 'INSTANCE OFFERING',
                link: 'instanceOffering',
                amount: 0
            });
            var diskOffering = new kendo.data.ObservableObject({
                name: 'DISK OFFERING',
                link: 'diskOffering',
                amount: 0
            });
            var vrOffering = new kendo.data.ObservableObject({
                name: 'VIRTUAL ROUTER OFFERING',
                link: 'virtualRouterOffering',
                amount: 0
            });
            var image = new kendo.data.ObservableObject({
                name: 'IMAGE',
                link: 'image',
                amount: 0
            });
            var virtualRouter = new kendo.data.ObservableObject({
                name: 'VIRTUAL ROUTER',
                link: 'virtualRouter',
                amount: 0
            });
            $scope.resourceAmountGrid = {
                resizable: true,
                scrollable: true,
                pageable: false,
                columns: [
                    {
                        field: 'name',
                        title: '{{"dashboard.ts.RESOURCE NAME" | translate}}',
                        template: '<a href="/\\#/{{dataItem.link}}">{{dataItem.name}}</a>',
                        width: '50%'
                    },
                    {
                        field: 'amount',
                        title: '{{"dashboard.ts.COUNT" | translate}}',
                        width: '50%'
                    }
                ],

                dataSource: new kendo.data.DataSource({
                    schema: {
                        data: 'data',
                        total: 'total'
                    },

                    transport: {
                        read: (options)=> {
                            var chain = new Utils.Chain();
                            chain.then(()=>{
                                var msg = new ApiHeader.APIQueryVmInstanceMsg();
                                msg.count = true;
                                msg.conditions = [{
                                    name: 'type',
                                    op: '=',
                                    value: 'UserVm'
                                }];
                                api.syncApi(msg, (ret: ApiHeader.APIQueryVmInstanceReply)=>{
                                    vm.set('amount', ret.total);
                                });
                                chain.next();
                            }).then(()=>{
                                var msg = new ApiHeader.APIQueryVolumeMsg();
                                msg.count = true;
                                msg.conditions = [];
                                api.syncApi(msg, (ret: ApiHeader.APIQueryVolumeReply)=>{
                                    volume.set('amount', ret.total);
                                });
                                chain.next();
                            }).then(()=>{
                                var msg = new ApiHeader.APIQuerySecurityGroupMsg();
                                msg.count = true;
                                msg.conditions = [];
                                api.syncApi(msg, (ret: ApiHeader.APIQuerySecurityGroupReply)=>{
                                    securityGroup.set('amount', ret.total);
                                });
                                chain.next();
                            }).then(()=>{
                                var msg = new ApiHeader.APIQueryEipMsg();
                                msg.count = true;
                                msg.conditions = [];
                                api.syncApi(msg, (ret: ApiHeader.APIQueryEipReply)=>{
                                    eip.set('amount', ret.total);
                                });
                                chain.next();
                            }).then(()=>{
                                var msg = new ApiHeader.APIQueryPortForwardingRuleMsg();
                                msg.count = true;
                                msg.conditions = [];
                                api.syncApi(msg, (ret: ApiHeader.APIQueryPortForwardingRuleReply)=>{
                                    portForwarding.set('amount', ret.total);
                                });
                                chain.next();
                            }).then(()=>{
                                var msg = new ApiHeader.APIQueryZoneMsg();
                                msg.count = true;
                                msg.conditions = [];
                                api.syncApi(msg, (ret: ApiHeader.APIQueryZoneReply)=>{
                                    zone.set('amount', ret.total);
                                });
                                chain.next();
                            }).then(()=>{
                                var msg = new ApiHeader.APIQueryClusterMsg();
                                msg.count = true;
                                msg.conditions = [];
                                api.syncApi(msg, (ret: ApiHeader.APIQueryClusterReply)=>{
                                    cluster.set('amount', ret.total);
                                });
                                chain.next();
                            }).then(()=>{
                                var msg = new ApiHeader.APIQueryHostMsg();
                                msg.count = true;
                                msg.conditions = [];
                                api.syncApi(msg, (ret: ApiHeader.APIQueryHostReply)=>{
                                    host.set('amount', ret.total);
                                });
                                chain.next();
                            }).then(()=>{
                                var msg = new ApiHeader.APIQueryPrimaryStorageMsg();
                                msg.count = true;
                                msg.conditions = [];
                                api.syncApi(msg, (ret: ApiHeader.APIQueryPrimaryStorageReply)=>{
                                    primaryStorage.set('amount', ret.total);
                                });
                                chain.next();
                            }).then(()=>{
                                var msg = new ApiHeader.APIQueryBackupStorageMsg();
                                msg.count = true;
                                msg.conditions = [];
                                api.syncApi(msg, (ret: ApiHeader.APIQueryBackupStorageReply)=>{
                                    backupStorage.set('amount', ret.total);
                                });
                                chain.next();
                            }).then(()=>{
                                var msg = new ApiHeader.APIQueryL2NetworkMsg();
                                msg.count = true;
                                msg.conditions = [];
                                api.syncApi(msg, (ret: ApiHeader.APIQueryL2NetworkReply)=>{
                                    l2Network.set('amount', ret.total);
                                });
                                chain.next();
                            }).then(()=>{
                                var msg = new ApiHeader.APIQueryL3NetworkMsg();
                                msg.count = true;
                                msg.conditions = [];
                                api.syncApi(msg, (ret: ApiHeader.APIQueryL3NetworkReply)=>{
                                    l3Network.set('amount', ret.total);
                                });
                                chain.next();
                            }).then(()=>{
                                var msg = new ApiHeader.APIQueryInstanceOfferingMsg();
                                msg.count = true;
                                msg.conditions = [{
                                    name: 'type',
                                    op: '=',
                                    value: 'UserVm'
                                }];
                                api.syncApi(msg, (ret: ApiHeader.APIQueryInstanceOfferingReply)=>{
                                    instanceOffering.set('amount', ret.total);
                                });
                                chain.next();
                            }).then(()=>{
                                var msg = new ApiHeader.APIQueryDiskOfferingMsg();
                                msg.count = true;
                                msg.conditions = [];
                                api.syncApi(msg, (ret: ApiHeader.APIQueryDiskOfferingReply)=>{
                                    diskOffering.set('amount', ret.total);
                                });
                                chain.next();
                            }).then(()=>{
                                var msg = new ApiHeader.APIQueryVirtualRouterOfferingMsg();
                                msg.count = true;
                                msg.conditions = [];
                                api.syncApi(msg, (ret: ApiHeader.APIQueryVirtualRouterOfferingReply)=>{
                                    vrOffering.set('amount', ret.total);
                                });
                                chain.next();
                            }).then(()=>{
                                var msg = new ApiHeader.APIQueryImageMsg();
                                msg.count = true;
                                msg.conditions = [];
                                api.syncApi(msg, (ret: ApiHeader.APIQueryImageReply)=>{
                                    image.set('amount', ret.total);
                                });
                                chain.next();
                            }).then(()=>{
                                var msg = new ApiHeader.APIQueryApplianceVmMsg();
                                msg.count = true;
                                msg.conditions = [{
                                    name: 'applianceVmType',
                                    op: '=',
                                    value: 'VirtualRouter'
                                }];
                                api.syncApi(msg, (ret: ApiHeader.APIQueryApplianceVmReply)=>{
                                    virtualRouter.set('amount', ret.total);
                                });
                                chain.next();
                            }).start();

                            options.success({
                                data: [
                                    vm,
                                    volume,
                                    securityGroup,
                                    eip,
                                    portForwarding,
                                    zone,
                                    cluster,
                                    host,
                                    image,
                                    primaryStorage,
                                    backupStorage,
                                    l2Network,
                                    l3Network,
                                    virtualRouter,
                                    instanceOffering,
                                    diskOffering,
                                    vrOffering
                                ],
                                total: 16
                            });
                        }
                    }
                })
            };
        }
    }
}

angular.module('root').factory('DashboardManager', ['Api', '$rootScope', (api, $rootScope)=> {
    return new MDashboard.DashboardManager(api, $rootScope);
}]).config(['$routeProvider', function(route) {
    route.when('/dashboard', {
        templateUrl: '/static/templates/dashboard/dashboard.html',
        controller: 'MDashboard.Controller'
    });
}]);


/// <reference path="d.ts/angularjs/angular.d.ts" />
/// <reference path="d.ts/kendo.all.d.ts" />

module MPortForwarding {
    export class PortForwarding extends ApiHeader.PortForwardingRuleInventory {
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

        isAttachShow() : boolean {
            return !Utils.notNullnotUndefined(this.vmNicUuid);
        }

        isDetachShow() : boolean {
            return !this.isAttachShow();
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


        updateObservableObject(inv : ApiHeader.PortForwardingRuleInventory) {
            // self : ObservableObject
            var self : any = this;
            self.set('uuid', inv.uuid);
            self.set('name', inv.name);
            self.set('description', inv.description);
            self.set('state', inv.state);
            self.set('vmNicUuid', inv.vmNicUuid);
            self.set('vipUuid', inv.vipUuid);
            self.set('vipPortStart', inv.vipPortStart);
            self.set('vipPortEnd', inv.vipPortEnd);
            self.set('privatePortStart', inv.privatePortStart);
            self.set('privatePortEnd', inv.privatePortEnd);
            self.set('protocolType', inv.protocolType);
            self.set('allowedCidr', inv.allowedCidr);
            self.set('createDate', inv.createDate);
            self.set('lastOpDate', inv.lastOpDate);
        }

        extendVip(vip: string) {
            var self : any = this;
            this['vipIp'] = vip;
            self.set('vipIp', vip);
        }

        extendVmNicIp(nicIp: string) {
            var self : any = this;
            this['vmNicIp'] = nicIp;
            self.set('vmNicIp', nicIp);
        }

        static wrap(obj: any) : PortForwarding {
            var pf = new PortForwarding();
            angular.extend(pf, obj);
            return pf;
        }
    }

    export class PortForwardingManager {
        static $inject = ['Api', '$rootScope'];

        constructor(private api : Utils.Api, private $rootScope: ng.IRootScopeService) {
        }

        private sortBy : Directive.SortByData;

        setSortBy(sortBy : Directive.SortByData) {
            this.sortBy = sortBy;
        }

        private wrap(PortForwarding : PortForwarding) : any {
            return new kendo.data.ObservableObject(PortForwarding);
        }

        create(pf : any, done : (ret : PortForwarding)=>void) {
            var msg : any = new ApiHeader.APICreatePortForwardingRuleMsg();
            msg.name = pf.name;
            msg.description = pf.description;
            msg.vipUuid = pf.vipUuid;
            msg.vmNicUuid = pf.vmNicUuid;
            msg.vipPortStart = pf.vipPortStart;
            msg.vipPortEnd = pf.vipPortEnd;
            msg.privatePortStart = pf.privatePortStart;
            msg.privatePortEnd = pf.privatePortEnd;
            msg.allowedCidr = pf.allowedCidr;
            msg.protocolType = pf.protocolType;
            this.api.asyncApi(msg, (ret : ApiHeader.APICreatePortForwardingRuleEvent)=> {
                var c = new PortForwarding();
                angular.extend(c, ret.inventory);
                done(this.wrap(c));
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Created new port forwarding rule: {0}',c.name),
                    link: Utils.sprintf('/#/portForwarding/{0}', c.uuid)
                });
            });
        }

        query(qobj : ApiHeader.QueryObject, callback : (pfs : PortForwarding[], total: number) => void) : void {
            var msg = new ApiHeader.APIQueryPortForwardingRuleMsg();
            msg.count = qobj.count === true;
            msg.start = qobj.start;
            msg.limit = qobj.limit;
            msg.replyWithCount = true;
            msg.conditions = qobj.conditions ? qobj.conditions : [];
            if (Utils.notNullnotUndefined(this.sortBy) && this.sortBy.isValid()) {
                msg.sortBy = this.sortBy.field;
                msg.sortDirection = this.sortBy.direction;
            }
            this.api.syncApi(msg, (ret : ApiHeader.APIQueryPortForwardingRuleReply)=>{
                var pris = [];
                ret.inventories.forEach((inv : ApiHeader.PortForwardingRuleInventory)=> {
                    var c = new PortForwarding();
                    angular.extend(c, inv);
                    pris.push(this.wrap(c));
                });
                callback(pris, ret.total);
            });
        }


        getAttachableVmNicByPortForwardingUuid(uuid: string, done: (ret:ApiHeader.VmNicInventory[])=>void) {
            var msg = new ApiHeader.APIGetPortForwardingAttachableVmNicsMsg();
            msg.ruleUuid = uuid;
            this.api.syncApi(msg, (ret: ApiHeader.APIGetPortForwardingAttachableVmNicsReply)=>{
                done(ret.inventories);
            });
        }

        attach(pf: PortForwarding, vmNicUuid: string, done: ()=>void) {
            pf.progressOn();
            var msg = new ApiHeader.APIAttachPortForwardingRuleMsg();
            msg.ruleUuid = pf.uuid;
            msg.vmNicUuid = vmNicUuid;
            this.api.asyncApi(msg, (ret: ApiHeader.APIAttachPortForwardingRuleEvent)=>{
                pf.updateObservableObject(ret.inventory);
                pf.progressOff();
                if (Utils.notNullnotUndefined(done)) {
                    done();
                }
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Attached port forwarding rule: {0}',pf.name),
                    link: Utils.sprintf('/#/portForwarding/{0}', pf.uuid)
                });
            });
        }

        detach(pf: PortForwarding, done: ()=>void) {
            pf.progressOn();
            var msg = new ApiHeader.APIDetachPortForwardingRuleMsg();
            msg.uuid = pf.uuid;
            this.api.asyncApi(msg, (ret: ApiHeader.APIDetachPortForwardingRuleEvent)=>{
                pf.updateObservableObject(ret.inventory);
                pf.progressOff();
                if (Utils.notNullnotUndefined(done)) {
                    done();
                }
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Detached port forwarding rule: {0}',pf.name),
                    link: Utils.sprintf('/#/portForwarding/{0}', pf.uuid)
                });
            });
        }

        disable(pf : PortForwarding) {
            pf.progressOn();
            var msg = new ApiHeader.APIChangePortForwardingRuleStateMsg();
            msg.stateEvent = 'disable';
            msg.uuid = pf.uuid;
            this.api.asyncApi(msg, (ret : ApiHeader.APIChangePortForwardingRuleStateEvent) => {
                pf.updateObservableObject(ret.inventory);
                pf.progressOff();
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Disabled port forwarding rule: {0}',pf.name),
                    link: Utils.sprintf('/#/portForwarding/{0}', pf.uuid)
                });
            });
        }

        enable(pf : PortForwarding) {
            pf.progressOn();
            var msg = new ApiHeader.APIChangePortForwardingRuleStateMsg();
            msg.stateEvent = 'enable';
            msg.uuid = pf.uuid;
            this.api.asyncApi(msg, (ret : ApiHeader.APIChangePortForwardingRuleStateEvent) => {
                pf.updateObservableObject(ret.inventory);
                pf.progressOff();
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Enabled port forwarding rule: {0}', pf.name),
                    link: Utils.sprintf('/#/portForwarding/{0}', pf.uuid)
                });
            });
        }

        delete(pf : PortForwarding, done : (ret : any)=>void) {
            pf.progressOn();
            var msg = new ApiHeader.APIDeletePortForwardingRuleMsg();
            msg.uuid = pf.uuid;
            this.api.asyncApi(msg, (ret : any)=> {
                pf.progressOff();
                done(ret);
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Deleted EIP: {0}', pf.name)
                });
            });
        }
    }

    export class PortForwardingModel extends Utils.Model {
        constructor() {
            super();
            this.current = new PortForwarding();
        }
    }

    class OPortForwardingGrid extends Utils.OGrid {
        constructor($scope: any, private pfMgr : PortForwardingManager, private vmMgr: MVmInstance.VmInstanceManager,
                    private vipMgr: MVip.VipManager) {
            super();
            super.init($scope, $scope.pfGrid);
            this.options.columns = [
                {
                    field: 'name',
                    title: '{{"portForwarding.ts.NAME" | translate}}',
                    width: '10%',
                    template: '<a href="/\\#/portForwarding/{{dataItem.uuid}}">{{dataItem.name}}</a>'
                },
                {
                    field: 'state',
                    title: '{{"portForwarding.ts.STATE" | translate}}',
                    width: '10%',
                    template: '<span class="{{dataItem.stateLabel()}}">{{dataItem.state}}</span>'
                },
                {
                    field: 'vipPortStart',
                    title: '{{"portForwarding.ts.VIP PORT START" | translate}}',
                    width: '10%'
                },
                {
                    field: 'vipPortEnd',
                    title: '{{"portForwarding.ts.VIP PORT END" | translate}}',
                    width: '10%'
                },
                {
                    field: 'privatePortStart',
                    title: '{{"portForwarding.ts.GUEST PORT START" | translate}}',
                    width: '10%'
                },
                {
                    field: 'privatePortEnd',
                    title: '{{"portForwarding.ts.GUEST PORT END" | translate}}',
                    width: '10%'
                },
                {
                    field: 'vipIp',
                    title: '{{"portForwarding.ts.VIP IP" | translate}}',
                    width: '20%'
                },
                {
                    field: 'vmNicIp',
                    title: '{{"portForwarding.ts.VM NIC IP" | translate}}',
                    width: '20%'
                },
            ];

            this.options.dataSource.transport.read = (options)=> {
                var chain = new Utils.Chain();
                var pfs = [];
                var vips = {};
                var vmNics = {};
                var composedPortForwarding = [];
                var total: number = null;

                chain.then(()=>{
                    var qobj = new ApiHeader.QueryObject();
                    qobj.limit = options.data.take;
                    qobj.start = options.data.pageSize * (options.data.page - 1);
                    pfMgr.query(qobj, (ret:PortForwarding[], amount:number)=> {
                        pfs = ret;
                        total = amount;
                        chain.next();
                    });
                }).then(()=>{
                    if (pfs.length == 0) {
                        chain.next();
                        return;
                    }

                    var nicUuids = [];
                    angular.forEach(pfs, (it)=>{
                        if (Utils.notNullnotUndefined(it.vmNicUuid)) {
                            nicUuids.push(it.vmNicUuid);
                        }
                    });

                    if (nicUuids.length == 0) {
                        chain.next();
                        return;
                    }

                    var qobj = new ApiHeader.QueryObject();
                    qobj.conditions = [
                        {
                            name: 'uuid',
                            op: 'in',
                            value: nicUuids.join()
                        }
                    ];

                    vmMgr.queryVmNic(qobj, (ns: MVmInstance.VmNic[])=>{
                        angular.forEach(ns, (it)=>{
                            vmNics[it.uuid] = it;
                        });
                        chain.next();
                    });
                }).then(()=>{
                    if (pfs.length == 0) {
                        chain.next();
                        return;
                    }

                    var vipUuids = [];
                    angular.forEach(pfs, (it)=>{
                        vipUuids.push(it.vipUuid);
                    });

                    if (vipUuids.length == 0) {
                        chain.next();
                        return;
                    }

                    var qobj = new ApiHeader.QueryObject();
                    qobj.conditions = [
                        {
                            name: 'uuid',
                            op: 'in',
                            value: vipUuids.join()
                        }
                    ];

                    vipMgr.query(qobj, (vs: MVip.Vip[])=>{
                        angular.forEach(vs, (it)=>{
                            vips[it.uuid] = it;
                        });
                        chain.next();
                    });
                }).then(()=>{
                    if (pfs.length == 0) {
                        chain.next();
                        return;
                    }

                    angular.forEach(pfs, (it)=>{
                        if (Utils.notNullnotUndefined(it.vmNicUuid)) {
                            var nic: any = vmNics[it.vmNicUuid];
                            it.extendVmNicIp(nic.ip);
                        }

                        var vip: any = vips[it.vipUuid];
                        it.extendVip(vip.ip);
                        composedPortForwarding.push(it);
                    });

                    chain.next();
                }).done(()=>{
                    options.success({
                        data: composedPortForwarding,
                        total: total
                    });
                }).start();
            };
        }
    }

    class Action {
        enable() {
            this.pfMgr.enable(this.$scope.model.current);
        }

        disable() {
            this.pfMgr.disable(this.$scope.model.current);
        }

        attach() {
            this.$scope.attachPortForwarding.open();
        }

        detach() {
            this.$scope.detachPortForwarding.open();
        }

        constructor(private $scope : any, private pfMgr : PortForwardingManager) {
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
                            name: '{{"portForwarding.ts.None" | translate}}',
                            value: FilterBy.NONE
                        },
                        {
                            name: '{{"portForwarding.ts.State" | translate}}',
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
            this.$scope.oPortForwardingGrid.setFilter(this.toKendoFilter());
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
        static $inject = ['$scope', 'PortForwardingManager', '$routeParams', 'Tag', 'current', 'VmInstanceManager'];

        private loadSelf(uuid : string) {
            var qobj = new ApiHeader.QueryObject();
            qobj.addCondition({name: 'uuid', op: '=', value: uuid});
            this.pfMgr.query(qobj, (pfs : PortForwarding[], total:number)=> {
                this.$scope.model.current = pfs[0];
            });
        }

        constructor(private $scope : any, private pfMgr : PortForwardingManager, private $routeParams : any,
                    private tagService : Utils.Tag, current: any, private vmMgr: MVmInstance.VmInstanceManager) {
            $scope.model = new PortForwardingModel();
            $scope.model.current = current.pf;
            $scope.vip = current.vip;
            $scope.nic = current.nic;

            $scope.funcDelete = (win : any) => {
                win.open();
            };

            $scope.action = new Action($scope, pfMgr);

            $scope.funcRefresh = ()=> {
                this.loadSelf($scope.model.current.uuid);
            };

            $scope.funcToolbarShow = ()=> {
                return Utils.notNullnotUndefined($scope.model.current);
            };

            $scope.optionsDeletePortForwarding = {
                title: 'DELETE PORT FORWARDING RULE',
                description: ()=>{
                    return current.name;
                },
                btnType: 'btn-danger',
                width: '350px',
                confirm: ()=> {
                    pfMgr.delete($scope.model.current, (ret : any)=> {
                        $scope.model.resetCurrent();
                    });
                }
            };

            $scope.optionsTag = {
                tags: [],
                createTag: (item)=> {
                    this.tagService.createTag(item.tag, $scope.model.current.uuid, ApiHeader.TagResourceTypePortForwardingRuleVO, (ret : ApiHeader.TagInventory)=> {
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

            $scope.optionsDetachPortForwarding = {
                pf: current.pf,
                done: ()=>{
                    $scope.nic = null
                }
            };

            $scope.optionsAttachPortForwarding = {
                pf: current.pf,
                done: ()=>{
                    var qobj = new ApiHeader.QueryObject();
                    qobj.conditions = [{
                        name: 'uuid',
                        op: '=',
                        value: current.pf.vmNicUuid
                    }];

                    vmMgr.queryVmNic(qobj, (nics: MVmInstance.VmNic[])=>{
                        current.pf.extendVmNicIp(nics[0].ip);
                        $scope.nic = nics[0];
                    });
                }
            };
        }
    }

    export class Controller {
        static $inject = ['$scope', 'PortForwardingManager', '$location', 'VipManager', 'VmInstanceManager'];

        constructor(private $scope : any, private pfMgr : PortForwardingManager, private $location : ng.ILocationService,
            private vipMgr: MVip.VipManager, private vmMgr: MVmInstance.VmInstanceManager) {
            $scope.model = new PortForwardingModel();
            $scope.oPortForwardingGrid = new OPortForwardingGrid($scope, pfMgr, vmMgr, vipMgr);
            $scope.action = new Action($scope, pfMgr);
            $scope.optionsSortBy = {
                fields: [
                    {
                        name: '{{"portForwarding.ts.Name" | translate}}',
                        value: 'name'
                    },
                    {
                        name: '{{"portForwarding.ts.Description" | translate}}',
                        value: 'description'
                    },
                    {
                        name: '{{"portForwarding.ts.VIP Port Start" | translate}}',
                        value: 'vipPortStart'
                    },
                    {
                        name: '{{"portForwarding.ts.VIP Port End" | translate}}',
                        value: 'vipPortEnd'
                    },
                    {
                        name: '{{"portForwarding.ts.Private Port Start" | translate}}',
                        value: 'privatePortStart'
                    },
                    {
                        name: '{{"portForwarding.ts.Private Port End" | translate}}',
                        value: 'privatePortEnd'
                    },
                    {
                        name: '{{"portForwarding.ts.Protocol" | translate}}',
                        value: 'protocolType'
                    },
                    {
                        name: '{{"portForwarding.ts.State" | translate}}',
                        value: 'state'
                    },
                    {
                        name: '{{"portForwarding.ts.Created Date" | translate}}',
                        value: 'createDate'
                    },
                    {
                        name: '{{"portForwarding.ts.Last Updated Date" | translate}}',
                        value: 'lastOpDate'
                    }
                ],

                done: (ret : Directive.SortByData) => {
                    pfMgr.setSortBy(ret);
                    $scope.oPortForwardingGrid.refresh();
                }
            };

            $scope.optionsSearch = {
                fields: ApiHeader.PortForwardingRuleInventoryQueryable,
                name: 'PortForwarding',
                schema: {
                    state: {
                        type: Directive.SearchBoxSchema.VALUE_TYPE_LIST,
                        list: ['Enabled', 'Disabled']
                    },
                    protocol: {
                        type: Directive.SearchBoxSchema.VALUE_TYPE_LIST,
                        list: ['UDP', 'TCP']
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
                    pfMgr.query(qobj, (PortForwardings : PortForwarding[], total:number)=> {
                        $scope.oPortForwardingGrid.refresh(PortForwardings);
                    });
                }
            };

            $scope.funcGridDoubleClick = (e) => {
                if (Utils.notNullnotUndefined($scope.model.current)) {
                    var url = Utils.sprintf('/portForwarding/{0}', $scope.model.current.uuid);
                    $location.path(url);
                    e.preventDefault();
                }
            };

            $scope.filterBy = new FilterBy($scope);

            $scope.funcSearch = (win : any) => {
                win.open();
            };

            $scope.funcCreatePortForwarding = (win : any) => {
                win.open();
            };

            $scope.funcDeletePortForwarding = () => {
                $scope.deletePortForwarding.open();
            };

            $scope.optionsDeletePortForwarding = {
                title: 'DELETE PORT FORWARDING RULE',
                description: ()=>{
                    return $scope.model.current.name;
                },
                btnType: 'btn-danger',
                width: '350px',

                confirm: ()=> {
                    pfMgr.delete($scope.model.current, (ret : any)=> {
                        $scope.oPortForwardingGrid.deleteCurrent();
                    });
                }
            };

            $scope.funcRefresh = ()=> {
                $scope.oPortForwardingGrid.refresh();
            };

            $scope.funcIsActionShow = ()=> {
                return !Utils.isEmptyObject($scope.model.current);
            };

            $scope.funcIsActionDisabled = ()=> {
                return Utils.notNullnotUndefined($scope.model.current) && $scope.model.current.isInProgress();
            };

            $scope.optionsAttachPortForwarding = {
                pf: null,
                done: ()=>{
                    var pf = $scope.optionsAttachPortForwarding.pf;
                    var qobj = new ApiHeader.QueryObject();
                    qobj.conditions = [{
                        name: 'uuid',
                        op: '=',
                        value: pf.vmNicUuid
                    }];

                    vmMgr.queryVmNic(qobj, (nics: MVmInstance.VmNic[])=>{
                        pf.extendVmNicIp(nics[0].ip);
                    });
                }
            };

            $scope.optionsDetachPortForwarding = {
                pf: null,
                done: ()=>{
                    $scope.optionsDetachPortForwarding.pf.extendVmNicIp(null);
                }
            };

            $scope.$watch(()=>{
                return $scope.model.current;
            }, ()=>{
                if (Utils.notNullnotUndefined($scope.model.current)) {
                    $scope.optionsAttachPortForwarding.pf = $scope.model.current;
                    $scope.optionsDetachPortForwarding.pf = $scope.model.current;
                }
            });

            $scope.optionsCreatePortForwarding = {
                done: (pf : PortForwarding) => {
                    var chain = new Utils.Chain();
                    var composedPortForwarding = {};
                    angular.extend(composedPortForwarding, pf);
                    chain.then(()=>{
                        var qobj = new ApiHeader.QueryObject();
                        qobj.conditions = [
                            {
                                name: 'uuid',
                                op: '=',
                                value: pf.vipUuid
                            }
                        ];
                        vipMgr.query(qobj, (ret: MVip.Vip[])=>{
                            var vip = ret[0];
                            pf.extendVip(vip.ip);
                            chain.next();
                        });
                    }).then(()=>{
                        if (!Utils.notNullnotUndefined(pf.vmNicUuid)) {
                            chain.next();
                            return;
                        }

                        var qobj = new ApiHeader.QueryObject();
                        qobj.conditions = [
                            {
                                name: 'uuid',
                                op: '=',
                                value: pf.vmNicUuid
                            }
                        ];
                        vmMgr.queryVmNic(qobj, (ret: MVmInstance.VmNic[])=>{
                            var nic = ret[0];
                            pf.extendVmNicIp(nic.ip);
                            chain.next();
                        })
                    }).done(()=>{
                        $scope.oPortForwardingGrid.add(pf);
                    }).start();
                }
            };
        }
    }

    export class CreatePortForwarding implements ng.IDirective {
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

        static USE_EXISTING_VIP = "existing";
        static CREATE_NEW_VIP = "new";

        existingVip: any = {};

        open() {
            var win = this.$scope.winCreatePortForwarding__;
            this.$scope.button.reset();
            var chain = new Utils.Chain();
            this.existingVip = {};
            this.$scope.vipPage.method = CreatePortForwarding.CREATE_NEW_VIP;
            this.$scope.vipPage.isVipCreating = false;
            this.$scope.vipPage.vipUuid = null;
            this.$scope.vipPage.vip = null;
            this.$scope.infoPage.protocolType = 'TCP';
            chain.then(()=>{
                var qobj = new ApiHeader.QueryObject();
                qobj.conditions = [{
                    name: 'state',
                    op: '=',
                    value: 'Enabled'
                },{
                    name: 'useFor',
                    op: 'is null',
                    value: null
                }];
                this.vipMgr.query(qobj, (ret: MVip.Vip[])=>{
                    this.$scope.vipListOptions__.dataSource.data(ret);
                    if (ret.length > 0) {
                        angular.forEach(ret, (it)=>{
                            this.existingVip[it.uuid] = it;
                        });
                        this.$scope.vipPage.vipUuid = null;
                    }
                    chain.next();
                });
            }).then(()=>{
                var qobj = new ApiHeader.QueryObject();
                qobj.conditions = [{
                    name: 'state',
                    op: '=',
                    value: 'Enabled'
                },{
                    name: 'useFor',
                    op: '=',
                    value: 'PortForwarding'
                }];

                this.vipMgr.query(qobj, (ret: MVip.Vip[])=>{
                    if (ret.length > 0) {
                        angular.forEach(ret, (it)=>{
                            this.$scope.vipListOptions__.dataSource.add(it);
                            this.existingVip[it.uuid] = it;
                        });
                        this.$scope.vipPage.vipUuid = null;
                    }
                    chain.next();
                });
            }).then(()=>{
                var qobj = new ApiHeader.QueryObject();
                qobj.conditions = [];
                this.l3Mgr.query(qobj, (ret: ML3Network.L3Network[])=>{
                    this.$scope.l3NetworkListOptions__.dataSource.data(ret);
                    if (ret.length > 0) {
                        this.$scope.vipPage.l3NetworkUuid = ret[0].uuid;
                    }
                    chain.next();
                });
            }).done(()=>{
                win.center();
                win.open();
            }).start();
        }

        constructor(private api : Utils.Api, private pfMgr : PortForwardingManager, private vipMgr: MVip.VipManager,
                    private l3Mgr: ML3Network.L3NetworkManager, private vmMgr: MVmInstance.VmInstanceManager) {
            this.scope = true;
            this.link = ($scope : any, $element, $attrs : any, $ctrl, $transclude) => {
                var instanceName = $attrs.zCreatePortForwardingRule;
                var parentScope = $scope.$parent;
                parentScope[instanceName] = this;
                this.options = {};
                var optionName = $attrs.zOptions;
                if (angular.isDefined(optionName)) {
                    this.options = parentScope[optionName];
                    $scope.$watch(()=> {
                        return parentScope[optionName];
                    }, ()=> {
                        this.options = parentScope[optionName];
                    });
                }


                var vipPage: Utils.WizardPage = $scope.vipPage = {
                    activeState: true,

                    method: null,
                    vipUuid: null,
                    l3NetworkUuid: null,
                    vip: null,
                    isVipCreating: false,

                    canCreate(): boolean {
                        return !Utils.notNullnotUndefined(this.vip) && Utils.notNullnotUndefined(this.l3NetworkUuid) && this.method == CreatePortForwarding.CREATE_NEW_VIP;
                    },

                    create(): void {
                        this.isVipCreating = true;
                        vipMgr.create({
                            name: Utils.shortHashName('vip'),
                            l3NetworkUuid: this.l3NetworkUuid
                        }, (ret: MVip.Vip)=>{
                            this.vip = ret;
                            this.isVipCreating = false;
                        });
                    },

                    canMoveToPrevious(): boolean {
                        return false;
                    },

                    canMoveToNext(): boolean {
                        return (Utils.notNullnotUndefined(this.vipUuid) && this.vipUuid != "") || Utils.notNullnotUndefined(this.vip);
                    },

                    show(): void {
                        this.getAnchorElement().tab('show');
                    },

                    getAnchorElement() : any {
                        return $('.nav a[data-target="#createPortForwardingVip"]');
                    },

                    active(): void {
                        this.activeState = true;
                    },

                    isActive(): boolean {
                        return this.activeState;
                    },

                    getPageName(): string {
                        return 'createPortForwardingVip';
                    },

                    hasL3Network() : boolean {
                        return $scope.l3NetworkListOptions__.dataSource.data().length > 0;
                    },

                    hasVip() : boolean {
                        return $scope.vipListOptions__.dataSource.data().length > 0;
                    },

                    reset() : void {
                        this.method = CreatePortForwarding.CREATE_NEW_VIP;
                        this.l3NetworkUuid = null;
                        this.vip = null;
                        this.vipUuid = null;
                        this.activeState = false;
                    }
                };

                $scope.vipMethodOptions__ = {
                    dataSource: new kendo.data.DataSource({
                        data: [{
                            name: '{{"portForwarding.ts.Create New VIP" | translate}}',
                            field: CreatePortForwarding.CREATE_NEW_VIP
                        },{
                            name: '{{"portForwarding.ts.Use Existing VIP" | translate}}',
                            field: CreatePortForwarding.USE_EXISTING_VIP
                        }]
                    }),
                    dataTextField: "name",
                    dataValueField: "field"
                };

                var infoPage: Utils.WizardPage = $scope.infoPage  = {
                    activeState: true,

                    name: null,
                    description: null,
                    vipPortStart: null,
                    vipPortEnd: null,
                    privatePortEnd: null,
                    privatePortStart: null,
                    protocolType: null,
                    allowedCidr: null,

                    isVipStartPortValid() {
                        if (Utils.notNullnotUndefined(this.vipPortStart)) {
                            return Utils.isValidPort(this.vipPortStart);
                        }
                        return true;
                    },

                    isVipEndPortValid() {
                        if (Utils.notNullnotUndefined(this.vipPortEnd)) {
                            return Utils.isValidPort(this.vipPortEnd);
                        }
                        return true;
                    },

                    isGuestStartPortValid() {
                        if (Utils.notNullnotUndefined(this.privatePortStart)) {
                            return Utils.isValidPort(this.privatePortStart);
                        }
                        return true;
                    },

                    isGuestEndPortValid() {
                        if (Utils.notNullnotUndefined(this.privatePortEnd)) {
                            return Utils.isValidPort(this.privatePortEnd);
                        }
                        return true;
                    },

                    isCIDRValid() {
                        if (Utils.notNullnotUndefined(this.allowedCidr) && this.allowedCidr != "") {
                            return Utils.isValidCidr(this.allowedCidr);
                        }
                        return true;
                    },

                    canMoveToPrevious(): boolean {
                        return true;
                    },

                    canMoveToNext(): boolean {
                        return Utils.notNullnotUndefined(this.name) && Utils.notNullnotUndefined(this.vipPortStart) && Utils.notNullnotUndefined(this.vipPortEnd)
                            && Utils.notNullnotUndefined(this.privatePortStart) && Utils.notNullnotUndefined(this.privatePortEnd) && Utils.notNullnotUndefined(this.protocolType)
                            && this.isVipStartPortValid() && this.isVipEndPortValid() &&  this.isGuestStartPortValid() && this.isGuestEndPortValid() && this.isCIDRValid();
                    },

                    show(): void {
                        this.getAnchorElement().tab('show');
                    },

                    getAnchorElement() : any {
                        return $('.nav a[data-target="#createPortForwardingInfo"]');
                    },

                    active(): void {
                        this.activeState = true;
                    },

                    isActive(): boolean {
                        return this.activeState;
                    },

                    getPageName(): string {
                        return 'createPortForwardingInfo';
                    },

                    reset() : void {
                        this.name = Utils.shortHashName('pf');
                        this.description = null;
                        this.protocolType = null;
                        this.vipPortStart = null;
                        this.vipPortEnd = null;
                        this.privatePortStart = null;
                        this.privatePortEnd = null;
                        this.allowedCidr = null;
                        this.activeState = false;
                    }
                } ;

                var attachPage: Utils.WizardPage = $scope.attachPage  = {
                    activeState: true,

                    vmNic: null,
                    pfRule: null,

                    canMoveToPrevious(): boolean {
                        return false;
                    },

                    canMoveToNext(): boolean {
                        return Utils.notNullnotUndefined(this.pfRule);
                    },

                    show(): void {
                        this.getAnchorElement().tab('show');
                    },

                    getAnchorElement() : any {
                        return $('.nav a[data-target="#attachVm"]');
                    },

                    active(): void {
                        this.activeState = true;
                    },

                    isActive(): boolean {
                        return this.activeState;
                    },

                    getPageName(): string {
                        return 'attachVm';
                    },

                    hasVm(): boolean {
                        return $scope.vmListOptions__.dataSource.data().length > 0;
                    },

                    beforeMoveToNext(done:()=>void): void {
                        var vipUuid = null;
                        if (Utils.notNullnotUndefined($scope.vipPage.vip)) {
                            vipUuid = $scope.vipPage.vip.uuid;
                        } else {
                            vipUuid = $scope.vipPage.vipUuid;
                        }

                        var chain = new Utils.Chain();
                        var vmNics = [];
                        var composedVms = [];
                        chain.then(()=>{
                            $scope.infoPage.allowedCidr = $scope.infoPage.allowedCidr == "" ? null : $scope.infoPage.allowedCidr;
                            pfMgr.create({
                                vipUuid: vipUuid,
                                name: $scope.infoPage.name,
                                description: $scope.infoPage.description,
                                vipPortStart: $scope.infoPage.vipPortStart,
                                vipPortEnd: $scope.infoPage.vipPortEnd,
                                privatePortStart: $scope.infoPage.privatePortStart,
                                privatePortEnd: $scope.infoPage.privatePortEnd,
                                allowedCidr: $scope.infoPage.allowedCidr == null ? '0.0.0.0/0' : $scope.infoPage.allowedCidr,
                                protocolType: $scope.infoPage.protocolType
                            }, (ret : PortForwarding)=> {
                                this.pfRule = ret;
                                chain.next();
                            });
                        }).then(()=>{
                            pfMgr.getAttachableVmNicByPortForwardingUuid(this.pfRule.uuid, (ret: ApiHeader.VmNicInventory[])=>{
                                vmNics = ret;
                                chain.next();
                            });
                        }).done(()=>{
                            if (vmNics.length == 0) {
                                $scope.vmListOptions__.dataSource.data(composedVms);
                                $scope.attachPage.vmNicUuid = null;
                                done();
                                return;
                            }

                            var nicUuids = [];
                            angular.forEach(vmNics, (it)=>{
                                nicUuids.push(it.uuid);
                            });

                            var qobj = new ApiHeader.QueryObject();
                            qobj.conditions = [{
                                name: 'vmNics.uuid',
                                op: 'in',
                                value: nicUuids.join()
                            }];

                            vmMgr.query(qobj, (vms: MVmInstance.VmInstance[])=>{
                                angular.forEach(vms, (it)=>{
                                    angular.forEach(it.vmNics, (nic)=>{
                                        if (nicUuids.indexOf(nic.uuid) == -1) {
                                            return;
                                        }

                                        composedVms.push({
                                            name: it.name,
                                            uuid: it.uuid,
                                            nicDeviceId: nic.deviceId,
                                            nicIp: nic.ip,
                                            nicNetmask: nic.netmask,
                                            nicGateway: nic.gateway,
                                            nicMac: nic.mac,
                                            l3NetworkUuid: nic.l3NetworkUuid,
                                            nicUuid: nic.uuid
                                        });
                                    });
                                });

                                $scope.vmListOptions__.dataSource.data(composedVms);
                                $scope.attachPage.vmNicUuid = null;
                                done();
                            });
                        }).start();
                    },


                    reset() : void {
                        this.vmNicUuid = null;
                        this.activeState = false;
                        this.pfRule = null;
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
                        if ($scope.vmListOptions__.dataSource.data().length > 0 && Utils.notNullnotUndefinedNotEmptyString($scope.attachPage.vmNicUuid)) {
                            pfMgr.attach($scope.attachPage.pfRule, $scope.attachPage.vmNicUuid, ()=>{
                                if (Utils.notNullnotUndefined(this.options.done)) {
                                    this.options.done($scope.attachPage.pfRule);
                                }
                            });
                        } else {
                            this.options.done($scope.attachPage.pfRule);
                        }

                        $scope.winCreatePortForwarding__.close();
                    }
                };

                $scope.button = new Utils.WizardButton([
                    vipPage, infoPage, attachPage
                ], mediator);

                $scope.winCreatePortForwardingOptions__ = {
                    width: '700px',
                    animation: false,
                    modal: true,
                    draggable: false,
                    resizable: false
                };

                $scope.protocolOptions__ = {
                    dataSource: new kendo.data.DataSource({data: [
                        'TCP', 'UDP'
                    ]})
                };

                $scope.vipListOptions__ = {
                    dataSource: new kendo.data.DataSource({data: []}),
                    dataTextField: "name",
                    dataValueField: "uuid",
                    template: '<div style="color: black"><span class="z-label">{{"portForwarding.ts.Name" | translate}}:</span><span>#: name #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"portForwarding.ts.IP" | translate}}:</span><span>#: ip #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"portForwarding.ts.Gateway" | translate}}:</span><span>#: gateway #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"portForwarding.ts.Netmask" | translate}}:</span><span>#: netmask #</span></div>'
                };

                $scope.l3NetworkListOptions__ = {
                    dataSource: new kendo.data.DataSource({data: []}),
                    dataTextField: "name",
                    dataValueField: "uuid",
                    template: '<div style="color: black"><span class="z-label">{{"portForwarding.ts.Name" | translate}}:</span><span>#: name #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"portForwarding.ts.Type" | translate}}:</span><span>#: type #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"portForwarding.ts.Zone UUID" | translate}}:</span><span>#: zoneUuid #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"portForwarding.ts.L2 Network UUID" | translate}}:</span><span>#: l2NetworkUuid #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"portForwarding.ts.UUID" | translate}}:</span><span>#: uuid #</span></div>'
                };

                $scope.vmListOptions__ = {
                    dataSource: new kendo.data.DataSource({data: []}),
                    dataTextField: "name",
                    dataValueField: "nicUuid",
                    template: '<div style="color: black"><span class="z-label">{{"portForwarding.ts.VM Name" | translate}}:</span><span>#: name #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"portForwarding.ts.VM UUID" | translate}}:</span><span>#: uuid #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"portForwarding.ts.Nic DeviceId" | translate}}:</span><span>#: nicDeviceId #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"portForwarding.ts.Nic Ip" | translate}}:</span><span>#: nicIp #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"portForwarding.ts.Nic Netmask" | translate}}:</span><span>#: nicNetmask #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"portForwarding.ts.Nic Gateway" | translate}}:</span><span>#: nicGateway #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"portForwarding.ts.Nic Mac" | translate}}:</span><span>#: nicMac #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"portForwarding.ts.L3 Network UUID" | translate}}:</span><span>#: l3NetworkUuid #</span></div>'
                };

                this.$scope = $scope;
            };
            this.restrict = 'EA';
            this.replace = true;
            this.templateUrl = '/static/templates/portForwarding/createPortForwarding.html';
        }
    }


    export class AttachPortForwarding implements ng.IDirective {
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
            this.$scope.vmListOptions__.dataSource.data([]);

            var chain = new Utils.Chain();
            var vmNics = [];
            var composedVms = [];
            chain.then(()=>{
                this.pfMgr.getAttachableVmNicByPortForwardingUuid(this.options.pf.uuid, (nics: ApiHeader.VmNicInventory[])=>{
                    vmNics = typeof(nics) == 'undefined' ? [] : nics;
                    chain.next();
                });
            }).then(()=>{
                if (vmNics.length == 0) {
                    this.$scope.vmListOptions__.dataSource.data(composedVms);
                    this.$scope.vmNicUuid = null;
                    chain.next();
                    return;
                }

                var nicUuids = [];
                angular.forEach(vmNics, (it)=>{
                    nicUuids.push(it.uuid);
                });

                var qobj = new ApiHeader.QueryObject();
                qobj.conditions = [{
                    name: 'vmNics.uuid',
                    op: 'in',
                    value: nicUuids.join()
                }];

                this.vmMgr.query(qobj, (vms: MVmInstance.VmInstance[])=>{
                    angular.forEach(vms, (it)=>{
                        angular.forEach(it.vmNics, (nic)=>{
                            if (nicUuids.indexOf(nic.uuid) == -1) {
                                return;
                            }

                            composedVms.push({
                                name: it.name,
                                uuid: it.uuid,
                                nicDeviceId: nic.deviceId,
                                nicIp: nic.ip,
                                nicNetmask: nic.netmask,
                                nicGateway: nic.gateway,
                                nicMac: nic.mac,
                                l3NetworkUuid: nic.l3NetworkUuid,
                                nicUuid: nic.uuid
                            });
                        });
                    });

                    this.$scope.vmListOptions__.dataSource.data(composedVms);
                    if (composedVms.length > 0) {
                        this.$scope.vmNicUuid = composedVms[0].nicUuid;
                    }
                    chain.next();
                });
            }).done(()=>{
                this.$scope.attachPortForwarding__.center();
                this.$scope.attachPortForwarding__.open();
            }).start();
        }

        constructor(private pfMgr: PortForwardingManager, private vmMgr: MVmInstance.VmInstanceManager) {
            this.scope = true;
            this.restrict = 'EA';
            this.replace = true;
            this.templateUrl = '/static/templates/portForwarding/attachPortForwarding.html';
            this.link = ($scope : any, $element, $attrs : any, $ctrl, $transclude) => {
                var parent = $scope.$parent;
                parent[$attrs.zPortForwardingAttachVm] = this;
                this.options = parent[$attrs.zOptions];

                $scope.vmListOptions__ = {
                    dataSource: new kendo.data.DataSource({data: []}),
                    dataTextField: "name",
                    dataValueField: "nicUuid",
                    template: '<div style="color: black"><span class="z-label">{{"portForwarding.ts.VM Name" | translate}}:</span><span>#: name #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"portForwarding.ts.VM UUID" | translate}}:</span><span>#: uuid #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"portForwarding.ts.Nic DeviceId" | translate}}:</span><span>#: nicDeviceId #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"portForwarding.ts.Nic Ip" | translate}}:</span><span>#: nicIp #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"portForwarding.ts.Nic Netmask" | translate}}:</span><span>#: nicNetmask #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"portForwarding.ts.Nic Gateway" | translate}}:</span><span>#: nicGateway #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"portForwarding.ts.Nic Mac" | translate}}:</span><span>#: nicMac #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"portForwarding.ts.L3 Network UUID" | translate}}:</span><span>#: l3NetworkUuid #</span></div>'
                };

                $scope.hasVm = () => {
                    return $scope.vmListOptions__.dataSource.data().length > 0;
                };

                $scope.canProceed = ()=> {
                    return Utils.notNullnotUndefined($scope.vmNicUuid);
                };

                $scope.cancel = () => {
                    $scope.attachPortForwarding__.close();
                };

                $scope.done = () => {
                    pfMgr.attach(this.options.pf, $scope.vmNicUuid, ()=>{
                        if (Utils.notNullnotUndefined(this.options.done)) {
                            this.options.done();
                        }
                    });


                    $scope.attachPortForwarding__.close();
                };

                this.$scope = $scope;

                $scope.attachPortForwardingOptions__ = {
                    width: '550px'
                };
            }
        }
    }

    export class DetachPortForwarding implements ng.IDirective {
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
            var qobj = new ApiHeader.QueryObject();
            this.$scope.pf = this.options.pf;
            qobj.conditions = [
                {
                    name: 'vmNics.uuid',
                    op: '=',
                    value: this.options.pf.vmNicUuid
                }
            ];

            this.vmMgr.query(qobj, (vms: ApiHeader.VmInstanceInventory[])=>{
                if (vms.length > 0) {
                    var vm = vms[0];
                    this.$scope.vm = vm;

                    angular.forEach(vm.vmNics, (it)=>{
                        this.$scope.vm['nicDeviceId'] = it.deviceId;
                        this.$scope.vm['nicMac'] = it.mac;
                        this.$scope.vm['nicIp'] = it.ip;
                        this.$scope.vm['nicNetmask'] = it.netmask;
                        this.$scope.vm['nicGateway'] = it.gateway;
                    });
                }
                this.$scope.detachPortForwarding__.center();
                this.$scope.detachPortForwarding__.open();
            });
        }

        constructor(private pfMgr: PortForwardingManager, private vmMgr: MVmInstance.VmInstanceManager) {
            this.scope = true;
            this.restrict = 'EA';
            this.replace = true;
            this.templateUrl = '/static/templates/portForwarding/detachPortForwarding.html';
            this.link = ($scope : any, $element, $attrs : any, $ctrl, $transclude) => {
                var parent = $scope.$parent;
                parent[$attrs.zPortForwardingDetachVm] = this;
                this.options = parent[$attrs.zOptions];

                $scope.cancel = () => {
                    $scope.detachPortForwarding__.close();
                };

                $scope.done = () => {
                    pfMgr.detach(this.options.pf, ()=>{
                        if (this.options.done) {
                            this.options.done();
                        }
                    });
                    $scope.detachPortForwarding__.close();
                };

                $scope.optionsDetachPortForwarding__ = {
                    width: '500px'
                };


                $scope.vmStateLabel = ()=> {
                    if (!Utils.notNullnotUndefined($scope.vm)) {
                        return '';
                    }

                    var vm = $scope.vm;
                    if (vm.state == 'Running') {
                        return 'label label-success';
                    } else if (vm.state == 'Stopped') {
                        return 'label label-danger';
                    } else if (vm.state == 'Unknown') {
                        return 'label label-warning';
                    } else {
                        return 'label label-default';
                    }
                };

                $scope.isVmInCorrectState = () => {
                    if (!Utils.notNullnotUndefined($scope.vm)) {
                        return true;
                    }

                    return $scope.vm.state == 'Running' || $scope.vm.state == 'Stopped';
                };

                $scope.canProceed = ()=> {
                    if (!Utils.notNullnotUndefined($scope.vm)) {
                        return false;
                    }

                    return $scope.isVmInCorrectState();
                };

                this.$scope = $scope;
            }
        }
    }
}

angular.module('root').factory('PortForwardingManager', ['Api', '$rootScope', (api, $rootScope)=> {
    return new MPortForwarding.PortForwardingManager(api, $rootScope);
}]).directive('zCreatePortForwardingRule', ['Api', 'PortForwardingManager', 'VipManager', 'L3NetworkManager', 'VmInstanceManager', (api, pfMgr, vipMgr, l3Mgr, vmMgr)=>{
    return new MPortForwarding.CreatePortForwarding(api, pfMgr, vipMgr, l3Mgr, vmMgr);
}]).directive('zPortForwardingAttachVm', ['PortForwardingManager', 'VmInstanceManager', (pfMgr, vmMgr)=>{
    return new MPortForwarding.AttachPortForwarding(pfMgr, vmMgr);
}]).directive('zPortForwardingDetachVm', ['PortForwardingManager', 'VmInstanceManager', (pfMgr, vmMgr)=>{
    return new MPortForwarding.DetachPortForwarding(pfMgr, vmMgr);
}]).config(['$routeProvider', function(route) {
    route.when('/portForwarding', {
        templateUrl: '/static/templates/portForwarding/portForwarding.html',
        controller: 'MPortForwarding.Controller'
    }).when('/portForwarding/:uuid', {
        templateUrl: '/static/templates/portForwarding/details.html',
        controller: 'MPortForwarding.DetailsController',
        resolve: {
            current: function($q : ng.IQService, $route: any, PortForwardingManager: MPortForwarding.PortForwardingManager, VmInstanceManager: MVmInstance.VmInstanceManager, VipManager: MVip.VipManager) {
                var defer = $q.defer();
                var uuid = $route.current.params.uuid;
                var ret = {
                    pf: null,
                    nic: null,
                    vip: null
                };

                var chain = new Utils.Chain();
                chain.then(()=>{
                    var qobj = new ApiHeader.QueryObject();
                    qobj.addCondition({name: 'uuid', op: '=', value: uuid});
                    PortForwardingManager.query(qobj, (pfs: MPortForwarding.PortForwarding[])=>{
                        ret.pf = pfs[0]
                        chain.next();
                    });
                }).then(()=>{
                    if (!Utils.notNullnotUndefined(ret.pf.vmNicUuid)) {
                        chain.next();
                        return;
                    }

                    var qobj = new ApiHeader.QueryObject();
                    qobj.conditions = [{
                        name: 'uuid',
                        op: '=',
                        value: ret.pf.vmNicUuid
                    }];

                    VmInstanceManager.queryVmNic(qobj, (nics: MVmInstance.VmNic[])=>{
                        ret.nic = nics[0];
                        chain.next();
                    });
                }).then(()=>{
                    var qobj = new ApiHeader.QueryObject();
                    qobj.conditions = [{
                        name: 'uuid',
                        op: '=',
                        value: ret.pf.vipUuid
                    }];

                    VipManager.query(qobj, (vips: MVip.Vip[])=>{
                        ret.vip = vips[0];
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

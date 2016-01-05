
/// <reference path="d.ts/angularjs/angular.d.ts" />
/// <reference path="d.ts/kendo.all.d.ts" />

module MEip {
    export class Eip extends ApiHeader.EipInventory {
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


        updateObservableObject(inv : ApiHeader.EipInventory) {
            // self : ObservableObject
            var self : any = this;
            self.set('uuid', inv.uuid);
            self.set('name', inv.name);
            self.set('description', inv.description);
            self.set('state', inv.state);
            self.set('vmNicUuid', inv.vmNicUuid);
            self.set('vipUuid', inv.vipUuid);
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

        static wrap(obj: any) : Eip {
            var eip = new Eip();
            angular.extend(eip, obj);
            return eip;
        }
    }

    export class EipManager {
        static $inject = ['Api', '$rootScope'];

        constructor(private api : Utils.Api, private $rootScope: ng.IRootScopeService) {
        }

        private sortBy : Directive.SortByData;

        setSortBy(sortBy : Directive.SortByData) {
            this.sortBy = sortBy;
        }

        private wrap(Eip : Eip) : any {
            return new kendo.data.ObservableObject(Eip);
        }

        create(eip : any, done : (ret : Eip)=>void) {
            var msg : any = new ApiHeader.APICreateEipMsg();
            msg.name = eip.name;
            msg.description = eip.description;
            msg.vipUuid = eip.vipUuid;
            msg.vmNicUuid = eip.vmNicUuid;
            this.api.asyncApi(msg, (ret : ApiHeader.APICreateEipEvent)=> {
                var c = new Eip();
                angular.extend(c, ret.inventory);
                done(this.wrap(c));
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Created new EIP: {0}',c.name),
                    link: Utils.sprintf('/#/eip/{0}', c.uuid)
                });
            });
        }

        query(qobj : ApiHeader.QueryObject, callback : (eips : Eip[], total: number) => void) : void {
            var msg = new ApiHeader.APIQueryEipMsg();
            msg.count = qobj.count === true;
            msg.start = qobj.start;
            msg.limit = qobj.limit;
            msg.replyWithCount = true;
            msg.conditions = qobj.conditions ? qobj.conditions : [];
            if (Utils.notNullnotUndefined(this.sortBy) && this.sortBy.isValid()) {
                msg.sortBy = this.sortBy.field;
                msg.sortDirection = this.sortBy.direction;
            }
            this.api.syncApi(msg, (ret : ApiHeader.APIQueryEipReply)=>{
                var pris = [];
                ret.inventories.forEach((inv : ApiHeader.EipInventory)=> {
                    var c = new Eip();
                    angular.extend(c, inv);
                    pris.push(this.wrap(c));
                });
                callback(pris, ret.total);
            });
        }


        getAttachableVmNicByEipUuid(uuid: string, done: (ret:ApiHeader.VmNicInventory[])=>void) {
            var msg = new ApiHeader.APIGetEipAttachableVmNicsMsg();
            msg.eipUuid = uuid;
            this.api.syncApi(msg, (ret: ApiHeader.APIGetEipAttachableVmNicsReply)=>{
                done(ret.inventories);
            });
        }

        getAttachableVmNicByVipUuid(uuid: string, done: (ret:ApiHeader.VmNicInventory[])=>void) {
            var msg = new ApiHeader.APIGetEipAttachableVmNicsMsg();
            msg.vipUuid = uuid;
            this.api.syncApi(msg, (ret: ApiHeader.APIGetEipAttachableVmNicsReply)=>{
                done(ret.inventories);
            });
        }

        attach(eip: Eip, vmNicUuid: string, done: ()=>void) {
            eip.progressOn();
            var msg = new ApiHeader.APIAttachEipMsg();
            msg.eipUuid = eip.uuid;
            msg.vmNicUuid = vmNicUuid;
            this.api.asyncApi(msg, (ret: ApiHeader.APIAttachEipEvent)=>{
                eip.updateObservableObject(ret.inventory);
                eip.progressOff();
                if (Utils.notNullnotUndefined(done)) {
                    done();
                }
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Attached EIP: {0}',eip.name),
                    link: Utils.sprintf('/#/eip/{0}', eip.uuid)
                });
            });
        }

        detach(eip: Eip, done: ()=>void) {
            eip.progressOn();
            var msg = new ApiHeader.APIDetachEipMsg();
            msg.uuid = eip.uuid;
            this.api.asyncApi(msg, (ret: ApiHeader.APIDetachEipEvent)=>{
                eip.updateObservableObject(ret.inventory);
                eip.progressOff();
                if (Utils.notNullnotUndefined(done)) {
                    done();
                }
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Detached EIP: {0}',eip.name),
                    link: Utils.sprintf('/#/eip/{0}', eip.uuid)
                });
            });
        }

        disable(eip : Eip) {
            eip.progressOn();
            var msg = new ApiHeader.APIChangeEipStateMsg();
            msg.stateEvent = 'disable';
            msg.uuid = eip.uuid;
            this.api.asyncApi(msg, (ret : ApiHeader.APIChangeEipStateEvent) => {
                eip.updateObservableObject(ret.inventory);
                eip.progressOff();
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Disabled EIP: {0}',eip.name),
                    link: Utils.sprintf('/#/eip/{0}', eip.uuid)
                });
            });
        }

        enable(eip : Eip) {
            eip.progressOn();
            var msg = new ApiHeader.APIChangeEipStateMsg();
            msg.stateEvent = 'enable';
            msg.uuid = eip.uuid;
            this.api.asyncApi(msg, (ret : ApiHeader.APIChangeEipStateEvent) => {
                eip.updateObservableObject(ret.inventory);
                eip.progressOff();
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Enabled EIP: {0}', eip.name),
                    link: Utils.sprintf('/#/eip/{0}', eip.uuid)
                });
            });
        }

        delete(eip : Eip, done : (ret : any)=>void) {
            eip.progressOn();
            var msg = new ApiHeader.APIDeleteEipMsg();
            msg.uuid = eip.uuid;
            this.api.asyncApi(msg, (ret : any)=> {
                eip.progressOff();
                done(ret);
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Deleted EIP: {0}', eip.name)
                });
            });
        }
    }

    export class EipModel extends Utils.Model {
        constructor() {
            super();
            this.current = new Eip();
        }
    }

    class OEipGrid extends Utils.OGrid {
        constructor($scope: any, private eipMgr : EipManager, private vmMgr: MVmInstance.VmInstanceManager,
                    private vipMgr: MVip.VipManager) {
            super();
            super.init($scope, $scope.eipGrid);
            this.options.columns = [
                {
                    field: 'name',
                    title: '{{"eip.ts.NAME" | translate}}',
                    width: '25%',
                    template: '<a href="/\\#/eip/{{dataItem.uuid}}">{{dataItem.name}}</a>'
                },
                {
                    field: 'state',
                    title: '{{"eip.ts.STATE" | translate}}',
                    width: '25%',
                    template: '<span class="{{dataItem.stateLabel()}}">{{dataItem.state}}</span>'
                },
                {
                    field: 'vipIp',
                    title: '{{"eip.ts.VIP IP" | translate}}',
                    width: '25%'
                },
                {
                    field: 'vmNicIp',
                    title: '{{"eip.ts.VM NIC IP" | translate}}',
                    width: '25%'
                },
            ];

            this.options.dataSource.transport.read = (options)=> {
                var chain = new Utils.Chain();
                var eips = [];
                var vips = {};
                var vmNics = {};
                var composedEip = [];
                var total: number = null;

                chain.then(()=>{
                    var qobj = new ApiHeader.QueryObject();
                    qobj.limit = options.data.take;
                    qobj.start = options.data.pageSize * (options.data.page - 1);
                    eipMgr.query(qobj, (ret:Eip[], amount:number)=> {
                        eips = ret;
                        total = amount;
                        chain.next();
                    });
                }).then(()=>{
                    if (eips.length == 0) {
                        chain.next();
                        return;
                    }

                    var nicUuids = [];
                    angular.forEach(eips, (it)=>{
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
                    if (eips.length == 0) {
                        chain.next();
                        return;
                    }

                    var vipUuids = [];
                    angular.forEach(eips, (it)=>{
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
                    if (eips.length == 0) {
                        chain.next();
                        return;
                    }

                    angular.forEach(eips, (it)=>{
                        if (Utils.notNullnotUndefined(it.vmNicUuid)) {
                            var nic: any = vmNics[it.vmNicUuid];
                            it.extendVmNicIp(nic.ip);
                        }

                        var vip: any = vips[it.vipUuid];
                        it.extendVip(vip.ip);
                        composedEip.push(it);
                    });

                    chain.next();
                }).done(()=>{
                    options.success({
                        data: composedEip,
                        total: total
                    });
                }).start();
            };
        }
    }

    class Action {
        enable() {
            this.eipMgr.enable(this.$scope.model.current);
        }

        disable() {
            this.eipMgr.disable(this.$scope.model.current);
        }

        attach() {
            this.$scope.attachEip.open();
        }

        detach() {
            this.$scope.detachEip.open();
        }

        constructor(private $scope : any, private eipMgr : EipManager) {
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
                            name: '{{"eip.ts.None" | translate}}',
                            value: FilterBy.NONE
                        },
                        {
                            name: '{{"eip.ts.STATE" | translate}}',
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
            this.$scope.oEipGrid.setFilter(this.toKendoFilter());
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
        static $inject = ['$scope', 'EipManager', '$routeParams', 'Tag', 'current', 'VmInstanceManager'];

        private loadSelf(uuid : string) {
            var qobj = new ApiHeader.QueryObject();
            qobj.addCondition({name: 'uuid', op: '=', value: uuid});
            this.eipMgr.query(qobj, (eips : Eip[], total:number)=> {
                this.$scope.model.current = eips[0];
            });
        }

        constructor(private $scope : any, private eipMgr : EipManager, private $routeParams : any,
                    private tagService : Utils.Tag, current: any, private vmMgr: MVmInstance.VmInstanceManager) {
            $scope.model = new EipModel();
            $scope.model.current = current.eip;
            $scope.vip = current.vip;
            $scope.nic = current.nic;

            $scope.funcDelete = (win : any) => {
                win.open();
            };

            $scope.action = new Action($scope, eipMgr);

            $scope.funcRefresh = ()=> {
                this.loadSelf($scope.model.current.uuid);
            };

            $scope.funcToolbarShow = ()=> {
                return Utils.notNullnotUndefined($scope.model.current);
            };

            $scope.optionsDeleteEip = {
                title: 'DELETE EIP',
                btnType: 'btn-danger',
                width: '350px',
                description: ()=>{
                    return current.name;
                },
                confirm: ()=> {
                    eipMgr.delete($scope.model.current, (ret : any)=> {
                        $scope.model.resetCurrent();
                    });
                }
            };

            $scope.optionsTag = {
                tags: [],
                createTag: (item)=> {
                    this.tagService.createTag(item.tag, $scope.model.current.uuid, ApiHeader.TagResourceTypeEipVO, (ret : ApiHeader.TagInventory)=> {
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

            $scope.optionsDetachEip = {
                eip: current.eip,
                done: ()=>{
                    $scope.nic = null
                }
            };

            $scope.optionsAttachEip = {
                eip: current.eip,
                done: ()=>{
                    var qobj = new ApiHeader.QueryObject();
                    qobj.conditions = [{
                        name: 'uuid',
                        op: '=',
                        value: current.eip.vmNicUuid
                    }];

                    vmMgr.queryVmNic(qobj, (nics: MVmInstance.VmNic[])=>{
                        current.eip.extendVmNicIp(nics[0].ip);
                        $scope.nic = nics[0];
                    });
                }
            };
        }
    }

    export class Controller {
        static $inject = ['$scope', 'EipManager', '$location', 'VipManager', 'VmInstanceManager'];

        constructor(private $scope : any, private eipMgr : EipManager, private $location : ng.ILocationService,
            private vipMgr: MVip.VipManager, private vmMgr: MVmInstance.VmInstanceManager) {
            $scope.model = new EipModel();
            $scope.oEipGrid = new OEipGrid($scope, eipMgr, vmMgr, vipMgr);
            $scope.action = new Action($scope, eipMgr);
            $scope.optionsSortBy = {
                fields: [
                    {
                        name: '{{"eip.ts.NAME" | translate}}',
                        value: 'name'
                    },
                    {
                        name: '{{"eip.ts.Description" | translate}}',
                        value: 'description'
                    },
                    {
                        name: '{{"eip.ts.STATE" | translate}}',
                        value: 'state'
                    },
                    {
                        name: '{{"eip.ts.Created Date" | translate}}',
                        value: 'createDate'
                    },
                    {
                        name: '{{"eip.ts.Last Updated Date" | translate}}',
                        value: 'lastOpDate'
                    }
                ],

                done: (ret : Directive.SortByData) => {
                    eipMgr.setSortBy(ret);
                    $scope.oEipGrid.refresh();
                }
            };

            $scope.optionsSearch = {
                fields: ApiHeader.EipInventoryQueryable,
                name: 'Eip',
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
                    eipMgr.query(qobj, (Eips : Eip[], total:number)=> {
                        $scope.oEipGrid.refresh(Eips);
                    });
                }
            };

            $scope.funcGridDoubleClick = (e) => {
                if (Utils.notNullnotUndefined($scope.model.current)) {
                    var url = Utils.sprintf('/eip/{0}', $scope.model.current.uuid);
                    $location.path(url);
                    e.preventDefault();
                }
            };

            $scope.filterBy = new FilterBy($scope);

            $scope.funcSearch = (win : any) => {
                win.open();
            };

            $scope.funcCreateEip = (win : any) => {
                win.open();
            };

            $scope.funcDeleteEip = () => {
                $scope.deleteEip.open();
            };

            $scope.optionsDeleteEip = {
                title: 'DELETE EIP',
                btnType: 'btn-danger',
                width: '350px',
                description: ()=>{
                    return $scope.model.current.name
                },

                confirm: ()=> {
                    eipMgr.delete($scope.model.current, (ret : any)=> {
                        $scope.oEipGrid.deleteCurrent();
                    });
                }
            };

            $scope.funcRefresh = ()=> {
                $scope.oEipGrid.refresh();
            };

            $scope.funcIsActionShow = ()=> {
                return !Utils.isEmptyObject($scope.model.current);
            };

            $scope.funcIsActionDisabled = ()=> {
                return Utils.notNullnotUndefined($scope.model.current) && $scope.model.current.isInProgress();
            };

            $scope.optionsAttachEip = {
                eip: null,
                done: ()=>{
                    var eip = $scope.optionsAttachEip.eip;
                    var qobj = new ApiHeader.QueryObject();
                    qobj.conditions = [{
                        name: 'uuid',
                        op: '=',
                        value: eip.vmNicUuid
                    }];

                    vmMgr.queryVmNic(qobj, (nics: MVmInstance.VmNic[])=>{
                        eip.extendVmNicIp(nics[0].ip);
                    });
                }
            };

            $scope.optionsDetachEip = {
                eip: null,
                done: ()=>{
                    $scope.optionsDetachEip.eip.extendVmNicIp(null);
                }
            };

            $scope.$watch(()=>{
                return $scope.model.current;
            }, ()=>{
                if (Utils.notNullnotUndefined($scope.model.current)) {
                    $scope.optionsAttachEip.eip = $scope.model.current;
                    $scope.optionsDetachEip.eip = $scope.model.current;
                }
            });

            $scope.optionsCreateEip = {
                done: (eip : Eip) => {
                    var chain = new Utils.Chain();
                    var composedEip = {};
                    angular.extend(composedEip, eip);
                    chain.then(()=>{
                        var qobj = new ApiHeader.QueryObject();
                        qobj.conditions = [
                            {
                                name: 'uuid',
                                op: '=',
                                value: eip.vipUuid
                            }
                        ];
                        vipMgr.query(qobj, (ret: MVip.Vip[])=>{
                            var vip = ret[0];
                            eip.extendVip(vip.ip);
                            chain.next();
                        });
                    }).then(()=>{
                        if (!Utils.notNullnotUndefined(eip.vmNicUuid)) {
                            chain.next();
                            return;
                        }

                        var qobj = new ApiHeader.QueryObject();
                        qobj.conditions = [
                            {
                                name: 'uuid',
                                op: '=',
                                value: eip.vmNicUuid
                            }
                        ];
                        vmMgr.queryVmNic(qobj, (ret: MVmInstance.VmNic[])=>{
                            var nic = ret[0];
                            eip.extendVmNicIp(nic.ip);
                            chain.next();
                        })
                    }).done(()=>{
                        $scope.oEipGrid.add(eip);
                    }).start();
                }
            };
        }
    }

    export class CreateEip implements ng.IDirective {
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
            var win = this.$scope.winCreateEip__;
            this.$scope.button.reset();
            var chain = new Utils.Chain();
            this.existingVip = {};
            this.$scope.vipPage.method = CreateEip.CREATE_NEW_VIP;
            this.$scope.vipPage.isVipCreating = false;
            this.$scope.vipPage.vipUuid = null;
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
                        //this.$scope.vipPage.vipUuid = ret[0].uuid;
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

        constructor(private api : Utils.Api, private eipMgr : EipManager, private vipMgr: MVip.VipManager,
                    private l3Mgr: ML3Network.L3NetworkManager, private vmMgr: MVmInstance.VmInstanceManager) {
            this.scope = true;
            this.link = ($scope : any, $element, $attrs : any, $ctrl, $transclude) => {
                var instanceName = $attrs.zCreateEip;
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
                        return !Utils.notNullnotUndefined(this.vip) && $scope.l3NetworkListOptions__.dataSource.data().length > 0 && this.method == CreateEip.CREATE_NEW_VIP;
                    },

                    hasL3Network() : boolean {
                        return $scope.l3NetworkListOptions__.dataSource.data().length > 0;
                    },

                    hasVip() : boolean {
                        return $scope.vipListOptions__.dataSource.data().length > 0;
                    },

                    create(): void {
                        this.isVipCreating = true;
                        vipMgr.create({
                            name: Utils.sprintf('vip-{0}', Utils.uuid()),
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
                        return Utils.notNullnotUndefined(this.vipUuid) || Utils.notNullnotUndefined(this.vip);
                    },

                    show(): void {
                        this.getAnchorElement().tab('show');
                    },

                    getAnchorElement() : any {
                        return $('.nav a[data-target="#createEipVip"]');
                    },

                    active(): void {
                        this.activeState = true;
                    },

                    isActive(): boolean {
                        return this.activeState;
                    },

                    getPageName(): string {
                        return 'createEipVip';
                    },

                    reset() : void {
                        this.method = CreateEip.CREATE_NEW_VIP;
                        this.l3NetworkUuid = null;
                        this.vip = null;
                        this.vipUuid = null;
                        this.activeState = false;
                    }
                };

                $scope.vipMethodOptions__ = {
                    dataSource: new kendo.data.DataSource({
                        data: [{
                            name: '{{"eip.ts.Create New VIP" | translate}}',
                            field: CreateEip.CREATE_NEW_VIP
                        },{
                            name: '{{"eip.ts.Use Existing VIP" | translate}}',
                            field: CreateEip.USE_EXISTING_VIP
                        }]
                    }),
                    dataTextField: "name",
                    dataValueField: "field"
                };

                var infoPage: Utils.WizardPage = $scope.infoPage  = {
                    activeState: true,

                    name: null,
                    description: null,
                    vmNicUuid: null,

                    canMoveToPrevious(): boolean {
                        return true;
                    },

                    canMoveToNext(): boolean {
                        return Utils.notNullnotUndefined(this.name);
                    },

                    show(): void {
                        this.getAnchorElement().tab('show');
                    },

                    getAnchorElement() : any {
                        return $('.nav a[data-target="#createEipInfo"]');
                    },

                    active(): void {
                        this.activeState = true;
                    },

                    isActive(): boolean {
                        return this.activeState;
                    },

                    getPageName(): string {
                        return 'createEipInfo';
                    },

                    reset() : void {
                        this.name = Utils.shortHashName('eip');
                        this.description = null;
                        this.vmNicUuid = null;
                        this.activeState = false;
                    },

                    hasVm() : boolean {
                        return $scope.vmListOptions__.dataSource.data().length > 0;
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
                        var resultEip : Eip;
                        var chain = new Utils.Chain();
                        chain.then(()=> {
                            var vipUuid = null;
                            if (Utils.notNullnotUndefined($scope.vipPage.vip)) {
                                vipUuid = $scope.vipPage.vip.uuid;
                            } else {
                                vipUuid = $scope.vipPage.vipUuid;
                            }

                            eipMgr.create({
                                vipUuid: vipUuid,
                                vmNicUuid: $scope.infoPage.vmNicUuid == "" ? null : $scope.infoPage.vmNicUuid,
                                name: $scope.infoPage.name,
                                description: $scope.infoPage.description
                            }, (ret : Eip)=> {
                                resultEip = ret;
                                chain.next();
                            });
                        }).done(()=> {
                            if (Utils.notNullnotUndefined(this.options.done)) {
                                this.options.done(resultEip);
                            }
                        }).start();
                        $scope.winCreateEip__.close();
                    }
                };

                $scope.button = new Utils.WizardButton([
                    vipPage, infoPage
                ], mediator);

                $scope.winCreateEipOptions__ = {
                    width: '700px',
                    animation: false,
                    modal: true,
                    draggable: false,
                    resizable: false
                };

                $scope.vipListOptions__ = {
                    dataSource: new kendo.data.DataSource({data: []}),
                    dataTextField: "name",
                    dataValueField: "uuid",
                    template: '<div style="color: black"><span class="z-label">{{"eip.ts.NAME" | translate}}:</span><span>#: name #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"eip.ts.IP" | translate}}:</span><span>#: ip #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"eip.ts.Gateway" | translate}}:</span><span>#: gateway #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"eip.ts.Netmask" | translate}}:</span><span>#: netmask #</span></div>'
                };

                $scope.l3NetworkListOptions__ = {
                    dataSource: new kendo.data.DataSource({data: []}),
                    dataTextField: "name",
                    dataValueField: "uuid",
                    template: '<div style="color: black"><span class="z-label">{{"eip.ts.NAME" | translate}}:</span><span>#: name #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"eip.ts.Type" | translate}}:</span><span>#: type #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"eip.ts.Zone UUID" | translate}}:</span><span>#: zoneUuid #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"eip.ts.L2 Network UUID" | translate}}:</span><span>#: l2NetworkUuid #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"eip.ts.UUID" | translate}}:</span><span>#: uuid #</span></div>'
                };

                $scope.vmListOptions__ = {
                    dataSource: new kendo.data.DataSource({data: []}),
                    dataTextField: "name",
                    dataValueField: "nicUuid",
                    template: '<div style="color: black"><span class="z-label">{{"eip.ts.VM Name" | translate}}:</span><span>#: name #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"eip.ts.VM UUID" | translate}}:</span><span>#: uuid #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"eip.ts.Nic DeviceId" | translate}}:</span><span>#: nicDeviceId #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"eip.ts.Nic Ip" | translate}}:</span><span>#: nicIp #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"eip.ts.Nic Netmask" | translate}}:</span><span>#: nicNetmask #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"eip.ts.Nic Gateway" | translate}}:</span><span>#: nicGateway #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"eip.ts.Nic Mac" | translate}}:</span><span>#: nicMac #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"eip.ts.L3 Network UUID" | translate}}:</span><span>#: l3NetworkUuid #</span></div>'
                };

                $scope.$watch(()=>{
                    return [$scope.vipPage.vipUuid, $scope.vipPage.vip];
                }, ()=>{
                    var vip = null;
                    if (Utils.notNullnotUndefined($scope.vipPage.vip)) {
                        vip = $scope.vipPage.vip;
                    } else if (Utils.notNullnotUndefined($scope.vipPage.vipUuid)) {
                        vip = this.existingVip[$scope.vipPage.vipUuid];
                    }

                    if (!Utils.notNullnotUndefined(vip)) {
                        $scope.vipPage.vipUuid = null;
                        $scope.vipPage.vip = null;
                        return;
                    }

                    var chain = new Utils.Chain();
                    var vmNics = [];
                    var composedVms = [];
                    chain.then(()=>{
                        this.eipMgr.getAttachableVmNicByVipUuid(vip.uuid, (nics: ApiHeader.VmNicInventory[])=>{
                            vmNics = nics;
                            chain.next();
                        });
                    }).done(()=>{
                        if (vmNics.length == 0) {
                            $scope.vmListOptions__.dataSource.data(composedVms);
                            $scope.infoPage.vmNicUuid = null;
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
                                    if (nic.l3NetworkUuid == vip.l3NetworkUuid) {
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
                            $scope.infoPage.vmNicUuid = null;
                        });
                    }).start();
                }, true);

                this.$scope = $scope;
            };
            this.restrict = 'EA';
            this.replace = true;
            this.templateUrl = '/static/templates/eip/createEip.html';
        }
    }


    export class AttachEip implements ng.IDirective {
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
                this.eipMgr.getAttachableVmNicByEipUuid(this.options.eip.uuid, (nics: ApiHeader.VmNicInventory[])=>{
                    vmNics = nics;
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
                this.$scope.attachEip__.center();
                this.$scope.attachEip__.open();
            }).start();
        }

        constructor(private eipMgr: EipManager, private vmMgr: MVmInstance.VmInstanceManager) {
            this.scope = true;
            this.restrict = 'EA';
            this.replace = true;
            this.templateUrl = '/static/templates/eip/attachEip.html';
            this.link = ($scope : any, $element, $attrs : any, $ctrl, $transclude) => {
                var parent = $scope.$parent;
                parent[$attrs.zEipAttachVm] = this;
                this.options = parent[$attrs.zOptions];

                $scope.vmListOptions__ = {
                    dataSource: new kendo.data.DataSource({data: []}),
                    dataTextField: "name",
                    dataValueField: "nicUuid",
                    template: '<div style="color: black"><span class="z-label">{{"eip.ts.VM Name" | translate}}:</span><span>#: name #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"eip.ts.VM UUID" | translate}}:</span><span>#: uuid #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"eip.ts.Nic DeviceId" | translate}}:</span><span>#: nicDeviceId #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"eip.ts.Nic Ip" | translate}}:</span><span>#: nicIp #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"eip.ts.Nic Netmask" | translate}}:</span><span>#: nicNetmask #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"eip.ts.Nic Gateway" | translate}}:</span><span>#: nicGateway #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"eip.ts.Nic Mac" | translate}}:</span><span>#: nicMac #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"eip.ts.L3 Network UUID" | translate}}:</span><span>#: l3NetworkUuid #</span></div>'
                };

                $scope.hasVm = () => {
                    return $scope.vmListOptions__.dataSource.data().length > 0;
                };

                $scope.canProceed = ()=> {
                    return Utils.notNullnotUndefined($scope.vmNicUuid);
                };

                $scope.cancel = () => {
                    $scope.attachEip__.close();
                };

                $scope.done = () => {
                    eipMgr.attach(this.options.eip, $scope.vmNicUuid, ()=>{
                        if (Utils.notNullnotUndefined(this.options.done)) {
                            this.options.done();
                        }
                    });


                    $scope.attachEip__.close();
                };

                this.$scope = $scope;

                $scope.attachEipOptions__ = {
                    width: '550px'
                };
            }
        }
    }

    export class DetachEip implements ng.IDirective {
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
            qobj.conditions = [
                {
                    name: 'vmNics.uuid',
                    op: '=',
                    value: this.options.eip.vmNicUuid
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
                this.$scope.detachEip__.center();
                this.$scope.detachEip__.open();
            });
        }

        constructor(private eipMgr: EipManager, private vmMgr: MVmInstance.VmInstanceManager) {
            this.scope = true;
            this.restrict = 'EA';
            this.replace = true;
            this.templateUrl = '/static/templates/eip/detachEip.html';
            this.link = ($scope : any, $element, $attrs : any, $ctrl, $transclude) => {
                var parent = $scope.$parent;
                parent[$attrs.zEipDetachVm] = this;
                this.options = parent[$attrs.zOptions];

                $scope.cancel = () => {
                    $scope.detachEip__.close();
                };

                $scope.done = () => {
                    eipMgr.detach(this.options.eip, ()=>{
                        if (this.options.done) {
                            this.options.done();
                        }
                    });
                    $scope.detachEip__.close();
                };

                $scope.optionsDetachEip__ = {
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

angular.module('root').factory('EipManager', ['Api', '$rootScope', (api, $rootScope)=> {
    return new MEip.EipManager(api, $rootScope);
}]).directive('zCreateEip', ['Api', 'EipManager', 'VipManager', 'L3NetworkManager', 'VmInstanceManager', (api, eipMgr, vipMgr, l3Mgr, vmMgr)=>{
    return new MEip.CreateEip(api, eipMgr, vipMgr, l3Mgr, vmMgr);
}]).directive('zEipAttachVm', ['EipManager', 'VmInstanceManager', (eipMgr, vmMgr)=>{
    return new MEip.AttachEip(eipMgr, vmMgr);
}]).directive('zEipDetachVm', ['EipManager', 'VmInstanceManager', (eipMgr, vmMgr)=>{
    return new MEip.DetachEip(eipMgr, vmMgr);
}]).config(['$routeProvider', function(route) {
    route.when('/eip', {
        templateUrl: '/static/templates/eip/eip.html',
        controller: 'MEip.Controller'
    }).when('/eip/:uuid', {
        templateUrl: '/static/templates/eip/details.html',
        controller: 'MEip.DetailsController',
        resolve: {
            current: function($q : ng.IQService, $route: any, EipManager: MEip.EipManager, VmInstanceManager: MVmInstance.VmInstanceManager, VipManager: MVip.VipManager) {
                var defer = $q.defer();
                var uuid = $route.current.params.uuid;
                var ret = {
                    eip: null,
                    nic: null,
                    vip: null
                };

                var chain = new Utils.Chain();
                chain.then(()=>{
                    var qobj = new ApiHeader.QueryObject();
                    qobj.addCondition({name: 'uuid', op: '=', value: uuid});
                    EipManager.query(qobj, (eips: MEip.Eip[])=>{
                        ret.eip = eips[0]
                        chain.next();
                    });
                }).then(()=>{
                    if (!Utils.notNullnotUndefined(ret.eip.vmNicUuid)) {
                        chain.next();
                        return;
                    }

                    var qobj = new ApiHeader.QueryObject();
                    qobj.conditions = [{
                        name: 'uuid',
                        op: '=',
                        value: ret.eip.vmNicUuid
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
                        value: ret.eip.vipUuid
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

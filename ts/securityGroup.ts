
/// <reference path="d.ts/angularjs/angular.d.ts" />
/// <reference path="d.ts/kendo.all.d.ts" />

module MSecurityGroup {
    export class SecurityGroup extends ApiHeader.SecurityGroupInventory {
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

        updateObservableObject(inv : ApiHeader.SecurityGroupInventory) {
            // self : ObservableObject
            var self : any = this;
            self.set('uuid', inv.uuid);
            self.set('name', inv.name);
            self.set('description', inv.description);
            self.set('state', inv.state);
            self.set('rules', inv.rules);
            self.set('attachedL3NetworkUuids', inv.attachedL3NetworkUuids);
            self.set('createDate', inv.createDate);
            self.set('lastOpDate', inv.lastOpDate);
        }
    }

    export class SecurityGroupManager {
        static $inject = ['Api', '$rootScope'];

        constructor(private api : Utils.Api, private $rootScope: ng.IRootScopeService) {
        }

        private sortBy : Directive.SortByData;

        setSortBy(sortBy : Directive.SortByData) {
            this.sortBy = sortBy;
        }

        private wrap(sg : SecurityGroup) : any {
            return new kendo.data.ObservableObject(sg);
        }


        disable(sg : SecurityGroup) {
            sg.progressOn();
            var msg = new ApiHeader.APIChangeSecurityGroupStateMsg();
            msg.stateEvent = 'disable';
            msg.uuid = sg.uuid;
            this.api.asyncApi(msg, (ret : ApiHeader.APIChangeSecurityGroupStateEvent) => {
                sg.updateObservableObject(ret.inventory);
                sg.progressOff();
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Disabled Security Group: {0}',sg.name),
                    link: Utils.sprintf('/#/securityGroup/{0}', sg.uuid)
                });
            });
        }

        enable(sg : SecurityGroup) {
            sg.progressOn();
            var msg = new ApiHeader.APIChangeSecurityGroupStateMsg();
            msg.stateEvent = 'enable';
            msg.uuid = sg.uuid;
            this.api.asyncApi(msg, (ret : ApiHeader.APIChangeSecurityGroupStateEvent) => {
                sg.updateObservableObject(ret.inventory);
                sg.progressOff();
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Enabled Security Group: {0}', sg.name),
                    link: Utils.sprintf('/#/securityGroup/{0}', sg.uuid)
                });
            });
        }

        attachL3Network(sg: SecurityGroup, l3Uuid: string, done: ()=>void) {
            sg.progressOn();
            var msg = new ApiHeader.APIAttachSecurityGroupToL3NetworkMsg();
            msg.l3NetworkUuid = l3Uuid;
            msg.securityGroupUuid = sg.uuid;
            this.api.asyncApi(msg, (ret: ApiHeader.APIAttachSecurityGroupToL3NetworkEvent)=> {
                sg.updateObservableObject(ret.inventory);
                sg.progressOff();
                if (Utils.notNullnotUndefined(done)) {
                    done();
                }
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Attached l3Network to Security Group: {0}', sg.name),
                    link: Utils.sprintf('/#/securityGroup/{0}', sg.uuid)
                });
            });
        }

        detachL3Network(sg: SecurityGroup, l3Uuid: string, done: ()=>void) {
            sg.progressOn();
            var msg = new ApiHeader.APIDetachSecurityGroupFromL3NetworkMsg();
            msg.l3NetworkUuid = l3Uuid;
            msg.securityGroupUuid = sg.uuid;
            this.api.asyncApi(msg, (ret: ApiHeader.APIDetachSecurityGroupFromL3NetworkEvent)=> {
                sg.updateObservableObject(ret.inventory);
                sg.progressOff();
                if (Utils.notNullnotUndefined(done)) {
                    done();
                }
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Detached l3Network from Security Group: {0}', sg.name),
                    link: Utils.sprintf('/#/securityGroup/{0}', sg.uuid)
                });
            });
        }

        addRule(sg: SecurityGroup, rules: any[], done: ()=>void) {
            sg.progressOn();
            var msg = new ApiHeader.APIAddSecurityGroupRuleMsg();
            msg.rules = rules;
            msg.securityGroupUuid = sg.uuid;
            this.api.asyncApi(msg, (ret: ApiHeader.APIAddSecurityGroupRuleEvent)=>{
                sg.updateObservableObject(ret.inventory);
                sg.progressOff();
                if (Utils.notNullnotUndefined(done)) {
                    done();
                }
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Added rule Security Group: {0}', sg.name),
                    link: Utils.sprintf('/#/securityGroup/{0}', sg.uuid)
                });
            });
        }

        deleteRule(sg: SecurityGroup, ruleUuids: string[], done: ()=>void) {
            sg.progressOn();
            var msg = new ApiHeader.APIDeleteSecurityGroupRuleMsg();
            msg.ruleUuids = ruleUuids;
            this.api.asyncApi(msg, (ret: ApiHeader.APIDeleteSecurityGroupRuleEvent)=>{
                sg.updateObservableObject(ret.inventory);
                sg.progressOff();
                if (Utils.notNullnotUndefined(done)) {
                    done();
                }
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Deleted rule from Security Group: {0}', sg.name),
                    link: Utils.sprintf('/#/securityGroup/{0}', sg.uuid)
                });
            });
        }

        create(sg : any, done : (ret : SecurityGroup)=>void) {
            var msg : any = null;
            msg = new ApiHeader.APICreateSecurityGroupMsg();
            msg.name = sg.name;
            msg.description = sg.description;
            this.api.asyncApi(msg, (ret : ApiHeader.APICreateSecurityGroupEvent)=> {
                var c = new SecurityGroup();
                angular.extend(c, ret.inventory);
                done(this.wrap(c));
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Created new Security Group: {0}',c.name),
                    link: Utils.sprintf('/#/securityGroup/{0}', c.uuid)
                });
            });
        }

        query(qobj : ApiHeader.QueryObject, callback : (pss : SecurityGroup[], total: number) => void) : void {
            var msg = new ApiHeader.APIQuerySecurityGroupMsg();
            msg.count = qobj.count === true;
            msg.start = qobj.start;
            msg.limit = qobj.limit;
            msg.replyWithCount = true;
            msg.conditions = qobj.conditions ? qobj.conditions : [];
            if (Utils.notNullnotUndefined(this.sortBy) && this.sortBy.isValid()) {
                msg.sortBy = this.sortBy.field;
                msg.sortDirection = this.sortBy.direction;
            }
            this.api.syncApi(msg, (ret : ApiHeader.APIQuerySecurityGroupReply)=>{
                var pris = [];
                ret.inventories.forEach((inv : ApiHeader.SecurityGroupInventory)=> {
                    var c = new SecurityGroup();
                    angular.extend(c, inv);
                    pris.push(this.wrap(c));
                });
                callback(pris, ret.total);
            });
        }

        delete(sg : SecurityGroup, done : (ret : any)=>void) {
            sg.progressOn();
            var msg = new ApiHeader.APIDeleteSecurityGroupMsg();
            msg.uuid = sg.uuid;
            this.api.asyncApi(msg, (ret : any)=> {
                sg.progressOff();
                done(ret);
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Deleted Security Group: {0}', sg.name)
                });
            });
        }

        getCandidateVmNic(sg: SecurityGroup, done: (nics: ApiHeader.VmNicInventory[])=>void) {
            var msg = new ApiHeader.APIGetCandidateVmNicForSecurityGroupMsg();
            msg.securityGroupUuid = sg.uuid;
            this.api.syncApi(msg, (ret: ApiHeader.APIGetCandidateVmNicForSecurityGroupReply)=>{
                done(ret.inventories);
            });
        }

        addVmNic(sg: SecurityGroup, nicUuids: string[], done: ()=>void) {
            sg.progressOn();
            var msg = new ApiHeader.APIAddVmNicToSecurityGroupMsg();
            msg.securityGroupUuid = sg.uuid;
            msg.vmNicUuids = nicUuids;
            this.api.asyncApi(msg, (ret: any)=>{
                sg.progressOff();
                if (Utils.notNullnotUndefined(done)) {
                    done();
                }
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Added vm nics to security group: {0}', sg.name)
                });
            });
        }

        removeVmNic(sg: SecurityGroup, nicUuids: string[], done: ()=>void) {
            sg.progressOn();
            var msg = new ApiHeader.APIDeleteVmNicFromSecurityGroupMsg();
            msg.securityGroupUuid = sg.uuid;
            msg.vmNicUuids = nicUuids;
            this.api.asyncApi(msg, (ret: any)=>{
                sg.progressOff();
                if (Utils.notNullnotUndefined(done)) {
                    done();
                }

                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Removed vm nics from security group: {0}', sg.name)
                });
            });
        }
    }

    export class SecurityGroupModel extends Utils.Model {
        constructor() {
            super();
            this.current = new SecurityGroup();
        }
    }

    class OSecurityGroupGrid extends Utils.OGrid {
        constructor($scope: any, private sgMgr : SecurityGroupManager) {
            super();
            super.init($scope, $scope.securityGroupGrid);
            this.options.columns = [
                {
                    field: 'name',
                    title: '{{"securityGroup.ts.NAME" | translate}}',
                    width: '25%',
                    template: '<a href="/\\#/securityGroup/{{dataItem.uuid}}">{{dataItem.name}}</a>'
                },
                {
                    field: 'description',
                    title: '{{"securityGroup.ts.DESCRIPTION" | translate}}',
                    width: '25%'
                },
                {
                    field: 'state',
                    title: '{{"securityGroup.ts.STATE" | translate}}',
                    width: '25%',
                    template: '<span class="{{dataItem.stateLabel()}}">{{dataItem.state}}</span>'
                },
                {
                    field: 'uuid',
                    title: '{{"securityGroup.ts.UUID" | translate}}',
                    width: '25%'
                }
            ];

            this.options.dataSource.transport.read = (options)=> {
                var qobj = new ApiHeader.QueryObject();
                qobj.limit = options.data.take;
                qobj.start = options.data.pageSize * (options.data.page - 1);
                sgMgr.query(qobj, (sgs:SecurityGroup[], total:number)=> {
                    options.success({
                        data: sgs,
                        total: total
                    });
                });
            };
        }
    }

    class Action {
        constructor(private $scope : any, private sgMgr : SecurityGroupManager) {
        }

        enable() {
            this.sgMgr.enable(this.$scope.model.current);
        }

        disable() {
            this.sgMgr.disable(this.$scope.model.current);
        }

        addRule() {
            this.$scope.addRule.open();
        }

        deleteRule() {
            this.$scope.deleteRule.open();
        }

        attachL3Network() {
            this.$scope.attachL3Network.open();
        }

        detachL3Network() {
            this.$scope.detachL3Network.open();
        }

        addNic() {
            this.$scope.addVmNic.open();
        }

        removeNic() {
            this.$scope.removeVmNic.open();
        }

        isDeleteRuleShow() {
            if (Utils.notNullnotUndefined(this.$scope.model.current.rules)) {
                return this.$scope.model.current.rules.length > 0;
            }
            return false;
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
                            name: '{{"securityGroup.ts.None" | translate}}',
                            value: FilterBy.NONE
                        },
                        {
                            name: '{{"securityGroup.ts.STATE" | translate}}',
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
            this.$scope.oSecurityGroupGrid.setFilter(this.toKendoFilter());
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
        static $inject = ['$scope', 'SecurityGroupManager', '$routeParams', 'Tag', 'current', 'L3NetworkManager', 'Api'];

        private loadSelf(uuid : string) {
            var qobj = new ApiHeader.QueryObject();
            qobj.addCondition({name: 'uuid', op: '=', value: uuid});
            this.sgMgr.query(qobj, (sgs : SecurityGroup[], total:number)=> {
                this.$scope.model.current = sgs[0];
            });
        }

        constructor(private $scope : any, private sgMgr : SecurityGroupManager, private $routeParams : any,
                    private tagService : Utils.Tag, current: SecurityGroup, private l3Mgr, private api : Utils.Api) {
            $scope.model = new SecurityGroupModel();
            $scope.model.current = current;

            $scope.funcDelete = (win : any) => {
                win.open();
            };

            $scope.action = new Action($scope, sgMgr);

            $scope.funcRefresh = ()=> {
                this.loadSelf($scope.model.current.uuid);
            };

            $scope.funcToolbarShow = ()=> {
                return Utils.notNullnotUndefined($scope.model.current);
            };

            $scope.optionsDeleteSecurityGroup = {
                title: 'DELETE SECURITY GROUP',
                html: '<strong><p>Deleting security group will cause:</p></strong>' +
                    '<ul><li><strong>All rules in this security group will be deleted</strong></li>' +
                    '<li><strong>All l3Networks this security group has attached will be detached</strong></li>' +
                    '<strong><p>those results are not recoverable</p></strong>',

                confirm: ()=> {
                    sgMgr.delete($scope.model.current, (ret : any)=> {
                        $scope.model.resetCurrent();
                    });
                }
            };

            $scope.optionsTag = {
                tags: [],
                createTag: (item)=> {
                    this.tagService.createTag(item.tag, $scope.model.current.uuid, ApiHeader.TagResourceTypeSecurityGroupVO, (ret : ApiHeader.TagInventory)=> {
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

            $scope.optionsRuleGrid = {
                pageSize: 20,
                resizable: true,
                scrollable: true,
                pageable: true,
                columns: [
                    {
                        field: ' ',
                        title: '{{"securityGroup.ts.TYPE" | translate}}',
                        width: '20%'
                    },
                    {
                        field: 'startPort',
                        title: '{{"securityGroup.ts.PORT START" | translate}}',
                        width: '20%'

                    },
                    {
                        field: 'endPort',
                        title: '{{"securityGroup.ts.PORT END" | translate}}',
                        width: '20%'
                    },
                    {
                        field: 'protocol',
                        title: '{{"securityGroup.ts.PROTOCOL" | translate}}',
                        width: '20%'
                    },
                    {
                        field: 'allowedCidr',
                        title: '{{"securityGroup.ts.ALLOWED CIDR" | translate}}',
                        width: '20%'
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

            $scope.optionsRuleGrid.dataSource.data(current.rules);

            $scope.optionsL3NetworkGrid = {
                pageSize: 20,
                resizable: true,
                scrollable: true,
                pageable: true,
                columns: [
                    {
                        field: 'name',
                        title: '{{"securityGroup.ts.NAME" | translate}}',
                        width: '20%',
                        template: '<a href="/\\#/l3Network/{{dataItem.uuid}}">{{dataItem.name}}</a>'
                    },
                    {
                        field: 'description',
                        title: '{{"securityGroup.ts.DESCRIPTION" | translate}}',
                        width: '25%'
                    },
                    {
                        field: 'state',
                        title: '{{"securityGroup.ts.STATE" | translate}}',
                        width: '10%',
                        template: '<span class="{{dataItem.stateLabel()}}">{{dataItem.state}}</span>'
                    },
                    {
                        field: 'type',
                        title: '{{"securityGroup.ts.TYPE" | translate}}',
                        width: '20%'
                    },
                    {
                        field: 'uuid',
                        title: '{{"securityGroup.ts.UUID" | translate}}',
                        width: '25%'
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


            if (current.attachedL3NetworkUuids.length > 0) {
                var qobj = new ApiHeader.QueryObject();
                qobj.conditions = [
                    {
                        name: 'uuid',
                        op: 'in',
                        value: current.attachedL3NetworkUuids.join()
                    }
                ];
                l3Mgr.query(qobj, (l3s: ApiHeader.L3NetworkInventory[])=>{
                    $scope.optionsL3NetworkGrid.dataSource.data(l3s);
                });
            }

            $scope.optionsRulesGrid = {
                pageSize: 20,
                resizable: true,
                scrollable: true,
                pageable: true,
                columns: [
                    {
                        field: 'type',
                        title: '{{"securityGroup.ts.TYPE" | translate}}',
                        width: '20%'
                    },
                    {
                        field: 'startPort',
                        title: '{{"securityGroup.ts.PORT START" | translate}}',
                        width: '20%'
                    },
                    {
                        field: 'endPort',
                        title: '{{"securityGroup.ts.PORT END" | translate}}',
                        width: '20%'
                    },
                    {
                        field: 'protocol',
                        title: '{{"securityGroup.ts.PROTOCOL" | translate}}',
                        width: '20%'
                    },
                    {
                        field: 'allowedCidr',
                        title: '{{"securityGroup.ts.ALLOWED CIDR" | translate}}',
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
                    data: current.rules
                })
            };

            $scope.optionsVmNicGrid = {
                pageSize: 20,
                resizable: true,
                scrollable: true,
                pageable: true,
                columns: [
                    {
                        field: 'ip',
                        title: '{{"securityGroup.ts.IP" | translate}}',
                        width: '25%'
                    },
                    {
                        field: 'deviceId',
                        title: '{{"securityGroup.ts.DEVICE ID" | translate}}',
                        width: '25%'
                    },
                    {
                        field: 'uuid',
                        title: '{{"securityGroup.ts.UUID" | translate}}',
                        width: '25%',
                        template: '{{dataItem.uuid}}'
                    },
                    {
                        field: 'vmInstanceUuid',
                        title: '{{"securityGroup.ts.VM" | translate}}',
                        width: '25%',
                        template: '<a href="/\\#/vmInstance/{{dataItem.vmInstanceUuid}}">{{dataItem.vmInstanceUuid}}</a>'
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
                        read: (options)=> {
                            var msg = new ApiHeader.APIQueryVmNicMsg();
                            msg.conditions = [{
                                name: "securityGroup.uuid",
                                op: '=',
                                value: current.uuid
                            }];
                            msg.replyWithCount = true;
                            this.api.syncApi(msg, (reply: ApiHeader.APIQueryVmNicReply)=>{
                                options.success({
                                    data: reply.inventories,
                                    total: reply.total
                                });
                            });
                        }
                    }
                })
            };

            $scope.optionsAttachL3Network = {
                sg: current,
                done(l3: any) {
                    $scope.optionsL3NetworkGrid.dataSource.insert(0, l3);
                }
            };

            $scope.optionsAddRule = {
                sg: current,
                done(rules: any) {
                    angular.forEach(rules, (it)=>{
                        $scope.optionsRulesGrid.dataSource.insert(0, it);
                    });
                }
            };

            $scope.optionsDeleteRule = {
                sg: current,
                done(rules: any) {
                    var ds = $scope.optionsRulesGrid.dataSource;
                    var cs = ds.data();

                    angular.forEach(rules, (it)=>{
                        for (var i=0; i<cs.length; i++) {
                            var tcs = cs[i];
                            if (it.uuid == tcs.uuid) {
                                var row = ds.getByUid(tcs.uid);
                                ds.remove(row);
                                break;
                            }
                        }
                    });
                }
            };

            $scope.optionsDetachL3Network = {
                sg: current,
                done(l3: any) {
                    var ds = $scope.optionsL3NetworkGrid.dataSource;
                    var cs = ds.data();
                    for (var i = 0; i < cs.length; i++) {
                        var tcs = cs[i];
                        if (l3.uuid == tcs.uuid) {
                            var row = ds.getByUid(tcs.uid);
                            ds.remove(row);
                            break;
                        }
                    }
                }
            };

            $scope.optionsAddVmNic = {
                sg: current,
                done: ()=>{
                    $scope.optionsVmNicGrid.dataSource.read();
                }
            };

            $scope.optionsRemoveVmNic = {
                sg: current,
                done: ()=>{
                    $scope.optionsVmNicGrid.dataSource.read();
                }
            };
        }
    }

    export class Controller {
        static $inject = ['$scope', 'SecurityGroupManager', '$location'];

        constructor(private $scope : any, private sgMgr : SecurityGroupManager, private $location : ng.ILocationService) {
            $scope.model = new SecurityGroupModel();
            $scope.oSecurityGroupGrid = new OSecurityGroupGrid($scope, sgMgr);
            $scope.action = new Action($scope, sgMgr);
            $scope.optionsSortBy = {
                fields: [
                    {
                        name: '{{"securityGroup.ts.NAME" | translate}}',
                        value: 'name'
                    },
                    {
                        name: '{{"securityGroup.ts.DESCRIPTION" | translate}}',
                        value: 'description'
                    },
                    {
                        name: '{{"securityGroup.ts.STATE" | translate}}',
                        value: 'state'
                    },
                    {
                        name: '{{"securityGroup.ts.Created Date" | translate}}',
                        value: 'createDate'
                    },
                    {
                        name: '{{"securityGroup.ts.Last Updated Date" | translate}}',
                        value: 'lastOpDate'
                    }
                ],

                done: (ret : Directive.SortByData) => {
                    sgMgr.setSortBy(ret);
                    $scope.oSecurityGroupGrid.refresh();
                }
            };

            $scope.optionsSearch = {
                fields: ApiHeader.SecurityGroupInventoryQueryable,
                name: 'SecurityGroup',
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
                    sgMgr.query(qobj, (sgs : SecurityGroup[], total:number)=> {
                        $scope.oSecurityGroupGrid.refresh(sgs);
                    });
                }
            };

            $scope.funcGridDoubleClick = (e) => {
                if (Utils.notNullnotUndefined($scope.model.current)) {
                    var url = Utils.sprintf('/securityGroup/{0}', $scope.model.current.uuid);
                    $location.path(url);
                    e.preventDefault();
                }
            };

            $scope.filterBy = new FilterBy($scope);

            $scope.funcSearch = (win : any) => {
                win.open();
            };

            $scope.funcCreateSecurityGroup = (win : any) => {
                win.open();
            };

            $scope.funcDeleteSecurityGroup = () => {
                $scope.deleteSecurityGroup.open();
            };

            $scope.optionsDeleteSecurityGroup = {
                title: 'DELETE L3 NETWORK',
                html: '<strong><p>Deleting security group will cause:</p></strong>' +
                    '<ul><li><strong>All rules in this security group will be deleted</strong></li>' +
                    '<li><strong>All l3Networks this security group has attached will be detached</strong></li>' +
                    '<strong><p>those results are not recoverable</p></strong>',

                confirm: ()=> {
                    sgMgr.delete($scope.model.current, (ret : any)=> {
                        $scope.oSecurityGroupGrid.deleteCurrent();
                    });
                }
            };

            $scope.funcRefresh = ()=> {
                $scope.oSecurityGroupGrid.refresh();
            };

            $scope.funcIsActionShow = ()=> {
                return !Utils.isEmptyObject($scope.model.current);
            };

            $scope.funcIsActionDisabled = ()=> {
                return Utils.notNullnotUndefined($scope.model.current) && $scope.model.current.isInProgress();
            };

            $scope.optionsCreateSecurityGroup = {
                done: (sg : SecurityGroup) => {
                    $scope.oSecurityGroupGrid.add(sg);
                }
            };

            $scope.optionsAddRule = {
                sg: null
            };

            $scope.optionsDeleteRule  = {
                sg: null
            };

            $scope.optionsAttachL3Network = {
                sg: null
            };

            $scope.optionsDetachL3Network = {
                sg: null
            };

            $scope.optionsAddVmNic = {
                sg: null
            };

            $scope.optionsRemoveVmNic = {
                sg: null
            };

            $scope.$watch(()=>{
                return $scope.model.current;
            }, ()=>{
                if (Utils.notNullnotUndefined($scope.model.current)) {
                    $scope.optionsAddRule.sg = $scope.model.current;
                    $scope.optionsDeleteRule.sg = $scope.model.current;
                    $scope.optionsAttachL3Network.sg = $scope.model.current;
                    $scope.optionsDetachL3Network.sg = $scope.model.current;
                    $scope.optionsAddVmNic.sg = $scope.model.current;
                    $scope.optionsRemoveVmNic.sg = $scope.model.current;
                }
            });
        }
    }


    export class AddRule implements ng.IDirective {
        link:(scope:ng.IScope, instanceElement:ng.IAugmentedJQuery, instanceAttributes:ng.IAttributes, controller:any, transclude:ng.ITranscludeFunction) => void;
        scope:any;
        controller:any;
        restrict:string;
        replace:boolean;
        templateUrl:any;
        options: any;
        $scope:any;

        open() {
            this.$scope.startPort = null;
            this.$scope.endPort = null;
            this.$scope.allowedCidr = null;
            this.$scope.addRule__.center();
            this.$scope.addRule__.open();
        }

        constructor(sgMgr: SecurityGroupManager) {
            this.scope = true;
            this.link = ($scope : any, $element, $attrs : any, $ctrl, $transclude) => {
                var instanceName = $attrs.zSecurityGroupAddRule;
                var parentScope = $scope.$parent;
                parentScope[instanceName] = this;
                this.options = {};
                var optionName = $attrs.zOptions;
                this.options = parentScope[optionName];

                $scope.optionsAddRuleGrid__ = {
                    pageSize: 20,
                    resizable: true,
                    scrollable: true,
                    pageable: true,
                    columns: [
                        {
                            field: 'startPort',
                            title: '{{"securityGroup.ts.START" | translate}}',
                            width: '13%'
                        },
                        {
                            field: 'endPort',
                            title: '{{"securityGroup.ts.END" | translate}}',
                            width: '13%'
                        },
                        {
                            field: 'type',
                            title: '{{"securityGroup.ts.TYPE" | translate}}',
                            width: '16%'

                        },
                        {
                            field: 'protocol',
                            title: '{{"securityGroup.ts.PROTOCOL" | translate}}',
                            width: '16%'

                        },
                        {
                            field: 'allowedCidr',
                            title: '{{"securityGroup.ts.ALLOWED CIDR" | translate}}',
                            width: '22%'
                        },
                        {
                            width: '10%',
                            title: '',
                            template: '<button type="button" class="btn btn-xs btn-default" ng-show="dataItem.deleteable == true" ng-click="del(dataItem.uid)"><i class="fa fa-times"></i></button>'
                        }
                    ],

                    dataBound: (e)=> {
                        var grid = e.sender;
                        if (grid.dataSource.totalPages() == 1) {
                            grid.pager.element.hide();
                        }
                    },

                    dataSource: new kendo.data.DataSource({
                        data: []
                    })
                };

                $scope.$watch(()=>{
                    return this.options.sg;
                },()=>{
                    if (Utils.notNullnotUndefined(this.options.sg)) {
                        var rules = [];
                        angular.extend(rules, this.options.sg.rules);
                        $scope.optionsAddRuleGrid__.dataSource.data(rules);
                    }
                });

                $scope.optionsAddRule__ = {
                    width: 500
                };

                $scope.ruleTypeOptions__ = {
                    dataSource: new kendo.data.DataSource({data: [
                        'Ingress', 'Egress'
                    ]})
                };
                $scope.type = 'Ingress';

                $scope.ruleProtocolOptions__ = {
                    dataSource: new kendo.data.DataSource({data: [
                        'TCP', 'UDP', 'ICMP'
                    ]})
                };
                $scope.protocol = 'TCP';

                function getNewRules () {
                    var allRules = $scope.optionsAddRuleGrid__.dataSource.data();
                    var newRules = [];
                    angular.forEach(allRules, (it)=>{
                        if (Utils.notNullnotUndefined(it.deleteable)) {
                            newRules.push(it);
                        }
                    });

                    return newRules;
                }

                $scope.canProceed = ():boolean => {
                    return getNewRules().length > 0;
                };

                $scope.cancel = () => {
                    $scope.addRule__.close();
                };

                $scope.done = () => {
                    var nrules = getNewRules();
                    angular.forEach(nrules, (it)=>{
                        delete it['deleteable'];
                    });

                    sgMgr.addRule(this.options.sg, nrules, ()=>{
                        if (Utils.notNullnotUndefined(this.options.done)) {
                            this.options.done(nrules);
                        }
                    });
                    $scope.addRule__.close();
                };

                $scope.isDuplicateRule =()=>{
                    var rs = $scope.optionsAddRuleGrid__.dataSource.data();
                    for (var i=0; i<rs.length; i++) {
                        var r = rs[i];
                        if ($scope.startPort == r.startPort && $scope.endPort == r.endPort && $scope.protocol == r.protocol
                            && $scope.type == r.type) {
                            if (r.allowedCidr == $scope.allowedCidr) {
                                return true;
                            }
                        }
                    }

                    return false;
                };

                $scope.canAdd = () => {
                    if (Utils.notNullnotUndefined($scope.startPort) && Utils.notNullnotUndefined($scope.endPort)
                        && Utils.notNullnotUndefined($scope.type) && Utils.notNullnotUndefined($scope.protocol)
                        && $scope.isStartPortValid()
                        && $scope.isEndPortValid()
                        && $scope.isCIDRValid()) {
                        return !$scope.isDuplicateRule();
                    } else {
                        return false;
                    }
                };

                $scope.add = () => {
                    $scope.allowedCidr = $scope.allowedCidr == "" ? null : $scope.allowedCidr;
                    var rule = {
                        securityGroupUuid: $scope.securityGroupUuid,
                        startPort: $scope.startPort,
                        endPort: $scope.endPort,
                        allowedCidr: !Utils.notNullnotUndefined($scope.allowedCidr) ? '0.0.0.0/0' : $scope.allowedCidr,
                        type: $scope.type,
                        protocol: $scope.protocol,
                        deleteable: true
                    };

                    $scope.optionsAddRuleGrid__.dataSource.insert(0, rule);
                    $scope.startPort = null;
                    $scope.endPort = null;
                    $scope.allowedCidr = null;
                };

                $scope.isGridShow = ()=>{
                    return this.$scope.optionsAddRuleGrid__.dataSource.data().length > 0;
                };

                this.$scope = $scope;

                $scope.del = (uid: string) => {
                    var row = $scope.optionsAddRuleGrid__.dataSource.getByUid(uid);
                    $scope.optionsAddRuleGrid__.dataSource.remove(row);
                };

                $scope.isStartPortValid = () => {
                    if (Utils.notNullnotUndefined($scope.startPort)) {
                      if ($scope.protocol == 'UDP' || $scope.protocol == 'TCP') {
                        return Utils.isValidPort($scope.startPort);
                      }
                    }
                    return true;
                };

                $scope.isEndPortValid = () => {
                    if (Utils.notNullnotUndefined($scope.endPort)) {
                      if ($scope.protocol == 'UDP' || $scope.protocol == 'TCP') {
                        return Utils.isValidPort($scope.endPort);
                      }
                    }
                    return true;
                };

                $scope.isCIDRValid = () => {
                    if (Utils.notNullnotUndefined($scope.allowedCidr) && $scope.allowedCidr != "") {
                      return Utils.isValidCidr($scope.allowedCidr);
                    }
                    return true;
                };

            };

            this.restrict = 'EA';
            this.replace = true;
            this.templateUrl = '/static/templates/securityGroup/addRule.html';
        }
    }

    export class CreateSecurityGroup implements ng.IDirective {
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
            var win = this.$scope.winCreateSecurityGroup__;
            this.$scope.button.reset();
            this.$scope.l3NetworkListOptions__.dataSource.data([]);
            this.$scope.optionsRuleGrid__.dataSource.data([]);
            var qobj = new ApiHeader.QueryObject();
            qobj.conditions = [];
            this.l3Mgr.query(qobj, (l3s: ApiHeader.L3NetworkInventory[])=>{
                this.$scope.l3NetworkListOptions__.dataSource.data(l3s);
                win.center();
                win.open();
            });
        }

        constructor(private api : Utils.Api, private sgMgr : SecurityGroupManager, private l3Mgr: ML3Network.L3NetworkManager) {
            this.scope = true;
            this.link = ($scope : any, $element, $attrs : any, $ctrl, $transclude) => {
                var instanceName = $attrs.zCreateSecurityGroup;
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

                var infoPage: Utils.WizardPage = $scope.infoPage  = {
                    activeState: true,

                    name: null,
                    description: null,

                    canMoveToPrevious(): boolean {
                        return false;
                    },

                    canMoveToNext(): boolean {
                        return Utils.notNullnotUndefined(this.name);
                    },

                    show(): void {
                        this.getAnchorElement().tab('show');
                    },

                    getAnchorElement() : any {
                        return $('.nav a[data-target="#createSecurityGroupInfo"]');
                    },

                    active(): void {
                        this.activeState = true;
                    },

                    isActive(): boolean {
                        return this.activeState;
                    },

                    getPageName(): string {
                        return 'createSecurityGroupInfo';
                    },

                    reset() : void {
                        this.name = Utils.shortHashName('sg');
                        this.description = null;
                        this.activeState = false;
                    }
                };

                var rulePage: Utils.WizardPage = $scope.rulePage = {
                    activeState: false,
                    startPort: null,
                    endPort: null,
                    type: null,
                    allowedCidr: null,
                    protocol: null,

                    isStartPortValid(): boolean {
                        if (Utils.notNullnotUndefined(this.startPort)) {
                          if (this.protocol == 'UDP' || this.protocol == 'TCP') {
                              return Utils.isValidPort(this.startPort);
                          }
                        }
                        return true;
                    },

                    isEndPortValid() : boolean {
                        if (Utils.notNullnotUndefined(this.endPort)) {
                          if (this.protocol == 'UDP' || this.protocol == 'TCP') {
                              return Utils.isValidPort(this.endPort);
                          }
                        }
                        return true;
                    },

                    isCIDRValid() : boolean {
                        if (Utils.notNullnotUndefined(this.allowedCidr) && this.allowedCidr != "") {
                            return Utils.isValidCidr(this.allowedCidr);
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
                        return $('.nav a[data-target="#createSecurityGroupRule"]');
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
                        return 'createSecurityGroupRule';
                    },

                    reset() : void {
                        this.activeState = false;
                    },

                    add() : void {
                        this.allowedCidr = this.allowedCidr == "" ? null : this.allowedCidr;
                        $scope.optionsRuleGrid__.dataSource.insert(0, {
                            startPort: this.startPort,
                            endPort: this.endPort,
                            type: this.type,
                            protocol: this.protocol,
                            allowedCidr: this.allowedCidr == null ? '0.0.0.0/0' : this.allowedCidr
                        });

                        this.startPort = null;
                        this.endPort = null;
                        this.allowedCidr = null;
                    },

                    canAdd() : boolean {
                        return Utils.notNullnotUndefined(this.startPort)
                            && Utils.notNullnotUndefined(this.endPort)
                            && Utils.notNullnotUndefined(this.type)
                            && Utils.notNullnotUndefined(this.protocol)
                            && this.isStartPortValid()
                            && this.isEndPortValid()
                            && this.isCIDRValid();
                    },

                    isGridShow() : boolean {
                        return $scope.optionsRuleGrid__.dataSource.data().length > 0;
                    },

                    del(uid: string) : void {
                        var row = $scope.optionsRuleGrid__.dataSource.getByUid(uid);
                        $scope.optionsRuleGrid__.dataSource.remove(row);
                    }
                };

                var l3Page: Utils.WizardPage = $scope.l3Page = {
                    activeState: false,

                    canMoveToPrevious(): boolean {
                        return true;
                    },
                    canMoveToNext(): boolean {
                        return true;
                    },

                    getAnchorElement() : any {
                        return $('.nav a[data-target="#createSecurityGroupRuleL3Network"]');
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
                        return 'createSecurityGroupRuleL3Network';
                    },

                    reset() : void {
                        this.activeState = false;
                    },


                    canAdd() : boolean {
                        return Utils.notNullnotUndefined(this.dns);
                    },

                    hasL3Network(): boolean {
                        return $scope.l3NetworkListOptions__.dataSource.data().length > 0;
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
                        var resultSg : SecurityGroup;
                        var chain = new Utils.Chain();
                        chain.then(()=> {
                            sgMgr.create(infoPage, (ret : SecurityGroup)=> {
                                resultSg = ret;
                                chain.next();
                            });
                        }).then(()=>{
                            var rules = $scope.optionsRuleGrid__.dataSource.data();
                            if (rules.length == 0) {
                                chain.next();
                                return;
                            }

                            sgMgr.addRule(resultSg, rules, ()=>{
                                chain.next();
                            });
                        }).then(()=> {
                            var l3s = $scope.l3NetworkList__.dataItems();
                            if (l3s.length == 0) {
                                chain.next();
                                return;
                            }

                            var attach = () => {
                                var l3 = l3s.shift();
                                if (!Utils.notNullnotUndefined(l3)) {
                                    chain.next();
                                    return;
                                }

                                this.sgMgr.attachL3Network(resultSg, l3.uuid, ()=>{
                                    attach();
                                });
                            };

                            attach();
                        }).done(()=> {
                            if (Utils.notNullnotUndefined(this.options.done)) {
                                this.options.done(resultSg);
                            }
                        }).start();

                        $scope.winCreateSecurityGroup__.close();
                    }
                };

                $scope.button = new Utils.WizardButton([
                    infoPage, rulePage, l3Page
                ], mediator);

                $scope.l3NetworkListOptions__ = {
                    dataSource: new kendo.data.DataSource({data: []}),
                    dataTextField: "name",
                    dataValueField: "uuid",
                    itemTemplate: '<div style="color: black"><span class="z-label">{{"securityGroup.ts.Name" | translate}}:</span><span>#: name #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"securityGroup.ts.TYPE" | translate}}:</span><span>#: type #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"securityGroup.ts.Zone UUID" | translate}}:</span><span>#: zoneUuid #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"securityGroup.ts.UUID" | translate}}:</span><span>#: uuid #</span></div>'
                };

                $scope.ruleTypeOptions__ = {
                    dataSource: new kendo.data.DataSource({data: [
                        'Ingress', 'Egress'
                    ]})
                };
                $scope.rulePage.type = 'Ingress';

                $scope.ruleProtocolOptions__ = {
                    dataSource: new kendo.data.DataSource({data: [
                        'TCP', 'UDP', 'ICMP'
                    ]})
                };
                $scope.rulePage.protocol = 'TCP';

                $scope.optionsRuleGrid__ = {
                    pageSize: 20,
                    resizable: true,
                    scrollable: true,
                    pageable: true,
                    columns: [
                        {
                            field: 'startPort',
                            title: '{{"securityGroup.ts.START" | translate}}',
                            width: '16%'
                        },
                        {
                            field: 'endPort',
                            title: '{{"securityGroup.ts.END" | translate}}',
                            width: '16%'
                        },
                        {
                            field: 'type',
                            title: '{{"securityGroup.ts.TYPE" | translate}}',
                            width: '16%'

                        },
                        {
                            field: 'protocol',
                            title: '{{"securityGroup.ts.PROTOCOL" | translate}}',
                            width: '16%'

                        },
                        {
                            field: 'allowedCidr',
                            title: '{{"securityGroup.ts.ALLOWED CIDR" | translate}}',
                            width: '16%'
                        },
                        {
                            width: '10%',
                            title: '',
                            template: '<button type="button" class="btn btn-xs btn-default" ng-click="rulePage.del(dataItem.uid)"><i class="fa fa-times"></i></button>'
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

                $scope.winCreateSecurityGroupOptions__ = {
                    width: '800px',
                    animation: false,
                    modal: true,
                    draggable: false,
                    resizable: false
                };

                this.$scope = $scope;
            };
            this.restrict = 'EA';
            this.replace = true;
            this.templateUrl = '/static/templates/securityGroup/createSecurityGroup.html';
        }
    }

    export class DeleteRule implements ng.IDirective {
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

        options : any;
        $scope: any;

        open() {
            this.$scope.ruleOptions__.dataSource.data(this.options.sg.rules);
            this.$scope.deleteRule__.center();
            this.$scope.deleteRule__.open();
        }

        constructor(private sgMgr : SecurityGroupManager) {
            this.scope = true;
            this.restrict = 'EA';
            this.replace = true;
            this.templateUrl = '/static/templates/securityGroup/deleteRule.html';
            this.link = ($scope : any, $element, $attrs : any, $ctrl, $transclude) => {
                var parent = $scope.$parent;
                parent[$attrs.zSecurityGroupDeleteRule] = this;
                this.options = parent[$attrs.zOptions];
                this.$scope = $scope;

                $scope.uuid = null;
                $scope.ruleOptions__ = {
                    pageSize: 20,
                    resizable: true,
                    scrollable: true,
                    pageable: true,
                    columns: [
                        {
                            width: '10%',
                            title: '',
                            template: '<input type="checkbox" ng-model="dataItem.toDelete">'
                        },
                        {
                            field: 'startPort',
                            title: '{{"securityGroup.ts.START" | translate}}',
                            width: '16%'
                        },
                        {
                            field: 'endPort',
                            title: '{{"securityGroup.ts.END" | translate}}',
                            width: '16%'
                        },
                        {
                            field: 'type',
                            title: '{{"securityGroup.ts.TYPE" | translate}}',
                            width: '16%'

                        },
                        {
                            field: 'protocol',
                            title: '{{"securityGroup.ts.PROTOCOL" | translate}}',
                            width: '16%'

                        },
                        {
                            field: 'allowedCidr',
                            title: '{{"securityGroup.ts.ALLOWED CIDR" | translate}}',
                            width: '16%'
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

                function getSelectedItems()  {
                    var rules = $scope.ruleOptions__.dataSource.data();
                    var ruleToDelete = [];
                    angular.forEach(rules, (it)=>{
                        if (it.toDelete == true) {
                            ruleToDelete.push(it);
                        }
                    });
                    return ruleToDelete;
                }

                $scope.canProceed = ()=> {
                    return getSelectedItems().length > 0;
                };

                $scope.cancel = () => {
                    $scope.deleteRule__.close();
                };

                $scope.done = () => {
                    var ruleUuids = [];
                    var rules = getSelectedItems();
                    angular.forEach(rules, (rule: ApiHeader.SecurityGroupRuleInventory)=> {
                        ruleUuids.push(rule.uuid);
                    });

                    sgMgr.deleteRule(this.options.sg, ruleUuids, ()=> {
                        if (Utils.notNullnotUndefined(this.options.done)) {
                            this.options.done(rules);
                        }
                    });

                    $scope.deleteRule__.close();
                };

                $scope.deleteRuleOptions__ = {
                    width: '550px'
                };

                $scope.$watch(()=>{
                    return this.options.sg;
                },()=>{
                    if (Utils.notNullnotUndefined(this.options.sg)) {
                        var rules = [];
                        angular.extend(rules, this.options.sg.rules);
                        $scope.ruleOptions__.dataSource.data(rules);
                    }
                });
            }
        }
    }

    export class AddVmNic implements ng.IDirective {
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

        options : any;
        $scope: any;

        open() {
            this.$scope.vmNicListOptions__.dataSource.data([]);
            this.$scope.securityGroupName = this.options.sg.name;
            var chain  = new Utils.Chain();
            var nics = [];
            var candidates = [];
            chain.then(()=> {
                this.sgMgr.getCandidateVmNic(this.options.sg, (ret: ApiHeader.VmNicInventory[])=>{
                    nics = ret;
                    chain.next();
                });
            }).then(()=>{
                if (nics.length == 0) {
                    chain.next();
                    return;
                }
                var nicUuids = [];
                angular.forEach(nics, (it)=>{
                    nicUuids.push(it.uuid);
                });

                var qobj = new ApiHeader.QueryObject();
                qobj.conditions = [
                    {
                        name: 'vmNics.uuid',
                        op: 'in',
                        value: nicUuids.join()
                    }
                ];

                this.vmMgr.query(qobj, (vms: MVmInstance.VmInstance[])=>{
                    angular.forEach(nics, (nic)=>{
                        for (var i=0; i<vms.length; i++) {
                            var vm = vms[i];
                            for (var j=0; j<vm.vmNics.length; j++) {
                               var vnic = vm.vmNics[j];
                                if (vnic.uuid == nic.uuid) {
                                    var tvm = vm;
                                    break;
                                }
                            }
                        }

                        candidates.push({
                            id: tvm.name + ' - ' + nic.ip,
                            vm: tvm,
                            nic: nic
                        });
                    });

                    chain.next();
                });
            }).done(()=>{
                this.$scope.vmNicListOptions__.dataSource.data(candidates);
                this.$scope.addVmNic__.center();
                this.$scope.addVmNic__.open();
            }).start();
        }

        constructor(private sgMgr: SecurityGroupManager, private vmMgr: MVmInstance.VmInstanceManager) {
            this.scope = true;
            this.restrict = 'EA';
            this.replace = true;
            this.templateUrl = '/static/templates/securityGroup/addVmNic.html';
            this.link = ($scope : any, $element, $attrs : any, $ctrl, $transclude) => {
                var parent = $scope.$parent;
                parent[$attrs.zSecurityGroupAddVmNic] = this;
                this.options = parent[$attrs.zOptions];
                this.$scope = $scope;

                $scope.uuid = null;
                $scope.vmNicListOptions__ = {
                    dataSource: new kendo.data.DataSource({data: []}),
                    dataTextField: "id",
                    dataValueField: "uuid",
                    itemTemplate: '<div style="color: black"><span class="z-label">VM Name:</span><span>#: vm.name #</span></div>' +
                        '<div style="color: black"><span class="z-label">Nic IP:</span><span>#: nic.ip #</span></div>' +
                        '<div style="color: black"><span class="z-label">Nic Device ID:</span><span>#: nic.deviceId #</span></div>' +
                        '<div style="color: black"><span class="z-label">Nic UUID:</span><span>#: nic.uuid #</span></div>',

                    change: (e)=> {
                        var select = e.sender;
                        Utils.safeApply($scope, ()=> {
                            $scope.selectItemNum = select.dataItems().length;
                        });
                    }
                };

                $scope.hasVmNic = () => {
                    return $scope.vmNicListOptions__.dataSource.data().length > 0;
                };

                $scope.selectItemNum = 0;

                $scope.canProceed = ()=> {
                    return $scope.selectItemNum > 0;
                };

                $scope.cancel = () => {
                    $scope.addVmNic__.close();
                };

                $scope.done = () => {
                    var nics = $scope.vmNicList__.dataItems();
                    var nicUuids = [];
                    angular.forEach(nics, (it)=> {
                        nicUuids.push(it.nic.uuid);

                    });

                    sgMgr.addVmNic(this.options.sg, nicUuids, ()=>{
                        if (Utils.notNullnotUndefined(this.options.done)) {
                            this.options.done();
                        }
                    });

                    $scope.addVmNic__.close();
                };

                $scope.addVmNicOptions__ = {
                    width: '550px'
                };
            }
        }
    }

    export class RemoveVmNic implements ng.IDirective {
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

        options : any;
        $scope: any;

        open() {
            this.$scope.vmNicListOptions__.dataSource.data([]);
            this.$scope.securityGroupName = this.options.sg.name;
            var chain  = new Utils.Chain();
            var nics = [];
            var candidates = [];
            chain.then(()=> {
                var msg = new ApiHeader.APIQueryVmNicMsg();
                msg.conditions = [{
                    name: 'securityGroup.uuid',
                    op: '=',
                    value: this.options.sg.uuid
                }];
                this.api.syncApi(msg, (reply: ApiHeader.APIQueryVmNicReply)=>{
                    nics = reply.inventories;
                    chain.next();
                });
            }).then(()=>{
                if (nics.length == 0) {
                    chain.next();
                    return;
                }
                var nicUuids = [];
                angular.forEach(nics, (it)=>{
                    nicUuids.push(it.uuid);
                });

                var qobj = new ApiHeader.QueryObject();
                qobj.conditions = [
                    {
                        name: 'vmNics.uuid',
                        op: 'in',
                        value: nicUuids.join()
                    }
                ];

                this.vmMgr.query(qobj, (vms: MVmInstance.VmInstance[])=>{
                    angular.forEach(nics, (nic)=>{
                        for (var i=0; i<vms.length; i++) {
                            var vm = vms[i];
                            for (var j=0; j<vm.vmNics.length; j++) {
                                var vnic = vm.vmNics[j];
                                if (vnic.uuid == nic.uuid) {
                                    var tvm = vm;
                                    break;
                                }
                            }
                        }

                        candidates.push({
                            id: tvm.name + ' - ' + nic.ip,
                            vm: tvm,
                            nic: nic
                        });
                    });

                    chain.next();
                });
            }).done(()=>{
                this.$scope.vmNicListOptions__.dataSource.data(candidates);
                this.$scope.removeVmNic__.center();
                this.$scope.removeVmNic__.open();
            }).start();
        }

        constructor(private sgMgr: SecurityGroupManager, private vmMgr: MVmInstance.VmInstanceManager, private api : Utils.Api) {
            this.scope = true;
            this.restrict = 'EA';
            this.replace = true;
            this.templateUrl = '/static/templates/securityGroup/removeVmNic.html';
            this.link = ($scope : any, $element, $attrs : any, $ctrl, $transclude) => {
                var parent = $scope.$parent;
                parent[$attrs.zSecurityGroupRemoveVmNic] = this;
                this.options = parent[$attrs.zOptions];
                this.$scope = $scope;

                $scope.uuid = null;
                $scope.vmNicListOptions__ = {
                    dataSource: new kendo.data.DataSource({data: []}),
                    dataTextField: "id",
                    dataValueField: "uuid",
                    itemTemplate: '<div style="color: black"><span class="z-label">VM Name:</span><span>#: vm.name #</span></div>' +
                        '<div style="color: black"><span class="z-label">Nic IP:</span><span>#: nic.ip #</span></div>' +
                        '<div style="color: black"><span class="z-label">Nic Device ID:</span><span>#: nic.deviceId #</span></div>' +
                        '<div style="color: black"><span class="z-label">Nic UUID:</span><span>#: nic.uuid #</span></div>',

                    change: (e)=> {
                        var select = e.sender;
                        Utils.safeApply($scope, ()=> {
                            $scope.selectItemNum = select.dataItems().length;
                        });
                    }
                };

                $scope.hasVmNic = () => {
                    return $scope.vmNicListOptions__.dataSource.data().length > 0;
                };

                $scope.selectItemNum = 0;

                $scope.canProceed = ()=> {
                    return $scope.selectItemNum > 0;
                };

                $scope.cancel = () => {
                    $scope.removeVmNic__.close();
                };

                $scope.done = () => {
                    var nics = $scope.vmNicList__.dataItems();
                    var nicUuids = [];
                    angular.forEach(nics, (it)=> {
                        nicUuids.push(it.nic.uuid);

                    });

                    sgMgr.removeVmNic(this.options.sg, nicUuids, ()=>{
                        if (Utils.notNullnotUndefined(this.options.done)) {
                            this.options.done();
                        }
                    });

                    $scope.removeVmNic__.close();
                };

                $scope.addVmNicOptions__ = {
                    width: '550px'
                };
            }
        }
    }

    export class AttachL3Network implements ng.IDirective {
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

        options : any;
        $scope: any;

        open() {
            this.$scope.l3NetworkListOptions__.dataSource.data([]);
            var chain  = new Utils.Chain();
            chain.then(()=> {
                var qobj = new ApiHeader.QueryObject();
                qobj.conditions = [
                    {
                        name: 'uuid',
                        op: 'not in',
                        value: this.options.sg.attachedL3NetworkUuids.join()
                    },
                ];

                this.l3Mgr.query(qobj, (l3s: ML3Network.L3Network[])=>{
                    this.$scope.l3NetworkListOptions__.dataSource.data(l3s);
                    chain.next();
                });
            }).done(()=>{
                this.$scope.attachL3Network__.center();
                this.$scope.attachL3Network__.open();
            }).start();
        }


        constructor(private sgMgr: SecurityGroupManager, private l3Mgr: ML3Network.L3NetworkManager) {
            this.scope = true;
            this.restrict = 'EA';
            this.replace = true;
            this.templateUrl = '/static/templates/securityGroup/attachL3Network.html';
            this.link = ($scope : any, $element, $attrs : any, $ctrl, $transclude) => {
                var parent = $scope.$parent;
                parent[$attrs.zSecurityGroupAttachL3Network] = this;
                this.options = parent[$attrs.zOptions];
                this.$scope = $scope;

                $scope.uuid = null;
                $scope.l3NetworkListOptions__ = {
                    dataSource: new kendo.data.DataSource({data: []}),
                    dataTextField: "name",
                    dataValueField: "uuid",
                    itemTemplate: '<div style="color: black"><span class="z-label">Name:</span><span>#: name #</span></div>' +
                        '<div style="color: black"><span class="z-label">TYPE:</span><span>#: type #</span></div>' +
                        '<div style="color: black"><span class="z-label">Zone UUID:</span><span>#: zoneUuid #</span></div>' +
                        '<div style="color: black"><span class="z-label">L2 Network UUID:</span><span>#: l2NetworkUuid #</span></div>' +
                        '<div style="color: black"><span class="z-label">UUID:</span><span>#: uuid #</span></div>',

                    change: (e)=> {
                        var select = e.sender;
                        Utils.safeApply($scope, ()=> {
                            $scope.selectItemNum = select.dataItems().length;
                        });
                    }
                };

                $scope.hasL3Network = () => {
                    return $scope.l3NetworkListOptions__.dataSource.data().length > 0;
                };

                $scope.selectItemNum = 0;

                $scope.canProceed = ()=> {
                    return $scope.selectItemNum > 0;
                };

                $scope.cancel = () => {
                    $scope.attachL3Network__.close();
                };

                $scope.done = () => {
                    var l3s = $scope.l3NetworkList__.dataItems();
                    angular.forEach(l3s, (it)=> {
                        sgMgr.attachL3Network(this.options.sg, it.uuid, ()=>{
                            if (Utils.notNullnotUndefined(this.options.done)) {
                                this.options.done(it);
                            }
                        });
                    });

                    $scope.attachL3Network__.close();
                };
            }
        }
    }



    export class DetachL3Network implements ng.IDirective {
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

        options : any;
        $scope: any;

        open() {
            this.$scope.l3NetworkList__.value([]);
            this.$scope.ok = null;
            var chain  = new Utils.Chain();
            chain.then(()=> {
                if (this.options.sg.attachedL3NetworkUuids.length == 0) {
                    chain.next();
                    return;
                }

                var qobj = new ApiHeader.QueryObject();
                qobj.conditions = [
                    {
                        name: 'uuid',
                        op: 'in',
                        value: this.options.sg.attachedL3NetworkUuids.join()
                    }
                ];

                this.l3Mgr.query(qobj, (l3s: ML3Network.L3Network[])=>{
                    this.$scope.l3NetworkListOptions__.dataSource.data(l3s);
                    chain.next();
                });
            }).done(()=>{
                this.$scope.detachL3Network__.center();
                this.$scope.detachL3Network__.open();
            }).start();
        }


        constructor(private sgMgr: SecurityGroupManager, private l3Mgr : ML3Network.L3NetworkManager) {
            this.scope = true;
            this.restrict = 'EA';
            this.replace = true;
            this.templateUrl = '/static/templates/securityGroup/detachL3Network.html';
            this.link = ($scope : any, $element, $attrs : any, $ctrl, $transclude) => {
                var parent = $scope.$parent;
                parent[$attrs.zSecurityGroupDetachL3Network] = this;
                this.options = parent[$attrs.zOptions];
                this.$scope = $scope;

                $scope.uuid = null;
                $scope.l3NetworkListOptions__ = {
                    dataSource: new kendo.data.DataSource({data: []}),
                    dataTextField: "name",
                    dataValueField: "uuid",
                    itemTemplate: '<div style="color: black"><span class="z-label">Name:</span><span>#: name #</span></div>' +
                        '<div style="color: black"><span class="z-label">TYPE:</span><span>#: type #</span></div>' +
                        '<div style="color: black"><span class="z-label">Zone UUID:</span><span>#: zoneUuid #</span></div>' +
                        '<div style="color: black"><span class="z-label">L2 Network UUID:</span><span>#: l2NetworkUuid #</span></div>' +
                        '<div style="color: black"><span class="z-label">UUID:</span><span>#: uuid #</span></div>',

                    change: (e)=> {
                        var select = e.sender;
                        Utils.safeApply($scope, ()=> {
                            $scope.selectItemNum = select.dataItems().length;
                        });
                    }
                };

                $scope.hasL3Network = () => {
                    return $scope.l3NetworkListOptions__.dataSource.data().length > 0;
                };

                $scope.selectItemNum = 0;

                $scope.canProceed = ()=> {
                    return $scope.selectItemNum > 0;
                };

                $scope.cancel = () => {
                    $scope.detachL3Network__.close();
                };

                $scope.done = () => {
                    var l3s  = $scope.l3NetworkList__.dataItems();
                    angular.forEach(l3s, (l3: any)=> {
                        sgMgr.detachL3Network(this.options.sg, l3.uuid, ()=>{
                            if (Utils.notNullnotUndefined(this.options.done)) {
                                this.options.done(l3);
                            }
                        });
                    });

                    $scope.detachL3Network__.close();
                };

                $scope.detachL3NetworkOptions__ = {
                    width: '600px'
                };
            }
        }
    }

}

angular.module('root').factory('SecurityGroupManager', ['Api', '$rootScope', (api, $rootScope)=> {
    return new MSecurityGroup.SecurityGroupManager(api, $rootScope);
}]).directive('zCreateSecurityGroup', ['Api', 'SecurityGroupManager', 'L3NetworkManager', (api, sgMgr, l3Mgr)=> {
    return new MSecurityGroup.CreateSecurityGroup(api, sgMgr, l3Mgr);
}]).directive('zSecurityGroupAddRule', ['SecurityGroupManager', (sgMgr)=>{
    return new MSecurityGroup.AddRule(sgMgr);
}]).directive('zSecurityGroupDeleteRule', ['SecurityGroupManager', (sgMgr)=>{
    return new MSecurityGroup.DeleteRule(sgMgr);
}]).directive('zSecurityGroupAttachL3Network', ['SecurityGroupManager', 'L3NetworkManager', (sgMgr, l3Mgr)=>{
    return new MSecurityGroup.AttachL3Network(sgMgr, l3Mgr);
}]).directive('zSecurityGroupDetachL3Network', ['SecurityGroupManager', 'L3NetworkManager', (sgMgr, l3Mgr)=>{
    return new MSecurityGroup.DetachL3Network(sgMgr, l3Mgr);
}]).directive('zSecurityGroupAddVmNic', ['SecurityGroupManager', 'VmInstanceManager', (sgMgr, vmMgr)=>{
    return new MSecurityGroup.AddVmNic(sgMgr, vmMgr);
}]).directive('zSecurityGroupRemoveVmNic', ['SecurityGroupManager', 'VmInstanceManager', 'Api', (sgMgr, vmMgr, api)=>{
    return new MSecurityGroup.RemoveVmNic(sgMgr, vmMgr, api);
}]).config(['$routeProvider', function(route) {
    route.when('/securityGroup', {
        templateUrl: '/static/templates/securityGroup/securityGroup.html',
        controller: 'MSecurityGroup.Controller'
    }).when('/securityGroup/:uuid', {
        templateUrl: '/static/templates/securityGroup/details.html',
        controller: 'MSecurityGroup.DetailsController',
        resolve: {
            current: function($q : ng.IQService, $route: any, SecurityGroupManager: MSecurityGroup.SecurityGroupManager) {
                var defer = $q.defer();
                var qobj = new ApiHeader.QueryObject();
                var uuid = $route.current.params.uuid;
                qobj.addCondition({name: 'uuid', op: '=', value: uuid});
                SecurityGroupManager.query(qobj, (sgs: MSecurityGroup.SecurityGroup[])=>{
                    var sg = sgs[0];
                    defer.resolve(sg);
                });
                return defer.promise;
            }
        }
    });
}]);

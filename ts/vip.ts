
/// <reference path="d.ts/angularjs/angular.d.ts" />
/// <reference path="d.ts/kendo.all.d.ts" />

module MVip {
    export class Vip extends ApiHeader.VipInventory {
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

        updateObservableObject(inv : ApiHeader.VipInventory) {
            // self : ObservableObject
            var self : any = this;
            self.set('uuid', inv.uuid);
            self.set('name', inv.name);
            self.set('description', inv.description);
            self.set('state', inv.state);
            self.set('ip', inv.ip);
            self.set('l3NetworkUuid', inv.l3NetworkUuid);
            self.set('netmask', inv.netmask);
            self.set('serviceProvider', inv.serviceProvider);
            self.set('peerL3NetworkUuid', inv.peerL3NetworkUuid);
            self.set('useFor', inv.useFor);
            self.set('gateway', inv.gateway);
            self.set('createDate', inv.createDate);
            self.set('lastOpDate', inv.lastOpDate);
        }
    }

    export class VipManager {
        static $inject = ['Api', '$rootScope'];

        constructor(private api : Utils.Api, private $rootScope: ng.IRootScopeService) {
        }

        private sortBy : Directive.SortByData;

        setSortBy(sortBy : Directive.SortByData) {
            this.sortBy = sortBy;
        }

        private wrap(Vip : Vip) : any {
            return new kendo.data.ObservableObject(Vip);
        }

        create(vip : any, done : (ret : Vip)=>void) {
            var msg : any = new ApiHeader.APICreateVipMsg();
            msg.name = vip.name;
            msg.description = vip.description;
            msg.l3NetworkUuid = vip.l3NetworkUuid;
            msg.allocatorStrategy = vip.allocatorStrategy;
            msg.requiredIp = vip.requiredIp;
            this.api.asyncApi(msg, (ret : ApiHeader.APICreateVipEvent)=> {
                var c = new Vip();
                angular.extend(c, ret.inventory);
                done(this.wrap(c));
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Created new VIP: {0}',c.name),
                    link: Utils.sprintf('/#/vip/{0}', c.uuid)
                });
            });
        }

        query(qobj : ApiHeader.QueryObject, callback : (vips : Vip[], total: number) => void) : void {
            var msg = new ApiHeader.APIQueryVipMsg();
            msg.count = qobj.count === true;
            msg.start = qobj.start;
            msg.limit = qobj.limit;
            msg.replyWithCount = true;
            msg.conditions = qobj.conditions ? qobj.conditions : [];
            if (Utils.notNullnotUndefined(this.sortBy) && this.sortBy.isValid()) {
                msg.sortBy = this.sortBy.field;
                msg.sortDirection = this.sortBy.direction;
            }
            this.api.syncApi(msg, (ret : ApiHeader.APIQueryVipReply)=>{
                var pris = [];
                ret.inventories.forEach((inv : ApiHeader.VipInventory)=> {
                    var c = new Vip();
                    angular.extend(c, inv);
                    pris.push(this.wrap(c));
                });
                callback(pris, ret.total);
            });
        }

        disable(vip : Vip) {
            vip.progressOn();
            var msg = new ApiHeader.APIChangeVipStateMsg();
            msg.stateEvent = 'disable';
            msg.uuid = vip.uuid;
            this.api.asyncApi(msg, (ret : ApiHeader.APIChangeVipStateEvent) => {
                vip.updateObservableObject(ret.inventory);
                vip.progressOff();
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Disabled VIP: {0}',vip.name),
                    link: Utils.sprintf('/#/vip/{0}', vip.uuid)
                });
            });
        }

        enable(vip : Vip) {
            vip.progressOn();
            var msg = new ApiHeader.APIChangeVipStateMsg();
            msg.stateEvent = 'enable';
            msg.uuid = vip.uuid;
            this.api.asyncApi(msg, (ret : ApiHeader.APIChangeVipStateEvent) => {
                vip.updateObservableObject(ret.inventory);
                vip.progressOff();
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Enabled VIP: {0}', vip.name),
                    link: Utils.sprintf('/#/vip/{0}', vip.uuid)
                });
            });
        }

        delete(vip : Vip, done : (ret : any)=>void) {
            vip.progressOn();
            var msg = new ApiHeader.APIDeleteVipMsg();
            msg.uuid = vip.uuid;
            this.api.asyncApi(msg, (ret : any)=> {
                vip.progressOff();
                done(ret);
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Deleted VIP: {0}', vip.name)
                });
            });
        }
    }

    export class VipModel extends Utils.Model {
        constructor() {
            super();
            this.current = new Vip();
        }
    }

    class OVipGrid extends Utils.OGrid {
        constructor($scope: any, private vipMgr : VipManager) {
            super();
            super.init($scope, $scope.vipGrid);
            this.options.columns = [
                {
                    field: 'name',
                    title: '{{"vip.ts.NAME" | translate}}',
                    width: '10%',
                    template: '<a href="/\\#/vip/{{dataItem.uuid}}">{{dataItem.name}}</a>'
                },
                {
                    field: 'state',
                    title: '{{"vip.ts.STATE" | translate}}',
                    width: '6%',
                    template: '<span class="{{dataItem.stateLabel()}}">{{dataItem.state}}</span>'
                },
                {
                    field: 'ip',
                    title: '{{"vip.ts.IP" | translate}}',
                    width: '14%'
                },
                {
                    field: 'netmask',
                    title: '{{"vip.ts.NETMASK" | translate}}',
                    width: '14%'
                },
                {
                    field: 'gateway',
                    title: '{{"vip.ts.GATEWAY" | translate}}',
                    width: '14%'
                },
                {
                    field: 'l3NetworkUuid',
                    title: '{{"vip.ts.L3 NETWORK UUID" | translate}}',
                    width: '%14',
                    template: '<a href="/\\#/l3Network/{{dataItem.l3NetworkUuid}}">{{dataItem.l3NetworkUuid}}</a>'
                },
                {
                    field: 'useFor',
                    title: '{{"vip.ts.USE" | translate}}',
                    width: '14%'
                },
                {
                    field: 'serviceProvider',
                    title: '{{"vip.ts.SERVICE PROVIDER" | translate}}',
                    width: '14%'
                }
            ];

            this.options.dataSource.transport.read = (options)=> {
                var qobj = new ApiHeader.QueryObject();
                qobj.limit = options.data.take;
                qobj.start = options.data.pageSize * (options.data.page - 1);
                vipMgr.query(qobj, (vips:Vip[], total:number)=> {
                    options.success({
                        data: vips,
                        total: total
                    });
                });
            };
        }
    }

    class Action {
        enable() {
            this.vipMgr.enable(this.$scope.model.current);
        }

        disable() {
            this.vipMgr.disable(this.$scope.model.current);
        }

        constructor(private $scope : any, private vipMgr : VipManager) {
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
                            name: '{{"vip.ts.None" | translate}}',
                            value: FilterBy.NONE
                        },
                        {
                            name: '{{"vip.ts.State" | translate}}',
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
            this.$scope.oVipGrid.setFilter(this.toKendoFilter());
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
        static $inject = ['$scope', 'VipManager', '$routeParams', 'Tag', 'current'];

        private loadSelf(uuid : string) {
            var qobj = new ApiHeader.QueryObject();
            qobj.addCondition({name: 'uuid', op: '=', value: uuid});
            this.vipMgr.query(qobj, (vips : Vip[], total:number)=> {
                this.$scope.model.current = vips[0];
            });
        }

        constructor(private $scope : any, private vipMgr : VipManager, private $routeParams : any,
                    private tagService : Utils.Tag, current: Vip) {
            $scope.model = new VipModel();
            $scope.model.current = current;

            $scope.funcDelete = (win : any) => {
                win.open();
            };

            $scope.action = new Action($scope, vipMgr);

            $scope.funcRefresh = ()=> {
                this.loadSelf($scope.model.current.uuid);
            };

            $scope.funcToolbarShow = ()=> {
                return Utils.notNullnotUndefined($scope.model.current);
            };

            $scope.optionsDeleteVip = {
                title: 'DELETE VIP',
                description: 'Deleting will delete all network services that this VIP is used for. For example, if the VIP is used for EIP, the EIP will be deleted as well',
                confirm: ()=> {
                    vipMgr.delete($scope.model.current, (ret : any)=> {
                        $scope.model.resetCurrent();
                    });
                }
            };

            $scope.optionsTag = {
                tags: [],
                createTag: (item)=> {
                    this.tagService.createTag(item.tag, $scope.model.current.uuid, ApiHeader.TagResourceTypeVipVO, (ret : ApiHeader.TagInventory)=> {
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

        }
    }

    export class Controller {
        static $inject = ['$scope', 'VipManager', '$location'];

        constructor(private $scope : any, private vipMgr : VipManager, private $location : ng.ILocationService) {
            $scope.model = new VipModel();
            $scope.oVipGrid = new OVipGrid($scope, vipMgr);
            $scope.action = new Action($scope, vipMgr);
            $scope.optionsSortBy = {
                fields: [
                    {
                        name: '{{"vip.ts.Name" | translate}}',
                        value: 'name'
                    },
                    {
                        name: '{{"vip.ts.Description" | translate}}',
                        value: 'description'
                    },
                    {
                        name: '{{"vip.ts.IP" | translate}}',
                        value: 'ip'
                    },
                    {
                        name: '{{"vip.ts.NETMASK" | translate}}',
                        value: 'netmask'
                    },
                    {
                        name: '{{"vip.ts.GATEWAY" | translate}}',
                        value: 'gateway'
                    },
                    {
                        name: '{{"vip.ts.State" | translate}}',
                        value: 'state'
                    },
                    {
                        name: '{{"vip.ts.USE" | translate}}',
                        value: 'useFor'
                    },
                    {
                        name: '{{"vip.ts.SERVICE PROVIDER" | translate}}',
                        value: 'serviceProvider'
                    },
                    {
                        name: '{{"vip.ts.Created Date" | translate}}',
                        value: 'createDate'
                    },
                    {
                        name: '{{"vip.ts.Last Updated Date" | translate}}',
                        value: 'lastOpDate'
                    }
                ],

                done: (ret : Directive.SortByData) => {
                    vipMgr.setSortBy(ret);
                    $scope.oVipGrid.refresh();
                }
            };

            $scope.optionsSearch = {
                fields: ApiHeader.VipInventoryQueryable,
                name: 'Vip',
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
                    vipMgr.query(qobj, (Vips : Vip[], total:number)=> {
                        $scope.oVipGrid.refresh(Vips);
                    });
                }
            };

            $scope.funcGridDoubleClick = (e) => {
                if (Utils.notNullnotUndefined($scope.model.current)) {
                    var url = Utils.sprintf('/vip/{0}', $scope.model.current.uuid);
                    $location.path(url);
                    e.preventDefault();
                }
            };

            $scope.filterBy = new FilterBy($scope);

            $scope.funcSearch = (win : any) => {
                win.open();
            };

            $scope.funcCreateVip = (win : any) => {
                win.open();
            };

            $scope.funcDeleteVip = () => {
                $scope.deleteVip.open();
            };

            $scope.optionsDeleteVip = {
                title: 'DELETE VIP',
                description: 'Deleting will delete all network services that this VIP is used for. For example, if the VIP is used for EIP, the EIP will be deleted as well',

                confirm: ()=> {
                    vipMgr.delete($scope.model.current, (ret : any)=> {
                        $scope.oVipGrid.deleteCurrent();
                    });
                }
            };

            $scope.funcRefresh = ()=> {
                $scope.oVipGrid.refresh();
            };

            $scope.funcIsActionShow = ()=> {
                return !Utils.isEmptyObject($scope.model.current);
            };

            $scope.funcIsActionDisabled = ()=> {
                return Utils.notNullnotUndefined($scope.model.current) && $scope.model.current.isInProgress();
            };

            $scope.optionsCreateVip = {
                done: (vip : Vip) => {
                    $scope.oVipGrid.add(vip);
                }
            };
        }
    }

    export class CreateVipOptions {
        zone : MZone.Zone;
        done : (Vip : Vip)=>void;
    }

    export class CreateVip implements ng.IDirective {
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
        options: CreateVipOptions;
        $scope: any;

        open() {
            var win = this.$scope.winCreateVip__;
            this.$scope.button.reset();
            var qobj = new ApiHeader.QueryObject();
            qobj.conditions = [];
            this.$scope.zoneUuid = null;
            this.zoneMgr.query(qobj, (zones: ApiHeader.ZoneInventory[])=>{
                this.$scope.zoneOptions__.dataSource.data(zones);
                if (zones.length > 0) {
                    this.$scope.infoPage.zoneUuid = zones[0].uuid;
                }
                win.center();
                win.open();
            });
        }

        constructor(private api : Utils.Api, private vipMgr : VipManager, private zoneMgr: MZone.ZoneManager,
                    private l3Mgr: ML3Network.L3NetworkManager) {
            this.scope = true;
            this.link = ($scope : any, $element, $attrs : any, $ctrl, $transclude) => {
                var instanceName = $attrs.zCreateVip;
                var parentScope = $scope.$parent;
                parentScope[instanceName] = this;
                this.options = new CreateVipOptions();
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
                    l3NetworkUuid: null,
                    requiredIp: null,

                    isVipValid() : boolean {
                        if (Utils.notNullnotUndefined(this.requiredIp) && this.requiredIp != "") {
                            return Utils.isIpv4Address(this.requiredIp);
                        }
                        return true;
                    },

                    canMoveToPrevious(): boolean {
                        return false;
                    },

                    canMoveToNext(): boolean {
                        return Utils.notNullnotUndefined(this.name) && Utils.notNullnotUndefined(this.l3NetworkUuid) && this.isVipValid();
                    },

                    show(): void {
                        this.getAnchorElement().tab('show');
                    },

                    getAnchorElement() : any {
                        return $('.nav a[data-target="#createVipInfo"]');
                    },

                    active(): void {
                        this.activeState = true;
                    },

                    isActive(): boolean {
                        return this.activeState;
                    },

                    getPageName(): string {
                        return 'createVipInfo';
                    },

                    reset() : void {
                        this.name = Utils.shortHashName('vip');
                        this.description = null;
                        this.requiredIp = null;
                        this.l3NetworkUuid = null;
                        this.activeState = false;
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
                        var resultVip : Vip;
                        var chain = new Utils.Chain();
                        chain.then(()=> {
                            $scope.infoPage.requiredIp = $scope.infoPage.requiredIp == "" ? null : $scope.infoPage.requiredIp;
                            vipMgr.create(infoPage, (ret : Vip)=> {
                                resultVip = ret;
                                chain.next();
                            });
                        }).done(()=> {
                            if (Utils.notNullnotUndefined(this.options.done)) {
                                this.options.done(resultVip);
                            }
                        }).start();

                        $scope.winCreateVip__.close();
                    }
                };

                $scope.hasL3Network = () => {
                    return $scope.l3NetworkListOptions__.dataSource.data().length > 0;
                };

                $scope.button = new Utils.WizardButton([
                    infoPage
                ], mediator);

                $scope.winCreateVipOptions__ = {
                    width: '700px',
                    animation: false,
                    modal: true,
                    draggable: false,
                    resizable: false
                };

                $scope.zoneOptions__ = {
                    dataSource: new kendo.data.DataSource({data: []}),
                    dataTextField: "name",
                    dataValueField: "uuid",
                    template: '<div style="color: black"><span class="z-label">{{"vip.ts.Name" | translate}}:</span><span>#: name #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"vip.ts.State" | translate}}:</span><span>#: state #</span></div>'
                };

                $scope.l3NetworkListOptions__ = {
                    dataSource: new kendo.data.DataSource({data: []}),
                    dataTextField: "name",
                    dataValueField: "uuid",
                    template: '<div style="color: black"><span class="z-label">{{"vip.ts.Name" | translate}}:</span><span>#: name #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"vip.ts.Type" | translate}}:</span><span>#: type #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"vip.ts.Zone UUID" | translate}}:</span><span>#: zoneUuid #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"vip.ts.L2 Network UUID" | translate}}:</span><span>#: l2NetworkUuid #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"vip.ts.UUID" | translate}}:</span><span>#: uuid #</span></div>'
                };

                $scope.$watch(()=>{
                    return $scope.zoneUuid;
                }, ()=>{
                    if (Utils.notNullnotUndefined($scope.zoneUuid)) {
                        var qobj = new ApiHeader.QueryObject();
                        qobj.conditions = [
                            {
                                name: 'zoneUuid',
                                op: '=',
                                value: $scope.zoneUuid
                            }
                        ];
                        this.l3Mgr.query(qobj, (l3s: ApiHeader.L3NetworkInventory[])=>{
                            $scope.l3NetworkListOptions__.dataSource.data(l3s);
                            if (l3s.length > 0) {
                                $scope.infoPage.l3NetworkUuid = l3s[0].uuid;
                            }
                        });
                    }
                });

                this.$scope = $scope;
            };
            this.restrict = 'EA';
            this.replace = true;
            this.templateUrl = '/static/templates/vip/createVip.html';
        }
    }
}

angular.module('root').factory('VipManager', ['Api', '$rootScope', (api, $rootScope)=> {
    return new MVip.VipManager(api, $rootScope);
}]).directive('zCreateVip', ['Api', 'VipManager', 'ZoneManager', 'L3NetworkManager', (api, vipMgr, zoneMgr, l3Mgr)=>{
    return new MVip.CreateVip(api, vipMgr, zoneMgr, l3Mgr);
}]).config(['$routeProvider', function(route) {
    route.when('/vip', {
        templateUrl: '/static/templates/vip/vip.html',
        controller: 'MVip.Controller'
    }).when('/vip/:uuid', {
        templateUrl: '/static/templates/vip/details.html',
        controller: 'MVip.DetailsController',
        resolve: {
            current: function($q : ng.IQService, $route: any, VipManager: MVip.VipManager) {
                var defer = $q.defer();
                var qobj = new ApiHeader.QueryObject();
                var uuid = $route.current.params.uuid;
                qobj.addCondition({name: 'uuid', op: '=', value: uuid});
                VipManager.query(qobj, (vips: MVip.Vip[])=>{
                    var vip = vips[0];
                    defer.resolve(vip);
                });
                return defer.promise;
            }
        }
    });
}]);

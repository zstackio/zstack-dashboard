
/// <reference path="d.ts/angularjs/angular.d.ts" />
/// <reference path="d.ts/kendo.all.d.ts" />

module MImage {
    export class Image extends ApiHeader.ImageInventory {
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

        isExpungeShow() : boolean {
            return this.status == 'Deleted';
        }

        isRecoverShow() : boolean {
            return this.status == 'Deleted';
        }

        isDeleteShow() : boolean {
            return this.status != 'Deleted';
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

        statusLabel() : string {
            if (this.status == 'Ready') {
                return 'label label-success';
            } else {
                return 'label label-default';
            }
        }

        updateObservableObject(inv : ApiHeader.ImageInventory) {
            // self : ObservableObject
            var self : any = this;
            self.set('uuid', inv.uuid);
            self.set('name', inv.name);
            self.set('description', inv.description);
            self.set('state', inv.state);
            self.set('status', inv.status);
            self.set('url', inv.url);
            self.set('format', inv.format);
            self.set('mediaType', inv.mediaType);
            self.set('guestOsType', inv.guestOsType);
            self.set('backupStorageRefs', inv.backupStorageRefs);
            self.set('type', inv.type);
            self.set('createDate', inv.createDate);
            self.set('lastOpDate', inv.lastOpDate);
        }
    }

    export class ImageManager {
        static $inject = ['Api', '$rootScope'];

        constructor(private api : Utils.Api, private $rootScope: ng.IRootScopeService) {
        }

        private sortBy : Directive.SortByData;

        setSortBy(sortBy : Directive.SortByData) {
            this.sortBy = sortBy;
        }

        private wrap(Image : Image) : any {
            return new kendo.data.ObservableObject(Image);
        }

        create(image : any, done : (ret : Image)=>void) {
            var msg : ApiHeader.APIAddImageMsg = new ApiHeader.APIAddImageMsg();
            if (Utils.notNullnotUndefined(image.resourceUuid)) {
                msg.resourceUuid = image.resourceUuid;
            }
            msg.system = image.system;
            msg.name = image.name;
            msg.description = image.description;
            msg.mediaType = image.mediaType;
            msg.url = image.url;
            msg.format = image.format;
            msg.guestOsType = image.guestOsType;
            msg.backupStorageUuids = image.backupStorageUuids;
            msg.platform = image.platform;
            this.api.asyncApi(msg, (ret : ApiHeader.APIAddImageEvent)=> {
                var c = new Image();
                angular.extend(c, ret.inventory);
                done(this.wrap(c));
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Added new Image: {0}',c.name),
                    link: Utils.sprintf('/#/image/{0}', c.uuid)
                });
            });
        }

        query(qobj : ApiHeader.QueryObject, callback : (images : Image[], total: number) => void) : void {
            var msg = new ApiHeader.APIQueryImageMsg();
            msg.count = qobj.count === true;
            msg.start = qobj.start;
            msg.limit = qobj.limit;
            msg.replyWithCount = true;
            msg.conditions = qobj.conditions ? qobj.conditions : [];
            if (Utils.notNullnotUndefined(this.sortBy) && this.sortBy.isValid()) {
                msg.sortBy = this.sortBy.field;
                msg.sortDirection = this.sortBy.direction;
            }
            this.api.syncApi(msg, (ret : ApiHeader.APIQueryImageReply)=>{
                var pris = [];
                ret.inventories.forEach((inv : ApiHeader.ImageInventory)=> {
                    var c = new Image();
                    angular.extend(c, inv);
                    pris.push(this.wrap(c));
                });
                callback(pris, ret.total);
            });
        }

        disable(image : Image) {
            image.progressOn();
            var msg = new ApiHeader.APIChangeImageStateMsg();
            msg.stateEvent = 'disable';
            msg.uuid = image.uuid;
            this.api.asyncApi(msg, (ret : ApiHeader.APIChangeImageStateEvent) => {
                image.updateObservableObject(ret.inventory);
                image.progressOff();
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Disabled Image: {0}',image.name),
                    link: Utils.sprintf('/#/image/{0}', image.uuid)
                });
            });
        }

        enable(image : Image) {
            image.progressOn();
            var msg = new ApiHeader.APIChangeImageStateMsg();
            msg.stateEvent = 'enable';
            msg.uuid = image.uuid;
            this.api.asyncApi(msg, (ret : ApiHeader.APIChangeImageStateEvent) => {
                image.updateObservableObject(ret.inventory);
                image.progressOff();
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Enabled Image: {0}', image.name),
                    link: Utils.sprintf('/#/image/{0}', image.uuid)
                });
            });
        }

        delete(image : Image, done : (ret : any)=>void) {
            image.progressOn();
            var msg = new ApiHeader.APIDeleteImageMsg();
            msg.uuid = image.uuid;
            this.api.asyncApi(msg, (ret : any)=> {
                image.progressOff();
                done(ret);
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Deleted Image: {0}', image.name)
                });
            });
        }

        expunge(image : Image, done : (ret: any)=>void) {
            image.progressOn();
            var msg = new ApiHeader.APIExpungeImageMsg();
            msg.imageUuid = image.uuid;
            this.api.asyncApi(msg, (ret : any)=> {
                image.progressOff();
                done(ret);
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Expunged Image: {0}', image.name)
                });
            });
        }

        recover(image : Image) {
            image.progressOn();
            var msg = new ApiHeader.APIRecoverImageMsg();
            msg.imageUuid = image.uuid;
            this.api.asyncApi(msg, (ret : any)=> {
                image.progressOff();
                image.updateObservableObject(ret.inventory);
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Recovered Image: {0}', image.name)
                });
            });
        }
    }

    export class ImageModel extends Utils.Model {
        constructor() {
            super();
            this.current = new Image();
        }
    }

    class OImageGrid extends Utils.OGrid {
        constructor($scope: any, private imageMgr : ImageManager) {
            super();
            super.init($scope, $scope.imageGrid);
            this.options.columns = [
                {
                    field: 'name',
                    title: '{{"image.ts.NAME" | translate}}',
                    width: '10%',
                    template: '<a href="/\\#/image/{{dataItem.uuid}}">{{dataItem.name}}</a>'
                },
                {
                    field: 'mediaType',
                    title: '{{"image.ts.MEIDA TYPE" | translate}}',
                    width: '15%'
                },
                {
                    field: 'state',
                    title: '{{"image.ts.STATE" | translate}}',
                    width: '10%',
                    template: '<span class="{{dataItem.stateLabel()}}">{{dataItem.state}}</span>'
                },
                {
                    field: 'status',
                    title: '{{"image.ts.STATUS" | translate}}',
                    width: '10%',
                    template: '<span class="{{dataItem.statusLabel()}}">{{dataItem.status}}</span>'
                },
                {
                    field: 'guestOsType',
                    title: '{{"image.ts.GUEST OS" | translate}}',
                    width: '15%'
                },
                {
                    field: 'size',
                    title: '{{"image.ts.SIZE" | translate}}',
                    width: '10%',
                    template: '<span>{{dataItem.size | size}}</span>'
                },
                {
                    field: 'format',
                    title: '{{"image.ts.FORMAT" | translate}}',
                    width: '10%'
                },
                {
                    field: 'uuid',
                    title: '{{"image.ts.UUID" | translate}}',
                    width: '20%'
                }
            ];

            this.options.dataSource.transport.read = (options)=> {
                var qobj = new ApiHeader.QueryObject();
                qobj.limit = options.data.take;
                qobj.start = options.data.pageSize * (options.data.page - 1);
                imageMgr.query(qobj, (images:Image[], total:number)=> {
                    options.success({
                        data: images,
                        total: total
                    });
                });
            };
        }
    }

    class Action {
        enable() {
            this.imageMgr.enable(this.$scope.model.current);
        }

        disable() {
            this.imageMgr.disable(this.$scope.model.current);
        }

        recover() {
            this.imageMgr.recover(this.$scope.model.current);
        }

        constructor(private $scope : any, private imageMgr : ImageManager) {
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
        static STATUS = 'status';
        static TYPE = 'mediaType';
        static FORMAT = 'format';

        constructor(private $scope : any, private hypervisorTypes: string[]) {
            this.fieldList = {
                dataSource: new kendo.data.DataSource({
                    data: [
                        {
                            name: '{{"image.ts.None" | translate}}',
                            value: FilterBy.NONE
                        },
                        {
                            name: '{{"image.ts.State" | translate}}',
                            value: FilterBy.STATE
                        },
                        {
                            name: '{{"image.ts.Status" | translate}}',
                            value: FilterBy.STATUS
                        },
                        {
                            name: '{{"image.ts.MediaType" | translate}}',
                            value: FilterBy.TYPE
                        },
                        {
                            name: '{{"image.ts.Format" | translate}}',
                            value: FilterBy.FORMAT
                        },

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
                } else if (this.field == FilterBy.STATUS) {
                    this.valueList.dataSource.data(['Creating', 'Downloading', 'Ready']);
                } else if (this.field == FilterBy.STATE) {
                    this.valueList.dataSource.data(['Enabled', 'Disabled']);
                } else if (this.field == FilterBy.FORMAT) {
                    this.valueList.dataSource.data('qcow2', 'raw', 'simulator');
                } else if (this.field == FilterBy.TYPE) {
                    this.valueList.dataSource.data(['RootVolumeTemplate', 'DataVolumeTemplate', 'ISO']);
                }
            });
        }

        confirm (popover : any) {
            this.$scope.oImageGrid.setFilter(this.toKendoFilter());
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
        static $inject = ['$scope', 'ImageManager', '$routeParams', 'Tag', 'current', 'BackupStorageManager'];

        private loadSelf(uuid : string) {
            var qobj = new ApiHeader.QueryObject();
            qobj.addCondition({name: 'uuid', op: '=', value: uuid});
            this.imageMgr.query(qobj, (images : Image[], total:number)=> {
                this.$scope.model.current = images[0];
            });
        }

        constructor(private $scope : any, private imageMgr : ImageManager, private $routeParams : any,
                    private tagService : Utils.Tag, current: Image, bsMgr: MBackupStorage.BackupStorageManager) {
            $scope.model = new ImageModel();
            $scope.model.current = current;

            $scope.funcDeleteImage = (win : any) => {
                win.open();
            };

            $scope.funcExpungeImage = (win : any) => {
                win.open();
            };

            $scope.action = new Action($scope, imageMgr);

            $scope.funcRefresh = ()=> {
                this.loadSelf($scope.model.current.uuid);
            };

            $scope.funcToolbarShow = ()=> {
                return Utils.notNullnotUndefined($scope.model.current);
            };

            $scope.optionsDeleteImage = {
                title: 'DELETE IMAGE',
                width: '350px',
                btnType: 'btn-danger',

                description: ()=> {
                    return $scope.model.current.name;
                },

                confirm: ()=> {
                    imageMgr.delete($scope.model.current, (ret : any)=> {
                        $scope.model.resetCurrent();
                    });
                }
            };

            $scope.optionsExpungeImage = {
                title: 'EXPUNGE IMAGE',
                width: '350px',
                btnType: 'btn-danger',

                description: ()=> {
                    return $scope.model.current.name;
                },

                confirm: ()=> {
                    imageMgr.expunge($scope.model.current, (ret : any)=> {
                        $scope.model.resetCurrent();
                    });
                }
            };

            $scope.optionsTag = {
                tags: [],
                createTag: (item)=> {
                    this.tagService.createTag(item.tag, $scope.model.current.uuid, ApiHeader.TagResourceTypeImageVO, (ret : ApiHeader.TagInventory)=> {
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
                        title: '{{"image.ts.BACKUP STORAGE NAME" | translate}}',
                        width: '20%',
                        template: '<a href="/\\#/backupStorage/{{dataItem.bsUuid}}">{{dataItem.name}}</a>'
                    },
                    {
                        field: 'installPath',
                        title: '{{"image.ts.INSTALL PATH" | translate}}',
                        width: '80%'
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
                            var chain = new Utils.Chain();
                            var bss = [];
                            var refs = [];
                            chain.then(()=>{
                                var bsUuids = [];
                                angular.forEach(current.backupStorageRefs, (it)=>{
                                    bsUuids.push(it.backupStorageUuid);
                                });

                                var qobj = new ApiHeader.QueryObject();
                                qobj.limit = options.data.take;
                                qobj.start = options.data.pageSize * (options.data.page-1);
                                qobj.addCondition({
                                    name: 'uuid',
                                    op: 'in',
                                    value: bsUuids.join()
                                });
                                bsMgr.query(qobj, (ret: MBackupStorage.BackupStorage[], total:number)=> {
                                    bss = ret;
                                    chain.next();
                                });
                            }).then(()=>{
                                angular.forEach(current.backupStorageRefs, (it)=>{
                                    for (var i=0; i<bss.length; i++) {
                                        if (it.backupStorageUuid == bss[i].uuid) {
                                            var bs = bss[i];
                                            break;
                                        }
                                    }

                                    refs.push({
                                        name: bs.name,
                                        bsUuid: bs.uuid,
                                        installPath: it.installPath
                                    })
                                });
                                chain.next();
                            }).done(()=>{
                                options.success({
                                    data: refs,
                                    total: refs.length
                                });
                            }).start();
                        }
                    }
                })
            };
        }
    }

    export class Controller {
        static $inject = ['$scope', 'ImageManager', 'hypervisorTypes', '$location'];

        constructor(private $scope : any, private imageMgr : ImageManager, private hypervisorTypes: string[], private $location : ng.ILocationService) {
            $scope.model = new ImageModel();
            $scope.oImageGrid = new OImageGrid($scope, imageMgr);
            $scope.action = new Action($scope, imageMgr);
            $scope.optionsSortBy = {
                fields: [
                    {
                        name: '{{"image.ts.Name" | translate}}',
                        value: 'name'
                    },
                    {
                        name: '{{"image.ts.Description" | translate}}',
                        value: 'Description'
                    },
                    {
                        name: '{{"image.ts.State" | translate}}',
                        value: 'state'
                    },
                    {
                        name: '{{"image.ts.Status" | translate}}',
                        value: 'status'
                    },
                    {
                        name: '{{"image.ts.Hypervisor" | translate}}',
                        value: 'hypervisorType'
                    },
                    {
                        name: '{{"image.ts.Bits" | translate}}',
                        value: 'bits'
                    },
                    {
                        name: '{{"image.ts.Format" | translate}}',
                        value: 'format'
                    },
                    {
                        name: '{{"image.ts.Size" | translate}}',
                        value: 'size'
                    },
                    {
                        name: '{{"image.ts.Guest OS Type" | translate}}',
                        value: 'guestOsType'
                    },
                    {
                        name: '{{"image.ts.Created Date" | translate}}',
                        value: 'createDate'
                    },
                    {
                        name: '{{"image.ts.None" | translate}}',
                        value: 'lastOpDate'
                    }
                ],

                done: (ret : Directive.SortByData) => {
                    imageMgr.setSortBy(ret);
                    $scope.oImageGrid.refresh();
                }
            };

            $scope.optionsSearch = {
                fields: ApiHeader.ImageInventoryQueryable,
                name: 'Image',
                schema: {
                    state: {
                        type: Directive.SearchBoxSchema.VALUE_TYPE_LIST,
                        list: ['Enabled', 'Disabled']
                    },
                    status: {
                        type: Directive.SearchBoxSchema.VALUE_TYPE_LIST,
                        list: ['Creating', 'Downloading', 'Ready']
                    },
                    hypervisorType: {
                        type: Directive.SearchBoxSchema.VALUE_TYPE_LIST,
                        list: this.hypervisorTypes
                    },
                    format: {
                        type: Directive.SearchBoxSchema.VALUE_TYPE_LIST,
                        list: ['Template', 'ISO']
                    },
                    bits: {
                        type: Directive.SearchBoxSchema.VALUE_TYPE_LIST,
                        list: ['64', '32']
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
                    imageMgr.query(qobj, (Images : Image[], total:number)=> {
                        $scope.oImageGrid.refresh(Images);
                    });
                }
            };

            $scope.funcGridDoubleClick = (e) => {
                if (Utils.notNullnotUndefined($scope.model.current)) {
                    var url = Utils.sprintf('/image/{0}', $scope.model.current.uuid);
                    $location.path(url);
                    e.preventDefault();
                }
            };

            $scope.filterBy = new FilterBy($scope, this.hypervisorTypes);

            $scope.funcSearch = (win : any) => {
                win.open();
            };

            $scope.funcCreateImage = (win : any) => {
                win.open();
            };

            $scope.funcDeleteImage = (win : any) => {
                win.open();
            };

            $scope.funcExpungeImage = (win : any) => {
                win.open();
            };

            $scope.optionsDeleteImage = {
                title: 'DELETE IMAGE',
                width: '350px',
                btnType: 'btn-danger',

                description: ()=> {
                    return $scope.model.current.name;
                },

                confirm: ()=> {
                    imageMgr.delete($scope.model.current, (ret : any)=> {
                        $scope.oImageGrid.deleteCurrent();
                    });
                }
            };

            $scope.optionsExpungeImage = {
                title: 'EXPUNGE IMAGE',
                width: '350px',
                btnType: 'btn-danger',

                description: ()=> {
                    return $scope.model.current.name;
                },

                confirm: ()=> {
                    imageMgr.expunge($scope.model.current, (ret : any)=> {
                        $scope.oImageGrid.deleteCurrent();
                    });
                }
            };

            $scope.funcRefresh = ()=> {
                $scope.oImageGrid.refresh();
            };

            $scope.funcIsActionShow = ()=> {
                return !Utils.isEmptyObject($scope.model.current);
            };

            $scope.funcIsActionDisabled = ()=> {
                return Utils.notNullnotUndefined($scope.model.current) && $scope.model.current.isInProgress();
            };

            $scope.optionsCreateImage = {
                done: (info : any) => {
                    var img = new Image();
                    info.uuid = Utils.uuid();
                    info.status = 'Downloading';
                    angular.extend(img, info);
                    $scope.oImageGrid.add(img);
                    imageMgr.create(info, (ret: Image)=>{
                        $scope.oImageGrid.refresh();
                    });
                }
            };
        }
    }

    export class CreateImageOptions {
        zone : MZone.Zone;
        done : (info:any)=>void;
    }


    export class CreateImageModel {
        name: string;
        description: string;
        url: string;
        hypervisorType: string;
        guestOsType: string;
        format: string;
        bits: number;
        backupStorageUuid: string;
        backupStorages: kendo.ui.DropDownListOptions;

        canCreate() : boolean {
            return angular.isDefined(this.name) && angular.isDefined(this.hypervisorType) &&
                    angular.isDefined(this.format) && Utils.notNullnotUndefined(this.backupStorageUuid);
        }
    }

    export class CreateImage implements ng.IDirective {
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
        options: CreateImageOptions;
        $scope: any;

        static MEDIA_TYPES = ['RootVolumeTemplate', 'DataVolumeTemplate', 'ISO'];
        static BITS = [64, 32];

        open() {
            var win = this.$scope.winCreateImage__;
            var chain = new Utils.Chain();
            this.$scope.backupStorageListOptions__.dataSource.data([]);
            this.$scope.formatOptions__.dataSource.data([]);
            this.$scope.button.reset();
            this.$scope.infoPage.mediaType = this.$scope.mediaTypeList__.value();
            this.$scope.infoPage.platform = this.$scope.platformList__.value();
            this.$scope.backupStorageList__.value([]);
            this.$scope.infoPage.backupStorageUuids = [];
            chain.then(()=> {
                var qobj = new ApiHeader.QueryObject();
                qobj.conditions = [
                    {
                        name: 'state',
                        op: '=',
                        value: 'Enabled'
                    },
                    {
                        name: 'status',
                        op: '=',
                        value: 'Connected'
                    }
                ];
                this.bsMgr.query(qobj, (bss: MBackupStorage.BackupStorage[])=>{
                    this.$scope.backupStorageListOptions__.dataSource.data(bss);

                    chain.next();
                });
            }).then(()=>{
                this.api.getVolumeFormats((formats: any[])=>{
                    var fs = [];
                    angular.forEach(formats, (it)=>{
                        fs.push(it.format);
                    });
                    this.$scope.formatOptions__.dataSource.data(fs);
                    if (formats.length > 0) {
                        this.$scope.infoPage.format = formats[0];
                    }
                    chain.next();
                });
            }).done(()=> {
                win.center();
                win.open();
            }).start();
        }

        constructor(private api : Utils.Api, private bsMgr : MBackupStorage.BackupStorageManager,
                    private imageMgr : ImageManager) {
            this.scope = true;
            this.link = ($scope : any, $element, $attrs : any, $ctrl, $transclude) => {
                var instanceName = $attrs.zCreateImage;
                var parentScope = $scope.$parent;
                parentScope[instanceName] = this;
                this.options = new CreateImageOptions();
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
                    url: null,
                    backupStorageUuids: [],
                    guestOsType: null,
                    format: null,
                    system: false,
                    platform: null,
                    mediaType: null,

                    hasBackup(): boolean {
                        return $scope.backupStorageListOptions__.dataSource.data().length > 0;
                    },

                    isUrlValid(): boolean {
                        if (Utils.notNullnotUndefined(this.url)) {
                            return this.url.indexOf('http') == 0 || this.url.indexOf('https') == 0 || this.url.indexOf('file') == 0;
                        }
                        return true;
                    },

                    canMoveToPrevious(): boolean {
                        return false;
                    },

                    canMoveToNext(): boolean {
                        return Utils.notNullnotUndefined(this.name)
                            && Utils.notNullnotUndefined(this.url)
                            && Utils.notNullnotUndefined(this.platform)
                            && Utils.notNullnotUndefined(this.mediaType)
                            && Utils.notNullnotUndefined(this.format) && this.backupStorageUuids.length > 0 && this.isUrlValid();
                    },

                    show(): void {
                        this.getAnchorElement().tab('show');
                    },

                    getAnchorElement() : any {
                        return $('.nav a[data-target="#createImageInfo"]');
                    },

                    active(): void {
                        this.activeState = true;
                    },

                    isActive(): boolean {
                        return this.activeState;
                    },

                    getPageName(): string {
                        return 'createImageInfo';
                    },

                    reset() : void {
                        this.name = Utils.shortHashName('image');
                        this.description = null;
                        this.url = null;
                        this.guestOsType = null;
                        this.format = null;
                        this.system = false;
                        this.backupStorageUuids = [];
                        this.activeState = false;
                        this.platform = null;
                        this.mediaType = null;
                    }
                } ;

                var mediator : Utils.WizardMediator = $scope.mediator = {
                    currentPage: infoPage,
                    movedToPage: (page: Utils.WizardPage) => {
                        $scope.mediator.currentPage = page;
                    },

                    finishButtonName: (): string =>{
                        return "Add";
                    },

                    finish: ()=> {
                        this.options.done(infoPage);
                        $scope.winCreateImage__.close();
                    }
                };

                $scope.button = new Utils.WizardButton([
                    infoPage
                ], mediator);

                $scope.winCreateImageOptions__ = {
                    width: '700px',
                    //height: '620px',
                    animation: false,
                    modal: true,
                    draggable: false,
                    resizable: false
                };

                $scope.formatOptions__ = {
                    dataSource: new kendo.data.DataSource([])
                };

                $scope.mediaTypeOptions__ = {
                    dataSource: CreateImage.MEDIA_TYPES
                };

                $scope.platformOptions__ = {
                    dataSource: new kendo.data.DataSource({
                        data:[
                            'Linux',
                            'Windows',
                            'WindowsVirtio',
                            'Other',
                            'Paravirtualization'
                        ]
                    })
                };

                $scope.bitsOptions__ = {
                    dataSource: new kendo.data.DataSource({
                        data: CreateImage.BITS
                    })
                };

                $scope.hypervisorOptions__ = {
                    dataSource: new kendo.data.DataSource({
                        data: []
                    })
                };

                $scope.backupStorageListOptions__ = {
                    dataSource: new kendo.data.DataSource({data: []}),
                    dataTextField: "name",
                    dataValueField: "uuid",
                    itemTemplate: '<div style="color: black"><span class="z-label">Name:</span><span>#: name #</span></div>' +
                        '<div style="color: black"><span class="z-label">Type:</span><span>#: type #</span></div>' +
                        '<div style="color: black"><span class="z-label">UUID:</span><span>#: uuid #</span></div>',

                    change: (e)=>{
                      Utils.safeApply($scope, ()=>{
                        var sender = e.sender;
                        var data = sender.dataItems();
                        $scope.infoPage.backupStorageUuids = [];
                        angular.forEach(data, (it)=>{
                          $scope.infoPage.backupStorageUuids.push(it.uuid);
                        });
                      });
                    }
                };

                this.$scope = $scope;
            };
            this.restrict = 'EA';
            this.replace = true;
            this.templateUrl = '/static/templates/image/addImage.html';
        }
    }
}

angular.module('root').factory('ImageManager', ['Api', '$rootScope', (api, $rootScope)=> {
    return new MImage.ImageManager(api, $rootScope);
}]).directive('zCreateImage', ['Api', 'BackupStorageManager', 'ImageManager', (api, bsMgr, imageMgr)=> {
    return new MImage.CreateImage(api, bsMgr, imageMgr);
}]).config(['$routeProvider', function(route) {
    route.when('/image', {
        templateUrl: '/static/templates/image/image.html',
        controller: 'MImage.Controller',
        resolve: {
            hypervisorTypes: function($q : ng.IQService, Api : Utils.Api) {
                var defer = $q.defer();
                Api.getHypervisorTypes((hypervisorTypes: string[])=> {
                    defer.resolve(hypervisorTypes);
                });
                return defer.promise;
            }
        }
    }).when('/image/:uuid', {
        templateUrl: '/static/templates/image/details.html',
        controller: 'MImage.DetailsController',
        resolve: {
            current: function($q : ng.IQService, $route: any, ImageManager: MImage.ImageManager) {
                var defer = $q.defer();
                var qobj = new ApiHeader.QueryObject();
                var uuid = $route.current.params.uuid;
                qobj.addCondition({name: 'uuid', op: '=', value: uuid});
                ImageManager.query(qobj, (images: MImage.Image[])=>{
                    var image = images[0];
                    defer.resolve(image);
                });
                return defer.promise;
            }
        }
    });
}]);

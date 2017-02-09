
/// <reference path="d.ts/angularjs/angular.d.ts" />
/// <reference path="d.ts/kendo.all.d.ts" />

module MVolume {
    export class VolumeSnapshot extends ApiHeader.VolumeSnapshotInventory {
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

        isRevertShow() {
            return Utils.notNullnotUndefined(this.volumeUuid) && this.status == 'Ready';
        }

        isBackupShow() {
            return Utils.notNullnotUndefined(this.primaryStorageUuid);
        }

        isDeleteFromBackupStorageShow() {
            return this.backupStorageRefs.length > 0;
        }

        statusLabel() : string {
            if (this.status == 'Ready') {
                return 'label label-success';
            } else if (this.status == 'NotInstantiated') {
                return 'label label-warning';
            } else {
                return 'label label-default';
            }
        }

        updateObservableObject(inv : ApiHeader.VolumeSnapshotInventory) {
            var self : any = this;
            self.set('uuid', inv.uuid);
            self.set('name', inv.name);
            self.set('description', inv.description);
            self.set('type', inv.type);
            self.set('volumeUuid', inv.volumeUuid);
            self.set('treeUuid', inv.treeUuid);
            self.set('format', inv.format);
            self.set('parentUuid', inv.parentUuid);
            self.set('primaryStorageUuid', inv.primaryStorageUuid);
            self.set('primaryStorageInstallPath', inv.primaryStorageInstallPath);
            self.set('volumeType', inv.volumeType);
            self.set('latest', inv.latest);
            self.set('size', inv.size);
            self.set('state', inv.state);
            self.set('status', inv.status);
            self.set('createDate', inv.createDate);
            self.set('lastOpDate', inv.lastOpDate);
            self.set('backupStorageRefs', inv.backupStorageRefs);
        }

        static wrap(obj: any) : any {
            var sp = new VolumeSnapshot();
            angular.extend(sp, obj);
            return new kendo.data.ObservableObject(sp);
        }
    }

    export class Volume extends ApiHeader.VolumeInventory {
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

        isDetachShow() : boolean {
            return this.type == 'Data' && Utils.notNullnotUndefined(this.vmInstanceUuid);
        }

        isAttachShow() : boolean {
            return this.type == 'Data' && this.state == 'Enabled' && this.status != 'Creating' && !this.isDetachShow();
        }

        isSnapshotShow() : boolean {
            return this.status == 'Ready';
        }

        isBackupShow() : boolean {
            return this.type == 'Data' && this.status == 'Ready';
        }

        isCreateTemplateShow() {
            return this.type == 'Root' && this.status == 'Ready';
        }

        isDeleteShow() {
            return this.type == 'Data' && this.status != 'Deleted' ;
        }

        isExpungeShow() {
            return this.status == 'Deleted' && this.type == 'Data';
        }

        isRecoverShow() {
            return this.status == 'Deleted' && this.type == 'Data';
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

        statusLabel() : string {
            if (this.status == 'Ready') {
                return 'label label-success';
            } else if (this.status == 'NotInstantiated') {
                return 'label label-warning';
            } else {
                return 'label label-default';
            }
        }

        updateObservableObject(inv : ApiHeader.VolumeInventory) {
            // self : ObservableObject
            var self : any = this;
            self.set('uuid', inv.uuid);
            self.set('name', inv.name);
            self.set('description', inv.description);
            self.set('primaryStorageUuid', inv.primaryStorageUuid);
            self.set('vmInstanceUuid', inv.vmInstanceUuid);
            self.set('diskOfferingUuid', inv.diskOfferingUuid);
            self.set('rootImageUuid', inv.rootImageUuid);
            self.set('installPath', inv.installPath);
            self.set('type', inv.type);
            self.set('status', inv.status);
            self.set('format', inv.format);
            self.set('size', inv.size);
            self.set('state', inv.state);
            self.set('createDate', inv.createDate);
            self.set('lastOpDate', inv.lastOpDate);
        }
    }

    export class VolumeManager {
        static $inject = ['Api', '$rootScope'];

        constructor(private api : Utils.Api, private $rootScope: ng.IRootScopeService) {
        }

        private sortBy : Directive.SortByData;

        setSortBy(sortBy : Directive.SortByData) {
            this.sortBy = sortBy;
        }

        private wrap(Volume : Volume) : any {
            return new kendo.data.ObservableObject(Volume);
        }

        backup(volume: Volume, bsUuid: string, done:()=>void) {
            var msg = new ApiHeader.APIBackupDataVolumeMsg();
            msg.backupStorageUuid = bsUuid;
            msg.uuid = volume.uuid;
            this.api.asyncApi(msg, (ret: ApiHeader.APIBackupDataVolumeEvent)=>{
                volume.updateObservableObject(ret.inventory);
                volume.progressOff();
                if (Utils.notNullnotUndefined(done)) {
                    done();
                }

                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Backup Data Volume: {0}',volume.name),
                    link: Utils.sprintf('/#/volume/{0}', volume.uuid)
                });
            });
        }

        create(volume : any, done : (ret : Volume)=>void) {
            var msg : any = new ApiHeader.APICreateDataVolumeMsg();
            msg.name = volume.name;
            msg.description = volume.description;
            msg.diskOfferingUuid = volume.diskOfferingUuid;
            this.api.asyncApi(msg, (ret : ApiHeader.APICreateDataVolumeEvent)=> {
                var c = new Volume();
                angular.extend(c, ret.inventory);
                done(this.wrap(c));
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Created new Data Volume: {0}',c.name),
                    link: Utils.sprintf('/#/volume/{0}', c.uuid)
                });
            });
        }

        query(qobj : ApiHeader.QueryObject, callback : (volumes : Volume[], total: number) => void) : void {
            var msg = new ApiHeader.APIQueryVolumeMsg();
            msg.count = qobj.count === true;
            msg.start = qobj.start;
            msg.limit = qobj.limit;
            msg.replyWithCount = true;
            msg.conditions = qobj.conditions ? qobj.conditions : [];
            if (Utils.notNullnotUndefined(this.sortBy) && this.sortBy.isValid()) {
                msg.sortBy = this.sortBy.field;
                msg.sortDirection = this.sortBy.direction;
            }
            this.api.syncApi(msg, (ret : ApiHeader.APIQueryVolumeReply)=>{
                var pris = [];
                ret.inventories.forEach((inv : ApiHeader.VolumeInventory)=> {
                    var c = new Volume();
                    angular.extend(c, inv);
                    pris.push(this.wrap(c));
                });
                callback(pris, ret.total);
            });
        }

        disable(volume : Volume) {
            volume.progressOn();
            var msg = new ApiHeader.APIChangeVolumeStateMsg();
            msg.stateEvent = 'disable';
            msg.uuid = volume.uuid;
            this.api.asyncApi(msg, (ret : ApiHeader.APIChangeVolumeStateEvent) => {
                volume.updateObservableObject(ret.inventory);
                volume.progressOff();
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Disabled Data Volume: {0}',volume.name),
                    link: Utils.sprintf('/#/volume/{0}', volume.uuid)
                });
            });
        }

        enable(volume : Volume) {
            volume.progressOn();
            var msg = new ApiHeader.APIChangeVolumeStateMsg();
            msg.stateEvent = 'enable';
            msg.uuid = volume.uuid;
            this.api.asyncApi(msg, (ret : ApiHeader.APIChangeVolumeStateEvent) => {
                volume.updateObservableObject(ret.inventory);
                volume.progressOff();
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Enabled Data Volume: {0}', volume.name),
                    link: Utils.sprintf('/#/volume/{0}', volume.uuid)
                });
            });
        }

        attach(volume: Volume, vmUuid: string, done:()=>void) {
            volume.progressOn();
            var msg = new ApiHeader.APIAttachDataVolumeToVmMsg();
            msg.vmInstanceUuid = vmUuid;
            msg.volumeUuid = volume.uuid;
            this.api.asyncApi(msg, (ret: ApiHeader.APIAttachDataVolumeToVmEvent)=> {
                volume.progressOff();
                volume.updateObservableObject(ret.inventory);
                if (Utils.notNullnotUndefined(done)) {
                    done();
                }

                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Attached Data Volume: {0}', volume.name),
                    link: Utils.sprintf('/#/volume/{0}', volume.uuid)
                });
            });
        }

        detach(volume: Volume, done:()=>void) {
            volume.progressOn();
            var msg = new ApiHeader.APIDetachDataVolumeFromVmMsg();
            msg.uuid = volume.uuid;
            this.api.asyncApi(msg, (ret: ApiHeader.APIAttachDataVolumeToVmEvent)=> {
                volume.progressOff();
                volume.updateObservableObject(ret.inventory);
                if (Utils.notNullnotUndefined(done)) {
                    done();
                }

                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Detached Data Volume: {0}', volume.name),
                    link: Utils.sprintf('/#/volume/{0}', volume.uuid)
                });
            });
        }

        delete(volume : Volume, done : (ret : any)=>void) {
            volume.progressOn();
            var msg = new ApiHeader.APIDeleteDataVolumeMsg();
            msg.uuid = volume.uuid;
            this.api.asyncApi(msg, (ret : any)=> {
                volume.progressOff();
                done(ret);
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Deleted Data Volume: {0}', volume.name)
                });
            });
        }

        expunge(volume : Volume, done : (ret : any)=>void) {
            volume.progressOn();
            var msg = new ApiHeader.APIExpungeDataVolumeMsg();
            msg.uuid = volume.uuid;
            this.api.asyncApi(msg, (ret : any)=> {
                volume.progressOff();
                done(ret);
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Expunged Data Volume: {0}', volume.name)
                });
            });
        }

        recover(volume : Volume) {
            volume.progressOn();
            var msg = new ApiHeader.APIRecoverDataVolumeMsg();
            msg.uuid = volume.uuid;
            this.api.asyncApi(msg, (ret : ApiHeader.APIRecoverDataVolumeEvent) => {
                volume.updateObservableObject(ret.inventory);
                volume.progressOff();
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Recovered Data Volume: {0}', volume.name),
                    link: Utils.sprintf('/#/volume/{0}', volume.uuid)
                });
            });
        }

        takeSnapshot(volume : Volume, snapshot: any, done: (ret : any)=>void) {
            volume.progressOn();
            var msg = new ApiHeader.APICreateVolumeSnapshotMsg();
            msg.name = snapshot.name;
            msg.description = snapshot.description;
            msg.volumeUuid = volume.uuid;
            this.api.asyncApi(msg, (ret: ApiHeader.APICreateVolumeSnapshotEvent)=> {
                volume.progressOff();
                var sp = VolumeSnapshot.wrap(ret.inventory);
                if (Utils.notNullnotUndefined(done)) {
                    done(sp);
                }

                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Create snapshot from volume: {0}', volume.name),
                    link: Utils.sprintf('/#/volume/{0}', volume.uuid)
                });
            });
        }

        createTemplate(volume: Volume, info: any, done: ()=>void) {
            volume.progressOn();
            var msg = new ApiHeader.APICreateRootVolumeTemplateFromRootVolumeMsg();
            msg.name = info.name;
            if (Utils.notNullnotUndefined(info.backupStorageUuid)) {
                msg.backupStorageUuids = [info.backupStorageUuid];
            }
            msg.description = info.description;
            msg.guestOsType = info.guestOsType;
            msg.platform = info.platform;
            msg.rootVolumeUuid = volume.uuid;
            this.api.asyncApi(msg, (ret: ApiHeader.APICreateRootVolumeTemplateFromRootVolumeEvent)=> {
                volume.progressOff();
                if (Utils.notNullnotUndefined(done)) {
                    done();
                }

                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Create template from root volume: {0}', volume.name),
                    link: Utils.sprintf('/#/image/{0}', ret.inventory.uuid)
                });
            });
        }

        querySnapshotTree(qobj: ApiHeader.QueryObject, done: (ret: ApiHeader.VolumeSnapshotTreeInventory[])=>void) {
            var msg = new ApiHeader.APIQueryVolumeSnapshotTreeMsg();
            msg.count = qobj.count === true;
            msg.start = qobj.start;
            msg.limit = qobj.limit;
            msg.replyWithCount = true;
            msg.conditions = qobj.conditions ? qobj.conditions : [];
            this.api.syncApi(msg, (ret: ApiHeader.APIQueryVolumeSnapshotTreeReply)=>{
                done(ret.inventories);
            });
        }
    }

    export class VolumeModel extends Utils.Model {
        constructor() {
            super();
            this.current = new Volume();
        }
    }

    export class SnapshotManager {
        queryTree(qobj: ApiHeader.QueryObject, done: (strees: ApiHeader.VolumeSnapshotTreeInventory[])=>void) {
            var msg = new ApiHeader.APIQueryVolumeSnapshotTreeMsg();
            msg.count = qobj.count === true;
            msg.start = qobj.start;
            msg.limit = qobj.limit;
            msg.replyWithCount = true;
            msg.conditions = qobj.conditions ? qobj.conditions : [];
            this.api.syncApi(msg, (ret : ApiHeader.APIQueryVolumeSnapshotTreeReply)=>{
                done(ret.inventories);
            });
        }

        query(qobj : ApiHeader.QueryObject, callback : (sps : VolumeSnapshot[], total: number) => void) : void {
            var msg = new ApiHeader.APIQueryVolumeSnapshotMsg();
            msg.count = qobj.count === true;
            msg.start = qobj.start;
            msg.limit = qobj.limit;
            msg.replyWithCount = true;
            msg.conditions = qobj.conditions ? qobj.conditions : [];
            this.api.syncApi(msg, (ret : ApiHeader.APIQueryVolumeSnapshotReply)=>{
                var pris = [];
                ret.inventories.forEach((inv : ApiHeader.VolumeSnapshotInventory)=> {
                    pris.push(VolumeSnapshot.wrap(inv));
                });
                callback(pris, ret.total);
            });
        }

        delete(sp : ApiHeader.VolumeSnapshotInventory, done: ()=>void) {
            var msg = new ApiHeader.APIDeleteVolumeSnapshotMsg();
            msg.uuid = sp.uuid;
            this.api.asyncApi(msg, (ret : ApiHeader.APIDeleteVolumeSnapshotEvent)=>{
                if (Utils.notNullnotUndefined(done)) {
                    done();
                }
            });
        }

        revert(sp: VolumeSnapshot, done: ()=>void) {
            var msg = new ApiHeader.APIRevertVolumeFromSnapshotMsg();
            msg.uuid = sp.uuid;
            this.api.asyncApi(msg, (ret: ApiHeader.APIRevertVolumeFromSnapshotEvent)=>{
                if (Utils.notNullnotUndefined(done)) {
                    done();
                }

                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Reverted volume: {0} to a snapshot', sp.volumeUuid),
                    link: Utils.sprintf('/#/volume/{0}', sp.volumeUuid)
                });
            });
        }

        backup(sp: VolumeSnapshot, bsUuid: string, done: ()=>void) {
            var msg = new ApiHeader.APIBackupVolumeSnapshotMsg();
            msg.backupStorageUuid = bsUuid;
            msg.uuid = sp.uuid;
            this.api.asyncApi(msg, (ret: ApiHeader.APIBackupVolumeSnapshotEvent)=>{
                sp.updateObservableObject(ret.inventory);
                if (Utils.notNullnotUndefined(done)) {
                    done();
                }

                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Backup volume snapshot: {0} to a backup storage', sp.uuid)
                });
            });
        }

        deleteFromBackupStorage(sp: VolumeSnapshot, bsUuid: string, done:()=>void) {
            var msg = new ApiHeader.APIDeleteVolumeSnapshotFromBackupStorageMsg();
            msg.backupStorageUuids = [bsUuid];
            msg.uuid = sp.uuid;
            this.api.asyncApi(msg, (ret: ApiHeader.APIDeleteVolumeSnapshotFromBackupStorageEvent)=>{
                sp.updateObservableObject(ret.inventory);
                if (Utils.notNullnotUndefined(done)) {
                    done();
                }

                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    msg: Utils.sprintf('Deleted volume snapshot: {0} to a backup storage', sp.uuid)
                });
            });
        }

        constructor(private api : Utils.Api, private $rootScope: ng.IRootScopeService) {
        }
    }

    class OVolumeGrid extends Utils.OGrid {
        constructor($scope: any, private volumeMgr : VolumeManager) {
            super();
            super.init($scope, $scope.volumeGrid);
            this.options.columns = [
                {
                    field: 'name',
                    title: '{{"volume.ts.NAME" | translate}}',
                    width: '10%',
                    template: '<a href="/\\#/volume/{{dataItem.uuid}}">{{dataItem.name}}</a>'
                },
                {
                    field: 'hypervisorType',
                    title: '{{"volume.ts.HYPERVISOR" | translate}}',
                    width: '10%'
                },
                {
                    field: 'type',
                    title: '{{"volume.ts.TYPE" | translate}}',
                    width: '10%'
                },
                {
                    field: 'state',
                    title: '{{"volume.ts.STATE" | translate}}',
                    width: '15%',
                    template: '<span class="{{dataItem.stateLabel()}}">{{dataItem.state}}</span>'
                },
                {
                    field: 'status',
                    title: '{{"volume.ts.STATUS" | translate}}',
                    width: '15%',
                    template: '<span class="{{dataItem.statusLabel()}}">{{dataItem.status}}</span>'
                },
                {
                    field: 'vmInstanceUuid',
                    title: 'VM INSTANCE UUID',
                    width: '20%',
                    template: '<a href="/\\#/vmInstance/{{dataItem.vmInstanceUuid}}">{{dataItem.vmInstanceUuid}}</a>'
                },
                {
                    field: 'uuid',
                    title: 'UUID',
                    width: '20%'
                }
            ];

            this.options.dataSource.transport.read = (options)=> {
                var qobj = new ApiHeader.QueryObject();
                qobj.limit = options.data.take;
                qobj.start = options.data.pageSize * (options.data.page - 1);
                volumeMgr.query(qobj, (volumes:Volume[], total:number)=> {
                    options.success({
                        data: volumes,
                        total: total
                    });
                });
            };
        }
    }

    class Action {
        enable() {
            this.volumeMgr.enable(this.$scope.model.current);
        }

        disable() {
            this.volumeMgr.disable(this.$scope.model.current);
        }

        recover() {
            this.volumeMgr.recover(this.$scope.model.current);
        }

        attach() {
            this.$scope.attachVm.open();
        }

        detach() {
            this.$scope.detachVm.open();
        }

        takeSnapshot() {
            this.$scope.takeSnapshot.open();
        }

        backup() {
            this.$scope.backupDataVolumeWin.open();
        }

        createTemplate() {
            this.$scope.createTemplateWin.open();
        }

        constructor(private $scope : any, private volumeMgr : VolumeManager) {
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
        static TYPE = 'type';
        static HYPERVISOR = 'hypervisorType';

        constructor(private $scope : any, private hypervisorTypes: string[]) {
            this.fieldList = {
                dataSource: new kendo.data.DataSource({
                    data: [
                        {
                            name: '{{"volume.ts.None" | translate}}',
                            value: FilterBy.NONE
                        },
                        {
                            name: '{{"volume.ts.State" | translate}}',
                            value: FilterBy.STATE
                        },
                        {
                            name: '{{"volume.ts.Status" | translate}}',
                            value: FilterBy.STATUS
                        },
                        {
                            name: '{{"volume.ts.Type" | translate}}',
                            value: FilterBy.TYPE
                        },
                        {
                            name: '{{"volume.ts.HypervisorType" | translate}}',
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
                } else if (this.field == FilterBy.STATUS) {
                    this.valueList.dataSource.data(['Creating', 'Ready', 'NotInstantiated']);
                } else if (this.field == FilterBy.STATE) {
                    this.valueList.dataSource.data(['Enabled', 'Disabled']);
                } else if (this.field == FilterBy.HYPERVISOR) {
                    this.valueList.dataSource.data(this.hypervisorTypes);
                } else if (this.field == FilterBy.TYPE) {
                    this.valueList.dataSource.data(['Root', 'Data']);
                }
            });
        }

        confirm (popover : any) {
            this.$scope.oVolumeGrid.setFilter(this.toKendoFilter());
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

    class SnapshotAction {
        revert() {
            this.$scope.revertSnapshot.open();
        }

        delete()  {
            this.$scope.deleteSnapshotWin.open();
        }

        backup() {
            this.$scope.backupSnapshotWin.open();
        }

        deleteFromBackupStorage() {
            this.$scope.deleteSnapshotFromBackupStorageWin.open();
        }

        constructor(private $scope : any, private spMgr : SnapshotManager) {
        }
    }

    export class SnapshotDetailsController {
        static $inject = ['$scope', 'SnapshotManager', '$routeParams', 'Tag', 'current', 'VmInstanceManager', 'BackupStorageManager'];

        private marshalBackupStorage(sp: VolumeSnapshot) {
            if (sp.backupStorageRefs.length == 0) {
                if (Utils.notNullnotUndefined(this.$scope.optionsBackupStorageGrid)) {
                    this.$scope.optionsBackupStorageGrid.dataSource.data([]);
                }
                return;
            }

            var bsUuids = [];
            angular.forEach(sp.backupStorageRefs, (it)=>{
                bsUuids.push(it.backupStorageUuid);
            });

            var qobj  = new ApiHeader.QueryObject();
            qobj.conditions = [{
                name: 'uuid',
                op: 'in',
                value: bsUuids.join()
            }];

            this.bsMgr.query(qobj, (bss: MBackupStorage.BackupStorage[])=>{
                var bsMap = {};
                angular.forEach(bss, (it)=>{
                    bsMap[it.uuid] = it;
                });

                var bsRef = [];
                angular.forEach(sp.backupStorageRefs, (it)=>{
                    var bs = bsMap[it.backupStorageUuid];
                    bsRef.push({
                        uuid: it.backupStorageUuid,
                        name: bs.name,
                        installPath: it.installPath
                    });
                });

                this.$scope.optionsBackupStorageGrid.dataSource.data(bsRef);
            });
        }

        private loadSelf(uuid : string) {
            var qobj = new ApiHeader.QueryObject();
            qobj.addCondition({name: 'uuid', op: '=', value: uuid});
            this.spMgr.query(qobj, (sps : VolumeSnapshot[], total:number)=> {
                this.$scope.model.current = sps[0];
                this.marshalBackupStorage(sps[0]);
            });
        }

        constructor(private $scope : any, private spMgr : SnapshotManager, private $routeParams : any,
                    private tagService : Utils.Tag, current: any, vmMgr: MVmInstance.VmInstanceManager,
                    private bsMgr: MBackupStorage.BackupStorageManager) {
            $scope.model = new VolumeModel();
            $scope.model.current = current;

            this.marshalBackupStorage(current);

            $scope.funcDelete = (win : any) => {
                win.open();
            };

            $scope.action = new SnapshotAction($scope, spMgr);

            $scope.funcRefresh = ()=> {
                this.loadSelf($scope.model.current.uuid);
            };

            $scope.funcToolbarShow = ()=> {
                return Utils.notNullnotUndefined($scope.model.current);
            };

            $scope.optionsDeleteSnapshot = {
                title: 'DELETE VOLUME SNAPSHOT',
                description: "All descendants of this snapshot will be deleted as well",
                confirm: ()=> {
                    spMgr.delete($scope.model.current, ()=> {
                        $scope.model.resetCurrent();
                    });
                }
            };

            $scope.optionsTag = {
                tags: [],
                createTag: (item)=> {
                    this.tagService.createTag(item.tag, $scope.model.current.uuid, ApiHeader.TagResourceTypeVolumeVO, (ret : ApiHeader.TagInventory)=> {
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

            $scope.optionsRevertSnapshot = {
                snapshot: current,
                done: ()=>{
                    this.loadSelf(current.uuid);
                }
            };

            $scope.optionsBackupSnapshot = {
                snapshot: current,
                done: ()=>{
                    this.loadSelf(current.uuid);
                }
            };

            $scope.optionsDeleteSnapshotFromBackupStorage = {
                snapshot: current,
                done: ()=>{
                    this.loadSelf(current.uuid);
                }
            };

            $scope.optionsBackupStorageGrid = {
                pageSize: 20,
                resizable: true,
                scrollable: true,
                pageable: true,
                columns: [
                    {
                        field: 'name',
                        title: '{{"volume.ts.BACKUP STORAGE NAME" | translate}}',
                        width: '20%',
                        template: '<a href="/\\#/backupStorage/{{dataItem.uuid}}">{{dataItem.name}}</a>'
                    },
                    {
                        field: 'installPath',
                        title: '{{"volume.ts.INSTALL PATH" | translate}}',
                        width: '80%'
                    },
                ],

                dataBound: (e)=> {
                    var grid = e.sender;
                    if (grid.dataSource.totalPages() == 1) {
                        grid.pager.element.hide();
                    }
                },

                dataSource: new kendo.data.DataSource([])
            };
        }
    }

    export class DetailsController {
        static $inject = ['$scope', 'VolumeManager', '$routeParams', 'Tag', 'current', 'VmInstanceManager', 'SnapshotManager', 'BackupStorageManager'];

        private loadSelf(uuid : string) {
            var qobj = new ApiHeader.QueryObject();
            qobj.addCondition({name: 'uuid', op: '=', value: uuid});
            this.volumeMgr.query(qobj, (volumes : Volume[], total:number)=> {
                this.$scope.model.current = volumes[0];
            });
        }

        private reloadSnapshot(volUuid: string) {
            var qobj = new ApiHeader.QueryObject();
            qobj.addCondition({name: 'volumeUuid', op: '=', value: volUuid});
            this.spMgr.queryTree(qobj, (trees: ApiHeader.VolumeSnapshotTreeInventory[])=>{
                this.buildSnapshotTree(trees);
            });
        }

        private buildSnapshotTree(trees: ApiHeader.VolumeSnapshotTreeInventory[]) {
            var treeToItems = (leaf: ApiHeader.SnapshotLeafInventory) : any => {
                var ret = {};
                ret['text'] = leaf.inventory.name;
                ret['inventory'] = VolumeSnapshot.wrap(leaf.inventory);
                ret['notChain'] = true;
                if (leaf.children.length > 0) {
                    ret['items'] = [];
                    angular.forEach(leaf.children, (it)=>{
                        ret['items'].push(treeToItems(it));
                    });
                }
                return ret;
            };

            var strees = [];
            angular.forEach(trees, (it)=>{
                strees.push({
                    text: it.current ? 'TREE-' + it.uuid + ' (CURRENT)' : 'TREE-' + it.uuid,
                    items: [
                        treeToItems(it.tree)
                    ]
                });
            });

            this.$scope.optionsSnapshotTree.dataSource.data(strees);
        }

        constructor(private $scope : any, private volumeMgr : VolumeManager, private $routeParams : any,
                    private tagService : Utils.Tag, vol: any, vmMgr: MVmInstance.VmInstanceManager,
                    private spMgr: SnapshotManager, private bsMgr: MBackupStorage.BackupStorageManager) {
            $scope.model = new VolumeModel();
            var current : Volume = vol.volume;
            $scope.model.current = current;

            $scope.funcDelete = (win : any) => {
                win.open();
            };

            $scope.action = new Action($scope, volumeMgr);

            $scope.funcRefresh = ()=> {
                this.loadSelf($scope.model.current.uuid);
            };

            $scope.funcToolbarShow = ()=> {
                return Utils.notNullnotUndefined($scope.model.current);
            };

            $scope.funcDeleteVolume = () => {
                $scope.deleteVolume.open();
            };

            $scope.funcExpungeVolume = (e) => {
                e.open();
            };


            $scope.optionsDeleteVolume = {
                title: 'DELETE VOLUME',
                description: ()=> {
                    return Utils.sprintf("The volume[{0}] will be detached from vm if attached. Confirm delete?", $scope.model.current.name);
                },
                btnType: 'btn-danger',

                confirm: ()=> {
                    volumeMgr.delete($scope.model.current, (ret : any)=> {
                        $scope.model.resetCurrent();
                    });
                }
            };

            $scope.optionsExpungeVolume = {
                title: 'EXPUNGE VOLUME',
                btnType: 'btn-danger',

                confirm: ()=> {
                    volumeMgr.expunge($scope.model.current, (ret : any)=> {
                        $scope.model.resetCurrent();
                    });
                }
            };

            $scope.optionsDeleteSnapshot = {
                title: 'DELETE VOLUME SNAPSHOT',
                description: "All descendants of this snapshot will be deleted as well",
                confirm: ()=> {
                    spMgr.delete($scope.model.snapshot, ()=>{
                        this.reloadSnapshot(current.uuid);
                        $scope.model.snapshot = null;
                    });
                }
            };


            $scope.deleteSnapshot = (sp: ApiHeader.VolumeSnapshotInventory) => {
                $scope.model.snapshot = sp;
                $scope.deleteSnapshotWin.open();
            };

            $scope.optionsTag = {
                tags: [],
                createTag: (item)=> {
                    this.tagService.createTag(item.tag, $scope.model.current.uuid, ApiHeader.TagResourceTypeVolumeVO, (ret : ApiHeader.TagInventory)=> {
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

            $scope.optionsAttachVm = {
                volume: current
            };

            $scope.optionsDetachVm = {
                volume: current
            };

            $scope.optionsTakeSnapshot = {
                volume: current,
                done: (sp: VolumeSnapshot)=> {
                    this.reloadSnapshot(sp.volumeUuid);
                }
            };

            $scope.optionsRevertSnapshot = {
                snapshot: null,
                done: ()=>{
                    this.loadSelf(current.uuid);
                }
            };

            $scope.revertToSnapshot = (sp: VolumeSnapshot) => {
                $scope.optionsRevertSnapshot.snapshot = sp;
                $scope.revertSnapshot.open();
            };


            $scope.optionsBackupSnapshot = {
                snapshot: null
            };

            $scope.backupSnapshot = (sp: VolumeSnapshot) => {
                $scope.optionsBackupSnapshot.snapshot = sp;
                $scope.backupSnapshotWin.open();
            };

            $scope.optionsDeleteSnapshotFromBackupStorage = {
                snapshot: null
            };

            $scope.deleteSnapshotFromBackupStorage = (sp: VolumeSnapshot) => {
                $scope.optionsDeleteSnapshotFromBackupStorage.snapshot= sp;
                $scope.deleteSnapshotFromBackupStorageWin.open();
            };

            $scope.optionsSnapshotTree = {
                template: '#: item.text #' +
                    '<div class="btn-group" ng-show="dataItem.notChain == true">' +
                    '<button type="button" class="btn btn-xs dropdown-toggle" data-toggle="dropdown">' +
                    '<span class="caret"></span>' +
                    '</button>' +
                    '<ul class="dropdown-menu" role="menu">' +
                    '<li><a href="/\\#/volumeSnapshot/{{dataItem.inventory.uuid}}">{{"volume.ts.See details" | translate}}</a></li>' +
                    '<li><a href ng-click="revertToSnapshot(dataItem.inventory)" ng-show="dataItem.inventory.isRevertShow()">{{"volume.ts.Revert volume to this snapshot" | translate}}</a></li>' +
                    '<li><a href ng-click="backupSnapshot(dataItem.inventory)" ng-show="dataItem.inventory.isBackupShow()">{{"volume.ts.Backup" | translate}}</a></li>' +
                    '<li><a href ng-click="deleteSnapshotFromBackupStorage(dataItem.inventory)" ng-show="dataItem.inventory.isDeleteFromBackupStorageShow()">{{"volume.ts.Delete From Backup Storage" | translate}}</a></li>' +
                    '<li><a href style="color:red" ng-click="deleteSnapshot(dataItem.inventory)">{{"volume.ts.Delete" | translate}}</a></li>' +
                    '</ul>' +
                    '</div>',

                dataSource: new kendo.data.HierarchicalDataSource({
                    data: []
                })
            };

            if (vol.snapshotTree.length > 0) {
                this.buildSnapshotTree(vol.snapshotTree);
            }

            $scope.optionsCreateTemplate = {
                volume: current
            };

            $scope.optionsBackupDataVolume = {
                volume: current,
                done: ()=> {
                    this.loadSelf(current.uuid)
                }
            };
        }
    }

    export class Controller {
        static $inject = ['$scope', 'VolumeManager', 'hypervisorTypes', '$location'];

        constructor(private $scope : any, private volumeMgr : VolumeManager, private hypervisorTypes: string[], private $location : ng.ILocationService) {
            $scope.model = new VolumeModel();
            $scope.oVolumeGrid = new OVolumeGrid($scope, volumeMgr);
            $scope.action = new Action($scope, volumeMgr);
            $scope.optionsSortBy = {
                fields: [
                    {
                        name: '{{"volume.ts.Name" | translate}}',
                        value: 'name'
                    },
                    {
                        name: '{{"volume.ts.Description" | translate}}',
                        value: 'description'
                    },
                    {
                        name: '{{"volume.ts.State" | translate}}',
                        value: 'state'
                    },
                    {
                        name: '{{"volume.ts.Status" | translate}}',
                        value: 'status'
                    },
                    {
                        name: '{{"volume.ts.Type" | translate}}',
                        value: 'type'
                    },
                    {
                        name: '{{"volume.ts.Format" | translate}}',
                        value: 'format'
                    },
                    {
                        name: '{{"volume.ts.Created Date" | translate}}',
                        value: 'createDate'
                    },
                    {
                        name: '{{"volume.ts.Last Updated Date" | translate}}',
                        value: 'lastOpDate'
                    }
                ],

                done: (ret : Directive.SortByData) => {
                    volumeMgr.setSortBy(ret);
                    $scope.oVolumeGrid.refresh();
                }
            };

            $scope.optionsSearch = {
                fields: ApiHeader.VolumeInventoryQueryable,
                name: 'Volume',
                schema: {
                    state: {
                        type: Directive.SearchBoxSchema.VALUE_TYPE_LIST,
                        list: ['Enabled', 'Disabled']
                    },
                    status: {
                        type: Directive.SearchBoxSchema.VALUE_TYPE_LIST,
                        list: ['Connecting', 'Connected', 'Disconnected']
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
                    volumeMgr.query(qobj, (Volumes : Volume[], total:number)=> {
                        $scope.oVolumeGrid.refresh(Volumes);
                    });
                }
            };

            $scope.funcGridDoubleClick = (e) => {
                if (Utils.notNullnotUndefined($scope.model.current)) {
                    var url = Utils.sprintf('/volume/{0}', $scope.model.current.uuid);
                    $location.path(url);
                    e.preventDefault();
                }
            };

            $scope.filterBy = new FilterBy($scope, this.hypervisorTypes);

            $scope.funcSearch = (win : any) => {
                win.open();
            };

            $scope.funcCreateVolume = (win : any) => {
                win.open();
            };

            $scope.funcDeleteVolume = () => {
                $scope.deleteVolume.open();
            };

            $scope.funcExpungeVolume = (e) => {
                e.open();
            };

            $scope.optionsDeleteVolume = {
                title: 'DELETE DATA VOLUME',
                description: ()=> {
                    return Utils.sprintf("The volume[{0}] will be detached from vm if attached. Confirm delete?", $scope.model.current.name);
                },
                btnType: 'btn-danger',

                confirm: ()=> {
                    volumeMgr.delete($scope.model.current, (ret : any)=> {
                        $scope.oVolumeGrid.deleteCurrent();
                    });
                }
            };

            $scope.optionsExpungeVolume = {
                title: 'EXPUNGE DATA VOLUME',
                btnType: 'btn-danger',

                confirm: ()=> {
                    volumeMgr.expunge($scope.model.current, (ret : any)=> {
                        $scope.oVolumeGrid.deleteCurrent();
                    });
                }
            };

            $scope.funcRefresh = ()=> {
                $scope.oVolumeGrid.refresh();
            };

            $scope.funcIsActionShow = ()=> {
                return !Utils.isEmptyObject($scope.model.current);
            };

            $scope.funcIsActionDisabled = ()=> {
                return Utils.notNullnotUndefined($scope.model.current) && $scope.model.current.isInProgress();
            };

            $scope.optionsCreateVolume = {
                done: (volume : Volume) => {
                    $scope.oVolumeGrid.add(volume);
                }
            };

            $scope.optionsAttachVm = {
                volume: null
            };

            $scope.optionsDetachVm = {
                volume: null
            };

            $scope.optionsTakeSnapshot = {
                volume: null
            };

            $scope.optionsBackupDataVolume = {
                volume: null
            };

            $scope.optionsCreateTemplate = {
                volume: null
            };

            $scope.$watch(()=>{
                return $scope.model.current;
            }, ()=>{
                if (Utils.notNullnotUndefined($scope.model.current)) {
                    $scope.optionsAttachVm.volume = $scope.model.current;
                    $scope.optionsDetachVm.volume = $scope.model.current;
                    $scope.optionsTakeSnapshot.volume = $scope.model.current;
                    $scope.optionsBackupDataVolume.volume = $scope.model.current;
                    $scope.optionsCreateTemplate.volume = $scope.model.current;
                }
            });

        }
    }


    export class CreateVolume implements ng.IDirective {
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
            var win = this.$scope.winCreateVolume__;
            var chain = new Utils.Chain();
            this.$scope.diskOfferingOptions__.dataSource.data([]);
            this.$scope.button.reset();
            chain.then(()=> {
                var qobj = new ApiHeader.QueryObject();
                this.diskOfferingMgr.query(qobj, (dss: ApiHeader.DiskOfferingInventory[], total:number)=>{
                    this.$scope.diskOfferingOptions__.dataSource.data(dss);
                    if (dss.length > 0) {
                        this.$scope.infoPage.diskOfferingUuid = dss[0].uuid;
                    }
                    chain.next();
                });
            }).then(()=> {
                var qobj = new ApiHeader.QueryObject();
                qobj.conditions = [
                    {
                        name: 'state',
                        op: 'in',
                        value: ['Running', 'Stopped'].join()
                    }
                ];
                this.vmMgr.query(qobj, (vms: ApiHeader.VmInstanceInventory[])=>{
                    this.$scope.vmOptions__.dataSource.data(vms);
                    this.$scope.attachPage.vmInstanceUuid = null;
                    chain.next();
                });
            }).done(()=> {
                win.center();
                win.open();
            }).start();
        }

        constructor(private api : Utils.Api, private diskOfferingMgr : MDiskOffering.DiskOfferingManager,
                    private volumeMgr : VolumeManager, private vmMgr: MVmInstance.VmInstanceManager) {
            this.scope = true;
            this.link = ($scope : any, $element, $attrs : any, $ctrl, $transclude) => {
                var instanceName = $attrs.zCreateVolume;
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
                    diskOfferingUuid: null,

                    hasDiskOffering(): boolean {
                        return $scope.diskOfferingOptions__.dataSource.data().length > 0;
                    },

                    canMoveToPrevious(): boolean {
                        return false;
                    },

                    canMoveToNext(): boolean {
                        return Utils.notNullnotUndefined(this.name) && Utils.notNullnotUndefined(this.diskOfferingUuid);
                    },

                    show(): void {
                        this.getAnchorElement().tab('show');
                    },

                    getAnchorElement() : any {
                        return $('.nav a[data-target="#createVolumeInfo"]');
                    },

                    active(): void {
                        this.activeState = true;
                    },

                    isActive(): boolean {
                        return this.activeState;
                    },

                    getPageName(): string {
                        return 'createVolumeInfo';
                    },

                    reset() : void {
                        this.name = Utils.shortHashName('volume');
                        this.description = null;
                        this.diskOfferingUuid = null;
                        this.activeState = false;
                    }
                } ;

                var attachPage: Utils.WizardPage = $scope.attachPage  = {
                    activeState: true,

                    vmInstanceUuid: null,

                    canMoveToPrevious(): boolean {
                        return true;
                    },

                    canMoveToNext(): boolean {
                        return true;
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

                    hasVm() {
                        return $scope.vmOptions__.dataSource.data().length > 0;
                    },

                    reset() : void {
                        this.vmInstanceUuid = null;
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
                        var resultVolume : Volume;
                        var chain = new Utils.Chain();
                        chain.then(()=> {
                            volumeMgr.create(infoPage, (ret : Volume)=> {
                                resultVolume = ret;
                                chain.next();
                            });
                        }).then(()=>{
                            if (Utils.notNullnotUndefined($scope.attachPage.vmInstanceUuid) && $scope.attachPage.vmInstanceUuid != '') {
                                volumeMgr.attach(resultVolume, $scope.attachPage.vmInstanceUuid, ()=>{
                                    chain.next();
                                });
                            } else {
                                chain.next();
                            }
                        }).done(()=> {
                            if (Utils.notNullnotUndefined(this.options.done)) {
                                this.options.done(resultVolume);
                            }
                        }).start();

                        $scope.winCreateVolume__.close();
                    }
                };

                $scope.button = new Utils.WizardButton([
                    infoPage, attachPage
                ], mediator);

                $scope.winCreateVolumeOptions__ = {
                    width: '700px',
                    animation: false,
                    modal: true,
                    draggable: false,
                    resizable: false
                };

                $scope.diskOfferingOptions__ = {
                    dataSource: new kendo.data.DataSource({data: []}),
                    dataTextField: "name",
                    dataValueField: "uuid",
                    template: '<div style="color: black"><span class="z-label">{{"volume.ts.Name" | translate}}:</span><span>#: name #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"volume.ts.DISK SIZE" | translate}}:</span><span>#: diskSize #</span></div>'
                };

                $scope.vmOptions__ = {
                    dataSource: new kendo.data.DataSource({data: []}),
                    dataTextField: "name",
                    dataValueField: "uuid",
                    optionLabel: "",
                    template: '<div style="color: black"><span class="z-label">{{"volume.ts.Name" | translate}}:</span><span>#: name #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"volume.ts.Hypervisor" | translate}}:</span><span>#: hypervisorType #</span></div>'
                };

                this.$scope = $scope;
            };
            this.restrict = 'EA';
            this.replace = true;
            this.templateUrl = '/static/templates/volume/createVolume.html';
        }
    }

    export class AttachVm implements ng.IDirective {
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
            this.$scope.vmInstanceListOptions__.dataSource.data([]);
            var chain  = new Utils.Chain();
            chain.then(()=> {
                this.api.getDataVolumeAttachableVm(this.options.volume.uuid, (vms: ApiHeader.VmInstanceInventory[])=>{
                    this.$scope.vmInstanceListOptions__.dataSource.data(vms);
                    if (vms.length > 0) {
                        this.$scope.vmInstanceUuid = vms[0].uuid;
                    }
                    chain.next();
                });
            }).done(()=>{
                this.$scope.attachVmInstance__.center();
                this.$scope.attachVmInstance__.open();
            }).start();
        }

        constructor(private api: Utils.Api, private volMgr: VolumeManager) {
            this.scope = true;
            this.restrict = 'EA';
            this.replace = true;
            this.templateUrl = '/static/templates/volume/attachVm.html';
            this.link = ($scope : any, $element, $attrs : any, $ctrl, $transclude) => {
                var parent = $scope.$parent;
                parent[$attrs.zVolumeAttachVm] = this;
                this.options = parent[$attrs.zOptions];

                var onSelect = (e: any) => {
                    $scope.vmInstanceUuid = e.item.context.children[3].children[1].innerText;
                };

                $scope.vmInstanceListOptions__ = {
                    dataSource: new kendo.data.DataSource({data: []}),
                    dataTextField: "name",
                    dataValueField: "uuid",
                    select: onSelect,
                    template: '<div style="color: black"><span class="z-label">{{"volume.ts.Name" | translate}}:</span><span>#: name #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"volume.ts.Hypervisor" | translate}}:</span><span>#: hypervisorType #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"volume.ts.State" | translate}}:</span><span>#: state #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"volume.ts.UUID" | translate}}:</span><span>#: uuid #</span></div>'
                };

                $scope.hasVm = () => {
                    return $scope.vmInstanceListOptions__.dataSource.data().length > 0;
                };

                $scope.vmInstanceUuid = null;
                $scope.canProceed = ()=> {
                    return Utils.notNullnotUndefined($scope.vmInstanceUuid);
                };

                $scope.cancel = () => {
                    $scope.attachVmInstance__.close();
                };

                $scope.done = () => {
                    volMgr.attach(this.options.volume, $scope.vmInstanceUuid, ()=>{
                        if (this.options.done) {
                            this.options.done();
                        }
                    });
                    $scope.attachVmInstance__.close();
                };

                this.$scope = $scope;
            }
        }

    }

    export class DetachVm implements ng.IDirective {
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
                    name: 'uuid',
                    op: '=',
                    value: this.options.volume.vmInstanceUuid
                }
            ];

            this.vmMgr.query(qobj, (vms: ApiHeader.VmInstanceInventory[])=>{
                if (vms.length > 0) {
                    this.$scope.vm = vms[0];
                }
                this.$scope.detachVmInstance__.center();
                this.$scope.detachVmInstance__.open();
            });
        }

        constructor(private volMgr: VolumeManager, private vmMgr: MVmInstance.VmInstanceManager) {
            this.scope = true;
            this.restrict = 'EA';
            this.replace = true;
            this.templateUrl = '/static/templates/volume/detachVm.html';
            this.link = ($scope : any, $element, $attrs : any, $ctrl, $transclude) => {
                var parent = $scope.$parent;
                parent[$attrs.zVolumeDetachVm] = this;
                this.options = parent[$attrs.zOptions];

                $scope.cancel = () => {
                    $scope.detachVmInstance__.close();
                };

                $scope.done = () => {
                    volMgr.detach(this.options.volume, ()=>{
                        if (this.options.done) {
                            this.options.done();
                        }
                    });
                    $scope.detachVmInstance__.close();
                };

                $scope.optionsDetachVm__ = {
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

    export class TakeSnapshot implements ng.IDirective {
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
            this.$scope.name = null;
            this.$scope.description = null;
            this.$scope.takeSnapshot__.center();
            this.$scope.takeSnapshot__.open();
        }

        constructor(private volMgr: VolumeManager) {
            this.scope = true;
            this.restrict = 'EA';
            this.replace = true;
            this.templateUrl = '/static/templates/volume/takeSnapshot.html';
            this.link = ($scope : any, $element, $attrs : any, $ctrl, $transclude) => {
                var parent = $scope.$parent;
                parent[$attrs.zVolumeTakeSnapshot] = this;
                this.options = parent[$attrs.zOptions];

                $scope.canProceed = ()=> {
                    return Utils.notNullnotUndefined($scope.name);
                };

                $scope.cancel = () => {
                    $scope.takeSnapshot__.close();
                };

                $scope.done = () => {
                    volMgr.takeSnapshot(this.options.volume, {
                        name: $scope.name,
                        description: $scope.description
                    }, (sp: VolumeSnapshot)=>{
                        if (this.options.done) {
                            this.options.done(sp);
                        }
                    });

                    $scope.takeSnapshot__.close();
                };

                this.$scope = $scope;
            }
        }
    }


    export class RevertSnapshot implements ng.IDirective {
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
            this.$scope.snapshot = this.options.snapshot;
            var chain = new Utils.Chain();
            chain.then(()=>{
                var qobj = new ApiHeader.QueryObject();
                qobj.conditions = [
                    {
                        name: 'allVolumes.snapshot.uuid',
                        op: '=',
                        value: this.options.snapshot.uuid
                    }
                ];

                this.vmMgr.query(qobj, (vms: ApiHeader.VmInstanceInventory[])=>{
                    if (vms.length > 0) {
                        this.$scope.vm = vms[0];
                    }
                    chain.next();
                });
            }).then(()=>{
                if (!Utils.notNullnotUndefined(this.options.snapshot.volumeUuid)) {
                    chain.next();
                    return;
                }

                var qobj = new ApiHeader.QueryObject();
                qobj.conditions = [{
                    name: 'uuid',
                    op: '=',
                    value: this.options.snapshot.volumeUuid
                }];

                this.volMgr.query(qobj, (vols: Volume[])=>{
                    this.$scope.volume = vols[0];
                    chain.next();
                });
            }).done(()=>{
                this.$scope.revertSnapshot__.center();
                this.$scope.revertSnapshot__.open();
            }).start()
        }

        constructor(private spMgr: SnapshotManager, private volMgr: VolumeManager, private vmMgr: MVmInstance.VmInstanceManager) {
            this.scope = true;
            this.restrict = 'EA';
            this.replace = true;
            this.templateUrl = '/static/templates/volume/revertSnapshot.html';
            this.link = ($scope : any, $element, $attrs : any, $ctrl, $transclude) => {
                var parent = $scope.$parent;
                parent[$attrs.zVolumeRevertToSnapshot] = this;
                this.options = parent[$attrs.zOptions];

                $scope.cancel = () => {
                    $scope.revertSnapshot__.close();
                };

                $scope.done = () => {
                    spMgr.revert(this.options.snapshot, ()=>{
                        if (this.options.done) {
                            this.options.done();
                        }
                    });

                    $scope.revertSnapshot__.close();
                };

                $scope.optionsRevertSnapshot__ = {
                    width: '500px'
                };

                $scope.isVmInCorrectState = () => {
                    if (!Utils.notNullnotUndefined($scope.vm)) {
                        return true;
                    }

                    return $scope.vm.state == 'Stopped';
                };

                $scope.canProceed = ()=> {
                    return $scope.isVmInCorrectState();
                };

                this.$scope = $scope;
            }
        }
    }


    export class BackupSnapshot implements ng.IDirective {
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
            var chain  = new Utils.Chain();
            var ps = null;
            chain.then(()=> {
                var qobj = new ApiHeader.QueryObject();
                qobj.conditions = [{
                    name: 'uuid',
                    op: '=',
                    value: this.options.snapshot.primaryStorageUuid
                }];
                this.psMgr.query(qobj, (pss: MPrimaryStorage.PrimaryStorage[])=>{
                    ps = pss[0];
                    chain.next();
                });
            }).then(()=>{
                var bsUuidsAlreadyOn = [];
                angular.forEach(this.options.snapshot.backupStorageRefs, (it)=>{
                    bsUuidsAlreadyOn.push(it.backupStorageUuid);
                });

                var qobj = new ApiHeader.QueryObject();
                qobj.conditions = [{
                    name: 'uuid',
                    op: 'not in',
                    value: bsUuidsAlreadyOn.join()
                }, {
                    name: 'attachedZoneUuids',
                    op: 'in',
                    value: [ps.zoneUuid].join()
                }];

                this.bsMgr.query(qobj, (bss: MBackupStorage.BackupStorage[])=>{
                    this.$scope.backupStorageOptions__.dataSource.data(bss);
                    if (bss.length > 0) {
                        this.$scope.bsUuid = bss[0].uuid;
                    }
                    chain.next();
                });
            }).done(()=>{
                this.$scope.backupSnapshot__.center();
                this.$scope.backupSnapshot__.open();
            }).start();
        }

        constructor(private spMgr: SnapshotManager,
                    private psMgr: MPrimaryStorage.PrimaryStorageManager, private bsMgr: MBackupStorage.BackupStorageManager) {
            this.scope = true;
            this.restrict = 'EA';
            this.replace = true;
            this.templateUrl = '/static/templates/volume/backupSnapshot.html';
            this.link = ($scope : any, $element, $attrs : any, $ctrl, $transclude) => {
                var parent = $scope.$parent;
                parent[$attrs.zBackupSnapshot] = this;
                this.options = parent[$attrs.zOptions];

                $scope.backupStorageOptions__ = {
                    dataSource: new kendo.data.DataSource({data: []}),
                    dataTextField: "name",
                    dataValueField: "uuid",
                    template: '<div style="color: black"><span class="z-label">{{"volume.ts.Name" | translate}}:</span><span>#: name #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"volume.ts.Type" | translate}}:</span><span>#: type #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"volume.ts.State" | translate}}:</span><span>#: state #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"volume.ts.UUID" | translate}}:</span><span>#: uuid #</span></div>'
                };

                $scope.hasBackupStorage = () => {
                    return $scope.backupStorageOptions__.dataSource.data().length > 0;
                };

                $scope.bsUuid = null;
                $scope.canProceed = ()=> {
                    return Utils.notNullnotUndefined($scope.bsUuid);
                };

                $scope.cancel = () => {
                    $scope.backupSnapshot__.close();
                };

                $scope.done = () => {
                    spMgr.backup(this.options.snapshot, $scope.bsUuid, ()=>{
                        if (this.options.done) {
                            this.options.done();
                        }
                    });
                    $scope.backupSnapshot__.close();
                };

                $scope.backupSnapshotOptions__ = {
                    width: '500px'
                };

                this.$scope = $scope;
            }
        }
    }

    export class BackupDataVolume implements ng.IDirective {
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
            var chain  = new Utils.Chain();
            var ps = null;
            this.$scope.bsUuid = null;
            this.$scope.backupStorageOptions__.dataSource.data([]);
            chain.then(()=> {
                var qobj = new ApiHeader.QueryObject();
                qobj.conditions = [{
                    name: 'uuid',
                    op: '=',
                    value: this.options.volume.primaryStorageUuid
                }];
                this.psMgr.query(qobj, (pss: MPrimaryStorage.PrimaryStorage[])=>{
                    ps = pss[0];
                    chain.next();
                });
            }).then(()=>{
                var bsUuidsAlreadyOn = [];
                angular.forEach(this.options.volume.backupStorageRefs, (it)=>{
                    bsUuidsAlreadyOn.push(it.backupStorageUuid);
                });

                var qobj = new ApiHeader.QueryObject();
                qobj.conditions = [{
                    name: 'uuid',
                    op: 'not in',
                    value: bsUuidsAlreadyOn.join()
                }, {
                    name: 'attachedZoneUuids',
                    op: 'in',
                    value: [ps.zoneUuid].join()
                }];

                this.bsMgr.query(qobj, (bss: MBackupStorage.BackupStorage[])=>{
                    this.$scope.backupStorageOptions__.dataSource.data(bss);
                    if (bss.length > 0) {
                        this.$scope.bsUuid = bss[0].uuid;
                    }
                    chain.next();
                });
            }).done(()=>{
                this.$scope.backupDataVolume__.center();
                this.$scope.backupDataVolume__.open();
            }).start();
        }

        constructor(private volMgr: VolumeManager,
                    private psMgr: MPrimaryStorage.PrimaryStorageManager,
                    private bsMgr: MBackupStorage.BackupStorageManager) {
            this.scope = true;
            this.restrict = 'EA';
            this.replace = true;
            this.templateUrl = '/static/templates/volume/backupVolume.html';
            this.link = ($scope : any, $element, $attrs : any, $ctrl, $transclude) => {
                var parent = $scope.$parent;
                parent[$attrs.zBackupDataVolume] = this;
                this.options = parent[$attrs.zOptions];

                $scope.backupStorageOptions__ = {
                    dataSource: new kendo.data.DataSource({data: []}),
                    dataTextField: "name",
                    dataValueField: "uuid",
                    template: '<div style="color: black"><span class="z-label">{{"volume.ts.Name" | translate}}:</span><span>#: name #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"volume.ts.Type" | translate}}:</span><span>#: type #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"volume.ts.State" | translate}}:</span><span>#: state #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"volume.ts.UUID" | translate}}:</span><span>#: uuid #</span></div>'
                };

                $scope.hasBackupStorage = () => {
                    return $scope.backupStorageOptions__.dataSource.data().length > 0;
                };

                $scope.bsUuid = null;
                $scope.canProceed = ()=> {
                    return $scope.hasBackupStorage();
                };

                $scope.cancel = () => {
                    $scope.backupDataVolume__.close();
                };

                $scope.done = () => {
                    volMgr.backup(this.options.volume, $scope.bsUuid, ()=>{
                        if (this.options.done) {
                            this.options.done();
                        }
                    });
                    $scope.backupDataVolume__.close();
                };

                $scope.backupDataVolumeOptions__ = {
                    width: '500px'
                };

                this.$scope = $scope;
            }
        }
    }

    export class DeleteDataVolumeFromBackupStorage implements ng.IDirective {
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
            var bsUuidsAlreadyOn = [];
            angular.forEach(this.options.volume.backupStorageRefs, (it)=>{
                bsUuidsAlreadyOn.push(it.backupStorageUuid);
            });

            var qobj = new ApiHeader.QueryObject();
            qobj.conditions = [{
                name: 'uuid',
                op: 'in',
                value: bsUuidsAlreadyOn.join()
            }];

            this.bsMgr.query(qobj, (bss: MBackupStorage.BackupStorage[])=>{
                this.$scope.backupStorageOptions__.dataSource.data(bss);
                if (bss.length > 0) {
                    this.$scope.bsUuid = bss[0].uuid;
                }

                this.$scope.deleteDataVolumeFromBackupStorage__.center();
                this.$scope.deleteDataVolumeFromBackupStorage__.open();
            });
        }

        constructor(private volMgr: VolumeManager,
                    private psMgr: MPrimaryStorage.PrimaryStorageManager,
                    private bsMgr: MBackupStorage.BackupStorageManager) {
            this.scope = true;
            this.restrict = 'EA';
            this.replace = true;
            this.templateUrl = '/static/templates/volume/deleteVolumeFromBackupStorage.html';
            this.link = ($scope : any, $element, $attrs : any, $ctrl, $transclude) => {
                var parent = $scope.$parent;
                parent[$attrs.zDeleteDataVolumeFromBackupStorage] = this;
                this.options = parent[$attrs.zOptions];

                $scope.backupStorageOptions__ = {
                    dataSource: new kendo.data.DataSource({data: []}),
                    dataTextField: "name",
                    dataValueField: "uuid",
                    template: '<div style="color: black"><span class="z-label">{{"volume.ts.Name" | translate}}:</span><span>#: name #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"volume.ts.Type" | translate}}:</span><span>#: type #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"volume.ts.State" | translate}}:</span><span>#: state #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"volume.ts.UUID" | translate}}:</span><span>#: uuid #</span></div>'
                };

                $scope.bsUuid = null;
                $scope.canProceed = ()=> {
                    return Utils.notNullnotUndefined($scope.bsUuid);
                };

                $scope.cancel = () => {
                    $scope.deleteDataVolumeFromBackupStorage__.close();
                };

                $scope.done = () => {
                    volMgr.backup(this.options.volume, $scope.bsUuid, ()=>{
                        if (this.options.done) {
                            this.options.done();
                        }
                    });
                    $scope.deleteDataVolumeFromBackupStorage__.close();
                };

                $scope.deleteDataVolumeFromBackupStorageOptions__ = {
                    width: '500px'
                };

                this.$scope = $scope;
            }
        }
    }

    export class CreateTemplateFromRootVolume implements ng.IDirective {
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
            this.$scope.platform = 'Linux';
            this.$scope.bits = 64;
            this.$scope.name = null;
            this.$scope.description = null;
            this.$scope.system = false;
            this.$scope.guestOsType = null;
            this.$scope.vm = null;
            var chain  = new Utils.Chain();
            var ps = null;
            chain.then(()=> {
                var qobj = new ApiHeader.QueryObject();
                qobj.conditions = [{
                    name: 'uuid',
                    op: '=',
                    value: this.options.volume.primaryStorageUuid
                }];
                this.psMgr.query(qobj, (pss: MPrimaryStorage.PrimaryStorage[])=>{
                    ps = pss[0];
                    chain.next();
                });
            }).then(()=>{
                var bsUuidsAlreadyOn = [];
                angular.forEach(this.options.volume.backupStorageRefs, (it)=>{
                    bsUuidsAlreadyOn.push(it.backupStorageUuid);
                });

                var qobj = new ApiHeader.QueryObject();
                qobj.conditions = [{
                    name: 'attachedZoneUuids',
                    op: 'in',
                    value: [ps.zoneUuid].join()
                }];

                this.bsMgr.query(qobj, (bss: MBackupStorage.BackupStorage[])=>{
                    this.$scope.backupStorageOptions__.dataSource.data(bss);
                    if (bss.length > 0) {
                        this.$scope.bsUuid = bss[0].uuid;
                    }
                    chain.next();
                });
            }).then(()=>{
                var msg = new ApiHeader.APIQueryVmInstanceMsg();
                msg.conditions = [{
                    name: 'allVolumes.uuid',
                    op: '=',
                    value: this.options.volume.uuid
                }];
                this.api.syncApi(msg, (ret: ApiHeader.APIQueryVmInstanceReply)=> {
                    this.$scope.vm = ret.inventories[0];
                    chain.next();
                });
            }).done(()=>{
                this.$scope.createTemplateFromRootVolume__.center();
                this.$scope.createTemplateFromRootVolume__.open();
            }).start();
        }

        constructor(private volMgr: VolumeManager,
                    private bsMgr: MBackupStorage.BackupStorageManager,
                    private psMgr: MPrimaryStorage.PrimaryStorageManager,
                    private vmMgr: MVmInstance.VmInstanceManager,
                    private api: Utils.Api) {
            this.scope = true;
            this.restrict = 'EA';
            this.replace = true;
            this.templateUrl = '/static/templates/volume/createTemplateFromVolume.html';
            this.link = ($scope : any, $element, $attrs : any, $ctrl, $transclude) => {
                var parent = $scope.$parent;
                parent[$attrs.zCreateTemplateFromRootVolume] = this;
                this.options = parent[$attrs.zOptions];

                $scope.backupStorageOptions__ = {
                    dataSource: new kendo.data.DataSource({data: []}),
                    dataTextField: "name",
                    dataValueField: "uuid",
                    template: '<div style="color: black"><span class="z-label">{{"volume.ts.Name" | translate}}:</span><span>#: name #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"volume.ts.Type" | translate}}:</span><span>#: type #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"volume.ts.State" | translate}}:</span><span>#: state #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"volume.ts.UUID" | translate}}:</span><span>#: uuid #</span></div>'
                };

                $scope.hasBackupStorage = () => {
                    return $scope.backupStorageOptions__.dataSource.data().length > 0;
                };

                $scope.platformOptions__ = {
                    dataSource: new kendo.data.DataSource({data: [
                        'Linux',
                        'Windows',
                        'WindowsVirtio',
                        'Other',
                        'Paravirtualization'
                    ]})
                };

                $scope.bitsOptions__ = {
                    dataSource: new kendo.data.DataSource({
                        data: [64, 32]
                    })
                };

                $scope.isVmInCorrectState = () => {
                    if (!Utils.notNullnotUndefined($scope.vm)) {
                        return false;
                    }

                    return $scope.vm.state == 'Stopped';
                };

                $scope.canProceed = ()=> {
                    return Utils.notNullnotUndefined($scope.bsUuid) && $scope.isVmInCorrectState();
                };

                $scope.cancel = () => {
                    $scope.createTemplateFromRootVolume__.close();
                };


                $scope.done = () => {
                    volMgr.createTemplate(this.options.volume, {
                        backupStorageUuid: $scope.bsUuid,
                        name: $scope.name,
                        description: $scope.description,
                        platform: $scope.platform,
                        guestOsType: $scope.guestOsType,
                        bits: $scope.bits,
                        system: $scope.system
                    }, ()=>{
                        if (this.options.done) {
                            this.options.done();
                        }
                    });
                    $scope.createTemplateFromRootVolume__.close();
                };

                $scope.createTemplateFromRootVolumeOptions__ = {
                    width: '600px'
                };

                this.$scope = $scope;
            }
        }
    }


    export class DeleteSnapshotFromBackupStorage implements ng.IDirective {
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
            var bsUuidsAlreadyOn = [];
            angular.forEach(this.options.snapshot.backupStorageRefs, (it)=>{
                bsUuidsAlreadyOn.push(it.backupStorageUuid);
            });

            var qobj = new ApiHeader.QueryObject();
            qobj.conditions = [{
                name: 'uuid',
                op: 'in',
                value: bsUuidsAlreadyOn.join()
            }];

            this.bsMgr.query(qobj, (bss: MBackupStorage.BackupStorage[])=>{
                this.$scope.backupStorageOptions__.dataSource.data(bss);
                if (bss.length > 0) {
                    this.$scope.bsUuid = bss[0].uuid;
                }

                this.$scope.deleteSnapshotFromBackupStorage__.center();
                this.$scope.deleteSnapshotFromBackupStorage__.open();
            });
        }

        constructor(private spMgr: SnapshotManager,
                    private bsMgr: MBackupStorage.BackupStorageManager) {
            this.scope = true;
            this.restrict = 'EA';
            this.replace = true;
            this.templateUrl = '/static/templates/volume/deleteSnapshotFromBackupStorage.html';
            this.link = ($scope : any, $element, $attrs : any, $ctrl, $transclude) => {
                var parent = $scope.$parent;
                parent[$attrs.zDeleteSnapshotFromBackupStorage] = this;
                this.options = parent[$attrs.zOptions];

                $scope.backupStorageOptions__ = {
                    dataSource: new kendo.data.DataSource({data: []}),
                    dataTextField: "name",
                    dataValueField: "uuid",
                    template: '<div style="color: black"><span class="z-label">{{"volume.ts.Name" | translate}}:</span><span>#: name #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"volume.ts.Type" | translate}}:</span><span>#: type #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"volume.ts.State" | translate}}:</span><span>#: state #</span></div>' +
                        '<div style="color: black"><span class="z-label">{{"volume.ts.UUID" | translate}}:</span><span>#: uuid #</span></div>'
                };

                $scope.bsUuid = null;
                $scope.canProceed = ()=> {
                    return Utils.notNullnotUndefined($scope.bsUuid);
                };

                $scope.cancel = () => {
                    $scope.deleteSnapshotFromBackupStorage__.close();
                };

                $scope.done = () => {
                    spMgr.deleteFromBackupStorage(this.options.snapshot, $scope.bsUuid, ()=>{
                        if (this.options.done) {
                            this.options.done();
                        }
                    });
                    $scope.deleteSnapshotFromBackupStorage__.close();
                };

                $scope.deleteSnapshotFromBackupStorageOptions__ = {
                    width: '500px'
                };

                this.$scope = $scope;
            }
        }
    }
}

angular.module('root').factory('VolumeManager', ['Api', '$rootScope', (api, $rootScope)=> {
    return new MVolume.VolumeManager(api, $rootScope);
}]).factory('SnapshotManager', ['Api', '$rootScope', (api, $rootScope)=>{
    return new MVolume.SnapshotManager(api, $rootScope);
}]).directive('zCreateVolume', ['Api', 'DiskOfferingManager', 'VolumeManager', 'VmInstanceManager', (api, diskOfferingMgr, volumeMgr, vmMgr)=> {
    return new MVolume.CreateVolume(api, diskOfferingMgr, volumeMgr, vmMgr);
}]).directive('zVolumeAttachVm', ['Api', 'VolumeManager', (api, volMgr)=>{
    return new MVolume.AttachVm(api, volMgr);
}]).directive('zVolumeDetachVm', ['VolumeManager', 'VmInstanceManager', (volMgr, vmMgr)=>{
    return new MVolume.DetachVm(volMgr, vmMgr);
}]).directive('zVolumeTakeSnapshot', ['VolumeManager', (volMgr)=>{
    return new MVolume.TakeSnapshot(volMgr);
}]).directive('zVolumeRevertToSnapshot', ['SnapshotManager', 'VolumeManager', 'VmInstanceManager', (spMgr, volMgr, vmMgr)=>{
    return new MVolume.RevertSnapshot(spMgr, volMgr, vmMgr);
}]).directive('zBackupSnapshot', ['SnapshotManager', 'PrimaryStorageManager', 'BackupStorageManager', (spMgr, psMgr, bsMgr)=>{
    return new MVolume.BackupSnapshot(spMgr, psMgr, bsMgr);
}]).directive('zBackupDataVolume', ['VolumeManager', 'PrimaryStorageManager', 'BackupStorageManager', (volMgr, psMgr, bsMgr)=>{
    return new MVolume.BackupDataVolume(volMgr, psMgr, bsMgr);
}]).directive('zDeleteSnapshotFromBackupStorage', ['SnapshotManager', 'BackupStorageManager', (spMgr, bsMgr)=>{
    return new MVolume.DeleteSnapshotFromBackupStorage(spMgr, bsMgr);
}]).directive('zCreateTemplateFromRootVolume', ['VolumeManager', 'BackupStorageManager', 'PrimaryStorageManager', 'VmInstanceManager', 'Api', (volMgr, bsMgr, psMgr, vmMgr, api)=>{
    return new MVolume.CreateTemplateFromRootVolume(volMgr, bsMgr, psMgr, vmMgr, api);
}]).config(['$routeProvider', function(route) {
    route.when('/volume', {
        templateUrl: '/static/templates/volume/volume.html',
        controller: 'MVolume.Controller',
        resolve: {
            hypervisorTypes: function($q : ng.IQService, Api : Utils.Api) {
                var defer = $q.defer();
                Api.getHypervisorTypes((hypervisorTypes: string[])=> {
                    defer.resolve(hypervisorTypes);
                });
                return defer.promise;
            }
        }
    }).when('/volume/:uuid', {
        templateUrl: '/static/templates/volume/details.html',
        controller: 'MVolume.DetailsController',
        resolve: {
            current: function($q : ng.IQService, $route: any, VolumeManager: MVolume.VolumeManager) {
                var defer = $q.defer();
                var chain = new Utils.Chain();
                var uuid = $route.current.params.uuid;
                var ret = {
                    volume: null,
                    snapshotTree: null
                };
                chain.then(()=>{
                    var qobj = new ApiHeader.QueryObject();
                    qobj.addCondition({name: 'uuid', op: '=', value: uuid});
                    VolumeManager.query(qobj, (volumes: MVolume.Volume[])=>{
                        ret.volume = volumes[0];
                        chain.next()
                    });
                }).then(()=>{
                    var qobj = new ApiHeader.QueryObject();
                    qobj.conditions = [{
                        name: 'volumeUuid',
                        op: '=',
                        value: uuid
                    }];
                    VolumeManager.querySnapshotTree(qobj, (trees: any)=>{
                        ret.snapshotTree = trees;
                        chain.next()
                    });
                }).done(()=>{
                    defer.resolve(ret);
                }).start();

                return defer.promise;
            }
        }
    }).when('/volumeSnapshot/:uuid', {
        templateUrl: '/static/templates/volume/snapshotDetails.html',
        controller: 'MVolume.SnapshotDetailsController',
        resolve: {
            current: function($q : ng.IQService, $route: any, SnapshotManager: MVolume.SnapshotManager) {
                var defer = $q.defer();
                var uuid = $route.current.params.uuid;
                var qobj = new ApiHeader.QueryObject();
                qobj.addCondition({name: 'uuid', op: '=', value: uuid});
                SnapshotManager.query(qobj, (sps: MVolume.VolumeSnapshot[])=>{
                    defer.resolve(sps[0]);
                });

                return defer.promise;
            }
        }
    });
}]);

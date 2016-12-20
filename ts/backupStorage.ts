
/// <reference path="d.ts/angularjs/angular.d.ts" />
/// <reference path="d.ts/kendo.all.d.ts" />

module MBackupStorage {
  export class BackupStorage extends ApiHeader.BackupStorageInventory {
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
    statusLabel() : string {
      if (this.status == 'Connected') {
        return 'label label-success';
      } else if (this.status == 'Disconnected') {
        return 'label label-danger';
      } else {
        return 'label label-default';
      }
    }

    updateObservableObject(inv : ApiHeader.BackupStorageInventory) {
      // self : ObservableObject
      var self : any = this;
      self.set('uuid', inv.uuid);
      self.set('name', inv.name);
      self.set('description', inv.description);
      self.set('url', inv.url);
      self.set('totalCapacity', inv.totalCapacity);
      self.set('availableCapacity', inv.availableCapacity);
      self.set('type', inv.type);
      self.set('state', inv.state);
      self.set('status', inv.status);
      self.set('attachedZoneUuids', inv.attachedZoneUuids);
      self.set('createDate', inv.createDate);
      self.set('lastOpDate', inv.lastOpDate);
      self.set('sshPort', inv.sshPort);
   }
  }

  export class BackupStorageManager {
    static $inject = ['Api', '$rootScope'];

    constructor(private api : Utils.Api, private $rootScope: ng.IRootScopeService) {
    }

    private sortBy : Directive.SortByData;

    setSortBy(sortBy : Directive.SortByData) {
      this.sortBy = sortBy;
    }

    private wrap(bs : BackupStorage) : any {
      return new kendo.data.ObservableObject(bs);
    }

    create(bs : any, done : (ret : BackupStorage)=>void) {
      var msg : any = null;
      if (bs.type == 'SftpBackupStorage') {
        msg = new ApiHeader.APIAddSftpBackupStorageMsg();
        msg.hostname = bs.hostname;
        msg.username = bs.username;
        msg.password = bs.password;
        msg.sshPort = bs.port;
        msg.type = 'SftpBackupStorage';
      } else if (bs.type == 'SimulatorBackupStorage') {
        msg = new ApiHeader.APIAddSimulatorBackupStorageMsg();
        msg.type = 'SimulatorBackupStorage';
      } else if (bs.type == 'Ceph') {
        msg = new ApiHeader.APIAddCephBackupStorageMsg();
        msg.type = 'Ceph';
        msg.monUrls = bs.cephMonUrls;
      } else if (bs.type == 'SS100-Storage' || bs.type == 'Fusionstor') {
        msg = new ApiHeader.APIAddFusionstorBackupStorageMsg();
        msg.type = bs.type;
        msg.monUrls = bs.fusionstorMonUrls;
      }

      if (Utils.notNullnotUndefined(bs.resourceUuid)) {
        msg.resourceUuid = bs.resourceUuid;
      }
      msg.name = bs.name;
      msg.description = bs.description;
      msg.url = bs.url;
      this.api.asyncApi(msg, (ret : ApiHeader.APIAddBackupStorageEvent)=> {
        var c = new BackupStorage();
        angular.extend(c, ret.inventory);
        done(this.wrap(c));
        this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
          msg: Utils.sprintf('Created new Backup Storage: {0}',c.name),
          link: Utils.sprintf('/#/backupStorage/{0}', c.uuid)
        });
      });
    }

    query(qobj : ApiHeader.QueryObject, callback : (bss : BackupStorage[], total: number) => void) : void {
      var msg = new ApiHeader.APIQueryBackupStorageMsg();
      msg.count = qobj.count === true;
      msg.start = qobj.start;
      msg.limit = qobj.limit;
      msg.replyWithCount = true;
      msg.conditions = qobj.conditions ? qobj.conditions : [];
      if (Utils.notNullnotUndefined(this.sortBy) && this.sortBy.isValid()) {
        msg.sortBy = this.sortBy.field;
        msg.sortDirection = this.sortBy.direction;
      }
      this.api.syncApi(msg, (ret : ApiHeader.APIQueryBackupStorageReply)=>{
        var pris = [];
        ret.inventories.forEach((inv : ApiHeader.BackupStorageInventory)=> {
          var c = new BackupStorage();
          angular.extend(c, inv);
          pris.push(this.wrap(c));
        });
        callback(pris, ret.total);
      });
    }

    disable(bs : BackupStorage) {
      bs.progressOn();
      var msg = new ApiHeader.APIChangeBackupStorageStateMsg();
      msg.stateEvent = 'disable';
      msg.uuid = bs.uuid;
      this.api.asyncApi(msg, (ret : ApiHeader.APIChangeBackupStorageStateEvent) => {
        bs.updateObservableObject(ret.inventory);
        bs.progressOff();
        this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
          msg: Utils.sprintf('Disabled Backup Storage: {0}',bs.name),
          link: Utils.sprintf('/#/backupStorage/{0}', bs.uuid)
        });
      });
    }

    enable(bs : BackupStorage) {
      bs.progressOn();
      var msg = new ApiHeader.APIChangeBackupStorageStateMsg();
      msg.stateEvent = 'enable';
      msg.uuid = bs.uuid;
      this.api.asyncApi(msg, (ret : ApiHeader.APIChangeBackupStorageStateEvent) => {
        bs.updateObservableObject(ret.inventory);
        bs.progressOff();
        this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
          msg: Utils.sprintf('Enabled Backup Storage: {0}', bs.name),
          link: Utils.sprintf('/#/backupStorage/{0}', bs.uuid)
        });
      });
    }

    attach(bs: BackupStorage, zone: MZone.Zone, done: ()=>void=null) {
      bs.progressOn();
      var msg = new ApiHeader.APIAttachBackupStorageToZoneMsg();
      msg.zoneUuid = zone.uuid;
      msg.backupStorageUuid = bs.uuid;
      this.api.asyncApi(msg, (ret: ApiHeader.APIAttachBackupStorageToZoneEvent)=> {
        bs.updateObservableObject(ret.inventory);
        bs.progressOff();
        if (Utils.notNullnotUndefined(done)) {
          done();
        }
        this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
          msg: Utils.sprintf('Attached Backup Storage: {0} to Zone: {1}', bs.name, zone.name),
          link: Utils.sprintf('/#/backupStorage/{0}', bs.uuid)
        });
      });
    }

    detach(bs: BackupStorage, zone: MZone.Zone, done: ()=>void=null) {
      bs.progressOn();
      var msg = new ApiHeader.APIDetachBackupStorageFromZoneMsg();
      msg.zoneUuid = zone.uuid;
      msg.backupStorageUuid = bs.uuid;
      this.api.asyncApi(msg, (ret: ApiHeader.APIDetachBackupStorageFromZoneEvent)=> {
        bs.updateObservableObject(ret.inventory);
        bs.progressOff();
        if (Utils.notNullnotUndefined(done)) {
          done();
        }
        this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
          msg: Utils.sprintf('Detached Backup Storage: {0} from zone: {1}', bs.name, zone.name),
          link: Utils.sprintf('/#/backupStorage/{0}', bs.uuid)
        });
      });
    }

    reconnect(bs: BackupStorage, done: ()=>void=null) {
      if (bs.type != 'SftpBackupStorage') {
        return;
      }

      bs.progressOn();
      var msg = new ApiHeader.APIReconnectSftpBackupStorageMsg();
      msg.uuid = bs.uuid;
      bs.status = 'Connecting';
      this.api.asyncApi(msg, (ret: ApiHeader.APIReconnectSftpBackupStorageEvent)=> {
        bs.updateObservableObject(ret.inventory);
        bs.progressOff();
        if (Utils.notNullnotUndefined(done)) {
          done();
        }
        this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
          msg: Utils.sprintf('Reconnected SFtp Backup Storage: {0}', bs.name),
          link: Utils.sprintf('/#/backupStorage/{0}', bs.uuid)
        });
      });
    }

    delete(bs : BackupStorage, done : (ret : any)=>void) {
      bs.progressOn();
      var msg = new ApiHeader.APIDeleteBackupStorageMsg();
      msg.uuid = bs.uuid;
      this.api.asyncApi(msg, (ret : any)=> {
        bs.progressOff();
        done(ret);
        this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
          msg: Utils.sprintf('Deleted Backup Storage: {0}', bs.name)
        });
      });
    }
  }

  export class BackupStorageModel extends Utils.Model {
    constructor() {
      super();
      this.current = new BackupStorage();
    }
  }

  class OBackupStorageGrid extends Utils.OGrid {
    constructor($scope: any, private bsMgr : BackupStorageManager) {
      super();
      super.init($scope, $scope.backupStorageGrid);
      this.options.columns = [
        {
          field: 'name',
          title: '{{"backupStorage.ts.NAME" | translate}}',
          width: '10%',
          template: '<a href="/\\#/backupStorage/{{dataItem.uuid}}">{{dataItem.name}}</a>'
        },
        {
          field: 'description',
          title: '{{"backupStorage.ts.DESCRIPTION" | translate}}',
          width: '10%'
        },
        {
          field: 'url',
          title: '{{"backupStorage.ts.URL" | translate}}',
          width: '16%'
        },
        {
          field: 'totalCapacity',
          title: '{{"backupStorage.ts.TOTAL CAPACITY" | translate}}',
          width: '8%',
          template: '<span>{{dataItem.totalCapacity | size}}</span>'
        },
        {
          field: 'availableCapacity',
          title: '{{"backupStorage.ts.AVAILABLE CAPACITY" | translate}}',
          width: '8%',
          template: '<span>{{dataItem.availableCapacity | size}}</span>'
        },
        {
          field: 'type',
          title: '{{"backupStorage.ts.TYPE" | translate}}',
          width: '10%'
        },
        {
          field: 'state',
          title: '{{"backupStorage.ts.STATE" | translate}}',
          width: '10%',
          template: '<span class="{{dataItem.stateLabel()}}">{{dataItem.state}}</span>'
        },
        {
          field: 'status',
          title: '{{"backupStorage.ts.STATUS" | translate}}',
          width: '10%',
          template: '<span class="{{dataItem.statusLabel()}}">{{dataItem.status}}</span>'
        },
        {
          field: 'uuid',
          title: '{{"backupStorage.ts.UUID" | translate}}',
          width: '20%'
        }
      ];

      this.options.dataSource.transport.read = (options)=> {
        var qobj = new ApiHeader.QueryObject();
        qobj.limit = options.data.take;
        qobj.start = options.data.pageSize * (options.data.page - 1);
        bsMgr.query(qobj, (bss:BackupStorage[], total:number)=> {
          options.success({
            data: bss,
            total: total
          });
        });
      };
    }
  }

  class Action {
    enable() {
      this.bsMgr.enable(this.$scope.model.current);
    }

    disable() {
      this.bsMgr.disable(this.$scope.model.current);
    }

    reconnect() {
      this.bsMgr.reconnect(this.$scope.model.current);
    }

    addHost() {

    }

    attachL2Network() {

    }

    detachL2Network() {

    }

    attachZone() {
      this.$scope.attachZone.open();
    }

    detachZone() {
      this.$scope.detachZone.open();
    }

    isReconnectShow() {
      if (!Utils.notNullnotUndefined(this.$scope.model.current)) {
        return false;
      }

      return true;
    }

    constructor(private $scope : any, private bsMgr : BackupStorageManager) {
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

    constructor(private $scope : any, private bsTypes: string[]) {
      this.fieldList = {
        dataSource: new kendo.data.DataSource({
          data: [
            {
              name: '{{"backupStorage.ts.None" | translate}}',
              value: FilterBy.NONE
            },
            {
              name: '{{"backupStorage.ts.State" | translate}}',
              value: FilterBy.STATE
            },
            {
              name: '{{"backupStorage.ts.Status" | translate}}',
              value: FilterBy.STATUS
            },
            {
              name: '{{"backupStorage.ts.Type" | translate}}',
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
        } else if (this.field == FilterBy.STATE) {
          this.valueList.dataSource.data(['Enabled', 'Disabled']);
        } else if (this.field == FilterBy.STATUS) {
          this.valueList.dataSource.data(['Connecting', 'Connected', 'Disconnected']);
        } else if (this.field == FilterBy.TYPE) {
          this.valueList.dataSource.data(this.bsTypes);
        }
      });
    }

    confirm (popover : any) {
      this.$scope.oBackupStorageGrid.setFilter(this.toKendoFilter());
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
    static $inject = ['$scope', 'BackupStorageManager', '$routeParams', 'Tag', 'current', 'ZoneManager'];

    private loadSelf(uuid : string) {
      var qobj = new ApiHeader.QueryObject();
      qobj.addCondition({name: 'uuid', op: '=', value: uuid});
      this.bsMgr.query(qobj, (bss : BackupStorage[], total:number)=> {
        this.$scope.model.current = bss[0];
      });
    }

    constructor(private $scope : any, private bsMgr : BackupStorageManager, private $routeParams : any,
                private tagService : Utils.Tag, current: BackupStorage, zoneMgr: MZone.ZoneManager) {
      $scope.model = new BackupStorageModel();
      $scope.model.current = current;

      $scope.funcDelete = (win : any) => {
        win.open();
      };

      $scope.action = new Action($scope, bsMgr);

      $scope.funcRefresh = ()=> {
        this.loadSelf($scope.model.current.uuid);
      };

      $scope.funcToolbarShow = ()=> {
        return Utils.notNullnotUndefined($scope.model.current);
      };

      $scope.optionsDeleteBackupStorage = {
        title: 'DELETE BACKUP STORAGE',
        html: '<strong><p>Deleting Backup Storage will cause:</p></strong>' +
        '<ul><li><strong>Zones to which this backup storage has attached will be detached</strong></li>' +
        '<strong><p>those results are not recoverable</p></strong>',
        confirm: ()=> {
          bsMgr.delete($scope.model.current, (ret : any)=> {
            $scope.model.resetCurrent();
          });
        }
      };

      $scope.optionsTag = {
        tags: [],
        createTag: (item)=> {
          this.tagService.createTag(item.tag, $scope.model.current.uuid, ApiHeader.TagResourceTypeBackupStorageVO, (ret : ApiHeader.TagInventory)=> {
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

      $scope.optionsAttachZone = {
        backupStorage: $scope.model.current,
        done: (zone: MZone.Zone)=> {
          $scope.optionsZoneGrid.dataSource.insert(0, zone);
        }
      };

      $scope.optionsDetachZone = {
        backupStorage: $scope.model.current,
        done: (zone: MZone.Zone)=> {
          var ds = $scope.optionsZoneGrid.dataSource;
          var cs = ds.data();
          for (var i=0; i<cs.length; i++) {
            var tcs = cs[i];
            if (zone.uuid == tcs.uuid) {
              var row = ds.getByUid(tcs.uid);
              ds.remove(row);
              break;
            }
          }
        }
      };

      $scope.funcLoadZones = ()=> {
        $scope.optionsZoneGrid.dataSource.read();
      };

      $scope.optionsZoneGrid = {
        pageSize: 20,
        resizable: true,
        scrollable: true,
        pageable: true,
        columns: [
          {
            field: 'name',
            title: '{{"backupStorage.ts.NAME" | translate}}',
            width: '25%',
            template: '<a href="/\\#/zone/{{dataItem.uuid}}">{{dataItem.name}}</a>'
          },
          {
            field: 'description',
            title: '{{"backupStorage.ts.DESCRIPTION" | translate}}',
            width: '30%'
          },
          {
            field: 'state',
            title: '{{"backupStorage.ts.STATE" | translate}}',
            width: '20%',
            template: '<span class="{{dataItem.stateLabel()}}">{{dataItem.state}}</span>'

          },
          {
            field: 'uuid',
            title: '{{"backupStorage.ts.UUID" | translate}}',
            width: '25%'
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
                value: $scope.model.current.attachedZoneUuids.join()
              });

              zoneMgr.query(qobj, (zones: MZone.Zone[], total:number)=> {
                options.success({
                  data: zones,
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
    static $inject = ['$scope', 'BackupStorageManager', 'backupStorageTypes', '$location'];

    constructor(private $scope : any, private bsMgr : BackupStorageManager, private backupStorageTypes: string[], private $location : ng.ILocationService) {
      $scope.model = new BackupStorageModel();
      $scope.oBackupStorageGrid = new OBackupStorageGrid($scope, bsMgr);
      $scope.action = new Action($scope, bsMgr);
      $scope.optionsSortBy = {
        fields: [
          {
            name: '{{"backupStorage.ts.Name" | translate}}',
            value: 'name'
          },
          {
            name: '{{"backupStorage.ts.Description" | translate}}',
            value: 'Description'
          },
          {
            name: '{{"backupStorage.ts.State" | translate}}',
            value: 'state'
          },
          {
            name: '{{"backupStorage.ts.Status" | translate}}',
            value: 'status'
          },
          {
            name: '{{"backupStorage.ts.Total Capacity" | translate}}',
            value: 'totalCapacity'
          },
          {
            name: '{{"backupStorage.ts.Available Capacity" | translate}}',
            value: 'availableCapacity'
          },
          {
            name: '{{"backupStorage.ts.Type" | translate}}',
            value: 'type'
          },
          {
            name: '{{"backupStorage.ts.Created Date" | translate}}',
            value: 'createDate'
          },
          {
            name: '{{"backupStorage.ts.Last Updated Date" | translate}}',
            value: 'lastOpDate'
          }
        ],

        done: (ret : Directive.SortByData) => {
          bsMgr.setSortBy(ret);
          $scope.oBackupStorageGrid.refresh();
        }
      };

      $scope.optionsSearch = {
        fields: ApiHeader.BackupStorageInventoryQueryable,
        name: 'BackupStorage',
        schema: {
          state: {
            type: Directive.SearchBoxSchema.VALUE_TYPE_LIST,
            list: ['Enabled', 'Disabled']
          },
          status: {
            type: Directive.SearchBoxSchema.VALUE_TYPE_LIST,
            list: ['Connecting', 'Connected', 'Disconnected']
          },
          type: {
            type: Directive.SearchBoxSchema.VALUE_TYPE_LIST,
            list: this.backupStorageTypes
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
          bsMgr.query(qobj, (BackupStorages : BackupStorage[], total:number)=> {
            $scope.oBackupStorageGrid.refresh(BackupStorages);
          });
        }
      };

      $scope.funcGridDoubleClick = (e) => {
        if (Utils.notNullnotUndefined($scope.model.current)) {
          var url = Utils.sprintf('/backupStorage/{0}', $scope.model.current.uuid);
          $location.path(url);
          e.preventDefault();
        }
      };

      $scope.filterBy = new FilterBy($scope, this.backupStorageTypes);

      $scope.funcSearch = (win : any) => {
        win.open();
      };

      $scope.funcCreateBackupStorage = (win : any) => {
        win.open();
      };

      $scope.funcDeleteBackupStorage = () => {
        $scope.deleteBackupStorage.open();
      };

      $scope.optionsDeleteBackupStorage = {
        title: 'DELETE BACKUP STORAGE',
        html: '<strong><p>Deleting Backup Storage will cause:</p></strong>' +
        '<ul><li><strong>Zones to which this backup storage has attached will be detached</strong></li>' +
        '<strong><p>those results are not recoverable</p></strong>',

        confirm: ()=> {
          bsMgr.delete($scope.model.current, (ret : any)=> {
            $scope.oBackupStorageGrid.deleteCurrent();
          });
        }
      };

      $scope.funcRefresh = ()=> {
        $scope.oBackupStorageGrid.refresh();
      };

      $scope.funcIsActionShow = ()=> {
        return !Utils.isEmptyObject($scope.model.current);
      };

      $scope.funcIsActionDisabled = ()=> {
        return Utils.notNullnotUndefined($scope.model.current) && $scope.model.current.isInProgress();
      };

      $scope.optionsCreateBackupStorage = {
        done: (data : any) => {
          var resultBs : BackupStorage;
          var chain = new Utils.Chain();
          chain.then(()=> {
            var placeHolder = new BackupStorage();
            placeHolder.name = data.info.name;
            placeHolder.uuid = data.info.resourceUuid = Utils.uuid();
            placeHolder.state = 'Enabled';
            placeHolder.status = 'Connecting';
            $scope.oBackupStorageGrid.add(placeHolder);
            bsMgr.create(data.info, (ret : BackupStorage)=> {
              resultBs = ret;
              chain.next();
            });
          }).then(()=>{
            angular.forEach(data.zones, (zone)=> {
              bsMgr.attach(resultBs, zone);
            });
            chain.next();
          }).done(()=> {
            $scope.oBackupStorageGrid.refresh();
          }).start();
        }
      };

      $scope.optionsAttachZone = {
        backupStorage: $scope.model.current,
        done: (zone: MZone.Zone)=> {
        }
      };

      $scope.optionsDetachZone = {
        backupStorage: $scope.model.current,
        done: (zone: MZone.Zone)=> {
        }
      };

      $scope.$watch(()=>{
        return $scope.model.current;
      }, ()=> {
        $scope.optionsAttachZone.backupStorage = $scope.model.current;
        $scope.optionsDetachZone.backupStorage = $scope.model.current;
      });
    }
  }

  export class CreateBackupStorageOptions {
    zone : MZone.Zone;
    done : (info : any)=>void;
  }


  export class CreateBackupStorageModel {
    name: string;
    zoneUuid: string;
    description: string;
    type: string;
    zoneList: kendo.ui.DropDownListOptions;
    url: string;
    canCreate() : boolean {
      return angular.isDefined(this.name) && angular.isDefined(this.type) &&
        Utils.notNullnotUndefined(this.url);
    }
  }

  export class CreateBackupStorage implements ng.IDirective {
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
    options: CreateBackupStorageOptions;
    $scope: any;

    open() {
      var win = this.$scope.winCreateBackupStorage__;
      var chain = new Utils.Chain();
      this.$scope.zoneList__.value([]);
      this.$scope.button.reset();
      this.$scope.cephMonGrid__.dataSource.data([]);
      this.$scope.fusionstorMonGrid__.dataSource.data([]);
      chain.then(()=> {
        this.api.getBackupStorageTypes((bsTypes: string[])=> {
          var types = [];
          angular.forEach(bsTypes, (item)=> {
            types.push({type: item});
          });
          this.$scope.typeList.dataSource.data(new kendo.data.ObservableArray(types));
          this.$scope.infoPage.type = bsTypes[0];
          chain.next();
        });
      }).then(()=> {
        if (Utils.notNullnotUndefined(this.options.zone)) {
          this.$scope.zoneListOptions__.dataSource.data(new kendo.data.ObservableArray([this.options.zone]));
          chain.next();
        } else {
          this.zoneMgr.query(new ApiHeader.QueryObject(), (zones : MZone.Zone[], total:number)=> {
            this.$scope.zoneListOptions__.dataSource.data(zones);
            chain.next();
          });
        }
      }).done(()=> {
        win.center();
        win.open();
      }).start();
    }

    constructor(private api : Utils.Api,
                private bsMgr : BackupStorageManager, private zoneMgr: MZone.ZoneManager) {
      this.scope = true;
      this.link = ($scope : any, $element, $attrs : any, $ctrl, $transclude) => {
        var instanceName = $attrs.zCreateBackupStorage;
        var parentScope = $scope.$parent;
        parentScope[instanceName] = this;
        this.options = new CreateBackupStorageOptions();
        var optionName = $attrs.zOptions;
        if (angular.isDefined(optionName)) {
          this.options = parentScope[optionName];
          $scope.$watch(()=> {
            return parentScope[optionName];
          }, ()=> {
            this.options = parentScope[optionName];
          });
        }

        $scope.cephMonGrid__ = {
          pageSize: 20,
          resizable: true,
          scrollable: true,
          pageable: true,
          columns: [
            {
              width: '20%',
              title: '',
              template: '<button type="button" class="btn btn-xs btn-default" ng-click="infoPage.delCephMon(dataItem.uid)"><i class="fa fa-times"></i></button>'
            },
            {
              field: 'url',
              title: '{{"backupStorage.ts.MON URL" | translate}}',
              width: '80%'
            }
          ],

          dataBound: (e)=> {
            var grid = e.sender;
            if (grid.dataSource.total() == 0 || grid.dataSource.totalPages() == 1) {
              grid.pager.element.hide();
            }
          },

          dataSource: new kendo.data.DataSource([])
        };

        $scope.fusionstorMonGrid__ = {
          pageSize: 20,
          resizable: true,
          scrollable: true,
          pageable: true,
          columns: [
            {
              width: '20%',
              title: '',
              template: '<button type="button" class="btn btn-xs btn-default" ng-click="infoPage.delFusionstorMon(dataItem.uid)"><i class="fa fa-times"></i></button>'
            },
            {
              field: 'url',
              title: '{{"backupStorage.ts.MON URL" | translate}}',
              width: '80%'
            }
          ],

          dataBound: (e)=> {
            var grid = e.sender;
            if (grid.dataSource.total() == 0 || grid.dataSource.totalPages() == 1) {
              grid.pager.element.hide();
            }
          },

          dataSource: new kendo.data.DataSource([])
        };


        var infoPage: Utils.WizardPage = $scope.infoPage  = {
          activeState: true,

          name: null,
          description: null,
          type: null,
          url: null,
          hostname: null,
          username: 'root',
          password: null,
          cephMonUrls: [],
          fusionstorMonUrls: [],

          isUrlValid() : boolean {
            if (this.type == 'SftpBackupStorage' && Utils.notNullnotUndefined(this.url)) {
              return this.url.indexOf('/') == 0;
            }
            return true;
          },

          canMoveToPrevious(): boolean {
            return false;
          },

          canMoveToNext(): boolean {
            if (this.type == 'SftpBackupStorage') {
              return Utils.notNullnotUndefined(this.name) && Utils.notNullnotUndefined(this.type)
                && Utils.notNullnotUndefined(this.url) && Utils.notNullnotUndefined(this.hostname)
                && Utils.notNullnotUndefined(this.username) && Utils.notNullnotUndefined(this.password)
                && this.isUrlValid();
            } else if (this.type == 'Ceph') {
              return $scope.cephMonGrid__.dataSource.data().length > 0;
            } else if (this.type == 'SS100-Storage' || this.type == 'Fusionstor') {
              return $scope.fusionstorMonGrid__.dataSource.data().length > 0;
            } else {
              return Utils.notNullnotUndefined(this.name) && Utils.notNullnotUndefined(this.type)
                && Utils.notNullnotUndefined(this.url);
            }
          },

          show(): void {
            this.getAnchorElement().tab('show');
          },

          getAnchorElement() : any {
            return $('.nav a[data-target="#createBackupStorageInfo"]');
          },

          active(): void {
            this.activeState = true;
          },

          isActive(): boolean {
            return this.activeState;
          },

          getPageName(): string {
            return 'createBackupStorageInfo';
          },

          addCephMon(): void {
            $scope.cephMonGrid__.dataSource.insert(0,
              {url: this.username + ":" + this.password + "@" + this.hostname});
            this.hostname = null;
            this.password = null;
          },

          addFusionstorMon(): void {
            $scope.fusionstorMonGrid__.dataSource.insert(0,
              {url: this.username + ":" + this.password + "@" + this.hostname});
            this.hostname = null;
            this.password = null;
          },

          canAddMon() : boolean {
            return Utils.notNullnotUndefined(this.username) && Utils.notNullnotUndefined(this.hostname)
              && Utils.notNullnotUndefined(this.password);
          },

          delCephMon(uid: string) : void {
            var row = $scope.cephMonGrid__.dataSource.getByUid(uid);
            $scope.cephMonGrid__.dataSource.remove(row);
          },

          delFusionstorMon(uid: string) : void {
            var row = $scope.fusionstorMonGrid__.dataSource.getByUid(uid);
            $scope.fusionstorMonGrid__.dataSource.remove(row);
          },

          reset() : void {
            this.name = Utils.shortHashName("bs");
            this.description = null;
            this.type = null;
            this.hostname = null;
            this.username = 'root';
            this.password = null;
            this.url = null;
            this.activeState = false;
            this.cephMonUrls = [];
            this.fusionstorMonUrls = [];
          }
        } ;

        var zonePage: Utils.WizardPage = $scope.zonePage = {
          activeState: false,

          canMoveToPrevious(): boolean {
            return true;
          },
          canMoveToNext(): boolean {
            return true;
          },

          getAnchorElement() : any {
            return $('.nav a[data-target="#createBackupStorageZone"]');
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
            return 'createBackupStorageZone';
          },

          reset() : void {
            this.activeState = false;
          },

          hasZone() : boolean {
            return $scope.zoneListOptions__.dataSource.data().length > 0;
          }
        };

        var mediator : Utils.WizardMediator = $scope.mediator = {
          currentPage: infoPage,
          movedToPage: (page: Utils.WizardPage) => {
            $scope.mediator.currentPage = page;
          },

          finishButtonName: (): string =>{
            return "Add";
          },

          finish: ()=> {
            if (Utils.notNullnotUndefined(this.options.done)) {
              angular.forEach($scope.cephMonGrid__.dataSource.data(), (it)=>{
                $scope.infoPage.cephMonUrls.push(it.url);
              });

              angular.forEach($scope.fusionstorMonGrid__.dataSource.data(), (it)=>{
                $scope.infoPage.fusionstorMonUrls.push(it.url);
              });

              this.options.done({
                info: infoPage,
                zones: $scope.zoneList__.dataItems()
              });
            }

            $scope.winCreateBackupStorage__.close();
          }
        };

        $scope.button = new Utils.WizardButton([
          infoPage, zonePage
        ], mediator);

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

        $scope.winCreateBackupStorageOptions__ = {
          width: '750px',
          //height: '780px',
          animation: false,
          modal: true,
          draggable: false,
          resizable: false
        };

        $scope.zoneListOptions__ = {
          dataSource: new kendo.data.DataSource({data: []}),
          dataTextField: "name",
          dataValueField: "uuid",
          itemTemplate: '<div style="color: black"><span class="z-label">Name:</span><span>#: name #</span></div>' +
          '<div style="color: black"><span class="z-label">Type:</span><span>#: type #</span></div>' +
          '<div style="color: black"><span class="z-label">URL:</span><span>#: url #</span></div>' +
          '<div style="color: black"><span class="z-label">UUID:</span><span>#: uuid #</span></div>'
        };

        this.$scope = $scope;
      };
      this.restrict = 'EA';
      this.replace = true;
      this.templateUrl = '/static/templates/backupStorage/createBackupStorage.html';
    }
  }

  export class AttachZone implements ng.IDirective {
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
      this.$scope.zoneList__.value([]);
      var chain  = new Utils.Chain();
      chain.then(()=> {
        var qobj = new ApiHeader.QueryObject();
        qobj.conditions = [
          {
            name: 'uuid',
            op: 'not in',
            value: this.options.backupStorage.attachedZoneUuids.join()
          }
        ];

        this.zoneMgr.query(qobj, (zones: MZone.Zone[])=>{
          this.$scope.zoneListOptions__.dataSource.data(zones);
          chain.next();
        });
      }).done(()=>{
        this.$scope.attachZone__.center();
        this.$scope.attachZone__.open();
      }).start();
    }

    constructor(private zoneMgr: MZone.ZoneManager, private bsMgr: BackupStorageManager) {
      this.scope = true;
      this.restrict = 'EA';
      this.replace = true;
      this.templateUrl = '/static/templates/backupStorage/attachZone.html';
      this.link = ($scope : any, $element, $attrs : any, $ctrl, $transclude) => {
        var parent = $scope.$parent;
        parent[$attrs.zBackupStorageAttachZone] = this;
        this.options = parent[$attrs.zOptions];

        $scope.zoneListOptions__ = {
          dataSource: new kendo.data.DataSource({data: []}),
          dataTextField: "name",
          dataValueField: "uuid",
          itemTemplate: '<div style="color: black"><span class="z-label">Name:</span><span>#: name #</span></div>' +
          '<div style="color: black"><span class="z-label">UUID:</span><span>#: uuid #</span></div>',

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
          $scope.attachZone__.close();
        };

        $scope.done = () => {
          var zones : MZone.Zone = $scope.zoneList__.dataItems();
          angular.forEach(zones, (zone: MZone.Zone)=> {
            bsMgr.attach(this.options.backupStorage, zone, ()=> {
              if (Utils.notNullnotUndefined(this.options.done)) {
                this.options.done(zone);
              }
            });
          });

          $scope.attachZone__.close();
        };

        this.$scope = $scope;
      }
    }
  }

  export class DetachZoneOptions {
    backupStorage: BackupStorage;
    done: (bs : any)=>void;
  }


  export class DetachZone implements ng.IDirective {
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

    options : DetachZoneOptions;
    $scope: any;

    open() {
      this.$scope.zoneList__.value([]);
      var chain  = new Utils.Chain();
      chain.then(()=> {
        var qobj = new ApiHeader.QueryObject();
        qobj.conditions = [
          {
            name: 'uuid',
            op: 'in',
            value: this.options.backupStorage.attachedZoneUuids.join()
          }
        ];

        this.zoneMgr.query(qobj, (zones: MZone.Zone[])=>{
          this.$scope.zoneListOptions__.dataSource.data(zones);
          chain.next();
        });
      }).done(()=>{
        this.$scope.detachZone__.center();
        this.$scope.detachZone__.open();
      }).start();
    }


    constructor(private bsMgr : MBackupStorage.BackupStorageManager, private zoneMgr: MZone.ZoneManager) {
      this.scope = true;
      this.restrict = 'EA';
      this.replace = true;
      this.templateUrl = '/static/templates/backupStorage/detachZone.html';
      this.link = ($scope : any, $element, $attrs : any, $ctrl, $transclude) => {
        var parent = $scope.$parent;
        parent[$attrs.zBackupStorageDetachZone] = this;
        this.options = parent[$attrs.zOptions];
        this.$scope = $scope;

        $scope.uuid = null;
        $scope.zoneListOptions__ = {
          dataSource: new kendo.data.DataSource({data: []}),
          dataTextField: "name",
          dataValueField: "uuid",
          itemTemplate: '<div style="color: black"><span class="z-label">Name:</span><span>#: name #</span></div>' +
          '<div style="color: black"><span class="z-label">UUID:</span><span>#: uuid #</span></div>',

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
          $scope.detachZone__.close();
        };

        $scope.done = () => {
          var zones : MZone.Zone[] = $scope.zoneList__.dataItems();
          angular.forEach(zones, (zone: MZone.Zone)=> {
            bsMgr.detach(this.options.backupStorage, zone, ()=>{
              if (Utils.notNullnotUndefined(this.options.done)) {
                this.options.done(zone);
              }
            });
          });

          $scope.detachZone__.close();
        };

        $scope.detachZoneOptions__ = {
          width: '600px'
        };
      }
    }
  }
}

angular.module('root').factory('BackupStorageManager', ['Api', '$rootScope', (api, $rootScope)=> {
  return new MBackupStorage.BackupStorageManager(api, $rootScope);
}]).directive('zCreateBackupStorage', ['Api', 'BackupStorageManager', 'ZoneManager', (api, bsMgr, zoneMgr)=> {
  return new MBackupStorage.CreateBackupStorage(api, bsMgr, zoneMgr);
}]).directive('zBackupStorageAttachZone', ['ZoneManager', 'BackupStorageManager', (zoneMgr, bsMgr)=> {
  return new MBackupStorage.AttachZone(zoneMgr, bsMgr);
}]).directive('zBackupStorageDetachZone', ['BackupStorageManager', 'ZoneManager', (bsMgr, zoneMgr)=> {
  return new MBackupStorage.DetachZone(bsMgr, zoneMgr);
}]).config(['$routeProvider', function(route) {
  route.when('/backupStorage', {
    templateUrl: '/static/templates/backupStorage/backupStorage.html',
    controller: 'MBackupStorage.Controller',
    resolve: {
      backupStorageTypes: function($q : ng.IQService, Api : Utils.Api) {
        var defer = $q.defer();
        Api.getBackupStorageTypes((bsTypes: string[])=> {
          defer.resolve(bsTypes);
        });
        return defer.promise;
      }
    }
  }).when('/backupStorage/:uuid', {
    templateUrl: '/static/templates/backupStorage/details.html',
    controller: 'MBackupStorage.DetailsController',
    resolve: {
      current: function($q : ng.IQService, $route: any, BackupStorageManager: MBackupStorage.BackupStorageManager) {
        var defer = $q.defer();
        var qobj = new ApiHeader.QueryObject();
        var uuid = $route.current.params.uuid;
        qobj.addCondition({name: 'uuid', op: '=', value: uuid});
        BackupStorageManager.query(qobj, (bss: MBackupStorage.BackupStorage[])=>{
          var bs = bss[0];
          defer.resolve(bs);
        });
        return defer.promise;
      }
    }
  });
}]);

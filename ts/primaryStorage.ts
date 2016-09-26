
/// <reference path="d.ts/angularjs/angular.d.ts" />
/// <reference path="d.ts/kendo.all.d.ts" />

module MPrimaryStorage {
  export class PrimaryStorage extends ApiHeader.PrimaryStorageInventory {
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

    updateObservableObject(inv : ApiHeader.PrimaryStorageInventory) {
      // self : ObservableObject
      var self : any = this;
      self.set('uuid', inv.uuid);
      self.set('name', inv.name);
      self.set('description', inv.description);
      self.set('zoneUuid', inv.zoneUuid);
      self.set('url', inv.url);
      self.set('totalCapacity', inv.totalCapacity);
      self.set('availableCapacity', inv.availableCapacity);
      self.set('type', inv.type);
      self.set('state', inv.state);
      self.set('status', inv.status);
      self.set('mountPath', inv.mountPath);
      self.set('attachedClusterUuids', inv.attachedClusterUuids);
      self.set('createDate', inv.createDate);
      self.set('lastOpDate', inv.lastOpDate);
    }
  }

  export class PrimaryStorageManager {
    static $inject = ['Api', '$rootScope'];

    constructor(private api : Utils.Api, private $rootScope: ng.IRootScopeService) {
    }

    private sortBy : Directive.SortByData;

    setSortBy(sortBy : Directive.SortByData) {
      this.sortBy = sortBy;
    }

    private wrap(PrimaryStorage : PrimaryStorage) : any {
      return new kendo.data.ObservableObject(PrimaryStorage);
    }

    create(ps : any, done : (ret : PrimaryStorage)=>void) {
      var msg : any = null;
      if (ps.type == 'NFS') {
        msg = new ApiHeader.APIAddNfsPrimaryStorageMsg();
        msg.type = 'NFS';
      } else if (ps.type == 'SimulatorPrimaryStorage') {
        msg = new ApiHeader.APIAddSimulatorPrimaryStorageMsg();
        msg.type = 'SimulatorPrimaryStorage';
      } else if (ps.type == 'IscsiFileSystemBackendPrimaryStorage') {
        msg = new ApiHeader.APIAddIscsiFileSystemBackendPrimaryStorageMsg();
        msg.chapPassword = ps.chapPassword;
        msg.chapUsername = ps.chapUsername;
        msg.sshUsername = ps.sshUsername;
        msg.sshPassword = ps.sshPassword;
        msg.hostname = ps.hostname;
      } else if (ps.type == 'LocalStorage') {
        msg = new ApiHeader.APIAddLocalPrimaryStorageMsg();
        msg.type = 'LocalStorage';
      } else if (ps.type == 'Ceph') {
        msg = new ApiHeader.APIAddCephPrimaryStorageMsg();
        msg.type = 'Ceph';
        msg.monUrls = ps.cephMonUrls;
      } else if (ps.type == 'SS100-Storage' || ps.type == 'Fusionstor') {
        msg = new ApiHeader.APIAddFusionstorPrimaryStorageMsg();
        msg.type = ps.type;
        msg.monUrls = ps.fusionstorMonUrls;
      } else if(ps.type == 'SharedMountPoint'){
        msg = new ApiHeader.APIAddSharedMountPointPrimaryStorageMsg();
      }
      msg.name = ps.name;
      msg.description = ps.description;
      msg.zoneUuid = ps.zoneUuid;
      msg.url = ps.url;
      this.api.asyncApi(msg, (ret : ApiHeader.APIAddPrimaryStorageEvent)=> {
        var c = new PrimaryStorage();
        angular.extend(c, ret.inventory);
        done(this.wrap(c));
        this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
          msg: Utils.sprintf('Created new Primary Storage: {0}',c.name),
          link: Utils.sprintf('/#/primaryStorage/{0}', c.uuid)
        });
      });
    }

    query(qobj : ApiHeader.QueryObject, callback : (pss : PrimaryStorage[], total: number) => void) : void {
      var msg = new ApiHeader.APIQueryPrimaryStorageMsg();
      msg.count = qobj.count === true;
      msg.start = qobj.start;
      msg.limit = qobj.limit;
      msg.replyWithCount = true;
      msg.conditions = qobj.conditions ? qobj.conditions : [];
      if (Utils.notNullnotUndefined(this.sortBy) && this.sortBy.isValid()) {
        msg.sortBy = this.sortBy.field;
        msg.sortDirection = this.sortBy.direction;
      }
      this.api.syncApi(msg, (ret : ApiHeader.APIQueryPrimaryStorageReply)=>{
        var pris = [];
        ret.inventories.forEach((inv : ApiHeader.PrimaryStorageInventory)=> {
          var c = new PrimaryStorage();
          angular.extend(c, inv);
          pris.push(this.wrap(c));
        });
        callback(pris, ret.total);
      });
    }

    disable(ps : PrimaryStorage) {
      ps.progressOn();
      var msg = new ApiHeader.APIChangePrimaryStorageStateMsg();
      msg.stateEvent = 'disable';
      msg.uuid = ps.uuid;
      this.api.asyncApi(msg, (ret : ApiHeader.APIChangePrimaryStorageStateEvent) => {
        ps.updateObservableObject(ret.inventory);
        ps.progressOff();
        this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
          msg: Utils.sprintf('Disabled Primary Storage: {0}',ps.name),
          link: Utils.sprintf('/#/primaryStorage/{0}', ps.uuid)
        });
      });
    }

    reconnect(ps : PrimaryStorage) {
      ps.progressOn();
      var msg = new ApiHeader.APIReconnectPrimaryStorageMsg();
      msg.uuid = ps.uuid;
      ps.status = 'Connecting';
      this.api.asyncApi(msg, (ret : ApiHeader.APIReconnectPrimaryStorageEvent) => {
        ps.updateObservableObject(ret.inventory);
        ps.progressOff();
        this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
          msg: Utils.sprintf('Reconnected Primary Storage: {0}',ps.name),
          link: Utils.sprintf('/#/primaryStorage/{0}', ps.uuid)
        });
      });
    }

    enable(ps : PrimaryStorage) {
      ps.progressOn();
      var msg = new ApiHeader.APIChangePrimaryStorageStateMsg();
      msg.stateEvent = 'enable';
      msg.uuid = ps.uuid;
      this.api.asyncApi(msg, (ret : ApiHeader.APIChangePrimaryStorageStateEvent) => {
        ps.updateObservableObject(ret.inventory);
        ps.progressOff();
        this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
          msg: Utils.sprintf('Enabled Primary Storage: {0}', ps.name),
          link: Utils.sprintf('/#/primaryStorage/{0}', ps.uuid)
        });
      });
    }

    attach(ps: PrimaryStorage, cluster: MCluster.Cluster, done: ()=>void=null) {
      ps.progressOn();
      var msg = new ApiHeader.APIAttachPrimaryStorageToClusterMsg();
      msg.clusterUuid = cluster.uuid;
      msg.primaryStorageUuid = ps.uuid;
      this.api.asyncApi(msg, (ret: ApiHeader.APIAttachPrimaryStorageToClusterEvent)=> {
        ps.updateObservableObject(ret.inventory);
        ps.progressOff();
        if (Utils.notNullnotUndefined(done)) {
          done();
        }
        this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
          msg: Utils.sprintf('Attached Primary Storage: {0} to Cluster: {1}', ps.name, cluster.name),
          link: Utils.sprintf('/#/primaryStorage/{0}', ps.uuid)
        });
      });
    }

    detach(ps: PrimaryStorage, cluster: MCluster.Cluster, done: ()=>void=null) {
      ps.progressOn();
      var msg = new ApiHeader.APIDetachPrimaryStorageFromClusterMsg();
      msg.clusterUuid = cluster.uuid;
      msg.primaryStorageUuid = ps.uuid;
      this.api.asyncApi(msg, (ret: ApiHeader.APIDetachPrimaryStorageFromClusterEvent)=> {
        ps.updateObservableObject(ret.inventory);
        ps.progressOff();
        if (Utils.notNullnotUndefined(done)) {
          done();
        }
        this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
          msg: Utils.sprintf('Detached Primary Storage: {0} from Cluster: {1}', ps.name, cluster.name),
          link: Utils.sprintf('/#/primaryStorage/{0}', ps.uuid)
        });
      });
    }

    delete(ps : PrimaryStorage, done : (ret : any)=>void) {
      ps.progressOn();
      var msg = new ApiHeader.APIDeletePrimaryStorageMsg();
      msg.uuid = ps.uuid;
      this.api.asyncApi(msg, (ret : any)=> {
        ps.progressOff();
        done(ret);
        this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
          msg: Utils.sprintf('Deleted Primary Storage: {0}', ps.name)
        });
      });
    }
  }

  export class PrimaryStorageModel extends Utils.Model {
    constructor() {
      super();
      this.current = new PrimaryStorage();
    }
  }

  class OPrimaryStorageGrid extends Utils.OGrid {
    constructor($scope: any, private psMgr : PrimaryStorageManager) {
      super();
      super.init($scope, $scope.primaryStorageGrid);
      this.options.columns = [
        {
          field: 'name',
          title: '{{"primaryStorage.ts.NAME" | translate}}',
          width: '10%',
          template: '<a href="/\\#/primaryStorage/{{dataItem.uuid}}">{{dataItem.name}}</a>'
        },
        {
          field: 'description',
          title: '{{"primaryStorage.ts.DESCRIPTION" | translate}}',
          width: '10%'
        },
        {
          field: 'url',
          title: 'URL',
          width: '16%'
        },
        {
          field: 'totalCapacity',
          title: '{{"primaryStorage.ts.TOTAL CAPACITY" | translate}}',
          width: '8%',
          template: '<span>{{dataItem.totalCapacity | size}}</span>'
        },
        {
          field: 'availableCapacity',
          title: '{{"primaryStorage.ts.AVAILABLE CAPACITY" | translate}}',
          width: '8%',
          template: '<span>{{dataItem.availableCapacity | size}}</span>'
        },
        {
          field: 'type',
          title: '{{"primaryStorage.ts.TYPE" | translate}}',
          width: '10%'
        },
        {
          field: 'state',
          title: '{{"primaryStorage.ts.STATE" | translate}}',
          width: '10%',
          template: '<span class="{{dataItem.stateLabel()}}">{{dataItem.state}}</span>'
        },
        {
          field: 'status',
          title: '{{"primaryStorage.ts.STATUS" | translate}}',
          width: '10%',
          template: '<span class="{{dataItem.statusLabel()}}">{{dataItem.status}}</span>'
        },
        {
          field: 'uuid',
          title: '{{"primaryStorage.ts.UUID" | translate}}',
          width: '20%'
        }
      ];

      this.options.dataSource.transport.read = (options)=> {
        var qobj = new ApiHeader.QueryObject();
        qobj.limit = options.data.take;
        qobj.start = options.data.pageSize * (options.data.page - 1);
        psMgr.query(qobj, (pss:PrimaryStorage[], total:number)=> {
          options.success({
            data: pss,
            total: total
          });
        });
      };
    }
  }

  class Action {
    enable() {
      this.psMgr.enable(this.$scope.model.current);
    }

    disable() {
      this.psMgr.disable(this.$scope.model.current);
    }

    addHost() {

    }

    reconnect() {
      this.psMgr.reconnect(this.$scope.model.current);
    }

    attachL2Network() {

    }

    detachL2Network() {

    }

    attachCluster() {
      this.$scope.attachCluster.open();
    }

    detachCluster() {
      this.$scope.detachCluster.open();
    }

    constructor(private $scope : any, private psMgr : PrimaryStorageManager) {
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
    static TYPE = 'type';

    constructor(private $scope : any, private psTypes: string[]) {
      this.fieldList = {
        dataSource: new kendo.data.DataSource({
          data: [
            {
              name: '{{"primaryStorage.ts.None" | translate}}',
              value: FilterBy.NONE
            },
            {
              name: '{{"primaryStorage.ts.State" | translate}}',
              value: FilterBy.STATE
            },
            {
              name: '{{"primaryStorage.ts.Type" | translate}}',
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
        } else if (this.field == FilterBy.TYPE) {
          this.valueList.dataSource.data(this.psTypes);
        }
      });
    }

    confirm (popover : any) {
      this.$scope.oPrimaryStorageGrid.setFilter(this.toKendoFilter());
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
    static $inject = ['$scope', 'PrimaryStorageManager', '$routeParams', 'Tag', 'current', 'ClusterManager'];

    private loadSelf(uuid : string) {
      var qobj = new ApiHeader.QueryObject();
      qobj.addCondition({name: 'uuid', op: '=', value: uuid});
      this.psMgr.query(qobj, (pss : PrimaryStorage[], total:number)=> {
        this.$scope.model.current = pss[0];
      });
    }

    constructor(private $scope : any, private psMgr : PrimaryStorageManager, private $routeParams : any,
                private tagService : Utils.Tag, current: PrimaryStorage, clusterMgr: MCluster.ClusterManager) {
      $scope.model = new PrimaryStorageModel();
      $scope.model.current = current;

      $scope.funcDelete = (win : any) => {
        win.open();
      };

      $scope.action = new Action($scope, psMgr);

      $scope.funcRefresh = ()=> {
        this.loadSelf($scope.model.current.uuid);
      };

      $scope.funcToolbarShow = ()=> {
        return Utils.notNullnotUndefined($scope.model.current);
      };

      $scope.optionsDeletePrimaryStorage = {
        title: 'DELETE PRIMARY STORAGE',
        html: '<strong><p>Deleting Primary Storage will cause:</p></strong>' +
        '<ul><li><strong>Clusters to which this primary storage has attached will be detached</strong></li>' +
        '<li><strong>VMs which has volumes on this primary storage will be deleted</strong></li></ul>' +
        '<strong><p>those results are not recoverable</p></strong>',
        confirm: ()=> {
          psMgr.delete($scope.model.current, (ret : any)=> {
            $scope.model.resetCurrent();
          });
        }
      };

      $scope.optionsTag = {
        tags: [],
        createTag: (item)=> {
          this.tagService.createTag(item.tag, $scope.model.current.uuid, ApiHeader.TagResourceTypePrimaryStorageVO, (ret : ApiHeader.TagInventory)=> {
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
        primaryStorage: $scope.model.current,
        done: (cluster: MCluster.Cluster)=> {
          $scope.optionsClusterGrid.dataSource.insert(0, cluster);
        }
      };

      $scope.optionsDetachCluster = {
        primaryStorage: $scope.model.current,
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
            title: '{{"primaryStorage.ts.NAME" | translate}}',
            width: '20%',
            template: '<a href="/\\#/cluster/{{dataItem.uuid}}">{{dataItem.name}}</a>'
          },
          {
            field: 'description',
            title: '{{"primaryStorage.ts.DESCRIPTION" | translate}}',
            width: '20%'
          },
          {
            field: 'state',
            title: '{{"primaryStorage.ts.STATE" | translate}}',
            width: '20%',
            template: '<span class="{{dataItem.stateLabel()}}">{{dataItem.state}}</span>'

          },
          {
            field: 'hypervisorType',
            title: '{{"primaryStorage.ts.HYPERVISOR" | translate}}',
            width: '20%'
          },
          {
            field: 'uuid',
            title: '{{"primaryStorage.ts.UUID" | translate}}',
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
    static $inject = ['$scope', 'PrimaryStorageManager', 'primaryStorageTypes', '$location'];

    constructor(private $scope : any, private psMgr : PrimaryStorageManager, private primaryStorageTypes: string[], private $location : ng.ILocationService) {
      $scope.model = new PrimaryStorageModel();
      $scope.oPrimaryStorageGrid = new OPrimaryStorageGrid($scope, psMgr);
      $scope.action = new Action($scope, psMgr);
      $scope.optionsSortBy = {
        fields: [
          {
            name: '{{"primaryStorage.ts.Name" | translate}}',
            value: 'name'
          },
          {
            name: '{{"primaryStorage.ts.Description" | translate}}',
            value: 'Description'
          },
          {
            name: '{{"primaryStorage.ts.State" | translate}}',
            value: 'state'
          },
          {
            name: '{{"primaryStorage.ts.Total Capacity" | translate}}',
            value: 'totalCapacity'
          },
          {
            name: '{{"primaryStorage.ts.Available Capacity" | translate}}',
            value: 'availableCapacity'
          },
          {
            name: '{{"primaryStorage.ts.Type" | translate}}',
            value: 'type'
          },
          {
            name: '{{"primaryStorage.ts.Created Date" | translate}}',
            value: 'createDate'
          },
          {
            name: '{{"primaryStorage.ts.Last Updated Date" | translate}}',
            value: 'lastOpDate'
          }
        ],

        done: (ret : Directive.SortByData) => {
          psMgr.setSortBy(ret);
          $scope.oPrimaryStorageGrid.refresh();
        }
      };

      $scope.optionsSearch = {
        fields: ApiHeader.PrimaryStorageInventoryQueryable,
        name: 'PrimaryStorage',
        schema: {
          state: {
            type: Directive.SearchBoxSchema.VALUE_TYPE_LIST,
            list: ['Enabled', 'Disabled']
          },
          type: {
            type: Directive.SearchBoxSchema.VALUE_TYPE_LIST,
            list: this.primaryStorageTypes
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
          psMgr.query(qobj, (PrimaryStorages : PrimaryStorage[], total:number)=> {
            $scope.oPrimaryStorageGrid.refresh(PrimaryStorages);
          });
        }
      };

      $scope.funcGridDoubleClick = (e) => {
        if (Utils.notNullnotUndefined($scope.model.current)) {
          var url = Utils.sprintf('/primaryStorage/{0}', $scope.model.current.uuid);
          $location.path(url);
          e.preventDefault();
        }
      };

      $scope.filterBy = new FilterBy($scope, this.primaryStorageTypes);

      $scope.funcSearch = (win : any) => {
        win.open();
      };

      $scope.funcCreatePrimaryStorage = (win : any) => {
        win.open();
      };

      $scope.funcDeletePrimaryStorage = () => {
        $scope.deletePrimaryStorage.open();
      };

      $scope.optionsDeletePrimaryStorage = {
        title: 'DELETE PRIMARY STORAGE',
        html: '<strong><p>Deleting Primary Storage will cause:</p></strong>' +
        '<ul><li><strong>Clusters to which this primary storage has attached will be detached</strong></li>' +
        '<li><strong>VMs which has volumes on this primary storage will be deleted</strong></li></ul>' +
        '<strong><p>those results are not recoverable</p></strong>',

        confirm: ()=> {
          psMgr.delete($scope.model.current, (ret : any)=> {
            $scope.oPrimaryStorageGrid.deleteCurrent();
          });
        }
      };

      $scope.funcRefresh = ()=> {
        $scope.oPrimaryStorageGrid.refresh();
      };

      $scope.funcIsActionShow = ()=> {
        return !Utils.isEmptyObject($scope.model.current);
      };

      $scope.funcIsActionDisabled = ()=> {
        return Utils.notNullnotUndefined($scope.model.current) && $scope.model.current.isInProgress();
      };

      $scope.optionsCreatePrimaryStorage = {
        done: (ps : PrimaryStorage) => {
          $scope.oPrimaryStorageGrid.add(ps);
        }
      };

      $scope.optionsAttachCluster = {
        primaryStorage: $scope.model.current,
        done: (cluster: MCluster.Cluster)=> {
        }
      };

      $scope.optionsDetachCluster = {
        primaryStorage: $scope.model.current,
        done: (cluster: MCluster.Cluster)=> {
        }
      };

      $scope.$watch(()=>{
        return $scope.model.current;
      }, ()=> {
        $scope.optionsAttachCluster.primaryStorage = $scope.model.current;
        $scope.optionsDetachCluster.primaryStorage = $scope.model.current;
      });
    }
  }

  export class CreatePrimaryStorageOptions {
    zone : MZone.Zone;
    done : (PrimaryStorage : PrimaryStorage)=>void;
  }

  export class CreatePrimaryStorage implements ng.IDirective {
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
    options: CreatePrimaryStorageOptions;
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
      var win = this.$scope.winCreatePrimaryStorage__;
      var chain = new Utils.Chain();
      this.$scope.clusterList__.value([]);
      this.$scope.cephMonGrid__.dataSource.data([]);
      this.$scope.fusionstorMonGrid__.dataSource.data([]);
      this.$scope.button.reset();
      chain.then(()=> {
        if (Utils.notNullnotUndefined(this.options.zone)) {
          this.$scope.zoneList.dataSource.data(new kendo.data.ObservableArray([this.options.zone]));
          this.$scope.infoPage.zoneUuid = this.options.zone.uuid;
          chain.next();
        } else {
          this.zoneMgr.query(new ApiHeader.QueryObject(), (zones : MZone.Zone[], total:number)=> {
            this.$scope.zoneList.dataSource.data(zones);
            if (zones.length > 0) {
              this.$scope.infoPage.zoneUuid = zones[0].uuid;
            }
            chain.next();
          });
        }
      }).then(()=> {
        this.api.getPrimaryStorageTypes((psTypes: string[])=> {
          var types = [];
          angular.forEach(psTypes, (item)=> {
            types.push({type: item});
          });
          this.$scope.typeList.dataSource.data(new kendo.data.ObservableArray(types));
          this.$scope.infoPage.type = psTypes[0];
          chain.next();
        });
      }).done(()=> {
        win.center();
        win.open();
      }).start();
    }

    constructor(private api : Utils.Api, private zoneMgr : MZone.ZoneManager,
                private psMgr : PrimaryStorageManager, private clusterMgr: MCluster.ClusterManager) {
      this.scope = true;
      this.link = ($scope : any, $element, $attrs : any, $ctrl, $transclude) => {
        var instanceName = $attrs.zCreatePrimaryStorage;
        var parentScope = $scope.$parent;
        parentScope[instanceName] = this;
        this.options = new CreatePrimaryStorageOptions();
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
              title: '{{"primaryStorage.ts.MON URL" | translate}}',
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
              title: '{{"primaryStorage.ts.MON URL" | translate}}',
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
          zoneUuid: null,
          description: null,
          type: null,
          url: null,
          chapUsername: null,
          chapPassword: null,
          hostname: null,
          sshUsername: 'root',
          sshPassword: null,
          cephMonUrls: [],
          fusionstorMonUrls: [],

          addCephMon(): void {
            $scope.cephMonGrid__.dataSource.insert(0,
              {url: this.sshUsername + ":" + this.sshPassword + "@" + this.hostname});
            this.hostname = null;
            this.sshPassword = null;
          },

          addFusionstorMon(): void {
            $scope.fusionstorMonGrid__.dataSource.insert(0,
              {url: this.sshUsername + ":" + this.sshPassword + "@" + this.hostname});
            this.hostname = null;
            this.sshPassword = null;
          },

          canAddMon() : boolean {
            return Utils.notNullnotUndefined(this.sshUsername) && Utils.notNullnotUndefined(this.hostname)
              && Utils.notNullnotUndefined(this.sshPassword);
          },

          delCephMon(uid: string) : void {
            var row = $scope.cephMonGrid__.dataSource.getByUid(uid);
            $scope.cephMonGrid__.dataSource.remove(row);
          },

          delFusionstorMon(uid: string) : void {
            var row = $scope.fusionstorMonGrid__.dataSource.getByUid(uid);
            $scope.fusionstorMonGrid__.dataSource.remove(row);
          },


          hasZone(): boolean {
            return $scope.zoneList.dataSource.data().length > 0;
          },

          isUrlValid() : boolean {
            if (this.type == 'NFS' && Utils.notNullnotUndefined(this.url)) {
              var paths = this.url.split(":");
              if (paths.length != 2) {
                return false;
              }

              var abspath = paths[1];
              if (abspath.indexOf('/') != 0) {
                return false;
              }

              return true;
            } else if (this.type == 'SharedMountPoint' || this.type == 'IscsiFileSystemBackendPrimaryStorage' || this.type == 'LocalStorage' && Utils.notNullnotUndefined(this.url)) {
              if (!!this.url) {
                if (this.url.indexOf('/') != 0) {
                  return false;
                }
              }

              return true;
            }

            return true;
          },

          canMoveToPrevious(): boolean {
            return false;
          },

          canMoveToNext(): boolean {
            if (this.type == 'Ceph') {
              return Utils.notNullnotUndefined(this.name) && Utils.notNullnotUndefined(this.zoneUuid) &&
                $scope.cephMonGrid__.dataSource.data().length > 0;
            } else if (this.type == 'SS100-Storage' || this.type == 'Fusionstor') {
              return Utils.notNullnotUndefined(this.name) && Utils.notNullnotUndefined(this.zoneUuid) &&
                $scope.fusionstorMonGrid__.dataSource.data().length > 0;
            }  else {
              return Utils.notNullnotUndefined(this.name) && Utils.notNullnotUndefined(this.zoneUuid)
                && Utils.notNullnotUndefined(this.type) && Utils.notNullnotUndefined(this.url) && this.isUrlValid();
            }
          },

          show(): void {
            this.getAnchorElement().tab('show');
          },

          getAnchorElement() : any {
            return $('.nav a[data-target="#createPrimaryStorageInfo"]');
          },

          active(): void {
            this.activeState = true;
          },

          isActive(): boolean {
            return this.activeState;
          },

          getPageName(): string {
            return 'createPrimaryStorageInfo';
          },

          reset() : void {
            this.name = Utils.shortHashName('ps');
            this.zoneUuid = null;
            this.description = null;
            this.type = null;
            this.activeState = false;
            this.chapPassword = null;
            this.chapUsername = null;
            this.sshPassword = null;
            this.sshUsername = 'root';
            this.hostname = null;
            this.cephMonUrls = [];
            this.fusionstorMonUrls = [];
          }
        };

        var clusterPage: Utils.WizardPage = $scope.clusterPage = {
          activeState: false,

          hasCluster(): boolean {
            return $scope.clusterListOptions__.dataSource.data().length > 0;
          },

          canMoveToPrevious(): boolean {
            return true;
          },
          canMoveToNext(): boolean {
            return true;
          },

          getAnchorElement() : any {
            return $('.nav a[data-target="#createPrimaryStorageCluster"]');
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
            return 'createPrimaryStorageCluster';
          },

          reset() : void {
            this.activeState = false;
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
            var resultPs : PrimaryStorage;
            var chain = new Utils.Chain();
            chain.then(()=> {
              angular.forEach($scope.cephMonGrid__.dataSource.data(), (it)=>{
                $scope.infoPage.cephMonUrls.push(it.url);
              });

              angular.forEach($scope.fusionstorMonGrid__.dataSource.data(), (it)=>{
                $scope.infoPage.fusionstorMonUrls.push(it.url);
              });

              psMgr.create(infoPage, (ret : PrimaryStorage)=> {
                resultPs = ret;
                chain.next();
              });
            }).then(()=>{
              var clusters = $scope.clusterList__.dataItems();
              angular.forEach(clusters, (cluster)=> {
                psMgr.attach(resultPs, cluster);
              });
              chain.next();
            }).done(()=> {
              if (Utils.notNullnotUndefined(this.options.done)) {
                this.options.done(resultPs);
              }
            }).start();

            $scope.winCreatePrimaryStorage__.close();
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
          template: '<div style="color: black"><span class="z-label">{{"primaryStorage.ts.Name" | translate}}</span>: #: name #</div>'+'<div style="color: black"><span class="z-label">{{"primaryStorage.ts.State" | translate}}:</span>#: state #</div>'+'<div style="color: black"><span class="z-label">UUID:</span> #: uuid #</div>'
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

        $scope.winCreatePrimaryStorageOptions__ = {
          width: '700px',
          //height: '620px',
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
      this.templateUrl = '/static/templates/primaryStorage/createPrimaryStorage.html';
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
            value: this.options.primaryStorage.attachedClusterUuids.join()
          },
          {
            name: 'zoneUuid',
            op: '=',
            value: this.options.primaryStorage.zoneUuid
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

    constructor(private clusterMgr: MCluster.ClusterManager, private psMgr: PrimaryStorageManager) {
      this.scope = true;
      this.restrict = 'EA';
      this.replace = true;
      this.templateUrl = '/static/templates/primaryStorage/attachCluster.html';
      this.link = ($scope : any, $element, $attrs : any, $ctrl, $transclude) => {
        var parent = $scope.$parent;
        parent[$attrs.zPrimaryStorageAttachCluster] = this;
        this.options = parent[$attrs.zOptions];

        $scope.clusterListOptions__ = {
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

        $scope.hasCluster = () => {
          return $scope.clusterListOptions__.dataSource.data().length > 0;
        };

        $scope.selectItemNum = 0;

        $scope.canProceed = ()=> {
          return $scope.selectItemNum > 0;
        };

        $scope.cancel = () => {
          $scope.attachCluster__.close();
        };

        $scope.done = () => {
          var clusters : MCluster.Cluster = $scope.clusterList__.dataItems();
          angular.forEach(clusters, (cluster: MCluster.Cluster)=> {
            psMgr.attach(this.options.primaryStorage, cluster, ()=> {
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
    primaryStorage: PrimaryStorage;
    done: (ps : any)=>void;
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
            value: this.options.primaryStorage.attachedClusterUuids.join()
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


    constructor(private psMgr : MPrimaryStorage.PrimaryStorageManager, private clusterMgr: MCluster.ClusterManager) {
      this.scope = true;
      this.restrict = 'EA';
      this.replace = true;
      this.templateUrl = '/static/templates/primaryStorage/detachCluster.html';
      this.link = ($scope : any, $element, $attrs : any, $ctrl, $transclude) => {
        var parent = $scope.$parent;
        parent[$attrs.zPrimaryStorageDetachCluster] = this;
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

        $scope.hasCluster = () => {
          return $scope.clusterListOptions__.dataSource.data().length > 0;
        };

        $scope.selectItemNum = 0;

        $scope.canProceed = ()=> {
          return $scope.selectItemNum > 0;
        };

        $scope.cancel = () => {
          $scope.detachCluster__.close();
        };

        $scope.done = () => {
          var clusters : MCluster.Cluster[] = $scope.clusterList__.dataItems();
          angular.forEach(clusters, (cluster: MCluster.Cluster)=> {
            psMgr.detach(this.options.primaryStorage, cluster, ()=>{
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

angular.module('root').factory('PrimaryStorageManager', ['Api', '$rootScope', (api, $rootScope)=> {
  return new MPrimaryStorage.PrimaryStorageManager(api, $rootScope);
}]).directive('zCreatePrimaryStorage', ['Api', 'ZoneManager', 'PrimaryStorageManager', 'ClusterManager', (api, zoneMgr, psMgr, clusterMgr)=> {
  return new MPrimaryStorage.CreatePrimaryStorage(api, zoneMgr, psMgr, clusterMgr);
}]).directive('zPrimaryStorageAttachCluster', ['ClusterManager', 'PrimaryStorageManager', (clusterMgr, psMgr)=> {
  return new MPrimaryStorage.AttachCluster(clusterMgr, psMgr);
}]).directive('zPrimaryStorageDetachCluster', ['PrimaryStorageManager', 'ClusterManager', (psMgr, clusterMgr)=> {
  return new MPrimaryStorage.DetachCluster(psMgr, clusterMgr);
}]).config(['$routeProvider', function(route) {
  route.when('/primaryStorage', {
    templateUrl: '/static/templates/primaryStorage/primaryStorage.html',
    controller: 'MPrimaryStorage.Controller',
    resolve: {
      primaryStorageTypes: function($q : ng.IQService, Api : Utils.Api) {
        var defer = $q.defer();
        Api.getPrimaryStorageTypes((psTypes: string[])=> {
          defer.resolve(psTypes);
        });
        return defer.promise;
      }
    }
  }).when('/primaryStorage/:uuid', {
    templateUrl: '/static/templates/primaryStorage/details.html',
    controller: 'MPrimaryStorage.DetailsController',
    resolve: {
      current: function($q : ng.IQService, $route: any, PrimaryStorageManager: MPrimaryStorage.PrimaryStorageManager) {
        var defer = $q.defer();
        var qobj = new ApiHeader.QueryObject();
        var uuid = $route.current.params.uuid;
        qobj.addCondition({name: 'uuid', op: '=', value: uuid});
        PrimaryStorageManager.query(qobj, (pss: MPrimaryStorage.PrimaryStorage[])=>{
          var ps = pss[0];
          defer.resolve(ps);
        });
        return defer.promise;
      }
    }
  });
}]);

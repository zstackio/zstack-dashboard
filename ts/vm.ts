
/// <reference path="d.ts/angularjs/angular.d.ts" />
/// <reference path="d.ts/kendo.all.d.ts" />

module MVmInstance {
  export class VmNic extends ApiHeader.VmNicInventory {
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

    updateObservableObject(inv : ApiHeader.VmNicInventory) {
      // self : ObservableObject
      var self : any = this;
      self.set('uuid', inv.uuid);
      self.set('vmInstanceUuid', inv.vmInstanceUuid);
      self.set('l3NetworkUuid', inv.l3NetworkUuid);
      self.set('ip', inv.ip);
      self.set('mac', inv.mac);
      self.set('netmask', inv.netmask);
      self.set('gateway', inv.gateway);
      self.set('metaData', inv.metaData);
      self.set('deviceId', inv.deviceId);
      self.set('createDate', inv.createDate);
      self.set('lastOpDate', inv.lastOpDate);
    }
  }

  export class VmInstance extends ApiHeader.VmInstanceInventory {
    static STATES = ['Running', 'Starting', 'Stopping', 'Stopped', 'Rebooting', 'Migrating', 'Unknown', 'Created'];
    managementIp: String;
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

    stateLabel() : string {
      if (this.state == 'Running') {
        return 'label label-success';
      } else if (this.state == 'Stopped') {
        return 'label label-danger';
      } else if (this.state == 'Unknown') {
        return 'label label-warning';
      } else {
        return 'label label-default';
      }
    }

    updateObservableObject(inv : ApiHeader.VmInstanceInventory) {
      // self : ObservableObject
      var self : any = this;
      self.set('uuid', inv.uuid);
      self.set('name', inv.name);
      self.set('description', inv.description);
      self.set('zoneUuid', inv.zoneUuid);
      self.set('clusterUuid', inv.clusterUuid);
      self.set('hypervisorType', inv.hypervisorType);
      self.set('state', inv.state);
      self.set('hostUuid', inv.hostUuid);
      self.set('lastHostUuid', inv.lastHostUuid);
      self.set('rootVolumeUuid', inv.rootVolumeUuid);
      self.set('defaultL3NetworkUuid', inv.defaultL3NetworkUuid);
      self.set('vmNics', inv.vmNics);
      self.set('type', inv.type);
      self.set('imageUuid', inv.imageUuid);
      self.set('allVolumes', inv.allVolumes);
      self.set('createDate', inv.createDate);
      self.set('lastOpDate', inv.lastOpDate);
      self.set('cpuSpeed', inv.cpuSpeed);
      self.set('cpuNum', inv.cpuNum);
      self.set('allocatorStrategy', inv.allocatorStrategy);
    }
  }

  export class VmInstanceManager {
    static $inject = ['Api', '$rootScope'];

    constructor(private api : Utils.Api, private $rootScope: ng.IRootScopeService) {
    }

    private sortBy : Directive.SortByData;

    setSortBy(sortBy : Directive.SortByData) {
      this.sortBy = sortBy;
    }

    wrap(obj: any) : any {
      return new kendo.data.ObservableObject(obj);
    }

    create(vm : any, done : (ret : VmInstance)=>void) {
      var msg : any = new ApiHeader.APICreateVmInstanceMsg();
      msg.name = vm.name;
      msg.description = vm.description;
      msg.instanceOfferingUuid = vm.instanceOfferingUuid;
      msg.imageUuid = vm.imageUuid;
      msg.l3NetworkUuids = vm.l3NetworkUuids;
      msg.rootDiskOfferingUuid = vm.rootDiskOfferingUuid;
      msg.dataDiskOfferingUuids = vm.dataDiskOfferingUuids;
      msg.zoneUuid = vm.zoneUuid;
      msg.clusterUuid = vm.clusterUuid;
      msg.hostUuid = vm.hostUuid;
      msg.resourceUuid = vm.resourceUuid;
      msg.defaultL3NetworkUuid = vm.defaultL3NetworkUuid;
      if (Utils.notNullnotUndefined(vm.hostname)) {
        msg.systemTags = ['hostname::' + vm.hostname];
      }
      this.api.asyncApi(msg, (ret : ApiHeader.APICreateVmInstanceEvent)=> {
        var c = new VmInstance();
        angular.extend(c, ret.inventory);
        done(this.wrap(c));
        this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
          msg: Utils.sprintf('Created new VmInstance: {0}',c.name),
          link: Utils.sprintf('/#/vm/{0}', c.uuid)
        });
      });
    }

    getConsole(vm: VmInstance, done: (ret: ApiHeader.ConsoleInventory)=>void) {
      var msg = new ApiHeader.APIRequestConsoleAccessMsg();
      msg.vmInstanceUuid = vm.uuid;
      this.api.asyncApi(msg, (ret: ApiHeader.APIRequestConsoleAccessEvent)=>{
        done(ret.inventory);
      });
    }

    query(qobj : ApiHeader.QueryObject, callback : (vms : VmInstance[], total: number) => void, allVm:boolean=false) : void {
      var msg = new ApiHeader.APIQueryVmInstanceMsg();
      msg.count = qobj.count === true;
      msg.start = qobj.start;
      msg.limit = qobj.limit;
      msg.replyWithCount = true;
      msg.conditions = qobj.conditions ? qobj.conditions : [];
      if (!allVm) {
        msg.conditions.push({
          name: "type",
          op: "=",
          value: "UserVm"
        });
      }

      if (Utils.notNullnotUndefined(this.sortBy) && this.sortBy.isValid()) {
        msg.sortBy = this.sortBy.field;
        msg.sortDirection = this.sortBy.direction;
      }
      this.api.syncApi(msg, (ret : ApiHeader.APIQueryVmInstanceReply)=>{
        var pris = [];
        ret.inventories.forEach((inv : ApiHeader.VmInstanceInventory)=> {
          var c = new VmInstance();
          angular.extend(c, inv);
          pris.push(this.wrap(c));
        });
        callback(pris, ret.total);
      });
    }

    stop(vm : VmInstance) {
      vm.progressOn();
      vm.state = 'Stopping';
      var msg = new ApiHeader.APIStopVmInstanceMsg();
      msg.uuid = vm.uuid;
      this.api.asyncApi(msg, (ret : ApiHeader.APIStopVmInstanceEvent) => {
        vm.updateObservableObject(ret.inventory);
        vm.progressOff();
        this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
          msg: Utils.sprintf('Stopped VmInstance: {0}',vm.name),
          link: Utils.sprintf('/#/vmInstance/{0}', vm.uuid)
        });
      });
    }

    start(vm : VmInstance) {
      vm.progressOn();
      vm.state = 'Starting';
      var msg = new ApiHeader.APIStartVmInstanceMsg();
      msg.uuid = vm.uuid;
      this.api.asyncApi(msg, (ret : ApiHeader.APIStartVmInstanceEvent) => {
        vm.updateObservableObject(ret.inventory);
        vm.progressOff();
        this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
          msg: Utils.sprintf('Started VmInstance: {0}', vm.name),
          link: Utils.sprintf('/#/vmInstance/{0}', vm.uuid)
        });
      });
    }

    reboot(vm: VmInstance) {
      vm.progressOn();
      vm.state = 'Rebooting';
      var msg = new ApiHeader.APIRebootVmInstanceMsg();
      msg.uuid = vm.uuid;
      this.api.asyncApi(msg, (ret : ApiHeader.APIRebootVmInstanceEvent) => {
        vm.updateObservableObject(ret.inventory);
        vm.progressOff();
        this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
          msg: Utils.sprintf('Rebooted VmInstance: {0}', vm.name),
          link: Utils.sprintf('/#/vmInstance/{0}', vm.uuid)
        });
      }, ()=>{
        vm.progressOff();
      });
    }

    delete(vm : VmInstance, done : (ret : any)=>void) {
      vm.progressOn();
      vm.state = 'Destroying';
      var msg = new ApiHeader.APIDestroyVmInstanceMsg();
      msg.uuid = vm.uuid;
      this.api.asyncApi(msg, (ret : any)=> {
        vm.progressOff();
        done(ret);
        this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
          msg: Utils.sprintf('Deleted VmInstance: {0}', vm.name)
        });
      });
    }

    migrate(vm: VmInstance, hostUuid: string, done: ()=>void) {
      vm.progressOn();
      vm.state = 'Migrating';
      var msg = new ApiHeader.APIMigrateVmMsg();
      msg.hostUuid = hostUuid;
      msg.vmInstanceUuid = vm.uuid;
      this.api.asyncApi(msg, (ret: ApiHeader.APIMigrateVmEvent)=>{
        vm.updateObservableObject(ret.inventory);
        vm.progressOff();
        if (Utils.notNullnotUndefined(done)) {
          done();
        }
        this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
          msg: Utils.sprintf('Migrated VmInstance: {0}', vm.name),
          link: Utils.sprintf('/#/vmInstance/{0}', vm.uuid)
        });
      });
    }

    attachVolume(vm: VmInstance, volUuid: string, done: (vol: ApiHeader.VolumeInventory)=>void) {
      vm.progressOn();
      var msg = new ApiHeader.APIAttachDataVolumeToVmMsg();
      msg.vmInstanceUuid = vm.uuid;
      msg.volumeUuid = volUuid;
      this.api.asyncApi(msg, (ret: ApiHeader.APIAttachDataVolumeToVmEvent)=>{
        vm.progressOff();
        if (Utils.notNullnotUndefined(done)) {
          done(ret.inventory);
        }
        this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
          msg: Utils.sprintf('Attached data volume to vm instance: {0}', vm.name),
          link: Utils.sprintf('/#/vmInstance/{0}', vm.uuid)
        });
      });
    }

    detachVolume(vm: VmInstance, volUuid: string, done: ()=>void) {
      vm.progressOn();
      var msg = new ApiHeader.APIDetachDataVolumeFromVmMsg();
      msg.uuid = volUuid;
      this.api.asyncApi(msg, (ret: ApiHeader.APIDetachDataVolumeFromVmEvent)=>{
        vm.progressOff();
        if (Utils.notNullnotUndefined(done)) {
          done();
        }
        this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
          msg: Utils.sprintf('Detached data volume from vm instance: {0}', vm.name),
          link: Utils.sprintf('/#/vmInstance/{0}', vm.uuid)
        });
      });
    }

    queryVmNic(qobj : ApiHeader.QueryObject, callback : (nics : VmNic[], total: number) => void) : void {
      var msg = new ApiHeader.APIQueryVmNicMsg();
      msg.count = qobj.count === true;
      msg.start = qobj.start;
      msg.limit = qobj.limit;
      msg.replyWithCount = true;
      msg.conditions = qobj.conditions ? qobj.conditions : [];

      if (Utils.notNullnotUndefined(this.sortBy) && this.sortBy.isValid()) {
        msg.sortBy = this.sortBy.field;
        msg.sortDirection = this.sortBy.direction;
      }
      this.api.syncApi(msg, (ret : ApiHeader.APIQueryVmNicReply)=>{
        var pris = [];
        ret.inventories.forEach((inv : ApiHeader.VmNicInventory)=> {
          var c = new VmNic();
          angular.extend(c, inv);
          pris.push(this.wrap(c));
        });
        callback(pris, ret.total);
      });
    }
  }

  export class VmInstanceModel extends Utils.Model {
    constructor() {
      super();
      this.current = new VmInstance();
    }
  }

  class OVmInstanceGrid extends Utils.OGrid {
    constructor($scope: any, private vmMgr : VmInstanceManager, private hostMgr : MHost.HostManager) {
      super();
      super.init($scope, $scope.vmGrid);
      this.options.columns = [
        {
          field: 'name',
          title: 'NAME',
          width: '20%',
          template: '<a href="/\\#/vmInstance/{{dataItem.uuid}}">{{dataItem.name}}</a>'
        },
        {
          field: 'description',
          title: 'DESCRIPTION',
          width: '20%'
        },
        {
          field: 'host',
          title: 'HOST',
          width: '20%',
          template: '<a href="/\\#/host/{{dataItem.hostUuid}}">{{dataItem.managementIp}}</a>'
        },
        {
          field: 'hypervisorType',
          title: 'HYPERVISOR',
          width: '20%'
        },
        {
          field: 'state',
          title: 'STATE',
          width: '20%',
          template: '<span class="{{dataItem.stateLabel()}}">{{dataItem.state}}</span>'
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
        vmMgr.query(qobj, (vms:VmInstance[], total:number)=> {
          options.success({
            data: vms,
            total: total
          });
          for (var j in vms) {
            var qobj = new ApiHeader.QueryObject();
            qobj.addCondition({name: 'uuid', op: '=', value: vms[j].hostUuid});
            this.hostMgr.query(qobj, (hosts : any, total:number)=> {
              for(var i in vms) {
                if (vms[i].hostUuid == hosts[0].uuid) {
                  vms[i].managementIp = hosts[0].managementIp;
                }
              }
            });
          }
        });
      };
    }
  }

  class Action {
    start() {
      this.vmMgr.start(this.$scope.model.current);
    }

    stop() {
      this.vmMgr.stop(this.$scope.model.current);
    }

    reboot() {
      this.vmMgr.reboot(this.$scope.model.current);
    }

    migrate() {
      this.$scope.migrateVm.open();
    }

    attachVolume() {
      this.$scope.attachVolume.open();
    }

    detachVolume() {
      this.$scope.detachVolume.open();
    }

    console() {
      this.$scope.console();
    }

    isActionShow(action) {
      if (!Utils.notNullnotUndefined(this.$scope.model.current) || Utils.isEmptyObject(this.$scope.model.current)) {
        return false;
      }

      if (action == 'start') {
        return this.$scope.model.current.state == 'Stopped';
      } else if (action == 'stop') {
        return this.$scope.model.current.state == 'Running';
      } else if (action == 'reboot') {
        return this.$scope.model.current.state == 'Running';
      } else if (action == 'migrate') {
        return this.$scope.model.current.state == 'Running';
      } else if (action == 'attachVolume') {
        return this.$scope.model.current.state == 'Running' || this.$scope.model.current.state == 'Stopped';
      } else if (action == 'detachVolume' && Utils.notNullnotUndefined(this.$scope.model.current)) {
        return this.$scope.model.current.allVolumes.length > 0;
      } else if (action == 'console' && Utils.notNullnotUndefined(this.$scope.model.current)) {
        return this.$scope.model.current.state == 'Starting' || this.$scope.model.current.state == 'Running' || this.$scope.model.current.state == 'Rebooting' || this.$scope.model.current.state == 'Stopping';
      } else {
        return false;
      }
    }

    constructor(private $scope : any, private vmMgr : VmInstanceManager) {
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
    static TYPE = 'hypervisorType';

    constructor(private $scope : any, private hypervisorTypes: string[]) {
      this.fieldList = {
        dataSource: new kendo.data.DataSource({
          data: [
            {
              name: 'None',
              value: FilterBy.NONE
            },
            {
              name: 'State',
              value: FilterBy.STATE
            },
            {
              name: 'HypervisorType',
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
          this.valueList.dataSource.data(VmInstance.STATES);
        } else if (this.field == FilterBy.TYPE) {
          this.valueList.dataSource.data(this.hypervisorTypes);
        }
      });
    }

    confirm (popover : any) {
      this.$scope.oVmInstanceGrid.setFilter(this.toKendoFilter());
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
    static $inject = ['$scope', 'VmInstanceManager', '$routeParams', 'Tag', 'current', 'ClusterManager', '$rootScope', '$window'];

    private loadSelf(uuid : string) {
      var qobj = new ApiHeader.QueryObject();
      qobj.addCondition({name: 'uuid', op: '=', value: uuid});
      this.vmMgr.query(qobj, (vms : VmInstance[], total:number)=> {
        this.$scope.model.current = vms[0];
      });
    }

    constructor(private $scope : any, private vmMgr : VmInstanceManager, private $routeParams : any,
                private tagService : Utils.Tag, vm: any, clusterMgr: MCluster.ClusterManager, $rootScope: any, $window: any) {
      var current = vm.vm;
      $scope.model = new VmInstanceModel();
      $scope.model.current = current;
      $scope.hostname = vm.hostname;

      $scope.funcDelete = (win : any) => {
        win.open();
      };

      $scope.action = new Action($scope, vmMgr);

      $scope.funcRefresh = ()=> {
        this.loadSelf($scope.model.current.uuid);
      };

      $scope.funcToolbarShow = ()=> {
        return Utils.notNullnotUndefined($scope.model.current);
      };

      $scope.funcDeleteVmInstance = () => {
        $scope.deleteVmInstance.open();
      };

      $scope.optionsDeleteVmInstance = {
        title: 'DELETE VM INSTANCE',
        btnType: 'btn-danger',
        width: '350px',

        description: ()=> {
          return current.name;
        },

        confirm: ()=> {
          vmMgr.delete($scope.model.current, (ret : any)=> {
            $scope.model.resetCurrent();
          });
        }
      };

      $scope.console = ()=> {
        vmMgr.getConsole(current, (inv: ApiHeader.ConsoleInventory)=>{
          var windowName = current.name + current.uuid;
          $window.open(Utils.sprintf('/static/templates/console/vnc_auto.html?host={0}&port={1}&token={2}', inv.hostname, inv.port, inv.token), windowName);
        });
      };

      $scope.optionsTag = {
        tags: [],
        createTag: (item)=> {
          this.tagService.createTag(item.tag, $scope.model.current.uuid, ApiHeader.TagResourceTypeVmInstanceVO, (ret : ApiHeader.TagInventory)=> {
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

      $scope.optionsMigrateVm = {
        vm: current
      };

      $scope.optionsAttachVolume = {
        vm: current,
        done: (vol : ApiHeader.VolumeInventory)=>{
          $scope.optionsVolumeGrid.dataSource.insert(0, vol);
        }
      };

      $scope.optionsDetachVolume = {
        vm: current,
        done: (vol : ApiHeader.VolumeInventory)=>{
          var ds = $scope.optionsVolumeGrid.dataSource;
          var cs = ds.data();
          for (var i=0; i<cs.length; i++) {
            var tcs = cs[i];
            if (vol.uuid == tcs.uuid) {
              var row = ds.getByUid(tcs.uid);
              ds.remove(row);
              break;
            }
          }
        }
      };

      $scope.optionsNicGrid = {
        pageSize: 20,
        resizable: true,
        scrollable: true,
        pageable: true,
        columns: [
          {
            field: 'deviceId',
            title: 'DEVICE ID',
            width: '4%'
          },
          {
            field: 'l3NetworkUuid',
            title: 'L3 Network',
            width: '20%',
            template: '<a href="/\\#/l3Network/{{dataItem.l3NetworkUuid}}">{{dataItem.l3NetworkUuid}}</a>'
          },
          {
            field: 'ip',
            title: 'IP',
            width: '14%'
          },
          {
            field: 'netmask',
            title: 'NETMASK',
            width: '14%'
          },
          {
            field: 'gateway',
            title: 'GATEWAY',
            width: '14%'
          },
          {
            field: 'mac',
            title: 'MAC',
            width: '14%'

          },
          {
            field: 'uuid',
            title: 'UUID',
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
          data: current.vmNics
        })
      };

      $scope.optionsVolumeGrid = {
        pageSize: 20,
        resizable: true,
        scrollable: true,
        pageable: true,
        columns: [
          {
            field: 'deviceId',
            title: 'DEVICE ID',
            width: '10%',
            template: '<a href="/\\#/volume/{{dataItem.uuid}}">{{dataItem.deviceId}}</a>'
          },
          {
            field: 'name',
            title: 'NAME',
            width: '18%'

          },
          {
            field: 'type',
            title: 'TYPE',
            width: '18%'
          },
          {
            field: 'state',
            title: 'STATE',
            width: '18%'
          },
          {
            field: 'status',
            title: 'STATUS',
            width: '18%'
          },
          {
            field: 'uuid',
            title: 'UUID',
            width: '18%'
          }
        ],

        dataBound: (e)=> {
          var grid = e.sender;
          if (grid.dataSource.totalPages() == 1) {
            grid.pager.element.hide();
          }
        },

        dataSource: new kendo.data.DataSource({
          data: current.allVolumes
        })
      };
    }
  }

  export class Controller {
    static $inject = ['$scope', 'VmInstanceManager', 'HostManager', 'hypervisorTypes', '$location', '$rootScope', '$window'];

    constructor(private $scope : any, private vmMgr : VmInstanceManager, private hostMgr : MHost.HostManager, private hypervisorTypes: string[],
                private $location : ng.ILocationService, private $rootScope : any, private $window) {
      $scope.model = new VmInstanceModel();
      $scope.oVmInstanceGrid = new OVmInstanceGrid($scope, vmMgr, hostMgr);
      $scope.action = new Action($scope, vmMgr);
      $scope.optionsSortBy = {
        fields: [
          {
            name: 'Name',
            value: 'name'
          },
          {
            name: 'Description',
            value: 'Description'
          },
          {
            name: 'State',
            value: 'state'
          },
          {
            name: 'Hypervisor',
            value: 'hypervisorType'
          },
          {
            name: 'Created Date',
            value: 'createDate'
          },
          {
            name: 'Last Updated Date',
            value: 'lastOpDate'
          }
        ],

        done: (ret : Directive.SortByData) => {
          vmMgr.setSortBy(ret);
          $scope.oVmInstanceGrid.refresh();
        }
      };

      $scope.optionsSearch = {
        fields: ApiHeader.VmInstanceInventoryQueryable,
        name: 'VmInstance',
        schema: {
          state: {
            type: Directive.SearchBoxSchema.VALUE_TYPE_LIST,
            list: VmInstance.STATES
          },
          hypervisorType: {
            type: Directive.SearchBoxSchema.VALUE_TYPE_LIST,
            list: this.hypervisorTypes
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
          vmMgr.query(qobj, (VmInstances : VmInstance[], total:number)=> {
            $scope.oVmInstanceGrid.refresh(VmInstances);
          });
        }
      };

      $scope.funcGridDoubleClick = (e) => {
        if (Utils.notNullnotUndefined($scope.model.current)) {
          var url = Utils.sprintf('/vmInstance/{0}', $scope.model.current.uuid);
          $location.path(url);
          e.preventDefault();
        }
      };

      $scope.filterBy = new FilterBy($scope, this.hypervisorTypes);

      $scope.funcSearch = (win : any) => {
        win.open();
      };

      $scope.funcCreateVmInstance = (win : any) => {
        win.open();
      };

      $scope.funcDeleteVmInstance = () => {
        $scope.deleteVmInstance.open();
      };

      $scope.optionsDeleteVmInstance = {
        title: 'DELETE VM INSTANCE',
        btnType: 'btn-danger',
        width: '350px',

        description: ()=> {
          return $scope.model.current.name;
        },

        confirm: ()=> {
          vmMgr.delete($scope.model.current, (ret : any)=> {
            $scope.oVmInstanceGrid.deleteCurrent();
          });
        }
      };

      $scope.funcRefresh = ()=> {
        $scope.oVmInstanceGrid.refresh();
      };

      $scope.funcIsActionShow = ()=> {
        return !Utils.isEmptyObject($scope.model.current);
      };

      $scope.funcIsActionDisabled = ()=> {
        return Utils.notNullnotUndefined($scope.model.current) && $scope.model.current.isInProgress();
      };

      $scope.optionsCreateVmInstance = {
        done: (info: any) => {
          var vm = new VmInstance();
          info.uuid = info.resourceUuid = Utils.uuid();
          info.state = 'Starting';
          angular.extend(vm, info);
          vm = vmMgr.wrap(vm);
          $scope.oVmInstanceGrid.add(vm);
          vmMgr.create(info, (ret: VmInstance)=>{
            $scope.oVmInstanceGrid.refresh();
          });
        }
      };

      $scope.console = ()=> {
        vmMgr.getConsole($scope.model.current, (inv: ApiHeader.ConsoleInventory)=>{
          var windowName = $scope.model.current.name + $scope.model.current.uuid;
          $window.open(Utils.sprintf('/static/templates/console/vnc_auto.html?host={0}&port={1}&token={2}', inv.hostname, inv.port, inv.token), windowName);
        });
      };

      $scope.optionsMigrateVm = {
        vm: null
      };

      $scope.optionsAttachVolume = {
        vm: null
      };

      $scope.optionsDetachVolume = {
        vm: null
      };

      $scope.$watch(()=>{
        return $scope.model.current;
      },()=>{
        if (Utils.notNullnotUndefined($scope.model.current)) {
          $scope.optionsMigrateVm.vm = $scope.model.current;
          $scope.optionsAttachVolume.vm = $scope.model.current;
          $scope.optionsDetachVolume.vm = $scope.model.current;
        }
      });
    }
  }

  export class MigrateVm implements ng.IDirective {
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
      this.$scope.hostOptions__.dataSource.data([]);
      this.$scope.hostUuid = null;
      var chain  = new Utils.Chain();
      chain.then(()=> {
        this.api.getVmMigrationCandidateHosts(this.options.vm.uuid, (hosts: ApiHeader.HostInventory[])=>{
          this.$scope.hostOptions__.dataSource.data(hosts);
          if (hosts.length > 0) {
            this.$scope.hostUuid = hosts[0].uuid;
          }
          chain.next();
        });
      }).done(()=>{
        this.$scope.migrateVm__.center();
        this.$scope.migrateVm__.open();
      }).start();
    }


    constructor(private api : Utils.Api, private vmMgr: MVmInstance.VmInstanceManager) {
      this.scope = true;
      this.restrict = 'EA';
      this.replace = true;
      this.templateUrl = '/static/templates/vm/migrateVm.html';
      this.link = ($scope : any, $element, $attrs : any, $ctrl, $transclude) => {
        var parent = $scope.$parent;
        parent[$attrs.zMigrateVmInstance] = this;
        this.options = parent[$attrs.zOptions];
        this.$scope = $scope;

        $scope.hostUuid = null;
        $scope.hostOptions__ = {
          dataSource: new kendo.data.DataSource({data: []}),
          dataTextField: "name",
          dataValueField: "uuid",
          template: '<div style="color: black"><span class="z-label">Name:</span><span>#: name #</span></div>' +
          '<div style="color: black"><span class="z-label">UUID:</span><span>#: uuid #</span></div>' +
          '<div style="color: black"><span class="z-label">Cluster UUID:</span><span>#: clusterUuid #</span></div>'
        };

        $scope.canProceed = ()=> {
          return Utils.notNullnotUndefined($scope.hostUuid);
        };

        $scope.cancel = () => {
          $scope.migrateVm__.close();
        };

        $scope.done = () => {
          vmMgr.migrate(this.options.vm, $scope.hostUuid, ()=> {
            if (this.options.done) {
              this.options.done();
            }
          });
          $scope.migrateVm__.close();
        };

        $scope.migrateVmOptions__ = {
          width: '600px'
        };
      }
    }
  }

  export class CreateVmInstanceOptions {
    done : (info:any)=>void;
  }


  export class CreateVmInstance implements ng.IDirective {
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
    options: CreateVmInstanceOptions;
    $scope: any;

    open() {
      var win = this.$scope.winCreateVmInstance__;
      var chain = new Utils.Chain();
      this.$scope.clusterOptions__.dataSource.data([]);
      this.$scope.hostOptions__.dataSource.data([]);
      this.$scope.l3NetworkOptions__.dataSource.data([]);
      this.$scope.diskOfferingOptions__.dataSource.data([]);
      this.$scope.l3NetworkList__.value([]);
      this.$scope.diskOfferingList__.value([]);
      this.$scope.button.reset();
      chain.then(()=> {
        var qobj = new ApiHeader.QueryObject();
        qobj.conditions = [
          {
            name: 'state',
            op: '=',
            value: 'Enabled'
          }
        ];
        this.instOfferingMgr.query(qobj, (instanceOfferings: MInstanceOffering.InstanceOffering[])=>{
          this.$scope.instanceOfferingOptions__.dataSource.data(instanceOfferings);
          chain.next();
        });
      }).then(()=>{
        var qobj = new ApiHeader.QueryObject();
        qobj.conditions = [
          {
            name: 'state',
            op: '=',
            value: 'Enabled'
          }
        ];
        this.diskOfferingMgr.query(qobj, (diskOfferings: MDiskOffering.DiskOffering[])=>{
          this.$scope.diskOfferingOptions__.dataSource.data(diskOfferings);
          this.$scope.rootDiskOfferingOptions__.dataSource.data(diskOfferings);
          chain.next();
        });
      }).then(()=>{
        var qobj = new ApiHeader.QueryObject();
        qobj.conditions = [
          {
            name: 'state',
            op: '=',
            value: 'Enabled'
          },
          {
            name: 'system',
            op: '=',
            value: 'false'
          }
        ];
        this.l3Mgr.query(qobj, (l3s: ML3Network.L3Network[])=> {
          this.$scope.l3NetworkOptions__.dataSource.data(l3s);
          chain.next();
        });
      }).then(()=>{
        var qobj = new ApiHeader.QueryObject();
        qobj.conditions = [];
        this.zoneMgr.query(qobj, (zones: MZone.Zone[])=> {
          //var zs = [{uuid: 'none'}];
          //zs = zs.concat(zones);
          this.$scope.zoneOptions__.dataSource.data(zones);
          chain.next();
        });
      }).then(()=>{
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
            value: 'Ready'
          },
          {
            name: 'system',
            op: '=',
            value: 'false'
          },
          {
            name: 'mediaType',
            op: 'in',
            value: ['RootVolumeTemplate', 'ISO'].join()
          }
        ];
        this.imageMgr.query(qobj, (images: MImage.Image[])=> {
          angular.forEach(images, (it)=>{
            if (!Utils.notNullnotUndefined(it.guestOsType)) {
              it.guestOsType = "";
            }
            this.$scope.infoPage.images[it.uuid] = it;
          });
          this.$scope.imageOptions__.dataSource.data(images);
          chain.next();
        });
      }).done(()=> {
        win.center();
        win.open();
      }).start();
    }

    constructor(private api : Utils.Api,
                private vmMgr : VmInstanceManager, private clusterMgr: MCluster.ClusterManager,
                private hostMgr: MHost.HostManager, private zoneMgr: MZone.ZoneManager,
                private instOfferingMgr: MInstanceOffering.InstanceOfferingManager, private diskOfferingMgr: MDiskOffering.DiskOfferingManager,
                private l3Mgr: ML3Network.L3NetworkManager, private imageMgr: MImage.ImageManager) {
      this.scope = true;
      this.link = ($scope : any, $element, $attrs : any, $ctrl, $transclude) => {
        var instanceName = $attrs.zCreateVmInstance;
        var parentScope = $scope.$parent;
        parentScope[instanceName] = this;
        this.options = new CreateVmInstanceOptions();
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
          instanceOfferingUuid: null,
          imageUuid: null,
          l3NetworkUuids: [],
          dataDiskOfferingUuids: [],
          rootDiskOfferingUuid: null,
          imageMediaType: null,
          images: {},
          defaultL3NetworkUuid:null,
          hostname: null,

          hasImage() : boolean {
            return $scope.imageOptions__.dataSource.data().length > 0;
          },

          hasInstanceOffering() : boolean {
            return $scope.instanceOfferingOptions__.dataSource.data().length > 0;
          },

          hasL3Network() : boolean {
            return $scope.l3NetworkOptions__.dataSource.data().length > 0;
          },

          canMoveToPrevious(): boolean {
            return false;
          },

          canMoveToNext(): boolean {
            if (this.imageMediaType == 'RootVolumeTemplate') {
              return Utils.notNullnotUndefined(this.name) && Utils.notNullnotUndefined(this.instanceOfferingUuid)
                && Utils.notNullnotUndefined(this.imageUuid) && this.l3NetworkUuids.length > 0;
            } else {
              return Utils.notNullnotUndefined(this.name) && Utils.notNullnotUndefined(this.instanceOfferingUuid)
                && Utils.notNullnotUndefined(this.imageUuid) && this.l3NetworkUuids.length > 0 && Utils.notNullnotUndefined(this.rootDiskOfferingUuid);
            }
          },

          show(): void {
            this.getAnchorElement().tab('show');
          },

          getAnchorElement() : any {
            return $('.nav a[data-target="#createVmInstanceInfo"]');
          },

          active(): void {
            this.activeState = true;
          },

          isActive(): boolean {
            return this.activeState;
          },

          getPageName(): string {
            return 'createVmInstanceInfo';
          },

          reset() : void {
            this.name = Utils.shortHashName('vm');
            this.description = null;
            this.imageUuid = null;
            this.dataDiskOfferingUuids = [];
            this.l3NetworkUuids = [];
            this.instanceOfferingUuid = null;
            this.activeState = false;
            this.rootDiskOfferingUuid = null;
            this.defaultL3NetworkUuid = null;
            this.images = {};
            this.hostname = null;
          }
        };

        var locationPage: Utils.WizardPage = $scope.locationPage = {
          activeState: false,

          zoneUuid: null,
          clusterUuid: null,
          hostUuid: null,

          canMoveToPrevious(): boolean {
            return true;
          },
          canMoveToNext(): boolean {
            return true;
          },

          getAnchorElement() : any {
            return $('.nav a[data-target="#createVmInstanceLocation"]');
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
            return 'createVmInstanceLocation';
          },

          reset() : void {
            this.activeState = false;
            this.zoneUuid = null;
            this.clusterUuid = null;
            this.hostUuid = null;
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
            $scope.infoPage.hostUuid = $scope.locationPage.hostUuid;
            $scope.infoPage.clusterUuid = $scope.locationPage.clusterUuid;
            $scope.infoPage.zoneUuid = $scope.locationPage.zoneUuid;
            this.options.done(infoPage);

            $scope.winCreateVmInstance__.close();
          }
        };

        $scope.button = new Utils.WizardButton([
          infoPage, locationPage
        ], mediator);

        $scope.$watch(()=>{
          return $scope.locationPage.zoneUuid;
        }, ()=>{
          var zuuid = $scope.locationPage.zoneUuid;
          if (Utils.notNullnotUndefined(zuuid)) {
            var qobj = new ApiHeader.QueryObject();
            qobj.conditions = [
              {
                name: 'zoneUuid',
                op: '=',
                value: zuuid
              }
            ];
            this.clusterMgr.query(qobj, (clusters: MCluster.Cluster[])=>{
              this.$scope.clusterOptions__.dataSource.data(clusters);
            });
          }
        });

        $scope.$watch(()=>{
          return $scope.locationPage.clusterUuid;
        }, ()=>{
          var clusterUuid = $scope.locationPage.clusterUuid;
          if (Utils.notNullnotUndefined(clusterUuid)) {
            var qobj = new ApiHeader.QueryObject();
            qobj.conditions = [
              {
                name: 'clusterUuid',
                op: '=',
                value: clusterUuid
              }
            ];
            this.hostMgr.query(qobj, (hosts: MHost.Host[])=> {
              this.$scope.hostOptions__.dataSource.data(hosts);
            });
          }
        });

        $scope.$watch(()=>{
          return $scope.infoPage.imageUuid;
        }, ()=>{
          if (!Utils.notNullnotUndefined($scope.infoPage.imageUuid)) {
            return;
          }

          var img = $scope.infoPage.images[$scope.infoPage.imageUuid];
          if (Utils.notNullnotUndefined(img)) {
            $scope.infoPage.imageMediaType = img.mediaType;
          }
        });

        $scope.zoneOptions__ = {
          dataSource: new kendo.data.DataSource({data: []}),
          dataTextField: "name",
          dataValueField: "uuid",
          template: "<div style='color: black'><span class='z-label'>Name</span>: #: name #</div><div style='color: black'><span class='z-label'>State:</span>#: state #</div><div style='color: black'><span class='z-label'>UUID:</span> #: uuid #</div>",
          optionLabel: ""
        };

        $scope.winCreateVmInstanceOptions__ = {
          width: '700px',
          //height: '620px',
          animation: false,
          modal: true,
          draggable: false,
          resizable: false
        };

        $scope.clusterOptions__ = {
          dataSource: new kendo.data.DataSource({data: []}),
          optionLabel: "",
          dataTextField: "name",
          dataValueField: "uuid",
          template: '<div style="color: black"><span class="z-label">Name:</span><span>#: name #</span></div>' +
          '<div style="color: black"><span class="z-label">HYPERVISOR:</span><span>#: hypervisorType #</span></div>' +
          '<div style="color: black"><span class="z-label">UUID:</span><span>#: uuid #</span></div>'
        };

        $scope.hostOptions__ = {
          dataSource: new kendo.data.DataSource({data: []}),
          optionLabel: "",
          dataTextField: "name",
          dataValueField: "uuid",
          template: '<div style="color: black"><span class="z-label">Name:</span><span>#: name #</span></div>' +
          '<div style="color: black"><span class="z-label">State:</span><span>#: state #</span></div>' +
          '<div style="color: black"><span class="z-label">Status:</span><span>#: status #</span></div>' +
          '<div style="color: black"><span class="z-label">UUID:</span><span>#: uuid #</span></div>'
        };

        $scope.instanceOfferingOptions__ = {
          dataSource: new kendo.data.DataSource({data: []}),
          dataTextField: "name",
          dataValueField: "uuid",
          template: '<div style="color: black"><span class="z-label">Name:</span><span>#: name #</span></div>' +
          '<div style="color: black"><span class="z-label">CPU Number:</span><span>#: cpuNum #</span></div>' +
          '<div style="color: black"><span class="z-label">CPU Speed:</span><span>#: cpuSpeed #</span></div>' +
          '<div style="color: black"><span class="z-label">Memory:</span><span>#: memorySize #</span></div>' +
          '<div style="color: black"><span class="z-label">UUID:</span><span>#: uuid #</span></div>'
        };

        $scope.diskOfferingOptions__ = {
          dataSource: new kendo.data.DataSource({data: []}),
          dataTextField: "name",
          dataValueField: "uuid",
          template: '<div style="color: black"><span class="z-label">Name:</span><span>#: name #</span></div>' +
          '<div style="color: black"><span class="z-label">Disk Size:</span><span>#: diskSize #</span></div>' +
          '<div style="color: black"><span class="z-label">UUID:</span><span>#: uuid #</span></div>',

          change: (e)=> {
            Utils.safeApply($scope, ()=>{
              var list = e.sender;
              $scope.infoPage.dataDiskOfferingUuids = [];
              angular.forEach(list.dataItems(), (it)=>{
                $scope.infoPage.dataDiskOfferingUuids.push(it.uuid);
              });
            });
          }
        };

        $scope.rootDiskOfferingOptions__ = {
          dataSource: new kendo.data.DataSource({data: []}),
          dataTextField: "name",
          dataValueField: "uuid",
          template: '<div style="color: black"><span class="z-label">Name:</span><span>#: name #</span></div>' +
          '<div style="color: black"><span class="z-label">Disk Size:</span><span>#: diskSize #</span></div>' +
          '<div style="color: black"><span class="z-label">UUID:</span><span>#: uuid #</span></div>',
        };

        $scope.l3NetworkOptions__ = {
          dataSource: new kendo.data.DataSource({data: []}),
          dataTextField: "name",
          dataValueField: "uuid",
          template: '<div style="color: black"><span class="z-label">Name:</span><span>#: name #</span></div>' +
          '<div style="color: black"><span class="z-label">UUID:</span><span>#: uuid #</span></div>',

          change: (e)=> {
            Utils.safeApply($scope, ()=>{
              var list = e.sender;
              $scope.infoPage.l3NetworkUuids = [];
              angular.forEach(list.dataItems(), (it)=>{
                $scope.infoPage.l3NetworkUuids.push(it.uuid);
              });

              $scope.defaultL3NetworkOptions__.dataSource.data(list.dataItems());
            });
          }
        };

        $scope.defaultL3NetworkOptions__ = {
          dataSource: new kendo.data.DataSource({data: []}),
          dataTextField: "name",
          dataValueField: "uuid",
          template: '<div style="color: black"><span class="z-label">Name:</span><span>#: name #</span></div>' +
          '<div style="color: black"><span class="z-label">UUID:</span><span>#: uuid #</span></div>'
        };

        $scope.imageOptions__ = {
          dataSource: new kendo.data.DataSource({data: []}),
          dataTextField: "name",
          dataValueField: "uuid",
          template: '<div style="color: black"><span class="z-label">Name:</span><span>#: name #</span></div>' +
          '<div style="color: black"><span class="z-label">Platform:</span><span>#: platform #</span></div>' +
          '<div style="color: black"><span class="z-label">Media Type:</span><span>#= mediaType #</span></div>' +
          '<div style="color: black"><span class="z-label">Format:</span><span>#: format #</span></div>' +
          '<div style="color: black"><span class="z-label">UUID:</span><span>#: uuid #</span></div>'
        };

        this.$scope = $scope;
      };
      this.restrict = 'EA';
      this.replace = true;
      this.templateUrl = '/static/templates/vm/createVm.html';
    }
  }

  export class AttachVolume implements ng.IDirective {
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
      this.$scope.volumeListOptions__.dataSource.data([]);
      var chain  = new Utils.Chain();
      chain.then(()=> {
        this.api.getVmAttachableVolume(this.options.vm.uuid, (vols: ApiHeader.VolumeInventory[])=>{
          this.$scope.volumeListOptions__.dataSource.data(vols);
          chain.next();
        });
      }).done(()=>{
        this.$scope.attachVolume__.center();
        this.$scope.attachVolume__.open();
      }).start();
    }

    constructor(private api: Utils.Api, private vmMgr: VmInstanceManager) {
      this.scope = true;
      this.restrict = 'EA';
      this.replace = true;
      this.templateUrl = '/static/templates/vm/attachVolume.html';
      this.link = ($scope : any, $element, $attrs : any, $ctrl, $transclude) => {
        var parent = $scope.$parent;
        parent[$attrs.zVmAttachVolume] = this;
        this.options = parent[$attrs.zOptions];

        $scope.volumeListOptions__ = {
          dataSource: new kendo.data.DataSource({data: []}),
          dataTextField: "name",
          dataValueField: "uuid",
          itemTemplate: '<div style="color: black"><span class="z-label">Name:</span><span>#: name #</span></div>' +
          '<div style="color: black"><span class="z-label">State:</span><span>#: state #</span></div>' +
          '<div style="color: black"><span class="z-label">Status:</span><span>#: status #</span></div>' +
          '<div style="color: black"><span class="z-label">UUID:</span><span>#: uuid #</span></div>',

          change: (e)=> {
            var select = e.sender;
            Utils.safeApply($scope, ()=> {
              $scope.selectItemNum = select.dataItems().length;
            });
          }
        };

        $scope.cancel = () => {
          $scope.attachVolume__.close();
        };

        $scope.done = () => {
          var vols = $scope.volumeList__.dataItems();
          angular.forEach(vols, (it)=>{
            vmMgr.attachVolume(this.options.vm, it.uuid, (vol: ApiHeader.VolumeInventory)=>{
              if (this.options.done) {
                this.options.done(vol);
              }
            });
          });

          $scope.attachVolume__.close();
        };

        $scope.selectItemNum = 0;

        $scope.canProceed = ()=> {
          return $scope.selectItemNum > 0;
        };

        this.$scope = $scope;
      }
    }
  }


  export class DetachVolume implements ng.IDirective {
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
      var dvols = [];
      angular.forEach(this.options.vm.allVolumes, (it)=>{
        if (it.type != 'Root') {
          dvols.push(it);
        }
      });
      this.$scope.volumeListOptions__.dataSource.data(dvols);
      this.$scope.detachVolume__.center();
      this.$scope.detachVolume__.open();
    }

    constructor(private api: Utils.Api, private vmMgr: VmInstanceManager) {
      this.scope = true;
      this.restrict = 'EA';
      this.replace = true;
      this.templateUrl = '/static/templates/vm/detachVolume.html';
      this.link = ($scope : any, $element, $attrs : any, $ctrl, $transclude) => {
        var parent = $scope.$parent;
        parent[$attrs.zVmDetachVolume] = this;
        this.options = parent[$attrs.zOptions];

        $scope.volumeListOptions__ = {
          dataSource: new kendo.data.DataSource({data: []}),
          dataTextField: "name",
          dataValueField: "uuid",
          itemTemplate: '<div style="color: black"><span class="z-label">Name:</span><span>#: name #</span></div>' +
          '<div style="color: black"><span class="z-label">State:</span><span>#: state #</span></div>' +
          '<div style="color: black"><span class="z-label">Status:</span><span>#: status #</span></div>' +
          '<div style="color: black"><span class="z-label">Size:</span><span>#: size #</span></div>' +
          '<div style="color: black"><span class="z-label">UUID:</span><span>#: uuid #</span></div>',

          change: (e)=> {
            var select = e.sender;
            Utils.safeApply($scope, ()=> {
              $scope.selectItemNum = select.dataItems().length;
            });
          }
        };

        $scope.cancel = () => {
          $scope.detachVolume__.close();
        };

        $scope.done = () => {
          var vols = $scope.volumeList__.dataItems();
          angular.forEach(vols, (it)=>{
            vmMgr.detachVolume(this.options.vm, it.uuid, ()=>{
              if (this.options.done) {
                this.options.done(it);
              }
            });
          });

          $scope.detachVolume__.close();
        };

        $scope.selectItemNum = 0;

        $scope.canProceed = ()=> {
          return $scope.selectItemNum > 0;
        };

        this.$scope = $scope;
      }
    }
  }
}

angular.module('root').factory('VmInstanceManager', ['Api', '$rootScope', (api, $rootScope)=> {
  return new MVmInstance.VmInstanceManager(api, $rootScope);
}]).directive('zCreateVmInstance', ['Api', 'VmInstanceManager', 'ClusterManager', 'HostManager',
  'ZoneManager', 'InstanceOfferingManager', 'DiskOfferingManager', 'L3NetworkManager', 'ImageManager',
  (api, vmMgr, clusterMgr, hostMgr, zoneMgr, instOfferingMgr, diskOfferingMgr, l3Mgr, imageMgr)=> {
    return new MVmInstance.CreateVmInstance(api, vmMgr, clusterMgr, hostMgr, zoneMgr, instOfferingMgr, diskOfferingMgr, l3Mgr, imageMgr);
  }]).directive('zMigrateVmInstance', ['Api', 'VmInstanceManager', (api, vmMgr)=>{
  return new MVmInstance.MigrateVm(api, vmMgr);
}]).directive('zVmAttachVolume', ['Api', 'VmInstanceManager', (api, vmMgr)=> {
  return new MVmInstance.AttachVolume(api, vmMgr);
}]).directive('zVmDetachVolume', ['Api', 'VmInstanceManager', (api, vmMgr)=> {
  return new MVmInstance.DetachVolume(api, vmMgr);
}]).config(['$routeProvider', function(route) {
  route.when('/vmInstance', {
    templateUrl: '/static/templates/vm/vm.html',
    controller: 'MVmInstance.Controller',
    resolve: {
      hypervisorTypes: function($q : ng.IQService, Api : Utils.Api) {
        var defer = $q.defer();
        Api.getHypervisorTypes((hypervisorTypes: string[])=> {
          defer.resolve(hypervisorTypes);
        });
        return defer.promise;
      }
    }
  }).when('/vmInstance/:uuid', {
    templateUrl: '/static/templates/vm/details.html',
    controller: 'MVmInstance.DetailsController',
    resolve: {
      current: function($q : ng.IQService, $route: any, VmInstanceManager: MVmInstance.VmInstanceManager, Api: Utils.Api) {
        var defer = $q.defer();
        var chain = new Utils.Chain();
        var ret = {
          vm: null,
          hostname: null
        };
        chain.then(()=>{
          var qobj = new ApiHeader.QueryObject();
          var uuid = $route.current.params.uuid;
          qobj.addCondition({name: 'uuid', op: '=', value: uuid});
          VmInstanceManager.query(qobj, (vms: MVmInstance.VmInstance[])=>{
            ret.vm = vms[0];
            chain.next();
          }, true);
        }).then(()=>{
          var msg = new ApiHeader.APIQuerySystemTagMsg();
          msg.conditions = [{
            name: 'resourceUuid',
            op: '=',
            value: $route.current.params.uuid
          }, {
            name: 'tag',
            op: 'like',
            value: 'hostname::%'
          }];

          Api.syncApi(msg, (reply: ApiHeader.APIQuerySystemTagReply)=>{
            var invs = reply.inventories;
            if (invs.length > 0) {
              var pair = invs[0].tag.split('::');
              ret.hostname = pair[1];
            }

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

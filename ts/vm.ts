
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
    defaultIp: String;
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
      msg.systemTags = []
      for (var i = 0; i < vm.l3NetworkStaticIps.length; ++i) {
        msg.systemTags.push('staticIp::' + vm.l3NetworkStaticIps[i].uuid + '::' + vm.l3NetworkStaticIps[i].staticIp);
      }
      if (Utils.notNullnotUndefined(vm.hostname)) {
        msg.systemTags.push('hostname::' + vm.hostname);
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

    expunge(vm: VmInstance, done : (ret : any)=>void) {
      vm.progressOn();
      vm.state = "Expunging";
      var msg = new ApiHeader.APIExpungeVmInstanceMsg();
      msg.uuid = vm.uuid;
      this.api.asyncApi(msg, (ret : ApiHeader.APIExpungeVmInstanceEvent) => {
          vm.progressOff();
          done(ret);
          this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
              msg: Utils.sprintf('Expunged VmInstance: {0}', vm.name)
          });
      });
    }

      recover(vm: VmInstance) {
          vm.progressOn();
          var msg = new ApiHeader.APIRecoverVmInstanceMsg();
          msg.uuid = vm.uuid;
          this.api.asyncApi(msg, (ret : ApiHeader.APIRecoverVmInstanceEvent) => {
              vm.updateObservableObject(ret.inventory);
              vm.progressOff();
              this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                  msg: Utils.sprintf('Recovered VmInstance: {0}',vm.name),
                  link: Utils.sprintf('/#/vmInstance/{0}', vm.uuid)
              });
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

    attachL3Network(vm: VmInstance, l3Uuid: string, done: ()=>void) {
      vm.progressOn();
      var msg = new ApiHeader.APIAttachL3NetworkToVmMsg();
      msg.l3NetworkUuid = l3Uuid;
      msg.vmInstanceUuid = vm.uuid;
      this.api.asyncApi(msg, (ret: ApiHeader.APIAttachL3NetworkToVmEvent)=>{
        vm.updateObservableObject(ret.inventory);
        vm.progressOff();
        if (Utils.notNullnotUndefined(done)) {
          done();
        }
        this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
          msg: Utils.sprintf('Attached a L3 network to the VM: {0}', vm.name),
          link: Utils.sprintf('/#/vmInstance/{0}', vm.uuid)
        });
      });
    }

    detachL3Network(vm: VmInstance, nicUuid: string, done:()=>void) {
      vm.progressOn();
      var msg = new ApiHeader.APIDetachL3NetworkFromVmMsg();
      msg.vmNicUuid = nicUuid;
      this.api.asyncApi(msg, (ret: ApiHeader.APIDetachL3NetworkFromVmEvent)=>{
        vm.updateObservableObject(ret.inventory);
        vm.progressOff();
        if (Utils.notNullnotUndefined(done)) {
          done();
        }
        this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
          msg: Utils.sprintf('Detached a L3 network from the VM: {0}', vm.name),
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

    changeInstanceOffering(vm: VmInstance, insUuid: string, done: ()=> void) {
      vm.progressOn();
      var msg = new ApiHeader.APIChangeInstanceOfferingMsg();
      msg.vmInstanceUuid = vm.uuid;
      msg.instanceOfferingUuid = insUuid;
      this.api.asyncApi(msg, (ret: ApiHeader.APIChangeInstanceOfferingEvent)=> {
        vm.progressOff();
        if (Utils.notNullnotUndefined(done)) {
          done();
        }
        this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
          msg: Utils.sprintf('Changed the instance offering of the VM instance: {0}; you may need to stop/start the VM', vm.name),
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
          title: '{{"vm.ts.NAME" | translate}}',
          width: '20%',
          template: '<a href="/\\#/vmInstance/{{dataItem.uuid}}">{{dataItem.name}}</a>'
        },
        {
          field: 'description',
          title: '{{"vm.ts.DESCRIPTION" | translate}}',
          width: '20%'
        },
        {
          field: 'defaultIp',
          title: '{{"vm.ts.DEFAULT IP" | translate}}',
          width: '20%',
          template: '{{dataItem.defaultIp}}'
        },
        {
          field: 'hostIp',
          title: '{{"vm.ts.HOST IP" | translate}}',
          width: '20%',
          template: '<a href="/\\#/host/{{dataItem.hostUuid}}">{{dataItem.managementIp}}</a>'
        },
        {
          field: 'state',
          title: '{{"vm.ts.STATE" | translate}}',
          width: '20%',
          template: '<span class="{{dataItem.stateLabel()}}">{{dataItem.state}}</span>'
        },
        {
          field: 'uuid',
          title: '{{"vm.ts.UUID" | translate}}',
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

          for (var i in vms) {
            var defaultL3NetworkUuid = vms[i].defaultL3NetworkUuid;
            for (var j in vms[i].vmNics) {
              if(defaultL3NetworkUuid == vms[i].vmNics[j].l3NetworkUuid) {
                vms[i].defaultIp = vms[i].vmNics[j].ip;
                break;
              }
            }
          }

          var hostUuids = [];
          for (var j in vms) {
            var vm = vms[j];
            if (vm.state == 'Running') {
              hostUuids.push(vm.hostUuid);
            }
          }

          if (hostUuids.length > 0) {
            var qobj = new ApiHeader.QueryObject();
            qobj.addCondition({name: 'uuid', op: 'in', value: hostUuids.join()});
            this.hostMgr.query(qobj, (hosts : any, total:number)=> {
              for(var i in vms) {
                for (var j in hosts) {
                  if (vms[i].hostUuid == hosts[j].uuid) {
                    vms[i].managementIp = hosts[j].managementIp;
                  }
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

      recover() {
          this.vmMgr.recover(this.$scope.model.current);
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

    attachL3Network() {
      this.$scope.attachL3Network.open();
    }

    detachL3Network() {
      this.$scope.detachL3Network.open();
    }

    console() {
      this.$scope.console();
    }

    changeInstanceOffering() {
      this.$scope.changeInstanceOffering.open();
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
        return this.$scope.model.current.allVolumes.length > 0 && (this.$scope.model.current.state == 'Running' || this.$scope.model.current.state == 'Stopped');
      } else if (action == 'console' && Utils.notNullnotUndefined(this.$scope.model.current)) {
        return this.$scope.model.current.state == 'Starting' || this.$scope.model.current.state == 'Running' || this.$scope.model.current.state == 'Rebooting' || this.$scope.model.current.state == 'Stopping';
      } else if (action == 'attachL3Network' && Utils.notNullnotUndefined(this.$scope.model.current)) {
        return this.$scope.model.current.state == 'Running' || this.$scope.model.current.state == 'Stopped';
      } else if (action == 'detachL3Network'&& Utils.notNullnotUndefined(this.$scope.model.current)) {
        return (this.$scope.model.current.state == 'Running' || this.$scope.model.current.state == 'Stopped') &&
          this.$scope.model.current.vmNics.length > 0;
      } else if (action == 'changeInstanceOffering'  && Utils.notNullnotUndefined(this.$scope.model.current)) {
          return this.$scope.model.current.state == 'Running' || this.$scope.model.current.state == 'Stopped';
      } else if (action == 'recoverVm' && Utils.notNullnotUndefined(this.$scope.model.current)) {
          return this.$scope.model.current.state == 'Destroyed';
      } else if (action == 'expungeVm' && Utils.notNullnotUndefined(this.$scope.model.current)) {
          return this.$scope.model.current.state == 'Destroyed';
      } else if (action == 'delete' && Utils.notNullnotUndefined(this.$scope.model.current)) {
          return this.$scope.model.current.state != 'Destroyed';
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
              name: '{{"vm.ts.None" | translate}}',
              value: FilterBy.NONE
            },
            {
              name: '{{"vm.ts.State" | translate}}',
              value: FilterBy.STATE
            },
            {
              name: '{{"vm.ts.HypervisorType" | translate}}',
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
        Utils.safeApply(this.$scope, ()=>{
            var c = this.$scope.model.current = vms[0];
            this.$scope.optionsNicGrid.dataSource.data(c.vmNics);
            this.$scope.optionsVolumeGrid.dataSource.data(c.allVolumes);
        });
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

        $scope.funcExpungeVmInstance = () => {
            $scope.expungeVmInstance.open();
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

        $scope.optionsExpungeVmInstance = {
            title: 'EXPUNGE VM INSTANCE',
            btnType: 'btn-danger',
            width: '350px',

            description: ()=> {
                return current.name;
            },

            confirm: ()=> {
                vmMgr.expunge($scope.model.current, (ret : any)=> {
                    $scope.model.resetCurrent();
                });
            }
        };

      $scope.console = ()=> {
        vmMgr.getConsole(current, (inv: ApiHeader.ConsoleInventory)=>{
          var windowName = current.name + current.uuid;
          $window.open(Utils.sprintf('/static/templates/console/vnc_auto.html?host={0}&port={1}&token={2}&title={3}', inv.hostname, inv.port, inv.token, current.name), windowName);
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


      $scope.optionsChangeInstanceOffering = {
        vm: current
      };

      $scope.optionsAttachL3Network = {
        vm: current,
        done: ()=> {
          $scope.funcRefresh();
        }
      };

      $scope.optionsDetachL3Network = {
        vm: current,
        done: ()=> {
          $scope.funcRefresh();
        }
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
            title: '{{"vm.ts.DEVICE ID" | translate}}',
            width: '4%'
          },
          {
            field: 'l3NetworkUuid',
            title: '{{"vm.ts.L3 Network" | translate}}',
            width: '20%',
            template: '<a href="/\\#/l3Network/{{dataItem.l3NetworkUuid}}">{{dataItem.l3NetworkUuid}}</a>'
          },
          {
            field: 'ip',
            title: '{{"vm.ts.IP" | translate}}',
            width: '14%'
          },
          {
            field: 'netmask',
            title: '{{"vm.ts.NETMASK" | translate}}',
            width: '14%'
          },
          {
            field: 'gateway',
            title: '{{"vm.ts.GATEWAY" | translate}}',
            width: '14%'
          },
          {
            field: 'mac',
            title: '{{"vm.ts.MAC" | translate}}',
            width: '14%'

          },
          {
            field: 'uuid',
            title: '{{"vm.ts.UUID" | translate}}',
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
            title: '{{"vm.ts.DEVICE ID" | translate}}',
            width: '10%',
            template: '<a href="/\\#/volume/{{dataItem.uuid}}">{{dataItem.deviceId}}</a>'
          },
          {
            field: 'name',
            title: '{{"vm.ts.NAME" | translate}}',
            width: '18%'

          },
          {
            field: 'type',
            title: '{{"vm.ts.TYPE" | translate}}',
            width: '18%'
          },
          {
            field: 'state',
            title: '{{"vm.ts.STATE" | translate}}',
            width: '18%'
          },
          {
            field: 'status',
            title: '{{"vm.ts.STATUS" | translate}}',
            width: '18%'
          },
          {
            field: 'uuid',
            title: '{{"vm.ts.UUID" | translate}}',
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
    static $inject = ['$scope', 'VmInstanceManager', 'HostManager', 'hypervisorTypes', '$location', '$rootScope', '$window','Translator','$translate'];

    constructor(private $scope : any, private vmMgr : VmInstanceManager, private hostMgr : MHost.HostManager, private hypervisorTypes: string[],
                private $location : ng.ILocationService, private $rootScope : any, private $window, private Translator: Utils.Translator, private $translate: any) {
      $scope.model = new VmInstanceModel();
      $scope.oVmInstanceGrid = new OVmInstanceGrid($scope, vmMgr, hostMgr);
      $scope.action = new Action($scope, vmMgr);
      $scope.optionsSortBy = {
        fields: [
          {
            name: '{{"vm.ts.Name" | translate}}',
            value: 'name'
          },
          {
            name: '{{"vm.ts.Description" | translate}}',
            value: 'Description'
          },
          {
            name: '{{"vm.ts.State" | translate}}',
            value: 'state'
          },
          {
            name: '{{"vm.ts.Hypervisor" | translate}}',
            value: 'hypervisorType'
          },
          {
            name: '{{"vm.ts.Created Date" | translate}}',
            value: 'createDate'
          },
          {
            name: '{{"vm.ts.Last Updated Date" | translate}}',
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

        $scope.funcExpungeVmInstance = () => {
            $scope.expungeVmInstance.open();
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

        $scope.optionsExpungeVmInstance = {
            title: 'EXPUNGE VM INSTANCE',
            btnType: 'btn-danger',
            width: '350px',

            description: ()=> {
                return $scope.model.current.name;
            },

            confirm: ()=> {
                vmMgr.expunge($scope.model.current, (ret : any)=> {
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
          $window.open(Utils.sprintf('/static/templates/console/vnc_auto.html?host={0}&port={1}&token={2}&title={3}', inv.hostname, inv.port, inv.token, $scope.model.current.name), windowName);
        });
      };

      $scope.optionsMigrateVm = {
        vm: null
      };

      $scope.optionsChangeInstanceOffering = {
        vm: null
      };

      $scope.optionsAttachVolume = {
        vm: null
      };

      $scope.optionsDetachVolume = {
        vm: null
      };

      $scope.optionsAttachL3Network = {
        vm: null
      };

      $scope.optionsDetachL3Network = {
        vm: null
      };

      $scope.$watch(()=>{
        return $scope.model.current;
      },()=>{
        if (Utils.notNullnotUndefined($scope.model.current)) {
          $scope.optionsMigrateVm.vm = $scope.model.current;
          $scope.optionsChangeInstanceOffering.vm = $scope.model.current;
          $scope.optionsAttachVolume.vm = $scope.model.current;
          $scope.optionsDetachVolume.vm = $scope.model.current;
          $scope.optionsAttachL3Network.vm = $scope.model.current;
          $scope.optionsDetachL3Network.vm = $scope.model.current;
        }
      });
    }
  }


  export class ChangeInstanceOffering implements ng.IDirective {
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
      this.$scope.instanceOfferingOptions__.dataSource.data([]);
      this.$scope.instanceOfferingUuid = null;
      var chain  = new Utils.Chain();
      chain.then(()=> {
        var q = new ApiHeader.QueryObject();
        q.addCondition({name: 'state', op: '=', value: 'Enabled'});
        if (this.options.vm.instanceOfferingUuid) {
          q.addCondition({name: 'uuid', op: '!=', value: this.options.vm.instanceOfferingUuid});
        }
        this.insMgr.query(q, (ins: MInstanceOffering.InstanceOffering[])=>{
          this.$scope.instanceOfferingOptions__.dataSource.data(ins);
          chain.next();
        });
      }).done(()=>{
        this.$scope.changeInstanceOffering__.center();
        this.$scope.changeInstanceOffering__.open();
      }).start();
    }


    constructor(private api : Utils.Api, private vmMgr: MVmInstance.VmInstanceManager, private insMgr: MInstanceOffering.InstanceOfferingManager) {
      this.scope = true;
      this.restrict = 'EA';
      this.replace = true;
      this.templateUrl = '/static/templates/vm/changeInstanceOffering.html';
      this.link = ($scope : any, $element, $attrs : any, $ctrl, $transclude) => {
        var parent = $scope.$parent;
        parent[$attrs.zChangeInstanceOffering] = this;
        this.options = parent[$attrs.zOptions];
        this.$scope = $scope;

        $scope.instanceOfferingUuid = null;
        $scope.instanceOfferingOptions__ = {
          dataSource: new kendo.data.DataSource({data: []}),
          dataTextField: "name",
          dataValueField: "uuid",
          template: '<div style="color: black"><span class="z-label">{{"vm.ts.Name" | translate}}</span><span>#: name #</span></div>' +
          '<div style="color: black"><span class="z-label">{{"vm.ts.CPU Number" | translate}}</span><span>#: cpuNum #</span></div>' +
          '<div style="color: black"><span class="z-label">{{"vm.ts.Memory" | translate}}</span><span>#: memorySize #</span></div>' +
          '<div style="color: black"><span class="z-label">{{"vm.ts.UUID" | translate}}</span><span>#: uuid #</span></div>'
        };

        $scope.canProceed = ()=> {
          return Utils.notNullnotUndefined($scope.instanceOfferingUuid);
        };

        $scope.cancel = () => {
          $scope.changeInstanceOffering__.close();
        };

        $scope.done = () => {
          vmMgr.changeInstanceOffering(this.options.vm, $scope.instanceOfferingUuid, ()=>{
            if (this.options.done) {
            this.options.done();
            }
          });

          $scope.changeInstanceOffering__.close();
        };
      }
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
          template: '<div style="color: black"><span class="z-label">{{"vm.ts.Name" | translate}}</span><span>#: name #</span></div>' +
          '<div style="color: black"><span class="z-label">{{"vm.ts.UUID" | translate}}</span><span>#: uuid #</span></div>' +
          '<div style="color: black"><span class="z-label">{{"vm.ts.Cluster UUID" | translate}}</span><span>#: clusterUuid #</span></div>'
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
      this.$scope.l3NetworkGrid__.dataSource.data([]);
      this.$scope.diskOfferingOptions__.dataSource.data([]);
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
          l3NetworkUuid: null,
          l3NetworkIp: null,
          l3NetworkUuids: [],
          l3NetworkStaticIps:[],
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
            return $scope.l3NetworkGrid__.dataSource.data().length > 0;
          },

          canMoveToPrevious(): boolean {
            return false;
          },

          canMoveToNext(): boolean {
            if (this.imageMediaType == 'RootVolumeTemplate') {
              return Utils.notNullnotUndefined(this.name) && Utils.notNullnotUndefined(this.instanceOfferingUuid)
                && Utils.notNullnotUndefined(this.imageUuid) && this.hasL3Network();
            } else {
              return Utils.notNullnotUndefined(this.name) && Utils.notNullnotUndefined(this.instanceOfferingUuid)
                && Utils.notNullnotUndefined(this.imageUuid) && this.hasL3Network() && Utils.notNullnotUndefined(this.rootDiskOfferingUuid);
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

          syncL3NetworkDataFromView(): void {
            var l3NetworkGridRawData = $scope.l3NetworkGrid__.dataSource.data();

            this.l3NetworkUuids = [];
            this.l3NetworkStaticIps = [];
            for (var i = 0; i < l3NetworkGridRawData.length; ++i) {
              this.l3NetworkUuids.push(l3NetworkGridRawData[i].uuid);
              if(Utils.notNullnotUndefined(this.l3NetworkIp) && this.l3NetworkIp != "") {
                this.l3NetworkStaticIps.push({
                  uuid: l3NetworkGridRawData[i].uuid,
                  staticIp: l3NetworkGridRawData[i].staticIp
                });
              }
            }
          },

          addL3Network(): void {
            if(!this.isStaticIpValid()) return;

            var l3NetworkOptionsRawData = $scope.l3NetworkOptions__.dataSource.data();
            var l3Network = null;
            for (var i = 0; i < l3NetworkOptionsRawData.length; ++i) {
              if(l3NetworkOptionsRawData[i].uuid == this.l3NetworkUuid) {
                l3Network = l3NetworkOptionsRawData[i];
                break;
              }
            }
            if(Utils.notNullnotUndefined(this.l3NetworkIp)) {
              l3Network.staticIp = this.l3NetworkIp.trim();
            }

            var l3NetworkGridRawData = $scope.l3NetworkGrid__.dataSource.data();
            var updated = false;
            for (var i = 0; i < l3NetworkGridRawData.length; ++i) {
              if(l3NetworkGridRawData[i].uuid == l3Network.uuid) {
                l3NetworkGridRawData[i].staticIp = l3Network.staticIp;
                updated = true;
                break;
              }
            }

            if(!updated) {
              $scope.l3NetworkGrid__.dataSource.pushCreate(l3Network);
            }

            this.syncL3NetworkDataFromView();

            $scope.defaultL3NetworkOptions__.dataSource.data($scope.l3NetworkGrid__.dataSource.data());

            this.l3NetworkIp = "";
          },

          delL3Network(uid): void {
            var row = $scope.l3NetworkGrid__.dataSource.getByUid(uid);
            $scope.l3NetworkGrid__.dataSource.remove(row);
            this.syncL3NetworkDataFromView();
          },

          isStaticIpValid(): boolean {
            if (Utils.notNullnotUndefined(this.l3NetworkIp)) {
              if(this.l3NetworkIp.trim() == "")
                return true;
              else
                return Utils.isIpv4Address(this.l3NetworkIp);
            }
            return true;
          },

          getPageName(): string {
            return 'createVmInstanceInfo';
          },

          reset() : void {
            this.name = Utils.shortHashName('vm');
            this.description = null;
            this.imageUuid = null;
            this.dataDiskOfferingUuids = [];
            this.l3NetworkIp = null;
            this.l3NetworkUuids = [];
            this.instanceOfferingUuid = null;
            this.activeState = false;
            this.rootDiskOfferingUuid = null;
            this.defaultL3NetworkUuid = null;
            this.images = {};
            this.hostname = null;
          }
        };

        $scope.l3NetworkGrid__ = {
            pageSize: 20,
            resizable: true,
            scrollable: true,
            pageable: true,
            columns: [
                {
                    width: '12%',
                    title: '',
                    template: '<button type="button" class="btn btn-xs btn-default" ng-click="infoPage.delL3Network(dataItem.uid)"><i class="fa fa-times"></i></button>'
                },
                {
                    field: 'name',
                    title: '{{"vm.ts.NAME" | translate}}',
                    width: '44%'
                },
                {
                    field: 'staticIp',
                    title: '{{"vm.ts.STATIC IP" | translate}}',
                    width: '44%'
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
          template: '<div style="color: black"><span class="z-label">{{"vm.ts.Name" | translate}}</span>: #: name #</div>'+'<div style="color: black"><span class="z-label">{{"vm.ts.State" | translate}}</span>#: state #</div>'+'<div style="color: black"><span class="z-label">{{"vm.ts.UUID" | translate}}</span> #: uuid #</div>',
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
          template: '<div style="color: black"><span class="z-label">{{"vm.ts.NAME" | translate}}</span><span>#: name #</span></div>' +
          '<div style="color: black"><span class="z-label">{{"vm.ts.HYPERVISOR" | translate}}</span><span>#: hypervisorType #</span></div>' +
          '<div style="color: black"><span class="z-label">{{"vm.ts.UUID" | translate}}</span><span>#: uuid #</span></div>'
        };

        $scope.hostOptions__ = {
          dataSource: new kendo.data.DataSource({data: []}),
          optionLabel: "",
          dataTextField: "name",
          dataValueField: "uuid",
          template: '<div style="color: black"><span class="z-label">{{"vm.ts.Name" | translate}}</span><span>#: name #</span></div>' +
          '<div style="color: black"><span class="z-label">{{"vm.ts.State" | translate}}</span><span>#: state #</span></div>' +
          '<div style="color: black"><span class="z-label">{{"vm.ts.Status" | translate}}</span><span>#: status #</span></div>' +
          '<div style="color: black"><span class="z-label">{{"vm.ts.UUID" | translate}}</span><span>#: uuid #</span></div>'
        };

        $scope.instanceOfferingOptions__ = {
          dataSource: new kendo.data.DataSource({data: []}),
          dataTextField: "name",
          dataValueField: "uuid",
          template: '<div style="color: black"><span class="z-label">{{"vm.ts.Name" | translate}}</span><span>#: name #</span></div>' +
          '<div style="color: black"><span class="z-label">{{"vm.ts.CPU Number" | translate}}</span><span>#: cpuNum #</span></div>' +
          '<div style="color: black"><span class="z-label">{{"vm.ts.Memory" | translate}}</span><span>#: memorySize #</span></div>' +
          '<div style="color: black"><span class="z-label">{{"vm.ts.UUID" | translate}}</span><span>#: uuid #</span></div>'
        };

        $scope.diskOfferingOptions__ = {
          dataSource: new kendo.data.DataSource({data: []}),
          dataTextField: "name",
          dataValueField: "uuid",
          template: '<div style="color: black"><span class="z-label">{{"vm.ts.Name" | translate}}</span><span>#: name #</span></div>' +
          '<div style="color: black"><span class="z-label">{{"vm.ts.Disk Size" | translate}}</span><span>#: diskSize #</span></div>' +
          '<div style="color: black"><span class="z-label">{{"vm.ts.UUID" | translate}}</span><span>#: uuid #</span></div>',

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
          template: '<div style="color: black"><span class="z-label">{{"vm.ts.Name" | translate}}</span><span>#: name #</span></div>' +
          '<div style="color: black"><span class="z-label">{{"vm.ts.Disk Size" | translate}}</span><span>#: diskSize #</span></div>' +
          '<div style="color: black"><span class="z-label">{{"vm.ts.UUID" | translate}}</span><span>#: uuid #</span></div>',
        };

        $scope.l3NetworkOptions__ = {
          dataSource: new kendo.data.DataSource({data: []}),
          dataTextField: "name",
          dataValueField: "uuid",
          template: '<div style="color: black"><span class="z-label">{{"vm.ts.Name" | translate}}</span><span>#: name #</span></div>' +
          '<div style="color: black"><span class="z-label">{{"vm.ts.UUID" | translate}}</span><span>#: uuid #</span></div>'
        };

        $scope.defaultL3NetworkOptions__ = {
          dataSource: new kendo.data.DataSource({data: []}),
          dataTextField: "name",
          dataValueField: "uuid",
          template: '<div style="color: black"><span class="z-label">{{"vm.ts.Name" | translate}}</span><span>#: name #</span></div>' +
          '<div style="color: black"><span class="z-label">{{"vm.ts.UUID" | translate}}</span><span>#: uuid #</span></div>'
        };

        $scope.imageOptions__ = {
          dataSource: new kendo.data.DataSource({data: []}),
          dataTextField: "name",
          dataValueField: "uuid",
          template: '<div style="color: black"><span class="z-label">{{"vm.ts.Name" | translate}}</span><span>#: name #</span></div>' +
          '<div style="color: black"><span class="z-label">{{"vm.ts.Platform" | translate}}</span><span>#: platform #</span></div>' +
          '<div style="color: black"><span class="z-label">{{"vm.ts.Media Type" | translate}}</span><span>#= mediaType #</span></div>' +
          '<div style="color: black"><span class="z-label">{{"vm.ts.Format" | translate}}</span><span>#: format #</span></div>' +
          '<div style="color: black"><span class="z-label">{{"vm.ts.UUID" | translate}}</span><span>#: uuid #</span></div>'
        };

        this.$scope = $scope;
      };
      this.restrict = 'EA';
      this.replace = true;
      this.templateUrl = '/static/templates/vm/createVm.html';
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
    templateUrl: any;

    options: any;
    $scope: any;


    open() {
      this.$scope.l3NetworkList__.value([]);
      var chain  = new Utils.Chain();
      chain.then(()=> {
        this.api.getVmAttachableL3Networks(this.options.vm.uuid, (l3s: ApiHeader.L3NetworkInventory[])=>{
          this.$scope.l3NetworkListOptions__.dataSource.data(l3s);
          chain.next();
        });
      }).done(()=>{
        this.$scope.attachL3Network__.center();
        this.$scope.attachL3Network__.open();
      }).start();
    }

    constructor(private api: Utils.Api, private vmMgr: VmInstanceManager) {
      this.scope = true;
      this.restrict = 'EA';
      this.replace = true;
      this.templateUrl = '/static/templates/vm/attachL3Network.html';
      this.link = ($scope : any, $element, $attrs : any, $ctrl, $transclude) => {
        var parent = $scope.$parent;
        parent[$attrs.zVmAttachL3Network] = this;
        this.options = parent[$attrs.zOptions];

        $scope.l3NetworkListOptions__ = {
          dataSource: new kendo.data.DataSource({data: []}),
          dataTextField: "name",
          dataValueField: "uuid",
          itemTemplate: '<div style="color: black"><span class="z-label">Name:</span><span>#: name #</span></div>' +
          '<div style="color: black"><span class="z-label">State:</span><span>#: state #</span></div>' +
          '<div style="color: black"><span class="z-label">UUID:</span><span>#: uuid #</span></div>',

          change: (e)=> {
            var select = e.sender;
            Utils.safeApply($scope, ()=> {
              $scope.selectItemNum = select.dataItems().length;
            });
          }
        };

        $scope.cancel = () => {
          $scope.attachL3Network__.close();
        };

        $scope.done = () => {
          var vols = $scope.l3NetworkList__.dataItems();
          angular.forEach(vols, (it)=>{
            vmMgr.attachL3Network(this.options.vm, it.uuid, ()=>{
              if (this.options.done) {
                this.options.done();
              }
            });
          });

          $scope.attachL3Network__.close();
        };

        $scope.selectItemNum = 0;

        $scope.canProceed = ()=> {
          return $scope.selectItemNum > 0;
        };

        this.$scope = $scope;
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
    templateUrl: any;

    options: any;
    $scope: any;


    open() {
      this.$scope.l3NetworkList__.value([]);
      var chain  = new Utils.Chain();
      var l3Uuids = [];
      chain.then(()=> {
        angular.forEach(this.options.vm.vmNics, (it)=>{
          l3Uuids.push(it.l3NetworkUuid);
        });
        chain.next();
      }).then(()=>{
        var l3Networks = [];
        var qobj = new ApiHeader.QueryObject();
        qobj.addCondition({name: "uuid", op:"in", value:l3Uuids.join()});
        this.l3Mgr.query(qobj, (l3s: ApiHeader.L3NetworkInventory[])=>{
          angular.forEach(l3s, (l3)=>{
            angular.forEach(this.options.vm.vmNics, (nic)=>{
              if (l3.uuid == nic.l3NetworkUuid) {
                var l3obj = {
                  l3NetworkName: l3.name,
                  deviceId: nic.deviceId,
                  nicUuid: nic.uuid
                };

                l3Networks.push(l3obj);
              }
            });
          });

          this.$scope.l3NetworkListOptions__.dataSource.data(l3Networks);
          chain.next();
        });
      }).done(()=>{
        this.$scope.detachL3Network__.center();
        this.$scope.detachL3Network__.open();
      }).start();
    }

    constructor(private api: Utils.Api, private vmMgr: VmInstanceManager, private l3Mgr: ML3Network.L3NetworkManager) {
      this.scope = true;
      this.restrict = 'EA';
      this.replace = true;
      this.templateUrl = '/static/templates/vm/detachL3Network.html';
      this.link = ($scope : any, $element, $attrs : any, $ctrl, $transclude) => {
        var parent = $scope.$parent;
        parent[$attrs.zVmDetachL3Network] = this;
        this.options = parent[$attrs.zOptions];

        $scope.l3NetworkListOptions__ = {
          dataSource: new kendo.data.DataSource({data: []}),
          dataTextField: "l3NetworkName",
          dataValueField: "nicUuid",
          itemTemplate: '<div style="color: black"><span class="z-label">L3 Network:</span><span>#: l3NetworkName #</span></div>' +
          '<div style="color: black"><span class="z-label">Nic Device ID:</span><span>#: deviceId #</span></div>' +
          '<div style="color: black"><span class="z-label">Nic UUID:</span><span>#: nicUuid #</span></div>',

          change: (e)=> {
            var select = e.sender;
            Utils.safeApply($scope, ()=> {
              $scope.selectItemNum = select.dataItems().length;
            });
          }
        };

        $scope.cancel = () => {
          $scope.detachL3Network__.close();
        };

        $scope.done = () => {
          var vols = $scope.l3NetworkList__.dataItems();
          angular.forEach(vols, (it)=>{
            vmMgr.detachL3Network(this.options.vm, it.nicUuid, ()=>{
              if (this.options.done) {
                this.options.done();
              }
            });
          });

          $scope.detachL3Network__.close();
        };

        $scope.selectItemNum = 0;

        $scope.canProceed = ()=> {
          return $scope.selectItemNum > 0;
        };

        this.$scope = $scope;
      }
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
      this.$scope.volumeList__.value([]);
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
      this.$scope.volumeList__.value(dvols);
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
}]).directive('zChangeInstanceOffering', ['Api', 'VmInstanceManager', 'InstanceOfferingManager', (api, vmMgr, insMgr)=>{
    return new MVmInstance.ChangeInstanceOffering(api, vmMgr, insMgr);
}]).directive('zVmAttachVolume', ['Api', 'VmInstanceManager', (api, vmMgr)=> {
  return new MVmInstance.AttachVolume(api, vmMgr);
}]).directive('zVmDetachVolume', ['Api', 'VmInstanceManager', (api, vmMgr)=> {
  return new MVmInstance.DetachVolume(api, vmMgr);
}]).directive('zVmAttachL3Network', ['Api', 'VmInstanceManager', (api, vmMgr)=> {
  return new MVmInstance.AttachL3Network(api, vmMgr);
}]).directive('zVmDetachL3Network', ['Api', 'VmInstanceManager', 'L3NetworkManager', (api, vmMgr, l3Mgr)=> {
  return new MVmInstance.DetachL3Network(api, vmMgr, l3Mgr);
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

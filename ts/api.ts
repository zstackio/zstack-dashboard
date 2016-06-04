module ApiHeader {
  export interface APIMessage {
    session? : SessionInventory;
    toApiMap() : any;
  }


  export class SessionInventory {
    uuid : string;
    accountUuid : string;
    userUuid : string;
  }


  export class APISilentMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.test.multinodes.APISilentMsg': this
      };
      return msg;
    }
    session : SessionInventory;
    timeout : number;
  }


  export class FakePolicyAllowMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.test.identity.FakePolicyAllowMsg': this
      };
      return msg;
    }
    session : SessionInventory;
    timeout : number;
  }


  export class FakePolicyDenyMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.test.identity.FakePolicyDenyMsg': this
      };
      return msg;
    }
    session : SessionInventory;
    timeout : number;
  }


  export class FakePolicyAllowHas2RoleMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.test.identity.FakePolicyAllowHas2RoleMsg': this
      };
      return msg;
    }
    session : SessionInventory;
    timeout : number;
  }


  export class QueryCondition {
    name : string;
    op : string;
    value : string;
  }


  export class APIQueryGlobalConfigMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.core.config.APIQueryGlobalConfigMsg': this
      };
      return msg;
    }
    conditions : Array<QueryCondition>;
    limit : number;
    start : number;
    count : boolean;
    replyWithCount : boolean;
    sortBy : string;
    sortDirection : string;
    fields : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIListGlobalConfigMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.core.config.APIListGlobalConfigMsg': this
      };
      return msg;
    }
    ids : Array<number>;
    length : number;
    offset : number;
    uuids : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIGetGlobalConfigMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.core.config.APIGetGlobalConfigMsg': this
      };
      return msg;
    }
    category : string;
    name : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIUpdateGlobalConfigMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.core.config.APIUpdateGlobalConfigMsg': this
      };
      return msg;
    }
    category : string;
    name : string;
    value : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIGenerateInventoryQueryDetailsMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.query.APIGenerateInventoryQueryDetailsMsg': this
      };
      return msg;
    }
    outputDir : string;
    basePackageNames : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIGenerateQueryableFieldsMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.query.APIGenerateQueryableFieldsMsg': this
      };
      return msg;
    }
    PYTHON_FORMAT : string;
    format : string;
    outputFolder : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIGetHostAllocatorStrategiesMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.allocator.APIGetHostAllocatorStrategiesMsg': this
      };
      return msg;
    }
    session : SessionInventory;
    timeout : number;
  }


  export class APIGetCpuMemoryCapacityMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.allocator.APIGetCpuMemoryCapacityMsg': this
      };
      return msg;
    }
    zoneUuids : Array<string>;
    clusterUuids : Array<string>;
    hostUuids : Array<string>;
    all : boolean;
    session : SessionInventory;
    timeout : number;
  }


  export class APIUpdateVmInstanceMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.vm.APIUpdateVmInstanceMsg': this
      };
      return msg;
    }
    uuid : string;
    name : string;
    description : string;
    state : string;
    defaultL3NetworkUuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIGetVmAttachableL3NetworkMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.vm.APIGetVmAttachableL3NetworkMsg': this
      };
      return msg;
    }
    vmInstanceUuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIMigrateVmMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.vm.APIMigrateVmMsg': this
      };
      return msg;
    }
    vmInstanceUuid : string;
    hostUuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIStopVmInstanceMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.vm.APIStopVmInstanceMsg': this
      };
      return msg;
    }
    uuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIChangeInstanceOfferingMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.vm.APIChangeInstanceOfferingMsg': this
      };
      return msg;
    }
    vmInstanceUuid : string;
    instanceOfferingUuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class NOVTriple {
    name : string;
    op : string;
    val : string;
  }


  export class NOLTriple {
    name : string;
    op : string;
    vals : Array<string>;
  }


  export class APISearchVmInstanceMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.vm.APISearchVmInstanceMsg': this
      };
      return msg;
    }
    fields : Array<string>;
    nameOpValueTriples : Array<NOVTriple>;
    nameOpListTriples : Array<NOLTriple>;
    start : number;
    size : number;
    inventoryUuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIGetVmAttachableDataVolumeMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.vm.APIGetVmAttachableDataVolumeMsg': this
      };
      return msg;
    }
    vmInstanceUuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIQueryVmNicMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.vm.APIQueryVmNicMsg': this
      };
      return msg;
    }
    conditions : Array<QueryCondition>;
    limit : number;
    start : number;
    count : boolean;
    replyWithCount : boolean;
    sortBy : string;
    sortDirection : string;
    fields : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIAttachL3NetworkToVmMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.vm.APIAttachL3NetworkToVmMsg': this
      };
      return msg;
    }
    vmInstanceUuid : string;
    l3NetworkUuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIDestroyVmInstanceMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.vm.APIDestroyVmInstanceMsg': this
      };
      return msg;
    }
    uuid : string;
    deleteMode : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIGetVmMigrationCandidateHostsMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.vm.APIGetVmMigrationCandidateHostsMsg': this
      };
      return msg;
    }
    vmInstanceUuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIQueryVmInstanceMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.vm.APIQueryVmInstanceMsg': this
      };
      return msg;
    }
    conditions : Array<QueryCondition>;
    limit : number;
    start : number;
    count : boolean;
    replyWithCount : boolean;
    sortBy : string;
    sortDirection : string;
    fields : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIDetachL3NetworkFromVmMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.vm.APIDetachL3NetworkFromVmMsg': this
      };
      return msg;
    }
    vmNicUuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIListVmNicMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.vm.APIListVmNicMsg': this
      };
      return msg;
    }
    length : number;
    offset : number;
    uuids : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIListVmInstanceMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.vm.APIListVmInstanceMsg': this
      };
      return msg;
    }
    length : number;
    offset : number;
    uuids : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIRebootVmInstanceMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.vm.APIRebootVmInstanceMsg': this
      };
      return msg;
    }
    uuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APICreateVmInstanceMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.vm.APICreateVmInstanceMsg': this
      };
      return msg;
    }
    name : string;
    instanceOfferingUuid : string;
    imageUuid : string;
    l3NetworkUuids : Array<string>;
    type : string;
    rootDiskOfferingUuid : string;
    dataDiskOfferingUuids : Array<string>;
    zoneUuid : string;
    clusterUuid : string;
    hostUuid : string;
    description : string;
    defaultL3NetworkUuid : string;
    resourceUuid : string;
    userTags : Array<string>;
    systemTags : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIGetVmInstanceMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.vm.APIGetVmInstanceMsg': this
      };
      return msg;
    }
    uuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIStartVmInstanceMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.vm.APIStartVmInstanceMsg': this
      };
      return msg;
    }
    uuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIChangeImageStateMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.image.APIChangeImageStateMsg': this
      };
      return msg;
    }
    uuid : string;
    stateEvent : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIGetImageMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.image.APIGetImageMsg': this
      };
      return msg;
    }
    uuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIUpdateImageMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.image.APIUpdateImageMsg': this
      };
      return msg;
    }
    uuid : string;
    name : string;
    description : string;
    guestOsType : string;
    mediaType : string;
    format : string;
    system : boolean;
    platform : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIDeleteImageMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.image.APIDeleteImageMsg': this
      };
      return msg;
    }
    uuid : string;
    backupStorageUuids : Array<string>;
    deleteMode : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APISearchImageMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.image.APISearchImageMsg': this
      };
      return msg;
    }
    fields : Array<string>;
    nameOpValueTriples : Array<NOVTriple>;
    nameOpListTriples : Array<NOLTriple>;
    start : number;
    size : number;
    inventoryUuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APICreateDataVolumeTemplateFromVolumeMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.image.APICreateDataVolumeTemplateFromVolumeMsg': this
      };
      return msg;
    }
    name : string;
    description : string;
    volumeUuid : string;
    backupStorageUuids : Array<string>;
    resourceUuid : string;
    userTags : Array<string>;
    systemTags : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APICreateRootVolumeTemplateFromRootVolumeMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.image.APICreateRootVolumeTemplateFromRootVolumeMsg': this
      };
      return msg;
    }
    name : string;
    description : string;
    guestOsType : string;
    backupStorageUuids : Array<string>;
    rootVolumeUuid : string;
    platform : string;
    system : boolean;
    resourceUuid : string;
    userTags : Array<string>;
    systemTags : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIQueryImageMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.image.APIQueryImageMsg': this
      };
      return msg;
    }
    conditions : Array<QueryCondition>;
    limit : number;
    start : number;
    count : boolean;
    replyWithCount : boolean;
    sortBy : string;
    sortDirection : string;
    fields : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIListImageMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.image.APIListImageMsg': this
      };
      return msg;
    }
    length : number;
    offset : number;
    uuids : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APICreateRootVolumeTemplateFromVolumeSnapshotMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.image.APICreateRootVolumeTemplateFromVolumeSnapshotMsg': this
      };
      return msg;
    }
    snapshotUuid : string;
    name : string;
    description : string;
    guestOsType : string;
    backupStorageUuids : Array<string>;
    platform : string;
    system : boolean;
    resourceUuid : string;
    userTags : Array<string>;
    systemTags : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIAddImageMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.image.APIAddImageMsg': this
      };
      return msg;
    }
    name : string;
    description : string;
    url : string;
    mediaType : string;
    guestOsType : string;
    system : boolean;
    format : string;
    platform : string;
    backupStorageUuids : Array<string>;
    type : string;
    resourceUuid : string;
    userTags : Array<string>;
    systemTags : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIRequestConsoleAccessMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.console.APIRequestConsoleAccessMsg': this
      };
      return msg;
    }
    vmInstanceUuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIBackupDataVolumeMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.volume.APIBackupDataVolumeMsg': this
      };
      return msg;
    }
    uuid : string;
    backupStorageUuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIAttachDataVolumeToVmMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.volume.APIAttachDataVolumeToVmMsg': this
      };
      return msg;
    }
    vmInstanceUuid : string;
    volumeUuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APISearchVolumeMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.volume.APISearchVolumeMsg': this
      };
      return msg;
    }
    fields : Array<string>;
    nameOpValueTriples : Array<NOVTriple>;
    nameOpListTriples : Array<NOLTriple>;
    start : number;
    size : number;
    inventoryUuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIUpdateVolumeMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.volume.APIUpdateVolumeMsg': this
      };
      return msg;
    }
    uuid : string;
    name : string;
    description : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIQueryVolumeMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.volume.APIQueryVolumeMsg': this
      };
      return msg;
    }
    conditions : Array<QueryCondition>;
    limit : number;
    start : number;
    count : boolean;
    replyWithCount : boolean;
    sortBy : string;
    sortDirection : string;
    fields : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APICreateDataVolumeFromVolumeSnapshotMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.volume.APICreateDataVolumeFromVolumeSnapshotMsg': this
      };
      return msg;
    }
    name : string;
    description : string;
    volumeSnapshotUuid : string;
    primaryStorageUuid : string;
    resourceUuid : string;
    userTags : Array<string>;
    systemTags : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APICreateDataVolumeFromVolumeTemplateMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.volume.APICreateDataVolumeFromVolumeTemplateMsg': this
      };
      return msg;
    }
    imageUuid : string;
    name : string;
    description : string;
    primaryStorageUuid : string;
    hostUuid : string;
    resourceUuid : string;
    userTags : Array<string>;
    systemTags : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIDetachDataVolumeFromVmMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.volume.APIDetachDataVolumeFromVmMsg': this
      };
      return msg;
    }
    uuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIGetVolumeMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.volume.APIGetVolumeMsg': this
      };
      return msg;
    }
    uuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APICreateDataVolumeMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.volume.APICreateDataVolumeMsg': this
      };
      return msg;
    }
    name : string;
    description : string;
    diskOfferingUuid : string;
    resourceUuid : string;
    userTags : Array<string>;
    systemTags : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIGetDataVolumeAttachableVmMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.volume.APIGetDataVolumeAttachableVmMsg': this
      };
      return msg;
    }
    volumeUuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIGetVolumeFormatMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.volume.APIGetVolumeFormatMsg': this
      };
      return msg;
    }
    session : SessionInventory;
    timeout : number;
  }


  export class APIDeleteDataVolumeMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.volume.APIDeleteDataVolumeMsg': this
      };
      return msg;
    }
    uuid : string;
    deleteMode : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APICreateVolumeSnapshotMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.volume.APICreateVolumeSnapshotMsg': this
      };
      return msg;
    }
    volumeUuid : string;
    name : string;
    description : string;
    resourceUuid : string;
    userTags : Array<string>;
    systemTags : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIListVolumeMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.volume.APIListVolumeMsg': this
      };
      return msg;
    }
    length : number;
    offset : number;
    uuids : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIChangeVolumeStateMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.volume.APIChangeVolumeStateMsg': this
      };
      return msg;
    }
    uuid : string;
    stateEvent : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIIsReadyToGoMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.apimediator.APIIsReadyToGoMsg': this
      };
      return msg;
    }
    managementNodeId : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIListDiskOfferingMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.configuration.APIListDiskOfferingMsg': this
      };
      return msg;
    }
    length : number;
    offset : number;
    uuids : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIGenerateApiTypeScriptDefinitionMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.configuration.APIGenerateApiTypeScriptDefinitionMsg': this
      };
      return msg;
    }
    outputPath : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIDeleteDiskOfferingMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.configuration.APIDeleteDiskOfferingMsg': this
      };
      return msg;
    }
    uuid : string;
    deleteMode : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIGenerateGroovyClassMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.configuration.APIGenerateGroovyClassMsg': this
      };
      return msg;
    }
    outputPath : string;
    basePackageNames : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIQueryInstanceOfferingMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.configuration.APIQueryInstanceOfferingMsg': this
      };
      return msg;
    }
    conditions : Array<QueryCondition>;
    limit : number;
    start : number;
    count : boolean;
    replyWithCount : boolean;
    sortBy : string;
    sortDirection : string;
    fields : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIUpdateInstanceOfferingMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.configuration.APIUpdateInstanceOfferingMsg': this
      };
      return msg;
    }
    uuid : string;
    name : string;
    description : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APICreateInstanceOfferingMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.configuration.APICreateInstanceOfferingMsg': this
      };
      return msg;
    }
    name : string;
    description : string;
    cpuNum : number;
    cpuSpeed : number;
    memorySize : number;
    allocatorStrategy : string;
    sortKey : number;
    type : string;
    resourceUuid : string;
    userTags : Array<string>;
    systemTags : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIGenerateApiJsonTemplateMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.configuration.APIGenerateApiJsonTemplateMsg': this
      };
      return msg;
    }
    exportPath : string;
    basePackageNames : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APICreateDiskOfferingMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.configuration.APICreateDiskOfferingMsg': this
      };
      return msg;
    }
    name : string;
    description : string;
    diskSize : number;
    sortKey : number;
    allocationStrategy : string;
    type : string;
    resourceUuid : string;
    userTags : Array<string>;
    systemTags : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIGetInstanceOfferingMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.configuration.APIGetInstanceOfferingMsg': this
      };
      return msg;
    }
    uuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIListInstanceOfferingMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.configuration.APIListInstanceOfferingMsg': this
      };
      return msg;
    }
    length : number;
    offset : number;
    uuids : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APISearchDnsMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.configuration.APISearchDnsMsg': this
      };
      return msg;
    }
    fields : Array<string>;
    nameOpValueTriples : Array<NOVTriple>;
    nameOpListTriples : Array<NOLTriple>;
    start : number;
    size : number;
    inventoryUuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APISearchDiskOfferingMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.configuration.APISearchDiskOfferingMsg': this
      };
      return msg;
    }
    fields : Array<string>;
    nameOpValueTriples : Array<NOVTriple>;
    nameOpListTriples : Array<NOLTriple>;
    start : number;
    size : number;
    inventoryUuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIDeleteInstanceOfferingMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.configuration.APIDeleteInstanceOfferingMsg': this
      };
      return msg;
    }
    uuid : string;
    deleteMode : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIGenerateSqlVOViewMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.configuration.APIGenerateSqlVOViewMsg': this
      };
      return msg;
    }
    basePackageNames : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIGenerateTestLinkDocumentMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.configuration.APIGenerateTestLinkDocumentMsg': this
      };
      return msg;
    }
    outputDir : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIGetGlobalPropertyMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.configuration.APIGetGlobalPropertyMsg': this
      };
      return msg;
    }
    session : SessionInventory;
    timeout : number;
  }


  export class APIChangeInstanceOfferingStateMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.configuration.APIChangeInstanceOfferingStateMsg': this
      };
      return msg;
    }
    uuid : string;
    stateEvent : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIGenerateSqlIndexMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.configuration.APIGenerateSqlIndexMsg': this
      };
      return msg;
    }
    outputPath : string;
    basePackageNames : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIQueryDiskOfferingMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.configuration.APIQueryDiskOfferingMsg': this
      };
      return msg;
    }
    conditions : Array<QueryCondition>;
    limit : number;
    start : number;
    count : boolean;
    replyWithCount : boolean;
    sortBy : string;
    sortDirection : string;
    fields : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIGetDiskOfferingMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.configuration.APIGetDiskOfferingMsg': this
      };
      return msg;
    }
    uuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIGenerateSqlForeignKeyMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.configuration.APIGenerateSqlForeignKeyMsg': this
      };
      return msg;
    }
    outputPath : string;
    basePackageNames : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIUpdateDiskOfferingMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.configuration.APIUpdateDiskOfferingMsg': this
      };
      return msg;
    }
    uuid : string;
    name : string;
    description : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIChangeDiskOfferingStateMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.configuration.APIChangeDiskOfferingStateMsg': this
      };
      return msg;
    }
    uuid : string;
    stateEvent : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APISearchInstanceOfferingMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.configuration.APISearchInstanceOfferingMsg': this
      };
      return msg;
    }
    fields : Array<string>;
    nameOpValueTriples : Array<NOVTriple>;
    nameOpListTriples : Array<NOLTriple>;
    start : number;
    size : number;
    inventoryUuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APISearchPrimaryStorageMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.storage.primary.APISearchPrimaryStorageMsg': this
      };
      return msg;
    }
    fields : Array<string>;
    nameOpValueTriples : Array<NOVTriple>;
    nameOpListTriples : Array<NOLTriple>;
    start : number;
    size : number;
    inventoryUuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIGetPrimaryStorageTypesMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.storage.primary.APIGetPrimaryStorageTypesMsg': this
      };
      return msg;
    }
    session : SessionInventory;
    timeout : number;
  }


  export class APIAttachPrimaryStorageToClusterMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.storage.primary.APIAttachPrimaryStorageToClusterMsg': this
      };
      return msg;
    }
    clusterUuid : string;
    primaryStorageUuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIListPrimaryStorageMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.storage.primary.APIListPrimaryStorageMsg': this
      };
      return msg;
    }
    length : number;
    offset : number;
    uuids : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIGetPrimaryStorageCapacityMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.storage.primary.APIGetPrimaryStorageCapacityMsg': this
      };
      return msg;
    }
    zoneUuids : Array<string>;
    clusterUuids : Array<string>;
    primaryStorageUuids : Array<string>;
    all : boolean;
    session : SessionInventory;
    timeout : number;
  }


  export class APIUpdatePrimaryStorageMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.storage.primary.APIUpdatePrimaryStorageMsg': this
      };
      return msg;
    }
    uuid : string;
    name : string;
    description : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIGetPrimaryStorageMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.storage.primary.APIGetPrimaryStorageMsg': this
      };
      return msg;
    }
    uuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIQueryPrimaryStorageMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.storage.primary.APIQueryPrimaryStorageMsg': this
      };
      return msg;
    }
    conditions : Array<QueryCondition>;
    limit : number;
    start : number;
    count : boolean;
    replyWithCount : boolean;
    sortBy : string;
    sortDirection : string;
    fields : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIChangePrimaryStorageStateMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.storage.primary.APIChangePrimaryStorageStateMsg': this
      };
      return msg;
    }
    uuid : string;
    stateEvent : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APISyncPrimaryStorageCapacityMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.storage.primary.APISyncPrimaryStorageCapacityMsg': this
      };
      return msg;
    }
    primaryStorageUuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIDeletePrimaryStorageMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.storage.primary.APIDeletePrimaryStorageMsg': this
      };
      return msg;
    }
    uuid : string;
    deleteMode : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIReconnectPrimaryStorageMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.storage.primary.APIReconnectPrimaryStorageMsg': this
      };
      return msg;
    }
    uuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIDetachPrimaryStorageFromClusterMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.storage.primary.APIDetachPrimaryStorageFromClusterMsg': this
      };
      return msg;
    }
    primaryStorageUuid : string;
    clusterUuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIGetPrimaryStorageAllocatorStrategiesMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.storage.primary.APIGetPrimaryStorageAllocatorStrategiesMsg': this
      };
      return msg;
    }
    session : SessionInventory;
    timeout : number;
  }


  export class APIQueryVolumeSnapshotTreeMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.storage.snapshot.APIQueryVolumeSnapshotTreeMsg': this
      };
      return msg;
    }
    conditions : Array<QueryCondition>;
    limit : number;
    start : number;
    count : boolean;
    replyWithCount : boolean;
    sortBy : string;
    sortDirection : string;
    fields : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIDeleteVolumeSnapshotMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.storage.snapshot.APIDeleteVolumeSnapshotMsg': this
      };
      return msg;
    }
    uuid : string;
    deleteMode : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIUpdateVolumeSnapshotMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.storage.snapshot.APIUpdateVolumeSnapshotMsg': this
      };
      return msg;
    }
    uuid : string;
    name : string;
    description : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIDeleteVolumeSnapshotFromBackupStorageMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.storage.snapshot.APIDeleteVolumeSnapshotFromBackupStorageMsg': this
      };
      return msg;
    }
    uuid : string;
    backupStorageUuids : Array<string>;
    deleteMode : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIQueryVolumeSnapshotMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.storage.snapshot.APIQueryVolumeSnapshotMsg': this
      };
      return msg;
    }
    conditions : Array<QueryCondition>;
    limit : number;
    start : number;
    count : boolean;
    replyWithCount : boolean;
    sortBy : string;
    sortDirection : string;
    fields : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIRevertVolumeFromSnapshotMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.storage.snapshot.APIRevertVolumeFromSnapshotMsg': this
      };
      return msg;
    }
    uuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIBackupVolumeSnapshotMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.storage.snapshot.APIBackupVolumeSnapshotMsg': this
      };
      return msg;
    }
    uuid : string;
    backupStorageUuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIGetVolumeSnapshotTreeMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.storage.snapshot.APIGetVolumeSnapshotTreeMsg': this
      };
      return msg;
    }
    volumeUuid : string;
    treeUuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIQueryBackupStorageMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.storage.backup.APIQueryBackupStorageMsg': this
      };
      return msg;
    }
    conditions : Array<QueryCondition>;
    limit : number;
    start : number;
    count : boolean;
    replyWithCount : boolean;
    sortBy : string;
    sortDirection : string;
    fields : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIListBackupStorageMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.storage.backup.APIListBackupStorageMsg': this
      };
      return msg;
    }
    length : number;
    offset : number;
    uuids : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIAttachBackupStorageToZoneMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.storage.backup.APIAttachBackupStorageToZoneMsg': this
      };
      return msg;
    }
    zoneUuid : string;
    backupStorageUuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APISearchBackupStorageMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.storage.backup.APISearchBackupStorageMsg': this
      };
      return msg;
    }
    fields : Array<string>;
    nameOpValueTriples : Array<NOVTriple>;
    nameOpListTriples : Array<NOLTriple>;
    start : number;
    size : number;
    inventoryUuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIGetBackupStorageMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.storage.backup.APIGetBackupStorageMsg': this
      };
      return msg;
    }
    uuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIGetBackupStorageTypesMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.storage.backup.APIGetBackupStorageTypesMsg': this
      };
      return msg;
    }
    session : SessionInventory;
    timeout : number;
  }


  export class APIChangeBackupStorageStateMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.storage.backup.APIChangeBackupStorageStateMsg': this
      };
      return msg;
    }
    uuid : string;
    stateEvent : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIScanBackupStorageMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.storage.backup.APIScanBackupStorageMsg': this
      };
      return msg;
    }
    backupStorageUuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIGetBackupStorageCapacityMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.storage.backup.APIGetBackupStorageCapacityMsg': this
      };
      return msg;
    }
    zoneUuids : Array<string>;
    backupStorageUuids : Array<string>;
    all : boolean;
    session : SessionInventory;
    timeout : number;
  }


  export class APIDetachBackupStorageFromZoneMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.storage.backup.APIDetachBackupStorageFromZoneMsg': this
      };
      return msg;
    }
    backupStorageUuid : string;
    zoneUuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIUpdateBackupStorageMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.storage.backup.APIUpdateBackupStorageMsg': this
      };
      return msg;
    }
    uuid : string;
    name : string;
    description : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIDeleteBackupStorageMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.storage.backup.APIDeleteBackupStorageMsg': this
      };
      return msg;
    }
    uuid : string;
    deleteMode : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIListL3NetworkMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.network.l3.APIListL3NetworkMsg': this
      };
      return msg;
    }
    length : number;
    offset : number;
    uuids : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIAddDnsToL3NetworkMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.network.l3.APIAddDnsToL3NetworkMsg': this
      };
      return msg;
    }
    l3NetworkUuid : string;
    dns : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APICreateL3NetworkMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.network.l3.APICreateL3NetworkMsg': this
      };
      return msg;
    }
    name : string;
    description : string;
    type : string;
    l2NetworkUuid : string;
    system : boolean;
    dnsDomain : string;
    resourceUuid : string;
    userTags : Array<string>;
    systemTags : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIGetFreeIpMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.network.l3.APIGetFreeIpMsg': this
      };
      return msg;
    }
    l3NetworkUuid : string;
    ipRangeUuid : string;
    limit : number;
    session : SessionInventory;
    timeout : number;
  }


  export class APIUpdateL3NetworkMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.network.l3.APIUpdateL3NetworkMsg': this
      };
      return msg;
    }
    uuid : string;
    name : string;
    description : string;
    system : boolean;
    session : SessionInventory;
    timeout : number;
  }


  export class APIDeleteIpRangeMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.network.l3.APIDeleteIpRangeMsg': this
      };
      return msg;
    }
    uuid : string;
    deleteMode : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIChangeL3NetworkStateMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.network.l3.APIChangeL3NetworkStateMsg': this
      };
      return msg;
    }
    uuid : string;
    stateEvent : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIGetL3NetworkMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.network.l3.APIGetL3NetworkMsg': this
      };
      return msg;
    }
    uuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIAddIpRangeMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.network.l3.APIAddIpRangeMsg': this
      };
      return msg;
    }
    l3NetworkUuid : string;
    name : string;
    description : string;
    startIp : string;
    endIp : string;
    netmask : string;
    gateway : string;
    resourceUuid : string;
    userTags : Array<string>;
    systemTags : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIGetL3NetworkTypesMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.network.l3.APIGetL3NetworkTypesMsg': this
      };
      return msg;
    }
    session : SessionInventory;
    timeout : number;
  }


  export class APISearchL3NetworkMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.network.l3.APISearchL3NetworkMsg': this
      };
      return msg;
    }
    fields : Array<string>;
    nameOpValueTriples : Array<NOVTriple>;
    nameOpListTriples : Array<NOLTriple>;
    start : number;
    size : number;
    inventoryUuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIAddIpRangeByNetworkCidrMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.network.l3.APIAddIpRangeByNetworkCidrMsg': this
      };
      return msg;
    }
    name : string;
    description : string;
    l3NetworkUuid : string;
    networkCidr : string;
    resourceUuid : string;
    userTags : Array<string>;
    systemTags : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIQueryIpRangeMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.network.l3.APIQueryIpRangeMsg': this
      };
      return msg;
    }
    conditions : Array<QueryCondition>;
    limit : number;
    start : number;
    count : boolean;
    replyWithCount : boolean;
    sortBy : string;
    sortDirection : string;
    fields : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIRemoveDnsFromL3NetworkMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.network.l3.APIRemoveDnsFromL3NetworkMsg': this
      };
      return msg;
    }
    l3NetworkUuid : string;
    dns : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIListIpRangeMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.network.l3.APIListIpRangeMsg': this
      };
      return msg;
    }
    length : number;
    offset : number;
    uuids : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIGetIpAddressCapacityMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.network.l3.APIGetIpAddressCapacityMsg': this
      };
      return msg;
    }
    zoneUuids : Array<string>;
    l3NetworkUuids : Array<string>;
    ipRangeUuids : Array<string>;
    all : boolean;
    session : SessionInventory;
    timeout : number;
  }


  export class APIDeleteL3NetworkMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.network.l3.APIDeleteL3NetworkMsg': this
      };
      return msg;
    }
    uuid : string;
    deleteMode : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIUpdateIpRangeMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.network.l3.APIUpdateIpRangeMsg': this
      };
      return msg;
    }
    uuid : string;
    name : string;
    description : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIQueryL3NetworkMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.network.l3.APIQueryL3NetworkMsg': this
      };
      return msg;
    }
    conditions : Array<QueryCondition>;
    limit : number;
    start : number;
    count : boolean;
    replyWithCount : boolean;
    sortBy : string;
    sortDirection : string;
    fields : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIAttachNetworkServiceToL3NetworkMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.network.service.APIAttachNetworkServiceToL3NetworkMsg': this
      };
      return msg;
    }
    l3NetworkUuid : string;
    networkServices : any;
    session : SessionInventory;
    timeout : number;
  }


  export class APIAddNetworkServiceProviderMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.network.service.APIAddNetworkServiceProviderMsg': this
      };
      return msg;
    }
    name : string;
    description : string;
    networkServiceTypes : Array<string>;
    type : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIQueryNetworkServiceL3NetworkRefMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.network.service.APIQueryNetworkServiceL3NetworkRefMsg': this
      };
      return msg;
    }
    conditions : Array<QueryCondition>;
    limit : number;
    start : number;
    count : boolean;
    replyWithCount : boolean;
    sortBy : string;
    sortDirection : string;
    fields : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIAttachNetworkServiceProviderToL2NetworkMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.network.service.APIAttachNetworkServiceProviderToL2NetworkMsg': this
      };
      return msg;
    }
    networkServiceProviderUuid : string;
    l2NetworkUuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APISearchNetworkServiceProviderMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.network.service.APISearchNetworkServiceProviderMsg': this
      };
      return msg;
    }
    fields : Array<string>;
    nameOpValueTriples : Array<NOVTriple>;
    nameOpListTriples : Array<NOLTriple>;
    start : number;
    size : number;
    inventoryUuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIDetachNetworkServiceProviderFromL2NetworkMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.network.service.APIDetachNetworkServiceProviderFromL2NetworkMsg': this
      };
      return msg;
    }
    networkServiceProviderUuid : string;
    l2NetworkUuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIQueryNetworkServiceProviderMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.network.service.APIQueryNetworkServiceProviderMsg': this
      };
      return msg;
    }
    conditions : Array<QueryCondition>;
    limit : number;
    start : number;
    count : boolean;
    replyWithCount : boolean;
    sortBy : string;
    sortDirection : string;
    fields : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIGetNetworkServiceTypesMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.network.service.APIGetNetworkServiceTypesMsg': this
      };
      return msg;
    }
    session : SessionInventory;
    timeout : number;
  }


  export class APIGetNetworkServiceProviderMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.network.service.APIGetNetworkServiceProviderMsg': this
      };
      return msg;
    }
    uuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIListNetworkServiceProviderMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.network.service.APIListNetworkServiceProviderMsg': this
      };
      return msg;
    }
    length : number;
    offset : number;
    uuids : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIAttachL2NetworkToClusterMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.network.l2.APIAttachL2NetworkToClusterMsg': this
      };
      return msg;
    }
    l2NetworkUuid : string;
    clusterUuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIQueryL2VlanNetworkMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.network.l2.APIQueryL2VlanNetworkMsg': this
      };
      return msg;
    }
    conditions : Array<QueryCondition>;
    limit : number;
    start : number;
    count : boolean;
    replyWithCount : boolean;
    sortBy : string;
    sortDirection : string;
    fields : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIGetL2NetworkMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.network.l2.APIGetL2NetworkMsg': this
      };
      return msg;
    }
    uuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIListL2NetworkMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.network.l2.APIListL2NetworkMsg': this
      };
      return msg;
    }
    length : number;
    offset : number;
    uuids : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APISearchL2VlanNetworkMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.network.l2.APISearchL2VlanNetworkMsg': this
      };
      return msg;
    }
    fields : Array<string>;
    nameOpValueTriples : Array<NOVTriple>;
    nameOpListTriples : Array<NOLTriple>;
    start : number;
    size : number;
    inventoryUuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APICreateL2VlanNetworkMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.network.l2.APICreateL2VlanNetworkMsg': this
      };
      return msg;
    }
    vlan : number;
    name : string;
    description : string;
    zoneUuid : string;
    physicalInterface : string;
    type : string;
    resourceUuid : string;
    userTags : Array<string>;
    systemTags : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIDetachL2NetworkFromClusterMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.network.l2.APIDetachL2NetworkFromClusterMsg': this
      };
      return msg;
    }
    l2NetworkUuid : string;
    clusterUuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIDeleteL2NetworkMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.network.l2.APIDeleteL2NetworkMsg': this
      };
      return msg;
    }
    uuid : string;
    deleteMode : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APISearchL2NetworkMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.network.l2.APISearchL2NetworkMsg': this
      };
      return msg;
    }
    fields : Array<string>;
    nameOpValueTriples : Array<NOVTriple>;
    nameOpListTriples : Array<NOLTriple>;
    start : number;
    size : number;
    inventoryUuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APICreateL2NoVlanNetworkMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.network.l2.APICreateL2NoVlanNetworkMsg': this
      };
      return msg;
    }
    name : string;
    description : string;
    zoneUuid : string;
    physicalInterface : string;
    type : string;
    resourceUuid : string;
    userTags : Array<string>;
    systemTags : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIListL2VlanNetworkMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.network.l2.APIListL2VlanNetworkMsg': this
      };
      return msg;
    }
    length : number;
    offset : number;
    uuids : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIUpdateL2NetworkMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.network.l2.APIUpdateL2NetworkMsg': this
      };
      return msg;
    }
    uuid : string;
    name : string;
    description : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIGetL2VlanNetworkMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.network.l2.APIGetL2VlanNetworkMsg': this
      };
      return msg;
    }
    uuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIGetL2NetworkTypesMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.network.l2.APIGetL2NetworkTypesMsg': this
      };
      return msg;
    }
    session : SessionInventory;
    timeout : number;
  }


  export class APIQueryL2NetworkMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.network.l2.APIQueryL2NetworkMsg': this
      };
      return msg;
    }
    conditions : Array<QueryCondition>;
    limit : number;
    start : number;
    count : boolean;
    replyWithCount : boolean;
    sortBy : string;
    sortDirection : string;
    fields : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIDeleteSearchIndexMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.search.APIDeleteSearchIndexMsg': this
      };
      return msg;
    }
    indexName : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APISearchGenerateSqlTriggerMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.search.APISearchGenerateSqlTriggerMsg': this
      };
      return msg;
    }
    resultPath : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APICreateSearchIndexMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.search.APICreateSearchIndexMsg': this
      };
      return msg;
    }
    inventoryNames : Array<string>;
    isRecreate : boolean;
    session : SessionInventory;
    timeout : number;
  }


  export class APIQueryUserTagMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.tag.APIQueryUserTagMsg': this
      };
      return msg;
    }
    conditions : Array<QueryCondition>;
    limit : number;
    start : number;
    count : boolean;
    replyWithCount : boolean;
    sortBy : string;
    sortDirection : string;
    fields : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIQuerySystemTagMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.tag.APIQuerySystemTagMsg': this
      };
      return msg;
    }
    conditions : Array<QueryCondition>;
    limit : number;
    start : number;
    count : boolean;
    replyWithCount : boolean;
    sortBy : string;
    sortDirection : string;
    fields : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIDeleteTagMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.tag.APIDeleteTagMsg': this
      };
      return msg;
    }
    uuid : string;
    deleteMode : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APICreateUserTagMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.tag.APICreateUserTagMsg': this
      };
      return msg;
    }
    resourceType : string;
    resourceUuid : string;
    tag : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APICreateSystemTagMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.tag.APICreateSystemTagMsg': this
      };
      return msg;
    }
    resourceType : string;
    resourceUuid : string;
    tag : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIUpdateSystemTagMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.tag.APIUpdateSystemTagMsg': this
      };
      return msg;
    }
    uuid : string;
    tag : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIQueryTagMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.tag.APIQueryTagMsg': this
      };
      return msg;
    }
    systemTag : boolean;
    conditions : Array<QueryCondition>;
    limit : number;
    start : number;
    count : boolean;
    replyWithCount : boolean;
    sortBy : string;
    sortDirection : string;
    fields : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIQueryManagementNodeMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.managementnode.APIQueryManagementNodeMsg': this
      };
      return msg;
    }
    conditions : Array<QueryCondition>;
    limit : number;
    start : number;
    count : boolean;
    replyWithCount : boolean;
    sortBy : string;
    sortDirection : string;
    fields : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIListManagementNodeMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.managementnode.APIListManagementNodeMsg': this
      };
      return msg;
    }
    length : number;
    offset : number;
    uuids : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APICreateMessage implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.message.APICreateMessage': this
      };
      return msg;
    }
    resourceUuid : string;
    userTags : Array<string>;
    systemTags : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIListClusterMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.cluster.APIListClusterMsg': this
      };
      return msg;
    }
    length : number;
    offset : number;
    uuids : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIGetClusterMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.cluster.APIGetClusterMsg': this
      };
      return msg;
    }
    uuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APISearchClusterMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.cluster.APISearchClusterMsg': this
      };
      return msg;
    }
    fields : Array<string>;
    nameOpValueTriples : Array<NOVTriple>;
    nameOpListTriples : Array<NOLTriple>;
    start : number;
    size : number;
    inventoryUuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIQueryClusterMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.cluster.APIQueryClusterMsg': this
      };
      return msg;
    }
    conditions : Array<QueryCondition>;
    limit : number;
    start : number;
    count : boolean;
    replyWithCount : boolean;
    sortBy : string;
    sortDirection : string;
    fields : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIDeleteClusterMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.cluster.APIDeleteClusterMsg': this
      };
      return msg;
    }
    uuid : string;
    deleteMode : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIUpdateClusterMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.cluster.APIUpdateClusterMsg': this
      };
      return msg;
    }
    uuid : string;
    name : string;
    description : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APICreateClusterMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.cluster.APICreateClusterMsg': this
      };
      return msg;
    }
    zoneUuid : string;
    name : string;
    description : string;
    hypervisorType : string;
    type : string;
    resourceUuid : string;
    userTags : Array<string>;
    systemTags : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIChangeClusterStateMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.cluster.APIChangeClusterStateMsg': this
      };
      return msg;
    }
    uuid : string;
    stateEvent : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIAttachPolicyToUserGroupMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.identity.APIAttachPolicyToUserGroupMsg': this
      };
      return msg;
    }
    policyUuid : string;
    groupUuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIRemoveUserFromGroupMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.identity.APIRemoveUserFromGroupMsg': this
      };
      return msg;
    }
    userUuid : string;
    groupUuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIAttachPolicyToUserMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.identity.APIAttachPolicyToUserMsg': this
      };
      return msg;
    }
    userUuid : string;
    policyUuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIGetAccountMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.identity.APIGetAccountMsg': this
      };
      return msg;
    }
    uuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIListAccountMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.identity.APIListAccountMsg': this
      };
      return msg;
    }
    length : number;
    offset : number;
    uuids : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIAddUserToGroupMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.identity.APIAddUserToGroupMsg': this
      };
      return msg;
    }
    userUuid : string;
    groupUuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIQueryQuotaMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.identity.APIQueryQuotaMsg': this
      };
      return msg;
    }
    conditions : Array<QueryCondition>;
    limit : number;
    start : number;
    count : boolean;
    replyWithCount : boolean;
    sortBy : string;
    sortDirection : string;
    fields : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIShareResourceMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.identity.APIShareResourceMsg': this
      };
      return msg;
    }
    resourceUuids : Array<string>;
    accountUuids : Array<string>;
    toPublic : boolean;
    session : SessionInventory;
    timeout : number;
  }


  export class APIListPolicyMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.identity.APIListPolicyMsg': this
      };
      return msg;
    }
    length : number;
    offset : number;
    uuids : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APICreateAccountMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.identity.APICreateAccountMsg': this
      };
      return msg;
    }
    name : string;
    password : string;
    type : string;
    description : string;
    resourceUuid : string;
    userTags : Array<string>;
    systemTags : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIDeleteAccountMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.identity.APIDeleteAccountMsg': this
      };
      return msg;
    }
    uuid : string;
    deleteMode : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APICreateUserGroupMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.identity.APICreateUserGroupMsg': this
      };
      return msg;
    }
    name : string;
    description : string;
    resourceUuid : string;
    userTags : Array<string>;
    systemTags : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APICreateUserMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.identity.APICreateUserMsg': this
      };
      return msg;
    }
    name : string;
    password : string;
    description : string;
    resourceUuid : string;
    userTags : Array<string>;
    systemTags : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APILogInByUserMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.identity.APILogInByUserMsg': this
      };
      return msg;
    }
    accountUuid : string;
    userName : string;
    password : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APISearchAccountMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.identity.APISearchAccountMsg': this
      };
      return msg;
    }
    fields : Array<string>;
    nameOpValueTriples : Array<NOVTriple>;
    nameOpListTriples : Array<NOLTriple>;
    start : number;
    size : number;
    inventoryUuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APISearchPolicyMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.identity.APISearchPolicyMsg': this
      };
      return msg;
    }
    fields : Array<string>;
    nameOpValueTriples : Array<NOVTriple>;
    nameOpListTriples : Array<NOLTriple>;
    start : number;
    size : number;
    inventoryUuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APISessionMessage implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.identity.APISessionMessage': this
      };
      return msg;
    }
    session : SessionInventory;
    timeout : number;
  }


  export class APIGetUserMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.identity.APIGetUserMsg': this
      };
      return msg;
    }
    uuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIGetUserGroupMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.identity.APIGetUserGroupMsg': this
      };
      return msg;
    }
    uuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIDetachPolicyFromUserGroupMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.identity.APIDetachPolicyFromUserGroupMsg': this
      };
      return msg;
    }
    policyUuid : string;
    groupUuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIUpdateQuotaMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.identity.APIUpdateQuotaMsg': this
      };
      return msg;
    }
    identityUuid : string;
    name : string;
    value : number;
    session : SessionInventory;
    timeout : number;
  }


  export class APIQueryAccountMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.identity.APIQueryAccountMsg': this
      };
      return msg;
    }
    conditions : Array<QueryCondition>;
    limit : number;
    start : number;
    count : boolean;
    replyWithCount : boolean;
    sortBy : string;
    sortDirection : string;
    fields : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIQueryPolicyMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.identity.APIQueryPolicyMsg': this
      };
      return msg;
    }
    conditions : Array<QueryCondition>;
    limit : number;
    start : number;
    count : boolean;
    replyWithCount : boolean;
    sortBy : string;
    sortDirection : string;
    fields : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIQueryUserMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.identity.APIQueryUserMsg': this
      };
      return msg;
    }
    conditions : Array<QueryCondition>;
    limit : number;
    start : number;
    count : boolean;
    replyWithCount : boolean;
    sortBy : string;
    sortDirection : string;
    fields : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIDeletePolicyMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.identity.APIDeletePolicyMsg': this
      };
      return msg;
    }
    uuid : string;
    deleteMode : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIRevokeResourceSharingMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.identity.APIRevokeResourceSharingMsg': this
      };
      return msg;
    }
    resourceUuids : Array<string>;
    toPublic : boolean;
    accountUuids : Array<string>;
    all : boolean;
    session : SessionInventory;
    timeout : number;
  }


  export class APILogInByAccountMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.identity.APILogInByAccountMsg': this
      };
      return msg;
    }
    accountName : string;
    password : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIValidateSessionMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.identity.APIValidateSessionMsg': this
      };
      return msg;
    }
    sessionUuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APISearchUserGroupMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.identity.APISearchUserGroupMsg': this
      };
      return msg;
    }
    fields : Array<string>;
    nameOpValueTriples : Array<NOVTriple>;
    nameOpListTriples : Array<NOLTriple>;
    start : number;
    size : number;
    inventoryUuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIListUserMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.identity.APIListUserMsg': this
      };
      return msg;
    }
    length : number;
    offset : number;
    uuids : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIDeleteUserMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.identity.APIDeleteUserMsg': this
      };
      return msg;
    }
    uuid : string;
    deleteMode : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIUpdateUserMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.identity.APIUpdateUserMsg': this
      };
      return msg;
    }
    uuid : string;
    password : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APISearchUserMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.identity.APISearchUserMsg': this
      };
      return msg;
    }
    fields : Array<string>;
    nameOpValueTriples : Array<NOVTriple>;
    nameOpListTriples : Array<NOLTriple>;
    start : number;
    size : number;
    inventoryUuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIUpdateAccountMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.identity.APIUpdateAccountMsg': this
      };
      return msg;
    }
    uuid : string;
    password : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIDeleteUserGroupMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.identity.APIDeleteUserGroupMsg': this
      };
      return msg;
    }
    uuid : string;
    deleteMode : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APILogOutMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.identity.APILogOutMsg': this
      };
      return msg;
    }
    sessionUuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIGetPolicyMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.identity.APIGetPolicyMsg': this
      };
      return msg;
    }
    uuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export enum StatementEffect {
    Allow,
    Deny
  }


  export class Statement {
    name : string;
    effect : any;
    principals : Array<string>;
    actions : Array<string>;
    resources : Array<string>;
  }


  export class APICreatePolicyMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.identity.APICreatePolicyMsg': this
      };
      return msg;
    }
    name : string;
    description : string;
    statements : Array<Statement>;
    resourceUuid : string;
    userTags : Array<string>;
    systemTags : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIDetachPolicyFromUserMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.identity.APIDetachPolicyFromUserMsg': this
      };
      return msg;
    }
    policyUuid : string;
    userUuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIQueryUserGroupMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.identity.APIQueryUserGroupMsg': this
      };
      return msg;
    }
    conditions : Array<QueryCondition>;
    limit : number;
    start : number;
    count : boolean;
    replyWithCount : boolean;
    sortBy : string;
    sortDirection : string;
    fields : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIUpdateZoneMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.zone.APIUpdateZoneMsg': this
      };
      return msg;
    }
    name : string;
    description : string;
    uuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIGetZoneMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.zone.APIGetZoneMsg': this
      };
      return msg;
    }
    uuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIDeleteZoneMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.zone.APIDeleteZoneMsg': this
      };
      return msg;
    }
    uuid : string;
    deleteMode : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APICreateZoneMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.zone.APICreateZoneMsg': this
      };
      return msg;
    }
    name : string;
    description : string;
    type : string;
    resourceUuid : string;
    userTags : Array<string>;
    systemTags : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APISearchZoneMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.zone.APISearchZoneMsg': this
      };
      return msg;
    }
    fields : Array<string>;
    nameOpValueTriples : Array<NOVTriple>;
    nameOpListTriples : Array<NOLTriple>;
    start : number;
    size : number;
    inventoryUuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIQueryZoneMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.zone.APIQueryZoneMsg': this
      };
      return msg;
    }
    conditions : Array<QueryCondition>;
    limit : number;
    start : number;
    count : boolean;
    replyWithCount : boolean;
    sortBy : string;
    sortDirection : string;
    fields : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIListZonesMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.zone.APIListZonesMsg': this
      };
      return msg;
    }
    length : number;
    offset : number;
    uuids : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIChangeZoneStateMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.zone.APIChangeZoneStateMsg': this
      };
      return msg;
    }
    uuid : string;
    stateEvent : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIChangeHostStateMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.host.APIChangeHostStateMsg': this
      };
      return msg;
    }
    uuid : string;
    stateEvent : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIReconnectHostMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.host.APIReconnectHostMsg': this
      };
      return msg;
    }
    uuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIListHostMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.host.APIListHostMsg': this
      };
      return msg;
    }
    length : number;
    offset : number;
    uuids : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIUpdateHostMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.host.APIUpdateHostMsg': this
      };
      return msg;
    }
    uuid : string;
    name : string;
    description : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIDeleteHostMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.host.APIDeleteHostMsg': this
      };
      return msg;
    }
    uuid : string;
    deleteMode : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIGetHostMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.host.APIGetHostMsg': this
      };
      return msg;
    }
    uuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APISearchHostMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.host.APISearchHostMsg': this
      };
      return msg;
    }
    fields : Array<string>;
    nameOpValueTriples : Array<NOVTriple>;
    nameOpListTriples : Array<NOLTriple>;
    start : number;
    size : number;
    inventoryUuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIGetHypervisorTypesMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.host.APIGetHypervisorTypesMsg': this
      };
      return msg;
    }
    session : SessionInventory;
    timeout : number;
  }


  export class APIQueryHostMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.host.APIQueryHostMsg': this
      };
      return msg;
    }
    conditions : Array<QueryCondition>;
    limit : number;
    start : number;
    count : boolean;
    replyWithCount : boolean;
    sortBy : string;
    sortDirection : string;
    fields : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIAddSimulatorHostMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.simulator.APIAddSimulatorHostMsg': this
      };
      return msg;
    }
    memoryCapacity : number;
    cpuCapacity : number;
    name : string;
    description : string;
    managementIp : string;
    clusterUuid : string;
    resourceUuid : string;
    userTags : Array<string>;
    systemTags : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIAddSimulatorPrimaryStorageMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.simulator.storage.primary.APIAddSimulatorPrimaryStorageMsg': this
      };
      return msg;
    }
    totalCapacity : number;
    availableCapacity : number;
    url : string;
    name : string;
    description : string;
    type : string;
    zoneUuid : string;
    resourceUuid : string;
    userTags : Array<string>;
    systemTags : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIAddSimulatorBackupStorageMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.simulator.storage.backup.APIAddSimulatorBackupStorageMsg': this
      };
      return msg;
    }
    totalCapacity : number;
    availableCapacity : number;
    url : string;
    name : string;
    description : string;
    type : string;
    resourceUuid : string;
    userTags : Array<string>;
    systemTags : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIListApplianceVmMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.appliancevm.APIListApplianceVmMsg': this
      };
      return msg;
    }
    length : number;
    offset : number;
    uuids : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIQueryApplianceVmMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.appliancevm.APIQueryApplianceVmMsg': this
      };
      return msg;
    }
    conditions : Array<QueryCondition>;
    limit : number;
    start : number;
    count : boolean;
    replyWithCount : boolean;
    sortBy : string;
    sortDirection : string;
    fields : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIAddIscsiFileSystemBackendPrimaryStorageMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.storage.primary.iscsi.APIAddIscsiFileSystemBackendPrimaryStorageMsg': this
      };
      return msg;
    }
    hostname : string;
    sshUsername : string;
    sshPassword : string;
    filesystemType : string;
    chapUsername : string;
    chapPassword : string;
    url : string;
    name : string;
    description : string;
    type : string;
    zoneUuid : string;
    resourceUuid : string;
    userTags : Array<string>;
    systemTags : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIQueryIscsiFileSystemBackendPrimaryStorageMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.storage.primary.iscsi.APIQueryIscsiFileSystemBackendPrimaryStorageMsg': this
      };
      return msg;
    }
    conditions : Array<QueryCondition>;
    limit : number;
    start : number;
    count : boolean;
    replyWithCount : boolean;
    sortBy : string;
    sortDirection : string;
    fields : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIUpdateIscsiFileSystemBackendPrimaryStorageMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.storage.primary.iscsi.APIUpdateIscsiFileSystemBackendPrimaryStorageMsg': this
      };
      return msg;
    }
    chapUsername : string;
    chapPassword : string;
    sshUsername : string;
    sshPassword : string;
    uuid : string;
    name : string;
    description : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIAddLocalPrimaryStorageMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.storage.primary.local.APIAddLocalPrimaryStorageMsg': this
      };
      return msg;
    }
    url : string;
    name : string;
    description : string;
    type : string;
    zoneUuid : string;
    resourceUuid : string;
    userTags : Array<string>;
    systemTags : Array<string>;
    session : SessionInventory;
    timeout : number;
  }

   export class APIAddSharedMountPointPrimaryStorageMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.storage.primary.smp.APIAddSharedMountPointPrimaryStorageMsg': this
      };
      return msg;
    }
    url : string;
    name : string;
    description : string;
    zoneUuid : string;
    session : SessionInventory;
    timeout : number;
  }

  export class APIQueryCephPrimaryStorageMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.storage.ceph.primary.APIQueryCephPrimaryStorageMsg': this
      };
      return msg;
    }
    conditions : Array<QueryCondition>;
    limit : number;
    start : number;
    count : boolean;
    replyWithCount : boolean;
    sortBy : string;
    sortDirection : string;
    fields : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIAddCephPrimaryStorageMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.storage.ceph.primary.APIAddCephPrimaryStorageMsg': this
      };
      return msg;
    }
    monUrls : Array<string>;
    rootVolumePoolName : string;
    dataVolumePoolName : string;
    imageCachePoolName : string;
    url : string;
    name : string;
    description : string;
    type : string;
    zoneUuid : string;
    resourceUuid : string;
    userTags : Array<string>;
    systemTags : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIAddMonToCephPrimaryStorageMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.storage.ceph.primary.APIAddMonToCephPrimaryStorageMsg': this
      };
      return msg;
    }
    uuid : string;
    monUrls : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIRemoveMonFromCephPrimaryStorageMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.storage.ceph.primary.APIRemoveMonFromCephPrimaryStorageMsg': this
      };
      return msg;
    }
    uuid : string;
    monHostnames : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIAddCephBackupStorageMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.storage.ceph.backup.APIAddCephBackupStorageMsg': this
      };
      return msg;
    }
    monUrls : Array<string>;
    poolName : string;
    url : string;
    name : string;
    description : string;
    type : string;
    resourceUuid : string;
    userTags : Array<string>;
    systemTags : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIAddMonToCephBackupStorageMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.storage.ceph.backup.APIAddMonToCephBackupStorageMsg': this
      };
      return msg;
    }
    uuid : string;
    monUrls : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIQueryCephBackupStorageMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.storage.ceph.backup.APIQueryCephBackupStorageMsg': this
      };
      return msg;
    }
    conditions : Array<QueryCondition>;
    limit : number;
    start : number;
    count : boolean;
    replyWithCount : boolean;
    sortBy : string;
    sortDirection : string;
    fields : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIRemoveMonFromCephBackupStorageMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.storage.ceph.backup.APIRemoveMonFromCephBackupStorageMsg': this
      };
      return msg;
    }
    uuid : string;
    monHostnames : Array<string>;
    session : SessionInventory;
    timeout : number;
  }

  export class APIQueryFusionstorPrimaryStorageMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.storage.fusionstor.primary.APIQueryFusionstorPrimaryStorageMsg': this
      };
      return msg;
    }
    conditions : Array<QueryCondition>;
    limit : number;
    start : number;
    count : boolean;
    replyWithCount : boolean;
    sortBy : string;
    sortDirection : string;
    fields : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIAddFusionstorPrimaryStorageMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.storage.fusionstor.primary.APIAddFusionstorPrimaryStorageMsg': this
      };
      return msg;
    }
    monUrls : Array<string>;
    rootVolumePoolName : string;
    dataVolumePoolName : string;
    imageCachePoolName : string;
    url : string;
    name : string;
    description : string;
    type : string;
    zoneUuid : string;
    resourceUuid : string;
    userTags : Array<string>;
    systemTags : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIAddMonToFusionstorPrimaryStorageMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.storage.fusionstor.primary.APIAddMonToFusionstorPrimaryStorageMsg': this
      };
      return msg;
    }
    uuid : string;
    monUrls : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIRemoveMonFromFusionstorPrimaryStorageMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.storage.fusionstor.primary.APIRemoveMonFromFusionstorPrimaryStorageMsg': this
      };
      return msg;
    }
    uuid : string;
    monHostnames : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIAddFusionstorBackupStorageMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.storage.fusionstor.backup.APIAddFusionstorBackupStorageMsg': this
      };
      return msg;
    }
    monUrls : Array<string>;
    poolName : string;
    url : string;
    name : string;
    description : string;
    type : string;
    resourceUuid : string;
    userTags : Array<string>;
    systemTags : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIAddMonToFusionstorBackupStorageMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.storage.fusionstor.backup.APIAddMonToFusionstorBackupStorageMsg': this
      };
      return msg;
    }
    uuid : string;
    monUrls : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIQueryFusionstorBackupStorageMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.storage.fusionstor.backup.APIQueryFusionstorBackupStorageMsg': this
      };
      return msg;
    }
    conditions : Array<QueryCondition>;
    limit : number;
    start : number;
    count : boolean;
    replyWithCount : boolean;
    sortBy : string;
    sortDirection : string;
    fields : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIRemoveMonFromFusionstorBackupStorageMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.storage.fusionstor.backup.APIRemoveMonFromFusionstorBackupStorageMsg': this
      };
      return msg;
    }
    uuid : string;
    monHostnames : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIUpdateKVMHostMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.kvm.APIUpdateKVMHostMsg': this
      };
      return msg;
    }
    username : string;
    password : string;
    uuid : string;
    name : string;
    description : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIAddKVMHostMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.kvm.APIAddKVMHostMsg': this
      };
      return msg;
    }
    username : string;
    password : string;
    name : string;
    port : number;
    description : string;
    managementIp : string;
    clusterUuid : string;
    resourceUuid : string;
    userTags : Array<string>;
    systemTags : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIAddNfsPrimaryStorageMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.storage.primary.nfs.APIAddNfsPrimaryStorageMsg': this
      };
      return msg;
    }
    url : string;
    name : string;
    description : string;
    type : string;
    zoneUuid : string;
    resourceUuid : string;
    userTags : Array<string>;
    systemTags : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIGetSftpBackupStorageMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.storage.backup.sftp.APIGetSftpBackupStorageMsg': this
      };
      return msg;
    }
    uuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APISearchSftpBackupStorageMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.storage.backup.sftp.APISearchSftpBackupStorageMsg': this
      };
      return msg;
    }
    fields : Array<string>;
    nameOpValueTriples : Array<NOVTriple>;
    nameOpListTriples : Array<NOLTriple>;
    start : number;
    size : number;
    inventoryUuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIQuerySftpBackupStorageMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.storage.backup.sftp.APIQuerySftpBackupStorageMsg': this
      };
      return msg;
    }
    conditions : Array<QueryCondition>;
    limit : number;
    start : number;
    count : boolean;
    replyWithCount : boolean;
    sortBy : string;
    sortDirection : string;
    fields : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIReconnectSftpBackupStorageMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.storage.backup.sftp.APIReconnectSftpBackupStorageMsg': this
      };
      return msg;
    }
    uuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIUpdateSftpBackupStorageMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.storage.backup.sftp.APIUpdateSftpBackupStorageMsg': this
      };
      return msg;
    }
    username : string;
    password : string;
    uuid : string;
    name : string;
    description : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIAddSftpBackupStorageMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.storage.backup.sftp.APIAddSftpBackupStorageMsg': this
      };
      return msg;
    }
    hostname : string;
    username : string;
    password : string;
    port : number;
    url : string;
    name : string;
    description : string;
    type : string;
    resourceUuid : string;
    userTags : Array<string>;
    systemTags : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIReconnectVirtualRouterMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.network.service.virtualrouter.APIReconnectVirtualRouterMsg': this
      };
      return msg;
    }
    vmInstanceUuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APICreateVirtualRouterVmMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.network.service.virtualrouter.APICreateVirtualRouterVmMsg': this
      };
      return msg;
    }
    managementNetworkUuid : string;
    publicNetworkUuid : string;
    networkServicesProvided : Array<string>;
    name : string;
    instanceOfferingUuid : string;
    imageUuid : string;
    l3NetworkUuids : Array<string>;
    type : string;
    rootDiskOfferingUuid : string;
    dataDiskOfferingUuids : Array<string>;
    zoneUuid : string;
    clusterUuid : string;
    hostUuid : string;
    description : string;
    defaultL3NetworkUuid : string;
    resourceUuid : string;
    userTags : Array<string>;
    systemTags : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIGetVirtualRouterOfferingMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.network.service.virtualrouter.APIGetVirtualRouterOfferingMsg': this
      };
      return msg;
    }
    uuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APISearchVirtualRouterVmMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.network.service.virtualrouter.APISearchVirtualRouterVmMsg': this
      };
      return msg;
    }
    fields : Array<string>;
    nameOpValueTriples : Array<NOVTriple>;
    nameOpListTriples : Array<NOLTriple>;
    start : number;
    size : number;
    inventoryUuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIQueryVirtualRouterOfferingMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.network.service.virtualrouter.APIQueryVirtualRouterOfferingMsg': this
      };
      return msg;
    }
    conditions : Array<QueryCondition>;
    limit : number;
    start : number;
    count : boolean;
    replyWithCount : boolean;
    sortBy : string;
    sortDirection : string;
    fields : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APICreateVirtualRouterOfferingMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.network.service.virtualrouter.APICreateVirtualRouterOfferingMsg': this
      };
      return msg;
    }
    zoneUuid : string;
    managementNetworkUuid : string;
    imageUuid : string;
    publicNetworkUuid : string;
    isDefault : boolean;
    name : string;
    description : string;
    cpuNum : number;
    cpuSpeed : number;
    memorySize : number;
    allocatorStrategy : string;
    sortKey : number;
    type : string;
    resourceUuid : string;
    userTags : Array<string>;
    systemTags : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIQueryVirtualRouterVmMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.network.service.virtualrouter.APIQueryVirtualRouterVmMsg': this
      };
      return msg;
    }
    conditions : Array<QueryCondition>;
    limit : number;
    start : number;
    count : boolean;
    replyWithCount : boolean;
    sortBy : string;
    sortDirection : string;
    fields : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APISearchVirtualRouterOffingMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.network.service.virtualrouter.APISearchVirtualRouterOffingMsg': this
      };
      return msg;
    }
    fields : Array<string>;
    nameOpValueTriples : Array<NOVTriple>;
    nameOpListTriples : Array<NOLTriple>;
    start : number;
    size : number;
    inventoryUuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIUpdateVirtualRouterOfferingMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.network.service.virtualrouter.APIUpdateVirtualRouterOfferingMsg': this
      };
      return msg;
    }
    isDefault : boolean;
    imageUuid : string;
    uuid : string;
    name : string;
    description : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIAttachPortForwardingRuleMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.network.service.portforwarding.APIAttachPortForwardingRuleMsg': this
      };
      return msg;
    }
    ruleUuid : string;
    vmNicUuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIDetachPortForwardingRuleMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.network.service.portforwarding.APIDetachPortForwardingRuleMsg': this
      };
      return msg;
    }
    uuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIGetPortForwardingAttachableVmNicsMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.network.service.portforwarding.APIGetPortForwardingAttachableVmNicsMsg': this
      };
      return msg;
    }
    ruleUuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIChangePortForwardingRuleStateMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.network.service.portforwarding.APIChangePortForwardingRuleStateMsg': this
      };
      return msg;
    }
    uuid : string;
    stateEvent : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIUpdatePortForwardingRuleMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.network.service.portforwarding.APIUpdatePortForwardingRuleMsg': this
      };
      return msg;
    }
    uuid : string;
    name : string;
    description : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIListPortForwardingRuleMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.network.service.portforwarding.APIListPortForwardingRuleMsg': this
      };
      return msg;
    }
    length : number;
    offset : number;
    uuids : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APICreatePortForwardingRuleMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.network.service.portforwarding.APICreatePortForwardingRuleMsg': this
      };
      return msg;
    }
    vipUuid : string;
    vipPortStart : number;
    vipPortEnd : number;
    privatePortStart : number;
    privatePortEnd : number;
    protocolType : string;
    vmNicUuid : string;
    allowedCidr : string;
    name : string;
    description : string;
    resourceUuid : string;
    userTags : Array<string>;
    systemTags : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIQueryPortForwardingRuleMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.network.service.portforwarding.APIQueryPortForwardingRuleMsg': this
      };
      return msg;
    }
    conditions : Array<QueryCondition>;
    limit : number;
    start : number;
    count : boolean;
    replyWithCount : boolean;
    sortBy : string;
    sortDirection : string;
    fields : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIDeletePortForwardingRuleMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.network.service.portforwarding.APIDeletePortForwardingRuleMsg': this
      };
      return msg;
    }
    uuid : string;
    deleteMode : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIDetachEipMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.network.service.eip.APIDetachEipMsg': this
      };
      return msg;
    }
    uuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIGetEipAttachableVmNicsMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.network.service.eip.APIGetEipAttachableVmNicsMsg': this
      };
      return msg;
    }
    eipUuid : string;
    vipUuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIUpdateEipMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.network.service.eip.APIUpdateEipMsg': this
      };
      return msg;
    }
    uuid : string;
    name : string;
    description : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIQueryEipMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.network.service.eip.APIQueryEipMsg': this
      };
      return msg;
    }
    conditions : Array<QueryCondition>;
    limit : number;
    start : number;
    count : boolean;
    replyWithCount : boolean;
    sortBy : string;
    sortDirection : string;
    fields : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIChangeEipStateMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.network.service.eip.APIChangeEipStateMsg': this
      };
      return msg;
    }
    uuid : string;
    stateEvent : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIDeleteEipMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.network.service.eip.APIDeleteEipMsg': this
      };
      return msg;
    }
    uuid : string;
    deleteMode : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APICreateEipMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.network.service.eip.APICreateEipMsg': this
      };
      return msg;
    }
    name : string;
    description : string;
    vipUuid : string;
    vmNicUuid : string;
    resourceUuid : string;
    userTags : Array<string>;
    systemTags : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIAttachEipMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.network.service.eip.APIAttachEipMsg': this
      };
      return msg;
    }
    eipUuid : string;
    vmNicUuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIQueryLoadBalancerListenerMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.network.service.lb.APIQueryLoadBalancerListenerMsg': this
      };
      return msg;
    }
    conditions : Array<QueryCondition>;
    limit : number;
    start : number;
    count : boolean;
    replyWithCount : boolean;
    sortBy : string;
    sortDirection : string;
    fields : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIDeleteLoadBalancerMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.network.service.lb.APIDeleteLoadBalancerMsg': this
      };
      return msg;
    }
    uuid : string;
    deleteMode : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APICreateLoadBalancerListenerMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.network.service.lb.APICreateLoadBalancerListenerMsg': this
      };
      return msg;
    }
    loadBalancerUuid : string;
    name : string;
    description : string;
    instancePort : number;
    loadBalancerPort : number;
    protocol : string;
    resourceUuid : string;
    userTags : Array<string>;
    systemTags : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIRemoveVmNicFromLoadBalancerMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.network.service.lb.APIRemoveVmNicFromLoadBalancerMsg': this
      };
      return msg;
    }
    vmNicUuids : Array<string>;
    listenerUuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIAddVmNicToLoadBalancerMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.network.service.lb.APIAddVmNicToLoadBalancerMsg': this
      };
      return msg;
    }
    vmNicUuids : Array<string>;
    listenerUuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APICreateLoadBalancerMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.network.service.lb.APICreateLoadBalancerMsg': this
      };
      return msg;
    }
    name : string;
    description : string;
    vipUuid : string;
    resourceUuid : string;
    userTags : Array<string>;
    systemTags : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIRefreshLoadBalancerMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.network.service.lb.APIRefreshLoadBalancerMsg': this
      };
      return msg;
    }
    uuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIDeleteLoadBalancerListenerMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.network.service.lb.APIDeleteLoadBalancerListenerMsg': this
      };
      return msg;
    }
    uuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIQueryLoadBalancerMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.network.service.lb.APIQueryLoadBalancerMsg': this
      };
      return msg;
    }
    conditions : Array<QueryCondition>;
    limit : number;
    start : number;
    count : boolean;
    replyWithCount : boolean;
    sortBy : string;
    sortDirection : string;
    fields : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIChangeSecurityGroupStateMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.network.securitygroup.APIChangeSecurityGroupStateMsg': this
      };
      return msg;
    }
    uuid : string;
    stateEvent : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIDetachSecurityGroupFromL3NetworkMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.network.securitygroup.APIDetachSecurityGroupFromL3NetworkMsg': this
      };
      return msg;
    }
    securityGroupUuid : string;
    l3NetworkUuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIDeleteSecurityGroupRuleMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.network.securitygroup.APIDeleteSecurityGroupRuleMsg': this
      };
      return msg;
    }
    ruleUuids : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APICreateSecurityGroupMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.network.securitygroup.APICreateSecurityGroupMsg': this
      };
      return msg;
    }
    name : string;
    description : string;
    resourceUuid : string;
    userTags : Array<string>;
    systemTags : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIListVmNicInSecurityGroupMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.network.securitygroup.APIListVmNicInSecurityGroupMsg': this
      };
      return msg;
    }
    length : number;
    offset : number;
    uuids : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIQueryVmNicInSecurityGroupMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.network.securitygroup.APIQueryVmNicInSecurityGroupMsg': this
      };
      return msg;
    }
    conditions : Array<QueryCondition>;
    limit : number;
    start : number;
    count : boolean;
    replyWithCount : boolean;
    sortBy : string;
    sortDirection : string;
    fields : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIQuerySecurityGroupMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.network.securitygroup.APIQuerySecurityGroupMsg': this
      };
      return msg;
    }
    conditions : Array<QueryCondition>;
    limit : number;
    start : number;
    count : boolean;
    replyWithCount : boolean;
    sortBy : string;
    sortDirection : string;
    fields : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class SecurityGroupRuleAO {
    type : string;
    startPort : number;
    endPort : number;
    protocol : string;
    allowedCidr : string;
  }


  export class APIAddSecurityGroupRuleMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.network.securitygroup.APIAddSecurityGroupRuleMsg': this
      };
      return msg;
    }
    securityGroupUuid : string;
    rules : Array<SecurityGroupRuleAO>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIListSecurityGroupMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.network.securitygroup.APIListSecurityGroupMsg': this
      };
      return msg;
    }
    length : number;
    offset : number;
    uuids : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIQuerySecurityGroupRuleMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.network.securitygroup.APIQuerySecurityGroupRuleMsg': this
      };
      return msg;
    }
    conditions : Array<QueryCondition>;
    limit : number;
    start : number;
    count : boolean;
    replyWithCount : boolean;
    sortBy : string;
    sortDirection : string;
    fields : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIDeleteSecurityGroupMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.network.securitygroup.APIDeleteSecurityGroupMsg': this
      };
      return msg;
    }
    uuid : string;
    deleteMode : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIUpdateSecurityGroupMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.network.securitygroup.APIUpdateSecurityGroupMsg': this
      };
      return msg;
    }
    uuid : string;
    name : string;
    description : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIDeleteVmNicFromSecurityGroupMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.network.securitygroup.APIDeleteVmNicFromSecurityGroupMsg': this
      };
      return msg;
    }
    securityGroupUuid : string;
    vmNicUuids : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIGetCandidateVmNicForSecurityGroupMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.network.securitygroup.APIGetCandidateVmNicForSecurityGroupMsg': this
      };
      return msg;
    }
    securityGroupUuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIAttachSecurityGroupToL3NetworkMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.network.securitygroup.APIAttachSecurityGroupToL3NetworkMsg': this
      };
      return msg;
    }
    securityGroupUuid : string;
    l3NetworkUuid : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIAddVmNicToSecurityGroupMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.network.securitygroup.APIAddVmNicToSecurityGroupMsg': this
      };
      return msg;
    }
    securityGroupUuid : string;
    vmNicUuids : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIDeleteVipMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.network.service.vip.APIDeleteVipMsg': this
      };
      return msg;
    }
    uuid : string;
    deleteMode : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIUpdateVipMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.network.service.vip.APIUpdateVipMsg': this
      };
      return msg;
    }
    uuid : string;
    name : string;
    description : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APIChangeVipStateMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.network.service.vip.APIChangeVipStateMsg': this
      };
      return msg;
    }
    uuid : string;
    stateEvent : string;
    session : SessionInventory;
    timeout : number;
  }


  export class APICreateVipMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.network.service.vip.APICreateVipMsg': this
      };
      return msg;
    }
    name : string;
    description : string;
    l3NetworkUuid : string;
    allocatorStrategy : string;
    requiredIp : string;
    resourceUuid : string;
    userTags : Array<string>;
    systemTags : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class APIQueryVipMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.network.service.vip.APIQueryVipMsg': this
      };
      return msg;
    }
    conditions : Array<QueryCondition>;
    limit : number;
    start : number;
    count : boolean;
    replyWithCount : boolean;
    sortBy : string;
    sortDirection : string;
    fields : Array<string>;
    session : SessionInventory;
    timeout : number;
  }


  export class ErrorCode {
    code : string;
    description : string;
    details : string;
    elaboration : string;
    cause : ErrorCode;
  }


  export class FakeApiEvent {
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class GlobalConfigInventory {
    name : string;
    category : string;
    description : string;
    defaultValue : string;
    value : string;
  }


  export class APIUpdateGlobalConfigEvent {
    inventory : GlobalConfigInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class InProgressEvent {
    description : string;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class FixedInProgressEvent {
    total : number;
    current : number;
    description : string;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIGenerateInventoryQueryDetailsEvent {
    outputDir : string;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIGenerateQueryableFieldsEvent {
    outputFolder : string;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class VmNicInventory {
    uuid : string;
    vmInstanceUuid : string;
    l3NetworkUuid : string;
    ip : string;
    mac : string;
    netmask : string;
    gateway : string;
    metaData : string;
    deviceId : number;
    createDate : string;
    lastOpDate : string;
  }


  export class VolumeInventory {
    uuid : string;
    name : string;
    description : string;
    primaryStorageUuid : string;
    vmInstanceUuid : string;
    diskOfferingUuid : string;
    rootImageUuid : string;
    installPath : string;
    type : string;
    format : string;
    size : number;
    deviceId : number;
    state : string;
    status : string;
    createDate : string;
    lastOpDate : string;
  }


  export class VmInstanceInventory {
    uuid : string;
    name : string;
    description : string;
    zoneUuid : string;
    clusterUuid : string;
    imageUuid : string;
    hostUuid : string;
    lastHostUuid : string;
    instanceOfferingUuid : string;
    rootVolumeUuid : string;
    platform : string;
    defaultL3NetworkUuid : string;
    type : string;
    hypervisorType : string;
    memorySize : number;
    cpuNum : number;
    cpuSpeed : number;
    allocatorStrategy : string;
    createDate : string;
    lastOpDate : string;
    state : string;
    vmNics : Array<VmNicInventory>;
    allVolumes : Array<VolumeInventory>;
  }


  export class APIDetachL3NetworkFromVmEvent {
    inventory : VmInstanceInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIStartVmInstanceEvent {
    inventory : VmInstanceInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIAttachL3NetworkToVmEvent {
    inventory : VmInstanceInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIStopVmInstanceEvent {
    inventory : VmInstanceInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIMigrateVmEvent {
    inventory : VmInstanceInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIUpdateVmInstanceEvent {
    inventory : VmInstanceInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIDestroyVmInstanceEvent {
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIChangeInstanceOfferingEvent {
    inventory : VmInstanceInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APICreateVmInstanceEvent {
    inventory : VmInstanceInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIRebootVmInstanceEvent {
    inventory : VmInstanceInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class ImageBackupStorageRefInventory {
    imageUuid : string;
    backupStorageUuid : string;
    installPath : string;
    createDate : string;
    lastOpDate : string;
  }


  export class ImageInventory {
    uuid : string;
    name : string;
    description : string;
    state : string;
    status : string;
    size : number;
    md5Sum : string;
    url : string;
    mediaType : string;
    guestOsType : string;
    type : string;
    platform : string;
    format : string;
    system : boolean;
    createDate : string;
    lastOpDate : string;
    backupStorageRefs : Array<ImageBackupStorageRefInventory>;
  }


  export class APICreateRootVolumeTemplateFromRootVolumeEvent {
    inventory : ImageInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIChangeImageStateEvent {
    inventory : ImageInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIUpdateImageEvent {
    inventory : ImageInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APICreateDataVolumeTemplateFromVolumeEvent {
    inventory : ImageInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APICreateRootVolumeTemplateFromVolumeSnapshotEvent {
    inventory : ImageInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIAddImageEvent {
    inventory : ImageInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIDeleteImageEvent {
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class ConsoleInventory {
    scheme : string;
    hostname : string;
    port : number;
    token : string;
  }


  export class APIRequestConsoleAccessEvent {
    inventory : ConsoleInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APICreateDataVolumeEvent {
    inventory : VolumeInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIDetachDataVolumeFromVmEvent {
    inventory : VolumeInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIUpdateVolumeEvent {
    inventory : VolumeInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIDeleteDataVolumeEvent {
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APICreateDataVolumeFromVolumeSnapshotEvent {
    inventory : VolumeInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIBackupDataVolumeEvent {
    inventory : VolumeInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APICreateDataVolumeFromVolumeTemplateEvent {
    inventory : VolumeInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIChangeVolumeStateEvent {
    inventory : VolumeInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class VolumeSnapshotBackupStorageRefInventory {
    volumeSnapshotUuid : string;
    backupStorageUuid : string;
    installPath : string;
  }


  export class VolumeSnapshotInventory {
    uuid : string;
    name : string;
    description : string;
    type : string;
    volumeUuid : string;
    treeUuid : string;
    parentUuid : string;
    primaryStorageUuid : string;
    primaryStorageInstallPath : string;
    volumeType : string;
    format : string;
    latest : boolean;
    size : number;
    state : string;
    status : string;
    createDate : string;
    lastOpDate : string;
    backupStorageRefs : Array<VolumeSnapshotBackupStorageRefInventory>;
  }


  export class APICreateVolumeSnapshotEvent {
    inventory : VolumeSnapshotInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIAttachDataVolumeToVmEvent {
    inventory : VolumeInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class DiskOfferingInventory {
    uuid : string;
    name : string;
    description : string;
    diskSize : number;
    sortKey : number;
    state : string;
    type : string;
    createDate : string;
    lastOpDate : string;
    allocatorStrategy : string;
  }


  export class APICreateDiskOfferingEvent {
    inventory : DiskOfferingInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIChangeDiskOfferingStateEvent {
    inventory : DiskOfferingInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIUpdateDiskOfferingEvent {
    inventory : DiskOfferingInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIDeleteInstanceOfferingEvent {
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIGenerateSqlForeignKeyEvent {
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIDeleteDiskOfferingEvent {
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIGenerateGroovyClassEvent {
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIGenerateSqlIndexEvent {
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class InstanceOfferingInventory {
    uuid : string;
    name : string;
    description : string;
    cpuNum : number;
    cpuSpeed : number;
    memorySize : number;
    type : string;
    allocatorStrategy : string;
    sortKey : number;
    createDate : string;
    lastOpDate : string;
    state : string;
  }


  export class APIUpdateInstanceOfferingEvent {
    inventory : InstanceOfferingInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIGenerateApiTypeScriptDefinitionEvent {
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIGenerateSqlVOViewEvent {
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APICreateInstanceOfferingEvent {
    inventory : InstanceOfferingInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIChangeInstanceOfferingStateEvent {
    inventory : InstanceOfferingInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIGenerateTestLinkDocumentEvent {
    outputDir : string;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIGenerateApiJsonTemplateEvent {
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class PrimaryStorageInventory {
    uuid : string;
    zoneUuid : string;
    name : string;
    url : string;
    description : string;
    totalCapacity : number;
    availableCapacity : number;
    totalPhysicalCapacity : number;
    availablePhysicalCapacity : number;
    type : string;
    state : string;
    status : string;
    mountPath : string;
    createDate : string;
    lastOpDate : string;
    attachedClusterUuids : Array<string>;
  }


  export class APISyncPrimaryStorageCapacityEvent {
    inventory : PrimaryStorageInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIDeletePrimaryStorageEvent {
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIDetachPrimaryStorageFromClusterEvent {
    inventory : PrimaryStorageInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIChangePrimaryStorageStateEvent {
    inventory : PrimaryStorageInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIUpdatePrimaryStorageEvent {
    inventory : PrimaryStorageInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIReconnectPrimaryStorageEvent {
    inventory : PrimaryStorageInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIAttachPrimaryStorageToClusterEvent {
    inventory : PrimaryStorageInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIAddPrimaryStorageEvent {
    inventory : PrimaryStorageInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIDeleteVolumeSnapshotEvent {
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIUpdateVolumeSnapshotEvent {
    inventory : VolumeSnapshotInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIRevertVolumeFromSnapshotEvent {
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIDeleteVolumeSnapshotFromBackupStorageEvent {
    inventory : VolumeSnapshotInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIBackupVolumeSnapshotEvent {
    inventory : VolumeSnapshotInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class BackupStorageInventory {
    uuid : string;
    name : string;
    url : string;
    description : string;
    totalCapacity : number;
    availableCapacity : number;
    type : string;
    sshPort : number;
    state : string;
    status : string;
    createDate : string;
    lastOpDate : string;
    attachedZoneUuids : Array<string>;
  }


  export class APIUpdateBackupStorageEvent {
    inventory : BackupStorageInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIDetachBackupStorageFromZoneEvent {
    inventory : BackupStorageInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIScanBackupStorageEvent {
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIAddBackupStorageEvent {
    inventory : BackupStorageInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIAttachBackupStorageToZoneEvent {
    inventory : BackupStorageInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIChangeBackupStorageStateEvent {
    inventory : BackupStorageInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIDeleteBackupStorageEvent {
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class IpRangeInventory {
    uuid : string;
    l3NetworkUuid : string;
    name : string;
    description : string;
    startIp : string;
    endIp : string;
    netmask : string;
    gateway : string;
    networkCidr : string;
    createDate : string;
    lastOpDate : string;
  }


  export class APIAddIpRangeEvent {
    inventory : IpRangeInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class NetworkServiceL3NetworkRefInventory {
    l3NetworkUuid : string;
    networkServiceProviderUuid : string;
    networkServiceType : string;
  }


  export class L3NetworkInventory {
    uuid : string;
    name : string;
    description : string;
    type : string;
    zoneUuid : string;
    l2NetworkUuid : string;
    state : string;
    dnsDomain : string;
    system : boolean;
    createDate : string;
    lastOpDate : string;
    dns : Array<string>;
    ipRanges : Array<IpRangeInventory>;
    networkServices : Array<NetworkServiceL3NetworkRefInventory>;
  }


  export class APIRemoveDnsFromL3NetworkEvent {
    inventory : L3NetworkInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIDeleteL3NetworkEvent {
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIChangeL3NetworkStateEvent {
    inventory : L3NetworkInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIDeleteIpRangeEvent {
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIAddIpRangeByNetworkCidrEvent {
    inventory : IpRangeInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIUpdateIpRangeEvent {
    inventory : IpRangeInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIUpdateL3NetworkEvent {
    inventory : L3NetworkInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIAddDnsToL3NetworkEvent {
    inventory : L3NetworkInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APICreateL3NetworkEvent {
    inventory : L3NetworkInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class NetworkServiceProviderInventory {
    uuid : string;
    name : string;
    description : string;
    type : string;
    createDate : string;
    lastOpDate : string;
    networkServiceTypes : Array<string>;
    attachedL2NetworkUuids : Array<string>;
  }


  export class APIDetachNetworkServiceProviderFromL2NetworkEvent {
    inventory : NetworkServiceProviderInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIAddNetworkServiceProviderEvent {
    inventory : NetworkServiceProviderInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIAttachNetworkServiceProviderToL2NetworkEvent {
    inventory : NetworkServiceProviderInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIAttachNetworkServiceToL3NetworkEvent {
    inventory : L3NetworkInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class L2NetworkInventory {
    uuid : string;
    name : string;
    description : string;
    zoneUuid : string;
    physicalInterface : string;
    type : string;
    createDate : string;
    lastOpDate : string;
    attachedClusterUuids : Array<string>;
  }


  export class APIAttachL2NetworkToClusterEvent {
    inventory : L2NetworkInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class L2VlanNetworkInventory {
    vlan : number;
    uuid : string;
    name : string;
    description : string;
    zoneUuid : string;
    physicalInterface : string;
    type : string;
    createDate : string;
    lastOpDate : string;
    attachedClusterUuids : Array<string>;
  }


  export class APICreateL2VlanNetworkEvent {
    inventory : L2VlanNetworkInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIDetachL2NetworkFromClusterEvent {
    inventory : L2NetworkInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIDeleteL2NetworkEvent {
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APICreateL2NetworkEvent {
    inventory : L2NetworkInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIUpdateL2NetworkEvent {
    inventory : L2NetworkInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIDeleteSearchIndexEvent {
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APISearchGenerateSqlTriggerEvent {
    resultPath : string;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APICreateSearchIndexEvent {
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class UserTagInventory {
    uuid : string;
    resourceUuid : string;
    resourceType : string;
    tag : string;
    type : string;
    createDate : string;
    lastOpDate : string;
  }


  export class APICreateUserTagEvent {
    inventory : UserTagInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIDeleteTagEvent {
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class TagInventory {
    uuid : string;
    resourceUuid : string;
    resourceType : string;
    tag : string;
    type : string;
    createDate : string;
    lastOpDate : string;
  }


  export class APICreateTagEvent {
    inventory : TagInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class SystemTagInventory {
    inherent : boolean;
    uuid : string;
    resourceUuid : string;
    resourceType : string;
    tag : string;
    type : string;
    createDate : string;
    lastOpDate : string;
  }


  export class APICreateSystemTagEvent {
    inventory : SystemTagInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIUpdateSystemTagEvent {
    inventory : SystemTagInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIEvent {
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIDeleteClusterEvent {
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class ClusterInventory {
    name : string;
    uuid : string;
    description : string;
    state : string;
    hypervisorType : string;
    createDate : string;
    lastOpDate : string;
    zoneUuid : string;
    type : string;
  }


  export class APICreateClusterEvent {
    inventory : ClusterInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIChangeClusterStateEvent {
    inventory : ClusterInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIUpdateClusterEvent {
    inventory : ClusterInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIRemoveUserFromGroupEvent {
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class AccountInventory {
    uuid : string;
    name : string;
    description : string;
    type : string;
    createDate : string;
    lastOpDate : string;
  }


  export class APICreateAccountEvent {
    inventory : AccountInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIDeleteUserGroupEvent {
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIAttachPolicyToUserEvent {
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIShareResourceEvent {
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIDetachPolicyFromUserGroupEvent {
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIDeletePolicyEvent {
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIAddUserToGroupEvent {
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIUpdateUserEvent {
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIDeleteAccountEvent {
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIUpdateAccountEvent {
    inventory : AccountInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class QuotaInventory {
    name : string;
    identityUuid : string;
    identityType : string;
    value : number;
    lastOpDate : string;
    createDate : string;
  }


  export class APIUpdateQuotaEvent {
    inventory : QuotaInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class PolicyInventory {
    statements : Array<Statement>;
    name : string;
    uuid : string;
    accountUuid : string;
  }


  export class APICreatePolicyEvent {
    inventory : PolicyInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class UserInventory {
    uuid : string;
    accountUuid : string;
    name : string;
    description : string;
    createDate : string;
    lastOpDate : string;
  }


  export class APICreateUserEvent {
    inventory : UserInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIDetachPolicyFromUserEvent {
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIDeleteUserEvent {
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class UserGroupInventory {
    uuid : string;
    accountUuid : string;
    name : string;
    description : string;
    createDate : string;
    lastOpDate : string;
  }


  export class APICreateUserGroupEvent {
    inventory : UserGroupInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIAttachPolicyToUserGroupEvent {
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIRevokeResourceSharingEvent {
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class ZoneInventory {
    uuid : string;
    name : string;
    description : string;
    state : string;
    type : string;
    createDate : string;
    lastOpDate : string;
  }


  export class APIUpdateZoneEvent {
    inventory : ZoneInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIChangeZoneStateEvent {
    inventory : ZoneInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APICreateZoneEvent {
    inventory : ZoneInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIDeleteZoneEvent {
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class HostInventory {
    zoneUuid : string;
    name : string;
    uuid : string;
    clusterUuid : string;
    description : string;
    managementIp : string;
    hypervisorType : string;
    sshPort : number;
    state : string;
    status : string;
    totalCpuCapacity : number;
    availableCpuCapacity : number;
    totalMemoryCapacity : number;
    availableMemoryCapacity : number;
    createDate : string;
    lastOpDate : string;
  }


  export class APIAddHostEvent {
    inventory : HostInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIChangeHostStateEvent {
    inventory : HostInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIDeleteHostEvent {
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIReconnectHostEvent {
    inventory : HostInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIUpdateHostEvent {
    inventory : HostInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class CephPrimaryStorageMonInventory {
    hostname : string;
    monPort : number;
    createDate : string;
    lastOpDate : string;
    primaryStorageUuid : string;
  }


  export class CephPrimaryStorageInventory {
    mons : Array<CephPrimaryStorageMonInventory>;
    fsid : string;
    rootVolumePoolName : string;
    dataVolumePoolName : string;
    imageCachePoolName : string;
    uuid : string;
    zoneUuid : string;
    name : string;
    url : string;
    description : string;
    totalCapacity : number;
    availableCapacity : number;
    totalPhysicalCapacity : number;
    availablePhysicalCapacity : number;
    type : string;
    state : string;
    status : string;
    mountPath : string;
    createDate : string;
    lastOpDate : string;
    attachedClusterUuids : Array<string>;
  }


  export class APIRemoveMonFromCephPrimaryStorageEvent {
    inventory : CephPrimaryStorageInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIAddMonToCephPrimaryStorageEvent {
    inventory : CephPrimaryStorageInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class CephBackupStorageMonInventory {
    hostname : string;
    monPort : number;
    createDate : string;
    lastOpDate : string;
    backupStorageUuid : string;
  }


  export class CephBackupStorageInventory {
    mons : Array<CephBackupStorageMonInventory>;
    fsid : string;
    poolName : string;
    uuid : string;
    name : string;
    url : string;
    description : string;
    totalCapacity : number;
    availableCapacity : number;
    type : string;
    state : string;
    status : string;
    createDate : string;
    lastOpDate : string;
    attachedZoneUuids : Array<string>;
  }


  export class APIRemoveMonFromCephBackupStorageEvent {
    inventory : CephBackupStorageInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIAddMonToCephBackupStorageEvent {
    inventory : CephBackupStorageInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }

  export class FusionstorPrimaryStorageMonInventory {
    hostname : string;
    monPort : number;
    createDate : string;
    lastOpDate : string;
    primaryStorageUuid : string;
  }


  export class FusionstorPrimaryStorageInventory {
    mons : Array<FusionstorPrimaryStorageMonInventory>;
    fsid : string;
    rootVolumePoolName : string;
    dataVolumePoolName : string;
    imageCachePoolName : string;
    uuid : string;
    zoneUuid : string;
    name : string;
    url : string;
    description : string;
    totalCapacity : number;
    availableCapacity : number;
    totalPhysicalCapacity : number;
    availablePhysicalCapacity : number;
    type : string;
    state : string;
    status : string;
    mountPath : string;
    createDate : string;
    lastOpDate : string;
    attachedClusterUuids : Array<string>;
  }


  export class APIRemoveMonFromFusionstorPrimaryStorageEvent {
    inventory : FusionstorPrimaryStorageInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIAddMonToFusionstorPrimaryStorageEvent {
    inventory : FusionstorPrimaryStorageInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class FusionstorBackupStorageMonInventory {
    hostname : string;
    monPort : number;
    createDate : string;
    lastOpDate : string;
    backupStorageUuid : string;
  }


  export class FusionstorBackupStorageInventory {
    mons : Array<FusionstorBackupStorageMonInventory>;
    fsid : string;
    poolName : string;
    uuid : string;
    name : string;
    url : string;
    description : string;
    totalCapacity : number;
    availableCapacity : number;
    type : string;
    state : string;
    status : string;
    createDate : string;
    lastOpDate : string;
    attachedZoneUuids : Array<string>;
  }


  export class APIRemoveMonFromFusionstorBackupStorageEvent {
    inventory : FusionstorBackupStorageInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIAddMonToFusionstorBackupStorageEvent {
    inventory : FusionstorBackupStorageInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class SftpBackupStorageInventory {
    hostname : string;
    uuid : string;
    name : string;
    url : string;
    description : string;
    totalCapacity : number;
    availableCapacity : number;
    sshPort : number;
    type : string;
    state : string;
    status : string;
    createDate : string;
    lastOpDate : string;
    attachedZoneUuids : Array<string>;
  }


  export class APIAddSftpBackupStorageEvent {
    inventory : SftpBackupStorageInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIReconnectSftpBackupStorageEvent {
    inventory : SftpBackupStorageInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class ApplianceVmInventory {
    applianceVmType : string;
    managementNetworkUuid : string;
    defaultRouteL3NetworkUuid : string;
    status : string;
    uuid : string;
    name : string;
    description : string;
    zoneUuid : string;
    clusterUuid : string;
    imageUuid : string;
    hostUuid : string;
    lastHostUuid : string;
    instanceOfferingUuid : string;
    rootVolumeUuid : string;
    platform : string;
    defaultL3NetworkUuid : string;
    type : string;
    hypervisorType : string;
    memorySize : number;
    cpuNum : number;
    cpuSpeed : number;
    allocatorStrategy : string;
    createDate : string;
    lastOpDate : string;
    state : string;
    vmNics : Array<VmNicInventory>;
    allVolumes : Array<VolumeInventory>;
  }


  export class APIReconnectVirtualRouterEvent {
    inventory : ApplianceVmInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIDeletePortForwardingRuleEvent {
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class PortForwardingRuleInventory {
    uuid : string;
    name : string;
    description : string;
    vipIp : string;
    guestIp : string;
    vipUuid : string;
    vipPortStart : number;
    vipPortEnd : number;
    privatePortStart : number;
    privatePortEnd : number;
    vmNicUuid : string;
    protocolType : string;
    state : string;
    allowedCidr : string;
    createDate : string;
    lastOpDate : string;
  }


  export class APIChangePortForwardingRuleStateEvent {
    inventory : PortForwardingRuleInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIDetachPortForwardingRuleEvent {
    inventory : PortForwardingRuleInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIAttachPortForwardingRuleEvent {
    inventory : PortForwardingRuleInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APICreatePortForwardingRuleEvent {
    inventory : PortForwardingRuleInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIUpdatePortForwardingRuleEvent {
    inventory : PortForwardingRuleInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class EipInventory {
    uuid : string;
    name : string;
    description : string;
    vmNicUuid : string;
    vipUuid : string;
    createDate : string;
    lastOpDate : string;
    state : string;
    vipIp : string;
    guestIp : string;
  }


  export class APIChangeEipStateEvent {
    inventory : EipInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIUpdateEipEvent {
    inventory : EipInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APICreateEipEvent {
    inventory : EipInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIDetachEipEvent {
    inventory : EipInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIAttachEipEvent {
    inventory : EipInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIDeleteEipEvent {
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class LoadBalancerListenerVmNicRefInventory {
    id : number;
    listenerUuid : string;
    vmNicUuid : string;
    status : string;
    createDate : string;
    lastOpDate : string;
  }


  export class LoadBalancerListenerInventory {
    uuid : string;
    name : string;
    description : string;
    loadBalancerUuid : string;
    instancePort : number;
    loadBalancerPort : number;
    protocol : string;
    createDate : string;
    lastOpDate : string;
    vmNicRefs : Array<LoadBalancerListenerVmNicRefInventory>;
  }


  export class LoadBalancerInventory {
    name : string;
    uuid : string;
    description : string;
    state : string;
    vipUuid : string;
    listeners : Array<LoadBalancerListenerInventory>;
  }


  export class APIRefreshLoadBalancerEvent {
    inventory : LoadBalancerInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APICreateLoadBalancerEvent {
    inventory : LoadBalancerInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIRemoveVmNicFromLoadBalancerEvent {
    inventory : LoadBalancerInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIAddVmNicToLoadBalancerEvent {
    inventory : LoadBalancerListenerInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIDeleteLoadBalancerListenerEvent {
    inventory : LoadBalancerInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APICreateLoadBalancerListenerEvent {
    inventory : LoadBalancerListenerInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIDeleteLoadBalancerEvent {
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class SecurityGroupRuleInventory {
    uuid : string;
    securityGroupUuid : string;
    type : string;
    startPort : number;
    endPort : number;
    protocol : string;
    state : string;
    allowedCidr : string;
    createDate : string;
    lastOpDate : string;
  }


  export class SecurityGroupInventory {
    uuid : string;
    name : string;
    description : string;
    state : string;
    createDate : string;
    lastOpDate : string;
    rules : Array<SecurityGroupRuleInventory>;
    attachedL3NetworkUuids : Array<string>;
  }


  export class APIAttachSecurityGroupToL3NetworkEvent {
    inventory : SecurityGroupInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIDeleteSecurityGroupRuleEvent {
    inventory : SecurityGroupInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIAddVmNicToSecurityGroupEvent {
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIChangeSecurityGroupStateEvent {
    inventory : SecurityGroupInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIUpdateSecurityGroupEvent {
    inventory : SecurityGroupInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIDeleteVmNicFromSecurityGroupEvent {
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIAddSecurityGroupRuleEvent {
    inventory : SecurityGroupInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APICreateSecurityGroupEvent {
    inventory : SecurityGroupInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIDetachSecurityGroupFromL3NetworkEvent {
    inventory : SecurityGroupInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIDeleteSecurityGroupEvent {
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class VipInventory {
    uuid : string;
    name : string;
    description : string;
    l3NetworkUuid : string;
    ip : string;
    state : string;
    gateway : string;
    netmask : string;
    serviceProvider : string;
    peerL3NetworkUuid : string;
    useFor : string;
    createDate : string;
    lastOpDate : string;
  }


  export class APICreateVipEvent {
    inventory : VipInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIUpdateVipEvent {
    inventory : VipInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIDeleteVipEvent {
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIChangeVipStateEvent {
    inventory : VipInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }


  export class APIGetGlobalConfigReply {
    inventory : GlobalConfigInventory;
    success : boolean;
    error : ErrorCode;
  }


  export class APIQueryGlobalConfigReply {
    inventories : Array<GlobalConfigInventory>;
    total : number;
    success : boolean;
    error : ErrorCode;
  }

  export class APIListGlobalConfigReply {
    inventories : GlobalConfigInventory[];
    success : boolean;
    error : ErrorCode;
  }


  export class APIQueryReply {
    total : number;
    success : boolean;
    error : ErrorCode;
  }


  export class APIGetCpuMemoryCapacityReply {
    totalCpu : number;
    availableCpu : number;
    totalMemory : number;
    availableMemory : number;
    success : boolean;
    error : ErrorCode;
  }


  export class APIGetHostAllocatorStrategiesReply {
    hostAllocatorStrategies : Array<string>;
    success : boolean;
    error : ErrorCode;
  }


  export class APISearchVmInstanceReply {
    content : string;
    success : boolean;
    error : ErrorCode;
  }


  export class APIGetVmInstanceReply {
    inventory : string;
    success : boolean;
    error : ErrorCode;
  }


  export class APIGetVmAttachableDataVolumeReply {
    inventories : Array<VolumeInventory>;
    success : boolean;
    error : ErrorCode;
  }


  export class APIGetVmMigrationCandidateHostsReply {
    inventories : Array<HostInventory>;
    success : boolean;
    error : ErrorCode;
  }


  export class APIListVmInstanceReply {
    inventories : Array<VmInstanceInventory>;
    success : boolean;
    error : ErrorCode;
  }


  export class APIListVmNicReply {
    inventories : Array<VmNicInventory>;
    success : boolean;
    error : ErrorCode;
  }


  export class APIQueryVmInstanceReply {
    inventories : Array<VmInstanceInventory>;
    total : number;
    success : boolean;
    error : ErrorCode;
  }


  export class APIQueryVmNicReply {
    inventories : Array<VmNicInventory>;
    total : number;
    success : boolean;
    error : ErrorCode;
  }


  export class APIGetVmAttachableL3NetworkReply {
    inventories : Array<L3NetworkInventory>;
    success : boolean;
    error : ErrorCode;
  }


  export class APIGetImageReply {
    inventory : string;
    success : boolean;
    error : ErrorCode;
  }


  export class APIQueryImageReply {
    inventories : Array<ImageInventory>;
    total : number;
    success : boolean;
    error : ErrorCode;
  }


  export class APIListImageReply {
    inventories : Array<ImageInventory>;
    success : boolean;
    error : ErrorCode;
  }


  export class APISearchImageReply {
    content : string;
    success : boolean;
    error : ErrorCode;
  }


  export class VolumeFormatReplyStruct {
    format : string;
    masterHypervisorType : string;
    supportingHypervisorTypes : Array<string>;
  }


  export class APIGetVolumeFormatReply {
    formats : Array<VolumeFormatReplyStruct>;
    success : boolean;
    error : ErrorCode;
  }


  export class APIGetDataVolumeAttachableVmReply {
    inventories : Array<VmInstanceInventory>;
    success : boolean;
    error : ErrorCode;
  }


  export class APIQueryVolumeReply {
    inventories : Array<VolumeInventory>;
    total : number;
    success : boolean;
    error : ErrorCode;
  }


  export class APIGetVolumeReply {
    inventory : string;
    success : boolean;
    error : ErrorCode;
  }


  export class APIListVolumeReply {
    inventories : Array<VolumeInventory>;
    success : boolean;
    error : ErrorCode;
  }


  export class APISearchVolumeReply {
    content : string;
    success : boolean;
    error : ErrorCode;
  }


  export class APIIsReadyToGoReply {
    managementNodeId : string;
    success : boolean;
    error : ErrorCode;
  }


  export class APISearchInstanceOfferingReply {
    content : string;
    success : boolean;
    error : ErrorCode;
  }


  export class APIGetGlobalPropertyReply {
    properties : Array<string>;
    success : boolean;
    error : ErrorCode;
  }


  export class APIListDiskOfferingReply {
    inventories : Array<DiskOfferingInventory>;
    success : boolean;
    error : ErrorCode;
  }


  export class APIListInstanceOfferingReply {
    inventories : Array<InstanceOfferingInventory>;
    success : boolean;
    error : ErrorCode;
  }


  export class APISearchDnsReply {
    content : string;
    success : boolean;
    error : ErrorCode;
  }


  export class APIGetInstanceOfferingReply {
    inventory : string;
    success : boolean;
    error : ErrorCode;
  }


  export class APIQueryDiskOfferingReply {
    inventories : Array<DiskOfferingInventory>;
    total : number;
    success : boolean;
    error : ErrorCode;
  }


  export class APISearchDiskOfferingReply {
    content : string;
    success : boolean;
    error : ErrorCode;
  }


  export class APIGetDiskOfferingReply {
    inventory : string;
    success : boolean;
    error : ErrorCode;
  }


  export class APIQueryInstanceOfferingReply {
    inventories : Array<InstanceOfferingInventory>;
    total : number;
    success : boolean;
    error : ErrorCode;
  }


  export class APIListPrimaryStorageReply {
    inventories : Array<PrimaryStorageInventory>;
    success : boolean;
    error : ErrorCode;
  }


  export class APIGetPrimaryStorageTypesReply {
    primaryStorageTypes : Array<string>;
    success : boolean;
    error : ErrorCode;
  }


  export class CreateTemplateFromVolumeOnPrimaryStorageReply {
    templateBackupStorageInstallPath : string;
    format : string;
    success : boolean;
    error : ErrorCode;
  }


  export class APIGetPrimaryStorageReply {
    inventory : string;
    success : boolean;
    error : ErrorCode;
  }


  export class APISearchPrimaryStorageReply {
    content : string;
    success : boolean;
    error : ErrorCode;
  }


  export class APIGetPrimaryStorageAllocatorStrategiesReply {
    primaryStorageAllocatorStrategies : Array<string>;
    success : boolean;
    error : ErrorCode;
  }


  export class APIQueryPrimaryStorageReply {
    inventories : Array<PrimaryStorageInventory>;
    total : number;
    success : boolean;
    error : ErrorCode;
  }


  export class APIGetPrimaryStorageCapacityReply {
    totalCapacity : number;
    availableCapacity : number;
    success : boolean;
    error : ErrorCode;
  }


  export class APIQueryVolumeSnapshotReply {
    inventories : Array<VolumeSnapshotInventory>;
    total : number;
    success : boolean;
    error : ErrorCode;
  }


  export class SnapshotLeafInventory {
    inventory : VolumeSnapshotInventory;
    parentUuid : string;
    children : Array<SnapshotLeafInventory>;
  }


  export class VolumeSnapshotTreeInventory {
    uuid : string;
    volumeUuid : string;
    current : boolean;
    tree : SnapshotLeafInventory;
    createDate : string;
    lastOpDate : string;
  }


  export class APIQueryVolumeSnapshotTreeReply {
    inventories : Array<VolumeSnapshotTreeInventory>;
    total : number;
    success : boolean;
    error : ErrorCode;
  }


  export class APIGetVolumeSnapshotTreeReply {
    inventories : Array<VolumeSnapshotTreeInventory>;
    success : boolean;
    error : ErrorCode;
  }


  export class APISearchBackupStorageReply {
    content : string;
    success : boolean;
    error : ErrorCode;
  }


  export class APIGetBackupStorageCapacityReply {
    totalCapacity : number;
    availableCapacity : number;
    success : boolean;
    error : ErrorCode;
  }


  export class APIQueryBackupStorageReply {
    inventories : Array<BackupStorageInventory>;
    total : number;
    success : boolean;
    error : ErrorCode;
  }


  export class APIGetBackupStorageTypesReply {
    backupStorageTypes : Array<string>;
    success : boolean;
    error : ErrorCode;
  }


  export class APIGetBackupStorageReply {
    inventory : string;
    success : boolean;
    error : ErrorCode;
  }


  export class APIListBackupStorageReply {
    inventories : Array<BackupStorageInventory>;
    success : boolean;
    error : ErrorCode;
  }


  export class APIListIpRangeReply {
    inventories : Array<IpRangeInventory>;
    success : boolean;
    error : ErrorCode;
  }


  export class APISearchL3NetworkReply {
    content : string;
    success : boolean;
    error : ErrorCode;
  }


  export class APIGetL3NetworkTypesReply {
    l3NetworkTypes : Array<string>;
    success : boolean;
    error : ErrorCode;
  }


  export class APIGetL3NetworkReply {
    inventory : string;
    success : boolean;
    error : ErrorCode;
  }


  export class APIGetIpAddressCapacityReply {
    totalCapacity : number;
    availableCapacity : number;
    success : boolean;
    error : ErrorCode;
  }


  export class APIQueryL3NetworkReply {
    inventories : Array<L3NetworkInventory>;
    total : number;
    success : boolean;
    error : ErrorCode;
  }


  export class FreeIpInventory {
    ipRangeUuid : string;
    ip : string;
    netmask : string;
    gateway : string;
  }


  export class APIGetFreeIpReply {
    inventories : Array<FreeIpInventory>;
    success : boolean;
    error : ErrorCode;
  }


  export class APIQueryIpRangeReply {
    inventories : Array<IpRangeInventory>;
    total : number;
    success : boolean;
    error : ErrorCode;
  }


  export class APIListL3NetworkReply {
    inventories : Array<L3NetworkInventory>;
    success : boolean;
    error : ErrorCode;
  }


  export class APIQueryNetworkServiceL3NetworkRefReply {
    inventories : Array<NetworkServiceL3NetworkRefInventory>;
    total : number;
    success : boolean;
    error : ErrorCode;
  }


  export class APISearchNetworkServiceProviderReply {
    content : string;
    success : boolean;
    error : ErrorCode;
  }


  export class APIGetNetworkServiceProviderReply {
    inventory : string;
    success : boolean;
    error : ErrorCode;
  }


  export class APIGetNetworkServiceTypesReply {
    serviceAndProviderTypes : any;
    success : boolean;
    error : ErrorCode;
  }


  export class APIListNetworkServiceProviderReply {
    inventories : Array<NetworkServiceProviderInventory>;
    success : boolean;
    error : ErrorCode;
  }


  export class APIQueryNetworkServiceProviderReply {
    inventories : Array<NetworkServiceProviderInventory>;
    total : number;
    success : boolean;
    error : ErrorCode;
  }


  export class APIGetL2VlanNetworkReply {
    inventory : string;
    success : boolean;
    error : ErrorCode;
  }


  export class APIGetL2NetworkReply {
    inventory : string;
    success : boolean;
    error : ErrorCode;
  }


  export class APIQueryL2VlanNetworkReply {
    inventories : Array<L2VlanNetworkInventory>;
    total : number;
    success : boolean;
    error : ErrorCode;
  }


  export class APIGetL2NetworkTypesReply {
    l2NetworkTypes : Array<string>;
    success : boolean;
    error : ErrorCode;
  }


  export class APIListL2VlanNetworkReply {
    inventories : Array<L2VlanNetworkInventory>;
    success : boolean;
    error : ErrorCode;
  }


  export class APISearchL2VlanNetworkReply {
    content : string;
    success : boolean;
    error : ErrorCode;
  }


  export class APIQueryL2NetworkReply {
    inventories : Array<L2NetworkInventory>;
    total : number;
    success : boolean;
    error : ErrorCode;
  }


  export class APISearchL2NetworkReply {
    content : string;
    success : boolean;
    error : ErrorCode;
  }


  export class APIListL2NetworkReply {
    inventories : Array<L2NetworkInventory>;
    success : boolean;
    error : ErrorCode;
  }


  export class APISearchReply {
    content : string;
    success : boolean;
    error : ErrorCode;
  }


  export class APIQueryUserTagReply {
    inventories : Array<UserTagInventory>;
    total : number;
    success : boolean;
    error : ErrorCode;
  }


  export class APIQuerySystemTagReply {
    inventories : Array<SystemTagInventory>;
    total : number;
    success : boolean;
    error : ErrorCode;
  }


  export class APIQueryTagReply {
    inventories : Array<TagInventory>;
    total : number;
    success : boolean;
    error : ErrorCode;
  }


  export class ManagementNodeInventory {
    uuid : string;
    hostName : string;
    joinDate : string;
    heartBeat : string;
  }


  export class APIQueryManagementNodeReply {
    inventories : Array<ManagementNodeInventory>;
    total : number;
    success : boolean;
    error : ErrorCode;
  }


  export class APIListManagementNodeReply {
    inventories : Array<ManagementNodeInventory>;
    success : boolean;
    error : ErrorCode;
  }


  export class APIReply {
    success : boolean;
    error : ErrorCode;
  }


  export class APISearchClusterReply {
    content : string;
    success : boolean;
    error : ErrorCode;
  }


  export class APIListClusterReply {
    inventories : Array<ClusterInventory>;
    success : boolean;
    error : ErrorCode;
  }


  export class APIGetClusterReply {
    inventory : string;
    success : boolean;
    error : ErrorCode;
  }


  export class APIQueryClusterReply {
    inventories : Array<ClusterInventory>;
    total : number;
    success : boolean;
    error : ErrorCode;
  }


  export class APIListUserReply {
    inventories : Array<UserInventory>;
    success : boolean;
    error : ErrorCode;
  }


  export class APIQueryUserGroupReply {
    inventories : Array<UserGroupInventory>;
    total : number;
    success : boolean;
    error : ErrorCode;
  }


  export class APIGetUserReply {
    inventory : string;
    success : boolean;
    error : ErrorCode;
  }


  export class APIGetAccountReply {
    inventory : string;
    success : boolean;
    error : ErrorCode;
  }


  export class APIQueryUserReply {
    inventories : Array<UserInventory>;
    total : number;
    success : boolean;
    error : ErrorCode;
  }


  export class APIListAccountReply {
    inventories : Array<AccountInventory>;
    success : boolean;
    error : ErrorCode;
  }


  export class APISearchPolicyReply {
    content : string;
    success : boolean;
    error : ErrorCode;
  }


  export class APIQueryAccountReply {
    inventories : Array<AccountInventory>;
    total : number;
    success : boolean;
    error : ErrorCode;
  }


  export class APILogOutReply {
    success : boolean;
    error : ErrorCode;
  }


  export class APISearchUserGroupReply {
    content : string;
    success : boolean;
    error : ErrorCode;
  }


  export class APIGetPolicyReply {
    inventory : string;
    success : boolean;
    error : ErrorCode;
  }


  export class APILogInReply {
    inventory : SessionInventory;
    success : boolean;
    error : ErrorCode;
  }


  export class APIListPolicyReply {
    inventories : Array<PolicyInventory>;
    success : boolean;
    error : ErrorCode;
  }


  export class APIQueryQuotaReply {
    inventories : Array<QuotaInventory>;
    total : number;
    success : boolean;
    error : ErrorCode;
  }


  export class APIGetUserGroupReply {
    inventory : string;
    success : boolean;
    error : ErrorCode;
  }


  export class APIQueryPolicyReply {
    inventories : Array<PolicyInventory>;
    total : number;
    success : boolean;
    error : ErrorCode;
  }


  export class APISearchAccountReply {
    content : string;
    success : boolean;
    error : ErrorCode;
  }


  export class APISearchUserReply {
    content : string;
    success : boolean;
    error : ErrorCode;
  }


  export class APIValidateSessionReply {
    validSession : boolean;
    success : boolean;
    error : ErrorCode;
  }


  export class APIGetZoneReply {
    inventory : string;
    success : boolean;
    error : ErrorCode;
  }


  export class APISearchZoneReply {
    content : string;
    success : boolean;
    error : ErrorCode;
  }


  export class APIListZonesReply {
    inventories : Array<ZoneInventory>;
    success : boolean;
    error : ErrorCode;
  }


  export class APIQueryZoneReply {
    inventories : Array<ZoneInventory>;
    total : number;
    success : boolean;
    error : ErrorCode;
  }


  export class APIGetHypervisorTypesReply {
    hypervisorTypes : Array<string>;
    success : boolean;
    error : ErrorCode;
  }


  export class APIGetHostReply {
    inventory : string;
    success : boolean;
    error : ErrorCode;
  }


  export class APIListHostReply {
    inventories : Array<HostInventory>;
    success : boolean;
    error : ErrorCode;
  }


  export class APISearchHostReply {
    content : string;
    success : boolean;
    error : ErrorCode;
  }


  export class APIQueryHostReply {
    inventories : Array<HostInventory>;
    total : number;
    success : boolean;
    error : ErrorCode;
  }


  export class APIQueryApplianceVmReply {
    inventories : Array<ApplianceVmInventory>;
    total : number;
    success : boolean;
    error : ErrorCode;
  }


  export class APIListApplianceVmReply {
    inventories : Array<ApplianceVmInventory>;
    success : boolean;
    error : ErrorCode;
  }


  export class IscsiFileSystemBackendPrimaryStorageInventory {
    chapUsername : string;
    hostname : string;
    sshUsername : string;
    filesystemType : string;
    uuid : string;
    zoneUuid : string;
    name : string;
    url : string;
    description : string;
    totalCapacity : number;
    availableCapacity : number;
    totalPhysicalCapacity : number;
    availablePhysicalCapacity : number;
    type : string;
    state : string;
    status : string;
    mountPath : string;
    createDate : string;
    lastOpDate : string;
    attachedClusterUuids : Array<string>;
  }


  export class APIQueryIscsiFileSystemBackendPrimaryStorageReply {
    inventories : Array<IscsiFileSystemBackendPrimaryStorageInventory>;
    total : number;
    success : boolean;
    error : ErrorCode;
  }


  export class APIGetSftpBackupStorageReply {
    inventory : string;
    success : boolean;
    error : ErrorCode;
  }


  export class APIQuerySftpBackupStorageReply {
    inventories : Array<SftpBackupStorageInventory>;
    total : number;
    success : boolean;
    error : ErrorCode;
  }


  export class APISearchSftpBackupStorageReply {
    content : string;
    success : boolean;
    error : ErrorCode;
  }


  export class APISearchVirtualRouterVmReply {
    content : string;
    success : boolean;
    error : ErrorCode;
  }


  export class APIGetVirtualRouterOfferingReply {
    inventory : string;
    success : boolean;
    error : ErrorCode;
  }


  export class APISearchVirtualRouterOffingReply {
    content : string;
    success : boolean;
    error : ErrorCode;
  }


  export class VirtualRouterOfferingInventory {
    managementNetworkUuid : string;
    publicNetworkUuid : string;
    zoneUuid : string;
    isDefault : boolean;
    imageUuid : string;
    uuid : string;
    name : string;
    description : string;
    cpuNum : number;
    cpuSpeed : number;
    memorySize : number;
    type : string;
    allocatorStrategy : string;
    sortKey : number;
    createDate : string;
    lastOpDate : string;
    state : string;
  }


  export class APIQueryVirtualRouterOfferingReply {
    inventories : Array<VirtualRouterOfferingInventory>;
    total : number;
    success : boolean;
    error : ErrorCode;
  }


  export class VirtualRouterVmInventory {
    publicNetworkUuid : string;
    applianceVmType : string;
    managementNetworkUuid : string;
    defaultRouteL3NetworkUuid : string;
    status : string;
    uuid : string;
    name : string;
    description : string;
    zoneUuid : string;
    clusterUuid : string;
    imageUuid : string;
    hostUuid : string;
    lastHostUuid : string;
    instanceOfferingUuid : string;
    rootVolumeUuid : string;
    platform : string;
    defaultL3NetworkUuid : string;
    type : string;
    hypervisorType : string;
    memorySize : number;
    cpuNum : number;
    cpuSpeed : number;
    allocatorStrategy : string;
    createDate : string;
    lastOpDate : string;
    state : string;
    vmNics : Array<VmNicInventory>;
    allVolumes : Array<VolumeInventory>;
  }


  export class APIQueryVirtualRouterVmReply {
    inventories : Array<VirtualRouterVmInventory>;
    total : number;
    success : boolean;
    error : ErrorCode;
  }


  export class APIQueryPortForwardingRuleReply {
    inventories : Array<PortForwardingRuleInventory>;
    total : number;
    success : boolean;
    error : ErrorCode;
  }


  export class APIListPortForwardingRuleReply {
    inventories : Array<PortForwardingRuleInventory>;
    success : boolean;
    error : ErrorCode;
  }


  export class APIGetPortForwardingAttachableVmNicsReply {
    inventories : Array<VmNicInventory>;
    success : boolean;
    error : ErrorCode;
  }


  export class APIQueryEipReply {
    inventories : Array<EipInventory>;
    total : number;
    success : boolean;
    error : ErrorCode;
  }


  export class APIGetEipAttachableVmNicsReply {
    inventories : Array<VmNicInventory>;
    success : boolean;
    error : ErrorCode;
  }


  export class APIQueryLoadBalancerListenerReply {
    inventories : Array<LoadBalancerListenerInventory>;
    total : number;
    success : boolean;
    error : ErrorCode;
  }


  export class APIQueryLoadBalancerReply {
    inventories : Array<LoadBalancerInventory>;
    total : number;
    success : boolean;
    error : ErrorCode;
  }


  export class APIListSecurityGroupReply {
    inventories : Array<SecurityGroupInventory>;
    success : boolean;
    error : ErrorCode;
  }


  export class APIQuerySecurityGroupRuleReply {
    inventories : Array<SecurityGroupRuleInventory>;
    total : number;
    success : boolean;
    error : ErrorCode;
  }


  export class APIGetCandidateVmNicForSecurityGroupReply {
    inventories : Array<VmNicInventory>;
    success : boolean;
    error : ErrorCode;
  }


  export class VmNicSecurityGroupRefInventory {
    vmNicUuid : string;
    securityGroupUuid : string;
    vmInstanceUuid : string;
    createDate : string;
    lastOpDate : string;
  }


  export class APIListVmNicInSecurityGroupReply {
    inventories : Array<VmNicSecurityGroupRefInventory>;
    success : boolean;
    error : ErrorCode;
  }


  export class APIQuerySecurityGroupReply {
    inventories : Array<SecurityGroupInventory>;
    total : number;
    success : boolean;
    error : ErrorCode;
  }


  export class APIQueryVmNicInSecurityGroupReply {
    inventories : Array<VmNicSecurityGroupRefInventory>;
    total : number;
    success : boolean;
    error : ErrorCode;
  }


  export class APIQueryVipReply {
    inventories : Array<VipInventory>;
    total : number;
    success : boolean;
    error : ErrorCode;
  }


  export class HostCapacityInventory {
    uuid : string;
    totalMemory : number;
    totalCpu : number;
    availableMemory : number;
    availableCpu : number;
  }


  export class ConsoleProxyInventory {
    uuid : string;
    vmInstanceUuid : string;
    agentIp : string;
    token : string;
    agentType : string;
    proxyHostname : string;
    proxyPort : number;
    targetHostname : string;
    targetPort : number;
    scheme : string;
    proxyIdentity : string;
    status : string;
    createDate : string;
    lastOpDate : string;
  }


  export class PrimaryStorageClusterRefInventory {
    id : number;
    clusterUuid : string;
    primaryStorageUuid : string;
    createDate : string;
    lastOpDate : string;
  }


  export class PrimaryStorageCapacityInventory {
    uuid : string;
    totalCapacity : number;
    availableCapacity : number;
    totalPhysicalCapacity : number;
    availablePhsicalCapacity : number;
    createDate : string;
    lastOpDate : string;
  }


  export class BackupStorageZoneRefInventory {
    id : number;
    backupStorageUuid : string;
    zoneUuid : string;
    createDate : string;
    lastOpDate : string;
  }


  export class IpUseInventory {
    uuid : string;
    usedIpUuid : string;
    serviceId : string;
    use : string;
    details : string;
    createDate : string;
    lastOpDate : string;
  }


  export class L3NetworkDnsInventory {
    l3NetworkUuid : string;
    dns : string;
    createDate : string;
    lastOpDate : string;
  }


  export class NetworkServiceTypeInventory {
    networkServiceProviderUuid : string;
    type : string;
  }


  export class NetworkServiceProviderL2NetworkRefInventory {
    networkServiceProviderUuid : string;
    l2NetworkUuid : string;
  }


  export class L2NetworkClusterRefInventory {
    clusterUuid : string;
    l2NetworkUuid : string;
    createDate : string;
    lastOpDate : string;
  }


  export class AccountResourceRefInventory {
    accountUuid : string;
    ownerAccountUuid : string;
    resourceUuid : string;
    resourceType : string;
    permission : number;
    isShared : boolean;
    createDate : string;
    lastOpDate : string;
  }


  export class UserGroupPolicyRefInventory {
    groupUuid : string;
    policyUuid : string;
    createDate : string;
    lastOpDate : string;
  }


  export class UserPolicyRefInventory {
    userUuid : string;
    policyUuid : string;
    createDate : string;
    lastOpDate : string;
  }


  export class UserGroupUserRefInventory {
    userUuid : string;
    groupUuid : string;
    createDate : string;
    lastOpDate : string;
  }


  export class SimulatorHostInventory {
    memoryCapacity : number;
    cpuCapacity : number;
    zoneUuid : string;
    name : string;
    uuid : string;
    clusterUuid : string;
    description : string;
    managementIp : string;
    hypervisorType : string;
    state : string;
    status : string;
    totalCpuCapacity : number;
    availableCpuCapacity : number;
    totalMemoryCapacity : number;
    availableMemoryCapacity : number;
    createDate : string;
    lastOpDate : string;
  }


  export class ApplianceVmFirewallRuleInventory {
    applianceVmUuid : string;
    protocol : string;
    startPort : number;
    endPort : number;
    allowCidr : string;
    sourceIp : string;
    destIp : string;
    l3NetworkUuid : string;
    createDate : string;
    lastOpDate : string;
  }


  export class KVMHostInventory {
    username : string;
    zoneUuid : string;
    name : string;
    uuid : string;
    clusterUuid : string;
    description : string;
    managementIp : string;
    hypervisorType : string;
    state : string;
    status : string;
    totalCpuCapacity : number;
    availableCpuCapacity : number;
    totalMemoryCapacity : number;
    availableMemoryCapacity : number;
    createDate : string;
    lastOpDate : string;
  }


  export class VirtualRouterEipRefInventory {
    eipUuid : string;
    virtualRouterVmUuid : string;
  }


  export class VirtualRouterLoadBalancerRefInventory {
    id : number;
    virtualRouterVmUuid : string;
    loadBalancerUuid : string;
    createDate : string;
    lastOpDate : string;
  }


  export class VirtualRouterVipInventory {
    uuid : string;
    virtualRouterVmUuid : string;
  }


  export class VirtualRouterPortForwardingRuleRefInventory {
    uuid : string;
    vipUuid : string;
    virtualRouterVmUuid : string;
  }


  export class SecurityGroupL3NetworkRefInventory {
    uuid : string;
    l3NetworkUuid : string;
    securityGroupUuid : string;
    createDate : string;
    lastOpDate : string;
  }


  export var GlobalConfigInventoryQueryable = ['name', 'category', 'description', 'defaultValue', 'value'];


  export var TagResourceTypeGlobalConfigVO = 'GlobalConfigVO';

  export var HostCapacityInventoryQueryable = ['uuid', 'totalMemory', 'totalCpu', 'availableMemory', 'availableCpu'];


  export var TagResourceTypeHostCapacityVO = 'HostCapacityVO';

  export var VmNicInventoryQueryable = ['uuid', 'vmInstanceUuid', 'l3NetworkUuid', 'ip', 'mac', 'netmask', 'gateway', 'metaData', 'deviceId', 'createDate', 'lastOpDate'];


  export var TagResourceTypeVmNicVO = 'VmNicVO';

  export var VmInstanceInventoryQueryable = ['uuid', 'name', 'description', 'zoneUuid', 'clusterUuid', 'imageUuid', 'hostUuid', 'lastHostUuid', 'instanceOfferingUuid', 'rootVolumeUuid', 'platform', 'defaultL3NetworkUuid', 'type', 'hypervisorType', 'memorySize', 'cpuNum', 'cpuSpeed', 'allocatorStrategy', 'createDate', 'lastOpDate', 'state', 'vmNics.uuid', 'vmNics.vmInstanceUuid', 'vmNics.l3NetworkUuid', 'vmNics.ip', 'vmNics.mac', 'vmNics.netmask', 'vmNics.gateway', 'vmNics.metaData', 'vmNics.deviceId', 'vmNics.createDate', 'vmNics.lastOpDate', 'allVolumes.uuid', 'allVolumes.name', 'allVolumes.description', 'allVolumes.primaryStorageUuid', 'allVolumes.vmInstanceUuid', 'allVolumes.diskOfferingUuid', 'allVolumes.rootImageUuid', 'allVolumes.installPath', 'allVolumes.type', 'allVolumes.format', 'allVolumes.size', 'allVolumes.deviceId', 'allVolumes.state', 'allVolumes.status', 'allVolumes.createDate', 'allVolumes.lastOpDate'];


  export var TagResourceTypeVmInstanceVO = 'VmInstanceVO';

  export var ImageInventoryQueryable = ['uuid', 'name', 'description', 'state', 'status', 'size', 'md5Sum', 'url', 'mediaType', 'guestOsType', 'type', 'platform', 'format', 'system', 'createDate', 'lastOpDate', 'backupStorageRefs.imageUuid', 'backupStorageRefs.backupStorageUuid', 'backupStorageRefs.installPath', 'backupStorageRefs.createDate', 'backupStorageRefs.lastOpDate'];


  export var TagResourceTypeImageVO = 'ImageVO';

  export var ImageBackupStorageRefInventoryQueryable = ['imageUuid', 'backupStorageUuid', 'installPath', 'createDate', 'lastOpDate'];


  export var TagResourceTypeImageBackupStorageRefVO = 'ImageBackupStorageRefVO';

  export var ConsoleProxyInventoryQueryable = ['uuid', 'vmInstanceUuid', 'agentIp', 'token', 'agentType', 'proxyHostname', 'proxyPort', 'targetHostname', 'targetPort', 'scheme', 'proxyIdentity', 'status', 'createDate', 'lastOpDate'];


  export var TagResourceTypeConsoleProxyVO = 'ConsoleProxyVO';

  export var VolumeInventoryQueryable = ['uuid', 'name', 'description', 'primaryStorageUuid', 'vmInstanceUuid', 'diskOfferingUuid', 'rootImageUuid', 'installPath', 'type', 'format', 'size', 'deviceId', 'state', 'status', 'createDate', 'lastOpDate'];


  export var TagResourceTypeVolumeVO = 'VolumeVO';

  export var InstanceOfferingInventoryQueryable = ['uuid', 'name', 'description', 'cpuNum', 'cpuSpeed', 'memorySize', 'type', 'allocatorStrategy', 'sortKey', 'createDate', 'lastOpDate', 'state'];


  export var TagResourceTypeInstanceOfferingVO = 'InstanceOfferingVO';

  export var DiskOfferingInventoryQueryable = ['uuid', 'name', 'description', 'diskSize', 'sortKey', 'state', 'type', 'createDate', 'lastOpDate', 'allocatorStrategy'];


  export var TagResourceTypeDiskOfferingVO = 'DiskOfferingVO';

  export var PrimaryStorageInventoryQueryable = ['uuid', 'zoneUuid', 'name', 'url', 'description', 'totalCapacity', 'availableCapacity', 'totalPhysicalCapacity', 'availablePhysicalCapacity', 'type', 'state', 'status', 'mountPath', 'createDate', 'lastOpDate', 'attachedClusterUuids'];


  export var TagResourceTypePrimaryStorageVO = 'PrimaryStorageVO';

  export var PrimaryStorageClusterRefInventoryQueryable = ['id', 'clusterUuid', 'primaryStorageUuid', 'createDate', 'lastOpDate'];


  export var TagResourceTypePrimaryStorageClusterRefVO = 'PrimaryStorageClusterRefVO';

  export var PrimaryStorageCapacityInventoryQueryable = ['uuid', 'totalCapacity', 'availableCapacity', 'totalPhysicalCapacity', 'availablePhsicalCapacity', 'createDate', 'lastOpDate'];


  export var TagResourceTypePrimaryStorageCapacityVO = 'PrimaryStorageCapacityVO';

  export var VolumeSnapshotInventoryQueryable = ['uuid', 'name', 'description', 'type', 'volumeUuid', 'treeUuid', 'parentUuid', 'primaryStorageUuid', 'primaryStorageInstallPath', 'volumeType', 'format', 'latest', 'size', 'state', 'status', 'createDate', 'lastOpDate', 'backupStorageRefs.volumeSnapshotUuid', 'backupStorageRefs.backupStorageUuid', 'backupStorageRefs.installPath'];


  export var TagResourceTypeVolumeSnapshotVO = 'VolumeSnapshotVO';

  export var VolumeSnapshotBackupStorageRefInventoryQueryable = ['volumeSnapshotUuid', 'backupStorageUuid', 'installPath'];


  export var TagResourceTypeVolumeSnapshotBackupStorageRefVO = 'VolumeSnapshotBackupStorageRefVO';

  export var VolumeSnapshotTreeInventoryQueryable = ['uuid', 'volumeUuid', 'current', 'createDate', 'lastOpDate'];


  export var TagResourceTypeVolumeSnapshotTreeVO = 'VolumeSnapshotTreeVO';

  export var BackupStorageInventoryQueryable = ['uuid', 'name', 'url', 'description', 'totalCapacity', 'availableCapacity', 'type', 'state', 'status', 'createDate', 'lastOpDate', 'attachedZoneUuids'];


  export var TagResourceTypeBackupStorageVO = 'BackupStorageVO';

  export var BackupStorageZoneRefInventoryQueryable = ['id', 'backupStorageUuid', 'zoneUuid', 'createDate', 'lastOpDate'];


  export var TagResourceTypeBackupStorageZoneRefVO = 'BackupStorageZoneRefVO';

  export var IpRangeInventoryQueryable = ['uuid', 'l3NetworkUuid', 'name', 'description', 'startIp', 'endIp', 'netmask', 'gateway', 'networkCidr', 'createDate', 'lastOpDate'];


  export var TagResourceTypeIpRangeVO = 'IpRangeVO';

  export var L3NetworkInventoryQueryable = ['uuid', 'name', 'description', 'type', 'zoneUuid', 'l2NetworkUuid', 'state', 'dnsDomain', 'system', 'createDate', 'lastOpDate', 'dns', 'ipRanges.uuid', 'ipRanges.l3NetworkUuid', 'ipRanges.name', 'ipRanges.description', 'ipRanges.startIp', 'ipRanges.endIp', 'ipRanges.netmask', 'ipRanges.gateway', 'ipRanges.networkCidr', 'ipRanges.createDate', 'ipRanges.lastOpDate', 'networkServices.l3NetworkUuid', 'networkServices.networkServiceProviderUuid', 'networkServices.networkServiceType'];


  export var TagResourceTypeL3NetworkVO = 'L3NetworkVO';

  export var IpUseInventoryQueryable = ['uuid', 'usedIpUuid', 'serviceId', 'use', 'details', 'createDate', 'lastOpDate'];


  export var TagResourceTypeIpUseVO = 'IpUseVO';

  export var L3NetworkDnsInventoryQueryable = ['l3NetworkUuid', 'dns', 'createDate', 'lastOpDate'];


  export var TagResourceTypeL3NetworkDnsVO = 'L3NetworkDnsVO';

  export var NetworkServiceL3NetworkRefInventoryQueryable = ['l3NetworkUuid', 'networkServiceProviderUuid', 'networkServiceType'];


  export var TagResourceTypeNetworkServiceL3NetworkRefVO = 'NetworkServiceL3NetworkRefVO';

  export var NetworkServiceTypeInventoryQueryable = ['networkServiceProviderUuid', 'type'];


  export var TagResourceTypeNetworkServiceTypeVO = 'NetworkServiceTypeVO';

  export var NetworkServiceProviderInventoryQueryable = ['uuid', 'name', 'description', 'type', 'createDate', 'lastOpDate', 'networkServiceTypes', 'attachedL2NetworkUuids'];


  export var TagResourceTypeNetworkServiceProviderVO = 'NetworkServiceProviderVO';

  export var NetworkServiceProviderL2NetworkRefInventoryQueryable = ['networkServiceProviderUuid', 'l2NetworkUuid'];


  export var TagResourceTypeNetworkServiceProviderL2NetworkRefVO = 'NetworkServiceProviderL2NetworkRefVO';

  export var L2VlanNetworkInventoryQueryable = ['vlan', 'uuid', 'name', 'description', 'zoneUuid', 'physicalInterface', 'type', 'createDate', 'lastOpDate', 'attachedClusterUuids'];


  export var TagResourceTypeL2VlanNetworkVO = 'L2VlanNetworkVO';

  export var L2NetworkClusterRefInventoryQueryable = ['clusterUuid', 'l2NetworkUuid', 'createDate', 'lastOpDate'];


  export var TagResourceTypeL2NetworkClusterRefVO = 'L2NetworkClusterRefVO';

  export var L2NetworkInventoryQueryable = ['uuid', 'name', 'description', 'zoneUuid', 'physicalInterface', 'type', 'createDate', 'lastOpDate', 'attachedClusterUuids'];


  export var TagResourceTypeL2NetworkVO = 'L2NetworkVO';

  export var UserTagInventoryQueryable = ['uuid', 'resourceUuid', 'resourceType', 'tag', 'type', 'createDate', 'lastOpDate'];


  export var TagResourceTypeUserTagVO = 'UserTagVO';

  export var SystemTagInventoryQueryable = ['inherent', 'uuid', 'resourceUuid', 'resourceType', 'tag', 'type', 'createDate', 'lastOpDate'];


  export var TagResourceTypeSystemTagVO = 'SystemTagVO';

  export var ManagementNodeInventoryQueryable = ['uuid', 'hostName', 'joinDate', 'heartBeat'];


  export var TagResourceTypeManagementNodeVO = 'ManagementNodeVO';

  export var ClusterInventoryQueryable = ['name', 'uuid', 'description', 'state', 'hypervisorType', 'createDate', 'lastOpDate', 'zoneUuid', 'type'];


  export var TagResourceTypeClusterVO = 'ClusterVO';

  export var UserInventoryQueryable = ['uuid', 'accountUuid', 'name', 'description', 'createDate', 'lastOpDate'];


  export var TagResourceTypeUserVO = 'UserVO';

  export var UserGroupInventoryQueryable = ['uuid', 'accountUuid', 'name', 'description', 'createDate', 'lastOpDate'];


  export var TagResourceTypeUserGroupVO = 'UserGroupVO';

  export var PolicyInventoryQueryable = ['statements.name', 'statements.effect', 'statements.principals', 'statements.actions', 'statements.resources', 'name', 'uuid', 'accountUuid'];


  export var TagResourceTypePolicyVO = 'PolicyVO';

  export var AccountResourceRefInventoryQueryable = ['accountUuid', 'ownerAccountUuid', 'resourceUuid', 'resourceType', 'permission', 'isShared', 'createDate', 'lastOpDate'];


  export var TagResourceTypeAccountResourceRefVO = 'AccountResourceRefVO';

  export var UserGroupPolicyRefInventoryQueryable = ['groupUuid', 'policyUuid', 'createDate', 'lastOpDate'];


  export var TagResourceTypeUserGroupPolicyRefVO = 'UserGroupPolicyRefVO';

  export var AccountInventoryQueryable = ['uuid', 'name', 'description', 'type', 'createDate', 'lastOpDate'];


  export var TagResourceTypeAccountVO = 'AccountVO';

  export var QuotaInventoryQueryable = ['name', 'identityUuid', 'identityType', 'value', 'lastOpDate', 'createDate'];


  export var TagResourceTypeQuotaVO = 'QuotaVO';

  export var UserPolicyRefInventoryQueryable = ['userUuid', 'policyUuid', 'createDate', 'lastOpDate'];


  export var TagResourceTypeUserPolicyRefVO = 'UserPolicyRefVO';

  export var UserGroupUserRefInventoryQueryable = ['userUuid', 'groupUuid', 'createDate', 'lastOpDate'];


  export var TagResourceTypeUserGroupUserRefVO = 'UserGroupUserRefVO';

  export var ZoneInventoryQueryable = ['uuid', 'name', 'description', 'state', 'type', 'createDate', 'lastOpDate'];


  export var TagResourceTypeZoneVO = 'ZoneVO';

  export var HostInventoryQueryable = ['zoneUuid', 'name', 'uuid', 'clusterUuid', 'description', 'managementIp', 'hypervisorType', 'state', 'status', 'totalCpuCapacity', 'availableCpuCapacity', 'totalMemoryCapacity', 'availableMemoryCapacity', 'createDate', 'lastOpDate'];


  export var TagResourceTypeHostVO = 'HostVO';

  export var SimulatorHostInventoryQueryable = ['memoryCapacity', 'cpuCapacity', 'zoneUuid', 'name', 'uuid', 'clusterUuid', 'description', 'managementIp', 'hypervisorType', 'state', 'status', 'totalCpuCapacity', 'availableCpuCapacity', 'totalMemoryCapacity', 'availableMemoryCapacity', 'createDate', 'lastOpDate'];


  export var TagResourceTypeSimulatorHostVO = 'SimulatorHostVO';

  export var ApplianceVmFirewallRuleInventoryQueryable = ['applianceVmUuid', 'protocol', 'startPort', 'endPort', 'allowCidr', 'sourceIp', 'destIp', 'l3NetworkUuid', 'createDate', 'lastOpDate'];


  export var TagResourceTypeApplianceVmFirewallRuleVO = 'ApplianceVmFirewallRuleVO';

  export var ApplianceVmInventoryQueryable = ['applianceVmType', 'managementNetworkUuid', 'defaultRouteL3NetworkUuid', 'status', 'uuid', 'name', 'description', 'zoneUuid', 'clusterUuid', 'imageUuid', 'hostUuid', 'lastHostUuid', 'instanceOfferingUuid', 'rootVolumeUuid', 'platform', 'defaultL3NetworkUuid', 'type', 'hypervisorType', 'memorySize', 'cpuNum', 'cpuSpeed', 'allocatorStrategy', 'createDate', 'lastOpDate', 'state', 'vmNics.uuid', 'vmNics.vmInstanceUuid', 'vmNics.l3NetworkUuid', 'vmNics.ip', 'vmNics.mac', 'vmNics.netmask', 'vmNics.gateway', 'vmNics.metaData', 'vmNics.deviceId', 'vmNics.createDate', 'vmNics.lastOpDate', 'allVolumes.uuid', 'allVolumes.name', 'allVolumes.description', 'allVolumes.primaryStorageUuid', 'allVolumes.vmInstanceUuid', 'allVolumes.diskOfferingUuid', 'allVolumes.rootImageUuid', 'allVolumes.installPath', 'allVolumes.type', 'allVolumes.format', 'allVolumes.size', 'allVolumes.deviceId', 'allVolumes.state', 'allVolumes.status', 'allVolumes.createDate', 'allVolumes.lastOpDate'];


  export var TagResourceTypeApplianceVmVO = 'ApplianceVmVO';

  export var IscsiFileSystemBackendPrimaryStorageInventoryQueryable = ['chapUsername', 'hostname', 'sshUsername', 'filesystemType', 'uuid', 'zoneUuid', 'name', 'url', 'description', 'totalCapacity', 'availableCapacity', 'totalPhysicalCapacity', 'availablePhysicalCapacity', 'type', 'state', 'status', 'mountPath', 'createDate', 'lastOpDate', 'attachedClusterUuids'];


  export var TagResourceTypeIscsiFileSystemBackendPrimaryStorageVO = 'IscsiFileSystemBackendPrimaryStorageVO';

  export var CephPrimaryStorageInventoryQueryable = ['mons.hostname', 'mons.monPort', 'mons.createDate', 'mons.lastOpDate', 'mons.primaryStorageUuid', 'fsid', 'rootVolumePoolName', 'dataVolumePoolName', 'imageCachePoolName', 'uuid', 'zoneUuid', 'name', 'url', 'description', 'totalCapacity', 'availableCapacity', 'totalPhysicalCapacity', 'availablePhysicalCapacity', 'type', 'state', 'status', 'mountPath', 'createDate', 'lastOpDate', 'attachedClusterUuids'];


  export var TagResourceTypeCephPrimaryStorageVO = 'CephPrimaryStorageVO';

  export var CephPrimaryStorageMonInventoryQueryable = ['hostname', 'monPort', 'createDate', 'lastOpDate', 'primaryStorageUuid'];


  export var TagResourceTypeCephPrimaryStorageMonVO = 'CephPrimaryStorageMonVO';

  export var CephBackupStorageInventoryQueryable = ['mons.hostname', 'mons.monPort', 'mons.createDate', 'mons.lastOpDate', 'mons.backupStorageUuid', 'fsid', 'poolName', 'uuid', 'name', 'url', 'description', 'totalCapacity', 'availableCapacity', 'type', 'state', 'status', 'createDate', 'lastOpDate', 'attachedZoneUuids'];


  export var TagResourceTypeCephBackupStorageVO = 'CephBackupStorageVO';

  export var CephBackupStorageMonInventoryQueryable = ['hostname', 'monPort', 'createDate', 'lastOpDate', 'backupStorageUuid'];


  export var TagResourceTypeCephBackupStorageMonVO = 'CephBackupStorageMonVO';

  export var FusionstorPrimaryStorageInventoryQueryable = ['mons.hostname', 'mons.monPort', 'mons.createDate', 'mons.lastOpDate', 'mons.primaryStorageUuid', 'fsid', 'rootVolumePoolName', 'dataVolumePoolName', 'imageCachePoolName', 'uuid', 'zoneUuid', 'name', 'url', 'description', 'totalCapacity', 'availableCapacity', 'totalPhysicalCapacity', 'availablePhysicalCapacity', 'type', 'state', 'status', 'mountPath', 'createDate', 'lastOpDate', 'attachedClusterUuids'];


  export var TagResourceTypeFusionstorPrimaryStorageVO = 'FusionstorPrimaryStorageVO';

  export var FusionstorPrimaryStorageMonInventoryQueryable = ['hostname', 'monPort', 'createDate', 'lastOpDate', 'primaryStorageUuid'];


  export var TagResourceTypeFusionstorPrimaryStorageMonVO = 'FusionstorPrimaryStorageMonVO';

  export var FusionstorBackupStorageInventoryQueryable = ['mons.hostname', 'mons.monPort', 'mons.createDate', 'mons.lastOpDate', 'mons.backupStorageUuid', 'fsid', 'poolName', 'uuid', 'name', 'url', 'description', 'totalCapacity', 'availableCapacity', 'type', 'state', 'status', 'createDate', 'lastOpDate', 'attachedZoneUuids'];


  export var TagResourceTypeFusionstorBackupStorageVO = 'FusionstorBackupStorageVO';

  export var FusionstorBackupStorageMonInventoryQueryable = ['hostname', 'monPort', 'createDate', 'lastOpDate', 'backupStorageUuid'];


  export var TagResourceTypeFusionstorBackupStorageMonVO = 'FusionstorBackupStorageMonVO';

  export var KVMHostInventoryQueryable = ['username', 'zoneUuid', 'name', 'uuid', 'clusterUuid', 'description', 'managementIp', 'hypervisorType', 'state', 'status', 'totalCpuCapacity', 'availableCpuCapacity', 'totalMemoryCapacity', 'availableMemoryCapacity', 'createDate', 'lastOpDate'];


  export var TagResourceTypeKVMHostVO = 'KVMHostVO';

  export var SftpBackupStorageInventoryQueryable = ['hostname', 'uuid', 'name', 'url', 'description', 'totalCapacity', 'availableCapacity', 'type', 'state', 'status', 'createDate', 'lastOpDate', 'attachedZoneUuids'];


  export var TagResourceTypeSftpBackupStorageVO = 'SftpBackupStorageVO';

  export var VirtualRouterOfferingInventoryQueryable = ['managementNetworkUuid', 'publicNetworkUuid', 'zoneUuid', 'isDefault', 'imageUuid', 'uuid', 'name', 'description', 'cpuNum', 'cpuSpeed', 'memorySize', 'type', 'allocatorStrategy', 'sortKey', 'createDate', 'lastOpDate', 'state'];


  export var TagResourceTypeVirtualRouterOfferingVO = 'VirtualRouterOfferingVO';

  export var VirtualRouterEipRefInventoryQueryable = ['eipUuid', 'virtualRouterVmUuid'];


  export var TagResourceTypeVirtualRouterEipRefVO = 'VirtualRouterEipRefVO';

  export var VirtualRouterVmInventoryQueryable = ['publicNetworkUuid', 'applianceVmType', 'managementNetworkUuid', 'defaultRouteL3NetworkUuid', 'status', 'uuid', 'name', 'description', 'zoneUuid', 'clusterUuid', 'imageUuid', 'hostUuid', 'lastHostUuid', 'instanceOfferingUuid', 'rootVolumeUuid', 'platform', 'defaultL3NetworkUuid', 'type', 'hypervisorType', 'memorySize', 'cpuNum', 'cpuSpeed', 'allocatorStrategy', 'createDate', 'lastOpDate', 'state', 'vmNics.uuid', 'vmNics.vmInstanceUuid', 'vmNics.l3NetworkUuid', 'vmNics.ip', 'vmNics.mac', 'vmNics.netmask', 'vmNics.gateway', 'vmNics.metaData', 'vmNics.deviceId', 'vmNics.createDate', 'vmNics.lastOpDate', 'allVolumes.uuid', 'allVolumes.name', 'allVolumes.description', 'allVolumes.primaryStorageUuid', 'allVolumes.vmInstanceUuid', 'allVolumes.diskOfferingUuid', 'allVolumes.rootImageUuid', 'allVolumes.installPath', 'allVolumes.type', 'allVolumes.format', 'allVolumes.size', 'allVolumes.deviceId', 'allVolumes.state', 'allVolumes.status', 'allVolumes.createDate', 'allVolumes.lastOpDate'];


  export var TagResourceTypeVirtualRouterVmVO = 'VirtualRouterVmVO';

  export var VirtualRouterLoadBalancerRefInventoryQueryable = ['id', 'virtualRouterVmUuid', 'loadBalancerUuid', 'createDate', 'lastOpDate'];


  export var TagResourceTypeVirtualRouterLoadBalancerRefVO = 'VirtualRouterLoadBalancerRefVO';

  export var VirtualRouterVipInventoryQueryable = ['uuid', 'virtualRouterVmUuid'];


  export var TagResourceTypeVirtualRouterVipVO = 'VirtualRouterVipVO';

  export var VirtualRouterPortForwardingRuleRefInventoryQueryable = ['uuid', 'vipUuid', 'virtualRouterVmUuid'];


  export var TagResourceTypeVirtualRouterPortForwardingRuleRefVO = 'VirtualRouterPortForwardingRuleRefVO';

  export var PortForwardingRuleInventoryQueryable = ['uuid', 'name', 'description', 'vipIp', 'guestIp', 'vipUuid', 'vipPortStart', 'vipPortEnd', 'privatePortStart', 'privatePortEnd', 'vmNicUuid', 'protocolType', 'state', 'allowedCidr', 'createDate', 'lastOpDate'];


  export var TagResourceTypePortForwardingRuleVO = 'PortForwardingRuleVO';

  export var EipInventoryQueryable = ['uuid', 'name', 'description', 'vmNicUuid', 'vipUuid', 'createDate', 'lastOpDate', 'state', 'vipIp', 'guestIp'];


  export var TagResourceTypeEipVO = 'EipVO';

  export var LoadBalancerInventoryQueryable = ['name', 'uuid', 'description', 'state', 'vipUuid', 'listeners.uuid', 'listeners.name', 'listeners.description', 'listeners.loadBalancerUuid', 'listeners.instancePort', 'listeners.loadBalancerPort', 'listeners.protocol', 'listeners.createDate', 'listeners.lastOpDate', 'vmNicRefs.id', 'vmNicRefs.listenerUuid', 'vmNicRefs.vmNicUuid', 'vmNicRefs.status', 'vmNicRefs.createDate', 'vmNicRefs.lastOpDate'];


  export var TagResourceTypeLoadBalancerVO = 'LoadBalancerVO';

  export var LoadBalancerListenerVmNicRefInventoryQueryable = ['id', 'listenerUuid', 'vmNicUuid', 'status', 'createDate', 'lastOpDate'];


  export var TagResourceTypeLoadBalancerListenerVmNicRefVO = 'LoadBalancerListenerVmNicRefVO';

  export var LoadBalancerListenerInventoryQueryable = ['uuid', 'name', 'description', 'loadBalancerUuid', 'instancePort', 'loadBalancerPort', 'protocol', 'createDate', 'lastOpDate', 'vmNicRefs.id', 'vmNicRefs.listenerUuid', 'vmNicRefs.vmNicUuid', 'vmNicRefs.status', 'vmNicRefs.createDate', 'vmNicRefs.lastOpDate'];


  export var TagResourceTypeLoadBalancerListenerVO = 'LoadBalancerListenerVO';

  export var VmNicSecurityGroupRefInventoryQueryable = ['vmNicUuid', 'securityGroupUuid', 'vmInstanceUuid', 'createDate', 'lastOpDate'];


  export var TagResourceTypeVmNicSecurityGroupRefVO = 'VmNicSecurityGroupRefVO';

  export var SecurityGroupRuleInventoryQueryable = ['uuid', 'securityGroupUuid', 'type', 'startPort', 'endPort', 'protocol', 'state', 'allowedCidr', 'createDate', 'lastOpDate'];


  export var TagResourceTypeSecurityGroupRuleVO = 'SecurityGroupRuleVO';

  export var SecurityGroupInventoryQueryable = ['uuid', 'name', 'description', 'state', 'createDate', 'lastOpDate', 'rules.uuid', 'rules.securityGroupUuid', 'rules.type', 'rules.startPort', 'rules.endPort', 'rules.protocol', 'rules.state', 'rules.allowedCidr', 'rules.createDate', 'rules.lastOpDate', 'attachedL3NetworkUuids'];


  export var TagResourceTypeSecurityGroupVO = 'SecurityGroupVO';

  export var SecurityGroupL3NetworkRefInventoryQueryable = ['uuid', 'l3NetworkUuid', 'securityGroupUuid', 'createDate', 'lastOpDate'];


  export var TagResourceTypeSecurityGroupL3NetworkRefVO = 'SecurityGroupL3NetworkRefVO';

  export var VipInventoryQueryable = ['uuid', 'name', 'description', 'l3NetworkUuid', 'ip', 'state', 'gateway', 'netmask', 'serviceProvider', 'peerL3NetworkUuid', 'useFor', 'createDate', 'lastOpDate'];


  export var TagResourceTypeVipVO = 'VipVO';

  export class APIExpungeVmInstanceMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.vm.APIExpungeVmInstanceMsg': this
      };
      return msg;
    }
    uuid : string;
    session : SessionInventory;
    timeout : number;
  }

  export class APIExpungeVmInstanceEvent {
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }

  export class APIRecoverVmInstanceMsg implements APIMessage {
    toApiMap() : any {
      var msg = {
        'org.zstack.header.vm.APIRecoverVmInstanceMsg': this
      };
      return msg;
    }
    uuid : string;
    vmInstanceUuid : string;
    session : SessionInventory;
    timeout : number;
  }

  export class APIRecoverVmInstanceEvent {
    inventory : VmInstanceInventory;
    API_EVENT : string;
    success : boolean;
    error : ErrorCode;
    BINDING_KEY_PERFIX : string;
  }

    export class APIRecoverImageEvent {
        inventory : ImageInventory;
        API_EVENT : string;
        success : boolean;
        error : ErrorCode;
        BINDING_KEY_PERFIX : string;
    }


    export class APIExpungeImageEvent {
        API_EVENT : string;
        success : boolean;
        error : ErrorCode;
        BINDING_KEY_PERFIX : string;
    }

    export class APIExpungeImageMsg implements APIMessage {
        toApiMap() : any {
            var msg = {
                'org.zstack.header.image.APIExpungeImageMsg': this
            };
            return msg;
        }
        imageUuid : string;
        backupStorageUuids : Array<string>;
        session : SessionInventory;
        timeout : number;
    }

    export class APIRecoverImageMsg implements APIMessage {
        toApiMap() : any {
            var msg = {
                'org.zstack.header.image.APIRecoverImageMsg': this
            };
            return msg;
        }
        imageUuid : string;
        backupStorageUuids : Array<string>;
        session : SessionInventory;
        timeout : number;
    }

    export class APIExpungeDataVolumeEvent {
        API_EVENT : string;
        success : boolean;
        error : ErrorCode;
        BINDING_KEY_PERFIX : string;
    }

    export class APIRecoverDataVolumeEvent {
        inventory : VolumeInventory;
        API_EVENT : string;
        success : boolean;
        error : ErrorCode;
        BINDING_KEY_PERFIX : string;
    }

    export class APIExpungeDataVolumeMsg implements APIMessage {
        toApiMap() : any {
            var msg = {
                'org.zstack.header.volume.APIExpungeDataVolumeMsg': this
            };
            return msg;
        }
        uuid : string;
        session : SessionInventory;
        timeout : number;
    }

    export class APIRecoverDataVolumeMsg implements APIMessage {
        toApiMap() : any {
            var msg = {
                'org.zstack.header.volume.APIRecoverDataVolumeMsg': this
            };
            return msg;
        }
        uuid : string;
        session : SessionInventory;
        timeout : number;
    }

    export class APIGetVersionMsg implements APIMessage {
      toApiMap() : any {
        var msg = {
          'org.zstack.header.managementnode.APIGetVersionMsg': this
        };
        return msg;
      }
      uuid : string;
      session : SessionInventory;
      timeout : number;
      version : string;
    }

    export class APIGetVersionMsgEvent {
      success : boolean;
      version : string;
    }
}

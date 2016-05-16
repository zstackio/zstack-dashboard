/// <reference path="d.ts/angularjs/angular.d.ts" />

module Utils {

    class Receipt {
        id : string;
        status: number;
        rsp: any;
        request: any;
    }

    export class Tag {
        createTag(tag : string, resourceUuid : string, resourceType : string, done : (tag : ApiHeader.TagInventory)=>void) {
            var msg = new ApiHeader.APICreateUserTagMsg();
            msg.resourceType = resourceType;
            msg.resourceUuid = resourceUuid;
            msg.tag = tag;
            this.api.asyncApi(msg, (ret : ApiHeader.APICreateUserTagEvent)=> {
                if (Utils.notNullnotUndefined(done)) {
                    done(ret.inventory);
                }
            });
        }

        deleteTag(uuid : string, done : ()=>void=null) {
            var msg = new ApiHeader.APIDeleteTagMsg();
            msg.uuid = uuid;
            this.api.asyncApi(msg, (ret : ApiHeader.APIDeleteTagEvent)=> {
                if (Utils.notNullnotUndefined(done)) {
                    done();
                }
            });
        }

        queryTag(resourceUuid : string, done : (tags : ApiHeader.TagInventory[])=> void) {
            var msg = new ApiHeader.APIQueryUserTagMsg();
            msg.conditions = [{name: 'resourceUuid', op: '=', value: resourceUuid}];
            this.api.syncApi(msg, (ret : ApiHeader.APIQueryTagReply)=> {
                done(ret.inventories);
            });
        }

        constructor(private api : Api) {
        }
    }

    export class Api {
        private static ASYNC_CALL_PATH = "/api/async";
        private static SYNC_CALL_PATH = "/api/sync";
        private static QUERY_PATH = "/api/query";

        private static STATUS_DONE = 2;
        private static STATUS_PROCESSING = 1;

        $inject = ['$http', '$rootScope', '$location'];

        private session : ApiHeader.SessionInventory;
        private beforeCallListeners : Function[] = [];
        private afterCallListeners : Function[] = [];
        private errorCallListeners: Function[] = [];

        private debugLogIn(done: ()=>void=null) {
            var msg = new ApiHeader.APILogInByAccountMsg();
            msg.accountName = 'admin';
            msg.password = 'b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb980b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86';
            this.syncCall(msg, (ret : any) => {
                this.session = new ApiHeader.SessionInventory();
                this.session.uuid = ret.inventory.uuid;
                console.log(JSON.stringify(this.session));
                if (Utils.notNullnotUndefined(done)) {
                    done();
                }
            });
        }

        constructor(private $http : ng.IHttpService, private $rootScope : any, private $location: any) {
            //this.debugLogIn();

            $rootScope.$watch(()=>{
                return $rootScope.user;
            },()=>{
                if (Utils.notNullnotUndefined($rootScope.user)) {
                    this.session = new ApiHeader.SessionInventory();
                    this.session.uuid = $rootScope.user.sessionUuid;
                }
            });
        }

        getHypervisorTypes(done: (hyTypes: string[])=>void) {
            var msg = new ApiHeader.APIGetHypervisorTypesMsg();
            this.syncApi(msg, (ret : ApiHeader.APIGetHypervisorTypesReply)=> {
                done(ret.hypervisorTypes);
            });
        }

        getVolumeFormats(done: (formats: any[])=>void) {
            var msg = new ApiHeader.APIGetVolumeFormatMsg();
            this.syncApi(msg, (ret : ApiHeader.APIGetVolumeFormatReply)=>{
                done(ret.formats);
            });
        }

        getPrimaryStorageTypes(done: (psTypes: string[])=>void) {
            var msg = new ApiHeader.APIGetPrimaryStorageTypesMsg();
            this.syncApi(msg, (ret : ApiHeader.APIGetPrimaryStorageTypesReply)=> {
                done(ret.primaryStorageTypes);
            });
        }

        getL2NetworkTypes(done: (l2Types: string[])=>void) {
            var msg = new ApiHeader.APIGetL2NetworkTypesMsg();
            this.syncApi(msg, (ret: ApiHeader.APIGetL2NetworkTypesReply)=> {
                done(ret.l2NetworkTypes);
            });
        }

        getL3NetworkTypes(done: (l3Types: string[])=>void) {
            var msg = new ApiHeader.APIGetL3NetworkTypesMsg();
            this.syncApi(msg, (ret: ApiHeader.APIGetL3NetworkTypesReply)=> {
                done(ret.l3NetworkTypes);
            });
        }

        getBackupStorageTypes(done: (bsTypes: string[])=>void) {
            var msg = new ApiHeader.APIGetBackupStorageTypesMsg();
            this.syncApi(msg, (ret : ApiHeader.APIGetBackupStorageTypesReply)=> {
                done(ret.backupStorageTypes);
            });
        }

        getInstanceOfferingAllocatorStrategies(done: (ret: string[])=>void) {
            var msg = new ApiHeader.APIGetHostAllocatorStrategiesMsg();
            this.syncApi(msg, (ret : ApiHeader.APIGetHostAllocatorStrategiesReply)=> {
                done(ret.hostAllocatorStrategies);
            });
        }

        getDiskOfferingAllocatorStrategies(done: (ret: string[])=>void) {
            var msg = new ApiHeader.APIGetPrimaryStorageAllocatorStrategiesMsg();
            this.syncApi(msg, (ret: ApiHeader.APIGetPrimaryStorageAllocatorStrategiesReply)=> {
                done(ret.primaryStorageAllocatorStrategies);
            });
        }

        getVmMigrationCandidateHosts(vmUuid: string, done: (ret: ApiHeader.HostInventory[])=>void) {
            var msg = new ApiHeader.APIGetVmMigrationCandidateHostsMsg();
            msg.vmInstanceUuid = vmUuid;
            this.syncApi(msg, (ret: ApiHeader.APIGetVmMigrationCandidateHostsReply)=> {
                done(ret.inventories);
            });
        }

        getDataVolumeAttachableVm(volUuid: string, done: (ret: ApiHeader.VmInstanceInventory[])=>void) {
            var msg = new ApiHeader.APIGetDataVolumeAttachableVmMsg();
            msg.volumeUuid = volUuid;
            this.syncApi(msg, (ret: ApiHeader.APIGetDataVolumeAttachableVmReply)=>{
                done(ret.inventories);
            });
        }

        getVmAttachableL3Networks(vmUuid: string, done: (ret: ApiHeader.L3NetworkInventory[])=>void) {
          var msg = new ApiHeader.APIGetVmAttachableL3NetworkMsg();
          msg.vmInstanceUuid = vmUuid;
          this.syncApi(msg, (ret: ApiHeader.APIGetVmAttachableL3NetworkReply)=>{
            done(ret.inventories);
          });
        }

        getVmAttachableVolume(vmUuid: string, done: (ret: ApiHeader.VolumeInventory[])=>void) {
            var msg = new ApiHeader.APIGetVmAttachableDataVolumeMsg();
            msg.vmInstanceUuid = vmUuid;
            this.syncApi(msg, (ret: ApiHeader.APIGetVmAttachableDataVolumeReply)=>{
                done(ret.inventories);
            });
        }

        getMemoryCpuCapacity(zoneUuids: string[], clusterUuids: string[], hostUuids: string[], done:(ret: ApiHeader.APIGetCpuMemoryCapacityReply)=>void) {
            var msg = new ApiHeader.APIGetCpuMemoryCapacityMsg();
            msg.zoneUuids = zoneUuids;
            msg.clusterUuids = clusterUuids;
            msg.hostUuids = hostUuids;
            this.syncApi(msg, (ret: ApiHeader.APIGetCpuMemoryCapacityReply)=>{
                done(ret);
            });
        }

        getMemoryCpuCapacityByAll(done: (ret:ApiHeader.APIGetCpuMemoryCapacityReply)=>void) {
            var msg = new ApiHeader.APIGetCpuMemoryCapacityMsg();
            msg.all = true;
            this.syncApi(msg, (ret: ApiHeader.APIGetCpuMemoryCapacityReply)=>{
                done(ret);
            });
        }

        getPirmaryStorageCapacityByAll(done: (ret:ApiHeader.APIGetPrimaryStorageCapacityReply)=>void) {
            var msg = new ApiHeader.APIGetPrimaryStorageCapacityMsg();
            msg.all = true;
            this.syncApi(msg, (ret: ApiHeader.APIGetPrimaryStorageCapacityReply)=>{
                done(ret);
            });
        }

        getBackupStorageCapacityByAll(done: (ret:ApiHeader.APIGetBackupStorageCapacityReply)=>void) {
            var msg = new ApiHeader.APIGetBackupStorageCapacityMsg();
            msg.all = true;
            this.syncApi(msg, (ret: ApiHeader.APIGetBackupStorageCapacityReply)=>{
                done(ret);
            });
        }

        getIpAddressCapacityByAll(done: (ret:ApiHeader.APIGetIpAddressCapacityReply)=>void) {
            var msg = new ApiHeader.APIGetIpAddressCapacityMsg();
            msg.all = true;
            this.syncApi(msg, (ret: ApiHeader.APIGetIpAddressCapacityReply)=>{
                done(ret);
            });
        }

        getSystemTags(resourceType: string, resourceUuid: string, done: (ts: ApiHeader.SystemTagInventory[])=>void) {
            var msg = new ApiHeader.APIQuerySystemTagMsg();
            msg.conditions = [{
                name: 'resourceType',
                op: '=',
                value: resourceType
            }, {
                name: 'resourceUuid',
                op: '=',
                value: resourceUuid
            }];

            this.syncApi(msg, (ret: ApiHeader.APIQuerySystemTagReply)=>{
                done(ret.inventories);
            });
        }

        private fireAfterListener(recepit : any) {
            angular.forEach(this.afterCallListeners, (item)=> {
                item(recepit.request, recepit.rsp);
            });
        }

        private poll(receipt: Receipt, callback : Function, error : Function) : void {
            if (receipt.status == Api.STATUS_DONE) {
                console.log(JSON.stringify(receipt.rsp));
                this.fireAfterListener(receipt);
                var rsp = Utils.firstItem(receipt.rsp);
                if (rsp.success) {
                    callback(rsp);
                } else {
                    if (Utils.notNullnotUndefined(error)) {
                        error(rsp);
                    }
                }
                return;
            }

            this.$http.post(Api.QUERY_PATH, receipt.id)
                .success((re : Receipt) => {
                    re.request = receipt.request;
                    if (re.status == Api.STATUS_DONE) {
                        console.log(JSON.stringify(re.rsp));
                        this.fireAfterListener(re);
                        var rsp = Utils.firstItem(re.rsp);
                        if (rsp.success) {
                            callback(rsp);
                        } else {
                            if (Utils.notNullnotUndefined(error)) {
                                error(rsp);
                            }
                        }
                        return;
                    }

                    //TODO: configurable
                    setTimeout(()=> {
                        Utils.safeApply(this.$rootScope, ()=>{
                            this.poll(re, callback, error);
                        });
                    }, 1000);
                }).error((reason, status)=> {
                    if (error) {
                        error(reason, status);
                    }

                    this.fireErrorListener({
                        request: receipt.request,
                        data: reason,
                        status: status
                    });
                });
        }

        private fireErrorListener(reason : any) {
            angular.forEach(this.errorCallListeners, (item)=> {
                item(reason);
            });
        }

        private asyncCall(msg : ApiHeader.APIMessage, callback : (result : any) => void, error? : (reason : string, statusCode : number)=>void) : void {
            msg.session = this.session;
            angular.forEach(this.beforeCallListeners, (item)=> {
                item(msg);
            });
            this.$http.post(Api.ASYNC_CALL_PATH, msg.toApiMap())
                .success((receipt : Receipt) => {
                    receipt.request = msg;
                    this.poll(receipt, callback, error);
                }).error((reason, status) => {
                    if (error) {
                        error(reason, status);
                    }

                    this.fireErrorListener({
                        request: msg,
                        data: reason,
                        status: status
                    });
                });
        }

        private syncCall(msg : ApiHeader.APIMessage, callback : (result : any) => void, error? : (reason : string, statusCode : number)=>void) : void {
            msg.session = this.session;
            console.log(JSON.stringify(msg));
            this.$http.post(Api.SYNC_CALL_PATH, msg.toApiMap()).success((rsp : any) => {
                var ret : ApiHeader.APIReply = Utils.firstItem(rsp);
                if (!ret.success && notNullnotUndefined(ret.error) && ret.error.code == 'ID.1001') {
                    console.log('authentication error');
                    this.$location.path('/login');
                    return;
                }

                callback(Utils.firstItem(rsp));
            }).error((reason, status) => {
                if (error) {
                    error(reason, status);
                }

                this.fireErrorListener({
                    request: msg,
                    data: reason,
                    status: status
                });
            });
        }

        public syncApi(data : ApiHeader.APIMessage, callback : (result : any) => void, error : (reason : string, statusCode : number)=>void = undefined) : void {
            /*
            if (Utils.notNullnotUndefined(this.session)) {
                this.syncCall(data, callback, error);
            } else {
                this.debugLogIn(()=> {
                    this.syncCall(data, callback, error);
                });
            }
            */
            if (Utils.notNullnotUndefined(this.$rootScope.sessionUuid)) {
                this.session = new ApiHeader.SessionInventory();
                this.session.uuid = this.$rootScope.sessionUuid;
            }

            this.syncCall(data, callback, error);
        }

        public asyncApi(data : ApiHeader.APIMessage, callback : (result : any) => void, error : (reason : string, statusCode : number)=>void = undefined) : void {
            /*
            if (Utils.notNullnotUndefined(this.session)) {
                this.asyncCall(data, callback, error);
            } else {
                this.debugLogIn(()=> {
                    this.asyncCall(data, callback, error);
                });
            }
            */
            if (Utils.notNullnotUndefined(this.$rootScope.sessionUuid)) {
                this.session = new ApiHeader.SessionInventory();
                this.session.uuid = this.$rootScope.sessionUuid;
            }

            this.asyncCall(data, callback, error);
        }

        installListener(before : (msg : ApiHeader.APIMessage)=>void = null, after : (msg : ApiHeader.APIMessage, ret : any)=>void = null, error : (msg : ApiHeader.APIMessage, reason : any)=>void = null) {
            if (notNullnotUndefined(before)) {
                this.beforeCallListeners.push(before);
            }
            if (notNullnotUndefined(after)) {
                this.afterCallListeners.push(after);
            }
            if (notNullnotUndefined(error)) {
                this.errorCallListeners.push(error);
            }
        }
    }

    export class Chain {
        private flows : Function[] = [];
        private errorHandler : Function;
        private doneHandler: Function;

        done(handler : Function) {
            this.doneHandler = handler;
            return this;
        }

        error(handler : Function) {
            this.errorHandler = handler;
            return this;
        }

        then(flow : ()=>void) {
            this.flows.push(flow);
            return this;
        }

        next() {
            var func = this.flows.shift();
            if (func) {
                func(this);
            } else {
                if (Utils.notNullnotUndefined(this.doneHandler)) {
                    this.doneHandler();
                }
            }
        }

        fail(reason : any) {
            if (this.errorHandler) {
                this.errorHandler(reason);
            }
        }

        start() {
            this.next();
        }

        constructor() {
        }
    }

    export function periodicalRun(func :()=>boolean, interval : number) {
        var cb = () => {
            if (func()) {
                return;
            }

            setTimeout(cb, interval);
        };

        cb();
    }

    export function notNullnotUndefined(arg : any) {
        return angular.isDefined(arg) && arg != null;
    }

    export function notNullnotUndefinedNotEmptyString(arg : any) {
        return notNullnotUndefined(arg) && arg != "";
    }

    export function firstItem(obj : any) {
        return obj[Object.keys(obj)[0]];
    }

    export  function isEmptyObject(obj : any) {
        if (!notNullnotUndefined(obj)) {
            return true;
        }

        for(var key in obj) {
            if (obj.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    }

    export function arrayRemoveIndex(arr : Array<any>, index : number) {
        if (index != -1) {
            arr.splice(index, 1);
        }
    }

    export function safeApply(scope, func) {
        if(!scope.$$phase) {
            scope.$apply(function() {
                func();
            });
        } else {
            func();
        }
    }

    export function addCommas(str) {
        return (str + "").replace(/\b(\d+)((\.\d+)*)\b/g, function(a, b, c) {
            return (b.charAt(0) > 0 && !(c || ".").lastIndexOf(".") ? b.replace(/(\d)(?=(\d{3})+$)/g, "$1,") : b) + c;
        });
    }

    export function isValidSizeStr(str) {
        if (angular.isNumber(str)) {
            return true;
        }

        var cpattern = /^[PpTtGgMmKk]$/;
        var npattern = /^[0-9]$/;
        var last = str.slice(-1);
        if (cpattern.test(last)) {
            var size = str.substring(0, str.length-1);
            return !isNaN(size);
        } else if (npattern.test(last)) {
            return !isNaN(str);
        } else {
            return false;
        }
    }

    export function stringContains(str : string, tofind: string) : boolean {
        return str.indexOf(tofind) > -1;
    }

    export function isIpv4Address(ip:string) {
        var pattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        return pattern.test(ip);
    }

    export function isCharacter(c:string) {
        var pattern = /^[a-z]$/;
        return pattern.test(c);
    }

    export function isValidPort(port : any) : boolean {
        if (isNaN(port)) {
            return false;
        }

        var sport = parseInt(port);
        return sport >= 0 && sport <= 65535;
    }

    export function isValidCidr(cidr : any) : boolean {
        var pairs = cidr.split("/");
        if (pairs.length != 2) {
            return false;
        }

        var ip = pairs[0];
        if (!Utils.isIpv4Address(ip)) {
            return false;
        }

        var cidrStr = pairs[1];
        if (isNaN(cidrStr)) {
            return false;
        }

        cidr = parseInt(cidrStr);

        return cidr >= 0 && cidr <= 32
    }

    export function shortHashName(prefix) {
        return prefix + '-' + ("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).substr(-4);
    }

    export function uuid() {
      var dec2hex = [];
      for (var i=0; i<=15; i++) {
        dec2hex[i] = i.toString(16);
      }

      return function () {
        var uuid = '';
        for (var i = 1; i <= 36; i++) {
          if (i === 9 || i === 14 || i === 19 || i === 24) {
            continue;
          } else if (i === 15) {
            uuid += 4;
          } else if (i === 20) {
            uuid += dec2hex[(Math.random() * 4 | 0 + 8)];
          } else {
            uuid += dec2hex[(Math.random() * 15 | 0)];
          }
        }
        return uuid;
      }();
    }

    export function sprintf(fmt : string, ...args : any[]) {
        return fmt.replace(/{(\d+)}/g, function(match, index) {
            return typeof args[index] != 'undefined'
                ? args[index]
                : "";
        });
    }

    var K = 1024;
    var M = K * K;
    var G = M * K;
    var T = G * K;
    var P = T * K;

    var sizeMap = {
        'K': K,
        'M': M,
        'G': G,
        'T': T,
        'P': P
    };

    export function parseSize(sizeStr: string) {
        var quantity = sizeStr.substr(sizeStr.length-1, 1);
        var size = parseInt(sizeStr);
        if (quantity == 'K' || quantity == 'k') {
            return size * K;
        } else if (quantity == 'M' || quantity == 'm') {
            return size * M;
        } else if (quantity == 'G' || quantity == 'g') {
            return size * G;
        } else if (quantity == 'T' || quantity == 't') {
            return size * T;
        } else if (quantity == 'P' || quantity == 'p') {
            return size * P;
        } else {
            return parseInt(sizeStr);
        }
    }

    export function sizeRoundToString(size) {
        var suffixes = ['P', 'T', 'G', 'M', 'K'];
        function round() {
            var s = suffixes.shift();
            if (!notNullnotUndefined(size)) {
                return sprintf('{0} Bytes', size);
            }

            var q = sizeMap[s];
            var ret = size / q;
            if (ret >= 1) {
                return sprintf('{0} {1}', ret.toFixed(2), s);
            } else {
                return round()
            }
        }

        return round();
    }

    export function toFixed ( num, precision ) {
        var multiplier = Math.pow( 10, precision + 1 ),
            wholeNumber = Math.floor( num * multiplier );
        return Math.round( wholeNumber / 10 ) * 10 / multiplier;
    }

    export function toSizeString(input) {
        try {
            return Utils.sizeRoundToString(parseInt(input));
        } catch (e) {
            return input;
        }
    }

    export function toVCPUString (input) {
        return input + ' VCPUs';
    }

    export function toPercentageString(input) {
        var per : number = parseFloat(input) * 100;
        var perStr = per.toString();
        if (perStr.length > 5) {
            perStr = perStr.slice(0, 5);
        }
        return Utils.sprintf('{0}%', perStr);
    }

    export function commaString(input) {
        return Utils.addCommas(input.toString());
    }

    export class Translator {
        addProperty(object, key, resourceId) {
            Object.defineProperty(object, key, {
                get: () => this.$filter('translate')(resourceId)
            });
        }

        constructor(private $filter: ng.IFilterService) {
        }
    }

    export class Model {
        current : any;
        multiSelection : boolean;

        constructor() {
            this.multiSelection = false;
        }

        resetCurrent() {
            this.current = null;
        }
    }

    export class OGrid {
        options : kendo.ui.GridOptions;
        grid : kendo.ui.Grid;
        $scope: any;

        setFilter(filter : any) {
            this.grid.dataSource.filter(filter);
        }

        select(item : any) {
            var selected = null;
            if (Utils.notNullnotUndefined(item)) {
                selected = item;
            } else {
                selected = this.grid.dataSource.data()[0];
            }

            if (selected) {
                if (this.$scope.model.mutliSelection) {
                    selected.forEach(m => {
                        var row = this.grid.table.find('tr[data-uid="' + m.uid + '"]');
                        this.grid.select(row);
                    });
                } else {
                    var row = this.grid.table.find('tr[data-uid="' + selected.uid + '"]');
                    this.grid.select(row);
                }
            }
        }

        refresh(data: any[]=null) {
            if (Utils.notNullnotUndefined(data)) {
                this.grid.dataSource.data(data);
            } else {
                this.grid.dataSource.read();
                this.$scope.model.resetCurrent();
            }
        }

        add(ps: any) {
            this.grid.dataSource.insert(0, ps);
        }

        deleteCurrent() {
            if (this.$scope.model.multiSelection) {
                this.$scope.model.current.forEach(m => {
                    var row = this.grid.dataSource.getByUid(m.uid);
                    this.grid.dataSource.remove(row);
                });
            } else {
                var row = this.grid.dataSource.getByUid(this.$scope.model.current.uid);
                this.grid.dataSource.remove(row);
            }
            this.$scope.model.resetCurrent();
        }

        init($scope: any, grid : any) {
            this.$scope = $scope;
            this.grid = grid;
            var model : any = this.$scope.model;

            this.options = {
                resizable: true,
                scrollable: true,
                selectable: true,
                pageable: true,

                dataBound: (e)=> {
                    this.grid = e.sender;
                    if (this.grid.dataSource.totalPages() <= 1) {
                        this.grid.pager.element.hide();
                    }

                    if (Utils.notNullnotUndefined(model.current)) {
                        this.select(model.current);
                    }
                },

                change: (e)=> {
                    var selected = this.grid.select();
                    if (model.multiSelection) {
                        Utils.safeApply($scope, () => {
                            if (!model.current)
                                model.current = [];
                            var idx = model.current.indexOf(this.grid.dataItem(selected));
                            if (idx < 0)
                                model.current.push(this.grid.dataItem(selected));
                            else
                                model.current.splice(idx, 1);
                        });
                    } else {
                        Utils.safeApply($scope, () => {
                            model.current = this.grid.dataItem(selected);
                        });
                    }
                },

                dataSource: new kendo.data.DataSource({
                    serverPaging: true,
                    pageSize: 20,
                    schema: {
                        data: 'data',
                        total: 'total'
                    },
                    transport: {}
                })
            };
        }
    }

    export interface WizardPage {
        canMoveToPrevious(): boolean;
        canMoveToNext(): boolean;
        show();
        active();
        isActive(): boolean;
        getPageName(): string;
        getAnchorElement(): JQuery;
        reset(): void;
        beforeMoveToNext? (done: ()=>void): void;
    }

    export interface WizardMediator {
        movedToPage(page : WizardPage);
        finishButtonName(): string;
        finish();
    }

    export class WizardButton {
        currentIndex : number;

        reset() {
            this.currentIndex = 0;
            var fpage = this.pages[0];
            angular.forEach(this.pages, (page)=> {
                page.reset();
                if (page != fpage) {
                    var el = page.getAnchorElement();
                    el.removeAttr('data-toggle');
                }
            });

            this.showPage(fpage);
        }

        canPreviousProceed() : boolean {
            if (this.currentIndex == 0) {
                return false;
            } else {
                var page = this.pages[this.currentIndex];
                return page.canMoveToPrevious();
            }
        }

        canNextProceed() : boolean {
            var page = this.pages[this.currentIndex];
            return page.canMoveToNext();
        }

        private isLastPage() : boolean {
            return this.currentIndex == this.pages.length - 1;
        }

        private showPage(page: WizardPage) {
            page.active();
            page.show();
            var el = page.getAnchorElement();
            if (!Utils.notNullnotUndefined(el.attr('data-toggle'))) {
                el.attr('data-toggle', 'tab');
            }
        }

        previousClick() {
            this.currentIndex --;
            var page = this.pages[this.currentIndex];
            this.mediator.movedToPage(page);
            this.showPage(page);
        }

        nextClick() {
            if (this.isLastPage()) {
                this.mediator.finish();
                return;
            }


            this.currentIndex ++;
            var page = this.pages[this.currentIndex];
            if (Utils.notNullnotUndefined(page.beforeMoveToNext)) {
                page.beforeMoveToNext(()=>{
                    this.mediator.movedToPage(page);
                    this.showPage(page);
                })
            } else {
                this.mediator.movedToPage(page);
                this.showPage(page);
            }
        }

        nextButtonName(): string {
            if (this.isLastPage()) {
                return this.mediator.finishButtonName();
            } else {
                return 'Next';
            }
        }

        pageClick(pageName: string) {
            for (var i=0; i<this.pages.length; i++) {
                var page = this.pages[i];
                if (pageName == page.getPageName() && page.isActive()) {
                    page.show();
                    this.currentIndex = i;
                }
            }
        }

        constructor(private pages: WizardPage[], private mediator: WizardMediator) {
            this.currentIndex = 0;
        }
    }

}

angular.module("app.service", []).factory('Api', ['$http', '$rootScope', '$location', ($http : ng.IHttpService, $rootScope : any, $location: any) => {
    return new Utils.Api($http, $rootScope, $location);
}]).factory('Tag', ['Api', (api : Utils.Api) => {
    return new Utils.Tag(api);
}]).factory('Translator', ['$filter', ($filter: ng.IFilterService) => {
    return new Utils.Translator($filter);
}]);

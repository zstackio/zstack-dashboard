/// <reference path="d.ts/angularjs/angular.d.ts" />
/// <reference path="d.ts/kendo.all.d.ts" />

module MNav {
    export class Controller {
        static $inject = ['$scope', 'Api'];

        private pendingRequestNum : number = 0;

        private decrease() {
            this.pendingRequestNum --;
            if (this.pendingRequestNum <= 0) {
                this.pendingRequestNum = 0;
            }
        }

        constructor(private $scope : any, private api : Utils.Api) {
            api.installListener((msg : ApiHeader.APIMessage)=> {
                this.pendingRequestNum ++;
            }, (msg : ApiHeader.APIMessage, ret : any)=> {
                this.decrease();
            }, (msg : ApiHeader.APIMessage, reason : any)=> {
                this.decrease();
            });

            $scope.funcIsProcessing = ()=> {
                return this.pendingRequestNum > 0;
            };

            $scope.funcPendingRequestNum = ()=> {
                return this.pendingRequestNum;
            };
        }
    }
}
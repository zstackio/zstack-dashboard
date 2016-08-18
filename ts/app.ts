/// <reference path="d.ts/angularjs/angular.d.ts" />
/// <reference path="d.ts/kendo.all.d.ts" />
/// <reference path="d.ts/zstack.d.ts" />

module MRoot {
    export class Events {
        static NOTIFICATION = "root.notification";
    }

    export class ChangePasswordModel {
        password: string;
        repeatPassword: string;
        canChange() : boolean {
            return angular.equals(this.password, this.repeatPassword) && angular.isDefined(this.password);
        }
    }

    export class main {
        static $inject = ['$scope', '$rootScope', 'Api', 'ApiDetails', '$location', '$cookies', '$translate'];

        constructor(private $scope : any, private $rootScope : any, private api : Utils.Api,
                     private apiDetails: MApiDetails.ApiDetails, private $location: ng.ILocationService, private $cookies: any, private $translate: any) {

            if (Utils.notNullnotUndefined($cookies.sessionUuid)) {
                var msg = new ApiHeader.APIValidateSessionMsg();
                msg.sessionUuid = $cookies.sessionUuid;
                this.api.syncApi(msg, (ret: ApiHeader.APIValidateSessionReply)=>{
                    if (ret.success && ret.validSession) {
                        $rootScope.sessionUuid = $cookies.sessionUuid;
                        $rootScope.loginFlag = true;
                        $location.path("/dashboard");
                    } else {
                        $rootScope.loginFlag = false;
                    }
                });
            }

            $rootScope.instanceConsoles = {};

            $scope.optionsNotification = {
                position: {
                    pinned: true,
                    top: null,
                    left: 20,
                    bottom: 20,
                    right: null
                },
                width: 300,
                templates: [
                    {
                        type: 'success',
                        template: $('#successNotification').html()
                    },
                    {
                        type: 'error',
                        template: $('#errorNotification').html()
                    }
                ]
            };

            $scope.$on(Events.NOTIFICATION, (e : any, msg : any)=> {
                var type = msg.type;
                if (!Utils.notNullnotUndefined(type)) {
                    type = "success";
                }
                $scope.apiNotification.show(msg, type);
            });

            $rootScope.loginFlag = false;

            $scope.isLogin = () => {
                return $rootScope.loginFlag;
            };

            $scope.$watch(()=>{
                return $rootScope.loginFlag;
            },()=>{
                if (!$rootScope.loginFlag) {
                    $location.path("/login");
                }
            });

            $scope.canLogin = () => {
                return Utils.notNullnotUndefined($scope.username) && Utils.notNullnotUndefined($scope.password);
            };

            $scope.getAccountName = () => {
                return $cookies.accountName;
            };

            $scope.getAccountUuid = () => {
                return $cookies.accountUuid;
            }

            $scope.getUserUuid = () => {
                return $cookies.userUuid;
            }

            $scope.changePassword = (win : kendo.ui.Window)=>{
                $scope.modelChangePassword = new ChangePasswordModel();
                win.center();
                win.open();
            }

            $scope.funcChangePasswordDone = (win : kendo.ui.Window)=>{
                var msg = new ApiHeader.APIUpdateAccountMsg();
                msg.uuid = $cookies.accountUuid;
                msg.password = CryptoJS.SHA512($scope.modelChangePassword.password).toString();
                this.api.syncApi(msg, (ret: ApiHeader.APIUpdateAccountEvent)=>{
                    $rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                        msg: Utils.sprintf('Changed password: {0}', $cookies.accountName)
                    });
                });
                win.close();
            };
            
            $scope.funcChangePasswordCancel = (win : kendo.ui.Window)=>{
                win.close();
            };

            $scope.logout = () => {
                var msg = new ApiHeader.APILogOutMsg();
                msg.sessionUuid = $cookies.sessionUuid;
                this.api.syncApi(msg, (ret: ApiHeader.APILogOutReply)=>{
                    $rootScope.loginFlag = false;
                    $rootScope.sessionUuid  = null;
                    $cookies.sessionUuid =  null;
                    $scope.username = null;
                    $scope.password = null;
                    $location.path("/login");
                    $scope.logInError = false;
                });
            };

            $scope.logInError = false;
            $scope.login = () => {
                var msg = new ApiHeader.APILogInByAccountMsg();
                msg.accountName = $scope.username;
                msg.password = CryptoJS.SHA512($scope.password).toString();
                this.api.syncApi(msg, (ret: ApiHeader.APILogInReply)=>{
                    if (ret.success) {
                        $rootScope.loginFlag = true;
                        $rootScope.sessionUuid  = ret.inventory.uuid;
                        $cookies.sessionUuid =  ret.inventory.uuid;
                        $cookies.accountName =  $scope.username;
                        $cookies.accountUuid = ret.inventory.accountUuid;
                        $cookies.userUuid = ret.inventory.userUuid;
                        $scope.username = null;
                        $scope.password = null;
                        $location.path("/dashboard");
                        $scope.logInError = false;
                    } else {
                        $scope.logInError = true;
                    }
                });
            };
            $scope.changeLanguage = (language) => {  
                 switch(language) {  
                   case 'English':  
                        $translate.use('en_US');  
                        break;  
                   case 'Chinese (Simplified)':  
                        $translate.use('zh_CN');  
                        break;  
                   case 'Chinese (Traditional)':  
                        $translate.use('zh_TW');  
                        break;  
                }  
           }  

        }
    }
}

module ApiHeader {
    export class QueryObject  {
        start : number = null;
        limit : number = null;
        count : boolean = false;
        conditions : ApiHeader.QueryCondition[] = null;

        addCondition(cond : ApiHeader.QueryCondition) {
            if (!Utils.notNullnotUndefined(this.conditions)) {
                this.conditions = [];
            }
            this.conditions.push(cond);
        }
    }
}


angular.module("root", ['app.service', 'kendo.directives', 'ngRoute', 'ngTagsInput', 'ngCookies', 'pascalprecht.translate']) 
    .config(['$routeProvider', function(route) {
        route.when('/login', {
            templateUrl: '/static/templates/login/login.html',
            controller: 'MRoot.main'
        }).otherwise({
            redirectTo: '/dashboard'
        });
    }])
   .constant('LOCALES', {  
         'locales': {  
             'zh_CN': '简体中文',  
             'zh_TW': '繁体中文',  
             'en_US': 'English'  
         },  
         'preferredLocale': 'en_US'  
     })  
     .config(function($translateProvider) {  
         $translateProvider.useStaticFilesLoader({  
             prefix: '/static/resources/locale-',// path to translations files  
             suffix: '.json'// suffix, currently- extension of the translations  
         });  
         $translateProvider.preferredLanguage('en_US');// is applied on first load
         $translateProvider.useSanitizeValueStrategy('escape');
         $translateProvider.useCookieStorage();
     });  


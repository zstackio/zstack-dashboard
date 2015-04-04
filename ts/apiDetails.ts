/// <reference path="d.ts/angularjs/angular.d.ts" />
/// <reference path="d.ts/kendo.all.d.ts" />

module MApiDetails {
    class Details {
        request: any;
        requestText: string;
        rsp: any;
        rspText: string;
        success: boolean;
        apiId: string;
    }

    export class Controller {
    }

    export class DetailsController {
        static $inject = ['$scope', '$rootScope', 'ApiDetails', '$routeParams'];

        constructor($scope: any, $rootScope: any, apiDetails : ApiDetails, private $routeParams : any) {
            var apiId = $routeParams.apiId;
            var apis = $rootScope.optionsApiGrid.dataSource.data();
            var api = null;
            for (var i=0; i<apis.length; i++) {
                api = apis[i];
                if (api.apiId == apiId) {
                    $scope.request = JSON.stringify(api.request.toApiMap(), null, 2);
                    $scope.response = JSON.stringify(api.rsp, null, 2);
                    break;
                }
            }

            if (!Utils.notNullnotUndefined(api)) {
                return;
            }

            $scope.isSuccess = ()=> {
                return api.success;
            };

            $scope.getResultLabel = ()=> {
                return api.success ? 'label label-success' : 'label label-danger';
            };
        }
    }

    export class ApiDetails {
        static $inject = ['$rootScope', 'Api', '$location'];

        constructor(private $rootScope: any, private api : Utils.Api, private $location: ng.ILocationService) {
            api.installListener(null, (request: ApiHeader.APIMessage, rsp: any)=> {
                var d = new Details();
                var apiId = Utils.firstItem(rsp).apiId;
                d.request = request;
                d.requestText = JSON.stringify(request.toApiMap());
                d.rsp = rsp;
                d.rspText = JSON.stringify(rsp);
                d.success = Utils.firstItem(rsp).success;
                d.apiId = apiId;
                $rootScope.optionsApiGrid.dataSource.insert(0, d);
                if (!d.success) {
                    this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                        msg: Utils.sprintf('API failure'),
                        type: 'error',
                        link: Utils.sprintf('/#/apiDetails/{0}', apiId)
                    });
                }
            }, (error : any)=> {
                var d = new Details();
                d.request = JSON.stringify(error.request);
                d.rsp = JSON.stringify({
                    status: error.status,
                    reason: error.data
                });
                d.success = false;
                $rootScope.optionsApiGrid.dataSource.insert(0, d);
                this.$rootScope.$broadcast(MRoot.Events.NOTIFICATION, {
                    type: 'error',
                    msg: Utils.sprintf('API failure, {0}', d.rsp)
                });
            });

            $rootScope.optionsApiGrid = {
                dataSource: new kendo.data.DataSource({
                    data: []
                }),

                resizable: true,
                scrollable: true,
                selectable: true,
                pageable: true,

                columns: [
                    {
                        field: 'success',
                        title: 'SUCCESS',
                        width: '10%',
                        template: '<span class="label #= success ? \"label-success\" : \"label-danger\" #">#= success ? \"SUCCESS\" : \"FAILURE\" #</span>'
                    },
                    {
                        field: 'requestText',
                        title: 'REQUEST',
                        width: '45%'
                    },
                    {
                        field: 'rspText',
                        title: 'RESPONSE',
                        width: '45%'
                    }
                ],

                change: (e)=> {
                    var grid = e.sender;
                    var selected = grid.select();
                    Utils.safeApply($rootScope, ()=>{
                        $rootScope.currentApiDetails = grid.dataItem(selected);
                    });
                }
            };

            $rootScope.getApiDetailsNum = ()=> {
                return $rootScope.optionsApiGrid.dataSource.data().length;
            };

            $rootScope.funcApiDetailsGridDoubleClick = ()=> {
                console.log('xxxxxxxxxxxxxxxx ' + JSON.stringify($rootScope.currentApiDetails));
                if (Utils.notNullnotUndefined($rootScope.currentApiDetails)) {
                    var url = Utils.sprintf('/apiDetails/{0}', $rootScope.currentApiDetails.apiId);
                    $location.path(url);
                }
            };
        }
    }
}

angular.module('root').config(['$routeProvider', function(route) {
    route.when('/apiDetails', {
        templateUrl: '/static/templates/apiDetails.html',
        controller: 'MApiDetails.Controller'
    }).when('/apiDetails/:apiId', {
        templateUrl: '/static/templates/apiDetailsDetails.html',
        controller: 'MApiDetails.DetailsController'
    });
}]).factory('ApiDetails', ['$rootScope', 'Api', '$location', ($rootScope, api, $location)=> {
    return new MApiDetails.ApiDetails($rootScope, api, $location);
}]);
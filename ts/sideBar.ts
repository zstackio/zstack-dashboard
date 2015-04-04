/// <reference path="d.ts/angularjs/angular.d.ts" />
/// <reference path="d.ts/kendo.all.d.ts" />

module Controller {
    export interface SideBarScope extends ng.IScope {
        barOptions : kendo.ui.TreeViewOptions;
        dataSource : kendo.data.HierarchicalDataSource;
    }

    export class SideBar {
        constructor($scope : SideBarScope) {
            $scope.dataSource = new kendo.data.HierarchicalDataSource({
                data:[
                    {
                        text: "Compute",
                        url: "#",
                        items: [
                            {
                                text: "Instance",
                                url: "#"
                            },
                            {
                                text: "Host",
                                url: "#"
                            },
                            {
                                text: "Cluster",
                                url: "/#/cluster"
                            },
                            {
                                text: "Zone",
                                url: "/#/zone"
                            },
                        ]
                    },
                    {
                        text: "Storage",
                        url: "#"
                    },
                    {
                        text: "Network",
                        url: "#",
                        items: [
                            {
                                text: "L2 Network",
                                url: "#"
                            },
                            {
                                text: "L3 Network",
                                url: "#"
                            },
                            {
                                text: "Network Service",
                                url: "#",
                                items: [
                                    {
                                        text: "Security Group",
                                        url: "#"
                                    },
                                    {
                                        text: "EIP",
                                        url: "#"
                                    },
                                    {
                                        text: "Port Forwarding",
                                        url: "#"
                                    },
                                    {
                                        text: "VIP",
                                        url: "#"
                                    },
                                ]
                            },
                        ]
                    },
                    {
                        text: "Configuration",
                        url: "#"
                    }
                ]
            });
            /*
            $scope.barOptions = {
                dataSource : new kendo.data.HierarchicalDataSource({
                    data:[
                        {
                            text: "Compute",
                            items: [
                                {text: "Instance"},
                                {text: "Host"},
                                {text: "Cluster"},
                                {text: "Zone"},
                            ]
                        },
                        {
                            text: "Storage"
                        },
                        {
                            text: "Network"
                        },
                        {
                            text: "Configuration"
                        }
                    ]
                })
            };
            */
        }
    }
}


var module = angular.module("example", ["angularGrid"]);

module.controller("exampleCtrl", function($scope, $http) {

    var columnDefs = [
        // this row just shows the row index, doesn't use any data from the row
        {headerName: "#", width: 50, cellRenderer: function(params) {
            return params.node.id + 1;
        } },
        {headerName: "Athlete", field: "athlete", width: 150},
        {headerName: "Age", field: "age", width: 90},
        {headerName: "Country", field: "country", width: 120},
        {headerName: "Year", field: "year", width: 90},
        {headerName: "Date", field: "date", width: 110},
        {headerName: "Sport", field: "sport", width: 110},
        {headerName: "Gold", field: "gold", width: 100},
        {headerName: "Silver", field: "silver", width: 100},
        {headerName: "Bronze", field: "bronze", width: 100},
        {headerName: "Total", field: "total", width: 100}
    ];

    $scope.pageSize = '500';

    $scope.gridOptions = {
        // note - we do not set 'virtualPaging' here, so the grid knows we are doing standard paging
        enableSorting: true,
        enableFilter: true,
        enableColResize: true,
        columnDefs: columnDefs
    };

    $scope.onPageSizeChanged = function() {
        createNewDatasource();
    };

    // when json gets loaded, it's put here, and  the datasource reads in from here.
    // in a real application, the page will be got from the server.
    var allOfTheData;

    $http.get("../olympicWinners.json")
        .then(function(result){
            allOfTheData = result.data;
            createNewDatasource();
        });

    function createNewDatasource() {
        if (!allOfTheData) {
            // in case user selected 'onPageSizeChanged()' before the json was loaded
            return;
        }
        var dataSource = {
            //rowCount: ???, - not setting the row count, infinite paging will be used
            pageSize: parseInt($scope.pageSize), // changing to number, as scope keeps it as a string
            getRows: function (start, finish, callbackSuccess, callbackFail) {
                // this code should contact the server for rows. however for the purposes of the demo,
                // the data is generated locally, a timer is used to give the experience of
                // an asynchronous call
                console.log('asking for ' + start + ' to ' + finish);
                setTimeout( function() {
                    // take a chunk of the array, matching the start and finish times
                    var rowsThisPage = allOfTheData.slice(start, finish);
                    var lastRow = -1;
                    // see if we have come to the last page, and if so, return it
                    if (allOfTheData.length <= finish) {
                        lastRow = allOfTheData.length;
                    }
                    callbackSuccess(rowsThisPage, lastRow);
                }, 500);
            }
        };

        $scope.gridOptions.api.setDatasource(dataSource);
    }
});

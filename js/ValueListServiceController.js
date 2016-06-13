/**
 * Created by 578993 on 6/9/2016.
 */



//will need controller to depend on http, I would love to make a service to talk to my
//rest service!

var app = angular.module('ValueListServiceDemo', []);

app.controller('ValueListServiceController', function($scope, $http) {

    $scope.valuesInfo = {};
    $scope.waiting = false;
    $scope.params = {};
    $scope.params['valueListQuery'] = 'query';
    $scope.params['page'] = 1;
    $scope.params['numberPerPage'] = 15;

    var baseUrl = "http://localhost:8080/valueslistservice/values?";

    function getUrl(params){
        var paramsString = "";
        Object.keys(params).forEach(function(key) {
            paramsString = paramsString + key + "=" + params[key] + "&";
        });
        return (baseUrl + paramsString).slice(0, (baseUrl + paramsString).length - 1);
    }

    function setScopeParams(){
        $scope.params = {};
        var paramsPart = $scope.url.split('?')[1];
        var kvPairArray = paramsPart.split('&');
        for(var i = 0; i < kvPairArray.length; i++){
            $scope.params[kvPairArray[i].split("=")[0]] = kvPairArray[i].split("=")[1];
        }
    }

    if($scope.url === null || $scope.url == undefined || $scope.url == ""){
        $scope.url = getUrl($scope.params);
    }


    $scope.refreshValues = function(){
        setScopeParams();
        refresh();
    };

    function refresh(){
        $scope.waiting = true;
        $scope.hasValuesInfo = false;
        $http.get(getUrl($scope.params))
            .then(function(response) {
                $scope.values = response.data.values;
                $scope.valuesInfo.totalCount = response.data.valuesInfo.totalCount;
                $scope.valuesInfo.page = response.data.valuesInfo.page;
                $scope.valuesInfo.numberPerPage = response.data.valuesInfo.numberPerPage;
                $scope.hasValuesInfo = true;
                $scope.waiting = false;
            });

    }

    $scope.nextPage = function(){
        setScopeParams();
        $scope.params['page'] = parseInt($scope.params['page']) + 1;
        $scope.url = getUrl($scope.params);
        refresh();
    };

    $scope.backPage = function(){
        setScopeParams();
        $scope.params['page'] = parseInt(Math.max(1, ($scope.params['page'] - 1)));
        $scope.url = getUrl($scope.params);
        refresh();
    };

});
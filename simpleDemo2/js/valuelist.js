 /**
 * Created by Ryan Pelletier on 6/23/2016.
 */
angular.module('valueList',[]).provider("valueListService",function(){

    var baseUrl = null;
    this.setBaseUrl = function(url){
        baseUrl = url;
    };

    this.$get = function($http,$q) {
        var getUrl = function(params) {
            var str = [];
            str.push("?");
            for(var property in params)
                if (params.hasOwnProperty(property) && params[property] != "") {
                    str.push(encodeURIComponent(property) + "=" + encodeURIComponent(params[property]));
                }
            return baseUrl + str.join("&");
        };

        function getMyValues(params){
            var deferred = $q.defer();
            var url = getUrl(params);
            $http.get(getUrl(params)).then(function(okResponse){
                deferred.resolve({
                    values: okResponse.data.values,
                    valuesInfo: {
                        page: okResponse.data.valuesInfo.page,
                        numberPerPage: okResponse.data.valuesInfo.numberPerPage,
                        totalCount: okResponse.data.valuesInfo.totalCount,
                        totalPages: Math.ceil(okResponse.data.valuesInfo.totalCount/okResponse.data.valuesInfo.numberPerPage)
                    },
                    response: okResponse
                });
            }).catch(function(errorResponse){//might want to consider adding more stuff here
                deferred.reject({
                    errorData : errorResponse.data,
                    response: errorResponse
                });
            });
            return deferred.promise;
        }
        return {
            getValues: getMyValues
        };
    }
}).controller('ValueListServiceController',function($scope, $http, valueListService, defaultParams) {

    $scope.queryParams = {
        page:defaultParams.page,
        numberPerPage:defaultParams.numberPerPage,
        valueListQuery: defaultParams.valueListQuery
    };

    $scope.getValues = function(){
        valueListService.getValues($scope.queryParams).then(function(responseData){
            $scope.results = responseData;
        },function(errorResponseData){
            $scope.results = errorResponseData;
        });
    };

    $scope.nextPage = function(){
        $scope.queryParams.page = parseInt($scope.queryParams.page) + 1;
        $scope.getValues($scope.queryParams);
    };

    $scope.backPage = function(){
        $scope.queryParams.page = parseInt($scope.queryParams.page) - 1;
        $scope.getValues($scope.queryParams);
    };

    $scope.sort = function sort(sortByColumn, sortByOrder){
        $scope.queryParams.sortByColumn = sortByColumn;
        $scope.queryParams.sortByOrder = sortByOrder;
        $scope.getValues($scope.queryParams);
    };
});
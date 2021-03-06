/**
 * Created by Ryan Pelletier on 6/23/2016.
 */
angular.module('ValueListServiceDemo').provider("valueListService",function(){

    var baseUrl = null;
    this.setBaseUrl = function(url){
        baseUrl = url;
    };

    this.$get = function($http) {
        var getUrl = function(params) {
            var str = [];
            str.push("&");
            for(var property in params)
                if (params.hasOwnProperty(property) && params[property] != "") {
                    str.push(encodeURIComponent(property) + "=" + encodeURIComponent(params[property]));
                }
            return baseUrl + str.join("&");
        };

        function getMyValues(params){
            var url = getUrl(params);
            return $http.get(getUrl(params)).then(function(okResponse){
                return {
                    values: okResponse.data.values,
                    valuesInfo: {
                        page: okResponse.data.valuesInfo.page,
                        numberPerPage: okResponse.data.valuesInfo.numberPerPage,
                        totalCount: okResponse.data.valuesInfo.totalCount,
                        totalPages: Math.ceil(okResponse.data.valuesInfo.totalCount/okResponse.data.valuesInfo.numberPerPage)
                    }
                };
            }).catch(function(errorResponse){//might want to consider adding more stuff here
                return {errorData : errorResponse.data};
            })
        }
        return {
            getValues: getMyValues
        };
    }
});
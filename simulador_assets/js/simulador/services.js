angular.module("services", []).factory("service", ["$http", "$q", function ($http, $q) {
    return {
        getSimulatorParams: function (params, success, error) {

            /*return $http({method: 'JSONP', url: API_URL + 'getSimulatorParams/?callback=JSON_CALLBACK', params: checkParams(params)}).then(function successCallback(response) {

             success(response.data);

             }, function errorCallback(response) {

             error(response);

             });*/

            $http.jsonp(API_URL + 'getSimulatorParams')
                .then(function successCallback(response) {

                    success(response.data);

                }, function errorCallback(response) {

                    error(response);

                });
        },

        getExtractParams: function (params, success, error) {

            return $http({method: 'JSONP', url: API_URL + 'getExtractParams/?callback=JSON_CALLBACK', params: checkParams(params)}).then(function successCallback(response) {

                success(response.data);

            }, function errorCallback(response) {

                error(response);

            });
        },

        searchCRM: function (params, success, error) {

            return $http({method: 'JSONP', url: API_URL + 'searchCRM/?callback=JSON_CALLBACK', params: checkParams(params)}).then(function successCallback(response) {

                success(response.data);

            }, function errorCallback(response) {

                error(response);

            });
        },
    };
}]);

function checkParams(params) {

    return params;
}
;
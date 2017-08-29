angular.module("services", []).factory("service", ["$http", "$q", function ($http, $q) {
    return {
        getSimulatorParams: function (params, success, error) {

            /*return $http({method: 'JSONP', url: API_URL + 'getSimulatorParams/?callback=JSON_CALLBACK', params: checkParams(params)}).then(function successCallback(response) {

             success(response.data);

             }, function errorCallback(response) {

             error(response);

             });*/

            $http.jsonp(API_URL + 'getSimulatorParams?' + $.param(checkParams(params)))
                .then(function successCallback(response) {

                    success(response.data);

                }, function errorCallback(response) {

                    error(response);

                });
        },

        getExtractParams: function (params, success, error) {

            return $http({
                method: 'JSONP',
                url: API_URL + 'getExtractParams/?callback=JSON_CALLBACK',
                params: checkParams(params)
            }).then(function successCallback(response) {

                success(response.data);

            }, function errorCallback(response) {

                error(response);

            });
        },

        searchCRM: function (params, success, error) {

            params = checkParams(params);
            params['platform'] = 'mobile';

            return $http({
                method: 'JSONP',
                url: API_URL + 'searchCRMV2',
                params: params
            }).then(function successCallback(response) {

                success(response.data);

            }, function errorCallback(response) {

                error(response);

            });

            /*$http.jsonp( API_URL + 'searchCRM?' + $(params).stringify() )
             .then(function successCallback(response) {

             success(response.data);

             }, function errorCallback(response) {

             error(response);

             });*/
        },
    };
}]);

function checkParams(params) {

    //params['platform'] = 'mobile';

    return params;
}
;
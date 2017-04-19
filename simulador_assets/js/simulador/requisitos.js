var requisitos;

simulator.controller('RequisitosController', function ($scope, ngDialog, service, $sce) {

    //$('#requisitos').html(params.requisitos);

    $scope.resumen = angular_params.resumen;
    $scope.requisitos = angular_params.requisitos;
})


.filter('trusted', ['$sce', function ($sce) {
    return function(url) {
        return $sce.trustAsHtml(url);
    };
}])
var ingresos;

simulator.controller('SimuladorIngresos', function ($scope, $rootScope, ngDialog, service, $sce) {

    ingresos = $scope;

    $scope.collapse = true;

    $scope.remesas = {
        mes1: '',
        mes2: '',
        mes3: '',
        mes4: '',
        mes5: '',
        mes6: ''
    };

    $scope.iva = {
        mes1: '',
        mes2: '',
        mes3: ''
    };

    $scope.user = {
        simulator: 'ingresos',
        subscriptor: $rootScope.subscriptor,
        document_type: $scope.document_types[0],
        ingreso: '',
        porcentaje: '',
        total: '',
        califica: false,
        califica_icon: '',
        califica_text: '',
        calificable: false,
        totalAdeudamiento: '',
        tarifa_basica_mayor: ''
    };


    $scope.chart = {};
    $scope.chart.type = "PieChart";
    $scope.chart.options = {
        title: '',
        pieSliceText: 'value-and-percentage',
        legend: {
            position: 'labeled'
        },
        tooltip: {
            ignoreBounds: true,
            text: 'both'
        },
        width:'100%'
    };
    $scope.chart.data = {"cols": [
        {id: "t", label: "Topping", type: "string"},
        {id: "s", label: "Slices", type: "number"}
    ], "rows": [
        {c: [
            {v: "Endeudamiento"},
            {v: 0}
        ]},
        {c: [
            {v: "Monto a Pagar"},
            {v: 0}
        ]},
        {c: [
            {v: "Ingresos"},
            {v: 0}
        ]}
    ]};


    $scope.labels = ["C. Endeudamiento", "Monto a Pagar", "Ingresos"];
    $scope.data = [0, 0, 0];
    $scope.colors = ["#7a68ae", "#c2d544", "#39c92f"];

    $scope.plans = [];

    $scope.options = {
        legend: {
            display: true,
            position: 'bottom'
        }
    };

    $scope.plans = [];

    $scope.aditional_plans = [];

    $scope.selected_plan = '';
    $scope.selected_plans = [];

    $scope.resetParams = function() {

        $scope.extractos = [];
        $scope.firstTime = true;

        $rootScope.subscriptor = false;

        $scope.user = {
            simulator: 'ingresos',
            subscriptor: $rootScope.subscriptor,
            document_type: $rootScope.document_types[0],
            ingresos: '',
            porcentaje: 0,
            total: 0,
            califica: false,
            califica_icon: '',
            califica_text: '',
            calificable: false,
            totalAdeudamiento: '',
            tarifa_basica_mayor: ''
        };

        $rootScope.document_value2 = '';

        $scope.selected_plan = '';
        $scope.selected_plans = [];

        $rootScope.crm = {
            title: '',
            message: ''
        };

        $scope.addPlan();
    };

    $scope.show_suscribers = {};
    $scope.mostrarSuscriptor = function(group_id) {

        console.log($scope.show_suscribers);

        if ($scope.show_suscribers[group_id] == undefined) {

            $scope.show_suscribers[group_id] = false;
        }

        $scope.show_suscribers[group_id] = !$scope.show_suscribers[group_id];
    };

    $scope.searchCRMbyKey = function($event) {

        if ($event.charCode == 13) {

            $scope.searchCRM();
        }
    };

    $scope.searchIVA = function() {

        $scope.searchRemesas(0.6);
    };

    $scope.searchRemesas = function(porcentaje) {

        var dialog = ngDialog.open(
            {
                template: porcentaje != undefined ? 'modalIVA.html' : 'modalRemesas.html',
                className: 'ngdialog-theme-default',
                closeByDocument: false,
                closeByEscape: false,
                scope: $scope,

                controller: ['$scope', function ($scope) {
                    $scope.title = porcentaje != undefined ? 'IVA' : 'Remesas';
                    $scope.message = 'Calculo promedio';

                    $scope.promedio = 0;
                    $scope.total;

                    $scope.data = porcentaje != undefined ? $scope.$parent.iva : $scope.$parent.remesas;

                    $scope.resetParams = function() {
                        $scope.data = {
                            mes1: '',
                            mes2: '',
                            mes3: '',
                            mes4: '',
                            mes5: '',
                            mes6: ''
                        }
                    };

                    $scope.calculate = function(mes) {

                        if ( porcentaje != undefined ) {

                            if (mes == 1) {
                                $scope.data.mes2 = $scope.data['mes' + mes];
                                $scope.data.mes3 = $scope.data['mes' + mes];
                            } else if (mes == 2) {
                                $scope.data.mes3 = $scope.data['mes' + mes];
                            }

                            var mes1 = isNaN($scope.data.mes1) ? 0 : $scope.data.mes1;
                            var mes2 = isNaN($scope.data.mes2) ? 0 : $scope.data.mes2;
                            var mes3 = isNaN($scope.data.mes3) ? 0 : $scope.data.mes3;

                            var suma = mes1 + mes2 + mes3;

                            $scope.promedio = suma > 0 ? suma / 3 : 0;

                        } else {

                            if (mes == 1) {
                                $scope.data.mes2 = $scope.data['mes' + mes];
                                $scope.data.mes3 = $scope.data['mes' + mes];
                                $scope.data.mes4 = $scope.data['mes' + mes];
                                $scope.data.mes5 = $scope.data['mes' + mes];
                                $scope.data.mes6 = $scope.data['mes' + mes];
                            } else if (mes == 2) {
                                $scope.data.mes3 = $scope.data['mes' + mes];
                                $scope.data.mes4 = $scope.data['mes' + mes];
                                $scope.data.mes5 = $scope.data['mes' + mes];
                                $scope.data.mes6 = $scope.data['mes' + mes];
                            } else if (mes == 3) {
                                $scope.data.mes4 = $scope.data['mes' + mes];
                                $scope.data.mes5 = $scope.data['mes' + mes];
                                $scope.data.mes6 = $scope.data['mes' + mes];
                            } else if (mes == 4) {
                                $scope.data.mes5 = $scope.data['mes' + mes];
                                $scope.data.mes6 = $scope.data['mes' + mes];
                            } else if (mes == 5) {
                                $scope.data.mes6 = $scope.data['mes' + mes];
                            }

                            var mes1 = isNaN($scope.data.mes1) ? 0 : $scope.data.mes1;
                            var mes2 = isNaN($scope.data.mes2) ? 0 : $scope.data.mes2;
                            var mes3 = isNaN($scope.data.mes3) ? 0 : $scope.data.mes3;
                            var mes4 = isNaN($scope.data.mes4) ? 0 : $scope.data.mes4;
                            var mes5 = isNaN($scope.data.mes5) ? 0 : $scope.data.mes5;
                            var mes6 = isNaN($scope.data.mes6) ? 0 : $scope.data.mes6;

                            var suma = mes1 + mes2 + mes3 + mes4 + mes5 + mes6;

                            $scope.promedio = suma > 0 ? suma / 6 : 0;
                        }

                        $scope.total = $scope.promedio;

                        $scope.total = parseFloat( parseFloat($scope.total).toFixed(2) );

                        if ( porcentaje != undefined) {
                            $scope.promedio = $scope.promedio * porcentaje;
                        }

                        $scope.promedio = parseFloat( parseFloat($scope.promedio).toFixed(2) );
                    };
                    $scope.calculate();

                    $scope.confirmOption = function () {

                        $scope.calculate();

                        $scope.$parent.user.ingreso = $scope.promedio;



                        if (porcentaje != undefined) {

                            $scope.$parent.iva = $scope.data;

                        } else {

                            $scope.$parent.remesas = $scope.data;
                        }

                        updateChart();

                        $scope.closeThisDialog();
                    };

                    $scope.cancel = function () {

                        $scope.closeThisDialog();
                    };

                }]
            });
    };

    $scope.searchCRM = function () {

        $('.pre_load3').show();

        service.searchCRM({

            document_type: $rootScope.document_type.id,
            document_value: $scope.document_value2

        }, function (result) {

            $('.pre_load3').hide();

            if (result.status == 'success') {

                if ( result.data.message == '' ) {

                    ngDialog.open({
                        template: 'modalMessage.html',
                        className: 'ngdialog-theme-default',
                        controller: ['$scope', function ($scope) {
                            $scope.title = 'Aviso';
                            $scope.message = 'No se encontraron resultados.';

                            $scope.cancel = function () {

                                $scope.closeThisDialog();
                            };
                        }]
                    });

                } else {

                    $rootScope.crm = result.data;
                }
            }

        }, function () {

            $('.pre_load3').hide();
        });
    };


    var updateChart = function (b) {

        var totalAmount = 0;

        $scope.user.tarifa_basica_mayor = 0;

        for (var i in $scope.selected_plans) {

            var plan = $scope.selected_plans[i];

            var subtotal = 0;

            subtotal = plan.plan.mensual;

            for (var j in plan.aditionals) {

                if (plan.aditionals[j] != undefined && plan.aditionals[j].mensual != undefined) {

                } else {

                    continue;
                }

                subtotal = subtotal + plan.aditionals[j].mensual;
            }

            if ( ($scope.user.tarifa_basica_mayor == 0 || subtotal > $scope.user.tarifa_basica_mayor) && parseInt(plan.quantity)> 0) {
                $scope.user.tarifa_basica_mayor = subtotal;
            }

            if ( plan.quantity != undefined ) {
                subtotal = subtotal * parseInt(plan.quantity);
            } else {
                subtotal = 0;
            }

            totalAmount = totalAmount + subtotal;
        }

        if (!b) {
            //$scope.$apply();
        } else {
            //$scope.$apply();
        }

        $scope.user.total = totalAmount;

        $scope.calculateAdeudamiento();

        var totalAdeudamiento = 0;

        if ($scope.user.porcentaje > 0 && $scope.user.ingreso > 0) {

            totalAdeudamiento = $scope.user.ingreso * ($scope.user.porcentaje / 100);
        }

        $scope.data = [totalAdeudamiento, totalAmount, $scope.user.ingreso];


        $scope.chart.data = {"cols": [
            {id: "t", label: "Topping", type: "string"},
            {id: "s", label: "Slices", type: "number"}
        ], "rows": [
            {c: [
                {v: "Endeudamiento (" + totalAdeudamiento + ")"},
                {v: totalAdeudamiento}
            ]},
            /*{c: [
                {v: "Monto a Pagar (" + totalAmount + ")"},
                {v: totalAmount}
            ]},*/
            {c: [
                {v: "Ingresos (" + ($scope.user.ingreso - totalAdeudamiento) + ")"},
                {v: ($scope.user.ingreso - totalAdeudamiento)}
            ]}
        ]};


        if (totalAdeudamiento >= totalAmount) {

            $scope.colors = ["#7a68ae", "#c2d544", "#39c92f"];

        } else { // no califica

            $scope.colors = ["#ff0000", "#c2d544", "#39c92f"];
        }

        if (totalAmount > 0 && totalAdeudamiento > 0 && $scope.user.tarifa_basica_mayor) {

            $scope.user.calificable = true;

            if (totalAdeudamiento >= totalAmount) {

                $scope.user.califica = true;
                $scope.user.califica_icon = 'ok';
                $scope.user.califica_text = 'Si Califica';

            } else { // no califica

                $scope.user.califica = false;
                $scope.user.califica_icon = 'delete';
                $scope.user.califica_text = 'No Califica';
            }

        } else {

            $scope.user.calificable = false;

            $scope.user.califica_icon = '';
            $scope.user.califica_text = '';
        }

        $scope.user.totalAdeudamiento = parseFloat(parseFloat(totalAdeudamiento).toFixed(2));
    };

    $scope.toggleCollapse = function () {

        $scope.collapse = !$scope.collapse;
    };

    $scope.calculateAdeudamiento = function () {

        if ($scope.user.tarifa_basica_mayor == 0) {

            $scope.user.porcentaje = 0;

        } else if ($scope.user.tarifa_basica_mayor <= 140) {

            $scope.user.porcentaje = 8;

        } else if ($scope.user.tarifa_basica_mayor > 140 && $scope.user.tarifa_basica_mayor <= 259) {

            $scope.user.porcentaje = 9;

        } else if ($scope.user.tarifa_basica_mayor > 259 && $scope.user.tarifa_basica_mayor <= 399) {

            $scope.user.porcentaje = 10;

        } else {

            $scope.user.porcentaje = 13;
        }
    };

    $scope.updateChart = function () {

        updateChart(true);
    };

    $scope.selectPlan = function (item) {

        $scope.selected_plan = item;
    };

    $scope.reviewQuantity = function (plan) {

        if (plan.quantity != undefined || plan.quantity >= 1) {

        } else {

            //plan.quantity = 1;
        }

        $scope.updateChart();
    };

    $scope.addPlan = function (item) {

        if ( item == undefined ) {

            item = $scope.plans[0];
        }

        if (item.tipo == '') {

            ngDialog.open({
                template: 'modalMessage.html',
                className: 'ngdialog-theme-default',
                controller: ['$scope', function ($scope) {
                    $scope.title = 'Aviso';
                    $scope.message = 'Debe elegir un plan antes.';

                    $scope.cancel = function () {

                        $scope.closeThisDialog();
                    };
                }]
            });

        } else {

            $scope.selected_plans.push({
                plan: item,
                quantity: 1,
                aditionals: {}
            });

            $scope.selected_plan = $scope.plans[$scope.plans.length - 1];

            $scope.updateChart();
        }
    };

    $scope.changePlan = function (index, item) {

        item.plan = $scope.plans[index];

        $scope.updateChart();
    };

    $scope.changeAddOn = function (plan, aditional, row) {

        if (row.nombre == 'Ninguno') {

            plan.aditionals[aditional.plan] = null;

        } else {

            plan.aditionals[aditional.plan] = row;
            plan.aditionals[aditional.plan]['columns'] = aditional.columns;
        }

        $scope.updateChart();
    };

    $scope.totalRow = function (plan) {

        var totalAmount = plan.plan.mensual;

        for (var j in plan.aditionals) {

            if (plan.aditionals[j] != undefined && plan.aditionals[j].mensual != undefined) {

            } else {

                continue;
            }

            totalAmount = totalAmount + plan.aditionals[j].mensual;
        }

        if ( plan.quantity != undefined ) {
            totalAmount = totalAmount * parseInt(plan.quantity);
        } else {
            totalAmount = 0;
        }

        return totalAmount;
    };

    $scope.totalMB = function (plan) {

        var totalAmount = 0;
        var esIlimitado = false;

        totalAmount = isNaN(parseInt(plan.plan.mb)) ? 0 : parseInt(plan.plan.mb);

        for (var j in plan.aditionals) {

            if (plan.aditionals[j] != undefined && plan.aditionals[j].mb != undefined) {

                if ( isNaN(parseInt(plan.aditionals[j].mb)) ) {

                    esIlimitado = true;

                } else {

                    totalAmount += parseInt(plan.aditionals[j].mb);
                }

            } else {

                continue;
            }
        }

        if ( plan.quantity != undefined ) {
            totalAmount = totalAmount * parseInt(plan.quantity);
        } else {
            totalAmount = 0;
        }

        if ( esIlimitado ) {
            totalAmount = totalAmount + ' MBs + ilimitado nocturno de 1 a 7:59 todos los dias del mes';
        } else {
            totalAmount = totalAmount + ' MBs';
        }

        return totalAmount;
    };

    $scope.totalMinutos = function(plan) {

        var totalAmount = 0;

        for (var j in plan.aditionals) {

            if (plan.aditionals[j] != undefined && plan.aditionals[j]['minutos-bs'] != undefined) {

                totalAmount += parseInt(plan.aditionals[j]['minutos-bs']);

            } else {

                continue;
            }
        }

        if ( plan.quantity != undefined ) {
            totalAmount = totalAmount * parseInt(plan.quantity);
        } else {
            totalAmount = 0;
        }

        return totalAmount;
    };

    $scope.totalCredito = function(plan) {

        var totalAmount = 0;

        totalAmount = isNaN(parseInt(plan.plan.credito)) ? 0 : parseInt(plan.plan.credito);

        for (var j in plan.aditionals) {

            if (plan.aditionals[j] != undefined && plan.aditionals[j].crdito != undefined) {

                totalAmount += parseInt(plan.aditionals[j].crdito);

            } else {

                continue;
            }
        }

        if ( plan.quantity != undefined ) {
            totalAmount = totalAmount * parseInt(plan.quantity);
        } else {
            totalAmount = 0;
        }

        return totalAmount;
    };

    $scope.removePlan = function (index) {

        var dialog = ngDialog.open(
            {
                template: 'modalConfirm.html',
                className: 'ngdialog-theme-default',
                closeByDocument: false,
                closeByEscape: false,
                scope: $scope,

                controller: ['$scope', function ($scope) {
                    $scope.title = 'Confirmación';
                    $scope.message = 'Esta seguro que desea eliminar esta fila ?';

                    $scope.confirmOption = function () {

                        $scope.$parent.selected_plans.splice(index, 1);

                        $scope.$parent.updateChart();

                        $scope.closeThisDialog();
                    };

                    $scope.cancel = function () {

                        $scope.closeThisDialog();
                    };

                }]
            });
    };

    $scope.setSubscriptor = function (b) {

        $scope.user.subscriptor = $rootScope.subscriptor = b;
    };

    $scope.changeDocument = function (item) {

        $('.document_type').focus();

        $rootScope.document_type = item;
    };

    if (angular_params.status == 'success') {

        $scope.plan_columns = angular_params.plan_columns;
        $scope.plans = angular_params.plans;
        $scope.aditional_plans = angular_params.addons;

        $scope.addPlan($scope.plans[0]);

        try {

            $scope.selected_plan = $scope.plans[$scope.plans.length - 1];

        } catch (error) {
        }
    }
});
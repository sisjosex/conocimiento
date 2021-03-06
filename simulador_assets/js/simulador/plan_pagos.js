var plan_pagos;

simulator.controller('SimuladorPlanPagos', function ($scope, $rootScope, ngDialog, service, $sce) {

    plan_pagos = $scope;

    $scope.collapse = true;

    $scope.promedio = {
        mes1: '',
        mes2: '',
        mes3: ''
    };

    $scope.user = {
        simulator: 'ingresos',
        subscriptor: $rootScope.subscriptor,
        document_type: $rootScope.document_types[0],
        ingreso: '',
        porcentaje: '',
        total: '',
        califica: false,
        califica_icon: '',
        califica_text: '',
        calificable: false,
        totalAdeudamiento: '',
        tarifa_basica_mayor: '',
        descuento: 0,
        conyugue: false
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
        }
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

        $scope.user = {
            simulator: 'ingresos',
            subscriptor: $rootScope.subscriptor,
            document_type: $rootScope.document_types[0],
            ingreso: '',
            porcentaje: 0,
            total: 0,
            califica: false,
            califica_icon: '',
            califica_text: '',
            calificable: false,
            totalAdeudamiento: '',
            tarifa_basica_mayor: '',
            descuento: 0,
            conyugue: false
        };

        $rootScope.document_value = '';

        $scope.selected_plan = '';
        $scope.selected_plans = [];

        $rootScope.crm = {
            title: '',
            message: ''
        };

        $scope.addPlan();
    };

    $scope.searchCRMbyKey = function($event) {

        if ($event.charCode == 13) {

            $scope.searchCRM();
        }
    };

    $scope.show_suscribers = {};
    $scope.mostrarSuscriptor = function(group_id) {

        console.log($scope.show_suscribers);

        if ($scope.show_suscribers[group_id] == undefined) {

            $scope.show_suscribers[group_id] = false;
        }

        $scope.show_suscribers[group_id] = !$scope.show_suscribers[group_id];
    };

    $scope.searchPlanDePagos = function() {

        var dialog = ngDialog.open(
            {
                template: 'modalPlanDePagos.html',
                className: 'ngdialog-theme-default',
                closeByDocument: false,
                closeByEscape: false,
                scope: $scope,

                controller: ['$scope', function ($scope) {
                    $scope.title = 'Promedio';
                    $scope.message = 'Calculo promedio';

                    $scope.promedio = 0;

                    $scope.data = $scope.$parent.promedio;

                    $scope.calculate = function(mes) {

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

                        var suma = mes1 + mes2 + mes3;

                        $scope.promedio = suma > 0 ? suma / 3 : 0;

                        $scope.promedio = parseFloat( parseFloat($scope.promedio).toFixed(2) );

                        $scope.$parent.user.ingreso = $scope.promedio;

                        $scope.$parent.promedio = $scope.data;
                    };

                    $scope.calculate();

                    $scope.confirmOption = function () {

                        $scope.calculate();

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

            if ( ($scope.user.tarifa_basica_mayor == 0 || subtotal > $scope.user.tarifa_basica_mayor) && parseInt(plan.quantity)> 0 ) {
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

        var ingreso = 0;

        if ($scope.user.conyugue) {

            ingreso = $scope.user.ingreso * 0.5;
            $scope.user.descuento = '50';

        } else {

            ingreso = $scope.user.ingreso;
            $scope.user.descuento = '0';
        }

        $scope.calculateAdeudamiento();

        var totalAdeudamiento = 0;

        if ($scope.user.porcentaje > 0 && ingreso > 0) {

            totalAdeudamiento = ingreso * ($scope.user.porcentaje / 100);
        }

        $scope.data = [totalAdeudamiento, totalAmount, ingreso];


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
                {v: "Ingresos (" + (ingreso - totalAdeudamiento) + ")"},
                {v: (ingreso - totalAdeudamiento)}
            ]}
        ]};


        $scope.user.totalAdeudamiento = parseFloat(parseFloat(totalAdeudamiento).toFixed(2));


        if (totalAdeudamiento >= totalAmount) {

            $scope.colors = ["#7a68ae", "#c2d544", "#39c92f"];

        } else { // no califica

            $scope.colors = ["#ff0000", "#c2d544", "#39c92f"];
        }

        if (totalAmount > 0 && totalAdeudamiento > 0) {

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
    };

    $scope.toggleCollapse = function () {

        $scope.collapse = !$scope.collapse;
    };

    $scope.calculateAdeudamiento = function () {

        var ingreso = 0;

        if ($scope.user.conyugue) {

            ingreso = $scope.user.ingreso * 0.5;

        } else {

            ingreso = $scope.user.ingreso;
        }

        if ($scope.user.total == 0) {

            $scope.user.porcentaje = 0;

        } else if (ingreso <= 1000) {

            $scope.user.porcentaje = 10;

        } else if (ingreso > 1000 && ingreso <= 3000) {

            $scope.user.porcentaje = 15;

        } else {

            $scope.user.porcentaje = 20;
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

        console.log(row);

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
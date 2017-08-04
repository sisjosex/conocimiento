var ingresos;

simulator.controller('SimuladorIngresos', function ($scope, ngDialog, service, $sce) {

    ingresos = $scope;

    $scope.collapse = true;

    $scope.document_types = [
        //{id: '', name: 'Tipo de Documento'},
        {id: 'ci', name: 'Carnet de Identidad'},
        {id: 'nit', name: 'NIT'},
        {id: 'telefono', name: 'Teléfono'}
    ];

    $scope.user = {
        simulator: 'ingresos',
        subscriptor: false,
        document_type: $scope.document_types[0],
        document_value: '',
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


    $scope.crm = {
        title: '',
        message: ''
    };


    $scope.show_suscribers = {};
    $scope.mostrarSuscriptor = function(group_id) {

        console.log($scope.show_suscribers);

        if ($scope.show_suscribers[group_id] == undefined) {

            $scope.show_suscribers[group_id] = false;
        }

        $scope.show_suscribers[group_id] = !$scope.show_suscribers[group_id];
    };

    $scope.searchCRM = function () {

        $('.pre_load3').show();

        service.searchCRM({

            document_type: $scope.user.document_type.id,
            document_value: $scope.user.document_value

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

                    $scope.crm = result.data;
                }
            }

        }, function () {

            $('.pre_load3').hide();
        });
    };


    var updateChart = function (b) {

        var totalAmount = 0;

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

            if ($scope.user.tarifa_basica_mayor == 0 || subtotal > $scope.user.tarifa_basica_mayor) {
                $scope.user.tarifa_basica_mayor = subtotal;
            }

            subtotal = subtotal * parseInt(plan.quantity);

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
                {v: "Ingresos (" + ($scope.user.ingreso) + ")"},
                {v: ($scope.user.ingreso - totalAdeudamiento)}
            ]}
        ]};


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

        $scope.user.totalAdeudamiento = totalAdeudamiento;
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

            plan.quantity = 1;
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

        totalAmount = totalAmount * parseInt(plan.quantity);

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

        $scope.user.subscriptor = b;
    };

    $scope.changeDocument = function (item) {

        $('.document_type').focus();

        $scope.user.document_type = item;
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
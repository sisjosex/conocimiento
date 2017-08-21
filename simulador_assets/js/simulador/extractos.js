var extractos;

simulator.controller('SimuladorExtractos', function ($scope, ngDialog, service, $sce) {

    extractos = $scope;

    $scope.collapse = true;

    $scope.document_types = [
        //{id: '', name: 'Tipo de Documento'},
        {id: 'ci', name: 'Carnet de Identidad'},
        {id: 'nit', name: 'NIT'},
        {id: 'telefono', name: 'Línea'}
    ];

    var extractos_data = [];
    var extractos_ingresos_data = [];

    $scope.firstTime = true;

    $scope.order_types = [
        {
            id: 'desc',
            name: 'Descendente'
        },
        {
            id: 'asc',
            name: 'Ascendente'
        }
    ];

    $scope.selected_order = 'desc';

    $scope.date_type = [
        {
            id: '2_months',
            name: '2 Ultimos meses'
        },
        {
            id: '60_days',
            name: '60 Ultimos dias'
        }
    ];

    $scope.selected_date_type = '2_months';

    $scope.currency = [
        {
            id: 'bs',
            name: 'Bs'
        },
        {
            id: 'sus',
            name: '$us'
        }
    ];

    $scope.selected_currency = $scope.currency[0];

    $scope.cities = [
        {id: 1, name: 'Eje Troncal'},
        {id: 2, name: 'Fuera del Eje'}
    ];


    

    $scope.user = {
        simulator: 'ingresos',
        subscriptor: false,
        document_type: $scope.document_types[0],
        document_value: '',
        ingreso: '',
        porcentaje: '',
        total: 0,
        califica: false,
        califica_icon: '',
        califica_text: '',
        calificable: false,
        total_quantity: '',
        tarifa_basica_mayor: '',
        saldo_promedio_extracto: '',
        ciudad: $scope.cities[0],
        autocalcular_tarifa_basica_mayor: true,
        tipo_cambio: 6.96,
        totalAdeudamiento: '',
        tarifaViva: '',
        diferencia: ''
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


    //$scope.fechaInicio = moment().subtract(62, "days").format();
    $scope.fechaInicio = moment().format();

    // date = new Date(date2.getFullYear(), date2.getMonth() + 1, date2.getDate()+i);
    //
    // $scope.fechaInicio = date.getDate() + ' / ' + (date.getMonth()) + ' / ' + date.getFullYear();

    $scope.extractos = [];


    $scope.crm = {
        message: ''
    };


    $scope.show_suscribers = {};
    $scope.mostrarSuscriptor = function (group_id) {

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

                if (result.data.message == '') {

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


    $scope.showExtractos = function (index) {

        var dialog = ngDialog.open(
            {
                template: 'modalExtractos.html',
                className: 'ngdialog-theme-default',
                closeByDocument: false,
                closeByEscape: false,
                scope: $scope,

                controller: ['$scope', function ($scope) {
                    $scope.title = 'Extractos';
                    $scope.message = 'Calculo de extracto bancario';

                    $scope.fechaInicio = $scope.$parent.fechaInicio;

                    $scope.extractos = $scope.$parent.extractos;

                    $scope.date_type = $scope.$parent.date_type;

                    $scope.selected_date_type = $scope.$parent.selected_date_type;

                    $scope.currency = $scope.$parent.currency;

                    $scope.selected_currency = $scope.$parent.selected_currency;

                    $scope.order_types = $scope.$parent.order_types;

                    $scope.selected_order = $scope.$parent.selected_order;

                    $scope.changeOrder = function() {

                        $scope.changeFechaInicio($scope.fechaInicio);
                    };

                    $scope.changeFechaInicio = function (date_test) {

                        console.log(date_test);

                        $scope.extractos = [];


                        if ($scope.selected_date_type == '60_days') {

                            if ( $scope.selected_order == 'asc' ) {

                                for (var i = 60; i >= 0; i--) {

                                    if (date_test == undefined) {

                                        date2 = moment().toDate();

                                        date = moment(date2).subtract(Math.abs(i), 'days').toDate();

                                    } else {

                                        date_test = moment(date_test, "DD/MM/YYYY").toDate();
                                        date = moment(date_test).subtract(Math.abs(i), 'days').toDate();
                                    }

                                    var dt = moment(date).format("dddd");

                                    $scope.extractos.push({
                                        day: dt + " - " + date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear(),
                                        date: date,
                                        value: ''
                                    });
                                }

                            } else {

                                for (var i = 0; i >= -60; i--) {

                                    if (date_test == undefined) {

                                        date2 = moment().toDate();

                                        //date = new Date(date2.getFullYear(), date2.getMonth() + 1, date2.getDate() + i);

                                        date = moment(date2).subtract(Math.abs(i), 'days').toDate();

                                    } else {

                                        date_test = moment(date_test, "DD/MM/YYYY").toDate();

                                        //date = new Date(date_test.getFullYear(), date_test.getMonth() + 1, date_test.getDate() + i - 1);
                                        date = moment(date_test).subtract(Math.abs(i), 'days').toDate();
                                    }

                                    var dt = moment(date).format("dddd");

                                    $scope.extractos.push({
                                        day: dt + " - " + date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear(),
                                        date: date,
                                        value: ''
                                    });
                                }
                            }


                        } else if ($scope.selected_date_type == '2_months') {

                            if ( $scope.selected_order == 'asc' )
                            {

                                date_test = moment(month_end, "DD/MM/YYYY").toDate();

                                for (var i = 60; i >= 0; i--) {

                                    if (date_test == undefined) {

                                        date2 = moment($scope.fechaInicio, "DD/MM/YYYY").toDate();

                                        //date = new Date(date2.getFullYear(), date2.getMonth() + 1, date2.getDate() + i);

                                        date = moment(date2).subtract(Math.abs(i), 'days').toDate();

                                    } else {

                                        //date = new Date(date_test.getFullYear(), date_test.getMonth() + 1, date_test.getDate() + i - 1);
                                        date = moment(date_test).subtract(Math.abs(i), 'days').toDate();
                                    }

                                    var dt = moment(date).format("dddd");


                                    $scope.extractos.push({
                                        day: dt + " - " + date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear(),
                                        date: date,
                                        value: ''
                                    });
                                }

                            } else {

                                date_test = moment(month_end, "DD/MM/YYYY").toDate();

                                for (var i = 0; i >= -60; i--) {

                                    if (date_test == undefined) {

                                        date2 = moment($scope.fechaInicio, "DD/MM/YYYY").toDate();

                                        //date = new Date(date2.getFullYear(), date2.getMonth() + 1, date2.getDate() + i);

                                        date = moment(date2).subtract(Math.abs(i), 'days').toDate();

                                    } else {

                                        //date = new Date(date_test.getFullYear(), date_test.getMonth() + 1, date_test.getDate() + i - 1);
                                        date = moment(date_test).subtract(Math.abs(i), 'days').toDate();
                                    }

                                    var dt = moment(date).format("dddd");


                                    $scope.extractos.push({
                                        day: dt + " - " + date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear(),
                                        date: date,
                                        value: ''
                                    });
                                }
                            }
                        }

                        console.log($scope.selected_date_type + " - " + date_test);
                    };

                    setTimeout(function () {

                        var date = new Date($scope.fechaInicio);

                        if ($scope.extractos.length == 0) {
                            $scope.changeFechaInicio(date);
                            $scope.$digest();
                        } else {
                            $scope.$digest();
                        }

                    }, 500);


                    $scope.fillDate = function (index) {

                        if ($scope.extractos.length == 0) {

                            var i = 62;

                            for (var i = 0; i <= 61; i++) {

                                if ($scope.$parent.firstTime) {

                                    date2 = new Date($scope.fechaInicio);

                                } else {

                                    //date2 = new Date($scope.fechaInicio, "DD/MM/YYYY");
                                    date2 = new Date($scope.fechaInicio);
                                }
                                //date = new Date(date2.getFullYear(), date2.getMonth() + 1, date2.getDate()+i);

                                date = moment(date2).subtract(Math.abs(i), 'days').toDate();

                                var dt = moment(date).format("dddd");

                                $scope.extractos.push({
                                    day: dt + " - " + date.getDate() + ' / ' + date.getMonth() + ' / ' + date.getFullYear(),
                                    date: date,
                                    value: ''
                                });
                            }
                        }

                        $scope.$parent.firstTime = false;

                        if (index == undefined) {


                        } else { // modificar fechas


                        }
                    };

                    $scope.fillDate();

                    $scope.fillDates = function (index) {

                        var selectedValue = $scope.extractos[index].value;

                        for (var i = index; i < $scope.extractos.length; i++) {
                            $scope.extractos[i].value = selectedValue;
                        }
                    };

                    $scope.confirmOption = function () {

                        var promedio = 0;
                        for (var i = 0; i < $scope.extractos.length; i++) {
                            if (isNaN($scope.extractos[i].value)) {
                                $scope.extractos[i].value = 0;
                            }

                            promedio += isNaN(parseFloat($scope.extractos[i].value)) ? 0 : parseFloat($scope.extractos[i].value);
                        }

                        promedio = promedio / $scope.extractos.length;


                        if ($scope.selected_currency.id == 'bs') {

                            $scope.$parent.user.saldo_promedio_extracto = parseFloat((promedio / $scope.$parent.user.tipo_cambio).toFixed(2));
                            $scope.$parent.selected_currency = $scope.currency[0];

                        } else {

                            $scope.$parent.user.saldo_promedio_extracto = parseFloat((promedio).toFixed(2));
                            $scope.$parent.selected_currency = $scope.currency[1];
                        }

                        console.log($scope.fechaInicio);

                        $scope.$parent.extractos = $scope.extractos;
                        $scope.$parent.fechaInicio = $scope.fechaInicio;
                        $scope.$parent.selected_date_type = $scope.selected_date_type;
                        $scope.$parent.selected_currency = $scope.selected_currency;

                        $scope.$parent.selected_order = $scope.selected_order;

                        var dateSplit = [];

                        try {

                            dateSplit = $scope.fechaInicio.split('/');

                        } catch (error) {

                            dateSplit = [];
                        }


                        if (dateSplit.length == 3) {

                            $scope.$parent.fechaInicio = dateSplit[1] + '/' + dateSplit[0] + '/' + dateSplit[2];

                        } else {
                            dateSplit = new Date($scope.fechaInicio);
                            //$scope.$parent.fechaInicio = dateSplit.getDate() + '/' + (dateSplit.getMonth() + 1) + '/' + dateSplit.getFullYear();
                            $scope.$parent.fechaInicio = dateSplit;
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


    var updateChart = function (b) {

        var totalAmount = 0;
        $scope.user.total_quantity = 0;


        if ($scope.user.autocalcular_tarifa_basica_mayor) {

            $scope.user.tarifa_basica_mayor = 0;
        }

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

            if ($scope.user.autocalcular_tarifa_basica_mayor) {

                if (($scope.user.tarifa_basica_mayor == 0 || subtotal > $scope.user.tarifa_basica_mayor) && parseInt(plan.quantity) > 0) {
                    $scope.user.tarifa_basica_mayor = subtotal;
                }
            }

            if (plan.quantity != undefined) {

                subtotal = subtotal * parseInt(plan.quantity);
                $scope.user.total_quantity += plan.quantity;

            } else {

                subtotal = 0;
            }

            totalAmount = totalAmount + subtotal;
        }

        $scope.user.total = totalAmount;

        $scope.calculateAdeudamiento();

        var totalAdeudamiento = 0;
        var saldo_promedio_extracto = $scope.user.saldo_promedio_extracto;
        var tarifaViva = 0;
        var diferencia = 0;

        if ($scope.user.porcentaje > 0 && $scope.user.saldo_promedio_extracto > 0 && $scope.user.total_quantity > 0) {

            var dollars = $scope.findDollarsForBs($scope.user.tarifa_basica_mayor);

            tarifaViva = (dollars + dollars * 0.15 * ($scope.user.total_quantity - 1)) * $scope.user.porcentaje;
        }

        tarifaViva = parseFloat(parseFloat(tarifaViva).toFixed(1));

        $scope.data = [$scope.user.saldo_promedio_extracto, totalAmount, $scope.user.ingreso];

        $scope.user.totalAdeudamiento = $scope.user.saldo_promedio_extracto * $scope.user.tipo_cambio;

        $scope.chart.data = {"cols": [
            {id: "t", label: "Topping", type: "string"},
            {id: "s", label: "Slices", type: "number"}
        ], "rows": [
            {c: [
                {v: "Endeudamiento (" + $scope.user.totalAdeudamiento + ")"},
                {v: $scope.user.totalAdeudamiento * $scope.user.porcentaje  / 100}
            ]},
            /*{c: [
                {v: "Monto a Pagar (" + totalAmount + ")"},
                {v: totalAmount}
            ]},*/
            {c: [
                {v: "Ingresos (" + $scope.user.totalAdeudamiento + ")"},
                {v: ($scope.user.totalAdeudamiento)}
            ]}
        ]};


        diferencia = saldo_promedio_extracto - tarifaViva;
        diferencia = parseFloat(parseFloat(diferencia).toFixed(1));

        if (diferencia >= 0) {

            $scope.colors = ["#7a68ae", "#c2d544", "#39c92f"];

        } else { // no califica

            $scope.colors = ["#ff0000", "#c2d544", "#39c92f"];
        }

        console.log("SPE: " + saldo_promedio_extracto + " ,tarifaViva: " + tarifaViva + " , Diferencia: " + diferencia);

        if (totalAmount > 0 && tarifaViva > 0) {

            $scope.user.tarifaViva = tarifaViva;
            $scope.user.diferencia = diferencia;

            $scope.user.calificable = true;

            if (diferencia >= 0) {

                $scope.user.califica = true;
                $scope.user.califica_icon = 'ok';
                $scope.user.califica_text = 'Si Califica';

            } else { // no califica

                $scope.user.califica = false;
                $scope.user.califica_icon = 'delete';
                $scope.user.califica_text = 'No Califica';
            }

        } else {

            $scope.user.tarifaViva = '';
            $scope.user.diferencia = '';

            $scope.user.calificable = false;

            $scope.user.califica_icon = '';
            $scope.user.califica_text = '';
        }
    };

    $scope.findDollarsForBs = function (bs) {

        console.log(extractos_data);

        var dollars = 0;

        for (var i in extractos_data) {

            if (bs <= extractos_data[i].bs) {

                return extractos_data[i].dolares;
            }
        }

        return dollars;
    };

    $scope.toggleCollapse = function () {

        $scope.collapse = !$scope.collapse;
    };

    $scope.calculateAdeudamiento = function () {

        if ($scope.user.total == 0) {

            $scope.user.porcentaje = 0;

        } else if ($scope.user.ciudad.id == 1) {

            $scope.user.porcentaje = 1;

        } else if ($scope.user.ciudad.id == 2) {

            $scope.user.porcentaje = 0.85;

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

        if (plan.quantity != undefined) {
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

        $scope.user.subscriptor = b;
    };

    $scope.changeDocument = function (item) {

        $('.document_type').focus();

        $scope.user.document_type = item;
    };

    $scope.changeCiudad = function (city) {

        $scope.user.ciudad = city;

        updateChart();
    }



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


    if (angular_params.status == 'success') {

        $scope.plan_columns = angular_params.plan_columns;
        $scope.plans = angular_params.plans;
        $scope.aditional_plans = angular_params.addons;
        extractos_data = angular_params.extractos;
        extractos_ingresos_data = angular_params.extractos_ingresos;

        $scope.addPlan($scope.plans[0]);

        try {

            $scope.selected_plan = $scope.plans[$scope.plans.length - 1];

        } catch (error) {
        }
    }
});
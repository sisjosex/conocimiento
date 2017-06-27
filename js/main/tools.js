/**
 * Created by Froilan on 20/07/2015.
 */

/*--------------------------------------------------------------------------------------------------------------------*/

/**
 * Tools: Odeco
 */

App.View('ToolsOdeco', {
    options: {
        route: blocks.route('/tools/odeco'),
        url: 'views/tools/odeco.html'
    },
    init: function () {
    },
    routed: function (params) {
        if (is_login_view()) {
            var that = this;
            App.Header.set_title("Calculador de Odeco");
            App.Header.set_show_back(true);
            if (!this.data()) {
                preload();
                api(get_params('tools', {type: 'odeco'}), function (res) {
                    that.data(res)
                    that.holidays(res.holidays);
                    that.date(moment().format('DD[/]MM[/]YYYY'));
                    var exclude_dates = res.holidays.map(function (a) {
                        return moment(a.fecha).format('DD[/]MM[/]YYYY')
                    });

                    function reset_date(date) {
                        var count_total = res.day_period + res.day_period_max;
                        var count = 1;
                        var curDate = date;
                        var min_date, max_date;
                        var excludes = res.holidays.map(function (a) {
                            return a.fecha
                        });
                        while (count <= count_total) {
                            curDate = curDate.addDays(1);
                            if (res.day_period == count) min_date = curDate;
                            max_date = curDate;
                            var dayOfWeek = curDate.getDay();
                            var isWeekend = (dayOfWeek == 6) || (dayOfWeek == 0);
                            var date_cur = moment(curDate).format('YYYY-MM-DD');
                            if (!isWeekend && $.inArray(date_cur, excludes) == -1) count++;

                        }
                        that.date(moment(date).format('DD[/]MM[/]YYYY'))
                        that.text_day(moment(date).format('dddd'))
                        that.text_res(moment(min_date).format('dddd [<span>]DD[</span>] [de] [<span>]MMMM[</span>] [de] [<span>]YYYY[</span>]'))
                        that.text_max(moment(max_date).format('dddd [<span>]DD[</span>] [de] [<span>]MMMM[</span>] [de] [<span>]YYYY[</span>]'))
                    }

                    reset_date(new Date());
                    $('#tools-odeco-datepicker').datepicker(
                        {
                            language: 'es',
                            autoclose: true,
                            //daysOfWeekDisabled: '0,6',
                            format: 'dd/mm/yyyy',
                            datesDisabled: [] //exclude_dates
                        })
                        .on('changeDate', function (e) {
                            reset_date(e.date)
                        });
                    preload(1);
                }, true);
            }
        }
    },
    holidays: blocks.observable([]),
    data: blocks.observable(),
    date: blocks.observable(''),
    text_day: blocks.observable(''),
    text_res: blocks.observable(''),
    text_max: blocks.observable(''),
    breadcrumb: blocks.observable([{title: 'Inicio', url: '#home'}, {
        title: 'Herramientas',
        url: '#home'
    }, {title: 'Calculadora Odeco', url: ''}]),
});

/*--------------------------------------------------------------------------------------------------------------------*/

/**
 * Tools: Manual de Reclamos
 */

App.View('ToolsManual', {
    dom: $('#view_tools_manual'),
    options: {
        route: blocks.route('/tools/manual'),
        url: 'views/tools/manual.html'
    },
    init: function () {
    },
    routed: function (params) {
        if (is_login_view()) {
            var that = this;
            App.Header.set_title("Manual de Reclamos");
            App.Header.set_show_back(true);
            if (!this.data()) {
                preload();
                api(get_params('tools', {type: 'manual'}), function (res) {
                    that.data({exist: true});
                    that.sliders(res.sliders);
                    that.motives(res.motives);
                    that.motives_select([{id: 'all', title: '-- Todos los Motivos --'}].concat(res.motives));
                    that.areas([{id: 'all', title: '-- Todas las Areas --'}].concat(res.areas));
                    that.type_registers([{id: 'all', title: '-- Todos los Registros --'}].concat(res.type_registers));
                    that.add_full_scrren();
                    preload(1);
                    resize_app();
                    function initialize_owl(el) {
                        el.slick({
                            adaptiveHeight: true,
                            autoplay: true,
                            dots: true,
                            arrows: false,
                            autoplaySpeed: 8000
                        });
                    }

                    function destroy_owl(el) {
                        el.slick('unslick');
                    }

                    var car1 = $('#item-tab-b_top1 .owl-carousel:first');
                    var car2 = $('#item-tab-b_top2 .owl-carousel:first');
                    initialize_owl(car1);
                    that.dom.find('a[href="#item-tab-b_top1"]').on('shown.bs.tab', function () {
                        initialize_owl(car1);
                    }).on('hide.bs.tab', function () {
                        destroy_owl(car1);
                    });
                    that.dom.find('a[href="#item-tab-b_top2"]').on('shown.bs.tab', function () {
                        initialize_owl(car2);
                    }).on('hide.bs.tab', function () {
                        destroy_owl(car2);
                    });
                    that.set_type_registers();
                }, false);
            }
        }
    },
    set_type_registers: function () {
        var that = this;
        that.value_type_registers('all')
        that.dom.find("#manual_select_type_registers").selectivity({
            items: that.type_registers().map(function (c) {
                c.text = c.title;
                return c
            })
        }).on('change', function () {
            that.value_type_registers($(this).selectivity('data').id);
            that.set_areas();
        }).selectivity('value', that.value_type_registers());
    },
    set_areas: function () {
        var that = this;
        that.value_areas('all');
        var $dom = that.dom.find("#manual_select_areas");
        if ($dom.hasClass('selectivity')) {
            $dom.selectivity('destroy').unbind().empty();
        }
        $dom.addClass('selectivity');
        $dom.selectivity({
            items: that.areas().filter(function (area) {
                var value_type_registers = that.value_type_registers();
                return value_type_registers == 'all' || area.id == 'all' || value_type_registers == area.claim_id;
            }).map(function (c) {
                c.text = c.title;
                return c
            })
        }).on('change', function () {
            that.value_areas($(this).selectivity('data').id);
            that.set_select_motives();
        }).selectivity('value', that.value_areas());
    },
    set_select_motives: function () {
        var that = this;
        that.value_motive('all');
        var $dom = that.dom.find("#manual_select_motive");
        if ($dom.hasClass('selectivity')) {
            $dom.selectivity('destroy').unbind().empty();
        }
        $dom.addClass('selectivity');
        $dom.selectivity({
            items: that.motives_select().filter(function (motive) {
                var value_type_registers = that.value_type_registers();
                var value_areas = that.value_areas();
                return motive.id == 'all' || (( value_type_registers == 'all' || value_type_registers == motive.group.claim.id) && (value_areas == 'all' || value_areas == motive.group.id));
            }).map(function (c) {
                c.text = c.title;
                return c
            })
        }).on('change', function () {
            that.value_motive($(this).selectivity('data').id);
        }).selectivity('value', that.value_motive());
    },
    data: blocks.observable(),
    areas: blocks.observable([]),
    breadcrumb: blocks.observable([{title: 'Inicio', url: '#home'}, {
        title: 'Herramientas',
        url: '#home'
    }, {title: 'Manual de Reclamos', url: ''}]),
    sliders: blocks.observable([]),
    type_registers: blocks.observable([]),
    value_type_registers: blocks.observable('all'),
    value_areas: blocks.observable('all'),
    value_motive: blocks.observable('all'),
    motives_select: blocks.observable([]),
    motives: blocks.observable([]).extend('filter', function (motive) {
        var value_type_registers = this.value_type_registers();
        var value_areas = this.value_areas();
        var value_motive = this.value_motive();
        return (value_type_registers == 'all' || value_type_registers == motive.group.claim.id) && (value_areas == 'all' || value_areas == motive.group.id) && (value_motive == 'all' || value_motive == motive.id);
    }),
    text_search: blocks.observable(''),
    event_search: function () {
        var that = this;
        this.value_type_registers('all');
        api(get_params('tools', {type: 'manual_search', text: this.text_search()}), function (res) {
            that.motives(res.motives);
            that.motives_select([{id: 'all', title: '-- Todos los Motivos --'}].concat(res.motives));
            that.set_select_motives();
            that.add_full_scrren()
        }, false);
    },
    event_reset: function () {
        this.text_search('');
        this.value_type_registers('all');
        this.value_areas('all');
        this.value_motive('all');
        this.dom.find("#manual_select_type_registers").selectivity('value', this.value_type_registers());
        this.event_search();
    },
    add_full_scrren: function () {
        var that = this;
        // add table responsive
        setTimeout(function () {
            that.dom.find('.content_reclamo table').each(function () {
                $(this).wrap('<div class="table-responsive"></div>');
                $(this).before('<a class="active_full_screen"><i class="fa fa-arrows-alt"></i></a>');
            });
        }, 500)
    }
});

/*--------------------------------------------------------------------------------------------------------------------*/

/**
 * Tools: LDI & LDN
 */


App.View('ToolsLdi', {
    dom: $('#view_tools_ldi'),
    options: {
        route: blocks.route('/tools/ldi'),
        url: 'views/tools/ldi.html'
    },
    init: function () {
    },
    inited: blocks.observable(false),
    routed: function (params) {
        if (is_login_view()) {
            var that = this;
            App.Header.set_title("llamadas de larga distancia");
            App.Header.set_show_back(true);
            if (!this.inited()) {
                preload();
                api(get_params('tools', {type: 'ldi_init'}), function (res) {
                    that.inited(true)
                    that.html_table(res.html);
                    var cities = [];
                    res.countries.map(function (country) {
                        return country.cities.map(function (city) {
                            if (city) cities.push({value: city, city: city, country: country.country});
                            return city
                        })
                    });
                    that.cities([{value: 'all', city: '-- Todas las Ciudades --'}].concat(cities));
                    that.dom.find("#ldi_select_country").selectivity({
                        items: res.countries.map(function (c) {
                            return c.country
                        }),
                        placeholder: 'Seleccionar país'
                    }).on('change', function () {
                        that.value_country($(this).selectivity('data').text);
                        that.reset_cities_select();
                    }).selectivity('value', that.value_country());
                    preload(1);
                }, false);
            }
        }
    },
    data: blocks.observable(),
    countries: blocks.observable([]),
    cities: blocks.observable([]),
    event_filter: function () {
        var that = this;
        preload3();
        api(get_params('tools', {
            type: 'ldi_search',
            country: this.value_country(),
            city: this.value_city() == 'all' ? '' : this.value_city()
        }), function (res) {
            that.html_table(res.html);
            preload3(1);
        }, false);
    },
    event_filter_phone: function () {
        var that = this;
        preload3();
        api(get_params('tools', {
            type: 'ldi_range',
            phone: this.value_phone(),
            inter: this.dom.find('#filter_tools_ldi_range .my_radio input:checked').val() == '0' ? 1 : null
        }), function (res) {
            that.html_table(res.html);
            preload3(1);
        }, false);
    },
    reset_cities_select: function () {
        var that = this;
        that.value_city('all');
        var country = that.value_country();
        that.dom.find("#ldi_select_city").selectivity({
            items: that.cities().filter(function (c) {
                return !country || c.value == 'all' || c.country == country
            }).map(function (c) {
                return {id: c.value, text: c.city}
            }),
            placeholder: 'Seleccionar ciudad'
        }).on('change', function () {
            that.value_city($(this).selectivity('data').id);
        }).selectivity('value', that.value_city());
    },
    reset_form: function () {
        this.value_country('Bolivia');
        this.dom.find("#ldi_select_country").selectivity('value', this.value_country());
        this.reset_cities_select();
        this.event_filter();
    },
    reset_form2: function () {
        this.value_phone('');
        this.dom.find('#filter_tools_ldi_range .my_radio input:first').prop('checked', true)
    },
    breadcrumb: blocks.observable([{title: 'Inicio', url: '#home'}, {
        title: 'Herramientas',
        url: '#home'
    }, {title: 'LDI Y LDN', url: ''}]),
    html_table: blocks.observable(''),
    value_country: blocks.observable('Bolivia'),
    value_city: blocks.observable('all'),
    value_phone: blocks.observable('')
});


var angular_params;
var month_start = moment().subtract(2, 'months').format('DD/MM/YYYY');
var month_end = moment().subtract(1, 'months').endOf('month').format('DD/MM/YYYY');

App.View('ToolsSimulador', {
    dom: $('#view_tools_simulador'),
    options: {
        route: blocks.route('/tools/simulador'),
        url: 'views/tools/simulador2.html'
    },
    init: function () {
    },
    inited: blocks.observable(false),
    routed: function (params) {

        var that = this;
        App.Header.set_title("Simulador Endeudamiento");
        App.Header.set_show_back(true);


        that.breadcrumb([{title: 'Inicio', url: '#home'}, {
            title: 'Herramientas',
            url: '#home'
        }, {title: 'Simulador Endeudamiento', url: ''}])


        if (is_login_view()) {

            if (!this.inited()) {

                preload(1)

                var that = this;
                App.Header.set_title("Simulador Endeudamiento");
                App.Header.set_show_back(true);

                this.inited(true);


                $(document).ajaxError(function (e, xhr, settings, exception) {

                    console.log('error in: ');
                    console.log(exception);
                });

                //angular.bootstrap(document, ['simuladorEndeudamientoApp']);

                preload();

                $.ajax({
                    url: API_URL + 'getSimulatorParams',
                    jsonp: "callback",
                    dataType: "jsonp",
                    data: {},
                    success: function (response) {

                        angular_params = response;
                        $.getScript("simulador_assets/js/angular.min.js", function () {
                            $.getScript("https://cdnjs.cloudflare.com/ajax/libs/angular-google-chart/1.0.0-beta.1/ng-google-chart.min.js", function () {

                                $.getScript("simulador_assets/js/moment.js", function () {

                                    moment.locale('es');

                                    $.getScript("simulador_assets/js/chart.min.js", function () {
                                        $.getScript("simulador_assets/js/angular-chart.min.js", function () {
                                            $.getScript("simulador_assets/js/angular-route.min.js", function () {
                                                $.getScript("simulador_assets/js/angular-sanitize.min.js", function () {
                                                    $.getScript("simulador_assets/js/ngDialog.min.js", function () {
                                                        $.getScript("simulador_assets/js/ngDatepicker.min.js", function () {
                                                            $.getScript("simulador_assets/js/simulador/services.js", function () {
                                                                $.getScript("simulador_assets/js/simulador/simulador_endeudamiento.js", function () {
                                                                    $.getScript("simulador_assets/js/simulador/ingresos.js", function () {
                                                                        $.getScript("simulador_assets/js/simulador/plan_pagos.js", function () {
                                                                            $.getScript("simulador_assets/js/simulador/extractos.js", function () {
                                                                                $.getScript("simulador_assets/js/simulador/extractos_ingresos.js", function () {
                                                                                    $.getScript("simulador_assets/js/simulador/requisitos.js", function () {
                                                                                        $.getScript("simulador_assets/js/bootstrap3.min.js", function () {

                                                                                            angular.bootstrap($('#angularApp')[0], ['simuladorEndeudamientoApp']);

                                                                                            preload(1);

                                                                                        });
                                                                                    });
                                                                                });
                                                                            });
                                                                        });
                                                                    });
                                                                });
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });

                    },
                    error: function () {

                    },
                    complete: function () {
                    }
                });


            }
        }
    },
    breadcrumb: blocks.observable(),
    //title: blocks.observable(),
    //message: blocks.observable(),
    //date: blocks.observable(),
});

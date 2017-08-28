var simulator = angular.module('simuladorEndeudamientoApp', ["chart.js", "ngSanitize", "ngDialog", "services", "jkuri.datepicker", "googlechart"])
    
    .config(function ($sceDelegateProvider) {

        //$sceDelegateProvider.resourceUrlWhitelist(['^(?:http(?:s)?:\/\/)?(?:[^\.]+\.)?\(vimeo|youtube)\.com(/.*)?$', 'self']);

        $sceDelegateProvider.resourceUrlWhitelist([
            // Allow same origin resource loads.
            'self',
            'http://localhost:3000/*',
            'http://10.0.0.160:3000/**',
            'https://conocimiento.nuevatel.com/**',
            // Allow loading from our assets domain.  Notice the difference between * and **.
            'https://ssl.gstatic.com'
        ]);

        // The blacklist overrides the whitelist so the open redirect here is blocked.
        $sceDelegateProvider.resourceUrlBlacklist([]);
    })

    .run(['$templateCache', function ($templateCache) {
        $templateCache.put('modalMessage.html', $('#modalMessage').html());
    }])

    .run(['$templateCache', function ($templateCache) {
        $templateCache.put('modalConfirm.html', $('#modalConfirm').html());
    }])

    .run(['$templateCache', function ($templateCache) {
        $templateCache.put('modalExtractos.html', $('#modalExtractos').html());
    }])

    .run(['$templateCache', function ($templateCache) {
        $templateCache.put('modalPlanDePagos.html', $('#modalPlanDePagos').html());
    }])

    .run(['$templateCache', function ($templateCache) {
        $templateCache.put('modalRemesas.html', $('#modalRemesas').html());
    }])

    .run(['$templateCache', function ($templateCache) {
        $templateCache.put('modalIVA.html', $('#modalIVA').html());
    }])
    .run(function($rootScope){

        $rootScope.crm = {
            title: '',
            message: ''
        };

        $rootScope.subscriptor = false;

        $rootScope.document_types = [
            //{id: '', name: 'Tipo de Documento'},
            {id: 'ci', name: 'Carnet de Identidad'},
            {id: 'nit', name: 'NIT'},
            {id: 'telefono', name: 'Linea'}
        ];

        $rootScope.document_type = $rootScope.document_types[0];

        $rootScope.document_value2 = '';
    })

    

    .directive('dropdown', function ($document, $window) {
        return {
            restrict: "C",
            link: function (scope, elem, attr) {
                
                elem.bind('click', function () {

                    //setTimeout(function() {

                        elem.toggleClass('dropdown-active');
                        elem.addClass('active-recent');

                        var self = $(elem).find(".menu");

                        var rect = elem[0].getBoundingClientRect();

                        //var left = parseInt(rect.left) - parseInt($(self).outerWidth()) + parseInt(rect.width);
                        var left = ( window.innerWidth - $(elem).find(".menu").outerWidth() ) / 2;
                        var top  = parseInt(rect.height) + parseInt(rect.top);

                    if ( window.innerWidth >= 1024 ) {

                        if (left + $(elem).find(".menu").outerWidth() >= $(elem).find(".menu").outerWidth()) {

                            if ( left > parseInt(rect.left) + $(elem).outerWidth() ) {

                                left = parseInt(rect.left);
                            }

                            $(self).css({left: left, top: top});

                            if (window.outerWidth < left + $(elem).find(".menu").outerWidth()) {
                                left = 0;
                            }


                        } else {
                            $(self).css({right: 0, top: top});


                        }

                    } else {

                        $(self).css({left: 10, top: top});
                    }

                    //}, 100);
                });

                $document.bind('click', function () {

                    if (!elem.hasClass('active-recent')) {
                        elem.removeClass('dropdown-active');
                    }
                    elem.removeClass('active-recent');

                    //$(elem).find(".menu").css({left:elem.pageX + window.scrollX, top:elem.pageY + window.scrollY});
                });

                $(window).bind('scroll', function () {

                    // if (!elem.hasClass('active-recent')) {
                    //     elem.removeClass('dropdown-active');
                    // }
                    // elem.removeClass('active-recent');

                    var self = $(elem).find(".menu");

                    var rect = elem[0].getBoundingClientRect();

                    var top  = parseInt(rect.height) + parseInt(rect.top);

                    $(self).css({top: top});

                    //$(elem).find(".menu").css({left:elem.pageX + window.scrollX, top:elem.pageY + window.scrollY});
                });

            }
        }
    });


$(document).bind('keypress', function () {
    setTimeout(function(){
        $('.dropdown-active').removeClass('dropdown-active');
    }, 0);


    //$(elem).find(".menu").css({left:elem.pageX + window.scrollX, top:elem.pageY + window.scrollY});
});
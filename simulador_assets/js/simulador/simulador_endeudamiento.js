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

    .directive('dropdown', function ($document, $window) {
        return {
            restrict: "C",
            link: function (scope, elem, attr) {

                elem.bind('click', function () {

                    elem.toggleClass('dropdown-active');
                    elem.addClass('active-recent');

                    var self = $(elem).find(".menu");

                    var rect = elem[0].getBoundingClientRect();

                    //var left = parseInt(rect.left) - parseInt($(self).outerWidth()) + parseInt(rect.width);
                    var left = ( window.innerWidth - $(elem).find(".menu").outerWidth() ) / 2;
                    var top  = parseInt(rect.height) + parseInt(rect.top);

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

                    //$(elem).find(".menu").css({left:elem.pageX + window.scrollX, top:elem.pageY + window.scrollY});
                });

                $document.bind('click', function () {

                    if (!elem.hasClass('active-recent')) {
                        elem.removeClass('dropdown-active');
                    }
                    elem.removeClass('active-recent');

                    //$(elem).find(".menu").css({left:elem.pageX + window.scrollX, top:elem.pageY + window.scrollY});
                });

                $(window).bind('scroll', function () {

                    if (!elem.hasClass('active-recent')) {
                        elem.removeClass('dropdown-active');
                    }
                    elem.removeClass('active-recent');

                    //$(elem).find(".menu").css({left:elem.pageX + window.scrollX, top:elem.pageY + window.scrollY});
                });

            }
        }
    });
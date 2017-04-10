/**
 * Defined vars
 */

var base_url = API_URL;
//var base_url = 'http://10.0.0.160:3000/';
var session_time_out = 25;
//base_url = 'http://10.0.0.7:4001/';
var api_url = base_url + 'mobile_api2/';
var App = null;
var storage = null;
var $container = null;
var _inited = false;
var info_device = {platform: 'undefined', uuid: guid(), version: '0', model: 'undefined'};
var _online = true;
var _init_app_global = false; // only phonegap

document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    if(typeof device == "undefined") return;
    window.open = cordova.InAppBrowser.open;
    document.addEventListener("online", onOnline, false);
    document.addEventListener("offline", onOffline, false);
    init_app_global();

    setTimeout(function(){

        try {
            navigator.splashscreen.hide();
        } catch (error) {
        }

        try {

            StatusBar.hide();

        } catch (error){}
    }, 500);
}

function onOffline() {
    _online = false;
    show_error_500(400);
}

function onOnline() {
    if(!_online) history.back();
    _online = true;
    if(!_init_app_global) init_app_global()
}

function init_app_global(){
    _init_app_global = true;
    if(typeof device != "undefined"){
        info_device = {
            platform: device.platform,
            uuid: device.uuid,
            version: device.version,
            model: device.model
        };
        api( get_params('init_app', {info_device: info_device}), function( res ) { }, false, true);
    }
}
/**
 * Init jQuery
 */
(function ($) {
    // load templates
    $('#templates').load('views/layout/templates.html');
    // Init plugins jQuery
    init_plugins($);
    // init App Blocks
    App = blocks.Application();
    function app_init(){
        _inited = true;
        App.NavLeft.load_nav_menu();
        api('get_sites', function( res ) {
            App.Footer.set_sites(res.sites);
        });
        setTimeout(function(){
            App.Footer.set_notif();
            App.Header.load_autocomplete();
        }, 2000);
        if(!(_.contains(permissions_site(), "select_content") && _.contains(permissions_site(), "copy_and_paste"))){
            $('html').addClass('block_select')
        }
        hash_change(window.location.hash)
    }
    /**
     * Callback hash browser -> change page
     */
    function hash_change(hash){
        if(App._currentView && App._currentView.routed_out) App._currentView.routed_out();
        App.NavLeft.updated();
        App.NavLeft.hide();
        App.Header.show_search(false);
        var active_class = 'page-' + _.slugify(hash.split('/')[0]);
        var old_class = $('html').attr("old_class");
        $('html').removeClass(old_class).attr("old_class",active_class).addClass(active_class).infiniteScrollHelper('destroy');
        $('.twitter-typeahead .tt-menu.tt-open').hide();
        $('#box-content').find('.content_panels_footer .active, .footer .active').removeClass('active');
        App.Footer.updated();
        if(active_class != 'page-search') {
            App.Header.reset_form();
            App.Header.clear_input();
            App.Header.set_hide_adv();
        }
        setTimeout(function(){
            scroll_to('top');
        }, 200)
        preload3(1);
    }
    $(window).on('hashchange',function(){ hash_change(window.location.hash)});

    // Detect login
    window.is_login_view = function(){
        if(!is_signin()){
            get_route('login',false, true);
            return false;
        }else{
            $('#view_login').hide();
            $('#box-content').show();
            App.NavLeft.set_user_data();
            if(!_inited) app_init();
            return true;
        }
    };

    // Show Error 500
    window.show_error_500 = function(code){
        var message = 'La aplicacion no pudo conectarse al servidor, posiblemente no esta conectado a una red movil o wifi.';
        switch (parseInt(code)){
            case 500:
                message = 'Ocurrio un error en el servidor, contactese con el administrador'
                break;
        }
        App.Home.route("error_500");
        App.Error500.message(message);
    };
    // Show page message server
    window.show_message = function(message){
        App.Message.message(message);
        App.Home.route("message");
    };
    // logout function
    window.logout = function(){
        storage.remove('current_user');
        storage.remove('current_site');
        storage.remove('permissions_site');
        location.href = 'index.html'
    };
    // Ready init page
    blocks.domReady(function(){
        setTimeout(function(){
            if(!window.location.hash) get_route('home', false, true);
        }, 460)
    })

    // fallback message for non support upload files
    window.upload_message_fallback = function(){
        var res = '';
        if( device.platform.toLowerCase() === 'android' && device.version.indexOf( '4.4' ) === 0 ) {
            res = '<label class="label label-danger">Tu dispositivo no soporta subir archivos, debe ser android > 4.4</label>';
        }
        return res;
    }

})(jQuery);
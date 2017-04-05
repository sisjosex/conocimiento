/**
 * Created by Froilan on 25/11/2015.
 */

/*--------------------------------------------------------------------------------------------------------------------*/

/**
 * Page: Login
 */

App.View('Login', {
    dom: $('#view_login'),
    options: {
        route: blocks.route('/login'),
        url: 'views/sessions/login.html'
    },
    init: function () { // return;
    },
    ready: function(){
    },
    routed: function (params) {
        var that = this;
        if(is_signin()){
            get_route('home', false, true);
        }else{
            setTimeout(function(){
                that.dom.find('#form-login input:checkbox').not('.rendered').addClass('rendered').simpleCheckbox();
                $('#view_login').show();
                $('#box-content').hide();
                preload(true);
            }, 500)
        }
    },
    username: blocks.observable(''),
    password: blocks.observable(''),
    submit_form: function(){
        var that = this;
        var login_ad = that.dom.find('#login_ad').attr('checked') != "checked";
        preload3();
        api( get_params('login', {username: this.username(), password: this.password(), login_ad: login_ad, info_device: info_device}), function( res ) {
            if(res.error){
                alert_error(res.error)
            }else{
                that.username('');
                that.password('');
                current_site(res.current_site)
                current_user(res.current_user)
                permissions_site(res.permissions_site);
                if(res.init_presentation){
                    get_route('presentation', false, true);
                }else{
                    get_route('home', false, true);
                }
            }
            preload3(1);
        }, false, true);
        return false;
    },
    scroll_to_login: function(){
        scroll_to('form-login')
    }
});

/*--------------------------------------------------------------------------------------------------------------------*/

/**
 * Page: Forgot
 */

App.View('Forgot', {
    dom: $('#view_forgot'),
    options: {
        route: blocks.route('/forgot'),
        url: 'views/sessions/forgot.html'
    },
    init: function () { // return;
    },
    routed: function (params) {
        this.dom.removeClass('none')
    },
    email: blocks.observable(''),
    submit_form: function(){
        var that = this;
        preload3();
        api( get_params('forgot', {email: this.email()}), function( res ) {
            if(res.error){
                alert_error(res.error)
            }else{
                that.email('');
                alert_success(res.notice);
                get_route('login', false, true);
            }
            preload3(1);
        }, false, true);
        return false;
    },
    scroll_to_forgot: function(){
        scroll_to('form-forgot')
    }
});
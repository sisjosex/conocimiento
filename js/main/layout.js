/**
 * Created by Froilan on 25/11/2015.
 */

/*--------------------------------------------------------------------------------------------------------------------*/

/**
 * Layout: Header
 */

App.View('Header',{
    options: {
        url: 'views/layout/header.html'
    },
    dom: $('header.header'),
    init: function(){
        var that = this;
        this.dom.resize(this.resize_header);
    },
    ready: function(){
        var $pisckers = this.dom.find('#date-picker-range .datepicker');
        $pisckers.datepicker({language: 'es', autoclose: true, startView: 'day', format: 'dd/mm/yyyy'})
            .on('changeDate', function(e){
                if($(this).attr('name') == 'date_start'){
                    $pisckers.last().datepicker('setStartDate', e.date)
                }else{
                    $pisckers.first().datepicker('setEndDate', e.date)
                }
            });
        this.dom.find('.range_time input').change(function(){
            var res = _get_range($(this).val());
            $pisckers.first().datepicker('update', res.t1);
            $pisckers.last().datepicker('update', res.t2);
        });
    },
    resize_header: function(){
        this.reset_show_title();
        $('.scroll-to-fixed-fixed').trigger('resize');
    },
    date_day: blocks.observable(moment().format('dddd, DD [de] MMMM YYYY')),
    show_search : blocks.observable(false),
    show_buttons : blocks.observable(false),
    show_title : blocks.observable(false),
    show_back : blocks.observable(false),
    search_text: blocks.observable(''),
    load_autocomplete: function(){
        var that = this;
        $('#search_top:not(.use_typeahead)').search_autocomplete(function(a, b){
            that.search_text(b);
            that.search_text_root(b);
            that.submit_search();
        });
        setTimeout(function(){
            that.load_categories();
        }, 8000)
    },
    title: blocks.observable(''),
    set_title: function(title){
        this.title(title || '');
        this.reset_show_title();
    },
    buttons: blocks.observable([]),
    set_buttons: function(buttons){
        buttons = (buttons || []).map(function(o){
            o.url = get_route(o.type , o.args ? $.param(o.args) : '' );
            return o;
        });
        this.buttons.removeAll();
        this.buttons.addMany(buttons);
        this.dom.find('.nav-tab-drop .dropdown-menu').empty();
        this.dom.find('.responsive-tabs').tabdrop().trigger('resize');
        this.reset_show_title();
    },
    sub_button_title: blocks.observable(''),
    set_show_back: function(bool){
        this.show_back(bool && window.history.length > 0)
    },
    click_show_nav_left: function(){
        App.NavLeft.show();
    },
    reset_show_title: function(){
        //var class_md = $('html').hasClass('r_md');
        this.show_title(this.title() && true);
    },
    click_back: function(){
        window.history.back()
    },
    // search adv
    keypress_input: function(e){
        if(e.which == 13) this.submit_search();
    },
    toogle_show_search: function(e){
        this.show_search(!this.show_search());
        if( this.show_search() ){
            this.dom.find('#search_top').typeahead('val','');
            this.dom.find('#search_top').focus();
        }
    },
    submit_search: function () {
        get_route('search', {text: this.search_text_root()}, true);
        $("#search_top").blur();
    },
    show_adv: blocks.observable(false),
    search_text_root: blocks.observable(''),
    search_category: blocks.observable(''),
    search_post_types: blocks.observable([]),
    click_search_root: function(){
        this.reset_form();
        this.set_hide_adv();
        App.Header.search_text(this.search_text_root());
        App.Header.submit_search();
    },
    click_search: function(){
        this.set_hide_adv();
        get_route('search', this.dom.find('#form_search_advanced').serializeObject(), true);
        $("#search_top").blur();
    },
    set_show_adv:function(){
        this.show_adv(true);
    },
    set_hide_adv:function(){
        this.show_adv(false)
    },
    clear_input: function(){
        this.search_text_root('');
        this.dom.find('#search_top').typeahead('val', '').focus();
    },
    click_show_adv: function(){
        var that = this;
        this.load_categories();
        this.show_adv(!this.show_adv());
        this.dom.find('.search_adv_top').css('max-height', ($(window).height() - 50) + 'px');
        $('#search_top').focusout().typeahead('close');
    },
    load_categories: function(){
        var that = this;
        if(that.dom.find('#search_category option').size() == 0) {
            that.dom.find('#search_category').append('<option value="">Seleccionar Categoria</option>')
            api( 'search_filter', function( res ) {
                that.search_post_types.reset(res.search_filter.post_types);
                that.dom.find('#search_category').append(res.search_filter.html_categories);//.val(params_data.category)
                that.dom.find('.my_checkbox input').change(function(){
                    var thiss = this;
                    setTimeout(function(){
                        var inp = $(thiss).parent().next('.my_radio.sub').find('input');
                        if($(thiss).is(':checked')){
                            inp.first().prop('checked', true)
                        }else{
                            inp.prop('checked', false)
                        }
                    }, 100);
                });
                that.dom.find('.my_radio.sub input:radio').change(function(){
                    $(this).closest('.my_radio').prev('.my_checkbox').find('input:checkbox').prop('checked', true);
                });
            }, true);
        }
    },
    reset_form: function(){
        $('.form_search_advanced input[type="text"], .form_search_advanced select').val('')
        $('.form_search_advanced .my_checkbox > input').prop('checked', false)
        $('.form_search_advanced .box_filter_groups .my_checkbox > input').prop('checked', true);
        $('.form_search_advanced .box_filter_groups .my_radio > input[value="all"]').prop('checked', true);
    }
});

/*--------------------------------------------------------------------------------------------------------------------*/

/**
 * Layout: Nav Left
 */

App.View('NavLeft',{
    options: {
        url: 'views/layout/nav_left.html'
    },
    dom: $('#nav_left'),
    init: function(){
    },
    ready: function(){
        var that = this;
        that.dom.bind('swipeleft', function(e) {
            that.hide();
        });
    },
    show: function(){
        resize_app();
        this.dom.find("img.lazy").lazyload();
        this.dom.transit({ x: 0 });
        this.dom.find("img.lazy").trigger("appear");
        this.is_visible(true);
    },
    hide: function(){
        var that = this;
        this.dom.transit({ x: this.dom.width() * -1.5});
        if(that.is_visible()) {
            setTimeout(function () {
                that.load_nav_menu();
            }, 5000);
        }
        this.is_visible(false);
    },
    is_visible: blocks.observable(false),
    user_fullname: blocks.observable(''),
    user_avatar: blocks.observable(''),
    set_user_data: function(){
        this.user_fullname(current_user().fullname)
        this.user_avatar(current_user().avatar)
        this.dom.find("img.lazy").lazyload();
    },
    logout: function(){
        window.logout();
    },
    edit_profile: function(){
        var thiss = this;
        this.hide();
        var modal_tpl = '<div class="modal fade modal-purple" tabindex="-1" role="dialog"> <div class="modal-dialog"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button> <h4 class="modal-title">Modal title</h4> </div> <div class="modal-body">Cargando...</div> <div class="modal-footer"> <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> <button type="button" class="btn btn-primary">Save changes</button> </div> </div><!-- /.modal-content --> </div><!-- /.modal-dialog --> </div><!-- /.modal -->';
        var modal = $(modal_tpl);
        modal.find('.modal-title').html('Editar Perfil');
        $.get('views/sessions/profile.html', function(res){
            modal.find('.modal-body').html(res);
            var form = modal.find('form');
            setTimeout(function(){
                form.validate({rules:{ "password_confirmation": {equalTo: '#admin_user_password' } }, submitHandler: function(){
                    var lobibox = alert_info('Guardando...');
                    $($('#user_form')).ajaxSubmit({
                        url: get_url('update_profile', {}),
                        success: function(res){
                            current_user(res.current_user);
                            thiss.set_user_data();
                            modal.modal('hide');
                            lobibox.remove();
                        }
                    });
                return false
            }});}, 100);
            for(var k in storage.get('current_user')){
                try{form.find('[name="'+k+'"]').val(storage.get('current_user')[k])}catch(e){ }
            }
            if(storage.get('current_user')["kind"] == 'ad') form.find("#panel_pass").remove();
        });
        modal.find('.modal-footer').remove();
        modal.modal('show');
        modal.on('hidden.bs.modal', function(){ $('.modal-backdrop').remove(); modal.remove(); });
    },
    hash_code: 0,
    load_nav_menu: function()
    {
        var that = this;
        if(_inited){
            api('nav_menu_left', function( res ) {
                var _code = JSON.stringify(res.nav_menu).hashCode();
                if(_code != that.hash_code){
                    that.set_nav_menu(res.nav_menu);
                    that.hash_code = _code;
                }
            });
        }
    },
    set_nav_menu: function(nav_menu){
        this.nav_menu.removeAll();
        this.nav_menu.addMany(nav_menu);
        this.updated();
        this.dom.find('.collapse').on('show.bs.collapse', function () {
            $(this).parents('li').last().siblings().each(function(){
                $(this).find('ul.collapse').removeClass('in');
                $(this).find('.nav_collapse').addClass('collapsed');
            })
        })
    },
    nav_menu: blocks.observable([]),
    updated: function(){
        this.dom.find('a.active').removeClass('active');
        this.dom.find('ul.in').removeClass('in');
        function set_class($a){
              $a.addClass('active');
            $a.parents('li').map(function(){
                $(this).parent('ul.collapse').addClass('in');
                return this;
            });
            var $link_li = $a.parents('li').last()
            $link_li.siblings().each(function(){
                $(this).find('.nav_collapse').addClass('collapsed');
            })
        }
        detect_link_active_url(this.dom.find('.menu-content li a'), set_class)
    }
});

/*--------------------------------------------------------------------------------------------------------------------*/

/**
 * Layout: Footer
 */

App.View('Footer',{
    options: {
        url: 'views/layout/footer.html'
    },
    dom: $('footer.footer'),
    init: function(){
    },
    counter_notifications: blocks.observable(0),
    show: function(){
        var that = this;
        this.is_visible(true);
        if(NOTIFICATIONS_INTER) clearInterval(NOTIFICATIONS_INTER);
        setTimeout(function(){
            that.set_notif();
        }, 1000);
    },
    hide: function(){
        this.is_visible(false);
    },
    is_visible: blocks.observable(true),
    // notifications
    counter: blocks.observable(0),
    set_notif: function(){
        var that = this;
        console.log("calling notifications")
        api('notifications', function( res ) {
            var notifications = res.notifications;
            var counter = 0;
            $.each(notifications.post_type,function(index, obj){
                counter += obj.counter;
            });
            that.comments.removeAll();
            that.post_types.removeAll();
            that.specialist_pages.removeAll();
            that.faqs.removeAll();
            that.comments.addMany(notifications.comments);
            that.post_types.addMany(notifications.post_type);
            that.specialist_pages.addMany(notifications.specialist_pages);
            that.faqs.addMany(notifications.faqs);
            counter += notifications.comments.length;
            counter += notifications.specialist_pages.length;
            counter += notifications.faqs.length;
            App.Footer.counter_notifications(counter);
            that.counter(counter);
        }, false, null, true);
        if(typeof NOTIFICATIONS_INTER == 'undefined') NOTIFICATIONS_INTER = setInterval(function(){ that.set_notif(); }, 2*60*1000); // 1minute
    },
    notifications_read: function(e, value){
        setTimeout(function(){
            api(get_params('notifications_read',{key: value}), function( res ) {
            });
        },1000);
    },
    post_types: blocks.observable([]),
    comments: blocks.observable([]),
    specialist_pages: blocks.observable([]),
    faqs: blocks.observable([]),
    updated: function(){
        this.dom.find('.btn-group a.active').removeClass('active');
        function set_class($a){
            $a.addClass('active');
        }
        detect_link_active_url(this.dom.find('.btn-group a'), set_class)
    },
    set_sites: function(sites){
        this.sites(sites);
    },
    sites: blocks.observable([]),
    set_site: function(e, s){
        current_site(s.site)
        permissions_site(s.permissions_site);
        window.location.reload()
    }
});
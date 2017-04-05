/**
 * Created by Froilan on 25/11/2015.
 */

/*--------------------------------------------------------------------------------------------------------------------*/

/**
 * Page: FAQs
 */

App.View('FAQs', {
    dom: $('#view_faqs'),
    options: {
        route: blocks.route('/faqs/{{faq_id}}').optional('faq_id'),
        url: 'views/pages/faqs.html'
    },
    init: function () {
    },
    routed: function (params) {
        if(is_login_view()) {
            var that = this;
            App.Header.set_title("Preguntas");
            App.Header.set_show_back(true);
            that.reset_faqs();
            that.dom.find('#search_in_faq').val('');
            if (isEmpty(this.data())) {
                preload();
                api('FAQs', function (res) {
                    that.data(res)
                    that.groups(res.groups);
                    if($('html').hasClass('r_sm')){
                        /*var container = that.dom.find('.masonry_content').masonry();
                        that.dom.find('a.title').click(function(){
                            setTimeout(function(){
                                container.masonry("reloadItems");
                                container.masonry();
                            },420)
                        });*/
                    }
                    if(params.faq_id){
                        var $item =  that.dom.find('#col_' + params.faq_id);
                        $item.parents('.panel').show().find('.panel-heading .col_group.collapsed').click();
                        var _id = "link_a_faq_" + Math.floor((Math.random() * 10000000) + 100);
                        $item.prev('.title').attr('id', _id).click();
                        scroll_to(_id);
                    }
                    preload(1);
                }, false);
            }
        }
    },
    routed_out: function(){
        this.dom.find('#search_in_faq').val('');
        this.reset_faqs()
    },
    data: blocks.observable({}),
    groups: blocks.observable([]),
    change_input: function(){
        this.reset_faqs();
        var text_search = this.dom.find('#search_in_faq').val();
        if(text_search){
            var array_str_search = text_search.split(" ").map(function(str){ return _.trim(str)}).filter(function(str){ return !_.contains(_exclude_words, str)});
            this.dom.find(".panel").hide();
            this.dom.find(array_str_search.map(function(str){ return ".txt_searchable:contains('" + str + "')"}).join(",")).each(function(){
                var $this = $(this);
                log($this)
                $this.parent('.title').show();
                $this.parent('.title.collapsed').click();
                $this.parents('.panel').show().find('.panel-heading .col_group.collapsed').click()
                $this.parent('.collapse_content').each(function(){
                    $(this).prev('.title.collapsed').click()
                })
            });
            this.dom.find(".txt_searchable:not(.highlighted)").highlight(s.clean(text_search).split(' '), { wordsOnly: true}).addClass('highlighted');
        }
    },
    reset_faqs: function(){
        this.dom.find(".panel").show();
        this.dom.find(".collapse_content.in").removeClass('in');
        this.dom.find(".panel-body.in").removeClass('in');
        this.dom.find(".txt_searchable").removeHighlight();
        this.dom.find(".highlighted").removeClass('highlighted');
        this.dom.find("a[data-toggle = 'collapse']").removeClass('highlighted').attr('aria-expanded',false).addClass('collapsed');
    }
});

/*--------------------------------------------------------------------------------------------------------------------*/

/**
 * Page: Bookmarks
 */

App.View('Bookmarks', {
    dom: $('#view_bookmarks'),
    options: {
        route: blocks.route('/bookmarks/{{page_id}}').optional('page_id'),
        url: 'views/pages/bookmarks.html'
    },
    init: function () {
    },
    params: {},
    routed: function (params) {
        var that = this;
        that.params = params;
        if(is_login_view()) {
            App.Header.set_title("Marcadores");
            App.Header.set_show_back(true);
            preload();
            api('bookmarks', function( res ) {
                that.bookmarks.removeAll();
                function reset_branch(branchs){
                    if(branchs.length == 0){
                        return [{id: 'none_' + Math.random(), icon: 'blank_file', 'label': 'Sin archivos'}];
                    }else{
                        return branchs.map(function(b){ if(b.icon == 'folder') b.branch = reset_branch(b.branch); return b;})
                    }
                }
                that.bookmarks.addMany(res.bookmarks.map(function(a){
                    a.branch = reset_branch(a.branch);
                    return a;
                }));
                that.dom.find('#nestable3 > ol').nestedSortable({
                    handle: '.dd-handle, .dd3-content',
                    items: '.dd3-item.folder, .dd3-item.file',
                    isTree: true,
                    doNotClear: true,
                    isAllowed: function(placeholder, placeholderParent, currentItem) {
                        return placeholderParent && placeholderParent.hasClass('folder') },
                    onChange: function(item){
                        if(!item || !item.parent('.dd-list')) return;
                        api(get_params('bookmarks_actions', {action: 'sorted', tipo: item.hasClass('folder') ? 'folder' : 'item', id: item.attr("id").replace('bookmark_',''), parent_id: item.parent('.dd-list').attr("id").replace('collapse_bookmark_','')}), function( res ) {
                            if(res.error){
                                alert_error(res.error)
                            }else{
                                item.siblings('.blank_file').hide();
                            }
                        });
                    }
                });

                that.sortable_disabled();

                that.dom.find('.check_sortable input:checkbox').not('.rendered').addClass('rendered').simpleCheckbox({
                    onClick: function(bool){
                        if(bool)
                            that.sortable_enabled();
                        else
                            that.sortable_disabled();
                    }
                });
                that.dom.find('.tog.on').removeClass('on');

                // hide all settings buttons
                that.dom.find('#bookmark_root').on('click','.settings:visible',function(){
                    that.dom.find('.box_setting.collapse:visible').collapse('hide');
                });

                // filter
                that.dom.find('#bookmark_input_search').val('').keyup(function(){
                    that.array_search([]);
                    if(this.value){
                        var array_str_search = this.value.split(" ").map(function(str){ return _.trim(str)}).filter(function(str){ return !_.contains(_exclude_words, str)});
                        that.array_search( that.dom.find("#nestable3 .dd-item:not(.root) .dd3-content").find(array_str_search.map(function(str){ return ".text:contains('" + str + "')"}).join(",")).get() );
                        that.array_index(0);
                        that.set_visible_search(0)
                    }else{
                        that.dom.find(".dd-item").show();
                    }
                });

                // zoom width bookmark
                var book_panel = $('#nestable3');
                book_panel.data('_width', null).children('ol').css('width', '100%');
                that.dom.find('#zoom_width').click(function(){
                    var w = (book_panel.data('_width') || 100) + 10;
                    book_panel.css('overflow', 'auto').data('_width', w).children('ol').css('width', w+'%');
                });
                that.dom.find('#zoom_width_less').click(function(){
                    var w = (book_panel.data('_width') || 100) - 10;
                    book_panel.css('overflow', 'auto').data('_width', w).children('ol').css('width', w+'%');
                });

                // set values of show
                if(params.show_id){
                    that._show_item(that.dom.find("#bookmark_" + params.show_id).first()) ;
                }
                // set page_id
                if(params.page_id){
                    that.active_page(params.page_id);
                    preload3();
                    api(get_params('bookmarks_actions', {action: 'get_bookmark_from_page', page_id: params.page_id}), function( res ) {
                        if(res.bookmarks_actions) res = res.bookmarks_actions;
                        that.title_page(res.title);
                        if(res.id){
                            var item = that.dom.find("#bookmark_" + res.parent_id);
                            if(item.length){
                                 that._show_item(item);
                                that.active_folder(res.parent_id);
                            }
                        }
                        preload3(1);
                    });
                    that.show_only_files(false);
                    that.assign_folder(true);
                }
                resize_app();
                preload(1);
            });
        }
    },
    routed_out: function(){
        this.show_only_files(true);
        this.assign_folder(false);
        this.active_folder(0);
        this.active_page(0);
    },
    reload: function(){
        this.routed_out();
        this.routed(this.params);
    },
    input_search: blocks.observable(''),
    array_search: blocks.observable([]),
    array_index: blocks.observable(0),
    show_only_files: blocks.observable(true),
    assign_folder: blocks.observable(false),
    active_folder: blocks.observable(0),
    active_page: blocks.observable(0),
    title_page: blocks.observable(''),
    search_prev: function(){
        var inx = this.array_index() - 1;
        this.array_index(inx);
        this.set_visible_search(inx);
    },
    search_next: function(){
        var inx = this.array_index() + 1;
        this.array_index(inx);
        this.set_visible_search(inx);
    },
    set_visible_search: function(inx){
        var that = this;
        this.dom.find(".dd-item").not('.root').hide();
        this.dom.find(".dd-item .collapseded").not('.collapsed').click();
        if(this.array_search().length > 0 && this.array_search()[inx]){
            var item = $(this.array_search()[inx]);
            that._show_item(item)
        }
    },
    click_save: function(e, data){
        var $content = $('#collapse_bookmark_setting_'+ data.id);
        var $parent = $content.parent();
        var label = $content.find('input:first').val();
        $content.collapse('hide');
        preload3();
        api(get_params('bookmarks_actions', {action: 'update', id: data.id, title: label}), function( res ) {
            if(res.error){
                $content.find('input:first').val(data.label);
                alert_error(res.error)
            }else{
                $parent.children('.dd3-content').find('.text').html(label);
                alert_info(res.notice);
            }
            preload3(1);
        });
    },
    click_delete: function(e, data){
        var $content = $('#collapse_bookmark_setting_'+ data.id);
        var $parent = $content.parent();
        $content.collapse('hide');
        if(confirm('Esta seguro de eliminar este item?')){
            preload3();
            api(get_params('bookmarks_actions', {action: 'delete', id: data.id}), function( res ) {
                if(res.error){
                    alert_error(res.error)
                }else{
                    $parent.remove();
                    alert_info(res.notice);
                }
                preload3(1);
            });
        }
    },
    click_add_folder: function(e, data){
        var that = this;
        var $content = $('#collapse_bookmark_setting_'+ data.id);
        var $parent = $content.parent();
        $content.collapse('hide');
        swal({
            title: "Agregando carpeta",
            text: "Escriba el nombre de la carpeta:",
            type: "input",
            showCancelButton: true,
            closeOnConfirm: false,
            animation: "slide-from-top",
            inputPlaceholder: "Nombre de carpeta"
        }, function (inputValue) {
            if (inputValue === false) return false;
            if (inputValue === "") {
                swal.showInputError("Tienes que escribir algo!");
                return false
            }
            swal.close();
            preload3();
            api(get_params('bookmarks_actions', {action: 'add_folder', parent_id: data.id, title: inputValue}), function( res ) {
                if(res.error){
                    alert_error(res.error)
                }else{
                    that.routed({show_id: res.bookmark.id})
                    alert_info(res.notice);
                }
                preload3(1);
            });
        });
    },
    click_assign: function(e, data){
        this.active_folder(data.id);
        preload3();
        api(get_params('bookmarks_actions', {action: 'assign', parent_id: data.id, page_id: this.active_page(), title: this.title_page()}), function( res ) {
            if(res.error){
                alert_error(res.error)
            }else{
                alert_info(res.notice);
            }
            preload3(1);
        });
    },
    bookmarks: blocks.observable([]),
    _show_item: function(item){
        item.parents('.dd-item').show().each(function(){
            var $this = $(this);
           if(item.attr('href') != 'javascript:;') setTimeout(function(){
               $this.children('.collapseded.collapsed').click();
           }, 360)
        });
        //item.parents('.dd-list.collapse').removeClass('collapse');
    },
    sortable_enabled: function(){
        this.dom.find( "#nestable3 > ol" ).sortable( "enable" )
    },
    sortable_disabled: function(){
        this.dom.find( "#nestable3 > ol" ).sortable( "disable" )
    }
});

/*--------------------------------------------------------------------------------------------------------------------*/

/**
 * Page: Navigation
 */

var ItemNav = App.Model({
    id: App.Property(),
    icon: App.Property(),
    type: App.Property(),
    label: App.Property({defaultValue: 'No found'}),
    branch: App.Property({defaultValue: []}),
    nav_get_url: function(){
        var url = "javascript:;";
        if(this.id() == 0) return url;
        var id = _.last(this.id().split("-"))
        if(this.type() == 'post_type'){
            url = get_route('post_type', {key: id} );
        }else{
            url = get_route(this.type(), id );
        }
        return url;
    },
    on_click: function(){
        var that = this;
        if(this.icon() == 'folder' && this.branch().length == 0){
            preload3();
            api(get_params('navigation', {tree_id: this.id()}), function( res ) {
                var branch = App.Collection(ItemNav)();
                branch.addMany(res.navigation);
                that.branch(branch());
                preload3(1);
            });
        }
    }
});
App.View('Navigation', {
    dom: $('#view_navigation'),
    options: {
        route: blocks.route('/navigation'),
        url: 'views/pages/navigation.html'
    },
    init: function () {
    },
    routed: function (params) {
        var that = this;
        if(is_login_view()) {
            App.Header.set_title("Navegación");
            App.Header.set_show_back(true);
            preload();
            api('navigation', function( res ) {
                var navigation = res.navigation
                that.items.removeAll();
                that.items.addMany(navigation.map(function(_self){
                    var b = _self.branch;
                    _self.branch = App.Collection(ItemNav)();
                    _self.branch.addMany(b);
                    return _self;
                }));
                preload(1);

                // zoom width navigation
                var book_panel = $('#nestable_navigation').css({overflow: 'auto'});
                book_panel.data('_width', null).children('ol').css('width', '100%');
                that.dom.find('#zoom_width1').click(function(){
                    var w = (book_panel.data('_width') || 100) + 10;
                    book_panel.css('overflow', 'auto').data('_width', w).children('ol').css('width', w+'%');
                });
                that.dom.find('#zoom_width_less1').click(function(){
                    var w = (book_panel.data('_width') || 100) - 10;
                    book_panel.css('overflow', 'auto').data('_width', w).children('ol').css('width', w+'%');
                });
            }, false);
        }
    },
    items: App.Collection(ItemNav)()
});

/*--------------------------------------------------------------------------------------------------------------------*/

/**
 * Page: Subscription
 */

App.View('Subscription', {
    dom: $('#view_subscription'),
    options: {
        route: blocks.route('/subscription'),
        url: 'views/pages/subscription.html'
    },
    init: function () {
    },
    routed: function (params) {
        var that = this;
        if(is_login_view()) {
            App.Header.set_title("Suscripción");
            App.Header.set_show_back(true);
            preload();
            this.email(current_user().email);
            this.name(current_user().fullname);
            api('subscription', function( res ) {
                that.subscribed(res.subscribed);
                that.subscription(res.subscription);
                preload(1);
            }, false);
        }
    },
    click_subscribe: function(){
        preload3();
        api(get_params('subscription_actions', {action: 'subscribe', name: this.name(), email: this.email()}), function( res ) {
            if(res.error){
                alert_error(res.error)
            }else{
                alert_info(res.notice);
            }
            get_route('home', false, true);
            preload3(1);
        });
    },
    click_un_subscribe: function(){
        preload3();
        api(get_params('subscription_actions', {action: 'un_subscribe', id: this.subscription().id}), function( res ) {
            if(res.error){
                alert_error(res.error)
            }else{
                alert_info(res.notice);
            }
            get_route('home', false, true);
            preload3(1);
        });
    },
    email: blocks.observable(''),
    name: blocks.observable(''),
    subscribed: blocks.observable(false),
    subscription: blocks.observable({}),
    un_subscription_url: blocks.observable()
});

/*--------------------------------------------------------------------------------------------------------------------*/

/**
 * Page: Message Erros
 */

App.View('Message', {
    dom: $('#view_message'),
    options: {
        route: blocks.route('/message'),
        url: 'views/pages/message.html'
    },
    init: function () {
    },
    routed: function (params) {
        var that = this;
        this.dom.removeClass('none');
        hide_init_preload();
        preload(1);
    },
    message: blocks.observable('')
});

/*--------------------------------------------------------------------------------------------------------------------*/

/**
 * Page: Error 500
 */


App.View('Error500', {
    dom: $('#view_error_500'),
    options: {
        route: blocks.route('/error_500'),
        url: 'views/pages/error_500.html'
    },
    init: function () {
    },
    message: blocks.observable(''),
    routed: function () {
        this.dom.removeClass('none')
        preload3(1);
    }
});

/*--------------------------------------------------------------------------------------------------------------------*/

/**
 * Page: SendEmail
 */


App.View('ShareEmail', {
    dom: $('#view_share_email'),
    options: {
        route: blocks.route('/share_email/{{page_id}}/{{section_id}}').optional('section_id'),
        url: 'views/pages/share_email.html'
    },
    init: function () {
    },
    routed: function (params) {
        var that = this;
        App.Header.set_title("Compartir");
        App.Header.set_show_back(true);
        this.attachs.removeAll();
        preload();
        api(get_params('share_email', {page_id: params.page_id, section_id: params.section_id, return_users: that.users().length == 0}), function( res ) {
            if(res.error){
                alert_error(res.error)
            }else{
                if(params.section_id)
                    App.Header.set_title("Compartir sección: "+ res.section.title);
                else
                    App.Header.set_title("Compartir: "+ res.page.title);
                that.set_users(res.users);
                that.post(res.page);
                that.section(res.section);
            }
            preload(1);
        });
    },
    users: blocks.observable([]),
    set_users: function(users){
        var that = this;
        if(users && this.users().length == 0){
            this.users.removeAll();
            this.users.addMany(users);
            this.dom.find('#select_users').selectivity({
                //items: ['Amsterdam', 'Antwerp'/*, ...*/],
                multiple: true,
                placeholder: 'Seleccionar usuarios'
            });
            this.dom.find('.tokenfield').tokenfield({createTokensOnBlur: true}).on('tokenfield:createdtoken', function (e) {
                // Über-simplistic e-mail validation
                var re = /\S+@\S+\.\S+/
                var valid = re.test(e.attrs.value)
                if (!valid) {
                    $(e.relatedTarget).addClass('invalid')
                }
            });
            this.dom.find('textarea.form-control').summernote({
                lang: 'es-ES',
                minHeight: 180,
                height: 200,
                toolbar: [
                    ["font", ["bold", "underline", "clear"]],
                    ["color", ["color"]],
                    ["para", ["ul", "ol", "paragraph"]],
                    ["insert", ["link", "picture", "file_upload"]]
                ],
                callbacks: {
                    onImageUpload: function(files) {
                        that.sendFile(files[0]);
                    },
                    onFileUpload: function(files) {
                         that.addFileAttach(files[0]);
                    }
                }
            }).on('summernote.change', function(we, contents, $editable) {
                that.content_textarea(we.currentTarget.value)
            });
        }
        this.dom.find('#select_users').selectivity('clear');
        this.dom.find('.tokenfield').tokenfield('setTokens', '');
        this.dom.find('textarea.form-control').summernote('code', '');
    },
    content_textarea: blocks.observable(''),
    post: blocks.observable({}),
    section: blocks.observable({}),
    attachs: blocks.observable([]),
    click_send: function(){
        preload3();
        var re = /\S+@\S+\.\S+/
        var emails = this.dom.find('.tokenfield').tokenfield('getTokensList').replace(/ /g,'').split(',').filter(function(str_email){
            return re.test(str_email) && true;
        });
        api_post(get_params('share_email_send', {page_id: this.post().id, page_title: this.post().title, section_id: this.section().id, section_title: this.section().title}), {content: this.content_textarea(), emails: emails, users: this.dom.find('#select_users').selectivity('data').map(function(us){ return us.id }), attachs: this.attachs()}, function( res ) {
            if(res.error){
                alert_error(res.error)
            }else{
                alert_success(res.notice)
                window.history.back()
            }
            preload3(1);
        });
    },
    sendFile: function(file) {
        var that = this;
        var data = new FormData();
        data.append("file", file);
        preload3();
        $.ajax({
            data: data,
            type: "POST",
            url: get_url(get_params('upload', { type: 'image'})),
            cache: false,
            contentType: false,
            processData: false,
            success: function(res) {
                //editor.insertImage(welEditable, url);
                if(res.file){
                    that.dom.find('textarea.form-control').summernote('insertImage', res.file, res.filename);
                }else{
                    alert_error(res.error);
                }
                preload3(1);
            }
        });
    },
    addFileAttach: function(file) {
        var that = this;
        var data = new FormData();
        data.append("file", file);
        preload3();
        $.ajax({
            data: data,
            type: "POST",
            url: get_url(get_params('upload', { type: 'file'})),
            cache: false,
            contentType: false,
            processData: false,
            success: function(res) {
                if(res.file){
                    that.attachs.add(res)
                }else{
                    alert_error(res.error);
                }
                preload3(1);
            }
        });
    }
});

/*--------------------------------------------------------------------------------------------------------------------*/

/**
 * Page: Preselection
 */

App.View('Presentation', {
    dom: $('#view_presentation'),
    options: {
        route: blocks.route('/presentation'),
        url: 'views/pages/presentation.html'
    },
    init: function () {
    },
    routed: function () {
        var that = this;
        this.dom.removeClass('none');
        that.images.addMany([
            {img: "img/presentation/image01.jpg", descr: "Visualizarás información sobre los últimos lanzamientos en productos, servicios y promociones."} ,
            {img: "img/presentation/image18.jpg", descr: "Podras acceder directamente a la información más importante, organizada por temática y tendrás a disposición las herramientas propias de la aplicación."} ,
            {img: "img/presentation/image23.jpg", descr: "Te informarás de las últimas actualizaciones realizadas en el Sistema de Conocimiento sobre productos, servicios y promociones."} ,
            {img: "img/presentation/image30.jpg", descr: "Podrás gestionar tu propia información organizando tus directorios de forma personalizada."} ,
            {img: "img/presentation/image35.jpg", descr: "Visualizarás preguntas con respuestas sobre varias temáticas de tu interés."} ,
            {img: "img/presentation/image42.jpg", descr: "Identificarás elementos en el artículo que mejoran tu experiencia en la navegación"} ,
            {img: "img/presentation/image47.jpg", descr: "Podrás navegar por las secciones del artículo para acceder directamente a la información"} ,
            {img: "img/presentation/image52.jpg", descr: ""}]
        );
        that.images.add({img: "img/presentation/image01.jpg", descr: ""});
        that.link_more("");
        setTimeout(function(){
            that.dom.find('.owl-carousel').imagesLoaded( function() {
                that.dom.find(".owl-carousel").owlCarousel({
                    navigation: true,
                    navigationText : ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>'],
                    autoPlay: false,
                    //pagination : false,
                    slideSpeed : 300,
                    paginationSpeed : 400,
                    singleItem:true,
                    items : 1,
                    //autoHeight: true,
                    lazyLoad : false,
                    afterMove: function(a){
                        that.is_last(this.currentItem == that.images().length - 1);
                        that.is_first(this.currentItem == 0);
                    }
                });
                preload(1);
                $("#view_presentation").on("click", ".item .btn-purple", function(){
                    if(!$(this).hasClass('open')){
                        $(this).prev().animate({height: 120});
                        $(this).addClass('open').find("i").removeClass('fa-arrow-down').addClass('fa-arrow-up');
                    }else{
                        $(this).prev().animate({height: 0});
                        $(this).removeClass('open').find("i").removeClass('fa-arrow-up').addClass('fa-arrow-down');
                    }
                });
            });
        }, 400);
    },
    routed_out: function(){
        var owl = this.dom.find(".owl-carousel").data('owlCarousel');
        if( owl ) owl.destroy();
        this.images.removeAll();
        this.is_first(true);
        this.is_last(false);
    },
    reload: function(){
        this.routed_out();
        this.routed();
    },
    run_back: function(){
        if(window.history.length > 1)
            window.history.back();
        else
            this.route('home')
    },
    images: blocks.observable([]),
    link_more: blocks.observable("http://conocimiento.nuevatel.com"),
    is_last: blocks.observable(false),
    is_first: blocks.observable(true)
});

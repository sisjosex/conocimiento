/**
 * Created by Froilan on 25/11/2015.
 */
// Models js
var Post = App.Model({
    id: App.Property(),
    title: App.Property({defaultValue: 'No found'}),
    keywords: App.Property({ defaultValue: ''}),
    content: App.Property({defaultValue: '' }),
    summary: App.Property({defaultValue: '' }),
    thumbnail: App.Property({defaultValue: '' }),
    created_at: App.Property({defaultValue: '' }),
    updated_at: App.Property({defaultValue: '' }),
    date_expiration: App.Property({defaultValue: '' }),

    post_type_title: App.Property({defaultValue: '' }),
    post_type_key: App.Property({defaultValue: '' }),

    section_of: App.Property({defaultValue: ''}),

    page_visits_count: App.Property({defaultValue: 0}),
    page_ratings_count: App.Property({defaultValue: 0}),
    page_ratings_counter: App.Property({defaultValue: 0}),
    page_likes_count: App.Property({defaultValue: 0}),
    page_follows_count: App.Property({defaultValue: 0}),

    owner: App.Property({defaultValue: {}}),
    options: App.Property({defaultValue: {}}),
    label: App.Property({defaultValue: {}}),
    is_important: App.Property({defaultValue: false}),

    on_click: function(){
        alert(this.title())
    }
});

var PostType = App.Model({
    title: App.Property({
        defaultValue: 'No found'
    }),
    page_attrs: App.Property(),
    // page_visits_count: App.Property({defaultValue: 0}),
    on_click: function(){
        alert(this.title())
    }
});

var Category = App.Model({
    title: App.Property({
        defaultValue: 'No found'
    }),
    category_visits_count: App.Property({defaultValue: 0}),
    category_pages_count: App.Property({defaultValue: 0}),
    category_follower_count: App.Property({defaultValue: 0}),
    on_click: function(){
        alert(this.title())
    }
});

/*--------------------------------------------------------------------------------------------------------------------*/

/**
 * Page: Page or Post
 */

App.View('Page', {
    dom: $('#view_page'),
    options: {
        route: blocks.route('/page/{{key}}/{{section_id}}').optional('section_id'),
        url: 'views/content/page.html'
    },
    init: function () {
        var that = this;
    },
    params: {},
    routed: function (params) {
        if(is_login_view()) {
            var that = this;
            that.params = params;
            preload();
            api(get_params('post', isNumber(params.key) ? {id: params.key, server_status: true} : {key: params.key, server_status: true}), function (res) {
                hide_init_preload();
                preload(1);
                if (res.post) {
                    App.Header.set_title(res.post.title);
                    App.Header.set_buttons([]);
                    App.Header.set_show_back(true);
                    that.post.reset(res.post);
                    that.values({rating: res.post.user_values.rating ? res.post.page_ratings_count : 0});
                    that.user_values(res.post.user_values);
                    that.sections.removeAll();
                    that.sections.addMany(res.post.sections);
                    that.faqs.removeAll();
                    that.faqs.addMany(res.post.faqs);
                    that.download_files.removeAll();
                    that.download_files.addMany(res.post.download_files.map(function (f) {
                        f.file = get_url({download: {page_id: res.post.id, attach_id: f.id}}, {filename: f.filename}, true);
                        return f
                    }));
                    that.comments.removeAll();
                    that.comments.addMany(res.post.comments);
                    that.breadcrumb.removeAll();
                    that.breadcrumb.addMany(res.post.breadcrumb);
                    that.related_articles.removeAll();
                    that.related_articles.addMany(res.post.related_articles);
                    that.permissions(res.post.permissions);
                    // filter html
                    that.dom.find('.post_content').each(function(){
                        $(this).html($(this).html());
                    });
                    // filter content
                    that.dom.find('.post_content p, .sections p').each(function(){
                        if(!$(this).html()){
                            $(this).html('<br>')
                        }
                    });
                    // filter tables: html -> html5
                    that.dom.find('.post_content, .sections .content_section').find('td[bgcolor], th[bgcolor]').each(function(){
                        $(this).css('background-color',$(this).attr('bgcolor'));
                    });
                    that.dom.find('.post_content, .sections .content_section').find('td[align], th[align]').each(function(){
                        $(this).css('text-align',$(this).attr('align'));
                    });
                    that.dom.find('.post_content, .sections .content_section').find('td[valign], th[valign]').each(function(){
                        $(this).css('vertical-align',$(this).attr('valign'));
                    });
                    that.dom.find('.post_content table, .sections .content_section table').css('height','auto');
                    // filter images
                    that.dom.find('.post_content img, .sections .content_section img').each(function(){
                        var $this = $(this);
                        $this.load(function(){
                            $this.css({'display': ($this.width() > 80)? 'block' :'inline-block', 'margin-left': 'auto', 'margin-right' : 'auto'});
                        });
                        if($this.attr('width')) $this.css('width', parseInt($this.attr('width')) + (s.include($this.attr('width'),'%') ? '%' : 'px'));
                        if($this.attr('height')) $this.css('height', parseInt($this.attr('height')) + (s.include($this.attr('height'),'%') ? '%' : 'px'));
                        if($this.attr('vspace')){
                            $this.css('margin-top', parseInt($this.attr('vspace')) + 'px');
                            $this.css('margin-bottom', parseInt($this.attr('vspace')) + 'px');
                        }
                    });

                    // add index page
                    var indices = that.dom.find('.post_content:first').find("hr.section-index");
                    if (indices.length > 0) {
                        var pi = $("<ul class='indexes_list before_delete'></ul>");
                        that.dom.find('.post_content:first').prepend(pi);
                        pi.before("<h3 class='before_delete' >Indice</h3>");
                        create_page_index(pi, indices);
                    }

                    //label post
                    if(res.post.label && Object.keys(res.post.label).length){
                        that.dom.find('#status_label').remove();
                        that.dom.find('.box_header:first').after('<label id="status_label" style="display: block; font-size: 21px; padding: 11px 0; border-radius: 2px; margin: 2px 0 0;" class="label label-'+res.post.label.class+'">'+res.post.label.title.toUpperCase()+'</label>');
                    }

                    if(res.post.faqs.length == 0) $("#accordion_questions").addClass('hidden');
                    else $("#accordion_questions").removeClass('hidden');

                    // filter links
                    that.dom.find('.post_content a, .sections .content_section a').not('.not').each(function () {
                        var $a = $(this).attr('target', '_blank');
                        var href = $a.attr('href') || '';
                        if(href != '#' && !$a.attr('data-toggle')){
                            if (s.include(href, "#")) { // && !is_url(href)
                                $a.click(function () {
                                    scroll_to(s.strRightBack(href, '#'));
                                    return false;
                                })
                            } else {
                                $a.attr('href', fix_url(href));
                            }
                        }
                    });
                    // add table responsive
                    that.dom.find('.post_content table, .sections .content_section table').each(function () {
                        $(this).wrap('<div class="table-responsive"></div>');
                        $(this).before('<a class="active_full_screen"><i class="fa fa-arrows-alt"></i></a>');
                    });

                    // delay actions
                    setTimeout(function(){
                        // filter index
                        that.dom.find('#page_index a[data-target]').click(function(){
                            scroll_to($(this).attr('data-target'));
                            var $target = $('#' + $(this).attr('data-target'));
                            if($target.hasClass('collapsed')) $target.click();
                        });

                        // show all accordions
                        that.dom.find('.panel-collapse:not(".in")').collapse('show');
                    }, 500);

                    // show section
                    if (params.section_id) {
                        that.dom.find('#section_collapse_' + params.section_id).collapse('show');
                        scroll_to('page_section_' + params.section_id);
                    }

                    // run rating
                    that.dom.find(".basic").empty().jRating({
                        step: true,
                        rateMax: 5,
                        isDisabled: res.post.user_values.rating,
                        sendRequest: false,
                        showRateInfo: false,
                        onClick: function (elem, rate) {
                            api(get_params('post_add_rating', {
                                post_id: that.post.id(),
                                rate: rate
                            }), function (res) {
                                if (res.error) {
                                    alert_error(res.error)
                                } else {
                                    that.post.page_ratings_counter(res.counter);
                                    alert_info(res.notice)
                                }
                            });
                        }
                    });
                    // filter iframes
                    that.dom.find('.post_content iframe:not(.use_plugin), .sections .content_section iframe:not(.use_plugin)').each(function(){
                        var url_iframe = $(this).attr('src');
                        $(this).before('<a href="' + url_iframe + '" target="_blank" class="btn btn-purple"><i class="fa fa-cloud-download"></i>&nbsp; Descargar archivo insertado</a>');
                        $(this).remove();
                    });
                    // load images
                    that.dom.find("img.lazy").lazyload();

                    // run comments
                    if(that.permissions().can_comments){
                        that.dom.find('#comment_title').unbind().click(function(){
                            $(this).toggleClass('is_show');
                            that.dom.find('#comment_content').toggle();
                            that.dom.find('#post_comments form textarea.form-control').summernote({
                                //imageUpload: get_url(get_params('upload', {post_id: that.post.id(), type: 'image'})),
                                //plugins: ['my_upload'],
                                lang: 'es-ES',
                                minHeight: 160,
                                height: 180,
                                focus: false,
                                toolbar: [
                                    ["style", ["style"]],
                                    ["font", ["bold", "underline", "clear"]],
                                    ["color", ["color"]],
                                    ["para", ["ul", "ol", "paragraph"]],
                                    ["insert", ["link", "picture", "video", "file_upload"]]
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
                                that.textarea_comment(we.currentTarget.value)
                            })
                        })
                    }

                    // run image full screen
                    if(!upload_message_fallback()) that.dom.find('.show_full_screen').viewer({toolbar: false});

                    // run popup rating
                    if((!res.post.user_values.rating || !res.post.user_values.liked) && !_.contains(show_page_rating(), res.post.id)){
                        that.visible_popup_rate(false);
                        setTimeout(function(){
                            $(window).unbind('scroll').scroll(function()
                            {
                                if (document.body.scrollHeight - $(this).scrollTop()  <= $(this).height()){
                                    $(this).unbind('scroll');
                                    that.visible_popup_rate(true);
                                    show_page_rating(res.post.id)
                                }
                            });
                        }, 2500);

                        that.dom.find('input:checkbox').not('.rendered').addClass('rendered').simpleCheckbox({
                            onClick: function(value){
                                that.click_liked_page();
                            }
                        });
                        that.dom.find(".popup_rating").empty().jRating({
                            step: true,
                            rateMax: 5,
                            isDisabled: res.post.user_values.rating,
                            sendRequest: false,
                            showRateInfo: false,
                            onClick: function (elem, rate) {
                                that.dom.find(".basic select").barrating('set', rate).barrating('readonly', true);
                                that.dom.find(".popup_rating select").barrating('readonly', true);
                            },
                            onHover: function (elem, rate) {
                                log(rate)
                            }
                        });
                    }
                    App.Footer.hide()
                } else {
                    alert_error('Página no encotrada o no autorizada.')
                    App.Home.route("home");
                }
            });
        }
    },
    routed_out: function(){
        this.textarea_comment('');
        this.visible_popup_rate(false);
        this.post.reset({title: '', content: ''});
        this.comments.removeAll();
        this.sections.removeAll();
        this.faqs.removeAll();
        this.attachs.removeAll();
        if(!upload_message_fallback()) this.dom.find('.show_full_screen').viewer('destroy');
        this.dom.find('#comment_content').hide();
        this.dom.find('.post_content').html('');
        this.dom.find('.post_content .before_delete').remove();
        $(window).unbind('scroll');
        if(this.permissions().can_comments && !!this.dom.find('#post_comments form textarea.form-control').data('summernote')){
            this.dom.find('#post_comments form textarea.form-control').summernote('code', '');
        }
        App.Footer.show();
    },
    reload: function(){
        this.routed_out();
        this.routed(this.params);
    },
    post: Post(),
    values: blocks.observable({}),
    user_values: blocks.observable({}),
    sections: blocks.observable([]),
    faqs: blocks.observable([]),
    permissions : blocks.observable({}),
    download_files: blocks.observable([]),
    comments: blocks.observable([]),
    breadcrumb: blocks.observable([]),
    related_articles: blocks.observable([]),
    textarea_comment: blocks.observable(''),
    visible_popup_rate: blocks.observable(false),
    hidden_popup_rate: function(){
        this.visible_popup_rate(false);
    },
    click_bookmark_page: function(){
        var that = this;
    },
    click_liked_page: function(){
        var that = this;
        var old = that.user_values();
        preload3();
        api(get_params('post_liked', {post_id: that.post.id(), liked: old.liked}), function( res ) {
            if(res.error){
                alert_error(res.error);
            }else{
                old.liked = !old.liked;
                that.user_values.update(old);
                that.post.page_likes_count(res.counter);
                alert_info(res.notice);
            }
            preload3(1);
        });
        return false;
    },
    click_followed_page: function(){
        var that = this;
        var old = that.user_values();
        preload3();
        api(get_params('post_followed', {post_id: that.post.id(), followed: old.followed}), function( res ) {
            if(res.error){
                alert_error(res.error)
            }else{
                alert_info(res.notice);
            }
            preload3(1);
        });
        return false;
    },
    event_send_comment: function(){
        var that = this;
        preload3();
        api_post(get_params('post_add_comment', {post_id: that.post.id()}), {comment: that.textarea_comment(), attachments: that.attachs().map(function(a){ return a.path})}, function( res ) {
            if(res.error){
                alert_error(res.error)
            }else{
                alert_info(res.notice);
                that.dom.find('#post_comments form textarea.form-control').summernote('code', '');
                that.textarea_comment('');
                that.attachs.removeAll();
            }
            preload3(1);
        });
    },
    click_export: function(e,a){
        preload3();
        var ar = a.split('-');
        var type = ar[0];
        var section_id = ar[1] ? ar[1] : null;
        preload3(1);
        var lobibox = alert_info('Preparando la descarga...', 50000);
        api(get_params('post_export', {id: this.post.id(), export: type, export_section: section_id}), function( res ) {
            lobibox.remove();
            if(res.error){
                alert_error(res.error)
            }else{
                download_file(res.url, res.filename);
            }
        });
    },
    attachs: blocks.observable([]),
    delete_comment_attach: function(e, index){
        this.attachs.removeAt(index);
    },
    sendFile: function(file) {
        var that = this;
        var data = new FormData();
        data.append("file", file);
        preload3();
        $.ajax({
            data: data,
            type: "POST",
            url: get_url(get_params('upload', {post_id: that.post.id(), type: 'image'})),
            cache: false,
            contentType: false,
            processData: false,
            success: function(res) {
                //editor.insertImage(welEditable, url);
                if(res.file){
                    that.dom.find('#post_comments form textarea.form-control').summernote('insertImage', res.file, res.filename);
                }else{
                    alert_error(res.error)
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
            url: get_url(get_params('upload', { post_id: that.post.id(), type: 'file'})),
            cache: false,
            contentType: false,
            processData: false,
            success: function(res) {
                if(res.file){
                    log(res)
                    that.attachs.add(res)
                }else{
                    alert_error(res.error);
                }
                preload3(1);
            }
        });
    },
});

/*--------------------------------------------------------------------------------------------------------------------*/

/**
 * Page: Category
 */

App.View('Category', {
    dom: $('#view_category'),
    slider: false,
    filter_params: {},
    options: {
        route: blocks.route('/category/{{id}}/{{args}}').optional('args'),
        url: 'views/content/category.html'
    },
    init: function () {
    },
    routed: function (params) {
        if(is_login_view()){
            preload();
            var that = this;
            $('html').infiniteScrollHelper({
                loadMore: function(page, done) {
                    if(page > 1) preload_scroll();
                    that.filter_params = $.extend(params.args ? params.args.unparam() : {}, {id: params.id, page: page, server_status: true});
                    api(get_params('category', that.filter_params), function( res ) {
                        hide_init_preload();
                        preload_scroll(1);
                        preload(1);
                        if(res.error){
                        }else{
                            if(page == 1){
                                var sliders = that.dom.find('.slider');
                                var owl = sliders.data('owlCarousel');
                                if(owl) owl.destroy();
                                App.Header.set_title(res.category.name);
                                App.Header.set_buttons([]);
                                App.Header.set_show_back(true);
                                that.sort_by(that.filter_params.sort_by || '');
                                that.order_by(that.filter_params.order_by || 'desc');
                                that.category.reset(res.category);
                                that.post_first.reset(_.first(res.pages) || {});
                                that.posts.removeAll();
                                that.children.removeAll();
                                that.children.addMany(res.children);
                                that.user_values(res.category.user_values);
                                that.permissions(res.category.permissions);
                                that.dom.find('.pt_header_posts').trigger('detach.ScrollToFixed').scrollToFixed({
                                    zIndex: 99,
                                    marginTop: function(){
                                        return $('header.header').height();
                                    }});
                                var sliders = that.dom.find('.slider');
                                var owl = sliders.data('owlCarousel');
                                if(owl) owl.destroy();
                                if(sliders.size() > 0) {
                                    that.slider = sliders.owlCarousel({ //
                                        navigation : true,
                                        pagination: false,
                                        navigationText: ['<i class="fa fa-chevron-left"></i>','<i class="fa fa-chevron-right"></i>'],
                                        itemsCustom: (function(){
                                            var arr = [];
                                            for(i=0; i< 16; i++){
                                                arr.push([i*125, i])
                                            }
                                            return arr;
                                        })()
                                    });
                                }
                                that.dom.find('.slider .title').trunk8({lines: 2, tooltip: false});
                            }
                            that.posts.addMany(res.pages);
                            that.dom.find("img.lazy").lazyload();
                            if(res.pagination.is_last)$('html').infiniteScrollHelper('destroy');
                        }
                        done();
                        App.Header.set_show_back(true);
                    });
                },
                bottomBuffer: 200,
                // using the triggerInitialLoad option
                triggerInitialLoad: true
            })
        }
    },
    post_first:  Post(),
    category: Category(),
    posts:  App.Collection(Post)(),
    children:  App.Collection(Category)(),
    user_values: blocks.observable({}),
    permissions : blocks.observable({}),
    sort_by: blocks.observable(''),
    order_by: blocks.observable('desc'),
    click_followed_category: function(){
        var that = this;
        var old = that.user_values();
        preload3();
        api(get_params('category_followed', {category_id: that.category.id(), followed: old.followed}), function( res ) {
            if(res.error){
                alert_error(res.error)
            }else{
                alert_info(res.notice);
            }
            preload3(1);
        });
        return false;
    },
    change_order: function(){
        setTimeout(function () {
            get_route('category/' + this.filter_params.id, $.extend(this.filter_params, {page: 1, sort_by: this.sort_by(), order_by: this.order_by()}), true);
        }.bind(this));
    }
});

/*--------------------------------------------------------------------------------------------------------------------*/

/**
 * Page: PostType
 */
App.View('PostType', {
    dom: $('#view_post_type'),
    options: {
        route: blocks.route('/post_type/{{args}}'),   //.optional('category_id')
        url: 'views/content/post_type.html'
    },
    init: function () {
    },
    slider: false,
    filter_params: {},
    routed: function (params) {
        if(is_login_view()){
            var that = this;
            preload();
            $('html').infiniteScrollHelper({
                loadMore: function(page, done) {
                    if(page > 1) preload_scroll();
                    that.filter_params = $.extend(params.args ? params.args.unparam() : {}, {type: params.type, page: page, server_status: true});
                    api(get_params('post_type', that.filter_params), function( res ) {
                        if(res.error){
                        }else{
                            if(page == 1){
                                var sliders = that.dom.find('.slider');
                                var owl = sliders.data('owlCarousel');
                                if(owl) owl.destroy();
                                App.Header.set_title(res.title);
                                App.Header.set_buttons([]);
                                that.set_buttons(res.buttons);
                                App.Header.set_show_back(true);
                                that.sort_by(that.filter_params.sort_by || '');
                                that.order_by(that.filter_params.order_by || 'desc');
                                that.post_first.reset(res.page_first);
                                that.posts.removeAll();
                                that.categories.removeAll();
                                that.categories.addMany(res.categories);
                                that.use_category(res.use_category);
                                that.dom.find('.pt_header_posts').trigger('detach.ScrollToFixed').scrollToFixed({
                                    zIndex: 99,
                                    marginTop: function(){
                                        return $('header.header').height();
                                    }});
                                if(sliders.size() > 0) {
                                    that.slider = sliders.owlCarousel({ //
                                        navigation : true,
                                        pagination: false,
                                        navigationText: ['<i class="fa fa-chevron-left"></i>','<i class="fa fa-chevron-right"></i>'],
                                        itemsCustom: (function(){
                                            var arr = [];
                                            for(i=0; i< 16; i++){
                                                arr.push([i*125, i])
                                            }
                                            return arr;
                                        })()
                                    });
                                }
                                that.dom.find('.slider .title').trunk8({lines: 2, tooltip: false});
                            }
                            that.posts.addMany(res.pages);
                            that.dom.find("img.lazy").lazyload();
                            if(res.pagination.is_last)$('html').infiniteScrollHelper('destroy');
                        }
                        done();
                        hide_init_preload();
                        preload(1);
                        preload_scroll(1);
                    });
                },
                bottomBuffer: 200,
                // using the triggerInitialLoad option
                triggerInitialLoad: true
            })
        }
    },
    post_type: PostType(),
    posts:  App.Collection(Post)(),
    post_first:  Post(),
    categories:  App.Collection(Category)(),
    buttons: blocks.observable([]),
    use_category: blocks.observable(false),
    set_buttons: function(buttons){
        buttons = (buttons || []).map(function(o){
            o.url = get_route(o.type , o.args ? $.param(o.args) : '' );
            return o;
        });
        this.buttons.removeAll();
        this.buttons.addMany(buttons);
        //this.sub_buttons([]);
        this.dom.find('.nav-tab-drop .dropdown-menu').empty();
        this.dom.find('.responsive-tabs').tabdrop().trigger('resize');
    },
    sort_by: blocks.observable(''),
    order_by: blocks.observable('desc'),
    change_order: function(){
        setTimeout(function () {
            get_route('post_type', $.extend(this.filter_params, {page: 1, sort_by: this.sort_by(), order_by: this.order_by()}), true);
        }.bind(this));
    }
});

/*--------------------------------------------------------------------------------------------------------------------*/

/**
 * Page: Search
 */
App.View('Search', {
    dom: $('#view_search'),
    init: function () {
    },
    options: {
        route: blocks.route('/search/{{args}}').optional('args'),
        url: 'views/content/search.html'
    },
    ready: function(){
        var that = this;
    },
    routed: function (params) {
        if(is_login_view()){
            preload();
            var that = this;
            var params_data = params.args.unparam();
            this.params_data = params.args.unparam2();
            var text_search = decode(params_data.text);
            App.Header.set_title("Busqueda");
            App.Header.search_text(text_search);
            App.Header.set_show_back(true);
            App.Header.set_buttons();
            App.Header.show_search(true);
            App.Header.set_hide_adv();
            $('html').infiniteScrollHelper({
                loadMore: function(page, done) {
                    if(page > 1) preload_scroll();
                    var startTime = new Date();
                    var startMsec = startTime.getTime();
                    api(get_params('search2', $.extend({page: page, server_status: true}, params_data)), function( res ) {
                        if(page == 1){
                            // time response
                            startTime = new Date();
                            startMsec = startTime.getTime() - startMsec;
                            that.search_time((startMsec/1000).toFixed(2));
                            that.search_text(text_search);
                            App.Header.search_text_root(text_search);
                            that.total_search(res.pagination.total);
                            // App.Header.set_title("Resultados (" + res.pagination.total + ")");
                            that.posts.removeAll();
                            that.categories.removeAll();
                            that.attached_files.removeAll();
                            that.categories.addMany(res.categories);
                            that.attached_files.addMany(res.attached_files.map(function(obj){ obj.file = get_url({download: {page_id: obj.page_id, attach_id: obj.id}}, {filename: obj.filename}, true); return obj }));
                            that.show_tabs(res.in_cat || res.in_adj);
                            that.in_cat(res.in_cat);
                            that.in_adj(res.in_adj);
                            that.dom.find('.nav-tabs a:first').tab('show');
                            $('#search_top').focusout().typeahead('close');
                            //that.dom.find('#form_search_advanced').formFieldValues(that.params_data);
                            hide_init_preload();
                            preload(1);
                        }
                        that.posts.addMany(res.pages);
                        that.dom.find("img.lazy").lazyload();
                        that.decorate_texts(text_search);
                        if(res.pagination.is_last)$('html').infiniteScrollHelper('destroy');
                        done()
                        preload_scroll(1);
                    });
                },
                bottomBuffer: 200,
                // using the triggerInitialLoad option
                triggerInitialLoad: true
            })
        }
    },
    params_data: {},
    show_tabs: blocks.observable(false),
    in_cat: blocks.observable(false),
    in_adj: blocks.observable(false),
    categories: blocks.observable([]),
    attached_files: blocks.observable([]),
    total_search: blocks.observable(0),
    search_text: blocks.observable(''),
    posts: App.Collection(Post)(),
    decorate_texts: function(text_search){
        //this.dom.find('#search_content p:not(.trunked)').trunk8({lines: 4, tooltip: false}).addClass('trunked');
        this.dom.find("#search_content p:not(.highlighted), #search_content h4:not(.highlighted)").highlight(s.clean(text_search).split(' '), { wordsOnly: true}).addClass('highlighted');
    },
    search_time: blocks.observable(0)
});


/**
 * function aux
 */
var create_page_index = function(page_index, items, level) {
    var pending;
    if (level == null) {
        level = 1;
    }
    pending = $();
    items.each(function() {
        var aux, item, parent_id;
        $(this).attr("id", $(this).data("key"));
        parent_id = $(this).data("parent");
        item = "<li><a href='#" + this.id + "'> " + $(this).data("title") + "</a></li>";
        if (parent_id === "") {
            return page_index.append(item);
        } else {
            aux = page_index.find("a[href='#" + parent_id + "']").eq(0);
            if (aux.size()) {
                if (!aux.closest("li").children("ul").size()) {
                    aux.closest("li").append("<ul></ul>");
                }
                return aux.closest("li").children("ul").append(item);
            } else {
                return pending.add(this);
            }
        }
    });
    if (pending.size() && level < 20) {
        return create_page_index(page_index, pending, level++);
    }
};
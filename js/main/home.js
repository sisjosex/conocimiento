/**
 * Created by Froilan on 25/11/2015.
 */

/*--------------------------------------------------------------------------------------------------------------------*/

/**
 * Page: Home
 */

App.View('Home', {
    dom: $('#view_home'),
    options: {
        route: blocks.route('/home'),
        url: 'views/home.html'
    },
    init: function () { // return;
    },
    routed: function (params) {
        if(is_login_view()){
            var that = this;
            App.Header.set_title('');
            App.Header.set_show_back(false);
            App.Header.set_buttons([]);
            show_init_preload();
            preload();
            api(get_params('home', {limit: 4, server_status: true}), function( res ) {
                if( that.dom.find("#owl-slide").hasClass('slick-initialized') ) that.dom.find("#owl-slide").slick('unslick');
                that.dom.find(".owl-slide-posts").each(function(){
                    var owl = $(this).data('owlCarousel');
                    if( owl ) owl.destroy();
                });
                that.panels.removeAll();
                that.panels.addMany(res.panels.map(function(r){
                    var posts = r.posts;
                    r.posts = App.Collection(Post)();
                    r.posts.removeAll();
                    r.posts.addMany(posts);
                    return r;
                }));
                that.slider_posts.removeAll();
                that.slider_posts.addMany(res.home_slide_posts);
                if(res.home_slide_posts.length > 0){
                    that.slider_post_type(res.home_slide_posts[0].post_type_key)
                }
                resize_app();
                that.dom.find('#owl-slide img:first').imagesLoaded( function() {
                    that.dom.find("#owl-slide").slick({
                        adaptiveHeight: true,
                        autoplay: true,
                        dots: true,
                        arrows: false,
                        autoplaySpeed: 8000
                    });
                });
                that.dom.find(".owl-slide-posts").owlCarousel({
                    navigation : false,
                    slideSpeed : 300,
                    paginationSpeed : 400,
                    autoHeight: true,
                    lazyLoad : true,
                    itemsCustom: (function(){
                        var arr = [];
                        for(i=0; i< 4; i++){
                            arr.push([i*320, i])
                        }
                        return arr;
                    })()
                });
                that.menu.removeAll();
                that.menu.addMany(res.menu);
                that.dom.find("img.lazy").lazyload();
                hide_init_preload();
                preload(true);
                that.dom.find(".div_expand_row li").css({width: Math.floor(100/res.menu.length)+"%", display: 'block', float: 'left'});
            }, false);
        }
    },
    slider_posts: blocks.observable([]),
    slider_post_type: blocks.observable(null),
    slider: blocks.observable([]),
    panels: blocks.observable([]),
    menu: blocks.observable([])
});
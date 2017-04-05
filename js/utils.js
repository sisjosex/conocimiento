/**
 * Created by Froilan on 23/06/2015.
 */

var log, l;

l = log = function(d){ console.log(d);};
var current_site = function(data){
    if(data) storage.set('current_site', data);
    return storage.get('current_site') || {}
};

var is_signin = function(){
    return !isEmpty(current_user()) && storage.get('session_expired') && new Date() <= new Date(storage.get('session_expired'))
};
var current_user = function(data){
    if(data){
        if(data["session_time_out"]) session_time_out = data["session_time_out"];
        storage.set('current_user', data)
        storage.set('session_expired', moment().add(session_time_out || 25, 'minutes').toDate());
    }
    return storage.get('current_user') || {}
};

var permissions_site = function(data){
    if(data) storage.set('permissions_site', data)
    return storage.get('permissions_site') || {}
};
var get_params = function(method, data){
    var obj = {};
    obj[method] = data;
    return obj;
};
var _enc = function(text){
    //return GibberishAES.enc(text, "password")
    return text;
}

var get_url = function(in_var, gets, session_in_get, on_encrypt){
    // define encrypt urls

    var obj =  {}

    if(typeof in_var == "string"){
        obj[in_var] = {}
    }else{
        obj = in_var;
    }

    gets = jQuery.extend({}, gets);

    var encrypt = false;
    if(on_encrypt) encrypt = true;

    var url = api_url;
    if(gets['filename']) url += gets['filename'];

    var c_site = $.trim(_enc( moment().format('x') + "_" + current_site().id ));
    var c_user = $.trim(_enc( moment().format('x') + "_" + current_user().id ));

    if(session_in_get){
        gets = jQuery.extend(gets, {
            site_id: c_site,
            user_id: c_user
        });
    }else{
        obj['session'] =  {
            site_id: c_site,
            user_id: c_user
        };
    }

    var str = JSON.stringify(obj);
    str = encrypt ? _enc(str) : (str);
    url += '?arg2='+encodeURIComponent(str);
    url += isEmpty(gets) ? '' : '&' + jQuery.param(gets);
    if(encrypt) url += '&_e=1';
    if(str.indexOf('"server_status"') > -1) url += '&_server_status=1';
    return url;
};


var api = function(params, callback, cache, on_encrypt, repeat_on_error){
    // get_url(['home_slider', get_params('get_pages', {method: ['articles','important_articles'], limit: 12})])
    var url = get_url(params, {_c: cache && true}, false, on_encrypt);
    if(is_signin()) storage.set('session_expired', moment().add(session_time_out || 25, 'minutes').toDate());
    if(_online){
        $.ajax({
            url: url,
            jsonp: "callback",
            dataType: "jsonp",
            method: "GET",
            cache: true,
            success: function( res ) {
                if(res.server_message) return window.show_message(res.server_message);
                if(callback) callback(res);
            },
            error: function (event, request, settings) {
                if(repeat_on_error) setTimeout(function(){ console.log('Trying again request for: ', params, " Error:", status); api(params, callback, cache, on_encrypt, repeat_on_error); }, 15*1000);
                else show_error_500(500);
            }
        })
    } else{
        show_error_500(404)
    }
};

var api_post = function(params, data, callback){
    var url = get_url(params, {_c: false}, false);
    if(_online) {
        $.ajax({
            url: url,
            jsonp: "callback",
            method: "POST",
            data: data || {},
            success: function( res ) {
                if(res.server_message) return window.show_message(res.server_message);
                if(callback) callback(res);
            },
            error: function (request, status, error) {
                show_error_500(500)
            }
        });
    }else{
        show_error_500(404)
    }
};

var get_route = function(type, item, redirect_to){
    if(typeof item === 'object') item = jQuery.param(item)
    var route = '#' + type;
    if(item) route += '/'+ item;
    if(!redirect_to) return route;
    window.location.assign(route);
};


var init_plugins = function($){
    // set values
    $.expr[":"].contains = $.expr.createPseudo(function(arg) {
        return function( elem ) {
            return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
        };
    });

    $(document).on('show.bs.tab', '.nav-tabs-responsive [data-toggle="tab"]', function(e) {
        var $target = $(e.target);
        var $tabs = $target.closest('.nav-tabs-responsive');
        var $current = $target.closest('li');
        var $parent = $current.closest('li.dropdown');
        $current = $parent.length > 0 ? $parent : $current;
        var $next = $current.next();
        var $prev = $current.prev();
        var updateDropdownMenu = function($el, position){
            $el
                .find('.dropdown-menu')
                .removeClass('pull-xs-left pull-xs-center pull-xs-right')
                .addClass( 'pull-xs-' + position );
        };

        $tabs.find('>li').removeClass('next prev');
        $prev.addClass('prev');
        $next.addClass('next');

        updateDropdownMenu( $prev, 'left' );
        updateDropdownMenu( $current, 'center' );
        updateDropdownMenu( $next, 'right' );
    });

    $(document).on('click','.active_full_screen', function(){
        var parent = $(this).parent();
        $(this).toggleClass('active');
        if($(this).hasClass('active')) parent.addClass('content_full_screen');
        else parent.removeClass('content_full_screen');
    })

    $(document).on('click','.twitter-typeahead .tt-menu .tt-dataset-titles .section_name', function(){
        $(this).parents('.twitter-typeahead').children('input').typeahead('close');
    });

    swal.setDefaults({ confirmButtonColor: '#957adb' });

    _.mixin(s.exports());

    blocks.queries.log = {
        preprocess: function (value) {
            this.html(print_r(value)).toString();
            //this.html(JSON.stringify(value)).toString();
        },
        update: function (value) {
            this.innerHTML = print_r(value).toString();
            //this.innerHTML = JSON.stringify(value).toString();
        }
    };

    window.resize_app = function(){
        //if(window.innerHeight / window.innerWidth > 1.2 || window.innerHeight / window.innerWidth < 0.8){
        var $html = $('html');
        if(window.innerWidth > window.innerHeight && window.innerWidth / window.innerHeight > 1.4){
            $html.addClass('landscape').removeClass('portrait')
        }else{
            $html.addClass('portrait').removeClass('landscape')
        }
        $('.pre_load_init .pre_load_content').css('width', Math.abs((window.innerHeight > window.innerWidth ? window.innerWidth :  window.innerHeight)*0.7) + 'px')
            .css('top', Math.abs(window.innerHeight*0.25) + 'px');

        var wi = $(window).width();
        var he = $(window).height();

        $html.removeClass('r_xxs r_xs r_sm r_md r_lg');
        $html.removeClass('o_xxs o_xs o_sm o_md o_lg');

        if (wi <= 480){
            $html.addClass('r_xxs o_xxs o_xs o_sm o_md o_lg')
        }
        else if (wi <= 767){
            $html.addClass('r_xxs r_xs o_xs o_sm o_md o_lg')
        }
        else if (wi <= 991){
            $html.addClass('r_xxs r_xs r_sm o_sm o_md o_lg')
        }
        else if (wi <= 1199){
            $html.addClass('r_xxs r_xs r_sm r_md o_md o_lg')
        }
        else {
            $html.addClass('r_xxs r_xs r_sm r_md r_lg o_lg')
        }

        //}
        if(he > 360){
            $('#footer').removeClass("sticked")
        }else{
            $('#footer').addClass('sticked');
        }

        // mav left
        var nav_w = $('section#nav_left').width();
        $('section#nav_left .back_bg').css({left: nav_w, width: wi + 480})


        $('.twitter-typeahead .tt-menu').css('max-height', (he - 160) + 'px');

        $('#view_home .owl-theme-1 img, #view_tools_manual .owl-theme-1 img').css('max-height', parseInt((he - 80)*0.8) + 'px');
        $('.content_panels_footer .panel_scroll').css('max-height', parseInt((he - 80)*0.8) + 'px');
        $('.nestable_bookmarks .box_setting').css('width', parseInt(wi - 40) + 'px');

    };

    $(window).on("resize orientationchange", resize_app);
    $container = $('#box-content');
    //storage = $.sessionStorage;
    storage = $.localStorage;

    $.fn.search_autocomplete = function(callback, callback2){
        /*options = $.extend({

         }, options || {});*/
        var $that = $(this);
        api('search_auto_complete', function( res ) {
            var titles = new Bloodhound({
                queryTokenizer: Bloodhound.tokenizers.whitespace,
                datumTokenizer: Bloodhound.tokenizers.whitespace,
                initialize: false,
                limit: 10,
                local: res.titles
            });
            var keywords = new Bloodhound({
                queryTokenizer: Bloodhound.tokenizers.whitespace,
                datumTokenizer: Bloodhound.tokenizers.whitespace,
                initialize: false,
                limit: 10,
                local: res.keywords
            });

            keywords.initialize();
            titles.initialize();
            $that.each(function(){

                $(this).addClass('use_typeahead').typeahead(
                    //{hint: false}
                    {   hint: false,
                        highlight: true,
                        minLength: 1
                    }
                    ,{
                        name: 'titles',
                        //displayKey: 'name',
                        source: titles.ttAdapter(),
                        templates: {
                            header: '<div class="section_name">Contenidos</div>'
                        }
                    },
                    {
                        name: 'palabras_clave',
                        // displayKey: 'name',
                        source: keywords.ttAdapter(),
                        templates: {
                            header: '<div class="section_name">Palabras Clave</div>'
                        }
                    }).on("typeahead:selected", callback).on("typeahead:cursorchange", callback2)
                    .off('blur');
            })
        }, false);
    };

    $.fn.formFieldValues = function(data) {
        var els = this.find(':input').get();

        if(arguments.length === 0) {
            // return all data
            data = {};

            $.each(els, function() {
                if (this.name && !this.disabled && (this.checked
                    || /select|textarea/i.test(this.nodeName)
                    || /text|hidden|password/i.test(this.type))) {
                    if(data[this.name] == undefined){
                        data[this.name] = [];
                    }
                    data[this.name].push($(this).val());
                }
            });
            return data;
        } else {
            $.each(els, function() {
                if (this.name && data[this.name]) {
                    var names = data[this.name];
                    var $this = $(this);
                    if(Object.prototype.toString.call(names) !== '[object Array]'){
                        names = [names]; //backwards compat to old version of this code
                    }
                    if(this.type == 'checkbox' || this.type == 'radio') {
                        var val = $this.val();
                        var found = false;
                        for(var i = 0; i < names.length; i++){
                            if(names[i] == val){
                                found = true;
                                break;
                            }
                        }
                        $this.attr("checked", found);
                        $this.prop("checked", found);
                    } else {
                        $this.val(names[0]);
                    }
                }
            });
            return this;
        }
    };

    $('#box-content').on('click', '.content_panels_footer .close_panel', function(){
        $('#box-content').find('.content_panels_footer .active, .footer .active').removeClass('active')
    });

    $('body').on('click','.footer a[data-toggle="tab"]', function () {
        $(this).addClass('active').siblings().removeClass('active');

    });

    setTimeout(function(){
        resize_app();
    }, 4)
};


function download_file(url, filename) {
    if(typeof window.requestFileSystem == "undefined" || true){
        window.open(url, '_system');
    }else{
        if(!filename) filename = url.substr(url.lastIndexOf('/') + 1);
        // url = 'http://assets.imgix.net/unsplash/pretty2.jpg?w=400';
        // filename = 'pretty2.jpg';
        return downloadFile(url, filename);
/*
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
            fs.root.getDirectory("Download", {create: true, exclusive: false}, function (dirEntry) {
                var localPath = dirEntry.fullPath;
                alert(dirEntry.fullPath);
                alert(dirEntry.nativeURL)
                if (device.platform === "Android" && localPath.indexOf("file://") === 0) {
                    localPath = localPath.substring(7);
                }
                var imagePath = localPath + filename; // full file path
                //var imagePath = fs.root.nativeURL + filename; // full file path
                var fileTransfer = new FileTransfer();
                preload3();
                fileTransfer.download(url, imagePath, function (entry) {
                    alert_info("Descarga completada:<br>" + entry.fullPath); // entry is fileEntry object

                    // window.plugins.childBrowser.openExternal('file:///sdcard/'+fileName);
                    preload3(1);
                }, function (error) {
                    //alert_error("Error al descargar archivo. " + url + "  -  " + JSON.stringify(error));
                    alert(imagePath + " - " + JSON.stringify(error));
                    preload3(1);
                }, true);

            })
        });
/*
/*
        window.requestFileSystem(
            LocalFileSystem.PERSISTENT, 0,
            function onFileSystemSuccess(fileSystem) {
                fileSystem.root.getFile(
                    "dummy.html", {create: true, exclusive: false},
                    function gotFileEntry(fileEntry) {
                        var sPath = fileEntry.fullPath.replace("dummy.html", "");
                        var fileTransfer = new FileTransfer();
                        fileEntry.remove();
                        alert(sPath + filename);
                        fileTransfer.download(
                            url,
                            sPath + filename,
                            function (theFile) {
                                alert("download complete: " + theFile.toURI());
                                //showLink(theFile.toURI());
                            },
                            function (error) {
                                alert(JSON.stringify(error));
                            },
                            true
                        );
                    },
                    fail);
            },
            fail);

        function fail(evt) {
            alert(evt.target.error.code);
        }
 */
    }
    return false;
}

function downloadFile(URL, fileName) {
    var folderName = 'Download';
    //step to request a file system
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fileSystemSuccess, fileSystemFail);

    function fileSystemSuccess(fileSystem) {
        var download_link = encodeURI(URL);
        //fileName = download_link.substr(download_link.lastIndexOf('/') + 1); //Get filename of URL
        var directoryEntry = fileSystem.root; // to get root path of directory
        directoryEntry.getDirectory(folderName, {
            create: true,
            exclusive: false
        }, onDirectorySuccess, onDirectoryFail); // creating folder in sdcard
        var rootdir = fileSystem.root;
        var fp = fileSystem.root.toURL(); // Returns Fullpath of local directory

        fp = fp + "/" + folderName + "/" + fileName; // fullpath and name of the file which we want to give
        // download function call
        filetransfer(download_link, fp);
    }

    function onDirectorySuccess(parent) {
        // Directory created successfuly
    }

    function onDirectoryFail(error) {
        //Error while creating directory
        alert("Unable to create new directory: " + error.code);

    }

    function fileSystemFail(evt) {
        //Unable to access file system
        alert(evt.target.error.code);
    }
}

function filetransfer(download_link, fp) {
    var fileTransfer = new FileTransfer();
    // File download function with URL and local path
    alert_info('Descagando...');
    fileTransfer.download(download_link, fp,
        function(entry) {
            //alert("download complete: " + entry.fullPath);
            alert_info("Descarga completada:<br>" + "<a href='" + entry.toURL() + "' target='_system'> " + entry.toURL() + " </a>");
            //alert_info("Descarga completada:<br>" + "<a href='" + entry.toURL() + "' target='_system'> " + entry.toURL() + " </a>");
        },
        function(error) {
            //Download abort errors or download failed errors
            //alert(JSON.stringify(error));
            alert_error("Error al descargar archivo. ");
        },
        download_link.indexOf("https:") > -1
    );
}

var show_page_rating = function(key){
    var _name = 'show_page_rating_'+current_user().id;
    var _items = storage.get(_name) || [];
    if(key){
        _items.push(key);
        storage.set(_name, _items);
    }
    return _items;
};


var get_content_route = function(obj){
    var url = 'javascript:;';
    switch (obj.type){
        case 'post_type':
            url = get_route('post_type' , {key: obj.id || obj.key} );
            break;
        case 'category':
            url = get_route('category' , obj.id  );
            break;
        case 'page':
            url = get_route('page' , obj.id  );
            break;
        case 'post':
            url = get_route('page' , obj.id  );
            break;
        case 'home':
            url = get_route('home' );
            break;

    }
    return url;
};
var get_content_route_from_url = function(url){
    var vals = jQuery.url(url).data.seg.path;
    var opts = {}
    for(var i in vals)opts[["site","type","id","args"][i]]=vals[i];
    var url = 'javascript:;';
    if(jQuery.inArray(opts.type,['category', 'type']) > -1 && opts.id){
        if(opts.type == 'type')
            url = get_route('post_type', {key: opts.id} );
        else
            url = get_route(opts.type, opts.id );
    }
    else if(opts.type) url = get_route('page', opts.type);
    return url;
}

function preload(hide){
    if(hide)
        $('body').css('overflow', 'auto').find('.pre_load:first').hide()
    else
        $('body').css('overflow', 'hidden').find('.pre_load:first').show()
}

function preload3(hide){
    if(hide)
        $('body').find('.pre_load3:first').hide()
    else
        $('body').find('.pre_load3:first').show()
}
function preload_scroll(hide){
    if(hide)
        $('body .pre_load_scroll:first').hide()
    else
        $('body .pre_load_scroll:first').show()
}
var _init_preload = false;
function show_init_preload(force){
    if(!_init_preload || force){
        $('.pre_load_init').show();
        _init_preload = false;

        // blocks pages
    }
}
function hide_init_preload(callback){
    if(!_init_preload){
        var counter = 0;
        $container.imagesLoaded( function() {
            preload(true);
            $container.show()
            $('.pre_load_init').fadeOut();
            _init_preload = true;
            if(callback)(callback);
        }).progress( function( instance, image ) {
            var $l_color = $('.pre_load_init .p_loading_color');
            counter++;
            $l_color.width( parseInt(counter * 100/instance.images.length)+'%')
        });
    }

}

function is_current_url(url){
    return s.include(window.location.pathname + window.location.hash,url);
}

function video_play(videoUrl, dom){
    if(typeof window.plugins == "undefined"){
        var $dom = $(dom);
        $dom.after('<video src="' + $dom.attr('href') +'" poster="' + $dom.find('img:first').attr('src') +'" controls autoplay></video>');
        $dom.remove();
    }else{
        window.plugins.streamingMedia.playVideo(videoUrl);
    }
}

function alert_error(text){
    //noty({ type: 'error', text: text, animation: {open: 'animated bounceInLeft', close: 'animated bounceOutLeft',easing: 'swing',speed: 500}}); //theme: 'relax',
    return Lobibox.notify('error', {
        width: '100%',
        msg: text,
        sound: false,
        title: false,
        delay: 15000,
        icon: 'fa fa-times-circle',
        position: "top right"
    });
}
function alert_success(text){
    //noty({type: 'success', text: text, animation: {open: 'animated bounceInLeft', close: 'animated bounceOutLeft',easing: 'swing',speed: 500}});
    return Lobibox.notify('success', {
        width: '100%',
        msg: text,
        sound: false,
        title: false,
        delay: 15000,
        'icon': 'fa fa-check-circle',
        position: "top right"
    });
}

function alert_info(text, delay){
    //noty({ type: 'information', text: text, animation: {open: 'animated bounceInLeft', close: 'animated bounceOutLeft',easing: 'swing',speed: 500}});
    return Lobibox.notify('info', {
        width: '100%',
        msg: text,
        sound: false,
        title: false,
        delay: delay || 15000,
        'icon': 'fa fa-info-circle',
        position: "top right"
    });
}

function alert_warming(text){
    //noty({ type: 'warning', text: text, animation: {open: 'animated bounceInLeft', close: 'animated bounceOutLeft',easing: 'swing',speed: 500}});
    return Lobibox.notify('warning', {
        width: '100%',
        msg: text,
        sound: false,
        title: false,
        delay: 15000,
        'icon': 'fa fa-exclamation-circle',
        position: "bottom right"
    });
}

function scroll_to(id){
    if(!id) return;
    try{
        $('html,body').animate({
            scrollTop: jQuery("#"+id+", a[name='"+id+"']").offset().top - 60 },
            'slow');
    }catch(e){}
}

function is_url(url){
    return s.startsWith(url, 'http') || s.startsWith(url, "//")
}

function fix_url(url){
    if(is_url(url)){
        return url;
    }else{
        return base_url + url;
    }
}


function detect_link_active_url(dom,set_class){
    var hash = window.location.hash;
    var link_c = hash.replace(/&/g,'/');
    var link_a = link_c.split('/');

    for(i = 0; i < link_a.length; i++){
        var str_j = i == 0 ? _.last(link_a) : link_a.slice(1, -1 * i).join('/');
        var exited = false;
        dom.each(function(){
            var $a = $(this);
            var link = $a.attr('href').replace(/&/g,'/');
            if(str_j && link.indexOf(str_j) > -1){
                if(set_class) set_class($a);
                exited = true;
                return false;
            }
        });
        if(exited) break;
    }
}

function get_date_int(){
    return parseInt((new Date().getTime())/10);
}

function guid() {
    var id = $.localStorage.get('guid')
    if(!id){
        id = _guid();
        $.localStorage.set('guid', id)
    }
    return id;
}

function _guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

function _get_range(_type){
    var t1 = '';
    var t2 = '';
    switch(_type){
        case 'd':
            t1 = moment().format("DD/MM/YYYY");
            break;
        case 'd7':
            t1 = moment().subtract(7, 'days').format("DD/MM/YYYY");
            break;
        case 'last-m':
            t1 = moment().subtract(30, 'days').format("DD/MM/YYYY");
            break;
        case 'm3':
            t1 = moment().subtract(3, 'months').format("DD/MM/YYYY");
            break;
        case 'm6':
            t1 = moment().subtract(6, 'months').format("DD/MM/YYYY");
            break;
        default:
            t1 = '';
            t2 = '';
            break;
    }
    if(_type != 'all') t2 = moment().format("DD/MM/YYYY");

    return{
        t1: t1,
        t2: t2
    }
}

// datas array

var res_options = function(total){
    var w = 96;
    var max = 1000;
    var s = 0;
    var resp = {};
    do {
        s+=w;
        var c = Math.ceil(s/w);
        resp[s] = {items: c, nav : c < total}
    }
    while (s < max);
    return resp;
};

String.prototype.hashCode = function() {
    var hash = 0, i, chr, len;
    if (this.length === 0) return hash;
    for (i = 0, len = this.length; i < len; i++) {
        chr   = this.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};
/**
 * Created by Froilan on 19/06/2015.
 */
var _exclude_words = ["no","de","la","lo","del","un", "una", "unas", "unos", "uno", "sobre", "todo", "tambien", "tras", "otro", "algun", "alguno", "alguna", "algunos", "algunas", "ser", "es", "soy", "eres", "somos", "sois", "estoy", "esta", "estamos", "estais", "estan", "como", "en", "para", "atras", "porque", "por", "que", "estado", "estaba", "ante", "antes", "siendo", "ambos", "pero", "por", "poder", "puede", "puedo", "podemos", "podeis", "pueden", "fui", "fue", "fuimos", "fueron", "hacer", "hago", "hace", "hacemos", "haceis", "hacen", "cada", "fin", "incluso", "primero", "desde", "conseguir", "consigo", "consigue", "consigues", "conseguimos", "consiguen", "ir", "voy", "va", "vamos", "vais", "van", "vaya", "gueno", "ha", "tener", "tengo", "tiene", "tenemos", "teneis", "tienen", "el", "la", "lo", "las", "los", "su", "aqui", "mio", "tuyo", "ellos", "ellas", "nos", "nosotros", "vosotros", "vosotras", "si", "dentro", "solo", "solamente", "saber", "sabes", "sabe", "sabemos", "sabeis", "saben", "ultimo", "largo", "bastante", "haces", "muchos", "aquellos", "aquellas", "sus", "entonces", "tiempo", "verdad", "verdadero", "verdadera", "cierto", "ciertos", "cierta", "ciertas", "intentar", "intento", "intenta", "intentas", "intentamos", "intentais", "intentan", "dos", "bajo", "arriba", "encima", "usar", "uso", "usas", "usa", "usamos", "usais", "usan", "emplear", "empleo", "empleas", "emplean", "ampleamos", "empleais", "valor", "muy", "era", "eras", "eramos", "eran", "modo", "bien", "cual", "cuando", "donde", "mientras", "quien", "con", "entre", "sin", "trabajo", "trabajar", "trabajas", "trabaja", "trabajamos", "trabajais", "trabajan", "podria", "podrias", "podriamos", "podrian", "podriais", "yo", "aquel"];

function isEmpty(obj) {
    if (obj == "") return true;
    if (obj == null) return true;
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }
    return true;
}


function encode(unencoded) {
    return encodeURIComponent(unencoded).replace(/'/g,"%27").replace(/"/g,"%22");
}
function decode(encoded) {
    return decodeURIComponent(encoded.replace(/\+/g,  " "));
}

function isNumber(n) {
    return Object.prototype.toString.call(n) !== '[object Array]' &&!isNaN(parseFloat(n)) && isFinite(n.toString().replace(/^-/, ''));
}

function makeid(l)
{
    l = l || 5;
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < l; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

var to_json = function(data){try {data = JSON.stringify(data)}catch (e){}; return data;};


function format_date(str){
    if(!str) return null ;
    return moment(str.toString()).format('DD/MMM/YYYY')
}

function format_datetime(str){
    if(!str) return null ;
    return moment(str.toString()).format('DD/MMM/YYYY h:mm')
}

!(function($){
    jQuery.fn.serializeObject=function() {
        var json = {};
        jQuery.map(jQuery(this).serializeArray(), function(n, i) {
            var __i = n.name.indexOf('[');
            if (__i > -1) {
                var o = json;
                _name = n.name.replace(/\]/gi, '').split('[');
                for (var i=0, len=_name.length; i<len; i++) {
                    if (i == len-1) {
                        if (o[_name[i]] && $.trim(_name[i]) == '') {
                            if (typeof o[_name[i]] == 'string') {
                                o[_name[i]] = [o[_name[i]]];
                            }
                            o[_name[i]].push(n.value);
                        }
                        else o[_name[i]] = n.value || '';
                    }
                    else o = o[_name[i]] = o[_name[i]] || {};
                }
            }
            else {
                if (json[n.name] !== undefined) {
                    if (!json[n.name].push) {
                        json[n.name] = [json[n.name]];
                    }
                    json[n.name].push(n.value || '');
                }
                else json[n.name] = n.value || '';
            }
        });
        return json;
    };
})(jQuery);


function load_image(src, callback){
    var img = new Image();
    $(img).load(function(){
        if(callback)callback(true)
    }).attr({
        src: src
    }).error(function(){
        if(callback)callback(false)
    });
}

/* Super Simple Fancy Checkbox by davemacaulay.com updated by schoberg.net  */

(function( $ ) {
    $.fn.simpleCheckbox = function(options) {
        var defaults = {
            newElementClass: 'tog',
            activeElementClass: 'on',
            onClick: null
        };
        var options = $.extend(defaults, options);
        this.each(function() {
            //Assign the current checkbox to obj
            var obj = $(this);
            //Create new span element to be styled
            var newObj = $('<div/>', {
                'id': '#' + obj.attr('id'),
                'class': options.newElementClass,
                'style': 'display: block;'
            }).insertAfter(this);
            //Make sure pre-checked boxes are rendered as checked
            if(obj.is(':checked')) {
                newObj.addClass(options.activeElementClass);
            }
            obj.hide(); //Hide original checkbox
            //Labels can be painful, let's fix that
            if($('[for=' + obj.attr('id') + ']').length) {

                var label = $('[for=' + obj.attr('id') + ']');
                label.click(function() {
                    newObj.trigger('click'); //Force the label to fire our element
                    return false;
                });
            }
            //Attach a click handler
            newObj.click(function() {
                //Assign current clicked object
                var obj = $(this);
                //Check the current state of the checkbox
                if(obj.hasClass(options.activeElementClass)) {
                    obj.removeClass(options.activeElementClass);
                    $(obj.attr('id')).attr('checked',false);
                } else {
                    obj.addClass(options.activeElementClass);
                    $(obj.attr('id')).attr('checked',true);
                }
                if(options.onClick) options.onClick(obj.hasClass(options.activeElementClass));
                //Kill the click function
                return false;
            });
        });
    };
})(jQuery);

/**
 * jQuery Resize & Crop
 * https://code.google.com/p/resize-crop/
 */

(function($){
    $.fn.resizecrop = function(options) {
        var defaults = {
            width:      50,
            height:     50,
            vertical:   "center",
            horizontal: "center",
            wrapper:    "span",
            moveClass:  true,
            moveId:     true,
            className:  "resizecrop",
            zoom:       true,
            wrapperCSS: {}
        };

        var options = $.extend(defaults, options);

        return this.each(function() {
            var resized = false;
            var $obj = $(this);
            if($obj.is(options.wrapper) && $obj.find('.' + options.className).size() > 0){
                var wrapper = $obj;
                $obj = $obj.find('.' + options.className).first();
                resized = true;
            }else{
                var wrapper = $(document.createElement(options.wrapper));
                // move Classes from IMG to Wrapper element
                if (options.moveClass) {
                    var classAttr = $obj.attr("class");
                    if (typeof classAttr !== 'undefined' && classAttr !== false && classAttr !== "") {
                        var classList = classAttr.split(/\s+/);
                        $.each(classList, function(index, className){
                            wrapper.addClass(className);
                        });
                        $obj.removeAttr("class");
                        $obj.addClass(options.className);
                    }
                }
                // move Id from IMG to Wrapper element
                if (options.moveId) {
                    var idName = $obj.attr("id");
                    if (typeof idName !== "undefined" && idName !== false && idName !== "") {
                        $obj.removeAttr("id");
                        wrapper.attr("id", idName);
                    }
                }
            }
            $obj.css("display","none"); // remove blink transformation
            $obj.removeAttr("width").removeAttr("height").removeAttr("style"); // remove attribute dimensions
            // Wrapper default CSS
            wrapper.css({
                width: options.width,
                height: options.height,
                overflow: "hidden",
                display: "inline-block",
                "vertical-align": "middle",
                "position": "relative"
            }).css(options.wrapperCSS);

            if(!resized) $obj.wrap(wrapper);

            function transform(ref) {
                var width_ratio  = options.width  / ref.width();
                var height_ratio = options.height / ref.height();
                if (width_ratio > height_ratio) {
                    if (options.zoom || width_ratio < 1)
                        ref.width(options.width);
                    switch(options.vertical) {
                        case "top":
                            ref.css("top", 0);
                            break;
                        case "bottom":
                            ref.css("bottom", 0);
                            break;
                        case "center":
                        default:
                            ref.css("top", ((ref.height() - options.height) / -2) + "px");
                    }
                    if (options.zoom || width_ratio < 1)
                        ref.css("left", 0);
                    else
                        ref.css("left", ((ref.width() - options.width) / -2) + "px");
                } else {
                    if (options.zoom || height_ratio < 1)
                        ref.height(options.height);
                    switch(options.horizontal) {
                        case "left":
                            ref.css("left", 0);
                            break;
                        case "right":
                            ref.css("right", 0);
                            break;
                        case "center":
                        default:
                            ref.css("left", ((ref.width() - options.width) / -2) + "px");
                    }
                    if (options.zoom || height_ratio < 1)
                        ref.css("top", 0);
                    else
                        ref.css("top", ((ref.height() - options.height) / -2) + "px");
                }
                ref.css({position:"relative",display:"block"});
            }
            if(resized) { // resized image
                transform($obj);
            } else {
                _load_image($obj.attr('src'), function() {
                    transform($obj);
                });
            }
        });
    };
    function _load_image(src, callback){
        var img = new Image();
        $(img).load(function(){
            if(callback)callback(true)
        }).attr({
            src: src
        }).error(function(){
            if(callback)callback(false)
        });
    }
})(jQuery);

/* =========================================================
 * bootstrap-tabdrop.js
 * http://www.eyecon.ro/bootstrap-tabdrop
 * ========================================================= */

!function( $ ) {

    var WinReszier = (function(){
        var registered = [];
        var inited = false;
        var timer;
        var resize = function(ev) {
            clearTimeout(timer);
            timer = setTimeout(notify, 100);
        };
        var notify = function() {
            for(var i=0, cnt=registered.length; i<cnt; i++) {
                registered[i].apply();
            }
        };
        return {
            register: function(fn) {
                registered.push(fn);
                if (inited === false) {
                    $(window).bind('resize', resize);
                    inited = true;
                }
            },
            unregister: function(fn) {
                for(var i=0, cnt=registered.length; i<cnt; i++) {
                    if (registered[i] == fn) {
                        delete registered[i];
                        break;
                    }
                }
            }
        }
    }());

    var TabDrop = function(element, options) {
        this.element = $(element);
        this.ul_dropdown = $('<ul class="nav nav-tab-drop "></ul>');
        this.dropdown = $('<li class="dropdown hide pull-right tabdrop"><a class="dropdown-toggle" data-toggle="dropdown" href="#">'+options.text+' </a><ul class="dropdown-menu"></ul></li>')
            .prependTo(this.ul_dropdown);
        this.element.after(this.ul_dropdown);
        if (this.element.parent().is('.tabs-below')) {
            this.dropdown.addClass('dropup');
        }
        WinReszier.register($.proxy(this.layout, this));
        this.layout();
    };

    TabDrop.prototype = {
        constructor: TabDrop,

        layout: function() {
            var collection = [];
            this.dropdown.removeClass('hide');
            var w = this.element.parent().width();
            this.element
                .append(this.dropdown.find('li'))
                .css({display: 'table', width: '100%'})
                .find('>li')
                .css({float: 'none', display: 'table-cell'})
                .not('.tabdrop')
                .each(function(){
                    if(this.offsetLeft + this.offsetWidth > w) {
                        collection.push(this);
                    }
                    /*if(this.offsetTop > 0) {
                        collection.push(this);
                    }*/
                });
            if (collection.length > 0) {
                collection = $(collection);
                this.dropdown
                    .find('ul')
                    .empty()
                    .append(collection)
                    .find('>li')
                    .css({display: 'block'});

                if (this.dropdown.find('.active').length == 1) {
                    this.dropdown.addClass('active');
                } else {
                    this.dropdown.removeClass('active');
                }
                this.element.parent().css('padding-right','44px')
            } else {
                this.dropdown.addClass('hide');
                this.element.parent().css('padding-right','0')
            }
        }
    }

    $.fn.tabdrop = function ( option ) {
        return this.each(function () {
            var $this = $(this),
                data = $this.data('tabdrop'),
                options = typeof option === 'object' && option;
            if (!data)  {
                $this.data('tabdrop', (data = new TabDrop(this, $.extend({}, $.fn.tabdrop.defaults,options))));
            }
            if (typeof option == 'string') {
                data[option]();
            }
        })
    };

    $.fn.tabdrop.defaults = {
        text: '<i class="fa fa-align-justify"></i>'
    };

    $.fn.tabdrop.Constructor = TabDrop;

/*
        var a;
        a = $.fn.tabdrop, $.fn.tabdrop = function (b) {
            return b = $.extend({}, $.fn.tabdrop.defaults, b), this.each(function () {
                var c, d;
                return c = $(this), a.call(c, b), d = c.data("tabdrop"), d ? (d.dropdown.on("click", "li", function () {
                    return $(this).parent().parent().find("a.dropdown-toggle").empty().html('<span class="display-tab"> ' + $(this).text() + ' </span><b class="caret"></b>'), d.layout()
                }), d.element.on("click", "> li", function () {
                    return $(this).hasClass("tabdrop") ? void 0 : (d.element.find("> .tabdrop > a.dropdown-toggle").empty().html(b.text + ' <b class="caret"></b>'), d.layout())
                })) : void 0
            })
        }
*/

}( window.jQuery );

/**
 * TransitSuper-smooth CSS transitions & transformations for jQuery
 * http://ricostacruz.com/jquery.transit/
 */

(function(t,e){if(typeof define==="function"&&define.amd){define(["jquery"],e)}else if(typeof exports==="object"){module.exports=e(require("jquery"))}else{e(t.jQuery)}})(this,function(t){t.transit={version:"0.9.12",propertyMap:{marginLeft:"margin",marginRight:"margin",marginBottom:"margin",marginTop:"margin",paddingLeft:"padding",paddingRight:"padding",paddingBottom:"padding",paddingTop:"padding"},enabled:true,useTransitionEnd:false};var e=document.createElement("div");var n={};function i(t){if(t in e.style)return t;var n=["Moz","Webkit","O","ms"];var i=t.charAt(0).toUpperCase()+t.substr(1);for(var r=0;r<n.length;++r){var s=n[r]+i;if(s in e.style){return s}}}function r(){e.style[n.transform]="";e.style[n.transform]="rotateY(90deg)";return e.style[n.transform]!==""}var s=navigator.userAgent.toLowerCase().indexOf("chrome")>-1;n.transition=i("transition");n.transitionDelay=i("transitionDelay");n.transform=i("transform");n.transformOrigin=i("transformOrigin");n.filter=i("Filter");n.transform3d=r();var a={transition:"transitionend",MozTransition:"transitionend",OTransition:"oTransitionEnd",WebkitTransition:"webkitTransitionEnd",msTransition:"MSTransitionEnd"};var o=n.transitionEnd=a[n.transition]||null;for(var u in n){if(n.hasOwnProperty(u)&&typeof t.support[u]==="undefined"){t.support[u]=n[u]}}e=null;t.cssEase={_default:"ease","in":"ease-in",out:"ease-out","in-out":"ease-in-out",snap:"cubic-bezier(0,1,.5,1)",easeInCubic:"cubic-bezier(.550,.055,.675,.190)",easeOutCubic:"cubic-bezier(.215,.61,.355,1)",easeInOutCubic:"cubic-bezier(.645,.045,.355,1)",easeInCirc:"cubic-bezier(.6,.04,.98,.335)",easeOutCirc:"cubic-bezier(.075,.82,.165,1)",easeInOutCirc:"cubic-bezier(.785,.135,.15,.86)",easeInExpo:"cubic-bezier(.95,.05,.795,.035)",easeOutExpo:"cubic-bezier(.19,1,.22,1)",easeInOutExpo:"cubic-bezier(1,0,0,1)",easeInQuad:"cubic-bezier(.55,.085,.68,.53)",easeOutQuad:"cubic-bezier(.25,.46,.45,.94)",easeInOutQuad:"cubic-bezier(.455,.03,.515,.955)",easeInQuart:"cubic-bezier(.895,.03,.685,.22)",easeOutQuart:"cubic-bezier(.165,.84,.44,1)",easeInOutQuart:"cubic-bezier(.77,0,.175,1)",easeInQuint:"cubic-bezier(.755,.05,.855,.06)",easeOutQuint:"cubic-bezier(.23,1,.32,1)",easeInOutQuint:"cubic-bezier(.86,0,.07,1)",easeInSine:"cubic-bezier(.47,0,.745,.715)",easeOutSine:"cubic-bezier(.39,.575,.565,1)",easeInOutSine:"cubic-bezier(.445,.05,.55,.95)",easeInBack:"cubic-bezier(.6,-.28,.735,.045)",easeOutBack:"cubic-bezier(.175, .885,.32,1.275)",easeInOutBack:"cubic-bezier(.68,-.55,.265,1.55)"};t.cssHooks["transit:transform"]={get:function(e){return t(e).data("transform")||new f},set:function(e,i){var r=i;if(!(r instanceof f)){r=new f(r)}if(n.transform==="WebkitTransform"&&!s){e.style[n.transform]=r.toString(true)}else{e.style[n.transform]=r.toString()}t(e).data("transform",r)}};t.cssHooks.transform={set:t.cssHooks["transit:transform"].set};t.cssHooks.filter={get:function(t){return t.style[n.filter]},set:function(t,e){t.style[n.filter]=e}};if(t.fn.jquery<"1.8"){t.cssHooks.transformOrigin={get:function(t){return t.style[n.transformOrigin]},set:function(t,e){t.style[n.transformOrigin]=e}};t.cssHooks.transition={get:function(t){return t.style[n.transition]},set:function(t,e){t.style[n.transition]=e}}}p("scale");p("scaleX");p("scaleY");p("translate");p("rotate");p("rotateX");p("rotateY");p("rotate3d");p("perspective");p("skewX");p("skewY");p("x",true);p("y",true);function f(t){if(typeof t==="string"){this.parse(t)}return this}f.prototype={setFromString:function(t,e){var n=typeof e==="string"?e.split(","):e.constructor===Array?e:[e];n.unshift(t);f.prototype.set.apply(this,n)},set:function(t){var e=Array.prototype.slice.apply(arguments,[1]);if(this.setter[t]){this.setter[t].apply(this,e)}else{this[t]=e.join(",")}},get:function(t){if(this.getter[t]){return this.getter[t].apply(this)}else{return this[t]||0}},setter:{rotate:function(t){this.rotate=b(t,"deg")},rotateX:function(t){this.rotateX=b(t,"deg")},rotateY:function(t){this.rotateY=b(t,"deg")},scale:function(t,e){if(e===undefined){e=t}this.scale=t+","+e},skewX:function(t){this.skewX=b(t,"deg")},skewY:function(t){this.skewY=b(t,"deg")},perspective:function(t){this.perspective=b(t,"px")},x:function(t){this.set("translate",t,null)},y:function(t){this.set("translate",null,t)},translate:function(t,e){if(this._translateX===undefined){this._translateX=0}if(this._translateY===undefined){this._translateY=0}if(t!==null&&t!==undefined){this._translateX=b(t,"px")}if(e!==null&&e!==undefined){this._translateY=b(e,"px")}this.translate=this._translateX+","+this._translateY}},getter:{x:function(){return this._translateX||0},y:function(){return this._translateY||0},scale:function(){var t=(this.scale||"1,1").split(",");if(t[0]){t[0]=parseFloat(t[0])}if(t[1]){t[1]=parseFloat(t[1])}return t[0]===t[1]?t[0]:t},rotate3d:function(){var t=(this.rotate3d||"0,0,0,0deg").split(",");for(var e=0;e<=3;++e){if(t[e]){t[e]=parseFloat(t[e])}}if(t[3]){t[3]=b(t[3],"deg")}return t}},parse:function(t){var e=this;t.replace(/([a-zA-Z0-9]+)\((.*?)\)/g,function(t,n,i){e.setFromString(n,i)})},toString:function(t){var e=[];for(var i in this){if(this.hasOwnProperty(i)){if(!n.transform3d&&(i==="rotateX"||i==="rotateY"||i==="perspective"||i==="transformOrigin")){continue}if(i[0]!=="_"){if(t&&i==="scale"){e.push(i+"3d("+this[i]+",1)")}else if(t&&i==="translate"){e.push(i+"3d("+this[i]+",0)")}else{e.push(i+"("+this[i]+")")}}}}return e.join(" ")}};function c(t,e,n){if(e===true){t.queue(n)}else if(e){t.queue(e,n)}else{t.each(function(){n.call(this)})}}function l(e){var i=[];t.each(e,function(e){e=t.camelCase(e);e=t.transit.propertyMap[e]||t.cssProps[e]||e;e=h(e);if(n[e])e=h(n[e]);if(t.inArray(e,i)===-1){i.push(e)}});return i}function d(e,n,i,r){var s=l(e);if(t.cssEase[i]){i=t.cssEase[i]}var a=""+y(n)+" "+i;if(parseInt(r,10)>0){a+=" "+y(r)}var o=[];t.each(s,function(t,e){o.push(e+" "+a)});return o.join(", ")}t.fn.transition=t.fn.transit=function(e,i,r,s){var a=this;var u=0;var f=true;var l=t.extend(true,{},e);if(typeof i==="function"){s=i;i=undefined}if(typeof i==="object"){r=i.easing;u=i.delay||0;f=typeof i.queue==="undefined"?true:i.queue;s=i.complete;i=i.duration}if(typeof r==="function"){s=r;r=undefined}if(typeof l.easing!=="undefined"){r=l.easing;delete l.easing}if(typeof l.duration!=="undefined"){i=l.duration;delete l.duration}if(typeof l.complete!=="undefined"){s=l.complete;delete l.complete}if(typeof l.queue!=="undefined"){f=l.queue;delete l.queue}if(typeof l.delay!=="undefined"){u=l.delay;delete l.delay}if(typeof i==="undefined"){i=t.fx.speeds._default}if(typeof r==="undefined"){r=t.cssEase._default}i=y(i);var p=d(l,i,r,u);var h=t.transit.enabled&&n.transition;var b=h?parseInt(i,10)+parseInt(u,10):0;if(b===0){var g=function(t){a.css(l);if(s){s.apply(a)}if(t){t()}};c(a,f,g);return a}var m={};var v=function(e){var i=false;var r=function(){if(i){a.unbind(o,r)}if(b>0){a.each(function(){this.style[n.transition]=m[this]||null})}if(typeof s==="function"){s.apply(a)}if(typeof e==="function"){e()}};if(b>0&&o&&t.transit.useTransitionEnd){i=true;a.bind(o,r)}else{window.setTimeout(r,b)}a.each(function(){if(b>0){this.style[n.transition]=p}t(this).css(l)})};var z=function(t){this.offsetWidth;v(t)};c(a,f,z);return this};function p(e,i){if(!i){t.cssNumber[e]=true}t.transit.propertyMap[e]=n.transform;t.cssHooks[e]={get:function(n){var i=t(n).css("transit:transform");return i.get(e)},set:function(n,i){var r=t(n).css("transit:transform");r.setFromString(e,i);t(n).css({"transit:transform":r})}}}function h(t){return t.replace(/([A-Z])/g,function(t){return"-"+t.toLowerCase()})}function b(t,e){if(typeof t==="string"&&!t.match(/^[\-0-9\.]+$/)){return t}else{return""+t+e}}function y(e){var n=e;if(typeof n==="string"&&!n.match(/^[\-0-9\.]+/)){n=t.fx.speeds[n]||t.fx.speeds._default}return b(n,"ms")}t.transit.getTransitionValue=d;return t});

/**
 * Detect Element Resize Plugin for jQuery
 *
 * https://github.com/sdecima/javascript-detect-element-resize
 * Sebastian Decima
 *
 * version: 0.5.3
 **/

!function(e){function i(e){var i=e.__resizeTriggers__,t=i.firstElementChild,r=i.lastElementChild,n=t.firstElementChild;r.scrollLeft=r.scrollWidth,r.scrollTop=r.scrollHeight,n.style.width=t.offsetWidth+1+"px",n.style.height=t.offsetHeight+1+"px",t.scrollLeft=t.scrollWidth,t.scrollTop=t.scrollHeight}function t(e){return e.offsetWidth!=e.__resizeLast__.width||e.offsetHeight!=e.__resizeLast__.height}function r(e){var r=this;i(this),this.__resizeRAF__&&c(this.__resizeRAF__),this.__resizeRAF__=_(function(){t(r)&&(r.__resizeLast__.width=r.offsetWidth,r.__resizeLast__.height=r.offsetHeight,r.__resizeListeners__.forEach(function(i){i.call(r,e)}))})}function n(){if(!o){var e=(p?p:"")+".resize-triggers { "+(L?L:"")+'visibility: hidden; opacity: 0; } .resize-triggers, .resize-triggers > div, .contract-trigger:before { content: " "; display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; } .resize-triggers > div { background: #eee; overflow: auto; } .contract-trigger:before { width: 200%; height: 200%; }',i=document.head||document.getElementsByTagName("head")[0],t=document.createElement("style");t.type="text/css",t.styleSheet?t.styleSheet.cssText=e:t.appendChild(document.createTextNode(e)),i.appendChild(t),o=!0}}var s=document.attachEvent,o=!1,a=e.fn.resize;if(e.fn.resize=function(e){return this.each(function(){this==window?a.call(jQuery(this),e):addResizeListener(this,e)})},e.fn.removeResize=function(e){return this.each(function(){removeResizeListener(this,e)})},!s){var _=function(){var e=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||function(e){return window.setTimeout(e,20)};return function(i){return e(i)}}(),c=function(){var e=window.cancelAnimationFrame||window.mozCancelAnimationFrame||window.webkitCancelAnimationFrame||window.clearTimeout;return function(i){return e(i)}}(),d=!1,l="animation",h="",m="animationstart",f="Webkit Moz O ms".split(" "),g="webkitAnimationStart animationstart oAnimationStart MSAnimationStart".split(" "),u="",z=document.createElement("fakeelement");if(void 0!==z.style.animationName&&(d=!0),d===!1)for(var v=0;v<f.length;v++)if(void 0!==z.style[f[v]+"AnimationName"]){u=f[v],l=u+"Animation",h="-"+u.toLowerCase()+"-",m=g[v],d=!0;break}var w="resizeanim",p="@"+h+"keyframes "+w+" { from { opacity: 0; } to { opacity: 0; } } ",L=h+"animation: 1ms "+w+"; "}window.addResizeListener=function(e,t){s?e.attachEvent("onresize",t):(e.__resizeTriggers__||("static"==getComputedStyle(e).position&&(e.style.position="relative"),n(),e.__resizeLast__={},e.__resizeListeners__=[],(e.__resizeTriggers__=document.createElement("div")).className="resize-triggers",e.__resizeTriggers__.innerHTML='<div class="expand-trigger"><div></div></div><div class="contract-trigger"></div>',e.appendChild(e.__resizeTriggers__),i(e),e.addEventListener("scroll",r,!0),m&&e.__resizeTriggers__.addEventListener(m,function(t){t.animationName==w&&i(e)})),e.__resizeListeners__.push(t))},window.removeResizeListener=function(e,i){s?e.detachEvent("onresize",i):(e.__resizeListeners__.splice(e.__resizeListeners__.indexOf(i),1),e.__resizeListeners__.length||(e.removeEventListener("scroll",r),e.__resizeTriggers__=!e.removeChild(e.__resizeTriggers__)))}}(jQuery);

/*!
 * imagesLoaded PACKAGED v3.2.0
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */

(function(){"use strict";function e(){}function t(e,t){for(var n=e.length;n--;)if(e[n].listener===t)return n;return-1}function n(e){return function(){return this[e].apply(this,arguments)}}var i=e.prototype,r=this,s=r.EventEmitter;i.getListeners=function(e){var t,n,i=this._getEvents();if("object"==typeof e){t={};for(n in i)i.hasOwnProperty(n)&&e.test(n)&&(t[n]=i[n])}else t=i[e]||(i[e]=[]);return t},i.flattenListeners=function(e){var t,n=[];for(t=0;t<e.length;t+=1)n.push(e[t].listener);return n},i.getListenersAsObject=function(e){var t,n=this.getListeners(e);return n instanceof Array&&(t={},t[e]=n),t||n},i.addListener=function(e,n){var i,r=this.getListenersAsObject(e),s="object"==typeof n;for(i in r)r.hasOwnProperty(i)&&-1===t(r[i],n)&&r[i].push(s?n:{listener:n,once:!1});return this},i.on=n("addListener"),i.addOnceListener=function(e,t){return this.addListener(e,{listener:t,once:!0})},i.once=n("addOnceListener"),i.defineEvent=function(e){return this.getListeners(e),this},i.defineEvents=function(e){for(var t=0;t<e.length;t+=1)this.defineEvent(e[t]);return this},i.removeListener=function(e,n){var i,r,s=this.getListenersAsObject(e);for(r in s)s.hasOwnProperty(r)&&(i=t(s[r],n),-1!==i&&s[r].splice(i,1));return this},i.off=n("removeListener"),i.addListeners=function(e,t){return this.manipulateListeners(!1,e,t)},i.removeListeners=function(e,t){return this.manipulateListeners(!0,e,t)},i.manipulateListeners=function(e,t,n){var i,r,s=e?this.removeListener:this.addListener,o=e?this.removeListeners:this.addListeners;if("object"!=typeof t||t instanceof RegExp)for(i=n.length;i--;)s.call(this,t,n[i]);else for(i in t)t.hasOwnProperty(i)&&(r=t[i])&&("function"==typeof r?s.call(this,i,r):o.call(this,i,r));return this},i.removeEvent=function(e){var t,n=typeof e,i=this._getEvents();if("string"===n)delete i[e];else if("object"===n)for(t in i)i.hasOwnProperty(t)&&e.test(t)&&delete i[t];else delete this._events;return this},i.removeAllListeners=n("removeEvent"),i.emitEvent=function(e,t){var n,i,r,s,o=this.getListenersAsObject(e);for(r in o)if(o.hasOwnProperty(r))for(i=o[r].length;i--;)n=o[r][i],n.once===!0&&this.removeListener(e,n.listener),s=n.listener.apply(this,t||[]),s===this._getOnceReturnValue()&&this.removeListener(e,n.listener);return this},i.trigger=n("emitEvent"),i.emit=function(e){var t=Array.prototype.slice.call(arguments,1);return this.emitEvent(e,t)},i.setOnceReturnValue=function(e){return this._onceReturnValue=e,this},i._getOnceReturnValue=function(){return this.hasOwnProperty("_onceReturnValue")?this._onceReturnValue:!0},i._getEvents=function(){return this._events||(this._events={})},e.noConflict=function(){return r.EventEmitter=s,e},"function"==typeof define&&define.amd?define("eventEmitter/EventEmitter",[],function(){return e}):"object"==typeof module&&module.exports?module.exports=e:this.EventEmitter=e}).call(this),function(e){function t(t){var n=e.event;return n.target=n.target||n.srcElement||t,n}var n=document.documentElement,i=function(){};n.addEventListener?i=function(e,t,n){e.addEventListener(t,n,!1)}:n.attachEvent&&(i=function(e,n,i){e[n+i]=i.handleEvent?function(){var n=t(e);i.handleEvent.call(i,n)}:function(){var n=t(e);i.call(e,n)},e.attachEvent("on"+n,e[n+i])});var r=function(){};n.removeEventListener?r=function(e,t,n){e.removeEventListener(t,n,!1)}:n.detachEvent&&(r=function(e,t,n){e.detachEvent("on"+t,e[t+n]);try{delete e[t+n]}catch(i){e[t+n]=void 0}});var s={bind:i,unbind:r};"function"==typeof define&&define.amd?define("eventie/eventie",s):e.eventie=s}(this),function(e,t){"use strict";"function"==typeof define&&define.amd?define(["eventEmitter/EventEmitter","eventie/eventie"],function(n,i){return t(e,n,i)}):"object"==typeof module&&module.exports?module.exports=t(e,require("wolfy87-eventemitter"),require("eventie")):e.imagesLoaded=t(e,e.EventEmitter,e.eventie)}(window,function(e,t,n){function i(e,t){for(var n in t)e[n]=t[n];return e}function r(e){return"[object Array]"==f.call(e)}function s(e){var t=[];if(r(e))t=e;else if("number"==typeof e.length)for(var n=0;n<e.length;n++)t.push(e[n]);else t.push(e);return t}function o(e,t,n){if(!(this instanceof o))return new o(e,t,n);"string"==typeof e&&(e=document.querySelectorAll(e)),this.elements=s(e),this.options=i({},this.options),"function"==typeof t?n=t:i(this.options,t),n&&this.on("always",n),this.getImages(),u&&(this.jqDeferred=new u.Deferred);var r=this;setTimeout(function(){r.check()})}function h(e){this.img=e}function a(e,t){this.url=e,this.element=t,this.img=new Image}var u=e.jQuery,c=e.console,f=Object.prototype.toString;o.prototype=new t,o.prototype.options={},o.prototype.getImages=function(){this.images=[];for(var e=0;e<this.elements.length;e++){var t=this.elements[e];this.addElementImages(t)}},o.prototype.addElementImages=function(e){"IMG"==e.nodeName&&this.addImage(e),this.options.background===!0&&this.addElementBackgroundImages(e);var t=e.nodeType;if(t&&d[t]){for(var n=e.querySelectorAll("img"),i=0;i<n.length;i++){var r=n[i];this.addImage(r)}if("string"==typeof this.options.background){var s=e.querySelectorAll(this.options.background);for(i=0;i<s.length;i++){var o=s[i];this.addElementBackgroundImages(o)}}}};var d={1:!0,9:!0,11:!0};o.prototype.addElementBackgroundImages=function(e){for(var t=m(e),n=/url\(['"]*([^'"\)]+)['"]*\)/gi,i=n.exec(t.backgroundImage);null!==i;){var r=i&&i[1];r&&this.addBackground(r,e),i=n.exec(t.backgroundImage)}};var m=e.getComputedStyle||function(e){return e.currentStyle};return o.prototype.addImage=function(e){var t=new h(e);this.images.push(t)},o.prototype.addBackground=function(e,t){var n=new a(e,t);this.images.push(n)},o.prototype.check=function(){function e(e,n,i){setTimeout(function(){t.progress(e,n,i)})}var t=this;if(this.progressedCount=0,this.hasAnyBroken=!1,!this.images.length)return void this.complete();for(var n=0;n<this.images.length;n++){var i=this.images[n];i.once("progress",e),i.check()}},o.prototype.progress=function(e,t,n){this.progressedCount++,this.hasAnyBroken=this.hasAnyBroken||!e.isLoaded,this.emit("progress",this,e,t),this.jqDeferred&&this.jqDeferred.notify&&this.jqDeferred.notify(this,e),this.progressedCount==this.images.length&&this.complete(),this.options.debug&&c&&c.log("progress: "+n,e,t)},o.prototype.complete=function(){var e=this.hasAnyBroken?"fail":"done";if(this.isComplete=!0,this.emit(e,this),this.emit("always",this),this.jqDeferred){var t=this.hasAnyBroken?"reject":"resolve";this.jqDeferred[t](this)}},h.prototype=new t,h.prototype.check=function(){var e=this.getIsImageComplete();return e?void this.confirm(0!==this.img.naturalWidth,"naturalWidth"):(this.proxyImage=new Image,n.bind(this.proxyImage,"load",this),n.bind(this.proxyImage,"error",this),n.bind(this.img,"load",this),n.bind(this.img,"error",this),void(this.proxyImage.src=this.img.src))},h.prototype.getIsImageComplete=function(){return this.img.complete&&void 0!==this.img.naturalWidth},h.prototype.confirm=function(e,t){this.isLoaded=e,this.emit("progress",this,this.img,t)},h.prototype.handleEvent=function(e){var t="on"+e.type;this[t]&&this[t](e)},h.prototype.onload=function(){this.confirm(!0,"onload"),this.unbindEvents()},h.prototype.onerror=function(){this.confirm(!1,"onerror"),this.unbindEvents()},h.prototype.unbindEvents=function(){n.unbind(this.proxyImage,"load",this),n.unbind(this.proxyImage,"error",this),n.unbind(this.img,"load",this),n.unbind(this.img,"error",this)},a.prototype=new h,a.prototype.check=function(){n.bind(this.img,"load",this),n.bind(this.img,"error",this),this.img.src=this.url;var e=this.getIsImageComplete();e&&(this.confirm(0!==this.img.naturalWidth,"naturalWidth"),this.unbindEvents())},a.prototype.unbindEvents=function(){n.unbind(this.img,"load",this),n.unbind(this.img,"error",this)},a.prototype.confirm=function(e,t){this.isLoaded=e,this.emit("progress",this,this.element,t)},o.makeJQueryPlugin=function(t){t=t||e.jQuery,t&&(u=t,u.fn.imagesLoaded=function(e,t){var n=new o(this,e,t);return n.jqDeferred.promise(u(this))})},o.makeJQueryPlugin(),o});

/**!
 * trunk8 v1.3.3
 * https://github.com/rviscomi/trunk8
 */

!function(t){function e(e){this.$element=t(e),this.original_text=t.trim(this.$element.html()),this.settings=t.extend({},t.fn.trunk8.defaults)}function n(t){var e=document.createElement("DIV");return e.innerHTML=t,"undefined"!=typeof e.textContent?e.textContent:e.innerText}function r(t){if(n(t)===t)return t.split(/\s/g);for(var e,i,a=[],s=/<([a-z]+)([^<]*)(?:>(.*?(?!<\1>))<\/\1>|\s+\/>)(['.?!,]*)|((?:[^<>\s])+['.?!,]*\w?|<br\s?\/?>)/gi,o=s.exec(t);o&&e!==s.lastIndex;)e=s.lastIndex,o[5]?a.push(o[5]):o[1]&&a.push({tag:o[1],attribs:o[2],content:o[3],after:o[4]}),o=s.exec(t);for(i=0;i<a.length;i++)"string"!=typeof a[i]&&a[i].content&&(a[i].content=r(a[i].content));return a}function i(e,n,r){e=e.replace(r,"");var i=function(n,a){var s,o,l,h,u="";for(h=0;h<n.length;h++)s=n[h],l=t.trim(e).split(" ").length,t.trim(e).length&&("string"==typeof s?(/<br\s*\/?>/i.test(s)||(1===l&&t.trim(e).length<=s.length?(s=e,("p"===a||"div"===a)&&(s+=r),e=""):e=e.replace(s,"")),u+=t.trim(s)+(h===n.length-1||1>=l?"":" ")):(o=i(s.content,s.tag),s.after&&(e=e.replace(s.after,"")),o&&(s.after||(s.after=" "),u+="<"+s.tag+s.attribs+">"+o+"</"+s.tag+">"+s.after)));return u},a=i(n);return a.slice(a.length-r.length)===r&&(a+=r),a}function a(){var e,a,s,l,u,c,f=this.data("trunk8"),g=f.settings,p=g.width,d=g.side,m=g.fill,v=g.parseHTML,y=o.getLineHeight(this)*g.lines,S=f.original_text,x=S.length,b="";if(this.html(S),u=this.text(),v&&n(S)!==S&&(c=r(S),S=n(S),x=S.length),p===h.auto){if(this.height()<=y)return;for(e=0,a=x-1;a>=e;)s=e+(a-e>>1),l=o.eatStr(S,d,x-s,m),v&&c&&(l=i(l,c,m)),this.html(l),this.height()>y?a=s-1:(e=s+1,b=b.length>l.length?b:l);this.html(""),this.html(b),g.tooltip&&this.attr("title",u)}else{if(isNaN(p))return void t.error('Invalid width "'+p+'".');s=x-p,l=o.eatStr(S,d,s,m),this.html(l),g.tooltip&&this.attr("title",S)}g.onTruncate()}var s,o,l={center:"center",left:"left",right:"right"},h={auto:"auto"};e.prototype.updateSettings=function(e){this.settings=t.extend(this.settings,e)},s={init:function(n){return this.each(function(){var r=t(this),i=r.data("trunk8");i||r.data("trunk8",i=new e(this)),i.updateSettings(n),a.call(r)})},update:function(e){return this.each(function(){var n=t(this);e&&(n.data("trunk8").original_text=e),a.call(n)})},revert:function(){return this.each(function(){var e=t(this).data("trunk8").original_text;t(this).html(e)})},getSettings:function(){return t(this.get(0)).data("trunk8").settings}},o={eatStr:function(e,n,r,i){var a,s,h=e.length,u=o.eatStr.generateKey.apply(null,arguments);if(o.eatStr.cache[u])return o.eatStr.cache[u];if(("string"!=typeof e||0===h)&&t.error('Invalid source string "'+e+'".'),0>r||r>h)t.error('Invalid bite size "'+r+'".');else if(0===r)return e;switch("string"!=typeof(i+"")&&t.error("Fill unable to be converted to a string."),n){case l.right:return o.eatStr.cache[u]=t.trim(e.substr(0,h-r))+i;case l.left:return o.eatStr.cache[u]=i+t.trim(e.substr(r));case l.center:return a=h>>1,s=r>>1,o.eatStr.cache[u]=t.trim(o.eatStr(e.substr(0,h-a),l.right,r-s,""))+i+t.trim(o.eatStr(e.substr(h-a),l.left,s,""));default:t.error('Invalid side "'+n+'".')}},getLineHeight:function(e){var n=t(e).css("float");"none"!==n&&t(e).css("float","none");var r=t(e).css("position");"absolute"===r&&t(e).css("position","static");var i,a=t(e).html(),s="line-height-test";return t(e).html("i").wrap('<div id="'+s+'" />'),i=t("#"+s).innerHeight(),t(e).html(a).css({"float":n,position:r}).unwrap(),i}},o.eatStr.cache={},o.eatStr.generateKey=function(){return Array.prototype.join.call(arguments,"")},t.fn.trunk8=function(e){return s[e]?s[e].apply(this,Array.prototype.slice.call(arguments,1)):"object"!=typeof e&&e?void t.error("Method "+e+" does not exist on jQuery.trunk8"):s.init.apply(this,arguments)},t.fn.trunk8.defaults={fill:"&hellip;",lines:1,side:l.right,tooltip:!0,width:h.auto,parseHTML:!1,onTruncate:function(){}}}(jQuery);

/**
 * jQuery Highlight plugin
 * Based on highlight v3 by Johann Burkard
 * http://johannburkard.de/blog/programming/javascript/highlight-javascript-text-higlighting-jquery-plugin.html
 */

jQuery.extend({highlight:function(e,t,n,i){if(3===e.nodeType){var r=e.data.match(t);if(r){var a=document.createElement(n||"span");a.className=i||"highlight";var h=e.splitText(r.index);h.splitText(r[0].length);var s=h.cloneNode(!0);return a.appendChild(s),h.parentNode.replaceChild(a,h),1}}else if(1===e.nodeType&&e.childNodes&&!/(script|style)/i.test(e.tagName)&&(e.tagName!==n.toUpperCase()||e.className!==i))for(var l=0;l<e.childNodes.length;l++)l+=jQuery.highlight(e.childNodes[l],t,n,i);return 0}}),jQuery.fn.unhighlight=function(e){var t={className:"highlight",element:"span"};return jQuery.extend(t,e),this.find(t.element+"."+t.className).each(function(){var e=this.parentNode;e.replaceChild(this.firstChild,this),e.normalize()}).end()},jQuery.fn.highlight=function(e,t){var n={className:"highlight",element:"span",caseSensitive:!1,wordsOnly:!1};if(jQuery.extend(n,t),e.constructor===String&&(e=[e]),e=jQuery.grep(e,function(e){return""!=e}),e=jQuery.map(e,function(e){return e.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&")}),0==e.length)return this;var i=n.caseSensitive?"":"i",r="("+e.join("|")+")";n.wordsOnly&&(r="\\b"+r+"\\b");var a=new RegExp(r,i);return this.each(function(){jQuery.highlight(this,a,n.element,n.className)})};
;jQuery.fn.removeHighlight=function(){return this.find("span.highlight").each(function(){this.parentNode.firstChild.nodeName;with(this.parentNode)replaceChild(this.firstChild,this),normalize()}).end()};


/**
 * Purl (A JavaScript URL parser) v2.3.1
 * Source repository: https://github.com/allmarkedup/jQuery-URL-Parser
 */
!function(t){"function"==typeof define&&define.amd?define(t):window.purl=t()}(function(){function t(t,e){for(var r=decodeURI(t),n=l[e?"strict":"loose"].exec(r),a={attr:{},param:{},seg:{}},i=14;i--;)a.attr[h[i]]=n[i]||"";return a.param.query=o(a.attr.query),a.param.fragment=o(a.attr.fragment),a.seg.path=a.attr.path.replace(/^\/+|\/+$/g,"").split("/"),a.seg.fragment=a.attr.fragment.replace(/^\/+|\/+$/g,"").split("/"),a.attr.base=a.attr.host?(a.attr.protocol?a.attr.protocol+"://"+a.attr.host:a.attr.host)+(a.attr.port?":"+a.attr.port:""):"",a}function e(t){var e=t.tagName;return"undefined"!=typeof e?p[e.toLowerCase()]:e}function r(t,e){if(0===t[e].length)return t[e]={};var r={};for(var n in t[e])r[n]=t[e][n];return t[e]=r,r}function n(t,e,a,o){var i=t.shift();if(i){var f=e[a]=e[a]||[];"]"==i?u(f)?""!==o&&f.push(o):"object"==typeof f?f[c(f).length]=o:f=e[a]=[e[a],o]:~i.indexOf("]")?(i=i.substr(0,i.length-1),!m.test(i)&&u(f)&&(f=r(e,a)),n(t,f,i,o)):(!m.test(i)&&u(f)&&(f=r(e,a)),n(t,f,i,o))}else u(e[a])?e[a].push(o):e[a]="object"==typeof e[a]?o:"undefined"==typeof e[a]?o:[e[a],o]}function a(t,e,r){if(~e.indexOf("]")){var a=e.split("[");n(a,t,"base",r)}else{if(!m.test(e)&&u(t.base)){var o={};for(var f in t.base)o[f]=t.base[f];t.base=o}""!==e&&i(t.base,e,r)}return t}function o(t){return s(String(t).split(/&|;/),function(t,e){try{e=decodeURIComponent(e.replace(/\+/g," "))}catch(r){}var n=e.indexOf("="),o=f(e),i=e.substr(0,o||n),s=e.substr(o||n,e.length);return s=s.substr(s.indexOf("=")+1,s.length),""===i&&(i=e,s=""),a(t,i,s)},{base:{}}).base}function i(t,e,r){var n=t[e];"undefined"==typeof n?t[e]=r:u(n)?n.push(r):t[e]=[n,r]}function f(t){for(var e,r,n=t.length,a=0;n>a;++a)if(r=t[a],"]"==r&&(e=!1),"["==r&&(e=!0),"="==r&&!e)return a}function s(t,e){for(var r=0,n=t.length>>0,a=arguments[2];n>r;)r in t&&(a=e.call(void 0,a,t[r],r,t)),++r;return a}function u(t){return"[object Array]"===Object.prototype.toString.call(t)}function c(t){var e=[];for(var r in t)t.hasOwnProperty(r)&&e.push(r);return e}function d(e,r){return 1===arguments.length&&e===!0&&(r=!0,e=void 0),r=r||!1,e=e||window.location.toString(),{data:t(e,r),attr:function(t){return t=g[t]||t,"undefined"!=typeof t?this.data.attr[t]:this.data.attr},param:function(t){return"undefined"!=typeof t?this.data.param.query[t]:this.data.param.query},fparam:function(t){return"undefined"!=typeof t?this.data.param.fragment[t]:this.data.param.fragment},segment:function(t){return"undefined"==typeof t?this.data.seg.path:(t=0>t?this.data.seg.path.length+t:t-1,this.data.seg.path[t])},fsegment:function(t){return"undefined"==typeof t?this.data.seg.fragment:(t=0>t?this.data.seg.fragment.length+t:t-1,this.data.seg.fragment[t])}}}var p={a:"href",img:"src",form:"action",base:"href",script:"src",iframe:"src",link:"href",embed:"src",object:"data"},h=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","fragment"],g={anchor:"fragment"},l={strict:/^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,loose:/^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/},m=/^[0-9]+$/;return d.jQuery=function(t){null!=t&&(t.fn.url=function(r){var n="";return this.length&&(n=t(this).attr(e(this[0]))||""),d(n,r)},t.url=d)},d.jQuery(window.jQuery),d});
// generate uniq code from string
String.prototype.to_code=function(){var r=this;if(""==r)return"";for(var t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/_-".split(""),o=40,e=0,n=0,i=r.length;i>n;n++)e=(r.charCodeAt(n)+31*e)%59;for(o=o||r.length;o>i;)r+=r,i+=i;r=r.slice(0,o);for(var a="",n=0;o>n;n++)a+=t[e=(n+e+r.charCodeAt(n))%64];return a};



// string to params, sample: a=1&ss=1 to {a:1, ss: 1}
String.prototype.unparam = function(){
    var query = this;
    var setValue = function(root, path, value){
        if(path.length > 1){
            var dir = path.shift();
            if( typeof root[dir] == 'undefined' ){
                root[dir] = path[0] == '' ? [] : {};
            }

            arguments.callee(root[dir], path, value);
        }else{
            if( root instanceof Array ){
                root.push(value);
            }else{
                root[path] = value;
            }
        }
    };
    var nvp = query.split('&');
    var data = {};
    for( var i = 0 ; i < nvp.length ; i++ ){
        var pair = nvp[i].split('=');
        var name = decodeURIComponent(pair[0]);
        var value = decodeURIComponent(pair[1]);

        var path = name.match(/(^[^\[]+)(\[.*\]$)?/);
        var first = path[1];
        if(path[2]){
            //case of 'array[level1]' || 'array[level1][level2]'
            path = path[2].match(/(?=\[(.*)\]$)/)[1].split('][')
        }else{
            //case of 'name'
            path = [];
        }
        path.unshift(first);

        setValue(data, path, value);
    }
    return data;
};


String.prototype.unparam2 = function(){
    var p = this;
    var ret = {},
        seg = p.replace(/^\?/,'').split('&'),
        len = seg.length, i = 0, s;
    for (;i<len;i++) {
        if (!seg[i]) { continue; }
        s = seg[i].split('=');
        var a = decodeURIComponent(s[0]);
        var b = decodeURIComponent(s[1]);
        if(ret[a]){
            if(typeof ret[a] == "string"){
                ret[a] = [ret[a]]
            }
            ret[a].push(b)
        }else{
            ret[a] = b;
        }

    }
    return ret;}

String.prototype.strip_stopwords = function(){
    var terms = ["no","de","la","lo","del","un", "una", "unas", "unos", "uno", "sobre", "todo", "tambien", "tras", "otro", "algun", "alguno", "alguna", "algunos", "algunas", "ser", "es", "soy", "eres", "somos", "sois", "estoy", "esta", "estamos", "estais", "estan", "como", "en", "para", "atras", "porque", "por", "que", "estado", "estaba", "ante", "antes", "siendo", "ambos", "pero", "por", "poder", "puede", "puedo", "podemos", "podeis", "pueden", "fui", "fue", "fuimos", "fueron", "hacer", "hago", "hace", "hacemos", "haceis", "hacen", "cada", "fin", "incluso", "primero", "desde", "conseguir", "consigo", "consigue", "consigues", "conseguimos", "consiguen", "ir", "voy", "va", "vamos", "vais", "van", "vaya", "gueno", "ha", "tener", "tengo", "tiene", "tenemos", "teneis", "tienen", "el", "la", "lo", "las", "los", "su", "aqui", "mio", "tuyo", "ellos", "ellas", "nos", "nosotros", "vosotros", "vosotras", "si", "dentro", "solo", "solamente", "saber", "sabes", "sabe", "sabemos", "sabeis", "saben", "ultimo", "largo", "bastante", "haces", "muchos", "aquellos", "aquellas", "sus", "entonces", "tiempo", "verdad", "verdadero", "verdadera", "cierto", "ciertos", "cierta", "ciertas", "intentar", "intento", "intenta", "intentas", "intentamos", "intentais", "intentan", "dos", "bajo", "arriba", "encima", "usar", "uso", "usas", "usa", "usamos", "usais", "usan", "emplear", "empleo", "empleas", "emplean", "ampleamos", "empleais", "valor", "muy", "era", "eras", "eramos", "eran", "modo", "bien", "cual", "cuando", "donde", "mientras", "quien", "con", "entre", "sin", "trabajo", "trabajar", "trabajas", "trabaja", "trabajamos", "trabajais", "trabajan", "podria", "podrias", "podriamos", "podrian", "podriais", "yo", "aquel"];
    terms = terms.map(function(term){
        return term.toLowerCase();
    });
    var words = this.split(/[\W]/).filter(function(word){
        return word.length;
    });
    return words.filter(function(word){
        return terms.indexOf(word.toLowerCase()) < 0;
    }).join(' ');
};

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf())
    date.setDate(date.getDate() + days);
    return date;
};



/**
 * print_r in js
 * @param r
 * @param t
 * @returns {*}
 */

function print_r(r,t){var e="",n=" ",o=4,c=this.window.document,a=function(r){var t=/\W*function\s+([\w\$]+)\s*\(/.exec(r);return t?t[1]:"(Anonymous)"};if(repeat_char=function(r,t){for(var e="",n=0;r>n;n++)e+=t;return e},formatArray=function(r,t,e,n){t>0&&t++;var o=repeat_char(e*t,n),c=repeat_char(e*(t+1),n),i="";if("object"==typeof r&&null!==r&&r.constructor&&"PHPJS_Resource"!==a(r.constructor)){i+="Array\n"+o+"(\n";for(var u in r)i+="[object Array]"===Object.prototype.toString.call(r[u])?c+"["+u+"] => "+formatArray(r[u],t+1,e,n):c+"["+u+"] => "+r[u]+"\n";i+=o+")\n"}else i=null===r||void 0===r?"":r.toString();return i},e=formatArray(r,0,o,n),t!==!0){if(c.body)return(e);else try{return ('<pre style="white-space:pre;">'+e+"</pre>")}catch(i){return e}return e}return e}

// html_entity_decode

function get_html_translation_table(e,r){var t,a={},i={},c={},u={},l={},o={};if(c[0]="HTML_SPECIALCHARS",c[1]="HTML_ENTITIES",u[0]="ENT_NOQUOTES",u[2]="ENT_COMPAT",u[3]="ENT_QUOTES",l=isNaN(e)?e?e.toUpperCase():"HTML_SPECIALCHARS":c[e],o=isNaN(r)?r?r.toUpperCase():"ENT_COMPAT":u[r],"HTML_SPECIALCHARS"!==l&&"HTML_ENTITIES"!==l)throw new Error("Table: "+l+" not supported");a[38]="&","HTML_ENTITIES"===l&&(a[160]="&nbsp;",a[161]="&iexcl;",a[162]="&cent;",a[163]="&pound;",a[164]="&curren;",a[165]="&yen;",a[166]="&brvbar;",a[167]="&sect;",a[168]="&uml;",a[169]="&copy;",a[170]="&ordf;",a[171]="&laquo;",a[172]="&not;",a[173]="&shy;",a[174]="&reg;",a[175]="&macr;",a[176]="&deg;",a[177]="&plusmn;",a[178]="&sup2;",a[179]="&sup3;",a[180]="&acute;",a[181]="&micro;",a[182]="&para;",a[183]="&middot;",a[184]="&cedil;",a[185]="&sup1;",a[186]="&ordm;",a[187]="&raquo;",a[188]="&frac14;",a[189]="&frac12;",a[190]="&frac34;",a[191]="&iquest;",a[192]="&Agrave;",a[193]="&Aacute;",a[194]="&Acirc;",a[195]="&Atilde;",a[196]="&Auml;",a[197]="&Aring;",a[198]="&AElig;",a[199]="&Ccedil;",a[200]="&Egrave;",a[201]="&Eacute;",a[202]="&Ecirc;",a[203]="&Euml;",a[204]="&Igrave;",a[205]="&Iacute;",a[206]="&Icirc;",a[207]="&Iuml;",a[208]="&ETH;",a[209]="&Ntilde;",a[210]="&Ograve;",a[211]="&Oacute;",a[212]="&Ocirc;",a[213]="&Otilde;",a[214]="&Ouml;",a[215]="&times;",a[216]="&Oslash;",a[217]="&Ugrave;",a[218]="&Uacute;",a[219]="&Ucirc;",a[220]="&Uuml;",a[221]="&Yacute;",a[222]="&THORN;",a[223]="&szlig;",a[224]="&agrave;",a[225]="&aacute;",a[226]="&acirc;",a[227]="&atilde;",a[228]="&auml;",a[229]="&aring;",a[230]="&aelig;",a[231]="&ccedil;",a[232]="&egrave;",a[233]="&eacute;",a[234]="&ecirc;",a[235]="&euml;",a[236]="&igrave;",a[237]="&iacute;",a[238]="&icirc;",a[239]="&iuml;",a[240]="&eth;",a[241]="&ntilde;",a[242]="&ograve;",a[243]="&oacute;",a[244]="&ocirc;",a[245]="&otilde;",a[246]="&ouml;",a[247]="&divide;",a[248]="&oslash;",a[249]="&ugrave;",a[250]="&uacute;",a[251]="&ucirc;",a[252]="&uuml;",a[253]="&yacute;",a[254]="&thorn;",a[255]="&yuml;"),"ENT_NOQUOTES"!==o&&(a[34]="&quot;"),"ENT_QUOTES"===o&&(a[39]="&#39;"),a[60]="&lt;",a[62]="&gt;";for(t in a)a.hasOwnProperty(t)&&(i[String.fromCharCode(t)]=a[t]);return i}
function html_entity_decode(e,r){var t={},a="",i="",c="";if(i=e.toString(),!1===(t=this.get_html_translation_table("HTML_ENTITIES",r)))return!1;delete t["&"],t["&"]="&";for(a in t)c=t[a],i=i.split(c).join(a);return i=i.split("&#039;").join("'")}
function htmlentities(n,t,r,i){var e=this.get_html_translation_table("HTML_ENTITIES",t),l="";if(n=null==n?"":n+"",!e)return!1;if(t&&"ENT_QUOTES"===t&&(e["'"]="&#039;"),i||null==i)for(l in e)e.hasOwnProperty(l)&&(n=n.split(l).join(e[l]));else n=n.replace(/([\s\S]*?)(&(?:#\d+|#x[\da-f]+|[a-zA-Z][\da-z]*);|$)/g,function(n,t,r){for(l in e)e.hasOwnProperty(l)&&(t=t.split(l).join(e[l]));return t+r});return n}

/*!
Lazy Load 1.9.3 - MIT license - Copyright 2010-2013 Mika Tuupola
 http://www.appelsiini.net/projects/lazyload
*/
(function($, window, document, undefined) {
    var $window = $(window);

    $.fn.lazyload = function(options) {
        var elements = this;
        var $container;
        var settings = {
            threshold       : 0,
            failure_limit   : 0,
            event           : "scroll",
            effect          : "show",
            container       : window,
            data_attribute  : "original",
            skip_invisible  : false,
            appear          : null,
            load            : null,
            placeholder     : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC"
        };

        function update() {
            var counter = 0;

            elements.each(function() {
                var $this = $(this);
                if (settings.skip_invisible && !$this.is(":visible")) {
                    return;
                }
                if ($.abovethetop(this, settings) ||
                    $.leftofbegin(this, settings)) {
                    /* Nothing. */
                } else if (!$.belowthefold(this, settings) &&
                    !$.rightoffold(this, settings)) {
                    $this.trigger("appear");
                    /* if we found an image we'll load, reset the counter */
                    counter = 0;
                } else {
                    if (++counter > settings.failure_limit) {
                        return false;
                    }
                }
            });

        }

        if(options) {
            /* Maintain BC for a couple of versions. */
            if (undefined !== options.failurelimit) {
                options.failure_limit = options.failurelimit;
                delete options.failurelimit;
            }
            if (undefined !== options.effectspeed) {
                options.effect_speed = options.effectspeed;
                delete options.effectspeed;
            }

            $.extend(settings, options);
        }

        /* Cache container as jQuery as object. */
        $container = (settings.container === undefined ||
        settings.container === window) ? $window : $(settings.container);

        /* Fire one scroll event per scroll. Not one scroll event per image. */
        if (0 === settings.event.indexOf("scroll")) {
            $container.bind(settings.event, function() {
                return update();
            });
        }

        this.each(function() {
            var self = this;
            var $self = $(self);

            self.loaded = false;

            /* If no src attribute given use data:uri. */
            if ($self.attr("src") === undefined || $self.attr("src") === false) {
                if ($self.is("img")) {
                    $self.attr("src", settings.placeholder);
                }
            }

            /* When appear is triggered load original image. */
            $self.one("appear", function() {
                if (!this.loaded) {
                    if (settings.appear) {
                        var elements_left = elements.length;
                        settings.appear.call(self, elements_left, settings);
                    }
                    $("<img />")
                        .bind("load", function() {

                            var original = $self.attr("data-" + settings.data_attribute);
                            $self.hide();
                            if ($self.is("img")) {
                                $self.attr("src", original);
                            } else {
                                $self.css("background-image", "url('" + original + "')");
                            }
                            $self[settings.effect](settings.effect_speed);

                            self.loaded = true;

                            /* Remove image from array so it is not looped next time. */
                            var temp = $.grep(elements, function(element) {
                                return !element.loaded;
                            });
                            elements = $(temp);

                            if (settings.load) {
                                var elements_left = elements.length;
                                settings.load.call(self, elements_left, settings);
                            }
                        })
                        .attr("src", $self.attr("data-" + settings.data_attribute));
                }
            });

            /* When wanted event is triggered load original image */
            /* by triggering appear.                              */
            if (0 !== settings.event.indexOf("scroll")) {
                $self.bind(settings.event, function() {
                    if (!self.loaded) {
                        $self.trigger("appear");
                    }
                });
            }
        });

        /* Check if something appears when window is resized. */
        $window.bind("resize", function() {
            update();
        });

        /* With IOS5 force loading images when navigating with back button. */
        /* Non optimal workaround. */
        if ((/(?:iphone|ipod|ipad).*os 5/gi).test(navigator.appVersion)) {
            $window.bind("pageshow", function(event) {
                if (event.originalEvent && event.originalEvent.persisted) {
                    elements.each(function() {
                        $(this).trigger("appear");
                    });
                }
            });
        }

        /* Force initial check if images should appear. */
        $(document).ready(function() {
            update();
        });

        return this;
    };

    /* Convenience methods in jQuery namespace.           */
    /* Use as  $.belowthefold(element, {threshold : 100, container : window}) */

    $.belowthefold = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = (window.innerHeight ? window.innerHeight : $window.height()) + $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top + $(settings.container).height();
        }

        return fold <= $(element).offset().top - settings.threshold;
    };

    $.rightoffold = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.width() + $window.scrollLeft();
        } else {
            fold = $(settings.container).offset().left + $(settings.container).width();
        }

        return fold <= $(element).offset().left - settings.threshold;
    };

    $.abovethetop = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top;
        }

        return fold >= $(element).offset().top + settings.threshold  + $(element).height();
    };

    $.leftofbegin = function(element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollLeft();
        } else {
            fold = $(settings.container).offset().left;
        }

        return fold >= $(element).offset().left + settings.threshold + $(element).width();
    };

    $.inviewport = function(element, settings) {
        return !$.rightoffold(element, settings) && !$.leftofbegin(element, settings) &&
            !$.belowthefold(element, settings) && !$.abovethetop(element, settings);
    };

    /* Custom selectors for your convenience.   */
    /* Use as $("img:below-the-fold").something() or */
    /* $("img").filter(":below-the-fold").something() which is faster */

    $.extend($.expr[":"], {
        "below-the-fold" : function(a) { return $.belowthefold(a, {threshold : 0}); },
        "above-the-top"  : function(a) { return !$.belowthefold(a, {threshold : 0}); },
        "right-of-screen": function(a) { return $.rightoffold(a, {threshold : 0}); },
        "left-of-screen" : function(a) { return !$.rightoffold(a, {threshold : 0}); },
        "in-viewport"    : function(a) { return $.inviewport(a, {threshold : 0}); },
        /* Maintain BC for couple of versions. */
        "above-the-fold" : function(a) { return !$.belowthefold(a, {threshold : 0}); },
        "right-of-fold"  : function(a) { return $.rightoffold(a, {threshold : 0}); },
        "left-of-fold"   : function(a) { return !$.rightoffold(a, {threshold : 0}); }
    });

})(jQuery, window, document);

/*
 Gibberish-AES
 A lightweight Javascript Libray for OpenSSL compatible AES CBC encryption.
 Usage: GibberishAES.enc("secret", "password")
 Outputs: AES Encrypted text encoded in Base64
 */
(function(r,n){"object"===typeof exports?module.exports=n():"function"===typeof define&&define.amd?define(n):r.GibberishAES=n()})(this,function(){var r=14,n=8,u=!1,O=function(a,d){var b="",c,k;if(d){c=a[15];if(16<c)throw"Decryption error: Maybe bad key";if(16===c)return"";for(k=0;k<16-c;k++)b+=String.fromCharCode(a[k])}else for(k=0;16>k;k++)b+=String.fromCharCode(a[k]);return b},z=function(a,d){var b=[],c;if(!d)try{a=unescape(encodeURIComponent(a))}catch(k){throw"Error on UTF-8 encode";}for(c=0;c<
    a.length;c++)b[c]=a.charCodeAt(c);return b},K=function(a,d){var b=12<=r?3:2,c=[],k=[],c=[],k=[],m=a.concat(d),p;c[0]=J(m);k=c[0];for(p=1;p<b;p++)c[p]=J(c[p-1].concat(m)),k=k.concat(c[p]);c=k.slice(0,4*n);k=k.slice(4*n,4*n+16);return{key:c,iv:k}},Q=function(a,d,b){d=L(d);var c=Math.ceil(a.length/16),k=[],m,p=[];for(m=0;m<c;m++){var j=k,t=m,n=a.slice(16*m,16*m+16),s=[],q=void 0,q=void 0;16>n.length&&(q=16-n.length,s=[q,q,q,q,q,q,q,q,q,q,q,q,q,q,q,q]);for(q=0;q<n.length;q++)s[q]=n[q];j[t]=s}0===a.length%
    16&&k.push([16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16]);for(m=0;m<k.length;m++)k[m]=0===m?A(k[m],b):A(k[m],p[m-1]),p[m]=P(k[m],d);return p},S=function(a,d,b,c){d=L(d);var k=a.length/16,m=[],p,j=[],t="";for(p=0;p<k;p++)m.push(a.slice(16*p,16*(p+1)));for(p=m.length-1;0<=p;p--)j[p]=R(m[p],d),j[p]=0===p?A(j[p],b):A(j[p],m[p-1]);for(p=0;p<k-1;p++)t+=O(j[p]);var t=t+O(j[p],!0),n;if(c)n=t;else try{n=decodeURIComponent(escape(t))}catch(s){throw"Bad Key";}return n},P=function(a,d){u=!1;var b=B(a,d,0),
        c;for(c=1;c<r+1;c++)b=T(b),b=U(b),c<r&&(b=V(b)),b=B(b,d,c);return b},R=function(a,d){u=!0;var b=B(a,d,r),c;for(c=r-1;-1<c;c--)b=U(b),b=T(b),b=B(b,d,c),0<c&&(b=V(b));return b},T=function(a){var d=u?W:M,b=[],c;for(c=0;16>c;c++)b[c]=d[a[c]];return b},U=function(a){var d=[],b=u?[0,13,10,7,4,1,14,11,8,5,2,15,12,9,6,3]:[0,5,10,15,4,9,14,3,8,13,2,7,12,1,6,11],c;for(c=0;16>c;c++)d[c]=a[b[c]];return d},V=function(a){var d=[],b;if(u)for(b=0;4>b;b++)d[4*b]=C[a[4*b]]^D[a[1+4*b]]^E[a[2+4*b]]^F[a[3+4*b]],d[1+4*
    b]=F[a[4*b]]^C[a[1+4*b]]^D[a[2+4*b]]^E[a[3+4*b]],d[2+4*b]=E[a[4*b]]^F[a[1+4*b]]^C[a[2+4*b]]^D[a[3+4*b]],d[3+4*b]=D[a[4*b]]^E[a[1+4*b]]^F[a[2+4*b]]^C[a[3+4*b]];else for(b=0;4>b;b++)d[4*b]=G[a[4*b]]^H[a[1+4*b]]^a[2+4*b]^a[3+4*b],d[1+4*b]=a[4*b]^G[a[1+4*b]]^H[a[2+4*b]]^a[3+4*b],d[2+4*b]=a[4*b]^a[1+4*b]^G[a[2+4*b]]^H[a[3+4*b]],d[3+4*b]=H[a[4*b]]^a[1+4*b]^a[2+4*b]^G[a[3+4*b]];return d},B=function(a,d,b){var c=[],k;for(k=0;16>k;k++)c[k]=a[k]^d[b][k];return c},A=function(a,d){var b=[],c;for(c=0;16>c;c++)b[c]=
        a[c]^d[c];return b},L=function(a){var d=[],b=[],c,k,m=[];for(c=0;c<n;c++)k=[a[4*c],a[4*c+1],a[4*c+2],a[4*c+3]],d[c]=k;for(c=n;c<4*(r+1);c++){d[c]=[];for(a=0;4>a;a++)b[a]=d[c-1][a];if(0===c%n){a=b[0];k=void 0;for(k=0;3>k;k++)b[k]=b[k+1];b[3]=a;b=X(b);b[0]^=$[c/n-1]}else 6<n&&4===c%n&&(b=X(b));for(a=0;4>a;a++)d[c][a]=d[c-n][a]^b[a]}for(c=0;c<r+1;c++){m[c]=[];for(b=0;4>b;b++)m[c].push(d[4*c+b][0],d[4*c+b][1],d[4*c+b][2],d[4*c+b][3])}return m},X=function(a){for(var d=0;4>d;d++)a[d]=M[a[d]];return a},
    N=function(a,d){var b,c=[];for(b=0;b<a.length;b+=d)c[b/d]=parseInt(a.substr(b,d),16);return c},v=function(a){var d,b=[];for(d=0;256>d;d++){for(var c=b,k=d,m=a,p=d,j=void 0,n=void 0,j=n=0;8>j;j++)n=1===(p&1)?n^m:n,m=127<m?283^m<<1:m<<1,p>>>=1;c[k]=n}return b},M=N("637c777bf26b6fc53001672bfed7ab76ca82c97dfa5947f0add4a2af9ca472c0b7fd9326363ff7cc34a5e5f171d8311504c723c31896059a071280e2eb27b27509832c1a1b6e5aa0523bd6b329e32f8453d100ed20fcb15b6acbbe394a4c58cfd0efaafb434d338545f9027f503c9fa851a3408f929d38f5bcb6da2110fff3d2cd0c13ec5f974417c4a77e3d645d197360814fdc222a908846eeb814de5e0bdbe0323a0a4906245cc2d3ac629195e479e7c8376d8dd54ea96c56f4ea657aae08ba78252e1ca6b4c6e8dd741f4bbd8b8a703eb5664803f60e613557b986c11d9ee1f8981169d98e949b1e87e9ce5528df8ca1890dbfe6426841992d0fb054bb16",
        2),W,Y=M,x,Z=[];for(x=0;x<Y.length;x++)Z[Y[x]]=x;W=Z;var $=N("01020408102040801b366cd8ab4d9a2f5ebc63c697356ad4b37dfaefc591",2),G=v(2),H=v(3),F=v(9),D=v(11),E=v(13),C=v(14),J=function(a){function d(a,b){var c,d,e,g,f;e=a&2147483648;g=b&2147483648;c=a&1073741824;d=b&1073741824;f=(a&1073741823)+(b&1073741823);return c&d?f^2147483648^e^g:c|d?f&1073741824?f^3221225472^e^g:f^1073741824^e^g:f^e^g}function b(a,b,c,e,f,g,h){a=d(a,d(d(b&c|~b&e,f),h));return d(a<<g|a>>>32-g,b)}function c(a,b,c,e,g,f,h){a=d(a,
    d(d(b&e|c&~e,g),h));return d(a<<f|a>>>32-f,b)}function k(a,b,c,e,f,g,h){a=d(a,d(d(b^c^e,f),h));return d(a<<g|a>>>32-g,b)}function m(a,b,c,e,g,f,h){a=d(a,d(d(c^(b|~e),g),h));return d(a<<f|a>>>32-f,b)}function p(a){var b,c,d=[];for(c=0;3>=c;c++)b=a>>>8*c&255,d=d.concat(b);return d}var j=[],n,r,s,q,e,g,f,h,l=N("67452301efcdab8998badcfe10325476d76aa478e8c7b756242070dbc1bdceeef57c0faf4787c62aa8304613fd469501698098d88b44f7afffff5bb1895cd7be6b901122fd987193a679438e49b40821f61e2562c040b340265e5a51e9b6c7aad62f105d02441453d8a1e681e7d3fbc821e1cde6c33707d6f4d50d87455a14eda9e3e905fcefa3f8676f02d98d2a4c8afffa39428771f6816d9d6122fde5380ca4beea444bdecfa9f6bb4b60bebfbc70289b7ec6eaa127fad4ef308504881d05d9d4d039e6db99e51fa27cf8c4ac5665f4292244432aff97ab9423a7fc93a039655b59c38f0ccc92ffeff47d85845dd16fa87e4ffe2ce6e0a30143144e0811a1f7537e82bd3af2352ad7d2bbeb86d391",
    8),j=a.length;n=j+8;r=16*((n-n%64)/64+1);s=[];for(e=q=0;e<j;)n=(e-e%4)/4,q=8*(e%4),s[n]|=a[e]<<q,e++;n=(e-e%4)/4;s[n]|=128<<8*(e%4);s[r-2]=j<<3;s[r-1]=j>>>29;j=s;e=l[0];g=l[1];f=l[2];h=l[3];for(a=0;a<j.length;a+=16)n=e,r=g,s=f,q=h,e=b(e,g,f,h,j[a+0],7,l[4]),h=b(h,e,g,f,j[a+1],12,l[5]),f=b(f,h,e,g,j[a+2],17,l[6]),g=b(g,f,h,e,j[a+3],22,l[7]),e=b(e,g,f,h,j[a+4],7,l[8]),h=b(h,e,g,f,j[a+5],12,l[9]),f=b(f,h,e,g,j[a+6],17,l[10]),g=b(g,f,h,e,j[a+7],22,l[11]),e=b(e,g,f,h,j[a+8],7,l[12]),h=b(h,e,g,f,j[a+9],
    12,l[13]),f=b(f,h,e,g,j[a+10],17,l[14]),g=b(g,f,h,e,j[a+11],22,l[15]),e=b(e,g,f,h,j[a+12],7,l[16]),h=b(h,e,g,f,j[a+13],12,l[17]),f=b(f,h,e,g,j[a+14],17,l[18]),g=b(g,f,h,e,j[a+15],22,l[19]),e=c(e,g,f,h,j[a+1],5,l[20]),h=c(h,e,g,f,j[a+6],9,l[21]),f=c(f,h,e,g,j[a+11],14,l[22]),g=c(g,f,h,e,j[a+0],20,l[23]),e=c(e,g,f,h,j[a+5],5,l[24]),h=c(h,e,g,f,j[a+10],9,l[25]),f=c(f,h,e,g,j[a+15],14,l[26]),g=c(g,f,h,e,j[a+4],20,l[27]),e=c(e,g,f,h,j[a+9],5,l[28]),h=c(h,e,g,f,j[a+14],9,l[29]),f=c(f,h,e,g,j[a+3],14,l[30]),
    g=c(g,f,h,e,j[a+8],20,l[31]),e=c(e,g,f,h,j[a+13],5,l[32]),h=c(h,e,g,f,j[a+2],9,l[33]),f=c(f,h,e,g,j[a+7],14,l[34]),g=c(g,f,h,e,j[a+12],20,l[35]),e=k(e,g,f,h,j[a+5],4,l[36]),h=k(h,e,g,f,j[a+8],11,l[37]),f=k(f,h,e,g,j[a+11],16,l[38]),g=k(g,f,h,e,j[a+14],23,l[39]),e=k(e,g,f,h,j[a+1],4,l[40]),h=k(h,e,g,f,j[a+4],11,l[41]),f=k(f,h,e,g,j[a+7],16,l[42]),g=k(g,f,h,e,j[a+10],23,l[43]),e=k(e,g,f,h,j[a+13],4,l[44]),h=k(h,e,g,f,j[a+0],11,l[45]),f=k(f,h,e,g,j[a+3],16,l[46]),g=k(g,f,h,e,j[a+6],23,l[47]),e=k(e,g,
    f,h,j[a+9],4,l[48]),h=k(h,e,g,f,j[a+12],11,l[49]),f=k(f,h,e,g,j[a+15],16,l[50]),g=k(g,f,h,e,j[a+2],23,l[51]),e=m(e,g,f,h,j[a+0],6,l[52]),h=m(h,e,g,f,j[a+7],10,l[53]),f=m(f,h,e,g,j[a+14],15,l[54]),g=m(g,f,h,e,j[a+5],21,l[55]),e=m(e,g,f,h,j[a+12],6,l[56]),h=m(h,e,g,f,j[a+3],10,l[57]),f=m(f,h,e,g,j[a+10],15,l[58]),g=m(g,f,h,e,j[a+1],21,l[59]),e=m(e,g,f,h,j[a+8],6,l[60]),h=m(h,e,g,f,j[a+15],10,l[61]),f=m(f,h,e,g,j[a+6],15,l[62]),g=m(g,f,h,e,j[a+13],21,l[63]),e=m(e,g,f,h,j[a+4],6,l[64]),h=m(h,e,g,f,j[a+
11],10,l[65]),f=m(f,h,e,g,j[a+2],15,l[66]),g=m(g,f,h,e,j[a+9],21,l[67]),e=d(e,n),g=d(g,r),f=d(f,s),h=d(h,q);return p(e).concat(p(g),p(f),p(h))},I,w="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",y=w.split("");"function"===typeof Array.indexOf&&(w=y);I={encode:function(a){var d=[],b="",c;for(c=0;c<16*a.length;c++)d.push(a[Math.floor(c/16)][c%16]);for(c=0;c<d.length;c+=3)b+=y[d[c]>>2],b+=y[(d[c]&3)<<4|d[c+1]>>4],b=void 0!==d[c+1]?b+y[(d[c+1]&15)<<2|d[c+2]>>6]:b+"=",b=void 0!==d[c+
2]?b+y[d[c+2]&63]:b+"=";a=b.slice(0,64)+"\n";for(c=1;c<Math.ceil(b.length/64);c++)a+=b.slice(64*c,64*c+64)+(Math.ceil(b.length/64)===c+1?"":"\n");return a},decode:function(a){a=a.replace(/\n/g,"");var d=[],b=[],c=[],k;for(k=0;k<a.length;k+=4)b[0]=w.indexOf(a.charAt(k)),b[1]=w.indexOf(a.charAt(k+1)),b[2]=w.indexOf(a.charAt(k+2)),b[3]=w.indexOf(a.charAt(k+3)),c[0]=b[0]<<2|b[1]>>4,c[1]=(b[1]&15)<<4|b[2]>>2,c[2]=(b[2]&3)<<6|b[3],d.push(c[0],c[1],c[2]);return d=d.slice(0,d.length-d.length%16)}};return{size:function(a){switch(a){case 128:r=
    10;n=4;break;case 192:r=12;n=6;break;case 256:r=14;n=8;break;default:throw"Invalid Key Size Specified:"+a;}},h2a:function(a){var d=[];a.replace(/(..)/g,function(a){d.push(parseInt(a,16))});return d},expandKey:L,encryptBlock:P,decryptBlock:R,Decrypt:u,s2a:z,rawEncrypt:Q,rawDecrypt:S,dec:function(a,d,b){a=I.decode(a);var c=a.slice(8,16),c=K(z(d,b),c);d=c.key;c=c.iv;a=a.slice(16,a.length);return a=S(a,d,c,b)},openSSLKey:K,a2h:function(a){var d="",b;for(b=0;b<a.length;b++)d+=(16>a[b]?"0":"")+a[b].toString(16);
    return d},enc:function(a,d,b){var c;c=[];var k;for(k=0;8>k;k++)c=c.concat(Math.floor(256*Math.random()));k=K(z(d,b),c);d=k.key;k=k.iv;c=[[83,97,108,116,101,100,95,95].concat(c)];a=z(a,b);a=Q(a,d,k);a=c.concat(a);return I.encode(a)},Hash:{MD5:J},Base64:I}});


/* jQuery Storage API Plugin 1.7.4 https://github.com/julien-maurel/jQuery-Storage-API
* storage=$.localStorage
* $.sessionStorage
* */
!function(e){"function"==typeof define&&define.amd?define(["jquery"],e):e("object"==typeof exports?require("jquery"):jQuery)}(function(e){function t(t){var r,i,n,o=arguments.length,s=window[t],a=arguments,u=a[1];if(2>o)throw Error("Minimum 2 arguments must be given");if(e.isArray(u)){i={};for(var f in u){r=u[f];try{i[r]=JSON.parse(s.getItem(r))}catch(c){i[r]=s.getItem(r)}}return i}if(2!=o){try{i=JSON.parse(s.getItem(u))}catch(c){throw new ReferenceError(u+" is not defined in this storage")}for(var f=2;o-1>f;f++)if(i=i[a[f]],void 0===i)throw new ReferenceError([].slice.call(a,1,f+1).join(".")+" is not defined in this storage");if(e.isArray(a[f])){n=i,i={};for(var m in a[f])i[a[f][m]]=n[a[f][m]];return i}return i[a[f]]}try{return JSON.parse(s.getItem(u))}catch(c){return s.getItem(u)}}function r(t){var r,i,n=arguments.length,o=window[t],s=arguments,a=s[1],u=s[2],f={};if(2>n||!e.isPlainObject(a)&&3>n)throw Error("Minimum 3 arguments must be given or second parameter must be an object");if(e.isPlainObject(a)){for(var c in a)r=a[c],e.isPlainObject(r)?o.setItem(c,JSON.stringify(r)):o.setItem(c,r);return a}if(3==n)return"object"==typeof u?o.setItem(a,JSON.stringify(u)):o.setItem(a,u),u;try{i=o.getItem(a),null!=i&&(f=JSON.parse(i))}catch(m){}i=f;for(var c=2;n-2>c;c++)r=s[c],i[r]&&e.isPlainObject(i[r])||(i[r]={}),i=i[r];return i[s[c]]=s[c+1],o.setItem(a,JSON.stringify(f)),f}function i(t){var r,i,n=arguments.length,o=window[t],s=arguments,a=s[1];if(2>n)throw Error("Minimum 2 arguments must be given");if(e.isArray(a)){for(var u in a)o.removeItem(a[u]);return!0}if(2==n)return o.removeItem(a),!0;try{r=i=JSON.parse(o.getItem(a))}catch(f){throw new ReferenceError(a+" is not defined in this storage")}for(var u=2;n-1>u;u++)if(i=i[s[u]],void 0===i)throw new ReferenceError([].slice.call(s,1,u).join(".")+" is not defined in this storage");if(e.isArray(s[u]))for(var c in s[u])delete i[s[u][c]];else delete i[s[u]];return o.setItem(a,JSON.stringify(r)),!0}function n(t,r){var n=a(t);for(var o in n)i(t,n[o]);if(r)for(var o in e.namespaceStorages)u(o)}function o(r){var i=arguments.length,n=arguments,s=(window[r],n[1]);if(1==i)return 0==a(r).length;if(e.isArray(s)){for(var u=0;u<s.length;u++)if(!o(r,s[u]))return!1;return!0}try{var f=t.apply(this,arguments);e.isArray(n[i-1])||(f={totest:f});for(var u in f)if(!(e.isPlainObject(f[u])&&e.isEmptyObject(f[u])||e.isArray(f[u])&&!f[u].length)&&f[u])return!1;return!0}catch(c){return!0}}function s(r){var i=arguments.length,n=arguments,o=(window[r],n[1]);if(2>i)throw Error("Minimum 2 arguments must be given");if(e.isArray(o)){for(var a=0;a<o.length;a++)if(!s(r,o[a]))return!1;return!0}try{var u=t.apply(this,arguments);e.isArray(n[i-1])||(u={totest:u});for(var a in u)if(void 0===u[a]||null===u[a])return!1;return!0}catch(f){return!1}}function a(r){var i=arguments.length,n=window[r],o=arguments,s=(o[1],[]),a={};if(a=i>1?t.apply(this,o):n,a._cookie)for(var u in e.cookie())""!=u&&s.push(u.replace(a._prefix,""));else for(var f in a)s.push(f);return s}function u(t){if(!t||"string"!=typeof t)throw Error("First parameter must be a string");g?(window.localStorage.getItem(t)||window.localStorage.setItem(t,"{}"),window.sessionStorage.getItem(t)||window.sessionStorage.setItem(t,"{}")):(window.localCookieStorage.getItem(t)||window.localCookieStorage.setItem(t,"{}"),window.sessionCookieStorage.getItem(t)||window.sessionCookieStorage.setItem(t,"{}"));var r={localStorage:e.extend({},e.localStorage,{_ns:t}),sessionStorage:e.extend({},e.sessionStorage,{_ns:t})};return e.cookie&&(window.cookieStorage.getItem(t)||window.cookieStorage.setItem(t,"{}"),r.cookieStorage=e.extend({},e.cookieStorage,{_ns:t})),e.namespaceStorages[t]=r,r}function f(e){var t="jsapi";try{return window[e]?(window[e].setItem(t,t),window[e].removeItem(t),!0):!1}catch(r){return!1}}var c="ls_",m="ss_",g=f("localStorage"),l={_type:"",_ns:"",_callMethod:function(e,t){var r=[this._type],t=Array.prototype.slice.call(t),i=t[0];return this._ns&&r.push(this._ns),"string"==typeof i&&-1!==i.indexOf(".")&&(t.shift(),[].unshift.apply(t,i.split("."))),[].push.apply(r,t),e.apply(this,r)},get:function(){return this._callMethod(t,arguments)},set:function(){var t=arguments.length,i=arguments,n=i[0];if(1>t||!e.isPlainObject(n)&&2>t)throw Error("Minimum 2 arguments must be given or first parameter must be an object");if(e.isPlainObject(n)&&this._ns){for(var o in n)r(this._type,this._ns,o,n[o]);return n}var s=this._callMethod(r,i);return this._ns?s[n.split(".")[0]]:s},remove:function(){if(arguments.length<1)throw Error("Minimum 1 argument must be given");return this._callMethod(i,arguments)},removeAll:function(e){return this._ns?(r(this._type,this._ns,{}),!0):n(this._type,e)},isEmpty:function(){return this._callMethod(o,arguments)},isSet:function(){if(arguments.length<1)throw Error("Minimum 1 argument must be given");return this._callMethod(s,arguments)},keys:function(){return this._callMethod(a,arguments)}};if(e.cookie){window.name||(window.name=Math.floor(1e8*Math.random()));var h={_cookie:!0,_prefix:"",_expires:null,_path:null,_domain:null,setItem:function(t,r){e.cookie(this._prefix+t,r,{expires:this._expires,path:this._path,domain:this._domain})},getItem:function(t){return e.cookie(this._prefix+t)},removeItem:function(t){return e.removeCookie(this._prefix+t)},clear:function(){for(var t in e.cookie())""!=t&&(!this._prefix&&-1===t.indexOf(c)&&-1===t.indexOf(m)||this._prefix&&0===t.indexOf(this._prefix))&&e.removeCookie(t)},setExpires:function(e){return this._expires=e,this},setPath:function(e){return this._path=e,this},setDomain:function(e){return this._domain=e,this},setConf:function(e){return e.path&&(this._path=e.path),e.domain&&(this._domain=e.domain),e.expires&&(this._expires=e.expires),this},setDefaultConf:function(){this._path=this._domain=this._expires=null}};g||(window.localCookieStorage=e.extend({},h,{_prefix:c,_expires:3650}),window.sessionCookieStorage=e.extend({},h,{_prefix:m+window.name+"_"})),window.cookieStorage=e.extend({},h),e.cookieStorage=e.extend({},l,{_type:"cookieStorage",setExpires:function(e){return window.cookieStorage.setExpires(e),this},setPath:function(e){return window.cookieStorage.setPath(e),this},setDomain:function(e){return window.cookieStorage.setDomain(e),this},setConf:function(e){return window.cookieStorage.setConf(e),this},setDefaultConf:function(){return window.cookieStorage.setDefaultConf(),this}})}e.initNamespaceStorage=function(e){return u(e)},g?(e.localStorage=e.extend({},l,{_type:"localStorage"}),e.sessionStorage=e.extend({},l,{_type:"sessionStorage"})):(e.localStorage=e.extend({},l,{_type:"localCookieStorage"}),e.sessionStorage=e.extend({},l,{_type:"sessionCookieStorage"})),e.namespaceStorages={},e.removeAllStorages=function(t){e.localStorage.removeAll(t),e.sessionStorage.removeAll(t),e.cookieStorage&&e.cookieStorage.removeAll(t),t||(e.namespaceStorages={})}});


/*

 bootpag - jQuery plugin for dynamic pagination

 Copyright (c) 2015 botmonster@7items.com

 Licensed under the MIT license:
 http://www.opensource.org/licenses/mit-license.php

 Project home:
 http://botmonster.com/jquery-bootpag/

 Version:  1.0.7

 */
(function(h,q){h.fn.bootpag=function(p){function m(c,b){b=parseInt(b,10);var d,e=0==a.maxVisible?1:a.maxVisible,k=1==a.maxVisible?0:1,n=Math.floor((b-1)/e)*e,f=c.find("li");a.page=b=0>b?0:b>a.total?a.total:b;f.removeClass(a.activeClass);d=1>b-1?1:a.leaps&&b-1>=a.maxVisible?Math.floor((b-1)/e)*e:b-1;a.firstLastUse&&f.first().toggleClass(a.disabledClass,1===b);e=f.first();a.firstLastUse&&(e=e.next());e.toggleClass(a.disabledClass,1===b).attr("data-lp",d).find("a").attr("href",g(d));k=1==a.maxVisible?
    0:1;d=b+1>a.total?a.total:a.leaps&&b+1<a.total-a.maxVisible?n+a.maxVisible+k:b+1;e=f.last();a.firstLastUse&&(e=e.prev());e.toggleClass(a.disabledClass,b===a.total).attr("data-lp",d).find("a").attr("href",g(d));f.last().toggleClass(a.disabledClass,b===a.total);e=f.filter("[data-lp="+b+"]");k="."+[a.nextClass,a.prevClass,a.firstClass,a.lastClass].join(",.");if(!e.not(k).length){var m=b<=n?-a.maxVisible:0;f.not(k).each(function(b){d=b+1+n+m;h(this).attr("data-lp",d).toggle(d<=a.total).find("a").html(d).attr("href",
    g(d))});e=f.filter("[data-lp="+b+"]")}e.not(k).addClass(a.activeClass);l.data("settings",a)}function g(c){return a.href.replace(a.hrefVariable,c)}var l=this,a=h.extend({total:0,page:1,maxVisible:null,leaps:!0,href:"javascript:void(0);",hrefVariable:"{{number}}",next:"&raquo;",prev:"&laquo;",firstLastUse:!1,first:'<span aria-hidden="true">&larr;</span>',last:'<span aria-hidden="true">&rarr;</span>',wrapClass:"pagination",activeClass:"active",disabledClass:"disabled",nextClass:"next",prevClass:"prev",
    lastClass:"last",firstClass:"first"},l.data("settings")||{},p||{});if(0>=a.total)return this;h.isNumeric(a.maxVisible)||a.maxVisible||(a.maxVisible=parseInt(a.total,10));l.data("settings",a);return this.each(function(){var c,b,d=h(this);c=['<ul class="',a.wrapClass,' bootpag">'];a.firstLastUse&&(c=c.concat(['<li data-lp="1" class="',a.firstClass,'"><a href="',g(1),'">',a.first,"</a></li>"]));a.prev&&(c=c.concat(['<li data-lp="1" class="',a.prevClass,'"><a href="',g(1),'">',a.prev,"</a></li>"]));for(b=
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                1;b<=Math.min(a.total,a.maxVisible);b++)c=c.concat(['<li data-lp="',b,'"><a href="',g(b),'">',b,"</a></li>"]);a.next&&(b=a.leaps&&a.total>a.maxVisible?Math.min(a.maxVisible+1,a.total):2,c=c.concat(['<li data-lp="',b,'" class="',a.nextClass,'"><a href="',g(b),'">',a.next,"</a></li>"]));a.firstLastUse&&(c=c.concat(['<li data-lp="',a.total,'" class="last"><a href="',g(a.total),'">',a.last,"</a></li>"]));c.push("</ul>");d.find("ul.bootpag").remove();d.append(c.join(""));c=d.find("ul.bootpag");d.find("li").click(function(){var b=
    h(this);if(!b.hasClass(a.disabledClass)&&!b.hasClass(a.activeClass)){var c=parseInt(b.attr("data-lp"),10);l.find("ul.bootpag").each(function(){m(h(this),c)});l.trigger("page",c)}});m(c,a.page)})}})(jQuery,window);


(function($){

    /*!
     * jQuery Cookie Plugin
     * https://github.com/carhartl/jquery-cookie
     *
     * Copyright 2011, Klaus Hartl
     * Dual licensed under the MIT or GPL Version 2 licenses.
     * http://www.opensource.org/licenses/mit-license.php
     * http://www.opensource.org/licenses/GPL-2.0
     */

    $.cookie = function(key, value, options) {
        // key and at least value given, set cookie...
        if (arguments.length > 1 && (!/Object/.test(Object.prototype.toString.call(value)) || value === null || value === undefined)) {
            options = $.extend({}, options);

            if (value === null || value === undefined) {
                options.expires = -1;
            }

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setDate(t.getDate() + days);
            }

            value = String(value);

            return (document.cookie = [
                encodeURIComponent(key), '=', options.raw ? value : encodeURIComponent(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path    ? '; path=' + options.path : '',
                options.domain  ? '; domain=' + options.domain : '',
                options.secure  ? '; secure' : ''
            ].join(''));
        }

        // key and possibly options given, get cookie...
        options = value || {};
        var decode = options.raw ? function(s) { return s; } : decodeURIComponent;

        var pairs = document.cookie.split('; ');
        for (var i = 0, pair; pair = pairs[i] && pairs[i].split('='); i++) {
            if (decode(pair[0]) === key) return decode(pair[1] || ''); // IE saves cookies with empty string as "c; ", e.g. without "=" as opposed to EOMB, thus pair[1] may be undefined
        }
        return null;
    };


    // expression that returns the elements that have a class that starts with a certain prefix
    $.expr[':'].hasClassStartingWith = function(el, i, selector) {
      var re = new RegExp("\\b" + selector[3]);
      return re.test(el.className);
    }


    // copy class of the above in order to add a class in the footer
    function dom_class( el, prefix, newClass ) {
        // remove all app- prefixed classes
        $( el ).removeClass (function (index, css) {

            var re = new RegExp( "\\b" + prefix + "\\S+", "g" );
            return (css.match (re) || []).join(' ');
        });
        $( el ).addClass( newClass );
        //$.cookie( option + '-angle', newClass, { path : '/', expires : 7 } );
    }

    $(document).ready(function() {

        var switcher = $( '#style-switcher' );


        //set the default swatches in cookies
        if( $.cookie( 'theme-swatch') == null){
            // create cookies with the default values on load
            $.cookie( 'theme-swatch', 'swatch-red-white', { path : '/', expires : 7 } );
            $.cookie( 'theme-swatch-inverse', 'swatch-white-red', { path : '/', expires : 7 } );
        }
        else {
            var swatch = $.cookie('theme-swatch');
            var swatch_inverse = $.cookie('theme-swatch-inverse');

            // replace default values with the ones stored in the cookie
            $(":hasClassStartingWith('swatch-red')").not("#style-switcher :hasClassStartingWith('swatch-')").each(function(){
                dom_class(this, 'swatch-', swatch);
            });

            $(":hasClassStartingWith('swatch-white')").not("#style-switcher :hasClassStartingWith('swatch-')").each(function(){
                dom_class(this, 'swatch-', swatch_inverse);
            });

        }

        if( $.cookie('theme-layout') !== null ){
            dom_class('body', 'layout-', $.cookie('theme-layout') );
        }

        switcher.find( '.btn-switcher' ).click( function() {
            switcher.toggleClass('active');
        });

        switcher.find( '.colour-switch' ).click( function() {
            var $link = $( this );
            var swatch = $link.data('swatch');
            var swatch_inverse = $link.data('swatch-inverse');

            $(':hasClassStartingWith('+ $.cookie( 'theme-swatch')+')').not("#style-switcher :hasClassStartingWith('swatch-')").each(function(){
                dom_class(this, 'swatch-', swatch);
            });

            $(':hasClassStartingWith('+ $.cookie( 'theme-swatch-inverse')+')').not("#style-switcher :hasClassStartingWith('swatch-')").each(function(){
                dom_class(this, 'swatch-', swatch_inverse);
            });

            $.cookie( 'theme-swatch', swatch, { path : '/', expires : 7 } );
            $.cookie( 'theme-swatch-inverse', swatch_inverse, { path : '/', expires : 7 } );
        });


        switcher.find( '.layout-switch' ).click( function() {
            var $link  = $( this );
            var layout = $link.data('layout');

            dom_class('body', 'layout-', layout );
            
            $.cookie( 'theme-layout', layout, { path : '/', expires : 7 } );
        });

        // make switcher toggle
        var bt = switcher.find('.handle');
        bt.on('click', function(e) {
            switcher.toggleClass('open');
            if ( switcher.hasClass('open') ) {
                switcher.animate({
                    left: 0
                }, 400);
            } else {
                switcher.animate({
                    left: -240
                }, 400);
            }
            e.preventDefault();
        });
    });
})(jQuery);
/*jslint nomen: true, browser: true*/
/*global jQuery, define */

/*
 * jQuery beforeafter-map plugin
 * @author Majid Garmaorudi
 * @version 1.0
 * @date September 29, 2015
 * @category jQuery plugin
 * @license CC Attribution-NonCommercial-ShareAlike 3.0 Unported (CC BY-NC-SA 3.0) - http://creativecommons.org/licenses/by-nc-sa/3.0/
 Original code altered from:
 * jQuery beforeafter plugin
 * @author admin@catchmyfame.com - http://www.catchmyfame.com
 * @version 1.4
 * @date September 19, 2011
 * @category jQuery plugin
 * @copyright (c) 2009 admin@catchmyfame.com (www.catchmyfame.com)
 * @license CC Attribution-NonCommercial-ShareAlike 3.0 Unported (CC BY-NC-SA 3.0) - http://creativecommons.org/licenses/by-nc-sa/3.0/
 And
 * jQuery beforeafter-map plugin
 * @author @grahamimac - http://www.twitter.com/grahamimac
 * @version 0.11
 * @date December 17, 2013
 * @category jQuery plugin
 * @license CC Attribution-NonCommercial-ShareAlike 3.0 Unported (CC BY-NC-SA 3.0) - http://creativecommons.org/licenses/by-nc-sa/3.0/
 */
(function (factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    'use strict';
    /*jshint validthis: true */
    $.fn.beforeAfter = function (_before_, _after_, options) {
        if (!_before_ || !_after_) {
            console.log('Error: pass variables used to create the map in .beforeAfter argument. E.g. $("map-container").beforeAfter(before,after,options).');
            return;
        }

        var defaults,
            opts,
            randId =  Math.round(Math.random() * 100000000),
            dragwrapper = 'dragwrapper' + randId,
            dragwrapperId = '#' + dragwrapper,
            dragEl = 'drag' + randId,
            dragElId = '#' + dragEl,
            handle = 'handle' + randId,
            handleId = '#' + handle,
            showLeft = 'showleft' + randId,
            showLeftId = '#' + showLeft,
            showRight = 'showright' + randId,
            showRightId = '#' + showRight,
            ltArrow = 'lt-arrow' + randId,
            ltArrowId = '#' + ltArrow,
            rtArrow = 'rt-arrow' + randId,
            rtArrowId = '#' + rtArrow,
            links = 'links' + randId,
            linksId = '#' + links;

        defaults = {
            animateIntro: false,
            introDelay: 1000,
            introDuration: 1000,
            showFullLinks: false,
            beforeLinkText: 'Show only before',
            afterLinkText: 'Show only after',
            imagePath: './css/images/',
            cursor: 'pointer',
            clickSpeed: 600,
            linkDisplaySpeed: 120,
            dividerColor: '#888',
            enableKeyboard: false,
            keypressAmount: 20,
            synced: false,
            onReady: function () { return undefined; },
            changeOnResize: true,
            isFullScreen: false,
            permArrows: false,
            arrowLeftOffset: 0,
            arrowRightOffset: 0,
            showArrows: true
        };
        opts = $.extend(defaults, options);

        // Effection permArrows with arrows to be sure we wont do any action
        // over arrows if user doesn't want to show it
        opts.permArrows = (opts.permArrows && opts.showArrows);

        return this.each(function () {
            var o = opts,
                obj = $(this),
                mapWidth = $('div:first', obj).width(),
                mapHeight = $('div:first', obj).height(),
                lArrOffsetStatic = -24,
                rArrOffsetStatic = 24,
                _bID_,
                _aID_,
                cInt;

            $(obj).width(mapWidth).height(mapHeight).css({
                'overflow': 'hidden',
                'position': 'relative',
                'padding': '0'
            });

            _bID_ = $(_before_._container).attr('id');
            _aID_ = $(_after_._container).attr('id');

            _before_.options.inertia = false;
            _after_.options.inertia = false;

            // Create an inner div wrapper (dragwrapper) to hold the images.
            $(obj).prepend('<div id="' + dragwrapper + '"><div id="' + dragEl + '"></div><img width="48" height="48" alt="handle" src="' + o.handleImage + '" id="' + handle + '" /></div>'); // Create drag handle
            if (o.showArrows) {
                $(obj).append('<img src="' + o.imagePath + 'lt-small.png" id="' + ltArrow + '"><img src="' + o.imagePath + 'rt-small.png" id="' + rtArrow + '">');
            }

            $(dragwrapperId).css({
                'opacity': 0.25,
                'position': 'absolute',
                'padding': '0',
                'left':  (mapWidth / 2) - (120 / 2) + 'px',
                'z-index': '30'
            }).width(120).height('100%');

            if (o.label && o.label.after) {
                var afterLabel = $(document.createElement('span'));
                afterLabel.attr('id', 'afterLabel');
                afterLabel.append(o.label.after.text);
                afterLabel.css({
                    'position': 'absolute',
                    'right': 0,
                    'bottom': 0,
                    'background-color': o.label.after.backgroundColor,
                    'color': o.label.after.textColor,
                    'text-shadow': 'rgba(0, 0, 0, 0.7) 1px 1px 2px',
                    'text-align': 'center',
                    'font-size': '1.4em',
                    'width': '60px'
                });
                $(dragwrapperId).append(afterLabel);
            }

            if (o.label && o.label.before) {
                var beforeLabel = $(document.createElement('span'));
                beforeLabel.attr('id', 'beforeLabel');
                beforeLabel.append(o.label.before.text);
                beforeLabel.css({
                    'position': 'absolute',
                    'left': 0,
                    'bottom': 0,
                    'background-color': o.label.before.backgroundColor,
                    'color': o.label.before.textColor,
                    'text-shadow': 'rgba(0, 0, 0, 0.7) 1px 1px 2px',
                    'text-align': 'center',
                    'font-size': '1.4em',
                    'width': '60px'
                });
                $(dragwrapperId).append(beforeLabel);
            }

            $(_before_._container).height(mapHeight).width(mapWidth / 2).css({
                'position': 'absolute',
                'overflow': 'hidden',
                'left': '0px',
                'z-index': '20'
            }); // Set CSS properties of the before map div

            $(_after_._container).height(mapHeight).width(mapWidth).css({
                'position': 'absolute',
                'overflow': 'hidden',
                'right': '0px'
            });    // Set CSS properties of the after map div

            $(handleId).css({
                'z-index': '100',
                'position': 'relative',
                'top': (mapHeight / 2) - ($(handleId).height() / 2) + 'px',
                'left': 120/2 - $(handleId).width()/2 + 'px'
            });
            $(handleId).css('cursor', o.cursors[0]);
            $(handleId).css('cursor', o.cursors[1]);
            $(handleId).css('cursor', o.cursors[2]);
            $(handleId).css('cursor', o.cursors[3]);


            $(dragElId).width(2).height('100%').css({
                'background': o.dividerColor,
                'position': 'absolute',
                'left': (120 / 2) - 1
            });    // Set drag handle CSS properties

            $(_before_._container).css({
                'position': 'absolute',
                'top': '0px',
                'left': '0px'
            });

            $(_after_._container).css({
                'position': 'absolute',
                'top': '0px',
                'right': '0px'
            });

            if (o.showFullLinks) {
                $(obj).after('<div class="balinks" id="' + links + '" style="position:relative"><span class="balinks"><a id="' + showLeft + '" href="javascript:void(0)">' + o.beforeLinkText + '</a></span><span class="balinks"><a id="' + showRight + '" href="javascript:void(0)">' + o.afterLinkText + '</a></span></div>');
                $(linksId).width(mapWidth);
                $(showLeftId).css({'position': 'absolute', 'left': '0px'}).click(function () {
                    $('div:eq(2)', obj).animate({width: mapWidth}, o.linkDisplaySpeed);
                    $(dragwrapperId).animate({left: mapWidth - $(dragwrapperId).width() + 'px'}, o.linkDisplaySpeed);
                });

                $(showRightId).css({'position': 'absolute', 'right': '0px'}).click(function () {
                    $('div:eq(2)', obj).animate({width: 0}, o.linkDisplaySpeed);
                    $(dragwrapperId).animate({left: '0px'}, o.linkDisplaySpeed);
                });
            }

            // Resize and realign elements if size has changed
            if (o.changeOnResize) {
                $(window).on('resize pageshow orientationchange', function () {
                    var w = $(obj).width(),
                        h = $(obj).height();

                    $(_before_._container).width(w).height(h);
                    $(_after_._container).width(w).height(h);
                    _before_.invalidateSize();
                    _after_.invalidateSize();
                    clearInterval(cInt);

                    // If it is fullscreen, use window's height instead of wrapper's
                    if (o.isFullScreen) {
                        h = $(window).height();
                    }
                    $(handleId).css({'top': ((h / 2) - ($(handleId).height() / 2)) + 'px'});

                    cInt = setInterval(function () {
                        $(_before_._container).width(parseInt($(dragwrapperId).css('left'), 10) + 60);
                        if ($(_before_._container).width() !== w && $(_before_._container).height() !== w) {
                            clearInterval(cInt);
                        }
                    }, 100);
                });
            }

            if (o.enableKeyboard) {
                $(document).keydown(function (event) {
                    if (event.keyCode === 39) {
                        if ((parseInt($(dragwrapperId).css('left'), 10) + parseInt($(dragwrapperId).width(), 10) + o.keypressAmount) <= mapWidth) {
                            $(dragwrapperId).css('left', parseInt($(dragwrapperId).css('left'), 10) + o.keypressAmount + 'px');
                            $('div:eq(2)', obj).width(parseInt($('div:eq(2)', obj).width(), 10) + o.keypressAmount + 'px');
                        } else {
                            $(dragwrapperId).css('left', mapWidth - parseInt($(dragwrapperId).width(), 10) + 'px');
                            $('div:eq(2)', obj).width(mapWidth - parseInt($(dragwrapperId).width(), 10) / 2 + 'px');
                        }
                    }
                    if (event.keyCode === 37) {
                        if ((parseInt($(dragwrapperId).css('left'), 10) - o.keypressAmount) >= 0) {
                            $(dragwrapperId).css('left', parseInt($(dragwrapperId).css('left'), 10) - o.keypressAmount + 'px');
                            $('div:eq(2)', obj).width(parseInt($('div:eq(2)', obj).width(), 10) - o.keypressAmount + 'px');
                        } else {
                            $(dragwrapperId).css('left', '0px');
                            $('div:eq(2)', obj).width($(dragwrapperId).width() / 2);
                        }
                    }
                });
            }

            function drag() {
                if (!o.permArrows && o.showArrows) {
                    $(ltArrowId + ', ' + rtArrowId).stop().css('opacity', 0);
                }

                $('div:eq(2)', obj).width(parseInt($(this).css('left'), 10) + 60);
                if (o.permArrows) {
                    $(ltArrowId).css({'z-index': '20', 'left': parseInt($(dragwrapperId).css('left'), 10) + o.arrowLeftOffset + lArrOffsetStatic + 'px'});
                    $(rtArrowId).css({'z-index': '20', 'left': parseInt($(dragwrapperId).css('left'), 10) + o.arrowRightOffset + rArrOffsetStatic + 'px'});
                }
            }

            $(dragwrapperId).draggable({containment: obj, drag: drag, stop: drag}).css('-ms-touch-action', 'none');

            function clickit() {
                if (o.permArrows) {
                    $(ltArrowId).css({'z-index': '20', 'position': 'absolute', 'top': ((mapHeight / 2) - ($(ltArrowId).height() / 2)) + 'px', 'left': parseInt($(dragwrapperId).css('left'), 10) + o.arrowLeftOffset + lArrOffsetStatic + 'px'});
                    $(rtArrowId).css({'z-index': '20', 'position': 'absolute', 'top': ((mapHeight / 2) - ($(rtArrowId).height() / 2)) + 'px', 'left': parseInt($(dragwrapperId).css('left'), 10) + o.arrowRightOffset + rArrOffsetStatic + 'px'});
                }

                $(obj).hover(function () {
                    var h = mapHeight;
                    // If fullscreen, use window's height
                    if (o.isFullScreen) {
                        h = $(window).height();
                    }

                    if (!o.permArrows && o.showArrows) {
                        $(ltArrowId).stop().css({
                            'z-index': '20',
                            'position': 'absolute',
                            'top': ((h / 2) - ($(ltArrowId).height() / 2)) + 'px',
                            'left': parseInt($(dragwrapperId).css('left'), 10) + o.arrowLeftOffset + lArrOffsetStatic + 6 + 'px'
                        }).animate({opacity: 1, left: parseInt($(ltArrowId).css('left'), 10) - 6 + 'px'}, 120);

                        $(rtArrowId).stop().css({
                            'position': 'absolute',
                            'top': ((h / 2) - ($(rtArrowId).height() / 2)) + 'px',
                            'left': parseInt($(dragwrapperId).css('left'), 10) + o.arrowRightOffset + rArrOffsetStatic - 6 + 'px'
                        }).animate({opacity: 1, left: parseInt($(rtArrowId).css('left'), 10) + 6 + 'px'}, 120);
                    }
                    $(dragwrapperId).animate({'opacity': 1}, 120);
                }, function () {
                    if (!o.permArrows && o.showArrows) {
                        $(ltArrowId).animate({opacity: 0, left: parseInt($(ltArrowId).css('left'), 10) + o.arrowLeftOffset - 6 + 'px'}, 350);
                        $(rtArrowId).animate({opacity: 0, left: parseInt($(rtArrowId).css('left'), 10) + o.arrowRightOffset + 6 + 'px'}, 350);
                    }
                    $(dragwrapperId).animate({'opacity': 0.25}, 350);
                });

                $(obj).one('mousemove', function () {
                    $(dragwrapperId).stop().animate({'opacity': 1}, 500);
                }); // If the mouse is over the container and we animate the intro, we run this to change the opacity when the mouse moves since the hover event doesnt get triggered yet
            }

            if (o.animateIntro) {
                $('div:eq(2)', obj).width(mapWidth);
                $(dragwrapperId).css('left', mapWidth - ($(dragwrapperId).width() / 2) + 'px');
                setTimeout(function () {
                    $(dragwrapperId).css({'opacity': 1}).animate({'left': (mapWidth / 2) - ($(dragwrapperId).width() / 2) + 'px'}, o.introDuration, function () {
                        $(dragwrapperId).animate({'opacity': 0.25}, 1000);
                    });
                    $('div:eq(2)', obj).width(mapWidth).animate({'width': mapWidth / 2 + 'px'}, o.introDuration, function () {
                        clickit();
                        o.onReady.call(this);
                    });
                }, o.introDelay);
            } else {
                clickit();
                o.onReady.call(this);
            }

            function _mapMove_() {
                var zoom = this.getZoom(),
                    latlngCenter = this.getCenter(),
                    latlng = [latlngCenter.lat, latlngCenter.lng],
                    thisID = $(this._container).attr('id');

                if (thisID === _bID_) {
                    _after_.setView(latlng, zoom);
                } else if (thisID === _aID_) {
                    _before_.setView(latlng, zoom);
                } else {
                    console.log('Error: Please report this as a bug');
                }
            }

             // Pan and zoom other map when one map pans/zooms
             // If you are syncing yourself (e.g leaflet sync plugin), you can
             // disable default sync for better experience
            if (!o.synced) {
                _before_.on('dragend', _mapMove_).on('zoomed', _mapMove_);
                _after_.on('dragend', _mapMove_).on('zoomed', _mapMove_);
            }
        });
    };
}));

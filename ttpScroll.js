$.fn.ttpScroll = function() {
var mState = 0;
var winW = window.innerWidth;
var winH = window.innerHeight;

//////Checks if IE ----> if(false) uBr = 99 else uBr = Version Number
var uBr = 99;
var userBrowser = navigator.userAgent;
if (RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})").exec(userBrowser) != null) {
    uBr = parseFloat(RegExp.$1);
}
//////Checks if iOS ----> if(true) checks if iOS < 6 cause of the fixed position issues
 else if (/iP(hone|od|ad)/.test(navigator.platform)) {
    var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
    var vNum = [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
    if (vNum && vNum[0] <= 5) {
        uBr = 50
    }
}

//////Checks if using touch
var touchMe = false,
touchMeMS = false;
if (window.navigator.msPointerEnabled) {
    touchMeMS = true;
    pokeIE();
} else if (('ontouchstart' in window) || (window.DocumentTouch && document instanceof DocumentTouch)) {
    touchMe = true;
    poke();
} else {
    ioM();
}
function poke() {
    var wasTouch = false;
    $(window).bind("mouseover", function() {
        wasTouch = false;
        mouseOverFired = true;
        setTimeout(function() {
            if (!wasTouch) {
                ioM();
            }
        }, 1000);
        $(window).unbind('mouseover');
    });
    $(window).bind("touchstart", function() {
        wasTouch = true;
        ioT();
        $(window).unbind('touchstart');
    });
}
function pokeIE() {
    var pDown = uBr < 11 ? 'MSPointerDown': 'pointerdown';
    var pMove = uBr < 11 ? 'MSPointerMove': 'pointermove';
    $(window).css("-ms-touch-action", "none");
    $(window).bind(pDown, function(e) {
        ieMorT(e.pointerType);
    });
    $(window).bind(pMove, function(e) {
        ieMorT(e.pointerType);
    });
    function ieMorT(eType) {
        if ((eType == 4) || (eType == 'MSPOINTER_TYPE_MOUSE')) {
            ioM();
            $(window).unbind(pMove);
        } else {
            iomsT();
            touchMeMS = true;
            $(window).unbind(pDown);
        }
    }
}


function ioM()
{

}

function ioT()
{

}

function iomsT()
{

}

    var sHHeight; var sBHeight; var sDiff; var sHrPos;
    var sMe = $('#scrollMe');
    var sH = $('#scrollHandle');
    var sB = $('#scrollBar');
    var sP = $('#scrollPos');
    var sBT = 20;    
    var sHPos = 0;
    var sPercent = 0;
    var scrolling = false;
    $('#scrollMe ul li').height(winH);
    sH.bind('mousedown', strtScroll);
    

    
    function initScroll()
    {
        sHHeight = sH.height();
        sBHeight = winH;
         $('#scrollMe ul li').height(winH);
        sDiff = sBHeight - sHHeight - sBT;
    }


    function strtScroll(event) {
        $('#preventSelect').css('z-index', 499);
        sHrPos = sHPos - event.pageY;
        $(document).bind('mousemove', throttleScroll);
        showSPos();
        $(document).bind('mouseup', stpScroll);
    }

    function stpScroll() {
        hideSPos();

        $(document).unbind('mousemove', throttleScroll);
        $(document).unbind('mouseup', stpScroll);
        $('#preventSelect').css('z-index', 0);
    }

    function showSPos() {
        sH.addClass('scrollStyleH');
        sH.removeClass('scrollStyle');
        $('#scrollPos').show();
    }
    function hideSPos() {
        sP.fadeOut(300);
        sH.removeClass('scrollStyleH');
        sH.addClass('scrollStyle');
    }

    var ogPercent = 0;
    var thrBusy = false;
    var scrollThrottletimer;
    var scrollUpdatetimer;
    var sTDelay = 5;
    var sUDelay = 10;

    function throttleScroll() {
        clearSelects();
        var mpY = event.pageY ? event.pageY: event.clientY;
        sHPos = mpY + sHrPos;
        if (thrBusy) {
            return;
        } else {

            clearTimeout(scrollThrottletimer);
            scrollThrottletimer = undefined;
            thrBusy = true;
            scrollThrottletimer = setTimeout(execScroll, sTDelay);
        }
    }

    function execScroll() {
        thrBusy = true;
        if (!scrolling) {
            scrolling = true;
            clearTimeout(scrollUpdatetimer);
            scrollUpdatetimer = setInterval(intervalTween, sUDelay);
        }
    }
    function intervalTween() {
        sHPos = Math.max(0, Math.min(sDiff, sHPos));
        sPercent = sHPos / sDiff;
        sPercent = parseFloat((sPercent).toFixed(4));
        sPercent = Math.max(0, Math.min(1, sPercent));
        tweenScroll(sPercent);
    }
    function autoTweenScroll(goTo) {
        sPercent = parseFloat(goTo) / 15;
        sPercent = Math.max(0, Math.min(1, sPercent));
        thrBusy = true;
        if (!scrolling) {
            scrolling = true;
            var csHPos = parseInt(sH.css('top').replace('px', ''));
            if (csHPos == 0) {
                sHPos = sPercent * sDiff
            }
            scrollUpdatetimer = setInterval(autoIT, sUDelay);
        }
    }
    function autoIT() {

        $('#sPr2').html(sHPos);
        tweenScroll(sPercent)
        }
    function tweenScroll(nPercent) {
        nPercent = parseFloat(nPercent);
        var speed = parseFloat((Math.abs(nPercent - ogPercent) * 0.05).toFixed(4));
        if (speed == 0.0000) {
            finishScroll();
            return;
        }
        if (ogPercent <= nPercent) {
            ogPercent += speed;
            if (ogPercent > 1.0) {
                finishScroll();
                return;
            }
        } else {
            ogPercent -= speed;
            if (ogPercent < 0.0) {
                finishScroll();
                return;
            }
        }
        updateScrollPos(ogPercent);
        thrBusy = false;
    }

    var newSHPos;
    var newSMePos;
    var sMeHeight = $('#scrollMe').height();
    function updateScrollPos(nPercent) {
        //$.each(elements, function(i, el) {var pos = Math.floor((el.width - winWidth) * nPercent) * -1; el.el.css('left', pos);});
        newSHPos = sDiff * nPercent;
        newSMePos = ( - 1) * (sMeHeight - winH) * nPercent;
        sMe.css('top', newSMePos);
        sH.css('top', newSHPos);
        sP.height(newSHPos);
        $('#sPr1').html(sHPos);
        $('#sPr3').html(sPercent);

    }

    function finishScroll() {
        scrolling = false;
        thrBusy = false;
        clearSelects();
        clearTimeout(scrollThrottletimer);
        clearTimeout(scrollUpdatetimer);
        scrollThrottletimer = undefined;
        scrollUpdatetimer = undefined;

    }

    function clearSelects() {
        if (document.selection) {
            document.selection.empty();
        } else if (window.getSelection) {
            window.getSelection().removeAllRanges();
        }
    }

    $('li a').click(function(e) {
        e.preventDefault();
        var goTo = $(this).attr('href').replace('#', '');
        autoTweenScroll(goTo);
        if (uBr > 9) {
            history.pushState('object or string', 'Tweened Scroll', '/jQTests/' + goTo);
        }
    });
    window.onpopstate = function() {
        var goTo = (location.href).substr((location.href).lastIndexOf('/') + 1);
        if (goTo.indexOf('.html') != -1) {
            goTo = 0
        }
        autoTweenScroll(goTo);
    };

    $('li b').click(function(e) {
        window.location.href = 'http://www.jbeedev.com/jQTests/tScroll.html';

    });

    var usingMouse = false;
    if (!usingMouse) {
        usingMouse = true;
    }

    var mwDistance;
    var maxT;
    var mwDelta = 0;
    var mwThrottletimer;
    var mwDelay = 60;
    var mwBusy = false;

    if (window.addEventListener)
        window.addEventListener('DOMMouseScroll', wheel, false);
    window.onmousewheel = document.onmousewheel = wheel;

    function wheel(event) {
        if (event.wheelDelta) {
            mwDelta = event.wheelDelta / 30;
        } else if (event.detail) {
            mwDelta = -event.detail;
        }
        throttleWheel();
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    }

    function throttleWheel() {
        if (mwBusy) {
            return;
        } else {
            clearTimeout(mwThrottletimer);
            mwThrottletimer = undefined;
            mwBusy = true;
            mwThrottletimer = setTimeout(execMW, mwDelay);
        }
    }

    function execMW() {

        var oldPos = sMe.position();
        var newPos = oldPos.top + parseInt(mwDistance * mwDelta);
        if (newPos > 10) {
            newPos = 10;
        } else if (newPos < maxT) {
            newPos = maxT;
        }
        sPercent = newPos / maxT;
        sHPos = sPercent * sDiff;
        thrBusy = true;
        if (!scrolling) {
            clearTimeout(scrollUpdatetimer);
            scrolling = true;
            scrollUpdatetimer = setInterval(intervalTween, sUDelay);
        }
        mwBusy = false;
    }

    var tPos = {
        tchSwipe: true,
        xS: 0,
        yS: 0,
        xC: 0,
        yC: 0,
        tBusy: false
    };
    var tTime;
    if (touchMe || touchMeMS) {
        var touchstart = !touchMeMS ? 'touchstart': uBr < 11 ? 'MSPointerDown': 'pointerdown';
        var touchmove = !touchMeMS ? 'touchmove': uBr < 11 ? 'MSPointerMove': 'pointermove';
        var touchcancel = !touchMeMS ? 'touchcancel': uBr < 11 ? 'MSPointerCancel': 'pointercancel';
        var touchend = !touchMeMS ? 'touchend': uBr < 11 ? 'MSPointerUp': 'pointerup';
        var timeTS = new Date(),
        timeTE = new Date();
        var tPos = {
            tS: new Date(),
            tE: new Date(),
            xS: 0,
            yS: 0,
            xC: 0,
            yC: 0,
            xN: 0,
            yN: 0
        };

        $(this).bind(touchstart, startTouch);

        function startTouch(event) {

            var eType = event.originalEvent.pointerType;
            //if(touchMeMS&&((eType == 4)||(eType == 'MSPOINTER_TYPE_MOUSE'))){return;};
            showSPos();
            event.originalEvent.preventDefault();
            $('#preventSelect').css('z-index', 499);
            clearSelects();
            var t = touchMeMS ? event.originalEvent: event.originalEvent.touches[0];
            if (tPos.tBusy) {
                return;
            }
            //var t = event.originalEvent.touches[0];
            tPos.yS = t.pageY;
            tPos.yC = t.pageY;
            tPos.xS = t.pageX;
            tPos.xC = t.pageX;
            clearTimeout(tTime);
            tPos.tchSwipe = true;
            tTime = setTimeout(function() {
                tPos.tchSwipe = false
            }, 300);
            $(document).bind(touchmove, tScroll).bind(touchend, swipeMe).bind(touchcancel, stopTScroll);
        }

        function tScroll(event) {
            clearSelects();
            event.originalEvent.preventDefault();
            var t = touchMeMS ? event.originalEvent: event.originalEvent.touches[0];
            var newPos = sMe.position().top - (1.2 * (tPos.yC - t.pageY));
            ///change to x for horizontal
            if ((newPos < 0) && newPos > maxT) {
                sMe.css('top', newPos);
            }
            sPercent = newPos / maxT;
            sHPos = sPercent * sDiff;
            sH.css('top', sHPos);
            sP.height(sHPos);
            tPos.yC = t.pageY;
            tPos.xC = t.pageX;
        }
        function stopTScroll() {
            hideSPos();
            $('#preventSelect').css('z-index', 0);
            $(document).unbind(touchmove).unbind(touchend).unbind(touchcancel);
        }
        function swipeMe() {
            stopTScroll();
            if (!tPos.tchSwipe) {
                return;
            }
            var x = Math.abs(tPos.xC - tPos.xS),
            y = Math.abs(tPos.yC - tPos.yS);
            /////////////////////////////// isValid Slide method from swipe.js
            if ((x >= y) && ((x > 50))) {
                if ((tPos.xC - tPos.xS) > 0)
                ///down-right
                {
                    $('#sM').html('swipe up');
                } else
                ///up-left
                {
                    $('#sM').html('swipe down');
                }
            } else if (y > 50) {
                //// only swipe if the timeout went off/// switch for horizontal
                if ((tPos.yC - tPos.yS) > 0)
                ///up-left
                {
                    $('#sM').html('s up');
                } else
                ///down-right
                {
                    $('#sM').html('s down');
                }
            }
            tPos.tBusy = false;
        };

    }

    $(window).resize(function() {
        resizeFxn();
        initScroll();
        });

    function resizeFxn() {
        if (! ('innerWidth' in window)) {
            winW = document.getElementsByTagName('body')[0].clientWidth;
            winH = document.getElementsByTagName('body')[0].clientHeight;
        } else {
            winW = window.innerWidth;
            winH = window.innerHeight;
        }
        mwDistance = winW / 5;
        maxT = (sMe.height() - winH) * ( - 1);
        var oldPos = sMe.position();
        if (oldPos.top < maxT) {
            sMe.css({
                'top': maxT
            });
        }
    }


    resizeFxn();
    initScroll();

}

jQuery(function($) {
    $('#scrollContainer').ttpScroll();
});

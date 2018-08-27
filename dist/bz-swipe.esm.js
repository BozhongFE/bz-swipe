var trim = function (string) {
  return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '');
};

var hasClass = function (el, cls) {
  if (!el || !cls) { return false; }
  if (cls.indexOf(' ') != -1) { throw new Error('className should not contain space.'); }
  if (el.classList) {
    return el.classList.contains(cls);
  } else {
    return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1;
  }
};

var addClass = function (el, cls) {
  if (!el) { return; }
  var curClass = el.className;
  var classes = (cls || '').split(' ');

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i];
    if (!clsName) { continue; }

    if (el.classList) {
      el.classList.add(clsName);
    } else {
      if (!hasClass(el, clsName)) {
        curClass += ' ' + clsName;
      }
    }
  }
  if (!el.classList) {
    el.className = curClass;
  }
};

var removeClass = function (el, cls) {
  if (!el || !cls) { return; }
  var classes = cls.split(' ');
  var curClass = ' ' + el.className + ' ';

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i];
    if (!clsName) { continue; }

    if (el.classList) {
      el.classList.remove(clsName);
    } else {
      if (hasClass(el, clsName)) {
        curClass = curClass.replace(' ' + clsName + ' ', ' ');
      }
    }
  }
  if (!el.classList) {
    el.className = trim(curClass);
  }
};

var on = (function () {
  if (document.addEventListener) {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false);
      }
    };
  } else {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler);
      }
    };
  }
})();

function addStyleToHead(cssString) {
  var doc = document;
  var style = doc.createElement("style");
  style.setAttribute("type", "text/css");
  if (style.styleSheet) { // IE
    style.styleSheet.cssText = cssString;
  } else { // w3c
    var cssText = doc.createTextNode(cssString);
    style.appendChild(cssText);
  }
  var heads = doc.getElementsByTagName("head");
  if (heads.length)
    { heads[0].appendChild(style); }
  else
    { doc.documentElement.appendChild(style); }
}

function initMixin(container, options) {

  var noop = function () {};
  var offloadFn = function (fn) {
    setTimeout(fn || noop, 0);
  };
  var browser = {
    addEventListener: !!window.addEventListener,
    touch: 'ontouchstart' in window ||
      (window.DocumentTouch && document instanceof DocumentTouch),
    transitions: (function (temp) {
      var props = [
        'transitionProperty',
        'WebkitTransition',
        'MozTransition',
        'OTransition',
        'msTransition'
      ];
      for (var i in props)
        { if (temp.style[props[i]] !== undefined) { return true } }
      return false
    })(document.createElement('swipe'))
  };
  var paginationStyleText =
    '#bz-swipe-indicators{width:100%;position:absolute;bottom:15px;text-align:center}' +
    '.bz-swipe-indicator{width:8px;height:8px;display:inline-block;border-radius:100%;background:#000;opacity:0.2;margin:0 3px;}' +
    '#bz-swipe-indicators .is-active{background:#bfbfbf;}' +
    '.bz-swipe-wrap .is-active{display:block;-webkit-transform:none;transform:none;}';
  if (!container) { return }
  var element = container.children[0];
  var slides, slidePos, width, length;
  var pagination;
  options = options || {};
  var index = parseInt(options.startSlide, 10) || 0;
  var speed = options.speed || 300;
  options.continuous =
    options.continuous !== undefined ? options.continuous : true;
  var showPagination = options.showPagination ? options.showPagination : false;
  var clickable = options.clickable ? options.clickable : false;

  function setup() {
    // cache slides
    slides = element.children;
    length = slides.length;

    // set continuous to false if only one slide
    if (slides.length < 2) { options.continuous = false; }

    //special case if two slides
    if (browser.transitions && options.continuous && slides.length < 3) {
      element.appendChild(slides[0].cloneNode(true));
      element.appendChild(element.children[1].cloneNode(true));
      slides = element.children;
    }

    // create an array to store current positions of each slide
    slidePos = new Array(slides.length);

    // determine width of each slide
    width = container.getBoundingClientRect().width || container.offsetWidth;

    element.style.width = slides.length * width + 'px';

    // stack elements
    var pos = slides.length;
    while (pos--) {
      var slide = slides[pos];

      slide.style.width = width + 'px';
      slide.setAttribute('data-index', pos);

      if (browser.transitions) {
        slide.style.left = pos * -width + 'px';
        move(pos, index > pos ? -width : index < pos ? width : 0, 0);
      }
    }

    // reposition elements before and after index
    if (options.continuous && browser.transitions) {
      move(circle(index - 1), -width, 0);
      move(circle(index + 1), width, 0);
    }

    if (!browser.transitions) { element.style.left = index * -width + 'px'; }

    container.style.visibility = 'visible';
    setTimeout(function () {
      renderPagination();
    }, 1000);
  }

  function renderPagination() {
    var frag;
    var $pagination;
    var div;
    if (!showPagination) { return }
    $pagination = document.getElementById('bz-swipe-indicators');
    if (!$pagination) {
      frag = document.createDocumentFragment();
      div = document.createElement('div');
      div.id = 'bz-swipe-indicators';
      frag.appendChild(div);
      container.appendChild(frag);
      $pagination = document.getElementById('bz-swipe-indicators');
    }
    var paginationHTML = '';
    $pagination.innerHTML = paginationHTML;
    for (var i = 0; i < length; i++) {
      paginationHTML += "<span class=\"bz-swipe-indicator " + (setActive(
        i
      )) + "\" data-index=\"" + i + "\"></span>";
    }
    $pagination.innerHTML = paginationHTML;
    pagination = container.querySelectorAll('.bz-swipe-indicator');
    addStyleToHead(paginationStyleText);
    pageClick();

    function setActive(i) {
      if (i === index) {
        return 'is-active'
      } else {
        return ''
      }
    }
  }

  function pageClick() {
    if (!clickable) { return }
    var $pagination = document.querySelector('#bz-swipe-indicators');
    var $indicators = $pagination.querySelectorAll('.bz-swipe-indicator');
    $indicators.forEach(function (item, index) {
      on(item, 'click', function (e) {
        e.stopPropagation();
        var t = parseInt(e.target.getAttribute('data-index'), 10);
        if (index === t) {
          slide(index, speed);
        }
      });
    });
  }

  function addActive(index) {
    var _index;
    if (!showPagination) { return }
    if (browser.transitions && options.continuous && length < 3) {
      if (index === 0 || index === 2) {
        _index = 0;
      }
      if (index === 1 || index === 3) {
        _index = 1;
      }
    } else {
      _index = index;
    }
    removeClass(container.querySelector('.is-active'), 'is-active');
    addClass(pagination[_index], 'is-active');
  }

  function prev() {
    if (options.continuous) { slide(index - 1); }
    else if (index) { slide(index - 1); }
  }

  function next() {
    if (options.continuous) { slide(index + 1); }
    else if (index < slides.length - 1) { slide(index + 1); }
  }

  function circle(index) {
    // a simple positive modulo using slides.length
    return (slides.length + (index % slides.length)) % slides.length
  }

  function slide(to, slideSpeed) {
    // do nothing if already on requested slide
    if (index == to) { return }

    if (browser.transitions) {
      var direction = Math.abs(index - to) / (index - to); // 1: backward, -1: forward

      // get the actual position of the slide
      if (options.continuous) {
        var natural_direction = direction;
        direction = -slidePos[circle(to)] / width;

        // if going forward but to < index, use to = slides.length + to
        // if going backward but to > index, use to = -slides.length + to
        if (direction !== natural_direction)
          { to = -direction * slides.length + to; }
      }

      var diff = Math.abs(index - to) - 1;

      // move all the slides between index and to in the right direction
      while (diff--)
        { move(circle((to > index ? to : index) - diff - 1), width * direction, 0); }

      to = circle(to);

      move(index, width * direction, slideSpeed || speed);
      move(to, 0, slideSpeed || speed);

      if (options.continuous)
        { move(circle(to - direction), -(width * direction), 0); } // we need to get the next in place
    } else {
      to = circle(to);
      animate(index * -width, to * -width, slideSpeed || speed);
      //no fallback for a circular continuous if the browser does not accept transitions
    }

    index = to;
    offloadFn(options.callback && options.callback(index, slides[index]));
  }

  function move(index, dist, speed) {
    translate(index, dist, speed);
    slidePos[index] = dist;
  }

  function translate(index, dist, speed) {
    var slide = slides[index];
    var style = slide && slide.style;

    if (!style) { return }

    style.webkitTransitionDuration = style.MozTransitionDuration = style.msTransitionDuration = style.OTransitionDuration = style.transitionDuration =
      speed + 'ms';

    style.webkitTransform = 'translate(' + dist + 'px,0)' + 'translateZ(0)';
    style.msTransform = style.MozTransform = style.OTransform =
      'translateX(' + dist + 'px)';
  }

  function animate(from, to, speed) {
    // if not an animation, just reposition
    if (!speed) {
      element.style.left = to + 'px';
      return
    }

    var start = +new Date();

    var timer = setInterval(function () {
      var timeElap = +new Date() - start;

      if (timeElap > speed) {
        element.style.left = to + 'px';

        if (delay) { begin(); }

        options.transitionEnd &&
          options.transitionEnd.call(event, index, slides[index]);

        clearInterval(timer);
        return
      }

      element.style.left =
        (to - from) * (Math.floor((timeElap / speed) * 100) / 100) + from + 'px';
    }, 4);
  }

  // setup auto slideshow
  var delay = options.auto || 0;
  var interval;

  function begin() {
    clearTimeout(interval);
    interval = setTimeout(next, delay);
  }

  function stop() {
    delay = 0;
    clearTimeout(interval);
  }

  // setup initial vars
  var start = {};
  var delta = {};
  var isScrolling;

  // setup event capturing
  var events = {
    handleEvent: function (event) {
      switch (event.type) {
        case 'touchstart':
          this.start(event);
          break
        case 'touchmove':
          this.move(event);
          break
        case 'touchend':
          offloadFn(this.end(event));
          break
        case 'webkitTransitionEnd':
        case 'msTransitionEnd':
        case 'oTransitionEnd':
        case 'otransitionend':
        case 'transitionend':
          offloadFn(this.transitionEnd(event));
          break
        case 'resize':
          offloadFn(setup);
          break
      }

      if (options.stopPropagation) { event.stopPropagation(); }
    },
    start: function (event) {
      var touches = event.touches[0];

      // measure start values
      start = {
        // get initial touch coords
        x: touches.pageX,
        y: touches.pageY,

        // store time to determine touch duration
        time: +new Date()
      };

      // used for testing first move event
      isScrolling = undefined;

      // reset delta and end measurements
      delta = {};

      // attach touchmove and touchend listeners
      element.addEventListener('touchmove', this, {
        passive: false
      });
      element.addEventListener('touchend', this, {
        passive: false
      });
    },
    move: function (event) {
      // ensure swiping with one touch and not pinching
      if (event.touches.length > 1 || (event.scale && event.scale !== 1)) { return }

      if (options.disableScroll) { event.preventDefault(); }

      var touches = event.touches[0];

      // measure change in x and y
      delta = {
        x: touches.pageX - start.x,
        y: touches.pageY - start.y
      };

      // determine if scrolling test has run - one time test
      if (typeof isScrolling == 'undefined') {
        isScrolling = !!(isScrolling || Math.abs(delta.x) < Math.abs(delta.y));
      }

      // if user is not trying to scroll vertically
      if (!isScrolling) {
        // prevent native scrolling
        event.preventDefault();

        // stop slideshow
        stop();

        // increase resistance if first or last slide
        if (options.continuous) {
          // we don't add resistance at the end

          translate(circle(index - 1), delta.x + slidePos[circle(index - 1)], 0);
          translate(index, delta.x + slidePos[index], 0);
          translate(circle(index + 1), delta.x + slidePos[circle(index + 1)], 0);
        } else {
          delta.x =
            delta.x /
            ((!index && delta.x > 0) || // if first slide and sliding left
              (index == slides.length - 1 && // or if last slide and sliding right
                delta.x < 0) // and if sliding at all
              ?
              Math.abs(delta.x) / width + 1 // determine resistance level
              :
              1); // no resistance if false

          // translate 1:1
          translate(index - 1, delta.x + slidePos[index - 1], 0);
          translate(index, delta.x + slidePos[index], 0);
          translate(index + 1, delta.x + slidePos[index + 1], 0);
        }
      }
    },
    end: function (event) {
      // measure duration
      var duration = +new Date() - start.time;

      // determine if slide attempt triggers next/prev slide
      var isValidSlide =
        (Number(duration) < 250 && // if slide duration is less than 250ms
          Math.abs(delta.x) > 20) || // and if slide amt is greater than 20px
        Math.abs(delta.x) > width / 2; // or if slide amt is greater than half the width

      // determine if slide attempt is past start and end
      var isPastBounds =
        (!index && delta.x > 0) || // if first slide and slide amt is greater than 0
        (index == slides.length - 1 && delta.x < 0); // or if last slide and slide amt is less than 0

      if (options.continuous) { isPastBounds = false; }

      // determine direction of swipe (true:right, false:left)
      var direction = delta.x < 0;

      // if not scrolling vertically
      if (!isScrolling) {
        if (isValidSlide && !isPastBounds) {
          if (direction) {
            if (options.continuous) {
              // we need to get the next in this direction in place
              move(circle(index - 1), -width, 0);
              move(circle(index + 2), width, 0);
            } else {
              move(index - 1, -width, 0);
            }
            move(index, slidePos[index] - width, speed);
            move(circle(index + 1), slidePos[circle(index + 1)] - width, speed);
            index = circle(index + 1);
          } else {
            if (options.continuous) {
              // we need to get the next in this direction in place
              move(circle(index + 1), width, 0);
              move(circle(index - 2), -width, 0);
            } else {
              move(index + 1, width, 0);
            }
            move(index, slidePos[index] + width, speed);
            move(circle(index - 1), slidePos[circle(index - 1)] + width, speed);
            index = circle(index - 1);
          }
          options.callback && options.callback(index, slides[index]);
          index = index;
          //delay = options.auto || 0;
        } else {
          if (options.continuous) {
            move(circle(index - 1), -width, speed);
            move(index, 0, speed);
            move(circle(index + 1), width, speed);
          } else {
            move(index - 1, -width, speed);
            move(index, 0, speed);
            move(index + 1, width, speed);
          }
        }
      }

      // kill touchmove and touchend event listeners until touchstart called again
      element.removeEventListener('touchmove', events, {
        passive: false
      });
      element.removeEventListener('touchend', events, {
        passive: false
      });
      if (options.continuous) {
        delay = options.auto || 0; // set the delay option back
      }
    },
    transitionEnd: function (event) {
      if (parseInt(event.target.getAttribute('data-index'), 10) == index) {
        options.transitionEnd &&
          options.transitionEnd.call(event, index, slides[index]);
        addActive(index);
        if (delay) { begin(); }
      }
    }
  };

  // trigger setup
  setup();

  // start auto slideshow if applicable
  if (delay) { begin(); }

  // add event listeners
  if (browser.addEventListener) {
    // set touchstart event on element
    if (browser.touch)
      { element.addEventListener('touchstart', events, {
        passive: false
      }); }

    if (browser.transitions) {
      element.addEventListener('webkitTransitionEnd', events, false);
      element.addEventListener('msTransitionEnd', events, false);
      element.addEventListener('oTransitionEnd', events, false);
      element.addEventListener('otransitionend', events, false);
      element.addEventListener('transitionend', events, false);
    }

    // set resize event on window
    window.addEventListener('resize', events, false);
  } else {
    window.onresize = function () {
      setup();
    }; // to play nice with old IE
  }

  // expose the Swipe API
  return {
    setup: function () {
      setup();
    },
    slide: function (to, speed) {
      // cancel slideshow
      stop();
      slide(to, speed);
    },
    prev: function () {
      // cancel slideshow
      stop();
      prev();
    },
    next: function () {
      // cancel slideshow
      stop();
      next();
    },
    stop: function () {
      // cancel slideshow
      stop();
    },
    getCurrentIndex: function () {
      // return current index position
      return index
    },
    getNumSlides: function () {
      // return total number of slides
      return length
    }
  }
}

function Bzswipe(el, options) {
  var $el = typeof el === 'string' ? document.querySelector(el) : el;
  if (!$el) {
    console.error('can not resolve the wrapper dom');
  }
  return initMixin($el, options)
}

export default Bzswipe;

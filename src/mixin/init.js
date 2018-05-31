import {
  addClass,
  removeClass
} from '../wind-dom/class.js';
import {
  addStyleToHead
} from '../add-style/style'

export function initMixin(Bzswipe) {
  var $el;
  var ele;
  var slides, slidePos, width, length;
  var index;
  var options;
  var speed;
  var continuous;
  var delay;
  var pagination;
  var showPagination;
  var noop = function () {};
  var paginationStyleText = '#bz-swipe-indicators{width:100%;position:absolute;bottom:15px;text-align:center}' +
    '.bz-swipe-indicator{width:8px;height:8px;display:inline-block;border-radius:100%;background:#000;opacity:0.2;margin:0 3px;}' +
    '#bz-swipe-indicators .is-active{background:#bfbfbf;}' +
    '.bz-swipe-wrap .is-active{display:block;-webkit-transform:none;transform:none;}';
  var browser = {
    addEventListener: !!window.addEventListener,
    touch: ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch,
    transitions: (function (temp) {
      var props = ['transitionProperty', 'WebkitTransition', 'MozTransition', 'OTransition', 'msTransition'];
      for (var i in props)
        if (temp.style[props[i]] !== undefined) return true;
      return false;
    })(document.createElement('swipe'))
  };
  var interval;
  Bzswipe.prototype = {
    constructor: Bzswipe,
    _init: function () {
      options = this.options;
      $el = this.$el;
      ele = $el.children[0];
      options = options || {};
      index = parseInt(options.startSlide, 10) || 0;
      speed = options.speed || 300;
      continuous = options.continuous ? options.continuous : true;
      showPagination = options.showPagination ? options.showPagination : false;
      delay = options.auto || 3000;
      setup();
      if (delay) {
        begin();
      }
      if (browser.addEventListener) {
        if (browser.touch) ele.addEventListener('touchstart', events, false);
        if (browser.transitions) {
          ele.addEventListener('webkitTransitionEnd', events, false);
          ele.addEventListener('msTransitionEnd', events, false);
          ele.addEventListener('oTransitionEnd', events, false);
          ele.addEventListener('otransitionend', events, false);
          ele.addEventListener('transitionend', events, false);
        }
        window.addEventListener('resize', events, false);
      } else {
        window.onresize = function () {
          setup()
        };
      }
    }
  };

  function setup() {
    slides = ele.children;
    length = slides.length;
    if (slides.length < 2) continuous = false;

    if (browser.transitions && continuous && slides.length < 3) {
      ele.appendChild(slides[0].cloneNode(true));
      ele.appendChild(ele.children[1].cloneNode(true));
      slides = ele.children;
    }

    slidePos = new Array(slides.length);
    renderPagination()

    width = $el.getBoundingClientRect().width || $el.offsetWidth;
    ele.style.width = (slides.length * width) + 'px';

    var item = slides.length;
    while (item--) {
      var slide = slides[item];
      slide.style.width = width + 'px';
      slide.setAttribute('data-index', item);
      if (browser.transitions) {
        slide.style.left = (item * -width) + 'px';
        move(item, index > item ? -width : (index < item ? width : 0), 0);
      }
    }
    if (continuous && browser.transitions) {
      move(circle(index - 1), -width, 0);
      move(circle(index + 1), width, 0);
    }
    if (!browser.transitions) ele.style.left = (index * -width) + 'px';

    $el.style.visibility = 'visible';

  }

  function renderPagination() {
    var frag;
    var $pagination;
    var div;
    if (!showPagination) return;
    $pagination = document.getElementById('bz-swipe-indicators');
    if (!$pagination) {
      frag = document.createDocumentFragment();
      div = document.createElement('div');
      div.id = 'bz-swipe-indicators';
      frag.appendChild(div);
      $el.appendChild(frag);
      $pagination = document.getElementById('bz-swipe-indicators');
    }
    var paginationHTML = '';
    $pagination.innerHTML = paginationHTML;
    for (var i = 0; i < length; i++) {
      paginationHTML += `<span class="bz-swipe-indicator ${setActive(i)}"></span>`
    }
    $pagination.innerHTML = paginationHTML;
    pagination = $el.querySelectorAll('.bz-swipe-indicator');
    addStyleToHead(paginationStyleText)

    function setActive(i) {
      if (i === index) {
        return 'is-active'
      } else {
        return ''
      }
    }
  }

  function addActive(index) {
    var _index;
    if (!showPagination) return;
    if (browser.transitions && continuous && length < 3) {
      if (index === 0 || index === 2) {
        _index = 0
      }
      if (index === 1 || index === 3) {
        _index = 1
      }
    } else {
      _index = index
    }
    removeClass($el.querySelector('.is-active'), 'is-active');
    addClass(pagination[_index], 'is-active')
  }

  function next() {
    if (continuous) {
      slide(index + 1);
    } else if (index < slides.length - 1) slide(index + 1);
  }

  function slide(to, slideSpeed) {
    if (index == to) return;
    if (browser.transitions) {
      var direction = Math.abs(index - to) / (index - to); // 1: backward, -1: forward
      // get the actual position of the slide
      if (continuous) {
        var natural_direction = direction;
        direction = -slidePos[circle(to)] / width;
        // if going forward but to < index, use to = slides.length + to
        // if going backward but to > index, use to = -slides.length + to
        if (direction !== natural_direction) to = -direction * slides.length + to;
      }
      var diff = Math.abs(index - to) - 1;
      // move all the slides between index and to in the right direction
      while (diff--) move(circle((to > index ? to : index) - diff - 1), width * direction, 0);

      to = circle(to);
      move(index, width * direction, slideSpeed || speed);
      move(to, 0, slideSpeed || speed);
      if (continuous) move(circle(to - direction), -(width * direction), 0); // we need to get the next in place
    } else {
      to = circle(to);
      animate(index * -width, to * -width, slideSpeed || speed);
      //no fallback for a circular continuous if the browser does not accept transitions
    }
    index = to;
    offloadFn(options.callback && options.callback(index, slides[index]));
  }

  function circle(index) {
    // a simple positive modulo using slides.length
    return (slides.length + (index % slides.length)) % slides.length;
  }

  function move(index, dist, speed) {
    translate(index, dist, speed);
    slidePos[index] = dist;
  }

  function translate(index, dist, speed) {
    var slide = slides[index];
    var style = slide && slide.style;
    if (!style) return;
    style.webkitTransitionDuration =
      style.MozTransitionDuration =
      style.msTransitionDuration =
      style.OTransitionDuration =
      style.transitionDuration = speed + 'ms';
    style.webkitTransform = 'translate(' + dist + 'px,0)' + 'translateZ(0)';
    style.msTransform =
      style.MozTransform =
      style.OTransform = 'translateX(' + dist + 'px)';
  }

  function animate(from, to, speed) {
    // if not an animation, just reposition
    if (!speed) {
      ele.style.left = to + 'px';
      return;
    }
    var start = +new Date;
    var timer = setInterval(function () {
      var timeElap = +new Date - start;
      if (timeElap > speed) {
        ele.style.left = to + 'px';
        if (delay) begin();
        options.transitionEnd && options.transitionEnd.call(event, index, slides[index]);
        clearInterval(timer);
        return;
      }
      ele.style.left = (((to - from) * (Math.floor((timeElap / speed) * 100) / 100)) + from) + 'px';
    }, 4);
  }

  function prev() {
    if (continuous) slide(index - 1);
    else if (index) slide(index - 1);
  }

  function begin() {
    interval = setTimeout(next, delay);
  }

  function stop() {
    delay = 0;
    clearTimeout(interval);
  }

  function offloadFn(fn) {
    setTimeout(fn || noop, 0)
  };
  var start = {};
  var delta = {};
  var isScrolling;
  var events = {
    handleEvent: function (event) {
      switch (event.type) {
        case 'touchstart':
          this.start(event);
          break;
        case 'touchmove':
          this.move(event);
          break;
        case 'touchend':
          offloadFn(this.end(event));
          break;
        case 'webkitTransitionEnd':
        case 'msTransitionEnd':
        case 'oTransitionEnd':
        case 'otransitionend':
        case 'transitionend':
          offloadFn(this.transitionEnd(event));
          break;
        case 'resize':
          offloadFn(setup);
          break;
      }
      if (options.stopPropagation) event.stopPropagation();
    },
    start: function (event) {
      var touches = event.touches[0];
      start = {
        // get initial touch coords
        x: touches.pageX,
        y: touches.pageY,
        // store time to determine touch duration
        time: +new Date
      };
      // used for testing first move event
      isScrolling = undefined;
      // reset delta and end measurements
      delta = {};
      // attach touchmove and touchend listeners
      ele.addEventListener('touchmove', this, false);
      ele.addEventListener('touchend', this, false);
    },
    move: function (event) {
      // ensure swiping with one touch and not pinching
      if (event.touches.length > 1 || (event.scale && event.scale !== 1))
        return;
      if (options.disableScroll) event.preventDefault();
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
        stop();
        // increase resistance if first or last slide
        if (continuous) {
          // we don't add resistance at the end
          translate(
            circle(index - 1),
            delta.x + slidePos[circle(index - 1)],
            0
          );
          translate(index, delta.x + slidePos[index], 0);
          translate(
            circle(index + 1),
            delta.x + slidePos[circle(index + 1)],
            0
          );
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
      if (continuous) isPastBounds = false;
      // determine direction of swipe (true:right, false:left)
      var direction = delta.x < 0;
      // if not scrolling vertically
      if (!isScrolling) {
        if (isValidSlide && !isPastBounds) {
          if (direction) {
            if (continuous) {
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
            if (continuous) {
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
        } else {
          if (continuous) {
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
      ele.removeEventListener('touchmove', events, false);
      ele.removeEventListener('touchend', events, false);
    },
    transitionEnd: function (event) {
      if (parseInt(event.target.getAttribute('data-index'), 10) == index) {
        if (delay) begin();
        options.transitionEnd && options.transitionEnd.call(event, index, slides[index]);
        addActive(index)
      }
    }
  }
  Bzswipe.prototype.setup = function () {
    setup();
  }
  Bzswipe.prototype.slide = function (to, speed) {
    stop();
    slide(to, speed);
  }
  Bzswipe.prototype.getCurrentIndex = function () {
    return index;
  }
  Bzswipe.prototype.getNumSlides = function () {
    return length;
  }
  Bzswipe.prototype.stop = function () {
    stop();
  }
  Bzswipe.prototype.prev = function () {
    stop();
    prev();
  }
  Bzswipe.prototype.next = function () {
    stop();
    next();
  }
}

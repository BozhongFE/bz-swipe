# bz-swipe

> A simple touch slider for mobile.

Based on Brad Birdsall's Swipe https://github.com/thebird/Swipe, add Pagination on slider bottom,
use Rollup to compile to UMD and ES format


## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for demo with minification
npm run build:demo

# build for production with minification
npm run build
```
## Install Local Packages
```bash
npm install git+https://github.com/BozhongFE/bz-swipe.git#version
```
# Options
## Attributes
Here list Props on bz-swipe component

| Option | Description |
| ----- | ----- |
| speed | Number(default: 300) speed of animation. |
| startSlide |  Integer (default:0)  the start swipe item index |
| auto | Number(default: 3000) delay of auto slide. |
| continuous | Boolean (default:true) - create an infinite feel with no end points |
| showPagination | Boolean (default:false) - show Pagination on slider bottom. |
| clickable | Boolean (default:false) - If true then clicking on pagination button will cause transition to appropriate slide.
| disableScroll | Boolean (default:false) - stop any touches on this container from scrolling the page
| stopPropagation | Boolean (default:false) - stop event propagation 
### Example
``` html
<div class='bz-swipe'>
  <div class='bz-swipe-wrap'>
    <div></div>
    <div></div>
    <div></div>
  </div>
</div>
```
in ES6 modules:
``` js
import Bzswipe from 'bz-swipe'
const swipeWrap = document.querySelector('.bz-swipe')
const mySwipe = new Bzswipe(swipeWrap);
```

bz-swipe provides a class whose first parameter is a plain DOM object when instantiated. Certainly, bz-swipe inside would try to use querySelector to get the DOM object, so the initiazation code can also be like the following:

``` js
import Bzswipe from 'bz-swipe'
const mySwipe = new Bzswipe('.bz-swipe');
```

in Requirejs with Bozhong's config:

```js
require(['mod/bz-swipe/version/bz-swipe'], function (Bzswipe) {
  var mySwipe = new Bzwipe('.bz-swipe', {
    auto: 2000,
    speed: 500
  })
}
```
bz-swipe needs just a few styles added to your stylesheet:
``` css
.bz-swipe {
  overflow: hidden;
  visibility: hidden;
  position: relative;
}
.bz-swipe-wrap {
  overflow: hidden;
  position: relative;
}
.bz-swipe-wrap > div {
  float:left;
  width:100%;
  position: relative;
}
```

## API

bz-swipe exposes a few functions like swipe that can be useful for script control of your slider.

`prev()` slide to prev

`next()` slide to next

`stop()` stop slide

`getCurrentIndex()` returns current slide index position

`getNumSlides()` returns the total amount of slides

`slide(index, duration)` slide to set index position (duration: speed of transition in milliseconds)
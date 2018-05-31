import Bzswipe from '../src/index'

var mySwipe = new Bzswipe('.bz-swipe', {
  auto: 2000,
  continuous: true,
  stopPropagation: true,
  showPagination: true,
  callback: function (index, ele) {}
})

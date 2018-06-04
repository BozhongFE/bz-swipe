import Bzswipe from '../src/index'

var mySwipe1 = new Bzswipe('.bz-swipe-1', {
  auto: 2000,
  continuous: false,
  stopPropagation: true,
  showPagination: true,
  callback: function (index, ele) {}
})

var mySwipe2 = new Bzswipe('.bz-swipe-2', {
  auto: 3000,
  stopPropagation: true,
  continuous: false,
  callback: function (index, ele) {}
})

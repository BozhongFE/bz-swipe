import Bzswipe from '../src/index'

var mySwipe1 = new Bzswipe('.bz-swipe-1', {
  auto: 3000,
  continuous: true,
  stopPropagation: true,
  showPagination: true,
  clickable: true,
  callback: function (index, ele) {}
})


var mySwipe2 = new Bzswipe('.bz-swipe-2', {
  stopPropagation: true,
  showPagination: true,
  callback: function (index, ele) {}
})

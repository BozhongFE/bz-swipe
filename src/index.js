import {
  initMixin
} from './mixin/init'

function Bzswipe(el, options) {
  var $el = typeof el === 'string' ? document.querySelector(el) : el;
  if (!$el) {
    console.error('can not resolve the wrapper dom')
  }
  return initMixin($el, options)
}
export default Bzswipe

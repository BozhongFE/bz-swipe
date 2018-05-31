import {
  initMixin
} from './mixin/init'

function Bzswipe(el, options) {
  this.$el = typeof el === 'string' ? document.querySelector(el) : el;
  if (!this.$el) {
    console.error('can not resolve the wrapper dom')
  }
  this.options = options || {};
  this._init()
}
initMixin(Bzswipe)
export default Bzswipe

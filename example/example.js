!function(t){function n(i){if(e[i])return e[i].exports;var o=e[i]={i:i,l:!1,exports:{}};return t[i].call(o.exports,o,o.exports,n),o.l=!0,o.exports}var e={};n.m=t,n.c=e,n.d=function(t,e,i){n.o(t,e)||Object.defineProperty(t,e,{configurable:!1,enumerable:!0,get:i})},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)},n.p="",n(n.s=0)}([function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var i=e(1);new i.a(".bz-swipe",{auto:2e3,continuous:!0,stopPropagation:!0,showPagination:!0,callback:function(t,n){}})},function(t,n,e){"use strict";function i(t,n){this.$el="string"==typeof t?document.querySelector(t):t,this.$el||console.error("can not resolve the wrapper dom"),this.options=n||{},this._init()}var o=e(2);Object(o.a)(i),n.a=i},function(t,n,e){"use strict";function i(t){function n(){x=m.children,y=x.length,x.length<2&&(k=!1),C.transitions&&k&&x.length<3&&(m.appendChild(x[0].cloneNode(!0)),m.appendChild(m.children[1].cloneNode(!0)),x=m.children),g=new Array(x.length),e(),w=b.getBoundingClientRect().width||b.offsetWidth,m.style.width=x.length*w+"px";for(var t=x.length;t--;){var n=x[t];n.style.width=w+"px",n.setAttribute("data-index",t),C.transitions&&(n.style.left=t*-w+"px",u(t,E>t?-w:E<t?w:0,0))}k&&C.transitions&&(u(c(E-1),-w,0),u(c(E+1),w,0)),C.transitions||(m.style.left=E*-w+"px"),b.style.visibility="visible"}function e(){var t,n,e;if(D){n=document.getElementById("bz-swipe-indicators"),n||(t=document.createDocumentFragment(),e=document.createElement("div"),e.id="bz-swipe-indicators",t.appendChild(e),b.appendChild(t),n=document.getElementById("bz-swipe-indicators"));var i="";n.innerHTML=i;for(var o=0;o<y;o++)i+='<span class="bz-swipe-indicator '+function(t){return t===E?"is-active":""}(o)+'"></span>';n.innerHTML=i,M=b.querySelectorAll(".bz-swipe-indicator"),Object(a.a)(P)}}function i(t){var n;D&&(C.transitions&&k&&y<3?(0!==t&&2!==t||(n=0),1!==t&&3!==t||(n=1)):n=t,Object(o.b)(b.querySelector(".is-active"),"is-active"),Object(o.a)(M[n],"is-active"))}function r(){k?s(E+1):E<x.length-1&&s(E+1)}function s(t,n){if(E!=t){if(C.transitions){var e=Math.abs(E-t)/(E-t);if(k){var i=e;e=-g[c(t)]/w,e!==i&&(t=-e*x.length+t)}for(var o=Math.abs(E-t)-1;o--;)u(c((t>E?t:E)-o-1),w*e,0);t=c(t),u(E,w*e,n||L),u(t,0,n||L),k&&u(c(t-e),-w*e,0)}else t=c(t),d(E*-w,t*-w,n||L);E=t,v(T.callback&&T.callback(E,x[E]))}}function c(t){return(x.length+t%x.length)%x.length}function u(t,n,e){l(t,n,e),g[t]=n}function l(t,n,e){var i=x[t],o=i&&i.style;o&&(o.webkitTransitionDuration=o.MozTransitionDuration=o.msTransitionDuration=o.OTransitionDuration=o.transitionDuration=e+"ms",o.webkitTransform="translate("+n+"px,0)translateZ(0)",o.msTransform=o.MozTransform=o.OTransform="translateX("+n+"px)")}function d(t,n,e){if(!e)return void(m.style.left=n+"px");var i=+new Date,o=setInterval(function(){var a=+new Date-i;if(a>e)return m.style.left=n+"px",z&&f(),T.transitionEnd&&T.transitionEnd.call(event,E,x[E]),void clearInterval(o);m.style.left=(n-t)*(Math.floor(a/e*100)/100)+t+"px"},4)}function p(){k?s(E-1):E&&s(E-1)}function f(){O=setTimeout(r,z)}function h(){z=0,clearTimeout(O)}function v(t){setTimeout(t||N,0)}var b,m,x,g,w,y,E,T,L,k,z,M,D,O,N=function(){},P="#bz-swipe-indicators{width:100%;position:absolute;bottom:15px;text-align:center}.bz-swipe-indicator{width:8px;height:8px;display:inline-block;border-radius:100%;background:#000;opacity:0.2;margin:0 3px;}#bz-swipe-indicators .is-active{background:#bfbfbf;}.bz-swipe-wrap .is-active{display:block;-webkit-transform:none;transform:none;}",C={addEventListener:!!window.addEventListener,touch:"ontouchstart"in window||window.DocumentTouch&&document instanceof DocumentTouch,transitions:function(t){var n=["transitionProperty","WebkitTransition","MozTransition","OTransition","msTransition"];for(var e in n)if(void 0!==t.style[n[e]])return!0;return!1}(document.createElement("swipe"))};t.prototype={constructor:t,_init:function(){T=this.options,b=this.$el,m=b.children[0],T=T||{},E=parseInt(T.startSlide,10)||0,L=T.speed||300,k=!T.continuous||T.continuous,D=!!T.showPagination&&T.showPagination,z=T.auto||3e3,n(),z&&f(),C.addEventListener?(C.touch&&m.addEventListener("touchstart",I,!1),C.transitions&&(m.addEventListener("webkitTransitionEnd",I,!1),m.addEventListener("msTransitionEnd",I,!1),m.addEventListener("oTransitionEnd",I,!1),m.addEventListener("otransitionend",I,!1),m.addEventListener("transitionend",I,!1)),window.addEventListener("resize",I,!1)):window.onresize=function(){n()}}};var S,j={},F={},I={handleEvent:function(t){switch(t.type){case"touchstart":this.start(t);break;case"touchmove":this.move(t);break;case"touchend":v(this.end(t));break;case"webkitTransitionEnd":case"msTransitionEnd":case"oTransitionEnd":case"otransitionend":case"transitionend":v(this.transitionEnd(t));break;case"resize":v(n)}T.stopPropagation&&t.stopPropagation()},start:function(t){var n=t.touches[0];j={x:n.pageX,y:n.pageY,time:+new Date},S=void 0,F={},m.addEventListener("touchmove",this,!1),m.addEventListener("touchend",this,!1)},move:function(t){if(!(t.touches.length>1||t.scale&&1!==t.scale)){T.disableScroll&&t.preventDefault();var n=t.touches[0];F={x:n.pageX-j.x,y:n.pageY-j.y},void 0===S&&(S=!!(S||Math.abs(F.x)<Math.abs(F.y))),S||(t.preventDefault(),h(),k?(l(c(E-1),F.x+g[c(E-1)],0),l(E,F.x+g[E],0),l(c(E+1),F.x+g[c(E+1)],0)):(F.x=F.x/(!E&&F.x>0||E==x.length-1&&F.x<0?Math.abs(F.x)/w+1:1),l(E-1,F.x+g[E-1],0),l(E,F.x+g[E],0),l(E+1,F.x+g[E+1],0)))}},end:function(t){var n=+new Date-j.time,e=Number(n)<250&&Math.abs(F.x)>20||Math.abs(F.x)>w/2,i=!E&&F.x>0||E==x.length-1&&F.x<0;k&&(i=!1);var o=F.x<0;S||(e&&!i?(o?(k?(u(c(E-1),-w,0),u(c(E+2),w,0)):u(E-1,-w,0),u(E,g[E]-w,L),u(c(E+1),g[c(E+1)]-w,L),E=c(E+1)):(k?(u(c(E+1),w,0),u(c(E-2),-w,0)):u(E+1,w,0),u(E,g[E]+w,L),u(c(E-1),g[c(E-1)]+w,L),E=c(E-1)),T.callback&&T.callback(E,x[E])):k?(u(c(E-1),-w,L),u(E,0,L),u(c(E+1),w,L)):(u(E-1,-w,L),u(E,0,L),u(E+1,w,L))),m.removeEventListener("touchmove",I,!1),m.removeEventListener("touchend",I,!1)},transitionEnd:function(t){parseInt(t.target.getAttribute("data-index"),10)==E&&(z&&f(),T.transitionEnd&&T.transitionEnd.call(t,E,x[E]),i(E))}};t.prototype.setup=function(){n()},t.prototype.slide=function(t,n){h(),s(t,n)},t.prototype.getCurrentIndex=function(){return E},t.prototype.getNumSlides=function(){return y},t.prototype.stop=function(){h()},t.prototype.prev=function(){h(),p()},t.prototype.next=function(){h(),r()}}n.a=i;var o=e(3),a=e(4)},function(t,n,e){"use strict";e.d(n,"a",function(){return a}),e.d(n,"b",function(){return r});var i=function(t){return(t||"").replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g,"")},o=function(t,n){if(!t||!n)return!1;if(-1!=n.indexOf(" "))throw new Error("className should not contain space.");return t.classList?t.classList.contains(n):(" "+t.className+" ").indexOf(" "+n+" ")>-1},a=function(t,n){if(t){for(var e=t.className,i=(n||"").split(" "),a=0,r=i.length;a<r;a++){var s=i[a];s&&(t.classList?t.classList.add(s):o(t,s)||(e+=" "+s))}t.classList||(t.className=e)}},r=function(t,n){if(t&&n){for(var e=n.split(" "),a=" "+t.className+" ",r=0,s=e.length;r<s;r++){var c=e[r];c&&(t.classList?t.classList.remove(c):o(t,c)&&(a=a.replace(" "+c+" "," ")))}t.classList||(t.className=i(a))}}},function(t,n,e){"use strict";function i(t){var n=document,e=n.createElement("style");if(e.setAttribute("type","text/css"),e.styleSheet)e.styleSheet.cssText=t;else{var i=n.createTextNode(t);e.appendChild(i)}var o=n.getElementsByTagName("head");o.length?o[0].appendChild(e):n.documentElement.appendChild(e)}n.a=i}]);
//# sourceMappingURL=example.js.map
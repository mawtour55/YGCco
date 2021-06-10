/**
 * @name	jQuery.touchSlider
 * @author	dohoons ( http://dohoons.com/ )
 *
 * @version	1.6.8
 * @since	201106
*/

!function(t){"use strict";t.fn.touchSlider=function(s){t.fn.touchSlider.defaults={mode:"swipe",useMouse:!0,roll:!0,flexible:!0,resize:!0,btn_prev:null,btn_next:null,controls:!0,paging:!0,speed:150,view:1,gap:0,range:.15,page:1,sidePage:!1,transition:!0,initComplete:null,counter:null,propagation:!1,autoplay:{enable:!1,pauseHover:!0,addHoverTarget:"",interval:3500},breakpoints:null};var e=t.extend(!0,{},t.fn.touchSlider.defaults,s);if(e.breakpoints)for(var o in e.breakpoints.defaultOption={mode:e.mode,roll:e.roll,flexible:e.flexible,speed:e.speed,view:e.view,gap:e.gap,sidePage:e.sidePage},e.breakpoints)"default"!==o&&(e.breakpoints[o]=t.extend({},e.breakpoints.defaultOption,e.breakpoints[o]));return this.each(function(){var s=this;t.fn.extend(this,i),this.opts=e,this.init(),t(window).on("orientationchange resize",function(){s.resize.call(s)})})};var s={isIE11:navigator.userAgent.indexOf("Trident/7.")>-1,supportsCssTransitions:"transition"in document.documentElement.style||"WebkitTransition"in document.documentElement.style},i={init:function(){var s=this;if(this._view=this.opts.view,this._speed=this.opts.speed,this._tg=t(this),this._list_wrap=this._tg.children().eq(0),this._list_wrap.find(".blank").remove(),this._list=this._list_wrap.children(),this._width=0,this._range=0,this._len=this._list.length,this._pos=[],this._start=[],this._startX=0,this._startY=0,this._left=0,this._top=0,this._drag=!1,this._link=!0,this._scroll=!1,this._hover_tg=[],this._timer=null,this._tg.off("touchstart",this.touchstart).off("touchmove",this.touchmove).off("touchend",this.touchend).off("touchcancel",this.touchend).off("dragstart").on("dragstart",function(t){t.preventDefault()}).on("touchstart",this.touchstart).on("touchmove",this.touchmove).on("touchend",this.touchend).on("touchcancel",this.touchend),this.opts.useMouse&&this._tg.off("mousedown",this.touchstart).on("mousedown",this.touchstart),this.opts.roll){if(this._len/this._view<=1&&(this.opts.roll=!1),this._len%this._view>0)for(var i=t(document.createElement(this._list.eq(0).prop("tagName"))).hide().addClass("blank"),e=this._view-this._len%this._view,o=0;o<e;++o)this._list.parent().append(i.clone());this._list=this._list_wrap.children(),this._len=this._list.length/this._view*this._view}if(s.setSize(s.opts.page),this.opts.btn_prev&&this.opts.btn_next&&(this.opts.btn_prev.off("click").on("click",function(t){s.animate(1,!0),t.preventDefault()}),this.opts.btn_next.off("click").on("click",function(t){s.animate(-1,!0),t.preventDefault()})),this._controls=t('<div class="ts-controls"></div>'),this._tg.nextAll(".ts-controls:eq(0)").remove(),this.opts.paging){this._controls.append('<div class="ts-paging"></div>'),this._tg.after(this._controls);for(var n="",h=Math.ceil(this._len/this._view),a=1;a<=h;++a)n+='<button type="button" class="ts-paging-btn">page'+a+"</button>";this._pagingBtn=t(n),this._controls.find(".ts-paging").html(this._pagingBtn).on("click",function(i){s.go_page(t(i.target).index())})}this.opts.controls&&(this._controls.append('<button type="button" class="ts-prev">Prev</button><button type="button" class="ts-next">Next</button>'),this._tg.after(this._controls),this._controls.find(".ts-prev, .ts-next").on("click",function(i){s.animate(t(this).hasClass("ts-prev")?1:-1,!0),i.preventDefault()}).on("touchstart mousedown touchend mouseup",function(t){t.stopPropagation()})),this.opts.autoplay.enable&&(this._hover_tg=[],this._hover_tg.push(this._tg),this.opts.btn_prev&&this.opts.btn_next&&(this._hover_tg.push(this.opts.btn_prev),this._hover_tg.push(this.opts.btn_next)),""!==this.opts.autoplay.addHoverTarget&&this._hover_tg.push(t(this.opts.autoplay.addHoverTarget)),this.opts.autoplay.pauseHover&&t(this._hover_tg).each(function(){t(this).off("mouseenter mouseleave").on("mouseenter mouseleave",function(t){"mouseenter"==t.type?s.autoStop():(s.autoStop(),s.autoPlay())})}),this.autoStop(),this.autoPlay()),this.removeEventListener("click",this._containerClickHandler||function(){},!0),this._containerClickHandler=function(t){s._link||(t.stopPropagation(),t.preventDefault())},this.addEventListener("click",this._containerClickHandler,!0),this.initComplete(),this.opts.breakpoints?this.resize():this.counter()},initComplete:function(){"function"==typeof this.opts.initComplete&&this.opts.initComplete.call(this,this)},destroy:function(){this._tg.off("touchstart",this.touchstart).off("touchmove",this.touchmove).off("touchend",this.touchend).off("touchcancel",this.touchend).off("dragstart"),this.opts.useMouse&&this._tg.off("mousedown",this.touchstart),this._tg.css({height:""}),this._list_wrap.css({width:"",overflow:"",left:""}),this._list.css({float:"",width:"",position:"",top:"",left:"",opacity:"","z-index":"","-moz-transition":"","-moz-transform":"","-ms-transition":"","-ms-transform":"","-webkit-transition":"","-webkit-transform":"",transition:"",transform:""}),this._list.removeAttr("aria-hidden"),this._list_wrap.find(".blank").remove(),this._tg.nextAll(".ts-controls:eq(0)").remove(),this.opts.autoplay.enable&&this.autoStop(),this.removeEventListener("click",this._containerClickHandler,!0),"function"==typeof this.opts.destroyComplete&&this.opts.destroyComplete.call(this,this)},setSize:function(t){var s=0;this._width=parseInt(this._tg.css("width")),this._range=this.opts.range*this._width,this._list_wrap.css({width:this._width+"px",overflow:"visible"}),this._item_w=(this._width-(this._view-1)*this.opts.gap)/this._view,t>1&&t<=this._len&&(s=(t-1)*(this._item_w*this._view+this._view*this.opts.gap));for(var i=0,e=this._len,o=0;i<e;++i)o=this.opts.gap*i,this._pos[i]=this._item_w*i-s+o,this._start[i]=this._pos[i],this._list.eq(i).css({float:"none",position:"absolute",top:"0",width:this._item_w+"px"}),this.move({tg:this._list.eq(i),to:this._pos[i]});this.opts.sidePage&&this.position()},resize:function(){if(this.opts.flexible&&this.setSize(this.get_page().current),this.opts.breakpoints){var t=this._width,s=this.opts.breakpoints.defaultOption,i=s,e=!1;for(var o in this.opts.breakpoints)if(Boolean(Number(o))&&t<=Number(o)){i=this.opts.breakpoints[o];break}for(var n in i)s.hasOwnProperty(n)&&this.opts[n]!==i[n]&&(this.opts[n]=i[n],e=!0);e&&this.init()}this.counter()},touchstart:function(s){this.opts.propagation||s.stopPropagation(),("touchstart"==s.type&&s.originalEvent.touches.length<=1||"mousedown"==s.type)&&(this._startX=s.originalEvent.touches?s.originalEvent.touches[0].pageX:s.pageX,this._startY=s.originalEvent.touches?s.originalEvent.touches[0].pageY:s.pageY,this._scroll=!1,this._start=this._pos.slice(0),"mousedown"==s.type&&t(document).on("mousemove",this,this.mousemove).on("mouseup",this,this.mouseup))},mousemove:function(t){t.data.touchmove.call(t.data,t)},mouseup:function(s){t(document).off("mousemove",s.data.mousemove).off("mouseup",s.data.mouseup),s.data.touchend.call(s.data,s)},touchmove:function(t){if(this.opts.propagation||t.stopPropagation(),"touchmove"==t.type&&t.originalEvent.touches.length<=1||"mousemove"==t.type){this._left=(t.originalEvent.touches?t.originalEvent.touches[0].pageX:t.pageX)-this._startX,this._top=(t.originalEvent.touches?t.originalEvent.touches[0].pageY:t.pageY)-this._startY,((this._left<0?-1*this._left:this._left)<(this._top<0?-1*this._top:this._top)||this._scroll)&&!this._drag?(this._left=0,this._drag=!1,this._link=!0,this._scroll=!0):(t.preventDefault(),this._drag=!0,this._link=!1,this._scroll=!1),this.position(t);for(var s=0,i=this._len;s<i;++s){var e=this._start[s]+this._left;"swipe"===this.opts.mode&&this.move({tg:this._list.eq(s),to:e}),this._pos[s]=e}}},touchend:function(t){if(this.opts.propagation||t.stopPropagation(),this._scroll)this._drag=!1,this._link=!0,this._scroll=!1;else{this.animate(this.direction()),this.position(),this._drag=!1,this._scroll=!0;var s=this;setTimeout(function(){s._link=!0},50)}},position:function(s){var i=this._len,e=this._view,o=e*this._item_w+e*this.opts.gap;if(-1==s||1==s?(this._startX=0,this._start=this._pos.slice(0),this._left=s*o):this.opts.sidePage?s=this.get_page().current<2?1:-1:(this._left>o&&(this._left=o),this._left<-o&&(this._left=-o)),this.opts.roll){var n=this._pos.slice(0).sort(function(t,s){return t-s}),h=n[i-e],a=t.inArray(n[0],this._pos),r=t.inArray(h,this._pos),p=this.opts.sidePage?3:1;if(e<=1&&(h=i-p),1==s&&n[p-1]>=0||this._drag&&n[p-1]>0)for(var l=0;l<e;++l,++a,++r)this._start[r]=this._start[a]-o,this.move({tg:this._list.eq(r),to:this._start[r]});else if(-1==s&&n[h]<=0||this._drag&&n[h]<=0)for(l=0;l<e;++l,++a,++r)this._start[a]=this._start[r]+o,this.move({tg:this._list.eq(a),to:this._start[a]})}else this.limit_chk()&&(this._left=this._left/2)},move:function(t){var i=void 0!==t.speed?t.speed+"ms ease":"none",e="translate3d("+t.to+"px,0,0)",o={left:"0",opacity:"1","-moz-transition":i,"-moz-transform":e,"-ms-transition":i,"-ms-transform":e,"-webkit-transition":i,"-webkit-transform":e,transition:i,transform:e},n=this._list_wrap,h=0,a=s.supportsCssTransitions&&this.opts.transition;if(t.tg.attr("aria-hidden",t.to<0||t.to>=this._width),"swipe"===this.opts.mode)a?void 0===t.speed?t.tg.stop().css(o):t.btn_click?setTimeout(function(){t.tg.css(o)},10):(h=t.gap>0?-(t.to-t.from):t.from-t.to,t.tg.css({left:t.to+"px",opacity:"1","-moz-transition":"none","-moz-transform":"none","-ms-transition":"none","-ms-transform":"none","-webkit-transition":"none","-webkit-transform":"none",transition:"none",transform:"none"}),n.css(s.isIE11?{transition:"none",transform:"none",left:h+"px"}:{transition:"none",transform:"translate3d("+h+"px,0,0)"}),setTimeout(function(){n.css(s.isIE11?{transition:t.speed+"ms ease",left:"0"}:{transition:t.speed+"ms ease",transform:"translate3d(0,0,0)"})},10)):void 0===t.speed?t.tg.stop().css({left:t.to+"px",opacity:"1"}):t.tg.stop().animate({left:t.to+"px",opacity:"1"},t.speed);else if("fade"===this.opts.mode){var r=0===t.dir||void 0===t;t.to>=0&&t.to<this._width?t.tg.stop().css(a?{opacity:r?1:0,zIndex:2,transition:"none",transform:"translate3d("+t.to+"px,0,0)"}:{opacity:r?1:0,zIndex:2,left:t.to+"px"}).animate({opacity:1},t.speed):t.tg.stop().css({zIndex:1,opacity:r?0:null}).animate({opacity:0},t.speed)}},animate:function(t,s,i){if(this._drag||!this._scroll||s){var e=i>-1?i:this._speed,o=t*(this._item_w*this._view+this._view*this.opts.gap),n=this._list,h=0,a=0;s&&this.position(t),(0===this._left||!this.opts.roll&&this.limit_chk())&&(o=0);for(var r=0,p=this._len;r<p;++r)h=this._pos[r],a=this._pos[r]=this._start[r]+o,this.move({tg:n.eq(r),dir:t,gap:o,from:h,to:a,speed:e,btn_click:s});0!==t&&this.counter()}},direction:function(){var t=0;return this._left<-this._range?t=-1:this._left>this._range&&(t=1),this._drag&&!this._scroll||(t=0),t},limit_chk:function(){var t=parseInt((this._len-1)/this._view)*this._view;return 0===this._start[0]&&this._left>0||0===this._start[t]&&this._left<0},go_page:function(s){for(var i=t.inArray(0,this._pos)/this._view+1-(s+1);0!==i;)i<0?(this.animate(-1,!0),i++):i>0&&(this.animate(1,!0),i--)},get_page:function(){return{obj:this,total:Math.ceil(this._len/this._view),current:t.inArray(0,this._pos)/this._view+1}},counter:function(){var s=this.get_page();t.inArray(0,this._pos)<0&&this._len>0&&(this.opts.page=0,this.init()),this.opts.page=s.current,this.opts.resize&&this._tg.css({height:this._list.eq(this.opts.page-1).height()+"px"}),this.opts.paging&&this._pagingBtn.eq(s.current-1).addClass("ts-paging-active").siblings().removeClass("ts-paging-active"),"function"==typeof this.opts.counter&&this.opts.counter.call(this,s)},autoPlay:function(){var t=this;this._timer=setInterval(function(){if(t.opts.autoplay.enable&&!t._drag){var s=t.get_page();s.current!=s.total||t.opts.roll?t.animate(-1,!0):t.go_page(0)}},this.opts.autoplay.interval)},autoStop:function(){clearInterval(this._timer)},autoPauseToggle:function(){return this.opts.autoplay.enable?(this.autoStop(),this.opts.autoplay.enable=!1,"stopped"):(this.opts.autoplay.enable=!0,this.autoPlay(),"started")}}}(jQuery);
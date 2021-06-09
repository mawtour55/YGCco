/*
	- Based on Swipe 2.0 by Brad Birdsall
	- http://swipejs.com/
*/
/* 날개 뿅 */
var mainSwipe = {
	init : function() {
		this.wrap = document.getElementById("wrap");
		this.header = document.getElementById("finWingHeader");
		this.main = document.getElementById("finContent");
		this.menu = document.getElementById("finMenu");
		this.search = document.getElementById("finSearch");

		if (!this.main || !this.menu || !this.search) {
			return;
		}
		this.memNav = document.getElementById("devMemNav");
		this.index = 0;
		this.delay = 400;
		this.deltaX = 0;
		this.isScrolling;
		this.width;
		this.moveWidth;
		this.start = {};
		this.isDirChange = false;
		this.setup();
		this.bindEvent();
	},

	getIndex : function() {
		return this.index;
	},

	setIndex : function(index) {
		this.index = index;
	},

	setup : function() {
		this.width = $(window).width();
		this.moveWidth = this.width - 40;
	},

	rotateChange : function() {
		this.setup();
		this.slide(this.index * this.moveWidth, 0);
		$(this.main).trigger("webkitTransitionEnd");
	},

	changeSlide : function(destination) {
		switch (destination) {
			case "home" :
				this.index = 0;
				break;
			case "menu" :
				this.index = 1;
				break;
			case "search" :
				this.index = -1;
				break;
		}
		this.slide(this.index * this.moveWidth, this.delay);
	},

	hideSlide : function(targetSlide) {
		switch (targetSlide) {
			case "menu" :
				this.menu.style.display = "none";
				this.search.style.display = "block";
				break;
			case "search" :
				this.menu.style.display = "block";
				this.search.style.display = "none";
				break;
			case "both" :
				this.menu.style.display = "none";
				this.search.style.display = "none";
		}
	},

	slide : function(distance, delay) {
		var distance = distance || 0;
		var delay = delay || 0;

		this.main.style.webkitTransitionDuration = "" + delay + "ms";
		this.main.style.webkitTransformStyle = "preserve-3d";
		this.main.style.webkitTransform = "translate(" + distance + "px, 0)";
	},

	calculateHeight : function() {
		if (this.index === 0) {
			this.wrap.style.height = "auto";
		} else {
			var height = window.innerHeight;

			if (this.index === 1) {
				if (height < this.menu.offsetHeight) {
					height = this.menu.offsetHeight;
				}
				this.menu.style.height = height + "px";
			} else {
				if (height < this.search.offsetHeight) {
					height = this.search.offsetHeight;
				}
				this.search.style.height = height + "px";
			}
			this.wrap.style.height = height + "px";
		}
	},

	bindEvent : function() {
		var that = this;

		this.header.ontouchstart = function(e) {
			document.activeElement.blur();
			that.start = {
				pageX : e.touches[0].pageX,
				pageY  : e.touches[0].pageY,
				time : Number(new Date())
			}

			that.isScrolling = undefined;
			that.isDirChange = false;
			that.deltaX = 0;
			e.stopPropagation();
		};

		this.header.ontouchmove = function(e) {
			// ensure swiping with one touch and not pinching
			if(e.touches.length > 1 || e.scale && e.scale !== 1) {
				return;
			}

			that.deltaX = e.touches[0].pageX - that.start.pageX;

			// determine if scrolling test has run - one time test
			if (typeof that.isScrolling == "undefined") {
				that.isScrolling = !!(that.isScrolling || Math.abs(that.deltaX) < Math.abs(e.touches[0].pageY - that.start.pageY) );
			}

			if (that.index === 0 && typeof that.isDirChange !== true) {
				if (that.deltaX > 0) { // menu
					that.hideSlide("search");
				} else {
					that.hideSlide("menu");
				}
				that.isDirChange = true;
			}

			// if user is not trying to scroll vertically
			if (!that.isScrolling) {
				var moveX = that.deltaX;

				if (that.index !== 0) {
					if (that.index > 0) {
						moveX = that.deltaX + that.moveWidth;
					} else {
						moveX = that.deltaX - that.moveWidth;
					}
				}

				e.preventDefault();
				that.slide(moveX);
			}

			e.stopPropagation();
		};

		this.header.ontouchend = function(e) {
			var changeTarget = "";
			var isValidSlide =
				  Number(new Date()) - that.start.time < 250      // if slide duration is less than 250ms
				  && Math.abs(that.deltaX) > 10                   // and if slide amt is greater than 20px
				  || Math.abs(that.deltaX) > parseInt(that.width) / 4;        // or if slide amt is greater than half the width

			if (isValidSlide) {
				if (that.index === 0) {
					changeTarget = (that.deltaX > 0)? "menu" : "search";
				} else {
					changeTarget = "home";
				}
				that.changeSlide(changeTarget);
				e.stopPropagation();
			} else {
				if (that.index === 0) {
					changeTarget = "home";
				} else {
					changeTarget = (that.index > 0)? "menu" : "search";
				}
				that.changeSlide(changeTarget);
			}
			e.stopPropagation();
		};

		$(this.main).bind("webkitTransitionEnd", function(e) {
			var $body = $("body");
			that.main.style.webkitTransformStyle = "fla2014-12-31t";

			if (that.index === 0) {
				that.hideSlide("both");
				$body.removeClass("finMenuActive");
				$body.removeClass("finSearchActive");

				// $( '.header_menu_navigation' ).removeClass( 'jbFixed' );
				// $( '.header_menu_tree_list' ).removeClass( 'jbFixedSub' );

				// $("body").toggleClass("finMenuActive");
				// $("body").toggleClass("finSearchActive");

				//location.reload();
				// alert("removeClass");
			} else {
				if (that.index > 0) {
					that.hideSlide("search");
					$body.addClass("finMenuActive");
				} else {
					that.hideSlide("menu");
					$body.addClass("finSearchActive");
				}
			}

			that.calculateHeight();
			e.stopPropagation();
		});

		$("#btnFinLeftMenu, #btnFinRightMenu").click(function(e) {

			// if ( $( document ).scrollTop() > jbOffset.top ) {
	    //   // alert("스크롤!");
	      // $( '.header_menu_navigation' ).addClass( 'jbFixed' );
				// $( '.header_menu_tree_list' ).addClass( 'jbFixedSub' );
	    // }
	    // else {
	    //   $( '.header_menu_navigation' ).removeClass( 'jbFixed' );
			// 	$( '.header_menu_tree_list' ).removeClass( 'jbFixedSub' );
	    // }

			if (that.index === 0) {
				if ($(this).attr("id") == "btnFinLeftMenu") {
					that.hideSlide("search");
					that.changeSlide("menu");

				} else {
					that.hideSlide("menu");
					that.changeSlide("search");

					var int_right_wrap_width = ($(".finMenuFamilyWrap").outerWidth());

					$(".finMenuFamilyList").css({ width: int_right_wrap_width });

					$(".finMenuFamilyList li").css({
						width: ((int_right_wrap_width / 2) - 20),
						height: (((((int_right_wrap_width / 2) - 20) / 16) * 9) + 24)
					});

					$(".finMenuFamilyList li a img").css({
						width: ((int_right_wrap_width / 2) - 20),
						height: ((((int_right_wrap_width / 2) - 20) / 16) * 9)
					});
				}
			} else {
				that.changeSlide("home");
				location.reload();
			}
			return false;
		});

		$(window).bind("orientationchange", function(e) {
			window.setTimeout(function() {
				that.rotateChange();
				e.preventDefault();
			}, 300);
		});

	}
};
mainSwipe.init();

// 날개 열렸을 때 메인 콘텐츠 click 처리
$("#finWingMaskLayer").click(function() {
	mainSwipe.changeSlide("home");
	return false;
});

/* swipe */
var $swipeEle = $(".finSwipe");
var initSwipe = function($ele) {
	$ele.each(function() {
		var $this = $(this);
		var swipeRef = null;

		var $paging = $this.parent().find(".pg");
		var swipeStart = 0;

		if ($this.find(".detailSche").length) {
			swipeStart = parseInt($("#dev_mpoint_start").val()) - 1;
			$paging.find(".pgNum b").text(swipeStart + 1);

		} else {
			swipeStart = parseInt($("#fin_swipe_start").val()) - 1;
			$paging.find(".pgNum b").text(swipeStart + 1);

		}

		swipeRef = $this.swipe({
			startIndex : swipeStart,
			transitionEnd : function(i, $target, $item) {
				$paging.find(".pgNum b").text($target.attr("item-num"));
				if ($(document).find(".fin_swipe_circle_pager").length > 0){ // 메인페이지일 경우 동그라미값 변경.
					$(".fin_swipe_circle_pager span").each(function(){
						if ($(this).index() == i){
							$(this).removeClass().addClass("fa").addClass("fa-circle");
						} else {
							$(this).removeClass().addClass("fa").addClass("fa-circle-notch");
						}
					});
				}
			}
		});

		$paging.find("button.btPN").click(function() {
			if (swipeRef) {
				if ($(this).hasClass("btPN_next")) {
					swipeRef.next();
				} else {
					swipeRef.prev();
				}
			}
		});
	});
}
initSwipe($swipeEle);

$(window).unload(function() {}); // disable bfcache
$("body").unload(function() {}); // disable bfcache

window.setTimeout(function() {
	if (navigator.userAgent.indexOf("Android 2.") === -1) { // 2.x 버전 제외하고 추가
		$(".finHeaderWrap").css("-webkit-transform", "translate3d(0, 0, 0)");
	}
}, 500);

window.addEventListener("load", function() {
	window.setTimeout(function() {
		var hasFullLayer = false;
		if ($("#fullLayer").length) {
			hasFullLayer = true;
		}

		var useTargetAnchor = !!window.location.hash.length; // URL에 #link 형식 있으면 true

		if ((!pageYOffset || hasFullLayer) && !useTargetAnchor) {
			if (navigator.userAgent.indexOf("Android") > -1) {
				window.scrollTo(0, 1);
			} else {
				window.scrollTo(0, 0);
			}
		}

		if (hasFullLayer) {
			window.setTimeout(function() {
				$("#fullLayer .devHeightFix").css({
					"padding-bottom" : 0
				})
			}, 700);
		}
	}, 0);
});

$(window).on("orientationchange", function(event){
  location.reload();
});

$(document).ready(function() {
	/* // ipCustomUI 초기화
	$(".ipCustomItem input[type=checkbox], .ipCustomItem input[type=radio]").trigger("change");*/

	//$(".header_menu_tree_list").stop().animate({height: ($(".header_menu_tree_list").children("li").length * 40)}, int_menu_animate_speed);

  var jbOffset = $( '.header_menu_navigation' ).offset();
	var scroll_height = document.body.scrollHeigth;
	scroll_height = scroll_height + "px"

	$("#familyFixed").css("height",scroll_height);
	$("#familyFixed").hide();

	// $("#top").addClass( 'header_wrap_Fixed' );
	// $( '.header_menu_navigation' ).addClass( 'jbFixed' );
	// $( '.header_menu_tree_list' ).addClass( 'jbFixedSub' );

	$( window ).scroll( function() {
		if ( $( document ).scrollTop() > jbOffset.top ) {
			//alert("스크롤!");
			if ($( '.header_menu_navigation' ).hasClass('jbFixed'))
			{
				$( '.header_menu_navigation' ).removeClass( 'jbFixed' );
				$( '.header_menu_tree_list' ).removeClass( 'jbFixedSub' );
			}

			$( '.header_menu_navigation' ).addClass( 'jbFixed' );
			$( '.header_menu_tree_list' ).addClass( 'jbFixedSub' );
			$( '#top' ).addClass('top_fixed');
		} else {
			$( '.header_menu_navigation' ).removeClass( 'jbFixed' );
			$( '.header_menu_tree_list' ).removeClass( 'jbFixedSub' );
			$( '#top' ).removeClass('top_fixed');
		}

		var scrollPX = $(this).scrollTop();
		if( scrollPX  > 140 ) {
				$("#familyFixed").fadeIn();
		}else{
				$("#familyFixed").fadeOut();
		}
  });

  $( ".header_menu_navigation ul li" ).click( function() {
		$(this).css("background-color","#198acc");
  });

	var text = location.href;

	if(text.indexOf("board/board") != -1){
		$("#btnTravelboard").css("background-color","#198acc");
	}
	// else if(text.indexOf("/mypage") != -1){//여행후기 임시 작업
	// 	$("#btnTravelmypage").css("background-color","#198acc");
	// }
	else if(text.indexOf("board/community") != -1){
		$("#btnTravelmypage").css("background-color","#198acc");
	}
	else if(text.indexOf("/consult/") != -1){
		//alert(location.href);
		$("#btnTravelconsult").css("background-color","#198acc");
	}

	// 검색창 커몬~
	$("#btnFinSearch").click(function(){
		if ($("#finSearchWrap").outerHeight() > 0){	// 닫혀라 참깨
			$("#finSearchWrap").stop().animate({height: 0}, 300);
		} else {	// 열려라 참깨
			$("#finSearchWrap").stop().animate({height: 48}, 150);
		}
	});

	// 여행메뉴 초기화 및 높이 구하기
	$(".header_menu_tree_list").attr("h", ($(".header_menu_tree_list").children("li").length * 40)).height(0);
	if ($(".header_menu_tree_list").children("li").children("ul").length > 0){
		$(".header_menu_tree_list").children("li").children("ul").each(function(){
			$(this).parent("li").append('<i class="fal fa-angle-down"></i>');
			$(this).attr("h", ( ($(this).children("li").length + 1) * 40 )).height(0);
		});
	}
	var int_menu_animate_speed = 200; // 애니메이트 속도 설정

	// 여행메뉴 전체 open/close
	$("#btnTravelList").click(function(){

		//alert("메뉴 눌림");

		$("#btnTravelList").css("background-color","#198acc");
		$("#btnTravelboard").css("background-color","#0e68b8");
		$("#btnTravelmypage").css("background-color","#0e68b8");
		$("#btnTravelconsult").css("background-color","#0e68b8");

		if ($(".header_menu_tree_list").height() > 0){	// 메뉴 열려있을 때 닫힘.
			$(".header_menu_tree_list").stop().animate({height: 0}, int_menu_animate_speed);
			$("#callBlueArea").show();
		} else {
			$(".header_menu_tree_list").stop().animate({height: ($(".header_menu_tree_list").children("li").length * 40)}, int_menu_animate_speed);
			$("#callBlueArea").hide();
		}
	});

	// 여행세부메뉴 open/close
	$(".header_menu_tree_list").children("li").click(function(){
		if ($(this).children("ul").length > 0){	// 하부 메뉴가 있을 때 액션.

			$(this).children("a").attr("href","#finmenu").attr("onclick","return false;");	// 하부 메뉴가 있을 때는 링크값 없앰.

			if ($(this).children("ul").outerHeight() > 0){	// 닫혀라 얄리얄리얄라셩 얄라리얄라
				var int_resize_li_h = $(this).index() == ($(".header_menu_tree_list").children("li").length - 1) ? 38 : 39;

				$(this).children("a").removeClass();
				$(this).children("i").removeClass('fa-angle-up').addClass("fa-angle-down");

				$(".header_menu_tree_list").stop().animate({ height: parseInt($(".header_menu_tree_list").outerHeight()) - parseInt($(this).children("ul").children("li").length * 40) }, int_menu_animate_speed);
				$(this).stop().animate({height: int_resize_li_h}, int_menu_animate_speed);
				$(this).children("ul").stop().animate({height: 0}, int_menu_animate_speed);
			} else {	// 열려라 참깨
				var int_resize_li_minus_h = $(this).index() == ($(".header_menu_tree_list").children("li").length - 1) ? 2 : 1;

				$(this).children("a").addClass('on');
				$(this).children("i").removeClass('fa-angle-down').addClass("fa-angle-up");

				$(".header_menu_tree_list").stop().animate({ height: (parseInt($(".header_menu_tree_list").outerHeight()) + parseInt($(this).children("ul").children("li").length * 40)) }, int_menu_animate_speed);
				$(this).stop().animate({ height: parseInt(($(this).children("ul").children("li").length + 1) * 40) - parseInt(int_resize_li_minus_h) }, int_menu_animate_speed);
				$(this).children("ul").stop().animate({ height: (($(this).children("ul").children("li").length) * 40) }, int_menu_animate_speed);
			}
		}
	});
});

/* check pattern */
function chkPatten(str,patten){
	var regNum			= /^[0-9]+$/;
	var regEmail		= /^[^"'@]+@[._a-zA-Z0-9-]+\.[a-zA-Z]+$/;
	var regUrl			= /^(http\:\/\/)*[.a-zA-Z0-9-]+\.[a-zA-Z]+$/;
	var regAlpha		= /^[a-zA-Z]+$/;
	var regHangul		= /[가-힣]/;
	var regHangulEng	= /[가-힣a-zA-Z]/;
	var regHangulOnly	= /^[가-힣]*$/;
	var regId			= /^[a-zA-Z0-9]{1}[^"']{5,21}$/;
	var regPass			= /^[a-zA-Z0-9!@#$%^&*()_-]{8,16}$/;
	var regPNum			= /^[0-9]*(,[0-9]+)*$/;
	var regDate			= /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;
	var regTime			= /^[0-9]{2}:[0-9]{2}$/;

	patten = eval(patten);
	if (!patten.test(str)){return false;}
	return true;
}

// 상품 검색
function frmTravelGoodsSearchVerify(fr){
	if (!$("input[name=tgs]").val()){alert('상품명을 입력해 주세요.');$("input[name=tgs]").focus();return false;}
}

// 베스트셀러 클릭시
$(".best_seller_list").children("li").click(function(){
	location.href = $(this).attr("link");
});

// 상품목록 클릭시
$(".travel_list_list").click(function(){
	location.href = $(this).attr("link");
});

function call_ajax_loader($loader){
	obj_loader = $('<div id="loader_wrap"><div id="loader_img"><img src="/common/css/fancybox/fancybox_loading.gif"/></div><div id="loader_over"></div></div>');

	$loader.append($(obj_loader));

	if($loader.is("body")){
		position = 'fixed';
	} else {
		if($.browser.msie && parseInt($.browser.version) <= 6){
			position = 'fixed';
		} else {
			position = 'absolute';
		};
		posY = (($loader.outerHeight() / 2) + $loader.scrollTop() - ($loader.find('#loader_img img').outerHeight() / 2));
		posX = (($loader.outerWidth() / 2) - ($loader.find('#loader_img img').outerWidth() / 2));
	};
	$(obj_loader).find('#loader_img').css({
		"position": position,
		"top": posY,
		"left": posX,
		"zIndex": 9999,
		"padding": 0
	});
	$(obj_loader).find('#loader_over').css({
		'position': 'absolute',
		'zIndex': 9998,
		'top': $loader.scrollTop(),
		'left': '0px',
		'width': '100%',
		'height': $loader.outerHeight(),
		'background': '#000',
		'opacity': 0.5
	});

	if($.browser.msie){
		$("iframe").each(function(){
			var ifrmObj = $(this)[0].contentWindow || $(this)[0].contentDocument;
		});
	};
}

// AddDate
function addDate(pInterval, pAddVal, pYyyymmdd, pDelimiter){
	var yyyy;
	var mm;
	var dd;
	var cDate;
	var oDate;
	var cYear, cMonth, cDay;

	if (pDelimiter != "") {pYyyymmdd = pYyyymmdd.replace(eval("/\\" + pDelimiter + "/g"), "");}

	yyyy = pYyyymmdd.substr(0, 4);
	mm  = pYyyymmdd.substr(4, 2);
	dd  = pYyyymmdd.substr(6, 2);

	if (pInterval == "yyyy") {
	yyyy = (yyyy * 1) + (pAddVal * 1);
	} else if (pInterval == "m") {
	mm  = (mm * 1) + (pAddVal * 1);
	} else if (pInterval == "d") {
	dd  = (dd * 1) + (pAddVal * 1);
	}

	cDate = new Date(yyyy, mm - 1, dd) // 12월, 31일을 초과하는 입력값에 대해 자동으로 계산된 날짜가 만들어짐.
	cYear = cDate.getFullYear();
	cMonth = cDate.getMonth() + 1;
	cDay = cDate.getDate();

	cMonth = cMonth < 10 ? "0" + cMonth : cMonth;
	cDay = cDay < 10 ? "0" + cDay : cDay;

	if (pDelimiter != "") {return cYear + pDelimiter + cMonth + pDelimiter + cDay;} else {return cYear + cMonth + cDay;}
}

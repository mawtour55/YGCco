/*
	- Based on Swipe 2.0 by Brad Birdsall
	- http://swipejs.com/
*/

$(document).ready(function() {

  var jbOffset = $( '.header_menu_navigation' ).offset();
	var scroll_height = document.body.scrollHeigth;
	scroll_height = scroll_height + "px"

	$("#familyFixed").css("height",scroll_height);
	$("#familyFixed").hide();

	$( window ).scroll( function() {
		if ( $( document ).scrollTop() > jbOffset.top ) {
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
		$(this).css("background-color","#0186e4");
  });

	var text = location.href;

	if(text.indexOf("board/board") != -1){
		$("#btnTravelboard").css("background-color","##0186e4");
	}
	else if(text.indexOf("board/community") != -1){
		$("#btnTravelmypage").css("background-color","#0186e4");
	}
	else if(text.indexOf("/consult/") != -1){
		//alert(location.href);
		$("#btnTravelconsult").css("background-color","#0186e4");
	}


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

			if ($(this).children("ul").outerHeight() > 0){	// 닫힘
				var int_resize_li_h = $(this).index() == ($(".header_menu_tree_list").children("li").length - 1) ? 38 : 39;

				$(this).children("a").removeClass();
				$(this).children("i").removeClass('fa-angle-up').addClass("fa-angle-down");

				$(".header_menu_tree_list").stop().animate({ height: parseInt($(".header_menu_tree_list").outerHeight()) - parseInt($(this).children("ul").children("li").length * 40) }, int_menu_animate_speed);
				$(this).stop().animate({height: int_resize_li_h}, int_menu_animate_speed);
				$(this).children("ul").stop().animate({height: 0}, int_menu_animate_speed);
			} else { // 열림
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

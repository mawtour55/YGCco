/*
 * Swipe 플러그인
 * Based on Swipe 2.0 by Brad Birdsall
 * http://http://swipejs.com/
*/
$.event.props.push("touches");
$.fn.swipe = function(rtOptions) {
	// support mutltiple elements
	if (this.length > 1) {
		this.each(function() {
			$(this).swipe(rtOptions);
		});
		return this;
	}

	// setup options
	var defaultOptions = {
		startIndex : 0,
		speed : 300,
		callback : function() {},
		transitionEnd : function() {},
		setupEnd : function() {},
		loop : true
	};

	var options = $.extend({}, defaultOptions, rtOptions);

	// SETUP private variabls;
	var $ele = this,
		index = options.startIndex,
		$list = this.find(".swipe-wrap"),
		$item = null,
		count = 0,
		deltaX = 0,
		slides = [],
		width = 0,
		eventData = {},
		isTransition = false,
		isScroll = undefined;

	// SETUP private functions;
	var intialize = function() {
		return $ele;
	};

	var getNextIndex = function() {
		if (index === count -1) {
			return 0;
		} else {
			return index + 1;
		}
 	};

	var getPrevIndex = function() {
		if (index === 0) {
			return count - 1;
		} else {
			return index - 1;
		}
	}

	var preSetup = function() {
		$item = $list.children();
		$item.each(function(index) {
			$(this).attr("item-num", index + 1);
		});

		count = $item.length;

		if (count === 2) {
			$list.append($item.clone());

			$item = $list.children();
			count = $item.length;
		}

		$item.each(function(index) {
			$(this).attr("item-index", index);
		});
	};

	var setup = function() {
		width = $(window).width();
		$item.css({
			"-webkit-transform" : "none",
			"-webkit-transition-duration" : "0",
			"left" : "-9999px",
		});

		slides = [
			$item.eq(index).show(),
			$item.eq(getNextIndex()).show(),
			$item.eq(getPrevIndex()).show()
		];

		slides[0].css("left", "0");

		if (count > 2) {
			slides[1].css("left", "" + width + "px");
			slides[2].css("left", "-" + width + "px");
		}
	};

	var move = function(deltaX, hasDelay, isBack) {
		if (count < 2) {
			return;
		}

		var target = [];
		var x = deltaX;

		if (isBack) {
			x = 0;
		}

		if (deltaX > 0) { // to right
			target.push(slides[0]);
			target.push(slides[2]);
		} else {
			target.push(slides[0]);
			target.push(slides[1]);
		}

		for (var i = 0; i < target.length; i++) {
			if (hasDelay) {
				target[i].css("-webkit-transition-duration", "200ms");
				isTransition = true;
			} else {
				target[i].css("-webkit-transition-duration", "0");
			}
			target[i].css("-webkit-transform", "translate3d(" + x + "px, 0, 0)");
		}
	};

	// PUBLIC functions
	this.getOptions = function() {
		return options;
	};

	this.getIndex = function() {
		return index;
	};

	this.slide = function(index, duration) {
		index = index;
		move(width * index, duration);
	};

	this.next = function(forceMove) {
		if (!forceMove && isTransition) {
			return;
		}
		move(-width, true);
		index = getNextIndex();
	};

	this.prev = function(forceMove) {
		if (!forceMove && isTransition) {
			return;
		}
		move(width, true);
		index = getPrevIndex();
	};

	preSetup();
	setup();
	options.setupEnd();

	// event binding
	$ele.click(function() {
		//
	});

	$ele.on("touchstart", function(e) {
		if (isTransition) {
			return false;
		}

		isScroll = undefined;
		deltaX = 0;

		eventData = {
			x : e.touches[0].pageX,
			y : e.touches[0].pageY,
			time : Number(new Date())
		};

		e.stopPropagation();
	});

	$ele.on("touchmove", function(e) {
		if (isTransition) {
			return false;
		}
		// ensure swiping with one touch and not pinching
		if (e.touches.length > 1 || e.scale && e.scale !== 1) {
			e.stopPropagation();
			return;
		}

		deltaX = e.touches[0].pageX - eventData.x;

		// determine if scrolling test has run - one time test
		if (typeof isScroll == "undefined") {
			isScroll = !!(isScroll || Math.abs(deltaX) < Math.abs(e.touches[0].pageY - eventData.y));
		}

		if (!isScroll) {
			e.preventDefault();
			move(deltaX, false);
		}

		e.stopPropagation();
	});

	$ele.on("touchend", function(e) {
		// determine if slide attempt triggers next/prev slide
		var isValidSlide =
			Number(new Date()) - eventData.time < 250      // if slide duration is less than 250ms
			&& Math.abs(deltaX) > 10                   // and if slide amt is greater than 20px
			|| Math.abs(deltaX) > width / 4;        // or if slide amt is greater than half the width

		// determine if slide attempt is past start and end
		/*
		var isPastBounds = !options.loop &&
			index && deltaX > 0                          // if first slide and slide amt is greater than 0
			|| index == count - 1 && deltaX < 0;    // or if last slide and slide amt is less than 0
		*/

		var direction = deltaX < 0;

		// if not scrolling vertically
		if (!isScroll) {
			if (isValidSlide) {
				if (direction) { // next
					$ele.next();
				} else {
					$ele.prev();
				}
			} else {
				move(deltaX, true, true);
			}
		}
		e.stopPropagation();
	});


	$ele.on("webkitTransitionEnd", function(e) {
		if (index === parseInt($(e.target).attr("item-index"))) {
			isTransition = false;
			setup();

			window.setTimeout(function() {
				options.transitionEnd(index, $(e.target), $item);
			}, 50);
		}
		e.stopPropagation();
	});

	$(window).on("resize", function(e) {
		setup();
		e.stopPropagation();
	});

	return intialize();
};

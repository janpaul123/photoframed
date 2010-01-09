var PhotoFrame = new function () {
	var hours                 = 0;
	var minutes               = 0;
	var displayTimer          = null;
	var clockTimer            = null;
	var displayInterval       = 5000;
	var overlay               = true;
	
	this.updateDisplay = function () {
		if (PhotoFrame.displayTimer!=null) {
			clearTimeout(PhotoFrame.displayTimer);
			PhotoFrame.displayTimer = null;
		}
		PhotoFrame.updatePictures();
		PhotoFrame.displayTimer = setTimeout(function() { PhotoFrame.updatePictures() }, PhotoFrame.displayInterval);
	}
	
	this.updatePictures = function() {
		var $oldBackground = $('#background img');
		var $newBackground = $(new Image());
		
		$newBackground.load(function () {
			$(this).hide();
			$(this).click(PhotoFrame.clickEvent);
			$('#background').append($newBackground);
			$(this).fadeIn('medium', function() {
				$oldBackground.remove();
				if (PhotoFrame.overlay) PhotoFrame.updateText();
			});
		});
		
		var path = 'random_picture.php?width='  + $(window).width() + '&height=' 
			+ $(window).height() + '&rand=' + Math.random();
		
		$newBackground.attr('src', path);
		$('#filemap').attr('src', 'http://www.traphic.nl/generated/verkeersinformatie.png?' + Math.random());
	}
	
	this.updateText = function () {
		var $oldQuote = $('#quotes > .block');
		var $newQuote = $('<div></div>');
		
		$newQuote.addClass('holder');
		$newQuote.addClass('block');
		$newQuote.load('quote.php', null, function() {
			$newQuote.css('top', '120px');
			$('#quotes').append($newQuote);
			setTimeout(function() {
				$newQuote.animate({
					top: "0px"
				}, "medium");
				setTimeout(function() {
					$oldQuote.fadeOut("fast", function() {
						$(this).remove();
					});
				}, 150);
			}, 200);
		});
	}
	
	this.updateTime = function () {
		var date = new Date();
		
		if (PhotoFrame.clockTimer!=null) {
			clearTimeout(PhotoFrame.clockTimer);
			PhotoFrame.clockTimer = null;
		}
		PhotoFrame.clockTimer = setTimeout(function() { PhotoFrame.updateTime() }, 5000);
		
		if (date.getMinutes() != PhotoFrame.minutes) {
			PhotoFrame.updateMinutes();
		}
	}
	
	this.updateMinutes = function () {
		var date = new Date();
		PhotoFrame.minutes = date.getMinutes();
		
		var $oldMinutes = $('#minutes > .number');
		var $newMintues = $('<div></div>');
		var strMinutes = '' + PhotoFrame.minutes;
		if(strMinutes.length < 2) strMinutes = '0' + strMinutes;
		
		$newMintues.addClass('number');
		$newMintues.text(strMinutes);
		$newMintues.css('top', '120px');
		$('#minutes').append($newMintues);
		$newMintues.animate({
			top: "0px"
		}, "medium", null, function() {
			if (date.getHours() != PhotoFrame.hours) {
				PhotoFrame.updateHours();
			}
		});
		$oldMinutes.fadeOut("medium", function() {
			$(this).remove();
		});
	}
	
	this.updateHours = function () {
		var date = new Date();
		PhotoFrame.hours = date.getHours();
		
		var $oldHours = $('#hours > .number');
		var $newHours = $('<div></div>');
		
		$newHours.addClass('number');
		$newHours.text(''+PhotoFrame.hours);
		$newHours.css('top', '120px');
		$('#hours').append($newHours);
		$newHours.animate({
			top: "0px"
		}, "medium");
		$oldHours.fadeOut("medium", function() {
			$(this).remove();
		});
	}
	
	
	this.init = function () {
		$('body, img, div').click(PhotoFrame.clickEvent);
		$(window).resize(function (){
			clearTimeout(PhotoFrame.displayTimer);
			PhotoFrame.displayTimer = setTimeout(function() { PhotoFrame.updatePictures() }, 500);
		});
	}
	
	this.clickEvent = function(event){ 
		PhotoFrame.updateDisplay(); 
		event.stopPropagation()
		return 0;
	}
	
	this.start = function () {
		PhotoFrame.updateDisplay();
		if (PhotoFrame.overlay) PhotoFrame.updateTime();
	}
	
	this.setDisplayInterval = function (value) {
		PhotoFrame.displayInterval = value;
	}
	
	this.setEnableFX = function (value) {
		jQuery.fx.off = !value;
	}
	
	this.setEnableOverlay = function (value) {
		PhotoFrame.overlay = value;
	}
};
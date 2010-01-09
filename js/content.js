var hours          = 0;
var minutes        = 0;
var displayTimer   = null;
var clockTimer     = null;

function UpdateText() {
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
		$oldQuote.fadeOut("medium", function() {
			$(this).remove();
		});
		}, 300);
	});
}

function UpdateTime() {
	var date = new Date();
	
	if(clockTimer!=null) {
		clearTimeout(clockTimer);
		clockTimer = null;
	}
	clockTimer = setTimeout("UpdateTime()", 5000);
	
	if (date.getMinutes() != minutes) {
		minutes = date.getMinutes();
		var $oldMinutes = $('#minutes > .number');
		var $newMintues = $('<div></div>');
		var strMinutes = ''+minutes;
		if(strMinutes.length < 2) strMinutes = '0' + strMinutes;
		
		$newMintues.addClass('number');
		$newMintues.text(strMinutes);
		$newMintues.css('top', '120px');
		$('#minutes').append($newMintues);
		$newMintues.animate({
			top: "0px"
		}, "medium", null, function() {
			if (date.getHours() != hours) {
				hours = date.getHours();
				var $oldHours = $('#hours > .number');
				var $newHours = $('<div></div>');
				
				$newHours.addClass('number');
				$newHours.text(''+hours);
				$newHours.css('top', '120px');
				$('#hours').append($newHours);
				$newHours.animate({
					top: "0px"
				}, "medium");
				$oldHours.fadeOut("medium", function() {
					$(this).remove();
				});
			}
		});
		$oldMinutes.fadeOut("medium", function() {
			$(this).remove();
		});
	}
}

function UpdatePictures() {
	var $oldBackground = $('#background img');
	var $newBackground = $(new Image());
	
	$newBackground.load(function () {
		$(this).hide();
		$('#background').append($newBackground);
		$(this).fadeIn('medium', function() {
			$oldBackground.remove();
		});
	});
	
	var path = 'random_picture.php?width='  + $(window).width() + '&height=' 
		+ $(window).height() + '&rand=' + Math.random();
	
	$newBackground.attr('src', path);
	$('#filemap').attr('src', 'http://www.traphic.nl/generated/verkeersinformatie.png?' + Math.random());
}

function DisplayStart() {
  DisplayUpdate();
  UpdateTime();
}

function DisplayUpdate() {
  if(displayTimer!=null) {
    clearTimeout(displayTimer);
    displayTimer = null;
  }
  
  UpdatePictures();
  UpdateText();
  displayTimer = setTimeout("DisplayUpdate()", DisplayInterval);
}

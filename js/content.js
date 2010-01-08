var _Timer=null;

function UpdateText() {
	$('#quotes').load("quote.php");
}

function UpdateTime() {
  var date = new Date();
  document.getElementById('hours').innerHTML = (date.getHours());
  var minutes = ""+date.getMinutes();
  if(minutes.length<2) { minutes = "0"+minutes;}
  document.getElementById('minutes').innerHTML = (minutes);
}

function UpdatePictures() {
	var oldBackground = $('#background img');
	var newBackground = new Image();
	
	$(newBackground).load(function () {
		$(this).hide();
		$('#background').append(newBackground);
		$(this).fadeIn('medium', function() {
			$(oldBackground).remove();
		});
	});
	
	var path = 'random_picture.php?width='  + $(window).width() + '&height=' 
		+ $(window).height() + '&rand=' + Math.random();
	
	$(newBackground).attr('src', path);
	$('#filemap').attr('src', 'http://www.traphic.nl/generated/verkeersinformatie.png?' + Math.random());
}

function DisplayStart() {
  DisplayUpdate();
}

function DisplayUpdate() {
  if(_Timer!=null) {
    window.clearTimeout(_Timer);
    _Timer = null;
  }
  UpdateTime();
  UpdatePictures();
  UpdateText();
  _Timer = window.setTimeout("DisplayUpdate()", DisplayInterval);
}

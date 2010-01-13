/*
 * Photoframed, custom photoframe software
 * Copyright (C) 2009-2010
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *  
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *  
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var PhotoFrame = new function () {
	var hours                 = 0;
	var minutes               = 0;
	var displayTimer          = null;
	var clockTimer            = null;
	var trafficTimer          = null;
	var displayInterval       = 5000;
	var bar                   = true;
	var trafficShown          = false;
	var trafficMap            = 'user/maps/nederland.png';
	var trafficOverlay        = 'http://www.traphic.nl/generated/verkeersinformatie.png';
	var webcams               = null;
	var webcamsTimer          = null;
	var webcamsInterval       = 5000;
	var webcamsShown          = false;
	var aboutShown            = false;
	var helpShown             = false;
	var connectionTimer       = null;
	var connectionURL         = 'http://www.nu.nl/images/logo_nu_nl.gif';
	
	this.makeDynamicUrl = function (url) {
		return url + (url.indexOf('?') > -1 ? '&' : '?') + (new Date().getTime() + Math.random());
	}
	
	this.updateDisplay = function () {
		if (PhotoFrame.displayTimer!=null) {
			clearTimeout(PhotoFrame.displayTimer);
			PhotoFrame.displayTimer = null;
		}
		PhotoFrame.displayTimer = setTimeout(function() { PhotoFrame.updateDisplay() }, PhotoFrame.displayInterval);
		PhotoFrame.updateBackground();
	}
	
	this.updateBackground = function() {
		var $oldBackground = $('#background img');
		var $newBackground = $(new Image());
		
		$newBackground.load(function () {
			$(this).hide();
			$(this).click(PhotoFrame.clickEvent);
			$('#background').append($newBackground);
			$(this).fadeIn('medium', function() {
				$oldBackground.remove();
				if (PhotoFrame.bar) PhotoFrame.updateText();
			});
		});
		
		var path = PhotoFrame.makeDynamicUrl('random_picture.php?width='  + $(window).width() + '&height=' 
			+ $(window).height());
		
		$newBackground.attr('src', path);
	}
	
	this.updateTraffic = function() {
		if (PhotoFrame.trafficTimer!=null) {
			clearTimeout(PhotoFrame.trafficTimer);
			PhotoFrame.trafficTimer = null;
		}
		PhotoFrame.trafficTimer = setTimeout(function() { PhotoFrame.updateTraffic() }, 60000);
		
		if (PhotoFrame.trafficMap.indexOf('http') > -1) {
			var $oldMap = $('#traffic img.map');
			var $newMap = $(new Image());
			
			$newMap.load(function () {
				$(this).hide();
				$(this).addClass('map');
				$('#traffic').append($newMap);
				
				if (PhotoFrame.trafficShown) $(this).show();
				
				$oldMap.remove();
			});
			
			$newMap.attr('src', PhotoFrame.makeDynamicUrl(PhotoFrame.trafficMap)); 
		}
		
		if (PhotoFrame.trafficOverlay.indexOf('http') > -1) {
			var $oldOverlay = $('#traffic img.overlay');
			var $newOverlay = $(new Image());
			
			$newOverlay.load(function () {
				$(this).hide();
				$(this).addClass('overlay');
				$('#traffic').append($newOverlay);
				
				if (PhotoFrame.trafficShown) $(this).show();
				
				$oldOverlay.remove();
			});
			
			$newOverlay.attr('src', PhotoFrame.makeDynamicUrl(PhotoFrame.trafficOverlay)); 
		}
	}
	
	this.updateText = function () {
		var $oldQuote = $('#quotes > .block');
		var $newQuote = $('<div></div>');
		
		$newQuote.addClass('holder');
		$newQuote.addClass('block');
		$newQuote.load('quote.php', {timestamp: (new Date().getTime() + Math.random())}, function() {
			$newQuote.css('top', '120px');
			$('#quotes').append($newQuote);
			setTimeout(function() {
				$newQuote.animate({
					top: "0px"
				}, "medium");
				
				if (jQuery.fx.off) {
					$oldQuote.remove();
				}
				else {
					setTimeout(function() {
						$oldQuote.fadeOut("fast", function() {
							$(this).remove();
						});
					}, 150);
				}
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
	
	this.toggleTraffic = function () {
		if (PhotoFrame.trafficShown) {
			PhotoFrame.hideTraffic();
		}
		else {
			PhotoFrame.showTraffic();
		}
	}
	
	this.showTraffic = function () {
		if (!PhotoFrame.trafficShown) $('#traffic, #traffic img').fadeIn('medium');
		PhotoFrame.trafficShown = true;
	}
	
	this.hideTraffic = function () {
		if (PhotoFrame.trafficShown) $('#traffic, #traffic img').fadeOut('medium');
		PhotoFrame.trafficShown = false;
	}
	
	this.toggleAbout = function () {
		if (PhotoFrame.aboutShown) {
			PhotoFrame.hideAbout();
		}
		else {
			PhotoFrame.showAbout();
		}
	}
	
	this.showAbout = function () {
		if (!PhotoFrame.aboutShown) $('#about').fadeIn('slow');
		PhotoFrame.aboutShown = true;
	}
	
	this.hideAbout = function () {
		if (PhotoFrame.aboutShown)  $('#about').fadeOut('slow');
		PhotoFrame.aboutShown = false;
	}
	
	this.toggleHelp = function () {
		if (PhotoFrame.helpShown) {
			PhotoFrame.hideHelp();
		}
		else {
			PhotoFrame.showHelp();
		}
	}
	
	this.showHelp = function () {
		if (!PhotoFrame.helpShown) $('#help').fadeIn('medium');
		PhotoFrame.helpShown = true;
	}
	
	this.hideHelp = function () {
		if (PhotoFrame.helpShown)  $('#help').fadeOut('medium');
		PhotoFrame.helpShown = false;
	}
	
	this.updateWebcam = function(id) {
		if (!PhotoFrame.webcams[id].loading) {
			PhotoFrame.webcams[id].loading = true;
			
			var url = PhotoFrame.makeDynamicUrl(PhotoFrame.webcams[id].url);
			var $newCam = $(new Image());
			var style = $('#' + id + ' img').attr('style');
			
			$newCam.attr('style', style);
			$newCam.css('opacity', 1);
			$newCam.load(function () {
				PhotoFrame.webcams[id].loading = false;
				$('#' + id + ' img').remove();
				$('#' + id).show();
				$('#' + id).append($(this));
				$('#error-'  + id).fadeOut('medium');
				$('#shadow-' + id).fadeOut('medium');
			});
			$newCam.error(function () {
				PhotoFrame.webcams[id].loading = false;
				$('#error-'  + id).fadeIn('medium');
				$('#shadow-' + id).fadeIn('medium');
			});
			
			$newCam.attr('src', url);
		}
	}
	
	this.updateWebcams = function() {
		if (PhotoFrame.webcamsTimer!=null) {
			clearTimeout(PhotoFrame.webcamsTimer);
			PhotoFrame.webcamsTimer = null;
		}
		
		if (PhotoFrame.webcamsShown) {
			PhotoFrame.webcamsTimer = setTimeout(function() { PhotoFrame.updateWebcams() }, PhotoFrame.webcamsInterval);
		}
		else {
			PhotoFrame.webcamsTimer = setTimeout(function() { PhotoFrame.updateWebcams() }, 60000);
		}
		
		// update even if they are not shown, only not as often
		for (var id in PhotoFrame.webcams) {
			PhotoFrame.updateWebcam(id);
		}
	}
	
	this.flushWebcams = function() {
		if (PhotoFrame.webcamsFlushTimer!=null) {
			clearTimeout(PhotoFrame.webcamsFlushTimer);
			PhotoFrame.webcamsFlushTimer = null;
		}
		PhotoFrame.webcamsFlushTimer = setTimeout(function() { PhotoFrame.flushWebcams() }, 59000);
		
		for (var id in PhotoFrame.webcams) {
			PhotoFrame.webcams[id].loading = false;
		}
	}
	
	this.toggleWebcams = function () {
		if (PhotoFrame.webcamsShown) {
			PhotoFrame.hideWebcams();
		}
		else {
			PhotoFrame.showWebcams();
		}
	}
	
	this.showWebcams = function () {
		if (!PhotoFrame.webcamsShown) $('#webcams, #webcams div').fadeIn('medium');
		PhotoFrame.webcamsShown = true; // the order here is important!
		PhotoFrame.updateWebcams();
	}
	
	this.hideWebcams = function () {
		if (PhotoFrame.webcamsShown) {
			$('#webcams, #webcams div').fadeOut('medium', function() {
				$('#webcams .shadow').fadeIn('medium');
			});
		}
		PhotoFrame.webcamsShown = false;
	}
	
	this.checkConnection = function () {
		if (PhotoFrame.connectionTimer!=null) {
			clearTimeout(PhotoFrame.connectionTimer);
			PhotoFrame.connectionTimer = null;
		}
		
		var $img = $(new Image());
		
		$img.load(function () {
			$('#connectionerror').fadeOut('medium');
			$(this).remove();
		});
		
		$img.error(function () {
			$('#connectionerror').fadeIn('medium');
		});
		
		$img.attr('src', PhotoFrame.makeDynamicUrl(PhotoFrame.connectionURL));
		
		PhotoFrame.connectionTimer = setTimeout(PhotoFrame.checkConnection, 13000);
	}
	
	this.init = function () {
		$('#clock').click(PhotoFrame.clickEvent);
		
		$(window).resize(function (){
			clearTimeout(PhotoFrame.displayTimer);
			PhotoFrame.displayTimer = setTimeout(function() { PhotoFrame.updateDisplay() }, 500);
		});
		
		PhotoFrame.webcams      = new Array();
		PhotoFrame.trafficShown = false;
		PhotoFrame.webcamsShown = false;
		PhotoFrame.aboutShown   = false;
		PhotoFrame.helpShown    = false;
	}
	
	this.clickEvent = function(event){ 
		PhotoFrame.updateDisplay(); 
		event.stopPropagation()
		return 0;
	}
	
	this.start = function () {
		PhotoFrame.updateDisplay();
		if (PhotoFrame.bar) PhotoFrame.updateTime();
		PhotoFrame.updateTraffic();
		
		PhotoFrame.flushWebcams();
		PhotoFrame.updateWebcams();
		
		setTimeout(function() {
			PhotoFrame.hideAbout();
		}, 4000);
	}
	
	this.setDisplayInterval = function (value) {
		PhotoFrame.displayInterval = value;
	}
	
	this.setEnableFX = function (value) {
		jQuery.fx.off = !value;
	}
	
	this.setEnableBar = function (value) {
		PhotoFrame.bar = value;
	}
	
	this.setTrafficMap = function (value) {
		PhotoFrame.trafficMap = value;
	}
	
	this.setTrafficOverlay = function (value) {
		PhotoFrame.trafficOverlay = value;
	}
	
	this.addWebcam = function (id, url) {
		PhotoFrame.webcams[id] = {url: url, loading: false};
	}
	
	this.setWebcamsInterval = function (value) {
		PhotoFrame.webcamsInterval = value;
	}
	
	this.setConnectionURL = function (value) {
		PhotoFrame.connectionURL = value;
	}
};
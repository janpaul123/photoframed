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
	var weatherTimer          = null;
	var displayInterval       = 5000;
	var fileCount             = 0;
	var lastFile              = -1;
	var bar                   = true;
	var trafficShown          = false;
	var trafficMap            = 'user/maps/nederland.png';
	var trafficOverlay        = 'http://www.traphic.nl/generated/verkeersinformatie.png';
	var weatherShown          = false;
	var weatherMap            = '';
	var weatherOverlay        = '';
	var webcams               = null;
	var webcamsTimer          = null;
	var webcamsInterval       = 5000;
	var webcamsShown          = false;
	var aboutShown            = false;
	var helpShown             = false;
	var connectionTimer       = null;
	var connectionURL         = 'http://www.nu.nl/images/logo_nu_nl.gif';
	
	this.makeDynamicUrl = function (url) {
		// make a url like http://lala/ to http://lala/?7398723
		// or an url like http://lala/?id=50 to http://lala?id=50&7398723
		return url + (url.indexOf('?') > -1 ? '&' : '?') + (new Date().getTime() + Math.random());
	}
	
	this.updateDisplay = function () {
		// clear old timers
		if (PhotoFrame.displayTimer!=null) {
			clearTimeout(PhotoFrame.displayTimer);
			PhotoFrame.displayTimer = null;
		}
		
		// set a new timer
		PhotoFrame.displayTimer = setTimeout(function() { PhotoFrame.updateDisplay() }, PhotoFrame.displayInterval);
		
		// update background
		PhotoFrame.updateBackground();
	}
	
	this.updateBackground = function() {
		// find the current background
		var $oldBackground = $('#background img');
		
		// create a new background
		var $newBackground = $(new Image());
		
		// have the old background removed and the new one added once loaded
		$newBackground.load(function () {
			$newBackground.hide();
			$newBackground.click(PhotoFrame.clickEvent);
			$('#background').append($newBackground);
			$newBackground.fadeIn('medium', function() {
				if (PhotoFrame.bar) PhotoFrame.updateText();
				
				// clean up
				$oldBackground.remove();
				$oldBackground = undefined;
				$newBackground = undefined;
			});
		});
		
		// load the new background from a dynamic url 
		var path = 'random_picture.php?width='  + $(window).width() + '&height=' + $(window).height();
		if (PhotoFrame.fileCount > 0) {
			var newFile = -1;
			do {
				newFile = Math.floor(Math.random() * PhotoFrame.fileCount);
			} while(newFile == PhotoFrame.lastFile && PhotoFrame.fileCount > 1);
			
			PhotoFrame.lastFile = newFile
			path += '&nr=' + newFile;
		}
		else {
			path = PhotoFrame.makeDynamicUrl(path);
		}
		
		$newBackground.attr('src', path);
		
		// clean up
		path = undefined;
	}
	
	this.updateTraffic = function() {
		// clear old timers
		if (PhotoFrame.trafficTimer!=null) {
			clearTimeout(PhotoFrame.trafficTimer);
			PhotoFrame.trafficTimer = null;
		}
		
		// set a new timer
		PhotoFrame.trafficTimer = setTimeout(function() { PhotoFrame.updateTraffic() }, 60000);
		
		// only reload when its an external url
		if (PhotoFrame.trafficMap.indexOf('http') > -1) {
			// find the current map
			var $oldMap = $('#traffic img.map');
			
			// create a new image
			var $newMap = $(new Image());
			
			// remove the old image and add the new image once loaded
			$newMap.load(function () {
				$newMap.hide();
				$newMap.addClass('map');
				$('#traffic').append($newMap);
				
				if (PhotoFrame.trafficShown) $newMap.show();
				
				// clean up
				$oldMap.remove();
				$oldMap = undefined;
				$newMap = undefined;
			});
			
			// load the new image from a dynamic url
			$newMap.attr('src', PhotoFrame.makeDynamicUrl(PhotoFrame.trafficMap)); 
		}
		
		// only reload when its an external url
		if (PhotoFrame.trafficOverlay.indexOf('http') > -1) {
			// find the current overlay
			var $oldOverlay = $('#traffic img.overlay');
			
			// create a new image
			var $newOverlay = $(new Image());
			
			// remove the old image and add the new image once loaded
			$newOverlay.load(function () {
				$newOverlay.hide();
				$newOverlay.addClass('overlay');
				$('#traffic').append($newOverlay);
				
				if (PhotoFrame.trafficShown) $newOverlay.show();
				
				// clean up
				$oldOverlay.remove();
				$oldOverlay = undefined;
				$newOverlay = undefined;
			});
			
			$newOverlay.attr('src', PhotoFrame.makeDynamicUrl(PhotoFrame.trafficOverlay)); 
		}
	}
	
	this.updateWeather = function() {
		// clear old timers
		if (PhotoFrame.weatherTimer!=null) {
			clearTimeout(PhotoFrame.weatherTimer);
			PhotoFrame.weatherTimer = null;
		}
		
		// set a new timer
		PhotoFrame.weatherTimer = setTimeout(function() { PhotoFrame.updateWeather() }, 60000);
		
		// only reload when its an external url
		if (PhotoFrame.weatherMap.indexOf('http') > -1) {
			// find the current map
			var $oldMap = $('#weather img.map');
			
			// create a new image
			var $newMap = $(new Image());
			
			// remove the old image and add the new image once loaded
			$newMap.load(function () {
				$newMap.hide();
				$newMap.addClass('map');
				$('#weather').append($newMap);
				
				if (PhotoFrame.weatherShown) $newMap.show();
				
				// clean up
				$oldMap.remove();
				$oldMap = undefined;
				$newMap = undefined;
			});
			
			// load the new image from a dynamic url
			$newMap.attr('src', PhotoFrame.makeDynamicUrl(PhotoFrame.weatherMap)); 
		}
		
		// only reload when its an external url
		if (PhotoFrame.weatherOverlay.indexOf('http') > -1) {
			// find the current overlay
			var $oldOverlay = $('#weather img.overlay');
			
			// create a new image
			var $newOverlay = $(new Image());
			
			// remove the old image and add the new image once loaded
			$newOverlay.load(function () {
				$newOverlay.hide();
				$newOverlay.addClass('overlay');
				$('#weather').append($newOverlay);
				
				if (PhotoFrame.weatherShown) $newOverlay.show();
				
				// clean up
				$oldOverlay.remove();
				$oldOverlay = undefined;
				$newOverlay = undefined;
			});
			
			$newOverlay.attr('src', PhotoFrame.makeDynamicUrl(PhotoFrame.weatherOverlay)); 
		}
	}
	
	this.updateText = function () {
		// find the old quote block
		var $oldQuote = $('#quotes > .block');
		
		// create a new block
		var $newQuote = $('<div></div>');
		
		$newQuote.addClass('holder');
		$newQuote.addClass('block');
		
		// load the new quote
		$newQuote.load('quote.php', {timestamp: (new Date().getTime() + Math.random())}, function() {
			// add the new quote, but still invisible
			$newQuote.css('top', '120px');
			$('#quotes').append($newQuote);
			
			// wait a bit before showing the new quote
			setTimeout(function() {
				// slide in the new quote
				$newQuote.animate({
					top: "0px"
				}, "medium");
				
				// remove the old quote, but add an delay when we're animating
				if (jQuery.fx.off) {
					$oldQuote.remove();
					$oldQuote = undefined;
				}
				else {
					setTimeout(function() {
						$oldQuote.fadeOut("fast", function() {
							if ($oldQuote != undefined) {
								$oldQuote.remove();
								$oldQuote = undefined;
							}
						});
					}, 150);
				}
				
				// clean up
				$newQuote = undefined;
			}, 200);
		});
	}
	
	this.updateTime = function () {
		// clear old timers
		if (PhotoFrame.clockTimer!=null) {
			clearTimeout(PhotoFrame.clockTimer);
			PhotoFrame.clockTimer = null;
		}
		
		// set a new timer
		PhotoFrame.clockTimer = setTimeout(function() { PhotoFrame.updateTime() }, 5000);
		
		// check if the date changed
		if ((new Date()).getMinutes() != PhotoFrame.minutes) {
			PhotoFrame.updateMinutes();
		}
	}
	
	this.updateMinutes = function () {
		// set the number of minutes
		PhotoFrame.minutes = (new Date()).getMinutes();
		
		// find the old minute div
		var $oldMinutes = $('#minutes > .number');
		
		// create a new minute div
		var $newMintues = $('<div></div>');
		
		// build the minute string
		var strMinutes = '' + PhotoFrame.minutes;
		if(strMinutes.length < 2) strMinutes = '0' + strMinutes;
		
		// add some info, hide it and add it
		$newMintues.addClass('number');
		$newMintues.text(strMinutes);
		$newMintues.css('top', '120px');
		$('#minutes').append($newMintues);
		
		// slide the new minute in
		$newMintues.animate({top: "0px"}, "medium", null, function() {
			// when done, check the hours
			if ((new Date()).getHours() != PhotoFrame.hours) {
				PhotoFrame.updateHours();
			}
			
			// clean up
			$newMinutes = undefined;
		});
		
		// fade out the old minutes
		$oldMinutes.fadeOut("medium", function() {
			// clean up
			$oldMinutes.remove();
			$oldMinutes = undefined;
		});
	}
	
	this.updateHours = function () {
		// set the number of hours
		PhotoFrame.hours = (new Date()).getHours();
		
		// find the old hours div
		var $oldHours = $('#hours > .number');
		
		// create a new hours div
		var $newHours = $('<div></div>');
		
		// add some info, hide it and add it
		$newHours.addClass('number');
		$newHours.text(''+PhotoFrame.hours);
		$newHours.css('top', '120px');
		$('#hours').append($newHours);
		
		// slide the new hour in
		$newHours.animate({top: "0px"}, "medium",function() {
			// clean up
			$newHours = undefined;
		});
		
		// fade out the old hours
		$oldHours.fadeOut("medium", function() {
			// clean up
			$oldHours.remove();
			$oldHours = undefined;
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
		this.hideWeather();
		if (!PhotoFrame.trafficShown) $('#traffic, #traffic img').fadeIn('medium');
		PhotoFrame.trafficShown = true;
	}
	
	this.hideTraffic = function () {
		if (PhotoFrame.trafficShown) $('#traffic, #traffic img').fadeOut('medium');
		PhotoFrame.trafficShown = false;
	}
	
	this.toggleWeather = function () {
		if (PhotoFrame.weatherShown) {
			PhotoFrame.hideWeather();
		}
		else {
			PhotoFrame.showWeather();
		}
	}
	
	this.showWeather = function () {
		this.hideTraffic();
		if (!PhotoFrame.weatherShown) $('#weather, #weather img').fadeIn('medium');
		PhotoFrame.weatherShown = true;
	}
	
	this.hideWeather = function () {
		if (PhotoFrame.weatherShown) $('#weather, #weather img').fadeOut('medium');
		PhotoFrame.weatherShown = false;
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
		// if the webcam is not already loading, load it
		if (!PhotoFrame.webcams[id].loading) {
			PhotoFrame.webcams[id].loading = true;
			
			// build a url
			var url = PhotoFrame.makeDynamicUrl(PhotoFrame.webcams[id].url);
			
			// create a new cam image
			var $newCam = $(new Image());
			
			// find the old style
			var style = $('#' + id + ' img').attr('style');
			
			// apply the old style to the new cam, plus some more options
			$newCam.attr('style', style);
			$newCam.css('opacity', 1);
			
			// add a load event
			$newCam.load(function () {
				PhotoFrame.webcams[id].loading = false;
				clearTimeout(PhotoFrame.webcams[id].errorTimer);
				PhotoFrame.webcams[id].errorTimer = null;
				
				// clean up old images
				$('#' + id + ' img').remove();
				
				// show the new image
				$('#' + id).show();
				$('#' + id).append($newCam);
				
				// fade out error and shadow divs
				$('#error-'  + id).fadeOut('medium');
				$('#shadow-' + id).fadeOut('medium');
				
				// clean up
				$newCam.unbind();
				$newCam = undefined;
			});
			
			$newCam.error(function () {
				PhotoFrame.webcams[id].loading = false;
				clearTimeout(PhotoFrame.webcams[id].errorTimer);
				PhotoFrame.webcams[id].errorTimer = null;
				
				// show error and shadow divs
				$('#error-'  + id).fadeIn('medium');
				$('#shadow-' + id).fadeIn('medium');
				
				// clean up
				if ($newCam != undefined) {
					$newCam.unbind();
					$newCam = undefined;
				}
			});
			
			PhotoFrame.webcams[id].errorTimer = function() {
				if (PhotoFrame.webcams[id].loading) {
					if ($newCam != undefined) {
						$newCam.error();
					}
				}
			};
			setTimeout(PhotoFrame.webcams[id].errorTimer, 5000);
			
			// load the new cam image
			$newCam.attr('src', url);
		}
	}
	
	this.updateWebcams = function() {
		// clear old timers
		if (PhotoFrame.webcamsTimer!=null) {
			clearTimeout(PhotoFrame.webcamsTimer);
			PhotoFrame.webcamsTimer = null;
		}
		
		PhotoFrame.webcamsTimer = setTimeout(function() { PhotoFrame.updateWebcams() }, 60000);
		
		// update even if they are not shown, only not as often
		if (!PhotoFrame.webcamsShown) {
			for (var id in PhotoFrame.webcams) {
				PhotoFrame.updateWebcam(id);
			}
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
	
	this.updateWebcamTimer = function(id) {
		if (PhotoFrame.webcams[id].updateTimer!=null) {
			clearTimeout(PhotoFrame.webcams[id].updateTimer);
			PhotoFrame.webcams[id].updateTimer = null;
		}
		
		PhotoFrame.webcams[id].updateTimer = setTimeout(function() { PhotoFrame.updateWebcamTimer(id) }, 
				PhotoFrame.webcams[id].interval);
		
		PhotoFrame.updateWebcam(id);
	}
	
	this.showWebcams = function () {
		if (!PhotoFrame.webcamsShown) $('#webcams, #webcams div').fadeIn('medium');
		PhotoFrame.webcamsShown = true; // the order here is important!

		for (var id in PhotoFrame.webcams) {
			PhotoFrame.updateWebcamTimer(id);
		}
	}
	
	this.hideWebcams = function () {
		if (PhotoFrame.webcamsShown) {
			$('#webcams, #webcams div').fadeOut('medium', function() {
				$('#webcams .shadow').fadeIn('medium');
			});
		}
		PhotoFrame.webcamsShown = false;
		
		for (var id in PhotoFrame.webcams) {
			if (PhotoFrame.webcams[id].updateTimer != null) {
				clearTimeout(PhotoFrame.webcams[id].updateTimer);
				PhotoFrame.webcams[id].updateTimer = null;
			}
		}
	}
	
	this.checkConnection = function () {
		if (PhotoFrame.connectionTimer!=null) {
			clearTimeout(PhotoFrame.connectionTimer);
			PhotoFrame.connectionTimer = null;
		}
		
		var $img = $(new Image());
		
		$img.load(function () {
			$('#connectionerror').fadeOut('medium');
			
			$img.remove();
			$img = undefined;
		});
		
		$img.error(function () {
			$('#connectionerror').fadeIn('medium');
			
			$img.unbind();
			$img = undefined;
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
		PhotoFrame.weatherShown = false;
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
		PhotoFrame.updateWeather();
		
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
	
	this.setWeatherMap = function (value) {
		PhotoFrame.weatherMap = value;
	}
	
	this.setWeatherOverlay = function (value) {
		PhotoFrame.weatherOverlay = value;
	}
	
	this.addWebcam = function (id, url, interval) {
		if (interval <= 0) interval = this.webcamsInterval;
		
		PhotoFrame.webcams[id] = {url: url, loading: false, errorTimer: null, updateTimer: null, interval: interval};
	}
	
	this.setWebcamsInterval = function (value) {
		PhotoFrame.webcamsInterval = value;
	}
	
	this.setConnectionURL = function (value) {
		PhotoFrame.connectionURL = value;
	}
	
	this.setFileCount = function (value) {
		PhotoFrame.fileCount = value;
	}
};
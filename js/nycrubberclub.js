// JavaScript Document

$('document').ready(function() {
	
	$("header#primary-header").load("includes/header.html");
	$("#nycrubberclub-follow-us").load("includes/follow-us.html");
	$("#subscribe-mc-rubber-news").load("includes/subscribe-newsletter.html");
	
	
	// Footer Copyright Year Auto Generate
	$("footer#primary-footer").load("includes/footer.html", function() {
		$('#copyright-year').text(new Date().getFullYear());
	});
	
	
	// Fixed Header
	$(window).scroll(function() {  
		if ($(this).scrollTop() > 1) {    
			$('header').addClass("sticky");  
		} else {  
			$('header').removeClass("sticky");  
		}  
	});
	
	// Fixed Header Logo Shrink
	$(window).scroll(function() {  
		if ($(this).scrollTop() > 50) {    
			$('img.nycrc-logo').addClass("sticky-logo");  
		} else {  
			$('img.nycrc-logo').removeClass("sticky-logo");  
		}  
	});
	$("header").animate({position: 'top'});
	
	// About Committee Content MatchHeight
	$('.about-committee .content').matchHeight({
	});
	
	// Home Page Google Calendar Event List
	
	$('#eventlist').google_calendar_events({
		key: 'AIzaSyCJuODQsGMor42cJiRCLfPMSE5EvRgtOgQ',
		calendarId: 'jffshs6qd0nk6e002cf030fufk@group.calendar.google.com',
		maxResults: 5
    });

});

// Event Posters

document.addEventListener('DOMContentLoaded', function() {publishNextEvents();});
document.addEventListener('DOMContentLoaded', function() {publishPastEvents();});
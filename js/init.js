/* jQuery No Conflict */

var $j = jQuery.noConflict();

/* Script Execution */

$j(document).ready(function() {
	var zoom = new ch.Zoom(myZoom);
	
	var carousel = new ch.Carousel(myCarousel,[
			limitPerPage= 3
		]);
});
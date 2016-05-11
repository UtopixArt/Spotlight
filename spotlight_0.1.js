function Spotlight(){
	//store core cache
	this.album = {
					linksList : [], //array of links
					numberImage : 0 // current image count
					};
	this.init();

}

Spotlight.prototype.init = function() {
	this.init = false;
	this.run();
};

Spotlight.prototype.run = function() {
	var self = this
	
	$('body').on('click', 'a[data-spotLight]', function(event) { //event click on data-spotLight value
    	
    	if(self.init == false){
			self.buildAlbum($(event.currentTarget));// attribute from the event.currentTarget		
    	
    	}else{ 	
    		for(var i = 0; i < self.album.linksList.length; i++){
   				//console.log("event : "+$(event.currentTarget)[0]);
   				//console.log("linkList : "+self.album.linksList[i].link);
    			if (self.album.linksList[i].link === $(event.currentTarget).attr('href')){
    				self.album.numberImage = i
    				console.log("first : "+self.album.numberImage);
    			}
			}
			
			$('#spotlight').fadeIn('slow');
			self.showImage(self.album.numberImage);
			self.sizeContainer();
    	}
    	return false;
    });	
};

Spotlight.prototype.buildAlbum = function($link){
	var self = this
	
	// method push album in the array with object data	
	function addToAlbum($link){
		self.album.linksList.push({ // push in the ablum.linksList array
        link : $link.attr('href'),
    	});
	};	
	
	var $links, //cache linksList
	dataSpotLightValue = $link.attr('data-spotLight');//get attribute from data-spotLight
	
	//loop storing
	if (dataSpotLightValue) { // == dataSpotLightValue return true
		$links = $($link.prop('tagName') + '[data-spotLight="' + dataSpotLightValue + '"]');// assign to links
		//console.log($links)
		//loop for storing data on linksList
		for (var i = 0; i < $links.length; i++) {
        	addToAlbum($($links[i]));

	    	if ($links[i] === $link[0]) {
	        	this.album.numberImage = i;
	      	}
	    }
	}
	this.cacheDiv();
	this.update();
	this.init = true;
};

Spotlight.prototype.cacheDiv = function(){
	
	this.next = '<img id = "rightIcon" src="Spotlight/icons/next.png">'
	this.prev = '<img id = "leftIcon" src="Spotlight/icons/prev.png">'
	this.close = '<img id = "closeIcon" src="Spotlight/icons/close.png">'

	this.rightButton = '<div id = "rightButton">'+this.next+' </div>'
	this.leftButton = '<div id = "leftButton">'+this.prev+'</div>'
	this.closeButton = '<div id = "closeButton">'+this.close+'</div>'
	this.image = '<img id ="show">'

	this.container = '<div class = "container">'+this.rightButton+this.image+this.leftButton+this.closeButton+'</div>';
	this.spotlight = '<div id = "spotlight">'+this.container+'</div>';

};

Spotlight.prototype.update = function(){
	
	$(this.spotlight).appendTo($('body'));		
	this.nav();
	this.end(); //close button method "jquery"
	
};

Spotlight.prototype.nav = function(){
	var	self = this;
	
	this.showImage(this.album.numberImage);

	$('body').on('click', 'div[id = rightButton],div[id = leftButton]', function(event){		
		var id = ($(event.currentTarget)).attr('id')
		navlogic(id);
	});
	
	function navlogic(id){			
		
		if (id == 'rightButton'){
			if(self.album.numberImage >= self.album.linksList.length -1){
				self.album.numberImage = 0;
				console.log("numberImage : "+self.album.numberImage+" album : "+self.album.linksList.length);
			}else{
				self.album.numberImage++; 
				console.log("numberImage : "+self.album.numberImage+" album : "+self.album.linksList.length);
			}		
		}
		
		else if (id == 'leftButton'){				
			if(self.album.numberImage -1 < 0){
				self.album.numberImage = self.album.linksList.length -1;
				console.log("numberImage : "+self.album.numberImage+" album : "+self.album.linksList.length);
			}else{
				self.album.numberImage--; 
				console.log("numberImage : "+self.album.numberImage+" album : "+self.album.linksList.length);
			}	
		}
		return self.showImage(self.album.numberImage);
	};	
};

Spotlight.prototype.sizeContainer = function() {
    var $spotlight = $('#spotlight');
    $spotlight.width($(document).width());
    $spotlight.height($(document).height());    
};

Spotlight.prototype.showImage = function(numberImage) {
    var $image = $('#show');
    var preloader = new Image();
   	var self = this;
    
   	var windowWidth = $(window).width(),
   		windowHeight  = $(window).height();

    preloader.onload = function(){
    	var $preloader;
		$('#show').attr('src',self.album.linksList[numberImage].link);
		$preloader = $(preloader)
	 	$image.width(preloader.width * 0.7);
     	$image.height(preloader.height * 0.7);
     	
	}

 	preloader.src = this.album.linksList[numberImage].link;
 	console.log("second : "+numberImage)
 	this.sizeContainer();
};



Spotlight.prototype.end = function(){
	var $spotlight = $('#spotlight')
	
	$('#closeButton').click(function(){	
    	$spotlight.fadeOut('slow');	
	});
};

$(document).ready(function(){
new Spotlight();

});
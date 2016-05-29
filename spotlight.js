(function(){
	function Spotlight(){
		//store core cache
		this.album = {
						linksList : [], //array of links
						title : [],
						numberImage : 0 // current image count
						};
		
		console.log(this.album);
		this.init() 
		
	};
	
	Spotlight.prototype.init = function() {	
		
		this.run();
		this.cacheDiv();
		this.update();

	};

	Spotlight.prototype.run = function() {
		var self = this // pass through closure
		
		$('body').on('click', 'a[data-spotLight]', function(event) { //event click on data-spotLight value
	    	
    		self.buildAlbum($(event.currentTarget));
	    	$('#overlay').fadeIn('slow');
	    	$('#spotlight').fadeIn('slow');
	    	self.showImage(self.album.numberImage);
	    	self.sizeContainer();
	    	$('#show').hide();
	    	return false;
	    });
	};

	Spotlight.prototype.buildAlbum = function($link){
		var self = this // pass through closure
		
		this.album.linksList = []; //reset value of the spotLight
		this.album.titleList = [];
		this.album.numberImage = 0;
		// method push album in the array with object data	
		function addToAlbum($link){
			self.album.titleList.push({
			title : $link.attr('title'),	
			});
			self.album.linksList.push({ // push in the ablum.linksList array
	        link : $link.attr('href'),
	    	});
		};	
		
		var $links, //cache linksList
		dataSpotLightValue = $link.attr('data-spotLight');//get attribute from data-spotLight
		
		//loop storing
		if (dataSpotLightValue) { // === dataSpotLightValue return true
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
	};

		Spotlight.prototype.cacheDiv = function(){
		
		this.leftButton = '<div id = "leftButton"></div>';
		this.rightButton = '<div id = "rightButton"></div>';
		this.closeButton = '<div id = "closeButton"></div>';
		this.number = '<p id = "number"></p>';
		this.title = '<p id = "title"></p>';
		this.labelData = '<div id = "labelData">'+this.title+this.number+this.closeButton+'</div>';
		this.image = '<img id ="show">';
		this.overlay ='<div id ="overlay"></div>';
		this.navcontainer = '<div id = "navcontainer">'+this.leftButton+this.rightButton+'</div>';
		
		this.imgcontainer ='<div id = "imgcontainer">'+this.navcontainer+this.image+'</div>';
		
		this.container = '<div id = "container">'+this.imgcontainer+this.labelData+'</div>';
		this.spotlight = this.overlay+'<div id = "spotlight">'+this.container+'</div>';

		$(this.spotlight).appendTo($('body'));
		$('#overlay').hide();
		$('#spotlight').hide();
		$('#labelData').hide();
	};

	Spotlight.prototype.update = function(){
		this.keyOn = false;		
		this.click(); //call nav logic
		this.keyboard();
		this.responsive();
		this.sizeContainer(); // call method sizeContainer for fill container on screen
	};

	Spotlight.prototype.sizeContainer = function() {
	    var $overlay = $('#overlay');
	    $overlay.width($(document).width());
	    $overlay.height($(document).height()); 

	};

	Spotlight.prototype.showImage = function(numberImage) {
	    this.keyOn=true;
	    var self = this;// pass through closure
	    var $image = $('#show'); //stock l'id $('#Show')
	    var preloader = new Image();// use object image for grab image size
		   	  
	   	var windowWidth = $(window).width() , //stock window dimention
	   		windowHeight  = $(window).height(),
	   		imageWidth,
	   		imageHeight,
	   		ratio,
	   		size = 0.95;

   		$('#show').hide();
		$('#rightButton').hide();
		$('#leftButton').hide();
		$('#labelData').hide();	
	   
	    preloader.onload = function(){ //onload function
	    	$image.attr('src',self.album.linksList[numberImage].link); // change content on $('#show'), display
			
			//fit image on screen method
			imageHeight = preloader.height
			imageWidth = preloader.width

					 	
		 	if(preloader.width > windowWidth){
	 			
	 			if(preloader.height > windowHeight){
	 				ratio = windowHeight / preloader.height;
	 				imageHeight = preloader.height * ratio;
	 				imageWidth = preloader.width * ratio;
	 				if(imageWidth>windowWidth){
	 					ratio = windowWidth / imageWidth;
	 					imageWidth = windowWidth;
	 					imageHeight = imageHeight * ratio;
	 					}

	 			}else{
	 				ratio = windowWidth / preloader.width;
	 				imageHeight = preloader.height * ratio;
	 				imageWidth = windowWidth;
	 				}

	 		}else{
 				ratio = windowHeight / preloader.height;
 				imageHeight = windowHeight;
 				imageWidth = preloader.width * ratio;	
	 			}

	 		$image.height(imageHeight * size);
	 		$image.width(imageWidth * size);
	 		$('#title').text(self.album.titleList[numberImage].title);
	 		$('#number').text("Image count : "+(numberImage+1)+" of "+self.album.linksList.length);
	 		self.animation(imageWidth * size, imageHeight * size);
	 		
	 	}
		preloader.src = this.album.linksList[numberImage].link;		
	};
	
	Spotlight.prototype.responsive = function(){
		var self = this;
		$( window ).resize(function(){
			self.sizeContainer();
		});
	};


	Spotlight.prototype.animation = function(imageWidth, imageHeight) {
	    var self = this;
	    	

	    var oldWidth  = $('#container').outerWidth(),
	   		oldHeight = $('#container').outerHeight(),
	    	newWidth  = imageWidth
	    	newHeight = imageHeight
	
	    function postResize() {
	    	$('#spotlight').find('#leftButton').height(newHeight);
	    	$('#spotlight').find('#rightButton').height(newHeight);
	    	$('#show').fadeIn('slow','swing');
	    	$('#rightButton').fadeIn('slow','swing');
			$('#leftButton').fadeIn('slow','swing');
			$('#labelData').slideDown("slow",'swing'); 
	    	}

	    if (oldWidth !== newWidth || oldHeight !== newHeight) {
	    	$('#container').animate({
	        	width: newWidth,
	        	height: newHeight
	      	}, 120 , 'swing', function() {
	        postResize();
	      });
    
	    } else {
	      postResize();
	    }
  	};

  	Spotlight.prototype.navlogic = function(input){
			var KEYCODE_ESC        = 27,
				KEYCODE_LEFTARROW  = 37,
				KEYCODE_RIGHTARROW = 39;
			
			if (input == "rightButton" || input == KEYCODE_RIGHTARROW){			
				if(this.album.numberImage >= this.album.linksList.length -1){
					this.album.numberImage = 0;
					console.log("numberImage : "+this.album.numberImage+" album : "+this.album.linksList.length);
				}else{
					this.album.numberImage++; 
					console.log("numberImage : "+this.album.numberImage+" album : "+this.album.linksList.length);
				}
				this.sizeContainer();
				return this.showImage(this.album.numberImage);

			}
			
			else if (input == "leftButton" || input == KEYCODE_LEFTARROW){							
				if(this.album.numberImage -1 < 0){
					this.album.numberImage = this.album.linksList.length -1;
					console.log("numberImage : "+this.album.numberImage+" album : "+this.album.linksList.length);
				}else{
					this.album.numberImage--; 
					console.log("numberImage : "+this.album.numberImage+" album : "+this.album.linksList.length);
				}
				this.sizeContainer();
				return this.showImage(this.album.numberImage);	
			}

			if(input == "closeButton" || input == KEYCODE_ESC){
				this.end();	
			}
  	}

  	Spotlight.prototype.click = function() {
  		var self = this;
  		var next = $('#spotlight').find('#rightButton'),		
			prev = $('#spotlight').find('#leftButton'),
			close = $('#spotlight').find('#closeButton');	
		
		$('#spotlight').on('click','div[id = rightButton],div[id = leftButton],div[id = closeButton]',function(event){
		var input = ($(event.currentTarget)).attr('id')
		
		self.navlogic(input);
		});
  	}

  	Spotlight.prototype.keyboard = function(){
  		
  		var	self = this; // pass through closure
		
			$('body').keydown(function(event){

				var keycode = event.keyCode;
				if(self.keyOn){
				console.log(keycode);
				self.navlogic(keycode);	
				}else{console.log("keyboard off")}
			});
  	}

	Spotlight.prototype.end = function(){
		var $spotlight = $('#spotlight')
			this.keyOn=false;
			console.log(this.keyOn);
			console.log('tiggered')
	    	$('#overlay').fadeOut('slow');
	    	$spotlight.fadeOut('slow');

	};

	return new Spotlight();
})();
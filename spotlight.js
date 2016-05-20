(function(){
	function Spotlight(){
		//store core cache
		this.album = {
						linksList : [], //array of links
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
	    
	    	$('#spotlight').fadeIn('slow');
	    	self.showImage(self.album.numberImage);
	    	
	    	return false;
	    });
	};


	Spotlight.prototype.buildAlbum = function($link){
		var self = this // pass through closure
		
		this.album.linksList = []; //reset value of the spotLight
		this.album.numberImage = 0;
		// method push album in the array with object data	
		function addToAlbum($link){
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
		
		this.leftButton = '<div id = "leftButton"></div>'
		this.rightButton = '<div id = "rightButton"></div>'
		this.closeButton = '<div id = "closeButton"></div>'
		this.image = '<img id ="show">'

		this.navcontainer = '<div id = "navcontainer">'+this.leftButton+this.rightButton+'</div>'
		
		this.imgcontainer ='<div id = "imgcontainer">'+this.navcontainer+this.image+'</div>'
		
		this.container = '<div id = "container">'+this.imgcontainer+this.closeButton+'</div>'
		this.spotlight = '<div id = "spotlight">'+this.container+'</div>'

		$(this.spotlight).appendTo($('body'));
		
		$('#spotlight').hide();
	};

	Spotlight.prototype.update = function(){
				
		this.nav(); //call nav logic
		this.end(); //close button method "jquery"
		this.sizeContainer(); // call method sizeContainer for fill container on screen
	};

	Spotlight.prototype.nav = function(){
		var	self = this; // pass through closure
		
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
			$('#show').hide();
			$('#rightButton').hide();
			$('#leftButton').hide();
			$('#closeButton').hide();
			return self.showImage(self.album.numberImage);
		};	
	};

	Spotlight.prototype.sizeContainer = function() {
	    var $spotlight = $('#spotlight');
	    $spotlight.width($(document).width());
	    $spotlight.height($(document).height());    
	};

	Spotlight.prototype.showImage = function(numberImage) {
	    var self = this;// pass through closure
	    var $image = $('#show'); //stock l'id $('#Show')
	    var preloader = new Image();// use object image for grab image size
		   	  
	   	var windowWidth = $('#imgcontainer').width() , //stock window dimention
	   		windowHeight  = $('#imgcontainer').height(),
	   		imageWidth,
	   		imageHeight,
	   		ratio,
	   		wRatio,
	   		hRatio,
	   		size = 1;    

	    preloader.onload = function(){ //onload function
	    	$image.attr('src',self.album.linksList[numberImage].link); // change content on $('#show'), display
			
			//fit image on screen method
			$image.width(preloader.width * size)
			$image.height(preloader.height * size)

			imageWidth = preloader.width
			imageHeight = preloader.height
		 	
		 	
		 	if(imageWidth > windowWidth || imageHeight > windowHeight){
		 		if(preloader.width>windowWidth){
		 			
		 			if(preloader.width > windowWidth && preloader.height > windowHeight ){
		 				ratio = windowHeight / preloader.height
		 				$image.height(windowHeight*size);
		 				$image.width((imageWidth*ratio)*size);
		 				console.log("image trop haut et trop large")
		 				
		 				if($image.width()>windowWidth){
		 					ratio = windowWidth / preloader.width
		 					$image.height((imageHeight*ratio)*size);
		 					$image.width(windowWidth*size);
		 					console.log("image encore trop large")
		 				}
		 				

		 			}else{
		 				wRatio = windowWidth / preloader.width
		 				$image.height((imageHeight * wRatio) * size);
		 				$image.width(windowWidth * size)
		 				console.log("image trop large")
		 			}

		 		}else{

		 			
	 				hRatio = windowHeight / preloader.height
	 				$image.height(windowHeight * size);
	 				$image.width((imageWidth * hRatio) * size)
	 				console.log("image trop haute")
		 			
		 		}
		 	}
		}
		
		preloader.src = this.album.linksList[numberImage].link; //
		$image.fadeIn('slow','swing');
		
		$('#rightButton').fadeIn('slow','swing');
		$('#leftButton').fadeIn('slow','swing');
		$('#closeButton').fadeIn('slow','swing'); 	
		
	};
	
	
	Spotlight.prototype.end = function(){
		var $spotlight = $('#spotlight')
		
		$('#closeButton').click(function(){	
	    	$spotlight.fadeOut('slow');	
		});
	};

	return new Spotlight();
})();
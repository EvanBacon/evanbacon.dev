// Initialize PhotoSwipe - grab isotope items from DOM
initPhotoSwipeFromDOM = function(gallerySelector) {

	var parseThumbnailElements = function(el) {
	    var thumbElements = el.childNodes,
	        numNodes = thumbElements.length,
	        items = [],
	        el,
	        childElements,
	        thumbnailEl,
	        size,
	        item;

	    for(var i = 0; i < numNodes; i++) {
	        el = thumbElements[i];

	        // include only element nodes
	        if(el.nodeType !== 1) {
	          continue;
	        } else {
	        	var c = el.getAttribute('class');
	        	var isHidden = hasClass(el, 'isotope-hidden');
	        	if (c === 'gutter-sizer' || c === 'grid-sizer' || isHidden )
					continue;
	        }

	        childElements = el.children;

	        size = el.getAttribute('data-size').split('x');

	        // create slide object
	        item = {
				src: el.getAttribute('href'),
				w: parseInt(size[0], 10),
				h: parseInt(size[1], 10),
				author: el.getAttribute('data-author')
	        };

	        item.el = el; // save link to element for getThumbBoundsFn

	        if(childElements.length > 0) {
	          item.msrc = childElements[0].getAttribute('src'); // thumbnail url
	          if(childElements.length > 1) {
	              item.title = childElements[1].innerHTML; // caption (contents of figure)
	          }
	        }


			var mediumSrc = el.getAttribute('data-med');
          	if(mediumSrc) {
            	size = el.getAttribute('data-med-size').split('x');
            	// "medium-sized" image
            	item.m = {
              		src: mediumSrc,
              		w: parseInt(size[0], 10),
              		h: parseInt(size[1], 10)
            	};
          	}
          	// original image
          	item.o = {
          		src: item.src,
          		w: item.w,
          		h: item.h
          	};

	        items.push(item);
	    }

	    return items;
	};

	// find nearest parent element
	var closest = function closest(el, fn) {
	    return el && ( fn(el) ? el : closest(el.parentNode, fn) );
	};

	var hasClass = function(element, className) {
	    return element.className && new RegExp("(^|\\s)" + className + "(\\s|$)").test(element.className);
	};

	var onThumbnailsClick = function(e) {
	    e = e || window.event;
	    e.preventDefault ? e.preventDefault() : e.returnValue = false;

	    var eTarget = e.target || e.srcElement;

	    var clickedListItem = closest(eTarget, function(el) {
	        return el.tagName === 'A';
	    });

	    if(!clickedListItem) {
	        return;
	    }

	    var clickedGallery = clickedListItem.parentNode;

	    var childNodes = clickedListItem.parentNode.childNodes,
	        numChildNodes = childNodes.length,
	        nodeIndex = 0,
	        index;

	    for (var i = 0; i < numChildNodes; i++) {
	        if(childNodes[i].nodeType !== 1) {
	            continue;
	        } else {
	        	if(childNodes[i].nodeType !== 1) {
	          		continue;
		        } else {
		        	var c = childNodes[i].getAttribute('class');
		        	var isHidden = hasClass(childNodes[i], 'isotope-hidden');
		        	if (c === 'gutter-sizer' || c === 'grid-sizer' || isHidden )
						continue;
		        }
	        }

	        if(childNodes[i] === clickedListItem) {
	            index = nodeIndex;
	            break;
	        }
	        nodeIndex++;
	    }

	    if(index >= 0) {
	        openPhotoSwipe( index, clickedGallery );
	    }
	    return false;
	};

	var photoswipeParseHash = function() {
		var hash = window.location.hash.substring(1),
	    params = {};

	    if(hash.length < 5) { // pid=1
	        return params;
	    }

	    var vars = hash.split('&');
	    for (var i = 0; i < vars.length; i++) {
	        if(!vars[i]) {
	            continue;
	        }
	        var pair = vars[i].split('=');
	        if(pair.length < 2) {
	            continue;
	        }
	        params[pair[0]] = pair[1];
	    }

	    if(params.gid) {
	    	params.gid = parseInt(params.gid, 10);
	    }

	    if(!params.hasOwnProperty('pid')) {
	        return params;
	    }
	    params.pid = parseInt(params.pid, 10);
	    return params;
	};

	var openPhotoSwipe = function(index, galleryElement, disableAnimation) {
	    var pswpElement = document.querySelectorAll('.pswp')[0],
	        gallery,
	        options,
	        items;


		items = parseThumbnailElements(galleryElement);

	    // define options (if needed)
	    options = {
	        index: index,

	        galleryUID: galleryElement.getAttribute('data-pswp-uid'),

	        getThumbBoundsFn: function(index) {
	            // See Options->getThumbBoundsFn section of docs for more info
	            var thumbnail = items[index].el.children[0],
	                pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
	                rect = thumbnail.getBoundingClientRect();

	            return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
	        },

	        addCaptionHTMLFn: function(item, captionEl, isFake) {
				if(!item.title) {
					captionEl.children[0].innerText = '';
					return false;
				}
				var photoBy =  '<br/><small>Photo by ' + item.author + '</small>';
				captionEl.children[0].innerHTML = item.title + (!! item.author ? photoBy : '');
				return true;
	        },
	        shareButtons: [
			{id:'facebook', label:'Share on Facebook', url:'https://www.facebook.com/sharer/sharer.php?u={{url}}'},
			{id:'twitter', label:'Tweet', url:'https://twitter.com/intent/tweet?text={{text}}&url={{url}}'},
			{id:'pinterest', label:'Pin it', url:'http://www.pinterest.com/pin/create/button/'+
			'?url={{url}}&media={{image_url}}&description={{text}}'},
			],

	    };

	    if(disableAnimation) {
	        options.showAnimationDuration = 0;
	    }

	    // Pass data to PhotoSwipe and initialize it
	    gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);

	    // see: http://photoswipe.com/documentation/responsive-images.html
		var realViewportWidth,
		    useLargeImages = false,
		    firstResize = true,
		    imageSrcWillChange;

		gallery.listen('beforeResize', function() {

			var dpiRatio = window.devicePixelRatio ? window.devicePixelRatio : 1;
			dpiRatio = Math.min(dpiRatio, 2.5);
		    realViewportWidth = gallery.viewportSize.x * dpiRatio;


		    if(realViewportWidth >= 750 || (!gallery.likelyTouchDevice && realViewportWidth > 480) || screen.width > 750 ) {
		    	if(!useLargeImages) {
		    		useLargeImages = true;
		        	imageSrcWillChange = true;
		    	}

		    } else {
		    	if(useLargeImages) {
		    		useLargeImages = false;
		        	imageSrcWillChange = true;
		    	}
		    }

		    if(imageSrcWillChange && !firstResize) {
		        gallery.invalidateCurrItems();
		    }

		    if(firstResize) {
		        firstResize = false;
		    }

		    imageSrcWillChange = false;

		});

		gallery.listen('gettingData', function(index, item) {
		    if( useLargeImages ) {
		        item.src = item.o.src;
		        item.w = item.o.w;
		        item.h = item.o.h;
		    } else {
		        item.src = item.m.src;
		        item.w = item.m.w;
		        item.h = item.m.h;
		    }
		});

	    gallery.init();
	};

	// select all gallery elements
	var galleryElements = document.querySelectorAll( gallerySelector );
	for(var i = 0, l = galleryElements.length; i < l; i++) {

		if(galleryElements[i].nodeType !== 1) {
	          continue;
	        } else {
	        	var c = galleryElements[i].getAttribute('class');
	        	var isHidden = hasClass(galleryElements[i], 'isotope-hidden');
	        	if (c === 'gutter-sizer' || c === 'grid-sizer' || isHidden) // or if hasclass isotope-hidden
					continue;
	        }
		galleryElements[i].setAttribute('data-pswp-uid', i+1);
		galleryElements[i].onclick = onThumbnailsClick;
	}

	// Parse URL and open gallery if it contains #&pid=3&gid=1
	var hashData = photoswipeParseHash();
	if(hashData.pid > 0 && hashData.gid > 0) {
		openPhotoSwipe( hashData.pid - 1 ,  galleryElements[ hashData.gid - 1 ], true );
	}
};

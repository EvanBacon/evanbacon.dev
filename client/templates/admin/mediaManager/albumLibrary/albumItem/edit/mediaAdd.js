Template.mediaAdd.rendered = function () {
  // $('.thumbnail').hover(
  //       function(){
  //           $(this).find('.caption').slideDown(250); //.fadeIn(250)
  //       },
  //       function(){
  //           $(this).find('.caption').slideUp(250); //.fadeOut(205)
  //       }
  //   ); 

  $('#media-selection').on('show.bs.modal', function () {
    $('.modal-content').css('height',$( window ).height()*1.0);
    });
};

Template.mediaAdd.helpers ({
  images: function () {
  	return this.mediaItems;
  },
  searchQuery: function () {
    var keywords = GetSearch();
    if (keywords)
        return 'Search results for "' + GetSearch() + '"';
  },
  mediaUsed: function () {
  	var images = Session.get('selected-images');
  	if (! _.isArray(images)) {
		      images = [images]
		    }
  	return images.indexOf(this._id) > -1;
  }
});

Template.mediaAdd.events({
   'click .thumb-icon': function(e) {
        e.preventDefault();
      
        var checked = $('#' + this._id).prop('checked');
        var thumbId = "#tm-" + this._id;
        if($(thumbId).data('checked') === 'checked') {
          $(thumbId).removeClass("selected");
          $(thumbId).find('.checked').addClass("hidden");
          $(thumbId).data('checked', '');
        } else {
          $(thumbId).addClass("selected");
          $(thumbId).find('.checked').removeClass("hidden");
          $(thumbId).data('checked', 'checked');
        }
    },
    'click .save': function (e) {
        pageChanged(true);
        var images = $(".thumb-icon.selected").each(function(){
        addContent($(this).data("id"), 0, $(this).data("url"));
  		});

      $('.thumb-icon').removeClass("selected");
  		$('#media-selection').modal('hide');

		
    },
    'click .close, click .close-box': function (e) {
        $('.thumb-icon').removeClass("selected");
    }  
}); 


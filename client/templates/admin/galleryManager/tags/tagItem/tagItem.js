
Template.tagItem.rendered = function () {
		$popover = $('[data-toggle="popover"]').popover({
		        trigger: 'hover',
		        placement: 'bottom',
		        html: 'true',
		        // content: 'hello'
		        // content: function() {
	         //      return $("#popover-content-" + this._id).html();
	         //   	} 
		});  
		// Meteor.defer(function () {
		// 	$popover.content(function() {
	 //              return $("#popover-content-" + this._id).html();
	 //           	}); 
		// });
};

Template.tagItem.helpers({
	mediaList: function() {
		// $popover.content(function() {
	 //              return $("#popover-content-" + this._id).html();
	 //           	}); 
        // $popover.setContent();
     //    Meteor.defer(function () {
     //    	$popover('setContent',function() {
	    //           return $("#popover-content-" + this._id).html();
	    //        	});
	    // });
        // $popover.options.content(function() {
	       //        return $("#popover-content-" + this._id).html();
	       //     	});
		var media = Media.find({'metadata.tags._id': this._id}).fetch();

	    var str = '<div class="tag-count-content">';
		if(media.length > 0) {
			// str += '<img src="' + media[0].url({ store: 'thumb'}) + '" >'
			// str = !! media[0].metadata.title ? media[0].metadata.title : media[0].original.name;
			for(var i=0; i < media.length; i++) {
				// str += ', ';
				str += '<img src="' + media[i].url({ store: 'thumb'}) + '">'
				// str += !! media[i].metadata.title ? media[i].metadata.title : media[i].original.name;;
			};
		}
		str += '</div>';

		return str;
	}
});

var confirmMsg = function (msg, fn) {
	if(confirm(msg)) {
		fn();
	}
};

var callUpdateTag = function (t, id, originalName) {
	Meteor.call('updateTag', id, Validation.trimInput(t.find('#tag-' + id).value),
					function (err) {
					  if (err) { 
				      	Session.set('tag-error', err.message);
				      	t.find('#tag-' + id).value = originalName; // restore original name
				      } else { 
				      	Session.set('tag-error', null); 
				      	$('#update-'+ id + ' .updateText').addClass('hidden');
						$('#update-'+ id + ' .savedText').removeClass('hidden');
				      }
					});
	$('#tag-' + id).blur();
};

Template.tagItem.events({
	'keyup input.inputTag, change input': function (e, t) {
		if (e.which === 13) {
			callUpdateTag(t, this._id, this.name );
		} else {
			var val = t.find(e.currentTarget).value;
			if(val === this.name) {
				$('#update-'+ this._id + ' .updateText').addClass('hidden');
				$('#update-'+ this._id + ' .savedText').removeClass('hidden');
			} else {
				$('#update-'+ this._id + ' .updateText').removeClass('hidden');
				$('#update-'+ this._id + ' .savedText').addClass('hidden');
			}
		}	     
	},
	'click .update-tag, submit form': function (e, t) {
		callUpdateTag(t, this._id, this.name );
	},
	'click .remove-tag': function (e, t) {
		var count = this.usedCount,
			fnAction = function () {
		  	  var tagId = $(e.currentTarget).attr('data-tagid');
		      var mediaId = $(e.currentTarget).attr('data-mediaid');

		      Meteor.call('removeTag', tagId, function (err, result) {
		        if (err) Session.set('tag-error', 'err');
		      });
		  	};

		if (count > 0) {
			confirmMsg('This will remove the tag "' + this.name + '" from ' + count + ' images.', fnAction);
	  	} else {
	  		fnAction();
	  	}
	}
});

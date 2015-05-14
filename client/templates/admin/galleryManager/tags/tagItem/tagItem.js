Template.tagItem.onRendered(function () {
	$popover = $('[data-toggle="popover"]').popover({
	        trigger: 'hover',
	        placement: 'bottom',
	        html: 'true',
	});  
});

Template.tagItem.helpers({
	mediaList: function() {
		var media = Media.find({'metadata.tags._id': this._id}).fetch();

	    var str = '<div class="tag-count-content">';
		if(media.length > 0) {
			for(var i=0; i < media.length; i++) {
				str += '<img src="' + media[i].url({ store: 'thumb'}) + '">'
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

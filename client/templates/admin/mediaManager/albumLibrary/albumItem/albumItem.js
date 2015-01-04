Template.albumItem.helpers({
  count: function () {
    return this.content.length;
  },
});

Template.albumItem.events({
	// 'click .destroy': function () {
 //      if(confirm("Delete album?")) {
 //        delArr = [this._id];
 //        Albums.remove({_id: { $in: delArr }});
 //      }
 //  	},
  
 //   }
    'click .album-link': function (e) {
        e.preventDefault();
        var curr = Router.current().route.getName(),
            routeTo = 'album';
        if (curr === 'albumManager') {
          routeTo = 'albumEdit';
        } 
        Router.go( routeTo, {_id: this._id});
    }
});
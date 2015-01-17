Media.allow({
      insert: function(userId) {
        return isAdminById(userId);
      },
      update: function(userId) {
        return isAdminById(userId);
      },
      remove: function(userId) {
        return isAdminById(userId);
      },
      download: function(userId) {
        return true;
      },
      fetch: []
    });

 Meteor.publish("media", function(options) {
      return Media.find({}, options, { fields: {"copies.default": 0}});
 });

 Meteor.publish("albumMedia", function(albumSlug, options) { 
      var album = Albums.findOne({slug: albumSlug});

      if (!! album) {
        var visible = !! album.isVisible;

        if (visible || isAdminById(this.userId)) {
          return Media.find({'metadata.albums': { $elemMatch: { _id: album._id} }}, 
                              options, { fields: {'copies.default': 0}});

        } else {
          return null;
        }
      }

 });


 Meteor.publish("mediaTags", function(options) { 
      return Media.find({}, { fields: {"metadata.tags": 1, 'metadata.title': 1, 'original.name': 1}});
 });


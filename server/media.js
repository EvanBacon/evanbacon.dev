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

 // publish all media, omit unnecessary fields
 Meteor.publish("media", function(options) {
      return Media.find({}, options, { fields: {"copies.default": 0}});
 });


 // publish only media in a specific album 
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
 
 // publish all media with a specific tag
 Meteor.publish("tagMedia", function(tagSlug, options) { 
    return Media.find({'metadata.tags.slug': tagSlug}, options, { fields: {'copies.default': 0}});
 });

 // condensed version of media for tags list
 Meteor.publish("mediaTags", function(options) { 
    return Media.find({}, { fields: {"metadata.tags": 1, 'metadata.title': 1, 'original.name': 1}});
 });


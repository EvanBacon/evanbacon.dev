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
 Meteor.publish("mediaList", function(terms) {
    if ( ! isAdminById(this.userId)) 
          throw new Meteor.Error(403, 'Permission denied'); 
    
    check(terms, {
      sort: Object,
      limit: Number,
      searchQuery: String
    });

    var query = new RegExp( terms.searchQuery, 'i' );
    var results = Media.find({$or: [ 
                            {'metadata.title': query},
                            {'metadata.credit': query},
                            {'metadata.caption': query},    
                            {'original.name': query},
                            {'metadata.tags.name': query},
                            {'metadata.albums.title': query}
                           ]}, { sort: terms.sort}, {limit: terms.limit}, { fields: {"copies.default": 0}});

    return results;
 });

 // publish all media thumbnails for selection into an album, omit unnecessary fields
 Meteor.publish("mediaThumbnails", function(options) {
    if ( ! isAdminById(this.userId)) 
        throw new Meteor.Error(403, 'Permission denied'); 
    
    check(options, {
      sort: Object,
    });

    var results = Media.find({}, options, { fields: { "original.name": 1, 
                                                      "metadata": 1, 
                                                      "copies.thumb": 1 }} );
    return results;
 });



 // publish only media in a specific album 
 Meteor.publish("albumMedia", function(options) { 
      check (options, {
        limit: Number,
        slug: String
      });
      var album = Albums.findOne({slug: options.slug});

      if (!! album) {
        var visible = !! album.isVisible;

        if (visible || isAdminById(this.userId)) {
          var mediaIds = [ ];
            for (var i = 0; i < album.content.length; i++) {
                if (i >= options.limit) 
                  break;
                mediaIds.push(album.content[i].id);
            }
            return Media.find({ _id:{ $in: mediaIds }}, { fields: {'copies.default': 0, 'copies.thumb': 0 }});

        } 
      }
      return this.ready();

 });


 // publish only samples of media from every album
 Meteor.publish("albumListMedia", function() { 
      var albums = Albums.find({ isVisible: 1 }, {fields: {'content': 1}}).fetch();

      if (!! albums) {
        var mediaIds = {};
        _.each(albums, function(a) {
            if (!! a.content && a.content.length > 0 ) {

              // obtain the featured image plus sample images for each album
              var featured = _.findWhere(a.content, { isFeatured: 1}),
              featuredId;

              if (!! featured && typeof featured !== undefined && typeof featured.hasOwnProperty('id') ) {
                featuredId = featured.id;
              } else {
                featuredId = a.content[0].id;
              }
                
              var media = Media.find({'metadata.albums._id': a._id}, { fields: {_id: 1}}).fetch();

              featured = _.findWhere(media, { _id: featuredId });
              var count =  getSetting('numberSamplesFromAlbum', 3); // # of samples (including featured)

              // get samples from album, excluding the featured image and any images already included in publication
              var samples = _.sample(_.difference(media, _.union(featured, mediaIds)), --count );

              var union = _.union(samples, featured); 

              mediaIds = _.union(union, mediaIds);

            }
        });
        mediaIds = _.pluck(mediaIds, '_id'); // reduce to an array of ids
        return Media.find({ _id:{ $in: mediaIds }}, { fields: {'copies.image_md': 1, 'metadata': 1, 'uploadedAt': 1}});
      }
      return this.ready();
 });
 
 // publish all media with a specific tag
 Meteor.publish("tagMedia", function(tagSlug, options) { 
    return Media.find({'metadata.tags.slug': tagSlug}, options, { fields: {'copies.default': 0}});
 });

 // condensed version of media for tags list
 Meteor.publish("mediaTags", function(options) { 
    return Media.find({}, { fields: {"metadata.tags": 1, 'metadata.title': 1, 'original.name': 1, "copies.thumb": 1}});
 });


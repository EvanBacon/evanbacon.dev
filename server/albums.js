Albums.allow({
      insert: function(userId) {
        return isAdminById(userId);
      },
      update: function(userId) {
        return isAdminById(userId);
      },
      remove: function(userId) {
        return isAdminById(userId);
      },
      fetch: []
    });

// publish one album by id
Meteor.publish("album", function (id) {
      return Albums.find({_id: id});
});

// publish one album by slug
Meteor.publish("albumBySlug", function (slug) {
    var album = Albums.findOne({ 'slug': slug }, { fields: {isVisible: 1}});
    var isVisible = true;

    // if album found, check if isVisible
    // only return album if it is visible, or if admin user
    if (!! album) isVisible = !! album.isVisible;

    if (!! isVisible || isAdminById(this.userId)) {
      return Albums.find({ 'slug': slug });
    } else {
      return null;
    }
});

// publish all albums if admin, publish all visible albums if non-admin
Meteor.publish("albums", function(options) { 
  if ( isAdminById(this.userId)) {
    return Albums.find({}, options);
  } else {
    return Albums.find({'isVisible': 1}, options);
  }
});

// lightweight publication for albums
Meteor.publish("albumsLight", function() { 
    return Albums.find({'isVisible': 1}, {fields: {'title': 1, 'slug': 1, 'description':1, 'isVisible': 1, 'isShuffled': 1}});
});

Meteor.methods({
    // remove a list of albums
    removeAlbums: function (albums) {
      if (!isAdmin()) 
          throw new Meteor.Error(403, 'Permission denied'); 
      Albums.remove({_id: { $in: albums }});
    },

    // create and initialize an album
    createAlbum: function (content) {
        if (!isAdmin()) 
            throw new Meteor.Error(403, 'Permission denied'); 
        var dataObj = { 
                        'description': '',
                        'slug': '',
                        'content': [],
                        'title': '',
                        'isVisible': 1,
                        'isShuffled': 0,
                        'lastModified': null
                        };
        if (!! content)
            dataObj.content = content;
        var albumId = Albums.insert(dataObj); 
        if (albumId) 
            return albumId;
                
    },

    // update an album
    updateAlbum: function (album) {
        if (!isAdmin()) 
            throw new Meteor.Error(403, 'Permission denied');

        var slug = album.slug;
        if (! slug) { // if a slug was not provided, create one from the title
          slug = slugFuncs.slugify(album.title); 
        }

        slug = slugFuncs.getUniqueSlug(album.id, slug, Albums); // this makes sure the slug is unique, increments if it is not

        var dataObj = { 
                      'content': album.content,
                      'description': album.description,
                      'slug': slug,
                      'title': album.title,
                      'isVisible': album.isVisible,
                      'isShuffled': album.isShuffled,
                      'lastModified': (new Date()).getTime()
                      };

        try {
              Albums.update({ _id: album.id },  
                  { $set: dataObj}
              );
              // update albums list in Media collection
              Media.update({"metadata.albums._id": album.id}, { $pull: { "metadata.albums": { "_id": album.id }}}, {multi: 1});
              var wt = 0; // weight / order of image for sorting
              _.each(album.content, function (item) {
                  Media.update({_id: item.id}, { $push: { "metadata.albums": { _id: album.id, title: album.title, weight: wt }}});
                  wt++; 
              });
        } catch (err) {
            mongoError (err);
        }

    },

    // remove an item/media from all albums in which it's included
    removeFromAlbums: function (itemId) {
        if (!isAdmin()) 
            throw new Meteor.Error(403, 'Permission denied');
        Albums.update({'content.id': itemId}, { $pull: { 'content': {'id': itemId} }});
    },

    // remove any albums that were created but abandoned
    removeUnusedAlbums: function () {
        if (!isAdmin()) 
            throw new Meteor.Error(403, 'Permission denied'); 
        Albums.remove({ slug: "" });
    },

    // toggle if album is visible or not to visitors
    toggleAlbumVisibility: function (id) {
        if (!isAdmin()) 
            throw new Meteor.Error(403, 'Permission denied');
        var obj = Albums.findOne({_id: id}, { fields: {isVisible: 1}}); 
        Albums.update({ _id: id },  
                      { $set: { isVisible: (obj.isVisible ? 0 : 1) }}
        );
    }
});
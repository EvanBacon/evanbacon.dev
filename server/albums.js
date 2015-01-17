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

Meteor.publish("album", function (id) {
      return Albums.find({_id: id});
});

Meteor.publish("albumBySlug", function (slug) {
    var album = Albums.findOne({ 'slug': slug }, { fields: {isVisible: 1}});
    var isVisible = true;
    if (!! album) isVisible = !! album.isVisible;

    if (!! isVisible || isAdminById(this.userId)) {
      return Albums.find({ 'slug': slug });
    } else {
      return null;
    }
});

Meteor.publish("albums", function(options) { 
  if ( isAdminById(this.userId)) {
    return Albums.find({}, options);
  } else {
    return Albums.find({'isVisible': 1}, options);
  }
});

Meteor.publish("albumsLight", function() { 
    return Albums.find({'isVisible': 1}, {fields: {'title': 1, 'slug': 1, 'description':1, 'isVisible': 1, 'isShuffled': 1}});
});

Meteor.methods({
    removeAlbums: function (albums) {
      if (!isAdmin()) 
          throw new Meteor.Error(403, 'Permission denied'); 
      Albums.remove({_id: { $in: albums }});
    },
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
    removeFromAlbums: function (itemId) {
        if (!isAdmin()) 
            throw new Meteor.Error(403, 'Permission denied');
        Albums.update({'content.id': itemId}, { $pull: { 'content': {'id': itemId} }});
    },
    removeUnusedAlbums: function () {
        if (!isAdmin()) 
            throw new Meteor.Error(403, 'Permission denied'); 
        Albums.remove({ slug: "" });
    },
    toggleAlbumVisibility: function (id) {
        if (!isAdmin()) 
            throw new Meteor.Error(403, 'Permission denied');
        var obj = Albums.findOne({_id: id}, { fields: {isVisible: 1}}); 
        Albums.update({ _id: id },  
                      { $set: { isVisible: (obj.isVisible ? 0 : 1) }}
        );
    }
});

// // Fixtures
// if (Albums.find().count() === 0) {

//   Albums._ensureIndex({slug: 1}, {unique: 1});
//   
  

// }
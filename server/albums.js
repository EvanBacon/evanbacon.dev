Albums.allow({
      insert: function(userId) {
        return true;
      },
      update: function(userId) {
        return true;
      },
      remove: function(userId) {
        return true;
      },
      fetch: []
    });

Meteor.publish("album", function (id, options) {
  //if(isAdminById(this.userId)){
    if (!! options && !! id) 
      return Albums.find({ _id: id }, options);
    if (!! id)
      return Albums.find({ _id: id });

    return null;
});

Meteor.publish("albums", function() {
      //if (Authorize.isAdmin) {
    return Albums.find({});
});

Meteor.methods({
    removeAlbums: function (albums) {
      Albums.remove({_id: { $in: albums }});
      // TODO: remove albums from albums too
    },
    createAlbum: function (content) {
        var dataObj = { 
                        'description': '',
                        'slug': '',
                        'title': '',
                        'isVisible': 1,
                        'lastModified': null
                        };
        if (!! content)
            dataObj.content = content;
        var albumId = Albums.insert(dataObj); 
        if (albumId) 
            return albumId;
                
    },
    updateAlbum: function (album) {
        var slug = album.slug;
        if (! slug) { // if a slug was not provided, create one from the title
          slug = albumFuncs.slugify(album.title); 
        }

        slug = albumFuncs.getUniqueSlug(album.id, slug); // this makes sure the slug is unique, increments if it is not

        var dataObj = { 
                      'content': album.content,
                      'description': album.description,
                      'slug': slug,
                      'title': album.title,
                      'isVisible': album.isVisible,
                      'lastModified': (new Date()).getTime()
                      };

        try {
              Albums.update({ _id: album.id },  
                  { $set: dataObj}
              );
              // _.each(album.content, function (c) {
              //     c.id, search and update metadata.albums
              //     Media.update({_id: c.id}, { $push: { "metadata.albums": album.id }}); 
              // });
        } catch (err) {
            mongoError (err);
        }

    },
    removeFromAlbums: function (itemId) {
        Albums.update({ 'content.id': itemId },  
                         { $pull: { content: {'id': itemId} }}
        );
    },
    removeUnusedAlbums: function () {
        Albums.remove({ slug: "" });
    }
});
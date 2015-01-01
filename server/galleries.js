Galleries.allow({
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

Meteor.publish('gallery', function (id, options) {
  //if(isAdminById(this.userId)){
    if (!! options && !! id) 
      return Galleries.find({ _id: id }, options);
    if (!! id)
      return Galleries.find({ _id: id });
  //}
    return null;
});

Meteor.publish("galleries", function() {
      //if (Authorize.isAdmin) {
    return Galleries.find({});
});

Meteor.methods({
    removeGalleries: function (galleries) {
      Galleries.remove({_id: { $in: galleries }});
      // TODO: remove galleries from albums too
    },
    createGallery: function (type, content) {
        var dataObj = { 
                        'description': '',
                        'slug': '',
                        'title': '',
                        'isVisible': 1,
                        //'featuredId': null,
                        'lastModified': null,
                        'type': type 
                        };
        if (!! content)
            dataObj.content = content;
        var galleryId = Galleries.insert(dataObj); 
        if (galleryId) 
            return galleryId;
                
    },
    updateGallery: function (gallery) {
        var slug = gallery.slug;
        if (! slug) { // if a slug was not provided, create one from the title
          slug = galleryFuncs.slugify(gallery.title); 
        }

        slug = galleryFuncs.getUniqueSlug(gallery.id, slug); // this makes sure the slug is unique, increments if it is not

        var dataObj = { 
                      'content': gallery.content,
                      'description': gallery.description,
                      'slug': slug,
                      'title': gallery.title,
                      'isVisible': gallery.isVisible,
                      //'featured': gallery.featured,
                      'lastModified': (new Date()).getTime()
                      };

        try {
              Galleries.update({ _id: gallery.id },  
                  { $set: dataObj}
              );
        } catch (err) {
            mongoError (err);
        }

    },
    removeFromGalleries: function (itemId) {
        Galleries.update({ 'content.id': itemId },  
                         { $pull: { content: {'id': itemId} }}
        );
    },
    removeUnusedGalleries: function () {
        Galleries.remove({ slug: "" });
    }
});
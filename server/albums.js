Works.allow({
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
    return Works.find({_id: id});
});

// publish one album by slug
Meteor.publish("albumBySlug", function (slug) {
    var album = Works.findOne({ 'slug': slug }, { fields: {isVisible: 1, isPerson: 0} });
    var isVisible = true;

    // if album found, check if isVisible
    // only return album if it is visible, or if admin user
    if (!! album) isVisible = !! album.isVisible;

    if (!! isVisible || isAdminById(this.userId)) {
      return Works.find({ 'slug': slug }, {reactive: false});
    }
    return this.ready()
});

// publish all works if admin, publish all visible works if non-admin
Meteor.publish("works", function(options) {
  options = !! options ? options : {};
  options['sort'] = { order: 1};
  if ( isAdminById(this.userId)) {
    return Works.find({}, options);
  }
  return Works.find({'isVisible': 1}, {'isPerson': 0}, options);

});

// lightweight publication for works
Meteor.publish("worksLight", function() {
    //this.unblock(); // don't wait for this publication to finish to proceed
    return Works.find({'isVisible': 1}, {'isPerson': 0}, { sort: { order: 1}}, {fields: {'title': 1, 'slug': 1, 'description':1, 'isVisible': 1, 'isShuffled': 1}});
});

Meteor.methods({
    // remove a list of works
    removeWorks: function (works) {
      if (!isAdmin())
          throw new Meteor.Error(403, 'Permission denied');
      Works.remove({_id: { $in: works }});
    },

    // create and initialize an album
    createAlbum: function (content) {
        if (!isAdmin())
            throw new Meteor.Error(403, 'Permission denied');

        var album = Works.find({}, { sort: {order: -1}}, { limit: 1 }).fetch();
        var newOrderNum = !! album && album.length > 0 ? album[0].order++ : 0;
        var dataObj = {
                        'description': '',
                        'slug': '',
                        'content': [],
                        'title': '',
                        'isVisible': 1,
                        'isShuffled': 0,
                        'lastModified': null,
                        'job': '',
                        'isPerson': 0,
                        'social': {
                          'facebook': '',
                          'twitter': '',
                          'github': '',

                          'linkedIn': '',
                          'codePen': '',

                          'website': '',
                        },
                        'order': newOrderNum
                        };
        if (!! content)
            dataObj.content = content;
        var albumId = Works.insert(dataObj);
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

        slug = slugFuncs.getUniqueSlug(album.id, slug, Works); // this makes sure the slug is unique, increments if it is not

        var dataObj = {
                      'content': album.content,
                      'description': album.description,
                      'slug': slug,
                      'title': album.title,
                      'isVisible': album.isVisible,
                      'job': album.job,
                      'isPerson': album.isPerson,
                      'social': {
                        'facebook': album.social.facebook,
                        'twitter': album.social.twitter,
                        'github': album.social.github,

                        'linkedIn': album.social.linkedIn,
                        'codePen': album.social.codePen,

                        'website': album.social.website,
                      },
                      'isShuffled': album.isShuffled,
                      'lastModified': (new Date()).getTime(),
                      'order': album.order
                      };

        try {
              Works.update({ _id: album.id },
                  { $set: dataObj}
              );
              // update works list in Media collection
              Media.update({"metadata.works._id": album.id}, { $pull: { "metadata.works": { "_id": album.id }}}, {multi: 1});
              var wt = 0; // weight / order of image for sorting
              _.each(album.content, function (item) {
                  Media.update({_id: item.id}, { $push: { "metadata.works": { _id: album.id, title: album.title, weight: wt }}});
                  wt++;
              });
        } catch (err) {
            mongoError (err);
        }

    },

    // update order of works as they will appear on the site
    updateAlbumOrder: function (albumIdList) {
        if (!isAdmin())
            throw new Meteor.Error(403, 'Permission denied');
        try {
            var orderNum = 0;
            _.each(albumIdList, function (id) {
                Works.update({ _id: id },
                  { $set: { order: orderNum }}
                );
                orderNum++;
            });
        } catch (err) {
            mongoError (err);
        }
    },

    // remove an item/media from all works in which it's included
    removeFromWorks: function (itemId) {
        if (!isAdmin())
            throw new Meteor.Error(403, 'Permission denied');
        Works.update({'content.id': itemId}, { $pull: { 'content': {'id': itemId} }}, {multi: 1});
    },

    // remove any works that were created but abandoned
    removeUnusedWorks: function () {
        if (!isAdmin())
            throw new Meteor.Error(403, 'Permission denied');
        Works.remove({ slug: "" });
    },

    // toggle if album is visible or not to visitors
    toggleAlbumVisibility: function (id) {
        if (!isAdmin())
            throw new Meteor.Error(403, 'Permission denied');
        var obj = Works.findOne({_id: id}, { fields: {isVisible: 1}});
        Works.update({ _id: id },
                      { $set: { isVisible: (obj.isVisible ? 0 : 1) }}
        );
    },

    // toggle if album is Person or not to go into atelier
    toggleAlbumPerson: function (id) {
        if (!isAdmin())
            throw new Meteor.Error(403, 'Permission denied');
        var obj = Works.findOne({_id: id}, { fields: {isPerson: 1}});
        Works.update({ _id: id },
                      { $set: { isPerson: (obj.isPerson ? 0 : 1) }}
        );
    }
});

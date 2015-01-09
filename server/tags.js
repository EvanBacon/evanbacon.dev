Tags.allow({
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

Meteor.publish("tag", function (id, options) {
    // if (!! isVisible || isAdminById(this.userId)) {
      if (!! options && !! id) 
          return Tags.find({ _id: id }, options);
      if (!! id)
          return Tags.find({ _id: id });
    // } else {
    //   return null;
    // }
});

Meteor.publish("tags", function(options) { 
  if(!! options)
    return Tags.find({}, options);
  else
    return Tags.find({});
});

Meteor.methods({
    removeTags: function (tags) {
      if (!isAdmin()) 
          throw new Meteor.Error(403, 'Permission denied'); 
      Tags.remove({_id: { $in: tags }});
    },
    addTag: function (tagName, mediaId) {
        if (! isAdmin()) 
            throw new Meteor.Error(403, 'Permission denied'); 

        if (! Validation.isNotEmpty(tagName))
            throw new Meteor.Error(413, 'Tag name cannot be empty.');
        tagName = tagName.toLowerCase();

        var tag = Tags.findOne({name: tagName}),
            tagId = !! tag && tag._id,
            media = Media.findOne(mediaId),
            tagSlug = !! tag && tag.slug;

        if (! tagId) {
           tagSlug = slugFuncs.getUniqueSlug(tagId, tagName, Tags);
           tagId = Tags.insert({ 'name': tagName, 'slug': tagSlug });
        }

        if(getIndexOf(media.metadata.tags, tagId) < 0)
           Media.update({_id: mediaId}, { $push: { 'metadata.tags': { '_id': tagId, 'name': tagName, 'slug': tagSlug }}});
                
    },
    removeTag: function (tagId, mediaId) {
        Media.update({_id: mediaId}, { $pull: { 'metadata.tags': {'_id': tagId}}});
    },
    removeFromMedia: function (tagId) {
        if (! isAdmin()) 
            throw new Meteor.Error(403, 'Permission denied');
        Media.update({'metadata.tags._id': tagId}, { $pull: { 'metadata.tags': {'_id': tagId} }});
    },
});

// Fixtures
if (Tags.find().count() === 0) {

  Tags._ensureIndex({name: 1}, {unique: 1});
  
  
  Tags.insert( 
    { 
      name: 'storms',
      slug: 'storms' 
    }
  );

  Tags.insert( 
    { 
      name: '2014', 
      slug: '2014'
    }
  );

  Tags.insert( 
    { 
      name: '2013',
      slug: '2013' 
    }
  );

  Tags.insert( 
    { 
      name: 'kansas',
      slug: 'kansas' 
    }
  );
}
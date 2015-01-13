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
      if (!! options && !! id) 
          return Tags.find({ _id: id }, options);
      if (!! id)
          return Tags.find({ _id: id });
});

Meteor.publish("tags", function(options) { 
  if(!! options)
    return Tags.find({}, options);
  else
    return Tags.find({});
});

Meteor.methods({
    addNewTag: function (tagName) {
        if (! isAdmin()) 
            throw new Meteor.Error(403, 'Permission denied'); 

        if (! Validation.isNotEmpty(tagName))
            throw new Meteor.Error(413, 'Tag name cannot be empty.');
        tagName = tagName.toLowerCase();

        var tag = Tags.findOne({name: tagName}),
            tagId = !! tag && tag._id,
            tagSlug = !! tag && tag.slug;

        if (! tagId) {
           tagSlug = slugFuncs.getUniqueSlug(tagId, tagName, Tags);
           tagId = Tags.insert({ 'name': tagName, 'slug': tagSlug });
        } 

        return { _id: tagId, name: tagName, slug: tagSlug };     
    },
    addTag: function (tagName, mediaId) {
        if (! isAdmin()) 
            throw new Meteor.Error(403, 'Permission denied'); 

        var tag = this.addNewTag(tagName);

        if(getIndexOf(media.metadata.tags, tag._id) < 0) {
           Media.update({_id: mediaId}, { $push: { 'metadata.tags': { '_id': tag._id, 'name': tag.name, 'slug': tag.slug }}});
        } 

    },
    updateTag: function (tagId, tagName) {
        if (! isAdmin()) 
            throw new Meteor.Error(403, 'Permission denied'); 

        if (! Validation.isNotEmpty(tagName))
            throw new Meteor.Error(413, 'Tag name cannot be empty.');
        tagName = tagName.toLowerCase();

        var tagsCount = Tags.find({$and: [{_id: { $ne: tagId }}, {name: tagName}]}).count();

        if (tagsCount < 1) {
           tagSlug = slugFuncs.getUniqueSlug(tagId, tagName, Tags);
           Tags.update({ _id: tagId }, { $set: {'name': tagName, 'slug': tagSlug }});
           Media.update({ 'metadata.tags._id': tagId}, {$set: {'metadata.tags.$.name' : tagName,
                                                               'metadata.tags.$.slug' : tagSlug }});

        } else {
          throw new Meteor.Error(413, 'Tag name "' + tagName + '" already exists.');
        }
    },
    removeTagFromMediaId: function (tagId, mediaId) { 
        if (!isAdmin()) 
          throw new Meteor.Error(403, 'Permission denied'); 
        Media.update({_id: mediaId}, { $pull: { 'metadata.tags': {'_id': tagId}}});
    },
    removeTag: function (tagId, mediaId) {
        if (!isAdmin()) 
          throw new Meteor.Error(403, 'Permission denied');
        Media.update({'metadata.tags._id': tagId}, { $pull: { 'metadata.tags': {'_id': tagId} }});
        Tags.remove({_id: tagId});
    }
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
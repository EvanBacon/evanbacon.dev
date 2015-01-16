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
        var content = album.content,
            images = [],
            visible = !! album.isVisible;

        if (visible || isAdminById(this.userId)) {
          _.each(content, function (c) {
              images.push(c.id);
          });

          return Media.find({ _id: { $in: images }}, options);
        } else {
          return null;
        }
      }

 });

 Meteor.publish("mediaTags", function(options) { 
      return Media.find({}, { fields: {"metadata.tags": 1, 'metadata.title': 1, 'original.name': 1}});
 });

Meteor.methods({
      // uploadMedia: function(asset) {
      //   Media.insert(asset, function (err, fileObj) { 
      //     if(err) Meteor._debug(err); 
      //     else Meteor._debug(fileObj._id);
      //   });   
      // },
      // removeAssets: function(assets) {
      //   if (!isAdmin()) 
      //     throw new Meteor.Error(403, 'Permission denied'); 
      //   Media.remove({_id: { $in: assets }});
      // },
      getSortedMedia: function(albumId, limit) {
          var album = Albums.findOne(albumId);
          var content = album.content,
              images = [],
              results = [];

          _.each(list, function (c) {
              images.push(c.id);
          });

          for(var i = 0; i < content.length; i++)
            results.push(null);

          var list = _.pluck(content, "id");
          _.each(Media.find({}, { fields: {'copies.image_lg': 1, 'copies.image_md': 1, 'metadata': 1}}).fetch(), function (m) {
            var index = list.indexOf(m._id);
            results[index] = m;
          });
          console.log(results);
          return results.slice(0, limit);


          // var images = [],
          //     weightCond = [],
          //     wtCount = 0;

          // _.each(list, function (c) {
          //     images.push(c.id);
          // });

          // var stack = [];

          // for ( var i = images.length-1; i > 0; i-- ) {
          //     var rec = {
          //         "$cond": [
          //             { "$eq": [ "$_id", images[i-1] ] },
          //             i
          //         ]
          //     };
          //     if ( stack.length == 0 ) {
          //         rec["$cond"].push( i+1 );
          //     } else {
          //         var lval = stack.pop();
          //         rec["$cond"].push( lval );
          //     }
          //     stack.push( rec );
          // }

          // var pipeline = [
          //   {
          //     $match: { _id: { $in: images }}
          //   }, 
          //   {
          //     $project: {
          //       "weight": stack[0],
          //       "metadata.caption": 1,
          //       "metadata.title": 1,
          //       "metadata.credit": 1,
          //       "copies.image_lg": 1,
          //       "copies.image_md": 1
          //     }
          //   },
          //   {
          //     $sort: {"weight": 1}
          //   }
          // ];

          // return Media.aggregate(pipeline);
      }
});

   


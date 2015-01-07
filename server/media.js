Media.allow({
      insert: function(userId) {
        return true;
      },
      update: function(userId) {
        return true;
      },
      remove: function(userId) {
        return true;
      },
      download: function(userId) {
        return true;
      },
      fetch: []
    });

 Meteor.publish("media", function(options) {
      //if (Authorize.isAdmin) {
      return Media.find({}, options, { fields: {"copies.default": 0}});
 });

 Meteor.publish("albumMedia", function(albumId, options) {
      //if (Authorize.isAdmin) {
      var album = Albums.findOne(albumId);
      var content = album.content,
          images = [];

      _.each(content, function (c) {
          images.push(c.id);
      });

      return Media.find({ _id: { $in: images }}, options);

 });

Meteor.methods({
      uploadMedia: function(asset) {
        Media.insert(asset, function (err, fileObj) { 
          if(err) Meteor._debug(err); 
          else Meteor._debug(fileObj._id);
        });   
      },
      removeAssets: function(assets) {
        Media.remove({_id: { $in: assets }});
      },
      updateMedia: function(options) {
        // if(!Meteor.user())
        //   throw new Meteor.Error();
        gm(200, 400, "#ddff99f3").drawText(10, 50, "from scratch").write("/watermarks/newimg.jpg", function (err) {});


        var fileObj = Media.findOne(options.id);

        var readStream = fileObj.createReadStream('default');

        var writeStream = fileObj.createWriteStream('image_md');
        gm(readStream, fileObj.name({store: 'default'})).drawText(20, 20, 'Copyright', 'center').stream().pipe(writeStream);
      },
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

   


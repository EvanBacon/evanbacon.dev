var AdminPages = [
                    'mediaManager',
                    'albumManager', 
                    'albumEdit',
                    'profile' 
                 ];

// var UserPagesSecure = [
//                     'profile'
//                     ];

var routerFilters = {
    isLoggedIn: function (pause) {
      if (Meteor.loggingIn()) {
        this.render(this.loadingTemplate);
      } else {
        AccountsTemplates.ensureSignedIn.call(this, pause);
      }
    }  
}; 


AlbumController = RouteController.extend({
    template: 'album',
    increment: 20, 
    limit: function() { 
      return parseInt(this.params.limit) || this.increment; 
    },
    findOptions: function() {
      return {limit: this.limit()};
    },
    album: function () {
      return Albums.findOne(this.params._id);
    },
    items: function () {
      return Media.find({}, this.findOptions());
    },
    subscriptions: function() {  
      this.itemsSub = Meteor.subscribe('albumMedia', this.params._id, this.findOptions());  
    },
    waitOn: function () {
      return Meteor.subscribe('album', this.params._id);
    },
    data: function() {  
        var hasMore = this.items().count() === this.limit();    
        var nextPath = this.route.path({_id: this.params._id, limit: this.limit() + this.increment}); 

        return {   
            album: this.album(), 
            items: this.items(),
            ready: this.itemsSub.ready(),   
            nextPath: hasMore ? nextPath : null 
        };  
    }
  });

  MediaListController = RouteController.extend({
	  template: 'mediaManager',
	  increment: 24, 
	  limit: function() { 
	    return parseInt(this.params.limit) || this.increment; 
	  },
	  findOptions: function() {
	    return {sort: {'uploadedAt': -1}, limit: this.limit()};
	  },
    items: function () {
        var sortBy = SortAction.getSortBy(),
            sortAndLimit;

        if (sortBy) 
          sortAndLimit = {sort: sortBy, limit: this.limit()};
        else
          sortAndLimit = {limit: this.limit()};

        var keyword = GetSearch(),
            query = new RegExp( keyword, 'i' );
     
        var results = Media.find({ $or: [ 
                                      {'metadata.title': query},
                                      {'metadata.credit': query},
                                      {'metadata.caption': query},    
                                      {'original.name': query},
                                     ]}, sortAndLimit );

        return results;

    },
    subscriptions: function() {    
      this.itemsSub = Meteor.subscribe('media', this.findOptions());  
    },
	  data: function() {  
	     	var hasMore = this.items().count() === this.limit(); 
        var nextPath = this.route.path({limit: this.limit() + this.increment}); 

	     	return {  
            items: this.items(),  
		        ready: this.itemsSub.ready(),   
		        nextPath: hasMore ? nextPath : null 
	     	};  
	  }

	});

  AlbumEditController = RouteController.extend({
    template: 'albumEdit',
    findOptions: function() {
      return {sort: {'uploadedAt': -1}};
    },
    album: function () {
      return Albums.findOne(this.params._id);
    },
    mediaItems: function() {
      var keyword = GetSearch(),
          query = new RegExp( keyword, 'i' ),
          results;

      results = Media.find({ $or: [ 
                                  {'metadata.title': query},
                                  {'metadata.credit': query},
                                  {'metadata.caption': query},    
                                  {'original.name': query},
                                 ]} );
        
      return results;

    },
    waitOn: function () {
      return [Meteor.subscribe('media', this.findOptions()), Meteor.subscribe('album', this.params._id)];
    },
    data: function() {  
        return {  
            mediaItems: this.mediaItems(),   
            album: this.album()    
        };  
    }

  });

  AlbumListController = RouteController.extend({
    template: 'albumManager',
    increment: 20, 
    limit: function() { 
      return parseInt(this.params.limit) || this.increment; 
    },
    findOptions: function() {
      return {limit: this.limit()};
    },
    items: function () {
        var keyword = GetSearch(),
            query = new RegExp( keyword, 'i' ),
            results;

        results = Albums.find({ $or: [ 
                                       {'title': query},
                                       {'description': query},
                                     ]
                              });
        
        return results;

    },
    onBeforeAction: function () {
        Meteor.call('removeUnusedAlbums'); // clear out any unsaved (abandoned) albums
        this.next();
    },
    subscriptions: function() {    
      this.itemsSub = Meteor.subscribe('albums', this.findOptions()); 
    },
    data: function() {  
        var hasMore = this.items().count() === this.limit();    
        var nextPath = this.route.path({limit: this.limit() + this.increment});     
        return {   
            items: this.items(),
            ready: this.itemsSub.ready(),   
            nextPath: hasMore ? nextPath : null 
        };   
    }

  });



Router.configure({
      layoutTemplate: 'layout',
      loadingTemplate: 'loading',
      notFoundTemplate: 'notFound',
      yieldTemplates: {
        'header': { to: 'header' },
        // 'footer': { to: 'footer' },
      },
      waitOn: function () {
        // return _.map(preloadSubscriptions, function(sub){
        //   // can either pass strings or objects with subName and subArguments properties
        //   if (typeof sub === 'object'){
        //     Meteor.subscribe(sub.subName, sub.subArguments);
        //   }else{
        //     Meteor.subscribe(sub);
        //   }
        // });
      }
    });

    //Router.onBeforeAction(IR_BeforeHooks.setLayout);
      
    // Router.onBeforeAction(function () {
    //   IR_BeforeHooks.setLayout(this);
    //   this.next();
    // });
    Router.onBeforeAction('dataNotFound');
    Router.onBeforeAction(routerFilters.isLoggedIn, {only: AdminPages})
    //Router.onBeforeAction(AccountsTemplates.ensureSignedIn, {only: AdminPages}); //.concat(UserPagesSecure)});
    Router.onBeforeAction(function() { pageChanged(false); this.next() });
    
	/**
    * Homepage
    * Path: /
    * Redirects user on login.
    */
    Router.route('/', {
      name: 'home',
      path: '/',
      template: 'home',
    });

    /**
    * Album Page
    * Path: /album/:_id/:limit
    * Page for viewing album images
    */
    Router.route('/album/:_id/:limit?', {
      name          : 'album',
      path          : '/album/:_id/:limit?',
      controller    : AlbumController
    });

    /**
    * Albums 
    * Path: /albums/:limit
    * Default page for albums
    */
    Router.route('/albums/:limit?', {
      name          : 'albums',
      template      : 'albums',
      path          : '/albums/:limit?',
      controller    : AlbumListController
    });


    // /**
    // * Gallery Edit Page
    // * Path: /admin/media-manager/gallery-edit/:_id
    // * Default page for editing a gallery and the media within it
    // */
    // Router.route('/admin/gallery-edit/:_id', {
    //   name          : 'galleryEdit',
    //   path          : '/admin/gallery-edit/:_id',
    //   controller    : GalleryEditController
    // });

   /**
    * Album Edit Page
    * Path: /admin/media-manager/album-edit/:_id
    * Default page for editing a album and the media within it
    */
    Router.route('/admin/album-edit/:_id/edit', {
      name          : 'albumEdit',
      path          : '/admin/album-edit/:_id/edit',
      controller    : AlbumEditController
    });

   /**
    * Media Library 
    * Path: /admin/media-manager/:limit
    * Default page for viewing, adding and editing images
    */
    Router.route('/admin/media-manager/', {
      name          : 'mediaManager',
      path          : '/admin/media-manager/:limit?',
      controller    : MediaListController
    });

  // /**
  //   * Gallery Library 
  //   * Path: /admin/gallery-manager/:limit
  //   * Default page for viewing, adding galleries
  //   */
  //   Router.route('/admin/gallery-manager/', {
  //     name          : 'galleryManager',
  //     path          : '/admin/gallery-manager/:limit?',
  //     controller    : GalleryListController
  //   });

  /**
    * Album Library 
    * Path: /admin/album-manager/:limit
    * Default page for viewing, adding albums
    */
    Router.route('/admin/album-manager/', {
      name          : 'albumManager',
      template      : 'albumManager',
      path          : '/admin/album-manager/:limit?',
      controller    : AlbumListController
    });

  
    Router.route('/sign-out', {
      name: 'signOut',
      template: 'home',
      onBeforeAction: function() {
        Meteor.logout(function() {
        });
        this.next();
      }
    });

    /**
    * Not Found
    * Path: *
    * Send any undefined routes here
    */
    Router.route('*', {
      path            : '*',
      template        : 'notFound'
    });



    
var AdminPages = [
                    'mediaManager',
                    'albumManager', 
                    'albumEdit',
                    'profile' 
                 ];


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
    increment: getSetting('mediaPerPage', 30),
    limit: function() { 
      return parseInt(this.params.limit) || this.increment; 
    },
    findOptions: function() {
      return {limit: this.limit()};
    },
    metadata: function() {
      var album = Albums.findOne({slug: this.params.slug});
      if (!! album)
        return { title      : capitalize(album.title) + 'Album', 
                 description: capitalize(album.title) + ' Photo Album - Built with Meteor.js' };
    },
    album: function () {
      return Albums.findOne({slug: this.params.slug});
    },
    items: function () {
      return Media.find({}, this.findOptions());
    },
    subscriptions: function() {  
      this.itemsSub = Meteor.subscribe('albumMedia', this.params.slug, this.findOptions());  
    },
    waitOn: function () {
     // return Meteor.subscribe('albumBySlug', this.params.slug);
      return Meteor.subscribe('albumLinks');
    },
    onAfterAction: function () {
      if (!Albums.findOne({slug: this.params.slug}))
        this.render('notFound');
      else this.render();
    },
    data: function() {  
        var hasMore = this.items().count() === this.limit();    
        var nextPath = this.route.path({slug: this.params.slug, limit: this.limit() + this.increment}); 

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
	  increment: getSetting('mediaPerPage', 30),
	  limit: function() { 
	    return parseInt(this.params.limit) || this.increment; 
	  },
	  findOptions: function() {
	    return {sort: {'uploadedAt': -1}, limit: this.limit()};
	  },
    metadata: function() {
      return { title: 'Media Library', description: ''}
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
                                      {'metadata.tags.name': query},
                                     ]}, sortAndLimit );

        return results;

    },
    subscriptions: function() {    
      this.itemsSub = Meteor.subscribe('media', this.findOptions());  
    },
    waitOn: function () {
      return Meteor.subscribe('tags');
    },
	  data: function() {  
	     	var hasMore = this.items().count() === this.limit(); 
        var nextPath = this.route.path({limit: this.limit() + this.increment}); 

	     	return {  
            //tags:  this.tags(), 
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
    metadata: function() {
      return { title: 'Edit Album', description: ''}
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
    increment: getSetting('mediaPerPage', 30), 
    limit: function() { 
      return parseInt(this.params.limit) || this.increment; 
    },
    findOptions: function() {
      return {limit: this.limit()};
    },
    metadata: function() {
      return { title: 'Albums', description: 'Photo gallery built with Meteor.js'}
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
      // if(isAdmin())
      //   Meteor.call('removeUnusedAlbums'); // clear out any unsaved (abandoned) albums
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
        return Meteor.subscribe('settings');
        // return _.map(preloadSubscriptions, function(sub){
        //   // can either pass strings or objects with subName and subArguments properties
        //   if (typeof sub === 'object'){
        //     Meteor.subscribe(sub.subName, sub.subArguments);
        //   }else{
        //     Meteor.subscribe(sub);
        //   }
        // });
      },
      onAfterAction: function() {
        // set metadata
        if (typeof this.metadata() !== undefined && !! this.metadata()) {
            var meta = this.metadata();
            $('title').text(getSetting('seoTitle') + ' :: ' + meta.title);
            $('meta[name=description]').attr('content', meta.description);
        } else {
            $('title').text(getSetting('seoTitle'));
            $('meta[name=description]').attr('content', getSetting('seoDescription'));
        }
      }
    });

Router.plugin('dataNotFound', {notFoundTemplate: 'notFound'});

    //Router.onBeforeAction(IR_BeforeHooks.setLayout);
      
    // Router.onBeforeAction(function () {
    //   IR_BeforeHooks.setLayout(this);
    //   this.next();
    // });

Router.onBeforeAction(routerFilters.isLoggedIn, {only: AdminPages})
Router.onBeforeAction(function() { pageChanged(false); this.next() });
Router.onBeforeAction('dataNotFound');

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
    Router.route('/album/:slug/:limit?', {
      name          : 'album',
      path          : '/album/:slug/:limit?',
      controller    : AlbumController
    });

   /**
    * Album Edit Page
    * Path: /admin/media-manager/album-edit/:_id
    * Default page for editing a album and the media within it
    */
    Router.route('/admin/album/:_id/edit', {
      name          : 'albumEdit',
      path          : '/admin/album/:_id/edit',
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

    /**
    * Site Settings 
    * Path: /admin/settings
    * View / Edit settings form
    */
    Router.route('/admin/settings', {
      name          : 'settings',
      template      : 'settingsManager',
      path          : '/admin/settings',
      metadata: function () {
        return { title: 'Settings', description: ''};
      },
      data: function () {
        return {
          hasSettings: !!Settings.find().count(),
          settings: Settings.findOne()
        }
      }
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

    /**
    * Not Found
    * Path: *
    * Send any undefined routes here
    */
    Router.route('*', {
      path            : '*',
      template        : 'notFound',
      name            : 'notFound'
    });



    
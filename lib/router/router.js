var AdminPages = [
                    'dashboard',
                    'mediaManager',
                    'albumManager',
                    'tagManager', 
                    'albumEdit',
                    'settings',
                    'profile' 
                 ];


var routerFilters = {
    isLoggedIn: function (pause) {
      if (Meteor.loggingIn()) {
        this.render(this.loadingTemplate);
      } else {
        AccountsTemplates.ensureSignedIn.call(this, pause);
      }
    },
    hasAdmin: function (pause) {
        Meteor.call('hasAdmin', function (err, result) {
            if (!err && !result) // if no admin user detected, go to registration page
                Router.go('registration');
        });
        this.next();
    },
    resetScroll: function () {
      // if(Meteor.isClient) {
        $('#main').scrollTop(0);
      // }
    }
  
}; 


// Controllers

BaseRouteController = RouteController.extend({
   fastRender: true
});

SettingsController = BaseRouteController.extend({
    metadata: function () {
        return { title: 'Settings', description: null};
    },
    data: function () {
        return {
          hasSettings: !!Settings.find().count(),
          settings: Settings.findOne()
        }
    }
});

AlbumController = BaseRouteController.extend({
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
        return { title       : capitalize(album.title) + ' Album', 
                 description : capitalize(album.title) };
    },
    album: function () {
      return Albums.findOne({slug: this.params.slug});
    },
    items: function () {
      var sortAndLimit = { sort: { 'metadata.albums.weight': -1 }, limit: this.limit() };
      return Media.find({}, sortAndLimit);
    },
    subscriptions: function() {  
      var options = this.findOptions();
      options.slug = this.params.slug;
      this.itemsSub = Meteor.subscribe('albumMedia', options);  
    },
    onAfterAction: function () {
      if (Meteor.isClient) {
        var albumTitle = '',
            album = Albums.findOne({slug: this.params.slug}); 
        if ( !! album && !! album.title)
           albumTitle = album.title;
        if (Session.get('album-title') !== albumTitle && albumTitle !== '' ) {
           Session.set('album-changed', true);
           Session.set('album-title', albumTitle);
           routerFilters.resetScroll();
        }
      }
    },
    data: function() {  
        var hasMore = this.items().count() === this.limit();    
        var nextPath = this.route.path({slug: this.params.slug, limit: this.limit() + this.increment}); 

        return {   
            album: this.album(), 
            items: this.items(),
            count: this.items().count(),
            ready: this.itemsSub.ready(),   
            nextPath: hasMore ? nextPath : null,
        };  
    }
  });

AlbumGroupsController = BaseRouteController.extend({
    waitOn: function () {
      return [ Meteor.subscribe('albums'), Meteor.subscribe('albumListMedia') ];
    },
  });

// retrieve and display all images assigned a given tag
TagMediaController = BaseRouteController.extend({
    template: 'album',
    increment: getSetting('mediaPerPage', 30),
    limit: function() { 
      return parseInt(this.params.limit) || this.increment; 
    },
    findOptions: function() {
      return {limit: this.limit()};
    },
    metadata: function() {
      var tag = Tags.findOne({slug: this.params.slug});
      if (!! tag)
        return { title       : capitalize(tag.name) + ' Tag', 
                 description : capitalize(tag.name) };
    },
    tag: function () {
      return Tags.findOne({slug: this.params.slug});
    },
    items: function () {
      return Media.find({}, this.findOptions());
    },
    subscriptions: function() {  
      this.itemsSub = Meteor.subscribe('tagMedia', this.params.slug, this.findOptions());  
    },
    onAfterAction: function () {
      if (!Media.findOne({'metadata.tags.slug': this.params.slug}))
        this.render('loading');
      else this.render();
      if (Meteor.isClient) {
        var tagTitle = '',
            tag = Tags.findOne({slug: this.params.slug}); 
        if ( !! tag && !! tag.name)
           tagTitle = tag.title;
        if (Session.get('album-title') !== tagTitle && tagTitle !== '' ) {
           Session.set('album-changed', true);
           Session.set('album-title', tagTitle);
           routerFilters.resetScroll();
        }
      }
    },
    data: function() {  
        var hasMore = this.items().count() === this.limit();    
        var nextPath = this.route.path({slug: this.params.slug, limit: this.limit() + this.increment}); 

        return {   
            tag: this.tag(), 
            items: this.items(),
            count: this.items().count(),
            ready: this.itemsSub.ready(),   
            nextPath: hasMore ? nextPath : null 
        };  
    }
  });


MediaListController = BaseRouteController.extend({
	  template: 'mediaManager',
	  increment: getSetting('mediaPerPage', 20),
	  limit: function() { 
	    return parseInt(this.params.limit) || this.increment; 
	  },
    metadata: function() {
      return { title: 'Media Library', description: null}
    },
    findOptions: function() {
      var sortBy = '',
          sortAndLimit;
      if(Meteor.isClient) {
        sortBy = SortAction.getSortBy();
      }

      if (!! sortBy) 
        sortAndLimit = {sort: sortBy, limit: this.limit()};
      else
        sortAndLimit = {sort: {'uploadedAt': -1}, limit: this.limit()};

      return sortAndLimit;
      
    },
    items: function () {
        return Media.find({}, this.findOptions());
    },
    onAfterAction: function () {
      if (this.limit() === this.increment) { 
          routerFilters.resetScroll();
      }
    },
    subscriptions: function() {  

      var terms = this.findOptions();
      terms.searchQuery = '';
      if(Meteor.isClient) {
        terms.searchQuery = GetSearch() || '';
      }

      this.itemsSub = Meteor.subscribe('mediaList', terms);  
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

AlbumEditController = BaseRouteController.extend({
    template: 'albumEdit',
    findOptions: function() {
      return { sort: { 'uploadedAt': -1 } };
    },
    album: function () {
      return Albums.findOne(this.params._id);
    },
    metadata: function() {
      return { title: 'Edit Album', description: null}
    },
    mediaItems: function() {
       var keyword = '',
            query = '',
            results;
      if(Meteor.isClient) {
          keyword = GetSearch();
          query = new RegExp( keyword, 'i');
      }
        

      results = Media.find({ $or: [ 
                                  {'metadata.title': query},
                                  {'metadata.credit': query},
                                  {'metadata.caption': query},
                                  {'metadata.tags.name': query},    
                                  {'original.name': query},
                                 ]} );
      
      return results;
    

    },
    waitOn: function () {
      return [Meteor.subscribe('mediaThumbnails', this.findOptions()), Meteor.subscribe('album', this.params._id)];
    },
    data: function() {  
        return {  
            mediaItems: this.mediaItems(),   
            album: this.album()    
        };  
    }

  });

AlbumListController = BaseRouteController.extend({
    template: 'albumManager',
    findOptions: function() {
      return { sort: { order: 1 }};
    },
    metadata: function() {
      return { title: 'Albums', description: null};
    },
    items: function () {
      var keyword = '',
            query = '',
            results;
      if(Meteor.isClient) {
          keyword = GetSearch();
          query = new RegExp( keyword, 'i');
      }
      results = Albums.find({ $or: [ 
                                     {'title': query},
                                     {'description': query},
                                   ]
                            }, this.findOptions());
      
      return results;
      

    },
    subscriptions: function() {    
      this.itemsSub = Meteor.subscribe('albums', this.findOptions()); 
    },
    data: function() {      
        return {   
            items: this.items(),
        };   
    }

  });

TagListController = BaseRouteController.extend({
    template: 'tagManager',
    metadata: function() {
      return { title: 'Tags', description: null };
    },
    tags: function () {
      var sortBy = '',
          sortObj,
          query = '',
          results;
      if(Meteor.isClient) {
        sortBy = SortAction.getSortBy();
        query = new RegExp( GetSearch(), 'i' );
      }

      if (!! sortBy) 
        sortObj = { sort: sortBy };

      results = Tags.find({'name': query}, sortObj );
      
      return results;
      

    },
    waitOn: function () {
      return [ Meteor.subscribe('mediaTags') ];
    },
    data: function() {  
        return {
          tags: this.tags()
        }  
    }

  });

  Router.configure({
      layoutTemplate: 'layout',
      loadingTemplate: 'loading',
      notFoundTemplate: 'notFound',
      yieldTemplates: {
        'header': { to: 'header' },
        'footer': { to: 'footer' },
      },
      waitOn: function () {
        return [ Meteor.subscribe('albumsLight'), Meteor.subscribe('settings'), Meteor.subscribe('tags')];
      }
    });

    Router.onBeforeAction(routerFilters.isLoggedIn, {only: AdminPages});
    Router.onBeforeAction(routerFilters.hasAdmin);
    Router.onBeforeAction(function() { if(Meteor.isClient) { pageChanged(false); } this.next() });

    Router.onAfterAction(function() {
        // set metadata
        var title = getSetting('title'),
            description = getSetting('siteDescription');

        if (typeof this.metadata === 'function' && !! this.metadata()) {
          var meta = this.metadata();
          
          title += !! meta.title ? ' / ' + meta.title : '';   
          description = !! meta.description ? meta.description : description; 

        } else {
          var name = Router.current().route.getName();
          if (name !== 'home') {
            name = capitalize(name.replace(/\W+/g, ' ').replace('-', ' '));
          } else {
            name = description;
          }
          title = title + ' / ' + name;
        }
        if(Meteor.isClient) {
          $('title').text(title);
          $('meta[name=description]').attr('content', description);
        }
        
        var favicon = getSetting('faviconUrl');
        if (!! favicon && Meteor.isClient) {

          var ext = favicon.split('.').pop().toLowerCase().split('?')[0];

          if($.inArray(ext, ['gif','png','jpg','jpeg', 'ico']) > -1) {
            $("#favicon").attr("type","image/" + ext);
            $("#favicon").attr("href", favicon);
          }
        }
        
    });

    // go to top of page (except routes that employ pagination)
    Router.onAfterAction(function() {
      routerFilters.resetScroll();
    }, { except: ['mediaManager', 'album', 'tag']}); 

    if(Meteor.isServer) {
      FastRender.onAllRoutes(function() {
        this.subscribe('settings');
        this.subscribe('albumsLight');
        this.subscribe('tags');
      });
    }

// Routes

	/**
    * Homepage
    * Path: /
    * Redirects user on login.
    */
    Router.route('/', {
      name          : 'home',
      path          : '/',
      template      : 'home',
      layoutTemplate: 'layoutNoHeaders',
      controller    : AlbumGroupsController
    });

  /**
    * Album Page
    * Path: /album/:slug/:limit
    * Page for viewing album images
    */
    Router.route('/album/:slug/:limit?', {
      name          : 'album',
      path          : '/album/:slug/:limit?',
      controller    : AlbumController
    });

  /**
    * Tag Page
    * Path: /tag/:slug/:limit
    * Page for viewing images labeled by a tag
    */
    Router.route('/tag/:slug/:limit?', {
      name          : 'tag',
      path          : '/tag/:slug/:limit?',
      controller    : TagMediaController
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
    * Tags Library 
    * Path: /admin/tag-manager/
    * Default page for viewing, adding/removing tags
    */
    Router.route('/admin/tag-manager/', {
      name          : 'tagManager',
      template      : 'tagManager',
      path          : '/admin/tag-manager/',
      controller    : TagListController
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
      controller    : SettingsController
    });

  /**
    * Dashboard  
    * Path: /admin
    * Default admin landing page
    */
    Router.route('/admin', {
      path          : '/admin',
      onBeforeAction: function () {
         Router.go('mediaManager');
         this.next();
      },
    });
  
    /**
    * Contact Page 
    * Path: /contact
    * Contact form
    */
    Router.route('/contact', {
      name          : 'contact',
      template      : 'contact',
      path          : '/contact'
    });

    /**
    * About Page 
    * Path: /about
    * About information
    */
    Router.route('/about', {
      name          : 'about',
      template      : 'about',
      path          : '/about'
    });

  
    Router.route('/sign-out', {
      name: 'signOut',
      template: 'home',
      onBeforeAction: function() {
        Meteor.logout(function() {});
        Router.go('home');
        this.next();
      }
    });

    /**
    * Registration Page (only show for first admin)
    * Path: /first-time-register
    * Registration page for admin
    */
    Router.route('/first-time-register', {
      name          : 'registration',
      template      : 'registration',
      layoutTemplate: 'layoutNoHeaders',
      onBeforeAction: function() {
          Meteor.call('hasAdmin', function (err, result) {
              if (!err && result) // if admin user detected, go to sign-in page
                  Router.go('atSignIn');
          });
          this.next();
      },
      path          : '/first-time-register'
    });

  /**
    * Albums 
    * Path: /albums/:limit
    * Default page for albums
    */
    Router.route('/albums', {
      name          : 'albums',
      template      : 'albums',
      path          : '/albums',
      controller    : AlbumGroupsController
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

    
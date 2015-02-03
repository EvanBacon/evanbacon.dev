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
      $('#main').animate({
          scrollTop: 0
      }, 600);
    }
  
}; 


// Controllers

SettingsController = RouteController.extend({
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
      this.itemsSub = Meteor.subscribe('albumMedia', this.params.slug, this.findOptions());  
    },
    onAfterAction: function () {
      if (!Albums.findOne({slug: this.params.slug}))
        this.render('loading');
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

AlbumGroupsController = RouteController.extend({
    waitOn: function () {
      return [ Meteor.subscribe('albums'), Meteor.subscribe('media') ];
    },
  });


TagController = RouteController.extend({
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
    },
    data: function() {  
        var hasMore = this.items().count() === this.limit();    
        var nextPath = this.route.path({slug: this.params.slug, limit: this.limit() + this.increment}); 

        return {   
            tag: this.tag(), 
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
	    return { sort: {'uploadedAt': -1}, limit: this.limit() };
	  },
    metadata: function() {
      return { title: 'Media Library', description: null}
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
                                      {'metadata.albums.title': query}
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
      return { sort: { 'uploadedAt': -1 } };
    },
    album: function () {
      return Albums.findOne(this.params._id);
    },
    metadata: function() {
      return { title: 'Edit Album', description: null}
    },
    mediaItems: function() {
      var keyword = GetSearch(),
          query = new RegExp( keyword, 'i' ),
          results;

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
      return { limit: this.limit() };
    },
    metadata: function() {
      return { title: 'Albums', description: null}
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

TagListController = RouteController.extend({
    template: 'tagManager',
    metadata: function() {
      return { title: 'Tags', description: null };
    },
    tags: function () {
      var sortBy = SortAction.getSortBy(),
          sortObj;

      if (sortBy) 
        sortObj = { sort: sortBy };

      var query = new RegExp( GetSearch(), 'i' ),
          results;

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
        return [ Meteor.subscribe('settings'), Meteor.subscribe('albumsLight'), Meteor.subscribe('tags')];
      },
    });



    Router.plugin('dataNotFound', {notFoundTemplate: 'notFound'});

    Router.onBeforeAction(routerFilters.isLoggedIn, {only: AdminPages});
    Router.onBeforeAction(routerFilters.hasAdmin);
    Router.onBeforeAction(function() { pageChanged(false); this.next() });

    Router.onBeforeAction('dataNotFound');

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
        $('title').text(title);
        $('meta[name=description]').attr('content', description);
        
        var favicon = getSetting('faviconUrl');
        if (!! favicon) {

          var ext = favicon.split('.').pop().toLowerCase().split('?')[0];

          if($.inArray(ext, ['gif','png','jpg','jpeg', 'ico']) > -1) {
            $("#favicon").attr("type","image/" + ext);
            $("#favicon").attr("href", favicon);
          }
        }
        
    });

    // go to top of page (except routes that employ pagination)
    Router.onAfterAction(routerFilters.resetScroll, { except: ['mediaManager', 'album']}); 



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
      controller    : TagController
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
      }
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

    
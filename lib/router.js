	MediaListController = RouteController.extend({
	  template: 'mediaManager',
	  increment: 36, 
	  limit: function() { 
	    return parseInt(this.params.limit) || this.increment; 
	  },
	  findOptions: function() {
	    return {sort: {'uploadedAt': -1}, limit: this.limit()};
	  },
	  nextPath: function () {
	    return this.route.path({limit: this.limit() + this.increment})
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
     
        results = Media.find({ $or: [ 
                                      {'metadata.title': query},
                                      {'metadata.credit': query},
                                      {'metadata.caption': query},    
                                      {'original.name': query},
                                     ]}, sortAndLimit );

        return results;

    },
	  waitOn: function () {
	    return [ Meteor.subscribe('media', this.findOptions()), Meteor.subscribe('galleries') ];
	  },
	  data: function() {  
	     	var hasMore = this.items().count() === this.limit();       
	     	return {  
            items: this.items(),  
		        ready: this.ready(),   
		        nextPath: hasMore ? this.nextPath() : null 
	     	};  
	  }

	});

  GalleryEditController = RouteController.extend({
    template: 'galleryEdit',
    findOptions: function() {
      return {sort: {'uploadedAt': -1}};
    },
    gallery: function () {
      return Galleries.findOne(this.params._id);
    },
    mediaItems: function() {
       var results = Media.find({});
      return results;
    },
    waitOn: function () {
      return [Meteor.subscribe('media', this.findOptions()), Meteor.subscribe('gallery', this.params._id)];
    },
    data: function() {  
              
        return {  
            mediaItems: this.mediaItems(),   
            gallery: this.gallery()    
        };  
    }

  });

  GalleryListController = RouteController.extend({
    template: 'galleryManager',
    increment: 36, 
    limit: function() { 
      return parseInt(this.params.limit) || this.increment; 
    },
    nextPath: function () {
      return this.route.path({limit: this.limit() + this.increment})
    },
    items: function () {
        var keyword = GetSearch(),
        query = new RegExp( keyword, 'i' ),
        results;

        results = Galleries.find({ $or: [ 
                                     {'title': query},
                                     {'description': query},
                                    ]});
        
        return results;

    },
    onBeforeAction: function () {
        Meteor.call('removeUnusedGalleries'); // clear out any unsaved (abandoned) galleries
        this.next();
    },
    waitOn: function () {
      return Meteor.subscribe('galleries');
    },
    data: function() {  
        var hasMore = this.items().count() === this.limit();       
        return {  
            items: this.items(),  
            ready: this.ready(),   
            nextPath: hasMore ? this.nextPath() : null
        };  
    }

  });

  AlbumListController = RouteController.extend({
    template: 'albumManager',
    increment: 36, 
    limit: function() { 
      return parseInt(this.params.limit) || this.increment; 
    },
    nextPath: function () {
      return this.route.path({limit: this.limit() + this.increment})
    },
    items: function () {
        // var keyword = GetSearch(),
        // query = new RegExp( keyword, 'i' ),
        // results;

        // results = Albums.find({ $or: [ 
        //                              {'title': query},
        //                              {'description': query},
        //                             ]});
        
        // return results;

    },
    waitOn: function () {
      //return Meteor.subscribe('albums');
    },
    data: function() {  
        // var hasMore = this.items().count() === this.limit();       
        // return {  
        //     items: this.items(),  
        //     ready: this.ready(),   
        //     nextPath: hasMore ? this.nextPath() : null
        // };  
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
      },
      onBeforeAction: function () {
        // this.render("loading");
        //Alerts.removeSeen();
        // if(currentPath().split('/')[1] === 'admin') {
        //     if (!Meteor.user()) {
        //       this.layout = 'layout_no_header';
        //     }
        //     Session.set('header-template', 'headerAdmin');
        // }
        // else Session.set('header-template', 'headerGeneral');
        this.next();
      }
    });

    //Router.onBeforeAction(IR_BeforeHooks.setLayout);
      
    // Router.onBeforeAction(function () {
    //   IR_BeforeHooks.setLayout(this);
    //   this.next();
    // });
   // Router.onBeforeAction('dataNotFound');
    // Router.onBeforeAction(AccountsTemplates.ensureSignedIn, {only: AdminPages.concat(UserPagesSecure)});
    // Router.onBeforeAction(routerFilters.isAdmin, {only: AdminPages})
    // Router.onBeforeAction(function() { clearErrors(); pageChanged(false); this.next() });
    
	/**
    * Homepage
    * Path: /
    * Redirects user on login.
    */
    Router.route('/', {
      name: 'home',
      path: '/',
      template: 'home'
    });

    /**
    * Gallery Edit Page
    * Path: /admin/media-manager/gallery-edit/:_id
    * Default page for editing a gallery and the media within it
    */
    Router.route('/admin/media-manager/gallery-edit/:_id', {
      name          : 'galleryEdit',
      path          : '/admin/media-manager/gallery-edit/:_id',
      controller    : GalleryEditController
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
    * Gallery Library 
    * Path: /admin/gallery-manager/:limit
    * Default page for viewing, adding galleries
    */
    Router.route('/admin/gallery-manager/', {
      name          : 'galleryManager',
      path          : '/admin/gallery-manager/:limit?',
      controller    : GalleryListController
    });

  /**
    * Album Library 
    * Path: /admin/album-manager/:limit
    * Default page for viewing, adding albums
    */
    Router.route('/admin/album-manager/', {
      name          : 'albumManager',
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



    
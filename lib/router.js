	MediaListController = RouteController.extend({
	  template: 'mediaManager',
	  increment: 36, 
	  limit: function() { 
	    return parseInt(this.params.mediaLimit) || this.increment; 
	  },
	  findOptions: function() {
	    return {sort: {'uploadedAt': -1}, limit: this.limit()};
	  },
	  nextPath: function () {
	    return this.route.path({mediaLimit: this.limit() + this.increment})
	  },
	  mediaItems: function() {
	    var keyword = GetSearch();
	    var sortBy = SortAction.getSortBy();
	    var sortAndLimit;

	    if (sortBy) 
	      sortAndLimit = {sort: sortBy, limit: this.limit()};
	    else
	      sortAndLimit = {limit: this.limit()};

	    
	    var query = new RegExp( keyword, 'i' );
	 
	    var results = Media.find({ $or: [ 
				                            {'metadata.title': query},
				                            {'metadata.credit': query},
				                            {'metadata.caption': query},    
				                            {'original.name': query},
	                             		 ]}, sortAndLimit );
	    return results;
	  },
    galleryItems: function() {
      var keyword = GetSearch();
      var query = new RegExp( keyword, 'i' );
   
      var results = Galleries.find({ $or: [ 
                                    {'title': query},
                                    {'description': query},
                                  ]});
      return results;
    },
	  waitOn: function () {
	    return [ Meteor.subscribe('media', this.findOptions()), Meteor.subscribe('galleries') ];
	  },
	  data: function() {  
	     	var hasMore = this.mediaItems().count() === this.limit();       
	     	return {  
	     		  mediaItems: this.mediaItems(),
            galleryItems: this.galleryItems(),   
		        ready: this.ready(),   
		      //  nextPath: hasMore ? this.nextPath() : null
	     		//nextPath: hasMore ? nextPath : null    
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
          //nextPath: hasMore ? nextPath : null    
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
    * Media Library / Media Manager
    * Path: /admin/media-manager/:limit
    * Default page for viewing, adding and editing images
    */
    Router.route('/admin/media-manager/gallery-edit/:_id', {
      name          : 'galleryEdit',
      path          : '/admin/media-manager/gallery-edit/:_id',
      controller    : GalleryEditController
    });

   /**
    * Media Library / Media Manager
    * Path: /admin/media-manager/:limit
    * Default page for viewing, adding and editing images
    */
    Router.route('/admin/media-manager/', {
      name          : 'mediaManager',
      path          : '/admin/media-manager/:mediaLimit?',
      controller    : MediaListController
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



    
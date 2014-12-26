Template.galleryList.rendered = function () {
    SortAction.setSortBy( null );
    // $("[rel='tooltip']").tooltip();    
 
    $('.thumbnail').hover(
        function(){
            $(this).find('.caption').slideDown(250); //.fadeIn(250)
        },
        function(){
            $(this).find('.caption').slideUp(250); //.fadeOut(205)
        }
    ); 
};

Template.galleryList.helpers({
    isList: function () {
        return Session.equals('gallery-list-style', 'list');
    },
}); 


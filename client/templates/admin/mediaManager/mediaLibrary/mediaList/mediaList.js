Template.mediaList.rendered = function () {
    SortAction.setSortBy( { "uploadedAt": -1 } );   
 
    $('.thumbnail').hover(
        function(){
            $(this).find('.caption').slideDown(250); //.fadeIn(250)
        },
        function(){
            $(this).find('.caption').slideUp(250); //.fadeOut(205)
        }
    ); 
};

Template.mediaList.helpers({
    isList: function () {
        return Session.equals('media-list-style', 'list');
    }
}); 


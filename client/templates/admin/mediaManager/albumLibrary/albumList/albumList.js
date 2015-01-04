Template.albumList.rendered = function () {
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

Template.albumList.helpers({
    isList: function () {
        return Session.equals('album-list-style', 'list');
    },
}); 


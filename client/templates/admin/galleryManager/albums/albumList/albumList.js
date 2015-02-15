var gridsort = null;

var updatePosition = function (){
    $('#gridsort li').each(function(i){
        $(this).html(i + 1);
    });
};

Template.albumList.rendered = function () {
	$( "#gridsort" ).sortable({
		placeholder: "highlight",
        stop: function( ) {
            var ids = [];

            $('#gridsort li').each(function(i){
		        ids.push($(this).find('input').attr('id'));
		    });

		    Meteor.call('updateAlbumOrder', ids, function (err) { 
            	if (err) console.log(err);
       		});
        }
    });
    $('#gridsort').disableSelection();

	$('#gridsort').on( 'remove', 'li', updatePosition );
};

Template.flickr.rendered = function() {
  $(function(){

    var id='65018117@N02';
    var limit ='20';

    // Flickr Photostream feed link.
    $.getJSON("https://api.flickr.com/services/feeds/photos_public.gne?id=" + id + "&lang=en-us&format=json&jsoncallback=?",

    function(data){$.each(data.items,

    function(i,item){

        // Number of thumbnails to show.
        if(i < limit){

        // Create images and append to div id flickr and wrap link around the image.
        // $("<div class='backgroundImage'></div>").attr("style", 'height: 150px; width: 100%; background-image:url("' + item.media.m.replace('_m', '_s') + '");').appendTo("#flickr").wrap("<div class='col-xs-6 col-md-3 col-lg-2'><a href='" + item.media.m.replace('_m', '_z') + "' name='"+ item.link + "' title='" +  item.title +"'></a></div>");



        var overlay = "<div class='overlay'><h3>" + item.title + "</h3></div>"
        var base = "<div class='backgroundImage'>" + overlay + "</div>";
        var a =  "<a href='" + item.media.m + "' name='"+ item.link + "' title='" +  item.title +"'></a>";
        var d =  "<div class='col-xs-6 col-md-3 col-lg-2'>" + a + "</div>";


        $(base).attr("style", 'height: 150px; width: 100%; background-image:url("' + item.media.m + '");').appendTo("#flickr").wrap(d);


        }

    });

    });

    });
};

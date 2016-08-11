Template.atelierCard.helpers({
    image: function() {
      console.log("img",this.imageData[0].thumb);
      return this.imageData[0].thumb;
    },

});

Template.atelierCard.rendered = function() {
  $(document).ready(function() {

        $('.material-card > .mc-btn-action').click(function () {
          console.log("clicked");
            var card = $(this).parent('.material-card');
            var icon = $(this).children('i');
            icon.addClass('fa-spin-fast');

            if (card.hasClass('mc-active')) {
                card.removeClass('mc-active');

                window.setTimeout(function() {
                    icon
                        .removeClass('fa-arrow-left')
                        .removeClass('fa-spin-fast')
                        .addClass('fa-bars');

                }, 800);
            } else {
              console.log("other clicked");
                card.addClass('mc-active');

                window.setTimeout(function() {
                    icon
                        .removeClass('fa-bars')
                        .removeClass('fa-spin-fast')
                        .addClass('fa-arrow-left');

                }, 800);
            }
        });
    });
};

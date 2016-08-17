Template.atelier.helpers({
	items: function () {
		//initGrid();
		console.log("atelier",Works.find({}));
		return Works.find({});
	}
});
Template.atelier.rendered = function() {
  $(document).ready(function() {
        $('.material-card > .mc-btn-action').click(function () {

						$('.material-card > .mc-btn-action').not(this).each(function(){
							var card = $(this).parent('.material-card');
							var icon = $(this).children('i');

							if (card.hasClass('mc-active')) {
									icon.addClass('fa-spin-fast');
									card.removeClass('mc-active');

									window.setTimeout(function() {
											icon
													.removeClass('fa-arrow-left')
													.removeClass('fa-spin-fast')
													.addClass('fa-bars');

									}, 800);
							}
				      });

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

// add/remove classes to hide/revealing items

var itemReveal = Isotope.Item.prototype.reveal;
Isotope.Item.prototype.reveal = function() {
  itemReveal.apply( this, arguments );
  $( this.element ).removeClass('isotope-hidden');
};

var itemHide = Isotope.Item.prototype.hide;
Isotope.Item.prototype.hide = function() {
  itemHide.apply( this, arguments );
  $( this.element ).addClass('isotope-hidden');
};

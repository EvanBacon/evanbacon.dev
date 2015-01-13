Template.tagError.helpers({
    error: function () {
        return Session.get('tag-error');
    }
});

Template.tagError.events({
    'click .close': function (e) {
        Session.set('tag-error', null);
    }
});
Template.skills.helpers({
  skills: function() {
    return [ "Prototyping",
    "Swift",
    "Objective-C",
    "Java",
    "Android",
    "iOS",
    "JavaScript",
    "React",
    "Meteor",
    "HTML5",
    "CSS3",
    "ES6",
    "Python",
    "Sketch",
    "Illustrator",
    "Photoshop",
    "Art",
    "Structure",
    "Form",
    "Design",
    "Interaction",
    "Analysis",
    "Presenting",
  ];
},

});


Template.skills.events({
  'click .button-open': function(e) {
    console.log("click");
    // e.preventDefault();
    if ($('#action-container').hasClass('closed')) {
      this.value = "See More";
    } else {
      this.value = "See Less";
    }
    $('#action-container').toggleClass('closed');
  },
});

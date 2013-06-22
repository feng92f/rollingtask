define(['modules/dash/templates','Backbone'],function(Templates, Backbone){

  var DocumentRow = Backbone.View.extend({
    tagName: "li",
    className: "document-row",
    template: Templates.dashboard,
    events: {
    },
    initialize: function() {
      this.listenTo(this.model, "change", this.render);
    }
  });

  return {
    DocumentRow : DocumentRow
  }


});

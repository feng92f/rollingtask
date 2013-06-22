define(['modules/dash/templates','Backbone','PageTransitions','Marionette'],function(Templates, Backbone, PageTransitions){

  var Dash = Backbone.Marionette.ItemView.extend({
    template: Templates.dashboard,
    events: {
    },
    initialize: function() {
      // this.listenTo(this.model, "change", this.render);
    }
  });

  var Guide = Backbone.Marionette.ItemView.extend({
    template: Templates.guide,
    events: {
    },
    initialize: function() {
      // this.listenTo(this.model, "change", this.render);
    },
    onShow: function(){
      PageTransitions.init('#pt-main');
    },
    onClose: function(){
      PageTransitions.unbind();
    }
  });

  var Detail = Backbone.Marionette.ItemView.extend({
    template: Templates.detail,
    events: {
    },
    initialize: function() {
      // this.listenTo(this.model, "change", this.render);
    },
    onShow: function(){
    }
  });

  return {
    Dash    : Dash,
    Guide   : Guide,
    Detail  : Detail
  }


});

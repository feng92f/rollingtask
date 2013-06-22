define(['modules/modal/templates','Backbone','Marionette', 'jquery', 'snap','AppScroll'],function(Templates, Backbone, Marionette, $, Snap, AppScroll){

  var LoadingView = Marionette.ItemView.extend({
    template: Templates.Loading,
    className:'query-inner',
    events:{
      'click .js-close' : "cloze"
    },
    cloze: function(){
      this.trigger('down');
    }
  });

  return {
    LoadingView : LoadingView
  }

});

define(['modules/query/templates','Backbone','Marionette', 'jquery', 'snap','AppScroll'],function(Templates, Backbone, Marionette, $, Snap, AppScroll){

  var DetailView = Marionette.ItemView.extend({
    className:'query-inner',
    template: Templates.Detail,
    initialize: function(options){
        console.log(options,'***************************');
        var el   = $(this.el);
        var that = this;
        this.model = options.model;
        this.listenTo(this.model, "change", this.render);
        this.id = setTimeout(function(){
          if(that.model.get('id') == 0){
            el.find('.content').html('404');
            el.find('.word_pro').html('sorry');
          }
        },5000);
    },
    events:{
      'click .js-close' : "cloze"
    },
    cloze: function(){
      this.trigger('down');
    },
    onShow: function() {
      console.log('show DetailView');
      this.scroller = new AppScroll({
        toolbar: document.getElementsByClassName('app-header')[0],
        scroller: document.getElementById('query-main')
      });
      this.scroller.on();
    }
  });

  var EmptyView = Marionette.ItemView.extend({
    template: Templates.Empty,
    className:'query-inner',
    events:{
      'click .js-close' : "cloze"
    },
    cloze: function(){
      this.trigger('down');
    },
    onShow: function() {
    }
  });

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
    DetailView  : DetailView,
    LoadingView : LoadingView,
    EmptyView   : EmptyView
  }

});

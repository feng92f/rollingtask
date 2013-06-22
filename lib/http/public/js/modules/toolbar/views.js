define(['modules/toolbar/templates',
    'Backbone',
    'FastClick',
    'Marionette'],function(Templates, Backbone, FastClick){

  var Toolbar = Backbone.Marionette.ItemView.extend({
    template: Templates.Toolbar,
    events: {
      'click .app-header':"toggle_left",
      'keypress input':"search"
    },
    search:function(e){
      if(e.charCode !== 13) return;
      var val = $(this.el).find('input').val();
      this.trigger('query',{push:true, title:val});
    },
    initialize: function() {
      //this.listenTo(this.model, "change", this.render);
      this.left_open = true;
    },
    left:function(){
        App.trigger('open:left');
        this.left_open = true;
    },
    right:function(){
        App.trigger('open:right');
        this.left_open = false;
    },
    close:function(){
        App.trigger('open:close');
        this.left_open = false;
    },
    toggle_left: function(){

        if(App.env == 'desktop') return;

        if(this.left_open){
          this.close();
        }else{
          this.left();
        }
    },
    onShow:function(){
      var dom = $(this.el).get()[0];
      FastClick.attach(dom);
      //bind toolbar actions
    }
  });

  return {
    Toolbar:Toolbar
  }

});

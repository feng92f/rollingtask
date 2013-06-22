define(['modules/inbox/templates','Backbone','Marionette', 'jquery', 'snap','AppScroll'],function(Templates, Backbone, Marionette, $, Snap, AppScroll){

  var ItemView = Marionette.ItemView.extend({
    tagName:'li',
    template: Templates.Item,
    events:{
      'click .js-forget' : "details",
      'click .js-commit'  : "commit",
    },
    initialize: function(){
      //this.listenTo(this.model, "change", this.render);
    },
    left: function(){
      // data sync
      $(this.el).addClass('open-left');
      this.snapper.open('left');
    },
    right: function(){
      $(this.el).addClass('open-right');
      this.snapper.open('right');
    },
    commit:function(e){

      var that = this;
      //提交单词
      setTimeout(function(){
        var collection = that.model.collection;
        that.model.save({action:'commit'}).done(function(m){
          collection.remove(that.model);
        });
      },2000);
      this.left();
    },
    details:function(e){
      App.vent.trigger('query',this.model.toJSON());
      var that = this;
      var collection = this.model.collection;
      var loop = this.model.get('loop') || 0;
      loop++;
      this.model.set('loop',loop);
      //推迟提交
      setTimeout(function(){
        collection.remove(that.model);
        collection.add(that.model);
      },3000);
      this.right();
    },
    onShow: function() {
      this.snapper = new Snap({
          element: document.getElementById('item-' + this.model.get('object_id')),
          disable: 'none',
          addBodyClasses: false,
          resistance: 0,
          flickThreshold: 5,
          easing: 'ease',
          maxPosition: 216,
          minPosition: -216,
          transitionSpeed:0.3,
          tapToClose: false,
          touchToDrag: false
      });
    }
  });

  var ListView = Marionette.CompositeView.extend({
    itemView: ItemView,
    template: Templates.List,
    initialize: function(){
      //this.listenTo(this.model, "change", this.render);
    },
    appendHtml: function(collectionView, itemView, index){
              collectionView.$el.find("ul").append(itemView.el);
    },
    remove: function(){
        //List view remove
        this.scroller.off();
    },
    onShow: function() {
        this.scroller = new AppScroll({
          toolbar: document.getElementsByClassName('app-header')[0],
          scroller: document.getElementById('main')
        });
        this.scroller.on();
    }
  });

  var WelcomeView = Marionette.ItemView.extend({
    events:{
    },
    template: Templates.Welcome,
    onShow: function() {
    }
  });

  return {
    ListView : ListView,
    WelcomeView : WelcomeView
  }


});

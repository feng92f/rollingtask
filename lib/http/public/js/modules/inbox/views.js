define(['modules/inbox/templates','Backbone','Marionette', 'jquery', 'snap','PageTransitions','AppScroll'],function(Templates, Backbone, Marionette, $, Snap, PageTransitions, AppScroll){

  var ItemView = Marionette.ItemView.extend({
    className:'pt-page',
    template: Templates.Item,
    events:{
    },
    initialize: function(){
      //this.listenTo(this.model, "change", this.render);
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
      //$(this.el).data('uuid',this.model.get('object_id'));
      $(this.el).addClass('pt-page-' + Math.ceil(Math.random()*6))
      $(this.el).data('uuid',this.model.get('object_id'));
    }
  });

  var ListView = Marionette.CompositeView.extend({
    itemView: ItemView,
    template: Templates.List,
    events:{
    },
    forget: function(e){
        this.collection.trigger('forget',{title:'apple'});
    },
    commit: function(e){
        console.log(e);
    },
    initialize: function(){
      //this.listenTo(this.model, "change", this.render);
    },
    appendHtml: function(collectionView, itemView, index){
        collectionView.$el.find("#pt-main").append(itemView.el);
    },
    onShow: function(){
      PageTransitions.init('#pt-main');
      var that = this;

      $(this.el).on('click',function(e){
        var action,current,model,uuid;

        action  = $(e.target).data('action');
        current = $(that.el).find('.pt-page-current');
        uuid   = $(current).data('uuid');

        model = that.collection.find(function(m){
          return m.get('object_id') == uuid;
        });

        if(action == 'forget'){
          console.log(model.toJSON());
          that.collection.trigger('forget',model.toJSON());
        }else{
          PageTransitions.next(26);
        }

        return false;
      });

    },
    onClose: function(){
      PageTransitions.unbind();
      $(this.el).off('click');
      // this.scroller.off();
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

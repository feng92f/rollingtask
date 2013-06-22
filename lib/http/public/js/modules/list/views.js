define(['modules/list/templates','Backbone','Marionette', 'jquery', 'snap',  'AppScroll', 'sly'],function(Templates, Backbone, Marionette, $, Snap, AppScroll){

  var ItemView = Marionette.ItemView.extend({
    tagName:'li',
    template: Templates.Item,
    events:{
      //'click .delete':'delete_list'
    },
    delete_list:function(e){
      this.model.destroy({
        success: function(model, response) { console.log('del'); }
      });
    },
    onShow: function() {
    }
  });

  var DetailView = Marionette.ItemView.extend({
    tagName:'li',
    template: Templates.Detail,
    onShow: function() {
    }
  });


  var FinishView = Marionette.ItemView.extend({
    template: Templates.Finish,
    onShow: function() {
    }
  });

  var EditView = Marionette.ItemView.extend({
    events:{
      'click .save':"save"
    },
    template: Templates.Edit,
    save:function(e){

      var title = $(this.el).find('#list-title').val();
      var desc = $(this.el).find('#list-desc').val();
      var content = $(this.el).find('#list-content').val();

      this.model.save({
        content:content,
        desc:desc,
        title:title
      });

    },
    onShow: function() {
    }
  });

  var WelcomeView = Marionette.ItemView.extend({
    events:{
    },
    template: Templates.Welcome,
    onShow: function() {
    }
  });

  var ListView = Marionette.CompositeView.extend({
    itemView: ItemView,
    template: Templates.List,
    initialize: function(){
      //this.listenTo(this.model, "change", this.render);
    },
    appendHtml: function(collectionView, itemView, index){
        collectionView.$el.find("ul").prepend(itemView.el);
    },
    onShow: function() {
        $('#main').css('overflow-y','auto');
        this.scroller = new AppScroll({
          toolbar: document.getElementsByClassName('app-header')[0],
          scroller: document.getElementById('inbox-list')
        });
        this.scroller.on();
    },
    onClose: function(){
        $('#main').css('overflow-y','hidden');
    }
  });


  return {
    ListView    : ListView,
    ItemView    : ItemView,
    WelcomeView : WelcomeView,
    EditView    : EditView,
    FinishView  : FinishView,
    DetailView  : DetailView
  }


});

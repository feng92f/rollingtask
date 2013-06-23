define(['modules/notes/templates','Backbone','Marionette', 'jquery', 'snap','AppScroll'],function(Templates, Backbone, Marionette, $, Snap, AppScroll){

  var ItemView = Marionette.ItemView.extend({
    tagName:'tr',
    events:{
      'click .js-redo':'redo',
      'click .js-view':'view'
    },
    template: Templates.Item,
    initialize: function(options){
      this.listenTo(options.model, "change", this.render);
      this.refresh_id = setInterval(function(){
       if(options.model.get('state') == 'complete') return;
       options.model.fetch();
      },5000);
    },
    view: function(){
      App.trigger('check',{model:this.model});
    },
    redo: function(){
              console.log('redo');
      this.model.change_to_inactive();
    },
    onShow: function() {
      console.log('on show');
    },
    onClose: function(){
       if(this.refresh_id){
         clearInterval(this.refresh_id);
       }
    }
  });

  var ListView = Marionette.CompositeView.extend({
    itemView: ItemView,
    template: Templates.List,
    initialize: function(options){
      //this.listenTo(this.model, "change", this.render);
        this.refresh = setInterval(function(){
          options.collection.fetch({remove: false});
          //options.collection.fetch({reset: true});
        },10000)
    },
    appendHtml: function(collectionView, itemView, index){
        collectionView.$el.find("tbody").prepend(itemView.el);
    },
    remove: function(){
        //List view remove
        this.scroller.off();
    },
    onShow: function() {
        var that = this;
        $('#main').css('overflow-y','auto');
        this.scroller = new AppScroll({
          toolbar: document.getElementsByClassName('app-header')[0],
          scroller: document.getElementById('note-list')
        });
        this.scroller.on();

        $(this.el).on('click','.js-redo-all',function(e){
          that.collection.each(function(model){
              if(model.change_to_inactive){
                  model.change_to_inactive();
              }
          });
        })

        $(this.el).on('click','.js-delete-all',function(e){
          console.log(that.collection.length);
          that.collection.each(function(model){
              if(model.get('state') !== 'failed'){
                return;
              }
              setTimeout(function(){
                  model.destroy();
                  that.collection.remove(model);
              },0)
          });
        })

    },
    onClose: function(){
        clearInterval(this.refresh);
        $('#main').css('overflow-y','hidden');
    }
  });

  var EmptyView = Marionette.ItemView.extend({
    className:'query-inner',
    template: Templates.Empty,
    events:{
      'click .js-close' : "cloze"
    },
    initialize: function(){
      this.listenTo(this.model, "change", this.render);
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


  return {
    ListView    : ListView,
    ItemView    : ItemView,
    EmptyView   : EmptyView
  }


});

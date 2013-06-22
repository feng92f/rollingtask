define(['modules/karma/templates','Backbone','Marionette', 'jquery', 'AppScroll','snap','sly'],function(Templates, Backbone, Marionette, $, AppScroll,Snap){

  var ItemView = Marionette.ItemView.extend({
    tagName:'li',
    template: Templates.Item,
    onShow: function() {
    }
  });

  var DetailView = Marionette.ItemView.extend({
    events:{
    },
    template: Templates.Detail,
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
        if(this.$frame){
          this.$frame.sly('toStart');
        }
        collectionView.$el.find("ul").prepend(itemView.el);
    },
    onClose: function() {
      $('#main').css('overflow-y','hidden');
    },
    onShow: function() {
      $('#main').css('overflow-y','auto');
      this.scroller = new AppScroll({
        toolbar: document.getElementsByClassName('app-header')[0],
        scroller: document.getElementById('main')
      });
      this.scroller.on();

      return;
      var ul = document.getElementById('inbox-list');
      var that = this;

      var $frame  = $('#smart');
      var height = $('#main').height();

      $frame.css('height',height - 40);
      $('.scrollbar').css('height',height - 40);

      var $slidee = $frame.children('ul').eq(0);
      var $wrap   = $frame.parent();

      this.$frame = $frame;

      // Call Sly on frame
      $frame.sly({
        itemNav: 'basic',
        smart: 1,
        mouseDragging: 0,
        touchDragging: 1,
        releaseSwing: 1,
        startAt: 1,
        scrollBar: $wrap.find('.scrollbar'),
        scrollBy: 1,
        speed: 100,
        elasticBounds: 1,
        easing: 'easeOutExpo',
        dragHandle: 1,
        dynamicHandle: 1,
        clickBar: 1,

        // Buttons
      });

      $frame.sly('toStart');

    },
    onClose: function() {
      this.scroller.off();
    }
  });


  return {
    ListView : ListView,
    ItemView : ItemView,
    DetailView : DetailView
  }


});

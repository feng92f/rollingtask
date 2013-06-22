define(['modules/panel/templates',
    'Backbone',
    'jquery',
    'snap',
    'FastClick',
    'Marionette'],function(Templates, Backbone, $, Snap, FastClick){

    var snap = new Snap({
        element: document.getElementById('content'),
        disable: 'right',
        maxPosition: 240,
        minPosition: - 280,
        transitionSpeed: 0.25,
        easing: 'ease',
        tapToClose: false,
        touchToDrag: false,
        slideIntent: 0
      });

      snap.on('drag', function(){

      }).on('animated', function(){

      });

      snap.open('left');

  var LeftPanel = Backbone.Marionette.ItemView.extend({
    template: Templates.LeftPanel,
    events: {
      "click li a":"select"
    },
    select:function(e){
          var hash = $(e.target).data('router');
          this.trigger('switch', {router:hash});
    },
    initialize: function() {
      this.listenTo(this.model, "change", this.render);
    },
    open:function(r){
      //this.snap.open(r);
    },
    onShow: function() {
      var dom = $(this.el).get()[0];
      FastClick.attach(dom);
    }


  });

  var RightPanel = Backbone.Marionette.ItemView.extend({
    template: Templates.RightPanel,
    events: {
    },
    initialize: function() {
      //this.listenTo(this.model, "change", this.render);
    },
    onShow: function() {
    }
  });

  return {
    Snap:snap,
    LeftPanel:LeftPanel,
    RightPanel:RightPanel
  }

});

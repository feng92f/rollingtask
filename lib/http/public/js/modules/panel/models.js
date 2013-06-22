define(['Backbone'],function(Backbone){

  var Nav = Backbone.Model.extend({

    url:'stats',
    initialize: function() {
      this.fetch();
      var that = this;

      setInterval(function(){
        that.fetch();
      },5000);
    },
    defaults:{
        activeCount: 0,
        completeCount: 0,
        delayedCount: 0,
        failedCount: 0,
        inactiveCount: 0,
        workTime: 0
    }

  });


  return {
    Nav        : Nav,
  }


});

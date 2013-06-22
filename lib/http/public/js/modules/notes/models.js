define(['Backbone'],function(Backbone){

  var Job = Backbone.Model.extend({
    idAttribute: "id",
    url:function(){
        if(this.get('id')){
          return 'job/' + this.get('id')
        }
    },
    initialize: function() {
    },
    defaults:{
      error:'',
      data:{},
      failed_at:''
    },
    change_to_inactive: function() {
      if(this.get('state') == 'failed' || this.get('state') == 'active' ){
        var temp = this.url;
        this.url = temp.call(this) + "/state/inactive";
        this.set('state','inactive').save();
        this.url = temp;
      }
    }

  });

  var List = Backbone.Collection.extend({
    url: function(){
    },
    model:Job,
    initialize: function(models,options) {
    }

  });

  return {
    List        : List,
    Item        : Job
  }


});

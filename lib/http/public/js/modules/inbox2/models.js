define(['Backbone'],function(Backbone){

  var Note = Backbone.Model.extend({
    idAttribute: "object_id",
    url:function(){
        if(this.get('object_id')){
          return 'api/v2/note/' + this.get('object_id')
        }else{
          return 'api/v2/note';
        }
    },
    initialize: function() {
    }
  });

  var List = Backbone.Collection.extend({
    url:'api/v2/inbox',
    model:Note,
    parse:function(r){
      return r.results.slice(0,500)
    },
    initialize: function() {

    }

  });

  return {
    List        : List
  }


});

define(['Backbone'],function(Backbone){

  var Item = Backbone.Model.extend({
    idAttribute: "object_id",
    parse: function(json){
      if(json.results.length == 0){
        return {error:'no found'};
      }else{
        return json.results;
      }
    },
    defaults:{
      "object_id" : null,
      "desc" : null,
      "title" : null,
      "content" : null
    },
    initialize: function() {
    }
  });


  return {
    Item        : Item
  }


});

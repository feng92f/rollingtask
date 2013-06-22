define(['Backbone'],function(Backbone){

  var Note = Backbone.Model.extend({
    idAttribute: "object_id",
    initialize: function() {
    }
  });

  var List = Backbone.Collection.extend({
    url:'api/v2/karma',
    model:Note,
    parse:function(r){
      return r.results.slice(-30);
    },
    initialize: function() {
    }

  });

  return {
    List        : List,
    Item        : Note
  }


});

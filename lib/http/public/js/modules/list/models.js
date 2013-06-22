define(['Backbone'],function(Backbone){

  var Item = Backbone.Model.extend({
    defaults:{
    },
    initialize: function() {
    }
  });

  var List = Backbone.Collection.extend({
    url:'job/types',
    parse:function(json){

      return json.map(function(type){
        return {title:type}
      });

    },
    model:Item,
    events:{
    },
    initialize: function() {
    }

  });

  return {
    List        : List,
    Item        : Item
  }


});

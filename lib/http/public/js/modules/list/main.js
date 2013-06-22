define('list',[
    'modules/list/models',
    'modules/list/views',
    'modules/notes/models',
    'modules/notes/views'
    ],function(Models, Views, NoteModels, NoteViews){

  var namespace = {};
  var App;
  var list_collection;

  console.log('MC' ,Models, Views);

  var current_uuid;
  var current_name = '我的生词本';

  var Router = Backbone.Router.extend({
    routes: {
        "": "show",
        "!list": "show"
    },
    show:function(){
        var view = new Views.WelcomeView();
        App.details.show(view);

        list_collection = new Models.List([]);
        list_collection.on('reset',function(c){
          var view1 = new Views.ListView({collection:c});
          App.main.show(view1);
        });

        list_collection.fetch({reset: true});
    }
  });



  namespace.initialize = function(app){

    App = app;

    var router = new Router();

    //Events

  };

  return namespace;
});

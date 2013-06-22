define('karma',['modules/karma/models',
    'modules/karma/views'
    ],function(Models, Views){

  var namespace = {};
  var App;

  console.log('MC' ,Models, Views);

  var Router = Backbone.Router.extend({
    routes: {
        "!karma": "show"
    },
    show:function(){
        var view = new Views.DetailView();
        App.details.show(view);

        var c = new Models.List([]);
        c.on('reset',function(){
          var view = new Views.ListView({collection:c});
          App.main.show(view);
        });
        c.fetch({reset: true});
    }

  });

  namespace.initialize = function(app){

    App = app;
    var router = new Router();

    App.addInitializer(function(options){
    });

    //Events

  };

  return namespace;

});

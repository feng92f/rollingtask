define('dash',['modules/dash/models',
    'modules/dash/views',
    'underscore',
    'Marionette'
    ],function(Models, Views, _, Marionette){

  var namespace = {};
  var App;

  console.log('M & C class file loaded' ,Models, Views);

  namespace.show = function(){
        var view_l = new Views.Dash();
        var view_r = new Views.Detail();
        App.main.show(view_l);
        App.details.show(view_r);
  };

  namespace.guide = function(){
        var view_l = new Views.Guide();
        var view_r = new Views.Detail();
        App.main.show(view_l);
        App.details.show(view_r);
  };

  var Router = Backbone.Router.extend({
    routes: {
        "!guide" : "guide"
    },
    show:namespace.show,
    guide:namespace.guide
  });


  namespace.initialize = function(app){

    App = app;

    App.addInitializer(function(options){
    });

    new Router();

    //Events

  };




  return namespace;

});

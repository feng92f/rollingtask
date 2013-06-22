define('dash',['modules/dash/models',
    'modules/dash/views'
    ],function(Models, Views){

  var namespace = {};
  var App;

  console.log('MC' ,Models, Views);


  var Router = Backbone.Router.extend({
    routes: {
        "": "show"
    },
    show:function(){
        console.log('Hello', App);
    }
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

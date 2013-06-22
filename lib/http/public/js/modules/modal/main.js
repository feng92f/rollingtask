define('modal',['modules/modal/models',
    'modules/modal/views',
    'plugins',
    ],function(Models, Views){

  var namespace = {};
  var App;

  console.log('MC' ,Models, Views);

  namespace.initialize = function(app){

    App = app;

    App.vent.on('query',function(options){

    });

    App.addInitializer(function(options){
    });

    //Events

  };


  return namespace;
});

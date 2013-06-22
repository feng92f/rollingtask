define('toolbar',['modules/toolbar/models',
    'modules/toolbar/views'
    ],function(Models, Views){

  var namespace = {};
  var App;

  namespace.initialize = function(app){

    App = app;

    var model = new Models.Nav();
    var view = new Views.Toolbar({model:model});

    view.on('query', function(view){
      console.log(view,"from toolbar");
      App.vent.trigger('query',view);
    });

    App.addInitializer(function(options){
      App.toolbar.show(view);
    });

    //Events
    App.on('x', function(options){
    })


  };

  return namespace;

});

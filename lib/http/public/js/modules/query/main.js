define('query',['modules/query/models',
    'modules/query/views',
    'plugins',
    ],function(Models, Views){

  var namespace = {};
  var App;

  console.log('MC' ,Models, Views);

  namespace.initialize = function(app){

    App = app;

    App.vent.on('query',function(options){

      var c = new Models.Item({id:0});
      c.url = 'api/entry/' + options.title;
      view = new Views.DetailView({ model:c });
      c.fetch();
      // App.vent.trigger("sound::play", {word: c.get('title')})
      App.details.bubblepop(view);

    });

    App.addInitializer(function(options){
    });

    //Events

  };


  return namespace;
});


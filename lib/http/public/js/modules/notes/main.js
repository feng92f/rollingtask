define('notes',['modules/notes/models',
    'modules/notes/views'
    ],function(Models, Views){

  var namespace = {};
  var App;

  console.log('MC' ,Models, Views);

  var Router = Backbone.Router.extend({
    routes: {
        "!jobs/:state/:from..:to/:order": "jobs",
        "!jobs/:type/:state/:from..:to/:order": "show",
    },
    show:function(type, state, from, to, order){
        var c = new Models.List([]);
        c.url = 'jobs/' + type + "/" + state + "/" + from + ".." + to + "/" + order;
        c.on('reset',function(){
          var view1 = new Views.ListView({collection:c});
          App.main.show(view1);
        });

        c.fetch({reset: true});

    },
    jobs:function(state, from, to, order){
        var c = new Models.List([]);
        c.url = 'jobs/' + state + "/" + from + ".." + to + "/" + order;
        c.on('reset',function(){
          var view1 = new Views.ListView({collection:c});
          App.main.show(view1);
        });

        c.fetch({reset: true});

    }

  });

  namespace.initialize = function(app){

    App = app;
    var router = new Router();

    App.on('check',function(options){
      var view1 = new Views.EmptyView(options);
      App.details.bubblepop(view1);
    });


    App.addInitializer(function(options){
    });

    //Events

  };

  return namespace;

});

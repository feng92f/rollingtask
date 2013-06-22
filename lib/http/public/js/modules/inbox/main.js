define('inbox',['modules/inbox/models',
    'modules/inbox/views'
    ],function(Models, Views){

  var namespace = {};
  var App;

  console.log('MC' ,Models, Views);


  var Router = Backbone.Router.extend({
    routes: {
        "!inbox": "show"
    },
    show:function(){
        var c = new Models.List([]);
        c.on('reset',function(){
          var view1 = new Views.ListView({collection:c});
          App.main.show(view1);
        });
        c.fetch({reset: true});

        c.on('forget', function(item){
          console.log(item,'===========');
          App.vent.trigger('query',item);
        });

        var view2 = new Views.WelcomeView();
        App.details.show(view2);
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

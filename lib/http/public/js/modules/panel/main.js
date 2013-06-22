define('panel',['modules/panel/models',
    'modules/panel/views'
    ],function(Models, Views){

  var namespace = {};
  var App;

  var Router = Backbone.Router.extend({});
  var router = new Router();

  namespace.initialize = function(app){

    App  = app;

    var model = new Models.Nav();

    var view1 = new Views.LeftPanel({model:model});

    view1.on('switch', function(options){
        router.navigate(options.router,true);

        if(App.env == "mobile"){
          App.trigger('push:close');
        }

    });

    var view2 = new Views.RightPanel({model:model});

    var DetailsRegion = Backbone.Marionette.Region.extend({
        el: "#detail-list",
        initialize: function(options){
        },
        bubblepop: function(view){

          var that = this;
          //if i am in a overlay view, aka in a mobile viewport
          //then open overlay
          if(this.overlay){
            this.overlay.popdown();
            this.overlay.popup();
            view.on('down',function(){
              //$(view.el).find('.modal').removeClass('active');
              setTimeout(function(){
                that.overlay.popdown();
                view.close();
              },0);

            });
          }else{
            view.on('down',function(){
              view.close();
            });
          }


          view.on('close',function(){
            console.log('close view','GC');
          });

          this.show(view);

        }
    });

    App.rightpanel.on('show',function(e){
        console.log('details in right panel');
        App.addRegions({
          details    :   DetailsRegion
        });
        App.details.overlay = false;
    });

    App.overlay.on('show',function(e){
        console.log('details in overlay');
        App.addRegions({
          details    :   DetailsRegion
        });
        App.details.overlay = App.overlay;
    });

    App.addInitializer(function(options){
      App.leftpanel.show(view1);

      if(options.env == "desktop"){
        App.rightpanel.show(view2);
      }else{
        App.overlay.show(view2);
      }
      return;

    });



    //Events
    App.on('open:left', function(options){
      Views.Snap.open('left');
    });

    App.on('push:close', function(options){
      Views.Snap.easeTo(360);
      //animation
      setTimeout(function(){
        Views.Snap.close();
      },500);
    });

    App.on('open:right', function(options){
      Views.Snap.open('right');
    });

    App.on('open:close', function(options){
      Views.Snap.close();
    })

  };

  return namespace;

});

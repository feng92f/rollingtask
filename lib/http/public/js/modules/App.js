define(['moment',
    'panel',
    'toolbar',
    'dash',
    'inbox',
    'list',
    'notes',
    'sound',
    'underscore',
    'Backbone',
    'Marionette',
    'jquery'],function(moment, panel, toolbar, dash, inbox, list, notes, sound, _, Backbone, Marionette, $){

  //Application level event aggregator
  //Application lecel laylout

   var App = window.App = new Marionette.Application();

   App.panel    = panel;
   App.toolbar  = toolbar;
   App.inbox    = inbox;
   App.list     = list;
   App.notes    = notes;

   var LeftPanelRegion = Backbone.Marionette.Region.extend({
      el: "#leftpanel",
      initialize: function(options){
      }
   });
   var RightPanelRegion = Backbone.Marionette.Region.extend({
      el: "#rightpanel",
      initialize: function(options){
      }
   });

   var MainRegion = Backbone.Marionette.Region.extend({
      el: "#main",
      initialize: function(options){
      }
   });

   var ToolbarRegion = Backbone.Marionette.Region.extend({
      el: "#toolbar",
      initialize: function(options){
      }
   });

   var OverlayRegion = Backbone.Marionette.Region.extend({
      el: "#overlay",
      initialize: function(options){
      },
      popup: function(){
        $(this.el).addClass('overlay-show');
      },
      popdown: function(){
        $(this.el).removeClass('overlay-show');
      }
   });


   App.addRegions({
      leftpanel  :   LeftPanelRegion,
      rightpanel :   RightPanelRegion,
      main       :   MainRegion,
      overlay    :   OverlayRegion,
      toolbar    :   ToolbarRegion
   });


   App.on("initialize:after", function(){
     if (Backbone.history){
       Backbone.history.start();
       console.log('history');
     }

     setTimeout(function(){
      LoadingScreen.stop();
     },500);

   });


   // laylout the panels
   // if mobile
   // if desk
   var ww = $('body').width();
   var pw = (ww - 250)/10;
   console.log(ww);

   if(ww > 960){
      //desk
      $('#content').css('width',pw*5.5 + 'px')
      $('#rightpanel').css('width',pw*4.5 + 'px')
   }else{
      //mobile
      $('#rightpanel').css('width','280px')
   }

   console.log('add addInitializer');

   App.addInitializer(function(args){
     App.vent.trigger("app:started", "app");
   });

   App.roll = function(options){

     this.env = options.env;
      
     //sorry no bookmarking support
     window.location.hash = '';

     $(function(){
       panel.initialize(App);
       toolbar.initialize(App);
       dash.initialize(App);
       inbox.initialize(App);
       list.initialize(App);
       notes.initialize(App);
       sound.initialize(App);
       App.start(App);
     });

   };

   $(window).resize(function() {
     // window.location.reload();
   });


   return App;


});

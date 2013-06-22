define('sound',['soundManager2'],function(){

      var sound = {
        ready:false,
        jianbing:'http://www.jianbing.org/audio/sound/',
          //+ word[0].toUpperCase() + '/' + word.toLowerCase() + '.mp3';
        google:'http://www.gstatic.com/dictionary/static/sounds/de/0/',
        rolling:'http://rollingsound.b0.upaiyun.com/sounds/',
        getMp3:function(word){
          return this.rolling + word.toLowerCase() + '.mp3';
        }
      };

      function playit(word){
        if(sound.ready != true){
          return;
        }

        var soundObject = soundManager.createSound({
                id:word,
                url:sound.getMp3(word)
        });
        soundObject.play();

      }

      sound.initialize = function(App){

        soundManager.setup({
          url: '/swf-files/',
          // optional: use 100% HTML5 mode where available
          preferFlash: false,
          onready: function() {
            sound.ready = true;
          },
          ontimeout: function() {
            // Hrmm, SM2 could not start
          }
        });

        App.vent.on("sound::play", function(options){
          playit(options.word);
        });

      };

      return sound;
});

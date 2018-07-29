(function( $, window ){
   'use strict';
   var YTPlayer;

   /*
      Helper functions
   */
   function getVideoInfo(videoId){

      var deferred = $.Deferred();
      $.get('https://gdata.youtube.com/feeds/api/videos/' + videoId + '?v=2&alt=json')
         .then(function(res) {

             var info = {
                 title: res.entry.title.$t
             }
             deferred.resolve(info);
         })
      return deferred.promise();
   }


   // Extract the vid of the youtube url link
   function extractYoutubeVid(url){
      var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      var match = url.match(regExp);
      if (match && match[2].length == 11) {
         return match[2];
      } else {
         return null;
      }
   }

   // convert time in seconds to formated (HH::MM:SS)
   function toHHMMSS(second) {
      var sec_num = parseInt(second, 10); // don't forget the second param
      var hours   = Math.floor(sec_num / 3600);
      var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
      var seconds = sec_num - (hours * 3600) - (minutes * 60);

      if (hours   < 10) {hours   = "0"+hours;}
      if (minutes < 10) {minutes = "0"+minutes;}
      if (seconds < 10) {seconds = "0"+seconds;}
      var time    = hours+':'+minutes+':'+seconds;
      return time;
   }


  
   var createPlayerView = function(){
      return createView({
         init: function(){
            this.addInput = this.$(".add-video-input");
         },

         onVideoSelect: function(evt){
            // take to current video time on youtube.com
            this.currentPlaylistIndex = parseInt($(evt.target).find("option:selected").val());
            this.up
         },
         onActionClick: function(){
            if(this.state === YT.PlayerState.PLAYING) {
               YTPlayer.pause();
            } else {
               YTPlayer.play();
            }
         },
         onPrevClick: function(){
            YTPlayer.playlist.prevSong();
         },
         onNextClick: function(){
            YTPlayer.playlist.nextSong();
         },
      });
   };

   function success(p){
      // When Youtube library is loaded successfully
      YTPlayer = p;
      YTPlayer.player.setVolume(100);
      YTPlayer.player.unMute();

      console.log("API loaded");
   }

   function init(){
      var API = $.loadYoutubeAPI();

      API.then(success);
   }

   init();

})( jQuery, window);

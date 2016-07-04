(function() {
    function SongPlayer($rootScope, Fixtures) {
        var SongPlayer = {};
        
        var currentAlbum = Fixtures.getAlbum();
        
         /**
         * @desc Buzz object audio file
         * @type {Object}
         */
        var currentBuzzObject = null;
        
        /**
        * @function stopSong
        * @desc Stop Buzz object and set song property to null
        */
        
        var stopSong = function(song) {
            if(currentBuzzObject) {
                currentBuzzObject.stop();
                SongPlayer.currentSong.playing = null;
            }            
        };
        
         /**
         * @function setSong
         * @desc Stops currently playing song and loads new audio file as currentBuzzObject
         * @param {Object} song
         */
        
        var setSong = function(song) {
            stopSong(song);

            currentBuzzObject = new buzz.sound(song.audioUrl, {
                formats: ['mp3'],
                preload: true
            });
            
            currentBuzzObject.bind('timeupdate', function() {
                 $rootScope.$apply(function() {
                     SongPlayer.currentTime = currentBuzzObject.getTime();
                 });
            });
            
            

            SongPlayer.currentSong = song;
        };
        
        var getSongIndex = function(song) {
            return currentAlbum.songs.indexOf(song);
        };
        
        /**
        * @function playSong
        * @desc Starts playing song and sets variable
        * @param {Object} song
        */
        
        var playSong = function(song) {
            currentBuzzObject.play();
            song.playing = true;
        };
        
        /**
        * @desc Active song object from list of songs
        *@type {Object}
        */
        SongPlayer.currentSong = null;
        
        SongPlayer.currentTime = null;
        
        SongPlayer.play = function(song) {
            song = song || SongPlayer.currentSong;
             if (SongPlayer.currentSong !== song) {
                 setSong(song);
                 playSong(song);                 
             } else if (SongPlayer.currentSong === song) {
                 if (currentBuzzObject.isPaused()) {
                     playSong(song);
                 }
            }   
        };        
        
        SongPlayer.pause = function(song) {
            song = song || SongPlayer.currentSong;
             currentBuzzObject.pause();
             song.playing = false;
        };
        
        /**
        * @function next
        * @Desc Gets next song
        */
        SongPlayer.next = function() {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex++;
            
            if(currentSongIndex >= currentAlbum.songs.length) {
                stopSong(song);
            } else {
                var song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
            }
        };
        
        SongPlayer.setCurrentTime = function(time) {
            if(currentBuzzObject) {
                currentBuzzObject.setTime(time);
            }
        };

        
        
        /**
        * @function previous
        * @Desc Gets previous song
        */        
        
        SongPlayer.previous = function() {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex--;
            
            if(currentSongIndex < 0) {
                stopSong(song);
            } else {
                var song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
            }
        };

        return SongPlayer;
    };
    
    angular
    .module('blocJams')
    .factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);
})();
/*
 *
 * HTML5 Audio player with playlist
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2012, Script Tutorials
 * http://www.script-tutorials.com/
 */
jQuery(document).ready(function() {

    // get todays date
    var todaysDate = new Date().setHours(0, 0, 0, 0);


    // read JSON file for list of songs
    $.getJSON('songs.json', function(data) {
        var songs = [];
        var currentSong = data.playlists[0].songs[0];
        var currentWeek;

        // loop through list of songs
        $.each(data.playlists, function(key, playlist) {
            var weekDate = playlist.startDate.split('-');
            var weekCompare = new Date(weekDate[0], weekDate[1] - 1, weekDate[2]).getTime();

                // Create label for week name
                songs.push('<li class="week">' + playlist.week + '</li>');

                $.each(playlist.songs, function(key, song) {
                    var activeClass = '';


                    // add song to playlist
                    songs.push('<li date="' + song.date + '"  audiourl="' + song.audioURL + '" title="' + song.title + '" artist="' + song.artist + '" album="' + song.album + '" year="' + song.year + '" class="' + activeClass + '">' + '<span class="playlist-title"> ' + song.title + ' - </span>' + '<span class="playlist-artist"> ' + song.artist + ' </span>' + '</li>');
                });

        });


        // add list of songs to playlist
        $('ul.playlist').html(songs.join(''));
        $('.playlist li').on('click', function() {
            stopAudio();
            initAudio($(this), true);
        });
        // add today's song info to main area
        $('.title').html(currentSong.title);
        $('.artist').html(currentSong.artist);
        $('.album').html(currentSong.album);
        $('.year').html(currentSong.year);
        // initialization - first element in playlist
        initAudio($('.playlist li[date="' + currentSong.date + '"]'));
    });
    


    // inner variables
    var song;
    var tracker = $('.tracker');

    function initAudio(elem, autoPlay) {
        var url = elem.attr('audiourl');
        var title = elem.attr('title');
        var date = elem.attr('date');
        var artist = elem.attr('artist');
        var album = elem.attr('album');
        var year = elem.attr('year');

        $('.player .title').text(title);
        $('.playlist .title').text(title);
        $('.player .date').text(date);
        $('.player .artist').text(artist);
        $('.player .album').text(album);
        $('.player .year').text(year);
        if ($('style')[1]) {
            $('style')[1].remove();
        };



        song = new Audio(url);

        // timeupdate event listener
        song.addEventListener('timeupdate', function() {
            var curtime = parseInt(song.currentTime, 10);
            tracker.slider('value', curtime);
        });

        $('.playlist li').removeClass('active');
        elem.addClass('active');



        if (autoPlay) {
            tracker.slider('value', 0);
            $('.play').removeClass('hidden').addClass('visible');
                    $('.pause').removeClass('visible').addClass('hidden');
            
            song.addEventListener('canplay', function() {
                playAudio();
            });
        }
    }

    function playNext() {
        var next = $('.playlist li.active').next();
        if (next.length === 0) {
            next = $('.playlist li:first-child');

            if (next.hasClass('week')) {
                next = $('.playlist li:first-child').next();
            }
        } else {
            if (next.hasClass('week')) {
                next = next.next();
            }
        }
        initAudio(next, true);
    }

    function playPrev() {
        var prev = $('.playlist li.active').prev();
        if (prev.hasClass('week')) {
            prev = prev.prev();
        }

        if (prev.length === 0) {
            prev = $('.playlist li:last-child');

            if (prev.hasClass('week')) {
                prev = $('.playlist li:last-child').prev();
            }
        } else {
            if (prev.hasClass('week')) {
                prev = prev.prev();
            }
        }
        initAudio(prev, true);
    }

    function playAudio() {
        song.play();
        
        $('.play').removeClass('visible').addClass('hidden');
        $('.pause').removeClass('hidden').addClass('visible');
        
        // fire event on song end
        song.onended = function() {
            playNext();
        };

        tracker.slider("option", "max", song.duration);

        $('.play').addClass('hidden');
        $('.pause').addClass('visible');
    }

    function stopAudio() {
        song.pause();

        $('.play').removeClass('hidden');
        $('.pause').removeClass('visible');
    }

    // play click
    $('.play').click(function(e) {
        e.preventDefault();

        playAudio();
    });

    // pause click
    $('.pause').click(function(e) {
        e.preventDefault();

        stopAudio();
    });

    // forward click
    $('.fwd').click(function(e) {
        e.preventDefault();

        stopAudio();

        playNext();
    });

    // rewind click
    $('.rew').click(function(e) {
        e.preventDefault();

        stopAudio();

        playPrev();
    });

    // show playlist
    $('.pl').click(function(e) {
        e.preventDefault();

        $('.playlist').fadeIn(300);
    });


    // empty tracker slider
    tracker.slider({
        range: 'min',
        min: 0,
        max: 100,
        start: function(event, ui) {},
        slide: function(event, ui) {
            song.currentTime = ui.value;
        },
        stop: function(event, ui) {}
    });
    
    
});
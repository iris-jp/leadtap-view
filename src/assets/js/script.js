var player;
var pointers = '<div class="pointer"></div>';
var eventFlag = false;
var cssAssets = 'mirumaker.css';
var code = '<div class="mirumaker_movie_player"><div class="mirumaker_movie_player-background"></div>';
code += '<div class="mirumaker_movie_player-interactive_elements"></div>';
code += '<div class="mirumaker_movie_player-video">';
code += '<video controls playsinline data-plyr-config="{\'controls\': [\'play\', \'progress\', \'current-time\', \'mute\', \'volume\'] }" id="mirumaker_movie_play_videoid" class="">';
code += '<source src="' + MirumakerEventData[0]['moviePath'] + '" type="video/mp4">';
code += '</video>';
code += '</div>';
code += '<nav class="mirumaker_movie_player-footer">';
code += '<button class="mirumaker_movie_player-close_button">閉じる</button>';
code += '</nav>';
code += '';
code += '</div>';

(function() {
    var $, Plyr;
    $ = require('jquery');
    Plyr = require('./plyr.js');

    var js = (function() {
        if (document.currentScript) {
            return document.currentScript.src;
        } else {
            var scripts = document.getElementsByTagName('script'),
                script = scripts[scripts.length - 1];
            if (script.src) {
                return script.src;
            }
        }
    })();

    $(function() {
        addStyle();
        addMovie();
        setUp();

        $('.show_mirumaker_player').click(function() {
            $('.mirumaker_movie_player').show();

            adjustSize();
            //player.restart();
            player.play();
            player.increaseVolume(1);

            runTrackingCode(MirumakerEventData[0]['gtag']);
        });

        $('button.mirumaker_movie_player-close_button').click(function() {
            player.stop();
            //player.increaseVolume(1);
            // $('div.mirumaker_movie_player-interactive_elements').remove();
            $('div.mirumaker_movie_player-interactive_elements').hide();
            $('.mirumaker_movie_player').hide();
            eventFlag = false;
        });

        function addStyle() {
            var f = js.lastIndexOf('/');
            var d = js.slice(0, f);
            $('body').append('<link rel="stylesheet" href="' + d + '/' + cssAssets + '">');
        }

        function addMovie() {
            $('body').append(code);
        }

        function setUp() {

            player = new Plyr(
                '#mirumaker_movie_play_videoid', {
                    //autoplay: true,
                    displayDuration: false,
                    duration: true,
                    disableContextMenu: false,
                    clickToPlay: false,
                    tooltips: { controls: false, seek: false },
                    fullscreen: { enabled: false, fallback: false, iosNative: false },
                }
            );

            player.on('playing', function(event) {
                setPointer(player.duration);
            });

            player.on('timeupdate', function(event) {
                var currentTime = player.currentTime;
                for (var i = 1; i <= MirumakerEventData.length - 1; i++) {
                    var eventTime = MirumakerEventData[i]['que'];
                    eventTime = Number(eventTime);

                    if (eventTime - currentTime > -0.2 && eventTime - currentTime < 0.2) {
                        if (!eventFlag) {
                            player.currentTime = eventTime;
                            player.currentTime = Math.floor(player.currentTime);
                            eventSetting(i);
                            eventFlag = true;
                        }
                    }
                }
            });
        }

        window.addEventListener('DOMContentLoaded', function() {}, false);

        function setPointer(time) {
            var totalTime = time;
            $('.plyr__progress').append(pointers);
            for (var i = 1; i <= MirumakerEventData.length - 1; i++) {
                $('.pointer').append('<div class="point js-point' + i + '"></div>');
                var per = MirumakerEventData[i]['que'] / totalTime * 100 + '%';
                $('.js-point' + i).css({ 'left': per });
            }
        }

        function forwardEvent(time) {
            var h = player.currentTime;
            player.currentTime = Math.floor(h);

            //設定された値が現在時間を同じなら再生開始
            if (player.currentTime == time) {
                player.currentTime = (time + 0.4);
                player.play();

                //設定された値にスキップ
            } else {
                player.currentTime = time;
                player.play();
            }

            //player.play();
            player.increaseVolume(1);
        }

        function eventSetting(eventNum) {
            addElement(eventNum);
            adjustSize();
            player.pause();
            $('.plyr--full-ui.plyr--video .plyr__control--overlaid').hide();

            //非表示の閉じるボタンを再表示にする
            $('button.mirumaker_movie_player-close_button').fadeOut(200);
        }

        function addElement(n) {
            var type = MirumakerEventData[n]['type'];
            if (type == 'single') {
                var html_id = MirumakerEventData[n]['html_id'];
                var html_id_str = ""
                if (html_id != "") {
                    html_id_str = ' id="' + html_id + '" '
                }
                $('div.mirumaker_movie_player-interactive_elements').append('<div class="mirumaker-buttons"><div class="js-closearea closearea"><div class="notice_close"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></div></div><div class="button-single button-single' + n + '"></div></div>');
                $('div.button-single' + n).append('<div class="button-single_inner"><img src=""' + html_id_str + '></div>');
                $('div.button-single' + n + ' div.button-single_inner img').attr('src', MirumakerEventData[n]['imagePath']);

                var h = $('#mirumaker_movie_play_videoid').height();
                $('div.button-single' + n + ' div.button-single_inner').css({ 'height': h });
                $('div.button-single' + n + ' div.button-single_inner img').css({ 'left': MirumakerEventData[n]['left'], 'top': MirumakerEventData[n]['top'], 'position': 'absolute' });
                setSingleButtonEvent(n);

            } else if (type == 'multiple') {
                var html_id_a = MirumakerEventData[n]['html_id_a'];
                var html_id_a_str = ""
                if (html_id_a != "") {
                    html_id_a_str = ' id="' + html_id_a + '" '
                }
                var html_id_b = MirumakerEventData[n]['html_id_b'];
                var html_id_b_str = "";
                if (html_id_b != "") {
                    html_id_b_str = ' id="' + html_id_b + '" ';
                }

                $('div.mirumaker_movie_player-interactive_elements').append('<div class="mirumaker-buttons button-multiple' + n + '"><div class="js-closearea closearea"><div class="notice_close"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></div></div><div class="button-multiple_inner"><div class="button-type_01"></div><div class="button-type_02"></div></div></div>');
                $('div.button-multiple' + n + ' div.button-type_01').append('<img src=""' + html_id_a_str + '>');
                $('div.button-multiple' + n + ' div.button-type_02').append('<img src=""' + html_id_b_str + '>');
                $('div.button-multiple' + n + ' div.button-type_01 img').attr('src', MirumakerEventData[n]['imagePath_a']);
                $('div.button-multiple' + n + ' div.button-type_02 img').attr('src', MirumakerEventData[n]['imagePath_b']);
                setClickEvent(n);
                setMultiEvent(n);

            } else if (type == 'popup') {
                var html_id = MirumakerEventData[n]['html_id'];
                var html_id_str = ""
                if (html_id != "") {
                    html_id_str = ' id="' + html_id + '" '
                }
                $('div.mirumaker_movie_player-interactive_elements').append('<div class="mirumaker-buttons"><div class="js-closearea closearea"><div class="notice_close"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></div></div><div class="button-popup button-popup' + n + '"></div></div>');
                $('div.button-popup' + n).append('<img src=""' + html_id_str + '>');
                $('div.button-popup' + n + ' img').attr('src', MirumakerEventData[n]['imagePath']);
                var h = $('div.mirumaker-buttons').height();
                $('div.closearea').css({ 'height': h });
                setPopupEvent(n);

            }

            //$('div.mirumaker-buttons').hide().fadeIn(400);
            $('div.mirumaker_movie_player-interactive_elements').hide().fadeIn(400);
        }

        function typeEquals(type, obj) {
            var clas = Object.prototype.toString.call(obj).slice(8, -1);
            return clas === type;
        }

        //
        function setSingleButtonEvent(eventNum) {
            $('div.button-single' + eventNum + ' div.button-single_inner img').on('click', function() {
                var v = MirumakerEventData[eventNum]['action'];
                var t = Number(v);
                if (!isNaN(t)) {
                    forwardEvent(t);
                    restart();
                    eventFlag = false;
                } else {
                    window.open(v);
                }
                runTrackingCode(MirumakerEventData[eventNum]['gtag']);
            });
            $('.js-closearea').on('click', function() {
                forwardEvent(player.currentTime);
                restart();
                eventFlag = false;
            });
        }

        function setMultiEvent(eventNum) {
            $('div.button-multiple' + eventNum).on('click', function() {
                var v = MirumakerEventData[eventNum]['action'];
                var t = Number(v);
                if (!isNaN(t)) {
                    forwardEvent(t);
                    restart();
                    eventFlag = false;
                } else {
                    window.open(v);
                }

                runTrackingCode(MirumakerEventData[eventNum]['gtag']);
            });
            $('.js-closearea').on('click', function() {
                forwardEvent(player.currentTime);
                restart();
                eventFlag = false;
            });
        }

        function setPopupEvent(eventNum) {
            $('div.button-popup' + eventNum).on('click', function() {
                var v = MirumakerEventData[eventNum]['action'];
                var t = Number(v);
                if (!isNaN(t)) {
                    forwardEvent(t);
                    restart();
                    eventFlag = false;
                } else {
                    window.open(v);
                }

                runTrackingCode(MirumakerEventData[eventNum]['gtag']);
            });
            $('.js-closearea').on('click', function() {
                forwardEvent(player.currentTime);
                restart();
                eventFlag = false;
            });
        }

        function setClickEvent(eventNum) {
            $('div.button-type_01').on('click', function() {
                var v = MirumakerEventData[eventNum]['action_a'];
                var t = Number(v);
                if (!isNaN(t)) {
                    forwardEvent(t);
                    restart();
                    eventFlag = false;
                } else {
                    window.open(v);
                }

                runTrackingCode(MirumakerEventData[eventNum]['gtag_a']);
            });

            $('div.button-type_02').on('click', function() {
                var v = MirumakerEventData[eventNum]['action_b'];
                var t = Number(v);
                if (!isNaN(t)) {
                    forwardEvent(t);
                    restart();
                    eventFlag = false;
                } else {
                    window.open(v);
                }

                runTrackingCode(MirumakerEventData[eventNum]['gtag_b']);
            });
        }


        function adjustSize() {
            var h = $('#mirumaker_movie_play_videoid').height();
            //$('div.mirumaker-buttons').css({'height':h});
            $('div.mirumaker_movie_player-interactive_elements').css({ 'height': h });
            $('nav.mirumaker_movie_player-footer').css({ 'margin-top': (h / 2 + 26) });
        }

        function restart() {
            $('div.mirumaker-buttons').remove();
            $('div.mirumaker_movie_player-interactive_elements').hide();

            //閉じるボタンを非表示にする
            $('button.mirumaker_movie_player-close_button').fadeIn(200);
        }

        $(window).resize(function() {
            adjustSize();
        });

        //トラッキングコードを発動する
        function runTrackingCode(_str) {
            var str = _str;
            if (str) {
                str = str.replace(/\s+/g, '');
                str = str.replace(/\{/g, '').replace(/\}/g, '');
                var ary = str.split(',');
                var param0 = ary[0].replace(/'/g, '');
                var param1 = ary[1].replace(/'/g, '');

                var p = ary[2].replace(/'/g, '');
                var param2 = p.split('event_category:');
                var p = ary[3].replace(/'/g, '');
                var param3 = p.split('event_label:');
                var p = ary[4].replace(/'/g, '');
                var param4 = p.split('value:');

                gtag(param0, param1, { 'event_category': param2[1], 'event_label': param3[1], 'value': param4[1] });
            }
        }
    });
}).call(this);

var rangeTouch;
rangeTouch = require('./rangetouch.js');
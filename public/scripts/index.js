let myUrl = new URL(window.location);
let audioState = 0; // background wave sound

let currentSeaShellType = 0; // 0-4

// extend audio
Audio.prototype.stop = function () {
    this.pause();
    this.currentTime = 0;
};

Audio.prototype.restart = function () {
    this.pause();
    this.currentTime = 0;
    this.play();
};

// manully activate background sound
window.addEventListener('click', () => {
    if (audioState == 0) {
        var myAudio = document.getElementById('bgm');
        myAudio.play();
        audioState = 1;
    }
});

let windowHeight = $(window).height();
let windowWidth = $(window).width();

initHomePage();


function initHomePage() {
    $('.main-container').height(windowHeight);
    if (windowWidth / windowHeight < 0.527) {
        $('#video').height(windowHeight);
    } else {
        $('#video').width(windowWidth);
    }


    $('.list-icon').css('visibility', 'hidden');
    $('.back').css('visibility', 'hidden');
    $('.not-in-home-page').hide();
    $('#sea-shell-swiper').css('visibility', 'hidden');
}

function backToHome() {
    location.replace(myUrl);
    // $('#background-image').attr('src', '../assets/sea-overlay.png');
    // hideThingsNotInHomePage();
    // // show home page elements
    // $('.footer').fadeIn(300);
    // // $('.list-icon').css('visibility', 'visible');
    // var myAudio = document.getElementById('bgm');
    // myAudio.play();
}


var seaShellList = [];
var seaShellClickedId = -1;
var swiperShow;

function showLookForResult() {
    $('#background-image').attr('src', '../assets/sand-bg-daylight.png');
    $('.footer').hide();
    $('.list-icon').css('visibility', 'hidden');
    $('.back').css('visibility', 'visible');
    $('.main-container').height(windowHeight - 1000);
    $('.sea-shell-list').fadeIn(100);

    $.ajax({
        method: "POST",
        url: myUrl + "getSomeRecords",
    })
        .done(function (response) {
            if (response.status) {
                // success
                seaShellList = response.data;
                console.log(seaShellList);

                $('#countOfSeaShell').html(seaShellList.length);

                let html = '';

                for (let i = 0; i < seaShellList.length; i++) {
                    let d = '';
                    let c = '';
                    if (seaShellList[i].fileName == "") {
                        d = 'This sea shell is <span class="bold-text">empty</span>. You can record you own story in it.';
                        c = '';
                    } else {
                        d = 'This shell is <span class="bold-text">a bit heavy</span>, and there seems to be a sound coming out of it.';
                        c = ' sea-shell-block-not-empty';
                    }
                    html += '<div class="swiper-slide" id="seashell-' + i + '">' +
                        '<div class="sea-shell-block' + c + '">' +
                        '<div class="img">' +
                        '<img src="assets/sea-shell/sea-shell-' + seaShellList[i].seaShellType + '.png" width="100%">' +
                        '</div>' +
                        '<div class="detail">' +
                        '<h2>' + d + '</h2>' +
                        '</div>' +
                        '</div >' +
                        '</div >';
                }

                $('.swiper-wrapper').html(html);
                $('#sea-shell-swiper').css('visibility', 'visible');

                swiperShow = new Swiper('#sea-swiper', {
                    slidesPerView: 'auto',
                    watchSlidesProgress: true,
                    slidesOffsetBefore: (windowWidth - 300) / 2,
                    slidesOffsetAfter: (windowWidth - 300) / 2,
                    spaceBetween: 60,
                    resistanceRatio: 1,
                    controller: {

                    },
                    on: {
                        progress: function (progress) {
                            for (i = 0; i < this.slides.length; i++) {
                                slide = this.slides.eq(i);
                                slideProgress = this.slides[i].progress;
                                prevIndent = 0.5;
                                // if (i == 4) {
                                //     prevIndent = 0.3228;
                                // } else {
                                //     prevIndent = 0.0898;
                                // }

                                if (Math.abs(slideProgress + prevIndent) < 1) {
                                    // scale = (1 - Math.abs(slideProgress + prevIndent)) * 0.1 + 1
                                    scale = (1 - Math.abs(slideProgress + prevIndent)) * 0.5 + 1;
                                } else {
                                    scale = 1;
                                }

                                slide.find('#sea-swiper .sea-shell-block').transform('scale3d(' + scale + ',' + scale + ',1)');
                            }
                        },
                        setTransition: function (transition) {
                            for (var i = 0; i < this.slides.length; i++) {
                                var slide = this.slides.eq(i)
                                slide.find('#sea-swiper .sea-shell-block').transition(transition);
                            }

                        },

                        touchEnd: function () {

                        }
                    },
                });


                $('.swiper-slide').click(function () {
                    seaShellClickedId = this.id.split('-')[1];
                    let s = seaShellList[seaShellClickedId];
                    if (s) {
                        currentSeaShellType = s.seaShellType;
                        $('#sea-shell-swiper').css('visibility', 'hidden');
                        if (s.fileName == "") {
                            // record
                            $('#will-record').attr('src', "../assets/sea-shell/sea-shell-" + s.seaShellType + ".png");
                            goToRecord();
                        } else {
                            // play
                            $('#will-listen').attr('src', "../assets/sea-shell/sea-shell-" + s.seaShellType + ".png");

                            goToListen(s.fileName);
                        }
                    }
                });
            } else {
            }
        });
}

function goToRecord() {
    var myAudio = document.getElementById('bgm');
    myAudio.stop();

    $('.sea-shell-list').hide();
    $('.record').fadeIn(100);
}

function goToListen(_fileName) {
    var myAudio = document.getElementById('bgm');
    myAudio.stop();

    $('.sea-shell-list').hide();
    $('.listen').fadeIn(100);
    $('#bgm').attr('src', '../assets/userRecording/' + _fileName);
}

// main interaction
$(function () {
    // start to look for sea shells
    $('#start-button').click(() => {
        showLookForResult();
    });

    // back to home page
    $('.back').click(() => {
        backToHome();
    });

    // recording interaction
    $('#complete-button').click(() => {
        recStop();
        // close the recorder when upload finished
    });

    $('#record-button').click(() => {
        if (!isOpened) {
            // open the recorder
            recOpen(); // including start
        } else {
            if (isRecording) {
                // started or resumed
                recPause();
            } else {
                // has started, to resume
                recResume();
            }
        }
    });

    // listen to one sea shell
    $('#listen-button').click(() => {
        var myAudio = document.getElementById('bgm');
        myAudio.play();
    });


})


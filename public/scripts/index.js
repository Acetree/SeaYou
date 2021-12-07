let myUrl = new URL(window.location);
let audioState = 0; // background wave sound

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
$('.main-container').height(windowHeight);
$('.back').css('visibility', 'hidden');
$('.sea-shell-list').hide();
$('.record').hide();
$('.listen').hide();


function showLookForResult() {
    $('#background-image').attr('src', '../assets/sand-bg-daylight.png');
    $('.footer').hide();
    $('.back').css('visibility', 'visible');

    $('.sea-shell-list').fadeIn(100);
    $('.list').css('visibility', 'hidden');
}

function backToHome() {
    $('#background-image').attr('src', '../assets/sea-overlay.png');
    $('.footer').fadeIn(300);
    $('.back').css('visibility', 'hidden');
}

function goToRecord() {
    var myAudio = document.getElementById('bgm');
    myAudio.stop();

    $('.sea-shell-list').hide();
    $('.record').fadeIn(100);
}

// main interaction
$(function () {
    $('#start-button').click(() => {
        showLookForResult();
    });

    $('.back').click(() => {
        backToHome();
    });

    $('.sea-shell-div').click(() => {
        goToRecord();
    });


    // recording interaction
    $('#record-button').click(() => {
        if (!isOpened) {
            // open the recorder
            recOpen(); // including start
        } else {
            if(isRecording){
                // started or resumed
                recPause();
            }else{
                // has started, to resume
                recResume();
            }
        }
    });
    
    $('#complete-button').click(()=>{
        recStop();
        // upload to server
        

        recClose();
    });


})


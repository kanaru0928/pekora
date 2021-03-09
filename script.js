var bpm;
var beat;
var play = false;
var playFlag = true;
var count;
var honke = false;
var startDate;

window.AudioContext = window.AudioContext || window.webkitAudioContext;
var ctx = new AudioContext();
var gainNode = ctx.createGain();
var bun_url = "./bun.mp3";
var cha_url = "./cha.mp3";
var bun;
var cha;
var bun_buffer;
var cha_buffer;

function listenEvent() {
    $('#bpm_range').on('input', function() {
        onChangeBpm($(this).val());
    });
    $('#bpm_num').on('change', function() {
        onChangeBpm($(this).val());
    });
    $('#beat_range').on('input', function() {
        onChangeBeat($(this).val());
    });
    $('#beat_num').on('change', function() {
        onChangeBeat($(this).val());
    });
    $('#vol_range').on('input', function() {
        onChangeVol($(this).val());
    });
    $('#vol_num').on('change', function() {
        onChangeVol($(this).val());
    });
    $('#start').on('click', function() {
        ss();
    });
}

function onChangeBpm(i) {
    $('#bpm_range').val(i);
    $('#bpm_num').val(i);
    bpm = i;
    count = 1;
}

function onChangeBeat(i) {
    $('#beat_range').val(i);
    $('#beat_num').val(i);
    beat = i;
}

function onChangeVol(i) {
    $('#vol_range').val(i);
    $('#vol_num').val(i);
    bun.volume = i / 100;
    cha.volume = i / 100;
}

function ss() {
    play = !play;
    if (play) {
        $('#stop_ico').show();
        $('#start_ico').hide();
        count = 1;
        startDate = Date.now();
        setTimeout(tick, 0);
    } else {
        $('#start_ico').show();
        $('#stop_ico').hide();
        playFlag = false;
    }
}

function playBuffer(buffer){
    let src = ctx.createBufferSource();
    src.buffer = buffer;
    src.connect(ctx.destination);
}

function playsound(){
    let cha_condition;
    let bun_condition;
    if ($("#honke").prop('checked')) {
        cha_condition = beat != 0 && count % beat === beat - 1;
        bun_condition = beat != 0 && count % beat !== 0;
    } else {
        cha_condition = beat != 0 && count % beat === 0;
        bun_condition = true;
    }
    if (cha_condition) {
        cha.pause();
        cha.currentTime = 0;
        cha.play();
    } else if (bun_condition) {
        cha.pause();
        bun.currentTime = 0;
        bun.play();
    }
}

function tick() {
    if (playFlag) {
        playsound();
        let nd = Date.now();
        let ct = nd - startDate;
        let mpb = 60000 / bpm;
        let ext = mpb * count;
        if(ct < ext - 2 * mpb){
            console.log("too slow");
            count = Math.ceil((ext - ct + mpb) / mpb);
        }else if(ct > ext){
            console.log("too fast");
            count += Math.ceil((ct - ext) / mpb);
        }
        console.log({count, ct, ext:(mpb * count)});
        interval = Math.round(startDate + mpb * count - nd);
        console.log(interval);
        setTimeout(tick, interval);
        count++;
    } else {
        playFlag = true;
    }
}

async function getSound(url){
    const response = await fetch(url);
    const arraybuffer = await response.arrayBuffer();
    const audioBuffer = await ctx.decodeAudioData(arraybuffer);
    return audioBuffer;
}

$(function() {
    listenEvent();
    onChangeBpm(120);
    onChangeBeat(4);
    onChangeVol(80);
    bun_buffer = getSound(bun_url);
    cha_buffer = getSound(cha_url);
    
});
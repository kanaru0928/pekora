var bpm;
var beat;
var play = false;
var playFlag = true;
var count;
var honke = false;
var startDate;
var vol;
var ctx;
var gainNode;
var bun_url = new Request("./bun.mp3");
var cha_url = new Request("./cha.mp3");
var bun;
var cha;

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
    $('#sound_test').on('click', function() {
        audio = new Audio("cha.mp3");
        audio.play();
        alert("cha!");
    });
    // $('#start').on('touchstart', function(e) {
    // });
    $('#start').on('click', function() {
        const emptySource = ctx.createBufferSource();
        emptySource.start();
        emptySource.stop();
        ss();
    });
}

function onChangeBpm(i) {
    $('#bpm_range').val(i);
    $('#bpm_num').val(i);
    bpm = i;
    count = 1;
}

function onChangeBeat(b) {
    $('#beat_range').val(b);
    $('#beat_num').val(b);
    beat = b;
    $('.light').removeClass('last');
    $(`#light-${b - 1}`).addClass('last');
    b = b == 0 ? 1 : b;
    for (let i = 0; i < 6; i++) {
        if (i < b) {
            $(`#light-${i}`).show();
        } else {
            $(`#light-${i}`).hide();
        }
    }
}

function onChangeVol(i) {
    $('#vol_range').val(i);
    $('#vol_num').val(i);
    vol = i;
}

function ss() {
    play = !play;
    if (play) {
        $('#stop_ico').show();
        $('#start_ico').hide();
        $('.light').removeClass('on');
        count = 1;
        startDate = Date.now();
        setTimeout(tick, 0);
    } else {
        $('#start_ico').show();
        $('#stop_ico').hide();
        playFlag = false;
    }
}

function playRequest(ctx, request) {
    getSound(request).then((arrayBuffer) => {
        let src = ctx.createBufferSource();
        ctx.decodeAudioData(arrayBuffer).then((audioBuffer) => {
            src.buffer = audioBuffer;
            src.connect(gainNode);
            gainNode.connect(ctx.destination);
            gainNode.gain.value = vol / 100;
            src.start(0);
        }).catch((error) => {
            console.log({ error });
        });
    }).catch((error) => {
        console.log({ error });
    });
}

function playsound() {
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
        playRequest(ctx, cha_url);
    } else if (bun_condition) {
        playRequest(ctx, bun_url);
    }
    let interval = calcDeley();
    setTimeout(tick, interval);
    console.log(interval.toString());
    let b = beat == 0 ? 1 : beat;
    for (let i = 0; i < b; i++) {
        if (i < count % b || count % b == 0) {
            $(`#light-${i}`).addClass('on');
        }
    }
    if (count % b == 0) {
        setTimeout(() => {
            $('.light').removeClass('on');
        }, interval / 2);
    }
}

function calcDeley() {
    let mpb = 60000 / bpm;
    let ext = mpb * count;
    let nd = Date.now();
    let ct = nd - startDate;
    if (ct < ext - 2 * mpb) {
        console.log("too slow");
        count = Math.ceil((ext - ct + mpb) / mpb);
    } else if (ct > ext) {
        console.log("too fast");
        count += Math.ceil((ct - ext) / mpb);
    }
    let res = Math.round(startDate + mpb * count - nd);
    return res;
}

function tick() {
    if (playFlag) {
        playsound();
        //console.log({ count, ct, ext: (mpb * count) });
        //console.log(interval);
        count++;
    } else {
        playFlag = true;
    }
}

async function getSound(url) {
    const response = await fetch(url);
    const arraybuffer = await response.arrayBuffer();
    return arraybuffer;
}

$(function() {
    try {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        ctx = new AudioContext();
        gainNode = ctx.createGain()
    } catch (e) {}
    listenEvent();
    onChangeBpm(120);
    onChangeBeat(4);
    onChangeVol(80);
    bun_buffer = getSound(bun_url);
    cha_buffer = getSound(cha_url);

});
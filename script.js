var bpm;
var beat;
var play = false;
var playFlag = true;
var bun = new Audio("bun.mp3");
var cha = new Audio("cha.mp3");
var count = 1;
var honke = false;
var startDate;

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
};

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

function tick() {
    if (playFlag) {
        interval = startDate + 60000 / bpm * count - Date.now();
        if (interval <= 0) {
            intreval = Math.ceil((Date.now() - startDate) /
                (60000 / bpm)) * count - Date.now();
        }
        console.log(interval);

        setTimeout(tick, interval);
        let cha_condition;
        let bun_condition;
        if ($("#honke").prop('checked')) {
            cha_condition = beat != 0 && count % beat == beat - 1;
            bun_condition = beat != 0 && count % beat != 0;
        } else {
            cha_condition = beat != 0 && count % beat == 0;
            bun_condition = true;
        }

        if (cha_condition) {
            cha.currentTime = 0;
            cha.play();
        } else if (bun_condition) {
            bun.currentTime = 0;
            bun.play();
        }
        count++;
    } else {
        playFlag = true;
    }
}

$(function() {
    listenEvent();
    onChangeBpm(120);
    onChangeBeat(4);
    onChangeVol(80);
});
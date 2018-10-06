input.onchange = function(){
    var audio = document.getElementById('audio');
    var reader = new FileReader();
    reader.onload = function(e) {
        audio.src = this.result;
        audio.controls = true;

        var source = context.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(context.destination);

        if(audio.paused){
            audio.play();
        }

        rafCallback();

        };
    reader.readAsDataURL(this.files[0]);
}

var canvas = document.getElementById('fft');
var ctx = canvas.getContext('2d');

const CANVAS_HEIGHT = canvas.height;
const CANVAS_WIDTH = canvas.width;

var context = new AudioContext();
var analyser = context.createAnalyser();

function rafCallback(time) {
    window.requestAnimationFrame(rafCallback, canvas);

    var freqByteData = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(freqByteData);

    var SPACER_WIDTH = 10;
    var BAR_WIDTH = 5;
    var OFFSET = 1;
    var CUTOFF = 100;
    var numBars = Math.round(CANVAS_WIDTH / SPACER_WIDTH);

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillStyle = '#3A5E8C';
    ctx.lineCap = 'round';

    for (var i = 0; i < numBars; ++i) {
        var magnitude = freqByteData[i*5 + OFFSET] - CUTOFF;
        ctx.fillRect(i * SPACER_WIDTH, CANVAS_HEIGHT, BAR_WIDTH, -magnitude);
    }
}


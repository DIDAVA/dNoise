/*!
 * dNoise.js v1.0.0
 * (c) 2019 DIDAVA Media
 * Released under the MIT License.
 * https://www.didava.ir
 * https://github.com/DIDAVA/dNoise
 */

const AudioContext = window.AudioContext || window.webkitAudioContext;

function dNoise() {
  const ctx = new AudioContext();

  // White Noise
  const duration = 10;
  const channels = 2;
  const frameCount = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(channels, frameCount, ctx.sampleRate);
  for (var channel = 0; channel < channels; channel++) {
    let chBuf = buffer.getChannelData(channel);
    for (var i = 0; i < frameCount; i++) chBuf[i] = Math.random() * 2 - 1;
  }

  // Gain
  const gain = ctx.createGain();
  gain.gain.value = 0.85;

  let chain = [gain];

  // EQ
  let eq = {};
  const octaves = [31,62,125,250,500,1000,2000,4000,8000,16000,22050];
  octaves.forEach( (freq, index) => {
    const filter = ctx.createBiquadFilter();
    if (index == 0) filter.type = 'lowshelf';
    else if (index == octaves.length - 1) filter.type = 'highshelf';
    else filter.type = 'peaking';
    filter.frequency.value = freq;
    Object.defineProperty(eq, `q${freq}`, {
      enumerable: true,
      get(){ return filter.gain.value },
      set(value){ if (typeof value === 'number') filter.gain.value = value }
    });
    chain.push(filter);
  });

  // LPF
  const lpf = ctx.createBiquadFilter();
  lpf.type = 'lowpass';
  lpf.frequency.value = 22050;

  // HPF
  const hpf = ctx.createBiquadFilter();
  hpf.type = 'highpass';
  hpf.frequency.value = 0;

  // Master Volume
  const master = ctx.createGain();

  chain.push(lpf, hpf, master, ctx.destination);
  
  // Connect All Nodes
  chain.forEach( (node, index) => { if (index != 0) chain[index-1].connect(node) });

  let source, time = 0, timer;
  const play = () => {
    this.stop();
    source = ctx.createBufferSource();
    source.connect(gain);
    source.loop = true;
    source.buffer = buffer;
    source.start();
    time = 0;
    timer = setInterval(()=>{ time++ },1000);
  };

  const preset = (start, step, LF = 22050, HF = 0) => {
    lpf.frequency.value = LF;
    hpf.frequency.value = HF;
    octaves.forEach( (freq, index) => eq[`q${freq}`] = parseInt(start + (index * step)) );
    play();
  };

  this.red = function(){ preset(15, -6); }
  this.pink = function(){ preset(15, -3); }
  this.white = function(){ preset(0, 0); }
  this.blue = function(){ preset(-15, 3); }
  this.violet = function(){ preset(-51, 6); }

  this.stop = function(){
    if (source instanceof AudioBufferSourceNode) {
      source.stop();
      source.disconnect(gain);
      source = null;
      clearInterval(timer);
    } 
  };

  Object.defineProperties(dNoise.prototype, {
    volume: {
      enumerable: true,
      get(){ return master.gain.value },
      set(value){ master.gain.value = value }
    },
    modes: {
      enumerable: true,
      writable: false,
      configurable: false,
      value: ['red', 'pink', 'white', 'blue', 'violet']
    },
    time: {
      enumerable: true,
      get(){ return time }
    },
    formattedTime: {
      enumerable: true,
      get(){
        const pad = (num, size) => { return ('000' + num).slice(size * -1) },
        hours = Math.floor(time / 3600),
        minutes = Math.floor(time / 60) % 60,
        seconds = Math.floor(time - minutes * 60);
        return `${pad(hours, 2)}:${pad(minutes, 2)}:${pad(seconds, 2)}`;
      }
    }
  });
}
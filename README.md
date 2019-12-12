# dNoise
**Audio Noise Generator for Web Browsers**

`dNoise` is a standard audio noise generator covering most popular noise types such as `White Noise`, `Pink Noise`, `Red Noise` also known as `Brownian Noise`, `Blue Noise`, and `Violet Noise` that are used by sound engineers. `dNoise` uses `Web Audio API` which is not supported in old browsers like `Microsoft Internet Explorer` and works on latest modern browsers such as `Chrome`, `Firefox` and `Safari`.

## Basic Setup
```javascript
const noise = new dNoise();
```

## Methods
`dNoise` starts generating noise ba calling methods:

#### Generator Methods
```javascript
noise.white();  // Starts generating white noise
noise.pink();   // Starts generating pink noise
noise.blue();   // Starts generating blue noise
noise.red();    // Starts generating red or brownian noise
noise.violet(); // Starts generating violet noise
```

#### Stop Method
Stops the generator immediately
```javascript
noise.stop(); // Stops generator
```

## Properties
`dNoise` comes with a few useful properties:

#### Volume
Sets or gets the output volume. The default value is `1`.
```javascript
noise.volume = 0.75; // Sets the output volume to 0.75
let currentVolume = noise.volume; // Gets the current output volume
```

#### Modes
Returns a list of available noise modes as an array.
```javascript
let availableModes = noise.modes; // Gets available noise modes
```

#### Time
Returns the playback duration in seconds.
```javascript
let duration = noise.time; // Gets playback duration
```

#### formattedTime
Returns playback duration in `hh:mm:ss` format.
```javascript
let duration = noise.formattedTime; // Gets formatted playback duration
```

For more information and details please check the [example](https://github.com/DIDAVA/dNoise/examples/index.html).
Improvment pulls and feature requests are welcome. 
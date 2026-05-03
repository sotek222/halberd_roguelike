import { Howl } from 'howler';

// This is a complete prototype for an audio engine.
// for now its very basic, but it will eventually handle all audio for the game, including music and sound effects.
class AudioEngine {
  constructor() {
    this.backgroundMusic = new Howl({
      src: ['public/audio/background.ogg'],
      volume: 0.25,
      loop: true,
    });
    this.soundEffects = {
      descent: new Howl({
        src: ['public/audio/descent.ogg'],
        volume: 2,
      }),
      victory: new Howl({
        src: ['public/audio/victory.ogg'],
      }),
    };
  }
}

export default AudioEngine;

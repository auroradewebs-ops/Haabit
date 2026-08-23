// Web Audio API Sound Generator for Pomodoro Ambient Sounds & Chimes

class SoundEngine {
  private ctx: AudioContext | null = null;
  private ambientSource: { stop: () => void } | null = null;
  private currentType: string = 'none';

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Play gentle completion chime (Tibetan bowl / Crystal bell tone)
  playChime(type: 'complete' | 'break' | 'tick' | 'success' = 'complete') {
    try {
      const ctx = this.initContext();
      const now = ctx.currentTime;

      if (type === 'complete' || type === 'break') {
        const baseFreq = type === 'complete' ? 528 : 440; // 528Hz Solfeggio frequency (healing/focus)
        const freqs = [baseFreq, baseFreq * 1.5, baseFreq * 2.01, baseFreq * 2.76];

        freqs.forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, now);

          const decay = 2.5 - i * 0.4;
          const initialVol = (0.25 / (i + 1));

          gain.gain.setValueAtTime(initialVol, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + decay);
        });
      } else if (type === 'success') {
        // Cheerful major chord arpeggio
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, index) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const noteTime = now + index * 0.07;

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, noteTime);

          gain.gain.setValueAtTime(0.18, noteTime);
          gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.35);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(noteTime);
          osc.stop(noteTime + 0.35);
        });
      } else if (type === 'tick') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.03);
      }
    } catch {
      // Audio autoplay policy fallback
    }
  }

  playClick() {
    this.playChime('tick');
  }

  // Play continuous ambient soundscapes
  playAmbient(type: 'none' | 'rain' | 'waves' | 'forest' | 'cafe' | 'whitenoise', volume: number = 0.5) {
    if (this.currentType === type && this.ambientSource) {
      this.setAmbientVolume(volume);
      return;
    }

    this.stopAmbient();

    if (type === 'none') {
      this.currentType = 'none';
      return;
    }

    try {
      const ctx = this.initContext();
      this.currentType = type;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume * 0.4, ctx.currentTime);
      masterGain.connect(ctx.destination);

      if (type === 'rain' || type === 'whitenoise') {
        // Brown/Pink noise buffer
        const bufferSize = 2 * ctx.sampleRate;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          output[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = output[i];
          output[i] *= 3.5; // boost
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = type === 'rain' ? 'lowpass' : 'bandpass';
        filter.frequency.setValueAtTime(type === 'rain' ? 800 : 1200, ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(masterGain);
        whiteNoise.start();

        this.ambientSource = {
          stop: () => {
            try {
              whiteNoise.stop();
              whiteNoise.disconnect();
            } catch {
              // ignore
            }
          }
        };
      } else if (type === 'waves') {
        // Synthesize slow relaxing wave oscillations
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * 0.3;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(350, ctx.currentTime);

        const lfo = ctx.createOscillator();
        lfo.frequency.setValueAtTime(0.12, ctx.currentTime); // Wave period ~8s
        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(250, ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);

        noise.connect(filter);
        filter.connect(masterGain);

        lfo.start();
        noise.start();

        this.ambientSource = {
          stop: () => {
            try {
              lfo.stop();
              noise.stop();
            } catch {
              // ignore
            }
          }
        };
      } else if (type === 'forest' || type === 'cafe') {
        // Wind + soft harmonic layer
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const subGain = ctx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(type === 'forest' ? 220 : 180, ctx.currentTime);
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(type === 'forest' ? 330 : 270, ctx.currentTime);

        subGain.gain.setValueAtTime(0.08, ctx.currentTime);

        osc1.connect(subGain);
        osc2.connect(subGain);
        subGain.connect(masterGain);

        osc1.start();
        osc2.start();

        this.ambientSource = {
          stop: () => {
            try {
              osc1.stop();
              osc2.stop();
            } catch {
              // ignore
            }
          }
        };
      }
    } catch {
      // ignore
    }
  }

  setAmbientVolume(volume: number) {
    // Handled via re-call or active nodes
  }

  stopAmbient() {
    if (this.ambientSource) {
      this.ambientSource.stop();
      this.ambientSource = null;
    }
    this.currentType = 'none';
  }
}

export const soundEngine = new SoundEngine();

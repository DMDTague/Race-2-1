// src/utils/audio.js

class SoundManager {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      } catch {
        this.ctx = null;
      }
    }
  }

  playTone(freq, type = 'sine', duration = 0.1, gainVal = 0.1) {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio fallback silent catch
    }
  }

  playSelect() {
    this.playTone(523.25, 'sine', 0.08, 0.08); // C5
  }

  playDeselect() {
    this.playTone(392.0, 'sine', 0.08, 0.06); // G4
  }

  playAsk() {
    this.playTone(659.25, 'triangle', 0.15, 0.1); // E5
    setTimeout(() => this.playTone(880, 'triangle', 0.2, 0.1), 100); // A5
  }

  playEliminate() {
    this.playTone(220, 'sawtooth', 0.12, 0.05);
  }

  playWin() {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'triangle', 0.25, 0.12), idx * 120);
    });
  }

  playLoss() {
    const notes = [440, 392, 349.23, 293.66];
    notes.forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'sawtooth', 0.2, 0.1), idx * 120);
    });
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }
}

export const sound = new SoundManager();

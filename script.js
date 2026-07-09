/**
 * Stimulain Artist Portal - Script
 * Custom Web Audio API player controller with live spectrum analysis
 * Decouples CORS constraints for local execution, and drives a circular spectrum analyzer vortex.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Track Catalogue with Local Art Folders and Unsplash Web Fallbacks
  const TRACKS = [
    {
      title: "Rohaan - Easy for them (Stimulain Patreon Remix)",
      file: "music/Rohaan_-_Easy_For_Them__(Stimulain_PATREON_Remix)_ver2.0_FINAL_duplicate.mp3",
      artwork: "artwork/Stimulain__art__Easy-for-them_cropped_duplicate.jpg",
      artworkFallback: "https://images.unsplash.com/photo-1614680376593-902f74fa0d41?q=80&w=400"
    },
    {
      title: "Late 2025 Mix",
      file: "music/Stimulain_-_Late_2025_MIX_FINAL_Low_Quality_duplicate.mp3",
      artwork: "artwork/Late_2025_Mix-ART_duplicate.jpg",
      artworkFallback: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400"
    }
  ];

  let currentTrackIndex = 0;
  let isPlaying = false;
  
  // Web Audio Contexts
  let audioCtx = null;
  let analyser = null;
  let sourceNode = null;
  let frequencyData = new Uint8Array(64); // 64 frequency bands for higher density visual
  
  // Audio state transition constants
  let vortexStrength = 0; // Swirl fade speed multiplier

  // Backup Synthesizer variables
  let synthActive = false;
  let synthGain = null;
  let synthFilter = null;
  let synthInterval = null;

  // DOM Elements
  const audioEl = document.getElementById("native-audio");
  const playBtn = document.getElementById("player-play-btn");
  const prevBtn = document.getElementById("player-prev-btn");
  const nextBtn = document.getElementById("player-next-btn");
  const playIcon = document.getElementById("play-icon");
  const pauseIcon = document.getElementById("pause-icon");
  const trackTitle = document.getElementById("player-track-title");
  const trackArt = document.getElementById("player-track-art");
  const timeCurrent = document.getElementById("time-current");
  const timeTotal = document.getElementById("time-total");
  const progressFill = document.getElementById("player-progress-fill");
  const progressContainer = document.getElementById("player-progress-container");
  const volumeSlider = document.getElementById("player-volume-slider");
  const playlistContainer = document.getElementById("playlist-tracks");
  const vortexContainer = document.getElementById("vortex-container");
  const vortexArt = document.getElementById("vortex-art");
  const corsNotification = document.getElementById("cors-notification");

  // Load Playlist HTML
  initPlaylist();

  // Load Initial Track Metadata
  loadTrack(currentTrackIndex, false);

  // Setup Event Listeners
  playBtn.addEventListener("click", togglePlay);
  prevBtn.addEventListener("click", playPrevious);
  nextBtn.addEventListener("click", playNext);
  volumeSlider.addEventListener("input", adjustVolume);
  progressContainer.addEventListener("click", seekAudio);
  
  // Audio state listeners
  audioEl.addEventListener("timeupdate", updateProgressBar);
  audioEl.addEventListener("loadedmetadata", updateDurationText);
  audioEl.addEventListener("ended", playNext);
  
  // Handle local artwork loading failure (fallback to Unsplash)
  vortexArt.addEventListener("error", () => {
    const track = TRACKS[currentTrackIndex];
    if (vortexArt.getAttribute("src") !== track.artworkFallback) {
      console.info(`Custom vortex artwork not found for '${track.title}'. Loading cosmic visual fallback...`);
      vortexArt.src = track.artworkFallback;
    }
  });

  trackArt.addEventListener("error", () => {
    const track = TRACKS[currentTrackIndex];
    if (trackArt.getAttribute("src") !== track.artworkFallback) {
      console.info(`Custom thumbnail artwork not found for '${track.title}'. Loading cosmic visual fallback...`);
      trackArt.src = track.artworkFallback;
    }
  });

  // If local MP3 fails to load (CORS block or missing file), trigger fallback synth
  audioEl.addEventListener("error", (e) => {
    // Only fire error if playing state is active and we failed to load
    if (isPlaying && !synthActive) {
      console.warn("Local MP3 master file load error. Activating synthesized backup engine...");
      activateFallbackSynth();
    }
  });

  // Setup Canvas Spectrums (Circular main visualizer)
  initVortexCanvas();

  /**
   * Initializes the Playlist Grid HTML dynamically
   */
  function initPlaylist() {
    playlistContainer.innerHTML = "";
    TRACKS.forEach((track, index) => {
      const li = document.createElement("li");
      li.textContent = `${(index + 1).toString().padStart(2, "0")}. ${track.title}`;
      if (index === currentTrackIndex) li.classList.add("active");
      
      li.addEventListener("click", () => {
        selectTrack(index);
      });
      playlistContainer.appendChild(li);
    });
  }

  /**
   * Loads a track by catalog index
   */
  function loadTrack(index, autoplay = true) {
    stopFallbackSynth(); // Turn off synth if loading another track
    
    currentTrackIndex = index;
    const track = TRACKS[index];

    // Update UI Elements
    trackTitle.textContent = track.title;
    trackArt.src = track.artwork;

    // Load custom artwork into vortex background
    if (vortexArt) {
      vortexArt.src = track.artwork;
    }

    // Set active playlist item
    const items = playlistContainer.querySelectorAll("li");
    items.forEach((item, idx) => {
      if (idx === index) item.classList.add("active");
      else item.classList.remove("active");
    });

    // Update Audio element source
    audioEl.src = track.file;
    audioEl.load();

    // Reset progress details
    progressFill.style.width = "0%";
    timeCurrent.textContent = "0:00";
    timeTotal.textContent = "0:00";

    if (autoplay) {
      playAudio();
    }
  }

  function selectTrack(index) {
    loadTrack(index, true);
  }

  function playPrevious() {
    let prev = currentTrackIndex - 1;
    if (prev < 0) prev = TRACKS.length - 1;
    loadTrack(prev, true);
  }

  function playNext() {
    let next = currentTrackIndex + 1;
    if (next >= TRACKS.length) next = 0;
    loadTrack(next, true);
  }

  /**
   * Main Play/Pause state switcher
   */
  function togglePlay() {
    // Initialize Web Audio context on user action
    initAudioContext();

    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  }

  function playAudio() {
    isPlaying = true;
    playIcon.classList.add("hidden");
    pauseIcon.classList.remove("hidden");

    if (vortexContainer) {
      vortexContainer.classList.add("active");
    }

    // Play the native audio track
    audioEl.play().catch(err => {
      console.warn("Direct HTML5 audio playback failed. Triggering backup synth...");
      activateFallbackSynth();
    });
  }

  function pauseAudio() {
    isPlaying = false;
    playIcon.classList.remove("hidden");
    pauseIcon.classList.add("hidden");

    if (vortexContainer) {
      vortexContainer.classList.remove("active");
    }

    if (synthActive) {
      stopFallbackSynth();
    } else {
      audioEl.pause();
    }
  }

  function adjustVolume() {
    audioEl.volume = volumeSlider.value;
    if (synthGain) {
      synthGain.gain.setValueAtTime(volumeSlider.value * 0.25, audioCtx.currentTime);
    }
  }

  function updateProgressBar() {
    if (synthActive) return;
    const progress = (audioEl.currentTime / audioEl.duration) * 100;
    progressFill.style.width = `${progress}%`;
    timeCurrent.textContent = formatTime(audioEl.currentTime);
  }

  function updateDurationText() {
    timeTotal.textContent = formatTime(audioEl.duration);
  }

  function seekAudio(e) {
    if (synthActive) return;
    const rect = progressContainer.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    audioEl.currentTime = pos * audioEl.duration;
  }

  function formatTime(secs) {
    if (isNaN(secs)) return "0:00";
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  /**
   * Initializes the AudioContext and routes the Analyser Nodes
   * Mitigates CORS constraints dynamically under file:// execution
   */
  function initAudioContext() {
    if (audioCtx) return;

    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();
      
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 128; // 64 frequency bins
      frequencyData = new Uint8Array(analyser.frequencyBinCount);

      // Verify if running locally under file://
      const isLocal = window.location.protocol === "file:";
      
      if (!isLocal) {
        // Set crossorigin dynamically only under http/https servers (like GitHub Pages)
        audioEl.crossOrigin = "anonymous";
        
        sourceNode = audioCtx.createMediaElementSource(audioEl);
        sourceNode.connect(analyser);
        analyser.connect(audioCtx.destination);
        console.info("Piped HTML5 audio source node with CORS parameters.");
      } else {
        // Local file execution bypass: Do NOT connect sourceNode to prevent CORS blocks.
        // The audio element plays natively directly, and we run simulated visualizer data.
        console.info("Running locally under file:// scheme. Bypassing Web Audio CORS blockages.");
        if (corsNotification) {
          corsNotification.classList.remove("hidden"); // Reveal the CORS server advisory
        }
      }
    } catch (e) {
      console.error("Failed to initialize Web Audio API Context:", e);
    }
  }

  /**
   * Backup Synthesizer Engine
   * Generates rhythmic electronic note loops using OscillatorNodes and routes them to the analyser
   */
  function activateFallbackSynth() {
    if (synthActive || !audioCtx) return;
    synthActive = true;

    // Display subtext alert
    trackTitle.textContent = `${TRACKS[currentTrackIndex].title} (Synthesizer fallback active)`;

    // Create Nodes
    synthFilter = audioCtx.createBiquadFilter();
    synthFilter.type = "lowpass";
    synthFilter.frequency.value = 450;
    
    synthGain = audioCtx.createGain();
    synthGain.gain.value = volumeSlider.value * 0.25;

    // Connect nodes to pipeline
    synthFilter.connect(synthGain);
    synthGain.connect(analyser);

    let beatCount = 0;
    timeTotal.textContent = "Live Synth Loop";

    // 130 BPM Techno kick beat
    synthInterval = setInterval(() => {
      if (!isPlaying) return;

      beatCount++;
      const synthProgress = (beatCount % 64) / 64 * 100;
      progressFill.style.width = `${synthProgress}%`;
      timeCurrent.textContent = `BEAT ${beatCount}`;

      if (beatCount % 2 === 0) {
        triggerSynthBeat(beatCount % 8 === 0 ? 55 : 65);
      }
    }, 230);
  }

  function triggerSynthBeat(frequency) {
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const noteGain = audioCtx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(frequency / 2, audioCtx.currentTime + 0.2);

    noteGain.gain.setValueAtTime(1.0, audioCtx.currentTime);
    noteGain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);

    osc.connect(noteGain);
    noteGain.connect(synthFilter);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.35);
  }

  function stopFallbackSynth() {
    synthActive = false;
    if (synthInterval) {
      clearInterval(synthInterval);
      synthInterval = null;
    }
    if (synthGain) {
      try {
        synthGain.disconnect();
      } catch (e) {}
      synthGain = null;
    }
  }

  /**
   * Initializes the Spherical Spectrum Analyzer orbiting the central cover art image
   * Reacts to real frequency data (http) or high-fidelity simulated coefficients (local file)
   */
  function initVortexCanvas() {
    const vCanvas = document.getElementById("vortex-canvas");
    if (!vCanvas) return;

    const vCtx = vCanvas.getContext("2d");
    const miniCanvas = document.getElementById("mini-visualizer");
    const miniCtx = miniCanvas ? miniCanvas.getContext("2d") : null;
    let offset = 0;

    function resizeVCanvas() {
      vCanvas.width = vCanvas.parentElement.clientWidth;
      vCanvas.height = vCanvas.parentElement.clientHeight;
    }
    resizeVCanvas();
    window.addEventListener("resize", resizeVCanvas);

    function drawVortex() {
      vCtx.clearRect(0, 0, vCanvas.width, vCanvas.height);

      const w = vCanvas.width;
      const h = vCanvas.height;
      const cx = w / 2;
      const cy = h / 2;
      
      const innerRadius = 165; // Wrap just outside the 320px artwork circle (radius 160)
      const numBins = frequencyData.length;
      
      // Determine active scale multiplier
      let activeGlow = 0;
      const isLocal = window.location.protocol === "file:";

      if (isPlaying) {
        activeGlow += (1 - activeGlow) * 0.1;
        vortexStrength = Math.min(1, vortexStrength + 0.03); // swirl fade multiplier
        
        if (isLocal && !synthActive) {
          // Bypassed local visualizer: Fill frequencyData with simulated frequency waves
          for (let i = 0; i < numBins; i++) {
            const speedFactor = 0.05 + (i * 0.003);
            // Simulate deep bass on lower bins, tapering off to mid/highs
            const bassKick = Math.sin(offset * 2.2) * 0.4 + 0.6;
            const trebleWave = Math.sin(offset * speedFactor * 12 + i * 0.55) * 0.35 + 0.45;
            
            const valueCurve = (i < 10) ? (trebleWave * 0.4 + bassKick * 0.6) : trebleWave;
            const randomSpike = Math.random() * 0.12;
            const slope = (numBins - i) / numBins;
            
            const targetVal = Math.floor((valueCurve + randomSpike) * 255 * slope * vortexStrength);
            frequencyData[i] += (targetVal - frequencyData[i]) * 0.35;
          }
        } else if (analyser) {
          // Fetch exact Ableton-grade frequency bytes from the stream!
          analyser.getByteFrequencyData(frequencyData);
        }
      } else {
        // Fade visual displays to zero
        if (frequencyData.length > 0) {
          for (let i = 0; i < frequencyData.length; i++) {
            frequencyData[i] *= 0.85;
          }
        }
        activeGlow += (0 - activeGlow) * 0.08;
        vortexStrength = Math.max(0, vortexStrength - 0.04);
      }

      vCtx.save();
      
      // Slow continuous circular rotation offset to give a vortex feel
      const rotationAngle = offset * 0.12;

      // 1. Draw Radiating Equalizer Line Bars (Circular Spectrum Analyzer)
      for (let i = 0; i < numBins; i++) {
        const value = frequencyData[i] || 0;
        // Radial bars can extend up to 85px outward
        const barHeight = (value / 255) * 85 * vortexStrength;

        // Space bars evenly in a circle (360 degrees / 2PI)
        const angle = (i / numBins) * Math.PI * 2 + rotationAngle;

        const startX = cx + Math.cos(angle) * innerRadius;
        const startY = cy + Math.sin(angle) * innerRadius;
        const endX = cx + Math.cos(angle) * (innerRadius + barHeight);
        const endY = cy + Math.sin(angle) * (innerRadius + barHeight);

        // Draw radial bars
        vCtx.beginPath();
        vCtx.moveTo(startX, startY);
        vCtx.lineTo(endX, endY);

        vCtx.strokeStyle = isPlaying ? "rgba(217, 70, 239, 0.85)" : "rgba(6, 182, 212, 0.4)";
        vCtx.lineWidth = 4.5;
        vCtx.lineCap = "round";

        if (isPlaying) {
          vCtx.shadowBlur = 8;
          vCtx.shadowColor = "#d946ef";
        } else {
          vCtx.shadowBlur = 0;
        }
        
        vCtx.stroke();
      }

      // 2. Draw Pulsing/Undulating Circular Oscilloscope Ring (The VST containment shield)
      vCtx.beginPath();
      
      const numOscPoints = 120; // High resolution path
      for (let j = 0; j <= numOscPoints; j++) {
        const angle = (j / numOscPoints) * Math.PI * 2;
        
        // Find corresponding frequency value for this angle sector
        const freqBinIndex = Math.floor((j / numOscPoints) * numBins) % numBins;
        const freqVal = frequencyData[freqBinIndex] || 0;
        
        // Dynamic oscilloscope radius offsets:
        // Pulsate radius inwards/outwards reacting directly to frequency heights
        const waveOscillation = Math.sin(angle * 14 + offset * 3.5) * (freqVal / 255 * 18);
        const currentRadius = innerRadius + 2 + waveOscillation * vortexStrength;

        const x = cx + Math.cos(angle) * currentRadius;
        const y = cy + Math.sin(angle) * currentRadius;

        if (j === 0) {
          vCtx.moveTo(x, y);
        } else {
          vCtx.lineTo(x, y);
        }
      }
      
      vCtx.closePath();
      vCtx.strokeStyle = isPlaying ? "rgba(6, 182, 212, 0.9)" : "rgba(6, 182, 212, 0.25)";
      vCtx.lineWidth = isPlaying ? 3 : 2;

      if (isPlaying) {
        vCtx.shadowBlur = 12;
        vCtx.shadowColor = "#06b6d4";
      } else {
        vCtx.shadowBlur = 4;
        vCtx.shadowColor = "#06b6d4";
      }
      vCtx.stroke();

      vCtx.restore();

      // 3. Draw Header Miniature Reactive Oscillator (stagnant if not playing)
      if (miniCtx) {
        miniCtx.clearRect(0, 0, miniCanvas.width, miniCanvas.height);
        const mcx = miniCanvas.width / 2;
        const mcy = miniCanvas.height / 2;
        const miniInnerRadius = 15;
        const miniNumBins = frequencyData.length;
        const miniRotationAngle = isPlaying ? offset * 0.12 : 0;

        miniCtx.save();

        // Draw Mini Equalizer Bars
        for (let i = 0; i < miniNumBins; i++) {
          const value = frequencyData[i] || 0;
          // Scale bar height down to max 9px extension
          const barHeight = isPlaying ? (value / 255) * 9 * vortexStrength : 0;
          const angle = (i / miniNumBins) * Math.PI * 2 + miniRotationAngle;

          const startX = mcx + Math.cos(angle) * miniInnerRadius;
          const startY = mcy + Math.sin(angle) * miniInnerRadius;
          const endX = mcx + Math.cos(angle) * (miniInnerRadius + barHeight);
          const endY = mcy + Math.sin(angle) * (miniInnerRadius + barHeight);

          miniCtx.beginPath();
          miniCtx.moveTo(startX, startY);
          miniCtx.lineTo(endX, endY);

          miniCtx.strokeStyle = isPlaying ? "rgba(217, 70, 239, 0.85)" : "rgba(6, 182, 212, 0.3)";
          miniCtx.lineWidth = 1.5;
          miniCtx.lineCap = "round";

          if (isPlaying) {
            miniCtx.shadowBlur = 3;
            miniCtx.shadowColor = "#d946ef";
          }
          miniCtx.stroke();
        }

        // Draw Mini Oscilloscope Ring
        miniCtx.beginPath();
        const miniNumOscPoints = 60;
        for (let j = 0; j <= miniNumOscPoints; j++) {
          const angle = (j / miniNumOscPoints) * Math.PI * 2;
          const freqBinIndex = Math.floor((j / miniNumOscPoints) * miniNumBins) % miniNumBins;
          const freqVal = frequencyData[freqBinIndex] || 0;

          const waveOscillation = isPlaying ? Math.sin(angle * 8 + offset * 3.5) * (freqVal / 255 * 3) : 0;
          const currentRadius = miniInnerRadius + 1 + waveOscillation * vortexStrength;

          const x = mcx + Math.cos(angle) * currentRadius;
          const y = mcy + Math.sin(angle) * currentRadius;

          if (j === 0) {
            miniCtx.moveTo(x, y);
          } else {
            miniCtx.lineTo(x, y);
          }
        }
        miniCtx.closePath();
        miniCtx.strokeStyle = isPlaying ? "rgba(6, 182, 212, 0.9)" : "rgba(6, 182, 212, 0.25)";
        miniCtx.lineWidth = isPlaying ? 1.5 : 1;

        if (isPlaying) {
          miniCtx.shadowBlur = 4;
          miniCtx.shadowColor = "#06b6d4";
        } else {
          miniCtx.shadowBlur = 1;
          miniCtx.shadowColor = "#06b6d4";
        }
        miniCtx.stroke();
        miniCtx.restore();
      }

      offset += isPlaying ? 0.06 : 0.01;
      requestAnimationFrame(drawVortex);
    }

    drawVortex();
  }
});

(function () {
  if (!('speechSynthesis' in window)) { window.ttsEngine = null; return; }

  const main = document.getElementById('main-content');
  if (!main) { window.ttsEngine = null; return; }

  const nodes = Array.from(main.querySelectorAll('h1, h2, h3, p')).filter(el => el.textContent.trim().length > 0);

  let voice = null;
  function pickVoice() {
    const voices = window.speechSynthesis.getVoices();
    voice = voices.find(v => v.lang === 'pl-PL') || voices.find(v => v.lang && v.lang.startsWith('pl')) || null;
  }
  pickVoice();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = pickVoice;
  }

  let playing = false;
  let currentIndex = 0;
  const listeners = [];

  function notify() { listeners.forEach(fn => { try { fn(playing); } catch (e) {} }); }

  function clearHighlight() {
    nodes.forEach(n => n.classList.remove('tts-highlight'));
  }

  function speakFrom(i) {
    if (i >= nodes.length) {
      playing = false;
      currentIndex = 0;
      clearHighlight();
      notify();
      return;
    }
    currentIndex = i;
    clearHighlight();
    nodes[i].classList.add('tts-highlight');
    nodes[i].scrollIntoView({ behavior: 'smooth', block: 'center' });

    const utter = new SpeechSynthesisUtterance(nodes[i].textContent.trim());
    utter.lang = 'pl-PL';
    if (voice) utter.voice = voice;
    utter.rate = 0.95;
    utter.onend = () => { if (playing) speakFrom(i + 1); };
    utter.onerror = () => { playing = false; clearHighlight(); notify(); };
    window.speechSynthesis.speak(utter);
  }

  function start() {
    if (!nodes.length || playing) return;
    playing = true;
    notify();
    speakFrom(currentIndex || 0);
  }
  function stop() {
    playing = false;
    window.speechSynthesis.cancel();
    clearHighlight();
    notify();
  }
  function toggle() { if (playing) stop(); else start(); }

  window.ttsEngine = {
    start, stop, toggle,
    isPlaying: () => playing,
    hasContent: nodes.length > 0,
    onChange: fn => listeners.push(fn),
  };

  window.addEventListener('pagehide', stop);

  // Na stronach ETR: własny, widoczny przycisk pod linkiem powrotnym.
  if (/-etr\.html$/.test(location.pathname) && nodes.length) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'inline-flex items-center gap-2.5 bg-white hover:bg-gray-50 text-brand-700 font-bold text-base px-5 py-3 rounded-xl shadow-sm border-2 border-brand-200 transition-colors';

    function render() {
      const label = playing ? 'Zatrzymaj czytanie' : 'Czytaj na głos';
      const icon = playing ? 'square' : 'volume-2';
      btn.innerHTML = `<i data-lucide="${icon}" class="w-5 h-5" aria-hidden="true"></i><span>${label}</span>`;
      if (window.lucide) window.lucide.createIcons({ attrs: { 'aria-hidden': 'true' } });
    }
    render();
    listeners.push(render);
    btn.addEventListener('click', toggle);

    const backLink = Array.from(main.querySelectorAll('a')).find(a => a.textContent.includes('Zobacz zwykłą wersję'));
    if (backLink && backLink.parentElement) {
      const wrap = document.createElement('div');
      wrap.className = 'mt-4';
      wrap.appendChild(btn);
      backLink.parentElement.appendChild(wrap);
    } else {
      main.insertBefore(btn, main.firstChild);
    }
    if (window.lucide) window.lucide.createIcons({ attrs: { 'aria-hidden': 'true' } });
  }
})();

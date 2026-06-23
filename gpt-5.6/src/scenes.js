window.GPT56Scenes = {
  intro: `<section class="station" id="s1">
  <div class="label">Introducing</div>
  <div data-hf-studio-original-display="" data-hf-studio-original-box-sizing="" data-hf-studio-original-flex-shrink="" data-hf-studio-original-flex-grow="" data-hf-studio-original-flex-basis="" data-hf-studio-original-max-height="" data-hf-studio-original-max-width="" data-hf-studio-original-min-height="" data-hf-studio-original-min-width="" data-hf-studio-original-height="" data-hf-studio-original-width="" data-hf-studio-box-size="true" style="--hf-studio-width:642px;--hf-studio-height:189px;width:642px;height:189px;min-width:0px;min-height:0px;max-width:none;max-height:none;flex-basis:189px;flex-grow:0;flex-shrink:0;box-sizing:border-box" class="pill-inner hero-pill">
    <div class="shine"></div>
    <div class="model">GPT-<span class="verwrap"><span class="verroll"><span class="ver">5.1</span><span class="ver">5.2</span><span class="ver">5.3</span><span class="ver">5.4</span><span class="ver">5.5</span><span class="ver">5.6</span></span></span></div>
  </div>
  <div data-hf-studio-original-display="" data-hf-studio-original-box-sizing="" data-hf-studio-original-flex-shrink="" data-hf-studio-original-flex-grow="" data-hf-studio-original-flex-basis="" data-hf-studio-original-max-height="" data-hf-studio-original-max-width="" data-hf-studio-original-min-height="" data-hf-studio-original-min-width="" data-hf-studio-original-height="" data-hf-studio-original-width="" data-hf-studio-box-size="true" style="--hf-studio-width:747px;--hf-studio-height:293px;width:747px;height:293px;min-width:0px;min-height:0px;max-width:none;max-height:none;flex-basis:293px;flex-grow:0;flex-shrink:0;box-sizing:border-box;scale:none" class="sub">The frontier model for <em>real</em> work</div>
</section>`,

  principles: `<section class="station" id="s2">
  <div id="open-mark-small" aria-hidden="true"></div>
  <div class="phrase" id="p1">more <em>intelligence</em> than ever</div>
  <div class="phrase" id="p2">excels at longer <em>agentic</em> work</div>
  <div class="phrase" id="p3">retroactively <em>executes</em> tasks</div>
</section>`,

  baseline: `<section class="station" id="s3">
  <div class="label">From the GPT-5.5 baseline</div>
  <div class="headline">GPT-5.6 is imagined as the next <br>step in practical delegation.</div>
  <div class="metric" id="m1"><div class="num">1M+</div><div class="copy">long-context work without losing the thread<span class="rule"></span></div></div>
  <div class="metric" id="m2"><div class="num">82.7</div><div class="copy">Terminal-Bench reference point for complex tool workflows<span class="rule"></span></div></div>
  <div class="metric" id="m3"><div class="num">84.4</div><div class="copy">BrowseComp strength to build from<span class="rule"></span></div></div>
</section>`,

  terminal: `<section class="station" id="s4">
  <div class="barline"><span class="dot green"></span><span class="dot"></span><span class="dot"></span><span>gpt-5.6 - thinking</span></div>
  <div class="terminal">
    <div class="ln" data-i="0"><span class="prompt">$</span> gpt-5.6 "stabilize the launch"</div>
    <div class="ln dim" data-i="1">&gt; reads the incident notes</div>
    <div class="ln" data-i="2"><span class="ok">ok</span> maps the risky paths</div>
    <div class="ln" data-i="3"><span class="ok">ok</span> patches the rollout plan</div>
    <div class="ln" data-i="4"><span class="ok">ok</span> leaves a clean handoff</div>
  </div>
</section>`,

  logoSwarm: `<section class="station" id="s5">
  <canvas id="swarm" width="1180" height="1180"></canvas>
  <div id="open-mark-large" aria-hidden="true"></div>
  <div class="end-copy">
    <div class="end-title">Try it <em>today</em></div>
    <div class="end-url">chatgpt.com</div>
  </div>
</section>`
};

(function renderScenes() {
  var world = document.getElementById("world");
  world.innerHTML = Object.keys(window.GPT56Scenes).map(function (key) {
    return window.GPT56Scenes[key];
  }).join("\n\n");
})();

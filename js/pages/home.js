export function Home(app) {
  app.innerHTML = `
    <div class="text">
      <h1>SpaceWar</h1>
    </div>
    <div class="play-settings">
      <a href="play.html">Play</a>
      <a href="#settings">Settings</a>
      <div id="app"></div>
    </div>
    `;
}
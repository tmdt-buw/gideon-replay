import {css, html, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {Replay} from '../replay';


@customElement('gd-player')
export class Player extends LitElement {

  static styles = css`
    .player {
      position: fixed;
      width: 500px;
      height: 100px;
      bottom: 50px;
      left: calc(50% - 250px);
      border: 1px solid lightgray;
      background: white;
      padding: 10px;

      --main-color: #1890ff;
    }

    .video-controls {
      right: 0;
      left: 0;
      padding: 10px;
      position: absolute;
      bottom: 0;
      transition: all 0.2s ease;
      background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5));
    }

    .video-controls.hide {
      opacity: 0;
      pointer-events: none;
    }

    .video-progress {
      position: relative;
      height: 3px;
      margin-bottom: 2px;
    }

    .video-progress:hover {
      height: 5px;
      margin-bottom: 0;
    }

    progress {
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      border-radius: 2px;
      width: 100%;
      height: 100%;
      pointer-events: none;
      position: absolute;
      top: 0;
    }

    progress::-webkit-progress-bar {
      background-color: rgba(163, 163, 163, 0.64);
      border-radius: 2px;
    }

    progress::-webkit-progress-value {
      background: var(--main-color);
      opacity: 0.7;
      border-radius: 2px;
    }

    progress::-moz-progress-bar {
      border: 1px solid var(--main-color);
      opacity: 0.7;
      background: var(--main-color);
    }

    .seek {
      position: absolute;
      top: 0;
      width: 100%;
      cursor: pointer;
      margin: 0;
    }

    .seek:hover + .seek-tooltip {
      display: block;
    }

    .seek-tooltip {
      display: none;
      position: absolute;
      top: -50px;
      margin-left: -20px;
      font-size: 12px;
      padding: 3px;
      content: attr(data-title);
      font-weight: bold;
      color: #fff;
      background-color: rgba(0, 0, 0, 0.6);
    }

    .controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .left-controls {
      display: flex;
      align-items: center;
    }

    .right-controls {
      display: flex;
      align-items: center;
    }

    .player-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 30px;
      margin-bottom: 5px;
    }

    .close-button {
      margin: 0;
    }

    .close-icon {
      width: 20px;
      height: 20px;
    }

    .time {
      color: black;
    }

    button {
      cursor: pointer;
      position: relative;
      margin-right: 7px;
      font-size: 12px;
      padding: 3px;
      border: none;
      outline: none;
      background-color: transparent;
    }

    button * {
      pointer-events: none;
    }

    button::before {
      content: attr(data-title);
      position: absolute;
      display: none;
      right: 0;
      top: -50px;
      background-color: rgba(0, 0, 0, 0.6);
      color: #fff;
      font-weight: bold;
      padding: 4px 6px;
      word-break: keep-all;
      white-space: pre;
    }

    button:hover::before {
      display: inline-block;
    }

    .pip-button svg {
      width: 26px;
      height: 26px;
    }

    input[type=range] {
      -webkit-appearance: none;
      -moz-appearance: none;
      height: 3px;
      background: transparent;
      cursor: pointer;
    }

    input[type=range]:focus {
      outline: none;
    }

    input[type=range]::-webkit-slider-runnable-track {
      width: 100%;
      cursor: pointer;
      border-radius: 1.3px;
      -webkit-appearance: none;
      transition: all 0.4s ease;
    }

    .video-progress:hover input[type=range]::-webkit-slider-thumb {
      display: block;
    }

    input[type=range]::-webkit-slider-thumb {
      display: none;
      height: 12px;
      width: 12px;
      border-radius: 12px;
      background: var(--main-color);
      cursor: pointer;
      -webkit-appearance: none;
      margin-left: -1px;
    }

    input[type=range]:focus::-webkit-slider-runnable-track {
      background: transparent;
    }

    input[type=range]::-moz-range-track {
      width: 100%;
      height: 5px;
      cursor: pointer;
      border: 1px solid transparent;
      background: transparent;
      border-radius: 1.3px;
    }

    input[type=range]::-moz-range-thumb {
      height: 14px;
      width: 14px;
      border-radius: 50px;
      border: 1px solid var(--main-color);
      background: var(--main-color);
      cursor: pointer;
      margin-top: 5px;
    }

    input[type=range]:focus::-moz-range-track {
      outline: none;
    }

    .hidden {
      display: none;
    }

    svg {
      width: 28px;
      height: 28px;
      fill: black;
      stroke: #fff;
      cursor: pointer;
    }

    .marks {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .marks .keyboard {
      position: absolute;
      top: 0;
      opacity: 0.5;
      background: blueviolet;
      border-radius: 5px;
      height: 3px;
      width: 1%;
      z-index: 2;
    }

    .marks .active {
      position: absolute;
      top: 0;
      opacity: 0.5;
      background: orange;
      border-radius: 5px;
      height: 3px;
      width: 1%;
      z-index: 2;
    }

    .marks .interact {
      position: absolute;
      top: 0;
      opacity: 0.5;
      background: green;
      border-radius: 5px;
      height: 3px;
      width: 1%;
      z-index: 2;
    }

    .video-progress:hover .marks div {
      height: 5px;
    }
  `;

  constructor(replay: Replay) {
    super();
    this.replay = replay;
    this.activityProfile = replay.getRelativeActionTimes(this.resolution);
    this.replay.complete.subscribe(complete => this.complete = complete);
    this.replay.playing.subscribe(playing => this.playing = playing);
    this.replay.playTime.subscribe(time => this.playTime = Math.round(time / 1000));
  }

  private readonly replay: Replay;
  private readonly resolution = 100;
  private readonly activityProfile;

  heatMapByPlayTime = false;

  @property()
  private complete = false;

  @property()
  private playing = false;

  @property()
  private playTime = 0;

  @property()
  private seek = {
    content: '00:00',
    left: 0
  };

  render() {
    return html`
      <div class="player">
        <div class="player-header">
          <span>GDReplay</span>
          <button class="close-button" data-title=${'Close'} @click=${this.closeReplay}>
            <svg class="close-icon">
              <use href="#close"></use>
            </svg>
          </button>
        </div>
        <div class="video-progress">
          <progress id="progress-bar" .value="${this.playTime}" min="0" max="${this.maxPlayTimeInSeconds()}"></progress>
          <input class="seek" id="seek" .value="${this.playTime}" min="0" max="${this.maxPlayTimeInSeconds()}" type="range"
                 step="1"
                 @input=${this.skipToTimestamp} @mousemove=${this.updateSeekTooltip}>
          <div class="seek-tooltip" id="seek-tooltip" style="left: ${this.seek.left}px">${this.seek.content}</div>
          <div class="marks">
            ${this.activityProfile.map(activity => html`
              <div class="${activity.type}" style="left: ${activity.from * this.resolution / 100}%"></div>`)}
          </div>
        </div>

        <div class="controls">
          <div class="left-controls">
            <button data-title=${this.playing ? 'Pause' : 'Play'} @click=${this.togglePlay}>
              <svg>
                <use href=${this.complete ? '#replay' : this.playing ? '#pause' : '#play'}></use>
              </svg>
            </button>

            <div class="time">
              <time id="time-elapsed">${this.formatPlayTime()}</time>
              <span> / </span>
              <time id="duration">${this.maxPlayTime()}</time>
            </div>
          </div>
          <div class="right-controls">
            <span>Heatmap</span>
            <form>
              <input type="radio" id="off" name="heatmap" value="off" @input=${this.removeHeatmap} checked>
              <label for="off">off</label><br>
              <input type="radio" id="playtime" name="heatmap" value="playtime" @input=${this.enableHeatMapByPlayTime} >
              <label for="playtime">by play time</label><br>
              <input type="radio" id="all" name="heatmap" value="all" @input=${this.showHeatmap} >
              <label for="other">all</label>
            </form>
          </div>
        </div>
      </div>

      <svg style="display: none">
        <defs>
          <symbol id="close" viewBox="0 0 24 24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
          </symbol>

          <symbol id="pause" viewBox="0 0 24 24">
            <path d="M14.016 5.016h3.984v13.969h-3.984v-13.969zM6 18.984v-13.969h3.984v13.969h-3.984z"></path>
          </symbol>

          <symbol id="play" viewBox="0 0 24 24">
            <path d="M8.016 5.016l10.969 6.984-10.969 6.984v-13.969z"></path>
          </symbol>

          <symbol id="replay" viewBox="0 0 24 24">
            <path d="M12,5V1L7,6l5,5V7c3.31,0,6,2.69,6,6s-2.69,6-6,6s-6-2.69-6-6H4c0,4.42,3.58,8,8,8s8-3.58,8-8S16.42,5,12,5z"/>
          </symbol>
        </defs>
      </svg>
    `;
  }

  togglePlay() {
    if (this.complete) {
      this.replay.reset();
    } else {
      if (this.playing) {
        this.replay.pause();
      } else {
        this.replay.play();
      }
    }
  }

  showHeatmap() {
    this.heatMapByPlayTime = false;
    this.replay.showHeatmap();
  }

  enableHeatMapByPlayTime() {
    this.heatMapByPlayTime = true;
    this.replay.showHeatmap(null, this.replay.playTime.getValue() || 1);
  }

  removeHeatmap() {
    this.heatMapByPlayTime = false;
    this.replay.removeHeatmap();
  }

  closeReplay() {
    this.replay.stopReplay();
  }

  private skipToTimestamp(event: Event) {
    // @ts-ignore
    const target = event.path[0] || event.originalTarget;
    this.replay.setPlayTime(target.valueAsNumber * 1000, true);
    if (this.heatMapByPlayTime) {
      this.enableHeatMapByPlayTime();
    }
  }

  private updateSeekTooltip(event: MouseEvent) {
    // @ts-ignore
    const seek = event.path[0] || event.originalTarget;
    const skipTo = Math.round(
      (event.offsetX / seek.clientWidth) *
      parseInt(seek.getAttribute('max'), 10)
    );
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    this.seek = {
      content: this.formatTime(skipTo * 1000),
      left: event.x - rect.left + 10
    };
  }

  private formatPlayTime() {
    return this.formatTime(this.playTime * 1000);
  }

  private maxPlayTimeInSeconds(): number {
    return Math.ceil(this.replay.events.playTime / 1000);
  }

  private maxPlayTime(): string {
    return this.formatTime(this.maxPlayTimeInSeconds() * 1000);
  }

  private formatTime(timeInMs: number) {
    const result = new Date(timeInMs).toISOString().substr(11, 8);
    const time = {
      minutes: result.substr(3, 2),
      seconds: result.substr(6, 2)
    };
    return `${time.minutes}:${time.seconds}`;
  }

}






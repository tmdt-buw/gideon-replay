import {BehaviorSubject} from 'rxjs';
import {Gideon} from '../gideon';
import {LocationHistory} from '../record/location-history';
import {EventRecord} from '../record/model/events-record';
import {KeyboardEventRecord} from '../record/model/keyboard-event-record';
import {MouseEventRecord, MouseEventType} from '../record/model/mouse-event-record';
import {WheelEventRecord} from '../record/model/wheel-event-record';
import {defaultHeatmapConfig} from './widgets/config/default-heatmap-config';
import {Cursor} from './widgets/cursor';
import {Heatmap} from './widgets/heatmap';
import {Player} from './widgets/player';

export class Replay {

  private readonly gideon: Gideon;
  private readonly element: any;
  private readonly history: LocationHistory;
  private readonly historyByTimeFrame: EventRecord[][];
  private readonly timeFrame = 10;
  private readonly resetElement?: () => void;

  private readonly player: Player;
  private readonly cursor;
  private heatmap: Heatmap;
  private readonly heatmapConfig: any;

  timer: any;
  playTime = new BehaviorSubject(0);
  playing = new BehaviorSubject(false);
  complete = new BehaviorSubject(false);

  get events() {
    return this.history.events;
  }

  constructor(gideon: Gideon, element: any, history: LocationHistory, resetElement?: () => void, heatmapConfig?: any) {
    this.gideon = gideon;
    this.element = element;
    this.history = history;
    this.resetElement = resetElement;
    this.heatmapConfig = heatmapConfig;
    this.historyByTimeFrame = this.history.events.historyByTimeframe(this.timeFrame);
    this.player = new Player(this);
    document.body.appendChild(this.player);
    this.cursor = new Cursor();
    document.body.appendChild(this.cursor);
    this.element.classList.add('gd-hidden');
    const observer = new ResizeObserver(entries => {
      this.onResize();
    });
    observer.observe(this.element);
  }

  /**
   * Toggle heat map visibility
   * @param type
   */
  toggleHeatmap(type?: MouseEventType): void {
    if (this.heatmap) {
      this.removeHeatmap();
    } else {
      this.showHeatmap(type);
    }
  }

  /**
   * Show the heat map
   * @param type - type filter
   * @param time - up to this time
   */
  showHeatmap(type?: MouseEventType, time?: number): void {
    this.heatmap?.remove();
    const completeHistory = this.history.events.historyByTimeframe(10).map(frame => frame.filter(event => event instanceof MouseEventRecord)[0]).filter(el => !!el) as MouseEventRecord[];
    const timeToGlobal = time + this.history.events.initialized;
    const historyToTime = time ? completeHistory.filter(event => event.time < timeToGlobal) : completeHistory;
    this.heatmap = new Heatmap(this.element, historyToTime, type, this.heatmapConfig);
  }

  /**
   * Remove heat map
   */
  removeHeatmap(): void {
    this.heatmap?.remove();
    this.heatmap = null;
  }

  /**
   * Remove all UI elements
   */
  remove() {
    this.pause();
    this.removeHeatmap();
    this.cursor?.remove();
    this.player?.remove();
    this.element.classList.remove('gd-hidden');
  }

  /**
   * Start replay
   */
  play() {
    this.playing.next(true);
    this.startTimer();
  }

  /**
   * Pause replay
   */
  pause() {
    this.playing.next(false);
    clearInterval(this.timer);
  }

  /**
   * Reset replay
   */
  reset() {
    this.playTime.next(0);
    this.complete.next(false);
    if (this.player.heatMapByPlayTime) {
      this.showHeatmap(null, 1);
    }
    // tslint:disable-next-line:no-unused-expression
    this.resetElement ? this.resetElement() : null;
    this.play();
  }

  /**
   * Stop replay
   */
  stopReplay() {
    this.gideon.stopReplay();
  }

  /**
   * Start replay timer
   * @private
   */
  private startTimer() {
    this.timer = setInterval(() => this.incrementTime(), this.timeFrame);
  }

  /**
   * Go to a specific play time
   * @param time time to jump to
   * @param restore restore previous state?
   */
  async setPlayTime(time: number, restore?: boolean): Promise<void> {
    const max = Math.ceil(this.events.playTime / 1000) * 1000;
    if (time < max) {
      if (this.complete.value) {
        this.complete.next(false);
      }
      const idx = time / this.timeFrame;
      this.playTime.next(time);
      const frame = this.historyByTimeFrame[idx];
      if (restore) {
        this.hideCursor();
        if (this.resetElement) {
          this.resetElement();
          // wait for animations etc
          await this.delay(100);
        }
        for (let i = 0; i < idx; i++) {
          const records = this.historyByTimeFrame[i].filter(evt => evt.type !== 'mousemove');
          this.replayRecords(records, true);
        }
      } else {
        this.replayRecords(frame, false);
        if (this.player.heatMapByPlayTime) {
          const first = frame?.filter(event => event instanceof MouseEventRecord)[0] as MouseEventRecord;
          if (first) {
            this.heatmap.addData(first.x, first.y);
          }
        }
      }
    }
    if (time >= max) {
      this.complete.next(true);
      this.playing.next(false);
      this.playTime.next(max);
      clearInterval(this.timer);
    }
  }

  /**
   * Reprint heat map on resize
   * @private
   */
  private onResize() {
    this.setPlayTime(this.playTime.value);
    if (this.heatmap) {
      if (this.player.heatMapByPlayTime) {
        this.showHeatmap(null, this.playTime.getValue() || 1);
      } else {
        this.showHeatmap(this.heatmap.type);
      }
    }
  }

  /**
   * Increment time
   * @private
   */
  private incrementTime(): void {
    this.setPlayTime(this.playTime.value + this.timeFrame);
  }

  /**
   * Replay all records
   * @param records
   * @param silent do not animate?
   */
  replayRecords(records: EventRecord[], silent?: boolean): void {
    if (records) {
      records.forEach(record => {
        this.replayEvent(record, silent);
      });
    }
  }

  /**
   * Replay event record
   * @param record
   * @param silent
   * @private
   */
  private replayEvent(record: EventRecord, silent?: boolean): void {
    if (record instanceof KeyboardEventRecord) {
      this.replayKeyboardEvent(record);
    }
    if (record instanceof WheelEventRecord) {
      this.replayWheelEvent(record);
    }
    if (record instanceof MouseEventRecord) {
      switch (record.type) {
        case 'click':
        case 'dblclick': {
          this.replayMouseClick(record, silent);
          break;
        }
        case 'mouseleave': {
          this.replayMouseLeave(record);
          break;
        }
        default: {
          this.replayMouseDefault(record);
          break;
        }
      }
    }
  }

  /**
   * Show click animation and replay default
   * @param eventRecord
   * @param silent
   * @private
   */
  private replayMouseClick(eventRecord: MouseEventRecord, silent?: boolean, heatmap?: boolean): void {
    const replay = this.replayMouseDefault(eventRecord);
    // create click effect
    if (!silent) {
      const clickEffect = document.createElement('div');
      clickEffect.className = 'clickEffect';
      clickEffect.style.left = replay.x + 'px';
      clickEffect.style.top = replay.y + 'px';
      document.body.appendChild(clickEffect);
      clickEffect.addEventListener('animationend', () => clickEffect.parentElement.removeChild(clickEffect));
    }
  }

  /**
   * Hide cursor and replay default
   * @param eventRecord
   * @private
   */
  private replayMouseLeave(eventRecord: MouseEventRecord): void {
    this.replayMouseDefault(eventRecord);
    this.hideCursor();
  }

  /**
   * Default mouse event replay
   * @param eventRecord
   * @private
   */
  private replayMouseDefault(eventRecord: MouseEventRecord): { x: number; y: number; } {
    const rect = this.element.getBoundingClientRect();
    const x = Math.round(eventRecord.x * rect.width + rect.left);
    const y = Math.round(eventRecord.y * rect.height + rect.top);
    this.cursor.top = y + 'px';
    this.cursor.left = x + 'px';
    const evt = new MouseEvent(eventRecord.type, {
      bubbles: true, cancelable: true, clientX: x, clientY: y, view: window
    });
    const element = document.querySelector(eventRecord.element);
    if (eventRecord.type === 'mouseup') {
      const evtMv = new MouseEvent('mousemove', {
        bubbles: true, cancelable: true, clientX: x, clientY: y, view: window
      });
      element.dispatchEvent(evtMv);
    }
    element.dispatchEvent(evt);
    return {x, y};
  }

  /**
   * Move cursor out of screen to hide
   * @private
   */
  private hideCursor(): void {
    this.cursor.top = '100%';
    this.cursor.left = '100%';
  }

  /**
   * Wait for ms ms
   * @param ms
   * @private
   */
  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Default keyboard event replay
   * @param eventRecord
   * @private
   */
  private replayKeyboardEvent(eventRecord: KeyboardEventRecord): void {
    const evt = new KeyboardEvent(eventRecord.type, eventRecord.event);
    document.dispatchEvent(evt);
  }

  /**
   * Default wheel event replay
   * @param eventRecord
   * @private
   */
  private replayWheelEvent(eventRecord: WheelEventRecord): void {
    const evt = new WheelEvent(eventRecord.type, Object.assign({
      bubbles: true, cancelable: true, view: window
    }, eventRecord.event));
    const element = document.querySelector(eventRecord.element);
    element.dispatchEvent(evt);
  }

  /**
   * Calculate action items to show activity overlay on player progress bar
   * @param resolution - aggregation level
   */
  getRelativeActionTimes(resolution: number): { type: 'active' | 'interact' | 'keyboard', from: number, to: number }[] {
    const result = [];
    const chunkSize = this.events.playTime / resolution;
    const historyByFrame = this.history.events.historyByTimeframe(chunkSize);
    let drag = false;
    for (let i = 0; i < historyByFrame.length; i++) {
      const frame = historyByFrame[i];
      const from = i;
      const to = i + 1;
      let activityFrame = null;
      // tslint:disable-next-line:prefer-for-of
      for (let f = 0; f < frame.length; f++) {
        const event = frame[f];
        if (event instanceof KeyboardEventRecord) {
          activityFrame = {
            type: 'keyboard',
            from,
            to
          };
        }
        if (event instanceof MouseEventRecord) {
          if ((!activityFrame || activityFrame.type !== 'keyboard') && event.type === 'click') {
            activityFrame = {
              type: 'interact',
              from,
              to
            };
          }
          if (event.type === 'mousedown') {
            activityFrame = {
              type: 'interact',
              from,
              to
            };
            drag = true;
          }
          if (event.type === 'mouseup') {
            activityFrame = {
              type: 'interact',
              from,
              to
            };
            drag = false;
          }
          if (event.type === 'mousemove' || event.type === 'mouseleave') {
            if (drag) {
              activityFrame = {
                type: 'interact',
                from,
                to
              };
            } else {
              activityFrame = {
                type: 'active',
                from,
                to
              };
            }
          }
        }
        if (!activityFrame && event instanceof WheelEventRecord) {
          activityFrame = {
            type: 'active',
            from,
            to
          };
        }
      }
      if (activityFrame) {
        result.push(activityFrame);
      }
    }
    return result;
  }
}

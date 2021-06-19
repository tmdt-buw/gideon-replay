import {finder} from '@medv/finder';
import {KeyboardEventRecord} from './keyboard-event-record';
import {MouseEventRecord} from './mouse-event-record';
import {WheelEventRecord} from './wheel-event-record';

export type EventRecord = MouseEventRecord | KeyboardEventRecord | WheelEventRecord;

export class EventsRecord {

  constructor(element: any) {
    this.registerContainer(element);
  }

  public disabled = false;

  private _history: EventRecord[] = [];
  private _initialized: number;
  private element: any;

  get history(): EventRecord[] {
    return this._history;
  }

  get mouseEvents(): MouseEventRecord[] {
    return this._history.filter(history => history instanceof MouseEventRecord) as MouseEventRecord[];
  }

  get initialized(): number {
    return this._initialized;
  }

  /**
   * Return total play time
   */
  get playTime(): number {
    const last = this._history.length - 1;
    if (last >= 0) {
      return this._history[last].time - this._initialized;
    } else {
      return 0;
    }
  }

  /**
   * Aggregate events by ms, i.e. 100 ms => 100 ms chunks
   * @param ms
   */
  historyByTimeframe(ms: number): EventRecord[][] {
    const res = [];
    for (let time = 0; time < Math.ceil(this.playTime / ms) + 1; time++) {
      res.push([]);
    }
    this.history.forEach(el => {
      const index = Math.floor((el.time - this.initialized) / ms);
      res[index].push(el);
    });
    return res;
  }

  /**
   * Register mouse events
   * @param element
   * @private
   */
  private registerContainer(element: any): void {
    this.element = element;
    this._initialized = Date.now();
    ['click', 'dblclick', 'mousedown', 'mouseenter', 'mouseleave', 'mousemove', 'mouseup', 'mouseover', 'contextmenu'].forEach(eventType => {
      this.element.addEventListener(eventType, (event) => {
        if (this.disabled) {
          event.preventDefault();
          event.stopPropagation();
        } else {
          this.recordMouseEvent(event);
        }
      });
    });
    ['keydown', 'keypress', 'keyup'].forEach(eventType => {
      document.addEventListener(eventType, (event: any) => {
        if (this.disabled) {
          event.preventDefault();
          event.stopPropagation();
        } else {
          this.recordKeyboardEvent(event);
        }
      });
    });
    this.element.addEventListener('wheel', (event) => {
      if (this.disabled) {
        event.preventDefault();
        event.stopPropagation();
      } else {
        this.recordWheelEvent(event);
      }
    });
  }

  /**
   * Record a mouse event
   * @param event
   * @private
   */
  private recordMouseEvent(event: MouseEvent): void {
    if (!this.disabled) {
      try {
        const record = new MouseEventRecord();
        record.element = finder(event.target as Element);
        record.time = Date.now();
        const rect = this.element.getBoundingClientRect();
        record.x = (event.x - rect.left) / rect.width;
        record.y = (event.y - rect.top) / rect.height;
        record.type = event.type;
        this._history.push(record);
      } catch (error) {
        // transient element
      }
    }
  }

  /**
   * Record a keyboard event
   * @param event
   * @private
   */
  private recordKeyboardEvent(event: KeyboardEvent): void {
    if (!this.disabled) {
      try {
        const record = new KeyboardEventRecord();
        record.time = Date.now();
        record.type = event.type;
        record.event = {
          key: event.key,
          altKey: event.altKey,
          ctrlKey: event.ctrlKey,
          shiftKey: event.shiftKey,
          repeat: event.repeat
        };
        this._history.push(record);
      } catch (error) {
        // transient element - should never happen
      }
    }
  }

  /**
   * Record a wheel event
   * @param event
   * @private
   */
  private recordWheelEvent(event: WheelEvent): void {
    if (!this.disabled) {
      try {
        const record = new WheelEventRecord();
        record.element = finder(event.target as Element);
        record.time = Date.now();
        record.type = event.type;
        record.event = {
          deltaX: event.deltaX,
          deltaY: event.deltaY,
          deltaZ: event.deltaZ,
          deltaMode: event.deltaMode
        };
        this._history.push(record);
      } catch (error) {
        // transient element
      }
    }
  }
}

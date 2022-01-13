import {LocationHistory} from './record/location-history';
import {Replay} from './replay/replay';
import {stringify} from './util';

export class Gideon {

  private constructor() {
  }

  // the instance
  private static instance: Gideon;

  // vars for history and current replay
  private _history: LocationHistory[] = [];
  private _replay: Replay;

  /**
   * Singleton pattern
   */
  public static getInstance(): Gideon {
    if (!Gideon.instance) {
      Gideon.instance = new Gideon();
    }
    return Gideon.instance;
  }

  /**
   * Return all history records
   */
  getHistoryRecords(): LocationHistory[] {
    return this._history.filter(history => history.events.history.length > 0);
  }

  /**
   * Register html-element that should be tracked by gideon replay
   * @param element
   */
  registerElement(element: any): void {
    this._history.push(new LocationHistory(Object.assign({}, window.location), element));
  }

  /**
   * Replay given history on given html-element
   * @param element
   * @param history
   * @param reset
   */
  replay(element: any, history: LocationHistory, reset?: () => void) {
    this.stopReplay();
    this._replay = new Replay(this, element, history, reset);
    this.setRecording(false);
  }

  /**
   * Stop current replay
   */
  stopReplay() {
    this._replay?.remove();
    this.setRecording(true);
  }

  /**
   * Export history - exports whole history if index is not given
   * @param index
   */
  exportHistory(index?: number) {
    let history = this.getHistoryRecords();
    if (index) {
      this.downloadJson(history[index]);
    } else {
      this.downloadJson(history);
    }
  }

  /**
   * Import history
   * @param history
   */
  importHistory(history: LocationHistory | LocationHistory[]) {
    if (Array.isArray(history)) {
      this._history = history;
    } else {
      this._history.push(history);
    }
  }

  /**
   * Set disable tracking for latest element in history
   * @param isRecording
   * @private
   */
  private setRecording(isRecording: boolean) {
    const latest = this.getLatestHistoryElement();
    if (latest) {
      this.getLatestHistoryElement().events.disabled = !isRecording;
    }
  }

  /**
   * Return last element in history
   * @private
   */
  private getLatestHistoryElement() {
    const len = this._history.length;
    if (len > 0) {
      return this._history[len - 1];
    }
    return null;
  }

  /**
   * Simulate a download for given json
   * @param json
   * @private
   */
  private downloadJson(json: any) {
    const jsonString = stringify(json);
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/json;charset=UTF-8,' + encodeURIComponent(jsonString));
    element.setAttribute('download', 'history.json');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
}


import * as h337 from '@rengr/heatmap.js';
import {MouseEventRecord, MouseEventType} from '../../record/model/mouse-event-record';
import {defaultHeatmapConfig} from './config/default-heatmap-config';


export class Heatmap {

  readonly type: MouseEventType;

  private element: any;
  private heatmap: any;
  private readonly config: any;

  constructor(element: any, events: MouseEventRecord[], type?: MouseEventType, config?: any) {
    this.element = element;
    this.type = type;
    this.config = config || defaultHeatmapConfig;
    this.createMouseMoveHeatmap(events, type);
  }

  private createMouseMoveHeatmap(events: MouseEventRecord[], type: MouseEventType): void {
    const filteredEvents = type ? events.filter(record => record.type === type) : events;
    this.create(filteredEvents);
  }

  /**
   * Create heat map for all given data points
   * @param events
   * @private
   */
  private create(events: MouseEventRecord[]): void {
    const position = this.element.style.position;
    if (!position) {
      this.element.style.position = 'relative';
    }
    const heatmap = document.createElement('div');
    const rect = this.element.getBoundingClientRect();
    heatmap.style.left = '0';
    heatmap.style.top = '0';
    heatmap.style.width = `${rect.width}px`;
    heatmap.style.height = `${rect.height}px`;
    this.element.appendChild(heatmap);
    this.heatmap = {
      container: heatmap,
      heatmap: h337.create(Object.assign({
        container: heatmap
      }, this.config))
    };
    heatmap.style.position = 'absolute';
    const data = events.map(event => {
      return {
        x: Math.round(event.x * rect.width),
        y: Math.round(event.y * rect.height)
      };
    });
    this.heatmap.heatmap.setData({
      data
    });
  }

  /**
   * Add a single data point
   * @param x
   * @param y
   */
  addData(x: number, y: number): void {
    const rect = this.element.getBoundingClientRect();
    this.heatmap.heatmap.addData({
        x: Math.round(x * rect.width),
        y: Math.round(y * rect.height)
    });
  }

  remove(): void {
    this.heatmap.heatmap._renderer.canvas.remove();
    this.heatmap.container.remove();
  }

}







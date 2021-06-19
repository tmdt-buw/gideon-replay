export type MouseEventType = 'click' | 'mousemove';

export class MouseEventRecord {
  time: number;
  x: number;
  y: number;
  type: string;
  element: string;
}

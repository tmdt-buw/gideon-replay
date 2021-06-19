export class WheelEventRecord {
  time: number;
  type: string;
  event: {
    deltaX: number;
    deltaY: number;
    deltaZ: number;
    deltaMode: number;
  };
  element: string;
}

export class KeyboardEventRecord {
  time: number;
  type: string;
  event: {
    key: string;
    altKey: boolean;
    ctrlKey: boolean;
    shiftKey: boolean;
    repeat: boolean;
  };
}

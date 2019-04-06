export class SampleContext {
  constructor() {}

  static clearRect(x: number, y: number, w: number, h: number) {
    console.log('clearRect(' + x + ', ' + y + ', ' + w + ', ' + h + ') has been called!');
  }

  static fillRect(x: number, y: number, w: number, h: number) {
    console.log('fillRect(' + x + ', ' + y + ', ' + w + ', ' + h + ') has been called!');
  }

  static strokeRect(x: number, y: number, w: number, h: number) {
    console.log('strokeRect(' + x + ', ' + y + ', ' + w + ', ' + h + ') has been called!');
  }

  static set lineWidth(value: number) {
    console.log('lineWidth has been set to: ' + value);
  }

  static fillText(text: string, x: number, y: number) {
    console.log('fillText(' + text + ', ' + x + ', ' + y + ') has been called!');
  }
}

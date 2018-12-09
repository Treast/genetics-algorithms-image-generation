export default class Vector2 {
  public x: number;
  public y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  static random(maxX: number, maxY: number) {
    const x = Math.ceil(Math.random() * maxX);
    const y = Math.ceil(Math.random() * maxY);
    return new Vector2(x, y);
  }
}

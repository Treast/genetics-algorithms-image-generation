export default class Color {
  public r: number;
  public g: number;
  public b: number;
  public hex: string;

  constructor(red: number, green: number, blue: number) {
    this.r = red;
    this.g = green;
    this.b = blue;
    this.hex = `#${this.computeHex(this.r)}${this.computeHex(this.g)}${this.computeHex(this.b)}`;
  }

  computeHex(component: number): string {
    let hex = Number(component).toString(16);
    if (hex.length < 2) {
      hex = `0${hex}`;
    }
    return hex;
  }

  static random(): Color {
    const r = Math.ceil(Math.random() * 255);
    const g = Math.ceil(Math.random() * 255);
    const b = Math.ceil(Math.random() * 255);
    return new Color(r, g, b);
  }

  static difference(color1: Color, color2: Color): number {
    const diffR = Math.abs(color1.r - color2.r) / 255;
    const diffG = Math.abs(color1.g - color2.g) / 255;
    const diffB = Math.abs(color1.b - color2.b) / 255;

    return (diffR + diffG + diffB) * 100;
  }
}

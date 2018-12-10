import Vector2 from '../utils/Vector2';
import Color from '../utils/Color';
import Canvas from './Canvas';

export default class Dot {
  public readonly position: Vector2;
  public color: Color;
  public fitness: number;
  public isPerfect: boolean;

  constructor(position: Vector2, color: Color) {
    this.position = position;
    this.color = color;
    this.isPerfect = false;
  }

  render() {
    Canvas.drawCircle(this.position, 4, this.color);
  }

  computeFitness() {
    if (!this.isPerfect) {
      const targetColor = Canvas.getPixelColor(this.position);
      const difference = Color.difference(this.color, targetColor);
      // console.log(`Diff: ${difference}: (${this.color.r},${this.color.g},${this.color.b}) -> (${targetColor.r},${targetColor.g},${targetColor.b})`);
      if (difference === 0) {
        this.isPerfect = true;
        this.fitness = 10;
      } else {
        this.fitness = 1 / difference;
      }
    }
  }

  mutate() {
    const mutationRate = 0.1;

    if (!this.isPerfect && Math.random() < mutationRate) {
      let r = this.color.r;
      let g = this.color.g;
      let b = this.color.b;
      const randomColor = Color.random();
      const indexColor = Math.floor(Math.random() * 3);
      switch (indexColor) {
        case 0:
          r = randomColor.r;
          break;
        case 1:
          g = randomColor.g;
          break;
        case 2:
          b = randomColor.b;
          break;
      }
      this.color = new Color(r, g, b);
    }
  }

  static generate(position: Vector2, args: number[]): Dot {
    const color = new Color(args[0], args[1], args[2]);
    return new Dot(position, color);
  }
}

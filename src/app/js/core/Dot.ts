import Vector2 from '../utils/Vector2';
import Color from '../utils/Color';
import Canvas from './Canvas';

export default class Dot {
  public readonly position: Vector2;
  public color: Color;
  public fitness: number;

  constructor(position: Vector2, color: Color) {
    this.position = position;
    this.color = color;
  }

  render() {
    Canvas.drawCircle(this.position, 3, this.color);
  }

  computeFitness() {
    const targetColor = Canvas.getPixelColor(this.position);
    this.fitness = 100 * (1 - Color.difference(this.color, targetColor));
  }

  mutate() {
    const mutationRate = 0.01;

    if (Math.random() < mutationRate) {
      let r = this.color.r;
      let g = this.color.g;
      let b = this.color.b;
      const randomColor = Color.random();
      let indexColor = Math.floor(Math.random() * 3);
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
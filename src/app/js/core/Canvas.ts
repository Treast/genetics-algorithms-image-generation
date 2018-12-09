import Vector2 from '../utils/Vector2';
import Color from '../utils/Color';

class Canvas {
  private readonly width: number;
  private readonly height: number;
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private offset: Vector2;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.offset = new Vector2(400, 0);
  }

  createElement() {
    this.canvas = document.createElement('canvas');
    this.canvas.setAttribute('height', `${this.height}`);
    this.canvas.setAttribute('width', `${this.width}`);
    document.body.appendChild(this.canvas);
    this.context = this.canvas.getContext('2d');
  }

  setImage(imageURI: string) {
    const image = new Image();
    image.addEventListener('load', () => {
      this.context.drawImage(image, 0, 0, 400, 400);
    });
    image.src = imageURI;
  }

  drawCircle(position: Vector2, radius: number, color: Color) {
    this.context.fillStyle = color.hex;
    this.context.beginPath();
    this.context.arc(position.x + this.offset.x, position.y + this.offset.y, radius, 0, 2 * Math.PI, true);
    this.context.fill();
  }

  getPixelColor(position: Vector2) {
    const data = this.context.getImageData(position.x, position.y, 1, 1).data;
    return new Color(data[0], data[1], data[2]);
  }
}

export default new Canvas(800, 400);

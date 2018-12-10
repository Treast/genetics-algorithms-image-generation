import Dot from './Dot';
import Vector2 from '../utils/Vector2';
import Color from '../utils/Color';

export default class Population {
  private readonly size: number;
  private generation: number;
  private dots: Dot[];

  constructor(size: number) {
    this.size = size;
    this.generation = 1;
    this.dots = [];
  }

  createPopulation() {
    const row = Math.sqrt(this.size);
    const width = 400 / row;
    for (let i = 0; i < 400; i += width) {
      for (let j = 0; j < 400; j += width) {
        const position = new Vector2(i, j);
        const color = Color.random();
        this.dots.push(new Dot(position, color));
      }
    }
  }

  render() {
    for (const dot of this.dots) {
      dot.render();
    }
  }

  makeSelection() {
    let sumFitness = 0;
    for (const dot of this.dots) {
      dot.computeFitness();
      sumFitness += dot.fitness;
    }
    this.sortDots();
    this.makeNewPopulation();
  }

  sortDots() {
    this.dots.sort((a, b) => {
      return (a.fitness > b.fitness) ? -1 : 1;
    });
  }

  makeNewPopulation() {
    const unperfectDots = this.dots.filter((dot) => {
      return !dot.isPerfect;
    });
    const perfectDots = this.dots.filter((dot) => {
      return dot.isPerfect;
    });
    document.querySelector('.representation span').innerHTML = `${(perfectDots.length / this.size * 100).toFixed(2)}`;
    let dots: Dot[] = unperfectDots.slice(0, Math.floor(unperfectDots.length / 2));
    const wrongDots = unperfectDots.slice(Math.floor(unperfectDots.length / 2));
    const babiesDots: Dot[] = [];
    for (let i = 0; i < wrongDots.length; i += 2) {
      if (wrongDots[i + 1]) {
        const parent = this.getRandomParent();
        const parent1 = this.getRandomParent();
        const babyDots = this.makeCrossing(parent, parent1, wrongDots[i], wrongDots[i + 1]);
        babiesDots.push(...babyDots);
      } else {
        babiesDots.push(wrongDots[i]);
      }
    }
    const newDots = [...perfectDots, ...dots, ...babiesDots];
    dots = this.mutate(newDots);
    this.dots = dots;
    this.generation += 1;
    document.querySelector('.generation span').innerHTML = `${this.generation}`;
  }

  mutate(dots: Dot[]): Dot[] {
    for (const dot of this.dots) {
      dot.mutate();
    }
    return dots;
  }

  getRandomParent(): Dot {
    const inverseDots = this.dots;
    inverseDots.sort((a, b) => {
      return (a.fitness > b.fitness) ? 1 : -1;
    });
    const random = Math.random();
    let sumFitness = 0;
    for (const dot of inverseDots) {
      sumFitness += dot.fitness;
      if (random < sumFitness) {
        return dot;
      }
    }
    return null;
  }

  makeCrossing(dot1: Dot, dot2: Dot, wrongDot1: Dot, wrongDot2: Dot) {
    const genes1 = [dot1.color.r, dot1.color.g, dot1.color.b];
    const genes2 = [dot2.color.r, dot2.color.g, dot2.color.b];
    const pivot = Math.floor(Math.random() * (genes1.length - 1)) + 1;
    const propertiesBaby1 = [...genes1.slice(0, pivot), ...genes2.slice(pivot)];
    const propertiesBaby2 = [...genes2.slice(0, pivot), ...genes1.slice(pivot)];
    return [Dot.generate(wrongDot1.position, propertiesBaby1), Dot.generate(wrongDot2.position, propertiesBaby2)];
  }
}

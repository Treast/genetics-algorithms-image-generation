import Dot from './Dot';
import Vector2 from '../utils/Vector2';
import Color from '../utils/Color';

export default class Population {
  private readonly size: number;
  private generation: number;
  private dots: Dot[];
  private sumFitness: number;

  constructor(size: number) {
    this.size = size;
    this.generation = 1;
    this.dots = [];
    this.sumFitness = 0;
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

    this.calculateFitness();

    this.dots.sort((a, b) => {
      return (a.fitness > b.fitness) ? 1 : -1;
    });

    const babiesDots: Dot[] = [];
    for (let i = 0; i < wrongDots.length; i += 1) {
      const babyDots = this.makeCrossing(wrongDots[i]);
      babiesDots.push(babyDots);
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

  calculateFitness() {
    let fitness = 0;
    for (const dot of this.dots) {
      fitness += dot.fitness;
    }
    this.sumFitness = fitness;
  }

  getRandomParent(): Dot {
    const random = Math.random() * this.sumFitness;
    let sumFitness = 0;
    for (const dot of this.dots) {
      sumFitness += dot.fitness;
      if (random < sumFitness) {
        return dot;
      }
    }
    return null;
  }

  makeCrossing(dot: Dot) {
    const parent = this.getRandomParent();
    return dot.copy(parent.color);
  }
}

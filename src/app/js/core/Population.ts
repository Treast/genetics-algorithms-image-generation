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
    for (let i = 0; i < 400; i += 8) {
      for (let j = 0; j < 400; j += 8) {
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
    console.log(`${sumFitness / this.size}%`);
    this.sortDots();
    this.makeNewPopulation();
  }

  sortDots() {
    this.dots.sort((a, b) => {
      return (a.fitness > b.fitness) ? -1 : 1;
    });
  }

  makeNewPopulation() {
    let unperfectDots = this.dots.filter((dot) => {
      return !dot.isPerfect;
    });
    let perfectDots = this.dots.filter((dot) => {
      return dot.isPerfect;
    });
    let dots: Dot[] = unperfectDots.slice(0, Math.floor(this.dots.length / 2));
    const wrongDots = unperfectDots.slice(Math.floor(this.dots.length / 2));
    const babiesDots: Dot[] = [];
    for (let i = 0; i < dots.length; i += 2) {
      if(dots[i] && dots[i + 1] && wrongDots[i] && wrongDots[i + 1]) {
        const babyDots = this.makeCrossing(dots[i], dots[i + 1], wrongDots[i], wrongDots[i + 1]);
        babiesDots.push(...babyDots);
      }
    }
    const newDots = [...perfectDots, ...dots, ...babiesDots];
    dots = this.mutate(newDots);
    this.dots = dots;
    this.generation += 1;
    console.log(`Génération n°${this.generation}`);
  }

  mutate(dots: Dot[]): Dot[] {
    for (const dot of this.dots) {
      dot.mutate();
    }
    return dots;
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

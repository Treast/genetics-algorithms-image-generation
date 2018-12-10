import App from './utils/App';
import Canvas from './core/Canvas';
import Population from './core/Population';

const app = new App();

app.isReady().then(() => {
  Canvas.createElement();
  Canvas.setImage('/assets/images/PikachuHD.jpg');

  const population = new Population(2500);
  population.createPopulation();

  function animate() {
    requestAnimationFrame(animate);
    population.render();
    population.makeSelection();
  }
  animate();
});

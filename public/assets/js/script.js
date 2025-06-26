// =============================
// PORTAFOLIO GATUNO - JAVASCRIPT
// =============================

// --- Utilidades generales ---
// Actualiza el año en el footer
const anioSpan = document.getElementById('anio');
if (anioSpan) anioSpan.textContent = new Date().getFullYear();

// --- Navegación de modales gatunos ---
const navBtns = document.querySelectorAll('.cat-nav-btn');
const modals = {
    'sobre-mi': document.getElementById('modal-sobre-mi'),
    'proyectos': document.getElementById('modal-proyectos'),
    'habilidades': document.getElementById('modal-habilidades'),
    'contacto': document.getElementById('modal-contacto'),
    'snake': document.getElementById('modal-snake')
};
const closeBtns = document.querySelectorAll('.cat-modal-close');

navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const section = btn.getAttribute('data-section');
        Object.values(modals).forEach(m => m.classList.remove('active'));
        if (modals[section]) modals[section].classList.add('active');
        navBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        // Si es Snake, reiniciar el juego
        if (section === 'snake') startCatSnake();
    });
});
closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        Object.values(modals).forEach(m => m.classList.remove('active'));
        navBtns.forEach(b => b.classList.remove('active'));
        stopCatSnake();
    });
});
window.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        Object.values(modals).forEach(m => m.classList.remove('active'));
        navBtns.forEach(b => b.classList.remove('active'));
        stopCatSnake();
    }
});

// =============================
// SNAKE MEJORADO: Versión profesional y moderna
// =============================

// --- Variables y elementos del juego ---
let snakeGame = null;

// --- Clase principal del juego ---
class SnakeGame {
    constructor(canvas, scoreDiv, colorInput, restartBtn, modal) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.scoreDiv = scoreDiv;
        this.colorInput = colorInput;
        this.restartBtn = restartBtn;
        this.modal = modal;
        this.gridSize = 20;
        this.tileCount = 20;
        this.defaultColor = colorInput ? colorInput.value : '#388e3c';
        this.difficulty = 'normal';
        this.speed = 100;
        this.highScore = parseInt(localStorage.getItem('snakeHighScore') || '0');
        this.mobileControls = null;
        this.init();
    }
    init() {
        this.state = 'start'; // start, playing, gameover
        this.snake = [ {x: 10, y: 10} ];
        this.direction = {x: 0, y: -1};
        this.nextDirection = {x: 0, y: -1};
        this.placeFood();
        this.score = 0;
        this.alive = true;
        this.snakeColor = this.defaultColor;
        this.interval = null;
        this.particles = [];
        this.draw();
        this.updateScore();
        this.showStartScreen();
        this.addEvents();
    }
    start(difficulty) {
        this.difficulty = difficulty || 'normal';
        this.speed = this.difficulty === 'easy' ? 140 : this.difficulty === 'hard' ? 60 : 100;
        this.snake = [ {x: 10, y: 10} ];
        this.direction = {x: 0, y: -1};
        this.nextDirection = {x: 0, y: -1};
        this.placeFood();
        this.score = 0;
        this.alive = true;
        this.snakeColor = this.colorInput ? this.colorInput.value : '#388e3c';
        this.particles = [];
        this.state = 'playing';
        this.updateScore();
        if (this.interval) clearInterval(this.interval);
        this.interval = setInterval(() => this.gameLoop(), this.speed);
        this.draw();
    }
    placeFood() {
        let valid = false;
        while (!valid) {
            this.food = {
                x: Math.floor(Math.random() * this.tileCount),
                y: Math.floor(Math.random() * this.tileCount)
            };
            valid = !this.snake.some(seg => seg.x === this.food.x && seg.y === this.food.y);
        }
    }
    updateScore() {
        if (this.scoreDiv) {
            this.scoreDiv.innerHTML = `Puntaje: <b>${this.score}</b> <span style='float:right;font-size:0.9em;'>Máximo: ${this.highScore}</span>`;
        }
    }
    draw() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // Fondo
        ctx.fillStyle = '#e0f7fa';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        // Partículas (efecto al comer)
        this.particles.forEach(p => {
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
            ctx.fill();
            ctx.globalAlpha = 1;
        });
        this.particles = this.particles.filter(p => (p.alpha -= 0.03) > 0);
        // Comida
        ctx.save();
        ctx.shadowColor = '#ff7043';
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#ff7043';
        ctx.beginPath();
        ctx.arc((this.food.x + 0.5) * this.gridSize, (this.food.y + 0.5) * this.gridSize, this.gridSize/2.2, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();
        // Serpiente
        for (let i = 0; i < this.snake.length; i++) {
            ctx.save();
            ctx.shadowColor = i === 0 ? '#388e3c' : '#a5d6a7';
            ctx.shadowBlur = i === 0 ? 12 : 4;
            ctx.fillStyle = this.snakeColor;
            ctx.beginPath();
            ctx.arc((this.snake[i].x + 0.5) * this.gridSize, (this.snake[i].y + 0.5) * this.gridSize, this.gridSize/2.1, 0, Math.PI*2);
            ctx.fill();
            ctx.restore();
            // Ojos en la cabeza
            if (i === 0) {
                ctx.fillStyle = '#fff';
                ctx.beginPath();
                ctx.arc((this.snake[i].x + 0.7) * this.gridSize, (this.snake[i].y + 0.35) * this.gridSize, 2.5, 0, Math.PI*2);
                ctx.arc((this.snake[i].x + 0.3) * this.gridSize, (this.snake[i].y + 0.35) * this.gridSize, 2.5, 0, Math.PI*2);
                ctx.fill();
                ctx.fillStyle = '#222';
                ctx.beginPath();
                ctx.arc((this.snake[i].x + 0.7) * this.gridSize, (this.snake[i].y + 0.35) * this.gridSize, 1, 0, Math.PI*2);
                ctx.arc((this.snake[i].x + 0.3) * this.gridSize, (this.snake[i].y + 0.35) * this.gridSize, 1, 0, Math.PI*2);
                ctx.fill();
            }
        }
        // Pantalla de inicio
        if (this.state === 'start') {
            ctx.save();
            ctx.globalAlpha = 0.85;
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            ctx.globalAlpha = 1;
            ctx.fillStyle = '#388e3c';
            ctx.font = 'bold 2.1rem Cinzel, Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Snake', this.canvas.width/2, this.canvas.height/2 - 40);
            ctx.font = '1.1rem Cinzel, Arial';
            ctx.fillText('Elige dificultad y color', this.canvas.width/2, this.canvas.height/2);
            ctx.font = '1rem Arial';
            ctx.fillText('Presiona Iniciar o cualquier flecha', this.canvas.width/2, this.canvas.height/2 + 30);
            ctx.restore();
        }
        // Pantalla de game over
        if (this.state === 'gameover') {
            ctx.save();
            ctx.globalAlpha = 0.85;
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            ctx.globalAlpha = 1;
            ctx.fillStyle = '#c62828';
            ctx.font = 'bold 2rem Cinzel, Arial';
            ctx.textAlign = 'center';
            ctx.fillText('¡Perdiste!', this.canvas.width/2, this.canvas.height/2 - 20);
            ctx.font = '1.1rem Cinzel, Arial';
            ctx.fillStyle = '#222';
            ctx.fillText(`Puntaje: ${this.score}`, this.canvas.width/2, this.canvas.height/2 + 10);
            ctx.fillStyle = '#388e3c';
            ctx.fillText('Presiona Reiniciar', this.canvas.width/2, this.canvas.height/2 + 40);
            ctx.restore();
        }
    }
    gameLoop() {
        if (!this.alive || this.state !== 'playing') return;
        // Cambia la dirección solo si no es opuesta
        if ((this.nextDirection.x !== -this.direction.x || this.nextDirection.y !== -this.direction.y)) {
            this.direction = {...this.nextDirection};
        }
        // Calcula la nueva cabeza
        const newHead = {
            x: this.snake[0].x + this.direction.x,
            y: this.snake[0].y + this.direction.y
        };
        // Colisión con paredes
        if (newHead.x < 0 || newHead.x >= this.tileCount || newHead.y < 0 || newHead.y >= this.tileCount) {
            this.gameOver();
            return;
        }
        // Colisión con sí mismo
        if (this.snake.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
            this.gameOver();
            return;
        }
        // Mueve la serpiente
        this.snake.unshift(newHead);
        // Comer comida
        if (newHead.x === this.food.x && newHead.y === this.food.y) {
            this.score++;
            this.updateScore();
            this.placeFood();
            this.emitParticles((newHead.x + 0.5) * this.gridSize, (newHead.y + 0.5) * this.gridSize, this.snakeColor);
            // Sonido opcional al comer
            // this.playEatSound();
        } else {
            this.snake.pop();
        }
        this.draw();
    }
    emitParticles(x, y, color) {
        for (let i = 0; i < 10; i++) {
            this.particles.push({
                x: x + (Math.random()-0.5)*10,
                y: y + (Math.random()-0.5)*10,
                size: 2 + Math.random()*2,
                color: color,
                alpha: 0.7 + Math.random()*0.3
            });
        }
    }
    gameOver() {
        this.alive = false;
        this.state = 'gameover';
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('snakeHighScore', this.highScore);
        }
        if (this.interval) clearInterval(this.interval);
        this.updateScore();
        this.draw();
    }
    showStartScreen() {
        this.state = 'start';
        this.draw();
    }
    addEvents() {
        // Teclado
        window.addEventListener('keydown', e => {
            if (!this.modal || this.modal.style.display !== 'flex') return;
            if (this.state === 'start') {
                if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","w","a","s","d","W","A","S","D"].includes(e.key)) {
                    this.start(this.difficulty);
                }
            } else if (this.state === 'gameover') {
                if (e.key === 'r' || e.key === 'R') {
                    this.showStartScreen();
                }
            } else if (this.state === 'playing') {
                switch (e.key) {
                    case 'ArrowUp': case 'w': case 'W': if (this.direction.y !== 1) this.nextDirection = {x:0, y:-1}; break;
                    case 'ArrowDown': case 's': case 'S': if (this.direction.y !== -1) this.nextDirection = {x:0, y:1}; break;
                    case 'ArrowLeft': case 'a': case 'A': if (this.direction.x !== 1) this.nextDirection = {x:-1, y:0}; break;
                    case 'ArrowRight': case 'd': case 'D': if (this.direction.x !== -1) this.nextDirection = {x:1, y:0}; break;
                }
            }
        });
        // Color
        if (this.colorInput) {
            this.colorInput.addEventListener('input', () => {
                this.snakeColor = this.colorInput.value;
                this.draw();
            });
        }
        // Botón reiniciar
        if (this.restartBtn) {
            this.restartBtn.addEventListener('click', () => {
                if (this.state === 'gameover') {
                    this.showStartScreen();
                } else {
                    this.start(this.difficulty);
                }
            });
        }
        // Dificultad (agrega select dinámico si no existe)
        if (!document.getElementById('snake-difficulty')) {
            const diffDiv = document.createElement('div');
            diffDiv.style.margin = '0.5rem 0 0.5rem 0';
            diffDiv.innerHTML = `
                <label for="snake-difficulty">Dificultad: </label>
                <select id="snake-difficulty" style="font-size:1rem; border-radius:8px; padding:0.2rem 0.7rem;">
                    <option value="easy">Fácil</option>
                    <option value="normal" selected>Normal</option>
                    <option value="hard">Difícil</option>
                </select>
                <button id="snake-start-btn" style="margin-left:1.2rem; padding:0.4rem 1.1rem; border-radius:10px; border:none; background:#a5d6a7; color:#2e3d27; font-family:'Cinzel',serif; font-size:1rem; cursor:pointer;">Iniciar</button>
            `;
            this.scoreDiv.parentNode.insertBefore(diffDiv, this.scoreDiv.nextSibling);
            document.getElementById('snake-start-btn').onclick = () => {
                const sel = document.getElementById('snake-difficulty');
                this.start(sel.value);
            };
        }
        // Controles móviles
        this.addMobileControls();
    }
    addMobileControls() {
        if (this.mobileControls) return;
        const controls = document.createElement('div');
        controls.id = 'snake-mobile-controls';
        controls.style.display = 'flex';
        controls.style.justifyContent = 'center';
        controls.style.margin = '1rem 0';
        controls.innerHTML = `
            <button style="width:48px;height:48px;margin:0 8px;font-size:2rem;border-radius:50%;border:none;background:#a5d6a7;" id="snake-up">▲</button>
            <button style="width:48px;height:48px;margin:0 8px;font-size:2rem;border-radius:50%;border:none;background:#a5d6a7;" id="snake-left">◀</button>
            <button style="width:48px;height:48px;margin:0 8px;font-size:2rem;border-radius:50%;border:none;background:#a5d6a7;" id="snake-down">▼</button>
            <button style="width:48px;height:48px;margin:0 8px;font-size:2rem;border-radius:50%;border:none;background:#a5d6a7;" id="snake-right">▶</button>
        `;
        this.scoreDiv.parentNode.insertBefore(controls, this.scoreDiv.nextSibling.nextSibling);
        document.getElementById('snake-up').onclick = () => { if (this.direction.y !== 1) this.nextDirection = {x:0, y:-1}; };
        document.getElementById('snake-down').onclick = () => { if (this.direction.y !== -1) this.nextDirection = {x:0, y:1}; };
        document.getElementById('snake-left').onclick = () => { if (this.direction.x !== 1) this.nextDirection = {x:-1, y:0}; };
        document.getElementById('snake-right').onclick = () => { if (this.direction.x !== -1) this.nextDirection = {x:1, y:0}; };
        this.mobileControls = controls;
    }
    // Sonido opcional (descomenta para activar)
    /*
    playEatSound() {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'triangle';
        o.frequency.value = 440 + Math.random()*80;
        g.gain.value = 0.08;
        o.connect(g).connect(ctx.destination);
        o.start();
        o.stop(ctx.currentTime + 0.12);
        setTimeout(()=>ctx.close(), 200);
    }
    */
}

// --- Inicialización del juego mejorado cuando el modal está abierto ---
document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('snake-canvas');
    const scoreDiv = document.getElementById('snake-score');
    const colorInput = document.getElementById('snake-color');
    const restartBtn = document.getElementById('snake-restart');
    const modal = document.getElementById('modal-snake');
    if (canvas && scoreDiv && colorInput && restartBtn && modal) {
        // Observa la apertura del modal para iniciar el juego
        const observer = new MutationObserver(() => {
            if (modal.style.display === 'flex') {
                setTimeout(() => {
                    if (!snakeGame) snakeGame = new SnakeGame(canvas, scoreDiv, colorInput, restartBtn, modal);
                    else snakeGame.showStartScreen();
                }, 100);
            } else {
                if (snakeGame && snakeGame.interval) clearInterval(snakeGame.interval);
            }
        });
        observer.observe(modal, { attributes: true, attributeFilter: ['style'] });
    }
});

// =============================
// FORMULARIO DE CONTACTO GATUNO
// =============================
const form = document.getElementById('form-contacto');
const alerta = document.getElementById('contacto-alerta');
if (form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        alerta.textContent = '¡Gracias por tu mensaje, maullaremos pronto! 😺';
        alerta.style.color = '#ffb6b9';
        form.reset();
    });
}

// Mostrar y ocultar modales de sección

// Espera a que el DOM esté completamente cargado
// para asegurar que todos los elementos existen antes de manipularlos.
document.addEventListener('DOMContentLoaded', function () {
  // Selecciona todos los botones de sección (Sobre mí, Estudios, etc.)
  const sectionButtons = document.querySelectorAll('.section-btn');
  // Selecciona todos los modales (ventanas emergentes)
  const modals = document.querySelectorAll('.modal');
  // Selecciona todos los botones de cerrar (la X en cada modal)
  const closeBtns = document.querySelectorAll('.close-btn');

  // Abrir el modal correspondiente al hacer click en un botón de sección
  sectionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Obtiene el nombre de la sección desde el atributo data-section
      const section = btn.getAttribute('data-section');
      // Busca el modal correspondiente por su id
      const modal = document.getElementById('modal-' + section);
      if (modal) {
        // Muestra el modal usando flexbox
        modal.style.display = 'flex';
        // Pequeño retraso para permitir la animación CSS
        setTimeout(() => {
          modal.classList.add('active');
        }, 10);
        // Evita que la página se desplace mientras el modal está abierto
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Cerrar el modal al hacer click en la X
  closeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Busca el modal más cercano al botón de cerrar
      const modal = btn.closest('.modal');
      closeModal(modal);
    });
  });

  // Cerrar el modal al hacer click fuera del contenido (en el fondo traslúcido)
  modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      // Si el click fue directamente en el fondo del modal (no en el contenido)
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  // Cerrar el modal al presionar la tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modals.forEach(modal => {
        if (modal.style.display === 'flex') {
          closeModal(modal);
        }
      });
    }
  });

  // Función para cerrar el modal con animación
  function closeModal(modal) {
    if (!modal) return;
    // Quita la clase de animación
    modal.classList.remove('active');
    // Espera la animación antes de ocultar el modal
    setTimeout(() => {
      modal.style.display = 'none';
      // Permite de nuevo el scroll en la página
      document.body.style.overflow = '';
    }, 200);
  }
});

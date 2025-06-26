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
// SNAKE GATUNO: Gatito persigue peces
// =============================

// --- Variables del juego ---
let snakeInterval, snake, direction, nextDirection, fish, score, isDead, gridSize, tileCount, catImg, fishImg;
const canvas = document.getElementById('snake-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;
const scoreDiv = document.getElementById('snake-score');
const colorInput = document.getElementById('snake-color');
const restartBtn = document.getElementById('snake-restart');

// --- Cargar imágenes de gatito y pez (sin copyright) ---
catImg = new window.Image();
catImg.src = 'https://cdn.pixabay.com/photo/2017/01/06/19/15/cat-1958376_1280.png';
fishImg = new window.Image();
fishImg.src = 'https://cdn.pixabay.com/photo/2013/07/12/15/55/fish-150978_1280.png';

// --- Iniciar el juego Snake Gatuno ---
function startCatSnake() {
    if (!ctx) return;
    gridSize = 20;
    tileCount = 20;
    snake = [{x: 10, y: 10}];
    direction = {x: 0, y: -1};
    nextDirection = {x: 0, y: -1};
    score = 0;
    isDead = false;
    placeFish();
    updateScore();
    clearInterval(snakeInterval);
    snakeInterval = setInterval(gameLoop, 100);
}

// --- Detener el juego Snake Gatuno ---
function stopCatSnake() {
    clearInterval(snakeInterval);
}

// --- Colocar el pez en una posición aleatoria ---
function placeFish() {
    let valid = false;
    while (!valid) {
        fish = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
        valid = !snake.some(s => s.x === fish.x && s.y === fish.y);
    }
}

// --- Actualizar el puntaje ---
function updateScore() {
    if (scoreDiv) scoreDiv.textContent = `Puntaje: ${score}`;
}

// --- Lógica principal del juego ---
function gameLoop() {
    // Cambiar dirección si es válida
    if (Math.abs(nextDirection.x) !== Math.abs(direction.x) || Math.abs(nextDirection.y) !== Math.abs(direction.y)) {
        direction = {...nextDirection};
    }
    // Mover la cabeza del gatito
    const head = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};
    // Colisiones con paredes
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        return gameOver();
    }
    // Colisión con sí mismo
    if (snake.some(s => s.x === head.x && s.y === head.y)) {
        return gameOver();
    }
    snake.unshift(head);
    // Comer pez
    if (head.x === fish.x && head.y === fish.y) {
        score++;
        updateScore();
        placeFish();
    } else {
        snake.pop();
    }
    drawGame();
}

// --- Dibujar el juego en el canvas ---
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Fondo
    ctx.fillStyle = '#fff6fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Dibujar pez
    ctx.drawImage(fishImg, fish.x * gridSize, fish.y * gridSize, gridSize, gridSize);
    // Dibujar gatito (cabeza)
    ctx.save();
    ctx.shadowColor = '#ffb6b9';
    ctx.shadowBlur = 12;
    ctx.drawImage(catImg, snake[0].x * gridSize, snake[0].y * gridSize, gridSize, gridSize);
    ctx.restore();
    // Dibujar cuerpo (patitas)
    ctx.fillStyle = '#ffb6b9';
    for (let i = 1; i < snake.length; i++) {
        ctx.beginPath();
        ctx.arc(snake[i].x * gridSize + gridSize/2, snake[i].y * gridSize + gridSize/2, gridSize/2.5, 0, 2 * Math.PI);
        ctx.fill();
    }
}

// --- Game Over gatuno ---
function gameOver() {
    clearInterval(snakeInterval);
    isDead = true;
    ctx.save();
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = '#ffb6b9';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#a0527a';
    ctx.font = 'bold 2.2rem "Comic Sans MS", Arial';
    ctx.textAlign = 'center';
    ctx.fillText('¡Miau! Game Over', canvas.width/2, canvas.height/2 - 10);
    ctx.font = '1.2rem "Comic Sans MS", Arial';
    ctx.fillText('Presiona R para reiniciar', canvas.width/2, canvas.height/2 + 30);
    ctx.restore();
}

// --- Controles de teclado ---
window.addEventListener('keydown', e => {
    if (!modals['snake'].classList.contains('active')) return;
    if (isDead && (e.key === 'r' || e.key === 'R')) {
        startCatSnake();
        return;
    }
    switch (e.key) {
        case 'ArrowUp':
            if (direction.y !== 1) nextDirection = {x: 0, y: -1};
            break;
        case 'ArrowDown':
            if (direction.y !== -1) nextDirection = {x: 0, y: 1};
            break;
        case 'ArrowLeft':
            if (direction.x !== 1) nextDirection = {x: -1, y: 0};
            break;
        case 'ArrowRight':
            if (direction.x !== -1) nextDirection = {x: 1, y: 0};
            break;
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

// === JUEGO SNAKE ===
(function() {
  // Elementos del DOM
  const canvas = document.getElementById('snake-canvas');
  const ctx = canvas ? canvas.getContext('2d') : null;
  const scoreDiv = document.getElementById('snake-score');
  const colorInput = document.getElementById('snake-color');
  const restartBtn = document.getElementById('snake-restart');
  const modalSnake = document.getElementById('modal-snake');

  // Parámetros del juego
  const gridSize = 20; // tamaño de cada celda
  const tileCount = 20; // 20x20
  let snake, food, direction, nextDirection, score, alive, snakeColor, gameInterval;

  // Inicializa el juego
  function initSnakeGame() {
    snake = [ {x: 10, y: 10} ];
    direction = {x: 0, y: -1}; // Arriba
    nextDirection = {x: 0, y: -1};
    placeFood();
    score = 0;
    alive = true;
    snakeColor = colorInput ? colorInput.value : '#388e3c';
    updateScore();
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, 100);
  }

  // Coloca la comida en una posición aleatoria que no esté ocupada por la serpiente
  function placeFood() {
    let valid = false;
    while (!valid) {
      food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
      };
      valid = !snake.some(seg => seg.x === food.x && seg.y === food.y);
    }
  }

  // Actualiza el puntaje en pantalla
  function updateScore() {
    if (scoreDiv) scoreDiv.textContent = 'Puntaje: ' + score;
  }

  // Dibuja todo el juego
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Dibuja la comida
    ctx.fillStyle = '#ff7043';
    ctx.beginPath();
    ctx.arc((food.x + 0.5) * gridSize, (food.y + 0.5) * gridSize, gridSize/2.2, 0, Math.PI*2);
    ctx.fill();
    // Dibuja la serpiente
    ctx.fillStyle = snakeColor;
    for (let i = 0; i < snake.length; i++) {
      ctx.beginPath();
      ctx.arc((snake[i].x + 0.5) * gridSize, (snake[i].y + 0.5) * gridSize, gridSize/2.1, 0, Math.PI*2);
      ctx.fill();
      // Ojos en la cabeza
      if (i === 0) {
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc((snake[i].x + 0.7) * gridSize, (snake[i].y + 0.35) * gridSize, 2.5, 0, Math.PI*2);
        ctx.arc((snake[i].x + 0.3) * gridSize, (snake[i].y + 0.35) * gridSize, 2.5, 0, Math.PI*2);
        ctx.fill();
        ctx.fillStyle = snakeColor;
      }
    }
    // Si está muerto, muestra mensaje
    if (!alive) {
      ctx.fillStyle = 'rgba(44,62,80,0.85)';
      ctx.fillRect(0, canvas.height/2-40, canvas.width, 80);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 2rem Cinzel, Arial';
      ctx.textAlign = 'center';
      ctx.fillText('¡Perdiste!', canvas.width/2, canvas.height/2);
      ctx.font = '1.1rem Cinzel, Arial';
      ctx.fillText('Presiona Reiniciar', canvas.width/2, canvas.height/2+32);
    }
  }

  // Lógica principal del juego
  function gameLoop() {
    if (!alive) return;
    // Cambia la dirección solo si no es opuesta
    if ((nextDirection.x !== -direction.x || nextDirection.y !== -direction.y)) {
      direction = {...nextDirection};
    }
    // Calcula la nueva cabeza
    const newHead = {
      x: snake[0].x + direction.x,
      y: snake[0].y + direction.y
    };
    // Colisión con paredes
    if (newHead.x < 0 || newHead.x >= tileCount || newHead.y < 0 || newHead.y >= tileCount) {
      alive = false;
      draw();
      return;
    }
    // Colisión con sí mismo
    if (snake.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
      alive = false;
      draw();
      return;
    }
    // Mueve la serpiente
    snake.unshift(newHead);
    // Comer comida
    if (newHead.x === food.x && newHead.y === food.y) {
      score++;
      updateScore();
      placeFood();
    } else {
      snake.pop();
    }
    draw();
  }

  // Maneja el teclado para mover la serpiente
  function handleKey(e) {
    if (!modalSnake || modalSnake.style.display !== 'flex') return;
    switch (e.key) {
      case 'ArrowUp': case 'w': case 'W': nextDirection = {x:0, y:-1}; break;
      case 'ArrowDown': case 's': case 'S': nextDirection = {x:0, y:1}; break;
      case 'ArrowLeft': case 'a': case 'A': nextDirection = {x:-1, y:0}; break;
      case 'ArrowRight': case 'd': case 'D': nextDirection = {x:1, y:0}; break;
    }
  }

  // Cambia el color de la serpiente
  if (colorInput) {
    colorInput.addEventListener('input', function() {
      snakeColor = colorInput.value;
      draw();
    });
  }

  // Botón de reinicio
  if (restartBtn) {
    restartBtn.addEventListener('click', function() {
      initSnakeGame();
    });
  }

  // Inicia el juego solo cuando el modal está abierto
  if (modalSnake) {
    const observer = new MutationObserver(() => {
      if (modalSnake.style.display === 'flex') {
        setTimeout(() => {
          if (canvas) canvas.focus();
          initSnakeGame();
        }, 100);
      } else {
        if (gameInterval) clearInterval(gameInterval);
      }
    });
    observer.observe(modalSnake, { attributes: true, attributeFilter: ['style'] });
  }

  // Escucha el teclado globalmente
  window.addEventListener('keydown', handleKey);
})();

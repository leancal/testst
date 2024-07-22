import { Vec } from "./entities";

export class EventsManager {
  constructor(canvas) {
    this.rect = canvas.getBoundingClientRect();

    document.addEventListener("keydown", (e) => this.onKeyDown(e));
    document.addEventListener("keyup", (e) => this.onKeyUp(e));
    canvas.addEventListener("mousedown", (e) => this.onMouseDown(e));
    canvas.addEventListener("touchstart", (e) => this.onTouchStart(e));
    canvas.addEventListener("touchmove", (e) => this.onTouchMove(e));
    canvas.addEventListener("touchend", (e) => this.onTouchEnd(e));

    document.getElementById('btnUp').addEventListener('mousedown', () => this.onButtonPress('up', true));
    document.getElementById('btnUp').addEventListener('mouseup', () => this.onButtonPress('up', false));
    document.getElementById('btnUp').addEventListener('touchstart', () => this.onButtonPress('up', true));
    document.getElementById('btnUp').addEventListener('touchend', () => this.onButtonPress('up', false));

    document.getElementById('btnLeft').addEventListener('mousedown', () => this.onButtonPress('left', true));
    document.getElementById('btnLeft').addEventListener('mouseup', () => this.onButtonPress('left', false));
    document.getElementById('btnLeft').addEventListener('touchstart', () => this.onButtonPress('left', true));
    document.getElementById('btnLeft').addEventListener('touchend', () => this.onButtonPress('left', false));

    document.getElementById('btnRight').addEventListener('mousedown', () => this.onButtonPress('right', true));
    document.getElementById('btnRight').addEventListener('mouseup', () => this.onButtonPress('right', false));
    document.getElementById('btnRight').addEventListener('touchstart', () => this.onButtonPress('right', true));
    document.getElementById('btnRight').addEventListener('touchend', () => this.onButtonPress('right', false));

    document.getElementById('btnDown').addEventListener('mousedown', () => this.onButtonPress('down', true));
    document.getElementById('btnDown').addEventListener('mouseup', () => this.onButtonPress('down', false));
    document.getElementById('btnDown').addEventListener('touchstart', () => this.onButtonPress('down', true));
    document.getElementById('btnDown').addEventListener('touchend', () => this.onButtonPress('down', false));


    this.action = {
      left: false,
      right: false,
      shoot: false,
      up: false,
      down: false
    };

    this.bind = {
      KeyA: 'left',
      KeyD: 'right',
      KeyW: 'up',
      KeyS: 'down',
    };

    this.mouseCoords = new Vec(0, 0);
  }

  onButtonPress(direction, isActive) {
    this.action[direction] = isActive;
  }

  onKeyDown(event) {
    let action = this.bind[event.code];
    if (action) {
      this.action[action] = true;
      event.preventDefault();
    }
  }

  onKeyUp(event) {
    let action = this.bind[event.code];
    if (action) {
      this.action[action] = false;
      event.preventDefault();
    }
  }

  onTouchStart(event) {
    event.preventDefault();
    this.handleTouch(event.touches);
  }

  onTouchMove(event) {
    event.preventDefault();
    this.handleTouch(event.touches);
  }

  onTouchEnd(event) {
    event.preventDefault();
    // Resetear acciones de movimiento cuando se levantan los dedos
    this.action['left'] = false;
    this.action['right'] = false;
    this.action['up'] = false;
    this.action['down'] = false;
  }

  handleTouch(touches) {
    for (let touch of touches) {
      let touchX = touch.clientX - this.rect.left;
      let touchY = touch.clientY - this.rect.top;

      // Determinar las direcciones basadas en la posición del toque
      if (touchX < this.rect.width / 3) {
        this.action['left'] = true;
      } else if (touchX > (2 * this.rect.width) / 3) {
        this.action['right'] = true;
      } else {
        this.action['left'] = false;
        this.action['right'] = false;
      }

      if (touchY < this.rect.height / 3) {
        this.action['up'] = true;
      } else if (touchY > (2 * this.rect.height) / 3) {
        this.action['down'] = true;
      } else {
        this.action['up'] = false;
        this.action['down'] = false;
      }
    }
  }

  onMouseDown(event) {
    if (event.button === 0) {
      this.action["shoot"] = false;
    }
  }

  getMousePos(event) {
    this.mouseCoords = new Vec(event.clientX - this.rect.left, event.clientY - this.rect.top);
  }
}

export class SpritesManager {
  constructor(ctx) {
    this.ctx = ctx;
    this.sprites = null;
    this.spritesInfo = null;
    this.bulletsSprites = {};
  }

  async init() {
    this.sprites = new Image();

    await new Promise(resolve => {
      this.sprites.onload = () => resolve("ok");
      this.sprites.src = "sprites/set.png";
    });

    await new Promise(resolve => {
      let spriteCount = 0;
      for (let color of ['red', 'yellow']) {
        const bulletSprite = new Image();
        bulletSprite.onload = () => {
          this.bulletsSprites[color] = bulletSprite;
          spriteCount++;
          if (spriteCount === 2) {
            resolve("ok");
          }
        };
        bulletSprite.src = `sprites/proj_${color}.png`;
      }
    });

    await new Promise(resolve => {
      let res = fetch("data/entities.json")
        .then(res => res.json())
        .then(res => {
          this.spritesInfo = res;
          resolve("ok");
        })
        .catch(err => err);
    });
  }

  clear() {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  draw(obj) {
    if (obj instanceof Array) {
      obj.forEach(o => this.draw(o));
    } else {
      obj.draw({
        ctx: this.ctx,
        bulletsSprites: this.bulletsSprites,
        gameSprites: this.sprites,
        gameSpriteInfo: this.spritesInfo
      });
    }
  }

  drawMapBottom(map) {
    if (!map.imgLoaded || !map.jsonLoaded) {
      setTimeout(() => this.drawMapBottom(map), 100);
    }
    this.drawLevel(map, map.bottomLayer);
    this.drawLevel(map, map.middleLayer);
  }

  drawMapTop(map) {
    if (!map.imgLoaded || !map.jsonLoaded) {
      setTimeout(() => this.drawMapTop(map), 100);
    }
    this.drawLevel(map, map.topLayer);
  }

  drawIdleMessage(message, playerPos) {
    const padding = 10;
    const maxWidth = 200; // Ancho máximo del globo, ajusta según sea necesario
    const lineHeight = 20; // Altura de línea aproximada

    // Dividir el mensaje en líneas basadas en el ancho máximo
    let words = message.split(' ');
    let lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        let word = words[i];
        let width = this.ctx.measureText(currentLine + ' ' + word).width;
        if (width < maxWidth) {
            currentLine += ' ' + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);

    const bubbleWidth = maxWidth + padding * 2;
    const bubbleHeight = lines.length * lineHeight + padding * 2;
    const cornerRadius = 10; // Radio de las esquinas redondeadas

    this.ctx.fillStyle = "white";
    this.ctx.strokeStyle = "black";
    this.ctx.lineWidth = 2;

    // Calcula la posición inicial del globo para que la esquina inferior izquierda esté sobre el personaje
    const startX = playerPos.x  - bubbleWidth / 2;
    const startY = playerPos.y - 40 - bubbleHeight; // Mueve el globo hacia arriba

    // Dibuja el globo de diálogo con bordes redondeados
    this.ctx.beginPath();
    this.ctx.moveTo(startX + cornerRadius, startY); // Punta del globo
    this.ctx.lineTo(startX + bubbleWidth - cornerRadius, startY); // Línea horizontal hacia la derecha
    this.ctx.arcTo(startX + bubbleWidth, startY, startX + bubbleWidth, startY + cornerRadius, cornerRadius); // Esquina superior derecha
    this.ctx.lineTo(startX + bubbleWidth, startY + bubbleHeight - cornerRadius); // Línea vertical hacia abajo
    this.ctx.arcTo(startX + bubbleWidth, startY + bubbleHeight, startX + bubbleWidth - cornerRadius, startY + bubbleHeight, cornerRadius); // Esquina inferior derecha
    this.ctx.lineTo(startX + cornerRadius, startY + bubbleHeight); // Línea horizontal hacia la izquierda
    this.ctx.arcTo(startX, startY + bubbleHeight, startX, startY + bubbleHeight - cornerRadius, cornerRadius); // Esquina inferior izquierda
    this.ctx.lineTo(startX, startY + cornerRadius); // Línea vertical hacia arriba
    this.ctx.arcTo(startX, startY, startX + cornerRadius, startY, cornerRadius); // Esquina superior izquierda
    this.ctx.closePath(); // Cierra el camino del globo
    this.ctx.fill(); // Rellena el globo
    this.ctx.stroke(); // Dibuja el borde del globo

    // Dibuja el texto con la tipografía 'Press Start 2P'
    this.ctx.font = "16px 'Press Start 2P', cursive";
    this.ctx.fillStyle = "black";
    this.ctx.textAlign = "center";

    // Dibuja cada línea del mensaje
    for (let i = 0; i < lines.length; i++) {
        this.ctx.fillText(lines[i], playerPos.x, startY + padding + lineHeight + i * lineHeight); // Coloca el texto dentro del globo
    }
}


  drawLevel(map, layer) {
    for (let i = 0; i < layer.data.length; i++) {
      if (layer.data[i] !== 0) {
        let tile = map.getTile(layer.data[i]);
        let pX = (i % map.xCount) * map.tSize.x;
        let pY = Math.floor(i / map.xCount) * map.tSize.y;
        this.ctx.drawImage(
          tile.img,
          tile.px, tile.py,
          map.tSize.x, map.tSize.y,
          pX * 2, pY * 2,
          32, 32);
      }
    }
  }
}


import { Enemy, Player, Vec } from "./entities";

export class MapManager {
  constructor() {
    this.mapData = null;
    this.xCount = 0;
    this.yCount = 0;
    this.tSize = { x: 32, y: 32 };
    this.mapSize = { x: 32, y: 32 };
    this.tilesets = [];
    this.imgLoadCount = 0;
    this.imgLoaded = false;
    this.jsonLoaded = false;

    this.width = null;
    this.height = null;

    this.topLayer = null;
    this.middleLayer = null;
    this.bottomLayer = null;

    this.levelNum = 0;
  }

  async loadLevel() {
    let res = await fetch(`data/level${++this.levelNum}.json`);
    return await res.json();
  }

  parseMap(mapData) {
    this.mapData = mapData;
    this.xCount = this.mapData.width;
    this.yCount = this.mapData.height;
    this.tSize.x = this.mapData.tilewidth;
    this.tSize.y = this.mapData.tileheight;
    this.mapSize.x = this.xCount * this.tSize.x;
    this.mapSize.y = this.yCount * this.tSize.y;

    this.width = this.mapSize.x * 2;
    this.height = this.mapSize.y * 2;

    for (let i = 0; i < this.mapData.tilesets.length; i++) {
      let img = new Image();
      img.onload = () => {
        this.imgLoadCount++;
        if (this.imgLoadCount === this.mapData.tilesets.length) {
          this.imgLoaded = true;
        }
      };
      img.src = this.mapData.tilesets[i].image;
      let t = this.mapData.tilesets[i];
      let ts = {
        firstgid: t.firstgid,
        image: img,
        name: t.name,
        xCount: Math.floor(t.imagewidth / this.tSize.x),
        yCount: Math.floor(t.imageheight / this.tSize.y),
      };
      this.tilesets.push(ts);
    }
    this.topLayer = this.mapData.layers.find((l) => l.name === "top");
    this.middleLayer = this.mapData.layers.find((l) => l.name === "middle");
    this.bottomLayer = this.mapData.layers.find((l) => l.name === "bottom");
    this.jsonLoaded = true;
  }

  isWall(x, y) {
    let wX = Math.floor(x / 2);
    let wY = Math.floor(y / 2);
    let idx =
      Math.floor(wY / this.tSize.y) * this.xCount +
      Math.floor(wX / this.tSize.x);
    let tileId = this.middleLayer.data[idx];
    const wallId = [
      289, 290, 291, 292, 293, 294, 295, 296, 297, 298, 259, 260, 310, 311, 312,
      313, 314, 315, 316, 317, 318, 319, 396, 405, 364, 373, 332, 341, 428, 437,
      460, 469, 492, 493, 494, 499, 500, 501, 522, 464, 465, 616, 647, 648,650, 678,679, 696, 751 ,754, 755, 782, 783, 786, 787,814, 815, 818, 819, 840, 846, 847, 850,851, 871, 872, 902, 903, 904,351,354,383,386,415,418,449, 450, 482,511,514,543,546,575,578,607,610,639,642,671,674,703,706,735,738,767, 770, 799, 802, 831,834,863,866,895, 898, 920,927,930,959,962, 994, 995, 996, 997, 998,
      999, 1000, 1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008, 1009, 1010,
      1011, 1012, 1013, 1014, 1015, 1016, 1017, 1018, 1019, 1020, 1021, 1022,
      1023,
    ];
    return wallId.find((id) => id === tileId);
  }

  isExit(x, y) {
    let wX = Math.floor(x / 2);
    let wY = Math.floor(y / 2);
    let idx =
      Math.floor(wY / this.tSize.y) * this.xCount +
      Math.floor(wX / this.tSize.x);
    let tileId = this.middleLayer.data[idx];

    if (tileId === 464 || tileId === 465) {
      return true; // Regular exit
    }

    return false;
  }

  // isReturn(x, y) {
  //   let wX = Math.floor(x / 2);
  //   let wY = Math.floor(y / 2);
  //   let idx =
  //     Math.floor(wY / this.tSize.y) * this.xCount +
  //     Math.floor(wX / this.tSize.x);
  //   let tileId = this.middleLayer.data[idx];
  //   if (tileId === 1008 || tileId === 1009) {
  //     return false;
  //   }
  //   return true;
  // }

  handleWarning() {
    window.showWarning(); // Call the function defined in the HTML
  }

  getTile(tileIndex) {
    let tile = {
      img: null,
      px: 0,
      py: 0,
    };
    let tileset = this.getTileset(tileIndex);
    tile.img = tileset.image;
    let id = tileIndex - tileset.firstgid;
    let x = id % tileset.xCount;
    let y = Math.floor(id / tileset.xCount);
    tile.px = x * this.tSize.x;
    tile.py = y * this.tSize.y;
    return tile;
  }

  getTileset(tileIndex) {
    for (let i = this.tilesets.length - 1; i >= 0; i--)
      if (this.tilesets[i].firstgid <= tileIndex) {
        return this.tilesets[i];
      }
    return null;
  }

  parseObjects(mapData, objects) {
    const objectLayer = mapData.layers.find((l) => l.type === "objectgroup");
    for (let object of objectLayer.objects) {
      if (object.type === "player") {
        objects.unshift(
          new Player(
            new Vec(object.x * 2, object.y * 2),
            new Vec(0, 0),
            32,
            64,
            "knight_f_run_anim"
          )
        );
      }

      if (object.type === "enemy") {
        let isShotgunProp = object.properties.find((p) => p.name === "shotgun");
        let spriteProp = object.properties.find((p) => p.name === "sprite");
        const e = new Enemy(
          new Vec(object.x * 2, object.y * 2),
          new Vec(0, 0),
          32,
          64,
          spriteProp.value
        );
        e.hasShotgun = isShotgunProp.value;
        objects.push(e);
      }
    }
  }
}

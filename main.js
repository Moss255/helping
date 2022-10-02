import { Texture, SCALE_MODES, Application, settings} from 'pixi.js';
import { sound } from '@pixi/sound';
import {Bed, Icon, Player, Timer, BedRequest} from './src/components';
import './index.css';
import Drawer from './src/components/Drawer';

const app = new Application({ backgroundAlpha: 0, width: window.innerWidth, height: window.innerHeight - 10});
document.body.appendChild(app.view);

// Scale mode for all textures, will retain pixelation
settings.SCALE_MODE = SCALE_MODES.NEAREST;

const bedTexture = Texture.from('bed.png');

sound.add('done', 'done.wav');

let playerTextures = [];

for (let i = 0; i <= 7; i++) {
  playerTextures.push(Texture.from(`blackberry/region_${i}.png`));
}

const player = new Player(0, 0, playerTextures);

app.stage.addChild(player);

const iconSelectedFiles = ['fill-call.png', 'fill-medication.png', 'fill-feedback.png', 'fill-shower.png'];

export const iconSelectedTextures = iconSelectedFiles.map(icon => {
  return Texture.from(icon);
});

const iconFiles = ['call.png', 'medication.png', 'feedback.png', 'shower.png'];

export const iconTextures = iconFiles.map(icon => {
  return Texture.from(icon);
});

const requestFiles = ['request-call.png', 'request-medication.png', 'request-feedback.png', 'request-shower.png']

const requestTextures = requestFiles.map(request => {
  return Texture.from(request);
});

const drawerTexture = Texture.from('drawer.png')

const drawer = new Drawer(250, 64, drawerTexture, 1, app);



const beds = [];
const icons = [];

const requests = {};

const timer = new Timer(app.screen.width / 2, 0, '', app, 2, 2, 0, 'request', false);

const survivalTimer = new Timer(app.screen.width - 70, 0, '', app, 0, 1000, 0, 'add-time', true);

let failTimer;

for (let i = 0; i <= 4; i++) {
  const icon = new Icon(app.screen.width - 70, 70 * i + 32, iconTextures[i], i, player, app);
  icons.push(icon);
}

for (let i = 0; i < 6; i++) {
  const x = i >= 3 ? i - 3 : i
  const bed = new Bed((app.screen.width / 3 * x) + 40, i >= 3 ? (app.screen.height / 2) + 64 : 16, bedTexture, player, app, i);
  beds.push(bed);
}

app.stage.on('request', (e) => {
  if (Object.keys(requests).length > 4 && !failTimer) {
    failTimer = new Timer(app.screen.width / 2, app.screen.height / 2, '5', app, 5, 5, 0, 'fail', true)
    app.stage.addChild(failTimer);
  }

  const { bedId, requestId } = e;
  const { x, y } = beds[bedId];
  if (requests[bedId]) {
    return;
  }
  beds[bedId].request = requestId;
  const request = new BedRequest(x + 40, y, requestTextures[requestId], bedId);
  requests[bedId] = request;
  app.stage.addChild(request)
});

app.stage.on('requestComplete', (e) => {
  if (Object.keys(requests).length <= 4 && failTimer) {
    app.stage.removeChild(failTimer);
    failTimer.value = 5;
    failTimer = null;
    sound.stop('done');
  }

  const { bedId } = e;
  app.stage.removeChild(requests[bedId]);
  delete requests[bedId]
});

app.stage.on('itemChange', (e) => {
  icons.forEach(icon => {
    if (icon.type === player.selectedItem) {
      icon.texture = iconSelectedTextures[icon.type]
    } else {
      icon.texture = iconTextures[icon.type]
    }
  })
});

app.stage.addChild(timer);
app.stage.addChild(survivalTimer);
app.stage.addChild(drawer);

beds.forEach(bed => {
  app.stage.addChild(bed);
});

icons.forEach(icon => {
  app.stage.addChild(icon);
});


import { Texture, SCALE_MODES, Application, settings, Text, TextStyle, Sprite } from 'pixi.js';
import { sound } from '@pixi/sound';
import { Bed, Icon, Player, Timer, BedRequest, Nurse, Button, Badge, Counter} from './src/components';
import { generateChange, generateRandomInteger } from './src/utils';

const titleStyle = new TextStyle({
  fontFamily: 'Roboto',
  fontSize: 36,
  fontWeight: 'bold',
  fill: ['#1099bb'],
  stroke: '#fff',
  strokeThickness: 5,
  wordWrap: true,
  wordWrapWidth: 440,
  lineJoin: 'round',
});

const badgeStyle = new TextStyle({
  fontFamily: 'Roboto',
  fontSize: 32,
  fill: ['#1099bb'],
/*   stroke: '#fff',
  strokeThickness: 5, */
  wordWrap: true,
  wordWrapWidth: 440,
  lineJoin: 'round',
});

const textStyle = new TextStyle({
  fontFamily: 'Roboto',
  fontSize: 24,
  fontWeight: 'bold',
  fill: ['#fff'],
  stroke: '#fff',
  strokeThickness: 0,
  wordWrap: true,
  wordWrapWidth: 440,
  lineJoin: 'round',
});

let playerTextures = [];

for (let i = 0; i <= 7; i++) {
  playerTextures.push(Texture.from(`assets/blackberry/region_${i}.png`));
}

const nursesTextures = {
  0: [],
  1: [],
  2: []
}


sound.add('done', 'assets/done.ogg');
sound.add('bg', 'assets/bg.ogg');
sound.add('explode', 'assets/explode.ogg');


const badgeTexture = Texture.from('assets/badge.png');

for (let i = 0; i <= 7; i++) {
  nursesTextures[0].push(Texture.from(`assets/blackberry/region_${i}.png`));
  nursesTextures[1].push(Texture.from(`assets/strawberry/region_${i}.png`));
  nursesTextures[2].push(Texture.from(`assets/banana/region_${i}.png`));
}

const iconSelectedFiles = ['fill-call.png', 'fill-medication.png', 'fill-feedback.png', 'fill-shower.png'];

export const iconSelectedTextures = iconSelectedFiles.map(icon => {
  return Texture.from(icon);
});

const iconFiles = ['call.png', 'medication.png', 'feedback.png', 'shower.png'];

export const iconTextures = iconFiles.map(icon => {
  return Texture.from(`assets/${icon}`);
});

const requestFiles = ['request-call.png', 'request-medication.png', 'request-feedback.png', 'request-shower.png']

export const requestTextures = requestFiles.map(request => {
  return Texture.from(`assets/${request}`);
});

let appWidth = 360;
let appHeight = 800;

var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
if (isMobile) {
  appWidth = window.innerWidth;
  appHeight = window.innerHeight;
}

settings.RESOLUTION = 1;

// Scale mode for all textures, will retain pixelation
settings.SCALE_MODE = SCALE_MODES.NEAREST;

const app = new Application({ backgroundAlpha: 0, width: appWidth, height: appHeight - 10 });
document.body.appendChild(app.view);


const survivalTimer = new Timer(app.screen.width - 110, 0, '', app, 0, 1000, 0, 'add-time', true, titleStyle);

const Scenes = {
  updateScene(scene) {
    switch (scene) {
      case 'start':
        start();
        break;
      case 'tutorial':
        tutorial();
        break;
      case 'game':
        game();
        break;
      case 'restart':
        restart();
        break;
    }
  }
}

const tutorial = () => {
  const slideTextures = [0, 1, 2, 3].map(value => {
    return Texture.from(`assets/tutorial/slide_${value}.png`);
  });

  let tutCount = 0;

  const tutorialTips = ['Tap the icon to select an item', 'Tap on the bed to fulfill the request', 'Tap the managers for some assistance (they come rarely)', 'How long can you survive? Watch the timer.', 'Any questions? Warning! You will not enough resources at some points!'];

  textStyle.wordWrapWidth = app.screen.width - 32;

  const tutorialText = new Text(tutorialTips[tutCount], textStyle);

  tutorialText.x = 0;
  tutorialText.y = 0;

  app.stage.addChild(tutorialText);

  const frame = new Sprite(slideTextures[tutCount]);

  frame.interactive = true;
  frame.buttonMode = true;

  frame.anchor.set(0.5);

  frame.scale.set(0.25);

  frame.x = app.screen.width / 2;
  frame.y = app.screen.height / 2;

  frame.on('pointerdown', () => {
    tutCount += 1;
    frame.texture = slideTextures[tutCount];
    tutorialText.text = tutorialTips[tutCount];

    if (tutCount > 3) {
      const startTexture = Texture.from('assets/start.png');

      const startButton = new Button(app.screen.width / 2, app.screen.height - 32, startTexture, app, 'play');
      app.stage.addChild(startButton);
    }
  });

  app.stage.addChild(frame);


  app.stage.on('play', (e) => {
    app.stage.removeChildren();
    app.stage.removeAllListeners();
    Scenes.updateScene('start');
  });
}

const start = () => {

  document.body.style.backgroundImage = Floor;

  sound.stopAll();

  sound.play('bg', {loop: true, volume: 0.05});

  const title = new Text('Helping', titleStyle);

  title.anchor.set(0.5, 0.5);
  title.x = app.screen.width / 2;
  title.y = 128;
  app.stage.addChild(title);

  const startTexture = Texture.from('assets/start.png');
  const tutorialTexture = Texture.from('assets/tutorial.png');

  const startButton = new Button(app.screen.width / 2, 400, startTexture, app, 'play');
  app.stage.addChild(startButton);

  const tutorialButton = new Button(app.screen.width / 2, 500, tutorialTexture, app, 'tutorial');
  app.stage.addChild(tutorialButton);

  app.stage.on('play', (e) => {
    app.stage.removeChildren();
    app.stage.removeAllListeners();
    Scenes.updateScene('game');
});

app.stage.on('tutorial', (e) => {
  app.stage.removeChildren();
  app.stage.removeAllListeners();
  Scenes.updateScene('tutorial');
})
}

const restart = () => {

  const title = new Text('Helping', titleStyle);
  title.anchor.set(0.5, 0.5);
  title.x = app.screen.width / 2;
  title.y = 128;
  app.stage.addChild(title);

  const score = new Text(`You survived ${survivalTimer.text}`, titleStyle);
  score.anchor.set(0.5);
  score.x = app.screen.width / 2;
  score.y = app.screen.height / 2;
  app.stage.addChild(score);

  const restartTexture = Texture.from('assets/restart.png')
  
  const restartButton = new Button(app.screen.width / 2, app.screen.height - 32, restartTexture, app, 'restart');
  app.stage.addChild(restartButton);

  app.stage.on('restart', (e) => {
    app.stage.removeAllListeners();
    app.stage.removeChildren();
    Scenes.updateScene('game');
  });
}


const game = () => {

  console.log('game');
  sound.stopAll();

  app.ticker.start();

  const bedTexture = Texture.from('assets/bed.png');

  const player = new Player(0, 0, playerTextures);

  app.stage.addChild(player);



  const beds = [];
  const icons = [];

  const badges = [];
  const badgesText = [];

  const requests = {};

  const timer = new Timer(app.screen.width / 2, 0, '', app, 2, 2, 0, 'request', false, titleStyle);

  const survivalTimer = new Timer(app.screen.width - 110, 0, '', app, 0, 1000, 0, 'add-time', true, titleStyle);

  let failTimer;

  for (let i = 0; i <= 3; i++) {
    const icon = new Icon(80 * i + (app.screen.width / 2) - 135, app.screen.height - 32, iconTextures[i], i, player, app);
    const badge = new Badge(icon.x + 32, icon.y - 16, badgeTexture);
    const badgeText = new Counter(badge.x, badge.y, '0', badgeStyle);
    badgeText.addValue(player.options[i]);
    badgesText.push(badgeText);
    badges.push(badge);
    icons.push(icon);
  }

  for (let i = 0; i < 6; i++) {
    const x = i >= 3 ? i - 3 : i
    const bed = new Bed((app.screen.width / 3 * x) + 30, i >= 3 ? (app.screen.height / 2) + 64 : 48, bedTexture, player, app, i);
    beds.push(bed);
  }

  app.stage.on('request', (e) => {
    if (Object.keys(requests).length > 4 && !failTimer) {
      failTimer = new Timer(app.screen.width / 2, app.screen.height / 2, '5', app, 5, 5, 0, 'fail', true, titleStyle)
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

  app.stage.on('gameover', (e) => {
    app.stage.removeChildren();
    app.ticker.stop();
    Scenes.updateScene('restart');
  });

  let nurseTime = 0;

  let nurses = [];

  app.ticker.add((delta) => {
    nurseTime += delta / app.ticker.FPS;

    // Ever 6 seconds
    if (Math.ceil(nurseTime) % 6 === 0) {
      if (nurses.length <= 0 && generateChange(750)) {
        const left = false
        let nurse = null
        if (left) {
          nurse = new Nurse(-25, 192, nursesTextures[generateRandomInteger(0, 2)], 'left', app);
        } else {
          nurse = new Nurse(app.screen.width + 32, (app.screen.height / 2) + 32, nursesTextures[generateRandomInteger(0, 2)], 'right', app);
        }

        nurses.push(nurse)
        app.stage.addChild(nurse);
      }
    }
  });

  app.stage.on('nurseEnd', (e) => {
    const { nurse } = e;
    nurses = nurses.filter(curNurse => !curNurse.destroyed);
    app.stage.removeChild(nurse);
  });

  app.stage.on('replenish', (e) => {
    sound.play('explode');
    const { requestId } = e;
    player.options[requestId] += 2;
    badgesText[requestId].setValue(player.options[requestId]);
  })

  app.stage.on('requestComplete', (e) => {
    const { requestId, bedId } = e;
    if (Object.keys(requests).length <= 4 && failTimer) {
      app.stage.removeChild(failTimer);
      failTimer.value = 5;
      failTimer = null;
      
    }

    badgesText[requestId].setValue(player.options[requestId]);
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

  beds.forEach(bed => {
    app.stage.addChild(bed);
  });

  icons.forEach(icon => {
    app.stage.addChild(icon);
  });

  badges.forEach(badge => {
    app.stage.addChild(badge);
  });

  badgesText.forEach(text => {
    app.stage.addChild(text);
  })


}

Scenes.updateScene('start');
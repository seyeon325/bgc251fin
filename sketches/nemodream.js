const { Responsive } = P5Template;

let mode = 'start';
let shapes = [];
let size = 60;

let startImg;
let circleSize = 0;
let circleSpeed = 20;
let maxCircle;

let centerX, centerY;

let backgroundSound;

function preload() {
  startImg = loadImage('asset/introimg.png'); // 시작화면 이미지
  backgroundSound = loadSound('asset/bgm.mp3'); // 배경음악
}

function setup() {
  new Responsive().createResponsiveCanvas(1440, 1440, 'contain', false);
  rectMode(CENTER);
  ellipseMode(CENTER);
  colorMode(HSB, 360, 100, 100, 100);

  centerX = width / 2;
  centerY = height / 2;
  maxCircle = dist(0, 0, width, height) * 1.2;
}

function draw() {
  if (mode === 'start') {
    background(255);
    image(startImg, 0, 0, width, height);
    drawStartButton();
  } else if (mode === 'change') {
    background(255);
    image(startImg, 0, 0, width, height);
    fill(330, 90, 100);
    ellipse(centerX, centerY - 130, circleSize);
    circleSize += circleSpeed;

    if (circleSize > maxCircle) {
      mode = 'real';
      createShapes();
    }
  } else {
    if (mode === 'dream') {
      background(0, 0, 98, 10); // 밝은 잔상
    } else if (mode === 'real') {
      background(0, 0, 0, 10); // 어두운 잔상
    }

    for (let i = 0; i < shapes.length; i++) {
      moveShape(shapes[i]);
      drawShape(shapes[i]);
    }
  }
}

function drawStartButton() {
  fill('white');
  strokeWeight(3);
  rect(width / 2, height - 120, 240, 60, 12);
  fill(0);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(20);
  text('네모의 현실과 꿈 보러가기', width / 2, height - 120);
}

function mousePressed() {
  // 오디오 재생: 사용자 클릭 이후
  if (!backgroundSound.isPlaying()) {
    backgroundSound.loop();
    backgroundSound.setVolume(0.5);
  }

  if (mode === 'start') {
    let left = width / 2 - 110;
    let right = width / 2 + 110;
    let top = height - 150;
    let bottom = height - 90;

    let insideButton = false;

    if (mouseX > left) {
      if (mouseX < right) {
        if (mouseY > top) {
          if (mouseY < bottom) {
            insideButton = true;
          }
        }
      }
    }

    if (insideButton === true) {
      mode = 'change';
      circleSize = 0;
    }
  } else if (mode === 'real') {
    mode = 'dream';
    for (let i = 0; i < shapes.length; i++) {
      shapes[i].isDream = true;
    }
  } else if (mode === 'dream') {
    mode = 'real';
    for (let i = 0; i < shapes.length; i++) {
      shapes[i].x = shapes[i].homeX;
      shapes[i].y = shapes[i].homeY;
      shapes[i].isDream = false;
    }
  }
}

function createShapes() {
  shapes = [];

  for (let y = size / 2; y < height; y += size) {
    for (let x = size / 2; x < width; x += size) {
      let shape = {
        homeX: x + random(-2, 2),
        homeY: y + random(-2, 2),
        x: 0,
        y: 0,
        dx: random(-2, 2),
        dy: random(-2, 2),
        color: random([20, 50, 180, 250, 320, 100]),
        isDream: false,
        morph: 0,
      };

      shape.x = shape.homeX;
      shape.y = shape.homeY;

      shapes.push(shape);
    }
  }
}

function moveShape(shape) {
  if (shape.isDream === true) {
    shape.x = shape.x + shape.dx;
    shape.y = shape.y + shape.dy;

    if (shape.x < size / 2) {
      shape.dx = shape.dx * -1;
    }
    if (shape.x > width - size / 2) {
      shape.dx = shape.dx * -1;
    }
    if (shape.y < size / 2) {
      shape.dy = shape.dy * -1;
    }
    if (shape.y > height - size / 2) {
      shape.dy = shape.dy * -1;
    }

    shape.morph += 0.01;
    if (shape.morph > 1) shape.morph = 1;
  } else {
    let shake = sin(frameCount * 0.05) * 5;
    shape.x = shape.homeX + shake;
    shape.y = shape.homeY + shake;

    shape.morph -= 0.02;
    if (shape.morph < 0) shape.morph = 0;
  }
}

function drawShape(shape) {
  push();
  translate(shape.x, shape.y);
  let corner = (size / 2) * shape.morph;
  fill(shape.color, 60, 90, 100);
  rect(0, 0, size * 0.6, size * 0.6, corner);
  pop();
}

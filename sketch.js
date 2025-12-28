// 走路動畫的圖片精靈
let walkSpriteSheet;
const walkFrames = 7;
const walkSpriteWidth = 590;
const walkSpriteHeight = 102;
let walkFrameWidth;

// 跳躍動畫的圖片精靈
let jumpSpriteSheet;
const jumpFrames = 3;
const jumpSpriteWidth = 274;
const jumpSpriteHeight = 84;
let jumpFrameWidth;

// 頭頂動畫的圖片精靈
let headbuttSpriteSheet;
const headbuttFrames = 10;
const headbuttSpriteWidth = 965;
const headbuttSpriteHeight = 110;
let headbuttFrameWidth;

// 新增角色的圖片精靈
let newCharacterSpriteSheet;
const newCharacterFrames = 6;
const newCharacterSpriteWidth = 373;
const newCharacterSpriteHeight = 101;
let newCharacterFrameWidth;

// 拳擊角色的圖片精靈
let punchSpriteSheet;
const punchFrames = 6;
const punchSpriteWidth = 811;
const punchSpriteHeight = 122;
let punchFrameWidth;

// 拳擊角色(角色3)的跳躍圖片精靈
let punchJumpSpriteSheet;
const punchJumpFrames = 7;
const punchJumpSpriteWidth = 779;
const punchJumpSpriteHeight = 163;
let punchJumpFrameWidth;

// 奔跑角色的圖片精靈
let runSpriteSheet;
const runFrames = 6;
const runSpriteWidth = 565;
const runSpriteHeight = 92;
let runFrameWidth;

// 出招角色的圖片精靈
let attackSpriteSheet;
const attackFrames = 8;
const attackSpriteWidth = 1267;
const attackSpriteHeight = 147;
let attackFrameWidth;

// 背景圖片
let bgImage;
let bgImage2;
let bgImage3;
let currentBgImg; // 當前顯示的背景
let nextBgImg = null; // 下一個要切換的背景
let bgAlpha = 0; // 背景轉場透明度

// 角色狀態物件
let character = {
  x: 0,
  y: 0,
  isJumping: false,
  jumpDirection: 1, // 1: right, -1: left
  jumpFrame: 0,
  jumpSpeed: 25,
  isHeadbutting: false,
  headbuttFrame: 0,
  facingDirection: 1, // 1: right, -1: left
  originalY: 0,
};

// 新角色的狀態物件
let newCharacter = {
  x: 0,
  y: 0,
  dialogue: "", // 用來儲存對話文字
  facingDirection: 1, // 1: right, -1: left
};

// 拳擊角色的狀態物件
let punchCharacter = {
  x: 0,
  y: 0,
  isJumping: false,
  jumpFrame: 0,
  dialogue: "", // 用來儲存提示文字
};

// 奔跑角色的狀態物件
let runCharacter = {
  x: 0,
  y: 0,
  dialogue: "", // 用來儲存對話文字
};

// 出招角色的狀態物件
let attackCharacter = {
  x: 0,
  y: 0,
  isAttacking: false,
  attackFrame: 0,
};

// 互動相關變數
let inputElement; // 用於文字輸入
let isInteracting = false; // 是否正在互動
const interactionDistance = 100; // 觸發互動的距離
let resetButton; // 重置按鈕

// 測驗相關變數
let table;
let currentQuestion = null;
let filteredQuestions = []; // 儲存篩選後的題目
let mathTable; // 數學測驗卷
let filteredMathQuestions = []; // 儲存篩選後的數學題目
let currentInteractingCharacter = null; // 目前正在互動的角色

// 遊戲狀態變數
let gameState = 'START'; // 'START', 'PLAYING'
let easyButton, hardButton, menuButton;
let restartButton, titleButton; // Game Over 畫面按鈕
let currentDifficulty = 'easy'; // 記錄目前的難易度

// 計時器變數
let timeLimit = 10; // 限制 10 秒
let timeLeft = 0;
let lastTimeCheck = 0;
let isTimerRunning = false;

// 分數變數
let score = 0;
let scoreScale = 1;

// 生命值變數
let maxHealth = 3;
let health = maxHealth;
let consecutiveCorrect = 0; // 連續答對計數

// 粒子系統變數
let particles = [];

// 畫面震動變數
let shakeDuration = 0;
let shakeIntensity = 0;

const charScale = 1.5; // 角色縮放比例

// 在 setup() 之前執行，用來預載入圖片等資源
function preload() {
  walkSpriteSheet = loadImage('1/走路/合併.png');
  jumpSpriteSheet = loadImage('1/跳/合併.png');
  headbuttSpriteSheet = loadImage('1/頭頂/合併.png');
  newCharacterSpriteSheet = loadImage('2/走路/合併.png');
  punchSpriteSheet = loadImage('3/出拳/合併.png');
  punchJumpSpriteSheet = loadImage('3/跳/合併.png');
  runSpriteSheet = loadImage('4/奔跑/合併.png');
  attackSpriteSheet = loadImage('5/出招/合併.png');
  bgImage = loadImage('背景.png');
  bgImage2 = loadImage('背景2.png');
  bgImage3 = loadImage('背景3.png');
  // 載入 CSV 測驗卷
  table = loadTable('questions.csv', 'csv', 'header');
  // 載入數學 CSV 測驗卷
  mathTable = loadTable('math_questions.csv', 'csv', 'header');
}
  

function setup() {
  // 建立一個全視窗的畫布
  createCanvas(windowWidth, windowHeight);

  // 計算所有動畫單一畫格的寬度
  walkFrameWidth = walkSpriteWidth / walkFrames;
  jumpFrameWidth = jumpSpriteWidth / jumpFrames;
  headbuttFrameWidth = headbuttSpriteWidth / headbuttFrames;
  newCharacterFrameWidth = newCharacterSpriteWidth / newCharacterFrames;
  punchFrameWidth = punchSpriteWidth / punchFrames;
  punchJumpFrameWidth = punchJumpSpriteWidth / punchJumpFrames;
  runFrameWidth = runSpriteWidth / runFrames;
  attackFrameWidth = attackSpriteWidth / attackFrames;

  // 初始化角色位置
  character.x = windowWidth / 2;
  character.y = windowHeight / 2 + 250;

  // 初始化新角色的位置，使其固定在原角色的左邊
  newCharacter.x = character.x - 300;
  newCharacter.y = character.y;

  // 初始化拳擊角色的位置，使其固定在角色2的右邊
  punchCharacter.x = newCharacter.x + 600;
  punchCharacter.y = newCharacter.y;

  // 初始化奔跑角色的位置，使其固定在角色1的左邊 (比角色2更左邊)
  runCharacter.x = character.x - 600;
  runCharacter.y = character.y;

  // 初始化出招角色的位置，使其固定在角色3 (punchCharacter) 的右邊
  attackCharacter.x = punchCharacter.x + 300;
  attackCharacter.y = punchCharacter.y;

  // 建立文字輸入框並隱藏
  inputElement = createInput();
  inputElement.size(200); // 設定寬度
  inputElement.style('font-size', '24px'); // 加大字體
  inputElement.style('color', '#ffffff'); // 白色文字
  inputElement.style('background-color', 'rgba(0, 0, 0, 0.5)'); // 半透明黑色背景
  inputElement.style('border', '2px solid #00ffff'); // 青色邊框 (科技感)
  inputElement.style('border-radius', '5px'); // 圓角
  inputElement.style('padding', '5px 10px'); // 內距
  inputElement.style('outline', 'none'); // 移除聚焦時的黑框
  inputElement.style('font-family', 'monospace'); // 等寬字體更有遊戲感
  inputElement.hide();

  // 建立重置按鈕
  resetButton = createButton('重置分數');
  resetButton.position(20, 130); // 設定位置在生命值下方
  // 美化按鈕樣式
  resetButton.style('background-color', '#e74c3c'); // 鮮豔的紅色背景
  resetButton.style('color', 'white'); // 白色文字
  resetButton.style('border', 'none'); // 去除預設邊框
  resetButton.style('padding', '10px 20px'); // 增加內距讓按鈕變大
  resetButton.style('border-radius', '10px'); // 圓角
  resetButton.style('font-size', '16px'); // 字體大小
  resetButton.style('font-weight', 'bold'); // 粗體
  resetButton.style('cursor', 'pointer'); // 滑鼠移上去變手型
  resetButton.style('box-shadow', '0 4px #c0392b'); // 底部深色陰影造成立體感
  resetButton.mousePressed(resetGame);
  resetButton.hide(); // 初始隱藏

  // 建立回主選單按鈕
  menuButton = createButton('回主選單');
  menuButton.position(20, 190); // 設定位置在重置按鈕下方
  menuButton.style('background-color', '#3498db');
  menuButton.style('color', 'white');
  menuButton.style('border', 'none');
  menuButton.style('padding', '10px 20px');
  menuButton.style('border-radius', '10px');
  menuButton.style('font-size', '16px');
  menuButton.style('font-weight', 'bold');
  menuButton.style('cursor', 'pointer');
  menuButton.style('box-shadow', '0 4px #2980b9');
  menuButton.mousePressed(goToMenu);
  menuButton.hide(); // 初始隱藏

  // 建立難易度選擇按鈕
  easyButton = createButton('簡單模式 (Easy)');
  easyButton.position(windowWidth / 2 - 150, windowHeight / 2 - 20);
  easyButton.size(300, 50);
  easyButton.style('font-size', '20px');
  easyButton.style('background-color', '#2ecc71');
  easyButton.style('color', 'white');
  easyButton.style('border', 'none');
  easyButton.style('border-radius', '10px');
  easyButton.style('cursor', 'pointer');
  easyButton.mousePressed(() => startGame('easy'));

  hardButton = createButton('困難模式 (Hard)');
  hardButton.position(windowWidth / 2 - 150, windowHeight / 2 + 50);
  hardButton.size(300, 50);
  hardButton.style('font-size', '20px');
  hardButton.style('background-color', '#e74c3c');
  hardButton.style('color', 'white');
  hardButton.style('border', 'none');
  hardButton.style('border-radius', '10px');
  hardButton.style('cursor', 'pointer');
  hardButton.mousePressed(() => startGame('hard'));

  // 建立 Game Over 畫面的按鈕
  restartButton = createButton('重新挑戰');
  restartButton.position(windowWidth / 2 - 150, windowHeight / 2 + 100); // 往下移
  restartButton.size(300, 50);
  restartButton.style('font-size', '20px');
  restartButton.style('background-color', '#2ecc71');
  restartButton.style('color', 'white');
  restartButton.style('border', 'none');
  restartButton.style('border-radius', '10px');
  restartButton.style('cursor', 'pointer');
  restartButton.mousePressed(restartGame);
  restartButton.hide();

  titleButton = createButton('回主選單');
  titleButton.position(windowWidth / 2 - 150, windowHeight / 2 + 170); // 往下移
  titleButton.size(300, 50);
  titleButton.style('font-size', '20px');
  titleButton.style('background-color', '#3498db');
  titleButton.style('color', 'white');
  titleButton.style('border', 'none');
  titleButton.style('border-radius', '10px');
  titleButton.style('cursor', 'pointer');
  titleButton.mousePressed(goToMenu);
  titleButton.hide();

  // 設定動畫播放速度
  frameRate(15); // 稍微降低幀率讓動畫節奏更清晰

  currentBgImg = bgImage; // 初始化背景

}

function draw() {
  // --- 畫面震動邏輯 ---
  let shakeX = 0;
  let shakeY = 0;
  if (shakeDuration > 0) {
    shakeX = random(-shakeIntensity, shakeIntensity);
    shakeY = random(-shakeIntensity, shakeIntensity);
    shakeDuration--;
  }

  push(); // 開始震動變形
  translate(shakeX, shakeY);

  background(0); // 清除背景
  
  // --- 背景顯示邏輯 ---
  let desiredBg;
  if (gameState === 'START') {
    desiredBg = bgImage;
  } else if (currentDifficulty === 'easy') {
    desiredBg = bgImage2;
  } else {
    desiredBg = bgImage3;
  }

  // 檢查是否需要切換背景
  if (desiredBg !== currentBgImg) {
    if (nextBgImg !== desiredBg) {
      nextBgImg = desiredBg;
      bgAlpha = 0;
    }
  } else {
    nextBgImg = null; // 如果目標背景就是當前背景，取消轉場
  }

  // 繪製當前背景
  if (currentBgImg) image(currentBgImg, 0, 0, windowWidth, windowHeight);

  // 繪製轉場背景 (淡入效果)
  if (nextBgImg) {
    bgAlpha += 15; // 轉場速度
    if (bgAlpha > 255) bgAlpha = 255;
    push();
    tint(255, bgAlpha);
    image(nextBgImg, 0, 0, windowWidth, windowHeight);
    pop();
    // 轉場結束
    if (bgAlpha >= 255) {
      currentBgImg = nextBgImg;
      nextBgImg = null;
    }
  }

  // 如果是開始畫面，顯示標題與按鈕，不執行遊戲邏輯
  if (gameState === 'START') {
    push();
    textAlign(CENTER, CENTER);
    textSize(60);
    fill(255);
    stroke(0);
    strokeWeight(5);
    text("問答大冒險", windowWidth / 2, windowHeight / 2 - 150);
    textSize(30);
    text("請選擇難易度開始遊戲", windowWidth / 2, windowHeight / 2 - 80);

    pop();
    pop(); // 結束震動變形
    return;
  }

  // 如果是遊戲結束畫面
  if (gameState === 'GAME_OVER') {
    push();
    textAlign(CENTER, CENTER);
    textSize(60);
    fill(255, 0, 0);
    stroke(0);
    strokeWeight(5);
    text("遊戲結束", windowWidth / 2, windowHeight / 2 - 100);
    
    textSize(40);
    fill(255);
    text("最終分數: " + score, windowWidth / 2, windowHeight / 2 - 20);
    pop();
    pop(); // 結束震動變形
    return;
  }

  // --- 繪製新角色 ---
  push();
  // 使用新角色自己的座標來定位
  translate(newCharacter.x, newCharacter.y);

  // 判斷角色1是否在角色2的左邊
  if (character.x < newCharacter.x) {
    newCharacter.facingDirection = -1; // 朝左
  } else {
    newCharacter.facingDirection = 1; // 朝右
  }
  scale(newCharacter.facingDirection * charScale, charScale); // 根據方向翻轉並縮放

  let currentNewCharacterFrame = floor(frameCount / 2) % newCharacterFrames;

  // 如果在互動中，顯示對話
  if (isInteracting && currentInteractingCharacter === newCharacter && newCharacter.dialogue) {
    push();
    scale(newCharacter.facingDirection, 1); // 修正文字方向，抵銷角色的翻轉
    // --- 繪製對話框 ---
    const padding = 10;
    const textContent = newCharacter.dialogue;
    const boxWidth = textWidth(textContent) + padding * 2;
    const boxHeight = 25 + padding; // 假設文字高度約25
    const boxY = -newCharacterSpriteHeight / 2 - boxHeight / 2 - 5;

    rectMode(CENTER);
    fill('#e9edc9'); // 方框背景色
    noStroke();
    rect(0, boxY, boxWidth, boxHeight);

    // --- 繪製文字 ---
    fill(0); // 文字顏色
    textAlign(CENTER);
    text(textContent, 0, boxY + 5); // 調整文字Y軸以在方框內置中
    pop();
  }

  image(newCharacterSpriteSheet, -newCharacterFrameWidth / 2, -newCharacterSpriteHeight / 2, newCharacterFrameWidth, newCharacterSpriteHeight, currentNewCharacterFrame * newCharacterFrameWidth, 0, newCharacterFrameWidth, newCharacterSpriteHeight);
  pop();

  // --- 繪製拳擊角色 ---
  push();
  translate(punchCharacter.x, punchCharacter.y);
  scale(charScale, charScale); // 縮放
  
  // 顯示提示對話框
  if (punchCharacter.dialogue) {
    push();
    textSize(16); // 設定文字大小
    const padding = 10;
    const textContent = punchCharacter.dialogue;
    const boxWidth = textWidth(textContent) + padding * 2;
    const boxHeight = 30 + padding; 
    // 顯示在角色上方
    const boxY = -punchJumpSpriteHeight / 2 - boxHeight / 2 - 10;

    // --- 漫畫風格對話氣泡 ---
    fill(255); // 白色背景
    stroke(0); // 黑色邊框
    strokeWeight(2);

    let bX = -boxWidth / 2;
    let bY = boxY - boxHeight / 2;
    let bW = boxWidth;
    let bH = boxHeight;
    let r = 10; // 圓角半徑

    beginShape();
    vertex(bX + r, bY);
    vertex(bX + bW - r, bY);
    quadraticVertex(bX + bW, bY, bX + bW, bY + r);
    vertex(bX + bW, bY + bH - r);
    quadraticVertex(bX + bW, bY + bH, bX + bW - r, bY + bH);
    vertex(10, bY + bH); // 尾巴右側
    vertex(0, bY + bH + 15); // 尾巴尖端 (指向角色)
    vertex(-10, bY + bH); // 尾巴左側
    vertex(bX + r, bY + bH);
    quadraticVertex(bX, bY + bH, bX, bY + bH - r);
    vertex(bX, bY + r);
    quadraticVertex(bX, bY, bX + r, bY);
    endShape(CLOSE);

    fill(0); // 黑色文字
    noStroke();
    textAlign(CENTER, CENTER);
    text(textContent, 0, boxY); 
    pop();
  }

  if (punchCharacter.isJumping) {
    image(punchJumpSpriteSheet, -punchJumpFrameWidth / 2, -punchJumpSpriteHeight / 2, punchJumpFrameWidth, punchJumpSpriteHeight, punchCharacter.jumpFrame * punchJumpFrameWidth, 0, punchJumpFrameWidth, punchJumpSpriteHeight);
    
    if (frameCount % 2 === 0) {
        punchCharacter.jumpFrame++;
        if (punchCharacter.jumpFrame >= punchJumpFrames) {
            punchCharacter.isJumping = false;
            punchCharacter.jumpFrame = 0;
        }
    }
  } else {
    // 播放原本的動畫
    let currentPunchFrame = floor(frameCount / 2) % punchFrames;
    image(punchSpriteSheet, -punchFrameWidth / 2, -punchSpriteHeight / 2, punchFrameWidth, punchSpriteHeight, currentPunchFrame * punchFrameWidth, 0, punchFrameWidth, punchSpriteHeight);
  }
  pop();

  // --- 繪製奔跑角色 ---
  push();
  translate(runCharacter.x, runCharacter.y);
  scale(charScale, charScale); // 縮放

  // 如果在互動中，顯示對話 (角色4)
  if (isInteracting && currentInteractingCharacter === runCharacter && runCharacter.dialogue) {
    push();
    // --- 繪製對話框 ---
    const padding = 10;
    const textContent = runCharacter.dialogue;
    const boxWidth = textWidth(textContent) + padding * 2;
    const boxHeight = 25 + padding;
    const boxY = -runSpriteHeight / 2 - boxHeight / 2 - 5;

    rectMode(CENTER);
    fill('#b3e5fc'); // 改為淡藍色背景，與角色2區分
    noStroke();
    rect(0, boxY, boxWidth, boxHeight);

    fill(0); // 文字顏色
    textAlign(CENTER);
    text(textContent, 0, boxY + 5);
    pop();
  }

  // 播放動畫
  let currentRunFrame = floor(frameCount / 2) % runFrames;
  image(runSpriteSheet, -runFrameWidth / 2, -runSpriteHeight / 2, runFrameWidth, runSpriteHeight, currentRunFrame * runFrameWidth, 0, runFrameWidth, runSpriteHeight);
  pop();

  // --- 繪製出招角色 ---
  push();
  translate(attackCharacter.x, attackCharacter.y);
  scale(charScale, charScale); // 縮放
  
  if (attackCharacter.isAttacking) {
    image(attackSpriteSheet, -attackFrameWidth / 2, -attackSpriteHeight / 2, attackFrameWidth, attackSpriteHeight, attackCharacter.attackFrame * attackFrameWidth, 0, attackFrameWidth, attackSpriteHeight);
    if (frameCount % 2 === 0) {
      attackCharacter.attackFrame++;
      // 循環播放動畫
      attackCharacter.attackFrame = attackCharacter.attackFrame % attackFrames;
    }
  }
  pop();

  if (character.isJumping) {
    // --- 跳躍動畫 ---
    push(); // 保存當前的繪圖狀態
    translate(character.x, character.y); // 將原點移動到角色位置
    scale(character.jumpDirection * charScale, charScale); // 根據方向翻轉X軸並縮放

    // 繪製跳躍動畫的當前畫格
    image(jumpSpriteSheet, -jumpFrameWidth / 2, -jumpSpriteHeight / 2, jumpFrameWidth, jumpSpriteHeight, character.jumpFrame * jumpFrameWidth, 0, jumpFrameWidth, jumpSpriteHeight);
    pop(); // 恢復繪圖狀態

    // 更新跳躍動畫的畫格
    if (frameCount % 3 === 0) { // 每3個 draw() 迴圈更新一次跳躍畫格
      character.jumpFrame++;
      character.x += character.jumpSpeed * character.jumpDirection; // 移動角色

      // 如果跳躍動畫結束
      if (character.jumpFrame >= jumpFrames) {
        character.isJumping = false; // 結束跳躍狀態
        character.jumpFrame = 0; // 重置跳躍畫格
      }
    }
  } else if (character.isHeadbutting) {
    // --- 頭頂動畫 ---
    push();
    translate(character.x, character.y);
    scale(character.facingDirection * charScale, charScale); // 根據角色朝向翻轉並縮放

    // 繪製頭頂動畫的當前畫格
    image(headbuttSpriteSheet, -headbuttFrameWidth / 2, -headbuttSpriteHeight / 2, headbuttFrameWidth, headbuttSpriteHeight, character.headbuttFrame * headbuttFrameWidth, 0, headbuttFrameWidth, headbuttSpriteHeight);
    pop();

    // 更新頭頂動畫畫格與位置
    if (frameCount % 2 === 0) { // 每2個 draw() 迴圈更新一次
      // 動畫前半段往上，後半段往下
      if (character.headbuttFrame < headbuttFrames / 2) {
        character.y -= 10; // 向上移動
      } else {
        character.y += 10; // 向下移動
      }

      character.headbuttFrame++;

      // 如果頭頂動畫結束
      if (character.headbuttFrame >= headbuttFrames) {
        character.isHeadbutting = false; // 結束頭頂狀態
        character.headbuttFrame = 0; // 重置畫格
        character.y = character.originalY; // 確保回到原始高度
      }
    }
  } else {
    // --- 走路動畫 (原地) ---
    push();
    translate(character.x, character.y);
    scale(character.facingDirection * charScale, charScale); // 根據角色朝向翻轉並縮放
    let currentWalkFrame = floor(frameCount / 2) % walkFrames;
    image(walkSpriteSheet, -walkFrameWidth / 2, -walkSpriteHeight / 2, walkFrameWidth, walkSpriteHeight, currentWalkFrame * walkFrameWidth, 0, walkFrameWidth, walkSpriteHeight);
    pop();
  }

  // --- 互動邏輯 (移至最後以確保 UI 繪製在最上層) ---
  handleInteraction();

  // --- 顯示分數 ---
  displayScore();

  // --- 顯示生命值 ---
  displayHealth();

  // --- 粒子特效 ---
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].show();
    if (particles[i].finished()) {
      particles.splice(i, 1);
    }
  }

  pop(); // 結束震動變形 (對應 draw 開頭的 push)
}

// 當鍵盤按下時觸發
function keyPressed() {
  // 如果角色不在任何動作中，才允許觸發新動作
  if (!character.isJumping && !character.isHeadbutting) {
    if (keyCode === RIGHT_ARROW) {
      character.isJumping = true;
      character.jumpDirection = 1; // 向右
      character.facingDirection = 1;
    } else if (keyCode === LEFT_ARROW) {
      character.isJumping = true;
      character.jumpDirection = -1; // 向左
      character.facingDirection = -1;
    } else if (keyCode === UP_ARROW) {
      character.isHeadbutting = true;
      character.originalY = character.y; // 儲存原始 Y 位置
    }
  }

  // 如果在互動中按下 Enter
  if (isInteracting && keyCode === ENTER) {
    const userInput = inputElement.value();
    
    if (currentQuestion) {
      if (userInput === currentQuestion.answer) {
        score++; // 答對加分
        scoreScale = 1.5; // 設定放大倍率，觸發動畫
        createExplosion(windowWidth / 2, windowHeight / 2); // 觸發粒子特效
        isTimerRunning = false; // 停止計時

        // 角色5 出招
        attackCharacter.isAttacking = true;
        attackCharacter.attackFrame = 0;

        // 觸發畫面震動
        shakeDuration = 10; // 持續 10 幀
        shakeIntensity = 10; // 震動強度 10 像素
        
        consecutiveCorrect++;
        if (consecutiveCorrect === 3) {
          if (health < maxHealth) {
            health++;
            currentInteractingCharacter.dialogue = "連續答對三題！回復生命！";
          } else {
            currentInteractingCharacter.dialogue = "連續答對三題！太強了！";
          }
          consecutiveCorrect = 0;
        } else {
          currentInteractingCharacter.dialogue = currentQuestion.correctFeedback;
        }

        // 答對後，等待 1 秒後隨機切換到下一題
        setTimeout(() => {
          if (isInteracting) {
            pickRandomQuestion();
          }
        }, 1000);
      } else {
        
        consecutiveCorrect = 0; // 答錯重置連續答對計數
        
        // 角色3 給出提示並跳躍
        if (currentQuestion && currentQuestion.hint) {
          punchCharacter.dialogue = "提示: " + currentQuestion.hint;
          punchCharacter.isJumping = true;
          punchCharacter.jumpFrame = 0;
          // 3秒後清除提示
          setTimeout(() => {
            punchCharacter.dialogue = "";
          }, 3000);
        }

        // 根據難度扣血
        if (currentDifficulty === 'hard') {
          health -= 2; // 困難模式扣 2 滴血
        } else {
          health--; // 簡單模式扣 1 滴血
        }
        
        if (health <= 0) {
          gameOver();
        } else {
          currentInteractingCharacter.dialogue = currentQuestion.incorrectFeedback;
        }
      }
    }
    
    inputElement.value(''); // 清空輸入框
  }
}

// 當瀏覽器視窗大小改變時，自動調整畫布大小
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // 如果不在任何動作中，將角色重新置中
  if (!character.isJumping && !character.isHeadbutting) {
      character.x = windowWidth / 2;
      character.y = windowHeight / 2 + 250;
      newCharacter.x = character.x - 300;
      newCharacter.y = character.y;
      punchCharacter.x = newCharacter.x + 600;
      punchCharacter.y = newCharacter.y;
      runCharacter.x = character.x - 600;
      runCharacter.y = character.y;
      attackCharacter.x = punchCharacter.x + 300;
      attackCharacter.y = punchCharacter.y;
  }
  
  // 調整按鈕位置
  if (gameState === 'START') {
    easyButton.position(windowWidth / 2 - 150, windowHeight / 2 - 20);
    hardButton.position(windowWidth / 2 - 150, windowHeight / 2 + 50);
  }
  if (gameState === 'GAME_OVER') {
    restartButton.position(windowWidth / 2 - 150, windowHeight / 2 + 100);
    titleButton.position(windowWidth / 2 - 150, windowHeight / 2 + 170);
  }
  
  // 更新左上角按鈕位置
  resetButton.position(20, 130);
  menuButton.position(20, 190);
}

function handleInteraction() {
  // 計算兩個角色之間的距離
  let d1 = dist(character.x, character.y, newCharacter.x, newCharacter.y);
  let d2 = dist(character.x, character.y, runCharacter.x, runCharacter.y);

  let target = null;
  if (d1 < interactionDistance) {
    target = newCharacter;
  } else if (d2 < interactionDistance) {
    target = runCharacter;
  }

  // 如果靠近且尚未互動
  if (target && !isInteracting) {
    isInteracting = true;
    currentInteractingCharacter = target;
    pickRandomQuestion(); // 隨機抽題
    inputElement.show();
  } 
  // 如果遠離了，就結束互動
  else if (!target && isInteracting) {
    isInteracting = false;
    if (currentInteractingCharacter) {
      currentInteractingCharacter.dialogue = ""; // 清空對話
    }
    currentInteractingCharacter = null;
  }

  // 更新互動介面狀態
  if (isInteracting) {
    // 定義 UI 參數
    const labelText = "請輸入答案:";
    const padding = 15;
    const boxHeight = 60;
    
    push();
    textSize(24);
    textStyle(BOLD);
    const labelWidth = textWidth(labelText);
    const inputWidth = 230; // 包含 padding/border 的估算寬度
    const totalWidth = labelWidth + inputWidth + padding * 3;
    const boxX = character.x - totalWidth / 2;
    const boxY = character.y - walkSpriteHeight / 2 - 200;

    fill(0, 220); // 深色背景
    stroke('#00ffff'); // 青色邊框
    strokeWeight(3);
    rect(boxX, boxY, totalWidth, boxHeight, 10); // 圓角矩形
    
    fill('#00ffff'); // 青色文字
    noStroke();
    textAlign(LEFT, CENTER);
    text(labelText, boxX + padding, boxY + boxHeight / 2);
    pop();

    // 將輸入框定位
    inputElement.position(boxX + labelWidth + padding * 2, boxY + (boxHeight - 40) / 2); // 40 是輸入框大約的高度

    // --- 顯示倒數計時器 (進度條) ---
    push();
    const barWidth = 200;
    const barHeight = 15;
    const barX = character.x - barWidth / 2;
    const barY = boxY - 25; // 顯示在輸入框上方

    // 計算顯示的時間 (平滑過渡)
    let displayTime = timeLeft;
    if (isTimerRunning) {
      let elapsed = millis() - lastTimeCheck;
      displayTime = timeLeft - (elapsed / 1000);
    }
    displayTime = constrain(displayTime, 0, timeLimit);

    // 繪製背景
    fill(50);
    stroke(255);
    strokeWeight(2);
    rect(barX, barY, barWidth, barHeight, 10); // 圓角矩形

    // 繪製進度
    let currentBarWidth = map(displayTime, 0, timeLimit, 0, barWidth);
    
    let showBar = true;
    if (displayTime <= 3) {
      fill('#e74c3c'); // 紅色 (危險)
      // 讓進度條閃爍 (每 10 幀切換一次顯示狀態)
      if (frameCount % 10 < 5) {
        showBar = false;
      }
    } else {
      fill('#2ecc71'); // 綠色 (安全)
    }
    noStroke();
    if (currentBarWidth > 0 && showBar) {
      rect(barX, barY, currentBarWidth, barHeight, 10);
    }
    pop();

    // --- 計時邏輯 ---
    if (isTimerRunning && millis() - lastTimeCheck > 1000) {
      timeLeft--;
      lastTimeCheck = millis();
      if (timeLeft <= 0) {
        handleTimeout();
      }
    }
  } else {
    inputElement.hide();
  }
}

// 隨機抽取題目的函式
function pickRandomQuestion() {
  attackCharacter.isAttacking = false; // 停止出招動畫並隱藏角色
  let questionsSource = [];
  if (currentInteractingCharacter === newCharacter) {
    questionsSource = filteredQuestions;
  } else if (currentInteractingCharacter === runCharacter) {
    questionsSource = filteredMathQuestions;
  }

  if (questionsSource.length > 0) {
    let r = floor(random(questionsSource.length));
    let row = questionsSource[r];
    currentQuestion = {
      question: row.getString('question').trim(),
      answer: row.getString('answer').trim(),
      correctFeedback: row.getString('correct_feedback').trim(),
      incorrectFeedback: row.getString('incorrect_feedback').trim(),
      hint: row.getString('hint').trim()
    };
    currentInteractingCharacter.dialogue = currentQuestion.question;
    // 重置計時器
    timeLeft = timeLimit;
    isTimerRunning = true;
    lastTimeCheck = millis();
  }
}

// 顯示分數的函式
function displayScore() {
  push();
  textSize(32);
  textStyle(BOLD); // 設定為粗體
  
  const x = 20;
  const y = 20;
  const boxHeight = 40; 
  const padding = 10;
  
  // 繪製標籤
  fill(255);
  noStroke();
  textAlign(LEFT, CENTER);
  text("分數:", x, y + boxHeight / 2);
  const labelWidth = textWidth("分數:");
  
  // 計算分數方塊位置與寬度
  const scoreX = x + labelWidth + padding;
  const scoreStr = str(score);
  const textW = textWidth(scoreStr);
  const boxWidth = max(60, textW + 30); // 最小寬度
  
  // 繪製外框 (空能量格風格)
  stroke(255);
  strokeWeight(2);
  fill(50, 150); // 半透明深色背景
  rect(scoreX, y, boxWidth, boxHeight, 5); // 圓角矩形
  
  // 繪製內部填充 (實心能量風格)
  noStroke();
  fill('#0984e3'); // 科技藍
  rect(scoreX + 4, y + 4, boxWidth - 8, boxHeight - 8, 3);
  
  // 增加高光質感
  fill(255, 100);
  rect(scoreX + 4, y + 4, boxWidth - 8, (boxHeight - 8) / 2, 3);
  
  // 更新縮放比例 (平滑過渡回 1)
  scoreScale = lerp(scoreScale, 1, 0.2);

  // 繪製分數數值
  push();
  translate(scoreX + boxWidth / 2, y + boxHeight / 2);
  scale(scoreScale);
  fill(255);
  textAlign(CENTER, CENTER);
  text(scoreStr, 0, 0);
  pop();
  
  pop();
}

// 重置遊戲狀態
function resetGame() {
  score = 0;
  scoreScale = 1;
  health = maxHealth; // 重置生命值
  consecutiveCorrect = 0; // 重置連續答對計數
  isTimerRunning = false;
  attackCharacter.isAttacking = false; // 重置出招狀態
  if (isInteracting) {
    pickRandomQuestion();
    inputElement.show(); // 確保輸入框顯示
    inputElement.value('');
  }
}

// 開始遊戲
function startGame(difficulty) {
  currentDifficulty = difficulty; // 設定目前難度
  filteredQuestions = [];
  filteredMathQuestions = [];
  // 根據難度篩選題目
  for (let i = 0; i < table.getRowCount(); i++) {
    let row = table.getRow(i);
    if (row.getString('difficulty') === difficulty) {
      filteredQuestions.push(row);
    }
  }
  for (let i = 0; i < mathTable.getRowCount(); i++) {
    let row = mathTable.getRow(i);
    if (row.getString('difficulty') === difficulty) {
      filteredMathQuestions.push(row);
    }
  }
  
  gameState = 'PLAYING';
  easyButton.hide();
  hardButton.hide();
  resetButton.show();
  menuButton.show();
  resetGame();
}

// 回到主選單
function goToMenu() {
  gameState = 'START';
  easyButton.show();
  hardButton.show();
  resetButton.hide();
  menuButton.hide();
  restartButton.hide();
  titleButton.hide();
  inputElement.hide();
  newCharacter.dialogue = "";
  runCharacter.dialogue = "";
  isInteracting = false;
}

// 處理時間到的函式
function handleTimeout() {
  isTimerRunning = false;
  consecutiveCorrect = 0; // 時間到重置連續答對計數
  health--; // 時間到扣血
  
  if (health <= 0) {
    gameOver();
  } else {
    currentInteractingCharacter.dialogue = "時間到！答案是: " + currentQuestion.answer;
    setTimeout(() => {
      if (isInteracting && health > 0) {
        pickRandomQuestion();
      }
    }, 2000); // 顯示答案 2 秒後換下一題
  }
}

// 顯示生命值的函式
function displayHealth() {
  push();
  textSize(32);
  textStyle(BOLD);
  fill(255);
  stroke(0);
  strokeWeight(2);
  textAlign(LEFT, CENTER);
  
  const x = 20;
  const y = 80;
  // 改為能量格樣式
  const cellWidth = 40;
  const cellHeight = 30;
  const spacing = 10;

  text("生命:", x, y + cellHeight / 2);
  const labelW = textWidth("生命:") + 10;

  for (let i = 0; i < maxHealth; i++) {
    let cellX = x + labelW + i * (cellWidth + spacing);
    
    // 繪製外框 (空能量格)
    stroke(255);
    strokeWeight(2);
    fill(50, 150); // 半透明深色背景
    rect(cellX, y, cellWidth, cellHeight, 5); // 圓角矩形

    // 繪製填充 (實心能量)
    if (i < health) {
      noStroke();
      // 根據剩餘血量變色
      if (health <= 1) fill('#ff4757'); // 危險紅
      else fill('#2ed573'); // 安全綠
      
      // 內縮填充
      rect(cellX + 4, y + 4, cellWidth - 8, cellHeight - 8, 3);
      
      // 增加高光質感
      fill(255, 100);
      rect(cellX + 4, y + 4, cellWidth - 8, (cellHeight - 8) / 2, 3);
    }
  }
  pop();
}

// 遊戲結束處理
function gameOver() {
  gameState = 'GAME_OVER';
  inputElement.hide();
  resetButton.hide();
  menuButton.hide();
  restartButton.show();
  titleButton.show();
  isTimerRunning = false;
}

// 重新開始遊戲
function restartGame() {
  resetGame();
  gameState = 'PLAYING';
  restartButton.hide();
  titleButton.hide();
  resetButton.show();
  menuButton.show();
}

// 產生爆炸效果
function createExplosion(x, y) {
  for (let i = 0; i < 60; i++) {
    particles.push(new Particle(x, y));
  }
}

// 粒子類別
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = random(-8, 8);
    this.vy = random(-8, 8);
    this.alpha = 255;
    this.color = [random(100, 255), random(100, 255), random(100, 255)]; // 明亮的顏色
    this.size = random(5, 12);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.2; // 重力效果
    this.alpha -= 5; // 漸漸消失
  }

  show() {
    noStroke();
    fill(this.color[0], this.color[1], this.color[2], this.alpha);
    ellipse(this.x, this.y, this.size);
  }

  finished() {
    return this.alpha < 0;
  }
}

//==============================
// GALAXY SURVIVOR - VERSION 1.0
//==============================

// Canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
//==============================
// SOUND
//==============================

const shootSound = new Audio("audio/shoot.mp3");
const hitSound = new Audio("audio/hit.mp3");
const levelSound = new Audio("audio/levelup.mp3");
const gameOverSound = new Audio("audio/gameover.mp3");
const bgm = new Audio("audio/bgm.mp3");

bgm.loop = true;
bgm.volume = 0.3;

// Trình duyệt chỉ cho phát nhạc sau khi người dùng tương tác
window.addEventListener("click", () => {
    
    bgm.play();
}, { once: true });

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

//==============================
// PLAYER
//==============================

const player = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    radius: 20,
    speed: 5,
    color: "#00e5ff",

    hp: 100,
    maxHp: 100
};
// Loại tàu đang sử dụng
let playerShip = 1;

// 1: Tàu mặc định
// 2: Tàu chiến
// 3: Tàu tốc độ
// 4: Tàu hạng nặng
//==============================
// SCORE
//==============================

let score = 0;
//==============================
// LEVEL
//==============================

let level = 1;
let exp = 0;
let nextLevel = 100;

let specialSkill = false;
let fireBulletSkill = false;
let skillLevel = 0;

let specialSkills = [
    {
        name:"🔥 HỎA CẦU HỦY DIỆT",
        desc:"Bắn thêm đạn lửa",
        type:1
    },
    {
        name:"⚡ TỐC ĐỘ ÁNH SÁNG",
        desc:"Tăng 50% tốc độ bắn",
        type:2
    },
    {
        name:"💀 SÁT THƯƠNG BẠO KÍCH",
        desc:"Tăng gấp đôi sát thương",
        type:3
    }
];

let currentSkills=[];
//==============================
// UPGRADE MENU
//==============================

let levelUp = false;
let upgradeType = ""; 
// normal = nâng cấp thường
// special = skill đặc biệt
const upgradeButtons = [
    {x:0,y:0,w:420,h:55,type:1},
    {x:0,y:0,w:420,h:55,type:2},
    {x:0,y:0,w:420,h:55,type:3},
    {x:0,y:0,w:420,h:55,type:4}
];
const specialButton = {
    x:0,
    y:0,
    w:420,
    h:70
};
//==============================
// GAME STATE
//==============================

let gameState = "menu";

// menu
// playing
// settings
// shop
// gameover
let finalScore = 0;
let restartButton = {
    x:0,
    y:0,
    width:260,
    height:70
};

let restartHover = false;
let clickEffect = 0;
// menu
// settings
// playing
const playButton = {
    x: 0,
    y: 0,
    width: 260,
    height: 70
};
const settingsButton = {

    x: 0,
    y: 0,
    width: 260,
    height: 70
};
const shopButton = {
    x:0,
    y:0,
    width:260,
    height:70
};
const volumeSlider = {
    x: 0,
    y: 0,
    width: 300,
    height: 8,
    value: 0.3 // Âm lượng mặc định
};
// menu
// playing
// gameover
//==============================
// STARS
//==============================

const stars = [];
let galaxyAngle = 0;

for (let i = 0; i < 200; i++) {

    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speed: Math.random() * 1 + 0.2
    });

}
//==============================
// ENEMY
//==============================

const enemies = [];
//==============================
// BOSS
//==============================

let boss = null;
let bossSpawned = false;
let bossTimerStarted = false;
function spawnBoss() {

    boss = {
        x: canvas.width / 2,
        y: -80,

        radius: 60,

        hp: 200,
        maxHp: 200,

        speed: 1.5,

        color: "#7b00ff"
    };

    bossSpawned = true;

}

function spawnEnemy() {
    if(enemies.length>100) return;

    // Không sinh quái nếu chưa vào game
   if(gameState==="menu"){

    updateStars();

    galaxyAngle += 0.002;

    return;
}

if (gameState !== "playing") return;
    const side = Math.floor(Math.random() * 4);
    let x, y;

    if (side === 0) {
        x = Math.random() * canvas.width;
        y = -30;
    }

    if (side === 1) {
        x = canvas.width + 30;
        y = Math.random() * canvas.height;
    }

    if (side === 2) {
        x = Math.random() * canvas.width;
        y = canvas.height + 30;
    }

    if (side === 3) {
        x = -30;
        y = Math.random() * canvas.height;
    }

    const type = Math.random();

    let enemy = {};

    if(type < 0.6){

        enemy={
            x,y,
            radius:18,
            speed:2,
            hp:1,
            score:10,
            color:"red"
        };

    }
    else if(type <0.9){

        enemy={
            x,y,
            radius:14,
            speed:4,
            hp:1,
            score:20,
            color:"yellow"
        };

    }
    else{

        enemy={
            x,y,
            radius:28,
            speed:1.2,
            hp:3,
            score:40,
            color:"purple"
        };

    }

    enemies.push(enemy);

}



setInterval(spawnEnemy, 1000);
function drawEnemies() {

    enemies.forEach(enemy => {

       ctx.save();

const angle = Math.atan2(
    player.y - enemy.y,
    player.x - enemy.x
);

ctx.translate(
    enemy.x,
    enemy.y + Math.sin(Date.now()*0.01 + enemy.x)*2
);
ctx.rotate(angle);
ctx.rotate(Math.sin(Date.now() * 0.01) * 0.08);

// Thân phi thuyền
ctx.fillStyle = enemy.color;

ctx.beginPath();
ctx.moveTo(18, 0);
ctx.lineTo(-15, -12);
ctx.lineTo(-8, 0);
ctx.lineTo(-15, 12);
ctx.closePath();
ctx.fill();

// Buồng lái
ctx.fillStyle = "cyan";
ctx.beginPath();
ctx.arc(2, 0, 4, 0, Math.PI * 2);
ctx.fill();
for(let i=0;i<4;i++){

    ctx.beginPath();

    ctx.fillStyle="orange";

    ctx.arc(
        -18-Math.random()*5,
        (Math.random()-0.5)*6,
        Math.random()*2+1,
        0,
        Math.PI*2
    );

    ctx.fill();

}

ctx.restore();

        // Thanh máu
        ctx.fillStyle = "black";
        ctx.fillRect(enemy.x - 15, enemy.y - 25, 30, 4);

        ctx.fillStyle = "lime";
        ctx.fillRect(
            enemy.x - 15,
            enemy.y - 25,
            30 * (enemy.hp / 3),
            4
        );

    });

}
function drawBoss(){

    if(!boss) return;

    ctx.save();

    // Boss luôn hướng về người chơi
    const angle = Math.atan2(
        player.y - boss.y,
        player.x - boss.x
    );

    ctx.translate(boss.x,boss.y);
    ctx.rotate(angle);

    // Hiệu ứng phát sáng
    ctx.shadowColor="#ff00ff";
    ctx.shadowBlur=35;

    //------------------------
    // Thân chính
    //------------------------

    const body = ctx.createLinearGradient(-70,0,70,0);

    body.addColorStop(0,"#2d004d");
    body.addColorStop(0.5,"#c000ff");
    body.addColorStop(1,"#ffffff");

    ctx.fillStyle=body;

    ctx.beginPath();

    ctx.moveTo(80,0);

    ctx.lineTo(20,-45);

    ctx.lineTo(-50,-35);

    ctx.lineTo(-80,0);

    ctx.lineTo(-50,35);

    ctx.lineTo(20,45);

    ctx.closePath();

    ctx.fill();

    //------------------------
    // Buồng lái
    //------------------------

    ctx.fillStyle="#00ffff";

    ctx.beginPath();

    ctx.ellipse(
        20,
        0,
        18,
        12,
        0,
        0,
        Math.PI*2
    );

    ctx.fill();

    //------------------------
    // Cánh trái
    //------------------------

    ctx.fillStyle="#ff00ff";

    ctx.beginPath();

    ctx.moveTo(-10,-20);

    ctx.lineTo(-55,-70);

    ctx.lineTo(-25,-18);

    ctx.closePath();

    ctx.fill();

    //------------------------
    // Cánh phải
    //------------------------

    ctx.beginPath();

    ctx.moveTo(-10,20);

    ctx.lineTo(-55,70);

    ctx.lineTo(-25,18);

    ctx.closePath();

    ctx.fill();

    //------------------------
    // Động cơ
    //------------------------

    ctx.shadowColor="orange";
    ctx.shadowBlur=30;

    ctx.fillStyle="orange";

    ctx.beginPath();

    ctx.moveTo(-80,-18);

    ctx.lineTo(-110,-8+Math.random()*8);

    ctx.lineTo(-80,-2);

    ctx.closePath();

    ctx.fill();

    ctx.beginPath();

    ctx.moveTo(-80,18);

    ctx.lineTo(-110,8-Math.random()*8);

    ctx.lineTo(-80,2);

    ctx.closePath();

    ctx.fill();

    //------------------------
    // Viền neon
    //------------------------

    ctx.shadowBlur=0;

    ctx.strokeStyle="#ff66ff";
    ctx.lineWidth=3;

    ctx.stroke();

    ctx.restore();

}
function drawBossHP(){

    if(!boss) return;

    ctx.fillStyle="black";
    ctx.fillRect(200,20,500,20);

    ctx.fillStyle="red";
    ctx.fillRect(
        200,
        20,
        500*(boss.hp/boss.maxHp),
        20
    );

}
function updateEnemies() {

    enemies.forEach(enemy => {

        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;

        const angle = Math.atan2(dy, dx);

        enemy.x += Math.cos(angle) * enemy.speed;
        enemy.y += Math.sin(angle) * enemy.speed;
        spawnEngineParticles(enemy);
        if (enemy.shooter) {

    enemy.cooldown--;

    if (enemy.cooldown <= 0) {

        const angle = Math.atan2(
            player.y - enemy.y,
            player.x - enemy.x
        );

        enemyBullets.push({
            x: enemy.x,
            y: enemy.y,
            radius: 5,
            speed: 5,
            dx: Math.cos(angle),
            dy: Math.sin(angle)
        });

        enemy.cooldown = 90; // khoảng 1.5 giây ở 60 FPS
    }

}

    });
    

}
function updateEngineParticles(){

    for(let i=engineParticles.length-1;i>=0;i--){

        const p = engineParticles[i];

        p.x += p.dx;
        p.y += p.dy;

        p.life--;

        p.size *= 0.97;

        if(p.life<=0){
            engineParticles.splice(i,1);
        }

    }

}
function spawnEngineParticles(enemy){

    const angle = Math.atan2(
        player.y - enemy.y,
        player.x - enemy.x
    );

    for(let i=0;i<2;i++){

        engineParticles.push({

            x: enemy.x - Math.cos(angle)*18,
            y: enemy.y - Math.sin(angle)*18,

            dx: -Math.cos(angle)*2 + (Math.random()-0.5),
            dy: -Math.sin(angle)*2 + (Math.random()-0.5),

            size: Math.random()*3+2,
            life: 25

        });

    }

}
function updateBoss(){

    if(!boss) return;

    const dx = player.x - boss.x;
    const dy = player.y - boss.y;

    const angle = Math.atan2(dy, dx);

    boss.x += Math.cos(angle) * boss.speed;
    boss.y += Math.sin(angle) * boss.speed;

}
function checkCollisions() {

    for (let i = enemies.length - 1; i >= 0; i--) {

        const enemy = enemies[i];

        for (let j = bullets.length - 1; j >= 0; j--) {

            const bullet = bullets[j];

            const dx = enemy.x - bullet.x;
            const dy = enemy.y - bullet.y;

            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < enemy.radius + bullet.radius) {

    

    // Tạo 15 hạt nổ
for (let k = 0; k < 15; k++) {

    particles.push({
        x: enemy.x,
        y: enemy.y,
        dx: (Math.random() - 0.5) * 8,
        dy: (Math.random() - 0.5) * 8,
        life: 30,
        radius: Math.random() * 3 + 2
    });

}

enemy.hp -= bulletDamage;
bullets.splice(j, 1);

if (enemy.hp <= 0) {
    shake = 8;

    score += enemy.score;

    // Rơi viên EXP
    expOrbs.push({
        x: enemy.x,
        y: enemy.y,
        radius: 8,
        value: 20
    });
    coins.push({
    x: enemy.x,
    y: enemy.y,
    radius: 6,
    value: 5
});
hitSound.currentTime = 0;
hitSound.play();

    enemies.splice(i,1);

}


    break;
}
        }
    }
    if(boss){

    for(let i=bullets.length-1;i>=0;i--){

        const bullet = bullets[i];

        const dx = boss.x - bullet.x;
        const dy = boss.y - bullet.y;

        const distance = Math.sqrt(dx*dx+dy*dy);

        if(distance < boss.radius + bullet.radius){

            boss.hp -= bulletDamage;

            bullets.splice(i,1);

            if(boss.hp<=0){

                score += 1000;

                boss = null;

                alert("BOSS DEFEATED!");

            }

        }

    }

}
}

function checkPlayerHit() {

    // Quái thường
    for (let i = enemies.length - 1; i >= 0; i--) {

        const enemy = enemies[i];

        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < player.radius + enemy.radius) {

            player.hp -= 10;

            enemies.splice(i, 1);

            if (player.hp <= 0) {

                gameOverSound.currentTime = 0;
                gameOverSound.play();

                finalScore = score;
                gameState = "gameover";
            }
        }
    }

    // Boss
    if (boss) {

        const dx = player.x - boss.x;
        const dy = player.y - boss.y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < player.radius + boss.radius && bossHitCooldown <= 0) {

            player.hp -= 20;

            bossHitCooldown = 30;

            if (player.hp <= 0) {

                gameOverSound.currentTime = 0;
                gameOverSound.play();

                finalScore = score;
                gameState = "gameover";
            }
        }
    }

}
function collectEXP() {

    for (let i = expOrbs.length - 1; i >= 0; i--) {

        const orb = expOrbs[i];

        const dx = player.x - orb.x;
        const dy = player.y - orb.y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < player.radius + orb.radius) {

            exp += orb.value;

            expOrbs.splice(i, 1);

        }

    }

}
function collectCoins(){

    for(let i=coins.length-1;i>=0;i--){

        const coin=coins[i];

        const dx=player.x-coin.x;
        const dy=player.y-coin.y;

        const distance=Math.sqrt(dx*dx+dy*dy);

        if(distance<player.radius+coin.radius){

            money += coin.value;

localStorage.setItem(
    "galaxyGold",
    money
);

coins.splice(i,1);

        }

    }

}
function checkLevelUp() {

    if (exp >= nextLevel) {

        exp -= nextLevel;

        level++;

        nextLevel += 50;


        player.maxHp += 20;
        player.hp = player.maxHp;


        // Mỗi 3 level chọn skill đặc biệt
        if(level % 3 === 0){

            specialSkill = true;
            levelUp = false; // không hiện nâng cấp thường

        }
        else{

            levelUp = true; // hiện nâng cấp thường

        }


        levelSound.play();

    }

}
function applySkill(skill){


    if(skill.type===1){

        bulletDamage+=3;

        console.log("Hỏa cầu");


    }


    if(skill.type===2){

        fireRate*=0.5;

        console.log("Tốc độ");


    }


    if(skill.type===3){

        bulletDamage*=2;

        console.log("Bạo kích");


    }


}
function updateStars() {

    stars.forEach(star => {

        star.y += star.speed;

        if (star.y > canvas.height) {

            star.y = 0;
            star.x = Math.random() * canvas.width;

        }

    });

}
function updateEnemyBullets() {

    for (let i = enemyBullets.length - 1; i >= 0; i--) {

        const b = enemyBullets[i];

        b.x += b.dx * b.speed;
        b.y += b.dy * b.speed;

        if (
            b.x < 0 ||
            b.x > canvas.width ||
            b.y < 0 ||
            b.y > canvas.height
        ) {
            enemyBullets.splice(i, 1);
        }
    }

}
function checkEnemyBulletHit() {

    for (let i = enemyBullets.length - 1; i >= 0; i--) {

        const b = enemyBullets[i];

        const dx = player.x - b.x;
        const dy = player.y - b.y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < player.radius + b.radius) {

            player.hp -= 10;

            enemyBullets.splice(i, 1);

            if (player.hp <= 0) {

                gameOverSound.currentTime = 0;
gameOverSound.play();

finalScore = score;
gameState = "gameover";

            }

        }

    }

}


//==============================
// KEYBOARD
//==============================

const keys = {};

window.addEventListener("keydown", (e) => {

    if (e.key === "Escape") {

        if(gameState === "settings" || gameState === "shop"){

            gameState = "menu";

        }

    }


    if (gameState !== "settings") return;


    if (e.key === "+") {
        bgm.volume = Math.min(1, bgm.volume + 0.1);
    }

    if (e.key === "-") {
        bgm.volume = Math.max(0, bgm.volume - 0.1);
    }

});

window.addEventListener("keydown", (e) => {
    keys[e.key.toLowerCase()] = true;
});
window.addEventListener("keydown",(e)=>{

    

});

window.addEventListener("keyup", (e) => {
    keys[e.key.toLowerCase()] = false;
});

let money = Number(localStorage.getItem("galaxyGold")) || 0;
//==============================
// MOUSE
//==============================

const mouse = {
    x: 0,
    y: 0
};
let draggingSlider = false;

canvas.addEventListener("mousemove", (e) => {

    mouse.x = e.clientX;
    mouse.y = e.clientY;

    if (draggingSlider) {

        volumeSlider.value =
            (mouse.x - volumeSlider.x) /
            volumeSlider.width;

        if (volumeSlider.value < 0)
            volumeSlider.value = 0;

        if (volumeSlider.value > 1)
            volumeSlider.value = 1;

        bgm.volume = volumeSlider.value;

        shootSound.volume = volumeSlider.value;
        hitSound.volume = volumeSlider.value;
        levelSound.volume = volumeSlider.value;
        gameOverSound.volume = volumeSlider.value;

    }

});
canvas.addEventListener("click", (e) => {
    if(specialSkill){

    const mx=e.clientX;
    const my=e.clientY;


    specialSkills.forEach((s,i)=>{


        let y=180+i*100;


        if(
            mx>canvas.width/2-220 &&
            mx<canvas.width/2+220 &&
            my>y &&
            my<y+70
        ){

            applySkill(s);

            specialSkill=false;

        }


    });

    return;

}
    // GAME OVER - CLICK NÚT CHƠI LẠI
if(gameState === "gameover"){

    const mx = e.clientX;
    const my = e.clientY;


    if(
        mx > restartButton.x &&
        mx < restartButton.x + restartButton.width &&
        my > restartButton.y &&
        my < restartButton.y + restartButton.height
    ){

        clickEffect = 15; // hiệu ứng rung

        restartGame();

    }

    return;
}
       
    if(levelUp){

    const mx=e.clientX;
    const my=e.clientY;

    for(const b of upgradeButtons){

        if(
            mx>b.x &&
            mx<b.x+b.w &&
            my>b.y &&
            my<b.y+b.h
        ){

            if(b.type===1){

                player.maxHp+=20;
                player.hp=player.maxHp;

            }

            if(b.type===2){

                player.speed++;

            }

            if(b.type===3){

                bulletDamage++;

            }

            if(b.type===4){

                fireRate*=0.8;

                if(fireRate<40)
                    fireRate=40;

            }

            levelUp=false;

            return;

        }

    }

}
// SHOP CLICK

if(gameState==="shop"){

const mx=e.clientX;
const my=e.clientY;

ships.forEach((ship,i)=>{

    let startX = canvas.width / 2 - ((ships.length - 1) * 250) / 2;

let x = startX + i * 250;
let y = 300;

    if(
        mx > x-90 &&
        mx < x+90 &&
        my > y-100 &&
        my < y+120
    ){


        // Nếu chưa mua
        if(!ownedShips.includes(i)){
            console.log("money =", money, typeof money);
console.log("price =", ship.price, typeof ship.price);


            if(money >= ship.price){

    console.log("Trước khi mua:", money);

    money -= ship.price;

    console.log("Sau khi mua:", money);

    ownedShips.push(i);

    localStorage.setItem(
        "ownedShips",
        JSON.stringify(ownedShips)
    );

    localStorage.setItem(
        "galaxyGold",
        money
    );

    alert("Đã mua " + ship.name);
}
            else{

                alert(
                    "Không đủ vàng!"
                );

            }


        }

        // Nếu đã mua thì chọn tàu
        else{


            currentShip=i;


            localStorage.setItem(
                "currentShip",
                currentShip
            );


            alert(
                "Đã chọn "+ship.name
            );


        }


    }

});
return;

}
    if (gameState !== "menu") return;

    const mx = e.clientX;
    const my = e.clientY;
   

    if (
        mx > playButton.x &&
        mx < playButton.x + playButton.width &&
        my > playButton.y &&
        my < playButton.y + playButton.height
    ) {

       gameState = "playing";

bgm.currentTime = 0;
bgm.play().catch(console.error);

if (!bossTimerStarted) {

    setTimeout(spawnBoss, 40000);

    bossTimerStarted = true;

}
    }
    if (
    mx > settingsButton.x &&
    mx < settingsButton.x + settingsButton.width &&
    my > settingsButton.y &&
    my < settingsButton.y + settingsButton.height
) {

    gameState = "settings";

}
if (
    mx > shopButton.x &&
    mx < shopButton.x + shopButton.width &&
    my > shopButton.y &&
    my < shopButton.y + shopButton.height
) {

    gameState = "shop";

}

});


//==============================
// BULLETS
//==============================

const bullets = [];
const enemyBullets = [];
//==============================
// AUTO FIRE
//==============================

let mouseDown = false;

let bulletSpeed = 10;
let fireRate = 150; // ms
let bulletDamage = 1;

// SPECIAL SKILL


let lastShot = 0;
//==============================
// CAMERA SHAKE
//==============================

let shake = 0;
// Độ nghiêng của phi thuyền
let shipTilt = 0;
let bossHitCooldown = 0;
//==============================
// PARTICLES
//==============================

const particles = [];
const engineParticles = [];
const playerEngineParticles = [];
//==============================
// EXP ORBS
//==============================

const expOrbs = [];
const coins = [];


//==============================
// SHIP SHOP
//==============================

const ships = [
{
    name:"Tàu Chiến Cơ Bản",
    price:0,
    color:"#00e5ff",
    owned:true
},

{
    name:"Tàu Sao Băng",
    price:10,
    color:"#ff3333",
    owned:false
},

{
    name:"Tàu Hắc Ám",
    price:15,
    color:"#9900ff",
    owned:false
},

{
    name:"Tàu Thiên Hà",
    price:20,
    color:"#00ff66",
    owned:false
}
];


// Tàu đã mua
let ownedShips = JSON.parse(
    localStorage.getItem("ownedShips")
) || [0];

// Tàu đang sử dụng
currentShip = Number(
    localStorage.getItem("currentShip")
) || 0;
function restartGame(){

    score = 0;

    level = 1;
    exp = 0;
    nextLevel = 100;

    player.hp = 100;
    player.maxHp = 100;

    enemies.length = 0;
    bullets.length = 0;
    enemyBullets.length = 0;
    particles.length = 0;
    expOrbs.length = 0;
    coins.length = 0;



    boss = null;
    bossSpawned = false;
    bossTimerStarted = false;

    finalScore = 0;

    gameState = "playing";


    // Sau 40 giây gọi lại Boss
    setTimeout(spawnBoss, 40000);

    bossTimerStarted = true;

}
canvas.addEventListener("mousedown", () => {

    // Kéo thanh âm lượng trong Settings
    if (gameState === "settings") {

        const knobX =
            volumeSlider.x +
            volumeSlider.width * volumeSlider.value;

        const knobY =
            volumeSlider.y +
            volumeSlider.height / 2;

        const dx = mouse.x - knobX;
        const dy = mouse.y - knobY;

        if (Math.sqrt(dx * dx + dy * dy) < 15) {
            draggingSlider = true;
        }

        return;
    }

    // Chỉ được bắn khi đang chơi
    if (gameState !== "playing") return;

    mouseDown = true;

});



   

canvas.addEventListener("mouseup", () => {

    draggingSlider = false;
    mouseDown = false;

});
function shoot() {

    const angle = Math.atan2(
        mouse.y - player.y,
        mouse.x - player.x
    );


    // Đạn chính
    bullets.push({
        x: player.x,
        y: player.y,
        radius: 5,
        speed: bulletSpeed,
        dx: Math.cos(angle),
        dy: Math.sin(angle),
        type:"normal"
    });


    // Skill bắn thêm đạn lửa
    if(fireBulletSkill){

        bullets.push({
            x: player.x,
            y: player.y,
            radius: 8,
            speed: bulletSpeed,
            dx: Math.cos(angle-0.25),
            dy: Math.sin(angle-0.25),
            type:"fire"
        });


        bullets.push({
            x: player.x,
            y: player.y,
            radius: 8,
            speed: bulletSpeed,
            dx: Math.cos(angle+0.25),
            dy: Math.sin(angle+0.25),
            type:"fire"
        });

    }


    shootSound.currentTime = 0;
    shootSound.play();
}
shake = 3;
function autoFire() {

    if (!mouseDown) return;

    const now = Date.now();

    if (now - lastShot > fireRate) {

        shoot();

        lastShot = now;

    }

}

function updateBullets() {

    for (let i = bullets.length - 1; i >= 0; i--) {

        const b = bullets[i];

        b.x += b.dx * b.speed;
        b.y += b.dy * b.speed;

        if (
            b.x < -20 ||
            b.x > canvas.width + 20 ||
            b.y < -20 ||
            b.y > canvas.height + 20
        ) {
            bullets.splice(i, 1);
        }
    }
}
function updateParticles() {

    for (let i = particles.length - 1; i >= 0; i--) {

        const p = particles[i];

        p.x += p.dx;
        p.y += p.dy;

        p.life--;

        if (p.life <= 0) {
            particles.splice(i, 1);
        }

    }

}
function drawShop(){

ctx.fillStyle="#050b18";
ctx.fillRect(
0,
0,
canvas.width,
canvas.height
);


ctx.fillStyle="gold";
ctx.font="50px Arial";
ctx.textAlign="center";

ctx.fillText(
"🚀 SHOP TÀU",
canvas.width/2,
80
);


ctx.fillStyle="white";
ctx.font="28px Arial";

ctx.fillText(
"💰 Gold: "+money,
canvas.width/2,
130
);




ships.forEach((ship, index) => {

let startX = canvas.width / 2 - ((ships.length - 1) * 250) / 2;

let x = startX + index * 250;
let y = 300;
// kiểm tra chuột vào ô tàu
let hover =
mouse.x > x-90 &&
mouse.x < x+90 &&
mouse.y > y-100 &&
mouse.y < y+120;


// khung tàu

if(hover){

    ctx.fillStyle="#0066aa"; // màu khi rê chuột

}
else{

    ctx.fillStyle="#111";

}

ctx.fillRect(
x-90,
y-100,
180,
220
);
if(hover){

    ctx.shadowColor="cyan";
    ctx.shadowBlur=25;

}
else{

    ctx.shadowBlur=0;

}


ctx.strokeStyle="cyan";
ctx.lineWidth=3;

ctx.strokeRect(
x-90,
y-100,
180,
220
);

ctx.shadowBlur=0;


// vẽ tàu nhỏ

ctx.save();
ctx.translate(x, y);

switch(index){

    case 0:
        drawShip1();
        break;

    case 1:
        drawShip2();
        break;

    case 2:
        drawShip3();
        break;

    case 3:
        drawShip4();
        break;
}

ctx.restore();


// kính

ctx.fillStyle="cyan";

ctx.beginPath();

ctx.arc(
15,
0,
8,
0,
Math.PI*2
);

ctx.fill();


ctx.restore();


// tên tàu

ctx.fillStyle="white";
ctx.font="20px Arial";

ctx.fillText(
ship.name,
x,
y+60
);
ctx.textAlign = "center";
ctx.textBaseline = "middle";
// Giá
ctx.fillStyle = "gold";
ctx.font = "18px Arial";
ctx.fillText(ship.price + " Gold", x, y + 90);

// Nút
ctx.font = "20px Arial";

if (currentShip === index) {

    // Đang dùng
    ctx.fillStyle = "#00cc66";
    ctx.fillRect(x - 60, y + 105, 120, 35);

    ctx.fillStyle = "white";
    ctx.fillText("ĐANG DÙNG", x, y + 122);

}
else if (ownedShips.includes(index)) {

    // Đã mua
    ctx.fillStyle = "#3399ff";
    ctx.fillRect(x - 60, y + 105, 120, 35);

    ctx.fillStyle = "white";
    ctx.fillText("ĐÃ MUA", x, y + 122);

}
else {

    // Chưa mua
    ctx.fillStyle = "#ff9933";
    ctx.fillRect(x - 60, y + 105, 120, 35);

    ctx.fillStyle = "white";
    ctx.fillText("MUA", x, y + 122);

}








});




ctx.fillStyle="white";
ctx.font="25px Arial";

ctx.fillText(
"ESC để quay lại",
canvas.width/2,
canvas.height-50
);




}



function drawBullets(){

    bullets.forEach(b=>{

        if(b.type==="fire"){
            ctx.fillStyle="orange";
            ctx.shadowColor="red";
            ctx.shadowBlur=15;
        }
        else{
            ctx.fillStyle="yellow";
            ctx.shadowBlur=0;
        }

        ctx.beginPath();

        ctx.arc(
            b.x,
            b.y,
            b.radius,
            0,
            Math.PI*2
        );

        ctx.fill();

    });

    ctx.shadowBlur=0;
}

    bullets.forEach(b => {

        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();

    });


function drawParticles() {

    particles.forEach(p => {

        ctx.fillStyle = "orange";

        ctx.globalAlpha = p.life / 30;

        ctx.beginPath();

        ctx.arc(
            p.x,
            p.y,
            p.radius,
            0,
            Math.PI * 2
        );

        ctx.fill();

    });

    ctx.globalAlpha = 1;

}
function drawEngineParticles(){

    engineParticles.forEach(p=>{

        ctx.globalAlpha = p.life/25;

        ctx.beginPath();

        ctx.fillStyle = "orange";

        ctx.arc(
            p.x,
            p.y,
            p.size,
            0,
            Math.PI*2
        );

        ctx.fill();

    });

    ctx.globalAlpha = 1;

}
function drawExpOrbs() {

    expOrbs.forEach(orb => {

        ctx.beginPath();
        ctx.fillStyle = "#00ff66";
        ctx.arc(
            orb.x,
            orb.y,
            orb.radius,
            0,
            Math.PI * 2
        );
        ctx.fill();

    });

}
function drawSpecialSkillMenu(){

    if(!specialSkill) return;


    ctx.fillStyle="rgba(0,0,0,0.9)";
    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    ctx.fillStyle="orange";
    ctx.font="50px Arial";
    ctx.textAlign="center";

    ctx.fillText(
        "SKILL ĐẶC BIỆT!",
        canvas.width/2,
        120
    );


    specialSkills.forEach((s,i)=>{


        let x = canvas.width/2 - 220;
        let y = 180 + i*100;


        ctx.fillStyle="#222";
        ctx.fillRect(
            x,
            y,
            440,
            70
        );


        ctx.strokeStyle="orange";
        ctx.strokeRect(
            x,
            y,
            440,
            70
        );


        ctx.fillStyle="white";
        ctx.font="25px Arial";


        ctx.fillText(
            s.name,
            canvas.width/2,
            y+30
        );


        ctx.font="18px Arial";

        ctx.fillText(
            s.desc,
            canvas.width/2,
            y+55
        );


    });


}
function drawCoins(){

    coins.forEach(c=>{

        ctx.beginPath();

        ctx.fillStyle="gold";

        ctx.arc(
            c.x,
            c.y,
            c.radius,
            0,
            Math.PI*2
        );

        ctx.fill();

    });

}

//==============================
// UPDATE
//==============================

function update() {
   
    // Nếu chưa bấm Play thì không cập nhật game
    if (gameState !== "playing") return;

    if(levelUp || specialSkill) return;
    if (bossHitCooldown > 0) {
    bossHitCooldown--;
}

   // Reset độ nghiêng
shipTilt *= 0.9;

// Di chuyển
if (keys["w"]) {
    player.y -= player.speed;
}

if (keys["s"]) {
    player.y += player.speed;
}

if (keys["a"]) {
    player.x -= player.speed;
    shipTilt = -0.25; // Nghiêng trái
}

if (keys["d"]) {
    player.x += player.speed;
    shipTilt = 0.25; // Nghiêng phải
}
    // Giữ trong màn hình
    player.x = Math.max(player.radius, Math.min(canvas.width - player.radius, player.x));
    player.y = Math.max(player.radius, Math.min(canvas.height - player.radius, player.y));

    updateBullets();
    updateEnemies();
    checkCollisions();
    checkPlayerHit();
    checkLevelUp();
    updateStars();
    updateParticles();
    spawnPlayerEngine();
updatePlayerEngine();
    updateEngineParticles();
    collectEXP();
    autoFire();
    updateBoss();
    collectCoins();
    updateEnemyBullets();
    checkEnemyBulletHit();
}

//==============================
// DRAW PLAYER
//==============================
//==============================
// CÁC MẪU TÀU
//==============================

function drawShip1(){

    // Thân
    ctx.fillStyle="#00e5ff";

    ctx.beginPath();
    ctx.moveTo(45,0);
    ctx.lineTo(10,-18);
    ctx.lineTo(-35,-12);
    ctx.lineTo(-25,0);
    ctx.lineTo(-35,12);
    ctx.lineTo(10,18);
    ctx.closePath();
    ctx.fill();

    // Kính
    ctx.fillStyle="white";
    ctx.beginPath();
    ctx.arc(15,0,7,0,Math.PI*2);
    ctx.fill();

    // Động cơ
    ctx.fillStyle="orange";
    ctx.fillRect(-38,-5,10,10);
}


function drawShip2(){

    ctx.fillStyle="#ff3333";

    ctx.beginPath();
    ctx.moveTo(55,0);
    ctx.lineTo(15,-22);
    ctx.lineTo(-30,-18);
    ctx.lineTo(-15,0);
    ctx.lineTo(-30,18);
    ctx.lineTo(15,22);
    ctx.closePath();
    ctx.fill();

    // Cánh
    ctx.fillStyle="#aa0000";
    ctx.fillRect(-20,-28,20,8);
    ctx.fillRect(-20,20,20,8);

    // Pháo
    ctx.fillStyle="yellow";
    ctx.fillRect(20,-3,28,6);

    // Kính
    ctx.fillStyle="white";
    ctx.beginPath();
    ctx.arc(12,0,6,0,Math.PI*2);
    ctx.fill();
}


function drawShip3(){

    ctx.fillStyle="#00ff88";

    ctx.beginPath();
    ctx.moveTo(60,0);
    ctx.lineTo(5,-12);
    ctx.lineTo(-35,-8);
    ctx.lineTo(-15,0);
    ctx.lineTo(-35,8);
    ctx.lineTo(5,12);
    ctx.closePath();
    ctx.fill();

    // Cánh
    ctx.fillStyle="#00bb66";

    ctx.beginPath();
    ctx.moveTo(-5,-20);
    ctx.lineTo(20,-8);
    ctx.lineTo(-5,-5);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(-5,20);
    ctx.lineTo(20,8);
    ctx.lineTo(-5,5);
    ctx.fill();

    // Kính
    ctx.fillStyle="cyan";
    ctx.beginPath();
    ctx.arc(18,0,6,0,Math.PI*2);
    ctx.fill();
}

function drawShip4(){

    // Thân
    ctx.fillStyle="#9933ff";
    ctx.fillRect(-35,-22,60,44);

    // Đầu tàu
    ctx.fillStyle="#ffcc00";
    ctx.beginPath();
    ctx.moveTo(25,0);
    ctx.lineTo(60,-15);
    ctx.lineTo(60,15);
    ctx.closePath();
    ctx.fill();

    // Cánh
    ctx.fillStyle="#6600cc";
    ctx.fillRect(-25,-30,20,10);
    ctx.fillRect(-25,20,20,10);

    // Kính
    ctx.fillStyle="cyan";
    ctx.beginPath();
    ctx.arc(10,0,7,0,Math.PI*2);
    ctx.fill();

    // Viền
    ctx.strokeStyle="white";
    ctx.lineWidth=2;
    ctx.strokeRect(-35,-22,60,44);
}
function drawPlayer() {
    // Lửa động cơ
for(let i=0;i<8;i++){

    ctx.beginPath();

    ctx.fillStyle=`rgba(255,${120+Math.random()*80},0,0.7)`;

    ctx.arc(
        -38-Math.random()*10,
        (Math.random()-0.5)*10,
        Math.random()*3+1,
        0,
        Math.PI*2
    );

    ctx.fill();

}

    ctx.save();

    const angle = Math.atan2(
        mouse.y - player.y,
        mouse.x - player.x
    );

    ctx.translate(player.x, player.y);
    ctx.rotate(angle + shipTilt);

    ctx.shadowColor = "#00ffff";
ctx.shadowBlur = 20;

switch(currentShip){

    case 0:
        drawShip1();
        break;

    case 1:
        drawShip2();
        break;

    case 2:
        drawShip3();
        break;

    case 3:
        drawShip4();
        break;

}
    ctx.restore();
    ctx.strokeStyle="#00ffff";
ctx.lineWidth=3;
ctx.shadowBlur=15;
ctx.shadowColor="#00ffff";

// Cánh trên
ctx.beginPath();
ctx.moveTo(-8,-8);
ctx.lineTo(-24,-22);
ctx.stroke();

// Cánh dưới
ctx.beginPath();
ctx.moveTo(-8,8);
ctx.lineTo(-24,22);
ctx.stroke();

ctx.shadowBlur=0;
}
function spawnPlayerEngine(){

    const angle = Math.atan2(
        mouse.y-player.y,
        mouse.x-player.x
    );

    for(let i=0;i<2;i++){

        playerEngineParticles.push({

            x: player.x - Math.cos(angle)*28,
            y: player.y - Math.sin(angle)*28,

            dx: -Math.cos(angle)*4 + (Math.random()-0.5),
            dy: -Math.sin(angle)*4 + (Math.random()-0.5),

            size: Math.random()*4+2,

            life:30

        });

    }

}
function updatePlayerEngine(){

    for(let i = playerEngineParticles.length - 1; i >= 0; i--){

        const p = playerEngineParticles[i];

        p.x += p.dx;
        p.y += p.dy;

        p.life--;

        p.size *= 0.96;

        if(p.life <= 0){
            playerEngineParticles.splice(i,1);
        }

    }

}
function drawHPBar() {

    const width = 200;
    const height = 20;

    const x = 20;
    const y = 20;

    // Viền
    ctx.strokeStyle = "white";
    ctx.strokeRect(x, y, width, height);

    // Nền
    ctx.fillStyle = "#333";
    ctx.fillRect(x, y, width, height);

    // Máu
    ctx.fillStyle = "lime";

    ctx.fillRect(
        x,
        y,
        width * (player.hp / player.maxHp),
        height
    );

    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText(
        `HP: ${player.hp}/${player.maxHp}`,
        x,
        y - 6
    );

}
function drawPlayerEngine(){

    playerEngineParticles.forEach(p=>{

        ctx.globalAlpha=p.life/30;

        const r=Math.floor(255);
        const g=Math.floor(120+p.life*4);

        ctx.fillStyle=`rgb(${r},${g},0)`;

        ctx.beginPath();

        ctx.arc(
            p.x,
            p.y,
            p.size,
            0,
            Math.PI*2
        );

        ctx.fill();

    });

    ctx.globalAlpha=1;

}

function drawScore() {

    ctx.fillStyle = "white";
    ctx.font = "28px Arial";
    ctx.fillText("Gold: "+money,20,170);

    ctx.fillText(
        "Score: " + score,
        canvas.width - 180,
        35
    );
    

}



function drawLevel() {

    ctx.fillStyle = "cyan";
    ctx.font = "24px Arial";

    ctx.fillText(
        "Level: " + level,
        canvas.width - 180,
        70
    );

}
function drawEXPBar() {

    const width = 250;
    const height = 16;

    const x = 20;
    const y = 60;

    ctx.fillStyle = "#333";
    ctx.fillRect(x, y, width, height);

    ctx.fillStyle = "#00bfff";
    ctx.fillRect(
        x,
        y,
        width * (exp / nextLevel),
        height
    );

    ctx.strokeStyle = "white";
    ctx.strokeRect(x, y, width, height);

}
function drawUpgradeMenu() {

    if (!levelUp) return;

    const menuWidth = 500;
const menuHeight = 360;

const menuX = canvas.width / 2 - menuWidth / 2;
const menuY = canvas.height / 2 - menuHeight / 2;

ctx.fillStyle = "rgba(0,0,0,0.85)";
ctx.fillRect(menuX, menuY, menuWidth, menuHeight);

ctx.strokeStyle = "cyan";
ctx.lineWidth = 3;
ctx.strokeRect(menuX, menuY, menuWidth, menuHeight);

ctx.fillStyle = "white";
ctx.font = "32px Arial";
ctx.textAlign = "center";
ctx.fillText("LEVEL UP!", canvas.width / 2, menuY + 45);

ctx.font = "24px Arial";
    ctx.textAlign = "left";

    const startX = menuX + 40;
const startY = menuY + 80;
const text = [
    "+20 Máu",
    "+1 Tốc độ",
    "+1 Sát thương",
    "+20% Tốc độ bắn"
];

for(let i=0;i<4;i++){
    const hover =
    mouse.x > upgradeButtons[i].x &&
    mouse.x < upgradeButtons[i].x + upgradeButtons[i].w &&
    mouse.y > upgradeButtons[i].y &&
    mouse.y < upgradeButtons[i].y + upgradeButtons[i].h;

    upgradeButtons[i].x=startX;
    upgradeButtons[i].y=startY+i*65;

   ctx.fillStyle = hover ? "#00bfff" : "#333";

    ctx.fillRect(
        upgradeButtons[i].x,
        upgradeButtons[i].y,
        upgradeButtons[i].w,
        upgradeButtons[i].h
    );

    ctx.strokeStyle = hover ? "white" : "cyan";
ctx.lineWidth = hover ? 3 : 1;
    ctx.strokeRect(
        upgradeButtons[i].x,
        upgradeButtons[i].y,
        upgradeButtons[i].w,
        upgradeButtons[i].h
    );

    ctx.fillStyle = hover ? "black" : "white";
    ctx.font="24px Arial";

    ctx.fillText(
        text[i],
        startX+20,
        startY+35+i*65
    );

}
    ctx.textAlign = "center";
ctx.font = "20px Arial";
ctx.fillStyle = "white";

ctx.fillText(
    "Click vào một nâng cấp để chọn",
    canvas.width / 2,
    startY + 290
);

}
function drawStars() {

    stars.forEach(star => {

        ctx.fillStyle = "white";

        ctx.beginPath();

        ctx.arc(
            star.x,
            star.y,
            star.size,
            0,
            Math.PI * 2
        );

        ctx.fill();

    });

}
function drawEnemyBullets() {

    ctx.fillStyle = "orange";

    enemyBullets.forEach(b => {

        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();

    });

}
//==============================
// DRAW
//==============================
function drawSettings(){

    ctx.fillStyle = "#081320";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "50px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline="middle";

    ctx.fillText("SETTINGS", canvas.width/2,120);
    volumeSlider.x = canvas.width/2 - 150;
volumeSlider.y = 220;

    ctx.font = "30px Arial";

   ctx.font = "28px Arial";
ctx.fillText("Âm lượng", canvas.width/2,180);

// Thanh nền
ctx.fillStyle = "#555";
ctx.fillRect(
    volumeSlider.x,
    volumeSlider.y,
    volumeSlider.width,
    volumeSlider.height
);

// Phần đã tăng
ctx.fillStyle = "#00bfff";
ctx.fillRect(
    volumeSlider.x,
    volumeSlider.y,
    volumeSlider.width * volumeSlider.value,
    volumeSlider.height
);

// Nút kéo
ctx.beginPath();
ctx.fillStyle = "white";
ctx.arc(
    volumeSlider.x + volumeSlider.width * volumeSlider.value,
    volumeSlider.y + volumeSlider.height/2,
    12,
    0,
    Math.PI*2
);
ctx.fill();

    ctx.fillText(
        "ESC để quay lại",
        canvas.width/2,
        450
    );

}
function drawGameOver(){

    ctx.fillStyle = "rgba(0,0,0,0.85)";
    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    const boxW = 500;
    const boxH = 380;

    const boxX = canvas.width/2 - boxW/2;
    const boxY = canvas.height/2 - boxH/2;


    // Khung Game Over
    ctx.fillStyle = "#111827";
    ctx.fillRect(
        boxX,
        boxY,
        boxW,
        boxH
    );


    ctx.strokeStyle = "#ff0044";
    ctx.lineWidth = 4;
    ctx.strokeRect(
        boxX,
        boxY,
        boxW,
        boxH
    );


    // Tiêu đề
    ctx.textAlign="center";

    ctx.shadowColor="red";
    ctx.shadowBlur=20;

    ctx.fillStyle="red";
    ctx.font="60px Arial";

    ctx.fillText(
        "GAME OVER",
        canvas.width/2,
        boxY+90
    );


    ctx.shadowBlur=0;


    // Điểm
    ctx.fillStyle="white";
    ctx.font="32px Arial";

    ctx.fillText(
        "Score: "+finalScore,
        canvas.width/2,
        boxY+160
    );


    // Nút chơi lại

    restartButton.x = canvas.width/2-130;
    restartButton.y = boxY+220;


    restartHover =
        mouse.x > restartButton.x &&
        mouse.x < restartButton.x + restartButton.width &&
        mouse.y > restartButton.y &&
        mouse.y < restartButton.y + restartButton.height;



    // Hiệu ứng hover
    if(restartHover){

        ctx.shadowColor="#00ffff";
        ctx.shadowBlur=25;

    }


   if(restartHover){

    ctx.shadowColor="#00ffff";
    ctx.shadowBlur=30;

    ctx.fillStyle="#00ffff";

}
else{

    ctx.fillStyle="#0066aa";

}


    ctx.fillRect(
        restartButton.x,
        restartButton.y,
        restartButton.width,
        restartButton.height
    );


    ctx.shadowBlur=0;


    ctx.strokeStyle="white";
    ctx.lineWidth=2;

    ctx.strokeRect(
        restartButton.x,
        restartButton.y,
        restartButton.width,
        restartButton.height
    );


    ctx.fillStyle="white";
    ctx.font="30px Arial";


    ctx.fillText(
        "CHƠI LẠI",
        canvas.width/2,
        restartButton.y+45
    );


}
function drawGalaxy(){

    ctx.save();

    ctx.translate(
        canvas.width/2,
        canvas.height/2
    );

    ctx.rotate(galaxyAngle);


    for(let i=0;i<400;i++){

        let angle = i * 0.15;

        let distance = i * 1.8;


        let x = Math.cos(angle) * distance;
        let y = Math.sin(angle) * distance * 0.5;


        ctx.fillStyle =
        "rgba(0,180,255,0.8)";


        ctx.beginPath();

        ctx.arc(
            x,
            y,
            Math.random()*2+1,
            0,
            Math.PI*2
        );

        ctx.fill();

    }


    // lõi thiên hà

    let core =
    ctx.createRadialGradient(
        0,0,0,
        0,0,80
    );

    core.addColorStop(0,"white");
    core.addColorStop(0.3,"cyan");
    core.addColorStop(1,"transparent");


    ctx.fillStyle=core;

    ctx.beginPath();

    ctx.arc(
        0,
        0,
        80,
        0,
        Math.PI*2
    );

    ctx.fill();


    ctx.restore();

}
function drawSpaceBackground(){

    // nền không gian
    ctx.fillStyle="#020617";
    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // tinh vân nhẹ
    let gradient = ctx.createRadialGradient(
        canvas.width/2,
        canvas.height/2,
        50,
        canvas.width/2,
        canvas.height/2,
        canvas.width
    );

    gradient.addColorStop(0,"#102a43");
    gradient.addColorStop(1,"#020617");

    ctx.fillStyle = gradient;

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );
    drawGalaxy();


    // vẽ sao
    stars.forEach(star=>{

        ctx.fillStyle="white";

        ctx.globalAlpha =
            0.5 + Math.random()*0.5;

        ctx.beginPath();

        ctx.arc(
            star.x,
            star.y,
            star.size,
            0,
            Math.PI*2
        );

        ctx.fill();

    });


    ctx.globalAlpha=1;

}

 function drawMenu(){

    drawSpaceBackground();
    playButton.x = canvas.width / 2 - 130;
playButton.y = 260;
settingsButton.x = canvas.width / 2 - 130;
settingsButton.y = 360;
shopButton.x = canvas.width/2 -130;
shopButton.y = 460;


ctx.fillStyle="#996600";

ctx.fillRect(
    shopButton.x,
    shopButton.y,
    shopButton.width,
    shopButton.height
);


ctx.fillStyle = "white";
ctx.font = "32px Arial";
ctx.textAlign = "center";
ctx.textBaseline = "middle";

ctx.fillText(
    "SHOP",
    shopButton.x + shopButton.width / 2,
    shopButton.y + shopButton.height / 2
);

    ctx.fillStyle="white";
    ctx.font="60px Arial";
    ctx.textAlign="center";

    ctx.fillText(
        "GALAXY SURVIVOR",
        canvas.width/2,
        180
    );
    ctx.fillStyle="gold";
ctx.font="30px Arial";

ctx.fillText(
    "💰 Gold: " + money,
    canvas.width/2,
    230
);

    ctx.font="36px Arial";

    ctx.fillStyle="cyan";

    ctx.fillStyle = "#00bfff";

ctx.fillRect(
    playButton.x,
    playButton.y,
    playButton.width,
    playButton.height
);

ctx.fillStyle = "white";
ctx.font = "36px Arial";

ctx.fillText(
    "PLAY",
    canvas.width / 2,
    playButton.y + 48
);
// SETTINGS
ctx.fillStyle = "#00bfff";

ctx.fillRect(
    settingsButton.x,
    settingsButton.y,
    settingsButton.width,
    settingsButton.height
);

ctx.fillStyle = "white";
ctx.font = "32px Arial";
ctx.textAlign = "center";
ctx.textBaseline = "middle";

ctx.fillText(
    "SETTINGS",
    canvas.width / 2,
    settingsButton.y + settingsButton.height / 2
);

    ctx.font="24px Arial";

    ctx.fillStyle="white";

    ctx.fillText(
        "Version 1.0",
        canvas.width/2,
        560
    );
}

function draw(){

    ctx.save();


    if(clickEffect>0){

        ctx.translate(
            (Math.random()-0.5)*clickEffect,
            (Math.random()-0.5)*clickEffect
        );

        clickEffect*=0.8;

    }


    if(gameState==="menu"){

        drawMenu();

        ctx.restore();
        return;

    }


    if(gameState==="settings"){

        drawSettings();

        ctx.restore();
        return;

    }


    if(gameState==="shop"){

        drawShop();

        ctx.restore();
        return;

    }


    // GAME PLAYING

    ctx.fillStyle="#081320";
    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    drawSpaceBackground();


    drawStars();

    drawBullets();

    drawEngineParticles();

    drawEnemies();

    drawBoss();

    drawPlayerEngine();

    drawPlayer();

    drawHPBar();

    drawEXPBar();

    drawScore();

    drawLevel();

    drawParticles();

    drawExpOrbs();

    drawCoins();

    drawUpgradeMenu();

    drawSpecialSkillMenu();

    drawEnemyBullets();

    drawBossHP();


    if(gameState==="gameover"){

        drawGameOver();

    }


    ctx.restore();

}




//==============================
// GAME LOOP
//==============================

function gameLoop() {

    update();
    draw();

    requestAnimationFrame(gameLoop);

}

gameLoop();
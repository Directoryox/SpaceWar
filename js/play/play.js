function getSettings() {
    const userChoice = localStorage.getItem('difficulty');
    return userChoice || 'medium';
}

function GameSettings() {
    const currentSetting = getSettings();
    
    const gameLVL = {
        easy: {
            title: "Easy",
            badGuysAppear: [400, 360, 300, 200],
            badGuysMoveSpeed: [3, 4, 5, 6],
            shootDelay: [200, 180, 200, 80],
            bulletMoveSpeed: 12,
            extraGunsAt300: 0,
            extraGunsAt600: 2,
            badGuyHealth: 0.7,
            pointsMulti: 1.2,
            bigBadGuyRate: 40,
            upgradeShipAt: 400
        },
        medium: {
            title: "Medium",
            badGuysAppear: [300, 260, 200, 100],
            badGuysMoveSpeed: [4, 5, 6, 7],
            shootDelay: [300, 130, 150, 30],
            bulletMoveSpeed: 10,
            extraGunsAt300: 0,
            extraGunsAt600: 2,
            badGuyHealth: 1.0,
            pointsMulti: 1.0,
            bigBadGuyRate: 30,
            upgradeShipAt: 300
        },
        hard: {
            title: "Hard",
            badGuysAppear: [200, 160, 100, 50],
            badGuysMoveSpeed: [5, 6, 7, 8],
            shootDelay: [400, 180, 200, 50],
            bulletMoveSpeed: 8,
            extraGunsAt300: 1,
            extraGunsAt600: 7,
            badGuyHealth: 1.3,
            pointsMulti: 0.8,
            bigBadGuyRate: 20,
            upgradeShipAt: 200
        }
    };
    
    return gameLVL[currentSetting] || gameLVL.medium;
}

function displayInfo(gameConfig) {
    const info = document.createElement('div');
    info.className = 'game-mode-info';
    info.innerHTML = `<h4>Mode: ${gameConfig.title}</h4>`;
    document.body.appendChild(info);
}

document.addEventListener('DOMContentLoaded', () => {
    const gameConfig = GameSettings();
    displayInfo(gameConfig);
    beginGame(gameConfig);
});

let gameClocks = {
    bgClock: null,
    shootClock: null,
    enemyClock: null
};

function beginGame(gameConfig) {
    const gameArea = document.getElementById("content");
    const playField = document.getElementById("game");
    const pointsCounter = document.getElementById("score-value");
    
    if (!gameArea || !playField) {
        console.error('Не найдены игровые элементы');
        return;
    }
    
    gameArea.currentPoints = 0;
    playField.innerHTML = '';
    
    playField.classList.add('game-background');
    playField.style.backgroundImage = "url(../img/space.png)";
    playField.style.backgroundSize = "cover";
    
    gameArea.updateScore = function() {
        if (pointsCounter) {
            pointsCounter.textContent = Math.floor(gameArea.currentPoints);
        }
    };
    
    if (pointsCounter) {
        gameArea.updateScore();
    }
    
    const endScreen = document.getElementById("final");
    if (endScreen) {
        endScreen.style.display = "none";
    }
    
    let bgOffset = 0;
    function scrollBackground() {
        bgOffset += 1;
        playField.style.backgroundPositionY = bgOffset + "px";
        gameClocks.bgClock = requestAnimationFrame(scrollBackground);
    }
    
    if (gameClocks.bgClock) {
        cancelAnimationFrame(gameClocks.bgClock);
    }
    gameClocks.bgClock = requestAnimationFrame(scrollBackground);
    
    const centerX = playField.offsetWidth / 2;
    const centerY = playField.offsetHeight / 2;
    makePlayerShip({x: centerX, y: centerY}, 0, gameConfig, gameArea, playField, pointsCounter);
}

function makePlayerShip(pos, modeNumber, gameConfig, gameArea, playField, pointsCounter) {
    const playerImg = new Image();
    playerImg.className = "player";
    playerImg.src = "../img/spaceship.png";
    playerImg.width = 100;
    playerImg.height = 90;
    playerImg.style.position = "absolute";
    playerImg.style.top = (pos.y - playerImg.height/2) + "px";
    playerImg.style.left = (pos.x - playerImg.width/2) + "px";
    playField.appendChild(playerImg);
    
    const maxY = playField.offsetHeight - playerImg.height;
    const minY = 0;
    const maxX = playField.offsetWidth - playerImg.width;
    const minX = 0;
    
    document.onmousemove = function(event) {
        event = event || window.event;
        const gameRect = gameArea.getBoundingClientRect();
        let xPos = event.clientX - gameRect.left - playerImg.width/2;
        let yPos = event.clientY - gameRect.top - playerImg.height/2;
        
        xPos = Math.max(minX, Math.min(maxX, xPos));
        yPos = Math.max(minY, Math.min(maxY, yPos));
        
        playerImg.style.left = xPos + "px";
        playerImg.style.top = yPos + "px";
    };
    
    startfiring(playerImg, modeNumber, gameConfig, gameArea, playField, pointsCounter);
    createEnemies(playerImg, modeNumber, gameConfig, gameArea, playField, pointsCounter);
}

function startfiring(ship, modeNumber, gameConfig, gameArea, playField, pointsCounter) {
    const fireRate = gameConfig.shootDelay[modeNumber] || 100;
    
    if (gameClocks.shootClock) {
        clearInterval(gameClocks.shootClock);
    }
    gameClocks.shootClock = setInterval(() => {
        if (gameArea.currentPoints < gameConfig.upgradeShipAt) {
            makeBullet(ship, false, 0, playField, gameConfig);
            if (gameConfig.extraGunsAt300 > 0) {
                makeBullet(ship, false, -1, playField, gameConfig);
            }
        } else {
            if (gameConfig.extraGunsAt600 >= 3) {
                makeBullet(ship, true, -1, playField, gameConfig);
                makeBullet(ship, true, 0, playField, gameConfig);
                makeBullet(ship, true, 1, playField, gameConfig);
            } else if (gameConfig.extraGunsAt600 >= 2) {
                makeBullet(ship, true, -1, playField, gameConfig);
                makeBullet(ship, true, 1, playField, gameConfig);
            } else {
                makeBullet(ship, true, 0, playField, gameConfig);
            }
        }
    }, fireRate);
}

function makeBullet(ship, upgraded, sideOffset, playField, gameConfig) {
    const bulletImg = new Image();
    bulletImg.className = "bullet";
    bulletImg.src = "../img/bullet.png";
    bulletImg.width = 30;
    bulletImg.height = 30;
    bulletImg.style.position = "absolute";
    
    let xPos = ship.offsetLeft + ship.width/2 - bulletImg.width/2;
    let yPos = ship.offsetTop - bulletImg.height/2;
    
    if (upgraded) {
        xPos += bulletImg.width * sideOffset;
        if (sideOffset !== 0) {
            yPos += bulletImg.height;
        }
    }
    
    bulletImg.style.left = xPos + "px";
    bulletImg.style.top = yPos + "px";
    playField.appendChild(bulletImg);
    
    const bulletVelocity = gameConfig.bulletMoveSpeed || 15;
    
    function moveProjectile() {
        yPos -= bulletVelocity;
        bulletImg.style.top = yPos + "px";
        
        if (yPos < -bulletImg.height) {
            if (bulletImg.parentNode) {
                playField.removeChild(bulletImg);
            }
        } else {
            bulletImg.movementTimer = requestAnimationFrame(moveProjectile);
        }
    }
    
    bulletImg.movementTimer = requestAnimationFrame(moveProjectile);
}

function createEnemies(ship, modeNumber, gameConfig, gameArea, playField, pointsCounter) {
    let enemyNumber = 1;
    const appearRate = gameConfig.badGuysAppear[modeNumber] || 300;
    
    if (gameClocks.enemyClock) {
        clearInterval(gameClocks.enemyClock);
    }
    
    gameClocks.enemyClock = setInterval(() => {
        const isBigOne = enemyNumber % gameConfig.bigBadGuyRate === 0;
        const typeIndex = isBigOne ? 0 : 1;
        
        const enemyImg = new Image();
        enemyImg.type = typeIndex;
        enemyImg.hitPoints = isBigOne ? Math.round(20 * gameConfig.badGuyHealth) : 1;
        enemyImg.src = isBigOne ? "../img/alien1_boss.png" : "../img/alien1.png";
        enemyImg.width = isBigOne ? 80 : 50;
        enemyImg.height = isBigOne ? 60 : 40;
        enemyImg.className = "enemy";
        enemyImg.style.position = "absolute";
        
        const xPos = Math.random() * (playField.offsetWidth - enemyImg.width);
        enemyImg.style.left = xPos + "px";
        enemyImg.style.top = -enemyImg.height + "px";
        
        playField.appendChild(enemyImg);
        enemyNumber++;
        
        const moveSpeed = gameConfig.badGuysMoveSpeed[modeNumber] + Math.random();
        moveEnemyObj(enemyImg, moveSpeed, ship, gameArea, playField, pointsCounter, gameConfig);
        
    }, appearRate);
}

function moveEnemyObj(enemy, moveSpeed, ship, gameArea, playField, pointsCounter, gameConfig) {
    function enemyMovement() {
        const currentY = enemy.offsetTop + moveSpeed;
        enemy.style.top = currentY + "px";
        
        if (currentY > playField.offsetHeight) {
            if (enemy.parentNode) {
                playField.removeChild(enemy);
            }
            if (enemy.type === 0) {
                gameArea.currentPoints -= 10;
            } else {
                gameArea.currentPoints -= 1;
            }
            
            if (gameArea.updateScore) {
                gameArea.updateScore();
            }
            return;
        }
        
        const allBullets = document.getElementsByClassName('bullet');
        for (let i = 0; i < allBullets.length; i++) {
            const bullet = allBullets[i];
            if (checkIfCollided(enemy, bullet)) {
                if (bullet.movementTimer) {
                    cancelAnimationFrame(bullet.movementTimer);
                }
                if (bullet.parentNode) {
                    playField.removeChild(bullet);
                }
                
                enemy.hitPoints--;
                if (enemy.hitPoints <= 0) {
                    const pointsGained = enemy.type === 0 ? 10 : 1;
                    gameArea.currentPoints += Math.round(pointsGained * gameConfig.pointsMulti);
                    
                    if (gameArea.updateScore) {
                        gameArea.updateScore();
                    }
                    
                    createBoomEffect(enemy, playField);
                    if (enemy.parentNode) {
                        playField.removeChild(enemy);
                    }
                    return;
                }
            }
        }
        
        if (ship && ship.parentNode && checkIfCollided(enemy, ship)) {
            createBoomEffect(enemy, playField);
            createBoomEffect(ship, playField, true);
            
            if (ship.parentNode) {
                playField.removeChild(ship);
            }
            if (enemy.parentNode) {
                playField.removeChild(enemy);
            }
            
            document.onmousemove = null;
            
            if (gameClocks.bgClock) {
                cancelAnimationFrame(gameClocks.bgClock);
                gameClocks.bgClock = null;
            }
            if (gameClocks.shootClock) {
                clearInterval(gameClocks.shootClock);
                gameClocks.shootClock = null;
            }
            if (gameClocks.enemyClock) {
                clearInterval(gameClocks.enemyClock);
                gameClocks.enemyClock = null;
            }
            
            const allBullets = document.getElementsByClassName('bullet');
            for (let i = allBullets.length - 1; i >= 0; i--) {
                const bullet = allBullets[i];
                if (bullet.movementTimer) {
                    cancelAnimationFrame(bullet.movementTimer);
                }
                if (bullet.parentNode) {
                    playField.removeChild(bullet);
                }
            }
            
            const allEnemies = document.getElementsByClassName('enemy');
            for (let i = allEnemies.length - 1; i >= 0; i--) {
                const enemy = allEnemies[i];
                if (enemy.parentNode) {
                    playField.removeChild(enemy);
                }
            }
            
            setTimeout(() => showEndScreen(gameArea, pointsCounter, gameConfig), 500);
            return;
        }
        
        requestAnimationFrame(enemyMovement);
    }
    
    requestAnimationFrame(enemyMovement);
}

function checkIfCollided(objA, objB) {
    if (!objA || !objB) return false;
    
    const rectA = objA.getBoundingClientRect();
    const rectB = objB.getBoundingClientRect();
    
    return !(rectA.right < rectB.left || 
                rectA.left > rectB.right || 
                rectA.bottom < rectB.top || 
                rectA.top > rectB.bottom);
}

function createBoomEffect(obj, playField, isPlayer = false) {
    const boomImg = new Image();
    
    boomImg.src = '../img/boom.png';
    boomImg.width = obj.width;
    boomImg.height = obj.height;
    boomImg.className = isPlayer ? "playerBoom" : "enemyBoom";
    boomImg.style.position = "absolute";
    boomImg.style.left = obj.style.left;
    boomImg.style.top = obj.style.top;
    
    playField.appendChild(boomImg);
    
    setTimeout(() => {
        if (boomImg.parentNode) {
            playField.removeChild(boomImg);
        }
    }, isPlayer ? 3000 : 1000);
}

function showEndScreen(gameArea) {
    const endScreen = document.getElementById("final");
    const scoreDisplay = document.getElementById("total");
    const recordDisplay = document.getElementById("history");
    
    if (!endScreen) {
        console.log('Ошибка: нет экрана окончания');
        return;
    }
    
    const finalPoints = Math.floor(gameArea.currentPoints);
    
    if (scoreDisplay) {
        scoreDisplay.textContent = finalPoints;
    }
    
    const currentMode = localStorage.getItem('difficulty') || 'medium';
    const storageKey = `game_record_${currentMode}`;
    let bestResult = parseInt(localStorage.getItem(storageKey)) || 0;
    
    if (finalPoints > bestResult) {
        bestResult = finalPoints;
        localStorage.setItem(storageKey, finalPoints);
    }
    
    if (recordDisplay) {
        recordDisplay.textContent = bestResult;
    }
    
    const scoreContainer = document.getElementById("score-container");
    if (scoreContainer) {
        scoreContainer.style.display = "none";
    }
    
    endScreen.style.display = "block";
    
    const restartButton = document.getElementById("reset");
    if (restartButton) {
        restartButton.onclick = () => {
            endScreen.style.display = "none";
            
            if (scoreContainer) {
                scoreContainer.style.display = "block";
            }
            
            const gameConfig = GameSettings();
            beginGame(gameConfig);
        };
    }
}
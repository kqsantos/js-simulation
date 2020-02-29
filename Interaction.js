// ===========================================
// ======= Start of Initial Variables ========
// ===========================================
var canvas = document.getElementById('gameWorld');
var ctx = canvas.getContext('2d');
var AM = new AssetManager();
var gameEngine = new GameEngine();
gameEngine.init(ctx);
gameEngine.start();

var gridCellDim = 20; // Width and Height of a grid cell

var gridWidth = Math.floor(gameEngine.surfaceWidth / gridCellDim);
var gridHeight = Math.floor(gameEngine.surfaceHeight / gridCellDim);

console.log("GridWidth");
console.log(gridWidth);
console.log("GridHeight");
console.log(gridHeight);

var grid = [];
grid = new Array(gridWidth);
var i;
var j;
for (i = 0; i < gridWidth; i++) {
    grid[i] = new Array(gridHeight);
    for (j = 0; j < gridHeight; j++) {
        grid[i][j] = null;
    }
}

gameEngine.gameGrid = grid;

console.log(gameEngine.gameGrid)
console.log("grid");
console.log(grid);
// ===========================================
// ======== End of Initial Variables =========
// ===========================================



// ===========================================
// ============ Start of Utilities ===========
// ===========================================
function checkForOverlap(objName, xCoor, yCoor) {
    var output = false;


    // var i;
    // console.log(xCoor + " " + yCoor)
    // console.log(grid)
    if (grid[xCoor][yCoor] != null
        && grid[xCoor][yCoor].x === xCoor
        && grid[xCoor][yCoor].y === yCoor) {
        // console.log("Found " + objName + " " + gameEngine.entities[i].x + ", " + gameEngine.entities[i].y);
        output = true;
    }

    // var i;
    // for (i = 0; i < gameEngine.entities.length; i++) {
    //     if (gameEngine.entities[i].name === objName
    //         && x === gameEngine.entities[i].x
    //         && y === gameEngine.entities[i].y) {
    //         console.log("Found " + objName + " " + gameEngine.entities[i].x + ", " + gameEngine.entities[i].y);
    //         output = true;
    //         break;
    //     }
    // }

    return output;
}

function rngWithTolerance(base) {
    var output = false;
    var bounds = Math.floor(base * 0.1);
    var min = base - bounds;
    var max = base + bounds;

    output = Math.floor(Math.random() * (max - min)) + min;

    return output;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * ((max + 1) - min)) + min; //The maximum is inclusive and the minimum is inclusive
}

function drawMe(ctx, color, x, y) {
    ctx.fillStyle = color;
    ctx.fillRect(x * gridCellDim, y * gridCellDim, gridCellDim, gridCellDim);
}

function strokeMe(ctx, color, x, y) {
    ctx.strokeStyle = color;
    ctx.strokeRect(x * gridCellDim, y * gridCellDim, gridCellDim, gridCellDim);
}
// ===========================================
// ============= End of Utilities ============
// ===========================================



// ===========================================
// =============== Start of Tree =============
// ===========================================
function Tree(game, x, y) {
    this.stage1 = AM.getAsset("./img/stage1.png");
    this.stage2 = AM.getAsset("./img/stage2.png");
    this.stage3 = AM.getAsset("./img/stage3.png");
    this.stage4 = AM.getAsset("./img/stage4.png");
    this.stage5 = AM.getAsset("./img/stage5.png");
    this.display = this.stage1;


    this.name = "Tree";
    this.timeBeforeSaplingDrop = rngWithTolerance(150);
    this.saplingSurvivalChance = 55; // 1 to 100
    this.maxAge = rngWithTolerance(1000);
    this.currentAge = this.maxAge;


    Entity.call(this, game, x, y);
    this.dropSaplingTimer = rngWithTolerance(this.timeBeforeSaplingDrop);
}

Tree.prototype = new Entity();
Tree.prototype.constructor = Tree;

Tree.prototype.update = function () {
    // this.dropSaplingTimer--;
    this.currentAge--;

    // If age is 0 then tree is petrified
    if (this.currentAge <= 0) {
        this.removeFromWorld = true;
        grid[this.x][this.y] = null;
    }

    if (this.currentAge < this.maxAge * 0.85) {
        this.display = this.stage5;
        this.dropSaplingTimer--;
    }
    else if (this.currentAge < this.maxAge * 0.88) {
        this.display = this.stage4;
    }
    else if (this.currentAge < this.maxAge * 0.92) {
        this.display = this.stage3;
    }
    else if (this.currentAge < this.maxAge * 0.96) {
        this.display = this.stage2;
    }
    else if (this.currentAge < this.maxAge) {
        this.display = this.stage1;
    }

    // 
    if (this.currentAge > 0 && this.dropSaplingTimer <= 0
        && this.currentAge < this.maxAge * 0.85) {
        var saplingChance = getRandomInt(1, 100);
        // console.log(saplingChance);
        if (saplingChance >= this.saplingSurvivalChance) {
            var tempX = getRandomInt(-3, 3);
            var tempY = getRandomInt(-3, 3);
            // tempX *= 2;
            // tempY *= 2;


            if (tempX + this.x >= 0 && tempX + this.x < gridWidth
                && tempY + this.y >= 0 && tempY + this.y < gridHeight) {
                // console.log("Checking for Tree at (" + tempX + this.x + ", " + tempY + this.y + ")");
                var isOverlapping = checkForOverlap("Tree", tempX + this.x, tempY + this.y);

                if (!isOverlapping) {
                    var tempTree = new Tree(gameEngine, tempX + this.x, tempY + this.y);
                    grid[tempX + this.x][tempY + this.y] = tempTree;

                    gameEngine.addSimEntity(tempTree);
                }
            }
        }
        this.dropSaplingTimer = rngWithTolerance(this.timeBeforeSaplingDrop);
    }
}

Tree.prototype.draw = function (ctx) {
    var drawX = this.x * gridCellDim;
    var drawY = this.y * gridCellDim;


    if (this.display === this.stage1) {
        ctx.drawImage(this.display, drawX + 5, drawY + 5);
    }
    else if (this.display === this.stage2) {
        ctx.drawImage(this.display, drawX + 5, drawY + 5);
    }
    else if (this.display === this.stage3) {
        ctx.drawImage(this.display, drawX +3, drawY + 0);
    }
    else if (this.display === this.stage4) {
        ctx.drawImage(this.display, drawX + 2, drawY - 15);
    }
    else if (this.display === this.stage5) {
        ctx.drawImage(this.display, drawX - 1, drawY - 25);
    }
    // drawMe(ctx, "brown", this.x, this.y);
    Entity.prototype.draw.call(this);
}
// ===========================================
// ================ End of Tree ==============
// ===========================================



// ===========================================
// ========== Start of Grid Display ==========
// ===========================================
function GridDisplay(game) {
    this.timer = 0;
    Entity.call(this, game, 0, 0);
}

GridDisplay.prototype = new Entity();
GridDisplay.prototype.constructor = GridDisplay;

GridDisplay.prototype.update = function () {
    this.timer++;
}

GridDisplay.prototype.draw = function (ctx) {
    // Uncomment me to display grid
    var i;
    var j;
    for (i = 0; i < gridWidth; i++) {
        for (j = 0; j < gridHeight; j++) {
            strokeMe(ctx, "grey", i, j);
        }
    }

    ctx.font = "12px Arial";
    ctx.fillText("Timer: " + this.timer, gameEngine.surfaceWidth - 100, 12);
    Entity.prototype.draw.call(this);
}
// ===========================================
// =========== End of Grid Display ===========
// ===========================================




AM.queueDownload("./img/stage1.png");
AM.queueDownload("./img/stage2.png");
AM.queueDownload("./img/stage3.png");
AM.queueDownload("./img/stage4.png");
AM.queueDownload("./img/stage5.png");

AM.downloadAll(function () {

    gameEngine.addEntity(new GridDisplay(gameEngine));

    // Starting the trees at the upper-left corner of the map
    var countWidth = 1;
    var countHeight = 1
    for (i = 0; i < countWidth; i++) {
        for (j = 0; j < countHeight; j++) {
            var tempX = gridWidth / 2 + i;
            var tempY = gridHeight / 2 - j;
            var tempTree = new Tree(gameEngine, tempX, tempY)
            gameEngine.addSimEntity(tempTree);
            console.log(tempTree)
            grid[tempX][tempY] = tempTree;
        }
    }
});

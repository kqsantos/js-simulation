// ===========================================
// ======= Start of Initial Variables ========
// ===========================================
var canvas = document.getElementById('gameWorld');
var ctx = canvas.getContext('2d');
var canvasWidth = canvas.getAttribute("width");
var canvasHeight = canvas.getAttribute("height");

var gridCellDim = 10; // Width and Height of a grid cell

var gridWidth = Math.floor(canvasWidth / gridCellDim);
var gridHeight = Math.floor(canvasHeight / gridCellDim);

var grid = new Array(gridWidth);
var i;
var j;
for (i = 0; i < gridWidth; i++) {
    grid[i] = new Array(gridHeight);
}

// ===========================================
// ======== End of Initial Variables =========
// ===========================================


// ===========================================
// ============ Start of Utilities ===========
// ===========================================
function checkForOverlap(objName, x, y) {
    var output = false;

    var i;
    if (grid[x][y].name === objName
        && grid[x][y].x === x
        && grid[x][y].y === y) {
        console.log("Found " + objName + " " + gameEngine.entities[i].x + ", " + gameEngine.entities[i].y);
        output = true;
        break;
    }

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

    output = Math.floor(Math.random() * ((max + 1) - min)) + min;

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
    this.name = "Tree";
    this.timeBeforeSaplingDrop = 200;
    this.saplingSurvivalChance = 55; // 1 to 100
    this.age = 1050;
    Entity.call(this, game, x, y);
    this.dropSaplingTimer = rngWithTolerance(this.timeBeforeSaplingDrop);
}

Tree.prototype = new Entity();
Tree.prototype.constructor = Tree;

Tree.prototype.update = function () {
    this.dropSaplingTimer--;
    this.age--;

    // If age is 0 then tree is petrified
    if (this.age === 0) {
        this.removeFromWorld = true;
    }

    if (this.age > 0 && this.dropSaplingTimer === 0) {
        var saplingChance = getRandomInt(1, 100);
        // console.log(saplingChance);
        if (saplingChance >= this.saplingSurvivalChance) {
            var tempX = getRandomInt(-3, 8);
            var tempY = getRandomInt(-3, 3);
            // tempX *= 2;
            // tempY *= 2;

            if (tempX + this.x >= 0 && tempX + this.x <= gridWidth
                && tempY + this.y >= 0 && tempY + this.y <= gridHeight) {
                // console.log("Checking for Tree at (" + tempX + this.x + ", " + tempY + this.y + ")");
                var isOverlapping = checkForOverlap("Tree", tempX + this.x, tempY + this.y);

                if (!isOverlapping) gameEngine.addEntity(new Tree(gameEngine, tempX + this.x, tempY + this.y));
            }



        }
        this.dropSaplingTimer = rngWithTolerance(this.timeBeforeSaplingDrop);
    }
}

Tree.prototype.draw = function (ctx) {
    drawMe(ctx, "brown", this.x, this.y);
    Entity.prototype.draw.call(this);
}
// ===========================================
// ================ End of Tree ==============
// ===========================================



// ===========================================
// ============== Start of Human =============
// ===========================================
function Human(game, x, y) {
    this.name = "Human";
    this.speed = 100;
    this.hunger = 15; // Dies when hunger reaches 0
    this.hungerTimer = 200;
    this.thirst = 15; // Dies when hunger reaches 0
    this.hungerTimer = 200;
    this.age = 15000; // Dies when age reaches 0
    Entity.call(this, game, x, y);
    this.dropSaplingTimer = rngWithTolerance(this.timeBeforeSaplingDrop);
}

Human.prototype = new Entity();
Human.prototype.constructor = Human;

Human.prototype.update = function () {
    this.dropSaplingTimer--;

    // If age is 0 then Human is petrified
    if (this.age > 0) {
        this.age--;
    }

    if (this.dropSaplingTimer === 0) {
        var saplingChance = getRandomInt(1, 100);
        // console.log(saplingChance);
        if (saplingChance >= this.saplingSurvivalChance) {
            var tempX = getRandomInt(-3, 3);
            var tempY = getRandomInt(-3, 3);
            // tempX *= 2;
            // tempY *= 2;

            if (tempX + this.x >= 0 && tempX + this.x <= gridWidth
                && tempY + this.y >= 0 && tempY + this.y <= gridHeight) {
                // console.log("Checking for Human at (" + tempX + this.x + ", " + tempY + this.y + ")");
                var isOverlapping = checkForOverlap("Human", tempX + this.x, tempY + this.y);

                if (!isOverlapping) gameEngine.addEntity(new Human(gameEngine, tempX + this.x, tempY + this.y));
            }



        }
        this.dropSaplingTimer = rngWithTolerance(this.timeBeforeSaplingDrop);
    }
}

Human.prototype.draw = function (ctx) {
    drawMe(ctx, "black", this.x, this.y);
    Entity.prototype.draw.call(this);
}
// ===========================================
// =============== End of Human ==============
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
    // var i;
    // var j;
    // for (i = 0; i < gridWidth; i++) {
    //     for (j = 0; j < gridHeight; j++) {
    //         strokeMe(ctx, "grey", i, j);
    //     }
    // }

    ctx.font = "12px Arial";
    ctx.fillText("Timer: " + this.timer, canvasWidth - 100, 12);
    Entity.prototype.draw.call(this);
}
// ===========================================
// =========== End of Grid Display ===========
// ===========================================

var gameEngine = new GameEngine();

gameEngine.init(ctx);
gameEngine.start();
gameEngine.addEntity(new GridDisplay(gameEngine));

// Starting the trees at the upper-left corner of the map
for(i = 0; i < 3; i++) {
    for (j = 0; j < 3; j++) {
        var tempX = gridWidth / 10 + i;
        var tempY = gridHeight / 10 - j;
        var tempTree = new Tree(gameEngine, tempX, tempY)
        gameEngine.addEntity(tempTree);
        grid[i][j] = tempTree;
    }
}

// gameEngine.addEntity(new Tree(gameEngine, gridWidth / 10 - 1, gridHeight / 10 - 1));
// gameEngine.addEntity(new Tree(gameEngine, gridWidth / 10 - 1, gridHeight / 10));
// gameEngine.addEntity(new Tree(gameEngine, gridWidth / 10 - 1, gridHeight / 10 + 1));
// gameEngine.addEntity(new Tree(gameEngine, gridWidth / 10, gridHeight / 10 - 1));
// gameEngine.addEntity(new Tree(gameEngine, gridWidth / 10, gridHeight / 10));
// gameEngine.addEntity(new Tree(gameEngine, gridWidth / 10, gridHeight / 10 + 1));
// gameEngine.addEntity(new Tree(gameEngine, gridWidth / 10 + 1, gridHeight / 10 - 1));
// gameEngine.addEntity(new Tree(gameEngine, gridWidth / 10 + 1, gridHeight / 10));
// gameEngine.addEntity(new Tree(gameEngine, gridWidth / 10 + 1, gridHeight / 10 + 1));

// Starting the humans at the upper-right corner of the map
for(i = 0; i < 2; i++) {
    for (j = 0; j < 2; j++) {
        var tempX = gridWidth - (gridWidth / 10);
        var tempY = gridHeight / 10;
        var tempHuman = new Human(gameEngine, tempX, tempY)
        gameEngine.addEntity(tempHuman);
        grid[i][j] = tempTree;
    }
}

// gameEngine.addEntity(new Human(gameEngine, gridWidth - (gridWidth / 10), gridHeight / 10));
// gameEngine.addEntity(new Human(gameEngine, gridWidth - (gridWidth / 10) + 1, gridHeight / 10));
// gameEngine.addEntity(new Human(gameEngine, gridWidth - (gridWidth / 10) + 1, gridHeight / 10 + 1));
// gameEngine.addEntity(new Human(gameEngine, gridWidth - (gridWidth / 10), gridHeight / 10 + 1));

console.log(gameEngine.entities);
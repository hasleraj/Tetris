/* globals createjs */
/*jshint browser:true */
/*jshint devel:true */
/*globals AssetManager */
/*jshint esversion: 6 */
/* globals Tetrominoe */
/* globals IntroScreen */
/* globals MoverDirection*/
var GameScreen = function (assetManager, stage, myIntroScreen) {
    var me = this;
    var eventScreenComplete = new CustomEvent("contentFinished");

    //construct container object
    var screen = new createjs.Container();
    var frameRate = 24;
    var introScreen;

    //initialize keys, no keys pressed
    var downKey = false;
    var upKey = false;
    var leftKey = false;
    var rightKey = false;
    var spaceKey = false;

    var tetro = null;
    //setup event listeners for keyboard
    document.addEventListener("keyup", onKeyUp);
    document.addEventListener("keydown", onKeyDown);

    var pause = false;
    var grid = null;
    var pieceBag = [];
    var oldTetros = [];
    var score;
    var level;
    var rowsRemaining;
    var speed;
    
    /************** Grid Background Setup **************/
    var gridBackground = assetManager.getSprite("assets");
    gridBackground.gotoAndStop("grid");
    gridBackground.x = 30;
    gridBackground.y = 0;
    screen.addChildAt(gridBackground, 0);
    
    /************** Play Again Button Setup **************/
    var btnPlayAgain = assetManager.getSprite("assets");
    btnPlayAgain.gotoAndStop("btnPlayUp");
    btnPlayAgain.x = 60;
    btnPlayAgain.y = 515;
    btnPlayAgain.buttonHelper = new createjs.ButtonHelper(btnPlayAgain, "btnResetUp", "btnResetDown", "btnResetDown", false);
    screen.addChild(btnPlayAgain);
    btnPlayAgain.addEventListener("click", onReset);
    
    /************** Back Button Setup **************/
    var btnBack = assetManager.getSprite("assets");
    btnBack.gotoAndStop("btnMenuUp");
    btnBack.x = 300;
    btnBack.y = 515;
    btnBack.buttonHelper = new createjs.ButtonHelper(btnBack, "btnMenuUp", "btnMenuDown", "btnMenuDown", false);
    screen.addChild(btnBack);
    btnBack.addEventListener("click", onClickMain);

    /************** Game Over **************/
    var txtGameOver = assetManager.getSprite("assets");
    txtGameOver.gotoAndStop("gameOver");
    txtGameOver.x = 260;
    txtGameOver.y = 160;

    function gameOver() {
        screen.addChildAt(txtGameOver, 3);
    }

    /************** Private Methods **************/

    function resetGrid() {
        // This creates an empty grid. Example grid: 2 x 3
        /*
        [        y0    y1    y2
            x0 [null, null, null],
            x1 [null, null, null]
        ]
        */

        var grid_width = 10;
        var grid_height = 20;

        var grid = [];
        //loop through and make sure the grid is empty
        for(var x = 0; x < grid_width; x++) {
            grid[x] = [];
            for(var y = 0; y < grid_height; y++) {
                grid[x][y] = null;
            }
        }
        return grid;
    }

    function nextPiece() {
        if (pieceBag.length === 0) {
            //28 pieces in the tetrominoe bag
            pieceBag = ["J", "J", "J", "J", "O", "O", "O", "O", "T", "T", "T", "T", "L", "L", "L", "L", "S", "S", "S", "S", "Z", "Z", "Z", "Z", "I", "I", "I", "I"];
        }

        //remove a single random piece
        var selected = pieceBag.splice(Math.floor(Math.random() * pieceBag.length), 1)[0];

        // create a tetro from it and return it.
        return new Tetrominoe(stage, assetManager, selected, grid, gridBackground.x, gridBackground.y);
    }
    
    function checkGrid() {
        // Loops through the grid and finds any horizontal rows where every
        // value is true, this is a completed row and should be scored and removed.
        var completedRows = [];
        for(var y = 0; y < grid[0].length; y++) {
            var rowComplete = true;
            for(var x = 0; x < grid.length; x++) {
                if(grid[x][y] === null) {
                    rowComplete = false;
                }
            }
            if(rowComplete) {
                completedRows.push(y);
            }
        }

        console.log("completedRows: " + JSON.stringify(completedRows));

        // Loop awards points for and deletes completed rows
        for(var r = 0; r < completedRows.length; r++) {
            score = score + 10;
            rowsRemaining--;
            
            if(rowsRemaining === 0){
                level++;
                rowsRemaining = 10;
                speed++;
                tetro.setSpeed(speed);
            }
            
            console.log("Score: " + score);
            console.log("Level: " + level);
            console.log("Rows Remaining: " + rowsRemaining);
            
            var row = completedRows[r] - r; //subtract the r, because one row from the grid has been removed for each time this has looped
            shiftRow(row);
        }

        // Check if the grid is ready to have another piece added or not.
        if(grid[5][17] !== null) {
            // Game over
            gameOver();
            pause = true;
        }
    }

    /************** Public Methods **************/
    this.onSetup = function () {
        score = 0;
        level = 1;
        rowsRemaining = 10;
        speed = 0;
        grid = resetGrid();
        introScreen = myIntroScreen;
        tetro = nextPiece();
    };

    this.showMe = function () {
        stage.addChild(screen);
        this.onSetup();
        // startup the ticker
        createjs.Ticker.setFPS(frameRate);
        createjs.Ticker.addEventListener("tick", onTick);
    };

    this.hideMe = function () {
        stage.removeChild(screen);
    };

    /************** Event Handlers **************/
    function onTick(e) {
        document.getElementById("fps").innerHTML = createjs.Ticker.getMeasuredFPS();

        if(pause) return;

        if (leftKey) {
            tetro.changeColumn(MoverDirection.LEFT);
            leftKey = false;
        } else if (rightKey) {
            tetro.changeColumn(MoverDirection.RIGHT);
            rightKey = false;
        } else if (upKey) {
            tetro.rotateMe();
            upKey = false;
        } else if (downKey) {
            tetro.changeRow(MoverDirection.DOWN);
            downKey = false;
        } else if (spaceKey) {
            tetro.dropMe();
            spaceKey = false;
        }

        if (tetro.isActive()) {
            tetro.updateMe();
        } else {
            checkGrid();
            oldTetros.push(tetro);
            tetro = nextPiece();
        }
    }

    function shiftRow(r) {
        //for every square in row r, remove it
        for(var x = 0; x < grid.length; x++) {
            stage.removeChild(grid[x][r]);
        }

        // move every row above row r, down a row. including their sprites
        for(var x = 0; x < grid.length; x++) {
            for(var y = r + 1; y < grid[0].length; y++) {
                var blockSprite = grid[x][y];
                if(blockSprite !== null) blockSprite.y += 27;
                grid[x][y - 1] = blockSprite;
                grid[x][y] = null;
            }
        }
    }

    function onReset(e) {
        pause = false;

        tetro.destroyMe();
        tetro = null;

        oldTetros.forEach(function(t) { t.destroyMe(); });
        oldTetros = [];

        pieceBag = [];
        grid = null;
        screen.removeChild(txtGameOver);

        me.onSetup();
    }
    
    function onClickMain(e) {
        onReset();
        eventScreenComplete.buttonNumber = 0;
        stage.dispatchEvent(eventScreenComplete);
    }

    function onKeyDown(e) {
        if (e.keyCode == 37) leftKey = true;
        else if (e.keyCode == 39) rightKey = true;
        else if (e.keyCode == 38) upKey = true;
        else if (e.keyCode == 40) downKey = true;
        else if (e.keyCode == 32) spaceKey = true;

    }

    function onKeyUp(e) {
        if (e.keyCode == 37) leftKey = false;
        else if (e.keyCode == 39) rightKey = false;
        else if (e.keyCode == 38) upKey = false;
        else if (e.keyCode == 40) downKey = false;
        else if (e.keyCode == 32) spaceKey = false;
    }

};
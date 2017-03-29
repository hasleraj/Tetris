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

    /************** Play Again Button Setup **************/
    var btnPlayAgain = assetManager.getSprite("assets");
    btnPlayAgain.gotoAndStop("btnPlayUp");
    btnPlayAgain.x = 350;
    btnPlayAgain.y = 240;
    btnPlayAgain.buttonHelper = new createjs.ButtonHelper(btnPlayAgain, "btnResetUp", "btnResetDown", "btnResetDown", false);
    screen.addChild(btnPlayAgain);
    btnPlayAgain.addEventListener("click", onReset);

    /************** Game Over **************/
    var txtGameOver = assetManager.getSprite("assets");
    txtGameOver.gotoAndStop("gameOver");
    txtGameOver.x = 0;
    txtGameOver.y = 0;

    function gameOver() {
        screen.addChild(txtGameOver);
    }

    /************** Private Methods **************/

    function resetGrid() {
        var grid = [];
        for(var x = 0; x < 10; x++) {
            grid[x] = [];
            for(var y = 0; y < 20; y++) {
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

        var selected = pieceBag.splice(Math.floor(Math.random() * pieceBag.length), 1)[0];

        return new Tetrominoe(stage, assetManager, selected, grid); //remove a single piece
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

        // Award points for and delete completed rows

        for(var r = 0; r < completedRows.length; r++) {
            var row = completedRows[r] - r; // we subtract the r, because one row from the grid has been removed for each time this has looped
            shiftRow(row);
        }

        // Check if the grid is ready to have another piece added or not.
        if(grid[5][18] !== null) {
            // Game over
            gameOver();
            pause = true;
        }
    }

    /************** Public Methods **************/

    this.onSetup = function () {
        grid = resetGrid();
        introScreen = myIntroScreen;
        tetro = nextPiece();
    };

    this.showMe = function () {
        this.onSetup();
        stage.addChild(screen);

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
                var t = grid[x][y];
                if(t !== null) t.y += 27;
                grid[x][y - 1] = t;
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

    function onKeyDown(e) {
        var speed = 2;
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
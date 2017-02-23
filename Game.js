/*jshint browser:true */
/*jshint devel:true */
/*jshint esversion: 6 */
/* globals createjs */
/* globals Tetrominoe */
/* globals IntroScreen */
/* globals GameScreen */
/* globals InstructionScreen */
/* globals AssetManager */
/* globals MoverDirection */
/* globals manifest */

(function () {
    "use strict";

    window.addEventListener("load", onInit);

    // game variables
    var stage = null;
    var canvas = null;

    // frame rate of game
    var frameRate = 24;
    // game objects
    var assetManager = null;
    var tetro = null;

    //key booleans
    var downKey = false,
        upKey = false,
        leftKey = false,
        rightKey = false,
        spaceKey = false;

    var ROTATION_FACTOR = 0;

    var pieceBag = [];

    function nextPiece() {
        if (pieceBag.length === 0) {
            //28 pieces in the tetrominoe bag
            pieceBag = ["tetroOne", "tetroOne", "tetroOne", "tetroOne", "tetroTwo", "tetroTwo", "tetroTwo", "tetroTwo", "tetroThree", "tetroThree", "tetroThree", "tetroThree", "tetroFour", "tetroFour", "tetroFour", "tetroFour", "tetroFive", "tetroFive", "tetroFive", "tetroFive", "tetroSix", "tetroSix", "tetroSix", "tetroSix", "tetroSeven", "tetroSeven", "tetroSeven", "tetroSeven"];
        }

        var selected = pieceBag.splice(Math.floor(Math.random() * pieceBag.length), 1)[0];
        return new Tetrominoe(stage, assetManager, selected); // remove a single piece
    }

    // ------------------------------------------------------------ event handlers
    function onInit() {
        console.log(">> initializing");

        // get reference to canvas
        canvas = document.getElementById("stage");
        // set canvas to as wide/high as the browser window
        canvas.width = 600;
        canvas.height = 600;
        // create stage object
        stage = new createjs.Stage(canvas);

        // construct preloader object to load spritesheet and sound assets
        assetManager = new AssetManager(stage);
        stage.addEventListener("onAllAssetsLoaded", onSetup);
        // load the assets
        assetManager.loadAssets(manifest);

    }

    function onSetup(e) {
        console.log(">> adding sprites to game");
        stage.removeEventListener("onAllAssetsLoaded", onSetup);

        //initialize keys, no keys pressed
        downKey = false;
        upKey = false;
        leftKey = false;
        rightKey = false;
        spaceKey = false;

        tetro = nextPiece();
        //setup event listeners for keyboard
        document.addEventListener("keyup", onKeyUp);
        document.addEventListener("keydown", onKeyDown);

        // startup the ticker
        createjs.Ticker.setFPS(frameRate);
        createjs.Ticker.addEventListener("tick", onTick);

        console.log(">> game ready");
    }

    var oldTetros = [];

    function onTick(e) {
        // TESTING FPS
        document.getElementById("fps").innerHTML = createjs.Ticker.getMeasuredFPS();

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
            //tetro.startMe(MoverDirection.DOWN);
        } else if (spaceKey) {
            tetro.dropMe();
            spaceKey = false;
        }

        if (tetro.isActive()) {
            tetro.updateMe();
        } else {
            oldTetros.push(tetro);
            tetro = nextPiece();
        }

        // update the stage!
        stage.update();
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

})();
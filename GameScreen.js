/* globals createjs */
/*jshint browser:true */
/*jshint devel:true */
/*globals AssetManager */
/*jshint esversion: 6 */
/* globals Tetrominoe */
/* globals IntroScreen */
/* globals MoverDirection*/
var GameScreen = function (assetManager, stage, myIntroScreen) {

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


    /************** Private Methods **************/

    function nextPiece() {
        if (pieceBag.length === 0) {
            //28 pieces in the tetrominoe bag
            pieceBag = ["tetroOne", "tetroOne", "tetroOne", "tetroOne", "tetroTwo", "tetroTwo", "tetroTwo", "tetroTwo", "tetroThree", "tetroThree", "tetroThree", "tetroThree", "tetroFour", "tetroFour", "tetroFour", "tetroFour", "tetroFive", "tetroFive", "tetroFive", "tetroFive", "tetroSix", "tetroSix", "tetroSix", "tetroSix", "tetroSeven", "tetroSeven", "tetroSeven", "tetroSeven"];
        }

        var selected = pieceBag.splice(Math.floor(Math.random() * pieceBag.length), 1)[0];

        return new Tetrominoe(stage, assetManager, selected); //remove a single piece
    }

    /************** Public Methods **************/

    this.onSetup = function () {

        introScreen = myIntroScreen;

        tetro = nextPiece();

        // startup the ticker
        createjs.Ticker.setFPS(frameRate);
        createjs.Ticker.addEventListener("tick", onTick);

    };
    this.showMe = function () {
        this.onSetup();
        stage.addChild(screen);
    };

    this.hideMe = function () {
        stage.removeChild(screen);
    };

    /************** Event Handlers **************/
    function onTick(e) {
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
    }

    function onReset(e) {
        oldTetros = [];
        pieceBag = [];
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
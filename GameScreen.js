/* globals createjs */
/*jshint browser:true */
/*jshint devel:true */
/*globals AssetManager */
/*jshint esversion: 6 */
var GameScreen = function (assetManager, stage) {

    //CustomEvent
    var eventScreenComplete = new CustomEvent("instructionsFinished");

    //construct container object
    var screen = new createjs.Container();
    var frameRate = 24;
    var introScreen;



    //------------------------------public methods

    this.onSetup = function () {

        introScreen = myIntroScreen;

        // startup the ticker
        createjs.Ticker.setFPS(frameRate);
        createjs.Ticker.addEventListener("tick", onTick);

        // setup event listener to start game
        document.addEventListener("click", onStartGame);

    };
    this.showMe = function () {
        stage.addChild(screen);
    };

    this.hideMe = function () {
        stage.removeChild(screen);
    };

    //-----------------------------event handlers
    function onTick(e) {}

    function onStartGame(e) {}

    function onClick(e) {
        stage.dispatchEvent(eventScreenComplete);
    }

    function onKeyDown(e) {
        /*var speed = 2;
        if (e.keyCode == 37) leftKey = true;
        else if (e.keyCode == 39) rightKey = true;
        else if (e.keyCode == 38) upKey = true;
        else if (e.keyCode == 40) downKey = true;
        else if (e.keyCode == 32) spaceKey = true;*/

    }

    function onKeyUp(e) {
        /*if (e.keyCode == 37) leftKey = false;
        else if (e.keyCode == 39) rightKey = false;
        else if (e.keyCode == 38) upKey = false;
        else if (e.keyCode == 40) downKey = false;
        else if (e.keyCode == 32) spaceKey = false;*/
    }

};

/*var btnPlay = assetManager.getSprite("assets");
btnPlay.gotoAndStop("btnPlayUp");
btnPlay.x = 200;
btnPlay.y = 240;
btnPlay.buttonHelper = new createjs.ButtonHelper(btnPlay, "btnPlayUp", "btnPlayDown", "btnPlayDown", false);
stage.addChild(btnPlay);
//btnPlay.addEventListener("click", onClickPlay);

var btnInstructions = assetManager.getSprite("assets");
btnInstructions.gotoAndStop("btnInstructionUp");
btnInstructions.x = 130;
btnInstructions.y = 340;
btnInstructions.buttonHelper = new createjs.ButtonHelper(btnInstructions, "btnInstructionUp", "btnInstructionDown", "btnInstructionDown", false);
stage.addChild(btnInstructions);
//btnPlay.addEventListener("click", onClickPlay);

var title = assetManager.getSprite("assets");
title.gotoAndStop("title");
title.x = 50;
title.y = 40;
stage.addChild(title);*/
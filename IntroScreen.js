/* globals createjs */
/*jshint browser:true */
/*jshint devel:true */
/*jshint esversion: 6 */
var IntroScreen = function (assetManager, stage) {

    //CustomEvent
    var eventScreenComplete = new CustomEvent("introFinished");

    //construct container object
    var screen = new createjs.Container();

    var background = assetManager.getSprite("assets");
    background.gotoAndStop("title");
    background.x = 50;
    background.y = 130;
    screen.addChild(background);

    //add play button
    var btnPlay = assetManager.getSprite("assets");
    btnPlay.gotoAndStop("btnPlayUp");
    btnPlay.x = 190;
    btnPlay.y = 240;
    btnPlay.buttonHelper = new createjs.ButtonHelper(btnPlay, "btnPlayUp", "btnPlayDown", "btnPlayDown", false);
    screen.addChild(btnPlay);
    btnPlay.addEventListener("click", onClickPlay);

    var btnInstruction = assetManager.getSprite("assets");
    btnInstruction.gotoAndStop("btnPlayUp");
    btnInstruction.x = 130;
    btnInstruction.y = 340;
    btnInstruction.buttonHelper = new createjs.ButtonHelper(btnInstruction, "btnInstructionUp", "btnInstructionDown", "btnInstructionDown", false);
    screen.addChild(btnInstruction);
    btnInstruction.addEventListener("click", onClickInstruction);


    //------------------------------public methods
    this.showMe = function () {
        stage.addChild(screen);
    };

    this.hideMe = function () {
        stage.removeChild(screen);
    };

    //-----------------------------event handlers

    function onClickPlay(e) {
        eventScreenComplete.buttonNumber = 1;
        stage.dispatchEvent(eventScreenComplete);
    }

    function onClickInstruction(e) {
        eventScreenComplete.buttonNumber = 2;
        stage.dispatchEvent(eventScreenComplete);
    }

};
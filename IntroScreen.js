/* globals createjs */
/*jshint browser:true */
/*jshint devel:true */
/*jshint esversion: 6 */
var IntroScreen = function (assetManager, stage) {

    //CustomEvent
    var eventScreenComplete = new CustomEvent("introFinished");

    //construct container object
    var screen = new createjs.Container();

    var hitAreaSprite = assetManager.getSprite("uiAssets");
    //add play button
    var btnPlay = assetManager.getSprite("uiAssets");
    btnPlay.gotoAndStop("btnPlayUp");
    btnPlay.x = 120;
    btnPlay.y = 240;
    btnPlay.buttonHelper = new createjs.ButtonHelper(btnPlay, "btnPlayUp", "btnPlayDown", "btnPlayDown", false, hitAreaSprite, "hitArea");
    screen.addChild(btnPlay);
    btnPlay.addEventListener("click", onClick);

    //add instruction button
    var btnInstruction = assetManager.getSprite("uiAssets");
    btnInstruction.gotoAndStop("btnInstructionUp");
    btnInstruction.x = 120;
    btnInstruction.y = 240;
    btnInstruction.buttonHelper = new createjs.ButtonHelper(btnInstruction, "btnInstructionUp", "btnInstructionDown", "btnInstructionDown", false, hitAreaSprite, "hitArea");
    screen.addChild(btnInstruction);
    btnInstruction.addEventListener("click", onClick);


    //------------------------------public methods
    this.showMe = function () {
        stage.addChild(screen);
    };

    this.hideMe = function () {
        stage.removeChild(screen);
    };

    //-----------------------------event handlers
    function onClick(e) {
        stage.dispatchEvent(eventScreenComplete);
    }

};
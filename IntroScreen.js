/* globals createjs */
/*jshint browser:true */
/*jshint devel:true */
/*jshint esversion: 6 */
var IntroScreen = function (assetManager, stage) {

    //CustomEvent
    var eventScreenComplete = new CustomEvent("introFinished");

    var background = assetManager.getSprite("assets");
    background.gotoAndStop("title");
    screen.addChild(background);

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
    btnPlay.addEventListener("click", onClickPlay);


    //------------------------------public methods
    this.showMe = function () {
        stage.addChild(screen);
    };

    this.hideMe = function () {
        stage.removeChild(screen);
    };

    //-----------------------------event handlers

    function onClickPlay(e) {
        console.log("called onclick play");
        /*eventScreenComplete.buttonNumber = 1;
        stage.dispatchEvent(eventScreenComplete);*/
    }

    function onClickInstruction(e) {
        eventScreenComplete.buttonNumber = 2;
        stage.dispatchEvent(eventScreenComplete);
    }

};
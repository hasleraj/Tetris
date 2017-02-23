/* globals createjs */
/*jshint browser:true */
/*jshint devel:true */
/*jshint esversion: 6 */
var InstructionScreen = function (assetManager, stage) {

    //CustomEvent
    var eventScreenComplete = new CustomEvent("instructionsFinished");

    //construct container object
    var screen = new createjs.Container();

    var hitAreaSprite = assetManager.getSprite("uiAssets");
    //add play button
    var btnBack = assetManager.getSprite("uiAssets");
    btnBack.gotoAndStop("btnBackUp");
    btnBack.x = 120;
    btnBack.y = 240;
    btnBack.buttonHelper = new createjs.ButtonHelper(btnBack, "btnBackUp", "btnBackDown", "btnBackDown", false, hitAreaSprite, "hitArea");
    screen.addChild(btnBack);
    btnBack.addEventListener("click", onClick);


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
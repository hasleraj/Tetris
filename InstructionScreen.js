/* globals createjs */
/*jshint browser:true */
/*jshint devel:true */
/*jshint esversion: 6 */
var InstructionScreen = function (assetManager, stage) {

    //CustomEvent
    var eventScreenComplete = new CustomEvent("instructionsFinished");

    //construct container object
    var screen = new createjs.Container();

    /************** Back Button Setup **************/
    var btnBack = assetManager.getSprite("assets");
    btnBack.gotoAndStop("btnMenuUp");
    btnBack.x = 190;
    btnBack.y = 440;
    btnBack.buttonHelper = new createjs.ButtonHelper(btnBack, "btnMenuUp", "btnMenuDown", "btnMenuDown", false);
    screen.addChild(btnBack);
    btnBack.addEventListener("click", onClickMain);


    /************** Public Methods **************/
    this.showMe = function () {
        stage.addChild(screen);
    };

    this.hideMe = function () {
        stage.removeChild(screen);
    };

    /************** Event Handelrs **************/
    function onClickMain(e) {
        eventScreenComplete.buttonNumber = 0;
        stage.dispatchEvent(eventScreenComplete);
    }

};
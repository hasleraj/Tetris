/* globals createjs */
/*jshint browser:true */
/*jshint devel:true */
/*jshint esversion: 6 */
var InstructionScreen = function (assetManager, stage) {

    //CustomEvent
    var eventScreenComplete = new CustomEvent("instructionsFinished");

    //construct container object
    var screen = new createjs.Container();
    /************** Instructions Image **************/
    var instructions = assetManager.getSprite("assets");
    instructions.gotoAndStop("instructions");
    instructions.x = 10;
    instructions.y = 0;
    screen.addChild(instructions);

    /************** Back Button Setup **************/
    var btnBack = assetManager.getSprite("assets");
    btnBack.gotoAndStop("btnMenuUp");
    btnBack.x = 190;
    btnBack.y = 460;
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
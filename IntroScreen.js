/* globals createjs */
/*jshint browser:true */
/*jshint devel:true */
/*jshint esversion: 6 */
var IntroScreen = function (assetManager, stage) {

    //CustomEvent
    var eventScreenComplete = new CustomEvent("introFinished");

    //construct container object
    var screen = new createjs.Container();

    /************** Background Setup **************/
    var background = assetManager.getSprite("assets");
    background.gotoAndStop("title");
    background.x = 50;
    background.y = 100;
    screen.addChild(background);

    /************** Play Button Setup **************/
    var btnPlay = assetManager.getSprite("assets");
    btnPlay.gotoAndStop("btnPlayUp");
    btnPlay.x = 190;
    btnPlay.y = 240;
    btnPlay.buttonHelper = new createjs.ButtonHelper(btnPlay, "btnPlayUp", "btnPlayDown", "btnPlayDown", false);
    screen.addChild(btnPlay);
    btnPlay.addEventListener("click", onClickPlay);

    /************** Instruction Button Setup **************/
    var btnInstruction = assetManager.getSprite("assets");
    btnInstruction.gotoAndStop("btnPlayUp");
    btnInstruction.x = 130;
    btnInstruction.y = 340;
    btnInstruction.buttonHelper = new createjs.ButtonHelper(btnInstruction, "btnInstructionUp", "btnInstructionDown", "btnInstructionDown", false);
    screen.addChild(btnInstruction);
    btnInstruction.addEventListener("click", onClickInstruction);


    /************** Public Methods **************/
    this.showMe = function () {
        stage.addChild(screen);
    };

    this.hideMe = function () {
        stage.removeChild(screen);
    };

    /************** Event Handlers **************/

    function onClickPlay(e) {
        createjs.Sound.play("mouseClick");
        eventScreenComplete.buttonNumber = 1;
        stage.dispatchEvent(eventScreenComplete);
    }

    function onClickInstruction(e) {
        createjs.Sound.play("mouseClick");
        eventScreenComplete.buttonNumber = 2;
        stage.dispatchEvent(eventScreenComplete);
    }

};
/* globals createjs */
/*jshint browser:true */
/*jshint devel:true */
/*jshint esversion: 6 */
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

    var introScreen = null,
        contentScreen = null,
        instructionScreen = null,
        background = null;

    /************** Event Handlers **************/
    function onInit() {
        console.log(">> initializing");
        // get reference to canvas
        canvas = document.getElementById("stage");
        // set canvas to as wide/high as the browser window
        canvas.width = 600;
        canvas.height = 600;
        canvas.style.backgroundColor = "#000000";

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

        introScreen = new IntroScreen(assetManager, stage);
        contentScreen = new GameScreen(assetManager, stage, introScreen);
        instructionScreen = new InstructionScreen(assetManager, stage);

        introScreen.showMe();

        // startup the ticker
        createjs.Ticker.setFPS(frameRate);
        createjs.Ticker.addEventListener("tick", onTick);

        stage.addEventListener("introFinished", onIntroFinished);
        stage.addEventListener("instructionsFinished", onInstructionsFinished);
        stage.addEventListener("contentFinished", onContentFinished);
        
        console.log(">> game ready");
    }


    function onTick(e) {
        // update the stage!
        stage.update();
    }

    function onIntroFinished(e) {
        if (e.buttonNumber === 1) {
            introScreen.hideMe();
            contentScreen.showMe();
        } else if (e.buttonNumber === 2) {
            introScreen.hideMe();
            instructionScreen.showMe();
        }
    }
    
    function onInstructionsFinished(e) {
        if (e.buttonNumber === 0) {
            introScreen.showMe();
            instructionScreen.hideMe();
        }
    }
    
    function onContentFinished(e) {
        /*if (e.buttonNumber === 1) {
            introScreen.hideMe();
            contentScreen.showMe();
        } else if (e.buttonNumber === 2) {
            introScreen.hideMe();
            instructionScreen.showMe();
        }*/
    }

})();
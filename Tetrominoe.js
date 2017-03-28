/*jshint browser:true */
/*jshint devel:true */
/*jshint esversion: 6 */
/* globals Mover */
/* globals MoverDirection */
var Tetrominoe = function (stage, assetManager, assetName) {
    "use strict";
    const START_X = 280;
    const START_Y = 0;
    const COLUMN_WIDTH = 27;
    const ROW_WIDTH = 27;

    var sprite = null;
    var active = false;
    var spriteName = assetName;

    sprite = assetManager.getSprite("assets");
    sprite.gotoAndStop(assetName);
    stage.addChild(sprite);

    var spriteMover = new Mover(sprite, stage);

    /************** Public Methods **************/
    this.updateMe = function () {
        var spriteHeight = sprite.getBounds().height;
        //collision test with walls
        if (sprite.x < 0 /* left bound */ || sprite.x > 600 /* right */ || sprite.y < 0 /* top */ || sprite.y > 600 - (spriteHeight / 2) /* bottom */ ) {
            this.landMe();
        } else {
            spriteMover.update();
        }
    };

    this.isActive = function () {
        return active;
    };

    //called when hits bottom
    this.landMe = function () {
        spriteMover.stopMe();
        active = false;
    };

    //called if user hits space button to drop piece
    this.dropMe = function () {
        var spriteHeight = sprite.getBounds().height;
        sprite.y = 600 - (spriteHeight / 2);
    };

    // moves the sprite one column to the left or right based on key input
    this.changeColumn = function (direction) {
        if (direction == MoverDirection.LEFT) {
            sprite.x -= COLUMN_WIDTH;
        } else if (direction == MoverDirection.RIGHT) {
            sprite.x += COLUMN_WIDTH;
        }
    };

    //moves the sprite down one column at a time if user is pushing down arrow
    this.changeRow = function (direction) {
        if (direction == MoverDirection.DOWN) {
            sprite.y += COLUMN_WIDTH;
        }
    };

    //start sprite movement
    this.startMe = function (direction) {
        spriteMover.setDirection(direction);
        if (!spriteMover.getMoving()) {
            sprite.gotoAndStop(spriteName);
            spriteMover.startMe();
        }
    };

    //set speed of Tetro
    this.setSpeed = function (speed) {
        spriteMover.setSpeed(speed);
    };

    this.resetMe = function () {
        sprite.gotoAndStop(spriteName);
        sprite.x = START_X;
        sprite.y = START_Y;
        active = true;
        this.startMe(MoverDirection.DOWN);
    };

    this.rotateMe = function () {
        if (sprite.x >= 0 && sprite.x <= 600 && sprite.y >= 0 && sprite.y <= 600) {
            sprite.rotation += 90;
        }
    };

    this.resetMe();
};
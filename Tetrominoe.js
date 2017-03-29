/*jshint browser:true */
/*jshint devel:true */
/*jshint esversion: 6 */
/* globals Mover */
/* globals MoverDirection */
var Tetrominoe = function (stage, assetManager, assetName, grid) {
    "use strict";
    const START_X = 280;
    const START_Y = 0;
    const COLUMN_WIDTH = 27;
    const ROW_WIDTH = 27;
    const TICKS_PER_MOVE = 24; // number of ticks before movement is forced

    var currentTicks = 0;

    var sprite = null;
    var active = false;
    var spriteName = assetName;

    var grid = grid; // reference to the main grid.

    //start top middle
    var grid_x = Math.round(grid.length / 2);
    var grid_y = grid[0].length;
    var rotation = 0;

    sprite = assetManager.getSprite("assets");
    sprite.gotoAndStop(assetName);
    stage.addChild(sprite);

    var spriteMover = new Mover(sprite, stage);

    /************** Public Methods **************/
    this.updateMe = function () {
        if(active) {
            currentTicks++;
            if(currentTicks >= TICKS_PER_MOVE) {
                currentTicks = 0;
                this.changeRow(MoverDirection.DOWN);
            }
        }
    };

    this.isActive = function () {
        return active;
    };

    //called when hits bottom
    this.landMe = function () {
        active = false;
    };

    //called if user hits space button to drop piece
    this.dropMe = function () {

        /*
        var spriteHeight = sprite.getBounds().height;
        sprite.y = 600 - (spriteHeight / 2);
        */
    };

    this.canMove = function (direction) {
        // this function, should when complete, check the grid positions 
        //  that the block would take up after moving it (or rotating it)
        //  in the given direction to see if conflicts exist.
        switch(direction) {
        case MoverDirection.LEFT:
            return grid_x > 0; //temporary
        case MoverDirection.RIGHT:
            return grid_x < grid.length - 1; //temporary
        case MoverDirection.DOWN:
            return grid_y > 0; 
        default:
            return false;
        }
    }

    // moves the sprite one column to the left or right based on key input
    this.changeColumn = function (direction) {
        if(!this.canMove(direction)) {
            return;
        }

        if (direction == MoverDirection.LEFT) {
            sprite.x -= COLUMN_WIDTH;
            grid_x--;
        } else if (direction == MoverDirection.RIGHT) {
            sprite.x += COLUMN_WIDTH;
            grid_x++;
        }
    };

    //moves the sprite down one column at a time if user is pushing down arrow
    this.changeRow = function (direction) {
        if(!this.canMove(direction)) {
            this.landMe();
            return;
        }

        if (direction == MoverDirection.DOWN) {
            sprite.y += COLUMN_WIDTH;
            grid_y--;
        }
    };

    //start sprite movement
    this.startMe = function (direction) {
        active = true;
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
    };

    this.rotateMe = function () {
        if (sprite.x >= 0 && sprite.x <= 600 && sprite.y >= 0 && sprite.y <= 600) {
            sprite.rotation += 90;
            rotation = ++rotation % 3;
        }
    };

    this.resetMe();
};
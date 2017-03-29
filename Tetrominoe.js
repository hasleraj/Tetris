/*jshint browser:true */
/*jshint devel:true */
/*jshint esversion: 6 */
/* globals Mover */
/* globals MoverDirection */
var Tetrominoe = function (stage, assetManager, assetName, gameGrid) {
    "use strict";
    //placement 
    const START_X = 200;
    const START_Y = 30;
    //width of rows and columns
    const COLUMN_WIDTH = 27;
    const ROW_WIDTH = 27;
    //number of ticks before movement is forced
    const TICKS_PER_MOVE = 24;

    var currentTicks = 0;

    var sprite = null;
    var active = false;
    var spriteName = assetName;

    var grid = gameGrid; // reference to the main grid.

    //start top middle
    var grid_x = Math.round(grid.length / 2);
    var grid_y = grid[0].length - 2; // Minus two to allow some room

    var rotation = 0; // current number of rotations resets to 0 if it would hit 4

    sprite = assetManager.getSprite("assets");
    sprite.gotoAndStop(assetName);
    stage.addChild(sprite);

    /************** Private Methods **************/

    // This returns the grid positions of each block in tetro if it existed at the given location with the given rotation
    function getGridPlacement(gridX, gridY, rotationAngle) {
        var blocks;

        // these are the normal co-ordinates of unrotated blocks
        switch (spriteName) {
        case 'tetroOne':
            blocks = [{
                x: 0,
                y: 0
            }, {
                x: 0,
                y: 1
            }, {
                x: 0,
                y: -1
            }, {
                x: -1,
                y: -1
            }];
            break; // J
        case 'tetroTwo':
            blocks = [{
                x: 0,
                y: 0
            }, {
                x: 1,
                y: 0
            }, {
                x: 0,
                y: -1
            }, {
                x: 1,
                y: -1
            }];
            break; // O
        case 'tetroThree':
            blocks = [{
                x: 1,
                y: 0
            }, {
                x: 0,
                y: -1
            }, {
                x: 0,
                y: 0
            }, {
                x: 0,
                y: 1
            }];
            break; // T
        case 'tetroFour':
            blocks = [{
                x: 0,
                y: 0
            }, {
                x: 0,
                y: 1
            }, {
                x: 0,
                y: -1
            }, {
                x: 1,
                y: -1
            }];
            break; // L
        case 'tetroFive':
            blocks = [{
                x: 0,
                y: 0
            }, {
                x: 1,
                y: 0
            }, {
                x: 0,
                y: -1
            }, {
                x: -1,
                y: -1
            }];
            break; // S
        case 'tetroSix':
            blocks = [{
                x: 0,
                y: 0
            }, {
                x: -1,
                y: 0
            }, {
                x: 0,
                y: -1
            }, {
                x: 1,
                y: -1
            }];
            break; // Z
        case 'tetroSeven':
            blocks = [{
                x: 0,
                y: 0
            }, {
                x: 0,
                y: 1
            }, {
                x: 0,
                y: -1
            }, {
                x: 0,
                y: -2
            }];
            break; // I
        default:
            console.error('unknown piece');
            return [];
        }

        // Square should never be transformed because it doesn't rotate around one of it's blocks
        if (spriteName != 'tetroTwo') {
            // we need to change them depending on rotation
            // The formula is:
            // [x1, y1] = [xcosθ - ysinθ, xsinθ + ycosθ];
            // where θ is the rotation in counter clockwise radians
            // see https://en.wikipedia.org/wiki/Rotation_(mathematics) 
            // under 'Two Dimensions'

            var rotationRadians = rotationAngle * -0.0174533; //negative since we're going clockwise

            for (var b = 0; b < blocks.length; b++) {
                var rotated = {};
                rotated.x = blocks[b].x * Math.cos(rotationRadians) - blocks[b].y * Math.sin(rotationRadians);
                rotated.x = Math.round(rotated.x); // round to nearest int

                rotated.y = blocks[b].x * Math.sin(rotationRadians) + blocks[b].y * Math.cos(rotationRadians);
                rotated.y = Math.round(rotated.y);

                blocks[b] = rotated;
            }
        }

        // Now the blocks are set in relation to the tetro's origin point
        // We need to offset them based on the gridX and gridY
        for (var b = 0; b < blocks.length; b++) {
            var offsetBlock = {};
            offsetBlock.x = blocks[b].x + gridX;
            offsetBlock.y = blocks[b].y + gridY;
            blocks[b] = offsetBlock;
        }

        return blocks;
    }

    // This returns true if the tetro is allowed to exist at the given location with the given rotation
    function isValidPosition(gridX, gridY, rotationAngle) {
        var blocks = getGridPlacement(gridX, gridY, rotationAngle);
        var valid = true;

        // Now we loop through each block and check that it isn't set to true in the grid
        blocks.forEach(function (block) {
            if (block.x < 0 ||
                block.x >= grid.length ||
                block.y < 0 ||
                block.y >= grid[block.x].length ||
                grid[block.x][block.y] === true) {
                valid = false;
            }
        });

        return valid;
    }

    /************** Public Methods **************/
    this.updateMe = function () {
        if (active) {
            currentTicks++;
            if (currentTicks >= TICKS_PER_MOVE) {
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

        // Sets the blocks in the main grid to true for the spots where the tetros blocks are.
        var blocks = getGridPlacement(grid_x, grid_y, rotation * 90);
        blocks.forEach(function (block) {
            grid[block.x][block.y] = true;
        });

        // Stop any future action
        active = false;
    };

    //called if user hits space button to drop piece
    this.dropMe = function () {
        while (this.canMove(MoverDirection.DOWN)) {
            this.changeRow(MoverDirection.DOWN);
        }
    };

    this.canMove = function (direction) {
        //inactive tetro can never move
        if (!active) {
            console.log('inactive, not moving');
            return false;
        }

        var newX = grid_x;
        var newY = grid_y;

        // this function, should when complete, check the grid positions 
        //  that the block would take up after moving it (or rotating it)
        //  in the given direction to see if conflicts exist.
        switch (direction) {
        case MoverDirection.LEFT:
            newX--;
            break;
        case MoverDirection.RIGHT:
            newX++;
            break;
        case MoverDirection.DOWN:
            newY--;
            break;
        default:
            console.log('invalid direction');
            return false;
        }

        return isValidPosition(newX, newY, rotation * 90);
    };

    this.canRotate = function () {
        //inactive tetro can never move, squares don't rotate
        if (!active || spriteName == 'tetroTwo') {
            return false;
        }

        var newRotation = rotation + 1;
        return isValidPosition(grid_x, grid_y, (newRotation * 90));
    };

    // moves the sprite one column to the left or right based on key input
    this.changeColumn = function (direction) {
        if (!this.canMove(direction)) {
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
        if (!this.canMove(direction)) {
            console.log('cant move down');
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

    this.resetMe = function () {
        sprite.gotoAndStop(spriteName);
        sprite.x = START_X;
        sprite.y = START_Y;
        active = true;
    };

    this.rotateMe = function () {
        if (this.canRotate()) {
            sprite.rotation += 90;

            rotation++;
            if (rotation > 3) {
                rotation = 0;
            }
        }
    };

    this.resetMe();
};
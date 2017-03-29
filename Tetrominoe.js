/*jshint browser:true */
/*jshint devel:true */
/*jshint esversion: 6 */
/* globals Mover */
/* globals MoverDirection */
var Tetrominoe = function (stage, assetManager, tetroType, gameGrid) {
    "use strict";
    //placement 
    const START_X = 200;
    const START_Y = 30;
    //width of rows and columns
    const COLUMN_WIDTH = 27;
    const ROW_WIDTH = 27;
    //number of ticks before movement is forced
    const TICKS_PER_MOVE = 24;

    var screenX, screenY; // set to startx and starty in reset me

    var currentTicks = 0;

    var sprite = null;
    var active = false;
    var type = tetroType;

    var grid = gameGrid; // reference to the main grid.

    //start top middle
    // Set to top middle of grid (5, 18) in resetMe;
    var grid_x, grid_y;

    var rotation = 0; // current number of rotations resets to 0 if it would hit 4

    //sprite = assetManager.getSprite("assets");
    //sprite.gotoAndStop(tetroType);
    //stage.addChild(sprite);

    var sprites = [];
    for(var i = 0; i < 4; i++) {
        var s = assetManager.getSprite("assets");
        s.gotoAndStop(getColor());
        stage.addChild(s);
        sprites.push(s);
    }


    /************** Private Methods **************/

    function getColor() {
        switch (type) {
        case 'J': return 'purple';  // J
        case 'O': return 'red';     // O
        case 'T': return 'orange';  // T
        case 'L': return 'yellow';  // L
        case 'S': return 'pink';    // S
        case 'Z': return 'green';   // Z
        case 'I': return 'blue';    // I
        default:
            console.error('unknown piece');
            return 'green';
        }
    }

    function getBlocks(rotationAngle) {
        var blocks;

        // these are the normal co-ordinates of unrotated blocks
        switch (type) {
        case 'J':
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
        case 'O':
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
        case 'T':
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
        case 'L':
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
        case 'S':
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
        case 'Z':
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
        case 'I':
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
        if (type != 'O') {
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

        return blocks;
    }

    // This returns the grid positions of each block in tetro if it existed at the given location with the given rotation
    function getGridPlacement(gridX, gridY, rotationAngle) {
        var blocks = getBlocks(rotationAngle);

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
                grid[block.x][block.y] !== null) {
                valid = false;
            }
        });

        //console.log('new position ' + valid + '\n' + JSON.stringify(blocks))

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
        sprites.forEach(function(s, i) {
            grid[blocks[i].x][blocks[i].y] = s;
        })

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
        if (!active || type == 'O') {
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
            screenX -= COLUMN_WIDTH;
            setSprites();

            grid_x--;
        } else if (direction == MoverDirection.RIGHT) {
            screenX += COLUMN_WIDTH;
            setSprites();

            grid_x++;
        }
    };

    //moves the sprite down one column at a time if user is pushing down arrow
    this.changeRow = function (direction) {
        if (!this.canMove(direction)) {
            this.landMe();
            return;
        }

        if (direction == MoverDirection.DOWN) {
            screenY += ROW_WIDTH;
            setSprites();

            grid_y--;
        }
    };

    // This sets the sprites to their correct location based on the current
    // screen position of the middle of the main sprite and the layour and 
    // rotation of the block
    function setSprites() {
        var blocks = getBlocks(rotation * 90);
        sprites.forEach(function(s, i) {
            s.x = screenX + blocks[i].x * COLUMN_WIDTH;
            s.y = screenY - blocks[i].y * ROW_WIDTH;
        });
    }

    //start sprite movement
    this.startMe = function (direction) {
        active = true;
    };

    this.resetMe = function () {
        rotation = 0;
        screenX = START_X;
        screenY = START_Y;

        // Set to top middle of grid.
        grid_x = Math.round(grid.length / 2);
        grid_y = grid[0].length - 3; // Minus two to allow some room

        setSprites();
        active = true;
    };

    this.rotateMe = function () {
        if (this.canRotate()) {
            rotation++;
            if (rotation > 3) {
                rotation = 0;
            }
            setSprites();
        }
    };

    this.destroyMe = function() {
        sprites.forEach(function(s) {
            stage.removeChild(s);
        });
    }

    this.resetMe();
};
/*jshint browser:true */
/*jshint devel:true */
/*jshint esversion: 6 */
/* globals Mover */
/* globals MoverDirection */
var Tetrominoe = function (stage, assetManager, tetroType, gameGrid, gridBackgroundSpriteX, gridBackgroundSpriteY) {
    "use strict";

    //width of rows and columns in pixels
    const BLOCK_SIZE = 27;

    // The top left point of the grid image on the screen 
    var gridSpriteX = gridBackgroundSpriteX;
    var gridSpriteY = gridBackgroundSpriteY;

    var ticksPerMove = 24;
    // Current co-ordinates of the (0,0) block's sprite on the screen
    var screenX, screenY; // set to startx and starty in reset me

    // Current co-ordinates on the game grid of the (0, 0) block
    // Set to top middle of grid (5, 18) in resetMe;
    var grid_x, grid_y;

     //Ticks since last movement happened
    var currentTicks = 0;
    // Current number of rotations (each is 90 degrees). Resets to 0 if it hits 4
    var rotation = 0;
    var active = false;
    var type = tetroType;
    var grid = gameGrid;

    // Get the 4 sprite blocks that make up the object
    var sprites = [];
    for(var i = 0; i < 4; i++) {
        var sprite = assetManager.getSprite("assets");
        sprite.gotoAndStop(getColor());
        stage.addChild(sprite);
        sprites.push(sprite);
    }


    /************** Private Methods **************/

    function getColor() {
        switch (type) {
        case 'J': return 'purple';  // J block
        case 'O': return 'red';     // O block
        case 'T': return 'orange';  // T block
        case 'L': return 'yellow';  // L block
        case 'S': return 'pink';    // S block
        case 'Z': return 'green';   // Z block
        case 'I': return 'blue';    // I block
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
            break; // J block
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
            break; // O block
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
            break; // T block
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
            break; // L block
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
            break; // S block
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
            break; // Z block
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
            break; // I block
        default:
            console.error('unknown piece');
            return [];
        }

        // Square should never be transformed because it doesn't rotate around one of it's blocks
        if (type != 'O') {
            // we need to change the coordinates depending on rotation
            // The formula is: [x1, y1] = [xcosθ - ysinθ, xsinθ + ycosθ];
            // where θ is the rotation in counter clockwise radians
            // I got this equation from wikipedia
            // see https://en.wikipedia.org/wiki/Rotation_(mathematics) 
            
            //convert from degrees to radians
            var rotationRadians = rotationAngle * -0.0174533; //negative since we're going clockwise, this number is pi/180

            for (var b = 0; b < blocks.length; b++) {
                var rotatedBlock = {}; // The blocks new co-ordinates after rotation

                // x1 = xcosθ - ysinθ
                rotatedBlock.x = blocks[b].x * Math.cos(rotationRadians) - blocks[b].y * Math.sin(rotationRadians);
                rotatedBlock.x = Math.round(rotatedBlock.x); // round to nearest int

                // y1 = xsinθ + ycosθ
                rotatedBlock.y = blocks[b].x * Math.sin(rotationRadians) + blocks[b].y * Math.cos(rotationRadians);
                rotatedBlock.y = Math.round(rotatedBlock.y); // round to nearest int

                blocks[b] = rotatedBlock;
            }
        }

        return blocks;
    }

    // This returns the grid positions of each block in tetro if it existed at the given location with the given rotation
    function getGridPlacement(gridX, gridY, rotationAngle) {
        var blocks = getBlocks(rotationAngle);

        // The blocks are now the properly rotated versions of the (0,0), (0,1), etc
        // but they need to have their position corrected to where they would be in
        // the game grid.
        for (var block = 0; block < blocks.length; block++) {
            var offsetBlock = {};
            offsetBlock.x = blocks[block].x + gridX;
            offsetBlock.y = blocks[block].y + gridY;
            blocks[block] = offsetBlock;
        }

        return blocks;
    }

    // This returns true if the tetro is allowed to exist at the given location with the given rotation
    function isValidPosition(gridX, gridY, rotationAngle) {
        var blocks = getGridPlacement(gridX, gridY, rotationAngle);
        var valid = true;

        // Loop through each potential block location and check if it's a valid position in the grid
        blocks.forEach(function (block) {
            if (block.x < 0 || // if it would be too far left
                block.x >= grid.length || // or too far right
                block.y < 0 || // or too far down
                block.y >= grid[block.x].length || // or too far up
                grid[block.x][block.y] !== null) { // or there is already a block at that grid location
                valid = false;
            }
        });

        return valid;
    }

    /************** Public Methods **************/
    this.updateMe = function () {
        if (active) {
            currentTicks++;
            if (currentTicks >= ticksPerMove) {
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

        // This takes each sprite of the tetro and sets the grid value for the position it is in
        //  to the sprite. This allows gameScreen to remove these sprites when a line is completed
        //  as well as lets the next tetro check which locations are in/valid in the grid
        var blocks = getGridPlacement(grid_x, grid_y, rotation * 90);
        sprites.forEach(function(sprite, blockNumber) {
            var x = blocks[blockNumber].x;
            var y = blocks[blockNumber].y;
            grid[x][y] = sprite;
        });

        active = false;
    };

    //called if user hits space button to drop piece
    this.dropMe = function () {
        while (this.canMove(MoverDirection.DOWN)) {
            this.changeRow(MoverDirection.DOWN);
        }
    };

    this.canMove = function (direction) {
        //make sure inactive tetro can't move
        if (!active) {
            return false;
        }

        var newGridX = grid_x;
        var newGridY = grid_y;

        // this function, should when complete, check the grid positions 
        //  that the block would take up after moving it (or rotating it)
        //  in the given direction to see if conflicts exist.
        switch (direction) {
        case MoverDirection.LEFT:
            newGridX--;
            break;
        case MoverDirection.RIGHT:
            newGridX++;
            break;
        case MoverDirection.DOWN:
            newGridY--;
            break;
        default:
            console.log('invalid direction');
            return false;
        }

        return isValidPosition(newGridX, newGridY, rotation * 90);
    };

    this.canRotate = function () {
        //inactive tetro can't move, squares don't rotate
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
            screenX -= BLOCK_SIZE;
            setSprites();

            grid_x--;
        } else if (direction == MoverDirection.RIGHT) {
            screenX += BLOCK_SIZE;
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
            screenY += BLOCK_SIZE;
            setSprites();

            grid_y--;
        }
    };

    // This sets the sprites to their correct location based on the current
    // screen position of the middle of the main sprite and the layout and 
    // rotation of the block
    function setSprites() {
        var blocks = getBlocks(rotation * 90);
        sprites.forEach(function(sprite, blockNumber) {
            sprite.x = screenX + blocks[blockNumber].x * BLOCK_SIZE;
            sprite.y = screenY - blocks[blockNumber].y * BLOCK_SIZE;
        });
    }

    //start sprite movement
    this.startMe = function (direction) {
        active = true;
    };

    this.resetMe = function () {
        rotation = 0;

        // Set the tetros grid position to top middle of grid.
        grid_x = Math.round(grid.length / 2);
        // Minus three to allow some room so the I piece doesn't think it's out of bounds right away.
        grid_y = grid[0].length - 3;

        // This sets the initial starting positions of the sprites to be based off of where the 
        // grid background image is. If the background is moved the tetros still display
        // in the right spot. The values (1.3 and 2) were guessed until things fit
        screenX = gridSpriteX + ( (grid_x + 1.3) * BLOCK_SIZE );
        screenY = gridSpriteY + ( (grid[0].length - grid_y - 2) * BLOCK_SIZE );

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
        sprites.forEach(function(sprite) {
            stage.removeChild(sprite);
        });
    };

    this.setSpeed = function (speed) {
        if(ticksPerMove === 0) {
            ticksPerMove = 1;
        } else {
            ticksPerMove = ticksPerMove - speed;
        }
    };
    this.resetMe();
};
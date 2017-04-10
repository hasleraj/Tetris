/*jshint browser:true */
/*jshint devel:true */
/*jshint esversion: 6 */
var Grid = function (stage) {
    "use strict";

    var WIDTH = 10;
    var HEIGHT = 20;

    var grid;

    this.getHeight = function () {
        return HEIGHT;
    }

    this.getWidth = function () {
        return WIDTH;
    }

    // This initializes/resets the grid to empty.
    this.reset = function () {
        // This creates an empty grid. Example grid: 2 x 3
        /*
        [        y0    y1    y2
            x0 [null, null, null],
            x1 [null, null, null]
        ]
        */

        grid = [];

        //loop through and make sure the grid is empty
        for(var x = 0; x < WIDTH; x++) {
            grid[x] = [];
            for(var y = 0; y < HEIGHT; y++) {
                grid[x][y] = null;
            }
        }
    }

    // This checks for completed rows and returns their indices
    this.getCompletedRows = function () {
        var completeRows = [];
        for(var y = 0; y < HEIGHT; y++) {
            var rowComplete = true;
            for(var x = 0; x < WIDTH; x++) {
                if(grid[x][y] === null) {
                    rowComplete = false;
                }
            }
            
            if(rowComplete) {
                completeRows.push(y);
            }
        }
        return completeRows;
    }

    // Removes the row at the given index, shifting everything above it down.
    this.shiftRow = function (index) {
        //for every square in row r, remove it
        for(var x = 0; x < WIDTH; x++) {
            stage.removeChild(grid[x][index]);
            this.clearBlock(x, index);
        }

        // move every row above the given row, down a row. including their sprites
        for(var x = 0; x < WIDTH; x++) {
            for(var y = index + 1; y < HEIGHT; y++) {
                var blockSprite = grid[x][y];
                this.clearBlock(x, y);
                if(blockSprite !== null) blockSprite.y += 27;
                this.setBlock(x, y - 1, blockSprite);
            }
        }
    }

    this.isPositionValid = function (x, y) {
        return x >= 0 &&
               y >= 0 &&
               x < WIDTH &&
               y < HEIGHT;
    }

    // Returns true/false if there is a nothing in the given position and it is a valid position.
    this.isPositionTaken = function (x, y) {
        return this.isPositionValid(x, y) &&
               grid[x][y] !== null;
    }

    // Returns whether another block can be added
    this.isFull = function () {
        var spawnPosition = this.getSpawnPosition();
        return grid[spawnPosition.x][spawnPosition.y] !== null;
    }

    // Returns an object like { x: 10, y: 20 } which represents the spawn position for a new tetro
    this.getSpawnPosition = function () {
        return {
            x: Math.round(WIDTH / 2),

            // Minus three to allow some room so the I piece doesn't think it's out of bounds right away.
            y: HEIGHT - 3
        };
    }

    // Sets the block at position (x,y) to the given sprite
    this.setBlock = function (x, y, sprite) {
        if(!this.isPositionValid(x, y)) {
            console.error('trying to set a block in an invalid position (' + x + ', ' + y + ')');
            return;
        }
            
        if(this.isPositionTaken(x, y)) {
            console.error('trying to set a block in a taken position (' + x + ', ' + y + ')');
            return;
        }

        grid[x][y] = sprite;
    }

    this.clearBlock = function (x, y) {
        if(this.isPositionValid(x, y)) {
            grid[x][y] = null;
        }
    }

    this.reset();
};
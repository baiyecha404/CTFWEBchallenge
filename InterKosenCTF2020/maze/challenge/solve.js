const maze = require('./maze.js');

// Get arguments
process.argv.shift();
var map   = JSON.parse(process.argv[1]);
var start = JSON.parse(process.argv[2]);
var goal  = JSON.parse(process.argv[3]);
var heap  = JSON.parse(process.argv[4]);

// Map must be smaller than 64x64
var width = map[0].length;
var height = map.length;
if (width >= 64 || height >= 64) {
    console.log(JSON.stringify({
        result: 'map too large'
    }));
    process.exit(0);
}
for(var y = 0; y < height; y++) {
    if (map[y].length != width) {
        console.log(JSON.stringify({
            result: 'invalid width at line ' + y
        }));
        process.exit(0);
    }
}

// start and goal must be inside the map
if (start[0] < 0 || start[0] >= width
    || start[1] < 0 || start[1] >= height) {
    console.log(JSON.stringify({
        result: 'start position is invalid'
    }));
    process.exit(0);
}
if (goal[0] < 0 || goal[0] >= width
    || goal[1] < 0 || goal[1] >= height) {
    console.log(JSON.stringify({
        result: 'goal position is invalid'
    }));
    process.exit(0);
}

// Solve maze
var ms = new maze.Solver(map, start, goal, heap);
var result = ms.solve() !== undefined ? ms.solve() : 'impossible';

// Output result
console.log(JSON.stringify({result: result}));

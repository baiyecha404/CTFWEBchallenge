const pq = require('priorityqueue');
const { deepcopy } = require('./util.js');

/**
 * Maze: State of maze used by MazeSolver
 *
 * args:
 *   F   : Maze (1:wall / 0:nothing)
 *   S   : Current position represented by [x, y]
 *   G   : Goal position represented by [x, y]
 *   move: Steps made so far
 */
class Maze {
    constructor(F, S, G, move='') {
        this.F = F;
        this.width = F[0].length;
        this.height = F.length;
        this.S = S;
        this.G = G;
        this.move = move;
    }
    /* f: Cost for A* search */
    get f() { return this.g + this.h; }
    /* g: Steps required so far */
    get g() { return this.move.length; }
    /* h: Heuristic function */
    get h() { return Math.abs(this.S[0] - this.G[0])
              + Math.abs(this.S[1] - this.G[1]); }
    /* hash: Unique value of this state */
    get hash() { return (this.S[0] << 8) | this.S[1]; }
    /* next: Generate possible next states */
    next() {
        var candidates = [];
        if (this.S[0] > 0 && this.F[this.S[1]][this.S[0]-1] == 0) {
            // Move left
            var P = deepcopy(this.S);
            P[0] -= 1;
            candidates.push(new Maze(this.F, P, this.G, this.move+'A'));
        }
        if (this.S[0] < this.width - 1 && this.F[this.S[1]][this.S[0]+1] == 0) {
            // Move right
            var P = deepcopy(this.S);
            P[0] += 1;
            candidates.push(new Maze(this.F, P, this.G, this.move+'D'));
        }
        if (this.S[1] > 0 && this.F[this.S[1]-1][this.S[0]] == 0) {
            // Move up
            var P = deepcopy(this.S);
            P[1] -= 1;
            candidates.push(new Maze(this.F, P, this.G, this.move+'W'));
        }
        if (this.S[1] < this.height - 1 && this.F[this.S[1]+1][this.S[0]] == 0) {
            // Move bottom
            var P = deepcopy(this.S);
            P[1] += 1;
            candidates.push(new Maze(this.F, P, this.G, this.move+'S'));
        }
        return candidates;
    }
}

/**
 * Solver: Maze solver to find the shortest path by A* search
 */
class Solver {
    constructor(F, S, G, heap=undefined) {
        this.maze = new Maze(F, S, G); // initial state
        if (heap) {
            this.heap = heap; // type of priority queue
        }
    }
    solve() {
        const comparator = (M1, M2) => { return M2.f - M1.f; }
        const heap = this.heap || 'BinaryHeap';
        var q = new Function('c', 'return new this.'+heap+'({comparator:c});')
            .bind(pq)(comparator);
        q.push(this.maze);
        var visited = [];
        // A* search
        while(q.length > 0) {
            var maze = q.pop(); // Get a state with the smallest cost
            if (maze.h == 0) {
                // We're at the goal when heuristic is zero
                return maze.move;
            }
            if (!visited.includes(maze.hash)) {
                // Try to move if not visited yet
                visited.push(maze.hash);
                maze.next().forEach(m => q.push(m));
            }
        }
        // This maze is not solvable
        return;
    }
}

module.exports = {
    Solver: Solver
};

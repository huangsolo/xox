'use strict';

var consts = require('./constants'),
    update = require("react-addons-update");

var ROW_INDEX = 0;
var COLUMN_INDEX = 1;

/**
 * Calculates the position for a max score for self and a min score for opponent.
 * @param turn
 * @param board
 * @param alphaScore
 * @param betaScore
 * @returns {{position: array|null, score: int}}
 */
function miniMax(turn, board, alphaScore, betaScore) {
    var gameStatus = getGameStatus(board);
    var availableMoves;
    var newMove;
    //var position;
    var savedPosition = null;
    var result;

    if(gameStatus.gameOver) {
        return { position: null, score: gameStatus.score };
    }

    availableMoves = getAvailableMoves(board);

    // Get max score for self
    if(turn === consts.PLAYER_SELF) {
        availableMoves.forEach(function(position) {
            // Select move.
            newMove = update(board, {
                [position[ROW_INDEX]]: {
                    [position[COLUMN_INDEX]]: {
                        $set: consts.PLAYER_SELF
                    }
                }
            });

            result = miniMax(otherPlayer(turn), newMove, alphaScore, betaScore);


            if (result.score > alphaScore) {
                alphaScore = result.score;
                savedPosition = position;
            }
            if (alphaScore >= betaScore) {
                // alpha-beta pruning.
                return { position: position, score: alphaScore };
            }
        });

        return { position: savedPosition, score: alphaScore };
    } else {
        //Get min score for opponent
        availableMoves.forEach(function(position) {
            // Select move.
            newMove = update(board, {
                [position[ROW_INDEX]]: {
                    [position[COLUMN_INDEX]]: {
                        $set: consts.PlAYER_OPPONENT
                    }
                }
            });
            result = miniMax(otherPlayer(turn), newMove, alphaScore, betaScore);

            if (result.score < betaScore) {
                betaScore = result.score;
                savedPosition = position;
            }
            if (alphaScore >= betaScore) {
                // alpha-beta pruning.
                return { position: position, score: betaScore };
            }
        });

        return { position: savedPosition, score: betaScore }
    }
}

/**
 * Gets an array of available positions on the board.
 * @param board
 * @returns {Array}
 */
function getAvailableMoves(board) {
    var moves = [];
    Object.keys(board).forEach(function (row) {
        Object.keys(board[row]).forEach(function (col) {
            if (board[row][col] === null) {
                moves.push([row, col]);
            }
        });
    });
    return moves;
}

/**
 * Returns the following status of the game:
 * - gameOver: whether the game is over.
 * - score: 1 if self wins, -1 if opponent wins, 0 if no winner.
 * - winningPositions: Array of row, column positions of the winner.
 * @param board
 * @returns {{gameOver: boolean, score: number, winningPositions: array|null}}
 */
function getGameStatus(board) {
    var gameOver = false;
    var positions = null;
    var opponentWins = winningPositions(consts.PlAYER_OPPONENT, board);
    var selfWins = winningPositions(consts.PLAYER_SELF, board);
    var score = 0;
    if (opponentWins || selfWins || isFull(board)) {
        gameOver = true;
        if (selfWins) {
            score = 1;
            positions = selfWins;
        } else if (opponentWins) {
            score = -1;
            positions = opponentWins;
        }
    }

    return { gameOver: gameOver, score: score, winningPositions: positions }
}

/**
 * Returns the winning positions of a game or null.
 * @param player
 * @param board
 * @returns {array|null}
 */
function winningPositions(player, board) {
    var positions = getPositions(player, board);
    return sameRow(positions) || sameColumn(positions) || sameDiagonal(positions);
}

/**
 * Returns an array of the occupied positions of the player.
 * @param player
 * @param board
 * @returns {Array}
 */
function getPositions(player, board) {
    var positions = [];
    Object.keys(board).forEach(function (row) {
        Object.keys(board[row]).forEach(function (col) {
            if (board[row][col] === player) {
                positions.push([row, col]);
            }
        });
    });

    return positions;
}

/**
 * Gets the other player.
 * @param player
 * @returns {string}
 */
function otherPlayer(player) {
    return player === consts.PLAYER_SELF ? consts.PlAYER_OPPONENT : consts.PLAYER_SELF;
}

/**
 * Returns true if the board is full, false otherwise.
 * @param board
 * @returns {boolean}
 */
function isFull(board) {
    var isFull = true;

    for (var row = 0; row < 3 && isFull; row++) {
        for (var col = 0; col < 3 && isFull; col++ ) {
            if(board[row][col] === null) {
                isFull = false;
            }
        }
    }

    return isFull;
}

/**
 * Returns all the positions occupying a full row.  Null if there are none.
 * @param positions
 * @returns {array|null}
 */
function sameRow(positions) {
    var row1 = positions.filter(function(ary) {
        return parseInt(ary[ROW_INDEX]) === 0;
    });

    var row2 = positions.filter(function(ary) {
        return parseInt(ary[ROW_INDEX]) === 1;
    });

    var row3 = positions.filter(function(ary) {
        return parseInt(ary[ROW_INDEX]) === 2;
    });

    if (row1.length === 3) {
        return row1;
    } else if (row2.length === 3) {
        return row2;
    } else if (row3.length === 3) {
        return row3;
    } else {
        return null;
    }
}

/**
 * Returns all the positions occupying a full column.  Null if there are none.
 * @param positions
 * @returns {array|null}
 */
function sameColumn(positions) {
    var col1 = positions.filter(function(ary) {
        return parseInt(ary[COLUMN_INDEX]) === 0;
    });

    var col2 = positions.filter(function(ary) {
        return parseInt(ary[COLUMN_INDEX]) === 1;
    });

    var col3 = positions.filter(function(ary) {
        return parseInt(ary[COLUMN_INDEX]) === 2;
    });

    if (col1.length === 3) {
        return col1;
    } else if (col2.length === 3) {
        return col2;
    } else if (col3.length === 3) {
        return col3;
    } else {
        return null;
    }
}

/**
 * Returns all the positions occupying a full diagonal.  Null if there are none.
 * @param positions
 * @returns {array|null}
 */
function sameDiagonal(positions) {
    var diag1 = positions.filter(function(ary) {
        return (
            (parseInt(ary[ROW_INDEX]) === 0 && parseInt(ary[COLUMN_INDEX]) === 0) ||
            (parseInt(ary[ROW_INDEX]) === 1 && parseInt(ary[COLUMN_INDEX]) === 1) ||
            (parseInt(ary[ROW_INDEX]) === 2 && parseInt(ary[COLUMN_INDEX]) === 2) );
    });

    var diag2 = positions.filter(function(ary) {
        return (
            (parseInt(ary[ROW_INDEX]) === 0 && parseInt(ary[COLUMN_INDEX]) === 2) ||
            (parseInt(ary[ROW_INDEX]) === 1 && parseInt(ary[COLUMN_INDEX]) === 1) ||
            (parseInt(ary[ROW_INDEX]) === 2 && parseInt(ary[COLUMN_INDEX]) === 0) );
    });

    if (diag1.length === 3) {
        return diag1;
    } else if (diag2.length === 3) {
        return diag2;
    } else {
        return null;
    }
}

module.exports = {
    miniMax: miniMax,
    getGameStatus: getGameStatus
};



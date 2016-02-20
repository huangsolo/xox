'use-strict'

var React = window.React = require('react'),
    ReactDOM = require("react-dom"),
    mountNode = document.getElementById("app"),
    Section = require("./gameboard/Section"),
    consts = require("./constants"),
    util = require("./util"),
    update = require("react-addons-update"),
    GameOverMessage = require("./gameboard/GameOverMessage");

var GameBoard = React.createClass({
    getInitialState: function() {
        return {
            board: {
                0: {0: null, 1: null, 2: null},
                1: {0: null, 1: null, 2: null},
                2: {0: null, 1: null, 2: null}
            },
            turn: consts.PlAYER_OPPONENT,
            winningPositions: [],
            gameOver: false,
            score: 0
        };
    },

    /**
     * Updates the board with the opponent's move.
     * @param xPosition
     * @param yPosition
     */
    onOpponentMove: function(xPosition, yPosition) {
        var board = this.state.board;
        board[xPosition][yPosition] = consts.PlAYER_OPPONENT;
        this.setState({ board: board, turn: consts.PLAYER_SELF });

        if(!this.confirmGameOver()) {
            var _this = this;
            setTimeout(function () {
                _this.makeMyMove();
            }, 1000);
        }
    },

    /**
     * Calculates and make my move based on the current board.
     */
    makeMyMove: function() {
        var board = this.state.board;
        var result = util.miniMax(consts.PLAYER_SELF, board, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
        board[result.position[0]][result.position[1]] = consts.PLAYER_SELF;
        this.setState({ board: board });
        if (!this.confirmGameOver()) {
            this.setState({ turn: consts.PlAYER_OPPONENT });
        }
    },

    /**
     * Checks if the game is over based on the current board and updates the state values accordingly.
     * @returns {boolean}
     */
    confirmGameOver: function() {
        var gameStatus = util.getGameStatus(this.state.board);
        if (gameStatus.winningPositions) {
            this.setState({ winningPositions: gameStatus.winningPositions });
        }
        if (gameStatus.gameOver) {
            this.setState({
                gameOver: gameStatus.gameOver,
                score: gameStatus.score,
                turn: consts.PLAYER_SELF
            });
        }
        return gameStatus.gameOver;
    },

    render: function() {
        var _this = this;
        // Dynamically generate each section of the board.
        var rows = Object.keys(this.state.board).map(function(row) {
            var columns = Object.keys(_this.state.board[row]).map(function(col) {
                // Check if the current position is a winning position.
                var win = _this.state.winningPositions.filter(function(ary) {
                    return ary[0] === row && ary[1] === col;
                });

                return (
                    <Section
                        key={'col-' + col}
                        xPosition={row}
                        yPosition={col}
                        onOpponentMove={_this.onOpponentMove}
                        player={_this.state.board[row][col]}
                        turn={_this.state.turn}
                        win={win.length > 0}
                    />
                )
            });
            return <div key={'row-' + row}>{columns}</div>;
        });

        return (
            <div>
                {this.state.gameOver ? <GameOverMessage score={ this.state.score }/> : null}
                <div className='board'>{rows}</div>
            </div>
        )
    }
});

ReactDOM.render(<GameBoard />, mountNode);


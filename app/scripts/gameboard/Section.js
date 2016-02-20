'use strict';

var React = require('react');
var consts = require('../constants');

/**
 * Represents a section on the game board.
 */
var Section = React.createClass({
    getInitialState: function() {
        return { player: this.props.player, turn: this.props.turn };
    },

    /**
     * Update the state from the props.
     * @param nextProps
     */
    componentWillReceiveProps: function(nextProps) {
        this.setState({ player: nextProps.player, turn: nextProps.turn });
    },

    handleOnClick: function () {
        // Handle only when there is no player on this section and it is the opponent's turn
        if (!this.state.player && this.state.turn === consts.PlAYER_OPPONENT) {
            this.props.onOpponentMove(this.props.xPosition, this.props.yPosition);
        }
    },

    /**
     * Displays X or O
     * @returns {*}
     */
    displayMark: function() {
        if (this.props.player === consts.PlAYER_OPPONENT) {
            return <span className='label'>X</span>;
        } else if (this.props.player === consts.PLAYER_SELF) {
            return <span className='label'>O</span>;
        } else {
            return null;
        }
    },

    render: function () {
        return (
            <span className={'section ' + (this.props.win? ' win': '')}
                  onClick={this.handleOnClick} >{this.displayMark()}</span>
        );
    }
});

module.exports = Section;

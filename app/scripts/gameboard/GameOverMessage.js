'use strict';

var React = require('react');

var GameOverMessage = React.createClass({
    render: function() {
        var message = 'No winners.';

        if (this.props.score === 1) {
            message = 'You lost.';
        } else if (this.props.score === -1) {
            message = 'You won!';
        }

        return (
            <div>
                <div><h2><span className='label label-default'>Game Over</span></h2></div>
                <div><h4>{message}</h4></div>
            </div>
        )
    }
});

module.exports = GameOverMessage;

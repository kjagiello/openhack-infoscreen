import React, { Component } from 'react';
import './Carousel.css';

export default class Carousel extends Component {
    constructor(props) {
        super(props);
        this.state = {active: 0};
    }

    componentWillReceiveProps(props) {
    }

    componentDidMount() {
        this._timer = setInterval(this.rotate.bind(this), this.props.delay || 5000);
    }

    componentWillUnmount() {
        clearInterval(this._timer);
    }

    rotate() {
        this.setState({active: (this.state.active + 1) % this.props.children.length});
    }

    activeClass(id) {
        return this.state.active === id ? 'Carousel-child-active' : null;
    }

    render() {
        return (
            <div className="Carousel">
                {this.props.children.map((child, i) =>
                    <div className={this.activeClass(i)} key={child.props.id}>{child}</div>
                )}
                <div className="Carousel-hashtags">#{process.conf.HASHTAG}</div>
            </div>
        );
    }
}

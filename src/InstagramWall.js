import React, { Component } from 'react';
import { Flex } from 'reflexbox';
import fetchJsonp from 'fetch-jsonp';
import timeago from 'timeago.js';

import './InstagramWall.css';

class InstagramPhoto extends Component {
    render() {
        const basis = this.props.basis;
        const style = {
            backgroundImage: `url(${this.props.url})`,
            flexBasis: `${basis}px`
        };
        // The timestamp is in seconds and we need milliseconds
        const date = timeago().format(this.props.date * 1000);
        return (
            <div className={`InstagramPhoto`} style={style}>
                <div className="InstagramPhoto-details">
                    <div className="InstagramPhoto-author">{this.props.author}</div>
                    <div className="InstagramPhoto-date">{date}</div>
                </div>
            </div>
        );
    }
}

class HashtagTile extends Component {
    render() {
        const { basis, hashtag } = this.props;
        const style = {
            background: '#363942',
            flexBasis: `${basis}px`
        };
        return(
            <Flex className={`InstagramPhoto`} style={style} align="center" justify="center">
                <div className="hashtag" >#{hashtag}</div>
            </Flex>
        );
    }
}

export default class InstagramWall extends Component {
    constructor(props) {
        super(props);
        this.state = {posts: []};
    }

    componentDidMount() {
        const { interval } = this.props;
        this.timer = setInterval(this.fetchData.bind(this), interval || 30000);
        this.fetchData();
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    fetchData() {
        const { token, hashtag } = this.props;
        const limit = this.props.limit || 8;
        const url = `https://api.instagram.com/v1/tags/${hashtag}/` +
                    `media/recent?access_token=${token}`;
        fetchJsonp(url)
            .then(response => response.json())
            .then(data => data.data.slice(0, limit))
            .then(posts => posts.map(post => {
                return {
                    id: post.id,
                    url: post.images.standard_resolution.url,
                    author: post.user.full_name,
                    date: post.created_time
                };
            }))
            .then(posts => this.setState({posts: posts}));

    }

    render() {
        const basis = this.props.basis || 400;
        const {hashtag} = this.props;
        return (
            <Flex auto wrap={true}>
                {this.state.posts.map(p => <InstagramPhoto {...p} key={p.id} basis={basis} />)}
                <HashtagTile basis={basis} hashtag={hashtag} />
            </Flex>
        );
    }
}

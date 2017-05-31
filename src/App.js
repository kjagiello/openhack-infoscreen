import React, { Component } from 'react';
import { Flex } from 'reflexbox';

import './App.css';

import Calendar from './Calendar';
import InstagramWall from './InstagramWall';

class App extends Component {
    render() {
        return (
            <div className="App">
                <Flex column>
                    <Flex flexAuto align="stretch">
                        <Flex column pl={1} pt={1} pb={1}>
                            <Calendar ical={process.conf.ICAL_URL} />
                            <div className="midnight-container">
                                <div className="midnight-time">00:00</div>
                                <div className="midnight-text">MIDNIGHT SUPRISE</div>
                            </div>
                        </Flex>
                        <Flex className="App-media" auto ml={1} pl={1} pb={1}>
                            <InstagramWall
                                token={process.conf.INSTAGRAM_TOKEN}
                                hashtag={process.conf.HASHTAG}
                            />
                        </Flex>
                    </Flex>
                </Flex>
            </div>
        );
    }
}

export default App;

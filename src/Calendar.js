import React, { Component } from 'react';

import BigCalendar from 'react-big-calendar';
import ICAL from 'ical.js';
import moment from 'moment';

import './Calendar.css';
import 'moment/locale/en-gb';
import 'react-big-calendar/lib/css/react-big-calendar.css';

BigCalendar.setLocalizer(
    BigCalendar.momentLocalizer(moment)
);

export default class Calendar extends Component {
    constructor(props) {
        super(props);
        this.state = {events: []};
    }

    componentDidMount() {
        const { interval } = this.props;
        this.timer = setInterval(this.fetchData.bind(this), interval || 60000);
        this.fetchData();
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    fetchData() {
        fetch(this.props.ical)
            .then(response => response.text())
            .then(body => {
                var data = ICAL.parse(body);
                var comp = new ICAL.Component(data);
                var events = comp.getAllSubcomponents('vevent')
                    .map(ev => new ICAL.Event(ev))
                    .filter(ev => ev.startDate.toJSDate().getHours() < 23)
                    .map(ev => {
                        return {
                            title: ev.summary,
                            start: ev.startDate.toJSDate(),
                            end: ev.endDate.toJSDate(),
                            desc: ev.description
                        };
                    });
                this.setState({events: events});
            });
    }

    eventStyle(ev, start, end, isSelected) {
        if (ev.desc) {
            const normalizedClass = ev.desc.toLowerCase();
            return {
                className: `event-${normalizedClass}`
            };
        }
        return {};
    }

    render() {
        return (
            <BigCalendar
                culture='en-gb'
                events={this.state.events}
                defaultView='day'
                toolbar={false}
                selectable={false}
                ignoreEvents={true}
                defaultDate={new Date(2017, 5, 3, 13, 0, 0)}
                eventPropGetter={this.eventStyle.bind(this)}
                min={new Date(2017, 5, 3, 8)}
                max={new Date(2017, 5, 3, 20)}
            />
        );
    }
}

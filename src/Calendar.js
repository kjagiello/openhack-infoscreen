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
        this.state = {events: [], date: new Date()};
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
                this.setState({events: events, date: new Date()});
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
        const minDate = new Date(this.state.date);
        minDate.setHours(8);
        minDate.setMinutes(0);
        minDate.setSeconds(0);
        const maxDate = new Date(this.state.date);
        maxDate.setHours(21);
        maxDate.setMinutes(0);
        maxDate.setSeconds(0);
        return (
            <BigCalendar
                culture='en-gb'
                events={this.state.events}
                defaultView='day'
                toolbar={false}
                selectable={false}
                ignoreEvents={true}
                defaultDate={this.state.date}
                eventPropGetter={this.eventStyle.bind(this)}
                min={minDate}
                max={maxDate}
            />
        );
    }
}

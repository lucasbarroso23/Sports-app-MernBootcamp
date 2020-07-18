import React, { useEffect, useState } from 'react';
import api from "../../services/api";
import moment from 'moment';
import { Button, ButtonGroup } from 'reactstrap'
import './dashboard.css';

//Dashboard will show all the events
export default function Dashboard( {history} ) {
    const [events, setEvents] = useState([]);
    const user_id = localStorage.getItem('user');
    const [cSelected, setCSelected] = useState([]);
    const [rSelected, setRSelected] = useState(null);

    useEffect(() => {
        getEvents()
    }, [])

    const filterHandler = async (query) => {
        setRSelected(query);
        getEvents(query);
    }

    const myEventsHandler = async () => {
        setRSelected('myevents')
        const response = await api.get('/user/events', { headers: {user_id} });
        setEvents(response.data)
    }

    const getEvents = async (filter) => {
        const url = filter ? `/dashboard/${filter}` : '/dashboard'
        const response = await api.get(url, { headers: { user_id } });

        setEvents(response.data)
    };

    console.log(events)
    return (
        <>
            <div className="filter-panel">
            <ButtonGroup>
                    <Button color="primary" onClick={() => filterHandler(null)} active={rSelected === null}>All sports</Button>
                    <Button color="primary" onClick={myEventsHandler} active={rSelected === "myevents"}>My events</Button>
                    <Button color="primary" onClick={() => filterHandler("running")} active={rSelected === "running"}>Running</Button>
                    <Button color="primary" onClick={() => filterHandler("cycling")} active={rSelected === "cycling"}>Cycling</Button>
                    <Button color="primary" onClick={() => filterHandler("swimming")} active={rSelected === "swimming"}>swimming</Button>
            </ButtonGroup>
            <Button color="success" onClick={() => history.push('/events')}>Create event</Button>
            </div>
            <ul className="events-list">
                {events.map(event => (
                    <li key={event._id}>
                        <header style={{ backgroundImage: `url(${event.thumbnail_url})` }} />
                        <strong>{event.title}</strong>
                        <span>Event date: {moment(event.date).format('l')}</span>
                        <span>Event price: {parseFloat(event.price).toFixed(2)}</span>
                        <span>Event description: {event.description}</span>
                        <Button color="primary">Subscribe</Button>
                    </li>
                ))}
            </ul>
        </>
    )
}
import React, { useEffect, useState } from 'react';
import api from "../../services/api";
import moment from 'moment';
import { Button, ButtonGroup, Alert } from 'reactstrap'
import './dashboard.css';

//Dashboard will show all the events
export default function Dashboard({ history }) {
    const [events, setEvents] = useState([]);
    const user = localStorage.getItem('user');
    const user_id = localStorage.getItem('user_id');
    const [rSelected, setRSelected] = useState(null);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        getEvents()
    }, [])

    const filterHandler = async (query) => {
        setRSelected(query);
        getEvents(query);
    }

    const myEventsHandler = async () => {
        try {
            setRSelected('myevents')
            const response = await api.get('/user/events', { headers: { user: user } });
            setEvents(response.data.events)
            
        } catch (error) {
            history.push('/login');
        }
    }

    const getEvents = async (filter) => {
        try {
            const url = filter ? `/dashboard/${filter}` : '/dashboard'
            const response = await api.get(url, { headers: { user: user } });
            setEvents(response.data.events)            
        } catch (error) {
            history.push('/login');
        }
    };

    const deleteEventHandle = async (eventId) => {
        try {
            await api.delete(`event/${eventId}`, { headers: { user: user } });
            setSuccess(true)
            setTimeout(() => {
                setSuccess(false)
                filterHandler(null)                
            }, 3000)
        }           
        catch (error) {
            setError(true)
            setTimeout(() => {
                setError(false)
            }, 2000)
        }
    }

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
                        <header style={{ backgroundImage: `url(${event.thumbnail_url})` }} >
                            {event.user === user_id ? <div><Button color="danger" size='sm' onClick={() => deleteEventHandle(event._id)}>Delete</Button></div> : ""}
                        </header>
                        <strong>{event.title}</strong>
                        <span>Event date: {moment(event.date).format('l')}</span>
                        <span>Event price: {parseFloat(event.price).toFixed(2)}</span>
                        <span>Event description: {event.description}</span>
                        <Button color="primary">Subscribe</Button>
                    </li>
                ))}
            </ul>
                {error ? (
                    <Alert className="event-validation" color="danger">Error when deleting event</Alert>
                ) : ""}
                {success ? (
                    <Alert className="event-validation" color="success">The event was deleted sucessfuly</Alert>
                ) : ""}
        </>
    )
}
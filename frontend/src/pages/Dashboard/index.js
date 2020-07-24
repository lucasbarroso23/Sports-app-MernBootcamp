import React, { useEffect, useState, useMemo } from 'react';
import api from "../../services/api";
import moment from 'moment';
import { Button, ButtonGroup, Alert, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap'
import socketio from 'socket.io-client';
import './dashboard.css';

//Dashboard will show all the events
export default function Dashboard({ history }) {

    const [events, setEvents] = useState([]);
    const user = localStorage.getItem('user');
    const user_id = localStorage.getItem('user_id');

    const [rSelected, setRSelected] = useState(null);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [messageHandler, setMessageHandler] = useState('');
    const [eventsRequest, setEventsRequest] = useState([]);
    const [dropDownOpen, setDropDownOpen] = useState(false);
    const [eventRequestMessage, setEventRequestMessage] = useState('');
    const [eventRequestSuccess, setEventRequestSuccess] = useState(false);

    const toggle = () => setDropDownOpen(!dropDownOpen)

    useEffect(() => {
        getEvents()
    }, [])

    const socket = useMemo(
        () =>
            socketio('http://localhost:8000/', { query: { user: user_id } }),
        [user_id]
    );

    useEffect(() => {
        socket.on('registration_request', data => setEventsRequest([...eventsRequest, data]));
    }, [eventsRequest, socket])

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
            setMessageHandler('The event was deleted sucessfuly')
            setTimeout(() => {
                setSuccess(false)
                filterHandler(null)
                setMessageHandler('')
            }, 3000)
        }
        catch (error) {
            setError(true)
            setMessageHandler('Error when deleting event')
            setTimeout(() => {
                setError(false)
                setMessageHandler('')
            }, 2000)
        }
    }

    const regitrationRequestHandler = async (event) => {
        try {
            await api.post(`/registration/${event.id}`, {}, { headers: { user } })

            setSuccess(true)
            setMessageHandler(`The request to the event ${event.title} was succesfully`)
            setTimeout(() => {
                setSuccess(false)
                filterHandler(null)
                setMessageHandler('')
            }, 3000)

        } catch (error) {
            setError(true)
            setMessageHandler(`The request to the event ${event.title} wasn't succesfully`)
            setTimeout(() => {
                setError(false)
                setMessageHandler('')
            }, 2000)
        }
    }

    const acceptEventHandler = async (eventId) => {
        try {
            await api.post(`/registration/${eventId}/approvals`, {}, { headers: { user } })
            setEventRequestSuccess(true)
            setEventRequestMessage('Event approved successfully!');
            setTimeout(() => {
                setError(false)
                setMessageHandler('')
            }, 2000)
        } catch (err) {
            console.log(err)
        }
    }

    console.log(events)
    return (
        <>
            <ul className="notifications">
                {eventsRequest.map(request => {
                    console.log(request)
                    return (
                        <li key={request._id}>
                            <div>
                                <strong>{request.user.email}</strong> is requesting to register to your event
                            <strong>{request.event.title}</strong>
                            </div>
                            <ButtonGroup>
                                <Button color="success" onClick={() => acceptEventHandler(request._id)}>Accept</Button>
                                <Button color="danger" onClick={() => { }}>Reject</Button>
                            </ButtonGroup>
                        </li>
                    )
                })}
            </ul>
            {eventRequestSuccess ? <Alert className="event-validation" color="success">{eventRequestMessage}</Alert> : ""}
            <div className="filter-panel">
                <Dropdown isOpen={dropDownOpen} toggle={toggle}>
                    <DropdownToggle color="primary" caret>
                        filter
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem onClick={() => filterHandler(null)} active={rSelected === null}>All Sports</DropdownItem>
                        <DropdownItem onClick={myEventsHandler} active={rSelected === "myevents"}>My events</DropdownItem>
                        <DropdownItem onClick={() => filterHandler("running")} active={rSelected === "running"}>Running</DropdownItem>
                        <DropdownItem onClick={() => filterHandler("cycling")} active={rSelected === "cycling"}>Cycling</DropdownItem>
                        <DropdownItem onClick={() => filterHandler("swimming")} active={rSelected === "swimming"}>Swimming</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
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
                        <Button color="primary" onClick={() => regitrationRequestHandler(event)}>Register</Button>
                    </li>
                ))}
            </ul>
            {error ? (
                <Alert className="event-validation" color="danger">{messageHandler}</Alert>
            ) : ""}
            {success ? (
                <Alert className="event-validation" color="success">{messageHandler}</Alert>
            ) : ""}
        </>
    )
}
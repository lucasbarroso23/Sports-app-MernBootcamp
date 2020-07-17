import React, {useEffect, useState} from 'react';
import api from "../../services/api";
import moment from 'moment';
import './dashboard.css';
//Dashboard will show all the events
export default function Dashboard(){
    const [events, setEvents] = useState([]);
    const user_id = localStorage.getItem('user');

    useEffect(() => {
        getEvents()
    }, [])

    const getEvents = async (filter) => {
        const url = filter ? `/dashboard/${filter}` : '/dashboard'
        const response = await api.get(url, {headers: { user_id }});

        setEvents(response.data)
    };

    console.log(events)
    return (
        <ul className="events-list">
            {events.map(event => (
                <li key={event._id}>
                    <header style={{ backgroundImage: `url(${event.thumbnail_url})`}} />
                    <strong>{event.title}</strong>
                    <span>{moment(event.date).format('DD/MM/YYYY')}</span>
                    <span>{event.price}</span>
                    <span>{event.description}</span>

                </li>
            ))}
        </ul>
    )
}
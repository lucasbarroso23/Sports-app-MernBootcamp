import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Login from './pages/Login/'
import Dashboard from './pages/Dashboard/'
import Register from './pages/Register/'
import EventsPage from './pages/EventsPage'
import TopNav from './components/TopNav'
import MyRegistration from './pages/MyRegistrations'


export default function Routes() {
    return (
        <BrowserRouter>
            <TopNav />
            <Switch>
                <Route path='/' exact component={Dashboard} />
                <Route path='/myregistrations' exact component={MyRegistration} />
                <Route path='/login' exact component={Login} />
                <Route path='/register' exact component={Register} />
                <Route path='/events' exact component={EventsPage} />
            </Switch>
        </BrowserRouter>
    )
}
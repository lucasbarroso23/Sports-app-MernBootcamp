import React, { useState, useMemo, useEffect } from 'react';
import api from '../../services/api';
import { Button, Form, FormGroup, Input, Container, Label, Alert, ButtonDropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import CameraIcon from '../../assets/camera.png'
import "./events.css";

export default function EventsPage({ history }) {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [thumbnail, setThumbnail] = useState(null);
    const [date, setDate] = useState("");
    const [sport, setSport] = useState("Sport");
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [dropdownOpen, setOpen] = useState(false);
    const user = localStorage.getItem('user');

    useEffect(() => {
        if(!user) history.push('./login')
    }, [])

    const toggle = () => setOpen(!dropdownOpen);

    const preview = useMemo(() => {
        return thumbnail ? URL.createObjectURL(thumbnail) : null;
    }, [thumbnail])


    const submitHandler = async (evt) => {
        evt.preventDefault()
        const user = localStorage.getItem('user');
        const eventData = new FormData();

        eventData.append("thumbnail", thumbnail)
        eventData.append("sport", sport)
        eventData.append("title", title)
        eventData.append("description", description)
        eventData.append("date", date)
        eventData.append("price", price)

        try {

            if (title !== "" &&
                description !== "" &&
                sport !== "Sport" &&
                date !== "" &&
                price !== "" &&
                thumbnail !== null
            ) {
                await api.post("/event", eventData, { headers: { user } })
                setSuccess(true)
                setTimeout(() => {
                    setSuccess(false)
                    history.push("/")
                }, 2000)
            } else {
                setError(true)
                setTimeout(() => {
                    setError(false)
                }, 2000)
            }
        } catch (error) {
            Promise.reject(error);
            console.log(error.message)
        }
        evt.preventDefault()
        return ""
    }

    const sportEventHandler = (sport) => setSport(sport);
    console.log(sport)
    return (
        <Container>
            <h2>Create your event</h2>
            <Form onSubmit={submitHandler}>
                <div className="input-group">
                    <FormGroup>
                        <Label>Upload Image: </Label>
                        <label id="thumbnail" style={{ backgroundImage: `url(${preview})` }} className={thumbnail ? 'has-thumbnail' : ''}>
                            <Input type="file" onChange={(evt) => setThumbnail(evt.target.files[0])} />
                            <img src={CameraIcon} style={{ maxWidth: "50px " }} alt="upload icon image" />
                        </label>
                    </FormGroup>
                    <FormGroup>
                        <Label>Title: </Label>
                        <Input id="title" type="text" value={title} placeholder={'Event title'}
                            onChange={(evt) => setTitle(evt.target.value)} />
                    </FormGroup>
                    <FormGroup>
                        <Label>Event Description: </Label>
                        <Input id="description" type="text" value={description} placeholder={'Event description'}
                            onChange={(evt) => setDescription(evt.target.value)} />
                    </FormGroup>
                    <FormGroup>
                        <Label>Event price: </Label>
                        <Input id="price" type="text" value={price} placeholder={'Event price R$00.00'}
                            onChange={(evt) => setPrice(evt.target.value)} />
                    </FormGroup>
                    <FormGroup>
                        <Label>Event date: </Label>
                        <Input id="date" type="date" value={date}
                            onChange={(evt) => setDate(evt.target.value)} />
                    </FormGroup>
                    <FormGroup>
                        <ButtonDropdown isOpen={dropdownOpen} toggle={toggle}>
                            <Button id="caret" value={sport} disabled>{sport}</Button>
                            <DropdownToggle caret />
                            <DropdownMenu>
                                <DropdownItem onClick={() => sportEventHandler('running')}>running</DropdownItem>
                                <DropdownItem onClick={() => sportEventHandler('cycling')}>cycling</DropdownItem>
                                <DropdownItem onClick={() => sportEventHandler('swimming')}>swimming</DropdownItem>
                            </DropdownMenu>
                        </ButtonDropdown>
                    </FormGroup>
                </div>
                <FormGroup>
                    <Button className="submit-btn" >
                        Submit
                    </Button>
                </FormGroup>
                <FormGroup>
                    <Button className="secondary-btn" onClick={() => history.push("/")}>
                        Cancel
                    </Button>
                </FormGroup>
            </Form>
            {error ? (
                <Alert className="event-validation" color="danger">Missing required information</Alert>
            ) : ""}
            {success ? (
                <Alert className="event-validation" color="success">The event was created sucessfuly</Alert>
            ) : ""}
        </Container>
    )
}
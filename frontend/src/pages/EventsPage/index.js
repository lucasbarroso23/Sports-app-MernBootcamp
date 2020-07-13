import React, { useState, useMemo } from 'react';
import api from '../../services/api';
import { Button, Form, FormGroup, Input, Container, Label, Alert } from 'reactstrap';
import CameraIcon from '../../assets/camera.png'
import "./events.css";

export default function EventsPage() {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [thumbnail, setThumbnail] = useState(null);
    const [date, setDate] = useState("");
    const [sport, setSport] = useState("");
    const [ errorMessage, setErrorMessage ] = useState(false);

    const preview = useMemo(() => {
        return thumbnail ? URL.createObjectURL(thumbnail) : null;
    }, [thumbnail])


    const submitHandler = async (evt) => {

        const user_id = localStorage.getItem('user');

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
                sport !== "" &&
                date !== "" &&
                price !== "" &&
                thumbnail !== null
            ) {
                console.log("Event has been sent")
                await api.post("/event", eventData, { headers: { user_id } })
                console.log(eventData)
                console.log("event has been saved")
            }else {
                setErrorMessage(true)
                setTimeout(() => {
                    setErrorMessage(false)
                }, 2000)

                console.log("Missed required data")
            }
        } catch (error) {
            Promise.reject(error);
            console.log(error.message)
        }


        evt.preventDefault()
        return ""
    }

    return (
        <Container>
            <h2>Create your event</h2>
            <Form onSubmit={submitHandler}>
                <FormGroup>
                    <Label>Upload Image: </Label>
                    <label id="thumbnail" style={{ backgroundImage: `url(${preview})` }} className={thumbnail ? 'has-thumbnail' : ''}>
                        <Input type="file" onChange={(evt) => setThumbnail(evt.target.files[0])} />
                        <img src={CameraIcon} style={{ maxWidth: "50px " }} alt="upload icon image" />
                    </label>
                </FormGroup>
                <FormGroup>
                    <Label>Sport: </Label>
                    <Input id="sport" type="text" value={sport} placeholder={'Sport name'}
                        onChange={(evt) => setSport(evt.target.value)} />
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
                <Button type="submit" >
                    Create Event
                </Button>
            </Form>
            {errorMessage ? (
                <Alert className="event-validation" color="danger">Missing required information</Alert>
            ) : ""}
        </Container>
    )
}
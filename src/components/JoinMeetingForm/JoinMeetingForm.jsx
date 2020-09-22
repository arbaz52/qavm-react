import { ErrorMessage, Field, Form, Formik } from 'formik'
import React, { useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Button, FormGroup, Input, Label } from 'reactstrap'
import * as yup from 'yup'
import { UserContext } from '../../App'
import JoinMeetingPage from '../../pages/JoinMeetingPage/JoinMeetingPage'

const JoinMeetingForm = () => {

    const history = useHistory()
    const { setAskForUsername, username } = useContext(UserContext)
    const initialValues = {
        link: ""
    }
    const validationSchema = yup.object({
        link: yup.string().required()
    })
    const onSubmit = ({ link }) => {
        console.log("joining meeting!")
        // joinMeeting(link)
        window.location.href = link
    }
    useEffect(() => {
        if (!username)
            setAskForUsername(true)
    }, [])
    return (
        <>

            <section className="row justify-content-center align-items-center my-5">
                <div className="py-5 col-sm-12 col-md-6">
                    <img src="undraw_online_connection_6778.svg" alt="" className="img-fluid" />
                </div>
                <div className="py-5 col-sm-12 col-md-6">
                    <h1>
                        <strong>
                            Join a meeting!
                    </strong>
                    </h1>
                    <p className="text-muted">Did someone share a link with you to connect with them through this sweet website?</p>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={onSubmit}>
                        <Form>
                            <FormGroup>
                                <Label>
                                    Invite link?
                                </Label>
                                <Field as={Input} name="link" />
                                <ErrorMessage name="link">{msg => <div className="alert alert-danger">{msg}</div> }</ErrorMessage>
                            </FormGroup>
                            <FormGroup className="text-right">
                                <Button color="primary">Join Meeting!</Button>
                            </FormGroup>
                        </Form>
                    </Formik>
                </div>
            </section>
        </>
    )
}

export default JoinMeetingForm
import { ErrorMessage, Field, Form, Formik } from 'formik'
import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Button, FormGroup, Input, Label } from 'reactstrap'
import * as yup from 'yup'
import { UserContext } from '../../App'

const HostMeetingForm = () => {
    const history = useHistory()
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const { setAskForUsername, username, hostMeeting } = useContext(UserContext)
    const initialValues = {
        title: ""
    }
    const validationSchema = yup.object({
        title: yup.string().required()
    })
    const onSubmit = ({ title }) => {
        console.log("host meeting!")
        setLoading(true)
        setError(null)
        hostMeeting(title)
        .then( res => {
            console.log(res)
            setLoading(false)
            history.push("./meeting/"+res._id)
        })
        .catch(err => {
            console.error(err)        
            setLoading(false)
            setError(err)
        })
        .finally()
    }
    useEffect(() => {
        if (!username)
            setAskForUsername(true)
    }, [])
    return (
        <>

            <section className="row justify-content-center align-items-center my-5">
                <div className="py-5 col-sm-12 col-md-6">
                    <img src="undraw_shared_workspace_hwky.svg" alt="" className="img-fluid" />
                </div>
                <div className="py-5 col-sm-12 col-md-6">
                    <h1>
                        <strong>
                            Host a meeting!
                    </strong>
                    </h1>
                    <p className="text-muted">Let's start connecting with people that matter!</p>

                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={onSubmit}>
                        <Form>
                            <FormGroup>
                                <Label>
                                    Title for this meeting
                                </Label>
                                <Field as={Input} name="title" />
                                <ErrorMessage name="title">{msg => <div className="alert alert-danger mt-2">{msg}</div> }</ErrorMessage>
                            </FormGroup>
                            <FormGroup className="text-right">
                                <Button color="primary" disabled={loading}>Start Meeting!</Button>
                            </FormGroup>
                        </Form>
                    </Formik>
                    {error && <div className="alert alert-danger mt-2">{error}</div>}
                </div>
            </section>
        </>
    )
}

export default HostMeetingForm
import { ErrorMessage, Field, Form, Formik } from 'formik'
import React, { useContext, useEffect, useState } from 'react'
import { Button, FormGroup, Input, Label, Modal, ModalBody, ModalHeader } from 'reactstrap'
import { UserContext } from '../../App'
import * as yup from 'yup'

const ModalUsername = () => {
    const [loading, setLoading] = useState(false)

    const { username, logout, askForUsername, setAskForUsername, login } = useContext(UserContext)
    const initialValues = {
        username: ""
    }
    const validationSchema = yup.object({
        username: yup.string().required()
    })
    const onSubmit = ({username}) => {
        console.log(username)
        setLoading(true)
        login(username)
        .then(res => {
            setLoading(false)
            setAskForUsername(false)
        })
        .catch(err => {
            setLoading(false)
        })
        .finally()
    }
    return (

        <Modal isOpen={askForUsername} centered>
            <ModalHeader>
                Let's get started!
          </ModalHeader>
            <ModalBody>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}>
                    <Form>
                        <FormGroup className="">
                            <Label>What should i call you?</Label>
                            <Field as={Input} name="username" />
                            <ErrorMessage name="username">{msg => <div className="alert alert-danger mt-2">{msg}</div>}</ErrorMessage>
                        </FormGroup>
                        <FormGroup className="text-right">
                            <Button color="" type="button"  disabled={loading} onClick={e => setAskForUsername(false)}>Cancel</Button> {' '}
                            <Button color="primary" type="submit" disabled={loading}>Let's get started!</Button>
                        </FormGroup>
                    </Form>
                </Formik>

            </ModalBody>
        </Modal>
    )

}

export default ModalUsername

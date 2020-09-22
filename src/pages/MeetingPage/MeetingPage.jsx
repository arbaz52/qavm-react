import React, { useContext, useEffect, useRef, useState } from 'react'
import { getAuthHeader, HeaderContext, MeetingContext, UserContext } from '../../App'
import LocalParticipant from '../../components/LocalParticipant/LocalParticipant'
import ParticipantsList from '../../components/ParticipantsList/ParticipantsList'
import { Button, Input, InputGroup, InputGroupAddon, Spinner } from 'reactstrap'
import { AiOutlineSearch } from 'react-icons/ai'
import './MeetingPage.css'
import MeetingInfo from '../../components/MeetingInfo/MeetingInfo'
import ParticipantMiniVideo from '../../components/ParticipantMiniVideo/ParticipantMiniVideo'
// import { toast } from 'react-toastify'
import DailyIframe, { } from '@daily-co/daily-js'
import { toast } from 'react-toastify'
import axios from 'axios'
import { } from './../../App'
import { GrFormClose } from "react-icons/gr"

const EVENT_JOINING_MEETING = "joining-meeting"
const EVENT_JOINED_MEETING = "joined-meeting"
const EVENT_LEFT_MEETING = "left-meeting"

const EVENT_PARTICIPANT_JOINED = "participant-joined"
const EVENT_PARTICIPANT_UPDATED = "participant-updated"
const EVENT_PARTICIPANT_LEFT = "participant-left"

const EVENT_APP_MESSAGE = "app-message"




const MeetingPage = (props) => {
    const { match: { params } } = props
    const { meetingId } = params

    const { setShowHeader } = useContext(HeaderContext)
    const { username, setAskForUsername } = useContext(UserContext)
    const { getMeetingInfo } = useContext(MeetingContext)

    useEffect(() => {
        if (!username)
            setAskForUsername(true)
    }, [])
    const [meeting, setMeeting] = useState(null)
    useEffect(() => {
        if (!meetingId)
            return
        console.log("Loading user data", meetingId)
        getMeetingInfo(meetingId)
            .then(res => {
                console.log(res)
                setMeeting(res)
            })
            .catch(err => {
                console.error(err)
            })
            .finally(() => {

                setShowHeader(false)
            })


    }, [meetingId])

    const [callObject, setCallObject] = useState(DailyIframe.createCallObject())
    useEffect(() => {
        if (username && meeting) {
            // setCallObject(DailyIframe.createCallObject())
            console.log("all good to go!")
        }
    }, [username, meeting])


    const [participants, setParticipants] = useState([])
    const [localParticipant, setLocalParticipant] = useState(null)
    useEffect(() => {
        console.log("par updated", participants)
        for (let _p of participants) {
            if (_p.local) {
                setLocalParticipant(_p)
            }
        }
    }, [participants])

    const [focusedParticipant, setFocusedParticipant] = useState(null)
    //using refs
    const videosWrapperRef = useRef(null)
    const focusParticipantRef = useRef(null)
    const videosHolderRef = useRef(null)


    const focus = (participant) => {
        videosWrapperRef.current.classList.remove("no-focus")
        focusParticipantRef.current.classList.remove("no-focus")
        videosHolderRef.current.classList.remove("no-focus")
        setFocusedParticipant(participant)
    }
    const unFocus = () => {

        videosWrapperRef.current.classList.add("no-focus")
        focusParticipantRef.current.classList.add("no-focus")
        videosHolderRef.current.classList.add("no-focus")
        setFocusedParticipant(null)
    }



    const loadParticipantInfo = (user_id) => {
        axios.get("https://qavm-server.herokuapp.com/users/callerId/" + user_id)
            .then((res) => {
                setParticipants(_part => {
                    return _part.map(_p => {
                        if (_p.user_id == user_id)
                            return { ..._p, ...res.data }
                        else
                            return _p
                    })
                })
                console.log(res)
            })
            .catch((err) => {
                console.log(err)
            })
            .finally()
    }

    useEffect(() => {
        if (username && callObject && meeting) {
            console.log('working', username)
            const handleCallObjectEvents = (e) => {
                console.log(e)
                switch (e.action) {
                    case EVENT_JOINED_MEETING:
                        toast.info(e.action.replace("-", " "))
                        callObject.setLocalAudio(false)
                        callObject.setLocalVideo(false)
                        let callerId = e.participants.local.user_id
                        //updating caller id
                        axios.put("https://qavm-server.herokuapp.com/users/callerId", { callerId }, { headers: getAuthHeader() })
                            .then(res => {
                                console.log(res)
                                setTimeout(() => {
                                    callObject.sendAppMessage({
                                        type: "update-my-info",
                                        by: callerId
                                    })
                                }, 3000)

                            })
                            .catch()
                            .finally()

                        setParticipants([
                            ...Object.keys(e.participants).map(
                                k => {
                                    setTimeout(() => {
                                        loadParticipantInfo(e.participants[k].user_id)
                                    }, 3000)
                                    return e.participants[k]
                                }
                            )
                        ])
                        break

                    case EVENT_JOINING_MEETING:
                        toast.info(e.action.replace("-", " ") + ", please wait!")
                        break

                    case EVENT_LEFT_MEETING:
                        toast.info(e.action.replace("-", " "))
                        break

                    case EVENT_APP_MESSAGE:
                        toast.info(e)
                        break

                    case EVENT_PARTICIPANT_JOINED:
                        toast.info(e.action.replace("-", " "))
                        setParticipants(_part => {

                            setTimeout(() => {
                                loadParticipantInfo(e.participant.user_id)
                            }, 3000)
                            return [
                                ..._part,
                                e.participant
                            ]
                        })
                        break

                    case EVENT_PARTICIPANT_LEFT:
                        toast.info(e.action.replace("-", " "))
                        setParticipants(_part => {
                            return [
                                ..._part.filter(_p => {
                                    return _p.user_id != e.participant.user_id
                                })
                            ]
                        })
                        break

                    case EVENT_PARTICIPANT_UPDATED:

                        setParticipants(_part => {
                            return [
                                ..._part.map(_p => {
                                    if (_p.user_id == e.participant.user_id) {
                                        if (!_p.username)
                                            setTimeout(() => {
                                                loadParticipantInfo(e.participant.user_id)
                                            }, 3000)

                                        return { ..._p, ...e.participant }
                                    } else
                                        return _p
                                })
                            ]
                        })
                        break

                }
            }
            let events = [EVENT_APP_MESSAGE, EVENT_JOINING_MEETING, EVENT_JOINED_MEETING, EVENT_LEFT_MEETING, EVENT_PARTICIPANT_JOINED, EVENT_PARTICIPANT_LEFT, EVENT_PARTICIPANT_UPDATED]
            for (let _event of events) {
                callObject.on(_event, handleCallObjectEvents)
            }

            callObject.join({ url: meeting.room.url })

            return function () {
                console.log("un binding")
                for (let _event of events) {
                    callObject.off(_event, handleCallObjectEvents)
                }
            }
        }
    }, [callObject, username, meeting])

    const toggleAudio = () => {
        console.log("toggleAudio")
        if (callObject) {
            callObject.setLocalAudio(!callObject.localAudio())
        }
    }
    const toggleVideo = () => {
        console.log("toggleVideo")
        if (callObject) {
            callObject.setLocalVideo(!callObject.localVideo())
        }
    }

    return (
        meeting ? (
            <div className='content'>
                <div className='left'>
                    {/* <h3 className="px-4 py-2">participants</h3> */}
                    <form className="search px-4 py-2 mt-1">
                        <InputGroup>
                            <Input type="search" placeholder="Search for participants..." bsSize="sm" />
                            <InputGroupAddon addonType="append" size="sm">
                                <Button color="primary" size="sm">
                                    <AiOutlineSearch />
                                </Button>
                            </InputGroupAddon>
                        </InputGroup>
                    </form>
                    <div className="participants px-4 py-2">

                        <ParticipantsList participants={
                            participants.filter(_p => {
                                // return search_p.username ? _p.username.includes(search) : true
                                return true
                            })
                        } />
                    </div>
                    <div className="local px-5 py-3">
                        <LocalParticipant {...localParticipant} toggleAudio={toggleAudio} toggleVideo={toggleVideo} />
                    </div>
                </div>
                <div className="right">
                    <div className="header px-4 py-2">
                        <MeetingInfo title={meeting.title} _id={meeting._id} />
                    </div>
                    <div className="videos-wrapper no-focus px-4 py-2" ref={videosWrapperRef}>
                        <div className="focus-participant no-focus" ref={focusParticipantRef}>
                            <div className="d-flex mb-3 justify-content-end">
                                <Button color="link" onClick={unFocus}>
                                    <GrFormClose />
                                </Button>
                            </div>
                            <ParticipantMiniVideo {...focusedParticipant} showInfo={false} />
                        </div>
                        <div className="videos-holder no-focus" ref={videosHolderRef}>
                            {
                                participants.map(_p => {
                                    return (
                                        <ParticipantMiniVideo {..._p} onClick={e => focus(_p)} />
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        ) : (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100px" }}>
                    <p className="lead mb-5 text-center">
                        Please wait, loading meeting details
                        <br />

                        <Spinner></Spinner>
                    </p>

                </div>
            )
    )
}

export default MeetingPage
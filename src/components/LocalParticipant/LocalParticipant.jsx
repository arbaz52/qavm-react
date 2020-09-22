import React, { useEffect, useRef } from 'react'
import './LocalParticipant.css'
import { Button } from 'reactstrap'
import ParticipantsListItem from '../ParticipantsListItem/ParticipantsListItem'
import { useHistory } from 'react-router-dom'

const LocalParticipant = (props) => {
    let {video, videoTrack} = props
    let videoRef = useRef(null)
    useEffect(() => {
        if(video && videoRef){
            videoRef.current.srcObject = new MediaStream([videoTrack])
        }
    }, [video, videoRef])

    const history = useHistory()
    const leaveMeeting = () => {
        history.goBack()
    }

    return (
        <div className="local-participant-wrapper">
            {video && <video ref={videoRef} muted autoPlay className="img-fluid" />}
            <ParticipantsListItem {...props}/>
            <div className="text-center mt-3">
                <Button color="danger" size="sm" onClick={leaveMeeting}>Leave Meeting</Button>
            </div>
        </div>
    )
}

export default LocalParticipant
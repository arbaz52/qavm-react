import React, { useEffect, useRef } from 'react'
import './ParticipantMiniVideo.css'

const ParticipantMiniVideo = (props) => {
    let { video, videoTrack, username, showInfo, onClick } = props
    let videoRef = useRef(null)
    useEffect(() => {
        if (video && videoRef) {
            videoRef.current.srcObject = new MediaStream([videoTrack])
        }
    }, [video, videoRef])
    return (
        <>
            { video && <div onClick={onClick}>
                <video ref={videoRef} muted autoPlay className="img-fluid rounded" />
            {(showInfo ? showInfo : true) && <p className="text-muted">{username ? username : "Participant"}</p> }
            </div>}
        </>
    )
}

export default ParticipantMiniVideo
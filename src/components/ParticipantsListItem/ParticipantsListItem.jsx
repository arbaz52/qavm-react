import React, { useEffect, useRef } from 'react'
import './ParticipantsListItem.css'
import { FaMicrophoneSlash, FaMicrophone, FaVideoSlash, FaVideo } from 'react-icons/fa'
const ParticipantsListItem = (props) => {
    let { username, audio, audioTrack, video, toggleAudio, toggleVideo, local } = props
    
    let audioRef = useRef(null)

    useEffect(() => {
        if (audio && audioRef.current) {
            audioRef.current.srcObject = new MediaStream([audioTrack])
        }
    }, [audio, audioRef])


    toggleAudio = toggleAudio ? toggleAudio : () => { }
    toggleVideo = toggleVideo ? toggleVideo : () => { }
    return (
        <div className='mt-3 p'>
            {audio && !local && <audio ref={audioRef} autoPlay />}
            <p className="m-0" style={{ fontWeight: local ? "bold" : "normal" }}>{username ? username : "Participant"}</p>
            <div className="icons">
                {!video ? <div className="badge badge-danger btn" onClick={toggleVideo}><FaVideoSlash /></div> : <div className="badge badge-info btn" onClick={toggleVideo}><FaVideo /></div>}
                {!audio ? <div className="badge badge-danger btn" onClick={toggleAudio}><FaMicrophoneSlash /></div> : <div className="badge badge-info btn" onClick={toggleAudio}><FaMicrophone /></div>}
            </div>
        </div>
    )
}
export default ParticipantsListItem
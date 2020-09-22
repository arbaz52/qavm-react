import React, { useContext } from 'react'
import { toast } from 'react-toastify'
import { Button } from 'reactstrap'
import { HeaderContext } from '../../App'
import './MeetingInfo.css'
import {FaGripLines} from 'react-icons/fa'


const MeetingInfo = ({_id, title}) => {
    const { showHeader, setShowHeader } = useContext(HeaderContext)
    const getInvitationLink = () => {
        navigator.clipboard.writeText("http://localhost:3000/meeting/"+_id)
        toast.info("Invitation link copied to clipboard", {
            position: 'bottom-right'
        })
    }
    return (
        <div className='meeting-info'>
            <h3>
                <span className="">
                    {title}
                </span>
            </h3>
            <ul> 
                <li>
                    <Button color="link" size="sm" onClick={e=>setShowHeader(!showHeader)} style={{marginRight: 10}}>
                     <FaGripLines />
                    </Button>
                </li>
                <li>
                    <Button color="primary" size="sm" onClick={getInvitationLink}>Invitation link</Button>
                </li>
            </ul>
        </div>
    )
}

export default MeetingInfo
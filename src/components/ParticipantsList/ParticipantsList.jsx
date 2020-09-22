import React from 'react'
import ParticipantsListItem from '../ParticipantsListItem/ParticipantsListItem'
import './ParticipantsList.css'
const ParticipantsList = ({ participants }) => {
    return (
        <div className='participants-list-wrapper'>
            <div className='participants-list-content'>
                {
                    participants.map(_p => {
                        return (

                            <ParticipantsListItem key={_p.user_id} {..._p} />
                        )
                    })
                }
            </div>
        </div>
    )
}

export default ParticipantsList
import React from 'react'
import { Link } from 'react-router-dom'
import { Button, ButtonGroup } from 'reactstrap'

const WelcomeBanner = () => {
    return (
        <section className="row justify-content-center align-items-center">
            <div className="py-5 col-sm-12 col-md-6">
                <img src="undraw_video_call_kxyp.svg" alt="" className="img-fluid" />
            </div>
            <div className="py-5 col-sm-12 col-md-6">
                <h1>
                    <strong>
                        QAVM
                    </strong>
                </h1>
                <p className="lead">Quick Audio Video Meetings</p>
                <p className="text-muted">Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda temporibus provident, labore nobis, nostrum praesentium quidem ea optio vero molestias nisi, quia explicabo cumque dignissimos sit similique officiis unde doloremque!</p>
                <ButtonGroup>
                    <Button tag={Link} to="/join" color="info">Join a meeting</Button>
                    <Button tag={Link} to="/host" color="primary">Host a meeting</Button>
                </ButtonGroup>
            </div>
        </section>
    )
}

export default WelcomeBanner
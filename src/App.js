import React, { createContext, useEffect, useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import Header from './components/Header/Header';
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom';
import IndexPage from './pages/IndexPage/IndexPage';

import ModalUsername from './components/ModalUsername/ModalUsername';
import HostMeetingPage from './pages/HostMeetingPage/HostMeetingPage';
import JoinMeetingPage from './pages/JoinMeetingPage/JoinMeetingPage';
import MeetingPage from './pages/MeetingPage/MeetingPage';
import axios from 'axios'

export const LS_USERNAME = "username"
export const LS_TOKEN = "token"
export const UserContext = createContext(null)
export const HeaderContext = createContext(false)
export const MeetingContext = createContext(null)
export const getAuthHeader = () => {
  let token = localStorage.getItem(LS_TOKEN)
  return token ? {
    authorization: "Bearer " + token
  } : {}
}
function App() {
  const history = useHistory()
  const [username, setUsername] = useState(localStorage.getItem(LS_USERNAME))
  const [askForUsername, setAskForUsername] = useState(false)


  const hostMeeting = (title) => {
    return new Promise((resolve, reject) => {
      axios.post("https://qavm-server.herokuapp.com/meetings/", { title }, { headers: getAuthHeader() })
        .then(res => {
          resolve(res.data)
          history.push("./meetings/" + res.data._id)
        })
        .catch(err => {
          reject(err.message)
        })
        .finally(() => {

        })
    })
  }
  const getMeetingInfo = (_id) => {
    return new Promise((resolve, reject) => {
      axios.get("https://qavm-server.herokuapp.com/meetings/" + _id, { headers: getAuthHeader() })
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err.message)
        })
        .finally(() => {

        })
    })
  }


  const [showHeader, setShowHeader] = useState(true)

  const login = (username) => {
    return new Promise((resolve, reject) => {
      axios.post("https://qavm-server.herokuapp.com/users/", { username })
        .then(res => {
          localStorage.setItem(LS_USERNAME, res.data.user.username)
          localStorage.setItem(LS_TOKEN, res.data.token)
          setUsername(res.data.user.username)
          resolve(LS_USERNAME)
        })
        .catch(err => {
          reject(err.message)
        })
        .finally()
    })
  }
  const logout = () => {
    setUsername(null)
    localStorage.removeItem(LS_USERNAME)
    localStorage.removeItem(LS_TOKEN)
  }


  return (
    <MeetingContext.Provider value={{ getMeetingInfo }}>
      <HeaderContext.Provider value={{ showHeader, setShowHeader }}>
        <ToastContainer />
        <UserContext.Provider value={{ username, setUsername, logout, askForUsername, setAskForUsername, login, hostMeeting }}>
          <BrowserRouter>
            <ModalUsername />
            <Header />
            <div className="container">

              <Switch>
                <Route path="/" component={IndexPage} exact />
                <Route path="/join" component={JoinMeetingPage} exact />
                <Route path="/host" component={HostMeetingPage} exact />
                <Route path="/meeting/:meetingId" component={MeetingPage} exact />
              </Switch>
            </div>
          </BrowserRouter>

        </UserContext.Provider>
      </HeaderContext.Provider>
    </MeetingContext.Provider>
  );
}

export default App;

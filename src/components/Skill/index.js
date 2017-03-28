import React from 'react'
import './index.scss'
const debug = require('debug')('app')
import { js_beautify as beautify } from 'js-beautify'
import * as requests from './requests.json'

class Skill extends React.Component {
  constructor(props) {
    super(props);

    this.doRequest = this.doRequest.bind(this);
    this.createRequest = this.createRequest.bind(this);
    this.createSession = this.createSession.bind(this);
    this.setRequest = this.setRequest.bind(this);
    this.setSession = this.setSession.bind(this);

    this.state = {
      request: this.createRequest(props),
      validRequest: true,
      session: this.createSession(props),
      validSession: true
    }
  }

  createRequest(props) {
    debug('Skill Component: createRequest')

    const request = Object.assign({}, requests[props.requestType])

    if ('intent' === props.requestType) {
      request.request.intent.name = ''
      request.request.intent.slots = {}

      if (props.intentName) {
        request.request.intent.name = props.intentName
      }

      if (props.slots.size >= 1) {
        props.slots.forEach(function(slot) {
          request.request.intent.slots[slot.key] = {
            name: slot.key,
            value: slot.value
          }
        })
      }
    }

    return beautify(JSON.stringify(request))
  }

   createSession(props) {
    debug('Skill Component: createSession');

    return beautify(JSON.stringify(props.session))
  }

  setRequest(jsonString) {
    let validRequest;
    try {
      let json = JSON.parse(jsonString)
      validRequest = true
    } catch (error) {
      validRequest = false
    }

    this.setState({
      request: jsonString,
      validRequest: validRequest
    })
  }

  setSession(jsonString) {
    let validSession;
    try {
      let json = JSON.parse(jsonString)
      this.props.actions.setSessionData(json);
      validSession = true
    } catch (error) {
      console.log(error);
      validSession = false
    }
    console.log('Updating session to ', jsonString);
    this.setState({
      session: jsonString,
      validSession: validSession
    })
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      request: this.createRequest(nextProps)
    })
  }

  doRequest() {
    debug('Skill Component: doRequest');
    if (this.state.validRequest) {
      let request = JSON.parse(this.state.request);
      request.session.attributes = this.props.session;
      this.props.actions.doRequest(request);
    }
  }

  render() {
    debug('Skill Component: render');

    // TODO: Causes the custom session to not take affect
    // because this.props contains the value from the state
    // and not our internal state
    console.log(this.props);
    this.state.session = this.createSession(this.props);

    const request = this.state.request
    const session = this.state.session
    const response = beautify(JSON.stringify(this.props.response))
    const requestClass = (this.state.validRequest) ? 'code' : 'invalid code'
    const sessionClass = (this.state.validSession) ? 'code' : 'invalid code'

    return (
      <div className="container-fluid">
        <div className="page-header">
          <h1>Alexa Skill Test <small>{window.SKILL_NAME}</small></h1>
        </div>

        <p>Alexa Skill Test lets you easily mock requests to send to your Alexa skill locally. This page will automatically refresh when you update your skill.</p>

        <div className="form-group">
          <label htmlFor="requestType">Request Type:</label>
          <select id="requestType" className="form-control" defaultValue={this.props.requestType} onChange={(event) => this.props.actions.setRequestType(event.target.value)} id="request_type">
            <option value="launch">LaunchRequest</option>
            <option value="intent">IntentRequest</option>
            <option value="session_end">SessionEndedRequest</option>
          </select>
        </div>

        {'intent' === this.props.requestType ?
          <div>
            <div className="form-group">
              <label htmlFor="intent">Intent Name:</label>
              <input className="form-control" type="text" id="intent" onChange={(event) => this.props.actions.setIntentName(event.target.value)} />
            </div>

            <div className="form-group">
              <label>Slots:</label>

              {this.props.slots && this.props.slots.map(function(slot, index) {
                return <div className="slot" key={slot.id}>
                  <input className="form-control" placeholder="Name" onChange={(event) => this.props.actions.setSlotKey(event.target.value, slot.id)} value={slot.key} type="text" />
                  <input className="form-control" placeholder="Value" onChange={(event) => this.props.actions.setSlotValue(event.target.value, slot.id)} value={slot.value} type="text" />

                  <a href="javascript:void(0)" className="delete-slot" onClick={(event) => this.props.actions.deleteSlot(slot.id)}>&times;</a>
                </div>
              }, this)}

              <div className="form-group">
                <a href="javascript:void(0)" onClick={() => this.props.actions.createSlot()}>Add a slot</a>
              </div>
            </div>
          </div>
          :
          ''
        }
        <div>
          <input type="button" className="btn btn-primary btn-lg" value="Send Request" onClick={this.doRequest} />
        </div>

        <div className="row req-resp">
          <div className="col-md-6">
            <h2>Session</h2>
            <textarea className={sessionClass} onChange={(event) => this.setSession(event.target.value)} value={session}></textarea>
            <h2>Request</h2>
            <textarea className={requestClass} onChange={(event) => this.setRequest(event.target.value)} value={request}></textarea>
          </div>
          <div className="col-md-6">
            <h2>Response</h2>
            <div className="response" className="code">{response}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Skill

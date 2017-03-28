import * as types from '../constants/ActionTypes'
import _ from 'lodash'
import $ from 'jquery'
const debug = require('debug')('app')
import shortid from 'shortid'

export const setRequestType = function(type) {
  debug('Action: setRequestType')
  return {
    type: types.SET_REQUEST_TYPE,
    requestType: type
  }
}

export const setIntentName = function(name) {
  debug('Action: setIntentName')
  return {
    type: types.SET_INTENT_NAME,
    intentName: name
  }
}

export const setSlotKey = function(key, id) {
  debug('Action: setSlotKey')
  return {
    type: types.SET_SLOT_KEY,
    id: id,
    key: key
  }
}

export const setSlotValue = function(value, id) {
  debug('Action: setSlotValue')
  return {
    type: types.SET_SLOT_VALUE,
    id: id,
    value: value
  }
}

export const createSlot = function() {
  debug('Action: createSlot')
  return {
    type: types.CREATE_SLOT,
    slot: {
      key: '',
      value: '',
      id: shortid.generate()
    }
  }
}

export const deleteSlot = function(id) {
  debug('Action: deleteSlot')
  return {
    type: types.DELETE_SLOT,
    id: id
  }
}

export const setSessionData = function(session) {
  debug('Action: setSessionData')
  return {
    type: types.SET_SESSION_DATA,
    sessionData: session
  }
}

export const doRequest = function(request) {
  debug('Action: doRequest')
  return function(dispatch) {
    $.ajax({
      method: 'post',
      url: '/lambda',
      data: JSON.stringify({
        event: request
      }),
      contentType: "application/json; charset=utf-8",
    }).done(function(data) {
      debug('Action: doRequest done')
      dispatch({
        type: types.DO_REQUEST,
        response: data
      });
      dispatch({
        type: types.SET_SESSION_DATA,
        sessionData: data.sessionAttributes
      });
    }).fail(function(error, response) {
      debug('Action: doRequest error')
      dispatch({
        type: types.DO_REQUEST,
        response: 'An error occurred'
      });
    });
  }
}

//TODO: create contact using all actions

import {
  SET_CONTACT,
  SET_LOADING,
  CONTACT_TO_UPDATE,
  SET_SINGLE_CONTACT
} from "./action.types";

//TODO: use switch case
export default (state, action) =>{

  switch(action.type){

    case SET_CONTACT:
      return action.payload == null ? {...state, contacts:[]} :
      {...state, contacts:action.payload}
   //if action.payload is blank then null data comes from db
    case SET_LOADING:
      return {...state, isLoading:action.payload}
  //loading before data came
    case CONTACT_TO_UPDATE:
      return {...state, contactToUpdate: action.payload,
      contactToUpdateKey: action.key
      }
  //update contact
    case SET_SINGLE_CONTACT:
      return {
        ...state,
        contact: action.payload
      }
  //save single data
    default:
      return state
  }

}
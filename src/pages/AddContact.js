// https://firebase.google.com/docs/storage/web/upload-files#full_example
// https://www.npmjs.com/package/browser-image-resizer#asyncawait

import React, { useState, useContext, useEffect } from "react";
import firebase from "firebase/app";

import {
  Container,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Spinner,
  Row,
  Col
} from "reactstrap";


// to compress image before uploading to the server
import { readAndCompressImage } from "browser-image-resizer";

// configs for image resizing
//TODO DONE: add image configurations
import {imageConfig} from "../utils/config"

import { MdAddCircleOutline } from "react-icons/md";

import { v4 } from "uuid";

// context stuffs
import { ContactContext } from "../context/Context";
import { CONTACT_TO_UPDATE } from "../context/action.types";

import { useHistory } from "react-router-dom";

import { toast } from "react-toastify";
import { FaCamera } from "react-icons/fa";

const AddContact = () => {
  // destructuring state and dispatch from context state
  const { state, dispatch } = useContext(ContactContext);

  const { contactToUpdate, contactToUpdateKey } = state;

  // history hooks from react router dom to send to different page
  const history = useHistory();

  // simple state of all component
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [star, setStar] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

  // when their is the contact to update in the Context state
  // then setting state with the value of the contact
  // will changes only when the contact to update changes
  useEffect(() => {
    if (contactToUpdate) {
      setName(contactToUpdate.name);
      setEmail(contactToUpdate.email);
      setPhoneNumber(contactToUpdate.phoneNumber);
      setAddress(contactToUpdate.address);
      setStar(contactToUpdate.star);
      setDownloadUrl(contactToUpdate.picture);

      // also setting is update to true to make the update action instead the addContact action
      setIsUpdate(true);
    }
  }, [contactToUpdate]);

  // To upload image to firebase and then set the the image link in the state of the app
  const imagePicker = async e => {
    // TODO DONE: upload image and set D-URL to state
    try{
      //complete file link
      const file = e.target.files[0]
      //type of the image
      var metadata = {
        contentType: file.type
      }
      //resize of the image
      let resizedImage = await readAndCompressImage(file, imageConfig)

      //where to store 
      //we need to grab the reference of the storage
      const storageRef = await firebase.storage().ref()

      //make ready upload task
      var uploadTask = storageRef
      .child('images/'+file.name)
      .put(resizedImage, metadata)
      //what image and further information

      //events on uploadTask
      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        //it returns snapshot
        snapshot =>{
          
          //to show spinner
          setIsUploading(true)
          //uploading time calcualtion
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes)*100

          //different state of uploading
          switch (snapshot.state) {

            case firebase.storage.TaskState.PAUSED:

              setIsUploading(false)
              console.log("Uploading is paused");
              break;
          
            case firebase.storage.TaskState.RUNNING:

              console.log("Uploading is progress...");
              break;
          
          }

          if(progress == 100){

            setIsUploading(false)

            toast("uploaded",{toast: "success"})

          }
        },

        error =>{

          toast("something is wrong in state change",{type:"error"})
        },
        //after uploading image get the url through callback and set in state
        () =>{
          uploadTask.snapshot.ref.getDownloadURL()
          .then(downloadURL =>{
            setDownloadUrl(downloadURL)
          })
          .catch(err=> console.log(err))
        }

      )

    }catch(error){

      console.error(error)
      toast("something went wrong",{type: "error"})

    }
  };

  // setting contact to firebase DB
  const addContact = async () => {
    //TODO:DONE add contact method
    try{
       //reference from firebase and set with unique key
      firebase.database().ref('contacts/' +v4()).set(
        {
          name,
          email,
          phoneNumber,
          address,
          picture: downloadUrl,
          star
        }
      )

    }catch(error){
      console.log(error);
    }

  };

  // to handle update the contact when there is contact in state and the user had came from clicking the contact update icon
  const updateContact = async () => {
    //TODO:DONE update contact method
    try{

      firebase.database().ref('contacts/'+ contactToUpdateKey).set({
        name,
        email,
        phoneNumber,
        address,
        picture: downloadUrl,
        star
       })

    }catch(error){
      console.log(error)
      toast('Oops..',{type:'error'})
    }
  };

  // firing when the user click on submit button or the form has been submitted
  const handleSubmit = e => {
    e.preventDefault();

    isUpdate ? updateContact() : addContact()

    toast('Success',{type: 'success'})

    // isUpdate wll be true when the user came to update the contact
    // when their is contact then updating and when no contact to update then adding contact
    //TODO:DONE set isUpdate value

    // to handle the bug when the user visit again to add contact directly by visiting the link
    dispatch({
      type: CONTACT_TO_UPDATE,
      payload: null,
      key: null
    });

    // after adding/updating contact then sending to the contacts
    // TODO DONE :- also sending when their is any errors
    history.push("/");
  };

  const styleIcon = {
    marginLeft: -20+"px",
    marginTop: 70 +"px",
    cursor: "pointer",
    border: 1 +"px  solid #cccccc",
    fontSize: 24 + "px",
    backgroundColor: "#fff",
    padding: 2 + "px"

    
  }
  // return the spinner when the image has been added in the storage
  // showing the update / add contact based on the  state
  return (
    <Container fluid className="mt-5">
      <Row>
        <Col md="6" className="offset-md-3 p-2">
          <Form onSubmit={handleSubmit}>
            <div className="text-center">
              {isUploading ? (
                <Spinner type="grow" color="primary" />
              ) : (
                <div>
                  <label htmlFor="imagepicker" className="">
                    
                    <img src={downloadUrl} alt="" className="profile" />
                    <FaCamera style={styleIcon}/>
                  </label>
                 
                  <input
                    type="file"
                    name="image"
                    id="imagepicker"
                    accept="image/*"
                    multiple={false}
                    onChange={e => imagePicker(e)}
                    className="hidden"
                  />
                </div>
              )}
            </div>

            <FormGroup>
              <Input
                type="text"
                name="name"
                id="name"
                placeholder="Name"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email"
              />
            </FormGroup>
            <FormGroup>
              <Input
                type="number"
                name="number"
                id="phonenumber"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                placeholder="phone number"
              />
            </FormGroup>
            <FormGroup>
              <Input
                type="textarea"
                name="area"
                id="area"
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="address"
              />
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input
                  type="checkbox"
                  onChange={() => {
                    setStar(!star);
                  }}
                  checked={star}
                />{" "}
                <span className="text-right">Mark as Star</span>
              </Label>
            </FormGroup>
            <Button
              type="submit"
              color="primary"
              block
              className="text-uppercase"
            >
              {isUpdate ? "Update Contact" : "Add Contact"}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default AddContact;

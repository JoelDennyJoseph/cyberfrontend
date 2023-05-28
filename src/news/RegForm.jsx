import React, { useRef, useState } from 'react';
import {
  MDBInput,
  MDBCheckbox,
  MDBBtn
} from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import '../news/newsItem.css'; 
import { Link } from 'react-router-dom';
import app  from "../firebase.js";
import { doc, addDoc, collection, updateDoc, arrayUnion } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";

export default function RegForm() {
    const [message,setMessage] = useState("");
    const [complaintee,setComplaintee] = useState("");
    const [subject,setSubject] = useState("");
    const navigate = useNavigate();
    const db = getFirestore(app);
    const [agreement,setAgreement] = useState(false);

    const subjectElement = useRef(null);
    const messageElement = useRef(null);
     
    useEffect(() => {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setComplaintee(user.email);
          console.log("Current User: " + user.email);
        } else {
          console.log("User not found");
          navigate('/');
        }
      });
    }, []);

    //funtion for classification model
    async function classify(data) {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/joeldenny/finalclassificationmodel",
        {
          headers: { Authorization: "Bearer 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" },
          method: "POST",
          body: JSON.stringify(data),
        }
      );
      const result = await response.json();
      return result;
    }

    //function for priority model
    async function priority(data) {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/joeldenny/priority-model",
        {
          headers: { Authorization: "Bearer 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" },
          method: "POST",
          body: JSON.stringify(data),
        }
      );
      const result = await response.json();
      return result;
    }

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      let dept;
      let pri;
      
      const classMapper = {
        "LABEL_0": "ACCOUNTS",
        "LABEL_1": "DEBT",
        "LABEL_2": "CREDIT",
        "LABEL_3": "LOAN",
        "LABEL_4": "CREDIT CARD",
        "LABEL_5": "OTHER"
      }

      const priorityMapper = {
        "LABEL_0": "URGENT",
        "LABEL_1": "NEUTRAL"
      }

      // Request to model 1 for dept
      await classify({"inputs": message})
      .then((response) => {
        console.log("Department: " + response[0][0].label);
        dept = classMapper[response[0][0].label];
      });
      
      // Request to model 2 for priority
      await priority({"inputs": message})
      .then((response) => {
        console.log("Priority: " + response[0][0].label);
        pri = priorityMapper[response[0][0].label];
      });

      //Date finder
      const date = new Date();
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      // This arrangement can be altered based on how we want the date's format to appear.
      let newDate = `${day}-${month}-${year}`;
      //console.log(currentDate); // "17-6-2022"

      const data = {
        message,
        subject,
        date: newDate,
        email: complaintee,
        department: dept,
        status: "Received the complaint",
        priority: pri,
        complaintId : null,
        uID: null
      };

      console.log("Data : " + data.department);
      console.log("Data : " + data.priority);
            
      const docRef = await addDoc(collection(db, "complaints"), data);

      // console.log("Complaintee: " + complaintee);
      const userDoc = doc(db, "users", complaintee);
      await updateDoc(userDoc, {
        complaints: arrayUnion(docRef.id)
      });

      let temp = String(docRef.id);
      let cId = data.department + "-" + temp.substring(0, 5);
      const newComplaintDoc = doc(db, "complaints", docRef.id);
      await updateDoc(newComplaintDoc, {
        complaintId:  cId,
        uID: docRef.id
      });
      console.log("Complaintee: " + cId);
    }

    return (
    <form className="reg_form" onSubmit={handleSubmit}>
      {/* <h1 className="mb-3">Complaint Form</h1> */}
      
      <div className="form-outline">
        <textarea className="form-control" id="textAreaExample1" rows="2"
        onChange={(e) => setSubject(e.target.value)} value={subject}></textarea>
        {(subject.length>0 && document.activeElement!==subjectElement.current) ?
        <label ref={subjectElement} className="form-label" style={{display:"none"}}>Subject</label>
        :<label ref={subjectElement} className="form-label" >Subject</label>}
        {/* style={subject.length>0 && document.activeElement!=subjectElement.current ? "hidden" : "show" */}
      </div>

      <div className="form-outline">
        <textarea className="form-control" id="textAreaExample1" rows="4"
        onChange={(e) => setMessage(e.target.value)} value={message}></textarea>
        {(message.length>0 && document.activeElement!==messageElement.current) ?
        <label ref={messageElement} className="form-label" style={{display:"none"}}>Complaint Description</label>
        :<label ref={messageElement} className="form-label" >Complaint Description</label>}
        {/* <label className="form-label">Complaint Description</label> */}
      </div>
      
      <p className="lead">*Input should be atleast 10 characters</p>
      
      <MDBInput type='file' multiple/>

      <MDBCheckbox
        wrapperClass='d-flex justify-content-center mb-4'
        id='form4Example4'
        label='Send me a copy of this message'
        defaultChecked
      />
      
        <MDBCheckbox
          wrapperClass='d-flex justify-content-center mb-4'
          id='form4Example4'
          style={{marginLeft:"1%"}}
          label={<Link to="https://www.indiacode.nic.in/show-data?actid=AC_CEN_5_24_00022_200753_1517807327089&sectionId=7868&sectionno=37&orderno=37">I have read the rules and regulations</Link>}
          onChange={(e)=>setAgreement(e.target.checked)}
        />
      
      {/* label='I have read the rules and regulations' */}
      <MDBBtn type='submit' className='mb-4' block disabled={message.length<10 || !agreement}>Submit</MDBBtn>
    </form>
  );
}
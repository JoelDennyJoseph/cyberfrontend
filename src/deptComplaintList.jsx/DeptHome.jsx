import React from "react";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBContainer,
  MDBInput,
  MDBRow,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
} from "mdb-react-ui-kit";
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import '../admin/admin.css';
import app  from "../firebase.js";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import DeptItem from './DeptItem';
import { query, where } from "firebase/firestore";

const db = getFirestore(app);
let complaintDataArray = [];

export default function DeptHome() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
  const auth = getAuth();


  useEffect(() => {
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
      if (user) {
        //setComplaintee(user.email);
        console.log("Current User: " + user.email);
        setUserEmail(user.email);
      } else {
        console.log("User not found");
        navigate('/');
      }
    });  

    const accountMapper = {
      "accounts@cyber.com": "ACCOUNTS",
      "debt@cyber.com": "DEBT",
      "credit@cyber.com": "CREDIT",
      "loan@cyber.com": "LOAN",
      "creditcard@cyber.com": "CREDIT CARD",
      "other@cyber.com": "OTHER"
    }

    const getComplaintData = async () => {
      console.log("Get data func");
      let tempDept = accountMapper[userEmail];
      console.log(tempDept);
      const q = query(collection(db, "complaints"), where("department", "==", tempDept));

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        //console.log(doc.id, " => ", doc.data());
        complaintDataArray.push(doc.data());
        console.log("Puched");
      });
      console.log("out of method");
      setLoading(false);
    }    

    getComplaintData();

  }, [loading, userEmail]);

  const handleSignOut = ()=>{
    //handle signout using firebase and redirect to login
    signOut(auth).then(() => {
      // Sign-out successful.
      navigate('/');
    }).catch((error) => {
      // An error happened.
    })
  };

  return (
    <div className="AdminHomeContainer">
      <MDBContainer className="py-5 h-100">
        <MDBRow className="d-flex justify-content-center align-items-center">
          <MDBCol lg="9" xl="7">
            <MDBCard className="rounded-3">
              <MDBCardBody className="p-4" style={{position:"relative"}}>
                <h4 className="text-center">Complaints</h4>
                <h6 className="text-center my-3 pb-3" onClick={handleSignOut} >Sign out</h6>
                <MDBTable className="mb-4">
                  <MDBTableHead>
                    <tr>
                      <th scope="col"><b>CID</b></th>
                      <th scope="col"><b>Subject</b></th>
                      <th scope="col"><b>Department</b></th>
                      <th scope="col"><b>Priority</b></th>
                      <th scope="col"><b>Status</b></th>
                      <th scope="col"><b>Action</b></th>
                    </tr>
                  </MDBTableHead>
                  <MDBTableBody>
                    {complaintDataArray.map((complaint, index) => {
                      return(
                        <DeptItem
                          key={index}
                          id={complaint.complaintId}
                          subject={complaint.subject}
                          dept={complaint.department}
                          priority={complaint.priority}
                          status={complaint.status} 
                          message={complaint.message}
                        />
                      )
                    })}
                  </MDBTableBody>
                </MDBTable>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      </div>
    // </section>
  );
}
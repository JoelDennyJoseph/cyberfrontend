import React, { useRef, useState, useEffect } from 'react';
import {MDBBtn,MDBContainer,MDBCard,MDBCardBody,MDBInput,MDBCheckbox}from 'mdb-react-ui-kit';
import "../register/Register.css";
import axios from '../api/axios';
// import {faCheck, faTimes, faInfoCircle} from "@fortawesome/fontawesome-free";
import { Link } from 'react-router-dom';

// const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
// const REGISTER_URL = '/register';
const EMAIL_REGEX= /\S+@\S+\.\S+/;
import { getAuth, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { getFirestore } from "firebase/firestore";
import app  from "../firebase.js"
import { doc, setDoc } from "firebase/firestore"; 


function Register() {

  const userRef = useRef();
    const errRef = useRef();
    const navigate = useNavigate();
    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(true);
    const [userFocus, setUserFocus] = useState(false);

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);
    const [agreement,setAgreement] = useState(false);
          console.log("name ",validName);
          console.log("pwd",validPwd);
          console.log("match",validMatch);

    // useEffect(() => {
    //     userRef.current.focus();
    // }, [])

    // useEffect(() => {
    //     setValidName(USER_REGEX.test(user));
    // }, [user])

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
        setValidMatch(pwd == matchPwd);
    }, [pwd, matchPwd])

    useEffect(() => {
      setValidEmail(EMAIL_REGEX.test(email));
  }, [email])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd, matchPwd])
    
    const db = getFirestore(app);
  
    const handleSubmit = async (e) => {
        e.preventDefault();
        // if button enabled with JS hack

        const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, pwd)
          .then(async (userCredential) => {
            
            //const user = userCredential.user;

            // Write to firestore
                       
            const data = {
              username: user,
              email,
              complaints: []
            };
            await setDoc(doc(db, "users", email), data);

            console.log("User registered");
            signOut(auth).then(() => {
              console.log("Sign-out successful");
            }).catch((error) => {
              console.log(error);
            });

            navigate("/");
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage);
            // ..
          });
    }

  return (
    <MDBContainer fluid className='d-flex align-items-center justify-content-center bg-image' style={{backgroundImage: 'url(https://mdbcdn.b-cdn.net/img/Photos/new-templates/search-box/img4.webp)'}}>
      <div className='mask gradient-custom-3'></div>
      <MDBCard className='m-5' style={{maxWidth: '600px'}}>
        <MDBCardBody className='px-5'>
        <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
          <h2 className="text-uppercase text-center mb-5">Create an account</h2>
          
          <form onSubmit={handleSubmit}>
            
            <MDBInput wrapperClass='mb-4' label='Your Name' size='lg' id='form1' type='text' required
            onChange={(e) => setUser(e.target.value)} value={user} onFocus={() => setUserFocus(true)} onBlur={() => setUserFocus(false)}/>
            
            
            <MDBInput wrapperClass='mb-4' label='Your Email' size='lg' id='form2' type='email' required
            onChange={(e) => setEmail(e.target.value)} value={email} />
            
            <MDBInput wrapperClass='mb-4' label='Password' size='lg' id='form3' type='password' required
            onChange={(e)=>setPwd(e.target.value)} value={pwd} onFocus={()=>setPwdFocus(true)} onBlur={()=>setPwdFocus(false)}/>
            
            <MDBInput wrapperClass='mb-4' label='Repeat your password' size='lg' id='form4' type='password' required
             onChange={(e) => setMatchPwd(e.target.value)} value={matchPwd} onFocus={() => setMatchFocus(true)} onBlur={() => setMatchFocus(false)}/>
            
            <div className='d-flex flex-row justify-content-center mb-4'>
            <MDBCheckbox name='flexCheck' id='flexCheckDefault' label='I agree all statements in ' onChange={(e)=>setAgreement(e.target.checked)}/>
              &nbsp;<span><a href="#!">Terms of service.</a></span>
            </div>
            
            <MDBBtn type='submit' className='mb-4 w-100 gradient-custom-4' size='lg'
             disabled={ !validName || !validPwd || !validMatch || !agreement || !validEmail} 
             >Register</MDBBtn>
             <p className="mb-5 pb-lg-2" style={{color: '#393f81'}}>Already have an account? <Link to="/">Login</Link></p>
          </form>

          {/* <p className="mb-5 pb-lg-2" style={{color: '#393f81'}}>Don't have an account? <Link to="/register">Register</Link></p> */}
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
}

export default Register;
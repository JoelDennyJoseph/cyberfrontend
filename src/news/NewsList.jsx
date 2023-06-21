import React, { useState, useEffect } from 'react'
import axios from 'axios'
import NewsItem from './NewsItem'
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import '../news/newsItem.css';
import {
    MDBBtn,
    MDBModal,
    MDBModalDialog,
    MDBModalContent,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody,
    MDBModalFooter,
  } from 'mdb-react-ui-kit';
import RegForm from './RegForm';
import ComplaintStatus from '../userComplaintList/ComplaintStatus';
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';


const NewsList = () => {
    
    const [articles, setArticles] = useState([])
    const [navbar,setNavbar] = useState(false);

    const navigate = useNavigate();
    const auth = getAuth();
    useEffect(() => {
      const getArticles = async () => {
        const response = await axios.get(`https://newsapi.org/v2/everything?q=cyber+news&apiKey=441cee269ba9433fae71d6420cc01c1b`)
        setArticles(response.data.articles)
        console.log(response)
      }
      getArticles();
    }, [])

    const [showForm, setFormStatus] = useState(false);
    const viewData = () => setFormStatus(!showForm);

    const [basicModal, setBasicModal] = useState(false);
    const toggleShow = () => setBasicModal(!basicModal);
    const [basicModal2, setBasicModal2] = useState(false);
    const toggleShow2 = () => setBasicModal2(!basicModal2)

    const handleSignOut = ()=>{
      //handle signout using firebase and redirect to login
      signOut(auth).then(() => {
        // Sign-out successful.
        navigate('/');
      }).catch((error) => {
        // An error happened.
      });

    }

    const changeBackground = ()=>{
      if(window.scrollY >=200) setNavbar(true);
      else setNavbar(false);
    }
    window.addEventListener('scroll',changeBackground);
   
    const showNav = ()=>{
      if(navbar)
        setNavbar(false);
    }
    const hideNav = ()=>{
      if(navbar)
        setNavbar(true);
    }

  return (
    <div>
      <nav onMouseEnter={showNav} onMouseLeave={hideNav} className={navbar?"navbar active navbar-expand-lg navbar-dark ":"navbar navbar-expand-lg navbar-dark bg-primary"}>
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Cyber Complaint Automation System</a>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <MDBBtn className={navbar?"active":""} onClick={toggleShow}>Register complaint</MDBBtn>
              </li>
              <li className="nav-item" style={{marginRight:"3%"}}>
                <MDBBtn className={navbar?"active":""} onClick={toggleShow2}>Track complaint</MDBBtn>
              </li>
              <li className="nav-item" style={{marginRight:"3%"}}>
                <MDBBtn className={navbar?"active":""} onClick={handleSignOut}>Sign Out</MDBBtn>
              </li>
            </ul>
          </div>
        </div>
      </nav>
          

      <MDBModal show={basicModal} setShow={setBasicModal} tabIndex='-1'>
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Complaint Form</MDBModalTitle>
              <MDBBtn className='btn-close' color='none' onClick={toggleShow}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
                <RegForm/>
            </MDBModalBody>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>

      {/* status popup */}
      <MDBModal show={basicModal2} setShow={setBasicModal2} tabIndex='-1'>
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Complaint Status</MDBModalTitle>
              <MDBBtn className='btn-close' color='none' onClick={toggleShow2}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
                <ComplaintStatus/>
            </MDBModalBody>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
      
      {/* news dashboard */}
      <h1 className='news_heading'>Breaking News</h1>
      {articles.map((article, index) => {
          return(
              <NewsItem 
                key={index}
                title={article.title}
                description={article.description}
                url={article.url}
                urlToImage={article.urlToImage} 
              />
          )
      })}

    </div>
  )
}

export default NewsList
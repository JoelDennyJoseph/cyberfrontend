import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Alert } from "react-bootstrap";
import { Button } from "react-bootstrap";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { useUserAuth } from "../context/UserAuthContext";

const Otp_page = () => {
  const [error, setError] = useState("");
  const [number, setNumber] = useState("");
  const [flag, setFlag] = useState(false);
  const [checkOtp, setCheckOtp] = useState(0);
  const [result, setResult] = useState("");
  const { setUpRecaptha } = useUserAuth();
  const [otp,setOtp] = useState(0);
  const navigate = useNavigate();

  // const getOtp = async (e) => {
  //   e.preventDefault();
  //   console.log(number);
  //   setError("");
  //   if (number === "" || number === undefined)
  //     return setError("Please enter a valid phone number!");
  //   try {
  //     const response = await setUpRecaptha(number);
  //     setOtp(randomNumberInRange(100000,999999));
  //   //   axios.get(` https://www.fast2sms.com/dev/bulkV2?authorization=783AnHyUWzxtfPv0hY9JL2qKwkVmbNpXgjQRuiEIdGM5roTCZOv1Z5DxU4h6AbVCIqWrnOBTzypwaloR&route=q&message=Use%20verification%20code%20:%20${otp}&language=english&flash=0&numbers=7012440501`)
  //   // .then(function (response) {
  //   //   console.log(response);
  //   // })
  //   // .catch(function (error) {
  //   // console.log(error.response.data);
  //   // });
  //     // console.log("response",response);
  //     // setResult(response);
  //     setFlag(true);
  //   } catch (err) {
  //     setError(err.message);
  //   }
  // };

  function randomNumberInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // const verifyOtp = async (e) => {
  //   e.preventDefault();
  //   setError("");
  //   if (checkOtp === "" || checkOtp === null) return;
  //   if(checkOtp==otp)
  //   {
  //     navigate('/dashboard');
  //   }
  //   else{
  //     setError("Wrong Otp entered")
  //   }
  // };
  const handleFlag = (e)=>{
    e.preventDefault();
    setFlag(!flag);
  }

  return (
    <>
      <div className="p-4 box">
        <h2 className="mb-3">Phone verification</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {/* onSubmit={getOtp} */}
        <Form  style={{ display: !flag ? "block" : "none" }} onSubmit={handleFlag}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <PhoneInput
              defaultCountry="IN"
              value={number}
              onChange={setNumber}
              placeholder="Enter Phone Number"
            />
            <p>*Please enter the phone number through which further communications will be done</p>
            <div id="recaptcha-container"></div>
          </Form.Group>
          <div className="button-right">
            <Link to="/">
              <Button variant="secondary">Cancel</Button>
            </Link>
            &nbsp;
            <Button type="submit" variant="primary">
              Send Otp
            </Button>
          </div>
        </Form>

        <Form  style={{ display: flag ? "block" : "none" }}>
        {/* onSubmit={verifyOtp} */}
          <Form.Group className="mb-3" controlId="formBasicOtp">
            <Form.Control
              type="otp"
              placeholder="Enter OTP"
              // onChange={(e) => setCheckOtp(e.target.value)}
            />
          </Form.Group>
          <div className="button-right">
            <Link to="/">
              <Button variant="secondary">Cancel</Button>
            </Link>
            &nbsp;
              <Link to='/dashboard'>
              <Button type="submit" variant="primary">Submit</Button>
              </Link>
          </div>
        </Form>
      </div>
    </>
  );
};

export default Otp_page;
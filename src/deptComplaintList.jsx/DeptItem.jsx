import React, {useState} from 'react'
import { MDBBtn,
    MDBModal,
    MDBModalDialog,
    MDBModalContent,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody,
    MDBModalFooter 
} from "mdb-react-ui-kit";
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import '../admin/admin.css';
import List from '@mui/material/List';
import Collapse from '@mui/material/Collapse';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useEffect } from 'react';

const AdminItem = ({ id, subject, dept, priority, message, status }) => {
    const [open, setOpen] = useState(false);
    const [age, setAge] = useState(" ");
    const [basicModal, setBasicModal] = useState(false);
    const toggleShow = () => setBasicModal(!basicModal);

    const handleClick = () => {
        setOpen(!open);
    };

    const mapper = {
        10: "Received the complaint",
        20: "Assigned an Officer",
        30: "Investigating the complaint",
        40: "Framing of charge before the court"
    }

    useEffect(() => {

    }, [open]);

    const handleChange = async (event) => {
        setAge(event.target.value);
        let identifier = {uID}
        const cRef = doc(db, "complaints", identifier.uID);
        await updateDoc(cRef, {
            status: mapper[event.target.value]
        });
        handleClick();
    };

    return (
        <>
            <tr>
                <th scope="row">{id}</th>
                <td>{subject}</td>
                <td>{dept}</td>
                <td>{priority}</td>
                <td>{status}</td>
                <td>
                    <MDBBtn onClick={toggleShow}>View</MDBBtn>
                </td>
            </tr>
            <tr>
            <MDBModal className='modal-css' show={basicModal} setShow={setBasicModal} tabIndex='-1'>
                    <MDBModalDialog>
                        <MDBModalContent className='main'>
                            <MDBModalHeader>
                                <MDBBtn className='btn-close' color='none' onClick={toggleShow}></MDBBtn>
                            </MDBModalHeader>
                            <MDBModalBody>
                                <div className="complaintContainer">
                                    <div className="complaintSubContainer">
                                        <h2 style={{fontSize:"2em"}}>Description</h2>
                                        <p style={{fontSize:"1.5em"}}>{message}</p>
                                    </div>
                                    <div className="complaintSubContainer csc2">
                                        <h2 style={{fontSize:"2em"}}>Set the status</h2>
                            
                                        <FormControl fullWidth style={{flex:0.5}}>
                                        <InputLabel id="demo-simple-select-label">Status</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            onChange={handleChange}
                                            label="Age"
                                            value={age}>
                                            <MenuItem selected value={10}>Received the complaint</MenuItem>
                                            <MenuItem value={20}>Assigned an Officer</MenuItem>
                                            <MenuItem value={30}>Investigating the complaint</MenuItem>
                                            <MenuItem value={40}>Framing of charge before the court</MenuItem>
                                        </Select>
                                        </FormControl>
                                    </div>
                                </div>
                            </MDBModalBody>
                        </MDBModalContent>
                    </MDBModalDialog>
                </MDBModal>
            </tr>
        </>
    )
}

export default AdminItem;
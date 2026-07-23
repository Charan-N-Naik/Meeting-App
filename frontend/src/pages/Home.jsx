import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import withAuth from "../utils/withAuth";
import { Button, IconButton, TextField } from "@mui/material";
import RestoreIcon from "@mui/icons-material/Restore";
import "../App.css";
import { AuthContext } from "../contexts/AuthComnntext";

let Home = () => {
  let navigate = useNavigate();
  const [meetingCode, setMeetingCode] = useState("");
  const {addToUserHistory}=useContext(AuthContext)

  let handleJoinVideoCall = async () => {
    await addToUserHistory(meetingCode);

    navigate(`/${meetingCode}`);
  };

  return (
    <>
      <div className="navbar">
        <div style={{ display: "flex", alignItems: "center" }}>
          <h3>Apna Video Call</h3>
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={()=>{
            navigate("/history")
          }}>
            <RestoreIcon />
            <p>History</p>
          </IconButton>
          <Button onClick={()=>{
            localStorage.removeItem("token")
            navigate("/auth");
          }}>
            logout
          </Button>

        </div>
        <div className="meetContainer">
          <div className="leftPanel">
            <div>
              <h2>Providing Quality Video Call Just LIke Quality Education</h2>
              <div style={{display:'flex',gap:'10px'}}>
              <TextField onChange={(e)=>setMeetingCode(e.target.value)}>

              </TextField>
              <Button onClick={handleJoinVideoCall} variant="contained">Join</Button>
              </div>
            </div>

          </div>
          <div className="rightPanel">
            <img src="/logo3.png" />
          </div>
        </div>
      </div>
    </>
  );
};

export default withAuth(Home);
import { useData } from "../../context/DataProvider.jsx";
import { useState } from "react";
import "./Dashboard.css";
import Channel from "../../Channel/Channel.jsx";
import { FaHome, FaEnvelope, FaCog, FaUser, FaSignOutAlt } from "react-icons/fa";

function Dashboard({ onLogout }) {
  const { userHeaders } = useData();
  const [messages, setMessages] = useState([]);
  const [receiver, setReceiver] = useState(null);
  const [userList, setUserList] = useState([]);
  const [channelDetails, setChannelDetails] = useState([]);
  const [channelMembers, setChannelMembers] = useState([]);
  const [channel, setChannel] = useState({ id: 17, name: "testNewChannel" });

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2 className="sidebar-title">Slack App</h2>
        </div>
        <nav className="sidebar-menu">
          <a className="sidebar-link" href="#">
            <FaHome className="sidebar-icon" /> Home
          </a>
          <a className="sidebar-link" href="#">
            <FaEnvelope className="sidebar-icon" /> Messages
          </a>
          <a className="sidebar-link" href="#">
            <FaCog className="sidebar-icon" /> Settings
          </a>
          <a className="sidebar-link" href="#">
            <FaUser className="sidebar-icon" /> Profile
          </a>
        </nav>
        <div className="sidebar-footer">
          <button className="logout-button" onClick={onLogout}>
            <FaSignOutAlt className="sidebar-icon" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <Channel
          userList={userList}
          setUserList={setUserList}
          messages={messages}
          setMessages={setMessages}
          receiver={receiver}
          setReceiver={setReceiver}
          channelDetails={channelDetails}
          setChannelDetails={setChannelDetails}
          channelMembers={channelMembers}
          setChannelMembers={setChannelMembers}
          channel={channel}
          setChannel={setChannel}
        />
      </main>
    </div>
  );
}

export default Dashboard;

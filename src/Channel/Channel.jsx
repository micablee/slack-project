import React, { useState, useEffect } from "react";
import { useData } from "../context/DataProvider";
import axios from "axios";
import { API_URL } from "../constants/Constants";
import Chat from '../Chat/Chat.jsx';
import '../Channel/Channel.css';
import Profile from "../Profile/Profile.jsx"

function Channel(
  { messages, 
    setMessages, 
    receiver, 
    setReceiver,
    channelDetails, 
    setChannelDetails, 
    channelMembers, 
    setChannelMembers, 
    userList, 
    setUserList,
    channel,
    setChannel }) {

  const { userHeaders } = useData();
  
  const [channelList, setChannelList] = useState ([]); // render channel list 
  const [selectedUsers, setSelectedUsers] = useState([]); // checkbox for new channel
  const [isModalOpen, setIsModalOpen] = useState(false); // toggle window for creating new channel
  const [newChannelName, setNewChannelName] = useState(""); // new channel name
  console.log('Channel Props, channelMembers', channelMembers)
  // holder of receiver
  const handleReceiver = ({ id, email }) => {
    setReceiver({ id, email }); // Store both id and email
    setChannel(null); // Clear channel when selecting a receiver
  };
  // function to get user list
  const getUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/users`, { headers: userHeaders });
      const users = response.data.data;
      setUserList(users);
    } catch (error) {
      if(error.response.data.errors) {
        return alert("Cannot get users");
      }
    }
  }
  // to render user list
  useEffect(() => {
    if(userList.length === 0) {
      getUsers();
    }
  }, [userList])
// function to get channel list
  const getChannelList = async () => {
    try {
      const response = await axios.get(`${API_URL}/channels`, { headers: userHeaders });
      const channels = response.data.data;
      setChannelList(channels); 
    } catch (error) {
      if(error.response.data.errors) {
        return alert("Cannot get channels");
        
      }
    }
  }

// to render channel list
  useEffect(() => {
    if(channelList.length === 0) {
      getChannelList();
    }
  }, [channel])
// holder of channel 
  const handleChannel = (id, name) => {
    setChannel( { id, name  }); 
    setReceiver(null);
  };
  
// function to create new channel
const handleCreateChannel = async (e) => {
  e.preventDefault();

  const nameRegex = /^[a-zA-Z0-9-_ ]{3,30}$/; 
  if (!newChannelName.trim()) {
    return alert("Channel name cannot be empty.");
  }
  if (!nameRegex.test(newChannelName)) {
    return alert("Channel name can only include letters, numbers, spaces, dashes, and underscores, and must be between 3-30 characters long.");
  }

  try {
    const newChannelData = {
      name: newChannelName.trim(),
      user_ids: selectedUsers,
    };

    const response = await axios.post(`${API_URL}/channels`, newChannelData, { headers: userHeaders });

    if (response.data) {
      alert("Channel created successfully!");
      setIsModalOpen(false);
      setNewChannelName(""); // Reset form
      setSelectedUsers([]); // Reset selected users
    }
  } catch (error) {
    console.error(error);
    alert(error.response?.data?.errors || "Error creating channel");
  }
};

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedUsers("");
    setNewChannelName("");
  };


  const getChannelDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/channels/${channel.id}`, { headers: userHeaders });
      const details = response.data.data;
      setChannelDetails(details);
      setChannelMembers(details.channel_members);
    } catch (error) {
      if (error.response.data.errors) {
        return alert("Cannot get channel details", error);
      }
    }
  };

  useEffect(() => {
    if (channel?.id) {
      getChannelDetails();
    }
  }, [channel, channelMembers]); 
  

 


  return (
    <div className="dashboard-container">
      
      <div className="channel-bar">

          <h2 className="channel-header">Channel</h2>
            <ul className="channel-list-container">
                {channelList.map((channel, index) => (
                  <li 
                    key={channel.id} 
                    className='group-list'
                    onClick={() => handleChannel(channel.id, channel.name)}
                    >
                    <a 
                      className='group-name'
                      href="#"
                      >
                      {`# ${channel.name}`}
                    </a>
                  </li>
                ))}       
            </ul>

          <button 
            className="create-group-button" 
            onClick={() => {setIsModalOpen(true)}}>
            Create Channel
          </button>

        <h2 className="dm-header">Direct messages</h2>
        
          <ul className="userList-container">
              {userList &&
                      userList.map((individual) => {
                          const { id, email } = individual;
                          return (
                            <div
                            className="userList-individual"
                            key={individual.id} >
                              <div
                                onClick={()=>handleReceiver({ id, email })}>
                                <p>{email.split("@")[0]}</p>       
                              </div>
                            </div>
                          )
                      })
                    }
              { !userList && <div>No users available</div> }
          </ul>
    </div>

      
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Create New Channel</h3>
            <input
              className="enter-channel-name"
              type="text"
              placeholder="Enter #channel name"
              value={newChannelName}
              onChange={(e) => setNewChannelName(e.target.value)}
            />

            <h4 className="invite-users">Invite Users</h4>

            <div className="user-list">
                {userList.map((user) => (
                <label key={user.id}>
                  <input
                    className="checkbox"
                    type="checkbox"
                    value={String(user.id)}
                    checked={selectedUsers.includes(String(user.id))}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSelectedUsers((prev) =>
                        e.target.checked ? [...prev, value] : prev.filter((u) => u !== value)
                      );
                    }}
                  />
                    {user.email} 
                </label>
                  ))}
            </div>

            <button 
             className="create-button"
             onClick={handleCreateChannel}>
              Create
            </button>

            <button 
              onClick={handleCancel}
              className="cancel-button">
              Cancel
            </button>
          </div>
        </div>
    
      )}

      <Chat 
        receiver={receiver} 
        setReceiver = {setReceiver}
        channel={channel} 
        setChannel = {setChannel}
        userList = {userList} 
        messages = {messages} 
        setMessages = {setMessages} />

      <Profile 
        receiver={receiver} 
        setReceiver = {setReceiver}
        channel={channel} 
        setChannel={setChannel}
        userList = {userList} 
        messages = {messages} 
        setMessages = {setMessages} 
        channelDetails = {channelDetails}
        channelMembers = {channelMembers}
        setChannelMembers = {setChannelMembers}/>
   </div>
   );
  
  }

export default Channel;



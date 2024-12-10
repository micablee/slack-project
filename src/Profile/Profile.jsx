import { useState, useEffect } from "react";
import '../Profile/Profile.css'
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { RiGroup2Fill } from "react-icons/ri";

function Profile({ receiver, setReceiver, channel, setChannel, userList, channelDetails, channelMembers, setChannelMembers }) {
  const [isTyping, setIsTyping] = useState(false);
  const [memberEmail, setMemberEmail] = useState('');
  
  console.log('Profile Props, channelDetails:', channelDetails)
  console.log('Profile Props, receiver:', receiver)

  const initials = receiver?.email
    ? receiver.email
        .split("@")[0] 
        .split(".") 
        .map((part) => part.charAt(0).toUpperCase()) 
        .join("") 
    : null;

  useEffect(() => {
    setIsTyping(false);
    setChannelMembers([]);
  }, [receiver, channel]); 

  const getMemberEmail = () => {
    for (let member of channelMembers) {
      const user = userList.find((user) => user.id === member.user_id);
      if (user) {
        setMemberEmail(user.email); 
        return; 
      }
    }
    setMemberEmail('');
  };

  const handleChannelMemberClick = (user) => {
    setReceiver(user)
    setChannel(null)
    console.log('Receiver set to:', user); 
  };

  useEffect(() => {
    getMemberEmail();
  }, [userList, channelMembers]);

  return (
    <>
      <div className="profile-container">

        {receiver && (
          <>
            <div className="profile-initials">
              {initials ? (
                <div className="initials-circle">{initials}</div>
              ) : (
                <p>No Receiver Selected</p>
              )}
            </div>

            <p className="profile-name">
              {channel?.name
                ? `#${channel.name}`
                : receiver?.email
                ? receiver.email.split("@")[0]
                : "Select a user or channel"}
            </p>

            <p className="email-name">
              <span className="email-icon">
                <MdEmail />
              </span>
              {channel?.name
                ? `#${channel.name}`
                : receiver?.email
                ? receiver.email
                : "Select a user or channel"}
            </p>

            <p className="phone-name">
              <span className="phone-icon">
                <FaPhoneAlt />
              </span>
              {channel?.name
                ? `#${channel.name}`
                : receiver?.id
                ? receiver.id
                : "Select a user or channel"}
            </p>
          </>
        )}

        {channel && (
          <>
            <div className="profile-initials">
              {initials ? (
                <div className="initials-circle">{initials}</div>
              ) : (
                null
              )}
            </div>

            <p className="phone-name">
              <div className="group-icon">
                <RiGroup2Fill />
              </div>
              <div className="group-name-profile">
                {channel?.name
                  ? `${channel.name}`
                  : receiver?.id
                  ? receiver.id
                  : "Select a user or channel"}
              </div>
            </p>

            {channel && channelMembers?.length > 0 ? (
              <>
                <p className="chat-members-header">Chat members:</p>
                <div className="memberList-container">
                  {channelMembers.map((channelIndividual) => {
                    const { user_id } = channelIndividual; 
                    const user = userList.find((u) => u.id === user_id);
                    return (
                      <div key={channelIndividual.id} className="memberList-individual">
                        <div
                          className="memberList-email-id-container"
                          onClick={() => handleChannelMemberClick(user)}
                        >
                          <p><MdEmail /> {user ? `${user.email}` : "Email not found"}</p>
                          <p><FaPhoneAlt />{`${user_id}`} </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              null
            )}

          </>
        )}

      </div>
    </>
  );
}

export default Profile;

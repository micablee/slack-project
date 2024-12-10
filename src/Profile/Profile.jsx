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

  // Generate initials for receiver
  const initials = receiver?.email
    ? receiver.email
        .split("@")[0] // Get part before @
        .split(".") // Split by dots if multiple parts (e.g., john.doe)
        .map((part) => part.charAt(0).toUpperCase()) // Get the first letter of each part
        .join("") // Join them together (e.g., JD)
    : null;

  useEffect(() => {
    setIsTyping(false);
    setChannelMembers([]);
  }, [receiver, channel]); // Runs when the receiver or channel changes

  // Function to get the email of a member based on the user_id match
  const getMemberEmail = () => {
    // Iterate over the channelMembers array
    for (let member of channelMembers) {
      // Find the user in userList where the IDs match
      const user = userList.find((user) => user.id === member.user_id);
      if (user) {
        setMemberEmail(user.email); // Set the member email if a match is found
        return; // Exit the function once the match is found
      }
    }
    // If no match is found, set memberEmail to an empty string or handle as needed
    setMemberEmail('');
  };

  const handleChannelMemberClick = (user) => {
    setReceiver(user) // Update the receiver for direct messaging
    setChannel(null)
    console.log('Receiver set to:', user); // Debug log
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
              {/* Display initials in a styled circle */}
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
              {/* Display initials in a styled circle */}
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
                    const { user_id } = channelIndividual; // Extract user_id
                    // Find the corresponding user in userList
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

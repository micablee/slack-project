import { useState, useEffect, useRef } from "react";
import { useData } from "../context/DataProvider";
import axios from "axios";
import { API_URL } from "../constants/Constants";
import "../Chat/Chat.css";

function Chat({ receiver, setReceiver, channel, userList, messages, setMessages }) {
    const { userHeaders } = useData();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [reply, setReply] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Edit modal state
    const [channelUser, setChannelUser] = useState([]); // Channel user selection
    const messagesRef = useRef(null); // Ref for message container

    const fetchMessages = async () => {
        if (!receiver && !channel) return; // Don't fetch if no receiver is selected
        setLoading(true);
        setError(null);

        const receiverClass = channel ? "Channel" : "User";
        const receiverId = channel ? channel.id : receiver?.id;

        try {
            const response = await axios.get(
                `${API_URL}/messages?receiver_id=${receiverId}&receiver_class=${receiverClass}`,
                { headers: userHeaders }
            );
            setMessages(response.data.data);
        } catch (err) {
            setError("Failed to fetch messages. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleReply = (e) => setReply(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const receiverClass = channel ? "Channel" : "User";
        const receiverId = channel ? channel.id : receiver?.id;

        try {
            const messageInfo = {
                receiver_id: receiverId,
                receiver_class: receiverClass,
                body: reply,
            };

            const response = await axios.post(
                `${API_URL}/messages`,
                messageInfo,
                { headers: userHeaders }
            );

            if (response.data.data) {
                alert("Message sent!");
                setReply(""); // Clear the input field
                fetchMessages(); // Refresh messages
            }
        } catch (error) {
            console.error(error);
        }
    };

    const addUserToChannel = async (e) => {
        e.preventDefault();

        try {
            const newUserData = {
                id: channel.id,
                member_id: Number(channelUser),
            };

            const response = await axios.post(
                `${API_URL}/channel/add_member`,
                newUserData,
                { headers: userHeaders }
            );

            if (response.data) {
                alert("User added successfully!");
                setIsEditModalOpen(false);
                setChannelUser([]);
            }
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.errors || "User is already in the channel.");
        }
    };

    const handleCancelAddUser = () => {
        setIsEditModalOpen(false);
        setChannelUser([]);
    };

    useEffect(() => {
        setMessages([]);
        fetchMessages();
    }, [channel, receiver, userHeaders]); // Re-fetch messages when receiver or channel changes

    useEffect(() => {
        if (messagesRef.current) {
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight; // Auto scroll to bottom
        }
    }, [messages]);

    return (
        <div className={`group-window ${loading ? "no-scroll" : ""}`}>
            {receiver || channel ? (
                <>
                    <div className="receiver-header-container">
                        <h3>
                            {channel?.name
                                ? `# ${channel.name}`
                                : receiver?.email
                                ? receiver.email.split("@")[0]
                                : "Select a user or channel"}
                        </h3>

                        <button
                            className="edit-channel-button"
                            onClick={() => setIsEditModalOpen(true)}
                        ></button>

                        {isEditModalOpen && (
                            <div className="modal">
                                <div className="modal-content">
                                    <h3>#{channel.name}</h3>
                                    <h4>Add Users</h4>
                                    <div className="user-list">
                                        {userList.map((user) => (
                                            <label key={user.uid}>
                                                <input
                                                    className="checkbox"
                                                    type="checkbox"
                                                    value={String(user.id)}
                                                    checked={channelUser.includes(String(user.id))}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        setChannelUser((prev) =>
                                                            e.target.checked
                                                                ? [...prev, value]
                                                                : prev.filter((u) => u !== value)
                                                        );
                                                    }}
                                                />
                                                {user.email}
                                            </label>
                                        ))}
                                    </div>
                                    <button className="save-button" onClick={addUserToChannel}>
                                        Save
                                    </button>
                                    <button
                                        onClick={handleCancelAddUser}
                                        className="cancel-button-editChannel"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {loading && (
                        <div className="spinner-container">
                            <div className="spinner"></div>
                        </div>
                    )}

                    {error && <p className="error">{error}</p>}

                    <div className="messages" ref={messagesRef}>
                        {messages.length > 0
                            ? messages.map((msg) => (
                                  <div
                                      key={msg.id}
                                      className={`message ${
                                          (channel && msg.sender.uid === userHeaders.uid) ||
                                          (!channel && msg.sender.email === receiver?.email)
                                              ? "sender"
                                              : "receiver"
                                      }`}
                                  >
                                      <p>
                                          {channel && (
                                              <strong>{msg.sender.uid.split("@")[0]}: </strong>
                                          )}
                                          {msg.body}
                                          <br />
                                          <span className="timestamp">
                                              {new Date(msg.created_at).toLocaleTimeString([], {
                                                  hour: "2-digit",
                                                  minute: "2-digit",
                                                  month: "2-digit",
                                                  day: "2-digit",
                                                  year: "2-digit",
                                              })}
                                          </span>
                                      </p>
                                  </div>
                              ))
                            : null}
                    </div>

                    <div className="chat-bar">
                        <input
                            className="chat-input"
                            type="text"
                            value={reply}
                            onChange={handleReply}
                            placeholder="Type a message"
                        />
                        <button onClick={handleSubmit} className="send-btn">
                            Send
                        </button>
                    </div>
                </>
            ) : (
                <p>Select a user or channel to view messages.</p>
            )}
        </div>
    );
}

export default Chat;


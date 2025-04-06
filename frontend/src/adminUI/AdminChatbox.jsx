import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AdminChatbox.module.css';

const AdminChatbox = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Hello admin, I can\'t access my account even with the correct password!',
      sender: 'user',
      timestamp: '10:00 AM'
    },
    {
      id: 2,
      text: 'Also, I keep getting error messages when trying to reset it.',
      sender: 'user', 
      timestamp: '10:02 AM'
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [activeChats, setActiveChats] = useState([
    { id: 1, user: 'JohnDoe', unread: 2, issue: 'Account access problems' },
    { id: 2, user: 'JaneSmith', unread: 0, issue: 'Payment question' }
  ]);
  const [currentChat, setCurrentChat] = useState(1);

  const sendAutoReply = () => {
    setTimeout(() => {
      const reply = {
        id: messages.length + 1,
        text: "I'm looking into your account issue now. Can you tell me what error message you're seeing exactly?",
        sender: 'admin',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, reply]);
      
      setActiveChats(prev => 
        prev.map(chat => 
          chat.id === currentChat ? {...chat, unread: 0} : chat
        )
      );
    }, 1500);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: messages.length + 1,
        text: newMessage,
        sender: 'admin',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMsg]);
      setNewMessage('');
      
      if (newMessage.toLowerCase().includes('password')) {
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: prev.length + 1,
            text: "Yes, I've tried resetting but the link expires immediately!",
            sender: 'user',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }]);
          setActiveChats(prev => 
            prev.map(chat => 
              chat.id === currentChat ? {...chat, unread: 1} : chat
            )
          );
        }, 2000);
      }
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatSidebar}>
        <div className={styles.sidebarHeader}>
          <button 
            className={styles.backButton}
            onClick={() => navigate('/admin/dashboard')}
          >
            ← Back to Dashboard
          </button>
          <h3>Active Support Chats</h3>
        </div>
        <ul>
          {activeChats.map(chat => (
            <li 
              key={chat.id} 
              className={`${styles.chatItem} ${currentChat === chat.id ? styles.active : ''}`}
              onClick={() => {
                setCurrentChat(chat.id);
                sendAutoReply();
              }}
            >
              <div>
                <strong>{chat.user}</strong>
                <p className={styles.issuePreview}>{chat.issue}</p>
              </div>
              {chat.unread > 0 && <span className={styles.unreadBadge}>{chat.unread}</span>}
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.chatMain}>
        <div className={styles.chatHeader}>
          <h3>Support Chat with {activeChats.find(c => c.id === currentChat)?.user}</h3>
          <span className={styles.issueTag}>
            Issue: {activeChats.find(c => c.id === currentChat)?.issue}
          </span>
        </div>

        <div className={styles.messagesContainer}>
          {messages.map(msg => (
            <div 
              key={msg.id} 
              className={`${styles.message} ${msg.sender === 'admin' ? styles.adminMsg : styles.userMsg}`}
            >
              <div className={styles.messageContent}>
                <p>{msg.text}</p>
                <span className={styles.timestamp}>
                  {msg.sender === 'admin' ? 'You' : activeChats.find(c => c.id === currentChat)?.user} • {msg.timestamp}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.messageInput}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your response..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button onClick={handleSendMessage}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminChatbox;
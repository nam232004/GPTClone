import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import GptLogo from './assets/chatgpt.svg';
import sendBtn from './assets/send.svg';
import stopBtn from './assets/stop.svg';
import userIcon from './assets/user-icon.png';
import { sendMsgToOpenAI } from './openai';
import ReactMarkdown from 'react-markdown';

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      text: "Can I help you?",
      isBot: true,
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingMessage, setTypingMessage] = useState("");
  const chatContainerRef = useRef(null);

  const handleSend = async () => {
    if (input.trim() === "") return;

    setMessages([...messages, { text: input, isBot: false }]);
    setInput("");
    setIsTyping(true);

    const typingInterval = setInterval(() => {
      setTypingMessage(prev => prev.length < 50 ? prev + "." : "");
    }, 500);

    try {
      const response = await sendMsgToOpenAI(input);

      clearInterval(typingInterval);
      setIsTyping(false);
      setTypingMessage("");

      setMessages(prevMessages => [
        ...prevMessages,
        { text: "", isBot: true, typing: true },
      ]);

      setTimeout(() => {
        typeWriter(response, 5);
      }, 100);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleStop = () => {
    setIsTyping(false);
    setTypingMessage("");
  };

  const typeWriter = (text, speed) => {
    setMessages(prevMessages => {
      const updatedMessages = [...prevMessages];
      const lastMessage = updatedMessages.pop();

      if (lastMessage && lastMessage.isBot && lastMessage.typing) {
        lastMessage.typing = false;
        lastMessage.text = "";
        updatedMessages.push(lastMessage);
      }

      updatedMessages.push({ text: "", isBot: true });
      return updatedMessages;
    });

    setTimeout(() => {
      const chatBotElement = document.querySelector('.chat.bot:last-child .txt');
      if (!chatBotElement) return;

      let i = 0;
      function type() {
        if (i < text.length) {
          chatBotElement.innerHTML += text.charAt(i);
          i++;
          setTimeout(type, speed);
        }
      }
      type();
    }, 100);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        e.preventDefault();
        setInput(input + "\n");
      } else {
        e.preventDefault();
        handleSend();
      }
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="App">
      <div className="left">
        <div className="top_left_container">
          <div className="top_left">
            <button className='flex_start'><i className="fa-solid fa-bars"></i></button>
            <button className='flex_end'><i className="fa-regular fa-pen-to-square"></i></button>
          </div>
        </div>
        <div className="middle_left">
          <div className="middle_left_brand">
            <div className="card">
              <div className="card_content">
                <img src={GptLogo} alt="" />
                <span>ChatGPT</span>
              </div>
              <div className="card_content">
                <i className="fa-brands fa-microsoft"></i>
                <span>Khám phá GPT</span>
              </div>
            </div>
          </div>
          <div className="middle_left_history">
            <div className="history_content">
              <div className="time">Hôm nay</div>
              {Array.from({ length: 20 }, (_, i) => (
                <div key={i} className="history_content_name">Spam lịch sử</div>
              ))}
            </div>
          </div>
        </div>
        <div className="bottom_left">
          <div className="card">
            <div className="card_content">
              <img src={GptLogo} alt="" />
              <span>Nâng cấp lên mấy cái gì đó...</span>
            </div>
          </div>
        </div>
      </div>
      <div className="right">
        <div className="top_left_container">
          <div className="top_left">
            <button className='flex_start'><h5>ChatGPT</h5></button>
            <div className='flex_end right_top_end'>
              <i className="fa-solid fa-arrow-up-from-bracket"></i>
              <img className='circle-img' src={userIcon} alt="" />
            </div>
          </div>
        </div>
        <div className="right_content">
          <div className="chat_zone" ref={chatContainerRef}>
            <div className="chats">
              {messages.map((mes, i) => (
                <div key={i} className={`chat ${mes.isBot ? "bot" : "user"} ${mes.typing ? "typing" : ""}`}>
                  {mes.isBot ?
                    <img className='avt_bot' src={GptLogo} alt="" /> : null
                  }
                  <ReactMarkdown className="txt">{mes.text}</ReactMarkdown>
                </div>
              ))}
              {isTyping && <div className="chat bot loading">Loading... </div>}
            </div>
          </div>
        </div>
        <div className="right_foot">
          <div className="inp">
            <i className="fa-solid fa-link"></i>
            <textarea
              placeholder='Send a message'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className="send" onClick={isTyping ? handleStop : handleSend}>
              <img src={isTyping ? stopBtn : sendBtn} alt="Send" />
            </button>
          </div>
          <p>Copyright©2024 - ChatGPT_Clone by Nambilaptrinh | nam232004@gmail.com</p>
        </div>
      </div>
    </div>
  );
}

export default App;

import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import AttachIcon from '../assets/attach.icon'
import CrossIcon from '../assets/cross.icon'
import DownloadIcon from '../assets/download.icon'
import { generateStockImage, getReadableDate } from '../helpers'
import AssignedTask from '../models/AssignedTask'
import Attachment from '../models/Attachement'
import Message from '../models/Message'
import { useLatestMessagesStore, useUserStore } from '../stores'
import Button from './Button'
import Typography from './Typography'

const StyledChatBox = styled.div`
  background: #F0F0F0;
  border-radius: 10px;
  overflow: hidden;
  gap: 10px;

  .messages-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 20px;
    gap: 15px;
    max-height: 400px;
    overflow: overlay;

    &:empty {
      padding: 0;
    }

    .message {
      position: relative;
      background: white;
      padding: 15px;
      border-radius: 10px;
      display: inline-flex;
      align-items: flex-start;
      gap: 15px;
      max-width: calc(100% - 80px);
      box-shadow: 0px 1px 3px rgba(84, 111, 255, 0.1);

      img {
        border-radius: 50%;
        height: 40px;
        width: 40px;
      }

      .message-date {
        position: absolute;
        left: calc(100% + 15px);
        top: 50%;
        white-space: nowrap;
        transform: translateY(-50%);
        color: var(--text-secondary);
        transition: opacity .4s ease;
        opacity: 0;
        user-select: none;
      }

      &.own {
        background: var(--primary-color);
        color: white;
        align-self: flex-end;

        .message-date {
          right: calc(100% + 15px);
          left: auto;
        }
      }

      &:hover {
        .message-date {
          opacity: 1;
        }
      }
    }
  }

  .controls {
    border: solid 1px var(--text-secondary);
    border-radius: 10px;
    background: white;
    
    .chat-bar {
      display: flex;
      align-items: center;
      padding: 10px 20px;
      gap: 10px;
      
      textarea {
        flex: 1;
        padding: 15px 0;
        border: none;
        outline: none;
        font-size: 14px;
        font-family: inherit;
        resize: none;
  
        &::placeholder {
          color: var(--text-secondary);
          font-family: inherit;
        }

        &:placeholder-shown {
          padding-top: 15px;
          padding-bottom: 0;
        }
      }

      .attach-icon {
        font-size: 24px;
      }

    }
  }

  .attachments {
      display: flex;
      align-items: center;
      gap: 15px;
      padding: 0 20px 20px;
      flex-wrap: wrap;

      &:empty {
        display: none;
      }
      
      .attachment {
        position: relative;
        min-height: 60px;
        max-width: 250px;
        min-width: 60px;
        border: solid 1px var(--text-secondary);
        border-radius: 10px;
        padding: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
        line-height: 1;
        background: white;
        color: black;

        
        p {
          line-height: 1;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .remove-btn {
          cursor: pointer;
          user-select: none;
          

        }

        &:hover .remove-btn {
          color: var(--danger-color)
        }

        /* &:hover {
          &:after {
            content: "x";
            height: 20px;
            width: 20px;
            background: var(--primary-color);
            border-radius: 50%;
            position: absolute;
            right: -10px;
            top: -10px;
            color: white;
            display: flex;
            justify-content: center;
            align-self: center;
            line-height: 1.2;
            cursor: pointer;
            font-size: 14px;
          }
        } */
      }
    }
`

const defMessages = [
  {
    id: crypto.randomUUID(),
    author: {
      id: "8125676e-8c04-4501-8ef7-6d58f4eee329",
      firstName: "Anais",
      lastName: "Boehm"
    },
    image: "https://via.placeholder.com/50/cccccc/000000?text=JS",
    text: "Hello I have few question regarding this task?",
    createdAt: '2023-01-23T09:34:11.007Z',
    attachments: [] as Attachment[]
  }, 
  {
    id: crypto.randomUUID(),
    author: {
      id: "1234",
      firstName: "EPITA",
      lastName: "Admin"
    },
    image: "https://via.placeholder.com/50/cccccc/000000?text=BM",
    text: "Hello there, how can I help you?",
    createdAt: '2023-01-23T10:24:15.007Z',
    attachments: [] as Attachment[]
  },
]

const ChatBox: React.FunctionComponent<{assignedTask: AssignedTask, onMessageSend: (messages: any) => void }> = ({ assignedTask, onMessageSend }) => {
  const user = useUserStore((state) => state.user);
  const addLatestMessage = useLatestMessagesStore((state) => state.addLatestMessage)

  const [newMessageText, setNewMessageText] = useState('');
  const [messages, setMessages] = useState(defMessages);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const isOwnMessage = (authorId: string) => { 
    console.log(user?.type, authorId)
    if (user?.type === "staff" && authorId === "1234") return true
    return authorId === user?.id
  };

  const handleSend = (e: React.FormEvent) => {
    if (!user) return;
    e.preventDefault();
    const newMessage = {
      id: crypto.randomUUID(),
      author: user as any,
      text: newMessageText,
      createdAt: new Date().toJSON(),
      attachments
    }
    const newMessages = [...messages, newMessage] 
    setMessages(newMessages as any);

    setAttachments([]);
    setNewMessageText('');
  }
  return (
    <StyledChatBox>
      <div className='messages-container'>
        {messages.map((message) => (
          <div key={message.id} className={`message ${isOwnMessage(message.author.id) ? 'own' : ''}`}>
            {!isOwnMessage(message.author.id) && <img src={generateStockImage(message.author.firstName, message.author.lastName)} />}
            <div className='message-content'>
              {!isOwnMessage(message.author.id) && <Typography size={14} weight="700" className='message-author'>{message.author.firstName} {message.author.lastName}</Typography>}
              <Typography size={14} className='message-text'>{message.text}</Typography>
              <div className="attachments" style={{marginTop: "16px"}}>
              {message.attachments.map((attachment) => (
                <div key={attachment.id} className='attachment' style={{ cursor: "pointer" }}>
                  <Typography size={14} weight="600">{attachment.name}</Typography>
                  <DownloadIcon />
                </div>
              ))}
            </div>
            </div>
            <Typography size={12} className="message-date">{getReadableDate(message.createdAt)}</Typography>
          </div>
        ))}
      </div>
      <form className='controls' onSubmit={handleSend}>
        <div className='chat-bar'>
          <textarea placeholder='Write your message here…' value={newMessageText} onChange={({target}) => setNewMessageText(target.value)} />
          <Button className='attach-icon' minimal color="var(--text-secondary)" type="button" onClick={() => setAttachments([...attachments, { id: crypto.randomUUID(), name: `attachment-${attachments.length}.pdf`, createdAt: new Date().toJSON(), path: "./attachment.txt"}])}><AttachIcon /></Button>
          <Button type="submit" disabled={!newMessageText} >Send</Button>
        </div>
        {!!attachments.length && (
          <div className="attachments">
            {attachments.map((attachment) => (
              <div key={attachment.id} className='attachment'>
                <Typography size={14} weight="600">{attachment.name}</Typography>
                <span className='remove-btn' onClick={() => setAttachments(attachments.filter((att) => attachment.id !== att.id))}><CrossIcon /></span>
              </div>
            ))}
          </div>
        )}
      </form>
    </StyledChatBox>
  )
}

export default ChatBox
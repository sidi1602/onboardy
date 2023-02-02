import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import Button from '../components/Button';
import Card from '../components/Card';
import SearchBar from '../components/SearchBar';
import TaskPopup from '../components/TaskPopup';
import Typography from '../components/Typography';
import { generateStockImage } from '../helpers';
import LatestMessage from '../models/LatestMessage';
import { useLatestMessagesStore } from '../stores'

const StyledLatestMessages = styled.div`
  display: flex;
  gap: 32px;
  height: calc(100vh - 125px);
  overflow: overlay;

  .latest-messages-list {
    width: 400px;
    flex-shrink: 0;
    overflow: auto;

    .latest-messages-search-bar {
      margin-bottom: 24px;

      input {
        border: 1px solid #eee;
      }
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        padding: 20px;
        border-bottom: 1px solid #ddd;
        transition: 0.2s ease;
        background: #f5f5f5;

        &:hover {
          background: #f0f0f0;
          cursor: pointer;
        }

        &.active {
          background: #e5e5e5;
        }
      }
    }
  }

  .message-preview-container {
    flex-grow: 1;
    overflow: auto;
  }
`;

const LatestMessages: React.FunctionComponent = () => {
  const latestMessages = useLatestMessagesStore((state) => state.latestMessages);
  const getLatestMessages = useLatestMessagesStore((state) => state.getLatestMessages);

  const [selectedMessage, setSelectedMessage] = useState<LatestMessage | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getLatestMessages();
  }, [])
  

  const assignedTask = selectedMessage?.student
  
  return (
    <StyledLatestMessages>
      <Card className="latest-messages-list">
        <SearchBar
          className="latest-messages-search-bar"
          placeholder="Search latest messages"
          onChange={({ target }) => setSearchQuery(target.value)}
        />
        <ul>
          {latestMessages
            // .filter((message) => message.title.toLowerCase().includes(searchQuery))
            .map((message) => (
              <li
                key={message.id}
                className={message.id === selectedMessage?.id ? "active" : ""}
                onClick={() => setSelectedMessage(message)}
              >
                <Typography size={16} weight="600">{message.assignedTask.task.title}</Typography>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px", margin: "10px 10px 0", borderRadius: "10px", background: "white" }}>
                  <img style={{ borderRadius: "50%", height: "30px" }} src={generateStockImage(message.student.firstName, message.student.lastName)}/>
                  <div>
                    <Typography size={12} weight="600">
                      {message.student.firstName} {message.student.lastName}
                    </Typography>
                    <Typography size={12}>{message.message.text}</Typography>
                  </div>
                </div>
              </li>
            ))}
        </ul>
      </Card>
      <Card className="message-preview-container">
        {selectedMessage ? <TaskPopup assignedTask={selectedMessage.assignedTask}  onAssignedTaskChange={() => {}} staticMode /> : <Typography styles={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center", color: "var(--text-secondary)"}}>Select a message from the menu to preview here</Typography>}
      </Card>
    </StyledLatestMessages>
  )
}

export default LatestMessages
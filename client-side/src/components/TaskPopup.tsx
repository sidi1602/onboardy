import React from "react";
import AssignedTask from "../models/AssignedTask";
import Message from "../models/Message";
import Button from "./Button";
import ChatBox from "./ChatBox";
import PopupMenu from "./PopupMenu";
import Typography from "./Typography";

const TaskPopup: React.FunctionComponent<{
  assignedTask: AssignedTask;
  onClose?: () => void;
  onAssignedTaskChange: (change: any) => void;
  staticMode?: boolean
}> = ({ assignedTask, onClose, onAssignedTaskChange, staticMode = false }) => {
  return (
    <PopupMenu onClose={onClose} style={{ minHeight: "80%"}} staticMode={staticMode}>
      <div style={{ float: "right" }}>
        {assignedTask.isDone ? (
          <Button
            color="var(--danger-color)"
            minimal
            onClick={() => onAssignedTaskChange({ isDone: false })}
          >
            Mark as undone
          </Button>
        ) : (
          <Button minimal onClick={() => onAssignedTaskChange({ isDone: true })}>
            Mark as done
          </Button>
        )}
      </div>
      <Typography size={24} weight="600" styles={{ marginBottom: "24px" }}>
        {assignedTask.task.title}
      </Typography>
      <Typography size={16} weight="600" styles={{ marginBottom: "8px" }}>
        Description
      </Typography>
      <Typography styles={{ marginBottom: "16px" }}>
        {assignedTask.task.description}
      </Typography>

      <Typography size={16} weight="600" styles={{ marginBottom: "8px" }}>
        Discussion
      </Typography>
      <ChatBox assignedTask={assignedTask} onMessageSend={onAssignedTaskChange} />
    </PopupMenu>
  );
};

export default TaskPopup;

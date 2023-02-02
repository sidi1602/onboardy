import React from "react";
import AssignedTask from "../models/AssignedTask";
import Task from "../models/Task";
import Card from "./Card";
import Typography from "./Typography";

interface TaskCardProps {
  assignedTask: AssignedTask;
  onClick: () => void;
}

const TaskCard: React.FunctionComponent<TaskCardProps> = ({
  assignedTask,
  onClick,
}) => {
  return (
    <Card className="task" onClick={onClick} style={{ cursor: "pointer", maxWidth: "100%", filter: assignedTask.isDone ? "grayscale(1)" : undefined }}>
      {assignedTask.task?.isUrgent &&  <Typography color="var(--danger-color)" size={14} weight="600" styles={{ float: "right"}}>Urgent Task!</Typography>}
      <Typography
        size={18}
        weight="600"
        styles={{
          marginBottom: "4px",
          textDecoration: assignedTask.isDone ? "line-through" : undefined,
        }}
      >
        {assignedTask.task.title}
      </Typography>
      <Typography color="#54577A" size={12} weight="400" styles={{ marginBottom: "14px" }}>Due on: {assignedTask.task.dueDate}</Typography>
      <Typography
        weight="500"
        styles={{
          color: "#8E92BC",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {assignedTask.task.description}
      </Typography>
    </Card>
  );
};

export default TaskCard;

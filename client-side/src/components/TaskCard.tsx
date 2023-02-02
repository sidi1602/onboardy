import React, { useEffect, useState } from "react";
import AssignedTask from "../models/AssignedTask";
import Task from "../models/Task";
import { useAssignedTasksStore, useUserStore } from "../stores";
import Card from "./Card";
import TaskPopup from "./TaskPopup";
import Typography from "./Typography";

interface TaskCardProps {
  assignedTask: AssignedTask;
}

const TaskCard: React.FunctionComponent<TaskCardProps> = ({ assignedTask }) => {
  const [task, setTask] = useState<Task | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const editAssignedTask = useAssignedTasksStore((state) => state.editAssignedTask);
  const getAssignedTasks = useAssignedTasksStore((state) => state.getAssignedTasks);
  const user = useUserStore((state) => state.user);

  const getTaskById = async () => {
    const taskRes = await fetch(
      `http://localhost:4000/api/tasks/${assignedTask.taskId}`
    );
    const task = await taskRes.json();
    setTask(task);
  };

  useEffect(() => {
    getTaskById();
  }, []);

  const handleAssignedTaskChange = (change: any) => {
    editAssignedTask({...assignedTask, ...change}, user?.student?.id || "")
    getAssignedTasks(user?.student?.id || "")
  }

  return task ? (
    <>
      <Card
        className="task"
        onClick={() => setIsOpen(true)}
        style={{
          cursor: "pointer",
          maxWidth: "100%",
          filter: assignedTask.isDone ? "grayscale(1)" : undefined,
          height: "140px",
          overflow: "hidden"
        }}
      >
        {task?.isUrgent && (
          <Typography
            color="var(--danger-color)"
            size={14}
            weight="600"
            styles={{ float: "right" }}
          >
            Urgent Task!
          </Typography>
        )}
        <Typography
          size={18}
          weight="600"
          styles={{
            marginBottom: "4px",
            textDecoration: assignedTask.isDone ? "line-through" : undefined,
          }}
        >
          {task.title}
        </Typography>
        <Typography
          color="#54577A"
          size={12}
          weight="400"
          styles={{ marginBottom: "14px" }}
        >
          Due on: {task.dueDate}
        </Typography>
        <Typography
          weight="500"
          styles={{
            color: "#8E92BC",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          <div>{document.createRange().createContextualFragment(task.description || "").textContent}</div>
        </Typography>
      </Card>
      {isOpen && (
        <TaskPopup
          assignedTask={{ ...assignedTask, task }}
          onClose={() => setIsOpen(false)}
          onAssignedTaskChange={handleAssignedTaskChange}
        />
      )}
    </>
  ) : null;
};

export default TaskCard;

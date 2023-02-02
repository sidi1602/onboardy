import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Button from "../components/Button";
import Card from "../components/Card";
import Input from "../components/Input";
import SearchBar from "../components/SearchBar";
import SearchTags from "../components/SearchTags";
import Switch from "../components/Swtich";
import Tag from "../components/Tag";
import Typography from "../components/Typography";
import ITag from "../models/Tag";
import Task from "../models/Task";
import { useTasksStore } from "../stores";

const StyledTasks = styled.div`
  display: flex;
  gap: 32px;
  height: calc(100vh - 125px);
  overflow: overlay;

  .tasks-list {
    width: 400px;
    flex-shrink: 0;
    overflow: auto;

    .tasks-search-bar {
      margin-bottom: 24px;

      input {
        border: 1px solid #eee;
      }
    }

    .create-button {
      margin-bottom: 24px;
      width: 100%;
      padding: 16px;
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        padding: 20px;
        border-bottom: 1px solid #eee;
        transition: 0.2s ease;

        &:hover {
          background: #f5f5f7;
          cursor: pointer;
        }

        &.active {
          background: #f0f0f0;
        }
      }
    }
  }

  .task-preview-container {
    flex-grow: 1;
    overflow: auto;

    .task-description:empty:after {
      content: "Write task description here";
      color: var(--text-secondary);
    }
  }
`;

const Tasks: React.FunctionComponent = () => {
  const tasks = useTasksStore((state) => state.tasks);
  const getTasks = useTasksStore((state) => state.getTasks);
  const addTask = useTasksStore((state) => state.addTask);
  const removeTask = useTasksStore((state) => state.removeTask);
  const editTask = useTasksStore((state) => state.editTask);

  useEffect(() => {
    getTasks();
  }, [])

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCreateNewTask = () => {
    const newTask = {
      id: crypto.randomUUID(),
      title: "",
      description: "",
      tags: [],
      dueDate: "",
      isUrgent: false,
      isNew: true
    };
    setSelectedTask(newTask);
  };

  const handleSave = (task: Task) => {
    if (task.isNew) {
      const { isNew, ...newTask  } = task;
      addTask(newTask );
    } else {
      editTask(task);
    }
  }

  const handleRemove = (taskId: string) => {
    removeTask(taskId);
    setSelectedTask(null);
  }

  return (
    <StyledTasks>
      <Card className="tasks-list">
        <SearchBar
          className="tasks-search-bar"
          placeholder="Search tasks"
          onChange={({ target }) => setSearchQuery(target.value)}
        />
        <Button className="create-button" onClick={handleCreateNewTask}>
          Create new task
        </Button>
        <ul>
          {tasks
            .filter((task) => task.title?.toLowerCase().includes(searchQuery))
            .map((task) => (
              <li
                key={task.id}
                className={task.id === selectedTask?.id ? "active" : ""}
                onClick={() => setSelectedTask(task)}
              >
                <Typography size={16} weight="600">
                  {task.title || "New task"}
                </Typography>
              </li>
            ))}
        </ul>
      </Card>
      <Card className="task-preview-container">
        <TasksPreview selectedTask={selectedTask} onSave={handleSave} onRemove={handleRemove} />
      </Card>
    </StyledTasks>
  );
};

const TasksPreview: React.FunctionComponent<{ selectedTask: Task | null, onSave: (task: Task) => void, onRemove: (taskId: string) => void }> = ({ selectedTask, onSave, onRemove }) => {
  const [task, setTask] = useState<Task | null>(selectedTask || null);
  const [isEditing, setIsEditing] = useState(false);
  const descriptionRef = useRef<any>(null);

  const handleTagsAdd = (tag: ITag) => {
    if (!task || task?.tags.includes(tag)) return;
    setTask({ ...task, tags: [...task.tags, tag] } as Task);
  };

  useEffect(() => {
    setIsEditing(false);

    setTask(selectedTask);
    if (selectedTask?.isNew) {
      setIsEditing(true);
    }
  }, [selectedTask]);

  const handleTagRemove = (tag: ITag) => {
    if (!task) return
    setTask({ ...task, tags: [...task.tags.filter((t) => t.label !== tag.label)] } as Task);
  };

  const handleCancel = () => {
    if (!task) return
    setIsEditing(false)
    if (task.isNew) {
      setTask(null)
    }
  }

  const handleSave = () => {
    if (!task) return
    onSave({...task, description: descriptionRef.current.innerHTML});
    descriptionRef.current.value = "";
    setIsEditing(false);
  }

  const handleTaskRemove = () => {
    if (!task) return
    const isConfirmed = confirm(`Are you sure you want to remove the following task: \n\n "${task.title}"`);
    if(!isConfirmed) return

    onRemove(task._id || "");
  }

  return (
    <div className="task-preview" style={{ position: "relative", height: "100%" }}>
    { task ?  (
      <>
        <div style={{ display: "flex", justifyContent: "flex-end",gap: "10px" }}>
          {isEditing ? (
            <>
              <Button minimal color="black" onClick={handleCancel}>
                Cancel
              </Button>
              <Button minimal onClick={handleSave}>
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button minimal color="var(--danger-color)" onClick={handleTaskRemove}>
                Delete Task
              </Button>
              <Button minimal onClick={() => setIsEditing(true)}>
                Edit Task
              </Button>
            </>
          )}
        </div>
        {isEditing ? (
          <>
            <Typography
              size={16}
              weight="600"
              styles={{ marginBottom: "8px" }}
            >
              Title
            </Typography>
            <Input
              placeholder="Task title"
              value={task.title}
              style={{ marginBottom: "16px" }}
              onChange={({ target }: any) =>
                setTask({ ...task, title: target.value })
              }
            />
          </>
        ) : (
          <Typography
            size={24}
            weight="600"
            styles={{ marginBottom: "24px" }}
          >
            {task.title}
          </Typography>
        )}

        <Typography size={16} weight="600" styles={{ marginBottom: "8px" }}>
          Due date
        </Typography>
        {isEditing ? (
          <Input
            type="date"
            placeholder="Due date"
            value={task.dueDate}
            style={{ marginBottom: "16px" }}
            onChange={({ target }: any) =>
              setTask({ ...task, dueDate: target.value })
            }
          />
        ) : (
          <Typography size={14} styles={{ marginBottom: "16px" }}>
            {task.dueDate}
          </Typography>
        )}

        <Typography size={16} weight="600" styles={{ marginBottom: "8px" }}>
          Urgent task
        </Typography>
        <Switch onChange={(isChecked) => setTask({ ...task, isUrgent: isChecked })} defaultChecked={task.isUrgent} disabled={!isEditing} />

        <Typography size={16} weight="600" styles={{ marginBottom: "8px", marginTop: "16px" }}>
          Tags
        </Typography>
        {isEditing && (
          <SearchTags
            excludedTags={task.tags}
            onSelect={handleTagsAdd}
          />
        )}
        <div
          style={{
            display: "flex",
            gap: "10px",
            background: isEditing ? "#f0f0f0" : "white",
            padding: "15px",
            borderRadius: "10px",
            flexWrap: "wrap",
            minHeight: isEditing ? "68px" : undefined,
            marginBottom: "16px",
          }}
        >
          {task.tags.length ? task.tags.map((tag) => (
            <Tag
              key={tag.id}
              label={tag.label}
              removable={isEditing}
              onRemove={() => handleTagRemove(tag)}
            />
          )) : <Typography>There are no tags assigned for this task</Typography>}
        </div>

        <Typography size={16} weight="600" styles={{ marginBottom: "8px" }}>
          Description
        </Typography>
        <div
          style={{
            border: `solid 1px ${ isEditing ? "var(--text-secondary)" : "#eee" }`,
            padding: "24px",
            borderRadius: "10px",
            minHeight: "100px"
          }}
          className="task-description"
          contentEditable={isEditing}
          dangerouslySetInnerHTML={{ __html: task.description }}
          ref={descriptionRef}
        ></div>
      </>
    ) : <Typography styles={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center", color: "var(--text-secondary)"}}>Select a task from the menu to preview here</Typography>}
    </div>
  );
};

export default Tasks;

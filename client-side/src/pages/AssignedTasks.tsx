import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ProgressBar from '../components/ProgressBar';
import TaskCard from '../components/TaskCard';
import TaskPopup from '../components/TaskPopup';
import Typography from '../components/Typography';
import { calculateAssignedTasksProgress, findAndReplaceInArrayByID } from '../helpers';
import AssignedTask from '../models/AssignedTask';
import { useAssignedTasksStore, useStudentsStore, useUserStore } from '../stores';

const StyledAssignedTasks = styled.div`

  .task-progress {
    margin-bottom: 32px
  }
  
`

const AssignedTasks: React.FunctionComponent = () => {
  const user = useUserStore((state) => state.user);
  const assignedTasks = useAssignedTasksStore((state) => state.assignedTasks);
  const getAssignedTasks = useAssignedTasksStore((state) => state.getAssignedTasks);

  useEffect(() => {
    getAssignedTasks(user?.id || "")
  }, [user])

  const unDoneTasks = assignedTasks?.filter(aTask => !aTask.isDone) || [];
  const doneTasks = assignedTasks?.filter(aTask => aTask.isDone) || [];

  return (
    <StyledAssignedTasks className='tasks'>
      <ProgressBar label="Tasks Completion Progress" value={calculateAssignedTasksProgress(assignedTasks || [])} />
      <div style={{ display: "flex", gap: "24px"}}>
        <div style={{ marginBottom: "32px", width: "calc(50% - 12px)"}}>
          <Typography size={18} weight="600" styles={{ marginBottom: "16px"}}>Due tasks: {unDoneTasks.length}</Typography>
          <div style={{ display: "flex", gap: "24px", flexDirection: "column"}}>
            {unDoneTasks.map((aTask) => (
              <TaskCard assignedTask={aTask} key={aTask.id} />
            ))}
          </div>
        </div>
        <div style={{ marginBottom: "32px", width: "calc(50% - 12px)"}}>
          <Typography size={18} weight="600" styles={{ marginBottom: "16px"}}>Done tasks: {doneTasks.length}</Typography>
          <div style={{ display: "flex", gap: "24px", flexDirection: "column"}}>
          {doneTasks.map((aTask) => (
              <TaskCard assignedTask={aTask} key={aTask.id} />
            ))}
          </div>
        </div>
      </div>
    </StyledAssignedTasks>
  )
}

export default AssignedTasks
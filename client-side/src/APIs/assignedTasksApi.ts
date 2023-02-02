import AssignedTask from "../models/AssignedTask"

const fetchAssignedTasks = async (): Promise<any> => {
  const assignedTasksRes = await fetch('http://localhost:4000/api/assignedTasks') as any;
  return await assignedTasksRes.json();
}

const fetchAssignedTasksByStudentId = async (studentId: string): Promise<any> => {
  const assignedTasksRes = await fetch('http://localhost:4000/api/assignedTasks') as any;
  const assignedTasks = await assignedTasksRes.json();
  return assignedTasks.filter((aTasks: AssignedTask) => aTasks.studentId === studentId);
}

const createAssignedTask = async (assignedTask: AssignedTask)  => {
  await fetch('http://localhost:4000/api/assignedTasks', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(assignedTask),
  })
}

const deleteAssignedTask = async (_id: string) => {
  await fetch(`http://localhost:4000/api/assignedTasks/${_id}`, {
    method: "DELETE",
    headers: {
      'Content-Type': 'application/json',
    }
  })
}

const updateAssignedTask = async (updatedAssignedTask: AssignedTask) => {
  await fetch(`http://localhost:4000/api/assignedTasks/${updatedAssignedTask._id}`, {
    method: "PUT",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedAssignedTask),
  })
}

export { fetchAssignedTasksByStudentId, createAssignedTask, deleteAssignedTask, updateAssignedTask, fetchAssignedTasks }

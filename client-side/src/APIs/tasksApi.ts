import AssignedTask from "../models/AssignedTask";
import Task from "../models/Task"
import { createAssignedTask, deleteAssignedTask, fetchAssignedTasks, fetchAssignedTasksByStudentId } from "./assignedTasksApi";
import { fetchStudents, updateStudent } from "./studentsApi";

const fetchTasks = async (): Promise<Task[]> => {
  const tasksRes = await fetch('http://localhost:4000/api/tasks') as any;
  return await tasksRes.json();
}

const createTask = async (task: Task)  => {
  const createTaskRes = await fetch('http://localhost:4000/api/tasks', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  })
  const newTask = await createTaskRes.json()
  const newTaskID = newTask._id
  matchTaskToStudents(task, newTaskID);
}

const deleteTask = async (_id: string) => {
  await fetch(`http://localhost:4000/api/tasks/${_id}`, {
    method: "DELETE",
    headers: {
      'Content-Type': 'application/json',
    }
  })
  removeTaskFromStudents(_id);
}

const updateTask = async (updatedTask: Task) => {
  await fetch(`http://localhost:4000/api/tasks/${updatedTask._id}`, {
    method: "PUT",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedTask),
  })
  // matchTaskToStudents(updatedTask);
}


const matchTaskToStudents = async (task: Task, newTaskId: string ) => {
  const students = await fetchStudents();
  const matchedStudents = students.filter(student => task.tags.every(tag => student.tags.some( t => t.id === tag.id)));

  matchedStudents.forEach(student => {
    const newAssignedTask: AssignedTask = {
      id: crypto.randomUUID(),
      refId: crypto.randomUUID(),
      taskId: newTaskId || "",
      studentId: student.id,
      isDone: false,
      messages: []
    }

    createAssignedTask(newAssignedTask);
  })
}

const removeTaskFromStudents = async (taskId: string) => {
  const assignedTask = await fetchAssignedTasks();
  const matchedAssignedTask = assignedTask.filter((aTask: AssignedTask) => aTask.taskId === taskId)
  

  matchedAssignedTask.forEach(async (aTask: AssignedTask) => {
    deleteAssignedTask(aTask._id || "");
  })
}

export { fetchTasks, createTask, deleteTask, updateTask }

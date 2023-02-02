import AssignedTask from "../models/AssignedTask";
import Task from "../models/Task"
import { getResourceFromLocalStorage, setResourceAtLocalStorage } from "./localStorageHelpers";
import { fetchStudents, updateStudent } from "./studentsApi";

const fetchTasks = async (): Promise<Task[]> => {
  const tasksRes = await fetch('http://localhost:4000/api/tasks') as any;
  return await tasksRes.json();
}

const createTask = async (task: Task)  => {
  await fetch('http://localhost:4000/api/tasks', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  })
  matchTaskToStudents(task);
}

const deleteTask = async (_id: string) => {
  await fetch(`http://localhost:4000/api/tasks/${_id}`, {
    method: "DELETE",
    headers: {
      'Content-Type': 'application/json',
    }
  })
  // removeTaskFromStudents(taskId);
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


const matchTaskToStudents = async (task: Task) => {
  const students = await fetchStudents();
  const matchedStudents = students.filter(student => task.tags.every(tag => student.tags.some( t => t.id === tag.id)));
  
  matchedStudents.forEach(student => {
    const newAssignedTask: AssignedTask = {
      id: crypto.randomUUID(),
      refId: crypto.randomUUID(),
      task,
      studentId: student.id,
      isDone: false,
      messages: []
    }

    student.assignedTasks = [...student.assignedTasks || [], newAssignedTask];
    updateStudent(student);
  })
}

const removeTaskFromStudents = async (taskId: string) => {
  const students = await fetchStudents();
  const matchedStudents = students.filter(student => student.assignedTasks?.some(aTask => aTask.task.id === taskId));

  matchedStudents.forEach(async student => {
    student.assignedTasks = [...(student.assignedTasks || []).filter(aTask => aTask.task.id !== taskId )]
    updateStudent(student);
  })
}

export { fetchTasks, createTask, deleteTask, updateTask }

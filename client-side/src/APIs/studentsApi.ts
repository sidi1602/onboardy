import { calculateAssignedTasksProgress } from "../helpers";
import AssignedTask from "../models/AssignedTask";
import Student from "../models/Student"
import { fetchTasks } from "./tasksApi";

const fetchStudents = async (): Promise<Student[]> => {
  const studentsRes = await fetch('http://localhost:4000/api/students')
  const students = await studentsRes.json();
  return students.map((student: Student) => ({...student, tasksCompletion: calculateAssignedTasksProgress(student.assignedTasks || []) }));
}

const createStudent = async (student: Student) => {
  await fetch('http://localhost:4000/api/students', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(student),
  })
}

const deleteStudent = async (_id: string) => {
  await fetch(`http://localhost:4000/api/students/${_id}`, {
    method: "DELETE",
    headers: {
      'Content-Type': 'application/json',
    }
  })
}

const updateStudent = async (updatedStudent: Student) => {
  await fetch(`http://localhost:4000/api/students/${updatedStudent._id}`, {
    method: "PUT",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedStudent),
  })
}


const matchStudentsWithTasks = async (student: Student) => {
  const tasks = await fetchTasks();
  const matchedTasks = tasks.filter(task => task.tags.every(tag => student.tags.some( t => t.id === tag.id)));
  
  matchedTasks.forEach(task => {
    const newAssignedTask: AssignedTask = {
      id: crypto.randomUUID(),
      refId: crypto.randomUUID(),
      taskId: task.id,
      studentId: student.id,
      isDone: false,
      messages: []
    }

    student.assignedTasks = [...student.assignedTasks || [], newAssignedTask];
    updateStudent(student);
  })
}

export { fetchStudents, createStudent, deleteStudent, updateStudent }

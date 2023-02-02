import { calculateAssignedTasksProgress } from "../helpers";
import AssignedTask from "../models/AssignedTask";
import Student from "../models/Student"
import { getResourceFromLocalStorage, setResourceAtLocalStorage } from "./localStorageHelpers";
import { fetchTasks } from "./tasksApi";

const fetchStudents = async (): Promise<Student[]> => {
  // const studentsRes = await fetch('https://63ba193d56043ab3c795ae0e.mockapi.io/students')
  // const students = await studentsRes.json();
  // return students.map((student: Student) => ({...student, tasksCompletion: calculateAssignedTasksProgress(student.assignedTasks || []) }));
  const students = getResourceFromLocalStorage<Student[]>("students");
  return students.map((student) => ({...student, tasksCompletion: calculateAssignedTasksProgress(student.assignedTasks || []) }));
}

const createStudent = async (student: Student) => {
  const students = getResourceFromLocalStorage<Student[]>("students");
  setResourceAtLocalStorage<Student[]>("students", [...students, student]);
  matchStudentsWithTasks(student);
}

const deleteStudent = async (id: string) => {
  const students = getResourceFromLocalStorage<Student[]>("students");
  setResourceAtLocalStorage<Student[]>("students", [...students.filter((student) => student.id !== id)]);
}

const updateStudent = async (updatedStudent: Student) => {
  const students = getResourceFromLocalStorage<Student[]>("students");
  const targetIndex = students.findIndex(student => student.id === updatedStudent.id);
  const updatedStudents = students.slice();
  updatedStudents[targetIndex] = updatedStudent;
  setResourceAtLocalStorage<Student[]>("students", updatedStudents);
}

const fetchStudentById = async (id: string): Promise<Student | null> => {
  const students = getResourceFromLocalStorage<Student[]>("students");
  const matchStudent = students.find((student) => student.id === id);
  if (!matchStudent) return null
    
  return {...matchStudent, tasksCompletion: calculateAssignedTasksProgress(matchStudent.assignedTasks || []) }
}


const matchStudentsWithTasks = async (student: Student) => {
  const tasks = await fetchTasks();
  const matchedTasks = tasks.filter(task => task.tags.every(tag => student.tags.some( t => t.id === tag.id)));
  console.log(matchedTasks)
  
  matchedTasks.forEach(task => {
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

export { fetchStudents, createStudent, deleteStudent, updateStudent, fetchStudentById }

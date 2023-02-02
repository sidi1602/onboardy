import { create } from 'zustand'
import { createAssignedTask, deleteAssignedTask, fetchAssignedTasksByStudentId, updateAssignedTask } from '../APIs/assignedTasksApi'
import AssignedTask from '../models/AssignedTask'

interface AssignedTaskState {
  assignedTasks: AssignedTask[]
  getAssignedTasks: (studentId: string) => void
  addAssignedTask: (assignedTask: AssignedTask, studentId: string) => void
  editAssignedTask: (updatedAssignedTask: AssignedTask, studentId: string) => void
  removeAssignedTask: (id: string, studentId: string) => void
}

const useAssignedTasksStore = create<AssignedTaskState>((set, get) => ({
  assignedTasks: [],
  getAssignedTasks: async (studentId: string) => {
    const assignedTasks = await fetchAssignedTasksByStudentId(studentId);
    set({ assignedTasks });
  },
  addAssignedTask: async (assignedTask, studentId) => {
    await createAssignedTask(assignedTask);
    get().getAssignedTasks(studentId);
  },
  editAssignedTask: async (updatedAssignedTask, studentId) => {
    await updateAssignedTask(updatedAssignedTask);
    get().getAssignedTasks(studentId);
  },
  removeAssignedTask: async (_id, studentId: string) => {
    await deleteAssignedTask(_id);
    get().getAssignedTasks(studentId);
  },
}))

export default useAssignedTasksStore
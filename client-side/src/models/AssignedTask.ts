import Message from "./Message"
import Task from "./Task"

interface AssignedTask {
  _id?: string
  id: string
  refId: string
  studentId: string
  messages: Message[]
  isDone: boolean
  taskId: string
}

export default AssignedTask

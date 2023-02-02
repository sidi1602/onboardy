import Tag from "./Tag"

interface Task {
  _id?: string
  id: string
  title: string
  description: string
  tags: Tag[]
  dueDate: string
  isUrgent: boolean
  isNew?: boolean
}

export default Task

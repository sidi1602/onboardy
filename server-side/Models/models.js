const mongoose = require("mongoose");



// import AttachmentSchema from "./Attachment";
// import StaffSchema from "./Staff";
// import StudentSchema from "./Student";
// import TagSchema from "./Tag";



// const MessageSchema = new mongoose.Schema({
//   id: String,
//   author: {
//     type: mongoose.Schema.Types.ObjectId,
//     refPath: "authorType"
//   },
//   authorType: {
//     type: String,
//     enum: ["Student", "Staff"]
//   },
//   text: String,
//   attachments: [AttachmentSchema],
//   createdAt: String
// });

// const AssignedTaskSchema = new mongoose.Schema({
//   id: String,
//   refId: String,
//   task: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Task"
//   },
//   studentId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Student"
//   },
//   messages: [MessageSchema]
// });

const BlogSchema = new mongoose.Schema({
  id: String,
  title: String,
  content: String
});

const StaffSchema = new mongoose.Schema({
  id: String,
  firstName: String,
  lastName: String,
  email: String,
  image: String
});



// const StudentSchema = new mongoose.Schema({
//   id: String,
//   firstName: String,
//   lastName: String,
//   email: String,
//   dob: String,
//   gender: String,
//   nationality: String,
//   image: String,
//   tags: [TagSchema],
//   assignedTasks: [AssignedTaskSchema],
//   tasksCompletion: Number
// });

const TagSchema = new mongoose.Schema({
  id: String,
  label: String,
  description: String
});

const TaskSchema = new mongoose.Schema({
  id: String,
  title: String,
  description: String,
  tags: [TagSchema],
  dueDate: String,
  urgent: Boolean,
  isNew: Boolean
});

const AttachmentSchema = new mongoose.Schema({
  id: String, 
  name: String, 
  path: String, 
});

const MessageSchema = new mongoose.Schema({
  id: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "authorType"
  },
  authorType: {
    type: String,
    enum: ["Student", "Staff"]
  },
  text: String,
  attachments: [AttachmentSchema],
  createdAt: String
});

// export const AssignedTask = mongoose.model("AssignedTask", AssignedTaskSchema);
// export const Attachment = mongoose.model("Attachment", AttachmentSchema);
// export const Blog = mongoose.model("Blog", BlogSchema);
// export const Message = mongoose.model("Message", MessageSchema);
// export const Staff = mongoose.model("Staff", StaffSchema);
// export const Student = mongoose.model("Student", StudentSchema);
// export const Tag = mongoose.model("Tag", TagSchema);
// export const Task = mongoose.model("Task", TaskSchema);



// const studentSchema = new mongoose.Schema({
//   id: { type: String, required: true },
//   firstName: { type: String, required: true },
//   lastName: { type: String, required: true },
//   email: { type: String, required: true },
//   dob: { type: String, required: true },
//   gender: { type: String, required: true },
//   nationality: { type: String, required: true },
//   image: { type: String },
//   tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
//   assignedTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "AssignedTask" }],
// });

const studentSchema = new mongoose.Schema({
  id: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  dob: { type: String, required: true },
  gender: { type: String, required: true },
  nationality: { type: String, required: true },
  image: { type: String },
  tags: [{
    id: String,
    label: String,
    description: String
  }],
  assignedTasks: [TaskSchema],
});

const assignedTaskSchema = new mongoose.Schema({
  id: { type: String, required: true },
  refId: { type: String, required: true },
  task: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
  studentId: { type: String, required: true },
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
  taskId: { type: String, required: true },
  isDone: { type: Boolean, required: true },
});

const FAQSchema = new mongoose.Schema({
  id: { type: String, required: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
});


module.exports = {

  Blog: mongoose.model("Blog", BlogSchema),
  Tag: mongoose.model("Tag", TagSchema),
  Staff: mongoose.model("Staff", StaffSchema),
  Task: mongoose.model("Task", TaskSchema),
  Attachment: mongoose.model("Attachment", AttachmentSchema),
  Student: mongoose.model("Student", studentSchema),
  AssignedTask: mongoose.model("AssignedTask", assignedTaskSchema),
  FAQ: mongoose.model("FAQ", FAQSchema),
  Message: mongoose.model("Message", MessageSchema),
};
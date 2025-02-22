import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  marks: {
    type: Number,
    default: 0,
  },
});

const marksSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  subjects: {
    type: [subjectSchema],
    required: true,
  },
});

export const Marks = mongoose.model("Marks", marksSchema);

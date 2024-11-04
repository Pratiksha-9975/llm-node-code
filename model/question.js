const mongoose = require('mongoose');

const mcqSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  difficulty: { type: String, required: true },
  questions: [
    {
      question: { type: String, required: true },
      options: { type: [String], required: true },
      correctAnswer: { type: String, required: true }
    }
  ]

});

module.exports = mongoose.model('MCQ', mcqSchema);

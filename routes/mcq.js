// routes/mcq.js
// routes/mcq.js
const express = require('express');
const router = express.Router();
const MCQ = require('../model/question');


// Save MCQ to the database
router.post('/save-mcq', async (req, res) => {
  try {
    const mcq = new MCQ({
      topic: req.body.topic,
      difficulty: req.body.difficulty,
      questions: req.body.questions
    });
    await mcq.save();
    res.status(201).json({ message: 'MCQ saved successfully!' ,mcq});
  } catch (error) {

    res.status(500).json({ error: 'Error saving MCQ', details: error });
  }
});




router.get('/fetch-mcqs', async (req, res) => {
  try {
    const { topic } = req.query; // Get the topic from the query parameters

    // Fetch MCQs filtered by topic, projecting only question and options (excluding correctAnswer)
    const mcqs = await MCQ.find({ topic: topic }, { 'questions.question': 1, 'questions.options': 1,'questions.correctAnswer':1 });

    console.log('MCQs fetched from DB:', mcqs); // Log fetched data for debugging
    res.json(mcqs);  // Send the response
  } catch (err) {
    console.error('Error fetching MCQs:', err);
    res.status(500).json({ error: 'Failed to fetch MCQs' });
  }
});


  

module.exports = router;


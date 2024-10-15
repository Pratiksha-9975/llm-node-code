const express = require('express');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();
app.use(cors());
app.use(express.json())
app.use(bodyParser.json());
const Groq = require('groq-sdk');
const client = new Groq({ apiKey: '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' });



// Define the arrow function for generating MCQs
const generateMCQs = async (req, res) => {
    try {
      const { topic, difficulty } = req.body; // Get the topic and difficulty from the request body
      const chatCompletion = await client.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are a software developer with knowledge of all programming languages',
          },
          {
            role: 'user',
            content:   `You are the test generation AI. Generate a series of 10 multiple-choice questions (MCQ) on the topic of ${topic} with a difficulty level of ${difficulty}.
            The questions should cover both theoretical knowledge and practical skills.
            Include real-life scenarios wherever applicable. Ensure each question has four options, clearly indicating the correct answer with its number.
            Always format the options as a numbered list (1, 2, 3, 4) and ensure that the correct answer is returned as the number corresponding to the correct option.
            The output format should be:
            [
              {
                "question": "your first question here",
                "options": [
                  "1) option 1",
                  "2) option 2",
                  "3) option 3",
                  "4) option 4"
                ],
                "correctAnswer": "1"
              }
            ]
            Do not include any introductory text, explanations, or other unnecessary information. 
            After the user completes all 10 questions, evaluate their responses and display the total number of correct and incorrect answers.`,
          },
        ],
        model: 'llama3-8b-8192', // Ensure you're using the correct model
      });
     
      console.log(chatCompletion.choices[0].message.content);
      res.status(200).json({
        questions: chatCompletion.choices[0].message.content
        
      });

    } catch (error) {
      res.status(500).json({ error: 'Failed to generate MCQs' });
    }
  };
  
  // Set up the route for generating MCQs
  app.post('/generate-mcqs', generateMCQs);

  const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


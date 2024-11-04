const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt= require('bcryptjs');
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
const UserModel= require('./student');
const mongoose= require("mongoose");
const mcqRoutes = require('./routes/mcq');
const Groq = require('groq-sdk');
const client = new Groq({ apiKey: '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' });


mongoose.connect('mongodb://localhost:27017/studentRecord')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

  app.use('/api/mcq', mcqRoutes);
// Define the arrow function for generating MCQs
const generateMCQs = async (req, res) => {
  try {
    const { topic, difficulty } = req.body; // Get the topic and difficulty from the request body
    console.log(req.body);
    

    // Make API request to Groq for MCQ generation
    const chatCompletion = await client.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a software developer with knowledge of all programming languages.',
        },
        {
          role: 'user',
          content: `
            You are the test generation AI. Generate a series of 10 multiple-choice questions (MCQ) on the topic of ${topic} with a difficulty level of ${difficulty}.
The questions should cover both theoretical knowledge and practical skills.
Include real-life scenarios wherever applicable. Ensure each question has four options, clearly indicating the correct answer with its number.
Always format the options as a numbered list (1, 2, 3, 4) and ensure that the correct answer is returned as the option(string) corresponding to the correct option.
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
    "correctAnswer": "correct option"
  }
]
Do not include any introductory text, explanations, or other unnecessary information.
`
        },
      ],
      model: 'llama3-8b-8192', // Ensure you're using the correct model
    });

    const generatedText = chatCompletion.choices[0].message.content;

   
    let mcqResult;
try {
  mcqResult = JSON.parse(generatedText);
  if (Array.isArray(mcqResult)) {
    mcqResult.forEach(mcq => {
      console.log('Question:', mcq.question);
      console.log('Options:', mcq.options);
      console.log('Correct Answer:', mcq.correctAnswer);
    });
  } else {
    console.error('mcqResult is not an array');
  }
} catch (parseError) {
  console.error('Error parsing the generated MCQ content:', parseError);
}


    // Send the properly formatted MCQ result as a response
    res.status(200).json({ mcqResult: mcqResult });


  } catch (error) {
    console.error('Error generating MCQs:', error);
    res.status(500).json({ error: 'Failed to generate MCQs' });
  }
};

// Set up the route for generating MCQs
app.post('/generate-mcqs', generateMCQs);

let students = [];  // In-memory student storage (use a database in production)

// Register route
app.post('/api/register', async(req, res) => {
  const { fullName, email, password, domain } = req.body;

  
  const existingStudent = await UserModel.findOne({ email });
  if (existingStudent) {
    return res.status(400).json({ message: 'Student with this email already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
    const userm=new UserModel({
      
      fullName,
      email,
      password:hashedPassword,
      domain

    });

    await userm.save();

    res.json({ message: 'Student registered successfully', student: userm });
  });

// Start the server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

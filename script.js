// --- DOM ELEMENT REFERENCES ---
// Get references to the different screens and buttons from the HTML.
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultsScreen = document.getElementById("results-screen");

const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");

const questionText = document.getElementById("question-text");
const answerButtons = document.getElementById("answer-buttons");
const scoreText = document.getElementById("score-text");

// --- STATE VARIABLES ---
// Variables to keep track of the quiz's current state.
let currentQuestionIndex; // Keeps track of which question we are on
let score; // Stores the user's score

// --- QUIZ QUESTIONS ---
// An array of objects, where each object is a question.
const questions = [
  {
    question: "What does HTML stand for?",
    answers: [
      { text: "Hyper Text Markup Language", correct: true },
      { text: "High-Level Text Machine Language", correct: false },
      { text: "Hyperlink and Text Markup Language", correct: false },
      { text: "Home Tool Markup Language", correct: false },
    ],
  },
  {
    question:
      "Which CSS property is used to change the text color of an element?",
    answers: [
      { text: "font-color", correct: false },
      { text: "text-color", correct: false },
      { text: "color", correct: true },
      { text: "background-color", correct: false },
    ],
  },
  {
    question:
      "What is the correct place to insert a JavaScript file in an HTML document?",
    answers: [
      { text: "The <head> section", correct: false },
      { text: "The <body> section", correct: false },
      { text: "Both the <head> and <body> are correct", correct: true },
      { text: "The <footer> section", correct: false },
    ],
  },
  {
    question: "Which of these is NOT a JavaScript framework/library?",
    answers: [
      { text: "React", correct: false },
      { text: "Angular", correct: false },
      { text: "Vue", correct: false },
      { text: "Sass", correct: true }, // Sass is a CSS preprocessor
    ],
  },
];

// --- EVENT LISTENERS ---
// When the 'Start' button is clicked, call the startGame function.
startBtn.addEventListener("click", startGame);
// When the 'Next' button is clicked, move to the next question.
nextBtn.addEventListener("click", () => {
  currentQuestionIndex++; // Move to the next question index
  setNextQuestion(); // Set up the next question
});
// When the 'Restart' button is clicked, call the startGame function again.
restartBtn.addEventListener("click", startGame);

// --- FUNCTIONS ---

/**
 * Starts the quiz.
 * Hides the start and results screens, shows the quiz screen.
 * Resets the score and question index, then shows the first question.
 */
function startGame() {
  // Hide the start and results screens
  startScreen.classList.add("hide");
  resultsScreen.classList.add("hide");
  // Show the quiz screen
  quizScreen.classList.remove("hide");
  // Reset the question index and score for a new game
  currentQuestionIndex = 0;
  score = 0;
  // Set up the first question
  setNextQuestion();
}

/**
 * Sets up the next question.
 * Clears the previous question and answers, then displays the new one.
 */
function setNextQuestion() {
  resetState(); // Clear the board for the new question
  // Show the question based on the current index
  showQuestion(questions[currentQuestionIndex]);
}

/**
 * Displays a question and its answer options.
 * @param {object} question - The question object to display.
 */
function showQuestion(question) {
  // Set the question text
  questionText.innerText = question.question;
  // Create and display a button for each answer
  question.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.innerText = answer.text;
    button.classList.add("btn");
    // If the answer is correct, add a data attribute to the button
    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    // Add an event listener to the button to handle answer selection
    button.addEventListener("click", selectAnswer);
    answerButtons.appendChild(button);
  });
}

/**
 * Resets the state of the answer buttons and hides the 'Next' button.
 */
function resetState() {
  // Hide the 'Next' button until an answer is selected
  nextBtn.classList.add("hide");
  // Remove all previous answer buttons
  while (answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild);
  }
}

/**
 * Handles the logic when an answer button is clicked.
 * @param {Event} e - The click event object.
 */
function selectAnswer(e) {
  const selectedButton = e.target;
  const isCorrect = selectedButton.dataset.correct === "true";

  // If the answer is correct, increase the score
  if (isCorrect) {
    score++;
  }

  // Add 'correct' or 'wrong' class to all buttons for visual feedback
  Array.from(answerButtons.children).forEach((button) => {
    setStatusClass(button, button.dataset.correct === "true");
  });

  // Check if there are more questions
  if (questions.length > currentQuestionIndex + 1) {
    // If so, show the 'Next' button
    nextBtn.classList.remove("hide");
  } else {
    // If it's the last question, show the results
    showResults();
  }
}

/**
 * Sets the 'correct' or 'wrong' class on a button.
 * @param {HTMLElement} element - The button element.
 * @param {boolean} correct - Whether the answer is correct.
 */
function setStatusClass(element, correct) {
  // First, clear any existing status classes
  clearStatusClass(element);
  // Then, add the appropriate class
  if (correct) {
    element.classList.add("correct");
  } else {
    element.classList.add("wrong");
  }
}

/**
 * Removes 'correct' and 'wrong' classes from a button.
 * @param {HTMLElement} element - The button element.
 */
function clearStatusClass(element) {
  element.classList.remove("correct");
  element.classList.remove("wrong");
}

/**
 * Shows the final results screen.
 */
function showResults() {
  // Hide the quiz screen
  quizScreen.classList.add("hide");
  // Show the results screen
  resultsScreen.classList.remove("hide");
  // Display the final score
  scoreText.innerText = `You scored ${score} out of ${questions.length}!`;
}

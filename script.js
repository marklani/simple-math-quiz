const questionElement = document.getElementById("question");
const answerButtonsElement = document.getElementById("answer-buttons");
const feedbackElement = document.getElementById("feedback");
const nextButton = document.getElementById("next-btn");
const correctSound = document.getElementById("correct-sound");
const wrongSound = document.getElementById("wrong-sound");
const scoreCounter = document.getElementById("score-counter");

const levelSelection = document.getElementById("level-selection");
const levelButtons = document.querySelectorAll('.level-btn');

let correctAnswer = 0;
let maxNumber = 10; // Default to 1-digit numbers
let correctCount = 0;
let totalQuestions = 0;

// Function to update the score display
function updateScore() {
    scoreCounter.textContent = `Score: ${correctCount}/${totalQuestions}`;
}

// Event listeners for level selection buttons
levelButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Reset score when a new level is selected
        correctCount = 0;
        totalQuestions = 0;
        updateScore();

        // Remove the active class from all buttons
        levelButtons.forEach(btn => btn.classList.remove('active-level'));

        // Add the active class to the clicked button
        button.classList.add('active-level');

        const digits = parseInt(button.getAttribute('data-digits'));
        if (digits === 1) {
            maxNumber = 10;
        } else if (digits === 2) {
            maxNumber = 100;
        } else if (digits === 3) {
            maxNumber = 1000;
        }

        generateQuestion();
    });
});

// Function to generate a random integer
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// Function to generate a new quiz question
function generateQuestion() {
    // Clear previous state
    feedbackElement.textContent = "";
    nextButton.classList.add("hidden");
    Array.from(answerButtonsElement.children).forEach(button => {
        button.disabled = false;
        button.style.backgroundColor = '#007bff';
    });

    // Use the maxNumber variable to set the range of numbers
    let num1 = getRandomInt(1, maxNumber);
    let num2 = getRandomInt(1, maxNumber);
    const operation = Math.random() < 0.5 ? "+" : "-";

    // Logic to prevent negative answers
    if (operation === "-") {
        if (num2 > num1) {
            [num1, num2] = [num2, num1]; // Swap the numbers
        }
    }

    questionElement.textContent = `${num1} ${operation} ${num2} = ?`;

    if (operation === "+") {
        correctAnswer = num1 + num2;
    } else {
        correctAnswer = num1 - num2;
    }

    // Generate 3 incorrect answers
    let answers = [correctAnswer];
    while (answers.length < 4) {
        let incorrectAnswer = getRandomInt(correctAnswer - 10, correctAnswer + 10);
        // Ensure the incorrect answer is not the same as the correct one
        if (!answers.includes(incorrectAnswer)) {
            answers.push(incorrectAnswer);
        }
    }

    // Shuffle the answers array
    answers.sort(() => Math.random() - 0.5);

    // Display the answers on the buttons
    const answerButtons = Array.from(answerButtonsElement.children);
    for (let i = 0; i < answerButtons.length; i++) {
        answerButtons[i].textContent = answers[i];
        answerButtons[i].onclick = () => checkAnswer(answers[i], answerButtons[i]);
    }
}

// Function to check the user's answer
function checkAnswer(selectedAnswer, selectedButton) {
    totalQuestions++; // Increment total questions for every answer

    if (parseInt(selectedAnswer) === correctAnswer) {
        correctCount++; // Increment correct answers
        feedbackElement.textContent = "Correct!";
        feedbackElement.classList.remove("incorrect");
        feedbackElement.classList.add("correct");
        selectedButton.style.backgroundColor = 'green';
        correctSound.play();
    } else {
        feedbackElement.textContent = "Incorrect. Try again!";
        feedbackElement.classList.remove("correct");
        feedbackElement.classList.add("incorrect");
        selectedButton.style.backgroundColor = 'red';
        wrongSound.play();

        // Highlight the correct answer
        Array.from(answerButtonsElement.children).forEach(button => {
            if (parseInt(button.textContent) === correctAnswer) {
                button.style.backgroundColor = 'green';
            }
        });
    }

    // Update the score display after each answer
    updateScore();

    // Disable all buttons after an answer is selected
    Array.from(answerButtonsElement.children).forEach(button => {
        button.disabled = true;
    });

    // Show the "Next Question" button
    nextButton.classList.remove("hidden");
}

// Event listener for the "Next Question" button
nextButton.addEventListener("click", generateQuestion);

// Start the quiz with a default level and score when the page loads
generateQuestion();
updateScore();

// Highlight the default 1-digit button on initial load
document.querySelector('.level-btn[data-digits="1"]').classList.add('active-level');

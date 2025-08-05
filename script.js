const questionElement = document.getElementById("question");
const answerButtonsElement = document.getElementById("answer-buttons");
const feedbackElement = document.getElementById("feedback");
const nextButton = document.getElementById("next-btn");

let correctAnswer = 0;

// Function to generate a random integer
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
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

    const num1 = getRandomInt(1, 20);
    const num2 = getRandomInt(1, 20);
    const operation = Math.random() < 0.5 ? "+" : "-";

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
    if (selectedAnswer === correctAnswer) {
        feedbackElement.textContent = "Correct!";
        feedbackElement.classList.remove("incorrect");
        feedbackElement.classList.add("correct");
        selectedButton.style.backgroundColor = 'green';
    } else {
        feedbackElement.textContent = "Incorrect. Try again!";
        feedbackElement.classList.remove("correct");
        feedbackElement.classList.add("incorrect");
        selectedButton.style.backgroundColor = 'red';

        // Highlight the correct answer
        Array.from(answerButtonsElement.children).forEach(button => {
            if (parseInt(button.textContent) === correctAnswer) {
                button.style.backgroundColor = 'green';
            }
        });
    }

    // Disable all buttons after an answer is selected
    Array.from(answerButtonsElement.children).forEach(button => {
        button.disabled = true;
    });

    // Show the "Next Question" button
    nextButton.classList.remove("hidden");
}

// Event listener for the "Next Question" button
nextButton.addEventListener("click", generateQuestion);

// Start the quiz when the page loads
generateQuestion();
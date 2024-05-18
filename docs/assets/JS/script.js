let Questions = [];
let currQuestion = 0;
let score = 0;
const questionLimit = 15;

const ques = document.getElementById("q");
const opt = document.getElementById("op");
const btn = document.getElementById("btn");
const scoreDisplay = document.getElementById("score");

async function fetchQuestions() {
    try {
        // Fetch questions from the API
        const response = await fetch(`https://opentdb.com/api.php?amount=${questionLimit}&category=18`);

        // Check if the response is successful
        if (!response.ok) {
            throw new Error('Failed to fetch questions');
        }

        // Parse the response as JSON
        const data = await response.json();

        // Check if there are questions in the response
        if (!data.results || data.results.length === 0) {
            throw new Error('No questions found');
        }

        // Store the fetched questions in the Questions array
        Questions = data.results;

        // Load the first question after fetching
        loadQuestion();
    } catch (error) {
        // Handle any errors that occur during fetching
        console.error('Error fetching questions:', error.message);
        // Display an error message to the user
        ques.innerHTML = `<h5 style='color: red'>${error.message}</h5>`;
    }
}

function decodeHtml(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

function loadQuestion() {
    const currentQuestion = Questions[currQuestion];
    ques.textContent = `Question ${currQuestion + 1}: ${decodeHtml(currentQuestion.question)}`;
    opt.innerHTML = "";
    const answers = [currentQuestion.correct_answer, ...currentQuestion.incorrect_answers];
    // Shuffle answers array
    answers.sort(() => Math.random() - 0.5);
    answers.forEach(answer => {
        const choice = document.createElement("input");
        choice.type = "radio";
        choice.name = "answer";
        choice.value = decodeHtml(answer);  // Decode HTML entities
        const label = document.createElement("label");
        label.textContent = decodeHtml(answer);  // Decode HTML entities
        const optionContainer = document.createElement("div"); // Create a container for each option
        optionContainer.classList.add("option-container"); // Add class to the container
        optionContainer.appendChild(choice);
        optionContainer.appendChild(label);
        opt.appendChild(optionContainer); // Append the container to the options container
    });
}

function checkAns() {
    const selectedAns = document.querySelector('input[name="answer"]:checked');
    if (!selectedAns) {
        alert("Please select an answer!");
        return;
    }
    if (selectedAns.value === Questions[currQuestion].correct_answer) {
        score++;
        alert("Correct answer!");
    } else {
        alert(`Wrong answer! The correct answer is: ${Questions[currQuestion].correct_answer}`);
    }
    currQuestion++;
    if (currQuestion < Questions.length && currQuestion < questionLimit) {
        loadQuestion();
    } else {
        displayScore();
    }
}

function displayScore() {
    scoreDisplay.textContent = `Your score: ${score} out of ${currQuestion}`;
}

// Set the button's event listener
btn.addEventListener('click', checkAns);

// Fetch questions when the page loads
fetchQuestions();

let Questions = [];
let currQuestion = 0;
let score = 0;
const questionLimit = 15;
let lifeline5050Used = false; // Track if the 50/50 lifeline has been used
let skipUsed = false; // Track if the skip question lifeline has been used
let swapUsed = false; // Track if the swap question lifeline has been used

const ques = document.getElementById("q");
const opt = document.getElementById("op");
const btn = document.getElementById("btn");
const scoreDisplay = document.getElementById("score");
const restartBtn = document.getElementById("restart-btn");
const lifeline5050Btn = document.getElementById("lifeline-5050");
const lifelineSkipBtn = document.getElementById("lifeline-skip");
const lifelineSwapBtn = document.getElementById("lifeline-swap");

async function fetchQuestions() {
    try {
        const response = await fetch(`https://opentdb.com/api.php?amount=${questionLimit}&category=18`);
        if (!response.ok) {
            throw new Error('Failed to fetch questions');
        }
        const data = await response.json();
        if (!data.results || data.results.length === 0) {
            throw new Error('No questions found');
        }
        Questions = data.results;
        loadQuestion();
    } catch (error) {
        console.error('Error fetching questions:', error.message);
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
    const answers = [currentQuestion.correct_answer, ...currentQuestion.incorrect_answers].map(decodeHtml);
    answers.sort(() => Math.random() - 0.5);
    answers.forEach(answer => {
        const choice = document.createElement("input");
        choice.type = "radio";
        choice.name = "answer";
        choice.value = answer;
        const label = document.createElement("label");
        label.textContent = answer;
        const optionContainer = document.createElement("div");
        optionContainer.classList.add("option-container");
        optionContainer.appendChild(choice);
        optionContainer.appendChild(label);
        opt.appendChild(optionContainer);
    });

    // Update lifeline buttons' states
    lifeline5050Btn.disabled = lifeline5050Used;
    lifelineSkipBtn.disabled = skipUsed;
    lifelineSwapBtn.disabled = swapUsed;
}

function checkAns() {
    const selectedAns = document.querySelector('input[name="answer"]:checked');
    // if (!selectedAns) {
    //     alert("Please select an answer!");
    //     return;
    // }
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

function use5050() {
    if (lifeline5050Used) {
        alert("You have already used the 50/50 lifeline!");
        return;
    }
    lifeline5050Used = true;
    lifeline5050Btn.disabled = true; // Disable the lifeline button after use
    const currentQuestion = Questions[currQuestion];
    const incorrectAnswers = currentQuestion.incorrect_answers.map(decodeHtml);
    const options = Array.from(document.querySelectorAll('input[name="answer"]'));
    let removedCount = 0;

    options.forEach(option => {
        if (incorrectAnswers.includes(option.value) && removedCount < 2) {
            option.parentElement.style.display = 'none';
            removedCount++;
        }
    });
}

function useSkip() {
    if (skipUsed) {
        alert("You have already used the skip question lifeline!");
        return;
    }
    skipUsed = true;
    lifelineSkipBtn.disabled = true; // Disable the lifeline button after use
    currQuestion++;
    if (currQuestion < Questions.length && currQuestion < questionLimit) {
        loadQuestion();
    } else {
        displayScore();
    }
}

function useSwap() {
    if (swapUsed) {
        alert("You have already used the swap question lifeline!");
        return;
    }
    swapUsed = true;
    lifelineSwapBtn.disabled = true; // Disable the lifeline button after use
    Questions.splice(currQuestion, 1); // Remove the current question
    fetchAdditionalQuestion().then(newQuestion => {
        if (newQuestion) {
            Questions.push(newQuestion); // Add the new question
            loadQuestion(); // Reload the new question
        }
    });
}

async function fetchAdditionalQuestion() {
    try {
        const response = await fetch(`https://opentdb.com/api.php?amount=1&category=18`);
        if (!response.ok) {
            throw new Error('Failed to fetch additional question');
        }
        const data = await response.json();
        if (!data.results || data.results.length === 0) {
            throw new Error('No additional questions found');
        }
        return data.results[0];
    } catch (error) {
        console.error('Error fetching additional question:', error.message);
        ques.innerHTML = `<h5 style='color: red'>${error.message}</h5>`;
        return null;
    }
}

function displayScore() {
    scoreDisplay.textContent = `Your score: ${score} out of ${currQuestion}`;
    btn.style.display = 'none';
    restartBtn.style.display = 'block';
    lifeline5050Btn.style.display = 'none'; // Hide the lifeline button
    lifelineSkipBtn.style.display = 'none'; // Hide the skip button
    lifelineSwapBtn.style.display = 'none'; // Hide the swap button
}

function resetGame() {
    currQuestion = 0;
    score = 0;
    scoreDisplay.textContent = '';
    btn.style.display = 'block';
    restartBtn.style.display = 'none';
    lifeline5050Btn.style.display = 'initial'; // Show the lifeline button
    lifelineSkipBtn.style.display = 'initial'; // Show the skip button
    lifelineSwapBtn.style.display = 'initial'; // Show the swap button
    lifeline5050Used = false; // Reset the 50/50 lifeline
    skipUsed = false; // Reset the skip lifeline
    swapUsed = false; // Reset the swap lifeline
    fetchQuestions();
}

btn.addEventListener('click', checkAns);
restartBtn.addEventListener('click', resetGame);
lifeline5050Btn.addEventListener('click', use5050);
lifelineSkipBtn.addEventListener('click', useSkip);
lifelineSwapBtn.addEventListener('click', useSwap);

fetchQuestions();

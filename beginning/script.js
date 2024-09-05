const loginContainer = document.getElementById('login-container');
const loginForm = document.getElementById('login-form');
const appContainer = document.querySelector('.app');
const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const progressBar = document.getElementById('progress-bar');
const timerElement = document.getElementById('time-left');
const correctSound = document.getElementById('correct-sound');
const incorrectSound = document.getElementById('incorrect-sound');


let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 10;
let timerInterval;


const questions = [
    {
        question: "Which is the largest animal in the world?",
        answers: [
            { text: "Shark", correct: false },
            { text: "Blue whale", correct: true },
            { text: "Elephant", correct: false },
            { text: "Giraffe", correct: false },
        ],
    },
    {
        question: "Which is the smallest country in the world?",
        answers: [
            { text: "Vatican City", correct: true },
            { text: "Bhutan", correct: false },
            { text: "Nepal", correct: false },
            { text: "Sri Lanka", correct: false },
        ],
    },
    {
        question: "Who is known as the Father of Modern Physics?",
        answers: [
            { text: "Marie Curie", correct: false },
            { text: "F. Scott Fitzgerald", correct: false },
            { text: "Albert Einstein", correct: true },
            { text: "Harper Lee", correct: false },
        ],
    },
    {
        question: "Which is the largest desert in the world?",
        answers: [
            { text: "Kalahari", correct: false },
            { text: "Gobi", correct: false },
            { text: "Sahara", correct: false },
            { text: "Antarctica", correct: true },
        ],
    },
    {
        question: "Which is the smallest continent in the world?",
        answers: [
            { text: "Asia", correct: false },
            { text: "Australia", correct: true },
            { text: "Arctic", correct: false },
            { text: "Africa", correct: false },
        ],
    },
];


loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    if (name && email) {
        loginContainer.style.display = 'none';
        appContainer.style.display = 'block';
        startQuiz();
    }
});


function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerHTML = "<i class='fas fa-arrow-right'></i> Next";
    showQuestion();
}


function showQuestion() {
    resetState();
    startTimer();
    updateProgressBar();
    let currentQuestion = questions[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;

    questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("btn");
        answerButtons.appendChild(button);
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener("click", selectAnswer);
    });
}


function resetState() {
    nextButton.style.display = "none";
    clearInterval(timerInterval); 
    while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);
    }
}


function selectAnswer(e) {
    clearInterval(timerInterval);
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";
    if (isCorrect) {
        selectedBtn.classList.add("correct");
        score++;
        correctSound.play();
    } else {
        selectedBtn.classList.add("incorrect");
        incorrectSound.play();
    }
    Array.from(answerButtons.children).forEach(button => {
        if (button.dataset.correct === "true") {
            button.classList.add("correct"); 
        }
        button.disabled = true;
    });
    nextButton.style.display = "block";
}


function startTimer() {
    timeLeft = 10;
    timerElement.innerText = timeLeft;
    timerInterval = setInterval(() => {
        timeLeft--;
        timerElement.innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleNextButton();
        }
    }, 1000);
}

// Update the progress bar
function updateProgressBar() {
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    progressBar.style.width = progress + '%';
}

// Handle the "Next" button click
nextButton.addEventListener("click", () => {
    if (currentQuestionIndex < questions.length) {
        handleNextButton();
    } else {
        showScore();
    }
});

function handleNextButton() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        showQuestion();
    } else {
        showScore();
    }
}

// Display the final score
function showScore() {
    resetState();
    questionElement.innerHTML = `You scored ${score} out of ${questions.length}!`;

    let feedbackMessage = "";
    if (score === questions.length) {
        feedbackMessage = "Excellent! You got all the answers correct. 🎉";
    } else if (score > questions.length / 2) {
        feedbackMessage = "Good job! You got most of the answers correct. 👍";
    } else {
        feedbackMessage = "Keep trying! You can do better next time. 💪";
    }

    const feedbackElement = document.createElement("p");
    feedbackElement.innerHTML = feedbackMessage;
    questionElement.appendChild(feedbackElement);

    const reviewButton = document.createElement('button');
    reviewButton.innerHTML = "Review Answers";
    reviewButton.classList.add('btn');
    reviewButton.addEventListener('click', showReview);
    questionElement.appendChild(reviewButton);

    const playAgainButton = document.createElement('button');
    playAgainButton.innerHTML = "Play Again";
    playAgainButton.classList.add('btn');
    playAgainButton.addEventListener('click', resetToLogin);
    questionElement.appendChild(playAgainButton);
}

// Show the review of answers
function showReview() {
    resetState();
    questions.forEach((question, index) => {
        const reviewQuestion = document.createElement('div');
        reviewQuestion.classList.add('review-question');
        reviewQuestion.innerHTML = `<strong>Q${index + 1}:</strong> ${question.question}`;
        
        const correctAnswer = question.answers.find(answer => answer.correct);
        reviewQuestion.innerHTML += `<br><strong>Correct Answer:</strong> ${correctAnswer.text}`;
        questionElement.appendChild(reviewQuestion);
    });

    const playAgainButton = document.createElement('button');
    playAgainButton.innerHTML = "Play Again";
    playAgainButton.classList.add('btn');
    playAgainButton.addEventListener('click', resetToLogin);
    questionElement.appendChild(playAgainButton);
}

// Reset the quiz to the login page
function resetToLogin() {
    loginContainer.style.display = 'block';
    appContainer.style.display = 'none';
    loginForm.reset();
    currentQuestionIndex = 0;
    score = 0;
}
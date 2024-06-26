document.addEventListener('DOMContentLoaded', () => {
    const questionContainer = document.getElementById('question-container');
    const nextButton = document.getElementById('next-button');
    const progress = document.getElementById('progress');
    const timeDisplay = document.getElementById('time');

    let currentQuestionIndex = 0;
    let questions = [];
    let score = 0;
    let timer;
    let totalTime;

    async function readJSONFile(url) {
        const response = await fetch(url);
        return response.json();
    }

    function getRandomQuestions(type, num) {
        return readJSONFile('questions.json').then(data => {
            let allQuestions = [];
            if (type === 'all') {
                allQuestions = [...Object.values(data.html), ...Object.values(data.css), ...Object.values(data.js)];
            } else {
                allQuestions = Object.values(data[type]);
            }
            const shuffled = allQuestions.sort(() => 0.5 - Math.random());
            return shuffled.slice(0, num);
        });
    }

    function displayQuestion(question) {
        questionContainer.innerHTML = `
            <h3>${currentQuestionIndex + 1}. ${question.question}</h3>
            <fieldset>
                <label><input type="radio" name="answer" value="a"> ${question.choices.a}</label>
            </fieldset>
            <fieldset>
                <label><input type="radio" name="answer" value="b"> ${question.choices.b}</label>
            </fieldset>
            <fieldset>
                <label><input type="radio" name="answer" value="c"> ${question.choices.c}</label>
            </fieldset>
            <fieldset>
                <label><input type="radio" name="answer" value="d"> ${question.choices.d}</label>
            </fieldset>
        `;
        progress.textContent = `${currentQuestionIndex + 1} of ${questions.length} Questions`;
    }

    function startQuiz(type, num) {
        getRandomQuestions(type, num).then(qs => {
            questions = qs;
            totalTime = questions.length * 60;
            displayQuestion(questions[currentQuestionIndex]);
            startTimer();
        });
    }

    function startTimer() {
        clearInterval(timer);
        timer = setInterval(() => {
            totalTime--;
            let minutes = Math.floor(totalTime / 60);
            let seconds = totalTime % 60;
            timeDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            if (totalTime <= 0) {
                clearInterval(timer);
                endQuiz();
            }
        }, 1000);
    }

    function endQuiz() {
        questionContainer.innerHTML = `
            <h3>Quiz Completed</h3>
            <p>Your score: ${score} out of ${questions.length}</p>
        `;
        questions.forEach((question, index) => {
            const correctAnswer = question.choices[question.correctAnswer];
            questionContainer.innerHTML += `
                <p>${index + 1}. ${question.question}</p>
                <p>Correct Answer: ${correctAnswer}</p>
            `;
        });
        nextButton.style.display = 'none';
    }

    nextButton.addEventListener('click', () => {
        const selectedAnswer = document.querySelector('input[name="answer"]:checked');
        if (selectedAnswer) {
            const question = questions[currentQuestionIndex];
            if (selectedAnswer.value === question.correctAnswer) {
                score++;
            }
            currentQuestionIndex++;
            if (currentQuestionIndex < questions.length) {
                displayQuestion(questions[currentQuestionIndex]);
            } else {
                endQuiz();
            }
        } else {
            alert('Please select an answer!');
        }
    });

    // Start the quiz with HTML questions and 5 questions by default
    startQuiz('html', 5);
});

const questions = [
    {
        question: "How well do you handle unexpected changes in your daily routine?",
        options: [
            "I become very anxious and frustrated",
            "I feel somewhat uncomfortable but manage",
            "I adapt fairly well after initial adjustment",
            "I embrace change and adapt quickly"
        ]
    },
    {
        question: "When someone criticizes your work, how do you typically respond?",
        options: [
            "I take it personally and become defensive",
            "I feel hurt but try to listen",
            "I consider their perspective and reflect",
            "I welcome feedback as an opportunity to improve"
        ]
    },
    {
        question: "How do you handle conflicts with others?",
        options: [
            "I avoid conflicts at all costs",
            "I try to compromise but often feel resentful",
            "I work towards finding middle ground",
            "I address issues directly and seek win-win solutions"
        ]
    },
    {
        question: "How aware are you of your emotional state throughout the day?",
        options: [
            "I rarely think about my emotions",
            "I notice strong emotions when they occur",
            "I'm generally aware of my emotional state",
            "I'm highly attuned to my emotional changes"
        ]
    },
    {
        question: "How do you respond when someone is sharing their problems with you?",
        options: [
            "I try to solve their problem immediately",
            "I listen but often feel uncomfortable",
            "I listen and offer support when asked",
            "I listen actively and show genuine empathy"
        ]
    },
    {
        question: "How often do you feel overwhelmed or stressed?",
        options: [
            "Rarely",
            "Sometimes",
            "Often",
            "Almost always"
        ]
    },
    {
        question: "How do you sleep at night?",
        options: [
            "Well and refreshed",
            "Occasional issues",
            "Struggle with sleep",
            "Terrible sleep"
        ]
    },
    {
        question: "How do you usually feel throughout the day?",
        options: [
            "Happy and energetic",
            "Neutral",
            "Frequently sad or anxious",
            "Unmotivated"
        ]
    },
    {
        question: "How often do you feel lonely or disconnected?",
        options: [
            "Rarely",
            "Sometimes",
            "Often",
            "Almost always"
        ]
    },
    {
        question: "How well do you manage negative thoughts?",
        options: [
            "Stay positive",
            "Handle them",
            "Struggle",
            "Stuck in negativity"
        ]
    },
    {
        question: "How do you handle social situations?",
        options: [
            "Confident",
            "Need breaks",
            "Avoid them",
            "Extreme anxiety"
        ]
    }
];

let currentQuestion = 0;
let score = 0;

const quizDiv = document.getElementById('quiz');
const resultDiv = document.getElementById('result');
const questionText = document.getElementById('question-text');
const optionsDiv = document.getElementById('options');
const nextButton = document.getElementById('next-btn');
const progressBar = document.getElementById('progress');

function showQuestion() {
    const question = questions[currentQuestion];
    questionText.textContent = question.question;
    optionsDiv.innerHTML = '';

    question.options.forEach((option, index) => {
        const button = document.createElement('div');
        button.className = 'option';
        button.textContent = option;
        button.onclick = () => selectOption(index);
        optionsDiv.appendChild(button);
    });

    updateProgress();
}

function selectOption(index) {
    const options = document.querySelectorAll('.option');
    options.forEach(option => option.classList.remove('selected'));
    options[index].classList.add('selected');
    nextButton.style.display = 'block';

    if (currentQuestion < 5) {
        score += ((index + 1) * (100 / (questions.length * 4)));
    } else {
        score += ((4 - index) * (100 / (questions.length * 4)));
    }
}

function updateProgress() {
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    progressBar.style.width = `${progress}%`;
}

function showResult() {
    quizDiv.style.display = 'none';
    resultDiv.style.display = 'block';

    const finalScore = Math.round(score);
    document.getElementById('score').textContent = `${finalScore}%`;

    let feedback;
    if (finalScore >= 85) {
        feedback = "Exceptional emotional intelligence! You show strong self-awareness and empathy.";
    } else if (finalScore >= 70) {
        feedback = "Good emotional intelligence. You have solid emotional awareness with room for growth.";
    } else if (finalScore >= 50) {
        feedback = "Moderate emotional intelligence. Consider developing your emotional awareness further.";
    } else {
        feedback = "There's significant room for improving your emotional intelligence. Focus on self-awareness and empathy.";
    }
    document.getElementById('feedback').textContent = feedback;
}

function nextQuestion() {
    if (!document.querySelector('.option.selected')) {
        alert('Please select an option before proceeding');
        return;
    }

    currentQuestion++;
    if (currentQuestion < questions.length) {
        showQuestion();
        nextButton.style.display = 'none';
    } else {
        showResult();
    }
}

function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    quizDiv.style.display = 'block';
    resultDiv.style.display = 'none';
    nextButton.style.display = 'none';
    showQuestion();
}

nextButton.addEventListener('click', nextQuestion);
showQuestion();

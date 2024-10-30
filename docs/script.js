class QuizApp {
    constructor() {
        this.currentSet = 0;
        this.answers = {};
        this.submitted = false;
        this.questionsPerSet = 5;
        
        this.initElements();
        this.bindEvents();
        this.renderCurrentSet();
    }

    initElements() {
        this.questionsContainer = document.getElementById('questions');
        this.prevButton = document.getElementById('prevBtn');
        this.nextButton = document.getElementById('nextBtn');
        this.checkButton = document.getElementById('checkBtn');
        this.currentSetSpan = document.getElementById('currentSet');
        this.totalSetsSpan = document.getElementById('totalSets');
        
        // Set total sets
        this.totalSets = Math.ceil(questions.length / this.questionsPerSet);
        this.totalSetsSpan.textContent = this.totalSets;
    }

    bindEvents() {
        this.prevButton.addEventListener('click', () => this.prevSet());
        this.nextButton.addEventListener('click', () => this.nextSet());
        this.checkButton.addEventListener('click', () => this.checkAnswers());
    }

    getCurrentQuestions() {
        const startIndex = this.currentSet * this.questionsPerSet;
        return questions.slice(startIndex, startIndex + this.questionsPerSet);
    }

    renderCurrentSet() {
        this.questionsContainer.innerHTML = '';
        const currentQuestions = this.getCurrentQuestions();

        currentQuestions.forEach(q => {
            const questionDiv = document.createElement('div');
            questionDiv.className = 'question-item';
            
            questionDiv.innerHTML = `
                <div class="question-text">
                    <span class="question-number">${q.id}.</span> ${q.text}
                </div>
                <div class="input-group">
                    <input type="text" 
                           id="q${q.id}" 
                           value="${this.answers[q.id] || ''}"
                           ${this.submitted ? 'disabled' : ''}
                           placeholder="Type your answer here...">
                    ${this.submitted ? this.getFeedbackIcon(q.id) : ''}
                </div>
                <div class="hint">${q.hint}</div>
                ${this.submitted && !this.isCorrect(q.id) ? 
                    `<div class="correct-answer">Correct answer: ${q.answer}</div>` : ''}
            `;

            if (!this.submitted) {
                const input = questionDiv.querySelector(`#q${q.id}`);
                input.addEventListener('input', (e) => {
                    this.answers[q.id] = e.target.value;
                });
            }

            this.questionsContainer.appendChild(questionDiv);
        });

        // Update navigation state
        this.prevButton.disabled = this.currentSet === 0;
        this.nextButton.disabled = this.currentSet === this.totalSets - 1;
        this.nextButton.style.display = this.submitted ? 'block' : 'none';
        this.checkButton.style.display = this.submitted ? 'none' : 'block';
        this.currentSetSpan.textContent = this.currentSet + 1;
    }

    getFeedbackIcon(questionId) {
        const isCorrect = this.isCorrect(questionId);
        return `
            <div class="feedback ${isCorrect ? 'correct' : 'incorrect'}">
                ${isCorrect ? 
                    '<svg class="icon" viewBox="0 0 24 24"><path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path></svg>' : 
                    '<svg class="icon" viewBox="0 0 24 24"><path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>'}
            </div>`;
    }

    isCorrect(questionId) {
        const question = questions.find(q => q.id === questionId);
        return this.answers[questionId]?.toLowerCase() === question.answer.toLowerCase();
    }

    checkAnswers() {
        this.submitted = true;
        this.renderCurrentSet();
    }

    nextSet() {
        if (this.currentSet < this.totalSets - 1) {
            this.currentSet++;
            this.submitted = false;
            this.answers = {};
            this.renderCurrentSet();
        }
    }

    prevSet() {
        if (this.currentSet > 0) {
            this.currentSet--;
            this.submitted = false;
            this.answers = {};
            this.renderCurrentSet();
        }
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new QuizApp();
});

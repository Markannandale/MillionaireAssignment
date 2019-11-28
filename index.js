//Array
const money = [
  { level: '15', amount: '1,000,000' },
  { level: '14', amount: '500,000' },
  { level: '13', amount: '250,000' },
  { level: '12', amount: '100,000' },
  { level: '11', amount: '50,000' },
  { level: '10', amount: '25,000' },
  { level: '9', amount: '16,000' },
  { level: '8', amount: '8,000' },
  { level: '7', amount: '4,000' },
  { level: '6', amount: '2,000' },
  { level: '5', amount: '1,000' },
  { level: '4', amount: '500' },
  { level: '3', amount: '300' },
  { level: '2', amount: '200' },
  { level: '1', amount: '100' },
];

new Vue ({
  el: '#app',
  data: {
    message: '',
    questions: [],
    money,
    qIndex: 0,
    answer1: '',
    answer2: '',
    answer3: '',
    answer4: '',
    correctAnswer: '',
    correctLetter: '',
    vote: true
  },
  //Gets the questions from the API
  async created() {
    const res = await fetch('https://opentdb.com/api.php?amount=15&type=multiple');
    const data = await res.json();
    console.log(data.results[0]);
    this.questions = data.results;
    this.displayQ();
  },
  watch: {
    qIndex() {
      this.parseCurrQ;
    }
  },methods: {
    //Displays Questions
    displayQ() {
      this.parseCurrQ();
      this.shuffleAnswers();
      this.speak();
    },
    //Sets Questions
    parseCurrQ() {
      this.question = this.questions[this.qIndex].question;
      this.correctAnswer = this.questions[this.qIndex].correct_answer;
    },
    //Reads out the questions
    speak() {
      const host = new SpeechSynthesisUtterance();
      host.lang = "en-US";
      host.text = `${this.question} A:${this.answer1}, B:${this.answer2}, C:${this.answer3}, D:${this.answer4}`;

      speechSynthesis.speak(host);
    },
    //Determines if selected answer is correct or not
    isAnswer(letter) {
      const dictionary = ['a', 'b', 'c', 'd'];
      const index = dictionary.findIndex(char => char === letter);
      const right = new Audio('sounds/RightAnswerShort.ogg');
      const wrong = new Audio('sounds/WrongAnswer.ogg');
      if (index === this.correctLetter) {
        right.play();
        this.qIndex += 1;
        this.message = '';
        this.displayQ();
      } else {
        wrong.play();
        this.message = 'Wrong answer';
      }
    },
    //Shuffles the values of the answer array before outputting them
    shuffleAnswers() {
      const answers = [this.correctAnswer, ...this.questions[this.qIndex].incorrect_answers];
      answers.sort(() => Math.random() - 0.5);
      [this.answer1, this.answer2, this.answer3, this.answer4] = answers;
      this.correctLetter = answers.findIndex(answer => answer === this.correctAnswer);
      console.log(this.correctAnswer);
    },
    ask() {
      this.vote = !this.vote;
    }
  }
})
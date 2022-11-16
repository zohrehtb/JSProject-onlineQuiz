// Variables
let questions = null, curItemsIndex = -1, count = 10, timerInterval, progressWidth = 0, loadQuestionsInterval;

// Elements
let startPage = document.getElementById("start-page"),
    examPage = document.getElementById("exam-module"),
    endPage = document.getElementById("end-page"),
    examResponse = document.getElementById("exam-response");

/**
 * Load questions list
 */
(function loadQuestionsJson() {
    fetch("../data.json")
    .then((res) => res.json())
    .then((data) => {
        questions = data.questions;
    });
})();


/**
 * Show exam page
 */
const showExamPage = () => {
    examPage.classList.remove('hidden');
    examPage.classList.add('show');

    endPage.classList.remove('show');
    endPage.classList.add('hidden');
}

/**
 * Timer
 */
const timer = () => {
    document.getElementById("progress-bar").style.width = progressWidth + '%';
    document.getElementById("counter").innerHTML = count;

    if (count <= 0) {
        count = 10;
    } else {
        count = count - 1;
    }

    if (progressWidth >= 100) {
        progressWidth = 0;
    } else {
        progressWidth = progressWidth + 10;
    }
}

/**
 * Add class to page
 *
 * @param { string | number } index
 * @param { string } className
 */
const pager = (index, className) => {
    const list = document.getElementsByClassName("pager__items");
    for (let i = 0; i < list.length; i++) {
        if(i === index) list[i].classList.add(className);
    }
}

/**
 * Exam result
 */
const examResult = () => {
    const trueAnswers = document.getElementsByClassName("pager__item-true");
    const falseAnswers = document.getElementsByClassName("pager__item-false");

    examResponse.classList = [];

    if(trueAnswers.length === 0) {
        examResponse.innerText = 'مطمينی چیزیم بلدی؟!';
        examResponse.classList.add('redText');
    } else if(trueAnswers.length > falseAnswers.length) {
        examResponse.innerText = 'هورااااا عالییی بود. آفرین بهت.';
        examResponse.classList.add('greenText');
    } else if(trueAnswers.length === falseAnswers.length) {
        examResponse.innerText = 'ااااای بدک نبود !';
        examResponse.classList.add('yellowText');
    } else if(trueAnswers.length < falseAnswers.length) {
       examResponse.innerText = 'اون چند تا رم شانسی زدی نه ؟!';
       examResponse.classList.add('redText');
    }
}

/**
 * Show end page
 */
const showEndPage = () => {
    clearInterval(loadQuestionsInterval);
    clearInterval(timerInterval);
    examPage.classList.remove('show');
    examPage.classList.add('hidden');

    endPage.classList.remove('hidden');
    endPage.classList.add('show');
    examResult();
}

/**
 * Load pager
 */
const loadPager = () => {
    if (curItemsIndex < questions.length) {
        //pager
        let pageList = '';
        questions.forEach((item) => {
            pageList += '<li class="pager__items"></li>';
        });
        document.getElementById("pager").innerHTML = pageList;
    }
}

/**
 * Check question for true and false
 * 
 * @param {string | number} index
 */
const checkQuestion = (index) => {
    const list = document.getElementsByTagName('button');

    for (let i = 0; i < list.length; i++) {
        list[i].addEventListener('click', (e) => {
            pager(index, `pager__item-${e.target.attributes.value.value * 1 ? 'true' : 'false'}`);

            if(curItemsIndex >= questions.length) return showEndPage();

            count = 10;
            progressWidth = 0;
            timer();
            loadQuestions(true);
        });
    }
}

/**
 * Show Questions
 */
const loadQuestions = (clicked = false) => {
    if(clicked === false) {
        pager(curItemsIndex - 1, 'pager__item-false');
    }

    if(questions[curItemsIndex]) {
        clearInterval(loadQuestionsInterval);
        clearInterval(timerInterval);
        timerInterval = setInterval(timer, 1000);
        loadQuestionsInterval = setInterval(loadQuestions, 11000);

        document.getElementById("title").innerHTML = questions[curItemsIndex].question;
        const { responses } = questions[curItemsIndex];

        let str = '';
        responses.forEach((item) => {
            str += '<button value='+item.answer+'>'+ item.text + '</button>';
        });
        document.getElementById("buttons").innerHTML = str;

        checkQuestion(curItemsIndex);

        curItemsIndex += 1;
    } else {
        showEndPage();
    }
}

/**
 * Start exam
 */
const start = () => {
    showExamPage();
    curItemsIndex = 0;

    if(questions && questions.length) {
        loadPager();
        timer();
        loadQuestions();
    }
}


document.addEventListener('DOMContentLoaded', () => {

    const startButton = document.getElementById("start-exam");
    const startAginButton = document.getElementById("start-again");

    startButton.addEventListener('click', (e) => {
        startPage.classList.remove('show');
        startPage.classList.add('hidden');

        examPage.classList.remove('hidden');
        examPage.classList.add('show');

        start();
    });

    startAginButton.addEventListener('click', (e) => {

        count = 10;
        progressWidth = 0;
        start();
    });
});

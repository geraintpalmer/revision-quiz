var score = 0;

var write_answer = function(answer, qnum, anum) {
let answer_div = `
<div class='answer-button a-${qnum}' id='aview-q-${qnum}-a-${anum}'>
  <label><input type="radio" name="q-${qnum}" id="q-${qnum}-a-${anum}" correctness="${answer.answer_status}" onclick="enable_check(this)">
    <span id="span-q-${qnum}-a-${anum}">
      <p>${answer.answer_text}</p>
    </span>
  </label>
</div>
`
return answer_div;
}

var write_question_answers = function(answers, qnum) {
    const numbers = [0, 1, 2, 3];
    const random_number_array = [Math.random(), Math.random(), Math.random(), Math.random()];
    const answer_orders = numbers.sort((a, b) => random_number_array[a] - random_number_array[b]);
    
    let answers_div = ''
    for (let i = 0; i < 4; i++){
        let j = answer_orders[i]
        answers_div = answers_div + write_answer(answers[j], qnum, i)
    };
    return answers_div;
};

var write_question = function(question, disp, qnum, nqs) {
let question_div = `
<div class="question" id="question-${qnum}" style="display: ${disp};">
    <div class="panel panel-default">
        <div class="panel-heading">Question ${qnum + 1}</div>
        <div class="panel-body">
          
          <div class='question-text'>${question.question}</div>
`
if (question.image != false) {
    question_div = question_div + `

<img src="../img/${question.image}">

`
}
question_div = question_div + write_question_answers(question.answers, qnum)

question_div = question_div + `
    <div class='explanation' id='explanation-q${qnum}' style="display: none;">${question.explanation}</div>
`

question_div = question_div + `
      </div>
      <div class="panel-footer clearfix">
        <div class="panel-footer-left">Score <span class='score'>0</span> / ${nqs}</div>
`
if (qnum + 1 == nqs) {
  question_div = question_div + `
    <button type="button" id="next-button-${qnum}" class="btn btn-default btn-next pull-right" onclick="finish(this)" style="display: none;" disabled>Finish</button>
`
} else {
  question_div = question_div + `
    <button type="button" id="next-button-${qnum}" class="btn btn-default btn-next pull-right" onclick="next_question(this)" style="display: none;" disabled>Next</button>
`  
};
question_div = question_div + `
        <button type="button" id="check-button-${qnum}" class="btn btn-default btn-next pull-right" onclick="check(this, ${nqs})" disabled>Check</button>
      </div>
  </div>
</div>
`
return question_div;
};


var write_all_questions = function(questions, nqs) {
    const all_possible_Qs = questions.length
    const numbers = Array.apply(null, {length: all_possible_Qs}).map(Number.call, Number);
    const random_number_array = Array.apply(null, {length: all_possible_Qs}).map(Function.call, Math.random);
    const question_orders = numbers.sort((a, b) => random_number_array[a] - random_number_array[b]);
    
    let questions_div = ''
    for (let i = 0; i < nqs; i++){
        let j = question_orders[i];
        if (i == 0) {
            disp = 'block';
        } else {
            disp = 'none';
        };
        questions_div = questions_div + write_question(questions[j], disp, i, nqs)
    };
    return questions_div;
};

var create_questions = function(quiz, num_qs) {
    // Read in data
    console.log(quiz, num_qs)
    $.getJSON("../data/" + quiz + ".json", function(data) {
        let summary_box = document.getElementById('summary');
        summary_box.innerHTML = summary_box.innerHTML.replace('quiz-information', data.information)
        summary_box.innerHTML = summary_box.innerHTML.replace('total_num_qs', data.questions.length)
        let qdiv = document.getElementById('all_questions')
        qdiv.innerHTML = write_all_questions(data.questions, num_qs)
    })
};



var check = function(check_btn, num_qs) {
    let current_qnum = check_btn.id.slice(13);

    // Update progress bar
    let progress_bar = document.getElementById('progressbar');
    let current_width = progress_bar.style.width;
    let new_width = parseFloat(current_width) + ((1 / num_qs) * 100)
    progress_bar.style.width = new_width + '%'
    document.getElementById('explanation-q' + current_qnum).style.display = 'block'

    // Check if correct
    let answer = document.querySelectorAll('input[name="q-' + current_qnum + '"]:checked')[0];
    if (answer.getAttribute('correctness') == 'correct') {
        let scores = document.getElementsByClassName('score');
        score = score + 1;
        for (let i = 0; i < scores.length; i++) {
          scores[i].innerHTML = score;
        }
    }

    // disable question and enable next button
    next_btn = document.getElementById('next-button-' + current_qnum)
    check_btn.disabled = true;
    check_btn.style.display = 'none'
    next_btn.disabled = false;
    next_btn.style.display = 'block'

    for (let i = 0; i < 4; i++) {
      let answer = document.getElementById('q-' + current_qnum + '-a-' + i);
      let answerspan = document.getElementById('span-q-' + current_qnum + '-a-' + i);
      let answerview = document.getElementById('aview-q-' + current_qnum + '-a-' + i);
      answer.disabled = true

      if (answer.getAttribute('correctness') == 'correct' &&  answer.checked == false) {
        // Correct answer not selected
        answer.checked = false;
        answerview.style.setProperty('background-color', '#CEE7B9', 'important');
        answerspan.style.setProperty('border-color', '#7bc043', 'important');
        answerspan.style.setProperty('color', '#7bc043', 'important');
      }

      if (answer.getAttribute('correctness') == 'incorrect' &&  answer.checked == false) {
        // Incorrect answer not selected
        answer.checked = false;
        answerview.style.setProperty('background-color', '#E9E9E9', 'important');
        answerspan.style.setProperty('border-color', '#C4C4C4', 'important');
        answerspan.style.setProperty('color', '#C4C4C4', 'important');

      }

      if (answer.getAttribute('correctness') == 'correct' &&  answer.checked == true) {
        // Correct answer selected
        answer.checked = false;
        answerview.style.setProperty('background-color', '#CEE7B9', 'important');
        answerspan.style.setProperty('border-color', '#7bc043', 'important');
        answerspan.style.setProperty('color', '#7bc043', 'important');
      }
      
      if (answer.getAttribute('correctness') == 'incorrect' &&  answer.checked == true) {
        // Incorrect answer selected
        answer.checked = false;
        answerview.style.setProperty('background-color', '#F9B7B3', 'important');
        answerspan.style.setProperty('border-color', '#ee4035', 'important');
        answerspan.style.setProperty('color', '#ee4035', 'important');

      }
    }

};


var next_question = function(next_btn) {
    let current_qnum = next_btn.id.slice(12);
    // Move on to next question
    let next_qnum = parseInt(current_qnum) + 1;
    document.getElementById('question-' + current_qnum).style.display = 'none'
    document.getElementById('question-' + next_qnum).style.display = 'block'
    window.scrollTo(0, 0);
};

var finish = function(next_btn) {
    let questions = document.getElementsByClassName('question');
    for (let i = 0; i < questions.length; i++) {
        questions[i].style.display = 'block'
        let next_btn = document.getElementById('next-button-' + i);
        next_btn.style.display = 'none'
    }
    let summary_box = document.getElementById('summary');
    summary_box.innerHTML = summary_box.innerHTML.replace('final_score', score)
    summary_box.style.display = 'block'
    window.scrollTo(0, 0);
}

var enable_check = function(answer) {
    let current_qnum = answer.name.slice(2);
    document.getElementById('check-button-' + current_qnum).disabled = false
}
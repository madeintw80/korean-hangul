/* 한글 Studio v3 課程互動：主線、組合表、收尾音與三種朗讀測驗。 */
(function () {
  'use strict';

  const COURSE = window.HANGUL_COURSE_DATA;
  if (!COURSE) return;

  const STORAGE_KEY = 'hangulCourseV3';
  const DEFAULT_STATE = { completed: [], currentLesson: 'blocks', matrixGroup: 'basic', mistakes: {} };
  let state = loadState();
  let currentQuizMode = 'split';
  let courseQuiz = { answer: '', key: '', correct: 0, total: 0, locked: false, audio: '' };

  function loadState() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return {
        ...DEFAULT_STATE,
        ...parsed,
        completed: Array.isArray(parsed.completed) ? parsed.completed : [],
        mistakes: parsed.mistakes && typeof parsed.mistakes === 'object' ? parsed.mistakes : {},
      };
    } catch (_) {
      return { ...DEFAULT_STATE };
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function pick(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  function mixed(list) {
    const copy = list.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function uniqueOptions(answer, candidates, count = 4) {
    const values = [...new Set([answer, ...mixed(candidates).filter(v => v !== answer)])].slice(0, count);
    return mixed(values);
  }

  function switchView(viewId) {
    document.querySelectorAll('.primary-tab').forEach(button => {
      const on = button.dataset.view === viewId;
      button.classList.toggle('active', on);
      button.setAttribute('aria-selected', String(on));
    });
    document.querySelectorAll('.view-panel').forEach(panel => panel.classList.toggle('active', panel.id === viewId));
    if (typeof stopSpeak === 'function') stopSpeak();
    if (viewId === 'course-quiz-view' && !courseQuiz.answer) newCourseQuestion();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function setupPrimaryTabs() {
    document.querySelectorAll('.primary-tab').forEach(button => {
      button.onclick = () => switchView(button.dataset.view);
    });
    document.addEventListener('click', event => {
      const opener = event.target.closest('[data-open-view]');
      if (opener) switchView(opener.dataset.openView);
    });
  }

  function updateCourseProgress() {
    const done = COURSE.lessons.filter(lesson => state.completed.includes(lesson.id)).length;
    const percent = Math.round(done / COURSE.lessons.length * 100);
    document.getElementById('courseProgressText').textContent = `${done} / ${COURSE.lessons.length} 關`;
    document.getElementById('coursePercent').textContent = `${percent}%`;
    document.getElementById('courseProgressBar').style.width = `${percent}%`;
    const start = document.getElementById('courseStart');
    start.textContent = done === 0 ? '開始第一關' : done === COURSE.lessons.length ? '重新看課程' : '繼續上次進度';
  }

  function renderLessonMap() {
    const root = document.getElementById('lessonList');
    root.innerHTML = '';
    COURSE.lessons.forEach(lesson => {
      const completed = state.completed.includes(lesson.id);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `lesson-ticket${completed ? ' completed' : ''}${state.currentLesson === lesson.id ? ' current' : ''}`;
      button.innerHTML = `<span class="lesson-no">${completed ? '✓' : lesson.number}</span>
        <span class="lesson-copy"><small>${lesson.minutes} MIN · ${lesson.kicker}</small><strong>${lesson.title}</strong></span>
        <span class="lesson-arrow" aria-hidden="true">→</span>`;
      button.setAttribute('aria-label', `${completed ? '已完成，' : ''}第 ${lesson.number} 關 ${lesson.title}`);
      button.onclick = () => openLesson(lesson.id);
      root.appendChild(button);
    });
  }

  function makeSoundButton(sound) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'course-sound-card';
    button.innerHTML = `<strong>${sound.letter}</strong><span>${sound.roman}</span><small>${sound.hint}</small>`;
    button.setAttribute('aria-label', `播放 ${sound.sample}`);
    button.onclick = () => speak(sound.sample);
    return button;
  }

  function makeComparisonRow(values) {
    const row = document.createElement('div');
    row.className = 'compare-row';
    const playAll = document.createElement('button');
    playAll.type = 'button';
    playAll.className = 'compare-play';
    playAll.textContent = '▶ 比較';
    playAll.onclick = () => speakSeq(values.map(text => ({ text })), 0.82, 320);
    row.appendChild(playAll);
    values.forEach(value => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = value;
      button.onclick = () => speak(value);
      row.appendChild(button);
    });
    return row;
  }

  function openLesson(lessonId) {
    const lesson = COURSE.lessons.find(item => item.id === lessonId) || COURSE.lessons[0];
    state.currentLesson = lesson.id;
    saveState();
    renderLessonMap();
    const root = document.getElementById('lessonStage');
    root.innerHTML = `<header class="lesson-stage-head">
        <div><p class="eyebrow">LESSON ${lesson.number} / ${lesson.minutes} MIN</p><h2>${lesson.title}</h2><p>${lesson.goal}</p></div>
        <div class="lesson-stamp">${lesson.number}</div>
      </header>
      <div class="lesson-note"><strong>先抓這個：</strong>${lesson.note}</div>
      <section><h3>點一下，先把聲音聽熟</h3><div class="course-sound-grid" id="lessonSounds"></div></section>
      <section><h3>放在一起比較</h3><div class="comparison-list" id="lessonComparisons"></div></section>
      <footer class="lesson-actions"><button class="mini-btn" type="button" data-open-view="course-quiz-view">去做測驗</button><button id="completeLesson" class="big-btn" type="button">${state.completed.includes(lesson.id) ? '已完成・再往下一關' : '完成這一關'}</button></footer>`;
    const soundRoot = root.querySelector('#lessonSounds');
    lesson.sounds.forEach(sound => soundRoot.appendChild(makeSoundButton(sound)));
    const comparisonRoot = root.querySelector('#lessonComparisons');
    lesson.compare.forEach(values => comparisonRoot.appendChild(makeComparisonRow(values)));
    root.querySelector('#completeLesson').onclick = () => completeLesson(lesson.id);
    root.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function completeLesson(lessonId) {
    if (!state.completed.includes(lessonId)) state.completed.push(lessonId);
    const index = COURSE.lessons.findIndex(lesson => lesson.id === lessonId);
    const next = COURSE.lessons[index + 1];
    state.currentLesson = next ? next.id : lessonId;
    saveState();
    updateCourseProgress();
    renderLessonMap();
    if (next) openLesson(next.id);
    else {
      const button = document.getElementById('completeLesson');
      if (button) button.textContent = '九關完成！去挑戰總測驗';
      switchView('course-quiz-view');
    }
  }

  function setupCourse() {
    updateCourseProgress();
    renderLessonMap();
    document.getElementById('courseStart').onclick = () => {
      const next = COURSE.lessons.find(lesson => !state.completed.includes(lesson.id));
      openLesson((next || COURSE.lessons[0]).id);
    };
  }

  function setupMatrix() {
    const filters = document.getElementById('matrixFilters');
    COURSE.matrixGroups.forEach(group => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `filter-chip${group.id === state.matrixGroup ? ' active' : ''}`;
      button.textContent = group.label;
      button.dataset.group = group.id;
      button.onclick = () => {
        state.matrixGroup = group.id;
        saveState();
        filters.querySelectorAll('.filter-chip').forEach(item => item.classList.toggle('active', item === button));
        renderMatrix();
      };
      filters.appendChild(button);
    });
    document.getElementById('matrixRoman').onchange = renderMatrix;
    renderMatrix();
  }

  function renderMatrix() {
    const group = COURSE.matrixGroups.find(item => item.id === state.matrixGroup) || COURSE.matrixGroups[0];
    const showRoman = document.getElementById('matrixRoman').checked;
    const wrap = document.getElementById('syllableMatrix');
    const table = document.createElement('table');
    table.className = 'syllable-table';
    const thead = document.createElement('thead');
    const header = document.createElement('tr');
    header.innerHTML = '<th scope="col" class="matrix-corner">子 ＋ 母</th>';
    group.vowels.forEach(vowel => {
      const th = document.createElement('th');
      th.scope = 'col';
      th.innerHTML = `<strong>${vowel}</strong>`;
      header.appendChild(th);
    });
    thead.appendChild(header);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    group.consonants.forEach(consonant => {
      const row = document.createElement('tr');
      const th = document.createElement('th');
      th.scope = 'row';
      const rowButton = document.createElement('button');
      rowButton.type = 'button';
      rowButton.className = 'matrix-row-play';
      rowButton.innerHTML = `<strong>${consonant}</strong><small>▶ 整列</small>`;
      rowButton.onclick = () => {
        const syllables = group.vowels.map(vowel => composeHangul(consonant, vowel, ''));
        speakSeq(syllables.map(text => ({ text })), 0.8, 240);
      };
      th.appendChild(rowButton);
      row.appendChild(th);
      group.vowels.forEach(vowel => {
        const syllable = composeHangul(consonant, vowel, '');
        const td = document.createElement('td');
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'matrix-cell';
        button.innerHTML = `<strong>${syllable}</strong>${showRoman ? `<small>${romWord(syllable)}</small>` : ''}`;
        button.setAttribute('aria-label', `播放 ${syllable}，${consonant} 加 ${vowel}`);
        button.onclick = () => {
          speak(syllable);
          document.getElementById('matrixNow').textContent = `${consonant} ＋ ${vowel} ＝ ${syllable} · ${romWord(syllable)}`;
        };
        td.appendChild(button);
        row.appendChild(td);
      });
      tbody.appendChild(row);
    });
    table.appendChild(tbody);
    wrap.innerHTML = '';
    wrap.appendChild(table);
  }

  function setupBatchimCourse() {
    const root = document.getElementById('batchimCourse');
    const families = document.createElement('section');
    families.innerHTML = '<h3 class="content-title">三組卡住、不爆破的收尾</h3>';
    const familyGrid = document.createElement('div');
    familyGrid.className = 'batchim-family-grid';
    COURSE.batchimFamilies.forEach(family => {
      const card = document.createElement('article');
      card.className = 'batchim-family-card';
      card.innerHTML = `<p class="eyebrow">REPRESENTATIVE ${family.sound}</p><h3>${family.title}</h3><p>${family.tone}</p>
        <div class="spelling-strip">${family.spellings.map(item => `<b>${item}</b>`).join('')}</div>
        <div class="sample-strip"></div>`;
      const samples = card.querySelector('.sample-strip');
      family.samples.forEach(sample => {
        const button = document.createElement('button');
        button.type = 'button'; button.textContent = `🔊 ${sample}`; button.onclick = () => speak(sample); samples.appendChild(button);
      });
      familyGrid.appendChild(card);
    });
    families.appendChild(familyGrid);
    root.appendChild(families);

    const resonants = document.createElement('section');
    resonants.className = 'resonant-section';
    resonants.innerHTML = '<h3 class="content-title">聲音留在下面：鼻音／流音收尾</h3><p class="section-lead">ㄴ、ㅁ、ㅇ 的鼻音仍聽得見；ㄹ 則保留舌尖停住的 l 音感。</p>';
    const resonantGrid = document.createElement('div');
    resonantGrid.className = 'resonant-grid';
    COURSE.resonantBatchim.forEach(item => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'resonant-card';
      button.innerHTML = `<span>${item.letter}</span><strong>${item.sample}</strong><b>${item.word}</b><small>${item.roman} · ${item.mean}<br>${item.cue}</small>`;
      button.onclick = () => speak(item.word);
      resonantGrid.appendChild(button);
    });
    resonants.appendChild(resonantGrid);
    root.appendChild(resonants);

    const doubleBlock = document.createElement('section');
    doubleBlock.className = 'double-batchim';
    doubleBlock.innerHTML = `<div><p class="eyebrow">NEXT LEVEL</p><h3>11 種雙收尾先認得，不急著一次背完</h3><p>遇到後方母音、子音或詞形變化時，可能連音或留下不同一邊；放到進階音變課再逐組練。</p></div><div class="double-list">${COURSE.doubleBatchim.map(item => `<b>${item}</b>`).join('')}</div>`;
    root.appendChild(doubleBlock);

    const action = document.createElement('div');
    action.className = 'view-action';
    action.innerHTML = '<button class="big-btn" type="button" data-open-view="course-quiz-view">挑戰收尾音測驗</button>';
    root.appendChild(action);
  }

  const QUIZ_MODES = [
    { id:'split', label:'拆字', kicker:'聽音節，再把它拆開' },
    { id:'hear', label:'聽音', kicker:'只聽聲音，選出正確字' },
    { id:'final', label:'收尾', kicker:'聽單字，判斷代表收尾音' },
  ];
  const QUIZ_CONSONANTS = ['ㄱ','ㄴ','ㄷ','ㄹ','ㅁ','ㅂ','ㅅ','ㅇ','ㅈ','ㅎ','ㄲ','ㅋ','ㅆ','ㅊ'];
  const QUIZ_VOWELS = ['ㅏ','ㅓ','ㅗ','ㅜ','ㅡ','ㅣ','ㅑ','ㅕ','ㅛ','ㅠ','ㅐ','ㅔ'];
  const FINAL_WORDS = [
    { word:'밖', answer:'ㄱ' }, { word:'부엌', answer:'ㄱ' }, { word:'옷', answer:'ㄷ' }, { word:'낮', answer:'ㄷ' },
    { word:'꽃', answer:'ㄷ' }, { word:'밥', answer:'ㅂ' }, { word:'앞', answer:'ㅂ' }, { word:'손', answer:'ㄴ' },
    { word:'밤', answer:'ㅁ' }, { word:'공', answer:'ㅇ' }, { word:'말', answer:'ㄹ' },
  ];

  function setupCourseQuiz() {
    const modes = document.getElementById('courseQuizModes');
    QUIZ_MODES.forEach(mode => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `filter-chip${mode.id === currentQuizMode ? ' active' : ''}`;
      button.textContent = mode.label;
      button.onclick = () => {
        currentQuizMode = mode.id;
        modes.querySelectorAll('.filter-chip').forEach(item => item.classList.toggle('active', item === button));
        newCourseQuestion();
      };
      modes.appendChild(button);
    });
    document.getElementById('courseQuizNext').onclick = newCourseQuestion;
    document.getElementById('courseQuizReplay').onclick = () => {
      if (courseQuiz.audio) speak(courseQuiz.audio);
    };
  }

  function buildSyllableOptions(cho, jung, answer) {
    const candidates = [];
    QUIZ_CONSONANTS.forEach(c => candidates.push(composeHangul(c, jung, '')));
    QUIZ_VOWELS.forEach(v => candidates.push(composeHangul(cho, v, '')));
    return uniqueOptions(answer, candidates);
  }

  function newCourseQuestion() {
    courseQuiz.locked = false;
    courseQuiz.audio = '';
    const mode = QUIZ_MODES.find(item => item.id === currentQuizMode);
    let prompt = '';
    let answer = '';
    let options = [];
    let key = '';

    if (currentQuizMode === 'final') {
      const item = pick(FINAL_WORDS);
      prompt = `<span class="quiz-word">${item.word}</span><small>先聽單字，最後歸到哪個代表收尾音？</small>`;
      answer = item.answer;
      options = uniqueOptions(answer, ['ㄱ','ㄴ','ㄷ','ㄹ','ㅁ','ㅂ','ㅇ']);
      key = `final:${item.word}`;
      courseQuiz.audio = item.word;
    } else {
      const cho = pick(QUIZ_CONSONANTS);
      const jung = pick(QUIZ_VOWELS);
      const syllable = composeHangul(cho, jung, '');
      if (currentQuizMode === 'split') {
        prompt = `<span class="quiz-word">${syllable}</span><small>先聽音節，再拆回初聲與母音</small>`;
        answer = `${cho} ＋ ${jung}`;
        const candidates = [];
        QUIZ_CONSONANTS.forEach(consonant => candidates.push(`${consonant} ＋ ${jung}`));
        QUIZ_VOWELS.forEach(vowel => candidates.push(`${cho} ＋ ${vowel}`));
        options = uniqueOptions(answer, candidates);
        courseQuiz.audio = syllable;
      } else {
        prompt = '<span class="quiz-listen">♪</span><small>先聽，再選出正確音節</small>';
        answer = syllable;
        options = buildSyllableOptions(cho, jung, answer);
        courseQuiz.audio = syllable;
      }
      key = `${currentQuizMode}:${cho}:${jung}`;
    }

    courseQuiz.answer = answer;
    courseQuiz.key = key;
    document.getElementById('courseQuizKicker').textContent = mode.kicker;
    document.getElementById('courseQuizPrompt').innerHTML = prompt;
    document.getElementById('courseQuizReplay').hidden = !courseQuiz.audio;
    document.getElementById('courseQuizFeedback').textContent = '';
    document.getElementById('courseQuizNext').hidden = true;
    const root = document.getElementById('courseQuizOptions');
    root.innerHTML = '';
    options.forEach(option => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'course-quiz-option';
      button.textContent = option;
      button.onclick = () => answerCourseQuestion(option, button);
      root.appendChild(button);
    });
    // 每種題型都先朗讀韓文刺激，避免只靠視覺猜答案。
    if (courseQuiz.audio) speak(courseQuiz.audio);
  }

  function answerCourseQuestion(choice, button) {
    if (courseQuiz.locked) return;
    courseQuiz.locked = true;
    courseQuiz.total++;
    const correct = choice === courseQuiz.answer;
    if (correct) courseQuiz.correct++;
    else state.mistakes[courseQuiz.key] = (state.mistakes[courseQuiz.key] || 0) + 1;
    saveState();
    document.querySelectorAll('.course-quiz-option').forEach(option => {
      option.disabled = true;
      if (option.textContent === courseQuiz.answer) option.classList.add('correct');
    });
    if (!correct) button.classList.add('wrong');
    const feedback = document.getElementById('courseQuizFeedback');
    feedback.className = `course-quiz-feedback ${correct ? 'good' : 'bad'}`;
    feedback.textContent = correct ? `答對！${courseQuiz.answer}` : `這題要回到：${courseQuiz.answer}`;
    document.getElementById('courseQuizScore').textContent = `答對 ${courseQuiz.correct} ／ 共 ${courseQuiz.total} 題 · 已記錄 ${Object.keys(state.mistakes).length} 個弱點`;
    document.getElementById('courseQuizNext').hidden = false;
  }

  function initCourseV3() {
    setupPrimaryTabs();
    setupCourse();
    setupMatrix();
    setupBatchimCourse();
    setupCourseQuiz();
  }

  document.addEventListener('DOMContentLoaded', initCourseV3);
}());

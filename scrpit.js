
    const typingText = document.querySelector('.typing-text p');
    const input = document.querySelector('.wrapper .input-field');
    const time = document.querySelector('.time span b');
    const mistakes = document.querySelector('.mistake span');
    const wpm = document.querySelector('.wpm span');
    const cpm = document.querySelector('.cpm span');
    const btn = document.querySelector('button');

    document.addEventListener('keydown', () => input.focus());
    typingText.addEventListener('click', () => input.focus());
    window.onload = () => input.focus();


    let timer;
    let maxTime = 60;
    let timeLeft = maxTime;
    let charIndex = 0;
    let mistakesIndex = 0;
    let isTyping = false;

    async function loadParagraph() {
        typingText.innerHTML = 'Loading...';

        try {
            const res = await fetch(
                'https://api.quotable.io/random?minLength=80&maxLength=200'
            );
            const data = await res.json();
            const text = data.content;

            typingText.innerHTML = '';

            for (const char of text) {
                typingText.innerHTML += `<span>${char}</span>`;
            }

            typingText.querySelector('span').classList.add('active');

        } catch (error) {
            typingText.innerHTML = 'Failed to load text. Try again.';
            console.error(error);
        }
    }



    function initTyping() {
        const char = typingText.querySelectorAll('span');
        const typedChar = input.value.charAt(charIndex);

        // handle backspace
        if (input.value.length < charIndex) {
            charIndex--;

            if (char[charIndex].classList.contains('incorrect')) {
                mistakesIndex--;
                mistakes.innerText = mistakesIndex;
            }

            char[charIndex].classList.remove('correct', 'incorrect');

            char.forEach(span => span.classList.remove('active'));
            char[charIndex].classList.add('active');

            cpm.innerText = Math.max(0, charIndex - mistakesIndex);
            return;
        }

        if (charIndex < char.length && timeLeft > 0) {

            if (!isTyping) {
                timer = setInterval(initTimer, 1000);
                isTyping = true;
            }

            if (char[charIndex].innerText === typedChar) {
                char[charIndex].classList.add('correct');
            } else {
                char[charIndex].classList.add('incorrect');
                mistakesIndex++;
                mistakes.innerText = mistakesIndex;
            }

            charIndex++;
            input.value = input.value.slice(0, charIndex);

            // remove active from all characters
            char.forEach(span => span.classList.remove('active'));

            // add active to next character safely
            if (charIndex < char.length) {
                char[charIndex].classList.add('active');
            }

            cpm.innerText = Math.max(0, charIndex - mistakesIndex);

        } else {
            clearInterval(timer);
            input.blur();

        }
    }


    function initTimer() {
        if (timeLeft) {
            timeLeft--;
            time.innerText = timeLeft;
            const timeSpent = maxTime - timeLeft;
            const Wpmvl = timeSpent > 0 ? Math.round(((charIndex - mistakesIndex) / 5) / timeSpent * 60) : 0;
            wpm.innerText = Wpmvl;
        } else {
            clearInterval(timer)
        }
    }

    function reset() {
        loadParagraph();
        clearInterval(timer);
        timeLeft = maxTime;
        charIndex = 0;
        isTyping = false;
        mistakesIndex = 0;
        wpm.innerText = 0;
        cpm.innerText = 0;
        mistakes.innerText = 0;
        time.innerText = timeLeft;
        input.value = '';
    }

    input.addEventListener('input', initTyping);
    btn.addEventListener('click', reset);
    loadParagraph();
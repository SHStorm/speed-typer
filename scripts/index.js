const $word = document.getElementById('word');
const $wordInput = document.getElementById('word-input');

$wordInput.focus();
$wordInput.addEventListener('input', () => {
    validateInput();
});

nextWord();

function validateInput() {
    if (checkWord()) {
        nextWord();
    }
}

function checkWord() {
    const enteredWord = $wordInput.value;
    const requiredWord = $word.textContent;

    return enteredWord.toLowerCase() === requiredWord.toLowerCase();
}

function nextWord() {
    $wordInput.value = '';
    $word.textContent = 'loading...';

    randomWord().then(word => {
        $word.textContent = word;
    });
}

async function randomWord() {
    const response = await fetch('http://puzzle.mead.io/puzzle?wordCount=1');
    const responseBody = await response.json();

    return responseBody.puzzle.toLowerCase();
}

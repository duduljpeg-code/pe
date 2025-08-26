const correctPassword = "1234"; // Ganti dengan kata sandi yang diinginkan

function unlock() {
    const passwordInput = document.getElementById('password').value;
    if (passwordInput === correctPassword) {
        document.getElementById('lockscreen').style.display = 'none';
        document.getElementById('calculator').style.display = 'block';
    } else {
        alert('Kata sandi salah!');
    }
}

function appendToDisplay(value) {
    document.getElementById('display').value += value;
}

function clearDisplay() {
    document.getElementById('display').value = '';
}

function calculateResult() {
    const display = document.getElementById('display');
    try {
        display.value = eval(display.value);
    } catch (error) {
        display.value = 'Error';
    }
}

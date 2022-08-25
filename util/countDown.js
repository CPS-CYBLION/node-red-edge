function startCountDown(countDownTime) {
    const endTime = new Date().getTime() + countDownTime * 60000;
    const countDownInterval = setInterval(() => {
        const now = new Date().getTime();
        const distance = endTime - now;

        if (distance < 0) {
            allowImport = false;
            clearInterval(countDownInterval);
        }

    });

    return { countDownInterval, endTime };
}

function endCountDown(countDownInterval) {
    clearInterval(countDownInterval)
}

module.exports = {
    startCountDown: startCountDown,
    endCountDown: endCountDown
}
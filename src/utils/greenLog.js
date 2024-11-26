const BG_GREEN = '\x1b[42m';
const RESET = '\x1b[0m';

const greenLog = message => {
    console.log(BG_GREEN, message, RESET);
};

module.exports = greenLog;
const notAllowed = ['poo', 'the'];

module.exports = function (req, res, next) {
    const text = req.body.text;
    while (notAllowed.find(word => text.includes(word))) {
        const badWord = notAllowed.find(word => text.includes(word));
        text = text.replace(badWord, '*'.repeat(badWord.length));
    }
    next();
};
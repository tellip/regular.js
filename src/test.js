let text = require('./text');

console.log(text.patterns.LiteralCharacter(() => true).match("asdf1234", 0, 8));
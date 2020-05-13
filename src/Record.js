const type = require('./type');

module.exports = do {
    let temp, Record = type.function(
        {0: 'boolean', 1: 'number', 2: 'number', 3: temp = []},
        (success, begin, end, children) => type.implement(
            {success, begin, end, children},
            Record
        )
    );
    Record.Child = type.function({0: 'string', 1: Record}, (key, value) => type.implement(
        {key, value}, Record.Child
    ));
    temp.push(Record.Child);
    Record;
};
const type = require('./type');

module.exports = do {
    let temp, Record = type.function(
        {0: 'boolean', 1: 'number', 2: 'number', 3: [temp = {0: 'string'}]},
        (success, begin, end, children) => type.implement(
            {success, begin, end, children: children.map(([key, value]) => ({key, value}))},
            Record
        )
    );
    temp[1] = Record;
    Record;
};
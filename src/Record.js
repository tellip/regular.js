import type from './type.js';

export default do {
    let temp, Record = type.function(
        {0: 'boolean', 1: 'number', 2: 'number', 3: temp = []},
        (success, begin, end, children) => type.implement(
            {success, begin, end, children},
            Record
        )
    );
    Record.Child = do {
        let callback = (key, value) => type.implement(
            {key, value}, Record.Child
        );
        type.overload(
            [{0: 'string', 1: Record}, callback],
            [{0: 'symbol', 1: Record}, callback]
        );
    };
    temp.push(Record.Child);
    Record;
};
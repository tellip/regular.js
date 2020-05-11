const type = require('./type');

module.exports = do {
    let Record = do {
        let child_pattern;
        let Record = type.function(
            {0: 'boolean', 1: 'number', 2: 'number', 3: [child_pattern = {0: 'string'}]},
            (success, begin, end, children) => do {
                let record = {success, begin, end, children: children.map(([key, value]) => ({key, value}))};
                record.__proto__ = Record.prototype;
                record;
            }
        );
        child_pattern[1] = Record;
        Record;
    };
    // let Pattern = match => do {
    //     let Pattern1 = data => do {
    //         let pattern = {match: (...args) => match(data, ...args)};
    //         pattern.__proto__ = Pattern1.prototype;
    //         pattern;
    //     };
    //     Pattern1.__proto__ = Pattern.prototype;
    //     Pattern1;
    // };
    // let patterns = {
    //     EmptyString: Pattern((null_, string, head) => Record(true, head, head)),
    //     LiteralCharacter: Pattern(
    //         Pattern.types.LITERAL_CHARACTER,
    //         (describe, string, head, tail) => head === tail
    //             ? Record(false, head, head, [])
    //             : Record(describe(string[head]), head, head + 1, [])
    //     ),
    //     Alternation: Pattern(
    //         Pattern.types.ALTERNATION,
    //         ([first, second], ...args) => do {
    //             let record = first.match(...args);
    //             record.success || (record = second.match(...args));
    //             record;
    //         }
    //     )
    // };
    // let aliases = {
    //     po: Pattern.insts.EmptyString()
    // };
    // aliases.pca = aliases.pc();
    ({Record});
};
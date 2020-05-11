module.exports = do {
    let Record = (success, begin, end, children = []) => ({success, begin, end, children});
    let Pattern = (TYPE, match) => data => do {
        ({[TYPE]: data, match: (...args) => match(data, ...args)});
    };
    Pattern.types = {
        EMPTY_STRING: Symbol(),
        LITERAL_CHARACTER: Symbol(),
        ALTERNATION: Symbol()
    };
    Pattern.insts = {
        EmptyString: Pattern(
            Pattern.types.EMPTY_STRING,
            (null_, string, head) => Record(true, head, head, [])
        ),
        LiteralCharacter: Pattern(
            Pattern.types.LITERAL_CHARACTER,
            (describe, string, head, tail) => head === tail
                ? Record(false, head, head, [])
                : Record(describe(string[head]), head, head + 1, [])
        ),
        Alternation: Pattern(
            Pattern.types.ALTERNATION,
            ([first, second], ...args) => do {
                let record = first.match(...args);
                record.success || (record = second.match(...args));
                record;
            }
        )
    };
    let aliases = {
        po: Pattern.insts.EmptyString(),
        pc: (...args) => Pattern.insts.LiteralCharacter(args.length === 0 ? () => true : do {
            let first = args[0];
            args.length === 1 ? (
                first.constructor.name === 'Function' ?
                    first :
                    first.constructor.name === 'String' ?
                        c => Array.from(first).some(c1 => c1 === c) :
                        first.constructor.name === 'Array' ?
                            c => first.some(c1 => c1 === c) :
                            () => false
            ) : do {
                let second = args[1];
                args.length === 2 ? null : null
            }
        }),
    };
    aliases.pca = aliases.pc();
    aliases;
};
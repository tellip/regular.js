module.exports = do {
    let Pattern = (construct, match) => (...args) => do {
        let data = construct(...args);
        ({match: (...args) => match(data, ...args)});
    };
    let Record = (success, begin, end, children = []) => ({success, begin, end, children});
    let patterns = {
        EmptyString: Pattern(
            () => null,
            (null_, string, head, tail) => Record(true, head, head, [])
        ),
        LiteralCharacter: Pattern(
            describe => describe,
            (describe, string, head, tail) => head === tail
                ? Record(false, head, head, [])
                : Record(describe(string[head]), head, head + 1, [])
        ),
        Alternation: Pattern(
            (first, second) => [first, second],
            ([first, second], ...args) => do {
                let record = first.match(...args);
                record.success || (record = second.match(...args));
                record;
            }
        )
    };
    let aliases = {
        po: patterns.EmptyString(),
        pc: (...args) => ({
            0: () => patterns.LiteralCharacter(() => true)
        })[args.length]()
    };
    aliases.pca = aliases.pc();
    ({patterns, aliases});
};
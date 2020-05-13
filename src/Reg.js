const type = require('./type');
const Record = require('./Record');

module.exports = do {
    let LOCK = Symbol();
    let callback = Character => type.implement(
        do {
            let String_ = type.inherit(
                type.function({0: [Character]}, array => type.implement(
                    array, String_
                )),
                Array
            );

            let Pattern = type.function({0: 'function'}, match => type.implement(
                {match: type.function({0: String_, 1: 'number', 2: 'number'}, match)},
                Pattern
            ));

            Pattern.deriveds = do {
                let EmptyString = type.inherit(
                    type.function({}, () => type.implement(
                        Pattern((string, head) => new Record(true, head, head, [])),
                        EmptyString
                    )),
                    Pattern
                );
                let LiteralCharacter = type.inherit(
                    type.function({0: 'function'}, describe => type.implement(
                        Object.assign(Pattern((string, head, tail) =>
                            head === tail ?
                                new Record(false, head, head, []) :
                                new Record(describe(string[head]), head, head + 1, [])
                        ), {
                            describe: type.function({0: 'symbol'}, KEY => KEY === LOCK && describe),
                        }),
                        LiteralCharacter
                    )),
                    Pattern
                );
                let Alternation = type.inherit(
                    type.function([Pattern], (...range) => type.implement(
                        Pattern((string, head, tail) => do {
                            let end = head, children = [];
                            new Record(range.some(p => do {
                                let r = p.match(string, head, tail);
                                end = r.end;
                                children = r.children;
                                r.success;
                            }), head, end, children);
                        }),
                        Alternation
                    )),
                    Pattern
                );
                let Concatenation = type.inherit(
                    type.function([Pattern], (...splice) => type.implement(
                        Pattern((string, head, tail) => do {
                            let end = head, children = [];
                            new Record(splice.every(p => do {
                                let r = p.match(string, end, tail);
                                end = r.end;
                                children.splice(children.length, 0, ...r.children);
                                r.success;
                            }), head, end, children);
                        }),
                        Concatenation
                    )),
                    Pattern
                );
                let KleeneStar = type.inherit(
                    type.function({0: Pattern}, value => type.implement(
                        Pattern((string, head, tail) => do {
                            let end = head, children = [];
                            while (do {
                                let r = value.match(string, end, tail);
                                r.success && r.end > end ? do {
                                    end = r.end;
                                    children.splice(children.length, 0, ...r.children);
                                } : false;
                            }) null;
                            new Record(true, head, end, children);
                        }),
                        KleeneStar
                    )),
                    Pattern
                );
                let Mark = type.inherit(
                    type.function({0: 'string', 1: Pattern}, (key, value) => type.implement(
                        Pattern((...args) => do {
                            let r = value.match(...args);
                            let {success, begin, end} = r;
                            new Record(success, begin, end, [[key, r]]);
                        }),
                        Mark
                    )),
                    Pattern
                );
                let Placeholder = type.inherit(
                    type.function({}, () => type.implement(
                        do {
                            let place = null;
                            Object.assign(Pattern((...args) => place ? place.match(...args) : null), {
                                place: type.function({0: Pattern}, value => place = value)
                            });
                        },
                        Placeholder
                    )),
                    Pattern
                );
                ({EmptyString, LiteralCharacter, Alternation, Concatenation, KleeneStar, Mark, Placeholder});
            };

            let aliases = {
                po: new Pattern.deriveds.EmptyString(),
                pc: type.overload(
                    [{0: 'function'}, describe => new Pattern.deriveds.LiteralCharacter(describe)],
                    [[Pattern.deriveds.LiteralCharacter], (...range) => new Pattern.deriveds.LiteralCharacter(c =>
                        range.some(p => p.describe(LOCK)(c))
                    )],
                    [{
                        0: Pattern.deriveds.LiteralCharacter,
                        1: 'boolean',
                        2: Pattern.deriveds.LiteralCharacter
                    }, (first, sign, second) => new Pattern.deriveds.LiteralCharacter(c =>
                        first.describe(LOCK)(c) ? !(sign ^ second.describe(LOCK)(c)) : false
                    )]
                ),
                pla: type.function([Pattern], (...range) => new Pattern.deriveds.Alternation(...range)),
                plc: type.function([Pattern], (...splice) => new Pattern.deriveds.Concatenation(...splice)),
                pk: type.function({0: Pattern}, value => new Pattern.deriveds.KleeneStar(value)),
                pm: type.overload(
                    [{0: 'string', 1: Pattern}, (key, value) => new Pattern.deriveds.Mark(key, value)],
                    [{0: Pattern}, value => new Pattern.deriveds.Mark('', value)]
                ),
                pp: () => new Pattern.deriveds.Placeholder()
            };
            aliases.pc_any = aliases.pc(() => true);
            aliases.p_zo = type.function({0: Pattern}, one => aliases.pla(one, aliases.po));
            aliases.p_om = type.function({0: Pattern}, one => aliases.plc(one, aliases.pk(one)));

            ({String: String_, Pattern, aliases});
        },
        module.exports
    );
    type.overload([{0: 'string'}, callback], [{0: 'function'}, callback]);
};
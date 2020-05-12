const type = require('./type');
const {implement, inherit} = require('./proto');

module.exports = do {
    let Record = do {
        let temp, Record = type.function(
            {0: 'boolean', 1: 'number', 2: 'number', 3: [temp = {0: 'string'}]},
            (success, begin, end, children) => implement(
                {success, begin, end, children: children.map(([key, value]) => ({key, value}))},
                Record
            )
        );
        temp[1] = Record;
        Record;
    };
    let Pattern = type.function({1: 'function'}, (data, match) => implement({
            data,
            match: type.function(
                {0: 'string', 1: 'number', 2: 'number'},
                (string, head, tail) => match(data, string, head, tail)
            )
        }, Pattern)
    );
    Pattern.deriveds = do {
        let EmptyString = inherit(
            type.function({}, () => implement(
                Pattern(null, (null_, string, head) => Record(true, head, head, [])),
                EmptyString
            )),
            Pattern
        );
        let LiteralCharacter = inherit(
            type.function({0: 'function'}, describe => implement(
                Pattern(describe, (describe, string, head, tail) =>
                    head === tail ?
                        Record(false, head, head, []) :
                        Record(describe(string[head]), head, head + 1, [])
                ),
                LiteralCharacter
            )),
            Pattern
        );

        ({EmptyString, LiteralCharacter});
    };
    let aliases = do {
        let po = Pattern.deriveds.EmptyString();
        let pc = type.overload(
            [{0: 'function'}, describe => Pattern.deriveds.LiteralCharacter(describe)],
            [{0: 'string'}, string => Pattern.deriveds.LiteralCharacter(c =>
                Array.from(string).some(c1 => c1 === c)
            )],
            [{0: 'number', 1: 'number'}, (inf, sup) => Pattern.deriveds.LiteralCharacter(c => do {
                let code = c.charCodeAt(0);
                inf <= code && code <= sup;
            })],
            [[Pattern.deriveds.LiteralCharacter], (...range) => Pattern.deriveds.LiteralCharacter(c =>
                range.some(p => p.data(c))
            )],
            [
                {0: Pattern.deriveds.LiteralCharacter, 1: 'boolean', 2: Pattern.deriveds.LiteralCharacter},
                (first, sign, second) => Pattern.deriveds.LiteralCharacter(c =>
                    first.data(c) ? !(sign ^ second.data(c)) : false
                )
            ]
        );
        let pca = pc(() => true);
        let pc_ascii = pc(0x00, 0x7F);
        let pc_lower = pc('a'.charCodeAt(0), 'z'.charCodeAt(0));
        let pc_upper = pc('A'.charCodeAt(0), 'Z'.charCodeAt(0));
        let pc_alpha = pc(pc_lower, pc_upper);
        let pc_digit = pc('0'.charCodeAt(0), '9'.charCodeAt(0));
        let pc_alnum = pc(pc_alpha, pc_digit);
        let pc_blank = pc(' \t');
        let pc_space = pc(' \t\r\n\v\f');
        let pc_cntrl = pc(pc(0x00, 0x1F), pc(String.fromCharCode(0x7F)));
        let pc_graph = pc(0x21, 0x7E);
        let pc_print = pc(0x20, 0x7E);
        let pc_punct = pc('[]!\"#$%&\'()*+,./:;<=>?@\\^_`{|}~-');
        let pc_xdigit = pc(
            pc('A'.charCodeAt(0), 'F'.charCodeAt(0)),
            pc('a'.charCodeAt(0), 'f'.charCodeAt(0)),
            pc('0'.charCodeAt(0), '9'.charCodeAt(0))
        );
        ({
            po, pc, pca,
            pc_ascii, pc_lower, pc_upper, pc_alpha, pc_digit, pc_alnum,
            pc_blank, pc_space, pc_cntrl, pc_graph, pc_print, pc_punct, pc_xdigit
        });
    };
    ({Record, Pattern, aliases});
};
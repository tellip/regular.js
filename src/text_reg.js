import type from './type.js';
import Reg from './Reg.js';

export default do {
    let text_reg = new Reg('number');
    let {Pattern, aliases} = text_reg;

    aliases.pc = type.overload(
        [{0: 'string'}, string => Pattern.deriveds.LiteralCharacter(c =>
            Array.from(string).some(ch => ch.charCodeAt(0) === c)
        )],
        [{0: 'number', 1: 'number'}, (inf, sup) => Pattern.deriveds.LiteralCharacter(c =>
            inf <= c && c <= sup
        )],
        [{0: 'number'}, code => Pattern.deriveds.LiteralCharacter(c => c === code)],
        [{}, aliases.pc]
    );

    aliases.pc_ascii = aliases.pc(0x00, 0x7F);
    aliases.pc_lower = aliases.pc('a'.charCodeAt(0), 'z'.charCodeAt(0));
    aliases.pc_upper = aliases.pc('A'.charCodeAt(0), 'Z'.charCodeAt(0));
    aliases.pc_alpha = aliases.pc(aliases.pc_lower, aliases.pc_upper);
    aliases.pc_digit = aliases.pc('0'.charCodeAt(0), '9'.charCodeAt(0));
    aliases.pc_alnum = aliases.pc(aliases.pc_alpha, aliases.pc_digit);
    aliases.pc_blank = aliases.pc(' \t');
    aliases.pc_space = aliases.pc(' \t\r\n\v\f');
    aliases.pc_cntrl = aliases.pc(aliases.pc(0x00, 0x1F), aliases.pc(0x7F));
    aliases.pc_graph = aliases.pc(0x21, 0x7E);
    aliases.pc_print = aliases.pc(0x20, 0x7E);
    aliases.pc_punct = aliases.pc('[]!\"#$%&\'()*+,./:;<=>?@\\^_`{|}~-');
    aliases.pc_xdigit = aliases.pc(
        aliases.pc('A'.charCodeAt(0), 'F'.charCodeAt(0)),
        aliases.pc('a'.charCodeAt(0), 'f'.charCodeAt(0)),
        aliases.pc('0'.charCodeAt(0), '9'.charCodeAt(0))
    );

    let {String: String_} = text_reg;
    text_reg.String = type.inherit(
        type.function({0: 'string'}, string => type.implement(
            String_(Array.from(string).map(ch => ch.charCodeAt(0))),
            text_reg.String
        )),
        String_
    );

    text_reg;
};
module.exports = do {
    let check = (pattern, data) => pattern === null ? data === null : ({
        string: () => typeof data === pattern,
        function: () => data instanceof pattern || data.constructor === pattern,
        object: () => ({
            Array: () => data.every(sub_data => pattern.some(sub_pattern => check(sub_pattern, sub_data))),
            Object: () => Reflect.ownKeys(pattern).every(key => check(pattern[key], data[key]))
        })[pattern.constructor.name]()
    })[typeof pattern]();

    let switch_ = (value, ...branches) => do {
        let rtn;
        branches.some(([pattern, callback]) => check(pattern, value) && do {
            rtn = callback();
            true;
        });
        rtn;
    };

    let overload = (...rules) => do {
        let f = function (...args) {
            return switch_(args, ...f.rules.map(
                ([pattern, callback]) => [pattern, () => callback(...args)]
            ));
        };
        Object.defineProperty(f, 'rules', {
            get() {
                return rules;
            }
        });
        f;
    };

    let function_ = (pattern, callback) => do {
        let f = overload([pattern, callback]);
        Object.defineProperty(f, 'rule', {
            get() {
                return f.rules[0];
            }
        });
        f;
    };

    ({check, switch: switch_, overload, function: function_});
};
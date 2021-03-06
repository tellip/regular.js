export default do {
    let implement = (data, Constructor) => do {
        data.__proto__ = Constructor.prototype;
        data;
    };

    let inherit = (Derived, Base) => do {
        Derived.prototype.__proto__ = Base.prototype;
        Derived;
    };

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
        let defaultCallback = branches.pop();
        branches.some(([pattern, callback]) => check(pattern, value) && do {
            rtn = callback();
            true;
        }) || defaultCallback();
        rtn;
    };

    let overload = (...rules) => function (...args) {
        return switch_(args, ...rules.map(
            ([pattern, callback]) => [pattern, () => callback(...args)]
        ), () => {
            throw new Error('invalid arguments: ' + args)
        });
    };

    let function_ = (pattern, callback) => overload([pattern, callback]);

    ({implement, inherit, check, switch: switch_, overload, function: function_});
};
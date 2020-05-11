module.exports = do {
    let check = (pattern, data) => pattern === null ? data === null : ({
        string: () => typeof data === pattern,
        function: () => Object(data) instanceof pattern,
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

    let overload = (...polys) => (...args) => switch_(args, ...polys.map(
        ([pattern, callback]) => [pattern, () => callback(...args)]
    ));

    ({check, switch: switch_, overload});
};
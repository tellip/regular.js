module.exports = do {
    let check = (pattern, data) => pattern === null ? data === null : ({
        string: () => typeof data === pattern,
        function: () => data instanceof pattern,
        object: () => ({
            Array: () => data.every(sub_data => pattern.some(sub_pattern => check(sub_pattern, sub_data))),
            Object: () => Reflect.ownKeys(pattern).every(key => check(pattern[key], data[key]))
        })[pattern.constructor.name]()
    })[typeof pattern]();

    check.switch = (value, ...branches) => do {
        let rtn;
        branches.some(([pattern, callback]) => check(pattern, value) && do {
            rtn = callback();
            true;
        });
        rtn;
    };

    check.overload = (...polys) => (...args) => check.switch(args, ...polys.map(
        ([[...pattern], callback]) => [pattern, () => callback(...args)]
    ));

    check;
};
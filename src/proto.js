module.exports = do {
    let implement = (data, Constructor) => do {
        data.__proto__ = Constructor.prototype;
        data;
    };

    let inherit = (Derived, Base) => do {
        Derived.prototype.__proto__ = Base.prototype;
        Derived;
    };

    ({implement, inherit});
};
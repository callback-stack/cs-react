const cbs = (...services) => {
    return cbs1(services, {});
};
exports.cbs = cbs;

const cbs1 = (services, stack) => {
    const [first, ...last] = services;
    const [name, fn] = Array.isArray(first) ? first : [null, first];

    return fn(
        stack,
        !last.length ? null : (
            (ret) => cbs1(last, name != null ? {...stack, [name]: ret} : stack)
        )
    );
};

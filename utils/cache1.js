const cache1 = (fn) => {
    let cache = {};

    return (key) => {
        if (!cache.hasOwnProperty(key)) {
            cache[key] = fn(key);
        }
        return cache[key];
    };
};

exports.cache1 = cache1;
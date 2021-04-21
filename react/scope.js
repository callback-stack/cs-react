const {getPath, setPath, changePath} = require("../utils/arr-path");

const scope = (state, path) => ({
    value: getPath(state.value, path),
    onChange: (v, cb) => {
        if (state.change) {
            state.change((s1) => setPath(s1, path, v), cb);
        } else {
            state.onChange(setPath(state.value, path, v), cb);
        }
    },
    change: (reduce, cb) => {
        if (state.change) {
            state.change(
                (v) => changePath(v, path, reduce),
                cb,
            );
        } else {
            state.onChange(changePath(state.value, path, reduce), cb);
        }
    },
});
exports.scope = scope;

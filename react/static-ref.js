const {Static} = require("./static");

const StaticRef = ({getInitValue, next}) => Static({
    createValue: () => {
        let value = getInitValue ? getInitValue() : undefined;
        return ({
            get: () => value,
            set: (v) => value = v,
        });
    },
    next,
});
exports.StaticRef = StaticRef;

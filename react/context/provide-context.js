const {getContext} = require("./context-keys");
const {createElement: h} = require("react");

const provideContext = (key, value, next) => (
    h(getContext(key).Provider, {value}, next(value))
);
exports.provideContext = provideContext;



const {getContext} = require("./context-keys");
const {createElement: h} = require("react");

const consumeContext = (name) =>
    [name, (_, next) => h(getContext(name).Consumer, {}, next)]
;
exports.consumeContext = consumeContext;
exports.consumeContext1 = consumeContext;


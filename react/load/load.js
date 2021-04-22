const {Load2} = require("./load2");
const {cbs} = require("../../callback-stack");

const Load = ({fetch, next, props, _key}) => cbs(
    ["load2", ({}, next) => Load2({
        fetch, next, _key, props,
    })],
    ({load2}) => next && next(load2.value),
);
exports.Load = Load;
exports.Load1 = Load;

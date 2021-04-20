const {createElement: h, Fragment} = require("react");

const fragments = (...args) => h(Fragment, {},
    ...args,
);
exports.fragments = fragments;

const fragments2 = (elements) => h(Fragment, {},
    ...elements,
);
exports.fragments2 = fragments2;

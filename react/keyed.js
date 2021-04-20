const {createElement: h, Fragment} = require("react");

const keyed = (key) => (_, next) => keyed1({key, next});
exports.keyed = keyed;

const keyed1 = ({key, next}) => (
    h(Fragment, {key},
        next()
    )
);
exports.keyed1 = keyed1;

const {createContext} = require("react");
const {cache1} = require("../../utils/cache1");

const getContext = cache1(() => createContext(null));
exports.getContext = getContext;
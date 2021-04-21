const {Component, createElement: h} = require("react");

const IgnoreUpdate = ({next, onRender, disabled}) => h(IgnoreUpdate1, {next, onRender, disabled});
exports.IgnoreUpdate = IgnoreUpdate;

class IgnoreUpdate1 extends Component {

    shouldComponentUpdate(nextProps, nextState) {
        return !!nextProps.disabled;
    }

    render() {
        const {next, onRender} = this.props;
        onRender && onRender();
        return next ? next() : null;
    }
}

const React = require("react");
const {createElement: h} = require("react");

const OnUnmounted = ({action, props, next}) => h(OnUnmounted1, {action, props, next});
exports.OnUnmounted = OnUnmounted;

class OnUnmounted1 extends React.Component {
    componentWillUnmount() {
        this.props.action({
            getLatestProps: () => this.props.props,
        });
    }

    render() {
        const {next} = this.props;
        return next ? next() : null;
    }
}
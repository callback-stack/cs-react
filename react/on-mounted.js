const {Component, createElement: h} = require("react");

const OnMounted = ({action, props, next}) => h(OnMounted1, {action, props, next});
exports.OnMounted = OnMounted;

class OnMounted1 extends Component {
    componentDidMount() {
        this.props.action({
            getLatestProps: () => this.props.props,
            isMounted: () => !this.unmounted,
        });
    }

    componentWillUnmount() {
        this.unmounted = true;
    }

    render() {
        const {next} = this.props;
        return next ? next() : null;
    }
}
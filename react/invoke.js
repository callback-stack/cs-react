const {Component, createElement: h} = require("react");

const Invoke = ({action, props, onMounted, next}) => h(Invoke1, {action, props, onMounted, next});
exports.Invoke = Invoke;

class Invoke1 extends Component {
    constructor(props, context) {
        super(props, context);

        props.action && props.action({
            getLatestProps: () => this.props.props,
            isMounted: () => this.mounted && !this.unmounted,
        });
    }

    componentDidMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        this.unmounted = true;
    }

    render() {
        const {next} = this.props;
        return next?.() ?? null;
    }
}
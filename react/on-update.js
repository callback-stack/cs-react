const React = require("react");

const OnUpdate = ({fn, action, props, next}) => React.createElement(OnUpdate1, {action: action ?? fn, props, next});
exports.OnUpdate = OnUpdate;


class OnUpdate1 extends React.Component {

    componentDidUpdate(prevProps) {
        this.props.action({prevProps: prevProps.props});
    }

    render() {
        const {next} = this.props;

        return next?.() ?? null;
    }
}

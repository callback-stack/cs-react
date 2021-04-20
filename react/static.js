const {createElement: h, Component} = require("react");

const Static = ({createValue, props, next}) => h(Static1, {createValue, props, next});
exports.Static = Static;

class Static1 extends Component {

    constructor(props, context) {
        super(props, context);

        this.value = props.createValue({
            getLatestProps: () => this.props.props,
        });
    }
    render() {
        const {next} = this.props;

        return next(this.value);
    }
}

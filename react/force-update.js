const {Component, createElement: h} = require("react");

const ForceUpdate = ({next}) => h(ForceUpdate1, {next});
exports.ForceUpdate = ForceUpdate;
exports.ForceUpdate1 = ForceUpdate;

class ForceUpdate1 extends Component {

    render() {
        const {next} = this.props;

        return next({
            // invoke: (cb) => this.forceUpdate(cb),
            invoke: (cb) => {
                setTimeout(
                    () => this.forceUpdate(cb),
                    0,
                )
            },
        });
    }
}
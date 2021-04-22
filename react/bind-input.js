const bindInput = ({value, onChange}) => ({
    value: value || "",
    onChange: (e) => onChange(e.target.value),
});
exports.bindInput = bindInput;

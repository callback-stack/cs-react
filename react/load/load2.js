const {fragments} = require("../fragments");
const {keyed} = require("../keyed");
const {scope} = require("../scope");
const {cs} = require("../../callback-stack");
const {State} = require("../state");
const {Invoke} = require("../invoke");

const Load2 = ({fetch, next, keepOutdatedValue, props, _key}) => cs(
    ["loaded", (_, next) => State({next})],
    ({loaded}) => {
        const loading = loaded.value == null || loaded.value.key !== _key;

        return fragments(
            loading && cs(
                keyed(_key),
                () => (
                    Invoke({
                        props,
                        fn: async ({isMounted, getLatestProps}) => {
                            const value = await fetch({getLatestProps});
                            if (!isMounted() && loaded.value) {
                                return;
                            }
                            loaded.onChange({value, key: _key});
                        },
                    })
                )
            ),

            next && next({
                loading,
                ...scope(loaded, ["value"]),
                value: !loaded.value || _key !== loaded.value.key && !keepOutdatedValue ? undefined : loaded.value.value,
                // value: loading && !keepOutdatedValue ? undefined : loaded.value.value,
                reload: async () => {
                    const value = await fetch();
                    loaded.onChange({value, key: _key});
                },
            }),
        );
    },
);
exports.Load2 = Load2;

const {arrEquals} = require("../utils/collections");
const {OnUpdate} = require("./on-update");
const {OnUnmounted} = require("./on-unmounted");
const {Invoke} = require("./invoke");
const {StaticRef} = require("./static-ref");
const {cs} = require("../callback-stack");
const {fragments} = require("./fragments");

const Effect = ({action, watches}) => cs(
    ["cleanup", (_, next) => StaticRef({next})],
    ({cleanup}) => fragments(
        Invoke({
            action: () => {
                cleanup.set(action());
            },
        }),
        OnUpdate({
            props: watches,
            action: ({prevProps}) => {
                if (!arrEquals(prevProps, watches)) {
                    cleanup.get()?.();
                    cleanup.set(action());
                }
            },
        }),
        OnUnmounted({
            action: () => {
                cleanup.get()?.();
            },
        }),
    ),
);
exports.Effect = Effect;

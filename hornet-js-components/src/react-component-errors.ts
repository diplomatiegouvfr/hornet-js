"use strict";

import utils = require("hornet-js-utils");
var logger = utils.getLogger("hornet-js-components.react-component-errors");

/**
 * Configuration that allows overriding default behavior.
 * @type {Object}
 */
export var config = {
    /**
     * If enabled=false then this essentially disables the try/catch monkey-patch
     * @type {Boolean}
     */
    enabled: true,

    /**
     * Currently thif is configured to console.error a useful message if one of you
     * Component lifecycle methos throws an error. You can override the implementation
     * to integrate with you'r eown error logging.
     * @param  {[Object]} errorReport The report metadata including component, method, error thrown.
     * @return {[void]}
     */
    errorHandler: function errorHandler(errorReport) {

        logger.error("Error|" + errorReport.component + "|" + errorReport.method + "(" + (errorReport.arguments ? "..." : "") + ")| "
            + errorReport.error, JSON.stringify(errorReport));
    }
};


/**
 * Implementation of the try/catch wrapper
 * @param  {[React.Component]} component The ES6 React.Component.prototype that contains the React lifecycle method.
 * @param  {[string]} method             The name of the method to wrap ex: "render"
 * @return {[React.Component]}           Returns the same React.Component.prototype method monkey-patched with the specified method wrapped with a try/catch
 */
var wrapWithTryCatch = function wrapWithTryCatch(component, method) {
    var unsafe = component[method];

    component[method] = function () {
        if (!config.enabled) {
            return;
        }
        try {
            return unsafe.apply(this, arguments);
        } catch (err) {
            var errorReport = {
                component: component.constructor.name,
                method: method,
                props: this.props,
                error: err,
                arguments: null
            };
            if (arguments.length > 0) {
                errorReport.arguments = arguments;
            }
            config.errorHandler(errorReport);
        }
        return null;
    };
};

/**
 * Wraps each React.Component lifecycle method with a try/catch that enables easier development diagnostics of errors throwin within each method
 * Methods wrapped include: `render, componentWillMount, componentDidMount, componentWillReceiveProps, shouldComponentUpdate, componentWillUpdate, componentDidUpdate, componentWillUnmount`
 * @param  {[React.Component]} ComponentConstructor The React.Component you want to wrap lifecycle methods with a try/catch and error handler.
 * @return {[void]}                      [description]
 */
export default function (ComponentConstructor) {
    [
        "render",
        "componentWillMount",
        "componentDidMount",
        "componentWillReceiveProps",
        "shouldComponentUpdate",
        "componentWillUpdate",
        "componentDidUpdate",
        "componentWillUnmount"
    ].forEach(function (method) {
        if (ComponentConstructor.prototype[method]) {
            wrapWithTryCatch(ComponentConstructor.prototype, method);
        }
    });
};


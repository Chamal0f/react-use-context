"use strict";
exports.__esModule = true;
exports.createContext = void 0;
var React = require("react");
var createContext = function (context) {
    var StateContext = React.createContext(undefined);
    var functions = Object.keys(context.actions);
    var Reducer = function (state, action) {
        var _a, _b;
        if (functions.includes(action.type) && context.actions[action.type]) {
            return ((_b = (_a = context.actions)[action.type]) === null || _b === void 0 ? void 0 : _b.call(_a, state, action.payload)) || state;
        }
        return state;
    };
    var Provider = function (_a) {
        var children = _a.children;
        var _b = React.useReducer(Reducer, context.initialState), state = _b[0], dispatch = _b[1];
        var value = { state: state, dispatch: dispatch };
        return (<StateContext.Provider value={value}>
                {children}
            </StateContext.Provider>);
    };
    var useStore = function (selector) {
        var context = React.useContext(StateContext);
        if (context === undefined) {
            throw new Error('useContextMenu must be used within a Provider');
        }
        return selector(context.state);
    };
    var useActions = function () {
        var _a;
        var contextRes = React.useContext(StateContext);
        if (contextRes === undefined) {
            throw new Error('useContextMenu must be used within a Provider');
        }
        var resUseAction = {};
        var _loop_1 = function (i) {
            var _b = Object.entries(context.actions)[i], key = _b[0], action = _b[1];
            resUseAction[key] = function (payload) {
                contextRes.dispatch({
                    type: key,
                    payload: payload
                });
            };
        };
        for (var i = 0; i < ((_a = Object.keys(context.actions)) === null || _a === void 0 ? void 0 : _a.length); i++) {
            _loop_1(i);
        }
        return resUseAction;
    };
    return { Provider: Provider, useStore: useStore, useActions: useActions };
};
exports.createContext = createContext;

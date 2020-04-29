"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
var ActionTypes;
(function (ActionTypes) {
    ActionTypes["Push"] = "push";
    ActionTypes["Pop"] = "pop";
})(ActionTypes || (ActionTypes = {}));
function stackItem(screen, params) {
    return {
        ScreenComponent: screen,
        params
    };
}
function navigationReducer(state = [], action) {
    switch (action.type) {
        case ActionTypes.Push:
            const pushAction = action;
            return state.concat(stackItem(pushAction.screen, pushAction.params));
        case ActionTypes.Pop:
            if (state.length == 1) {
                return state;
            }
            const newState = state.map(s => s);
            newState.pop();
            return newState;
        default:
            return state;
    }
}
function navigateTo(screen, params = {}) {
    return {
        type: ActionTypes.Push,
        screen,
        params
    };
}
;
function navigateBack() {
    return {
        type: ActionTypes.Pop
    };
}
;
function getCurrentScreen(stack) {
    return stack[stack.length - 1];
}
function defaultMiddleware(action, next) {
    return next(action);
}
function useNavigation(initialScreen, initialScreenParams, middleware) {
    const [navStack, navDispatch] = react_1.default.useReducer(navigationReducer, [stackItem(initialScreen, initialScreenParams)]);
    const typedNavStack = navStack;
    const currentScreen = getCurrentScreen(typedNavStack);
    var resolvedMiddleware = defaultMiddleware;
    if (middleware) {
        resolvedMiddleware = middleware;
    }
    return {
        currentScreen,
        navStack: typedNavStack,
        navigateTo: (screen, params) => resolvedMiddleware(navigateTo(screen, params), navDispatch),
        navigateBack: () => resolvedMiddleware(navigateBack(), navDispatch)
    };
}
exports.useNavigation = useNavigation;

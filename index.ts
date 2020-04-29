import React from 'react';

interface StackItem {
    ScreenComponent: React.Component,
    params: object
}

interface PushAction {
    type: ActionTypes,
    screen: React.Component,
    params: object,
}

interface PopAction {
    type: ActionTypes
}

enum ActionTypes {
    Push = 'push',
    Pop = 'pop'
}

function stackItem(screen: React.Component, params: object): StackItem {
    return {
        ScreenComponent: screen,
        params
    };
}

function navigationReducer(state: Array<object> = [], action: PushAction | PopAction) {
    switch (action.type) {
        case ActionTypes.Push:
            const pushAction = (<PushAction>action);
            return state.concat(stackItem(pushAction.screen, pushAction.params))
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

function navigateTo(screen: React.Component, params: object = {}) : PushAction {
    return {
        type: ActionTypes.Push,
        screen,
        params
    };
};

function navigateBack() : PopAction {
    return {
        type: ActionTypes.Pop
    };
};

function getCurrentScreen(stack: Array<StackItem>) {
    return stack[stack.length - 1];
}

function defaultMiddleware(action: PushAction | PopAction, next: Function) {
    return next(action);
}

export function useNavigation(initialScreen: React.Component, initialScreenParams: object, middleware: (action: PushAction | PopAction, next: Function) => any) {
    const [navStack, navDispatch] = React.useReducer(navigationReducer, [stackItem(initialScreen, initialScreenParams)]);

    const typedNavStack = <Array<StackItem>> navStack;

    const currentScreen = getCurrentScreen(typedNavStack);

    var resolvedMiddleware = defaultMiddleware;

    if (middleware) {
        resolvedMiddleware = middleware;
    }

    return {
        currentScreen,
        navStack: typedNavStack,
        navigateTo: (screen: React.Component, params: object) => resolvedMiddleware(navigateTo(screen, params), navDispatch),
        navigateBack: () => resolvedMiddleware(navigateBack(), navDispatch)
    };
}
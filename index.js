import React from 'react';

function stackItem(screen, params) {
    return {
        ScreenComponent: screen,
        params
    };
}

function navigationReducer(state = [], action = {}) {
    switch (action.type) {
        case 'push':
            return state.concat(stackItem(action.screen, action.params))
        case 'pop':
            const newState = state.map(s => s);
            newState.pop();

            return newState;
        default:
            return state;
    }
}

function navigateTo(screen, params = {}) {
    return {
        type: 'push',
        screen,
        params
    };
};

function navigateBack() {
    return {
        type: 'pop'
    };
};

function getCurrentScreen(stack) {
    return stack[stack.length - 1];
}

export function useNavigation(initialScreen, initialScreenParams) {
    const [navStack, navDispatch] = React.useReducer(navigationReducer, [stackItem(initialScreen, initialScreenParams)]);

    const currentScreen = getCurrentScreen(navStack);

    return {
        currentScreen,
        navStack,
        navigateTo: (screen, params) => navDispatch(navigateTo(screen, params)),
        navigateBack: () => navDispatch(navigateBack())
    };
}
import React from 'react';
interface StackItem {
    ScreenComponent: React.Component;
    params: object;
}
interface PushAction {
    type: ActionTypes;
    screen: React.Component;
    params: object;
}
interface PopAction {
    type: ActionTypes;
}
declare enum ActionTypes {
    Push = "push",
    Pop = "pop"
}
export declare function useNavigation(initialScreen: React.Component, initialScreenParams: object, middleware: (action: PushAction | PopAction, next: Function) => any): {
    currentScreen: StackItem;
    navStack: StackItem[];
    navigateTo: (screen: React.Component<{}, {}, any>, params: object) => any;
    navigateBack: () => any;
};
export {};

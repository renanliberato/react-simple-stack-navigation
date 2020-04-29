import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { useNavigation, ActionTypes } from './index';

function FirstScreen() {
    return (
        <h1>First screen </h1>
    );
}

function SecondScreen() {
    return (
        <h1>Second screen </h1>
    );
}

test('should add initial screen to stack', () => {
    const { result } = renderHook(() => useNavigation(FirstScreen));

    expect(result.current.currentScreen.ScreenComponent).toBe(FirstScreen);
});

test('currentScreen should return stack top item after using navigateTo', () => {
    const { result } = renderHook(() => useNavigation(FirstScreen))

    act(() => {
        result.current.navigateTo(SecondScreen);
    });

    expect(result.current.currentScreen.ScreenComponent).toBe(SecondScreen);
});

test('currentScreen should return stack previous item after using navigateBack', () => {
    const { result } = renderHook(() => useNavigation(FirstScreen));

    act(() => {
        result.current.navigateTo(SecondScreen);
    });

    act(() => {
        result.current.navigateBack();
    });

    expect(result.current.currentScreen.ScreenComponent).toBe(FirstScreen);
});

test('currentScreen should throw error if trying to execute navigateBack with no previous screen', () => {
    const { result } = renderHook(() => useNavigation(FirstScreen));

    act(() => {
        result.current.navigateBack();
    });

    expect(result.current.currentScreen.ScreenComponent).toBe(FirstScreen);
});

test('middleware should be called whenever calling navigateTo', () => {
    const middleware = jest.fn((action, next) => next(action));
    const { result } = renderHook(() => useNavigation(FirstScreen, {}, middleware));

    act(() => {
        result.current.navigateTo(SecondScreen);
    });

    expect(middleware.mock.calls[0][0].type).toBe('push');
    expect(middleware.mock.calls[0][0].screen).toBe(SecondScreen);
    expect(result.current.currentScreen.ScreenComponent).toBe(SecondScreen);
});

test('middleware should be called whenever calling navigateBack', () => {
    const middleware = jest.fn((action, next) => next(action));
    const { result } = renderHook(() => useNavigation(FirstScreen, {}, middleware));

    act(() => {
        result.current.navigateTo(SecondScreen);
    });

    act(() => {
        result.current.navigateBack();
    });

    expect(middleware.mock.calls[0][0].type).toBe('push');
    expect(middleware.mock.calls[0][0].screen).toBe(SecondScreen);
    expect(middleware.mock.calls[1][0].type).toBe('pop');
    expect(result.current.currentScreen.ScreenComponent).toBe(FirstScreen);
});



test('returning nothing from a middleware should prevent navigation', () => {
    const middleware = jest.fn((action, next) => null);
    const { result } = renderHook(() => useNavigation(FirstScreen, {}, middleware));

    act(() => {
        result.current.navigateTo(SecondScreen);
    });

    expect(middleware.mock.calls[0][0].type).toBe('push');
    expect(middleware.mock.calls[0][0].screen).toBe(SecondScreen);
    
    expect(result.current.navStack.length).toBe(1);
    expect(result.current.currentScreen.ScreenComponent).toBe(FirstScreen);
});
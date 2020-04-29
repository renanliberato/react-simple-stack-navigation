# React Simple Stack Navigation

## Intro

I created this module for a simple prototyping I was working and I did not want to import a full featured navigation module while not necessary.

## Installing

```
npm install react-simple-stack-navigation
```

## How to use

This module exposes just 1 function: ```useNavigation```. It is a React hook that has what is needed to check the navigation stack and push/pop screens to it.

To exemplify its use, let's assume we have are developing a game and we current have 2 screens ```MainScreen``` and ```HowToPlayScreen```, but the app still exhibits just the first one:

```
function App() {
    return (
        <MainScreen/>
    );
}

function MainScreen() {
    return (
        <>
            <h1>THE GAME</h1>
            <button>How to play</button>
        </>
    );
}

function HowToPlayScreen() {
    return (
        <>
        <h1>HOW TO PLAY</h1>
        <button>Back</button>
        </>
    );
}
```

To add navigation between them, first we need to use our ```useNavigation``` hook. We will use it in a top component to instantiate the first screen and pass the navigation methods to it:
```
import { useNavigation } from 'react-simple-stack-navigation';

function App() {
    const { currentScreen, navigateTo, navigateBack } = useNavigation(MainScreen);

    const { ScreenComponent } = currentScreen;

    // We can pass additional props to our screen as usual.
    return (
        <ScreenComponent navigateTo={navigateTo} navigateBack={navigateBack} />
    );
}
```

Then, in our screens, we can use ```navigateTo``` and ```navigateBack``` props to navigate between them.

```
function MainScreen({navigateTo}) {
    return (
        <>
            <h1>THE GAME</h1>
            <button onClick={() => navigateTo(HowToPlayScreen)}>How to play</button>
        </>
    );
}

function HowToPlayScreen({navigateBack}) {
    return (
        <>
        <h1>HOW TO PLAY</h1>
        <button onClick={navigateBack}>Back</button>
        </>
    );
}
```

## Adding a middleware

When adding useNavigationReducer, we can specify a middleware that will run between navigation calls. This middleware can be used for sending analytics events on page changes, for example.

Let's add it to our app:
```
import { useNavigation } from 'react-simple-stack-navigation';

function navigationAnalyticsMiddleware(action, next) {
    // sendEvent('page_view');

    // If you want to prevent navigation, just do not call next(action) and return null.
    return next(action);
}

function App() {
    const { currentScreen, navigateTo, navigateBack } = useNavigation(MainScreen, {}, navigationAnalyticsMiddleware);

    const { ScreenComponent } = currentScreen;

    // We can pass additional props to our screen as usual.
    return (
        <ScreenComponent navigateTo={navigateTo} navigateBack={navigateBack} />
    );
}
```
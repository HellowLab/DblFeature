/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

const error = '#ef4444'
const success = '#10b981'
const p1 = '#0284c7'
const p2 = '#1b90cc'
const p3 = '#349cd2'
const p4 = '#4da8d7'
const p5 = '#67b5dd'
const p6 = '#80c1e3'

export const Colors = {
  light: {
    primary: p1,
    p2: p2,
    p3: p3,
    p4: p4,
    p5: p5,
    p6: p6,
    background: 'rgb(242, 242, 242)',
    // background: '#fff', // pure white
    b2: '#eceff1', // old color'#e0e0e4',
    b3: '#cfd8dc', // old color '#555',
    b4: '#b0bec5', // old color'#028889',
    b5: '#90a4ae', 
    b6: '#78909c',
    card: 'rgb(255, 255, 255)',
    // text: 'rgb(28, 28, 30)', // this is from react navigation site docs
    // text: '#11181C', // this is from mango's old project
    text: '#222',
    textmuted: '#6b7280',
    textinverted: '#fff',
    error: error,
    success: success,
    border: 'rgb(199, 199, 204)', // color from react navigation docs
    // border: '#d1d5db', // <-- grey-300 // color suggested by copilot --> '#d4d4d4', // border color for light mode 
    inverted: '#121212',// old is 29292c
    notification: 'rgb(255, 69, 58)',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    primary: '#0284c7', // primary color of the app
    p2: p2,
    p3: p3,
    p4: p4,
    p5: p5,
    p6: p6,
    // background: '#151718',
    background: '#1e2125', // old color #121212',
    b2: '#23272b', // old color '#282828', // old color'#29292c',
    b3: '#292e33', //old color '#3f3f3f', // old color '#aaa',
    b4: '#575757', // old color'#028889',
    b5: '#717171', 
    b6: '#8b8b8b', 
    card: '#171a1d', // darker card background color (darker than background)
    text: '#fff',
    textmuted: '#ccc',
    textinverted: '#222',
    error: error,
    success: success,
    border: '#394148', // border color for dark mode
    inverted: '#fff',// old is 29292c
    notification: 'rgb(255, 69, 58)',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

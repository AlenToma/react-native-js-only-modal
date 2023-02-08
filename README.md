# react-native-js-only-modal
If you are new to `react-native` you will find that `react-native` already has a [Modal component](https://reactnative.dev/docs/modal) that you could already use.

Now the different between this and what `react-native` already have is that, first this is only `js` library, it dose not use any `native code` and also dose not reuse `react-native` [Modal component](https://reactnative.dev/docs/modal) like other libraries.

Which make it much faster at rendering and easier to customize.

<img src="https://github.com/AlenToma/react-native-js-only-modal/blob/main/ezgif-5-5a82d38a62.gif?raw=true"  height="500" />

## Features
Smooth enter/exit animations
Plain simple and flexible APIs
Customizable backdrop styling
Listeners for the modal animations start and ending
Resize itself correctly on device rotation

## Setup
The library available at `npm install react-native-js-only-modal`

## Snack Example
[react-native-js-only-modal](https://snack.expo.dev/@alentoma/react-native-js-only-modal)

## usage
Since `react-native-js-only-modal` dose not include any native code and use only `js` when need it to be able to reach the root of the app.

In `APP` components add the `Provider` around the whole component

1. `import { Provider } from './ModalProvider';`

```tsx
const App =()=> {
return (
 <Provider>
  ...Your components here
 </Provider>
)
}
```
2. Create a <Modal> component and nest its content inside of it
```tsx
`import { Modal } from './ModalProvider';`
function WrapperComponent() {
 // show the Modal by setting `visible` = true
 const [visible, setVisible] = React.useState(false);
  return (
    <View>
      <Modal visible={visible} style={[styles.container, styles.center]}>
        <View style={{ flex: 1 }}>
          <Text>I am the modal content!</Text>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    width: '90%',
    maxHeight: 200,
    backgroundColor: 'white',
    flex: undefined,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'red',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 8,
  },
});
```
The isVisible prop is the only prop you'll really need to make the modal work: you should control this prop value by saving it in your wrapper component state and setting it to true or false when needed.

`Modal` already has `transparent` background so by setting style you can customize it however you like.


## Available props

Name |	Type |	Default |	Description|
| ------------- | ------------- | ------------- | ------------- |
| `visible` | `boolean` | REQUIRED | Show the modal? |
| `onCloseRequest` | `Function` | undefined | Triggered when the backdrop gets clicked/swaped |
| `hideBackDrop` | `boolean` | false | Do not show backdrop |
| `backDropStyle` | `StyleProp<ViewStyle>` | undefined | override the default style, eg `opacity`, `backgroundColor` |
| `style` | `StyleProp<ViewStyle>` | undefined | Modal Content Style |
| `containerStyle` | `StyleProp<ViewStyle>` | undefined | The Modal wrapper style, You can specify the position of the content by for example add `justifyContent: "flex-start"` to make the Modal apear at the top. Also If you have any issue with the height of the modal you could specify `maxHeight` and `minHeight` here |
| `easing` | `string` | "ease" | Timing function for the animation. Valid values: custom function or linear, ease, ease-in, ease-out, ease-in-out, ease-in-cubic, ease-out-cubic, ease-in-out-cubic, ease-in-circ, ease-out-circ, ease-in-out-circ, ease-in-expo, ease-out-expo, ease-in-out-expo, ease-in-quad, ease-out-quad, ease-in-out-quad, ease-in-quart, ease-out-quart, ease-in-out-quart, ease-in-quint, ease-out-quint, ease-in-out-quint, ease-in-sine, ease-out-sine, ease-in-out-sine, ease-in-back, ease-out-back, ease-in-out-back. See [react-native-animatable](https://github.com/oblador/react-native-animatable) for more info |
| `animationIn` | `string` | "slideInDown" | Specify the animation when the Modal appear eg `visible= true` see [react-native-animatable](https://github.com/oblador/react-native-animatable#animatableexplorer-example) for other animations |
| `animationOut` | `string` | "slideOutUp" | Specify the animation when the Modal disappear eg `visible= false` see [react-native-animatable](https://github.com/oblador/react-native-animatable#animatableexplorer-example) for other animations |
| `direction` | `string` | "normal" | Direction of animation, especially useful for repeating animations. Valid values: normal, reverse, alternate, alternate-reverse. |
| `duration` | `number` | 100 | For how long the animation will run (milliseconds). |
| `onAnimationBegin` | `Function` | undefined | A function that is called when the animation has been started. |
| `onAnimationEnd` | `Function` | undefined | A function that is called when the animation has been completed successfully or cancelled. Function is called with an endState argument, refer to endState.finished to see if the animation completed or not. |
| `useNativeDriver` | `boolean` | false | Whether to use native or JavaScript animation driver. Native driver can help with performance but cannot handle all types of styling. |
| `dimensions` | `string` | "window" | The library gets the `Dimensions` by `screen` or `window`. This is useFull when using FullScreen mode so that the backdrop takes all the screen. When using `react-native-web` is best to use `window` instead of `screen` |
| `disableBackHandler` | `boolean` | false | When clicking mobile back `button` `onCloseRequest` will be called if specified |


## Available animations
I am using [react-native-animatable](https://github.com/oblador/react-native-animatable#animatableexplorer-example) for animations, so you can see there what animation it offers.
 
 ## ScrollView
 `Modal` dose not containe `ScrollView` so you have to add it if you want to use any.

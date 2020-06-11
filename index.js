import {
  AppRegistry,
  NativeModules,
} from 'react-native'
// import PushNotification from 'react-native-push-notification'
import App from './App'

import { name as appName } from './app.json'
console.disableYellowBox = ["Unable to symbolicate"];

// const {
//   AWS_REGION,
//   AWS_IDENTITY_POOL_ID,
//   AWS_USER_POOL_ID,
//   AWS_USER_POOL_WEB_CLIENT_ID,
// } = config


// Amplify.configure({
//   Auth: {
//     region: AWS_REGION,
//     identityPoolId: AWS_IDENTITY_POOL_ID,
//     userPoolId: AWS_USER_POOL_ID,
//     userPoolWebClientId: AWS_USER_POOL_WEB_CLIENT_ID,
//   },
// })

// PushNotification.configure({

//   senderID: '275701935674',

//   // (optional) Called when Token is generated (iOS and Android)
//   onRegister(token) {
//     console.log('TOKEN:', token)
//     // make a http API call
//     AsyncStorage.setItem('deviceToken', token.token.toString())
//   },

//   // (required) Called when a remote or local notification is opened or received
//   onNotification: (notification) => {
//     console.log('NOTIFICATION:', notification)
//   },

//   // IOS ONLY (optional): default: all - Permissions to register.
//   permissions: {
//     alert: true,
//     badge: true,
//     sound: true,
//   },

//   // Should the initial notification be popped automatically
//   // default: true
//   popInitialNotification: false,

//   /**
//     * (optional) default: true
//     * - Specified if permissions (ios) and token (android and ios) will requested or not,
//     * - if not, you must call PushNotificationsHandler.requestPermissions() later
//     */
//   requestPermissions: true,
// })

// Navigation.setDefaultOptions({
//   animations: {
//     push: {
//       enabled: 'true',
//       alpha: {
//         from: 0.5,
//         to: 1,
//         duration: 400,
//         startDelay: 0,
//         interpolation: 'accelerate',
//       },
//     },
//     setRoot: {
//       enabled: 'true',
//       alpha: {
//         from: 0.5,
//         to: 1,
//         duration: 400,
//         startDelay: 0,
//         interpolation: 'accelerate',
//       },
//     },
//     pop: {
//       enabled: 'true',
//       alpha: {
//         from: 0.5,
//         to: 1,
//         duration: 400,
//         startDelay: 0,
//         interpolation: 'decelerate',
//       },
//     },
//     showModal: {
//       enabled: 'true',
//       alpha: {
//         from: 0.5,
//         to: 1,
//         duration: 400,
//         startDelay: 0,
//         interpolation: 'accelerate',
//       },
//     },
//     dismissModal: {
//       enabled: 'true',
//       alpha: {
//         from: 0.5,
//         to: 1,
//         duration: 400,
//         startDelay: 0,
//         interpolation: 'decelerate',
//       },
//     },
//   },
// })

console.disableYellowBox = true

const { ImagePickerManager } = NativeModules

const DEFAULT_OPTIONS = {
  title: 'Select a Photo',
  cancelButtonTitle: 'Cancel',
  takePhotoButtonTitle: 'Take Photo…',
  chooseFromLibraryButtonTitle: 'Choose from Library…',
  quality: 1.0,
  allowsEditing: false,
  permissionDenied: {
    title: 'Permission denied',
    text: 'To be able to take pictures with your camera and choose images from your library.',
    reTryTitle: 're-try',
    okTitle: 'I\'m sure',
  },
}
module.exports = {
  ...ImagePickerManager,
  showImagePicker: (options, callback) => {
    ImagePickerManager.showImagePicker({ ...DEFAULT_OPTIONS, ...options }, callback)
  },
}

AppRegistry.registerComponent(appName, () => App)

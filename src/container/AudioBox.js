import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Modal,
  Platform,
} from 'react-native'
import Sound from 'react-native-sound'
// import { AudioRecorder, AudioUtils } from 'react-native-audio'
import Permissions, { PERMISSIONS } from 'react-native-permissions'

import ConfiguredStyle from '@constants/Variables'

import WSIcon from '@components/WSIcon'

import common from '@styles/common'
import ChatStyle from '@styles/ChatStyle'

class AudioBox extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      currentTime: 0.0,
      recording: false,
      paused: false,
      stoppedRecording: false,
      finished: false,
     //  audioPath: `${AudioUtils.DocumentDirectoryPath}/${uuidv1()}.aac`,
      hasPermission: undefined,
    }
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible })
  }

  prepareRecordingPath(audioPath) {
    AudioRecorder.prepareRecordingAtPath(audioPath, {
      SampleRate: 22050,
      Channels: 1,
      AudioQuality: 'Low',
      AudioEncoding: 'aac',
      AudioEncodingBitRate: 32000,
    })
  }

  _requestPermission = (permissionName) => {
    return Permissions.request(permissionName).then(response => {
      console.log("permissionName: ", permissionName, response)
      return response
    })
  }

  checkPermission() {
    const { hasPermission } = this.state

    var microphonePermission = Platform.select({
      android: PERMISSIONS.ANDROID.RECORD_AUDIO,
      ios: PERMISSIONS.IOS.MICROPHONE,
    })

    this._requestPermission(microphonePermission);

    return Permissions.check(microphonePermission).then(response => {

      if (response === 'granted') {
        if (!hasPermission) {
          this.setState({
            hasPermission: true
          })
        }
        return true
      } else if (response === 'denied') {
        Alert.alert(
          'Can we access your microphone?',
          'We need access so you can send audio.',
          [
            {
              text: 'No way',
              onPress: () => console.log('Permission denied'),
              style: 'cancel',
            },
            response === 'undetermined'
              ? { text: 'OK', onPress: this._requestPermission('microphone') }
              : { text: 'Open Settings', onPress: Permissions.openSettings },
          ],
        )
        return false
      }
    })
  }

  componentDidMount() {
    // const { audioPath } = this.state
    // this.checkPermission()

    // AudioRecorder.requestAuthorization().then((isAuthorised) => {
    //   this.setState({ hasPermission: isAuthorised })

    //   if (!isAuthorised) return

    //   this.prepareRecordingPath(audioPath)

    //   AudioRecorder.onProgress = (data) => {
    //     this.setState({ currentTime: Math.floor(data.currentTime) })
    //   }

    //   AudioRecorder.onFinished = (data) => {
    //     // Android callback comes in the form of a promise instead.
    //     if (Platform.OS === 'ios') {
    //       this._finishRecording(data.status === 'OK', data.audioFileURL, data.audioFileSize)
    //     }
    //   }
    //   if (isAuthorised) {
    //     this._record()
    //   }
    // })
  }

  _renderButton(title, onPress, active) {
    const style = (active) ? styles.activeButtonText : styles.buttonText
    return (
      <TouchableHighlight style={styles.button} onPress={onPress}>
        <Text style={style}>
          {title}
        </Text>
      </TouchableHighlight>
    )
  }

  _renderPauseButton(onPress, active) {
    const { paused } = this.state
    const style = (active) ? styles.activeButtonText : styles.buttonText
    let title = paused ? 'RESUME' : 'PAUSE'
    return (
      <TouchableHighlight style={styles.button} onPress={onPress}>
        <Text style={style}>
          {title}
        </Text>
      </TouchableHighlight>
    )
  }

  async _pause() {
    const { recording } = this.state
    if (!recording) {
      console.warn('Can\'t pause, not recording!')
      return
    }

    // try {
    //   const filePath = await AudioRecorder.pauseRecording()
    //   this.setState({ paused: true })
    // } catch (error) {
    //   console.error(error)
    // }
  }

  async _resume() {
    const { paused } = this.state
    if (!paused) {
      console.warn('Can\'t resume, not paused!')
      return
    }

    // try {
    //   await AudioRecorder.resumeRecording()
    //   this.setState({ paused: false })
    // } catch (error) {
    //   console.error(error)
    // }
  }

  async _stop() {
    const { recording } = this.state
    if (!recording) {
      console.warn('Can\'t stop, not recording!')
      return
    }

    this.setState({ stoppedRecording: true, recording: false, paused: false })

    // try {
    //   const filePath = await AudioRecorder.stopRecording()

    //   if (Platform.OS === 'android') {
    //     this._finishRecording(true, filePath)
    //   }
    //   return filePath
    // } catch (error) {
    //   console.error(error)
    // }
  }

  async _play() {
    const { recording, audioPath } = this.state
    if (recording) {
      await this._stop()
    }

    // These timeouts are a hacky workaround for some issues with react-native-sound.
    // See https://github.com/zmxv/react-native-sound/issues/89.
    setTimeout(() => {
      const sound = new Sound(audioPath, '', (error) => {
        if (error) {
          console.log('failed to load the sound', error)
        }
      })

      setTimeout(() => {
        sound.play((success) => {
          if (success) {
            console.log('successfully finished playing')
          } else {
            console.log('playback failed due to audio decoding errors')
          }
        })
      }, 100)
    }, 100)
  }

  async _record() {
    const { recording, hasPermission, stoppedRecording, audioPath } = this.state
    if (recording) {
      console.warn('Already recording!')
      return
    }

    if (!hasPermission) {
      console.warn('Can\'t record, no permission granted!')
      return
    }

    if (stoppedRecording) {
      this.prepareRecordingPath(audioPath)
    }

    this.setState({ recording: true, paused: false })

    // try {
    //   const filePath = await AudioRecorder.startRecording()
    // } catch (error) {
    //   console.error(error)
    // }
  }

  _finishRecording(didSucceed, filePath, fileSize) {
    const { currentTime } = this.state
    this.setState({ finished: didSucceed })
    console.log(`Finished recording of duration ${currentTime} seconds at path: ${filePath} and size of ${fileSize || 0} bytes`)
  }

  stop = () => {
    const { modalVisible } = this.state
    this._stop()
    this.setModalVisible(!modalVisible)
  }

  render() {
    const {
      recording,
      paused,
      currentTime,
      modalVisible
    } = this.state
    return (
      // <View style={styles.container}>
      //   <View style={styles.controls}>
      //     {this._renderButton("RECORD", () => {this._record()}, recording )}
      //     {this._renderButton("PLAY", () => {this._play()} )}
      //     {this._renderButton("STOP", () => {this._stop()} )}
      //     {/* {this._renderButton("PAUSE", () => {this._pause()} )} */}
      //     {this._renderPauseButton(() => {paused ? this._resume() : this._pause()})}
      //     <Text style={styles.progressText}>{currentTime}s</Text>
      //   </View>
      // </View>
      <>
        <Modal
          animationType="fade"
          transparent
          visible={modalVisible}
          onRequestClose={() => {
            this.setModalVisible(!modalVisible)
          }}
        >
          <>
            <View style={styles.container}>
              <View style={styles.controls}>
                {this._renderButton('RECORD', () => { this._record() }, recording)}
                {this._renderButton('PLAY', () => { this._play() })}
                {this._renderButton('STOP', () => { this._stop() })}
                {/* {this._renderButton("PAUSE", () => {this._pause()} )} */}
                {this._renderPauseButton(() => { paused ? this._resume() : this._pause() })}
                <Text style={styles.progressText}>
                  {currentTime}
                  s
                </Text>
              </View>
            </View>
          </>
        </Modal>

        <View style={[ChatStyle.startRecord]}>
          <View style={ChatStyle.closePosition}>
            <WSIcon
              fontFamily={ConfiguredStyle.fontFamily.FARegular}
              iconStyle={[common.colorWhite, common.f20]}
              iconCode="&#xf00d;"
              onBtnPress={this.onStopRecording}
            />
          </View>
          <Text style={ChatStyle.recordText}>Recording</Text>
          <Text style={ChatStyle.bigText}>{`00:${currentTime <= 9 ? 0 : ''}${currentTime}`}</Text>
          <TouchableHighlight
            onPress={this.stop}
          >
            <WSIcon
              fontFamily={ConfiguredStyle.fontFamily.FARegular}
              iconStyle={ChatStyle.icon}
              iconCode="&#xf0a9;"
              onBtnPress={this.stop}
            />
          </TouchableHighlight>
        </View>
      </>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2b608a',
  },
  controls: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  progressText: {
    paddingTop: 50,
    fontSize: 50,
    color: '#fff',
  },
  button: {
    padding: 20,
  },
  disabledButtonText: {
    color: '#eee',
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
  },
  activeButtonText: {
    fontSize: 20,
    color: '#B81F00',
  },
})

export default AudioBox
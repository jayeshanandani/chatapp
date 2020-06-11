
import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { RNCamera } from 'react-native-camera'

import ConfiguredStyle from '@constants/Variables'
import enums from '@constants/Enum'

import common from '@styles/common'

const pagestyle = StyleSheet.create({
  cameraSnap: {
    flex: ConfiguredStyle.size.none,
    flexDirection: enums.ROW,
    justifyContent: enums.CENTER
  }
})

class CameraPage extends Component {
  render() {
    return (
      <View style={styles.container}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
          permissionDialogTitle={'Permission to use camera'}
          permissionDialogMessage={'We need your permission to use your camera phone'}
          onGoogleVisionBarcodesDetected={({ barcodes }) => {
          }}
        />
        <View style={pagestyle.cameraSnap}>
          <TouchableOpacity
            hitSlop={common.hitSlope10}
            onPress={this.takePicture.bind(this)}
            style={styles.capture}
          >
            <Text style={common.f15}> SNAP </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  takePicture = async function () {
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options)
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: ConfiguredStyle.size.s1,
    flexDirection: enums.COLUMN,
    backgroundColor: ConfiguredStyle.colors.black,
  },
  preview: {
    flex: ConfiguredStyle.size.s1,
    justifyContent: enums.END,
    alignItems: enums.CENTER
  },
  capture: {
    flex: ConfiguredStyle.size.none,
    backgroundColor: '#fff',
    borderRadius: ConfiguredStyle.radius.ssm,
    padding: ConfiguredStyle.padding.p15,
    paddingHorizontal: ConfiguredStyle.padding.md,
    alignSelf: enums.CENTER,
    margin: ConfiguredStyle.margin.md
  }
});

export default CameraPage
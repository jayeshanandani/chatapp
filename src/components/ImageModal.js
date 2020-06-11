import React, { memo } from 'react'
import { View, Modal, Image } from 'react-native'
import Video from 'react-native-video';

import ConfiguredStyle from '@constants/Variables'

import WSIcon from '@components/WSIcon'

import common from '@styles/common'

const ImageModal = (props) => {
  const {
    image,
    visibility,
    closeAction,
    url
  } = props
  return (
    <Modal
      animationType="fade"
      transparent={false}
      visible={visibility}
      onRequestClose={closeAction}
    >
      <View style={{ flex: 1, backgroundColor: 'black' }}>
        <View style={{ position: 'absolute', top: 20, right: 20, zIndex: 20, marginBottom: 10 }}>
          <WSIcon
            fontFamily={ConfiguredStyle.fontFamily.FARegular}
            iconStyle={[common.f20, common.colorWhite]}
            iconCode="&#xf00d;"
            onBtnPress={closeAction}
          />
        </View>
        <View style={{ flex: 1 }}>
          {url ? (
            <Video source={url}
              onBuffer={() => {}}
              onError={() => {}}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
              }}
            />
          ) : (
            <Image source={image} style={{ flex: 1 }} resizeMode="contain" />
          )}
        </View>
      </View>
    </Modal>
  )
}

export default memo(ImageModal)
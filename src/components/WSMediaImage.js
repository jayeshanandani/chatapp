import React, { memo } from 'react'
import { Image, TouchableOpacity } from 'react-native'
import { withNavigation } from 'react-navigation'
import FastImage from 'react-native-fast-image'

import images from '@constants/Image'

import common from '@styles/common'

const WSMediaImage = (props) => {
  const { media, styles, navigation } = props
  return (
    <TouchableOpacity
      hitSlop={common.hitSlope10}
      style={styles}
      onPress={() => navigation.navigate('PersonProfile', { currentMedia: media })}
    >
      {media?.metadata && media.metadata[0]?.large ? (
        <FastImage
          source={{ uri: media.metadata[0].large }}
          style={{ width: '100%', height: '100%' }}
          resizeMode={'cover'}
        />
      ) : (
          <Image
            source={images.avatar}
            style={{ width: '100%', height: '100%' }}
            resizeMode={'cover'}
          />
        )}
    </TouchableOpacity>
  )
}

export default withNavigation(memo(WSMediaImage))
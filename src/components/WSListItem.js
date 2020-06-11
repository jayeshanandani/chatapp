
import React, { memo } from 'react'
import {
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native'
import { Thumbnail } from 'native-base'
import _ from 'lodash'

import Typography from '@constants/Typography'
import images from '@constants/Image'
import ConfiguredStyle from '@constants/Variables'
import enums from '@constants/Enum'

import common from '@styles/common'

const pageStyle = StyleSheet.create({
  item: {
    flexDirection: enums.ROW,
    paddingVertical: ConfiguredStyle.padding.p15,
    alignItems: enums.CENTER,
    borderBottomWidth: ConfiguredStyle.radius.border,
    borderBottomColor: ConfiguredStyle.colors.grey.lightLine,
  },
})

const WSListItem = (props) => {
  const {
    userID,
    currentUser,
    id,
    thumbnailSrc,
    userId,
    onItemClick,
    data,
    name,
    onItemLongPress,
    reference,
  } = props
  return (
    <TouchableWithoutFeedback onPress={() => onItemClick(data)} onLongPress={() => onItemLongPress(data)} ref={reference}>
      <View hitSlop={common.hitSlope10} style={pageStyle.item}>
        {thumbnailSrc
          ? <Thumbnail small source={{ uri: thumbnailSrc }} />
          : <Thumbnail small source={images.avatar} />
        }
        <View style={common.ml20}>
          <Text style={[Typography.PrimaryH1, common.fullWidth]}>{(currentUser === id) ? 'You' : _.upperFirst(name)}</Text>
          {(userID) ? <Text style={Typography.h2}>{userId}</Text> : <></>}
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default memo(WSListItem)
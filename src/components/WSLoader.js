import React, { memo } from 'react'
import { ActivityIndicator, View } from 'react-native'

import enums from '@constants/Enum'
import ConfiguredStyle from '@constants/Variables'

import styles from '@styles/AppStyle'

const WSLoader = () => (
  <View style={styles.positionA}>
    <View style={styles.loaderStyle} />
    <ActivityIndicator style={styles.loaderPosition} size={enums.LARGE} color={ConfiguredStyle.colors.primary} animating />
  </View>
)

export default memo(WSLoader)
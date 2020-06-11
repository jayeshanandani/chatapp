import React from 'react'
import { View, ActivityIndicator } from 'react-native'

import styles from '@styles/AppStyle'

import enums from '@constants/Enum'
import ConfiguredStyle from '@constants/Variables'

export default class WithLoader extends React.Component {
    render() {
        const { children, spinner } = this.props
        return (
          <View style={{ flex: 1 }}>
            {children}
            {spinner
                    && (
                    <View style={styles.positionA}>
                      <View style={styles.loaderStyle} />
                      <ActivityIndicator style={styles.loaderPosition} size={enums.LARGE} color={ConfiguredStyle.colors.primary} animating />
                    </View>
)}
          </View>
        )
    }
}

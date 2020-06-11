import React, { memo } from 'react'
import { View, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import { List } from 'react-native-paper'

import ConfiguredStyle from '@constants/Variables'
import Typography from '@constants/Typography'
import enums from '@constants/Enum'

import styles from '@styles/AppStyle'

const pageStyle = StyleSheet.create({
  icon: {
    fontSize: ConfiguredStyle.fonts.lg,
    color: ConfiguredStyle.colors.primary,
  },
  iconText: {
    alignItems: enums.CENTER,
    flexDirection: enums.ROW,
    paddingVertical: ConfiguredStyle.padding.p15,
    paddingRight: ConfiguredStyle.padding.sm,
    paddingLeft: ConfiguredStyle.padding.sm,
  },
  titleText: {
    fontSize: ConfiguredStyle.fonts.f13,
    fontFamily: ConfiguredStyle.fontFamily.FABold,
    color: ConfiguredStyle.colors.black,
  }
})

const WSList = (props) => {
  const { usersList, onBtnPress } = props
  return (
    <List.Section>
      {usersList.map((item, index) => (
        <View key={index}>
          <List.Item
            style={pageStyle.iconText}
            onPress={() => onBtnPress(item)}
            title={item && item.name}
            titleStyle={Typography.h3}
            // left={({ size, color }) => (
            //   <Icon type={item && item.familyName} name={item && item.iconName} style={[common.pr20, { fontSize: ConfiguredStyle.fonts.lg, color: ConfiguredStyle.colors.primary }]} />
            // )}
            right={item && item.right}
          />
          <View style={[styles.borderBottom]} />
        </View>
      ))}
    </List.Section>
  )
}

WSList.propTypes = {
  usersList: PropTypes.array,
  onBtnPress: PropTypes.func.isRequired
}

WSList.defaultProps = {
  usersList: [{ name: '', page: '' }],
  onBtnPress: () => { }
}

export default memo(WSList)
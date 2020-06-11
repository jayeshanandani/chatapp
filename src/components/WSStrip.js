import React, { memo } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'

import ConfiguredStyle from '@constants/Variables'
import enums from '@constants/Enum'

import WSIcon from '@components/WSIcon'

const pageStyle = StyleSheet.create({
  container: {
    flexDirection: enums.ROW,
    paddingHorizontal: ConfiguredStyle.padding.md,
  },
  text: {
    fontSize: ConfiguredStyle.fonts.sm,
    flexGrow: ConfiguredStyle.flex.one,
    marginLeft: ConfiguredStyle.margin.sm,
    alignSelf: enums.CENTER,
    color: ConfiguredStyle.colors.black,
  },
  iconColor: {
    color: ConfiguredStyle.colors.black,
    fontSize: ConfiguredStyle.fonts.md,
  },
})

const WSStrip = (props) => {
  const { name, icon, style } = props
  return (
    <View style={pageStyle.container}>
      <WSIcon
        fontFamily={ConfiguredStyle.fontFamily.FAMedium}
        iconStyle={pageStyle.iconColor}
        iconCode={icon}
      />
      <Text style={[pageStyle.text, style]}>
        {name}
      </Text>
    </View>
  )
}

WSStrip.propTypes = {
  name: PropTypes.string,
  icon: PropTypes.string,
  style: PropTypes.object,
}

WSStrip.defaultProps = {
  name: '',
  icon: '',
  style: {},
}

export default memo(WSStrip)
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

import ConfiguredStyle from '@constants/Variables'
import enums from '@constants/Enum'

import WSButton from '@components/WSButton'

const styles = StyleSheet.create({
  container: {
    flex: ConfiguredStyle.flex.one,
    justifyContent: enums.CENTER,
    marginTop: ConfiguredStyle.size.md,
    backgroundColor: ConfiguredStyle.colors.white,
    paddingHorizontal: ConfiguredStyle.padding.xl,
  },
  title: {
    fontSize: ConfiguredStyle.fonts.sm,
    fontFamily: ConfiguredStyle.fontFamily.primaryBold,
    color: ConfiguredStyle.colors.black,
    textAlign: enums.CENTER,
  },
  description: {
    fontSize: ConfiguredStyle.fonts.f13,
    fontFamily: ConfiguredStyle.fontFamily.primaryBold,
    color: ConfiguredStyle.colors.grey.light,
    textAlign: enums.CENTER,
    marginVertical: ConfiguredStyle.margin.md,
  },
})

const SocialDesc = (props) => {
  const {
    name, desc, buttonEvent, buttonText,
  } = props
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{name}</Text>
      <Text style={styles.description}>{desc}</Text>
      <WSButton
        onBtnPress={buttonEvent}
        name={buttonText}
      />
    </View>
  )
}

export default SocialDesc
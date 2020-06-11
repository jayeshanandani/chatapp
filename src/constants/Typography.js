import { StyleSheet } from 'react-native'

import ConfiguredStyle from '@constants/Variables'
import enums from '@constants/Enum'

const Typography = StyleSheet.create({
  h10: {
    fontSize: ConfiguredStyle.fonts.xssm,
    color: ConfiguredStyle.colors.grey.light,
  },
  h0: {
    fontSize: ConfiguredStyle.fonts.xsm,
    color: ConfiguredStyle.colors.black,
  },
  h1: {
    fontSize: ConfiguredStyle.fonts.lg,
    fontFamily: ConfiguredStyle.fontFamily.primaryBold,
    fontWeight: enums.BOLD,
    color: ConfiguredStyle.colors.black,
  },
  h2: {
    fontSize: ConfiguredStyle.fonts.xsm,
    color: ConfiguredStyle.colors.grey.dark,
  },
  h3: {
    fontSize: ConfiguredStyle.fonts.sm,
    fontFamily: ConfiguredStyle.fontFamily.FAMedium,
    color: ConfiguredStyle.colors.black,
  },
  h4: {
    fontSize: ConfiguredStyle.fonts.f18,
    fontFamily: ConfiguredStyle.fontFamily.primaryMedium,
    color: ConfiguredStyle.colors.black,
  },
  h5: {
    fontSize: ConfiguredStyle.fonts.f18,
    fontFamily: ConfiguredStyle.fontFamily.primaryBold,
    fontWeight: enums.BOLD,
    color: ConfiguredStyle.colors.black,
  },
  PrimaryH1: {
    fontSize: ConfiguredStyle.fonts.sm,
    fontWeight: enums.BOLD,
    color: ConfiguredStyle.colors.primary,
  },
  PrimaryH2: {
    fontSize: ConfiguredStyle.fonts.xsm,
    fontWeight: ConfiguredStyle.fontWeight.fW,
    color: ConfiguredStyle.colors.black,
  },
  h2Time: {
    fontSize: ConfiguredStyle.fonts.sm,
    fontWeight: ConfiguredStyle.fontWeight.fW,
    color: ConfiguredStyle.colors.black,
    justifyContent: enums.END,
    alignItems: enums.END,
    textAlign: enums.RIGHT,
  },
  buttonText: {
    fontSize: ConfiguredStyle.fonts.sm,
    fontFamily: ConfiguredStyle.fontFamily.primaryMedium,
    color: ConfiguredStyle.colors.black,
  },
})

export default Typography
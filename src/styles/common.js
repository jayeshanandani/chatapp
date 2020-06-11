import { StyleSheet } from 'react-native'

import enums from '@constants/Enum'
import ConfiguredStyle from '@constants/Variables'

const common = StyleSheet.create({
  exactCenter: {
    justifyContent: enums.CENTER,
    alignItems: enums.CENTER,
  },
  centerStart: {
    alignItems: enums.START,
    justifyContent: enums.CENTER,
  },
  flexDirectionRow: {
    flexDirection: enums.ROW,
  },
  borderRadius: {
    borderRadius: ConfiguredStyle.size.md,
  },
  senderBackColor: {
    backgroundColor: ConfiguredStyle.colors.tertiary,
  },
  sendBorderColor: {
    borderColor: ConfiguredStyle.colors.tertiary,
  },
  receiveBorderColor: {
    borderColor: ConfiguredStyle.colors.grey.light,
  },
  receiverBackColor: {
    borderWidth: ConfiguredStyle.opacity.sm,
    borderColor: ConfiguredStyle.colors.grey.light,
    backgroundColor: ConfiguredStyle.colors.white,
  },
  borderRadius10: {
    borderRadius: ConfiguredStyle.size.xsm,
  },
  borderRadius4: {
    borderRadius: ConfiguredStyle.radius.ssm,
  },
  borderRadius50: {
    borderRadius: ConfiguredStyle.size.md,
  },
  borderRadius25: {
    borderRadius: ConfiguredStyle.size.s25,
  },
  alignItemCenter: {
    alignItems: enums.CENTER,
  },
  flex1: {
    flex: ConfiguredStyle.flex.one,
  },
  flex2: {
    flex: ConfiguredStyle.flex.two,
  },
  flex3: {
    flex: ConfiguredStyle.flex.three,
  },
  flexNone: {
    flex: ConfiguredStyle.size.none,
  },
  flexGrow1: {
    flexGrow: ConfiguredStyle.flex.one,
  },
  flexGrow0: {
    flexGrow: ConfiguredStyle.size.none,
  },
  flexGrow3: {
    flexGrow: ConfiguredStyle.flex.three,
  },
  flexShrink1: {
    flexShrink: ConfiguredStyle.flex.one,
  },
  flexDirectionStart: {
    justifyContent: enums.START,
  },
  flexWrap: {
    flexWrap: enums.WRAP,
  },
  spaceBetween: {
    justifyContent: enums.SPACE_B,
  },
  ph15: {
    paddingHorizontal: ConfiguredStyle.padding.p15,
  },
  ph40: {
    paddingHorizontal: ConfiguredStyle.padding.xl,
  },
  ph5: {
    paddingHorizontal: ConfiguredStyle.padding.xsm,
  },
  ph10: {
    paddingHorizontal: ConfiguredStyle.padding.sm,
  },
  ph20: {
    paddingHorizontal: ConfiguredStyle.padding.md,
  },
  pv5: {
    paddingVertical: ConfiguredStyle.padding.xsm,
  },
  pv25: {
    paddingVertical: ConfiguredStyle.padding.p25,
  },
  pb30: {
    paddingBottom: ConfiguredStyle.padding.lg,
  },
  pb5: {
    paddingBottom: ConfiguredStyle.padding.sm,
  },
  pb0: {
    paddingBottom: ConfiguredStyle.size.none,
  },
  pb12: {
    paddingBottom: ConfiguredStyle.padding.p12,
  },
  pb14: {
    paddingBottom: ConfiguredStyle.padding.p14,
  },
  pb10: {
    paddingBottom: ConfiguredStyle.padding.sm,
  },
  pb20: {
    paddingBottom: ConfiguredStyle.padding.md,
  },
  pt20: {
    paddingTop: ConfiguredStyle.padding.md,
  },
  pt32: {
    paddingTop: ConfiguredStyle.padding.p32,
  },
  pt44: {
    paddingTop: ConfiguredStyle.padding.p44,
  },
  pt15: {
    paddingTop: ConfiguredStyle.padding.p15,
  },
  pb15: {
    paddingBottom: ConfiguredStyle.padding.p15,
  },
  pv15: {
    paddingVertical: ConfiguredStyle.padding.p15,
  },
  pv5: {
    paddingVertical: ConfiguredStyle.padding.xsm,
  },
  pv10: {
    paddingVertical: ConfiguredStyle.padding.sm,
  },
  pv20: {
    paddingVertical: ConfiguredStyle.padding.lg,
  },
  pv30: {
    paddingVertical: ConfiguredStyle.padding.xl,
  },
  p20: {
    padding: ConfiguredStyle.padding.md,
  },
  pb2: {
    paddingBottom: ConfiguredStyle.size.s2,
  },
  p10: {
    padding: ConfiguredStyle.padding.sm,
  },
  pl20: {
    paddingLeft: ConfiguredStyle.padding.md,
  },
  pl10: {
    paddingLeft: ConfiguredStyle.padding.sm,
  },
  pl15: {
    paddingLeft: ConfiguredStyle.padding.p15,
  },
  pl30: {
    paddingLeft: ConfiguredStyle.padding.p30,
  },
  pr20: {
    paddingRight: ConfiguredStyle.padding.md,
  },
  pr10: {
    paddingRight: ConfiguredStyle.padding.sm,
  },
  pt10: {
    paddingTop: ConfiguredStyle.padding.sm,
  },
  mt40: {
    paddingTop: ConfiguredStyle.margin.xl,
  },
  mb30: {
    marginBottom: ConfiguredStyle.margin.lg,
  },
  mb60: {
    marginBottom: ConfiguredStyle.size.s60,
  },
  mb52: {
    marginBottom: ConfiguredStyle.size.s52,
  },
  mr5: {
    marginRight: ConfiguredStyle.margin.xsm,
  },
  mb10: {
    marginBottom: ConfiguredStyle.margin.sm,
  },
  mb1: {
    marginBottom: ConfiguredStyle.size.s1,
  },
  mb15: {
    marginBottom: ConfiguredStyle.margin.m15,
  },
  mb20: {
    marginBottom: ConfiguredStyle.margin.md,
  },
  mb5: {
    marginBottom: ConfiguredStyle.margin.xsm,
  },
  mb40: {
    marginBottom: ConfiguredStyle.margin.xl,
  },
  mv20: {
    marginVertical: ConfiguredStyle.margin.md,
  },
  mv10: {
    marginVertical: ConfiguredStyle.margin.sm,
  },
  mv35: {
    marginVertical: ConfiguredStyle.size.s35,
  },
  mv50: {
    marginVertical: ConfiguredStyle.size.md,
  },
  mh20: {
    marginHorizontal: ConfiguredStyle.margin.md,
  },
  mh15: {
    marginHorizontal: ConfiguredStyle.margin.m15,
  },
  mh10: {
    marginHorizontal: ConfiguredStyle.margin.sm,
  },
  mh5: {
    marginHorizontal: ConfiguredStyle.margin.xsm,
  },
  mr10: {
    marginRight: ConfiguredStyle.margin.sm,
  },
  mr20: {
    marginRight: ConfiguredStyle.margin.md,
  },
  m50: {
    margin: ConfiguredStyle.size.md,
  },
  ml44: {
    marginLeft: ConfiguredStyle.size.s44,
  },
  ml10: {
    marginLeft: ConfiguredStyle.margin.sm,
  },
  ml50: {
    marginLeft: ConfiguredStyle.margin.xxl,
  },
  ml20: {
    marginLeft: ConfiguredStyle.margin.md,
  },
  mt0: {
    marginTop: ConfiguredStyle.size.none,
  },
  mt3: {
    marginTop: ConfiguredStyle.size.s3,
  },
  mt5: {
    marginTop: ConfiguredStyle.margin.xsm,
  },
  mt30: {
    marginTop: ConfiguredStyle.size.s30,
  },
  mt10: {
    marginTop: ConfiguredStyle.margin.sm,
  },
  mt15: {
    marginTop: ConfiguredStyle.margin.m15,
  },
  mt20: {
    marginTop: ConfiguredStyle.margin.md,
  },
  m20: {
    margin: ConfiguredStyle.margin.md,
  },
  mt160: {
    marginTop: 160,
  },
  mv15: {
    marginVertical: ConfiguredStyle.margin.m15,
  },
  f10: {
    fontSize: ConfiguredStyle.fonts.xssm,
  },
  f12: {
    fontSize: ConfiguredStyle.fonts.xsm,
  },
  f13: {
    fontSize: ConfiguredStyle.fonts.f13,
  },
  f15: {
    fontSize: ConfiguredStyle.fonts.sm,
  },
  f20: {
    fontSize: ConfiguredStyle.fonts.md,
  },
  fBold: {
    fontWeight: enums.BOLD,
  },
  w600: {
    fontWeight: '600',
  },
  fontMedium: {
    fontFamily: ConfiguredStyle.fontFamily.FAMedium,
  },
  selfStart: {
    alignSelf: enums.START,
  },
  selfCenter: {
    alignSelf: enums.CENTER,
  },
  selfEnd: {
    alignSelf: enums.END,
  },
  italicText: {
    fontStyle: 'italic',
  },
  justifyCenter: {
    justifyContent: enums.CENTER,
  },
  justifyEnd: {
    justifyContent: enums.END,
  },
  alignStart: {
    alignItems: enums.START,
  },
  alignEnd: {
    alignItems: enums.END,
  },
  textCenter: {
    textAlign: enums.CENTER,
  },
  textEnd: {
    textAlign: enums.RIGHT,
  },
  bottomWidth0: {
    borderBottomWidth: ConfiguredStyle.size.none,
  },
  bWidth2: {
    borderWidth: ConfiguredStyle.size.s2,
  },
  bWidthzero5: {
    borderWidth: ConfiguredStyle.radius.border,
  },
  bottomWidth1: {
    borderBottomWidth: ConfiguredStyle.size.s1,
  },
  rightWidth1: {
    borderRightWidth: ConfiguredStyle.size.s1,
  },
  LeftWidth1: {
    borderLeftWidth: ConfiguredStyle.size.s1,
  },
  bottomRightWidth1: {
    borderRightWidth: ConfiguredStyle.size.s1,
  },
  colorBlack: {
    color: ConfiguredStyle.colors.black,
  },
  borderColorWhite: {
    borderColor: ConfiguredStyle.colors.white,
  },
  borderColorGrey: {
    borderBottomColor: ConfiguredStyle.colors.grey.light,
  },
  colorLightGrey: {
    color: ConfiguredStyle.colors.grey.light,
  },
  colorMediumGrey: {
    color: ConfiguredStyle.colors.grey.medium,
  },
  colorWhite: {
    color: ConfiguredStyle.colors.white,
  },
  colorPrimary: {
    color: ConfiguredStyle.colors.primary,
  },
  bColorTransparent: {
    backgroundColor: ConfiguredStyle.colors.transparent,
  },
  bColorTertiary: {
    backgroundColor: ConfiguredStyle.colors.tertiary,
  },
  bColorBlack: {
    backgroundColor: ConfiguredStyle.colors.black,
  },
  bgSecondary: {
    backgroundColor: ConfiguredStyle.colors.tertiary,
  },
  bgWhite: {
    backgroundColor: ConfiguredStyle.colors.white,
  },
  greyColor: {
    color: ConfiguredStyle.colors.grey.medium,
  },
  halfWidth: {
    width: ConfiguredStyle.dimensions.fullWidth / 2,
  },
  fullWidth: {
    width: ConfiguredStyle.dimensions.fullWidth,
  },
  width35: {
    width: ConfiguredStyle.size.s35,
  },
  fullHeight: {
    height: ConfiguredStyle.dimensions.fullHeight,
  },
  positionAbsolute: {
    position: enums.ABSOLUTE,
  },
  zIndex10: {
    zIndex: ConfiguredStyle.size.s10,
  },
  opacity: {
    opacity: ConfiguredStyle.radius.border,
  },
  maxWidth: {
    maxWidth: ConfiguredStyle.size.xsm,
  },
  primaryTransparent: {
    backgroundColor: ConfiguredStyle.colors.primaryTransparent,
  },
  backgroundWhite: {
    backgroundColor: ConfiguredStyle.colors.white,
  },
  listBlockWidth: {
    width: ConfiguredStyle.dimensions.fullWidth / 5 - 5,
  },
  listBlockHeight: {
    height: ConfiguredStyle.dimensions.fullHeight / 10,
  },
  sRadius5: {
    shadowRadius: ConfiguredStyle.radius.ssm,
  },
  elevation3: {
    elevation: ConfiguredStyle.elevation.ssm3,
  },
  sOpacity4: {
    shadowOpacity: ConfiguredStyle.opacity.sm,
  },
  lineHeight25: {
    lineHeight: ConfiguredStyle.size.sm,
  },
  lineHeight30: {
    lineHeight: ConfiguredStyle.size.s30,
  },
  width50: {
    width: ConfiguredStyle.size.md,
  },
  height50: {
    height: ConfiguredStyle.size.md,
  },
  height30: {
    height: ConfiguredStyle.size.s30,
  },
  width70: {
    width: ConfiguredStyle.size.s70,
  },
  height70: {
    height: ConfiguredStyle.size.s70,
  },
  width52: {
    width: ConfiguredStyle.size.s52,
  },
  height52: {
    height: ConfiguredStyle.size.s52,
  },
  width60: {
    width: ConfiguredStyle.size.s60,
  },
  height60: {
    height: ConfiguredStyle.size.s60,
  },
  hitSlope10: {
    top: ConfiguredStyle.size.s25,
    bottom: ConfiguredStyle.size.s25,
    left: ConfiguredStyle.size.s25,
    right: ConfiguredStyle.size.s25,
  },

})

export default common
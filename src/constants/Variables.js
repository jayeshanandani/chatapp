
import { Dimensions } from 'react-native'

import enums from '@constants/Enum'

const dimensions = {
  fullHeight: Dimensions.get('window').height,
  fullWidth: Dimensions.get('window').width,
}

const { width, height } = Dimensions.get('window');
const [shortDimension, longDimension] = width < height ? [width, height] : [height, width];

//Default guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

const scale = size => shortDimension / guidelineBaseWidth * size;
const verticalScale = size => longDimension / guidelineBaseHeight * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

export { scale, verticalScale, moderateScale };

const colors = {
  black: 'rgba(0,0,0,0.8)',
  pureBlack: '#000',
  white: '#fff',
  red: '#f56b5f',
  yellow: {
    dark: '#fd9e11',
    light: '#fec108',
  },
  skyBlue: '#03a7f3',
  blue: {
    dark: '#222222',
  },
  grey: {
    dark: '#424242',
    medium: '#7f7f7f',
    light: '#bdbdbd',
    lightLine: '#d7d7d7',
    lightest: '#F1F1F1',
    lightColor: '#eee',
  },
  placeholder: '#a7a7a7',
  social: {
    google: '#C63D2D',
    fb: '#3b5998',
    contact: '#2B4964',
    linkedIn: '#4875B4',
  },
  opacity: {
    black_op_40: 'rgba(0, 0, 0, 0.2)',
    black_op_0: 'rgba(0, 0, 0, 0)',
    purple_op_40: '#7979cfdd',
  },
  primary: '#7979cf',
  primaryTransparent: '#BCBCE7',
  secondary: '#dbdaf1',
  tertiary: '#f1eff9',
  lightPrimary: '#F7F7FC',
  lightLine: '#d7d7d7',
  transparent: '#00000000',
  rippleColor: '#ffffff55',
  rippleColorDark: '#0005',
  // rippleColorDark: '#000',
  // rippleColor: '#dbdaf1',
}

const padding = {
  xssm: 4,
  xsm: 5,
  sm: 10,
  p12: 12,
  p14: 14,
  p15: 15,
  p18: 18,
  md: 20,
  lg: 30,
  xl: 40,
  p15: 15,
  p25: 25,
  p30: 30,
  p32: 32,
  p44: 44,
}

const margin = {
  xsm: 5,
  m8: 8,
  sm: 10,
  m15: 15,
  md: 20,
  lg: 30,
  xl: 40,
  m15: 15,
  m25: 25,
  xxl: 50,
}

const fonts = {
  xssm: moderateScale(10),
  xsm: moderateScale(12),
  f13: moderateScale(13),
  sm: moderateScale(15),
  f16: moderateScale(16),
  f18: moderateScale(18),
  md: moderateScale(20),
  lg: moderateScale(22),
  f25: moderateScale(25),
  xlg: moderateScale(30),
  f35: moderateScale(35),
}

const fontFamily = {
  primaryMedium: enums.HELVETICA_PRIMARY,
  primaryBold: enums.HELVETICA_BOLD,
  FAMedium: enums.FONTAWESOME_MEDIUM,
  FARegular: enums.FONTAWESOME_REGULAR,
  FABold: enums.FONTAWESOME_BOLD,
}

const size = {
  none: 0,
  s1: 1,
  s2: 2,
  s3: 3,
  s4: 4,
  s5: 5,
  s6: 6,
  s8: 8,
  s10: 10,
  s11: 11,
  s13: 13,
  s15: 15,
  s17: 17,
  s20: 20,
  s21: 21,
  s22: 22,
  s25: 25,
  xsm: 10,
  sm: 20,
  s30: 30,
  s35: 35,
  s40: 40,
  s44: 44,
  s45: 45,
  md: 50,
  s52: 52,
  s55: 55,
  s60: 60,
  s70: 70,
  lg: 100,
  s150: 150,
  s500: 500,
}

const radius = {
  ssm: 5,
  border: 0.5,
}

const elevation = {
  ssm3: 3,
}

const flex = {
  one: 1,
  two: 2,
  three: 3,
}

const opacity = {
  op: 0.1,
  sm: 0.4,
}

const fontWeight = {
  fW: '500',
}

const resizeMode = {
  stretch: enums.STRETCH,
  contain: enums.CONTAIN,
  cover: enums.COVER,
  repeat: enums.REPEAT,
  center: enums.CENTER,
}

export default {
  colors,
  padding,
  margin,
  size,
  flex,
  dimensions,
  fonts,
  opacity,
  elevation,
  radius,
  fontWeight,
  fontFamily,
  resizeMode,
}
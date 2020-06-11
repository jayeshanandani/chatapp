
import { StyleSheet, Dimensions } from 'react-native'

import enums from '@constants/Enum'
import ConfiguredStyle from '@constants/Variables'

const styles = StyleSheet.create({
  errorMessage: {
    color: ConfiguredStyle.colors.red,
    fontSize: ConfiguredStyle.fonts.xsm,
  },
  removeMessage: {
    backgroundColor: 'white', color: 'black', textAlign: 'center', paddingVertical: 10,
  },
  bottomButton: {
    // position: enums.ABSOLUTE,
    width: ConfiguredStyle.dimensions.fullWidth,
    // bottom: ConfiguredStyle.size.sm,
    paddingBottom: ConfiguredStyle.size.sm,
    paddingHorizontal: ConfiguredStyle.size.sm,
  },
  showHideButton: {
    fontWeight: enums.BOLD,
    color: ConfiguredStyle.colors.primary,
    fontSize: ConfiguredStyle.fonts.xsm,
    position: enums.ABSOLUTE,
    bottom: ConfiguredStyle.size.sm,
    right: ConfiguredStyle.size.xsm,
    width: ConfiguredStyle.size.s35,
  },
  hitSlopArea: {
    top: ConfiguredStyle.size.s15,
    right: ConfiguredStyle.size.s15,
    left: ConfiguredStyle.size.s15,
    bottom: ConfiguredStyle.size.s15,
  },
  checkBoxReminder: {
    marginTop: ConfiguredStyle.size.s3,
    height: ConfiguredStyle.size.s22,
    width: ConfiguredStyle.size.s22,
  },
  pickerView: {
    flexDirection: enums.ROW,
    alignItems: enums.CENTER,
    justifyContent: enums.SPACE_B,
  },
  checkBox: {
    left: ConfiguredStyle.size.none,
    borderRadius: ConfiguredStyle.radius.ssm,
  },
  badge: {
    backgroundColor: ConfiguredStyle.colors.primary,
    height: ConfiguredStyle.size.sm,
    minWidth: ConfiguredStyle.size.sm,
    paddingHorizontal: 5,
    borderRadius: ConfiguredStyle.size.xsm,
  },
  borderBottom: {
    borderBottomWidth: ConfiguredStyle.radius.border,
    borderBottomColor: ConfiguredStyle.colors.grey.light,
  },
  border: {
    borderWidth: ConfiguredStyle.radius.border,
    padding: 5,
    borderColor: ConfiguredStyle.colors.grey.lightLine,
    backgroundColor: ConfiguredStyle.colors.grey.lightest,
  },
  primaryColorText: {
    fontSize: ConfiguredStyle.fonts.sm,
    color: ConfiguredStyle.colors.primary,
  },
  transparentHeader: {
    width: ConfiguredStyle.dimensions.fullWidth,
    position: enums.ABSOLUTE,
    top: ConfiguredStyle.size.none,
    backgroundColor: ConfiguredStyle.colors.opacity.black_op_40,
    borderBottomWidth: ConfiguredStyle.size.none,
  },
  positionA: {
    position: enums.ABSOLUTE,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  loaderStyle: {
    position: enums.ABSOLUTE,
    opacity: ConfiguredStyle.opacity.op,
    height: '100%',
    width: '100%',
    backgroundColor: '#000',
  },
  loaderPosition: {
    height: '100%',
    width: '100%',
    justifyContent: enums.CENTER,
    alignItems: enums.CENTER,
  },
  fabStyle: {
    backgroundColor: ConfiguredStyle.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0
  }
})

export default styles
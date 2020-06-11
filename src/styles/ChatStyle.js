import { StyleSheet } from 'react-native'

import ConfiguredStyle from '@constants/Variables'
import enums from '@constants/Enum'

export default ChatStyle = StyleSheet.create({
    chatBubble: {
        borderRadius: ConfiguredStyle.size.s10,
    },
    rightSide: {
        flex: ConfiguredStyle.flex.one,
        marginVertical: ConfiguredStyle.size.s3,
        marginHorizontal: ConfiguredStyle.margin.sm,
        maxWidth: ConfiguredStyle.dimensions.fullWidth * 0.8,
        marginLeft: ConfiguredStyle.size.s60,
        justifyContent: enums.END,
        alignItems: enums.END,
    },
    leftSide: {
        flex: ConfiguredStyle.flex.one,
        marginVertical: ConfiguredStyle.size.s3,
        marginHorizontal: ConfiguredStyle.margin.sm,
        maxWidth: ConfiguredStyle.dimensions.fullWidth * 0.8,
        marginRight: ConfiguredStyle.size.s60,
        justifyContent: enums.START,
        alignItems: enums.START,
    },
    chatText: {
        color: ConfiguredStyle.colors.black,
        paddingBottom: ConfiguredStyle.padding.sm,
        paddingHorizontal: ConfiguredStyle.padding.sm,
    },
    title: {
        color: ConfiguredStyle.colors.black,
        fontWeight: enums.BOLD,
        fontSize: ConfiguredStyle.fonts.f13,
        textAlign: enums.CENTER,
        backgroundColor: '#fffb',
        paddingVertical: ConfiguredStyle.padding.sm,
    },
    image: {
        marginHorizontal: ConfiguredStyle.margin.m25,
        marginVertical: ConfiguredStyle.margin.sm,
    },
    textBox: {
        paddingHorizontal: 10,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        paddingBottom: 10,
        // backgroundColor: ConfiguredStyle.colors.white,
        // elevation: 10,
        // shadowColor: ConfiguredStyle.colors.pureBlack,
        // shadowOpacity: 0.1,
        // shadowOffset: {
        //   width: 0, 
        //   height: -3,
        // }
    },
    timing: {
        position: 'absolute',
        top: 10,
        right: 0,
    },
    timeText: {
        alignSelf: 'flex-start',
        color: ConfiguredStyle.colors.grey.light,
        fontSize: 10,
        paddingTop: 5,
        marginHorizontal: 10,
    },
    systemMessage: {
        backgroundColor: ConfiguredStyle.colors.grey.lightColor,
        textAlign: enums.CENTER,
        fontSize: ConfiguredStyle.fonts.xsm,
        paddingVertical: ConfiguredStyle.padding.xsm,
        marginVertical: ConfiguredStyle.margin.xsm,
    },
    groupSenderName: {
        color: ConfiguredStyle.colors.primary,
        fontSize: ConfiguredStyle.fonts.xsm,
        fontWeight: '500',
        paddingVertical: 5,
        paddingLeft: 10,
    },
    // audio
    startRecord: {
        position: enums.ABSOLUTE,
        bottom: ConfiguredStyle.size.none,
        zIndex: 11,
        width: ConfiguredStyle.dimensions.fullWidth,
        backgroundColor: ConfiguredStyle.colors.primary,
        justifyContent: enums.CENTER,
        alignItems: enums.CENTER,
        paddingVertical: ConfiguredStyle.padding.sm,
    },
    closePosition: {
        position: enums.ABSOLUTE,
        top: ConfiguredStyle.size.s10,
        right: ConfiguredStyle.size.s10,
    },
    recordText: {
        color: ConfiguredStyle.colors.primaryTransparent,
        fontSize: ConfiguredStyle.fonts.xsm,
    },
    bigText: {
        color: ConfiguredStyle.colors.white,
        fontSize: ConfiguredStyle.fonts.lg,
        paddingBottom: ConfiguredStyle.padding.xsm,
    },
    icon: {
        fontSize: ConfiguredStyle.size.s35,
        color: ConfiguredStyle.colors.white,
    },
})
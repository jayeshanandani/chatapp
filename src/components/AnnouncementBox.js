import React, { memo } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { WebView } from 'react-native-webview'
import { getDefaultStyles } from 'react-native-cn-richtext-editor'

import enums from '@constants/Enum'
import ConfiguredStyle from '@constants/Variables'

import WSIcon from '@components/WSIcon'

import common from '@styles/common'

const pageStyle = StyleSheet.create({
    container: {
        backgroundColor: ConfiguredStyle.colors.white,
        width: (ConfiguredStyle.dimensions.fullWidth - 100),
        alignSelf: enums.START,
        marginVertical: ConfiguredStyle.size.s3,
        borderRadius: 10,
        borderWidth: ConfiguredStyle.opacity.sm,
        borderColor: ConfiguredStyle.colors.grey.light,
        marginLeft: 10,
    },
    senderStyle: {
        backgroundColor: ConfiguredStyle.colors.tertiary,
        width: (ConfiguredStyle.dimensions.fullWidth - 100),
        alignSelf: enums.END,
        marginVertical: ConfiguredStyle.size.s3,
        borderRadius: 10,
        marginRight: 10,
        marginLeft: 10
    },
    bigIcon: {
        color: ConfiguredStyle.colors.primary,
        fontSize: ConfiguredStyle.size.s30,
    },
    content: {
        flex: 1,
        width: (ConfiguredStyle.dimensions.fullWidth - 100),
    },
    time: {
        position: enums.ABSOLUTE,
        top: 10,
        right: 10,
        color: ConfiguredStyle.colors.grey.medium,
        fontSize: 10,
    },
    title: {
        paddingTop: 20,
        color: ConfiguredStyle.colors.black,
        fontWeight: enums.BOLD,
        fontSize: 15,
        marginLeft: ConfiguredStyle.margin.sm,
    },
    description: {
        color: ConfiguredStyle.colors.grey.dark,
        fontSize: 10,
        marginBottom: 10,
        marginLeft: 10
    },
    webViewStyle: {
        height: ConfiguredStyle.size.md,
        width: '100%',
        marginLeft: ConfiguredStyle.margin.xsm,
    },
})

const defaultStyles = getDefaultStyles()
const customStyles = {
    ...defaultStyles,
    body: { fontSize: 12 },
    heading: { fontSize: 12 },
    title: { fontSize: 12 },
    ol: { fontSize: 12 },
    ul: { fontSize: 12 },
}

const AnnouncementBox = (props) => {
    const {
        sender,
        title,
        desc,
        date,
        loginUserId,
        senderId,
    } = props
    return (
        <View style={(loginUserId === senderId) ? pageStyle.senderStyle : pageStyle.container}>
            <View style={[common.flexDirectionRow, common.ph10, common.exactCenter]}>
                <Text style={pageStyle.time}>{date}</Text>
                <WSIcon
                    fontFamily={ConfiguredStyle.fontFamily.FAMedium}
                    iconStyle={pageStyle.bigIcon}
                    iconCode="&#xf0a1;"
                />
                <View style={pageStyle.content}>
                    <Text style={pageStyle.title}>{title}</Text>
                    {
                        desc && desc !== '<p><br></p>' &&
                        <WebView
                            useWebKit={true}
                            scrollEnabled={false}
                            source={{ html: desc }}
                            originWhitelist={["*"]}
                            scalesPageToFit
                            injectedJavaScript={`const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=0.75'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `}
                            style={[pageStyle.webViewStyle, (loginUserId === senderId) && { backgroundColor: ConfiguredStyle.colors.tertiary }]}
                        />
                    }
                    <Text style={pageStyle.description}>{(loginUserId === senderId) ? 'You create announcement' : `${sender} is sent you announcement`}</Text>
                </View>
            </View>
        </View>
    )
}

export default memo(AnnouncementBox)
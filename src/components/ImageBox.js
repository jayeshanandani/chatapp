import React, { memo, useState } from 'react'
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import moment from 'moment'

import enums from '@constants/Enum'
import ConfiguredStyle from '@constants/Variables'

import ImageModal from '@components/ImageModal'
import WSImage from '@components/WSImage'

import common from '@styles/common'
import ChatStyle from '@styles/ChatStyle'

const pageStyle = StyleSheet.create({
    rightSide: {
        marginVertical: ConfiguredStyle.size.s3,
        marginHorizontal: ConfiguredStyle.margin.sm,
        justifyContent: enums.END,
        alignItems: enums.END,
        padding: ConfiguredStyle.padding.xsm,
    },
    leftSide: {
        marginVertical: ConfiguredStyle.size.s3,
        marginHorizontal: ConfiguredStyle.margin.sm,
        justifyContent: enums.START,
        alignItems: enums.START,
        padding: ConfiguredStyle.padding.xsm,
    },
    timePositionImage: {
        fontSize: ConfiguredStyle.fonts.xssm,
        color: ConfiguredStyle.colors.grey.light,
        marginRight: ConfiguredStyle.size.s5,
        marginVertical: ConfiguredStyle.size.s3,
        alignSelf: 'flex-end'
    },
})

const ImageBox = (props) => {
    const {
        sender,
        url,
        item,
        onLongPress
    } = props

    const [imageModal, setImageModal] = useState(false);
    const [modalImage, setModalImage] = useState('');

    function setImageModalVisible(data) {
        setImageModal(data)
    }

    function openImageModal(url) {
        setImageModalVisible(true)
        console.log("let data", url);
        
        setModalImage(url)
    }

    return (
        <View>
            <TouchableWithoutFeedback onPress={() => openImageModal(item.metadata[0].large)} onLongPress={onLongPress}>
                <View
                    style={[
                        (sender) ? pageStyle.rightSide : pageStyle.leftSide,
                        (sender) ? common.senderBackColor : common.receiverBackColor,
                        ChatStyle.chatBubble
                    ]}
                >
                    <Text style={pageStyle.timePositionImage}>{moment(item && item.sentAt).format('LT')}</Text>
                    <WSImage
                        image={{ uri: url }}
                        width={150}
                        height={100}
                        imageStyle={{ borderRadius: 4 }}
                        onPress={() => openImageModal(item.metadata[0].large)}
                    />
                </View>
            </TouchableWithoutFeedback>
            <ImageModal
                visibility={imageModal}
                image={{ uri: modalImage }}
                closeAction={() => setImageModalVisible(false)}
            />
        </View>
    )
}

export default memo(ImageBox)
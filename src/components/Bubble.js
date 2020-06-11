import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { Text, View } from 'react-native'
import moment from 'moment'

import ConfiguredStyle from '@constants/Variables'
import enums from '@constants/Enum'

import WSTouchable from '@components/WSTouchable'

import ChatStyle from '@styles/ChatStyle'
import common from '@styles/common'

const Bubble = (props) => {
  const {
    sender,
    message,
    time,
    messageData,
    loginUserId,
    roomType,
    longPress,
  } = props
  return (
    <View style={(sender) ? ChatStyle.rightSide : ChatStyle.leftSide}>
      <WSTouchable onLongPress={longPress} delayLongPress={20} rippleColor={ConfiguredStyle.colors.rippleColorDark} onPress={() => { }}>
        <View style={[ChatStyle.chatBubble, (sender)
          ? common.senderBackColor
          : common.receiverBackColor]}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            {(roomType === enums.GROUPID && messageData && messageData.sender && messageData.sender.id !== loginUserId)
              ? <View><Text style={ChatStyle.groupSenderName}>{messageData && messageData.sender && messageData.sender.userName}</Text></View>
              : <View />
            }
            <Text style={ChatStyle.timeText}>{moment(time).format('LT')}</Text>
          </View>
          <Text style={ChatStyle.chatText}>{message}</Text>
        </View>
      </WSTouchable>
    </View>
  )
}

Bubble.propTypes = {
  longPress: PropTypes.func,
}

Bubble.defaultProps = {
  longPress: () => { },
}

export default memo(Bubble)
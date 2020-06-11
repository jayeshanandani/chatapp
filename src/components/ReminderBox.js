import React, { memo } from 'react'
import { View, Text, StyleSheet } from 'react-native'

import ConfiguredStyle from '@constants/Variables'
import enums from '@constants/Enum'

import WSIcon from '@components/WSIcon'
import WSTouchable from '@components/WSTouchable'

import common from '@styles/common'

const pageStyle = StyleSheet.create({
  container: {
    backgroundColor: ConfiguredStyle.colors.white,
    width: (ConfiguredStyle.dimensions.fullWidth - 100),
    alignSelf: enums.START,
    marginVertical: ConfiguredStyle.size.s3,
    borderRadius: 10,
    marginLeft: 10,
    borderWidth: ConfiguredStyle.opacity.sm,
    borderColor: ConfiguredStyle.colors.grey.light,
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
    marginVertical: ConfiguredStyle.margin.md,
    color: ConfiguredStyle.colors.primary,
    fontSize: ConfiguredStyle.size.s35,
  },
  content: {
    flex: 1,
    marginLeft: ConfiguredStyle.margin.sm,
  },
  time: {
    position: 'absolute', top: 10, right: 10, color: ConfiguredStyle.colors.grey.medium, fontSize: 10,
  },
  title: {
    paddingTop: 20, color: 'black', fontWeight: 'bold', fontSize: 15,
  },
  description: { color: ConfiguredStyle.colors.grey.dark, fontSize: 10 },
  acceptButton: {
    flex: ConfiguredStyle.flex.one, borderRightWidth: 1, borderTopWidth: 1, paddingVertical: 10, borderRightColor: ConfiguredStyle.colors.grey.lightLine, borderTopColor: ConfiguredStyle.colors.grey.lightLine,
  },
  acceptText: { textAlign: 'center', color: ConfiguredStyle.colors.primary, fontWeight: 'bold' },
  rejectText: { textAlign: 'center', color: '#FF6347', fontWeight: 'bold' },
  rejectButton: {
    flex: ConfiguredStyle.flex.one, borderTopWidth: 1, paddingVertical: 10, borderTopColor: ConfiguredStyle.colors.grey.lightLine,
  },
})

const ReminderBox = (props) => {
  const {
    title,
    receiveDate,
    remindDate,
    invitee,
    onAccept,
    onReject,
    isSender,
    fromInvite,
  } = props
  return (
    <View style={[isSender ? pageStyle.senderStyle : pageStyle.container, { overflow: 'hidden' }]}>
      <View style={[common.flexDirectionRow, common.ph10]}>
        <WSIcon
          fontFamily={ConfiguredStyle.fontFamily.FAMedium}
          iconStyle={pageStyle.bigIcon}
          iconCode="&#xf2f2;"
        />
        <Text style={pageStyle.time}>{receiveDate}</Text>
        <View style={pageStyle.content}>
          <Text style={pageStyle.title}>{title}</Text>
          <Text style={pageStyle.description}>{remindDate}</Text>
          {isSender ? (
            <Text style={pageStyle.description}>You send reminder invitation</Text>
          ) : (
            <Text style={pageStyle.description}>
              {invitee}
              {' '}
              is sent you reminder invitation
            </Text>
          )}
        </View>
      </View>
      {(fromInvite && !isSender) && (
        <View style={{ flexDirection: 'row' }}>
          <WSTouchable onPress={onAccept} rippleColor={ConfiguredStyle.colors.rippleColorDark} style={{ flex: 1 }}>
            <View style={pageStyle.acceptButton}>
              <Text style={pageStyle.acceptText}>Accept</Text>
            </View>
          </WSTouchable>
          <WSTouchable onPress={onReject} rippleColor={ConfiguredStyle.colors.rippleColorDark} style={{ flex: 1 }}>
            <View style={pageStyle.rejectButton}>
              <Text style={pageStyle.rejectText}>Reject</Text>
            </View>
          </WSTouchable>
        </View>
      )}
    </View>
  )
}

export default memo(ReminderBox)
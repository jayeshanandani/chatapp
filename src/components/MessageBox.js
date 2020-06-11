import React, { PureComponent } from 'react'
import {
	Text,
	View,
	StyleSheet,
	TouchableOpacity,
} from 'react-native'
import { connect } from 'react-redux'
import moment from 'moment'

import enums from '@constants/Enum'
import ConfiguredStyle from '@constants/Variables'

import { showMessageInfo } from '@redux/chat/actions'
import { acceptReminder } from '@redux/reminder/actions'

import { isEmptyObj } from '@helper/GenericFunction'

import Bubble from '@components/Bubble'
import ReminderBox from '@components/ReminderBox'
import AnnouncementBox from '@components/AnnouncementBox'
import WSIcon from '@components/WSIcon'
import ImageBox from '@components/ImageBox'
import AudioBox from '@components/AudioBox'

import common from '@styles/common'

const chatStyle = StyleSheet.create({
	systemMessage: {
		backgroundColor: ConfiguredStyle.colors.grey.lightColor,
		textAlign: enums.CENTER,
		fontSize: ConfiguredStyle.fonts.xsm,
		paddingVertical: ConfiguredStyle.padding.xsm,
		marginVertical: ConfiguredStyle.size.s3
	},
	checkIcon: {
		fontSize: ConfiguredStyle.fonts.sm,
		color: ConfiguredStyle.colors.primary,
	},
	selectionStyle: {
		position: 'absolute',
		width: '100%',
		top: 3,
		bottom: 3,
		backgroundColor: ConfiguredStyle.colors.primary,
		opacity: 0.2,
		zIndex: 1111,
	}
});

class MessageBox extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {};
	}

	showMessageInfo = (message, sender, index = null) => {
		if (sender && !message.isLoading) {
			this.props.showMessageInfo({
				messageInfo: true,
				messageInfoAudioIndex: index,
				messageToShow: message
			})
		}
	}

	acceptOrRejectReminder = (item, status) => {
		const input = {
			id: item?.reminderInvitation?.id,
			reminder: item?.reminderInvitation?.reminder?.id,
			accepted: status,
			room: item?.reminderInvitation?.room,
			sentAt: item?.sentAt,
			messageId: item?.id
		}
		if (status) {
			item.reminderInvitation.accepted = 1
		} else {
			item.reminderInvitation.rejected = true
		}
		this.props.acceptReminderAction(input)
	}

	renderAnnouncement = (item) => {
		const { loginUser } = this.props
		if (!isEmptyObj(item && item.announcement)) {
			return <AnnouncementBox
				sender={item && item.announcement && item.announcement.creator && item.announcement.creator.userName}
				title={item && item.announcement && item.announcement.title}
				desc={item && item.announcement && item.announcement.announcement}
				date={moment(item && item.sentAt).format('LT')}
				loginUserId={loginUser && loginUser.id}
				senderId={item && item.announcement && item.announcement.creator && item.announcement.creator.id} />
		} else {
			return <Text style={chatStyle.systemMessage}>Announcement is deleted</Text>
		}
	}

	renderInvitationReminderBox = (item, index) => {
		const { loginUser } = this.props
		let reminderInv = item?.reminderInvitation || {};
		return <ReminderBox
			onReject={() => this.acceptOrRejectReminder(item, false)}
			fromInvite={reminderInv?.accepted === 0 && reminderInv?.rejected === false}
			isSender={reminderInv?.inviter?.id === loginUser?.id}
			onAccept={() => this.acceptOrRejectReminder(item, true)}
			invitee={reminderInv?.inviter?.userName}
			title={reminderInv?.reminder?.reminderName}
			receiveDate={moment(reminderInv?.createdAt).format('LT')}
			remindDate={moment(reminderInv?.reminder?.reminderDate).format('llll')}
		/>
	}

	renderReminder = (item) => {
		const { loginUser } = this.props
		let reminder = item.reminder || {};
		return <ReminderBox
			fromInvite={false}
			isSender={reminder?.creator?.id === loginUser?.id}
			invitee={reminder?.creator?.userName}
			title={reminder?.reminderName}
			receiveDate={moment(item.sentAt).format('LT')}
			remindDate={moment(reminder?.reminderDate).format('llll')}
		/>
	}

	renderImage = (url, item, sender) => {
		return (
			<ImageBox
				item={item}
				url={url}
				sender={sender}
				onLongPress={() => showMessageInfo(item, sender)}
			/>
		)
	}

	renderAudio = (audio, index, item, sender) => {
		return (
			<AudioBox
				data={item}
				audio={audio}
				sender={sender}
				currentIndex={index}
				onLongPress={() => this.showMessageInfo(item, sender, index)}
			/>
		)
	}

	renderMessage = () => {
		const { loginUser, data, storedUser, currentIndex } = this.props;

		if (data?.type === enums.SYSTEMID) {
			return (
				<Text style={ChatStyle.systemMessage}>{data?.message}</Text>
			);
		} else if (data?.type === enums.MEDIAID) {
			if (data?.metaType === enums.AUDIOID) {
				return (
					<View style={[common.flexDirectionRow, { alignItems: 'center', justifyContent: (data?.sender?.id === loginUser?.id) ? 'flex-end' : 'flex-start' }]}>
						{this.renderAudio(data?.metadata && data.metadata[0]?.url, currentIndex, data, data?.sender?.id === loginUser?.id)}
					</View>
				);
			}
			if (data?.metaType === enums.IMAGEID) {
				return (
					<View style={[common.flexDirectionRow, { alignItems: 'center', justifyContent: (data?.sender?.id === loginUser?.id) ? 'flex-end' : 'flex-start' }]}>
						{this.renderImage(data?.metadata && data.metadata[0]?.medium, data, data?.sender?.id === loginUser?.id)}
					</View>
				);
			}
		} else if (data?.type === enums.REMINDERID) {
			if (data?.reminderInvitation) {
				return (
					<View style={[common.flexDirectionRow, { alignItems: 'center', justifyContent: (data?.sender?.id === loginUser?.id) ? 'flex-end' : 'flex-start' }]}>
						{this.renderInvitationReminderBox(data, currentIndex)}
					</View>
				);
			} else {
				return (
					<View style={[common.flexDirectionRow, { alignItems: 'center', justifyContent: (data?.sender?.id === loginUser?.id) ? 'flex-end' : 'flex-start' }]}>
						{this.renderReminder(data)}
					</View>
				);
			}
		} else if (data?.type === enums.ANNOUNCEMENTID) {
			return (
				<View style={[common.flexDirectionRow, { alignItems: 'center', justifyContent: (data?.sender?.id === loginUser?.id) ? 'flex-end' : 'flex-start' }]}>
					{this.renderAnnouncement(data)}
				</View>
			);
		}

		return (
			<View style={[common.flexDirectionRow, { alignItems: 'center', justifyContent: (data?.sender?.id === loginUser?.id) ? 'flex-end' : 'flex-start' }]}>
				<Bubble
					longPress={() => this.showMessageInfo(data, data?.sender?.id === loginUser?.id)}
					message={data?.message}
					sender={data?.sender?.id === loginUser?.id}
					time={data?.sentAt}
					messageData={data}
					loginUserId={loginUser?.id}
					roomType={storedUser?.type}
				/>
			</View>
		);
	}

	render() {
		const { data, messageInfo, messageToShow } = this.props
		return (
			<View>
				{this.renderMessage()}
				{messageInfo && messageToShow.id === data?.id && <TouchableOpacity style={chatStyle.selectionStyle} onPress={() => this.props.showMessageInfo({
					messageInfo: false,
					messageInfoAudioIndex: null,
					messageToShow: {}
				})} />}
			</View>
		)
	}
}

const mapStateToProps = state => ({
	loginUser: state.user && state.user.userData,
	storedUser: state.user && state.user.storedUser,
	messageInfo: state.chat && state.chat.messageInfo,
	messageInfoAudioIndex: state.chat && state.chat.messageInfoAudioIndex,
	messageToShow: state.chat && state.chat.messageToShow,
});

const mapDispatchToProps = dispatch => ({
	acceptReminderAction: (value) => dispatch(acceptReminder(value)),
	showMessageInfo: (value) => dispatch(showMessageInfo(value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MessageBox)
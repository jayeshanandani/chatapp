import React, { PureComponent } from 'react'
import { Text, View, Modal, StyleSheet, Dimensions } from 'react-native'
import Slider from '@react-native-community/slider'
import Ionicons from "react-native-vector-icons/Ionicons"
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Sound from "react-native-sound"
import moment from 'moment'

import ConfiguredStyle from '@constants/Variables'
import enums from '@constants/Enum'

import WSContactList from '@container/WSContactList'

import WSIcon from '@components/WSIcon'

import ChatStyle from '@styles/ChatStyle'
import common from '@styles/common'
import styles from '@styles/AppStyle'

const chatStyle = StyleSheet.create({
	modalHeader: {
		flexDirection: enums.ROW,
		backgroundColor: ConfiguredStyle.colors.primary,
		paddingVertical: ConfiguredStyle.padding.xsm,
	},
	modalTitle: {
		flex: 1,
		color: ConfiguredStyle.colors.white,
		textAlign: enums.CENTER,
		paddingTop: ConfiguredStyle.margin.sm,
		fontSize: ConfiguredStyle.fonts.sm,
		marginRight: ConfiguredStyle.margin.lg,
	},
	sendChatStyle: {
		flex: ConfiguredStyle.size.s1,
		borderRadius: ConfiguredStyle.size.s4,
		marginLeft: ConfiguredStyle.size.s45,
		width: ConfiguredStyle.dimensions.fullWidth - 80,
		borderColor: ConfiguredStyle.colors.grey.light,
		justifyContent: enums.SPACE_B,
		alignSelf: enums.END,
		marginBottom: ConfiguredStyle.size.s11,
		backgroundColor: ConfiguredStyle.colors.tertiary,
		paddingVertical: ConfiguredStyle.padding.p12,
		paddingHorizontal: ConfiguredStyle.padding.sm,
	},
	rightSide: {
		marginVertical: ConfiguredStyle.size.s3,
		marginHorizontal: ConfiguredStyle.margin.sm,
		justifyContent: enums.END,
		alignItems: enums.END,
		padding: ConfiguredStyle.padding.xsm,
	},
	card: {
		backgroundColor: ConfiguredStyle.colors.grey.lightest,
		margin: ConfiguredStyle.margin.md,
		padding: ConfiguredStyle.margin.sm,
		borderRadius: ConfiguredStyle.size.s10,
	},
	centerStart: {
		alignItems: 'center',
		justifyContent: 'flex-start'
	},

	//common style
	timePositionImage: {
		fontSize: ConfiguredStyle.fonts.xssm,
		color: ConfiguredStyle.colors.grey.light,
		marginRight: ConfiguredStyle.size.s5,
		marginVertical: ConfiguredStyle.size.s3,
		alignSelf: 'flex-end'
	},
	audioBoxStyle: {
		borderRadius: ConfiguredStyle.size.s4,
		width: ConfiguredStyle.dimensions.fullWidth - 80,
		borderColor: ConfiguredStyle.colors.grey.light,
		justifyContent: enums.SPACE_B,
		marginVertical: ConfiguredStyle.size.s3,
		paddingVertical: ConfiguredStyle.padding.p12,
		paddingHorizontal: ConfiguredStyle.padding.sm,
	},
	timePosition: {
		position: enums.ABSOLUTE,
		fontSize: ConfiguredStyle.fonts.xssm,
		color: ConfiguredStyle.colors.grey.light,
		right: ConfiguredStyle.size.s8,
		top: ConfiguredStyle.size.s3,
	},
	timer: {
		position: enums.ABSOLUTE,
		fontSize: ConfiguredStyle.fonts.xssm,
		color: ConfiguredStyle.colors.grey.medium,
		left: ConfiguredStyle.size.s35,
		bottom: ConfiguredStyle.size.s5,
	},
	checkIcon: {
		fontSize: ConfiguredStyle.fonts.sm,
		color: ConfiguredStyle.colors.primary,
	},
	messageStatus: {
		color: ConfiguredStyle.colors.black,
		fontSize: ConfiguredStyle.fonts.sm,
		fontWeight: '500'
	},
});

class InfoModal extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			playAudio: false,
			isPlaying: false,
			duration: 0,
			playSeconds: 0,
		};
	}

	onSliderValueChange = (value, index) => {
		const sound = `sound${index}`;
		const playSeconds = `playSeconds${index}`;
		this[sound].setCurrentTime(value);
		this.setState({ [playSeconds]: Math.ceil(value) })
	}

	onPlay = (index, audio) => {
		const isPlaying = `isPlaying${index}`;
		const playSeconds = `playSeconds${index}`;
		const stateDynamic = `playAudio${index}`;
		const sound = `sound${index}`;
		if (this.state[isPlaying]) {
			this.onPause(index);
		} else {
			if (this[sound]) {
				this.timeout = setInterval(() => {
					if (this[sound] && this[sound].isLoaded() && this.state[isPlaying]) {
						this[sound].getCurrentTime((seconds, isPlaying) => {
							this.setState({ [playSeconds]: Math.ceil(seconds) });
						})
					}
				}, 1000);
				this[sound].play((success) => this.playComplete(success, index));
				this.setState({ [isPlaying]: true, [stateDynamic]: false });
			} else {
				const prevSound = `sound${(index - 1)}`;
				const prevPlaying = `isPlaying${(index - 1)}`
				if (this[prevSound]) {
					this[prevSound].stop();
					this.setState({ [prevPlaying]: false });
				}
				this[sound] = this.onStartAudio(audio, index);
			}
		}
	}

	onPause = (index) => {
		const sound = `sound${index}`;
		const isPlaying = `isPlaying${index}`;
		if (this[sound]) {
			this[sound].pause();
		}
		this.setState({ [isPlaying]: false });
	}

	playComplete = (success, index) => {
		const sound = `sound${index}`;
		const isPlaying = `isPlaying${index}`;
		const playSeconds = `playSeconds${index}`;
		if (this[sound]) {
			if (success) {
				clearInterval(this.timeout);
				this.setState(prevState => ({ ...prevState, [isPlaying]: false, [playSeconds]: 0 }), () => {
					this[sound].stop();
				});
			}
		}
	}

	onStartAudio = (audio, index) => {
		const stateDynamic = `playAudio${index}`;
		const isPlaying = `isPlaying${index}`;
		const playSeconds = `playSeconds${index}`;
		const sound = `sound${index}`;
		this[sound] = new Sound(audio, "", error => {
			if (error) {
				console.log(error, 'error');
			}
			this.setState({ [isPlaying]: true }, () => {
				this.timeout = setInterval(() => {
					if (this[sound] && this[sound].isLoaded() && this.state[isPlaying]) {
						this[sound].getCurrentTime((seconds, isPlaying) => {
							this.setState({ [playSeconds]: Math.ceil(seconds) });
						})
					}
				}, 1000);
				this[sound].play(success => {
					this.setState({ [stateDynamic]: false, [isPlaying]: false, [playSeconds]: 0 });
					if (!success) {
						alert("There was an error playing this audio");
					}
					this.setState({ [isPlaying]: true, duration: this[sound].getDuration() });
					this.playComplete(success, index);
				});
			})
		});
		return this[sound];
	}

	handleClose = async () => {
		// if (this.state[`isPlaying${audioIndex}`]) {
		// 	await this.onPause(this.props.audioIndex);
		// }
		this.props.closeAction();
	}

	render() {
		const { visible, getRoomDetails, selectedMessage, audioIndex } = this.props;

		const playSecondsInfo = `playSeconds${audioIndex}`;
		var audioTimingInfo = `00:${this.state[playSecondsInfo] <= 9 || !this.state[playSecondsInfo] ? 0 : ''}${this.state[playSecondsInfo] || 0}`;

		return (
			<Modal
				animationType="slide"
				transparent={false}
				visible={visible}
				onRequestClose={this.handleClose}
			>
				<View style={[common.flex1, common.borderColorWhite]}>
					<View style={chatStyle.modalHeader}>
						<WSIcon
							onBtnPress={this.handleClose}
							iconContainer={{ marginLeft: ConfiguredStyle.margin.sm }}
							renderIcon={() => (
								<FontAwesome5 name="arrow-left" size={ConfiguredStyle.fonts.md} color={ConfiguredStyle.colors.white} />
							)}
						/>
						<Text style={chatStyle.modalTitle}>Message Info</Text>
					</View>
					{selectedMessage?.type == enums.TEXTID &&
						<View style={[chatStyle.sendChatStyle, common.flexNone, common.mt20]}>
							<View style={[common.flexDirectionRow]}>
								<View style={[common.flex1, common.pr15]}>
									<Text>{selectedMessage?.message}</Text>
								</View>
								<View>
									<Text style={common.f10}>{moment(selectedMessage?.sentAt).format('LT')}</Text>
								</View>
							</View>
						</View>
					}
					{selectedMessage?.metaType === enums.IMAGEID &&
						<View style={[chatStyle.rightSide, common.senderBackColor, ChatStyle.chatBubble, common.mt20]}>
							<Text style={chatStyle.timePositionImage}>{moment(selectedMessage?.sentAt).format('LT')}</Text>
							<WSImage
								image={{ uri: selectedMessage?.metadata && selectedMessage.metadata[0]?.medium }}
								width={150}
								height={100}
								imageStyle={{ borderRadius: 4 }}
							/>
						</View>
					}
					{selectedMessage?.metaType === enums.AUDIOID &&
						<View style={[chatStyle.audioBoxStyle, common.senderBackColor, common.selfEnd, common.mh10, common.flexDirectionRow, common.mt20]} >
							<Text style={chatStyle.timePosition}>{moment(selectedMessage?.sentAt).format('LT')}</Text>
							<Ionicons
								name={this.state[`isPlaying${audioIndex}`] ? "md-pause" : "md-play"}
								size={ConfiguredStyle.size.s25}
								color={this.state[`playAudio${audioIndex}`] ? "red" : ConfiguredStyle.colors.primary}
								onPress={() => this.onPlay(audioIndex, selectedMessage?.metadata && selectedMessage.metadata[0]?.url)}
							/>
							<View>
								<Slider
									thumbTintColor={ConfiguredStyle.colors.grey.dark}
									value={this.state[playSecondsInfo]}
									maximumValue={(this[`sound${audioIndex}`] && this[`sound${audioIndex}`].getDuration())}
									style={{width: Dimensions.get('window').width - 100}}
									thumbStyle={18}
									onValueChange={value => this[`sound${audioIndex}`] && this.onSliderValueChange(value, audioIndex)}
									onResponderGrant={() => this[`sound${audioIndex}`] && this.onPlay(audioIndex)}
									onResponderRelease={() => this[`sound${audioIndex}`] && this.onPlay(audioIndex)}
								/>
							</View>
							<Text style={chatStyle.timer}>{audioTimingInfo}</Text>
						</View>
					}
					<View style={[styles.borderBottom, common.mh20, common.mt5]} />
					<View style={chatStyle.card}>
						{(selectedMessage?.seen) ?
							(getRoomDetails?.type !== enums.GROUPID) ? (
								<>
									<View style={[common.flexDirectionRow, common.mb10, chatStyle.centerStart]}>
										<WSIcon
											fontFamily={ConfiguredStyle.fontFamily.FAMedium}
											iconStyle={chatStyle.checkIcon}
											iconCode='&#xf4fc;'
										/>
										<Text style={chatStyle.messageStatus}>Read</Text>
									</View>
									<Text style={common.mt5}>{moment(selectedMessage?.seen).calendar()}</Text>
								</>)
								:
								<>
									<View style={[common.flexDirectionRow, chatStyle.centerStart]}>
										<WSIcon
											fontFamily={ConfiguredStyle.fontFamily.FAMedium}
											iconStyle={chatStyle.checkIcon}
											iconCode='&#xf4fc;'
										/>
										<Text style={chatStyle.messageStatus}>Read by</Text>
									</View>
									<WSContactList
										usersList={selectedMessage?.seen}
										showMemberInfo={false}
									/>
									<Text style={common.mt5}>{moment(selectedMessage?.seen).calendar()}</Text>
								</>
							:
							<>
								<View style={[common.flexDirectionRow, common.mb10, chatStyle.centerStart]}>
									<WSIcon
										fontFamily={ConfiguredStyle.fontFamily.FAMedium}
										iconStyle={chatStyle.checkIcon}
										iconCode='&#xf058;'
									/>
									<Text style={chatStyle.messageStatus}>Not read yet</Text>
								</View>
								<Text style={common.mt5}>{moment(selectedMessage?.sentAt).format('LT')}</Text>
							</>
						}
					</View>
				</View>
			</Modal>
		)
	}
}

export default InfoModal;
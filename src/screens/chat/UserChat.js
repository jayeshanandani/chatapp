import React, { Component } from 'react'
import {
	View,
	Text,
	StyleSheet,
	Platform,
	Alert,
	BackHandler,
	KeyboardAvoidingView,
} from 'react-native'
import Voice from '@react-native-community/voice';
import moment from 'moment'
// import { AudioRecorder, AudioUtils } from "react-native-audio"
import uuidv1 from 'uuid/v1'
import ImagePicker from 'react-native-image-picker'
import { connect } from 'react-redux'
import CallDetectorManager from 'react-native-call-detection'
import _ from 'lodash'
import Permissions, { PERMISSIONS } from 'react-native-permissions'
import { Icon } from 'native-base'

import images from '@constants/Image'
import ConfiguredStyle from '@constants/Variables'
import enums from '@constants/Enum'

import { requestFunction, permissionFunction, groupByWithDate } from '@helper/GenericFunction'

import { sendMessage, enterInRoom, showMessageInfo } from '@redux/chat/actions'
import { clearAddRoom, deleteMessageAction, getMedia, storeRoomClear } from '@redux/user/actions'

import WSChatTextBox from '@container/WSChatTextBox'
import WSChatInfo from '@container/WSChatInfo'
import WSTouchable from '@components/WSTouchable'
import WSSnackBar from '@components/WSSnackBar'
import WSHeader from '@components/WSHeader'
import MessageContainer from '@components/MessageContainer'
import Recorder from '@components/Recorder'
import InfoModal from '@components/InfoModal'

import common from '@styles/common'
import styles from '@styles/AppStyle'
import { uploadFile } from '../../helper/httpService';
import Config from 'react-native-config';

const chatStyle = StyleSheet.create({
	headerIconWrapper: {
		height: ConfiguredStyle.size.md,
		width: ConfiguredStyle.size.md,
		borderRadius: 25,
		overflow: 'hidden',
	},
	headerIconContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		height: '100%',
		width: '100%'
	},
})

class UserChat extends Component {
	constructor(props) {
		super(props);
		this.state = {
			user_name: '',
			user_profile: null,
			modalVisible: false,
			dateOfMessages: [],
			audioTime: 0,
			results: [],
			// audioPath: `${AudioUtils.DocumentDirectoryPath}/${uuidv1()}.aac`,
			startAudio: false,
			hasPermission: false,
			recorderOpen: false,
			audioSettings: {
				SampleRate: 22050,
				Channels: 1,
				AudioQuality: "Low",
				AudioEncoding: "aac",
				MeteringEnabled: true,
				IncludeBase64: true,
				AudioEncodingBitRate: 32000
			},
		};
		this.callDetector = undefined;
		this.toastRef = React.createRef();

		Voice.onSpeechStart = this.onSpeechStart;
		Voice.onSpeechRecognized = this.onSpeechRecognized;
		Voice.onSpeechResults = this.onSpeechResults;
	}

	componentDidMount() {
		const { dateOfMessages } = this.state
		const { messages } = this.props
		BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
		this.setState({ user_name: UserChat.renderNameAndImage(this.props, 'name'), user_profile: UserChat.renderNameAndImage(this.props, 'image') })

		if (messages) {
			this.setState({
				// dateOfMessages: messages.reverse(),
				dateOfMessages: groupByWithDate(messages).reverse(),
			}, () => console.log('dateOfMessages:==::==:fromDidMount::', dateOfMessages))
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.messages !== this.props.messages) {
			// this.setState({ dateOfMessages: this.props.messages.reverse() })
			this.setState({ dateOfMessages: groupByWithDate(this.props.messages).reverse() })
		}
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.storedUser) {
			return { user_name: UserChat.renderNameAndImage(nextProps, 'name'), user_profile: UserChat.renderNameAndImage(nextProps, 'image') }
		}
		return {}
	}

	componentWillUnmount() {
		Voice.destroy().then(Voice.removeAllListeners);
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
		console.log('triggering clear store from UserChat....');
		this.props.storeRoomClear();
	}

	handleBackButtonClick = () => {
		const { clearAddRoom, enterInRoom, storedUser, navigation, messageInfo } = this.props
		const { fromPage } = this.props.navigation.state.params;
		const { startAudio } = this.state
		if (messageInfo) {
			this.onScreenTouch();
			return true;
		}
		if (startAudio) {
			this.onStopRecording()
		}
		enterInRoom({ input: { id: storedUser?.id }, action: 'leave' })
		if (fromPage === enums.NEWGROUP || fromPage === enums.NEWCHAT || fromPage === enums.CONTACTLIST) {
			clearAddRoom();
		}
		if (fromPage === enums.HOMEPROFILE || fromPage === enums.NEWGROUP) {
			return navigation.navigate('TabNavigator');
		}
		// closeAllPage();
		navigation.goBack();
		console.log('triggering back from UserChat....');
		return true
	}

	onSpeechStart = () => {
		this.setState({
			started: '√',
		});
	};

	onSpeechRecognized = () => {
		this.setState({
			recognized: '√',
		});
	};

	onSpeechResults = (e) => {
		this.setState({
			results: e.value,
		});
	}

	_requestPermission = (permissionName) => {
		return Permissions.request(permissionName).then(response => {
			return response
		})
	}

	checkPermission() {
		const { hasPermission } = this.state
		var microphonePermission = Platform.select({
			android: PERMISSIONS.ANDROID.RECORD_AUDIO,
			ios: PERMISSIONS.IOS.MICROPHONE,
		})
		this._requestPermission(microphonePermission);
		return Permissions.check(microphonePermission).then(response => {
			if (response === 'granted') {
				if (!hasPermission) {
					this.setState({
						hasPermission: true
					})
					this.openRecorder();
				}
				return true
			} else if (response === 'denied') {
				Alert.alert(
					'Can we access your microphone?',
					'We need access so you can send audio.',
					[
						{
							text: 'No way',
							onPress: () => console.log('Permission denied'),
							style: 'cancel',
						},
						response === 'undetermined'
							? { text: 'OK', onPress: this._requestPermission(microphonePermission) }
							: { text: 'Open Settings', onPress: Permissions.openSettings },
					],
				)
				return false
			}
		})
	}

	pushNewMessage = (msg) => {
		let { dateOfMessages } = this.state;
		let currentDate = moment().format('LL');
		if (dateOfMessages.length > 0) {
			let availability = dateOfMessages.findIndex(data => data.title === currentDate);
			console.log('check availability', availability);
			if (availability === -1) {
				dateOfMessages.push({ title: currentDate, data: [] })
			}
		} else {
			dateOfMessages.push({ title: currentDate, data: [] })
		}
		dateOfMessages[0].data.push(msg);
		this.setState({ dateOfMessages });
	}

	handleAddPicture = async () => {
		const { loginUser } = this.props

		var cameraPermission = Platform.select({
			android: PERMISSIONS.ANDROID.CAMERA,
			ios: PERMISSIONS.IOS.CAMERA,
		})

		await requestFunction(cameraPermission).then(res => {
			if (res == 'denied') {
				permissionFunction();
			}
		});
		await requestFunction(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE).then(res => {
			if (res == 'denied') {
				permissionFunction();
			}
		});
		await requestFunction(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE).then(res => {
			if (res == 'denied') {
				permissionFunction();
			}
		});

		const options = {
			title: "Select Profile Pic",
			mediaType: "photo",
			takePhotoButtonTitle: "Take a Photo",
			allowsEditing: true,
			noData: true
		};
		ImagePicker.showImagePicker(options, response => {
			if (response && response.didCancel) {
				// do nothing
			} else if (response && response.error) {
				// alert error
			} else {
				const { uri, path } = response;
				const extensionIndex = path.lastIndexOf(".");
				const extension = path.slice(extensionIndex + 1);
				const allowedExtensions = ["jpg", "jpeg", "png"];
				const correspondingMime = ["image/jpeg", "image/jpeg", "image/png"];
				const fileName = `${uuidv1()}.${extension}`;
				const file = {
					uri,
					name: fileName,
					type: correspondingMime[allowedExtensions.indexOf(extension)]
				};
				if (!allowedExtensions.includes(extension)) {
					return alert("That file type is not allowed.");
				}
				Alert.alert(
					'Image Upload',
					'Are you sure, you want to upload this image?',
					[
						{
							text: 'No',
							onPress: () => console.log('Cancel Pressed'),
							style: 'cancel',
						},
						{
							text: 'Yes', onPress: async () => {
								const res = await uploadFile(file);
								console.log('response from image upload', res);
								const input = {
									metadata: [
										{
											url: uri,
											small: uri,
											medium: uri,
											large: uri,
										}
									],
									metaType: enums.IMAGEID,
									sender: {
										id: loginUser?.id,
										userName: loginUser?.userName
									}
								}
								let mediaToSend = [{
									bucket: Config.AWS_BUCKET,
									url: fileName,
								}]
								setTimeout(() => {
									this.sendMessage('', enums.IMAGE, mediaToSend, input);
								}, 2000);
							}
						},
					],
					{ cancelable: false },
				);
			}
		});
	};

	_startRecognition = async () => {
		try {
			await Voice.start('en-US');
		} catch (e) {
			console.error(e);
		}
	}

	_stopRecognizing = async () => {
		try {
			await Voice.stop();
		} catch (e) {
			console.error(e);
		}
	};

	openRecorder() {
		const { hasPermission } = this.state
		this.setState({
			recorderOpen: true
		})
		if (!hasPermission) {
			this.checkPermission();
		} else {
			this.handleAudio();
		}
	}

	handleAudio = async () => {
		const { startAudio, audioPath, audioSettings } = this.state
		const { loginUser } = this.props
		// if (!startAudio) {
		// 	this.setState(prevState => ({
		// 		startAudio: !prevState.startAudio,
		// 	}), async () => {
		// 		this.checkPermission().then(async hasPermission => {
		// 			this.setState({ hasPermission });
		// 			if (!hasPermission) {
		// 				this.setState(prevState => ({ startAudio: !prevState.startAudio }));
		// 				return;
		// 			}
		// 			await AudioRecorder.prepareRecordingAtPath(
		// 				audioPath,
		// 				audioSettings
		// 			);
		// 			AudioRecorder.onProgress = data => {
		// 				const floatToInt = Math.floor(data.currentTime)
		// 				this.setState({ audioTime: floatToInt })
		// 			};
		// 			AudioRecorder.onFinished = data => {

		// 			};
		// 			try {
		// 				await AudioRecorder.startRecording();
		// 				this._startRecognition();
		// 			} catch (error) {
		// 				alert(error);
		// 			}
		// 		});
		// 	});
		// } else {
		// 	this.setState(prevState => ({ startAudio: !prevState.startAudio, recorderOpen: false, audioTime: 0 }), async () => {
		// 		await AudioRecorder.stopRecording();
		// 		this._stopRecognizing();
		// 		const { audioPath } = this.state
		// 		const fileName = `${uuidv1()}.aac`;
		// 		const file = {
		// 			uri: Platform.OS === "ios" ? audioPath : `file://${audioPath}`,
		// 			name: fileName,
		// 			type: `audio/aac`
		// 		};
		// 		optionsForBucket.keyPrefix = 'audios/';
		// 		RNS3.put(file, optionsForBucket)
		// 			.progress(event => {
		// 				console.log(event, 'audio');
		// 			})
		// 			.then(response => {
		// 				if (response && response.status !== 201) {
		// 					alert("Something went wrong, and the audio was not uploaded.");
		// 					return;
		// 				}
		// 				const { bucket, key, location } = response.body.postResponse;
		// 				let mediaToSend = {
		// 					bucket,
		// 					path: key,
		// 					url: location,
		// 				}
		// 				this.sendMessage('', 'AUDIO', mediaToSend);
		// 				const input = {
		// 					metadata: [
		// 						{
		// 							url: location,
		// 						}
		// 					],
		// 					metaType: 'AUDIO',
		// 					isLoading: true,
		// 									sentAt: new Date(),
		// 					sender: {
		// 						id: loginUser && loginUser.id,
		// 						userName: loginUser && loginUser.userName
		// 					}
		// 				}
		// 				this.pushNewMessage(input);
		// 			})
		// 			.catch(err => {
		// 				this.toastRef.current.show('Fail to upload audio', 1000);
		// 			});
		// 	});
		// }
	};

	sendMessage = (text, type, mediaToSend, media) => {
		const { storedUser, loginUser, sendMessage } = this.props

		const { id: room } = storedUser;
		//  decided
		if (!type) {
			const input = {
				message: text,
				room,
				type: enums.TEXT,
				localMessageId: uuidv1(),
				sentAt: new Date()
			}
			sendMessage(input);
			let temporaryInput = {
				...input,
				sender: { id: loginUser && loginUser.id, userName: loginUser && loginUser.userName },
			}
			temporaryInput.room = storedUser.room;
			this.pushNewMessage(temporaryInput);
		} else {
			let input = {
				message: type === enums.IMAGE ? 'Shared image' : 'Send a voice note',
				room,
				type: enums.MEDIA,
				media: mediaToSend,
				metaType: type,
				localMessageId: uuidv1(),
				sentAt: new Date()
			}
			sendMessage(input);
			media.message = input.message;
			media.localMessageId = input.localMessageId;
			media.sentAt = input.sentAt;
			media.room = storedUser.room;
			this.pushNewMessage(media);
		}
	}

	onScreenTouch = () => {
		const { messageInfo } = this.props
		if (messageInfo) {
			this.props.showMessageInfo({
				messageInfo: false,
				messageInfoAudioIndex: null,
				messageToShow: {}
			})
		}
	}

	onStopRecording = async () => {
		// await AudioRecorder.stopRecording();
		// this.setState({ startAudio: false, recorderOpen: false });
	}

	setModalVisible(visible) {
		this.setState(prevState => ({ ...prevState, modalVisible: visible }))
	}

	showDeleteAlert = (message) => {
		Alert.alert(
			'',
			'Delete Message ?',
			[
				{
					text: 'Cancel',
					onPress: () => console.log('Cancel Pressed'),
					style: 'cancel',
				},
				{
					text: 'Delete for me', onPress: () => {
						this.deleteMessage(message)
					}
				},
			],
			{ cancelable: false },
		);
	}

	deleteMessage = (message) => {
		const { deleteMessageAction } = this.props
		const { dateOfMessages } = this.state
		const input = { id: message.id };
		deleteMessageAction(input);
		const removeElementFromGroupBy = dateOfMessages.map((item) => {
			return {
				...item,
				data: item && item.data.filter((element) => element.localMessageId !== message.localMessageId)
			}
		})
		this.setState({
			dateOfMessages: removeElementFromGroupBy,
		})
		this.props.showMessageInfo({
			messageInfo: false,
			messageInfoAudioIndex: null,
			messageToShow: {}
		})
	}

	static renderNameAndImage = (nextProps, type) => {
		const { storedUser } = nextProps;
		const { fromPage, userName, thumbnail } = nextProps.navigation.state.params;
		let privateChat = (fromPage === enums.CONTACTLIST || fromPage === enums.NEWCHAT || fromPage === enums.HOMEPROFILE);
		let name;
		let headerImagePath;
		if (type === 'name') {
			if (storedUser?.type !== enums.GROUPID) {
				if (privateChat) {
					name = _.upperFirst(userName)
				} else if (storedUser.roomName === "You") {
					name = 'You'
				} else {
					name = _.upperFirst((storedUser?.members && storedUser.members[0]?.userName) || '')
				}
			} else {
				name = _.upperFirst(storedUser?.roomName)
			}
			return name
		} else if (type === 'image') {
			if (privateChat) {
				headerImagePath = thumbnail ? { uri: thumbnail } : images.avatar
			} else if (fromPage === enums.HOME && storedUser?.type !== enums.GROUPID && storedUser?.members && storedUser.members[0]?.media?.small) {
				headerImagePath = { uri: storedUser.members[0].media.small }
			} else if (storedUser?.type === enums.GROUPID && (storedUser?.icon?.small)) {
				headerImagePath = { uri: storedUser?.icon?.small }
			} else {
				headerImagePath = images.avatar
			}
			return headerImagePath
		}
	}

	checkUserExist = async () => {
		const { storedUser, loginUser } = this.props
		const status = await storedUser?.members?.filter((user) => user?.id === loginUser?.id)
		if (status.length) {
			return true
		} else {
			return false
		}
	}

	async startListenerTapped() {
		var phonePermission = Platform.select({
			android: PERMISSIONS.ANDROID.READ_PHONE_STATE,
		})
		var isGranted = false;
		var isConnected = false;
		// this.callDetector && this.callDetector.dispose();
		await Permissions.request(phonePermission).then(response => {

			if (response === 'granted') {
				isGranted = true;
				this.callDetector = new CallDetectorManager((event) => {
					if (event === 'Connected' || event === 'Offhook') {
						isConnected = true;
						return Alert.alert(
							"",
							"Can't record voice message during a phone call.",
							[
								{ text: 'OK', onPress: () => this.stopListenerTapped() }
							],
						);
					}
				},
					false,
					() => { },
					{
						title: 'Phone State Permission',
						message: 'This app needs access to your phone state in order to react and/or to adapt to incoming calls.'
					});
				if (this.callDetector !== undefined) {
					if (isGranted && !isConnected) {
						this.openRecorder();
						this.stopListenerTapped();
					}
				}
			}
		});
	}

	stopListenerTapped() {
		this.callDetector && this.callDetector.dispose();
		this.callDetector = undefined;
	}

	renderRightIcon = () => {
		const { messageInfo, messageToShow } = this.props;
		const { modalVisible } = this.state;
		if (messageInfo) {
			return (
				<View style={[common.flexDirectionRow, common.exactCenter]}>
					<View style={chatStyle.headerIconWrapper}>
						<WSTouchable
							rippleColor={ConfiguredStyle.colors.rippleColor}
							style={chatStyle.headerIconContainer}
							onPress={() => {
								this.setState({ selectedMessage: messageToShow })
								this.setModalVisible(!modalVisible)
							}}
						>
							<Icon type='Ionicons' name='ios-information-circle-outline' style={{ color: '#000', fontSize: 28 }} />
						</WSTouchable>
					</View>
					<View style={chatStyle.headerIconWrapper}>
						<WSTouchable
							rippleColor={ConfiguredStyle.colors.rippleColor}
							style={chatStyle.headerIconContainer}
							onPress={() => this.showDeleteAlert(messageToShow)}
						>
							<Icon type='EvilIcons' name='trash' style={{ color: '#000', fontSize: 35 }} />
						</WSTouchable>
					</View>
				</View>
			)
		} else {
			return <View />;
		}
	}

	renderMessages = () => {
		const { storedUser } = this.props;
		const { dateOfMessages } = this.state;
		if (dateOfMessages && dateOfMessages.length > 0) {
			console.log(dateOfMessages, 'dateOfMessagesdateOfMessages')
			return <MessageContainer data={dateOfMessages} />
		} else if (storedUser?.roomName === "You") {
			return <WSChatInfo />
		} else {
			return <View style={common.flex1} />
		}
	}

	renderFooter = () => {
		const { storedUser } = this.props;
		const { fromPage } = this.props.navigation.state.params;
		const { results, recorderOpen, hasPermission, audioTime } = this.state;
		if (recorderOpen && hasPermission) {
			return (
				<Recorder
					audioTime={audioTime}
					onStopRecording={this.onStopRecording}
					handleAudio={this.handleAudio}
				/>
			)
		} else if (storedUser?.type === enums.GROUPID && !this.checkUserExist()) {
			return <Text style={styles.removeMessage}>You are removed from this group.</Text>
		} else {
			return (
				<WSChatTextBox
					sendMessage={this.sendMessage}
					fromPage={fromPage}
					handleAudio={() => this.startListenerTapped()}
					handleImage={this.handleAddPicture}
					audioText={results.length ? results[0] : ''}
				/>
			)
		}
	}

	render() {
		const { storedUser, getMedia, navigation } = this.props
		const { fromPage } = this.props.navigation.state.params;
		const { user_name, user_profile, modalVisible, selectedMessage, messageInfoAudioIndex } = this.state

		return (
			<KeyboardAvoidingView
				style={{ flexGrow: 1 }}
				behavior={Platform.OS === "ios" ? 'padding' : ''}
			>
				<View style={[common.flex1, { backgroundColor: 'white' }]}>
					<WSHeader
						userName={user_name}
						imageSrc={user_profile}
						isThumbnail={true}
						onClickName={() => {
							getMedia();
							navigation.navigate('HomeProfile', { page: fromPage });
						}}
						enableBack
						onLeftMethod={this.handleBackButtonClick}
						chatScreen
						renderRightIcon={this.renderRightIcon}
					/>
					{this.renderMessages()}
					{this.renderFooter()}
					<InfoModal
						visible={modalVisible}
						selectedMessage={selectedMessage}
						audioIndex={messageInfoAudioIndex}
						getRoomDetails={storedUser}
						closeAction={() => {
							this.onScreenTouch();
							this.setModalVisible(!modalVisible)
						}}
					/>
					<WSSnackBar ref={this.toastRef} />
				</View>
			</KeyboardAvoidingView>
		);
	}
}

const mapStateToProps = state => ({
	loginUser: state.user?.userData,
	messages: state.chat?.messages,
	storedUser: state.user?.storedUser,
	messageInfo: state.chat?.messageInfo,
	messageInfoAudioIndex: state.chat?.messageInfoAudioIndex,
	messageToShow: state.chat?.messageToShow,
});

const mapDispatchToProps = dispatch => ({
	getMedia: () => dispatch(getMedia()),
	sendMessage: value => dispatch(sendMessage(value)),
	clearAddRoom: () => dispatch(clearAddRoom()),
	deleteMessageAction: (value) => dispatch(deleteMessageAction(value)),
	enterInRoom: (data) => dispatch(enterInRoom(data)),
	showMessageInfo: (value) => dispatch(showMessageInfo(value)),
	storeRoomClear: () => dispatch(storeRoomClear()),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserChat)
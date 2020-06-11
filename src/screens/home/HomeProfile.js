import React, { Component } from 'react'
import {
	View,
	Text,
	ScrollView,
	TouchableWithoutFeedback,
	StyleSheet,
	BackHandler,
	Alert
} from 'react-native'
import uuid from 'uuid'
import { connect } from 'react-redux'
import _ from 'lodash'
import ImagePicker from 'react-native-image-picker'
import uuidv1 from 'uuid/v1'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'

import enums from '@constants/Enum'
import images from '@constants/Image'
import Typography from '@constants/Typography'
import ConfiguredStyle from '@constants/Variables'

import { updateGroup, getMediaClear } from '@redux/user/actions'
import {
	removeParticipantFromRoom,
	exitFromGroup,
	addParticipantFromRoom,
} from '@redux/chat/actions'

import { defaultImageMimetype } from '@helper/keysForBucket'

import WithLoader from '@hoc/WithLoader'

import WSContactList from '@container/WSContactList'

import WSHeader from '@components/WSHeader'
import WSImage from '@components/WSImage'
import WSIcon from '@components/WSIcon'
import WSAlert from '@components/WSAlert'
import WSTextBox from '@components/WSTextBox'
import WSButton from '@components/WSButton'
import WSMenu from '@components/WSMenu'
import WSSnackBar from '@components/WSSnackBar'
import WSImageList from '@components/WSImageList'

import common from '@styles/common'
import styles from '@styles/AppStyle'
import { uploadFile } from '../../helper/httpService'
import Config from 'react-native-config'

const pageStyle = StyleSheet.create({
	shadow: {
		borderColor: ConfiguredStyle.colors.white,
		elevation: 4,
		shadowColor: ConfiguredStyle.colors.pureBlack,
		shadowOpacity: 0.2,
		shadowOffset: {
			width: 0,
			height: 4,
		}
	},
	borderStyle: {
		borderBottomWidth: 1,
		borderBottomColor: ConfiguredStyle.colors.grey.lightest
	},
	name: {
		fontSize: ConfiguredStyle.fonts.f18,
		color: ConfiguredStyle.colors.primary,
		fontWeight: 'bold'
	},
	PhoneText: {
		fontSize: ConfiguredStyle.fonts.sm,
		color: ConfiguredStyle.colors.black,
	},
	editIcon: {
		color: ConfiguredStyle.colors.black,
		fontSize: ConfiguredStyle.fonts.f18,
	},
	imageIconContainer: {
		position: enums.ABSOLUTE,
		zIndex: 1111,
		bottom: ConfiguredStyle.size.s10,
		right: ConfiguredStyle.size.s10,
	},
	containerStyle: {
		backgroundColor: ConfiguredStyle.colors.black,
	},
	exitGroupContainer: {
		flexDirection: enums.ROW,
		marginTop: ConfiguredStyle.padding.p15,
		alignItems: enums.CENTER
	},
	exitText: {
		color: ConfiguredStyle.colors.primary,
		fontSize: ConfiguredStyle.fonts.f18,
		marginLeft: ConfiguredStyle.margin.md
	},
	iconRound: {
		backgroundColor: ConfiguredStyle.colors.primary,
		borderRadius: ConfiguredStyle.size.md,
	},
})

let that;
class HomeProfile extends Component {
	constructor(props) {
		super(props)
		this.state = {
			phoneNumber: '',
			modalVisible: false,
			username: uuid(),
			groupName: '',
			blockLabel: false,
		}
		this.toastRef = React.createRef();
	}

	handleBackButtonClick = async () => {
		const { getMediaClear, navigation } = this.props
		await getMediaClear();
		return navigation.goBack()
	}

	componentDidMount() {
		that = this;
		BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		const { roomUpdated, updateErrorFlag, exitSuccess, updateError } = nextProps;
		if (exitSuccess && roomUpdated) {
			console.log('triggering back from HomeProfile....');
			that.handleBackButtonClick()
		}
		if (roomUpdated) {
			that.toastRef.current.show('Group Updated successfully', 1000);
		}
		if (updateErrorFlag) {
			that.toastRef.current.show(updateError, 1000);
		}
	}

	showBlockAlert = () => {
		const { storedUser } = this.props
		alert('Work In Process')
		// Alert.alert(
		// 	`Block ${storedUser?.members && storedUser.members[0]?.userName} ? Blocked contacts will no longer be able send you messages.`,
		// 	[
		// 		{
		// 			text: 'Cancel',
		// 			onPress: () => console.log('Cancel Pressed'),
		// 			style: 'cancel',
		// 		},
		// 		{
		// 			text: 'Block', onPress: () => {
		// 				this.blockUser();
		// 			}
		// 		},
		// 	],
		// 	{ cancelable: false },
		// );
	}

	blockUser = () => {
		this.setState({
			blockLabel: true
		})
		// const input = {
		// 	id: storedUser?.id,
		// 	action: enums.BLOCK_USER,
		// 	user: storedUser?.members && storedUser.members[0]?.id,
		// 	// type: enums.GROUP,
		// }
		// updateGroup(input);
	}

	setModalVisible(visible, name) {
		this.setState(prevState => ({ ...prevState, modalVisible: visible, groupName: name }))
	}

	onGroupNameUpdate = () => {
		const { groupName, modalVisible } = this.state
		const { updateGroup, storedUser } = this.props

		const data = { id: storedUser?.id, action: enums.ROOM_TITLE, roomName: groupName, type: enums.GROUP }
		updateGroup(data)
		this.setModalVisible(!modalVisible)
	}

	onGroupMemberClick = () => {
		console.log('WIP onPress')
	}

	getImageDetailsToUpload = (updatedData) => {
		const { updateGroup, storedUser } = this.props
		let extension;
		if (updatedData?.type) {
		  const extensionIndex = updatedData.path.lastIndexOf(".");
		  extension = updatedData.path.slice(extensionIndex + 1);
		} else {
		  extension = defaultImageMimetype;
		}
		this.setState(prevState => ({ ...prevState, isLoading: true }), async () => {
			const allowedExtensions = ["jpg", "jpeg", "png"];
			const correspondingMime = ["image/jpeg", "image/jpeg", "image/png"];
			const fileName = `${uuidv1()}.${extension}`;
			const file = {
				uri: updatedData.uri,
				name: fileName,
				type: correspondingMime[allowedExtensions.indexOf(extension)],
			};
			const res = await uploadFile(file);
			console.log('response from image upload', res);
			const iconDetails = {
				bucket: Config.AWS_BUCKET,
				url: fileName,
			}
			const data = { id: storedUser?.id, action: enums.ICON, icon: iconDetails, type: enums.GROUP }
			updateGroup(data);
			this.setState({ isLoading: false });
		});
	}

	selectPhotoTapped = () => {
		const options = {
			quality: 1,
			maxWidth: ConfiguredStyle.size.s500,
			maxHeight: ConfiguredStyle.size.s500,
			storageOptions: {
				skipBackup: true,
			},
		};

		ImagePicker.showImagePicker(options, (response) => {
			if (response && response.didCancel) {
				console.log('User cancelled photo picker');
			} else if (response && response.error) {
				console.log('ImagePicker Error: ', response.error);
			} else if (response && response.customButton) {
				console.log('User tapped custom button: ', response.customButton);
			} else {
				let source = { uri: response && response.uri };
				this.getImageDetailsToUpload(response);
			}
		});
	}

	onExit = async () => {
		const { updateGroup, storedUser, exitFromGroup } = this.props
		const data = { id: storedUser?.id, action: enums.LEAVE_GROUP, type: enums.GROUP }
		Alert.alert(
			'Exit group',
			`Exit from ${storedUser?.roomName} group ?`,
			[
				{
					text: 'Cancel',
					onPress: () => console.log('Cancel Pressed'),
					style: 'cancel',
				},
				{
					text: 'OK', onPress: () => {
						updateGroup(data)
						exitFromGroup(storedUser?.id)
					}
				},
			],
			{ cancelable: false },
		);
	}

	onPassProp = (data) => {
		if (data.length) {
			const { storedUser, updateGroup, addParticipantFromRoom } = this.props
			const filterData = _.xorWith(data, storedUser?.members, _.isEqual);
			const getUserID = filterData.map((item) => {
				return item?.id
			})
			const values = { id: storedUser?.id, action: enums.ADD_PARTICIPANTS, users: getUserID, type: enums.GROUP }
			updateGroup(values)
			addParticipantFromRoom(data)
		}
	}

	onClickAdd = async () => {
		const { storedUser, navigation } = this.props
		navigation.navigate('AddPeople', { onPassProp: this.onPassProp, passSelectedData: storedUser?.members })
	}

	removeParticipant = (id) => {
		const { updateGroup, storedUser, removeParticipantFromRoom } = this.props
		const input = { id: storedUser?.id, action: enums.REMOVE_PARTICIPANTS, users: [id], type: enums.GROUP }
		updateGroup(input);
		removeParticipantFromRoom(id);
	}

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
	}

	renderData = (type) => {
		const { storedUser } = this.props
		const { page } = this.props.navigation.state.params;
		let image;
		let name;
		let email;
		let phoneNumber;
		if (page === enums.CONTACTLIST || page === enums.NEWCHAT || page === enums.HOMEPROFILE) {
			if (storedUser?.members && storedUser.members[0]?.media?.large) {
				image = { uri: storedUser.members[0].media.large };
			} else {
				image = images.avatar;
			}
			name = storedUser?.members && storedUser.members[0]?.userName || '';
			email = storedUser?.members && storedUser.members[0]?.email || '';
			phoneNumber = storedUser?.members && storedUser.members[0]?.phoneNumber || '';
		} else if (page === enums.HOME) {
			if (storedUser?.type === enums.PRIVATEID && storedUser?.members && storedUser.members[0]?.media?.large) {
				image = { uri: storedUser.members[0].media.large }
				name = storedUser?.roomName;
			} else if (storedUser?.icon?.large) {
				image = { uri: storedUser.icon.large }
				name = storedUser?.roomName;
			} else {
				image = images.avatar
			}
			email = storedUser?.members && storedUser.members[0]?.email
			phoneNumber = storedUser?.members && storedUser.members[0]?.phoneNumber
		} else if (page === enums.NEWGROUP) {
			name = storedUser?.roomName
			image = storedUser?.icon?.large ? { uri: storedUser.icon.large } : images.avatar
			email = ''
			phoneNumber = ''
		}
		if (type === 'name') {
			return _.upperFirst(name)
		} else if (type === 'image') {
			return image
		} else if (type === 'email') {
			return email
		} else if (type === 'phoneNumber') {
			return phoneNumber
		}
	}

	render() {
		const { user, storedUser, loader, media, navigation } = this.props
		const { modalVisible, isLoading, blockLabel, groupName } = this.state
		const menus = [
			{
				label: 'Report',
				onPress: () => alert('Work In Process')
			},
			{
				label: blockLabel ? 'Unblock' : 'Block',
				onPress: () => this.showBlockAlert()
			}
		];
		var mediaData = [];
		console.log('get media home profile', media);
		if (media?.length > 0) {
			mediaData = media.slice(0, 5);
		}
		return (
			<WithLoader
				spinner={isLoading || loader}>
				<View style={[common.flex1, { backgroundColor: 'white' }]}>
					<View style={pageStyle.shadow}>
						<View>
							<WSImage
								image={this.renderData('image')}
								height={(ConfiguredStyle.dimensions.fullHeight / 2) - 100}
							/>
							{(storedUser?.type === enums.GROUPID) && (
								<View style={pageStyle.imageIconContainer}>
									<WSButton
										style={pageStyle.iconRound}
										height={ConfiguredStyle.size.md}
										width={ConfiguredStyle.size.md}
										contentStyle={{paddingLeft: 5}}
										compact
										onBtnPress={this.selectPhotoTapped}
										icon={({ size, color }) => (
											<AntDesign name={'form'} size={ConfiguredStyle.fonts.md} color={color} style={{width: ConfiguredStyle.fonts.md}} />
										)}
									/>
								</View>
							)}
						</View>
						{storedUser?.type === enums.GROUPID || (storedUser?.roomName === 'You') ? (
							<WSHeader
								enableBack
								onLeftMethod={this.handleBackButtonClick}
								style={styles.transparentHeader}
								removeShadow
								leftIconStyle={{ backgroundColor: ConfiguredStyle.colors.opacity.black_op_0 }}
							/>
						) : (
								<WSHeader
									enableBack
									onLeftMethod={this.handleBackButtonClick}
									renderRightIcon={() => <WSMenu data={menus}
										rightIcon={images.menu}
										rightIconStyle={{ backgroundColor: ConfiguredStyle.colors.opacity.black_op_0 }}
									/>}
									style={styles.transparentHeader}
									removeShadow
									leftIconStyle={{ backgroundColor: ConfiguredStyle.colors.opacity.black_op_0 }}
								/>
							)}
					</View>
					<WSAlert
						title='Enter new name'
						visibility={modalVisible}
						closeAction={() => { this.setModalVisible(!modalVisible) }}>
						<View style={common.mv20}>
							<WSTextBox
								viewStyle={common.mt0}
								changeText={text => this.setState(prevState => ({ ...prevState, groupName: text }))}
								value={groupName}
							/>
						</View>
						<WSButton
							name="Done"
							onBtnPress={this.onGroupNameUpdate}
						/>
					</WSAlert>
					<ScrollView showsVerticalScrollIndicator={false}>
						<View style={[common.flex2, common.p20]}>
							<View style={[common.flex1, common.flexDirectionRow, common.spaceBetween, common.alignItemCenter, common.pv10, common.mb10, pageStyle.borderStyle]}>
								<Text style={pageStyle.name}>
									{this.renderData('name')}
								</Text>
								{(storedUser?.type === enums.GROUPID) && <WSIcon
									fontFamily={ConfiguredStyle.fontFamily.FAMedium}
									iconStyle={pageStyle.editIcon}
									iconCode="&#xf304;"
									rippleColor={ConfiguredStyle.colors.rippleColorDark}
									onBtnPress={() => this.setModalVisible(true, this.renderData('name'))}
								/>}
							</View>
							{(storedUser?.type === enums.GROUPID) ?
								<>
									<Text>{storedUser?.members && storedUser.members.length} participant</Text>
									<Text>Created by {(storedUser?.admin && storedUser.admin.id === user && user.id) ? 'You' : storedUser?.admin && storedUser.admin.userName}</Text>
								</>
								:
								<>
									<View style={[common.flexDirectionRow, common.alignItemCenter, common.mb5, common.mt5]}>
										<AntDesign name={'phone'} size={ConfiguredStyle.fonts.md} color={ConfiguredStyle.colors.grey.medium} style={common.pr10} />
										<Text style={Typography.h2}>{`: \t\t`}{this.renderData('phoneNumber')}</Text>
									</View>
									<View style={[common.flexDirectionRow, common.alignItemCenter, common.mb5, common.mt5]}>
										<AntDesign name={'mail'} size={ConfiguredStyle.fonts.md} color={ConfiguredStyle.colors.grey.medium} style={common.pr10} />
										<Text style={Typography.h2}>{`: \t\t`}{this.renderData('email')}</Text>
									</View>
								</>}
							<View style={[common.mt20, common.pt20, common.pb10, pageStyle.borderStyle]}>
								<Text style={[Typography.h3, { fontWeight: 'bold', color: ConfiguredStyle.colors.grey.medium }]}>Shared Media</Text>
							</View>
							<WSImageList
								horizontal
								renderList={mediaData}
								style={[common.flex1, pageStyle.borderStyle]}
								contentContainerStyle={[common.pt15, common.pb15]}
								navigation={navigation}
							/>
							{(storedUser?.type === enums.GROUPID) && <>
								<View style={[common.mt20, common.pt20, common.pb10]}>
									<Text style={[Typography.h3, { fontWeight: 'bold', color: ConfiguredStyle.colors.grey.medium }]}>Group Members</Text>
								</View>
								{(storedUser?.admin?.id === user.id) &&
									<>
										<TouchableWithoutFeedback onPress={this.onClickAdd}>
											<View style={pageStyle.exitGroupContainer}>
												<WSButton
													style={pageStyle.iconRound}
													height={ConfiguredStyle.size.md}
													width={ConfiguredStyle.size.md}
													contentStyle={{paddingHorizontal: 0}}
													compact
													onBtnPress={this.onClickAdd}
													icon={({ size, color }) => (
														<Ionicons name={'md-add'} size={ConfiguredStyle.fonts.f25} color={color} style={{width: ConfiguredStyle.fonts.f25}} />
													)}
												/>
												<Text style={pageStyle.exitText}>Add participant</Text>
											</View>
										</TouchableWithoutFeedback>

										<View style={[pageStyle.borderStyle, common.mt10]} />
									</>
								}
								<WSContactList
									usersList={storedUser?.members}
									showMemberInfo={true}
									loggedInUser={user && user.id}
									onBtnPress={this.onGroupMemberClick}
									navigation={navigation}
									removeUserFunc={this.removeParticipant}
								/>
								<View style={[pageStyle.borderStyle]} />
								<TouchableWithoutFeedback onPress={this.onExit}>
									<View style={pageStyle.exitGroupContainer}>
										<WSButton
											style={pageStyle.iconRound}
											height={ConfiguredStyle.size.md}
											width={ConfiguredStyle.size.md}
											contentStyle={{paddingHorizontal: 0}}
											compact
											onBtnPress={this.onExit}
											icon={({ size, color }) => (
												<Ionicons name={'ios-log-out'} size={ConfiguredStyle.fonts.f25} color={color} style={{width: ConfiguredStyle.fonts.f25}} />
											)}
										/>
										<Text style={pageStyle.exitText}>Exit group</Text>
									</View>
								</TouchableWithoutFeedback>
							</>
							}
						</View>
					</ScrollView>
				</View>
				<WSSnackBar ref={this.toastRef} />
			</WithLoader>
		);
	}
}

const mapStateToProps = state => (
	{
		user: state.user.userData,
		media: state.user.media,
		loader: state.user.updateGroupLoading,
		storedUser: state.user.storedUser,
		updateErrorFlag: state.user.updateErrorFlag,
		roomUpdated: state.user.roomUpdated,
		updatedGroupIcon: state.user?.storedUser?.icon?.large,
		exitSuccess: state.user.exitSuccess,
		updateError: state.user.updateError,
	}
);

const mapDispatchToProps = dispatch => (
	{
		updateGroup: value => dispatch(updateGroup(value)),
		getMediaClear: () => dispatch(getMediaClear()),
		removeParticipantFromRoom: value => dispatch(removeParticipantFromRoom(value)),
		exitFromGroup: value => dispatch(exitFromGroup(value)),
		addParticipantFromRoom: value => dispatch(addParticipantFromRoom(value)),
	}
);

export default connect(mapStateToProps, mapDispatchToProps)(HomeProfile)
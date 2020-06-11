import React, { PureComponent } from 'react'
import {
	View,
	Text,
	Share,
	StyleSheet,
	FlatList,
	BackHandler,
	TouchableOpacity
} from 'react-native'
import { SwipeRow } from 'native-base'
import moment from 'moment'
import { WebView } from 'react-native-webview'
import { connect } from 'react-redux'
import { getDefaultStyles } from 'react-native-cn-richtext-editor'

import images from '@constants/Image'
import Typography from '@constants/Typography'
import ConfiguredStyle from '@constants/Variables'

import { getAnnouncement, archiveAnnouncement, clearAnnouncementFlags } from '@redux/announcement/actions'

import WSHeader from '@components/WSHeader'
import WSImage from '@components/WSImage'
import WSLoader from '@components/WSLoader'
import WSSnackBar from '@components/WSSnackBar'
import EmptyState from '@components/EmptyState'

import common from '@styles/common'

const pageStyle = StyleSheet.create({
	date: {
		fontSize: ConfiguredStyle.fonts.xssm,
		fontFamily: ConfiguredStyle.fontFamily.FAMedium,
		color: ConfiguredStyle.colors.skyBlue,
		paddingLeft: 10,
	},
	createdBy: {
		fontSize: ConfiguredStyle.fonts.xssm,
		fontFamily: ConfiguredStyle.fontFamily.FAMedium,
		color: ConfiguredStyle.colors.grey.medium,
		paddingLeft: 10,
	},
	boxStyle: {
		width: '100%',
		borderRadius: 5,
		paddingHorizontal: ConfiguredStyle.padding.sm,
		marginLeft: 7,
		backgroundColor: ConfiguredStyle.colors.white,
		elevation: 3,
	},
	iconColorSize: {
		fontSize: ConfiguredStyle.fonts.lg,
		color: ConfiguredStyle.colors.primary,
	},
	resizeStyle: {
		paddingHorizontal: 0,
		paddingVertical: 0
	},
	bigIcon: {
		fontSize: 20,
		color: ConfiguredStyle.colors.white,
		backgroundColor: ConfiguredStyle.colors.primary,
		paddingHorizontal: 10,
		paddingVertical: 5,
		borderRadius: 20,
	},
	shareIcon: {
		fontSize: ConfiguredStyle.size.sm,
		color: ConfiguredStyle.colors.white,
	},
	webViewStyle: {
		height: ConfiguredStyle.size.s40,
		width: '100%',
		marginHorizontal: ConfiguredStyle.margin.xsm,
	},
	iconContainer: {
		marginTop: 60,
		marginLeft: 10
	},
	editContainer: {
		flexDirection: 'row',
		marginLeft: 10,
		marginTop: 10,
	},
	editLabel: {
		fontSize: ConfiguredStyle.fonts.f13,
		fontWeight: '700',
		color: ConfiguredStyle.colors.yellow.dark,
		marginLeft: 5,
	},
	draftContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	draftChip: {
		fontSize: ConfiguredStyle.fonts.xssm,
		fontFamily: ConfiguredStyle.fontFamily.FAMedium,
		color: ConfiguredStyle.colors.white,
		backgroundColor: ConfiguredStyle.colors.yellow.light,
		paddingVertical: 5,
		paddingHorizontal: 15,
		borderRadius: 20,
	},
	fabButtonContainer: {
		position: 'absolute',
		bottom: 10,
		right: 10
	}
})

const defaultStyles = getDefaultStyles();
let customStyles = {
	...defaultStyles, body: { fontSize: 12 }, heading: { fontSize: 12 }
	, title: { fontSize: 12 }, ol: { fontSize: 12 }, ul: { fontSize: 12 }
};

class Announcement extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			active: false,
			isMine: false,
		};
		this.toastRef = React.createRef();
	}

	toggleFab() {
		this.setState((prevState) => ({ ...prevState, active: !prevState.active }));
	}

	componentDidMount() {
		const { getAnnouncement } = this.props
		getAnnouncement();
		BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
	}

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
	}

	handleBackButtonClick = () => {
		const { navigation, componentId } = this.props
		return navigation.goBack(componentId);
	}

	shareAnnouncement = (item) => {
		Share.share({
			message: `Announcement Title: ${item && item.title}, Announcement Description: ${item && item.announcement}`,
		});
	}

	_renderEmptyState = (msg) => {
		return (
			<EmptyState message={msg} image={images.announcementList} margin={200} />
		)
	}

	toggleScreen = () => {
		this.setState(prevState => ({
			isMine: !prevState.isMine
		}))
	}

	archiveAnnouncementAPI = (item) => {
		const { archiveAnnouncement } = this.props
		const input = {
			id: item.id,
			isArchive: true
		}
		archiveAnnouncement(input)
	}

    componentDidUpdate(prevProps, prevState) {
		const { updateAnnouncementSuccess, archiveAnnouncementSuccess, getAnnouncement, clearAnnouncementFlags } = this.props;
		if (!prevProps.updateAnnouncementSuccess && updateAnnouncementSuccess) {
            this.toastRef.current.show('Announcement successfully updated', 2000);
		}
		if (archiveAnnouncementSuccess) {
			clearAnnouncementFlags()
			getAnnouncement()
			this.toastRef.current.show('Announcement successfully deleted', 1000);
		}
	}

	renderItem = ({ item }) => {
		const { loginUserId, navigation } = this.props
		const isOwnAnnouncement = String(loginUserId) === String(item && item.creator && item.creator.id)
		return (item &&
			<SwipeRow
				style={common.bottomWidth0}
				leftOpenValue={50}
				rightOpenValue={-50}
				body={
					<View style={pageStyle.boxStyle}>
						<View style={[common.flexDirectionRow, common.pv15, common.alignStart]}>
							<WSImage
								image={images.announcementList}
								height={ConfiguredStyle.size.s35}
								width={ConfiguredStyle.size.s35}
								resizeMode={'contain'}
								imageStyle={{ backgroundColor: ConfiguredStyle.colors.white, marginTop: 2 }}
							/>
							<View style={{ flex: 1 }}>
								<View style={pageStyle.draftContainer}>
									<Text style={pageStyle.date}>{moment(item && item.date).format('dddd, MMMM D, YYYY @ h:mm A')} EST</Text>
									{/* {isOwnAnnouncement && <Text style={pageStyle.draftChip}>Drafted</Text>} */}
								</View>
								<Text numberOfLines={1} ellipsizeMode='tail' style={[Typography.buttonText, common.w600, common.ph10, common.mb10]}>{item && item.title}</Text>
								{/* <CNRichTextView
									style={common.ph10}
									styleList={customStyles}
									text={item && item.announcement}
								/> */}
								{
									item && item.announcement !== '<p><br></p>' &&
									<WebView
										useWebKit={true}
										scrollEnabled={false}
										source={{ html: item && item.announcement }}
										originWhitelist={["*"]}
										scalesPageToFit
										injectedJavaScript={`const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=0.75'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `}
										style={pageStyle.webViewStyle}
									/>
								}
								<Text style={pageStyle.createdBy}>{isOwnAnnouncement ? 'Created by you' : `Created by ${item && item.creator && item.creator.userName}`}</Text>
								{isOwnAnnouncement &&
									<TouchableOpacity style={pageStyle.editContainer} onPress={() => navigation.navigate('EditAnnouncement', { announcementData: item })}>
										<WSImage
											image={images.edit}
											height={ConfiguredStyle.size.s13}
											width={ConfiguredStyle.size.s13}
											resizeMode={'contain'}
											imageStyle={{ backgroundColor: ConfiguredStyle.colors.white, marginTop: 4 }}
										/>
										<Text style={pageStyle.editLabel}>Edit</Text>
									</TouchableOpacity>}
							</View>
						</View>
					</View>
				}

				left={
					< View style={pageStyle.iconContainer} >
						<WSImage
							image={images.archive}
							height={ConfiguredStyle.size.s35}
							width={ConfiguredStyle.size.s35}
							resizeMode={'contain'}
							imageStyle={{ backgroundColor: ConfiguredStyle.colors.white }}
							onPress={() => this.archiveAnnouncementAPI(item)}
						/>
					</View>
				}

				right={
					< View style={pageStyle.iconContainer} >
						<WSImage
							image={images.share}
							height={ConfiguredStyle.size.s35}
							width={ConfiguredStyle.size.s35}
							resizeMode={'contain'}
							imageStyle={{ backgroundColor: ConfiguredStyle.colors.white }}
							onPress={() => this.shareAnnouncement(item)}
						/>
					</View>
				}
			/>
		)
	}

	render() {
		const { getAnnouncementList, loader, navigation, loginUserId } = this.props
		const { isMine } = this.state
		const nonArchiveAnnouncementList = getAnnouncementList && getAnnouncementList.filter(item => item.isArchive === false)
		const ownAnnouncements = nonArchiveAnnouncementList && nonArchiveAnnouncementList.filter(item => String(loginUserId) === String(item && item.creator && item.creator.id))
		return (
			<View style={[common.flex1, common.bgWhite]}>
				<WSHeader
					name={isMine ? "My Announcements" : "Announcements"}
					enableBack
					rightText={isMine ? "View All" : "View Mine"}
					rightTextPress={this.toggleScreen}
					onLeftMethod={this.handleBackButtonClick}
				/>
				<FlatList
					showsVerticalScrollIndicator={false}
					style={{ marginHorizontal: 20 }}
					data={isMine ? ownAnnouncements : nonArchiveAnnouncementList}
					renderItem={this.renderItem}
					extraData={this.props}
					keyExtractor={(item, index) => 'announcement_' + index}
					ListEmptyComponent={this._renderEmptyState(isMine ? 'No My Announcement Founds' : 'No Announcement Founds')}
				/>
				<View style={pageStyle.fabButtonContainer}>
					<WSImage
						image={images.addNewAnnouncement}
						height={ConfiguredStyle.size.s70}
						width={ConfiguredStyle.size.s70}
						resizeMode={'contain'}
						imageStyle={{ backgroundColor: ConfiguredStyle.colors.white, borderRadius: 30 }}
						onPress={() => navigation.navigate('CreateAnnouncement')}
					/>
				</View>
				{loader && <WSLoader />}
				<WSSnackBar
					ref={this.toastRef}
				/>
			</View>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		getAnnouncementList: state.announcement && state.announcement.getAnnouncementList,
		updateAnnouncementSuccess: state.announcement && state.announcement.updateAnnouncementSuccess,
		archiveAnnouncementSuccess: state.announcement && state.announcement.archiveAnnouncementSuccess,
		loader: state.announcement && state.announcement.getLoading,
		loginUserId: state.user && state.user.userData && state.user.userData.id,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		getAnnouncement: () => dispatch(getAnnouncement()),
		archiveAnnouncement: (value) => dispatch(archiveAnnouncement(value)),
		clearAnnouncementFlags: () => dispatch(clearAnnouncementFlags()),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Announcement)
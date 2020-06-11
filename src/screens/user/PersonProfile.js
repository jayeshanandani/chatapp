import React, { Component } from 'react'
import { View, Text, BackHandler } from 'react-native'
import { connect } from 'react-redux'
import _ from 'lodash'
import moment from 'moment'
import { Thumbnail } from 'native-base'

import Typography from '@constants/Typography'
import images from '@constants/Image'
import ConfiguredStyle from '@constants/Variables'

import WSHeader from '@components/WSHeader'
import WSImage from '@components/WSImage'
import WSMenu from '@components/WSMenu'

import styles from '@styles/AppStyle'
import common from '@styles/common'

class PersonProfile extends Component {

	componentDidMount() {
		BackHandler.addEventListener('hardwareBackPress', this.handleBack);
	}

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', this.handleBack);
	}

	handleBack = () => {
		const { navigation } = this.props
		return navigation.goBack();
	}

	render() {
		const { currentMedia } = this.props.navigation.state.params;
		const { loginUserId } = this.props
		const menus = [
			{
				label: 'Share',
				onPress: () => { }
			},
			{
				label: 'Delete',
				onPress: () => { }
			}
		];
		return (
			<View>
				<WSImage
					image={currentMedia?.metadata && currentMedia.metadata[0]?.large ? { uri: currentMedia.metadata[0].large } : images.avatar}
					height={ConfiguredStyle.dimensions.fullHeight}
					width={ConfiguredStyle.dimensions.fullWidth}
					resizeMode={'contain'}
					imageStyle={{ backgroundColor: ConfiguredStyle.colors.pureBlack }}
				/>
				<WSHeader
					enableBack
					removeShadow
					onLeftMethod={this.handleBack}
					style={styles.transparentHeader}
					reference={ref => { this.ref = ref }}
					renderRightIcon={() => <WSMenu data={menus} rightIcon={images.menu} />}
				/>
				<View style={[common.positionAbsolute, common.ml50, common.flexDirectionRow, common.mt10]}>
					<Thumbnail small source={currentMedia?.sender?.currentMedia?.small ? { uri: currentMedia.sender.currentMedia.small } : images.avatar} />
					<View style={[common.selfCenter, common.ml20]}>
						<Text style={[Typography.PrimaryH1, common.colorWhite]}>{(currentMedia?.sender?.id === loginUserId) ? 'You' : _.upperFirst((currentMedia?.sender?.userName) || (currentMedia?.sender?.givenName))}</Text>
						<Text style={[Typography.h0, common.colorWhite]}>{moment(currentMedia?.sentAt).format('MMM D, YYYY LT')}</Text>
					</View>
				</View>
			</View>
		);
	}
}

const mapStateToProps = state => {
	return {
		loginUserId: state.user?.userData?.id,
		media: state.user?.media,
	}
};

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(PersonProfile);
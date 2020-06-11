import React, { PureComponent } from 'react'
import { Text, View, StyleSheet, TouchableWithoutFeedback, Dimensions } from 'react-native'
import PropTypes from 'prop-types'
import Ionicons from "react-native-vector-icons/Ionicons"
import moment from 'moment'

import ConfiguredStyle from '@constants/Variables'
import enums from '@constants/Enum'

import common from '@styles/common'

const chatStyle = StyleSheet.create({
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
});

class DocBox extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
		};
	}

	componentDidUpdate(prevProps, prevState) {
	}

	render() {
		const { data, audio, onLongPress, sender, currentIndex } = this.props;

		return (
			<TouchableWithoutFeedback onLongPress={onLongPress}>
				<View
					style={[
						chatStyle.audioBoxStyle,
						(sender) ? common.selfEnd : common.selfStart,
						(sender) ? common.senderBackColor : common.receiverBackColor,
						common.mh10,
						common.flexDirectionRow
					]}
				>
					<Text style={chatStyle.timePosition}>{moment(data && data.sentAt).format('LT')}</Text>
					<Ionicons
						name={'ios-document'}
						size={ConfiguredStyle.size.s25}
						color={ConfiguredStyle.colors.primary}
					/>
					<View style={{width: Dimensions.get('window').width - 100}} />
					<Text style={chatStyle.timer}>file name</Text>
				</View>
			</TouchableWithoutFeedback>
		)
	}
}

DocBox.propTypes = {
	data: PropTypes.array,
}

DocBox.defaultProps = {
	data: [],
}

export default DocBox;
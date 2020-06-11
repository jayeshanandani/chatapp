import React from 'react'
import PropTypes from 'prop-types'
import { Text, View, StyleSheet } from 'react-native'

import ConfiguredStyle from '@constants/Variables'
import enums from '@constants/Enum'

import WSIcon from '@components/WSIcon'

import common from '@styles/common'

const chatStyle = StyleSheet.create({
	startRecord: {
		position: enums.ABSOLUTE,
		bottom: ConfiguredStyle.size.none,
		zIndex: 11,
		width: ConfiguredStyle.dimensions.fullWidth,
		backgroundColor: ConfiguredStyle.colors.primary,
		justifyContent: enums.CENTER,
		alignItems: enums.CENTER,
		paddingVertical: ConfiguredStyle.padding.sm,
		elevation: 10,
		shadowColor: ConfiguredStyle.colors.pureBlack,
		shadowOpacity: 0.1,
		shadowOffset: {
			width: 0,
			height: -3,
		}
	},
	closePosition: {
		position: enums.ABSOLUTE,
		top: ConfiguredStyle.size.s10,
		right: ConfiguredStyle.size.s10,
	},
	recordCloseBtn: {
		height: ConfiguredStyle.size.s35,
		width: ConfiguredStyle.size.s35,
		borderRadius: ConfiguredStyle.size.s35
	},
	recordText: {
		color: ConfiguredStyle.colors.primaryTransparent,
		fontSize: ConfiguredStyle.fonts.xsm,
	},
	bigText: {
		color: ConfiguredStyle.colors.white,
		fontSize: ConfiguredStyle.fonts.lg,
		paddingBottom: ConfiguredStyle.padding.xsm,
	},
	icon: {
		fontSize: ConfiguredStyle.size.s35,
		color: ConfiguredStyle.colors.white,
	},
	recordSendBtn: {
		height: ConfiguredStyle.size.s55,
		width: ConfiguredStyle.size.s55,
		borderRadius: ConfiguredStyle.size.s55,
		paddingHorizontal: 0,
		paddingVertical: 0,
		alignItems: 'center',
		justifyContent: 'center'
	},
});

const Recorder = (props) => {
	const {
		audioTime,
		onStopRecording,
		handleAudio,
	} = props
	return (
		<View style={chatStyle.startRecord}>
			<View style={chatStyle.closePosition}>
				<WSIcon
					fontFamily={ConfiguredStyle.fontFamily.FARegular}
					iconStyle={[common.colorWhite, common.f20]}
					iconCode="&#xf00d;"
					onBtnPress={onStopRecording}
					rippleColor={ConfiguredStyle.colors.rippleColor}
					resizeStyle={chatStyle.recordCloseBtn}
				/>
			</View>
			<Text style={chatStyle.recordText}>Recording</Text>
			<Text style={chatStyle.bigText}>{`00:${audioTime <= 9 ? 0 : ''}${audioTime}`}</Text>
			<WSIcon
				fontFamily={ConfiguredStyle.fontFamily.FARegular}
				iconStyle={chatStyle.icon}
				iconCode="&#xf0a9;"
				onBtnPress={handleAudio}
				rippleColor={ConfiguredStyle.colors.rippleColor}
				iconContainer={chatStyle.recordSendBtn}
				resizeStyle={chatStyle.recordSendBtn}
			/>
		</View>
	)
}

Recorder.propTypes = {
	longPress: PropTypes.func,
}

Recorder.defaultProps = {
	longPress: () => { },
}

export default React.memo(Recorder)
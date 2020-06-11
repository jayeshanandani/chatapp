import React, { Component } from 'react'
import { View, TextInput, StyleSheet } from 'react-native'
import { Icon } from 'native-base'

import enums from '@constants/Enum'
import ConfiguredStyle from '@constants/Variables'

import WSIcon from '@components/WSIcon'
import WSTouchable from '@components/WSTouchable'

import common from '@styles/common'

const pageStyle = StyleSheet.create({
	textBox: {
		flex: ConfiguredStyle.flex.one,
		backgroundColor: ConfiguredStyle.colors.grey.lightest,
		borderRadius: ConfiguredStyle.size.s30,
		paddingHorizontal: ConfiguredStyle.padding.md,
		paddingVertical: ConfiguredStyle.padding.sm,
		maxHeight: 120
	},
	buttonView: {
		position: enums.ABSOLUTE,
		right: ConfiguredStyle.size.none,
	},
	icon: {
		fontSize: ConfiguredStyle.fonts.lg,
		color: ConfiguredStyle.colors.primary,
	},
	audioIcon: {
		height: ConfiguredStyle.size.s45,
		width: ConfiguredStyle.size.s45,
		borderRadius: ConfiguredStyle.size.s45,
		overflow: 'hidden'
	},
	sendIcon: {
		fontSize: ConfiguredStyle.fonts.lg,
		color: ConfiguredStyle.colors.primary,
	},
	iconColorSize: {
		fontSize: ConfiguredStyle.fonts.lg,
		color: ConfiguredStyle.colors.grey.medium,
	},
	iconContainer: {
		marginLeft: ConfiguredStyle.margin.xsm,
		marginBottom: ConfiguredStyle.size.s2,
	}
});

class WSChatTextBox extends Component {
	constructor(props) {
		super(props);
		this.state = {
			audioText: '',
			textMessage: ''
		};
	}

	componentWillReceiveProps(nextProps) {
		const { audioText } = nextProps;
		this.setState({
			audioText
		})
	}

	sendMessage = () => {
		const { sendMessage } = this.props
		const { textMessage, audioText } = this.state
		if (audioText) {
			sendMessage(audioText)
			this.setState({
				audioText: ''
			})
		} else {
			sendMessage(textMessage)
		}
		this.setState((prevState) => ({ ...prevState, textMessage: '' }));
	}

	textHandle = (value) => {
		this.setState((prevState) => ({ ...prevState, textMessage: value.charAt(0).replace(/\s/g, '') + value.substr(1) }))
	}

	render() {
		const { textMessage, audioText } = this.state
		const { handleAudio, handleImage, onFocusInput } = this.props
		return (
			<View style={[common.flexDirectionRow, common.pv10, common.mh10, { alignItems: 'flex-end', justifyContent: 'center' }]}>
				<View style={[common.flex1, common.flexDirectionRow, common.exactCenter]}>
					<TextInput
						placeholder='Type or Say Something...'
						placeholderTextColor={ConfiguredStyle.colors.grey.placeholder}
						onChangeText={(text) => this.textHandle(text)}
						value={audioText ? audioText : textMessage}
						style={pageStyle.textBox}
						multiline
						onFocus={onFocusInput}
					/>
					<View style={pageStyle.buttonView}>
						{(textMessage || audioText) ?
							<></>
							:
							<View style={[common.exactCenter, pageStyle.audioIcon]}>
								<WSTouchable
									onPress={handleAudio}
									rippleColor={ConfiguredStyle.colors.rippleColorDark}
									style={[common.exactCenter, { height: '100%', width: '100%' }]}
								>
									<Icon type="FontAwesome5" name="microphone-alt" style={pageStyle.iconColorSize} />
								</WSTouchable>
							</View>
						}
					</View>
				</View>

				{(textMessage || audioText) ?
					<WSIcon
						fontFamily={ConfiguredStyle.fontFamily.FABold}
						iconStyle={pageStyle.sendIcon}
						iconContainer={pageStyle.iconContainer}
						rippleColor={ConfiguredStyle.colors.rippleColorDark}
						onBtnPress={() => this.sendMessage()}
						iconCode='&#xf1d8;'
					/>
					:
					<WSIcon
						fontFamily={ConfiguredStyle.fontFamily.FABold}
						iconStyle={pageStyle.iconColorSize}
						iconContainer={pageStyle.iconContainer}
						onBtnPress={handleImage}
						rippleColor={ConfiguredStyle.colors.rippleColorDark}
						iconCode='&#xf030;'
					/>}
			</View>
		);
	}
}

export default WSChatTextBox
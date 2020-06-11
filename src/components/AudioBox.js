import React, { PureComponent } from 'react'
import { Text, View, StyleSheet, TouchableWithoutFeedback, Dimensions } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'
import Slider from '@react-native-community/slider'
import PropTypes from 'prop-types'
import Ionicons from "react-native-vector-icons/Ionicons"
import Sound from "react-native-sound"
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

class AudioBox extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			isPlaying: false,
			playAudio: false,
			playSeconds: 0,
		};
		this.sound = null;
		this.seconds = 0;
		this.minutes = 0;
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState.playSeconds !== this.state.playSeconds) {
			if (this.seconds < 60) {
				this.seconds++;
			} else {
				this.seconds = 0;
				this.minutes++;
			}
		}
	}

	onSliderValueChange = (value) => {
		this.sound.setCurrentTime(value);
		this.setState({ playSeconds: Math.ceil(value) })
	}

	onPlay = (audio) => {
		if (this.state.isPlaying) {
			if (this.sound) {
				this.sound.pause();
			}
			this.setState({ isPlaying: false });
		} else {
			if (this.sound) {
				this.seconds = 0;
				this.minutes = 0;
				this.timeout = setInterval(() => {
					if (this.sound && this.sound.isLoaded() && this.state.isPlaying) {
						this.sound.getCurrentTime((seconds, isPlaying) => {
							this.setState({ playSeconds: Math.ceil(seconds) });
						})
					}
				}, 1000);
				this.sound.play((success) => this.playComplete(success));
				this.setState({ isPlaying: true, playAudio: false });
			} else {
				if (this.prevSound) {
					this.prevSound.stop();
					this.setState({ prevPlaying: false });
				}
				this.sound = this.onStartAudio(audio);
			}
		}
	}

	playComplete = (success) => {
		if (this.sound) {
			if (success) {
				clearInterval(this.timeout);
				this.setState(prevState => ({ ...prevState, isPlaying: false, playSeconds: 0 }), () => {
					this.sound.stop();
				});
			}
		}
	}

	onStartAudio = (audio) => {
		this.sound = new Sound(audio, "", error => {
			if (error) {
				console.log(error, 'error');
			}
			this.setState({ isPlaying: true }, () => {
				this.timeout = setInterval(() => {
					if (this.sound && this.sound.isLoaded() && this.state.isPlaying) {
						this.sound.getCurrentTime((seconds, isPlaying) => {
							this.setState({ playSeconds: Math.ceil(seconds) });
						})
					}
				}, 1000);
				this.sound.play(success => {
					this.setState({ playAudio: false, isPlaying: false, playSeconds: 0 });
					if (!success) {
						alert("There was an error playing this audio");
					}
					this.setState({ isPlaying: true, duration: this.sound.getDuration() });
					this.playComplete(success);
				});
			})
		});
		return this.sound;
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
					{data && data.isLoading ? (<View style={{ opacity: 0.3 }}>
						<ActivityIndicator animating={true} color={ConfiguredStyle.colors.primary} />
					</View>) : (<Ionicons
						name={this.state.isPlaying ? "md-pause" : "md-play"}
						size={ConfiguredStyle.size.s25}
						color={this.state.stateDynamic ? "red" : ConfiguredStyle.colors.primary}
						onPress={() => this.onPlay(audio)}
					/>)}
					<View>
						<Slider
							thumbTintColor={ConfiguredStyle.colors.grey.dark}
							value={this.state.playSeconds}
							maximumValue={(this.sound && this.sound.getDuration())}
							style={{width: Dimensions.get('window').width - 100}}
							thumbStyle={18}
							onValueChange={value => this.sound && this.onSliderValueChange(value)}
							onResponderGrant={() => this.sound && this.onPlay()}
							onResponderRelease={() => this.sound && this.onPlay()}
						/>
					</View>
					<Text style={chatStyle.timer}>{this.minutes}:{this.seconds}</Text>
				</View>
			</TouchableWithoutFeedback>
		)
	}
}

AudioBox.propTypes = {
	data: PropTypes.array,
}

AudioBox.defaultProps = {
	data: [],
}

export default AudioBox;
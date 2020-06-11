import React, { PureComponent } from 'react'
import {
    StyleSheet,
    View,
    Animated,
    Dimensions,
    Text,
    ViewPropTypes as RNViewPropTypes,
} from 'react-native'
import PropTypes from 'prop-types'

const ViewPropTypes = RNViewPropTypes || View.propTypes

export const DURATION = {
    LENGTH_SHORT: 500,
    FOREVER: 0,
}

const { height } = Dimensions.get('window')

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        right: 0,
        elevation: 999,
        alignItems: 'center',
        zIndex: 10000,
    },
    content: {
        backgroundColor: 'black',
        borderRadius: 5,
        padding: 10,
        margin: 20
    },
    text: {
        color: 'white',
    },
})


export default class WSToast extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            isShow: false,
            text: '',
            opacityValue: new Animated.Value(this.props.opacity),
        }
    }

    show = (text, duration, callback) => {
        const { opacity, fadeInDuration } = this.props
        const { opacityValue } = this.state
        this.duration = typeof duration === 'number' ? duration : DURATION.LENGTH_SHORT
        this.callback = callback
        this.setState(prevState => ({
            ...prevState,
            isShow: !prevState.isShow,
            text,
        }))

        this.animation = Animated.timing(
            opacityValue,
            {
                toValue: opacity,
                duration: fadeInDuration,
            }
        )
        this.animation.start(() => {
            this.isShow = true
            if (duration !== DURATION.FOREVER) this.close()
        })
    }

    close(duration) {
        const { defaultCloseDelay, fadeOutDuration } = this.props
        const { isShow, opacityValue } = this.state
        let delay = typeof duration === 'undefined' ? this.duration : duration

        if (delay === DURATION.FOREVER) delay = defaultCloseDelay || 250

        if (!this.isShow && !isShow) return
        this.timer && clearTimeout(this.timer)
        this.timer = setTimeout(() => {
            this.animation = Animated.timing(
                opacityValue,
                {
                    toValue: 0.0,
                    duration: fadeOutDuration,
                }
            )
            this.animation.start(() => {
                this.setState(prevState => ({
                    ...prevState,
                    isShow: !prevState.isShow,
                }))
                this.isShow = false
                if (typeof this.callback === 'function') {
                    this.callback()
                }
            })
        }, delay)
    }

    componentWillUnmount() {
        this.animation && this.animation.stop()
        this.timer && clearTimeout(this.timer)
    }

    render() {
        const { position, positionValue, style, textStyle } = this.props
        const { isShow, opacityValue, text } = this.state
        let pos
        switch (position) {
            case 'top':
                pos = positionValue
                break
            case 'center':
                pos = height / 2
                break
            case 'bottom':
                pos = height - positionValue
                break
        }

        const view = isShow
            ? (
                <View
                    style={[styles.container, { top: pos }]}
                    pointerEvents="none"
                >
                    <Animated.View
                        style={[styles.content, { opacity: opacityValue }, style]}
                    >
                        {React.isValidElement(text) ? text : <Text style={textStyle}>{text}</Text>}
                    </Animated.View>
                </View>
            ) : null
        return view
    }
}

WSToast.propTypes = {
    style: ViewPropTypes.style,
    position: PropTypes.oneOf([
        'top',
        'center',
        'bottom',
    ]),
    textStyle: Text.propTypes.style,
    positionValue: PropTypes.number,
    fadeInDuration: PropTypes.number,
    fadeOutDuration: PropTypes.number,
    opacity: PropTypes.number,
}

WSToast.defaultProps = {
    position: 'center',
    textStyle: styles.text,
    positionValue: 120,
    fadeInDuration: 500,
    fadeOutDuration: 500,
    opacity: 1,
}
import React, { PureComponent } from 'react'
import { Text, StyleSheet } from 'react-native'
import { Snackbar } from 'react-native-paper'

export const DURATION = {
    LENGTH_SHORT: 500,
    FOREVER: 0,
}

const styles = StyleSheet.create({
    text: {
        color: 'white',
    },
})

export default class WSSnackBar extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            isShow: false,
            text: '',
            duration: Snackbar.DURATION_SHORT,
        }
    }

    render() {
        const { textStyle } = this.props
        const { duration, isShow, text } = this.state
        return (
            <Snackbar
                duration={duration}
                visible={isShow}
                onDismiss={() => this.setState({ isShow: false })}
            >
                {React.isValidElement(text) ? text : <Text style={textStyle}>{text}</Text>}
            </Snackbar>

        )
    }

    show = (text, duration, callback) => {
        this.duration = typeof duration === 'number' ? duration : DURATION.LENGTH_SHORT
        this.callback = callback
        this.setState(prevState => ({
            ...prevState,
            isShow: !prevState.isShow,
            text,
            duration
        }))

    }
}

WSSnackBar.defaultProps = {
    textStyle: styles.text,
    positionValue: 120,
    fadeInDuration: 500,
    fadeOutDuration: 500,
    opacity: 1,
}
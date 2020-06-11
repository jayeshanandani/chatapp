import React, { PureComponent } from 'react'
import { TextInput } from 'react-native'

export default class TextInput2 extends PureComponent {
    constructor(props) {
        super(props)
        this.state = { placeholder: true }
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(ev) {
        const { onChange } = this.props
        this.setState({ placeholder: ev.length == 0 }, () => {
            onChange && onChange(ev)
        })
    }

    render() {
        const { text } = this.props
        const { placeholder } = this.state
        return (
            <TextInput
                value={text}
                placeholder="Test Demo"
                onChangeText={this.handleChange}
                style={placeholder ? { fontStyle: 'italic' } : { fontStyle: 'normal' }}
            />
        )
    }
}
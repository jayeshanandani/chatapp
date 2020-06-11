import React, { PureComponent, Fragment } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import moment from 'moment'

import ConfiguredStyle from '@constants/Variables'
import enums from '@constants/Enum'

import WSTouchable from '@components/WSTouchable'

const pageStyle = StyleSheet.create({
    placeholderText: {
        fontSize: ConfiguredStyle.fonts.sm,
        color: ConfiguredStyle.colors.grey.medium,
    },
    borderBottom: {
        borderBottomWidth: ConfiguredStyle.radius.border,
        borderBottomColor: ConfiguredStyle.colors.grey.light,
        marginTop: ConfiguredStyle.margin.xsm,
    },
    iconStyle: {
        alignSelf: enums.END,
    },
    icon: {
        fontSize: ConfiguredStyle.fonts.f18,
        color: ConfiguredStyle.colors.grey.light,
        position: enums.ABSOLUTE,
    },
    inputText: {
        fontSize: ConfiguredStyle.fonts.sm,
        color: ConfiguredStyle.colors.black,
    },
})

class WSDateTimePicker extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showPicker: false,
            dob: new Date(),
        };
        this.today = new Date();
    }

    showDateTimePicker = () => {
        this.setState({showPicker: true});
    };

    hideDateTimePicker = () => {
        this.setState({showPicker: false});
    };

    handleDatePicked = (date) => {
        this.setState({
            dob: date || new Date(),
            showPicker: false
        }, () => {
            if (date) {
                this.props.getDate(date.toISOString())
            }
        });
    };

    render() {
        const { dob, showPicker } = this.state
        const { pickerMode, oldDate } = this.props
        const currentDate = oldDate ? new Date(oldDate) : this.today
        return (
            <Fragment>
                <WSTouchable onPress={this.showDateTimePicker} rippleColor={ConfiguredStyle.colors.rippleColorDark}>
                    <View>
                        <View style={[pageStyle.borderBottom]}>
                            {(pickerMode === 'date') ?
                                <Text style={pageStyle.inputText}>
                                    {dob ? moment(dob).format('dddd, MMM DD YYYY') : moment(currentDate.toISOString()).format('dddd, MMM DD YYYY')}
                                </Text>
                                :
                                <Text style={pageStyle.inputText}>
                                    {dob ? moment(dob).format('LT') : moment(currentDate.toISOString()).format('LT')}
                                </Text>
                            }
                        </View>
                    </View>
                </WSTouchable>
                {showPicker && (
                    <DateTimePicker
                        minimumDate={new Date()}
                        timeZoneOffsetInMinutes={0}
                        value={dob}
                        mode={pickerMode}
                        is24Hour={true}
                        display="default"
                        onChange={(event, date) => this.handleDatePicked(date)}
                        onCancel={this.hideDateTimePicker}
                    />
                )}
            </Fragment>
        );
    }
}

export default WSDateTimePicker
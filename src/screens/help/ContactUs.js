import React, { Component } from 'react'
import {
  Text,
  View,
  Picker,
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet,
  BackHandler
} from 'react-native'
import { CheckBox, Form, Textarea } from 'native-base'

import ConfiguredStyle from '@constants/Variables'
import enums from '@constants/Enum'

import WSHeader from '@components/WSHeader'
import WSButton from '@components/WSButton'

import { connect } from 'react-redux'

import common from '@styles/common'

const pageStyle = StyleSheet.create({
  button: {
    padding: ConfiguredStyle.padding.md
  },
  textStyle: {
    paddingLeft: ConfiguredStyle.padding.sm,
    fontSize: ConfiguredStyle.fonts.sm,
    fontFamily: ConfiguredStyle.fontFamily.primaryMedium,
    color: ConfiguredStyle.colors.black,
    marginLeft: ConfiguredStyle.margin.sm,
    fontWeight: enums.BOLD,
  }
})

class ContactUs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: 'Add Notes',
      agreeEmailCheck: false,
      agreeNumberCheck: false,
    };
  }

  componentDidMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBack
    );
  }

  handleBack = () => {
    const { navigation } = this.props
    return navigation.goBack();
  };

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBack
    );
  }

  toggleEmailChecked = () => {
    this.setState((prevState) => ({
      ...prevState,
      agreeEmailCheck: !prevState.agreeEmailCheck
    }))
  };

  toggleNumberChecked = () => {
    this.setState((prevState) => ({
      ...prevState,
      agreeNumberCheck: !prevState.agreeNumberCheck
    }))
  };

  render() {
    const { agreeEmailCheck, agreeNumberCheck, language } = this.state
    const { user, navigation } = this.props
    return (
      <KeyboardAvoidingView style={[common.flexGrow1, common.bgWhite]}>
        <ScrollView style={common.flexGrow1} showsVerticalScrollIndicator={false}>
          <WSHeader
            name='Contact Us'
            enableBack
            onLeftMethod={this.handleBack}
          />
          <View style={common.ph20}>
            <View style={common.bottomWidth1}>
              <Picker
                styles={[
                  common.flexGrow1,
                  common.bottomWidth1,
                  common.flexDirectionRow
                ]}
                textStyle={[common.f12, { color: ConfiguredStyle.colors.light, fontFamily: 'Helvetica' }]}
                itemTextStyle={{ color: ConfiguredStyle.colors.light, fontFamily: 'Helvetica' }}
                selectedValue={language}
                onValueChange={(itemValue) =>
                  this.setState((prevState) => ({ ...prevState, language: itemValue }))
                }
              >
                <Picker.Item label='Choose an Issue' value='null' />
                <Picker.Item label='Issue 1' value='Issue0' />
                <Picker.Item label='Issue 2' value='Issue1' />
                <Picker.Item label='Issue 3' value='Issue2' />
                <Picker.Item label='Issue 4' value='Issue3' />
                <Picker.Item label='Issue 5' value='Issue4' />
                <Picker.Item label='Issue 6' value='Issue5' />
              </Picker>
            </View>
            <View style={common.mt20}>
              <Text style={common.colorPrimary}>Add Notes (Optional)</Text>
              <Form>
                <Textarea
                  multiline={true}
                  rowSpan={ConfiguredStyle.size.s4}
                  style={[common.borderColorWhite, common.borderColorGrey]}
                  bordered
                />
              </Form>
            </View>
            <Text style={[common.colorPrimary, common.pv15, common.ml15]}>
              Contact me
              </Text>
            <View style={common.flexDirectionRow}>
              <CheckBox
                style={common.borderRadius4}
                checked={agreeEmailCheck}
                color={ConfiguredStyle.colors.primary}
                onPress={this.toggleEmailChecked}
              />
              <Text style={pageStyle.textStyle}>
                {user && user.email}
              </Text>
            </View>
            <View style={[common.flexDirectionRow, common.pb30, common.mt20]}>
              <CheckBox
                style={common.borderRadius4}
                checked={agreeNumberCheck}
                color={ConfiguredStyle.colors.primary}
                onPress={this.toggleNumberChecked}
              />
              <Text style={pageStyle.textStyle}>
                {user && user.phoneNumber}
              </Text>
            </View>
          </View>
        </ScrollView>
        <View style={pageStyle.button}>
          <WSButton
            onBtnPress={() => navigation.navigate('SuccessContactUs')}
            name='Send'
          />
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = state => (
  {
    user: state.user.userData,
  }
);

const mapDispatchToProps = dispatch => (
  {

  }
);

export default connect(mapStateToProps, mapDispatchToProps)(ContactUs)
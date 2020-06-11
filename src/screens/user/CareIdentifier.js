import React, { Component } from 'react'
import {
  View,
  Text,
  KeyboardAvoidingView,
  StyleSheet,
  BackHandler,
  Platform,
  ScrollView,
  Alert,
  Keyboard
} from 'react-native'
import { connect } from 'react-redux'
import { Thumbnail } from 'native-base'
import * as Yup from 'yup'

import {
  updateUserAttributes,
  updateUserAttributesFailure,
  updateUserAttributesClear,
  updateUserAttributesSuccess
} from '@redux/user/actions'

import images from '@constants/Image'
import ConfiguredStyle from '@constants/Variables'
import enums from '@constants/Enum'

import { getCareIdAction, getSystemContactsClear } from '@redux/user/actions'

import WithAuthenticator from '@hoc/WithAuthenticator'
import WithLoader from '@hoc/WithLoader'

import { isEmptyObj } from '@helper/GenericFunction'
import { createLoadingSelector, createErrorMessageSelector, createSuccessMessageSelector } from '@helper/reduxSelector'

import WSGreyText from '@components/WSGreyText'
import WSWaterMark from '@components/WSWaterMark'
import WSHeader from '@components/WSHeader'
import WSTextBox from '@components/WSTextBox'
import WSButton from '@components/WSButton'
import WSSnackBar from '@components/WSSnackBar'

import styles from '@styles/AppStyle'
import common from '@styles/common'

const validationSchema = Yup.object().shape({
  careId: Yup.string()
    .required('CareId is required'),
});

const pagestyle = StyleSheet.create({
  text: {
    color: ConfiguredStyle.colors.primary,
    alignSelf: enums.CENTER,
    paddingLeft: ConfiguredStyle.padding.sm,
    paddingTop: ConfiguredStyle.padding.p15,
    fontWeight: enums.BOLD,
  }
})

class UserId extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonName: 'Check Availability',
      careId: '',
      suggestionsList: {}
    };
    this.toastRef = React.createRef();
  }

  componentDidMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBack
    );
  }

  handleBack = () => {
    const { navigation } = this.props
    return Alert.alert(
      "Do you want to stop creating your account?",
      "If you stop now, you'll lose any progress you've made.",
      [
        {
          text: 'Stop Creating Account',
          onPress: () => navigation.navigate('SwiperScreen')
        },
        { text: 'Continue Creating Account', onPress: () => console.log('Ask me later pressed') },
      ],
      { cancelable: false },
    );
    // return navigation.goBack();
  };

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBack
    );
  }

  componentWillReceiveProps(nextProps) {
    const { getSystemContactsClear, updateUserAttributesClear, navigation } = this.props
    const { updateUserWithFullName, errorMessage, getSuggestions, suggestion } = nextProps;

    const { password } = nextProps.navigation.state.params
    if (updateUserWithFullName && !errorMessage) {
      navigation.navigate('PasswordCreation', { password });
      updateUserAttributesClear();
    }
    if (getSuggestions && suggestion && suggestion.byEmail === '') {
      this.setState({
        buttonName: 'Done'
      })
      getSystemContactsClear();
    } else if (getSuggestions && suggestion && suggestion.byEmail !== '') {
      this.toastRef.current.show('Your careID is already taken!', 1000);
      this.setState({
        suggestionsList: suggestion
      })
      getSystemContactsClear();
    }
    if (errorMessage) {
      this.toastRef.current.show(errorMessage, 1000);
      updateUserAttributesClear();
    }
  }

  checkForSuggetion = () => {
    const { password, phoneNumber, emailId } = this.props.navigation.state.params
    const { careId, buttonName } = this.state
    const { signUpUserDetails, getCareIdAction } = this.props
    if (careId.length && buttonName !== 'Done') {
      Keyboard.dismiss();
      const input = {
        careId,
        phoneNumber,
        emailId,
      }
      getCareIdAction(input)
    }
    if (buttonName === 'Done') {
      this.onUpdateAttributes()
    }
  }

  onUpdateAttributes = async () => {
    const { careId } = this.state
    const { updateAttributes, updateUserAttributes, updateUserAttributesFailure, updateUserAttributesSuccess } = this.props
    const { content, data } = this.props.navigation.state.params
    let newData = { 'preferred_username': careId };
    let newContent = { ...content, ...newData };
    if (careId) {
      data.attributes['preferred_username'] = careId;
      updateUserAttributes();
      try {
        const response = await updateAttributes({ user: data, attributes: newContent });
        updateUserAttributesSuccess(response);
      }
      catch (e) {
        updateUserAttributesFailure(e);
      }
    } else {
      this.refs.toast.show('Please Enter Care Id', 1000);
    }
  }

  takeSuggetion = (text) => {
    this.setState({
      careId: text,
      suggestionsList: {},
      buttonName: 'Done'
    })
  }
  renderSuggestions = (suggestion) => {
    return (
      suggestion &&
      <View style={[common.flexDirectionRow, common.pv15]}>
        <WSGreyText description="Suggested : " />
        <Text style={pagestyle.text} onPress={() => this.takeSuggetion(suggestion.byEmail)}>{suggestion.byEmail}</Text>
        <View style={common.pl10}>
          <WSGreyText description="|" />
        </View>
        <Text style={pagestyle.text} onPress={() => this.takeSuggetion(suggestion.byPhone)}>{suggestion.byPhone}</Text>
        <View style={common.pl10}>
          <WSGreyText description="|" />
        </View>
        <Text style={pagestyle.text} onPress={() => this.takeSuggetion(suggestion.byRandomNumber)}>{suggestion.byRandomNumber}</Text>
      </View>
    )
  }

  handleChange = (text) => {
    this.setState({
      careId: text
    })
  }

  render() {
    const { load, isLoading } = this.props
    const { buttonName, careId, suggestionsList } = this.state
    return (
      <WithLoader spinner={isLoading || load}>
        <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? enums.PADDING : ''} style={[common.flex1, { backgroundColor: 'white' }]}>
          <WSHeader
            name='CareID'
            enableBack
            onLeftMethod={this.handleBack}
          />
          <WSWaterMark />
          <ScrollView contentContainerStyle={[common.flexGrow1, common.pt20]} keyboardShouldPersistTaps={'always'} showsVerticalScrollIndicator={false}>
            <View style={[common.flex1, common.centerStart, common.ph20, common.mb40]}>
              <Thumbnail large source={images.careid} />
              <WSGreyText description='Your new CareID will be a brand new way to find & connect with colleagues in your industry. Create your unique CareID now' />
              <View style={{ width: '100%' }}>
                <WSTextBox style={common.colorBlack}
                  placeholderText="Type your favorite careID"
                  changeText={(e) => this.handleChange(e)}
                  value={careId} />
                {!careId.length && (
                  <Text style={styles.errorMessage}>CareID is required</Text>
                )}
                {(!(isEmptyObj(suggestionsList))) && this.renderSuggestions(suggestionsList)}
                {(load) && <Text>Check for Availability...</Text>}
              </View>
            </View>
            <WSSnackBar
              ref={this.toastRef}
            />
            <View style={styles.bottomButton}>
              <WSButton
                onBtnPress={this.checkForSuggetion}
                name={buttonName}
                height={ConfiguredStyle.size.s40}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </WithLoader>
    );
  }
}

const loadingSelector = createLoadingSelector(['UPDATE_USER_ATTRIBUTES', 'GET_CAREID']);
const errorSelector = createErrorMessageSelector(['UPDATE_USER_ATTRIBUTES']);
const successSelector = createSuccessMessageSelector(['UPDATE_USER_ATTRIBUTES']);

const mapStateToProps = (state) => {
  return {
    updateUserWithFullName: successSelector(state),
    errorMessage: errorSelector(state),
    isLoading: loadingSelector(state),
    signInUserDetails: state.user.signInUserDetails,
    signUpUserDetails: state.user.signUpUserDetails,
    suggestion: state.user.suggestion,
    getSuggestions: state.user.getSuggestions,
    load: state.user.load,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateUserAttributesSuccess: value => dispatch(updateUserAttributesSuccess(value)),
    updateUserAttributesFailure: e => dispatch(updateUserAttributesFailure(e)),
    updateUserAttributesClear: e => dispatch(updateUserAttributesClear(e)),
    updateUserAttributes: () => dispatch(updateUserAttributes()),
    getCareIdAction: value => dispatch(getCareIdAction(value)),
    getSystemContactsClear: () => dispatch(getSystemContactsClear()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WithAuthenticator(UserId))
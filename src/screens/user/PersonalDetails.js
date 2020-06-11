import React, { Component } from 'react'
import {
  View,
  Text,
  TextInput,
  Platform,
  ScrollView,
  BackHandler,
  StyleSheet,
  KeyboardAvoidingView,
  Keyboard
} from 'react-native'
import { connect } from 'react-redux'
import Config from 'react-native-config'
import uuidv1 from 'uuid/v1'
import { Formik } from 'formik'
import * as yup from 'yup'
import CountryPicker from 'react-native-country-picker-modal'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

import ConfiguredStyle from '@constants/Variables'

import { updateUserProfile, updateUserProfileClear } from '@redux/user/actions'

import { defaultImageMimetype } from '@helper/keysForBucket'
import { isEmptyObj } from '@helper/GenericFunction'

import WithLoader from '@hoc/WithLoader'

import WSHeader from '@components/WSHeader'
import WSButton from '@components/WSButton'
import WSTextBox from '@components/WSTextBox'
import WSImagePicker from '@components/WSImagePicker'
import WSSnackBar from '@components/WSSnackBar'
import ImageModal from '@components/ImageModal'

import common from '@styles/common'
import styles from '@styles/AppStyle'
import { uploadFile } from '../../helper/httpService'

const pageStyle = StyleSheet.create({
  button: {
    padding: ConfiguredStyle.padding.md,
  },
  pickerBorder: {
    paddingBottom: ConfiguredStyle.padding.xsm,
  },
  codeView: {
    marginHorizontal: ConfiguredStyle.margin.sm,
  },
});

const personalDetailsvalidationSchema = yup.object().shape({
  userName: yup.string()
    .required('Full Name is required'),
  email: yup.string()
    .email('Invalid email')
    .required('Email is required'),
  phoneNumber: yup.string()
    .min(10, 'Minimum 10 Digits.')
    .required('Phone number is required'),
})

var work = " ", home = " ";
var _phoneNumber = {}, _homeNumber = {};

class PersonalDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      mediaChanged: false,
      imageModal: false,
      cca2: 'CA',
      callingCode: '1',
      cca2Home: 'CA',
      callingCodeHome: '1',
    }
    this.emailRef = React.createRef();
    this.hospitalNameRef = React.createRef();
    this.hospitalAddRef = React.createRef();
  }

  componentDidMount() {
    const { user } = this.props
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);

    if (user && user.phoneNumber && user.phoneNumber !== '') {
      let newNumber = user.phoneNumber.replace("+1", "+001")
      _phoneNumber = parsePhoneNumberFromString(newNumber)
      if (!isEmptyObj(_phoneNumber)) {
        this.setState({ cca2: _phoneNumber.country, callingCode: _phoneNumber.countryCallingCode })
      }
    }
    if (user && user.homeNumber && user.homeNumber !== '') {
      let newHomeNumber = user.homeNumber.replace("+1", "+001")
      _homeNumber = parsePhoneNumberFromString(newHomeNumber)
      if (!isEmptyObj(_homeNumber)) {
        this.setState({ cca2Home: _homeNumber.country, callingCodeHome: _homeNumber.countryCallingCode })
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { updateUserProfileClear, userUpdateSuccess } = this.props
    if (!prevProps.userUpdateSuccess && userUpdateSuccess) {
      this.refs.toast.show('Profile Updated successfully', 1000);
      updateUserProfileClear();
    }
  }

  componentWillUnmount() {
    work = " ";
    home = " ";
    _phoneNumber = {};
    _homeNumber = {};
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick = () => {
    const { navigation } = this.props
    return navigation.goBack();
  }

  getImageDetailsToUpload = (details) => {
    let extension;
    if (details?.type) {
      const extensionIndex = details.path.lastIndexOf(".");
      extension = details.path.slice(extensionIndex + 1);
    } else {
      extension = defaultImageMimetype;
    }
    this.setState(prevState => ({ ...prevState, isLoading: true }), async () => {
      const allowedExtensions = ["jpg", "jpeg", "png"];
      const correspondingMime = ["image/jpeg", "image/jpeg", "image/png"];
      const fileName = `${uuidv1()}.${extension}`;
      const file = {
        uri: details.path,
        name: fileName,
        type: correspondingMime[allowedExtensions.indexOf(extension)]
      };
      const res = await uploadFile(file);
      console.log('response from image upload', res);
      this.setState({ imageUrl: fileName, isLoading: false, mediaChanged: true });
    });
  }

  updateProfile = (value) => {
    const { imageUrl, mediaChanged } = this.state
    const { updateUserProfile, error, user } = this.props
    let data = {}
    if (value.email && (value.email !== '' && value.email !== null && value.email !== undefined)) {
      data.email = user.email;
    }
    if (value.hospitalAddress && (value.hospitalAddress !== '' && value.hospitalAddress !== null && value.hospitalAddress !== undefined)) {
      data.hospitalAddress = value.hospitalAddress;
    }
    if (value.hospitalName && (value.hospitalName !== '' && value.hospitalName !== null && value.hospitalName !== undefined)) {
      data.hospitalName = value.hospitalName;
    }
    if (value.phoneNumber && (value.phoneNumber !== '' && value.phoneNumber !== null && value.phoneNumber !== undefined)) {
      data.phoneNumber = user.phoneNumber;
    }
    if (value.homeNumber && (value.homeNumber.trim() !== '' && value.homeNumber !== null && value.homeNumber !== undefined)) {
      data.homeNumber = user.homeNumber;
    }
    if (value.userName && (value.userName !== '' && value.userName !== null && value.userName !== undefined)) {
      data.userName = value.userName;
    }
    if (mediaChanged) {
      data.media = {
        bucket: Config.AWS_BUCKET,
        url: imageUrl,
      }
    }

    updateUserProfile(data);
    if (error) {
      this.refs.toast.show('Something went wrong', 1000);
    }
  }

  setImageModalVisible(visible) {
    this.setState({ imageModal: visible });
  }

  render() {
    const { userProfilePic, loader, user } = this.props
    const { isLoading, cca2, callingCode, cca2Home, callingCodeHome, imageModal, mediaChanged, imageUrl } = this.state
    if (user && user.phoneNumber && user.phoneNumber !== '') {
      _phoneNumber = parsePhoneNumberFromString(user.phoneNumber)
      if (!isEmptyObj(_phoneNumber)) {
        work = _phoneNumber.nationalNumber
      }
    }
    if (user && user.homeNumber && user.homeNumber !== '') {
      _homeNumber = parsePhoneNumberFromString(user.homeNumber)
      if (!isEmptyObj(_homeNumber)) {
        home = _homeNumber.nationalNumber
      }
    }
    return (
      <WithLoader spinner={loader || isLoading || !user}>
        <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? enums.PADDING : ''} style={[common.flex1, { backgroundColor: 'white' }]}>
          <WSHeader
            name="Personal Details"
            enableBack
            onLeftMethod={this.handleBackButtonClick}
          />
          <WSSnackBar ref="toast" />
          <ImageModal closeAction={() => this.setImageModalVisible(false)} visibility={imageModal} image={mediaChanged ? { uri: imageUrl } : { uri: userProfilePic }} />
          <Formik
            onSubmit={(values) => {
              Keyboard.dismiss();
              this.updateProfile(values)
            }}
            validationSchema={personalDetailsvalidationSchema}
            initialValues={{
              userName: user && user.userName ? user.userName : '',
              email: user && user.email ? user.email : '',
              phoneNumber: work,
              homeNumber: home,
              hospitalName: user && user.hospitalName ? user.hospitalName : '',
              hospitalAddress: user && user.hospitalAddress ? user.hospitalAddress : '',
            }}
          >
            {({
              handleChange,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
                <ScrollView contentContainerStyle={common.flexGrow1} keyboardShouldPersistTaps={'always'} showsVerticalScrollIndicator={false}>
                  <View style={[common.flex1, common.ph20]}>
                    <View style={[common.mv20, common.centerStart]}>
                      <WSImagePicker
                        media={userProfilePic}
                        text={'Change Profile Picture'}
                        textStyle={[styles.primaryColorText, common.ml20]}
                        getImageDetailsToUpload={this.getImageDetailsToUpload}
                        viewProfile={() => this.setImageModalVisible(true)}
                      />
                    </View>
                    <WSTextBox
                      value={values.userName}
                      placeholderText="Name"
                      changeText={handleChange('userName')}
                      returnKeyType={'next'}
                      onSubmitEditing={() => this.hospitalNameRef.current.focus()}
                    />
                    {errors.userName && touched.userName ? (
                      <Text style={styles.errorMessage}>{errors.userName}</Text>
                    ) : null}
                    <WSTextBox
                      value={values.email}
                      disabled
                      placeholderText="Email Address"
                      changeText={handleChange('email')}
                    />
                    {errors.email && touched.email ? (
                      <Text style={styles.errorMessage}>{errors.email}</Text>
                    ) : null}
                    <WSTextBox
                      value={values.phoneNumber}
                      disabled
                      placeholderText="Phone number"
                      render={(props) => (
                        <View style={[common.exactCenter, common.flexDirectionRow, common.ph10]}>
                          <View style={[common.exactCenter, common.flexDirectionRow, pageStyle.pickerBorder]}>
                            <CountryPicker
                              modalProps={{ visible: false }}
                              countryCode={cca2}
                            />
                            <Text style={[common.ph10, common.selfCenter, common.mt3, pageStyle.codeView]}>{callingCode !== '' ? `+${callingCode}` : 'none'}</Text>
                          </View>
                          <View style={common.flexGrow1}>
                            <TextInput
                              {...props}
                            />
                          </View>
                        </View>
                      )}
                    />
                    {errors.phoneNumber && touched.phoneNumber ? (
                      <Text style={styles.errorMessage}>{errors.phoneNumber}</Text>
                    ) : null}
                    <WSTextBox
                      value={values.homeNumber}
                      disabled
                      placeholderText="Home number"
                      render={(props) => (
                        <View style={[common.exactCenter, common.flexDirectionRow, common.ph10]}>
                          <View style={[common.exactCenter, common.flexDirectionRow, pageStyle.pickerBorder]}>
                            <CountryPicker
                              modalProps={{ visible: false }}
                              countryCode={cca2Home}
                            />
                            <Text style={[common.ph10, common.selfCenter, common.mt3, pageStyle.codeView]}>{callingCodeHome !== '' ? `+${callingCodeHome}` : 'none'}</Text>
                          </View>
                          <View style={common.flexGrow1}>
                            <TextInput
                              {...props}
                            />
                          </View>
                        </View>
                      )}
                      onSubmitEditing={() => this.hospitalNameRef.current.focus()}
                    />
                    {errors.homeNumber && touched.homeNumber ? (
                      <Text style={styles.errorMessage}>{errors.homeNumber}</Text>
                    ) : null}
                    <WSTextBox
                      reference={this.hospitalNameRef}
                      value={values.hospitalName}
                      placeholderText="Hospital Name"
                      changeText={handleChange('hospitalName')}
                      returnKeyType={'next'}
                      multiLine={true}
                      maxLength={100}
                      render={(props) => {
                        let styleProps = {}
                        if (Array.isArray(props.style)) {
                          props.style.forEach((obj) => {
                            styleProps = { ...styleProps, ...obj }
                          })
                        } else {
                          styleProps = { ...props.style }
                        }
                        return (
                          <TextInput
                            {...props}
                            style={[styleProps, common.pv15, common.ph15, { textAlignVertical: 'center' }]}
                          />
                        )
                      }}
                      onSubmitEditing={() => this.hospitalAddRef.current.focus()}
                    />
                    <WSTextBox
                      reference={this.hospitalAddRef}
                      value={values.hospitalAddress}
                      placeholderText="Hospital Address"
                      multiLine={true}
                      maxLength={300}
                      changeText={handleChange('hospitalAddress')}
                      render={(props) => {
                        let styleProps = {}
                        if (Array.isArray(props.style)) {
                          props.style.forEach((obj) => {
                            styleProps = { ...styleProps, ...obj }
                          })
                        } else {
                          styleProps = { ...props.style }
                        }
                        return (
                          <TextInput
                            {...props}
                            style={[styleProps, common.pv15, common.ph15, { textAlignVertical: 'center' }]}
                          />
                        )
                      }}
                    />
                  </View>
                  <View style={pageStyle.button}>
                    <WSButton
                      onBtnPress={handleSubmit}
                      name='Update'
                    />
                  </View>
                </ScrollView>
              )}
          </Formik>
        </KeyboardAvoidingView>
      </WithLoader>
    );
  }
}

const mapStateToProps = state => (
  {
    user: state.user.userData,
    userProfilePic: state.user?.userData?.media?.medium,
    userUpdateSuccess: state.user.userUpdateSuccess,
    signInUserDetails: state.user.signInUserDetails,
    loader: state.user.loading,
    error: state.user.flagError,
  }
);

const mapDispatchToProps = dispatch => (
  {
    updateUserProfile: value => dispatch(updateUserProfile(value)),
    updateUserProfileClear: () => dispatch(updateUserProfileClear()),
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(PersonalDetails)
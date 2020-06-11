import React, { Component } from 'react'
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
  Text,
  BackHandler,
  Keyboard,
  TouchableOpacity
} from 'react-native'
import { connect } from 'react-redux'
import { Formik } from 'formik'
import * as Yup from 'yup'
import _ from 'lodash'
import moment from 'moment'

import ConfiguredStyle from '@constants/Variables'
import images from '@constants/Image'

import { createAnnouncement, clearCreateAnnouncement, addLocally, clearAnnouncementFlags } from '@redux/announcement/actions'

import WordEditor from '@helper/WordEditor'

import AddParticipant from '@container/AddParticipant'

import WSHeader from '@components/WSHeader'
import WSTextBox from '@components/WSTextBox'
import WSDateTimePicker from '@components/WSDateTimePicker'
import WSButton from '@components/WSButton'
import WSLoader from '@components/WSLoader'
import WSSnackBar from '@components/WSSnackBar'
import WSImage from '@components/WSImage'

import common from '@styles/common'

const pageStyle = StyleSheet.create({
  button: {
    paddingVertical: ConfiguredStyle.padding.sm,
    paddingHorizontal: ConfiguredStyle.padding.md,
  },
  validationErrorText: {
    fontSize: ConfiguredStyle.fonts.xssm,
    color: ConfiguredStyle.colors.social.google,
  },
  saveDraftContainer: {
    padding: 10,
    backgroundColor: '#f9f8fe',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveDraftLabel: {
    color: ConfiguredStyle.colors.black,
    fontSize: ConfiguredStyle.fonts.sm,
    fontFamily: ConfiguredStyle.fontFamily.primaryMedium,
  },
  flex1: {
    flex: 1
  },
  flex11: {
    flex: 11
  },
  title: {
    fontSize: 12,
    color: ConfiguredStyle.colors.primary
  },
  radioTitle: {
    fontSize: 14,
    color: ConfiguredStyle.colors.black,
    marginLeft: 10
  },
  subContainer: {
    flex: 1,
    flexDirection: 'row'
  }
})

const createAnnouncementValidation = Yup.object().shape({
  announcementTitle: Yup.string()
    .required('Please Enter Announcement Title'),
});
var description = '';

class CreateAnnouncement extends Component {
  constructor(props) {
    super(props)
    this.state = {
      disabled: false,
      addedUser: [],
      scheduledNow: true,
      scheduledLater: false,
    }
    this.toastRef = React.createRef();
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentDidUpdate(prevProps, prevState) {
    const { clearCreateAnnouncement, addLocally, clearAnnouncementFlags, createError, success, createdAnnouncement } = this.props
    if (!prevProps.success && success) {
      createdAnnouncement[0].announcement.isArchive = false;
      addLocally(createdAnnouncement[0].announcement);
      clearCreateAnnouncement();
      clearAnnouncementFlags();
      this.toastRef.current.show('Announcement successfully created', 1000);
      this.handleBackButtonClick();
    }

    if (prevProps.createError && !createError) {
      clearCreateAnnouncement();
      clearAnnouncementFlags();
      this.toastRef.current.show('Announcement fail to create', 1000);
    }
  }

  componentWillUnmount() {
    description = '';
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick = () => {
    const { navigation } = this.props
    return navigation.goBack();
  }

  onClickSave = (values) => {
    const { createAnnouncement } = this.props
    const { addedUser } = this.state
    const { announcementTitle } = values;

    // const htmlToString = convertToHtmlString(description)
    const htmlToString = description;

    const getUserID = addedUser.map((item) => {
      return item && item.id
    });

    const input = {
      title: announcementTitle,
      date: moment().format(),
      invites: getUserID,
      announcement: htmlToString,
    }

    if (getUserID.length) {
      createAnnouncement(input)
    } else {
      this.toastRef.current.show('At least one contact must be invited', 1000);
    }
  }

  onPassProp = (data) => {
    if (data) {
      this.setState({
        passDate: data,
      });
    }
  }

  addedPeople = (data) => {
    this.setState({ addedUser: data || [] });
  }

  addRecipient = () => {
    const { navigation } = this.props
    const { addedUser } = this.state
    navigation.navigate('AddPeople', { onPassProp: this.addedPeople, passSelectedData: addedUser });
  }

  removeUser = (id) => {
    const { addedUser } = this.state
    const removedElement = _.remove(addedUser, function (item) {
      return item && item.id !== id
    })
    this.setState({
      addedUser: removedElement
    })
  }

  render() {
    const { loader } = this.props
    const { addedUser, disabled, scheduledNow, scheduledLater } = this.state
    return (
      <KeyboardAvoidingView style={[common.flexGrow1, { backgroundColor: 'white' }]} behavior={Platform.OS === "ios" ? 'padding' : ''}>
        <WSHeader
          name="Create Announcement"
          enableBack
          rightText='Cancel'
          rightTextPress={this.handleBackButtonClick}
          onLeftMethod={this.handleBackButtonClick}
        />
        <Formik
          initialValues={{
            announcementTitle: '',
          }}
          validationSchema={createAnnouncementValidation}
          onSubmit={values => {
            Keyboard.dismiss();
            this.onClickSave(values)
          }}>
          {({ handleChange, handleSubmit, values, errors, touched, setValues }) => (
            <View style={common.flex1}>
              <ScrollView
                style={common.flex1}
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps={'always'}
              >
                <View style={[common.mh20, pageStyle.subContainer, common.mb20]}>
                  <View style={pageStyle.flex1}>
                    <WSImage
                      image={images.text}
                      height={ConfiguredStyle.size.s10}
                      width={ConfiguredStyle.size.s10}
                      resizeMode={'contain'}
                      imageStyle={{ backgroundColor: ConfiguredStyle.colors.white, marginTop: 22 }}
                    />
                  </View>
                  <View style={pageStyle.flex11}>
                    <WSTextBox
                      mode="Flat"
                      returnKeyType='default'
                      placeholderText="Announcement Title"
                      changeText={handleChange('announcementTitle')}
                      value={values.announcementTitle}
                    />
                    {(errors.announcementTitle && touched.announcementTitle) && (
                      <Text style={pageStyle.validationErrorText}>{errors.announcementTitle}</Text>
                    )}
                  </View>
                </View>

                <View style={[common.mh20, pageStyle.subContainer, common.mb20]}>
                  <View style={pageStyle.flex1}>
                    <WSImage
                      image={images.schedule}
                      height={ConfiguredStyle.size.s13}
                      width={ConfiguredStyle.size.s13}
                      resizeMode={'contain'}
                      imageStyle={{ backgroundColor: ConfiguredStyle.colors.white, marginTop: 3 }}
                    />
                  </View>
                  <View style={pageStyle.flex11}>
                    <Text style={pageStyle.title}>Scheduled For</Text>
                    <View style={[pageStyle.subContainer, common.mt15]}>
                      <View style={[pageStyle.subContainer, { alignItems: 'center' }]}>
                        <WSImage
                          image={scheduledNow ? images.radioSelect : images.radioUnselect}
                          height={ConfiguredStyle.size.s20}
                          width={ConfiguredStyle.size.s20}
                          resizeMode={'contain'}
                          imageStyle={{ backgroundColor: ConfiguredStyle.colors.white }}
                          onPress={() =>
                            this.setState({
                              scheduledNow: true,
                              scheduledLater: false,
                            })
                          }
                        />
                        <Text style={pageStyle.radioTitle}>Now</Text>
                      </View>
                      <View style={[pageStyle.subContainer, { alignItems: 'center' }]}>
                        <WSImage
                          image={scheduledLater ? images.radioSelect : images.radioUnselect}
                          height={ConfiguredStyle.size.s20}
                          width={ConfiguredStyle.size.s20}
                          resizeMode={'contain'}
                          imageStyle={{ backgroundColor: ConfiguredStyle.colors.white }}
                          onPress={() =>
                            this.setState({
                              scheduledNow: false,
                              scheduledLater: true,
                            })
                          }
                        />
                        <Text style={pageStyle.radioTitle}>Later</Text>
                      </View>
                    </View>
                  </View>
                </View>

                {scheduledLater && <><View style={[common.mh20, pageStyle.subContainer, common.mb20]}>
                  <View style={pageStyle.flex1}>
                    <WSImage
                      image={images.schedule}
                      height={ConfiguredStyle.size.s13}
                      width={ConfiguredStyle.size.s13}
                      resizeMode={'contain'}
                      imageStyle={{ backgroundColor: ConfiguredStyle.colors.white, marginTop: 3 }}
                    />
                  </View>
                  <View style={pageStyle.flex11}>
                    <Text style={pageStyle.title}>Date</Text>
                    <WSDateTimePicker pickerMode="date" getDate={this.onPassProp} />
                  </View>
                </View>

                  <View style={[common.mh20, pageStyle.subContainer, common.mb20]}>
                    <View style={pageStyle.flex1}>
                      <WSImage
                        image={images.time}
                        height={ConfiguredStyle.size.s13}
                        width={ConfiguredStyle.size.s13}
                        resizeMode={'contain'}
                        imageStyle={{ backgroundColor: ConfiguredStyle.colors.white, marginTop: 3 }}
                      />
                    </View>
                    <View style={pageStyle.flex11}>
                      <Text style={pageStyle.title}>Time</Text>
                      <WSDateTimePicker pickerMode="time" getDate={this.onPassProp} />
                    </View>
                  </View></>}

                <View style={[common.mh20, pageStyle.subContainer, common.mb20]}>
                  <View style={pageStyle.flex1}>
                    <WSImage
                      image={images.time}
                      height={ConfiguredStyle.size.s13}
                      width={ConfiguredStyle.size.s13}
                      resizeMode={'contain'}
                      imageStyle={{ backgroundColor: ConfiguredStyle.colors.white, marginTop: 3 }}
                    />
                  </View>
                  <View style={pageStyle.flex11}>
                    <Text style={pageStyle.title}>Invite People</Text>
                    <AddParticipant addedUserList={addedUser} onAddPeople={this.addRecipient} removeUser={this.removeUser} />
                  </View>
                </View>

                <View style={[common.mh20, pageStyle.subContainer, common.mb15]}>
                  <View style={pageStyle.flex1}>
                    <WSImage
                      image={images.text}
                      height={ConfiguredStyle.size.s10}
                      width={ConfiguredStyle.size.s10}
                      resizeMode={'contain'}
                      imageStyle={{ backgroundColor: ConfiguredStyle.colors.white, marginTop: 3 }}
                    />
                  </View>
                  <View style={pageStyle.flex11}>
                    <Text style={pageStyle.title}>Text Here</Text>
                    <WordEditor
                      changeText={(desc) => { description = desc }}
                      wordValue={description}
                      showDoneButton={(value) => this.setState({ disabled: value })}
                    />
                  </View>
                </View>

                <View style={pageStyle.button}>
                  <WSButton
                    onBtnPress={handleSubmit}
                    disabled={disabled}
                    name="Create"
                    style={{ borderRadius: 40 }}
                  />
                </View>
                {/* <TouchableOpacity style={pageStyle.saveDraftContainer}>
                  <Text style={pageStyle.saveDraftLabel}>Save As Draft</Text>
                </TouchableOpacity> */}
              </ScrollView>
            </View>
          )}
        </Formik>
        <WSSnackBar
          ref={this.toastRef}
        />
        {loader && <WSLoader />}
      </KeyboardAvoidingView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    success: state.announcement.createAnnouncementSuccess,
    loader: state.announcement.createLoading,
    createdAnnouncement: state.announcement.createdAnnouncement,
    createError: state.announcement.createError,
    loginUser: state.user.userData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    createAnnouncement: (value) => dispatch(createAnnouncement(value)),
    clearCreateAnnouncement: () => dispatch(clearCreateAnnouncement()),
    clearAnnouncementFlags: () => dispatch(clearAnnouncementFlags()),
    addLocally: (value) => dispatch(addLocally(value)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateAnnouncement)
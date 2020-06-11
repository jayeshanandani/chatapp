import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import { Tab, Tabs, TabHeading } from 'native-base'
import { Icon } from 'native-base'

import ConfiguredStyle from '@constants/Variables'
import enums from '@constants/Enum'

import WSHeader from '@components/WSHeader'
import WSTouchable from '@components/WSTouchable'

import CreateSocialContacts from './CreateSocialContacts'
import SocialDesc from './SocialDesc'

const pageStyle = StyleSheet.create({
    container: {
        flex: ConfiguredStyle.flex.one,
        backgroundColor: ConfiguredStyle.colors.white
    },
    tabs: {
        justifyContent: enums.SPACE_B,
        flexDirection: enums.ROW,
        alignItems: enums.CENTER
    },
    tabTextView: {
        flex: ConfiguredStyle.flex.one,
        paddingVertical: ConfiguredStyle.padding.xsm,
        alignItems: enums.CENTER,
        justifyContent: enums.CENTER
    },
    activeTab: {
        borderBottomWidth: ConfiguredStyle.size.s2,
        borderBottomColor: ConfiguredStyle.colors.primary
    },
    disableTab: {
        borderBottomWidth: 0.5,
        borderBottomColor: ConfiguredStyle.colors.grey.medium
    },
    activeIcon: {
        color: ConfiguredStyle.colors.primary,
    },
    disableIcon: {
        color: ConfiguredStyle.colors.grey.medium
    },
    indicatorStyle: {
        height: ConfiguredStyle.size.s2,
        backgroundColor: ConfiguredStyle.colors.primary
    },
    tabHeadingStyle: {
        backgroundColor: 'white',
        borderBottomWidth: 0.5,
        borderBottomColor: ConfiguredStyle.colors.grey.medium,
        marginTop: -10
    },
    rippleStyle: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
});

class ContactTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTab: 0,
            contact: true,
            google: false,
            facebook: false,
            linkedIn: false,
            description: 'Invite your colleagues from your industry and bring the party to HosTalky',
        };
    }

    switchTab = type => {
        if (type === enums.CONTACT) {
            this.setState(prevState => ({
                ...prevState,
                contact: true,
                google: false,
                facebook: false,
                linkedIn: false,
            }));
        }
        else if (type === enums.GOOGLE) {
            this.setState(prevState => ({
                ...prevState,
                google: true,
                contact: false,
                facebook: false,
                linkedIn: false,
            }));
        }
        else if (type === enums.FACEBOOK) {
            this.setState(prevState => ({
                ...prevState,
                facebook: true,
                contact: false,
                google: false,
                linkedIn: false,
            }));
        } else {
            this.setState(prevState => ({
                ...prevState,
                linkedIn: true,
                google: false,
                contact: false,
                facebook: false,
            }));
        }
    };

    render() {
        const {
            contact,
            google,
            facebook,
            linkedIn,
            description,
            currentTab
        } = this.state
        const { componentId, navigation } = this.props
        return (
            <View style={pageStyle.container}>
                <WSHeader
                    name='HosTalky'
                    enableBack
                    onLeftMethod={() => navigation.goBack(componentId)}
                />
                <Tabs ref={c => this.tabs = c} tabBarUnderlineStyle={pageStyle.indicatorStyle} onChangeTab={({ i }) => {
                    this.setState({ currentTab: i });
                }}>
                    <Tab
                        heading={
                            <TabHeading style={pageStyle.tabHeadingStyle}>
                                <WSTouchable
                                    onPress={() => this.tabs.goToPage(0)}
                                    rippleColor={ConfiguredStyle.colors.rippleColorDark}
                                    style={pageStyle.rippleStyle}
                                >
                                    <Icon type="MaterialIcons" name="perm-contact-calendar" style={currentTab == 0 ? pageStyle.activeIcon : pageStyle.disableIcon} />
                                </WSTouchable>
                            </TabHeading>
                        }
                    >
                        <CreateSocialContacts />
                    </Tab>
                    <Tab
                        heading={
                            <TabHeading style={pageStyle.tabHeadingStyle}>
                                <WSTouchable
                                    onPress={() => this.tabs.goToPage(1)}
                                    rippleColor={ConfiguredStyle.colors.rippleColorDark}
                                    style={pageStyle.rippleStyle}
                                >
                                    <Icon type="FontAwesome5" name="google" style={currentTab == 1 ? pageStyle.activeIcon : pageStyle.disableIcon} />
                                </WSTouchable>
                            </TabHeading>
                        }
                    >
                        <SocialDesc
                            name='Google'
                            name='Connect Your Google'
                            desc={description}
                            buttonText='Connect Google Account'
                            buttonEvent={() => { }}
                        />
                    </Tab>
                    <Tab
                        heading={
                            <TabHeading style={pageStyle.tabHeadingStyle}>
                                <WSTouchable
                                    onPress={() => this.tabs.goToPage(2)}
                                    rippleColor={ConfiguredStyle.colors.rippleColorDark}
                                    style={pageStyle.rippleStyle}
                                >
                                    <Icon type="FontAwesome5" name="facebook-square" style={currentTab == 2 ? pageStyle.activeIcon : pageStyle.disableIcon} />
                                </WSTouchable>
                            </TabHeading>
                        }
                    >
                        <SocialDesc
                            name='Connect Your Facebook'
                            desc={description}
                            buttonText='Connect Facebook Account'
                            buttonEvent={() => { }}
                        />
                    </Tab>
                    <Tab
                        heading={
                            <TabHeading style={pageStyle.tabHeadingStyle}>
                                <WSTouchable
                                    onPress={() => this.tabs.goToPage(3)}
                                    rippleColor={ConfiguredStyle.colors.rippleColorDark}
                                    style={pageStyle.rippleStyle}
                                >
                                    <Icon type="FontAwesome5" name="linkedin" style={currentTab == 3 ? pageStyle.activeIcon : pageStyle.disableIcon} />
                                </WSTouchable>
                            </TabHeading>
                        }
                    >
                        <SocialDesc
                            name='Connect Your LinkedIn'
                            desc={description}
                            buttonText='Connect LinkedIn Account'
                            buttonEvent={() => { }}
                        />
                    </Tab>
                </Tabs>
                {/* <View style={pageStyle.tabs}>
                    <TouchableWithoutFeedback
                        onPress={() => this.switchTab(enums.CONTACT)}
                    >
                        <View
                            style={
                                contact
                                    ? [pageStyle.tabTextView, pageStyle.activeTab]
                                    : [pageStyle.tabTextView, pageStyle.disableTab]
                            }
                        >
                            <Icon type="MaterialIcons" name="perm-contact-calendar" style={contact ? pageStyle.activeIcon : pageStyle.disableIcon} />
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback
                        onPress={() => this.switchTab(enums.GOOGLE)}
                    >
                        <View
                            style={
                                google
                                    ? [pageStyle.tabTextView, pageStyle.activeTab]
                                    : [pageStyle.tabTextView, pageStyle.disableTab]
                            }
                        >
                            <Icon type="FontAwesome5" name="google" style={google ? pageStyle.activeIcon : pageStyle.disableIcon} />
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback
                        onPress={() => this.switchTab(enums.FACEBOOK)}
                    >
                        <View
                            style={
                                facebook
                                    ? [pageStyle.tabTextView, pageStyle.activeTab]
                                    : [pageStyle.tabTextView, pageStyle.disableTab]
                            }
                        >
                            <Icon type="FontAwesome5" name="facebook-square" style={facebook ? pageStyle.activeIcon : pageStyle.disableIcon} />
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback
                        onPress={() => this.switchTab(enums.LINKEDIN)}
                    >
                        <View
                            style={
                                linkedIn
                                    ? [pageStyle.tabTextView, pageStyle.activeTab]
                                    : [pageStyle.tabTextView, pageStyle.disableTab]
                            }
                        >
                            <Icon type="FontAwesome5" name="linkedin" style={linkedIn ? pageStyle.activeIcon : pageStyle.disableIcon} />
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                {contact ? <CreateSocialContacts /> : google ? <SocialDesc name='Google' name='Connect Your Google' desc={description} buttonText='Connect Google Account' /> : facebook ? <SocialDesc name='Connect Your Facebook' desc={description} buttonText='Connect Facebook Account' /> : <SocialDesc name='Connect Your LinkedIn' desc={description} buttonText='Connect LinkedIn Account' />} */}
            </View>
        );
    }
}

export default ContactTab
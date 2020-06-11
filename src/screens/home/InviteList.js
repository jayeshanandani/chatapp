import React, { PureComponent } from 'react'
import { Thumbnail } from 'native-base'
import {
    View,
    Text,
    TouchableWithoutFeedback,
    StyleSheet,
    FlatList,
    CheckBox,
    TouchableOpacity
} from 'react-native'
import { Divider } from 'react-native-paper';
import { connect } from 'react-redux'
import _ from 'lodash'

import ConfiguredStyle from '@constants/Variables'
import Typography from '@constants/Typography'
import images from '@constants/Image'
import enums from '@constants/Enum'

import WSButton from '@components/WSButton'
import WSTouchable from '@components/WSTouchable'
import WSSnackBar from '@components/WSSnackBar'
import WSImage from '@components/WSImage'
import EmptyState from '@components/EmptyState'

import common from '@styles/common'

const pageStyle = StyleSheet.create({
    iconStyle: {
        position: enums.ABSOLUTE,
        bottom: 5,
        right: 5,
    },
    icon: {
        color: ConfiguredStyle.colors.white,
        fontSize: ConfiguredStyle.fonts.xsm,
    },
    disableText: {
        fontSize: ConfiguredStyle.fonts.sm,
        fontWeight: enums.BOLD,
        color: ConfiguredStyle.colors.grey.light,
    },
    dividerStyle: {
        backgroundColor: ConfiguredStyle.colors.grey.medium
    },
    createGroupContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 15
    },
    createGroupLabel: {
        fontSize: 14,
        marginLeft: 15,
        fontWeight: '600'
    },
    availableGroupContainer: {
        justifyContent: 'center',
        margin: 15,
        marginBottom: 25
    },
    availableGroupLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: ConfiguredStyle.colors.grey.medium
    },
    selectAllContainer: {
        flexDirection: 'row',
        marginTop: 15,
        alignItems: 'center',
        marginHorizontal: 10
    },
    checkBoxStyle: {
        color: ConfiguredStyle.colors.primary,
        marginRight: 5
    }
})
class InviteList extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            users: [],
            isLoading: false,
            selectAll: false,
            selectedUser: [],
            groupData: [
                { name: 'HealthCare Mates' },
                { name: 'XYZ Group' },
            ]
        }
        this.toastRef = React.createRef();
    }

    // componentWillMount() {
    //     const { users, navigation } = this.props
    //     const { passSelectedData } = navigation.state.params
    //     if (passSelectedData && passSelectedData.length) {
    //         this.setState({
    //             selectedUser: passSelectedData,
    //         })
    //     }
    // }

    // sendSelectedData = () => {
    //     const { selectedUser } = this.state
    //     const { users, navigation, componentId } = this.props
    //     if (!selectedUser.length) {
    //         this.toastRef.current.show('At least 1 contact must be selected', 1000);
    //     } else {
    //         const selectedUsers = [...selectedUser]
    //         const unionArray = _.union(selectedUsers)
    //         navigation.state.params.onPassProp(unionArray);
    //         navigation.goBack(componentId);
    //     }
    // }

    addUserInGroup = addUser => {
        const { selectedUser } = this.state
        addUser.disable = true,
            this.setState({
                selectedUser: selectedUser.concat([addUser])
            })
    }

    removeUserFromGroup = user => {
        const { selectedUser } = this.state
        user.disable = false
        this.setState({
            selectedUser: selectedUser.filter((item) => item && item.id !== user && user.id)
        })
    }

    renderSelectedUserList = ({ item, index }) => {
        return (
            <TouchableWithoutFeedback onPress={() => this.removeUserFromGroup(item)}>
                <View style={[common.mr5, common.mb20]}>
                    <Thumbnail source={item && item.media && item.media.small ? { uri: item.media.small } : images.avatar} style={common.mr10} />
                    <View style={[common.exactCenter, pageStyle.iconStyle]}>
                        <WSImage
                            image={images.cancelGroupUsers}
                            height={ConfiguredStyle.size.s15}
                            width={ConfiguredStyle.size.s15}
                            resizeMode={'contain'}
                            imageStyle={{ backgroundColor: ConfiguredStyle.colors.white, borderRadius: 20 }}
                            onPress={() => this.removeUserFromGroup(item)}
                        />
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }

    disableList = (item) => {
        const { selectedUser } = this.state
        const disableState = _.findIndex(selectedUser, (user) => user && user.id === item && item.id);
        if (disableState > -1) {
            return true
        } else {
            return false
        }
    }

    renderUsersList = ({ item }) => {
        return (
            <WSTouchable onPress={() => this.addUserInGroup(item)} disabled={this.disableList(item)} rippleColor={ConfiguredStyle.colors.rippleColorDark} >
                <View style={[common.ph5, common.flex1, common.flexDirectionRow, common.alignItemCenter, common.mt20]}>
                    <View style={[common.flex1, common.flexDirectionRow]}>
                        <Thumbnail small source={(item && item.media && item.media.small) ? { uri: item.media.small } : images.avatar} style={common.ml10} />
                        <View>
                            <Text style={[(this.disableList(item)) ? pageStyle.disableText : Typography.PrimaryH1, common.pl10]}>{item && _.upperFirst(item && item.userName)}</Text>
                            <Text style={[Typography.h2, common.pl10, common.fBold]}>{item && item.careId}</Text>
                        </View>
                    </View>
                </View>
            </WSTouchable>
        )
    }

    renderGroupList = ({ item }) => {
        return (
            <WSTouchable rippleColor={ConfiguredStyle.colors.rippleColorDark} >
                <View style={[common.ph5, common.flex1, common.flexDirectionRow, common.alignItemCenter, common.mt20]}>
                    <View style={[common.flex1, common.flexDirectionRow, { alignItems: 'center' }]}>
                        <Thumbnail small source={images.avatar} />
                        <View>
                            <Text style={Typography.PrimaryH1, common.pl10}>{item.name}</Text>
                        </View>
                    </View>
                </View>
            </WSTouchable>
        )
    }

    _renderEmptyState = () => {
        return (
            <EmptyState message='Users not available' image={images.avatar} margin={80} />
        )
    }

    render() {
        const { selectedUser, groupData } = this.state
        const { users, navigation } = this.props;
        return (
            <View style={[common.flex1, common.bgWhite]}>
                {(selectedUser.length !== 0) && (
                    <View>
                        <FlatList
                            showsHorizontalScrollIndicator={false}
                            data={selectedUser}
                            extraData={this.state}
                            keyExtractor={(item, index) => 'selectedUser_' + index}
                            horizontal
                            contentContainerStyle={[common.ph20, { alignItems: 'center', justifyContent: 'flex-start' }]}
                            renderItem={this.renderSelectedUserList}
                        />
                        <Divider style={pageStyle.dividerStyle} />
                    </View>
                )}
                <TouchableOpacity style={pageStyle.createGroupContainer} onPress={() => navigation && navigation.navigate("NewGroup")}>
                    <WSImage
                        image={images.createGroup}
                        height={ConfiguredStyle.size.s40}
                        width={ConfiguredStyle.size.s40}
                        resizeMode={'contain'}
                        imageStyle={{ backgroundColor: ConfiguredStyle.colors.white }}
                    />
                    <Text style={pageStyle.createGroupLabel}>Create Group</Text>
                </TouchableOpacity>
                <Divider style={pageStyle.dividerStyle} />
                <View style={pageStyle.availableGroupContainer}>
                    <Text style={pageStyle.availableGroupLabel}>Available Groups</Text>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={groupData}
                        extraData={this.state}
                        keyExtractor={(item, index) => 'addPeople_' + index}
                        renderItem={this.renderGroupList}
                        ListEmptyComponent={this._renderEmptyState}
                    />
                </View>
                <Divider style={pageStyle.dividerStyle} />
                <View style={pageStyle.selectAllContainer}>
                    <CheckBox style={pageStyle.checkBoxStyle} />
                    <Text>Select All</Text>
                </View>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={users}
                    extraData={this.state}
                    keyExtractor={(item, index) => 'addPeople_' + index}
                    renderItem={this.renderUsersList}
                    ListEmptyComponent={this._renderEmptyState}
                />
                <WSSnackBar ref={this.toastRef} />
                {users && users.length !== 0 && (
                    <View style={[common.pv15, common.ph20, common.mb20]}>
                        <WSButton
                            onBtnPress={() => navigation && navigation.navigate("ContactList")}
                            name="Done"
                            style={{ borderRadius: 50 }}
                        />
                    </View>
                )}
            </View>
        )
    }
}

const mapStateToProps = (state) => ({
    users: state.user.allUserData
});

const mapDispatchToProps = (dispatch) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(InviteList)
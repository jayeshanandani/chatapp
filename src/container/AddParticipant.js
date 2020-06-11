import React, { Component } from 'react'
import {
    Text,
    View,
    StyleSheet,
    FlatList,
} from 'react-native'
import { Chip } from 'react-native-paper'

import ConfiguredStyle from '@constants/Variables'
import images from '@constants/Image'

import WSTouchable from '@components/WSTouchable'
import WSImage from '@components/WSImage'

import common from '@styles/common'
import styles from '@styles/AppStyle'

const pageStyle = StyleSheet.create({
    remindText: {
        width: '100%',
        paddingTop: ConfiguredStyle.padding.sm,
        paddingBottom: ConfiguredStyle.padding.sm,
    },
    addedName: {
        marginRight: ConfiguredStyle.margin.xsm,
    },
    chipContainer: {
        marginVertical: ConfiguredStyle.margin.sm,
        marginRight: ConfiguredStyle.margin.sm,
    },
    chip: {
        backgroundColor: ConfiguredStyle.colors.primary,
        borderRadius: ConfiguredStyle.size.s40,
        paddingHorizontal: ConfiguredStyle.padding.xsm
    },
    chipName: {
        color: ConfiguredStyle.colors.white,
    }
})

class AddParticipant extends Component {

    renderItems = ({ item }) => {
        const { removeUser, onAddPeople } = this.props
        return (
            <View style={pageStyle.chipContainer}>
                <Chip
                    onPress={onAddPeople}
                    style={[common.exactCenter, pageStyle.chip]}
                    textStyle={pageStyle.addedName}
                    icon={() => (
                        <WSImage
                            image={images.cancelUsers}
                            height={ConfiguredStyle.size.s15}
                            width={ConfiguredStyle.size.s15}
                            resizeMode={'contain'}
                            imageStyle={{ backgroundColor: ConfiguredStyle.colors.opacity.black_op_0 }}
                            onPress={() => removeUser(item && item.id)}
                        />
                    )}
                >
                    <Text style={pageStyle.chipName}>{item && item.userName}</Text>
                </Chip>
            </View>
        )
    }

    _renderEmptyState = () => {
        const { onAddPeople } = this.props
        return (
            <WSTouchable
                rippleColor={ConfiguredStyle.colors.rippleColorDark}
                onPress={onAddPeople}
                style={pageStyle.remindText}>
                <Text style={common.colorLightGrey}>Please select the recipient...</Text>
            </WSTouchable>
        )
    }

    render() {
        const { addedUserList } = this.props
        return (
            <View style={styles.borderBottom}>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={addedUserList}
                    extraData={this.props}
                    contentContainerStyle={{ minWidth: '100%' }}
                    renderItem={this.renderItems}
                    keyExtractor={(item, index) => "participant_" + index}
                    ListEmptyComponent={this._renderEmptyState}
                    keyboardShouldPersistTaps={''}
                />
            </View>
        )
    }
}

export default React.memo(AddParticipant);
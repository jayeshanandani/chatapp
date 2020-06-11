import React, { PureComponent } from 'react'
import { View, Image, PixelRatio, StyleSheet, Text } from 'react-native'
import ImagePicker from 'react-native-image-picker'

import ConfiguredStyle from '@constants/Variables'
import enums from '@constants/Enum'

import WSIcon from '@components/WSIcon'
import WSTouchable from '@components/WSTouchable'

import common from '@styles/common'

const pageStyles = StyleSheet.create({
    avatarContainer: {
        borderColor: ConfiguredStyle.colors.primary,
        borderWidth: 1 / PixelRatio.get(),
        justifyContent: enums.CENTER,
        alignItems: enums.CENTER,
        borderRadius: ConfiguredStyle.size.s15,
        height: '100%',
        width: '100%',
    },
    avatar: {
        borderRadius: ConfiguredStyle.size.s15,
        width: ConfiguredStyle.dimensions.fullHeight / 8,
        height: ConfiguredStyle.dimensions.fullHeight / 8,
    },
    icon: {
        fontSize: ConfiguredStyle.fonts.f18,
        color: ConfiguredStyle.colors.primaryTransparent
    }
});

class WSImagePicker extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            avatarSource: null,
        }
    }

    selectPhotoTapped = () => {
        const options = {
            quality: 1,
            maxWidth: 500,
            maxHeight: 500,
            storageOptions: {
                skipBackup: true,
            },
        };

        ImagePicker.showImagePicker(options, (response) => {
            if (response && response.didCancel) {
                console.log('User cancelled photo picker');
            } else if (response && response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response && response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                console.log(response);
                
                let source = { uri: response && response.uri };

                this.setState((prevState) => ({
                    ...prevState,
                    avatarSource: source,
                }), () => {
                    const { getImageDetailsToUpload } = this.props
                    getImageDetailsToUpload(response);
                });
            }
        });
    }

    render() {
        const { media, text, textStyle, viewProfile } = this.props
        const { avatarSource } = this.state

        return (
            <View style={[common.flexDirectionRow, common.exactCenter]}>
                <WSTouchable
                    onPress={() => {
                        if (text && (media || avatarSource)) {
                            viewProfile();
                        } else {
                            this.selectPhotoTapped();
                        }
                    }}
                    rippleColor={ConfiguredStyle.colors.rippleColor}
                    style={[
                        { backgroundColor: ConfiguredStyle.colors.primary },
                        pageStyles.avatar,
                    ]}
                >
                    <View
                        style={
                            pageStyles.avatarContainer
                        }
                    >
                        {(!media && !avatarSource) ? (
                            <WSIcon
                                onBtnPress={this.selectPhotoTapped}
                                fontFamily={ConfiguredStyle.fontFamily.FARegular}
                                iconStyle={pageStyles.icon}
                                iconCode='&#xf030;'
                            />
                        ) : (
                                <Image style={pageStyles.avatar} source={(avatarSource) ? avatarSource : { uri: media }} />
                            )}
                    </View>
                </WSTouchable>
                {text && (<Text style={textStyle} onPress={this.selectPhotoTapped}>{text}</Text>)}
            </View>
        );
    }
}

export default WSImagePicker;
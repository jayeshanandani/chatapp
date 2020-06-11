import React, { PureComponent } from 'react'
import {
  View,
  SectionList,
  Text,
  StyleSheet,
  FlatList
} from 'react-native'
import { connect } from 'react-redux'

import ConfiguredStyle from '@constants/Variables'

import { groupByWithDate } from '@helper/GenericFunction'

import WSMediaImage from '@components/WSMediaImage'
import WSHeader from '@components/WSHeader'

import common from '@styles/common'
import ChatStyle from '@styles/ChatStyle'

const pageStyle = StyleSheet.create({
  image: {
    width: ConfiguredStyle.dimensions.fullHeight / 10,
    height: ConfiguredStyle.dimensions.fullHeight / 10,
    backgroundColor: ConfiguredStyle.colors.grey.lightest,
  },
})

class ShareMedia extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    const { media } = this.props
    var groups = groupByWithDate(media)
    groups.map((item, index) => {
      let temp = [];
      temp.push(item && item.data);
      groups[index].data = temp;
    })
    this.setState({
      dateOfMedia: groups,
    }, () => console.log("dateOfMedia:==::==:", groups))
  }

  renderItem = ({ item, index, section }) => {
    const { navigation } = this.props
    return (
      <View style={common.exactCenter}>
        <FlatList
          data={section.data[0]}
          numColumns={4}
          keyExtractor={(item, index) => 'allMedia_' + index}
          renderItem={({ item }) => (
            <WSMediaImage
              media={item}
              styles={[pageStyle.image, common.mh10, common.mv10]}
              navigation={navigation}
            />
          )}
        />
      </View>
    )
  }

  renderSectionHeader = ({ section: { title } }) => {
    return (
      <Text style={[ChatStyle.title]}>{title}</Text>
    )
  }

  render() {
    const { dateOfMedia } = this.state
    const { navigation } = this.props
    return (
      <View style={[common.flex1, { backgroundColor: 'white' }]}>
        <WSHeader
          enableBack
          name="Shared Media"
          onLeftMethod={() => navigation.goBack()}
        />
        {/* <ScrollView> */}
        <SectionList
          sections={dateOfMedia}
          extraData={this.state}
          keyExtractor={(item, index) => 'sectionMedia_' + index}
          showsVerticalScrollIndicator={false}
          renderItem={this.renderItem}
          renderSectionHeader={this.renderSectionHeader}
          stickySectionHeadersEnabled={true}
          initialNumToRender={50}
        />
        {/* </ScrollView> */}
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    media: state.user.media,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ShareMedia)
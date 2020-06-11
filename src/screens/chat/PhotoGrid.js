import React from 'react'
import {
  Image,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
} from 'react-native'

import ConfiguredStyle from '@constants/Variables'
import enums from '@constants/Enum'

import WSImageGrid from '@components/WSImageGrid'

import common from '@styles/common'

const pageStyle = StyleSheet.create({
  image: {
    width: ConfiguredStyle.dimensions.fullWidth / 5,
    height: ConfiguredStyle.dimensions.fullHeight / 8,
    backgroundColor: ConfiguredStyle.colors.primary,
    opacity: ConfiguredStyle.radius.border,
    position: enums.ABSOLUTE,
    zIndex: ConfiguredStyle.size.s1,
    justifyContent: enums.CENTER,
    alignItems: enums.CENTER,
  },
})

class PhotoGrid extends React.Component {
  constructor(props) {
    super(props)
    this.state = { items: [] }
  }

  componentDidMount() {
    const items = Array.apply(null, Array(10)).map((v, i) => ({ id: i, src: 'http://placehold.it/200x200?text', total: 10 }))
    this.setState(prevState => ({ ...prevState, items }))
  }

  renderItem = (item, itemPaddingHorizontal) => {
    const { navigation } = this.props
    return (
      <TouchableOpacity
        key={item && item.id}
        style={[{ paddingHorizontal: itemPaddingHorizontal }, pageStyle.image]}
        hitSlop={common.hitSlope10}
        onPress={() => navigation.navigate('ShareMedia', { imageList: item.total })}
      >
        {(item && item.id < 4)
          ? (
            <>
              {item && item.id >= 3 && (
                <View style={[pageStyle.image]}>
                  <Text style={[common.f20, common.colorWhite]}>
                    more
                    {/* for reference */}
                    {/* {'+ ' + `${item && item.total - item && item.id}`} */}
                  </Text>
                </View>
              )}
              <Image
                style={common.flex1}
                source={{ uri: item && item.src }}
              />
            </>
          )
          : <></>}
      </TouchableOpacity>
    )
  }

  render() {
    const { items } = this.state
    return (
      <WSImageGrid
        data={items}
        itemsPerRow={ConfiguredStyle.size.s4}
        itemMargin={ConfiguredStyle.size.xsm}
        itemPaddingHorizontal={ConfiguredStyle.size.s1}
        renderItem={this.renderItem}
      />
    )
  }
}

export default PhotoGrid
import React, { memo } from 'react'
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native'

import ConfiguredStyle from '@constants/Variables'
import enums from '@constants/Enum'

import WSMediaImage from '@components/WSMediaImage'

import common from '@styles/common'

const pageStyle = StyleSheet.create({
  image: {
    width: ConfiguredStyle.dimensions.fullHeight / 10,
    height: ConfiguredStyle.dimensions.fullHeight / 10,
    backgroundColor: ConfiguredStyle.colors.grey.lightest,
  },
  boxTrans: {
    position: enums.ABSOLUTE,
    backgroundColor: ConfiguredStyle.colors.opacity.purple_op_40,
    width: '100%',
    height: '100%',
    justifyContent: enums.CENTER,
    alignItems: enums.CENTER,
  },
  moreText: {
    fontWeight: 'bold'
  }
})

const WSImageList = (props) => {
  const { renderList, navigation, ...rest } = props
  return (
    <FlatList
      {...rest}
      data={renderList}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item, index) => 'mediaImage_' + index}
      renderItem={({ item, index }) => (
        <View style={[pageStyle.image, common.mr10]}>
          <WSMediaImage
            media={item}
            styles={{ width: '100%', height: '100%' }}
            navigation={navigation}
          />
          {renderList.length > 4 && renderList.length - 1 == index && (
            <TouchableOpacity style={pageStyle.boxTrans} onPress={() => navigation.navigate('ShareMedia')}>
              <Text style={[common.colorWhite, pageStyle.moreText]}>More</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      ListEmptyComponent={() => (
        <Text style={{ color: ConfiguredStyle.colors.grey.light, paddingVertical: ConfiguredStyle.padding.sm }}>No Media Found...</Text>
      )}
    />
  )
}

export default memo(WSImageList)
import React, { memo } from 'react'
import { View, Text } from 'react-native'
import { Thumbnail } from 'native-base'

const EmptyState = (props) => {
  const {
    image,
    message,
    margin
  } = props
  return (
    <View style={{
      flexGrow: 1, justifyContent: 'center', alignItems: 'center', marginTop: margin,
    }}
    >
      <Thumbnail large source={image} />
      <Text style={{ paddingTop: 10, color: 'grey', fontSize: 18 }}>{message}</Text>
    </View>
  )
}

export default memo(EmptyState)
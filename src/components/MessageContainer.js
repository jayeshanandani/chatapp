import React, { PureComponent } from 'react'
import { Text, FlatList, View, StyleSheet, TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'
import FontAwesome from "react-native-vector-icons/FontAwesome"

import MessageBox from './MessageBox'
import LoadEarlier from './LoadEarlier'

import ChatStyle from '@styles/ChatStyle'
import ConfiguredStyle from '@constants/Variables'
import enums from '@constants/Enum'

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
  },
  contentContainerStyle: {
    flexGrow: 1,
    justifyContent: enums.START,
  },
  listStyle: {
    flex: 1,
  },
  headerWrapper: {
    flex: 1,
  },
  scrollToBottomStyle: {
    opacity: 0.8,
    position: enums.ABSOLUTE,
    right: ConfiguredStyle.margin.m15,
    bottom: ConfiguredStyle.margin.sm,
    zIndex: 999,
    height: ConfiguredStyle.size.s40,
    width: ConfiguredStyle.size.s40,
    borderRadius: ConfiguredStyle.size.sm,
    elevation: 3,
    backgroundColor: ConfiguredStyle.colors.primary,
    alignItems: enums.CENTER,
    justifyContent: enums.CENTER,
    shadowColor: ConfiguredStyle.colors.black,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 1,
  },
})

class MessageContainer extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      refresh: false,
      showScrollBottom: false,
      loadEarlier: true,
      isLoadingEarlier: false,
    };

    this.messageList = React.createRef();
    this._isMounted = false
  }

  componentDidMount() {
    this._isMounted = true
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.data) {
      console.log('datadatadata: update')
      return { refresh: !prevState.refresh }
    }
    return {}
  }

  scrollTo(options) {
    if (this.messageList && this.messageList.current && options) {
      this.messageList.current.scrollToOffset(options)
    }
  }

  scrollToBottom = (animated = true) => {
    this.scrollTo({ animated, offset: 0 })
  }

  handleOnScroll = (event) => {
    const {
      nativeEvent: {
        contentOffset: { y: contentOffsetY },
      },
    } = event
    const { scrollToBottomOffset } = this.props
    if (contentOffsetY > scrollToBottomOffset) {
      this.setState({ showScrollBottom: true })
    } else {
      this.setState({ showScrollBottom: false })
    }
  }

  onLoadEarlier = () => {
    this.setState({ isLoadingEarlier: true })

    setTimeout(() => {
      if (this._isMounted === true) {
        this.setState((previousState) => {
          return {
            messages: currentMessages.concat(messages),
            isLoadingEarlier: false,
          }
        })
      }
    }, 1500) // simulating network
  }

  onEndReached = ({ distanceFromEnd }) => {
    if (
      distanceFromEnd > 0 &&
      distanceFromEnd <= 100 &&
      !this.state.isLoadingEarlier
    ) {
      this.onLoadEarlier()
    }
  }

  onLayoutList = () => {
    if (!!this.props.data && this.props.data.length > 0) {
      setTimeout(
        () => this.scrollToBottom && this.scrollToBottom(false),
        15 * this.props.data.length,
      )
    }
  }

  renderHeaderWrapper = () => {
    if (this.state.isLoadingEarlier === true) {
      return (
        <View style={styles.headerWrapper}>
          <LoadEarlier
            onLoadEarlier={this.onLoadEarlier()}
            isLoadingEarlier={this.state.isLoadingEarlier}
          />
        </View>
      );
    }
    return <View />
  }

  renderScrollToBottomWrapper() {
    return (
      <View style={styles.scrollToBottomStyle}>
        <TouchableOpacity
          onPress={() => this.scrollToBottom()}
          hitSlop={{ top: 5, left: 5, right: 5, bottom: 5 }}
        >
          <FontAwesome
						name={'angle-double-down'}
						size={ConfiguredStyle.size.s25}
						color={ConfiguredStyle.colors.white}
					/>
        </TouchableOpacity>
      </View>
    )
  }

  renderMessage = ({ item, index, section }) => (
    <MessageBox
      data={item}
      currentIndex={index}
    />
  );

  renderItem = ({ item, index, section }) => (
    <View>
      <Text style={ChatStyle.title}>{item.title}</Text>
      {/* <FlatList
        data={item && item.data}
        keyExtractor={(item, index) => 'chatMessage_' + item.localMessageId}
        renderItem={this.renderMessage}
      /> */}
      {item.data.map((msg, subIndex) => (
        <MessageBox
          key={'chatMessage_' + subIndex?.localMessageId}
          data={msg}
          currentIndex={subIndex}
        />
      ))}
    </View>
  );

  render() {
    const { data, inverted } = this.props;
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 0.1, }}>&nbsp;</Text>
        {this.state.showScrollBottom && this.renderScrollToBottomWrapper()}
        <View style={{ flex: 1 }}>
          <FlatList
            ref={this.messageList}
            extraData={this.state.refresh}
            data={data}
            keyExtractor={(item, index) => 'messageDate_' + index}
            // keyExtractor={(item, index) => 'chatMessage_' + item.localMessageId}
            inverted={inverted}
            style={styles.listStyle}
            contentContainerStyle={styles.contentContainerStyle}
            renderItem={this.renderItem}
            // enableEmptySections
            // automaticallyAdjustContentInsets={false} //effect shows only in IOS
            // {...this.props.invertibleScrollViewProps}
            // ListEmptyComponent={this.renderChatEmpty}
            // ListFooterComponent={this.renderFooter}
            // ListHeaderComponent={this.renderHeaderWrapper}
            onScroll={this.handleOnScroll}
            scrollEventThrottle={100}
            onLayout={this.onLayoutList}
            // onEndReached={this.onEndReached}
            // onEndReachedThreshold={0.1}
            // {...this.props.listViewProps}
          />
        </View>
      </View>
    )
  }
}

MessageContainer.propTypes = {
  data: PropTypes.array,
  inverted: PropTypes.bool,
  scrollToBottomOffset: PropTypes.number,
  onLoadEarlier: PropTypes.func,
}

MessageContainer.defaultProps = {
  data: [],
  inverted: true,
  scrollToBottomOffset: ConfiguredStyle.dimensions.fullHeight,
  onLoadEarlier: () => {},
}

export default MessageContainer;
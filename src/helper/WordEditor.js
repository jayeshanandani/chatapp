/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-shadow */
import React, { Component } from 'react'
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Platform,
  TouchableOpacity,
  Keyboard,
} from 'react-native'
import KeyboardSpacer from 'react-native-keyboard-spacer'
import RNDraftView from 'react-native-draftjs-editor'

import WSTouchable from '@components/WSTouchable'
import WSButton from '@components/WSButton'
import ConfiguredStyle from '@constants/Variables'

import common from '@styles/common'

const ControlButton = ({ text, action, isActive, textStyle = {} }) => {
  return (
    <View style={[common.exactCenter, styles.controlButtonContainer, isActive && { backgroundColor: ConfiguredStyle.colors.primary }]}>
      <WSTouchable
        style={[common.exactCenter, { height: '100%', width: '100%' }]}
        rippleColor={isActive ? ConfiguredStyle.colors.rippleColor : ConfiguredStyle.colors.rippleColorDark}
        onPress={action}
      >
        <Text style={[styles.textStyle, textStyle, isActive && { color: ConfiguredStyle.colors.white }]}>{text}</Text>
      </WSTouchable>
    </View>
  );
};

const EditorToolBar = ({
  activeStyles,
  blockType,
  toggleStyle,
  toggleBlockType,
}) => {
  return (
    <View style={styles.toolbarContainer}>
      <ControlButton
        text={'B'}
        textStyle={{ fontWeight: 'bold' }}
        isActive={activeStyles.includes('BOLD')}
        action={() => toggleStyle('BOLD')}
      />
      <ControlButton
        text={'I'}
        textStyle={{ fontStyle: 'italic' }}
        isActive={activeStyles.includes('ITALIC')}
        action={() => toggleStyle('ITALIC')}
      />
      <ControlButton
        text={'U'}
        textStyle={{ textDecorationLine: 'underline' }}
        isActive={activeStyles.includes('UNDERLINE')}
        action={() => toggleStyle('UNDERLINE')}
      />
      <ControlButton
        text={'S'}
        textStyle={{ textDecorationLine: 'line-through' }}
        isActive={activeStyles.includes('STRIKETHROUGH')}
        action={() => toggleStyle('STRIKETHROUGH')}
      />
      <ControlButton
        text={'H1'}
        isActive={blockType === 'header-one'}
        action={() => toggleBlockType('header-one')}
      />
      <ControlButton
        text={'H3'}
        isActive={blockType === 'header-three'}
        action={() => toggleBlockType('header-three')}
      />
      <ControlButton
        text={'ul'}
        isActive={blockType === 'unordered-list-item'}
        action={() => toggleBlockType('unordered-list-item')}
      />
      <ControlButton
        text={'ol'}
        isActive={blockType === 'ordered-list-item'}
        action={() => toggleBlockType('ordered-list-item')}
      />
    </View>
  );
};

const styleMap = {
  STRIKETHROUGH: {
    textDecoration: 'line-through',
  },
};

class WordEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStyles: [],
      blockType: 'unstyled',
      keyboardState: false,
      showDoneButton: false,
    }
    this._draftRef = React.createRef();
  }

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }

  componentDidUpdate(prevProps, prevState) {
    const { changeText, showDoneButton } = this.props
    const { keyboardState } = this.state
    changeText(this._draftRef.current.getEditorState())

    if (!prevState.keyboardState && keyboardState) {
      this.setState({ showDoneButton: true });
      showDoneButton(true);
    }
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow = () => {
    this.setState({ keyboardState: true });
  }

  _keyboardDidHide = () => {
    const { showDoneButton } = this.props
    this.setState({ keyboardState: false, showDoneButton: false });
    showDoneButton(false);
  }

  editorLoaded = () => {
    this._draftRef.current && this._draftRef.current.focus();
  };


  toggleStyle = style => {
    this._draftRef.current && this._draftRef.current.setStyle(style);
  };

  toggleBlockType = blockType => {
    this._draftRef.current && this._draftRef.current.setBlockType(blockType);
  };

  render() {
    const { wordValue } = this.props
    const { activeStyles, blockType, showDoneButton } = this.state
    return (
      <SafeAreaView style={styles.main}>
        <View style={styles.bottomBar}>
          <EditorToolBar
            activeStyles={activeStyles}
            blockType={blockType}
            toggleStyle={this.toggleStyle}
            toggleBlockType={this.toggleBlockType}
          />

          {showDoneButton && (
            <WSButton
              name="Done"
              width="20%"
              height={ConfiguredStyle.size.s30}
              contentStyle={{ paddingHorizontal: 0 }}
              style={[common.mv10, common.mr10, { alignSelf: 'flex-end' }]}
              labelStyle={{ fontSize: ConfiguredStyle.fonts.f13 }}
              onBtnPress={() => {
                Keyboard.dismiss();
                this._draftRef.current && this._draftRef.current.blur();
                this.setState({ showDoneButton: false });
                this.props.showDoneButton(false);
              }}
            />
          )}
        </View>

        <TouchableOpacity onPress={() => this._draftRef.current.focus()}>
          <RNDraftView
            defaultValue={wordValue}
            onEditorReady={this.editorLoaded}
            style={styles.editorBox}
            placeholder={'Add text here...'}
            ref={this._draftRef}
            onStyleChanged={(activeStyles) => this.setState({ activeStyles })}
            onBlockTypeChanged={(blockType) => this.setState({ blockType })}
            styleMap={styleMap}
          />
        </TouchableOpacity>

        {Platform.OS === 'ios' && <KeyboardSpacer />}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    marginTop: ConfiguredStyle.size.xsm,
    borderWidth: 0.5,
    borderRadius: 4,
    overflow: 'hidden',
    borderColor: ConfiguredStyle.colors.grey.light
  },
  editorBox: {
    flex: 1,
    minHeight: ConfiguredStyle.size.s150,
    margin: ConfiguredStyle.margin.sm
  },
  bottomBar: {
    borderRadius: 4,
    backgroundColor: '#f1f1f1',
  },
  toolbarContainer: {
    borderRadius: 4,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#f1f1f1',
  },
  controlButtonContainer: {
    marginVertical: 5,
    borderRadius: 4,
    width: ConfiguredStyle.size.s30,
    height: ConfiguredStyle.size.s30,
    backgroundColor: ConfiguredStyle.colors.white,
    elevation: 1,
    shadowColor: 'gray',
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 0,
      height: 3
    },
    overflow: 'hidden',
  },
  textStyle: {
    fontSize: ConfiguredStyle.fonts.s40,
    color: ConfiguredStyle.colors.grey.dark
  }
});

export default WordEditor
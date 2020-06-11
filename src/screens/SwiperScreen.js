import React, { Component } from 'react'

import images from '@constants/Image'

import Swiper from '@components/WSCustomSwiper'
import WSSwiper from '@components/WSSwiper'

const slider = {
  one: {
    position: 1,
    title: 'Use your voice to make tasks easy',
    description: 'With HosTalky, you can use voice-to-text conversion when you can\'t\ type. It\'s\ super convenient.',
    small: 65,
    image: images.slider1,
  },
  two: {
    position: 2,
    title: 'Make Announcements & let masses know',
    description: 'With HosTalky, you can make announcements & let people know about the events taking place.',
    small: 65,
    image: images.slider2,
  },
  three: {
    position: 3,
    title: 'Space for reminders, powerful voice notes & many others',
    description: 'With HosTalky, you get the personal space for keeping reminders, voice notes, to do lists.',
    large: '100%',
    BName: 'Sign Up',
    bottomText: 'Login',
    image: images.slider3,
  },
}

class SwiperScreen extends Component {
  render() {
    const { navigation } = this.props
    return (
      <Swiper
        ref="swiper"
        loop={false}
        showsPagination={false}
        showsButtons={false}
      >
        <React.Fragment>
          <WSSwiper
            title={slider.one.title}
            description={slider.one.description}
            width={slider.one.small}
            image={slider.one.image}
            onSkipButton={() => this.refs.swiper.scrollBy(3)}
            onGetMethod={() => this.refs.swiper.scrollBy(1)}
            header="Skip"
          />
        </React.Fragment>
        <React.Fragment>
          <WSSwiper
            title={slider.two.title}
            description={slider.two.description}
            width={slider.two.small}
            image={slider.two.image}
            onSkipButton={() => this.refs.swiper.scrollBy(2)}
            onBackButton={() => this.refs.swiper.scrollBy(-1)}
            onGetMethod={() => this.refs.swiper.scrollBy(1)}
            header="Skip"
            enableBack
          />
        </React.Fragment>
        <React.Fragment>
          <WSSwiper
            title={slider.three.title}
            description={slider.three.description}
            width={slider.three.large}
            buttonName={slider.three.BName}
            bottomText={slider.three.bottomText}
            image={slider.three.image}
            onBackButton={() => this.refs.swiper.scrollBy(-2)}
            onGetMethod={() => navigation.navigate('SignUp')}
            onLogin={() => navigation.navigate('Login')}
            enableBack
          />
        </React.Fragment>
      </Swiper>
    )
  }
}

export default SwiperScreen
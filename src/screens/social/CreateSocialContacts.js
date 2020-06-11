import React, { Component } from 'react';
import { View, Text, ScrollView } from 'react-native'

import Typography from '@constants/Typography'

import WSInviteList from '@container/WSInviteList'

import common from '@styles/common'

class CreateSocialContacts extends Component {
	constructor(props) {
		super(props)
		this.state = {
			personData: [],
		};
	}

	onClickInvite = (invitedIndex) => {
		const { personData } = this.state
		const filterPerson = personData.map((person, index) => {
			return {
				...person,
				invited: index === invitedIndex || person.invited === true
			}
		})
		this.setState({
			personData: filterPerson
		});
	}

	render() {
		const { personData } = this.state
		return (
			<View style={[common.flex1, common.bgWhite]}>

				<View style={common.ph20}>
					<View style={[common.flexDirectionRow, common.alignItemCenter, common.pv15]}>
						<Text style={Typography.h3}>Contacts</Text>
					</View>
					<ScrollView showsVerticalScrollIndicator={false}>
						<WSInviteList usersList={personData} onClickText={this.onClickInvite} />
					</ScrollView>
				</View>
			</View>
		)
	}
}

export default CreateSocialContacts
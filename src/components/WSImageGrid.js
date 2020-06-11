'use strict';

import React, { PureComponent } from 'react'
import {
    Dimensions,
    ListView,
    StyleSheet,
    View,
} from 'react-native'

import ConfiguredStyle from '@constants/Variables'
import enums from '@constants/Enum'

const styles = StyleSheet.create({
    row: {
        flex: ConfiguredStyle.size.s1,
        flexDirection: enums.ROW,
        justifyContent: enums.START,
    }
});

class WSImageGrid extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            data: new ListView.DataSource({
                rowHasChanged: (r1, r2) => { r1 !== r2; }
            }),
        }
    }

    buildRows(items, itemsPerRow = 3) {
        return items.reduce((rows, item, idx) => {
            // If a full row is filled create a new row array
            if (idx % itemsPerRow === 0 && idx > 0) rows.push([]);
            rows[rows.length - 1].push(item);
            return rows;
        }, [[]]);
    }

    render() {
        const { itemsPerRow } = this.props
        const { data } = this.state
        let rows = this.buildRows(this.props.data, itemsPerRow);
        return (
            <ListView
                {...this.props}
                dataSource={data.cloneWithRows(rows)}
                renderRow={this.renderRow}
                style={{ flex: ConfiguredStyle.size.s1 }} />
        );
    }

    renderRow = (items) => {
        const { itemMargin, itemPaddingHorizontal, renderItem } = this.props
        // Calculate the width of a single item based on the device width
        // and the desired margins between individual items
        let deviceWidth = Dimensions.get('window').width;
        let itemsPerRow = this.props.itemsPerRow;
        let margin = itemMargin || 1;
        let totalMargin = margin * (itemsPerRow - 1);
        let itemWidth = Math.floor((deviceWidth) / itemsPerRow);
        let adjustedMargin = itemPaddingHorizontal * 2;

        return (
            <View style={[styles.row, { marginBottom: adjustedMargin }]}>
                {items.map(item => renderItem(item, itemWidth, itemPaddingHorizontal))}
                {itemsPerRow - items.length > 0 && <View style={{ width: itemWidth * (itemsPerRow - items.length) }} />}
            </View>
        );
    }

}

export default WSImageGrid;
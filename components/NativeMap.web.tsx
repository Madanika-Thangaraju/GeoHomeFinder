import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MapView = React.forwardRef((props: any, ref) => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Maps are not supported on web yet.</Text>
        </View>
    );
});

export const Marker = (props: any) => null;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: '#888',
    },
});

export default MapView;

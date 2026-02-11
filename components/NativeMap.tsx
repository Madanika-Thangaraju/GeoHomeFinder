import React from 'react';
import MapView, { Marker, MapViewProps, MarkerProps } from 'react-native-maps';

export { Marker };
export type { MapViewProps, MarkerProps };

export default React.forwardRef<MapView, MapViewProps>((props, ref) => {
    return <MapView ref={ref} {...props} />;
});

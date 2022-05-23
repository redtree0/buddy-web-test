import React from 'react';
import { compose, withProps } from 'recompose';
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from 'react-google-maps';
import PropTypes from 'prop-types';
// Material UI
import Avatar from '@material-ui/core/Avatar';

import scss from './google-map.module.scss';

const styles = [{
  featureType: 'administrative.country',
  elementType: 'geometry',
  stylers: [
    {
      visibility: 'simplified'
    },
    {
      hue: '#ff0000'
    }
  ]
}];

class GoogleMaps extends React.Component {
  state = {
    mapRef: null
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.activeMarker !== nextProps.activeMarker) {
      this.state.mapRef.panTo(nextProps.activeMarker);
    }
  }

  onMapMounted = (ref) => {
    this.setState({ mapRef: ref });
  };

  onMapClick = () => { }

  render() {
    const {
      markers, onMarkerClick, activeMarker, defaultZoom
    } = this.props;

    return (
      <GoogleMap
        zoom={defaultZoom}
        defaultCenter={{ lat: 37.5651, lng: 126.98955 }}
        defaultOptions={{
          mapTypeControl: false,
          streetViewControl: false,
          scrollwheel: false,
          styles,
          draggableCursor: 'default',
          draggingCursor: 'move'
        }}
        onClick={this.onMapClick}
        ref={this.onMapMounted}
      >
        {markers.map(marker => (
          <Marker
            key={marker.name}
            position={{ lat: marker.lat, lng: marker.lng }}
            onClick={onMarkerClick(marker)}
          />
        ))}
      </GoogleMap>
    );
  }
}


GoogleMaps.defaultProps = {
  activeMarker: null,
  defaultZoom: 8
};

GoogleMaps.propTypes = {
  activeMarker: PropTypes.shape({}),
  markers: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onMarkerClick: PropTypes.func.isRequired,
  defaultZoom: PropTypes.number
};


export default compose(
  withProps({
    googleMapURL: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDXVUKDvaxn13Atl_SPuQj2g5MK-C1RYRs&v=3.exp&libraries=geometry,drawing,places',
    loadingElement: <div style={{ height: '100%' }} />,
    containerElement: <div style={{ height: '100%' }} />,
    mapElement: <div style={{ height: '100%' }} />
  }),
  withScriptjs,
  withGoogleMap
)(GoogleMaps);

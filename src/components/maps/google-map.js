import React, { Component } from 'react'
import "../maps/google-map.scss";
import { fetchApiPost } from './../../helpers/data-access/data-access-service';
import Button from "@material-ui/core/Button";
import ChartLoader from './../loader/chart-loader';
import markerRed from '../../assets/img/icons8-marker-red-25.png';
import markerGreen from '../../assets/img/icons8-marker-green-25.png';
import { updateDevicemapBounds } from './../../redux/actions/device-list-actions';
import { connect } from "react-redux";

const google = window.google;
const MarkerClusterer = window.MarkerClusterer;

class DeviceMap extends Component {

  map = {};
  mapCenter = new google.maps.LatLng( 40.71799354623263, -73.97202148978155 );
  mapOptions = {
    center: this.mapCenter,
    zoom: 2,
    minZoom: 2,
    maxZoom: 12,
    mapTypeControl: false,
    fullscreenControl: false,
    streetViewControl: false,
    scaleControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    restriction: {
      latLngBounds: {
        north: 85,
        south: -85,
        west: -179,
        east: 180
      }
    },

  };

  constructor( props ) {
    super( props );
    this.state = {
      map: {
        isloaded: false,
        modifiedBounds: false,
        markersPlottedFirstTime: false,
        firstLoadCenter:{},
        firstLoadMapBounds:{},

      },
      devices: {
        isLoading: false,
        noData: false,
        isError: false,
        items: [],
      }
    }

  }

  componentDidMount() {
    if ( this.props.chartInput && this.props.chartInput.id ) {
      this.retrieveDevices( this.props.chartInput );
    }
    else{
      this.initMap();
    }
  }

  componentWillReceiveProps( nextProps, nextContext ) {
    if ( nextProps.chartInput && nextProps.chartInput.id ) {
      this.retrieveDevices( nextProps.chartInput );
    }else{
      this.initMap();
    }
  }

  initMap() {
    this.setState( {
      map: {
        isloaded: true,
      }
    } );
    this.map = new google.maps.Map( document.getElementById( "device-map" ), this.mapOptions );
   
  }


  resetMap(){
    const {
      firstLoadCenter,
      firstLoadMapBounds
    } = this.state.map;
    // console.log('state ', this.state);
    this.map.fitBounds( firstLoadMapBounds );
    this.map.setCenter( firstLoadCenter );
    setTimeout(() => {
      this.setState( {
        map: {
          ...this.state.map,
          modifiedBounds: false,
        },
        bounds:""
      }, () => {
          this.props.updateDevicemapBounds( this.state.bounds );
      } );
    }, 500);
  }

  plotMarkers() {
    const {devices: {items}} = this.state;
    const mapBounds = new google.maps.LatLngBounds();
    if(!this.state.map.isloaded){
      this.initMap();
    }
    const markers = items.map( ( { id, deviceClass, site, customer, position,discoveredName}, i) => {
      const infoContent = `<div>
                      <h2>${deviceClass}</h2>
                      <div>${customer}</div>
                      <div>Site:  ${site}</div>
                      <div>Device Name:  ${discoveredName}</div>
                  </div>`;
      mapBounds.extend( new google.maps.LatLng( position.lat, position.lng ));
      return this.addMarker( { lat: position.lat, lng: position.lng }, infoContent);
    });

    setTimeout(() => {
      this.map.fitBounds( mapBounds );
      const mapCenter = items.length > 0 ? mapBounds.getCenter(): this.mapCenter;
      this.map.setCenter( mapCenter );
      setTimeout(() => {
        const cluster = new MarkerClusterer( this.map, markers, {
          imagePath: '/google-maps/m',
        } );


        this.setState( {
          map: {
            markersPlottedFirstTime: true,
            firstLoadCenter: mapCenter,
            firstLoadMapBounds: mapBounds
          }
        }, () => {
          setTimeout( () => {
            this.handleMapEvents();
          }, 2000 );
        } );
      }, 1000);
    }, 100);
  }

  handleMapEvents() {
    this.map.addListener( 'dragend', this.debounce( () => {
      const NE_Bounds = this.map.getBounds().getNorthEast();
      const SW_Bounds = this.map.getBounds().getSouthWest();
      console.log( 'NorthEast lat/longs', NE_Bounds.lat(), NE_Bounds.lat() );
      console.log( 'SouthWest lat/longs', SW_Bounds.lat(), SW_Bounds.lat() );

        this.setState( {
          map: {
            ...this.state.map,
            modifiedBounds: true,
          },
          
          bounds:{sw:SW_Bounds, ne:NE_Bounds}

        }, () => {
            this.props.updateDevicemapBounds( this.state.bounds );
        } );
        // console.log( "Map : dragend" );
      }, 250 ) );

    this.map.addListener( 'zoom_changed', this.debounce( () => {
      const NE_Bounds = this.map.getBounds().getNorthEast();
      const SW_Bounds = this.map.getBounds().getSouthWest();
      console.log( 'NorthEast lat/longs', NE_Bounds.lat(), NE_Bounds.lat() );
      console.log( 'SouthWest lat/longs', SW_Bounds.lat(), SW_Bounds.lat() );
      
      this.setState( {
        map: {
          ...this.state.map,
          modifiedBounds: true,
          
        },
        bounds:{sw:SW_Bounds, ne:NE_Bounds}
        
      }, () => {
          this.props.updateDevicemapBounds( this.state.bounds );
      }
       );
    }, 250 ) );

  }

  debounce( fn, time ) {
    let timeout;
    return () => {
      const args = arguments;
      const functionCall = () => fn.apply( this, args );
      clearTimeout( timeout );
      timeout = setTimeout( functionCall, time );
    }
  }


  addMarker( position, infoContent ) {
    const status = 'Fail';
    let imageURL = markerGreen;
    if ( status === 'fail')
    {
      imageURL = markerRed;
    }

    const marker = new google.maps.Marker( {
      position,
      icon: imageURL
    } );

    if ( infoContent ){
      const infoWindow = new google.maps.InfoWindow( {
        content: infoContent
      } );

      marker.addListener( 'click', () => {
        infoWindow.open( this.map, marker );
      } )
    }
    return marker;
  }

  retrieveDevices( _input ) {
    const req = {
      id: _input.id,
      type: _input.type
    };

    fetchApiPost( process.env.REACT_APP_RETRIEVE_DEVICES, req )
      .then( resp => {
        console.log('resp received ', resp);
        let devices = [];
        if(resp && Array.isArray(resp) && resp.length>0){
          devices = resp.map(device => ({
            id: device.id,
            deviceClass: device.info?.class,
            site: device.info?.site?.name,
            customer: device.info?.customer?.name,
            discoveredName:device.details?.discoveredName,
            position: { 
              lat: device.details?.latLong?.lat, 
              lng: device.details?.latLong?.long
            }
          } ) ).filter( ({ position }) => !!position.lat);
        }
        
        this.setState( {
          devices: {
            items: devices
          }
        }, () => {
          this.plotMarkers();
        } );
      } );
  }


  render() {

    const { modifiedBounds, markersPlottedFirstTime } = this.state.map;

    return (
      <div>
          {
          modifiedBounds && 
              <div className="map-btn">
                <Button 
                  onClick={() => this.resetMap()}
                  className="Reset-btn">
                  Reset
                </Button>
              </div>
          }
        
          <div id="device-map" className="map-height">
            <div>
                {
                  !markersPlottedFirstTime &&
                  <ChartLoader />
                }
            </div>
          </div>
      </div>
    )
  }
}
const mapStateToProps = ( state ) => {
  console.log(state);
  return {
      
  };
};

const mapDispatchToProps = {
  updateDevicemapBounds: updateDevicemapBounds,
};

export default connect( mapStateToProps, mapDispatchToProps )( DeviceMap );
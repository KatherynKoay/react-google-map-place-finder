import React, { useEffect, useCallback } from "react";
import { Input, Layout, Image, List } from "antd";
import "../style/styles.css";
import { useDispatch, useSelector } from "react-redux";
import {
  setAddress,
  addToSearchHistory,
} from "../redux/actions/addressActions";

const { Header, Content, Footer } = Layout;

const script = document.createElement("script");
script.src =
  "https://maps.googleapis.com/maps/api/js?key=AIzaSyDN-vFIAUvZhPqjjy30oqc7l3ecFAvUdnU&libraries=places,marker&callback=initMap&solution_channel=GMP_QB_addressselection_v2_cAB";
script.type = "text/javascript";
script.async = true;
script.defer = true;
document.head.appendChild(script);

const AddressSelection = () => {
  const dispatch = useDispatch();
  const address = useSelector((state) => state.address.address);
  const searchHistory = useSelector((state) => state.address.searchHistory);

  // const handleAddressChange = useCallback(
  //   async (selectedPlaceOrTerm) => {
  //     if (typeof selectedPlaceOrTerm === "string") {
  //       // Handle case when user types in the input
  //       const term = selectedPlaceOrTerm;
  //       // Perform a search based on the term (you might want to use an API for this)
  //       const searchResult = await performSearch(term);

  //       // Assuming the searchResult has a formatted_address property
  //       if (searchResult && searchResult.formatted_address) {
  //         const selectedAddress = searchResult.formatted_address;
  //         dispatch(setAddress(selectedAddress));
  //         dispatch(addToSearchHistory(selectedAddress));
  //       } else {
  //         console.error("Invalid search result");
  //       }
  //     } else if (selectedPlaceOrTerm && selectedPlaceOrTerm.formatted_address) {
  //       // Handle case when a place is selected
  //       const selectedAddress = selectedPlaceOrTerm.formatted_address;
  //       dispatch(setAddress(selectedAddress));
  //       dispatch(addToSearchHistory(selectedAddress));
  //     }
  //   },
  //   [dispatch]
  // );

  // // Placeholder for the search function (replace it with your actual search logic)
  // const performSearch = async (term) => {
  //   return { formatted_address: `${term}` };
  // };

  const handleAddressChange = useCallback(
    async (selectedPlaceOrTerm) => {
      if (!selectedPlaceOrTerm) {
        // Handle case when the input is empty (user deleted all typed words)
        dispatch(setAddress("")); // Assuming setAddress action sets the address to an empty string
        return;
      }

      if (typeof selectedPlaceOrTerm === "string") {
        const term = selectedPlaceOrTerm;
        const searchResult = await performSearch(term);

        if (searchResult && searchResult.formatted_address) {
          const selectedAddress = searchResult.formatted_address;
          dispatch(setAddress(selectedAddress));
          dispatch(addToSearchHistory(selectedAddress));
        } else {
          console.error("Invalid search result");
        }
      } else if (selectedPlaceOrTerm && selectedPlaceOrTerm.formatted_address) {
        const selectedAddress = selectedPlaceOrTerm.formatted_address;
        dispatch(setAddress(selectedAddress));
        dispatch(addToSearchHistory(selectedAddress));
      }
    },
    [dispatch]
  );

  // Placeholder for the search function (replace it with your actual search logic)
  const performSearch = async (term) => {
    return { formatted_address: `${term}` };
  };

  useEffect(() => {
    const CONFIGURATION = {
      ctaTitle: "Checkout",
      mapOptions: {
        center: { lat: 37.4221, lng: -122.0841 },
        fullscreenControl: true,
        mapTypeControl: false,
        streetViewControl: true,
        zoom: 11,
        zoomControl: true,
        maxZoom: 22,
        mapId: "",
      },
      mapsApiKey: "AIzaSyDN-vFIAUvZhPqjjy30oqc7l3ecFAvUdnU",
      capabilities: {
        addressAutocompleteControl: true,
        mapDisplayControl: true,
        ctaControl: false,
      },
    };

    const SHORT_NAME_ADDRESS_COMPONENT_TYPES = new Set([
      "street_number",
      "administrative_area_level_1",
      "postal_code",
    ]);

    const ADDRESS_COMPONENT_TYPES_IN_FORM = [
      "location",
      "locality",
      "administrative_area_level_1",
      "postal_code",
      "country",
    ];

    function getFormInputElement(componentType) {
      return document.getElementById(`${componentType}-input`);
    }

    function fillInAddress(place) {
      function getComponentName(componentType) {
        for (const component of place.address_components || []) {
          if (component.types[0] === componentType) {
            return SHORT_NAME_ADDRESS_COMPONENT_TYPES.has(componentType)
              ? component.short_name
              : component.long_name;
          }
        }
        return "";
      }

      function getComponentText(componentType) {
        return componentType === "location"
          ? `${getComponentName("street_number")} ${getComponentName("route")}`
          : getComponentName(componentType);
      }

      for (const componentType of ADDRESS_COMPONENT_TYPES_IN_FORM) {
        getFormInputElement(componentType).value =
          getComponentText(componentType);
      }
    }

    function renderAddress(place, map, marker) {
      if (place.geometry && place.geometry.location) {
        map.setCenter(place.geometry.location);
        marker.position = place.geometry.location;
      } else {
        marker.position = null;
      }
    }

    const initializeMapAsync = async () => {
      const { google } = window; // Destructure 'google' from 'window'
      if (google) {
        const { Map } = google.maps;
        const { AdvancedMarkerElement } = google.maps.marker;
        const { Autocomplete } = google.maps.places;
        const mapOptions = CONFIGURATION.mapOptions;
        mapOptions.mapId = mapOptions.mapId || "DEMO_MAP_ID";
        mapOptions.center = mapOptions.center || {
          lat: 37.4221,
          lng: -122.0841,
        };

        const map = new Map(document.getElementById("gmp-map"), mapOptions);
        const marker = new AdvancedMarkerElement({ map });
        const autocomplete = new Autocomplete(getFormInputElement("location"), {
          fields: ["address_components", "geometry", "name"],
          types: ["address"],
        });

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (!place.geometry) {
            window.alert(`No details available for input: '${place.name}'`);
            return;
          }
          renderAddress(place, map, marker);
          fillInAddress(place);
        });
      } else {
        // Handle the case when 'google' is not defined
        console.error("Google Maps API not loaded.");
      }
    };

    window.initMap = async () => {
      await initializeMapAsync();
    };

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <Layout>
      <Header className="layout-header">
        <h2>Google Maps Autocomplete Place Finder</h2>
      </Header>
      <Content>
        <div className="layout-content">
          <div className="card-container">
            <div className="panel-left">
              <span className="sb-title">
                <Image
                  className="sb-title-icon"
                  src="https://fonts.gstatic.com/s/i/googlematerialicons/location_pin/v5/24px.svg"
                  alt=""
                />{" "}
                Address Selection
              </span>
              <Input
                placeholder="Address"
                value={address}
                onChange={(e) => handleAddressChange(e.target.value)}
                id="location-input"
              />
              <Input placeholder="Apt, Suite, etc (optional)" />
              <Input placeholder="City" id="locality-input" />
              <Input
                placeholder="State/Province"
                id="administrative_area_level_1-input"
              />
              <Input placeholder="Zip/Postal code" id="postal_code-input" />
              <Input placeholder="Country" id="country-input" />
            </div>
            <div className="map" id="gmp-map"></div>
            <div className="panel-right">
              <span className="sb-title">
                <Image
                  className="sb-title-icon"
                  src="https://fonts.gstatic.com/s/i/googlematerialicons/history/v5/24px.svg"
                  alt=""
                />{" "}
                Search History
              </span>
              <List
                dataSource={searchHistory}
                renderItem={(item) => (
                  <List.Item onClick={() => handleAddressChange(item.term)}>
                    <List.Item.Meta
                      title={item.term}
                      description={new Date(item.timestamp).toLocaleString()}
                    />
                  </List.Item>
                )}
              />
            </div>
          </div>
        </div>
      </Content>
      <Footer className="layout-footer">
        <div>React Google Map Place Finder @2024</div>
      </Footer>
    </Layout>
  );
};

export default AddressSelection;

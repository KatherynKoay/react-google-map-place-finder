// AddressSelection.js
import React, { useEffect, useState } from "react";
import { Input, List, Layout, Image } from "antd";
import "../style/styles.css";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  setSearchTerm,
  setSearchResults,
  addSearchHistory,
} from "../redux/actions/searchActions";

const { Header, Content, Footer } = Layout;

const AddressSelection = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDN-vFIAUvZhPqjjy30oqc7l3ecFAvUdnU&libraries=places,marker&callback=initMap&solution_channel=GMP_QB_addressselection_v2_cAB`;
    script.async = true;
    script.defer = true;

    const google = window.google;

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

    async function initMap() {
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
          // User entered the name of a Place that was not suggested and
          // pressed the Enter key, or the Place Details request failed.
          window.alert(`No details available for input: '${place.name}'`);
          return;
        }
        renderAddress(place, map, marker);
        fillInAddress(place);
      });
    }

    initMap(); // Call initMap to initialize the map when the component mounts
  }, []);

  const [searchTerm, setSearchTermLocal] = useState("");
  const dispatch = useDispatch();
  const searchResults = useSelector((state) => state.searchResults);
  const searchHistory = useSelector((state) => state.searchHistory);

  const handleSearch = async (value) => {
    setSearchTermLocal(value);

    try {
      // Replace API_KEY with your Google Maps API key
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${value}&key=AIzaSyDN-vFIAUvZhPqjjy30oqc7l3ecFAvUdnU`
      );

      dispatch(setSearchResults(response.data.predictions));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSearchSelect = (value) => {
    dispatch(setSearchTerm(value));
    dispatch(searchResults(value));
    dispatch(addSearchHistory(value));
    setSearchTermLocal(""); // Clear the local search term after selection
  };

  return (
    <Layout>
      <Header>
        <Input
          placeholder="Search for places"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </Header>
      <Content>
        <div class="card-container">
          <div class="panel">
            <div>
              <Image
                class="sb-title-icon"
                src="https://fonts.gstatic.com/s/i/googlematerialicons/location_pin/v5/24px.svg"
                alt=""
              />
              <span class="sb-title">Address Selection</span>
            </div>
            <Input
              placeholder="Search for places"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <Input type="text" placeholder="Address" id="location-input" />
            <Input type="text" placeholder="Apt, Suite, etc (optional)" />
            <Input type="text" placeholder="City" id="locality-input" />
            <div class="half-input-container">
              <Input
                type="text"
                class="half-input"
                placeholder="State/Province"
                id="administrative_area_level_1-input"
              />
              <Input
                type="text"
                class="half-input"
                placeholder="Zip/Postal code"
                id="postal_code-input"
              />
            </div>
            <Input type="text" placeholder="Country" id="country-input" />
          </div>
          <div class="map" id="gmp-map"></div>
        </div>

        <List
          dataSource={searchHistory}
          renderItem={(item) => (
            <List.Item onClick={() => handleSearchSelect(item.term)}>
              <List.Item.Meta
                title={item.term}
                description={new Date(item.timestamp).toLocaleString()}
              />
            </List.Item>
          )}
        />
      </Content>
      <Footer className="layout-footer">
        <div>React Google Map Place Finder @2024</div>
      </Footer>
    </Layout>
  );
};

export default AddressSelection;

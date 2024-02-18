import React, { useEffect } from "react";
import { Input, Layout, Image } from "antd";
import "../style/styles.css";

const { Header, Content, Footer } = Layout;

const AddressSelection = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyDN-vFIAUvZhPqjjy30oqc7l3ecFAvUdnU&libraries=places,marker&callback=Function.prototype&solution_channel=GMP_QB_addressselection_v2_cAB";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

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

    // Async function to initialize the map
    const initializeMapAsync = async () => {
      const { Map } = google.maps;
      const { AdvancedMarkerElement } = google.maps.marker;
      const { Autocomplete } = google.maps.places;

      const mapOptions = CONFIGURATION.mapOptions;
      mapOptions.mapId = mapOptions.mapId || "DEMO_MAP_ID";
      mapOptions.center = mapOptions.center || { lat: 37.4221, lng: -122.0841 };

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
    };

    // Define initMap as an async function that immediately calls initializeMapAsync
    window.initMap = async () => {
      await initializeMapAsync();
    };

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <Layout>
      {/* <script
        type="text/javascript"
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDN-vFIAUvZhPqjjy30oqc7l3ecFAvUdnU&libraries=places,marker&callback=Function.prototype&solution_channel=GMP_QB_addressselection_v2_cAB"
      ></script> */}
      <Header className="layout-header">
        <h2>Google Maps Autocomplete Place Finder</h2>
      </Header>
      <Content>
        <div className="layout-content">
          <div className="card-container">
            <div className="panel">
              <span className="sb-title">
                <Image
                  className="sb-title-icon"
                  src="https://fonts.gstatic.com/s/i/googlematerialicons/location_pin/v5/24px.svg"
                  alt=""
                />
                Address Selection
              </span>
              <Input placeholder="Address" id="location-input" />
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

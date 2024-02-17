import React, { useState } from "react";
import { Input, List, Layout } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  setSearchTerm,
  setSearchResults,
  addSearchHistory,
} from "../redux/actions/searchActions";
import axios from "axios";
import "../style/styles.css";
import withLogger from "./withLogger";

const { Header, Content, Footer } = Layout;

const PlaceSearch = () => {
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
        <div className="layout-content">
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
        </div>
      </Content>
      <Footer className="layout-footer">
        {/* Your footer content goes here */}
      </Footer>
    </Layout>
  );
};

export default withLogger(PlaceSearch);

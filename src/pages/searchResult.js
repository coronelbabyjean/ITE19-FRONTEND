import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import DataTable from "react-data-table-component";
import Loader from "../components/loader";
import styles from "../components/Vehicle.module.css";
import ShowVehicleDeals from "../components/ShowVehicleDeals";

function SearchResult() {
  

  const { query } = useParams();
  const [searchResult, setSearchResult] = useState([]);
  const [priceResult, setPriceResult] = useState([]);
  const [getCarAndDealer, setGetCarAndDealer] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const vehiclesPerPage = 8; // Define the number of vehicles per page
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setIsLoading(true);
        if (!query.trim()) {
          setIsLoading(false);
          return;
        }

        const url = `http://localhost:8000/api/sales-by-vin?query=${query}`;

        const response = await axios.get(url);
        const { data } = response;

        if (data && data.length > 0) {
          setSearchResult(data);
        } else {
          setSearchResult([]);
        }

        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };
    fetchSearchResults();

    const fetchCarAndDealerSearchResult = async () => {
      try {
        setIsLoading(true);
        if (!query.trim()) {
          setIsLoading(false);
          return;
        }

        const url = `http://localhost:8000/api/dealerVehicle?query=${query}`;

        const response = await axios.get(url);
        const { data } = response;

        if (data && data.length > 0) {
          setGetCarAndDealer(data);
        } else {
          setGetCarAndDealer([]);
        }

        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };
    fetchCarAndDealerSearchResult();

   
  }, [query]);

  useEffect(() => {
    const fetchPriceResult = async () => {
      try {
        setIsLoading(true);
        let url = `http://localhost:8000/api/get-dealer-vehicle-price-search?query=${query}&page=${currentPage}&limit=${vehiclesPerPage}`;

        const response = await axios.get(url);
        const { data } = response; // Destructure the response

        if (!data.dealerVehicles || data.dealerVehicles.length === 0) {
          setPriceResult([]);
          setCurrentPage(1);
          setTotalPages(0);
          setIsLoading(false);
        } else {
          const { dealerVehicles, currentPage, totalPages } = data; // Destructure from data

          setPriceResult(dealerVehicles);
          setCurrentPage(currentPage);
          setTotalPages(totalPages);
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };

    fetchPriceResult();
  }, [ query, currentPage, vehiclesPerPage]);

  const nextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const vehicle = [
    {
      name: "Model",
      selector: "modelInfo.modelName",
    },
    {
      name: "Brand",
      selector: "brandInfo.brandName",
    },
    {
      name: "Manufacturer",
      selector: "manufacturerInfo.manufacturerName",
    },
    {
      name: "VIN",
      selector: "manufacturerVehicleInfo.vin",
    },
    {
      name: "Price",
      selector: "price",
    },
  ];

  const customer = [
    // Define your table columns here
    // Example:
    {
      name: "Name",
      selector: "customerInfo.customerName",
    },
    {
      name: "Address",
      selector: "customerInfo.customerAddr",
    },
    {
      name: "Gender",
      selector: "customerInfo.customerGender",
    },
    {
      name: "Phone",
      selector: "customerInfo.customerPhone",
    },
    {
      name: "Annual Income",
      selector: "customerInfo.customerAnnualIncome",
    },
  ];

  const dealer = [
    // Define your table columns here
    // Example:
    {
      name: "Name",
      selector: "dealerInfo.dealerName",
    },
    {
      name: "Address",
      selector: "dealerInfo.dealerAddr",
    },
    {
      name: "Email",
      selector: "dealerInfo.dealerEmail",
    },
    {
      name: "Phone",
      selector: "dealerInfo.dealerPhone",
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: "#060b26", // Background color for column headers
        color: "#fff", // Text color for column headers
        borderBottom: "2px solid #ddd", // Bottom border for column headers
      },
    },
    cells: {
      style: {
        backgroundColor: "#f7f7f7", // Background color for cells
        color: "#333", // Text color for cells
        border: "1px solid #ddd", // Bottom border for cells
      },
    },
  };
  const maxPrice = Math.max(...priceResult.map((vehicle) => vehicle.price));
  const minPrice = Math.min(...priceResult.map((vehicle) => vehicle.price));

  return (
    <>
      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Loader />
        </div>
      ) : (
        <div>
          {searchResult.length ||
          getCarAndDealer.length > priceResult.length ? (
            <div>
              {isLoading ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                  }}
                >
                  <Loader />
                </div>
              ) : (
                <div style={{ paddingBottom: "50px" }}>
                  <h1
                    style={{
                      textAlign: "center",
                      fontWeight: "900",
                      color: " rgb(102, 98, 98)",
                      margin: "50px 0",
                    }}
                  >
                    Search Results for vin "{query}"
                  </h1>

                  {/* vehicle */}
                  <div className="table-container">
                    <h2
                      style={{
                        textTransform: "upperCase",
                        fontWeight: "600",
                      }}
                    >
                      Vehicle
                    </h2>
                    {getCarAndDealer.length > 0 ? (
                      <DataTable
                        columns={vehicle}
                        data={getCarAndDealer}
                        customStyles={customStyles}
                      />
                    ) : (
                      <p>No results found</p>
                    )}
                  </div>

                  {/* dealer */}
                  <div className="table-container">
                    <h2
                      style={{
                        textTransform: "upperCase",
                        fontWeight: "600",
                      }}
                    >
                      Dealer
                    </h2>
                    {getCarAndDealer.length > 0 ? (
                      <DataTable
                        columns={dealer}
                        data={getCarAndDealer}
                        customStyles={customStyles}
                      />
                    ) : (
                      <p>No results found</p>
                    )}
                  </div>

                  {/* Customer */}
                  <div className="table-container">
                    <h2
                      style={{
                        textTransform: "upperCase",
                        fontWeight: "600",
                      }}
                    >
                      Customer
                    </h2>
                    {searchResult.length > 0 ? (
                      <DataTable
                        columns={customer}
                        data={searchResult}
                        customStyles={customStyles}
                      />
                    ) : (
                      <p>No results found</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              <h1
                style={{
                  textAlign: "center",
                  fontWeight: "900",
                  color: " rgb(102, 98, 98)",
                  margin: "50px 0",
                }}
              >
                Vehicle Price Ranging From ${minPrice} To ${maxPrice}
              </h1>
              <div className={styles["vehicle-grid"]}>
                {priceResult.map((priceResult, index) => (
                  <ShowVehicleDeals
                    key={index}
                    vehicle={priceResult}
                    isMaxPrice={priceResult.price === maxPrice}
                    isMinPrice={priceResult.price === minPrice}
                  />
                ))}
              </div>
              <div className={styles["pagination-container"]}>
                <span>Page: {currentPage}</span>
                <div className={styles["pagination-buttons"]}>
                  <button onClick={prevPage} disabled={currentPage === 1}>
                    Prev Page
                  </button>
                  <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                  >
                    Next Page
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default SearchResult;
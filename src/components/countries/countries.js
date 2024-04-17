import React, { useState, useEffect } from 'react';

// Initialize variables to store selected dropdown values
let option = '', region = '', country = '';

// Define DropdownExample component
const DropdownExample = () => {
  // Define state variables for dropdown values and options

  //useState is a react hook that allow set state and react features to a variable without creating a class
  //These allows us access the value wihtout the use of "this"

  // First dropdown (Options)
  const [optionDropdownValue, setOptionDropdownValue] = useState('');
  const [showOptionDropdown, setShowOptionDropdown] = useState('');
  // Second dropdown (Region or Language)
  const [regionDropdownValue, setRegionDropdownValue] = useState('');
  const [regionDropdownOptions, setRegionDropdownOptions] = useState([]);
  const [loadingRegionDropdown, setLoadingRegionDropdown] = useState(false);
  const [showRegionDropdown, setShowRegionDropdown] = useState(true);
  // Third dropdown (Countries)
  const [countryDropdownValue, setCountryDropdownValue] = useState('');
  const [countryDropdownOptions, setCountryDropdownOptions] = useState([]);
  const [loadingCountryDropdown, setLoadingCountryDropdown] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [countriesData, setCountriesData] = useState([]);
  // eslint-disable-next-line
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // useEffect are a React Hook that perform after a component is render
  // Every time the value of optionDropdownValue, regionDropdownValue or countryDropdownValue changes
  // we perform a fetch based on dropdown selections
  useEffect(() => {
    // Function to fetch data
    const fetchData = async () => {
      // Update country and region variables based on dropdown selections
      if (countryDropdownValue !== option) {
        setCurrentPage(1);
        country = countryDropdownValue;
      }
      if (regionDropdownValue !== region) {
        setCurrentPage(1);
        region = regionDropdownValue;
        country = '';
        setCountryDropdownValue('');
      }
      if (optionDropdownValue !== option) {
        setCurrentPage(1);
        option = optionDropdownValue;
        region = '';
        setRegionDropdownValue('');
        country = '';
        setCountryDropdownValue('');
      }

      // Build URL based on dropdown selections
      let url = BuildUrl(option, region, country);
      if (url !== '') {
        try {
          // Fetch data from the URL
          const response = await fetch(url);
          if (response.ok) {
            const data = await response.json();
            setCountriesData(data);
          } else {
            console.error('Failed to fetch data from the API');
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      } else {
        setCountriesData([]);
      }
    };

    // Call the fetchData function
    fetchData();
  }, [optionDropdownValue, regionDropdownValue, countryDropdownValue]);

  // Every time the value of optionDropdownValue is updated
  // we change the options for the second dropdown
  useEffect(() => {
    // Function to fetch options for the first dropdown
    const fetchSecondDropdownOptions = async () => {
      // Check if the optionDropdownValue is not empty and not 'all'
      if (optionDropdownValue !== '' && optionDropdownValue !== 'all') {
        setShowRegionDropdown(true);
        setLoadingRegionDropdown(true);
        try {
          // Fetch options from the REST Countries API
          const response = await fetch('https://restcountries.com/v3.1/all?fields=region,cca2,currencies,languages');
          if (response.ok) {
            const data = await response.json();
            let filterOptionList = [];
            switch (optionDropdownValue) {
              case "languages":
                data.forEach(obj => {
                  const languagesCodes = Object.values(obj[optionDropdownValue])
                  languagesCodes.forEach(lang => {
                    var findItem = filterOptionList.find((x) => x.name === lang);
                    if (!findItem) filterOptionList.push({ name: lang });
                  })
                });
                break;
              default:
                data.forEach(filter => {
                  var findItem = filterOptionList.find((x) => x.name === filter[optionDropdownValue]);
                  if (!findItem) filterOptionList.push({ name: filter[optionDropdownValue] });
                });
                break;
            }
            setRegionDropdownOptions(filterOptionList);
            setShowOptionDropdown(optionDropdownValue.charAt(0).toUpperCase() + optionDropdownValue.slice(1));
          } else {
            console.error('Failed to fetch options for the first dropdown');
          }
        } catch (error) {
          console.error('Error fetching options for the first dropdown:', error);
        }
        setLoadingRegionDropdown(false);
      } else {
        setShowOptionDropdown("N/A");
        setRegionDropdownOptions([]);
        setRegionDropdownValue('');
        setCountryDropdownOptions([]);
        setCountryDropdownValue('');
        setShowRegionDropdown(false);
      }
    };

    // Call the fetchFirstDropdownOptions function
    fetchSecondDropdownOptions();
  }, [optionDropdownValue]);

  // Every time the value of regionDropdownValue is updated
  // we change the options for the countries dropdown
  useEffect(() => {
    // Function to fetch options for the second dropdown
    const fetchCountriesDropdownOptions = async () => {
      // Check if regionDropdownValue and optionDropdownValue are not empty and not 'all'
      if (regionDropdownValue !== '' && optionDropdownValue !== '' && optionDropdownValue !== 'all') {
        setLoadingCountryDropdown(true);
        setShowCountryDropdown(true);
        try {
          let url = "";
          switch (optionDropdownValue) {
            case "languages":
              url = 'https://restcountries.com/v3.1/lang/' + regionDropdownValue + '?fields=name';
              break;
            default:
              url = 'https://restcountries.com/v3.1/region/' + regionDropdownValue + '?fields=name';
              break;
          }
          const response = await fetch(url);
          if (response.ok) {
            const data = await response.json();
            let countryList = [];
            data.forEach(country => {
              countryList.push(country.name);
            });
            setCountryDropdownOptions(countryList);
          } else {
            console.error('Failed to fetch options for the second dropdown');
          }
        } catch (error) {
          console.error('Error fetching options for the second dropdown:', error);
        }
        setLoadingCountryDropdown(false);
      } else {
        setCountryDropdownOptions([]);
        setCountryDropdownValue('');
        setShowCountryDropdown(false);
      }
    };
    fetchCountriesDropdownOptions();
  }, [regionDropdownValue, optionDropdownValue]);

  // OnChange function for second dropdown
  // Function to handle change in the first dropdown
  const handleRegionDropdownChange = (event) => {
    const { value } = event.target;
    setRegionDropdownValue(value);
  };

    // OnChange function for option dropdown
  // Function to handle change in the option dropdown
  const handleOptionDropdownChange = (event) => {
    const { value } = event.target;
    setOptionDropdownValue(value);
  };

  // OnChange function for country dropdown
  // Function to handle change in the country dropdown
  const handleCountryDropdownChange = (event) => {
    const { value } = event.target;
    setCountryDropdownValue(value);
  };

  // Pagination functions
  const prevPage = async () => {
    setCurrentPage(currentPage - 1);
  };
  const nextPage = async () => {
    setCurrentPage(currentPage + 1);
  };

  // Calculate current countries to display based on pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCountries = countriesData.slice(indexOfFirstItem, indexOfLastItem);

  // Render component JSX
  return (
    <div id="Main">
      <div class="countryInformationBanner">
        <h1>BANNERS OF THE WORLD</h1>
      </div>
      <div class="dropdownParent">
        {/* Option Dropdown */}
        <div class="dropdownChild" style={{ marginRight: 0 + 'em' }}>
          <div class="selectLabel" htmlFor="optionDropdown">Options:</div>
          <select id="optionDropdown" value={optionDropdownValue} onChange={handleOptionDropdownChange}>
            <option value="">Select an option</option>
            <option key="all" value="all">Show All</option>
            <option key="region" value="region">Region</option>
            <option key="languages" value="languages">Language</option>
          </select>
        </div>
        {/* Region Dropdown */}
        <div class="dropdownChild" disabled={!showRegionDropdown}>
          <div class="selectLabel" htmlFor="firstDropdown">{showOptionDropdown}:</div>
          <select id="firstDropdown" value={regionDropdownValue} onChange={handleRegionDropdownChange} disabled={loadingCountryDropdown}>
            <option value="">Select an option</option>
            {loadingRegionDropdown ? (
              <option value="">Loading...</option>
            ) : (
              regionDropdownOptions.map(region => (
                <option key={region.name} value={region.name}>{region.name}</option>
              ))
            )}
          </select>
        </div>
        {/* Country Dropdown */}
        <div class="dropdownChild" disabled={!showCountryDropdown} style={{ marginLeft: 0 + 'em' }}>
          <div class="selectLabel" htmlFor="secondDropdown">Countries:</div>
          <select id="secondDropdown" value={countryDropdownValue} onChange={handleCountryDropdownChange} disabled={loadingRegionDropdown}>
            <option value="">Select an option</option>
            {loadingCountryDropdown ? (
              <option value="">Loading...</option>
            ) : (
              countryDropdownOptions.map(country => (
                <option key={country.common} value={country.common}>{country.common}</option>
              ))
            )}
          </select>
        </div>
      </div>
      {/* Pagination */}
      <div class="pagination">
        <button onClick={prevPage} disabled={currentPage === 1} style={{ marginRight: 0 + 'em' }}>Previous</button>
        <div class="paginationNumber" disabled> {currentPage}/{Math.ceil(countriesData.length / itemsPerPage)}</div>
        <button onClick={nextPage} disabled={indexOfLastItem >= countriesData.length} style={{ marginLeft: 0 + 'em' }}>Next</button>
      </div>
      {/* Country Information */}
      <div id="queryResult" class="countryInformationBanner">
        {currentCountries.map((country, index) => (
          <table key={index} class="countryInfoContainer infobox">
            <tbody>
              {/* Country Name */}
              <tr class>
                <th colSpan="2">
                  <div class="countryName">{country.name.official}</div>
                </th>
              </tr>
              {/* Country Images */}
              <tr>
                <td colSpan="2">
                  <div class="countryImgs infobox-image">
                    {/* Country Flag */}
                    <div class="countryflag">
                      <div class="">
                        <img key={index} src={country.flags.png} alt={country.name} width={125} height={83} />
                      </div>
                      <div>Flag</div>
                    </div>
                    {/* Country Coat of Arms */}
                    <div class="countryCoatOfArms">
                      {!Object.hasOwn(country.coatOfArms, 'png') ? (
                        <div value=""></div>
                      ) : (
                        <div class="">
                          <img key={index} src={country.coatOfArms.png} alt={country.name} width={125} height={83} />
                          <div>Coat of Arms</div>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
              {/* Capital */}
              <tr>
                <th>
                  Capital:
                </th>
                <td>
                  {!Object.hasOwn(country, 'capital') ? (
                    <div>No capital</div>
                  ) : (
                    <div>{country.capital}</div>
                  )}
                </td>
              </tr>
              {/* Languages */}
              {!Object.hasOwn(country, 'languages') ? (
                <span></span>
              ) : (
                <tr>
                  <th>
                    Languages:
                  </th>
                  <td>
                    <div>
                      {Object.values(country.languages).map((language, index) => (
                        <div key={country.languages[index]} >{language}</div>
                      ))}
                    </div>
                  </td>
                </tr>
              )}
              {/* Demonyms */}
              {!Object.hasOwn(country, 'demonyms') ? (
                <span></span>
              ) : (
                <tr>
                  <th>
                    Demonyms:
                  </th>
                  <td>
                    <div>{country.demonyms.eng.m}</div>
                  </td>
                </tr>
              )}
              {/* Currencies */}
              {!Object.hasOwn(country, 'currencies') ? (
                <span></span>
              ) : (
                <tr>
                  <th>
                    <div>Currencies:</div>
                  </th>
                  <td>
                    <div>
                      {Object.values(country.currencies).map((currencies, index) => (
                        <div key={country.currencies[index]} >{currencies.name} ({currencies.symbol})</div>
                      ))}
                    </div>
                  </td>
                </tr>
              )}
              {/* Flag History */}
              <tr class="infobox-row infobox-flag">
                <th colSpan={2}>
                  <div>Flag History:</div>
                </th>
              </tr>
              <tr class="infobox-flag">
                <td colSpan={2}>
                  <div class="flagContent">{country.flags.alt}</div>
                </td>
              </tr>
            </tbody>
          </table>
        ))}
      </div>
    </div>
  );
};

// Function to build URL based on dropdown selections
const BuildUrl = (option, optionFilter, country) => {
  let url = '';
  switch (option) {
    case 'all':
      url = 'https://restcountries.com/v3.1/all';
      break;
    case 'region':
      if (optionFilter !== '') {
        url = 'https://restcountries.com/v3.1/region/' + optionFilter;
      }
      break;
    case 'languages':
      if (optionFilter !== '') {
        url = 'https://restcountries.com/v3.1/lang/' + optionFilter;
      }
      break;
    default:
      break;
  }

  if (country !== '') {
    url = 'https://restcountries.com/v3.1/name/' + country;
  }
  return url;
}

// Export DropdownExample component to index.js file
export default DropdownExample;

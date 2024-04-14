import React, { useState, useEffect } from 'react';

let option = '', region = '', country = '';

const DropdownExample = () => {
  // Define state for the selected values and options of both dropdowns
  const [optionDropdownValue, setOptionDropdownValue] = useState('');
  const [optionDropdownOptions, setOptionDropdownOptions] = useState([]);
  const [loadingOptionDropdown, setLoadingOptionDropdown] = useState(false);
  const [showOptionDropdown, setShowOptionDropdown] = useState('');

  const [regionDropdownValue, setRegionDropdownValue] = useState('');
  const [regionDropdownOptions, setRegionDropdownOptions] = useState([]);
  const [loadingRegionDropdown, setLoadingRegionDropdown] = useState(false);
  const [showRegionDropdown, setShowRegionDropdown] = useState(true);

  const [countryDropdownValue, setCountryDropdownValue] = useState('');
  const [countryDropdownOptions, setCountryDropdownOptions] = useState([]);
  const [loadingCountryDropdown, setLoadingCountryDropdown] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [countriesData, setCountriesData] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const DoThings = async () => {
      if(countryDropdownValue !== option)
      {
        setCurrentPage(1);
        country = countryDropdownValue;
      }

      if(regionDropdownValue !== region )
      {
        setCurrentPage(1);
        region = regionDropdownValue;
        country = '';
        setCountryDropdownValue('')
      }
      if(optionDropdownValue !== option )
      {
        setCurrentPage(1);
        option = optionDropdownValue;
        region = '';
        setRegionDropdownValue('')
                country = '';
        setCountryDropdownValue('')
      }
      let url = BuildUrl(option,region,country);
      if(url !== '') {      
        try {
          const response = await fetch(url);
          if (response.ok) {
            const data = await response.json();
            setCountriesData(data);
            
          } else {
            console.error('Failed to fetch options for the first dropdown');
          }
        } catch (error) {
          console.error('Error fetching options for the first dropdown:', error);
        }
      }
      else
      {
        setCountriesData([]);
      }
      return 
    }
    DoThings();
    
    // setCountriesData(DoThings());
  }, [optionDropdownValue,regionDropdownValue,countryDropdownValue]);

    // Fetch options for the first dropdown
    useEffect(() => {
      const fetchFirstDropdownOptions = async () => {
        if (optionDropdownValue !== '' && optionDropdownValue !== 'all') {
          setShowRegionDropdown(true);
          setLoadingRegionDropdown(true);
          try {
            const response = await fetch('https://restcountries.com/v3.1/all?fields=region,cca2,currencies,languages');
            if (response.ok) {
              const data = await response.json();
              let filterOptionList = [];
              switch(optionDropdownValue)
              {
                case "languages":
                  data.forEach(obj => {
                    const languagesCodes = Object.values(obj[optionDropdownValue])
                    languagesCodes.forEach(lang => {
                      var findItem = filterOptionList.find((x) => x.name === lang);
                      if(!findItem) filterOptionList.push( {name: lang});
                    })
                  });
                  break;
                  default:
                    data.forEach(filter => {
                      var findItem = filterOptionList.find((x) => x.name === filter[optionDropdownValue]);
                      if(!findItem) filterOptionList.push( {name: filter[optionDropdownValue]});
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
          setRegionDropdownOptions([]);
          setRegionDropdownValue('');
          setCountryDropdownOptions([]);
          setCountryDropdownValue('');
          setShowRegionDropdown(false);
        }
      };
  
      fetchFirstDropdownOptions();
    }, [optionDropdownValue]);

  // Fetch options for the second dropdown based on the selected value of the first dropdown
  useEffect(() => {
    const fetchSecondDropdownOptions = async () => {
      if (regionDropdownValue !== '' && optionDropdownValue !== '' && optionDropdownValue !== 'all') {
        setLoadingCountryDropdown(true);
        setShowCountryDropdown(true);
        try {
          let url = "";
          switch(optionDropdownValue)
          {
            case "languages":
              url = 'https://restcountries.com/v3.1/lang/' + regionDropdownValue +'?fields=name';
              break; 
            default:
              url = 'https://restcountries.com/v3.1/region/' + regionDropdownValue +'?fields=name';
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
    fetchSecondDropdownOptions();
  }, [regionDropdownValue]);

  
  // Handle change in the first dropdown
  const handleRegionDropdownChange = (event) => {
    const { value } = event.target;
    setRegionDropdownValue(value);
  };

  const handleOptionDropdownChange = (event) => {
    const { value } = event.target;
    setOptionDropdownValue(value);
  };

  const handleCountryDropdownChange = (event) => {
    const { value } = event.target;
    setCountryDropdownValue(value);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCountries = countriesData.slice(indexOfFirstItem, indexOfLastItem);

  //Change Page

  const prevPage = async () => {
    setCurrentPage(currentPage - 1)
  }
  const nextPage = async () => {
    setCurrentPage(currentPage + 1)
  }

  return (
    <div id="Main">
        <div class="countryInformationBanner">        
          <h1 >Banners of the world</h1>
        </div>
        <div class = "filterLabel">Filters:</div>
        <div class="dropdownParent">
          <div class="dropdownChild" >
              <div class="selectLabel" htmlFor="optionDropdown">Options:</div>
              <select id="optionDropdown" value={optionDropdownValue} onChange={handleOptionDropdownChange} disabled={loadingOptionDropdown}>
                  <option value="">Select an option</option>
                  <option key="all" value="all">Show All</option>
                  <option key="region" value="region">Region</option>
                  <option key="languages" value="languages">Language</option>
              </select>
          </div>
          <div class="dropdownChild" hidden={!showRegionDropdown}>
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
          <div class="dropdownChild" hidden={!showCountryDropdown}>   
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
          {/* Pagination buttons */}
        <div class="pagination">
            <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
            {currentPage}/{Math.ceil(countriesData.length/itemsPerPage)}
            <button onClick={nextPage} disabled={indexOfLastItem >= countriesData.length}>Next</button>
        </div>
        
        <div id="queryResult" class = "countryInformationBanner">
            {currentCountries.map((country,index) => (
                <table key ={index} class="countryInfoContainer infobox">
                  <tbody>
                    <tr class>
                      <th colSpan ="2"> 
                        <div class="countryName">{country.name.official}</div>
                      </th>
                    </tr>
                    <tr>
                      <td colSpan ="2"> 
                        <div class="countryImgs infobox-image">
                          <div class = "countryflag">
                            <div class = "">
                              <img key={index} src={country.flags.png} alt={country.name} width={125} height={83}/>
                            </div>
                            <div>Flag</div>
                          </div>
                          <div class = "countryCoatOfArms">
                            {!Object.hasOwn(country.coatOfArms, 'png') ? (
                              <div value=""></div>
                              ) : (
                                <div class = "">
                                  <img key={index} src={country.coatOfArms.png} alt={country.name} width={125} height={83}/>
                                  <div>Coat of Arms</div>
                                </div>
                              )}
                          </div>
                        </div>
                      </td>
                    </tr>
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
                    {!Object.hasOwn(country, 'languages') ? (
                      <span></span>
                      ) : (
                        <tr>
                        <th>
                          Languages:
                        </th>
                        <td>
                          <div>
                            {Object.values(country.languages).map((language,index) => (
                                <div key={country.languages[index]} >{language}</div>
                            ))}
                          </div>
                        </td>
                      </tr>
                      )
                    }
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
                      )
                    }
                    {!Object.hasOwn(country, 'currencies') ? (
                        <span></span>
                        ) : (
                        <tr>
                        <th>                  
                          <div>Currencies:</div>
                        </th>
                        <td>
                          <div>
                            {Object.values(country.currencies).map((currencies,index) => (
                                <div key={country.currencies[index]} >{currencies.name} ({currencies.symbol})</div>
                            ))}
                          </div>
                        </td>
                      </tr>
                      )
                    }
                    <tr class = "infobox-row infobox-flag">
                        <th colSpan={2}>                  
                          <div>Flag History:</div>
                        </th>
                    </tr>
                    <tr class = "infobox-flag">
                        <td colSpan={2}>                  
                          <div class = "flagContent">{country.flags.alt}</div>
                        </td>
                    </tr>
                  </tbody>
                </table>
            ))}
        </div>
    </div>
  );
};

const BuildUrl = (option, optionFilter, country) => {
  let url = '';
  switch(option)
  {
    case 'all':
        url = 'https://restcountries.com/v3.1/all';
      break;
    case 'region':
        if(optionFilter !== '')
        {
          url = 'https://restcountries.com/v3.1/region/' + optionFilter;
        }
      break;
    case 'languages':
        if(optionFilter !== '')
        {
          url = 'https://restcountries.com/v3.1/lang/' + optionFilter;
        }
      break;
    default:
      break;
  }

  if(country !== '') {
    url = 'https://restcountries.com/v3.1/name/' + country;
  }
  return url;
}

export default DropdownExample;

/*

              <div key ={index} class="countryParentContainer">
                <div class="countryName">{country.name.official}</div>
                <div class="content">
                {country.name.common} 
                </div>
                <div class ="countryImgContainer">
                  <div class = "countryflag">
                    <img key={index} src={country.flags.png} alt={country.name}/>
                  </div>
                </div>
                <div class ="countryContentContainer">
                  <div class="content">{country.flags.alt}</div>
                </div>

              </div>
*/
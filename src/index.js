import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import DropdownExample from './components/countries/countries';


//Creates a root that allows to display react elements into a html component
const root = ReactDOM.createRoot(document.getElementById('root'));
//Renders the component
root.render(
  <div><DropdownExample/></div>
);


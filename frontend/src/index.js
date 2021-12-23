import React from 'react';
import {render} from 'react-dom';
import './styles/index.css';
import App from './App';
import { StateProvider } from '../src/core/StateProvider';
import reducer, {initialState} from '../src/core/reducer'
import  Snackbar from './component/Snackbar';

const rootElement = document.getElementById("root");
render(

    <StateProvider initialState={initialState } reducer = {reducer}>
      <App className="App"/>
      <Snackbar/>
    </StateProvider>,

  rootElement
  
);



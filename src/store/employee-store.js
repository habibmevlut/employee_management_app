// Define process before imports
window.process = { env: { NODE_ENV: 'development' } };

import { createStore } from 'redux';

// Action Types
export const ADD_EMPLOYEE = 'ADD_EMPLOYEE';
export const UPDATE_EMPLOYEE = 'UPDATE_EMPLOYEE';
export const DELETE_EMPLOYEE = 'DELETE_EMPLOYEE';
export const SET_VIEW_MODE = 'SET_VIEW_MODE';
export const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';
export const SET_SEARCH_TERM = 'SET_SEARCH_TERM';
export const SET_LANGUAGE = 'SET_LANGUAGE';
export const RESET_STORE = 'RESET_STORE';

// Action Creators
export const addEmployee = (employee) => ({
  type: ADD_EMPLOYEE,
  payload: { ...employee, id: Date.now().toString() }
});

export const updateEmployee = (employee) => ({
  type: UPDATE_EMPLOYEE,
  payload: employee
});

export const deleteEmployee = (id) => ({
  type: DELETE_EMPLOYEE,
  payload: id
});

export const setViewMode = (mode) => ({
  type: SET_VIEW_MODE,
  payload: mode
});

export const setCurrentPage = (page) => ({
  type: SET_CURRENT_PAGE,
  payload: page
});

export const setSearchTerm = (term) => ({
  type: SET_SEARCH_TERM,
  payload: term
});

export const setLanguage = (lang) => ({
  type: SET_LANGUAGE,
  payload: lang
});

export const resetStore = () => ({
  type: RESET_STORE
});

// Initial State
const initialState = {
  employees: [],
  viewMode: 'table',
  currentPage: 1,
  searchTerm: '',
  language: document.documentElement.lang || 'en'
};

// Reducer
function employeeReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_EMPLOYEE:
      return {
        ...state,
        employees: [...state.employees, action.payload]
      };
    
    case UPDATE_EMPLOYEE:
      return {
        ...state,
        employees: state.employees.map(emp => 
          emp.id === action.payload.id ? action.payload : emp
        )
      };
    
    case DELETE_EMPLOYEE:
      return {
        ...state,
        employees: state.employees.filter(emp => emp.id !== action.payload)
      };
    
    case SET_VIEW_MODE:
      return {
        ...state,
        viewMode: action.payload
      };
    
    case SET_CURRENT_PAGE:
      return {
        ...state,
        currentPage: action.payload
      };
    
    case SET_SEARCH_TERM:
      return {
        ...state,
        searchTerm: action.payload,
        currentPage: 1
      };
    
    case SET_LANGUAGE:
      document.documentElement.lang = action.payload;
      return {
        ...state,
        language: action.payload
      };
    
    case RESET_STORE:
      return initialState;
    
    default:
      return state;
  }
}

// Create Store
export const store = createStore(
  employeeReducer,
  // Load initial state from localStorage if exists
  localStorage.getItem('employeeState') 
    ? JSON.parse(localStorage.getItem('employeeState')) 
    : undefined
);

// Save state changes to localStorage
store.subscribe(() => {
  localStorage.setItem('employeeState', JSON.stringify(store.getState()));
}); 
import React, { useReducer } from 'react';
import GlobalContext from './globalContext';
import GlobalReducer from './globalReducer';
import axios from 'axios';

const GloablState = props => {
    const initialState = {
        isAuthenticated: true,
        sessionID: null,
        user: {},
        error: {
            isError: false,
            message: ''
        },
        expenses: []

    }

    const [state, dispatch] = useReducer(GlobalReducer, initialState);

    const setIsAuthenticated = (authState) => {
        console.log('isAuthenticated');
            dispatch({
                type: 'SET_IS_AUTHENTICATED',
                payload: authState
            })
    }

    const authenticate = ( creds ) => {

        console.log(creds.email);

        axios.post('/api/login', {
            email : creds.email,
            password : creds.password
        })
        .then(function (response) {
          console.log('Response: ', response);
          if ( ! state.error.isError) { setErrorMessage({'status': false, 'message': ''})}
          setIsAuthenticated(true);
          setLoggedInuser({
            'id': response.data.user.id,  
            'firstName' : response.data.user.fname,
            'password' : response.data.user.lname,
            'email' : response.data.user.email,
            'registered_date': response.data.user.registered_date,
            'sessionID' : response.data.session_id
          })
          window.localStorage.setItem('session_id', response.data.session_id);
        })
        .catch(function (error) {
            console.log("Error: ", error);
            console.log("DATA ",error.response.data);
            console.log("STATUS", error.response.status);
            console.log("HEADERS", error.response.headers);

            setErrorMessage({'status': true, 'message': error.response.data.error});

        });
    }

    const setLoggedInuser = (user) => {
            dispatch({
                type: 'LOGIN',
                payload: user
            });
    }

    const setErrorMessage = (error) => {
        dispatch({
            type: 'SET_ERROR_MESSAGE',
            payload: {
                'isError' : error.status,
                'message' : error.message,
            }
        });
    }

    const logout = () => {
        console.log('logging out...');

        axios.post('/api/logout', {
            uid : state.user.id
        })
        .then(function (response) {
          console.log('Response: ', response);
          setIsAuthenticated(false);
          setLoggedInuser({});
          window.localStorage.clear();
        })
        .catch(function (error) {
            console.log(error);

        });
        
    }

    const addExpense = ( expense ) => {
        console.log("State: ", expense);
        dispatch({
            type: 'ADD_EXPENSE',
            payload: expense
        });

    }


    return (
        <GlobalContext.Provider
            value={{
                isAuthenticated: state.isAuthenticated,
                authenticate,
                error: state.error,
                logout,
                addExpense,
                expenses: state.expenses
            }}
        >
            {props.children}
        </GlobalContext.Provider>
    )
}

export default GloablState;
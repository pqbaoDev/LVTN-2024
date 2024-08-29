import { createContext, useEffect, useReducer } from "react";

const initialState = {
    user: JSON.parse(localStorage.getItem('user') || 'null') || null,
    role: localStorage.getItem('role') || null,
    token: localStorage.getItem('token') || null,
};

// eslint-disable-next-line react-refresh/only-export-components
export const authContext = createContext(initialState);

const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN_START':
            return {
                user: null,
                role: null,
                token: null,
            };
        case 'LOGIN_SUCCESS':
            return {
                user: action.payload.user,
                role: action.payload.role,
                token: action.payload.token,
            };
        case 'LOGOUT':
            return {
                user: null,
                role: null,
                token: null,
            };
        default:
            return state;
    }
};

// eslint-disable-next-line react/prop-types
export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(state.user));
    }, [state.user]);

    useEffect(() => {
        localStorage.setItem("role", state.role);
    }, [state.role]);

    useEffect(() => {
        localStorage.setItem("token", state.token);
    }, [state.token]);

    return (
        <authContext.Provider value={{ user: state.user, role: state.role, token: state.token, dispatch }}>
            {children}
        </authContext.Provider>
    );
};

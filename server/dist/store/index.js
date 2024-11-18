import { useState, useContext, createContext } from 'react';
const initialState = {
    loading: true,
    user: null
};
const StoreContext = createContext({});
export function StoreProvider(props) {
    const [state, setState] = useState(initialState);
    return (<StoreContext.Provider value={{
            state: state,
            setState: setState
        }}>
            {props.children}

        </StoreContext.Provider>);
}
export const useStore = () => useContext(StoreContext);

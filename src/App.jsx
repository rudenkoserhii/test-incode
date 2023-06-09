import React from "react";
import { Input } from "./components/Input/Input";
import { Main } from "./components/Main/Main";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/es/integration/react";
import { persistor, store } from "./redux/store";

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      <Input/>
      <Main role="main"/>
      </PersistGate>
    </Provider>
  );
}

export default App;

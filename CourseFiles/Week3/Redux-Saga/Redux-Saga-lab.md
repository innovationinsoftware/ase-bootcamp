### **Comprehensive Redux Saga Lab: Setting Up, Handling Asynchronous Data, and Managing Data Updates**

This lab will guide you through setting up a React application with Redux Saga, testing the initial setup, and incrementally enhancing the application to handle asynchronous data updates. You will learn how to append new data with each fetch and then update the application to replace the existing data with newly fetched data.

---

### **Part 0: Installing Dependencies**

The lab requires `nvm`. The easiest way to set it up on Windows is to download the installer from here:

[nvm installer](https://nodejs.org/dist/v20.17.0/node-v20.17.0-x64.msi)



1. Once the installation is complete. Open PowerShell (recommend opening with elevated Admin permissions) and try using windows-nvm to list which versions of Node are currently installed (should be none at this point): `nvm ls`

   ![NVM list showing no Node versions](https://learn.microsoft.com/en-us/windows/images/windows-nvm-powershell-no-node.png)

2. Install the current release of Node.js (for testing the newest feature improvements, but more likely to have issues than the LTS version): `nvm install latest`

3. Install the latest stable LTS release of Node.js (recommended) by first looking up what the current LTS version number is with: `nvm list available`, then installing the LTS version number with: `nvm install <version>`(replacing `<version>` with the number, ie: `nvm install 18.19.1`).

   ![NVM list of available versions](https://learn.microsoft.com/en-us/windows/images/windows-nvm-list.png)

4. List what versions of Node are installed: `nvm ls` ...now you should see the two versions that you just installed listed.

   ![NVM list showing installed Node versions](https://learn.microsoft.com/en-us/windows/images/windows-nvm-node-installs.png)

5. After installing the Node.js version numbers you need, select the version that you would like to use by entering: `nvm use <version>` (replacing `<version>` with the number, ie: `nvm use 18.19.1`).

6. Verify which version of npm is installed with: `npm --version`, this version number will automatically change to whichever npm version is associated with your current version of Node.js.

### **Part 1: Setting Up the React Application with Redux Saga**

#### **Step 1: Initialize the React Application**

**Objective:** Set up a basic React application using Create React App and install the necessary dependencies.

1. **Open Visual Studio Code**.
   - Start by launching Visual Studio Code on your machine.

2. **Open the integrated terminal**.
   - Navigate to `View > Terminal` or press `Ctrl + \` `` to open the terminal within Visual Studio Code.

3. **Navigate to your desired directory**:
   - In the terminal, use the `cd` command to navigate to the directory where you want to create your project.
   ```bash
   cd $HOME\Documents
   ```

4. **Create a new directory and initialize a React application**:
   - Use Create React App to generate the project structure.
   ```bash
   mkdir sagalab
   cd sagalab
   npx create-react-app saga-app
   cd saga-app
   ```

5. **Install Redux Toolkit, React-Redux, and Redux Saga**:
   - Install the necessary dependencies for setting up Redux and Redux Saga.
   ```bash
   npm install @reduxjs/toolkit react-redux redux-saga
   ```

**Explanation:**  
This step initializes a React project and sets up the foundational tools you’ll need, including Redux Toolkit for state management, React-Redux to connect Redux with React components, and Redux Saga to manage side effects like asynchronous data fetching.

---

#### **Step 2: Set Up Redux Actions**

**Objective:** Define the actions that will be used to interact with the Redux store.

1. **Create an `actions` directory**:
   - In Visual Studio Code, right-click the `src` folder and select `New Folder`. Name it `actions`.

2. **Create an `index.js` file** in the `actions` folder:
   - Add the following code:
     ```javascript
     export const fetchDataRequest = () => ({ type: "FETCH_DATA_REQUEST" });
     export const fetchDataSuccess = (data) => ({ type: "FETCH_DATA_SUCCESS", payload: data });
     export const fetchDataFailure = (error) => ({ type: "FETCH_DATA_FAILURE", payload: error });
     export const deleteDataRequest = () => ({ type: "DELETE_DATA_REQUEST" });
     ```

**Explanation:**  
Actions in Redux are payloads of information that send data from your application to your Redux store. The actions defined here will trigger the fetching of data, handle success and failure scenarios, and allow for deleting data.

---

#### **Step 3: Set Up Redux Reducers**

**Objective:** Define how the Redux store’s state should change in response to the actions.

1. **Create a `reducers` directory**:
   - Right-click the `src` folder and select `New Folder`. Name it `reducers`.

2. **Create an `index.js` file** in the `reducers` folder:
   - Add the following code:
     ```javascript
     const initialState = {
         data: [],
         error: null,
     };
     
     const dataReducer = (state = initialState, action) => {
         switch (action.type) {
             case "FETCH_DATA_SUCCESS":
                 return {
                     ...state,
                     data: action.payload,
                     error: null,
                 };
             case "FETCH_DATA_FAILURE":
                 return {
                     ...state,
                     data: [],
                     error: action.payload,
                 };
             case "DELETE_DATA_REQUEST":
                 return {
                     ...state,
                     data: [],
                     error: null,
                 };
             default:
                 return state;
         }
     };
     
     export default dataReducer;
     ```

**Explanation:**  
Reducers are pure functions that take the current state and an action as arguments and return a new state. This reducer handles three scenarios: successfully fetching data, encountering an error, and deleting data. The state is treated as immutable, meaning each change results in a new state object.

---

#### **Step 4: Create the Initial Saga Middleware**

**Objective:** Set up Redux Saga to handle asynchronous data fetching.

1. **Create a `sagas.js` file** in the `src` directory:
   - Add the following content:
     ```javascript
     import { call, put, takeEvery } from 'redux-saga/effects';
     
     // Mock API call
     function fetchDataApi() {
         return new Promise((resolve) =>
             setTimeout(() => resolve({ data: 'Initial Mocked Data' }), 1000)
         );
     }
     
     function* fetchData() {
         try {
             const response = yield call(fetchDataApi);
             yield put({ type: 'FETCH_DATA_SUCCESS', payload: response.data });
         } catch (error) {
             yield put({ type: 'FETCH_DATA_FAILURE', payload: error.message });
         }
     }
     
     export function* watchFetchData() {
         yield takeEvery('FETCH_DATA_REQUEST', fetchData);
     }
     ```

**Explanation:**  
Redux Saga uses generator functions to handle side effects like data fetching. The `fetchDataApi` simulates an API call with a delay, and the `fetchData` saga coordinates the process, dispatching actions based on success or failure. The `watchFetchData` saga listens for specific actions (`FETCH_DATA_REQUEST`) and triggers the `fetchData` generator function.

---

#### **Step 5: Set Up the Redux Store and Integrate Saga Middleware**

**Objective:** Configure the Redux store and apply the saga middleware.

1. **Edit the `index.js` file** in the `src` directory:
   - Replace its content with the following:
     ```javascript
     import React from "react";
     import ReactDOM from "react-dom/client";
     import "./index.css";
     import App from "./App";
     import reportWebVitals from "./reportWebVitals";
     import { configureStore } from "@reduxjs/toolkit";
     import { Provider } from "react-redux";
     import createSagaMiddleware from "redux-saga";
     import dataReducer from "./reducers";
     import { watchFetchData } from "./sagas";
     
     const sagaMiddleware = createSagaMiddleware();
     
     const store = configureStore({
       reducer: dataReducer,
       middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware),
     });
     
     sagaMiddleware.run(watchFetchData);
     
     const root = ReactDOM.createRoot(document.getElementById("root"));
     root.render(
       <Provider store={store}>
         <React.StrictMode>
           <App />
         </React.StrictMode>
       </Provider>
     );
     
     reportWebVitals(console.log);
     ```

**Explanation:**  
This code sets up the Redux store, applies the saga middleware, and ensures that the `watchFetchData` saga is running. The store is connected to your React application using the `Provider` component from React-Redux, making the Redux store available throughout your app.

---

#### **Step 6: Create the Initial UI Component**

**Objective:** Create a basic React component that interacts with the Redux store.

1. **Create a `components` directory** in the `src` folder:
   - Right-click the `src` folder and select `New Folder`. Name it `components`.

2. **Create a `SagaComponent.js` file** in the `components` folder:
   - Add the following content:
     ```javascript
     import React, { useEffect } from "react";
     import { useDispatch, useSelector } from "react-redux";
     import { fetchDataRequest, deleteDataRequest } from "../actions";
     
     const SagaComponent = () => {
       const dispatch = useDispatch();
       const data = useSelector((state) => state.data);
       const error = useSelector((state) => state.error);
     
       useEffect(() => {
         dispatch(fetchDataRequest());
       }, [dispatch]);
     
       const handleDeleteData = () => {
         dispatch(deleteDataRequest());
       };
     
       return (
         <div className="app-container">
           <h1>Saga and Redux Demo App</h1>
           <div className="data-container">
             {data ? (
               <div className="data">
                 {JSON.stringify(data)}
               </div>
             ) : (
               <div className="loading">
                 {error ? `Error: ${error}` : "Loading data..."}
               </div>
             )}
           </div>
           <button
             className="fetch-button"
             onClick={() => dispatch(fetchDataRequest())}
           >
             Fetch Data
           </button>
           <button
             className="delete-button"
             onClick={handleDeleteData}
           >
             Delete Data
           </button>
         </div>
       );
     };
     
     export default SagaComponent;
     ```

3. **Edit `App.js`** to use `SagaComponent`:
   - Replace the content of `App.js` with:
     ```javascript
     import "./App.css";
     import SagaComponent from "./components/SagaComponent";
     
     function App() {
         return <SagaComponent />;
     }
     
     export default App;
     ```

**Explanation:**  
This component interacts with the Redux store by dispatching actions and selecting state data. The `useEffect` hook is used to fetch data when the component mounts, and buttons are provided to fetch and delete data.



#### **Step 7: **Update App.css for Better Styling

**Objective:** Enhance the visual presentation of the application by adding custom styles to the `App.css` file.

1. **Edit the `App.css` file** located in the `src` directory:
   - Replace the content of `App.css` with the following:
     ```css
     .app-container {
         text-align: center;
         margin: 20px;
         padding: 20px;
         border: 1px solid #ccc;
         border-radius: 5px;
         background-color: #f8f8f8;
         box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
     }
     
     h1 {
         font-size: 24px;
         margin-bottom: 20px;
     }
     
     .data-container {
         margin: 20px 0;
     }
     
     .data {
         font-size: 16px;
         background-color: #e0e0e0;
         padding: 10px;
         border-radius: 5px;
         margin-bottom: 10px;
     }
     
     .loading {
         font-size: 16px;
         color: #777;
         padding: 10px;
     }
     
     .fetch-button, .delete-button {
         background-color: #007bff;
         color: #fff;
         padding: 10px 20px;
         font-size: 16px;
         border: none;
         border-radius: 5px;
         cursor: pointer;
         margin: 10px;
     }
     
     .fetch-button:hover, .delete-button:hover {
         background-color: #0056b3;
     }
     ```

**Explanation:**  
This step enhances the user interface by applying styles that make the application more visually appealing. The styles include a container with padding and borders, styled buttons with hover effects, and a clean layout for displaying data. By updating the `App.css` file, you ensure that the UI elements are presented in a clear and organized manner, improving the overall user experience.



#### Step 8: Run the Application

**Objective:** Verify that the application loads successfully and displays the initial static data.

1. **Start the application** by executing

   ```npm start```

2. - The application should open in your default browser.
   - You should see a heading "Saga and Redux Demo App" and the initial static data `["Initial Mocked Data"]` displayed on the page.

**Explanation:**  
Running the application allows you to test the basic setup and ensure that the React, Redux, and Saga integration works as expected. At this point, you should see the initial static data rendered on the screen when you first load the page.

---

### **Part 2: Updating the Application to Handle Asynchronous Data Updates (Appending Data)**

#### **Step 9: Modify the Saga to Simulate Data Changes and Append Data**

**Objective:** Enhance the saga to fetch and append new data with each request.

1. **Update `sagas.js`** to simulate data changes and append new data:
   - Replace the content of `sagas.js` with:
     ```javascript
     import { call, put, takeEvery } from 'redux-saga/effects';
     
     // Simulated Data Store
     let mockData = [
         { id: 1, value: 'Initial Data' },
     ];
     
     // Mock API call
     function fetchDataApi() {
         return new Promise((resolve) => {
             const newData = { id: mockData.length + 1, value: `Updated Data ${mockData.length + 1}` };
             mockData = [...mockData, newData];  // Create a new array with the updated data
             setTimeout(() => resolve({ data: mockData }), 1000);
         });
     }
     
     function* fetchData() {
         try {
             const response = yield call(fetchDataApi);
             yield put({ type: 'FETCH_DATA_SUCCESS', payload: response.data });
         } catch (error) {
             yield put({ type: 'FETCH_DATA_FAILURE', payload: error.message });
         }
     }
     
     export function* watchFetchData() {
         yield takeEvery('FETCH_DATA_REQUEST', fetchData);
     }
     ```

2. **Save the changes** and the app will automatically restart

3. **Test the application**:
   - Click the "Fetch Data" button multiple times.
   - Observe that each time you fetch data, a new entry is appended to the list displayed on the page.

**Explanation:**  
This step modifies the saga to simulate an API that returns new data on each request. The `mockData` array grows with each fetch, and the application now displays the updated data by appending new entries to the existing list.

---

### **Part 3: Updating the Application to Replace Data on Fetch**

#### **Step 10: Modify the Saga to Replace Data Instead of Appending**

**Objective:** Update the saga to replace the current data with new data on each fetch, instead of appending.

1. **Update `sagas.js`** to replace the data:
   - Replace the content of `sagas.js` with:
     ```javascript
     import { call, put, takeEvery } from 'redux-saga/effects';
     
     // Simulated Data Store
     let mockData = { id: 1, value: 'Initial Data' };
     
     // Mock API call
     function fetchDataApi() {
         return new Promise((resolve) => {
             mockData = { id: mockData.id + 1, value: `Updated Data ${mockData.id + 1}` };
             setTimeout(() => resolve({ data: [mockData] }), 1000);  // Return the new data as a single-element array
         });
     }
     
     function* fetchData() {
         try {
             const response = yield call(fetchDataApi);
             yield put({ type: 'FETCH_DATA_SUCCESS', payload: response.data });
         } catch (error) {
             yield put({ type: 'FETCH_DATA_FAILURE', payload: error.message });
         }
     }
     
     export function* watchFetchData() {
         yield takeEvery('FETCH_DATA_REQUEST', fetchData);
     }
     ```

2. **Save the changes** and the app will automatically restart

3. **Test the application**:

   3. Click the "Fetch Data" button multiple times.
   4. Observe that the data on the page is now replaced each time, showing only the most recent data entry.

**Explanation:**  
In this step, the saga is updated to replace the existing data with each new fetch. Instead of appending, the data is reset to show only the latest entry. This is useful in scenarios where only the most current data is relevant, such as dashboards or single-item views.

---

### **Conclusion and Summary**

In this lab, you incrementally built a React application with Redux and Redux Saga to handle asynchronous data fetching. You started with setting up the application and verified that the initial static data loaded successfully. Then, you extended the application to append new data entries with each fetch, demonstrating how to handle growing datasets. Finally, you modified the saga to replace the existing data with the latest fetch, which is common in use cases where only the most recent information is important.

By completing this lab, you should have a solid understanding of how to integrate Redux Saga into a React application and manage state in a flexible and scalable way, depending on the needs of your specific use case.
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();




// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <Provider store={store}>
//     <ConfigProvider
//       theme={{
//         components: {
//           Button: {
//             colorPrimary: "#ff6d38",
//             colorPrimaryHover: "#ff8b0f",
//           },
//           Tabs:{
//             colorPrimary: "#ff6d38",
//             colorPrimaryHover: "#ff8b0f",
//           }
//         }
//       }}
//     >
//       <App />
//     </ConfigProvider>
//   </Provider>
// );

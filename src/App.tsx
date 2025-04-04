import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import UserRoute from './routes/UserRoute';
import ProviderRoute from './routes/ProviderRoute';
import AdminRoute from './routes/AdminRoute';





function App() {

   

  return (
    <>
      <BrowserRouter>
           <Routes>
              <Route path={'/*'} element={<UserRoute/>}/>
              <Route path={'/provider/*'} element={<ProviderRoute/>}/>
              <Route path={'/admin/*'} element={<AdminRoute/>} />
           </Routes>
      </BrowserRouter>
      
    </>
  );
}

export default App;

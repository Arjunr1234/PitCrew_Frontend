import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import UserRoute from './routes/UserRoute';
import ProviderRoute from './routes/ProviderRoute';




function App() {
  return (
    <>
      <BrowserRouter>
           <Routes>
              <Route path={'/*'} element={<UserRoute/>}/>
              <Route path={'/provider/*'} element={<ProviderRoute/>}/>
           </Routes>
      </BrowserRouter>
      
    </>
  );
}

export default App;

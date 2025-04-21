import Header from './components/Header/Header';
import GoogleMapContainer from './components/Map/GoogleMapContainer';
// import WeatherPanel from './components/Weather/WeatherPanel';

function App() {
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
     
      <Header />
      <GoogleMapContainer />
    </div>
  );
}


export default App;

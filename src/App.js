import Navbar from './components/navbar/navbar'
function App() {
  return (
    <div className="body">
      <div className="overlay" id="overlayContainer"></div>
            <div className="d-flex flex-column flex-lg-row h-lg-full bg-surface-secondary">
      <Navbar />
      </div>
    </div>
  );
}

export default App;

import ModelViewer from './components/ModelViewer'
import './App.css'

const YAMAHA_KEYFRAMES = [
  {
    // 0: HERO - CENTER
    position: [0, 0, 0],
    rotation: [0, 45, 0],
    scale: 0.5
  },
  {
    // 1: SEAT VIEW - MODEL RIGHT, CONTENT LEFT
    position: [0.6, -0.4, 0],
    rotation: [25, 110, 0],
    scale: 1.0
  },
  {
    // 2: SIDE VIEW - MODEL LEFT, CONTENT RIGHT
    position: [-0.6, 0, 0],
    rotation: [0, 0, 0],
    scale: 0.5
  },
  {
    // 3: EXHAUST - MODEL RIGHT, CONTENT LEFT
    position: [0.7, 0.2, 0.4],
    rotation: [10, -50, 0],
    scale: 1.4
  },
  {
    // 4: TAIL LAMP - MODEL LEFT, CONTENT RIGHT
    position: [-0.6, 0.1, 0.2],
    rotation: [5, -110, 0],
    scale: 1.3
  },
  {
    // 5: WHEEL RIMS - MODEL RIGHT, CONTENT LEFT
    position: [0.7, 0.4, 0],
    rotation: [0, 45, 0],
    scale: 1.5
  },
  {
    // 6: OUTRO - CENTER
    position: [0, -0.15, 0],
    rotation: [0, 405, 0],
    scale: 0.6
  }
];

function App() {
  return (
    <div className='app'>
      <nav className="top-nav">
        <a href="#" className="nav-link">REVS YOUR HEART</a>
        <div className="wordmark">YAMAHA</div>
        <a href="#" className="nav-link">COLLECTION</a>
      </nav>

      <ModelViewer
        url="/2022_yamaha_r1/scene.gltf"
        fadeIn
        scrollPages={7}
        scrollKeyframes={YAMAHA_KEYFRAMES}
        environmentPreset="city"
      >
        <section className="hero">
          <div className="fade-in">
            <div className="caption-uppercase">The Apex Predator</div>
            <h1 className="display-xl">YZF-R1 Hommage</h1>
            <div className="scroll-indicator">
              <div className="caption-uppercase" style={{ color: '#444' }}>Engage</div>
              <div className="scroll-line"></div>
            </div>
          </div>
        </section>

        <section className="seat">
          <div className="content-block left">
            <div className="caption-uppercase">Rider Centricity</div>
            <h2 className="display-lg">The Command Center</h2>
            <p className="body-md">
              A high-precision interface engineered for absolute symbiosis. The sculpted 17-liter fuel tank 
              and refined saddle geometry allow the rider to tuck in for maximum aerodynamic efficiency 
              while maintaining complete control under extreme lean angles.
            </p>
            <a href="#" className="btn-primary">View Cockpit</a>
          </div>
        </section>

        <section className="side">
          <div className="content-block right">
            <div className="caption-uppercase">Flow Dynamics</div>
            <h2 className="display-lg">Total Air Management</h2>
            <p className="body-md">
              Developed using state-of-the-art computational fluid dynamics, the R1's bodywork 
              reduces aerodynamic drag by 5.3% while simultaneously optimizing cooling airflow 
              to the high-performance crossplane engine and braking systems.
            </p>
          </div>
        </section>

        <section className="exhaust">
          <div className="content-block left">
            <div className="caption-uppercase">Aural Signature</div>
            <h2 className="display-lg">Titanium Resonance</h2>
            <p className="body-md">
              A lightweight titanium mid-ship exhaust system, meticulously tuned to enhance the 
              distinctive 270-180-90-180 firing order of the crossplane crankshaft. It delivers 
              a raw, visceral soundscape that defines the R1 legacy.
            </p>
          </div>
        </section>

        <section className="tail">
          <div className="content-block right">
            <div className="caption-uppercase">Visual Identity</div>
            <h2 className="display-lg">Kinetic Illumination</h2>
            <p className="body-md">
              Ultra-slim LED rear assemblies integrated seamlessly into the aerodynamic tail cowl. 
              The minimalist lighting signature ensures maximum visibility on the track while 
              reinforcing the R-Series "Face of the Future" design philosophy.
            </p>
          </div>
        </section>

        <section className="rims">
          <div className="content-block left">
            <div className="caption-uppercase">Unsprung Mastery</div>
            <h2 className="display-lg">Magnesium Precision</h2>
            <p className="body-md">
              Cast-magnesium 10-spoke wheels significantly reduce unsprung weight and rotational 
              inertia. This enhances flickability during rapid direction changes and provides 
              more responsive suspension performance on varied surfaces.
            </p>
          </div>
        </section>

        <section className="outro">
          <div className="fade-in">
            <h1 className="display-lg">The Legend Evolves</h1>
            <p className="body-md" style={{ marginBottom: '3.5rem', maxWidth: '640px', margin: '0 auto 3.5rem' }}>
              From the race track to the street, the YZF-R1 remains the standard-bearer for 
              supersport performance. Experience the pinnacle of Yamaha engineering.
            </p>
            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
              <button className="btn-primary" onClick={() => alert('Sequence confirmed.')}>
                Reserve Now
              </button>
              <button className="btn-primary" style={{ background: 'white', color: 'black' }} onClick={() => alert('Brochure requested.')}>
                Download Specs
              </button>
            </div>
          </div>
        </section>
      </ModelViewer>
    </div>
  );
}

export default App

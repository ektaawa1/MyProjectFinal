import './App.css';
import { BmiCalci } from './components/BmiCalci';
import { HealthStatusCheck } from './components/HealthStatusCheck';
import { ProcessUserInput } from './components/ProcessUserInput';
import { UnderAge25Record } from './components/Under25Record';

function App() {

  return (
    <div className="App">
      <h1>Hello from BMI Calculator React App!</h1>
      <main>
        <div className="component">
          <BmiCalci/>
        </div>
        <div className="component">
          <UnderAge25Record/>
        </div>
        <div className="component">
          <HealthStatusCheck/>
        </div>
        <div className="component">
          <ProcessUserInput/>
        </div> 
      </main>
    </div>
  );
}

export default App;

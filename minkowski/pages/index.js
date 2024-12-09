import { useState } from 'react';
import Tabs from '../components/Tabs';
import LorentzTab from '../components/LorentzTab';
import AreaTab from '../components/AreaTab';
import EnergyDensityTab from '../components/EnergyDensityTab';

export default function Home() {
  const [activeTab, setActiveTab] = useState('lorentz');

  return (
    <div className="container">
      <h1>Minkowski Diagram Visualizer</h1>
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={[
        {id: 'lorentz', label: 'Lorentz Transformations'},
        {id: 'area', label: 'Area Transformations'},
        {id: 'energy', label: 'Energy Densities'}
      ]} />

      {activeTab === 'lorentz' && <LorentzTab />}
      {activeTab === 'area' && <AreaTab />}
      {activeTab === 'energy' && <EnergyDensityTab />}

      <footer>
        <p>Explore Lorentz transformations, area invariance, and energy densities under relativistic transformations.</p>
      </footer>
    </div>
  );
}





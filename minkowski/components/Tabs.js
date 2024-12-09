export default function Tabs({activeTab, setActiveTab, tabs}) {
    return (
      <div className="tabs">
        {tabs.map(t => (
          <button
            key={t.id}
            className={activeTab === t.id ? 'tab active' : 'tab'}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
    );
  }
  
  
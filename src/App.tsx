import { useEffect } from 'react';
import { useTradeStore } from './stores/tradeStore';
import { useTemplateStore } from './stores/templateStore';
import { useAppStore } from './stores/appStore';

// Layout
import { Layout } from './components/Layout/Layout';

// Components
import { Dashboard } from './components/Analytics/Dashboard';
import { Settings } from './components/Settings/Settings';
import { ReflectionJournal } from './components/Journal/ReflectionJournal';
import { DemonHunter } from './components/DemonHunter/DemonHunter';
import { StrategiesLab } from './components/Strategies/StrategiesLab';
import { TradeCopier } from './components/Copier/TradeCopier';

import { PropFirmList } from './components/PropFirms/PropFirmList';
import { BrokerList } from './components/Brokers/BrokerList';
import { PersonalFinance } from './components/Finance/PersonalFinance';
import { Diary } from './components/Diary/Diary';
import { AccountPage } from './components/Account/AccountPage';
import { NewTradeModal } from './components/TradeEntry/NewTradeModal';
import { Workstation } from './components/Workstation/Workstation';
import { BacktestPage, OptimizationResults, SessionLockOverlay } from './components/Backtesting';

function App() {
  const { activeTab, isNewTradeModalOpen, setNewTradeModalOpen } = useAppStore();
  const loadTrades = useTradeStore(state => state.loadTrades);
  const loadTemplates = useTemplateStore(state => state.loadTemplates);

  useEffect(() => {
    loadTrades();
    loadTemplates();
  }, [loadTrades, loadTemplates]);

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <SessionLockOverlay><Dashboard /></SessionLockOverlay>;
      case 'workstation':
        return <Workstation />;

      case 'prop-firms':
        return <PropFirmList />;
      case 'brokers':
        return <BrokerList />;
      case 'accounts':
        return <AccountPage />;
      case 'journal':
        return <SessionLockOverlay><ReflectionJournal /></SessionLockOverlay>;
      case 'demon-hunter':
        return <SessionLockOverlay><DemonHunter /></SessionLockOverlay>;
      case 'strategies':
        return <SessionLockOverlay><StrategiesLab /></SessionLockOverlay>;
      case 'settings':
        return <div className="p-6"><Settings /></div>;
      case 'copier':
        return <TradeCopier />;
      case 'finance':
        return <PersonalFinance />;
      case 'diary':
        return <SessionLockOverlay><Diary /></SessionLockOverlay>;
      case 'backtest':
        return <BacktestPage />;
      case 'optimization-results':
        return <OptimizationResults />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-tertiary">
            <p className="text-lg font-medium">Module: {activeTab}</p>
            <p className="text-sm">Under Construction</p>
          </div>
        );
    }
  };

  return (
    <>
      <Layout>
        {renderContent()}
      </Layout>

      {/* New Trade Modal */}
      <NewTradeModal
        isOpen={isNewTradeModalOpen}
        onClose={() => setNewTradeModalOpen(false)}
      />
    </>
  );
}

export default App;

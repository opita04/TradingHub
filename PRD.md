# Product Requirement Document (PRD): TradingHub

## 1. Executive Summary
**TradingHub** is a comprehensive, all-in-one operating system designed for serious retail traders. Unlike simple trade journals, TradingHub acts as a central command center that integrates trade execution analysis, psychological journaling, account management (Prop Firms & Brokers), strategy development, and personal finance tracking. It aims to professionalize the retail trading workflow by consolidating fragmented tools into a single, high-performance web application.

## 2. Product Objectives
- **Centralize Data**: Unified view of all trading activities across multiple brokers and prop firms.
- **Improve Performance**: "Demon Hunter" module specifically designed to identify and eliminate recurring trading errors.
- **Holistic Management**: Manage not just trades, but the business of trading (accounts, withdrawals, objectives) and the trader's life (personal finance, diary).
- **Streamline Workflow**: Dedicated "Workstation" for the active trading session.

## 3. Target Audience
- **Proprietary Traders**: Users managing multiple evaluation and funded accounts who need to track drawdown limits and profit targets.
- **Systematic & Discretionary Traders**: Traders who need rigorous journaling and strategy validation.
- **Professional Retail Traders**: Individuals treating trading as a business requiring P&L tracking and performance analytics.

## 4. Technical Stack
- **Frontend Framework**: React 18+ (Vite)
- **Language**: TypeScript
- **State Management**: Zustand (Global stores for Trades, Accounts, Templates, etc.)
- **Styling**: Tailwind CSS (Utility-first, responsive design)
- **Visualization**: Recharts / Chart.js / React-Chartjs-2
- **Utilities**:
    - `date-fns` for date manipulation.
    - `uuid` for unique entity identification.
    - `lucide-react` for iconography.
- **Icons**: Lucide React

## 5. Key Modules & Features

### 5.1. Dashboard (Overview)
- **Goal**: High-level snapshot of current performance.
- **Features**:
    - Aggregate P&L across all accounts.
    - Win rate and risk-reward metrics.
    - Recent trade activity feed.
    - "At a glance" account health status.

### 5.2. Workstation
- **Goal**: The active session view for the trader.
- **Features**:
    - Focused environment for logging potential setups and live trades.
    - Real-time or near-real-time notes and checklists.
    - Quick access to trade entry templates.

### 5.3. Account Management
**Components**: `PropFirmList`, `BrokerList`, `AccountPage`
- **Goal**: Manage the fragmented landscape of trading accounts.
- **Features**:
    - **Prop Firms**: Track challenge phases, verification status, and funded account metrics. Monitor specific rules (e.g., max daily loss).
    - **Brokers**: Track personal capital accounts, deposit/withdrawal history.
    - **Unified View**: Consolidated equity curve and capital distribution.

### 5.4. Journaling & Psychology
**Components**: `ReflectionJournal`, `Diary`
- **Goal**: Master the mental game of trading.
- **Features**:
    - **Reflection Journal**: Post-session analysis, reviewing emotional state and execution quality.
    - **Diary**: Free-form daily logs for non-trading context (sleep, mood, life events).
    - **Tagging**: Tag entries with specific psychological states (e.g., "Tilt", "Flow", "Hesitation").

### 5.5. Demon Hunter
- **Goal**: Identify and eliminate costly habits.
- **Features**:
    - Statistical tracking of specific error types (e.g., FOMO, Revenge Trading, Moving Stops).
    - "Demons" are defined as negative behavioral patterns.
    - Visualization of P&L saved by eliminating specific demons.

### 5.6. Strategies Lab
- **Goal**: Incubate and refine trading edges.
- **Features**:
    - Define strategy rules and entry/exit criteria.
    - Track version history of strategies.
    - Link trades to specific strategies to calculate "Strategy Expectancy".

### 5.7. Trade Copier
- **Goal**: Execution assistance (Simulation/Tracking).
- **Features**:
    - Logic to map trades from a "Master" account/setup to "Slave" accounts.
    - (Note: Likely internal tracking of how a trade *would* have performed across multiple accounts, or integration with external copier logic).

### 5.8. Personal Finance
- **Goal**: Connect trading income to real-life financial goals.
- **Features**:
    - Expense tracking and budget management.
    - Income streams management (Trading vs. Other sources).
    - Net worth tracking.

### 5.9. Settings & Customization
- **Goal**: Adapt the platform to the user.
- **Features**:
    - Theme configuration (Dark/Light mode, high contrast).
    - Data management (Export/Import).
    - Default configuration (Risk per trade, default currency).

## 6. Data Architecture (Inferred Store Structure)
- **TradeStore**: Central repository of all executed trades.
- **AccountStore**: Balances, equity, and account metadata.
- **JournalStore**: Textual entries and psychological tags.
- **TemplateStore**: Saved trade setups for quick entry.
- **PropFirmStore**: Specific rules and status of prop accounts.

## 7. UX/UI Design Philosophy
- **Aesthetic**: "Cyber-Professional" / Dark Mode focused. High contrast for charts.
- **Layout**: Sidebar navigation (Tabs) with a persistent layout wrapper.
- **Interactions**: Fast, modal-based data entry (`NewTradeModal`) to minimize friction during active sessions.

## 8. Future Roadmap
- **Backtesting Module**: Currently under construction. Will allow replays and historical testing of strategies.
- **Mobile Responsiveness**: Optimization for checking stats on the go.
- **API Integrations**: Direct connection to MetaTrader/cTrader for auto-journaling.

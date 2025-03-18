# 🏗️ Rental Empire

[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-61DAFB.svg?logo=react&logoColor=white)](https://reactjs.org/)
[![Redux](https://img.shields.io/badge/Redux-9.1-764ABC.svg?logo=redux&logoColor=white)](https://redux.js.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev/)

> Build your construction equipment rental empire in this addictive idle game! Purchase equipment, earn passive income, and grow your business empire one excavator at a time.

![Game Screenshot](/images/rental-empire-screenshot.png)

## ✨ Features

- 🚜 Purchase and manage a diverse fleet of construction equipment
- 💰 Generate passive income from equipment rentals
- 🔓 Unlock new equipment types as you progress
- ⬆️ Purchase strategic upgrades to increase revenue
- 📈 Track your stats and watch your business grow
- 🎯 Complete achievements and reach business milestones
- 🗺️ Expand your business to new locations on the Business Map
- 🔔 Real-time notifications with the Notification Center
- 📊 Comprehensive dashboard for monitoring your empire
- 📱 Responsive design works on desktop and mobile

## 🎮 How to Play

1. Start with basic equipment like a Compact Excavator
2. Collect rental income that generates automatically
3. Purchase more equipment to increase your income
4. Unlock upgrades to boost specific equipment revenue
5. Expand your fleet with new, more profitable equipment types
6. Track your progress on the Stats page
7. Expand to new locations as your business grows
8. Rise through business levels and become a rental tycoon!

## 🛠️ Equipment Types

Rental Empire features a wide range of construction equipment to build your empire:

| Equipment | Starting Cost | Base Revenue | Notes |
|-----------|---------------|--------------|-------|
| Compact Excavator | $100 | $2/s | Available from start |
| Portable Generator | $150 | $3/s | Available from start |
| Pressure Washer | $200 | $4/s | Available from start |
| Jackhammer | $250 | $5/s | Available from start |
| Skid Steer Loader | $250 | $5/s | Unlocks at $500 |
| Scissor Lift | $500 | $10/s | Unlocks at $1,500 |

## 🚀 Upgrade System

Enhance your equipment with strategic upgrades:

- **Equipment-specific upgrades**: Boost revenue for specific equipment types
- **Global upgrades**: Increase revenue across your entire fleet
- **Progressive unlocks**: New upgrades become available as you reach milestones
- **Stacking multipliers**: Combine multiple upgrades for exponential growth
- **Real-time tracking**: Monitor your upgrade effects with the Upgrade Tracker

## 🏆 Progression System

Rental Empire features a dynamic progression system:

- **Equipment Unlocks**: New equipment types become available as you earn more currency
- **Upgrade Unlocks**: Advanced upgrades are revealed as you grow your business
- **Location Expansion**: Open new rental stores in different locations
- **Achievement System**: Complete goals to earn bonuses and track your progress
- **Business Levels**: Gain prestige and benefits as your company grows
- **Market Events**: Respond to market conditions for temporary boosts or challenges

## 🏢 Business Management

- **Business Map**: Visualize and manage your rental locations across different regions
- **Rental Store Management**: Optimize each location's inventory and staff
- **Market Tracking**: Monitor market conditions to maximize profits
- **Business Panel**: Comprehensive view of your entire operation
- **Stats Dashboard**: Detailed analytics of your business performance

## 🔧 Technologies Used

- **React 18 + TypeScript**: For a robust and type-safe frontend
- **Redux Toolkit**: For predictable state management
- **Tailwind CSS**: For beautiful, responsive styling
- **Vite**: For lightning-fast development and builds

## 💻 Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Getting Started

```bash
# Clone the repository
git clone https://github.com/claydoers/rental-empire.git

# Navigate to the project directory
cd rental-empire

# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build
```

## 🗺️ Project Structure

```
src/
├── app/            # Redux store configuration
├── components/     # React components
│   ├── AchievementTracker.tsx
│   ├── AchievementsPanel.tsx
│   ├── BusinessMap.tsx
│   ├── BusinessPanel.tsx
│   ├── Dashboard.tsx
│   ├── EquipmentCard.tsx
│   ├── EquipmentYard.tsx
│   ├── GameLoop.tsx
│   ├── MarketTracker.tsx
│   ├── Navigation.tsx
│   ├── NotificationCenter.tsx
│   ├── ProgressionPanel.tsx
│   ├── ProgressionTracker.tsx
│   ├── RentalStore.tsx
│   ├── SplashScreen.tsx
│   ├── StatsPanel.tsx
│   ├── UpgradeTracker.tsx
│   └── UpgradesPanel.tsx
├── features/       # Feature modules
│   ├── achievements/
│   ├── equipment/
│   ├── game/
│   ├── market/
│   ├── player/
│   ├── progression/
│   ├── ui/
│   └── upgrades/
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
├── App.tsx         # Main app component
├── index.css       # Global styles
└── main.tsx        # Entry point
```

## 🗺️ Roadmap

### Current Features
- ✅ Core revenue generation loop
- ✅ Multiple equipment types
- ✅ Progressive upgrade system
- ✅ Comprehensive stats tracking
- ✅ Responsive UI
- ✅ Achievement system
- ✅ Business map with multiple locations
- ✅ Market events system
- ✅ Notification center
- ✅ Business progression tracking

### Coming Soon
- 🔜 Time-based events and seasonal specials
- 🔜 Employee management system
- 🔜 Customizable equipment configurations
- 🔜 Enhanced visual feedback and animations
- 🔜 Equipment repair and maintenance system
- 🔜 Business competition simulation

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- Created by [Clay Doers](https://github.com/claydoers)
- Icons made by [Freepik](https://www.freepik.com) from [Flaticon](https://www.flaticon.com/)
- Game design inspired by various idle games including Adventure Capitalist and Cookie Clicker 
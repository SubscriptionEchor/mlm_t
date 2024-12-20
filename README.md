# MLM Commission System

A comprehensive MLM (Multi-Level Marketing) commission calculation and management system.

## Features

- Network generation with realistic tier distribution
- Commission calculation with multiple types (Direct, Difference, Level)
- Real-time network validation
- Interactive visualizations
- Detailed transaction history

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── api/          # API and mock data
├── components/   # React components
├── constants/    # System constants
├── hooks/        # Custom React hooks
├── types/        # TypeScript definitions
└── utils/        # Utility functions
```

## Architecture

The system follows a modular architecture with clear separation of concerns:

- Business Logic: Contained in utils/ for reusability
- UI Components: Modular, reusable React components
- Data Management: Custom hooks for state management
- API Layer: Mockable API interface for easy backend integration

## Documentation

See [DOCUMENTATION.md](./DOCUMENTATION.md) for detailed system documentation.
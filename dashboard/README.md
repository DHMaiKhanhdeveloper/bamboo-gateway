# Playwright Test Dashboard

A real-time dashboard for monitoring and analyzing Playwright test results, built with React and TypeScript.

## Features

- **Real-time Data**: Loads actual test results from `test-aggregation.json`
- **Interactive Charts**: Pie charts and bar charts showing test results by status and branch
- **Detailed Table**: Comprehensive test case table with filtering and search
- **Clickable Links**: Direct links to test reports from ticket names
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+
- npm or yarn

### Installation

```bash
npm install
```

### Development

To start the development server with real data:

```bash
npm run dev:sync
```

This will:
1. Sync the latest `test-aggregation.json` from the parent directory
2. Start the development server

### Manual Data Sync

If you need to sync test data manually:

```bash
npm run sync-data
```

### Building for Production

```bash
npm run build
```

## Data Source

The dashboard reads test data from `/public/test-aggregation.json`. This file is automatically synced from the parent directory's `test-aggregation.json` file.

### Data Structure

The dashboard expects the following JSON structure:

```json
{
  "lastUpdated": "2025-10-04T10:59:12.289Z",
  "totalTests": 11,
  "passedTests": 9,
  "failedTests": 1,
  "skippedTests": 1,
  "results": [
    {
      "id": "TEST-011-1759575552295",
      "ticket": "TEST-011",
      "branch": "tickets/TEST-011",
      "status": "passed",
      "duration": 0,
      "testPath": "tests/smoke/critical-path.spec.ts",
      "timestamp": "2025-10-04T10:59:12.289Z",
      "author": "unknown",
      "commit": "unknown",
      "reportUrl": "./aggregated-reports/TEST-011-1759575552295/index.html"
    }
  ]
}
```

## Features

### Dashboard Overview
- **Statistics Cards**: Total, passed, failed, and skipped test counts
- **Test Run Summary**: Environment and trigger information
- **Real-time Updates**: Refresh button to load latest data

### Charts
- **Results Distribution**: Pie chart showing test status breakdown
- **Results by Branch**: Bar chart showing test results grouped by branch

### Test Cases Table
- **Search**: Filter tests by ticket name or test path
- **Status Filter**: Filter by passed, failed, or skipped
- **Branch Filter**: Filter by specific branches
- **Clickable Links**: Ticket names link directly to test reports
- **Detailed View**: Modal with comprehensive test information

### Recent Failures
- **Failure Highlights**: Special section for failed tests
- **Quick Access**: Direct links to failure details

## Customization

### Adding New Data Fields

1. Update the `TestCase` interface in `src/components/mockData.ts`
2. Update the table columns in `src/components/TestCasesTable.tsx`
3. Update the dialog content to display new fields

### Styling

The dashboard uses Tailwind CSS for styling. You can customize:
- Colors in `src/index.css`
- Component styles in individual component files
- Layout in `src/App.tsx`

## Troubleshooting

### Data Not Loading
- Ensure `test-aggregation.json` exists in the parent directory
- Run `npm run sync-data` to manually sync data
- Check browser console for fetch errors

### Build Issues
- Ensure Node.js version is 20.19+ or 22.12+
- Run `npm install` to ensure all dependencies are installed
- Check TypeScript compilation with `npx tsc --noEmit`

## Contributing

1. Make changes to the dashboard components
2. Test with real data using `npm run dev:sync`
3. Ensure TypeScript compilation passes
4. Update documentation as needed

## License

This project is part of the e2e-bamboopay test automation suite.
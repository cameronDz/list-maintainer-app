# List Maintainer App

This project was built with [Vite](https://vitejs.dev/) and [React](https://reactjs.org/), and is configured for deployment on GitHub Pages.

## Live Demo

The application is deployed at: [https://cameronDz.github.io/list-maintainer-app](https://cameronDz.github.io/list-maintainer-app)

## Available Scripts

In the project directory, you can run:

### `pnpm dev`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `pnpm test`

Launches the test runner in interactive watch mode.\
See the [Vitest documentation](https://vitest.dev/) for more information.

### `pnpm build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

### `pnpm deploy`

Builds the app and deploys it to GitHub Pages. This command will:
1. Run the build process
2. Deploy the built files to the `gh-pages` branch
3. Make the app available at the configured GitHub Pages URL

## GitHub Pages Deployment

This project is configured to automatically deploy to GitHub Pages when you push to the `master` branch. The deployment is handled by GitHub Actions.

### Manual Deployment

To deploy manually, run:
```
pnpm deploy
```

### Automatic Deployment

The project includes a GitHub Actions workflow that automatically builds and deploys the app when changes are pushed to the `master` branch.

## Development

### Prerequisites

- Node.js (>=18.0.0)
- pnpm (>=8.0.0)

### Getting Started

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Start the development server: `pnpm dev`
4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser

### Additional Scripts

- `pnpm lint` - Run ESLint to check code quality
- `pnpm lint:fix` - Run ESLint and automatically fix issues
- `pnpm preview` - Preview the production build locally

## Learn More

You can learn more in the [Vite documentation](https://vitejs.dev/guide/).

To learn React, check out the [React documentation](https://reactjs.org/).

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Testing**: Vitest with jsdom
- **Linting**: ESLint with Prettier
- **Package Manager**: pnpm
- **Deployment**: GitHub Pages with GitHub Actions

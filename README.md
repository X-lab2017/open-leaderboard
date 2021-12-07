# Open-Insight-front

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). But we eject the configuration to support multi entries.

## Getting Started

### Step1: Create a new page folder.
Create a new folder under `src/pages/`. And you can name it as `newpage`.

### Step2: Create a new index.js for your new page.
Create a new `index.js` file under your `newpage` folder. And below is an example.
```html
import ReactDOM from 'react-dom'
ReactDOM.render(
    <h1>This is Your New Page!</h1>,
    document.getElementById('root')
);
```
### Step3: Run and see the result.
First, run `npm install` to install the dependencies.  
Then, run `npm start` to run the project in develop environment.  
Finally, visit `http://localhost:3000/newpage.html` to see the result.

## Simple Tutorial
All page will use the same HTML template, which is `index.html` under `public/` directory.  
Webpack will inject JS files into the template, so you don't need to link JS file in HTML file.  
In addition, Webpack will build a list of HTML files in `npm run build` command, which have the same names with JS file, like `index.html`, `test.html`.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

> !Important, DO NOT use `serve -s build `. It will create a single page server and route all requests to index. Please use `serve build`!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

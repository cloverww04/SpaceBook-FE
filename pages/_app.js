/* eslint-disable react/prop-types */
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css';
import { AuthProvider } from '../utils/context/authContext';
import ViewDirectorBasedOnUserAuthStatus from '../utils/ViewDirector';

function getRandomPosition() {
  const getRandomPercentage = () => `${Math.random() * 100}%`;
  return { top: getRandomPercentage(), left: getRandomPercentage() };
}

function MyApp({ Component, pageProps }) {
  const stars = Array.from({ length: 100 }, (_, index) => (
    <div key={index} className="star" style={getRandomPosition()} />
  ));
  return (
    <AuthProvider>
      {' '}
      {/* gives children components access to user and auth methods */}
      <ViewDirectorBasedOnUserAuthStatus
        // if status is pending === loading
        // if status is logged in === view app
        // if status is logged out === sign in page
        component={Component}
        pageProps={pageProps}
      />
      {stars}
    </AuthProvider>
  );
}

export default MyApp;

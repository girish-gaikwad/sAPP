import './styles/Base.scss';
import './styles/Clerk.scss';
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route, Link } from 'react-router-dom';

import Home from './Home';
import MusicTherapy from './pages/MusicTherapy';
import TreatmentPlan from './pages/TreatmentPlan';
import AI from './pages/AI_Assistant';
import YT_RecommendationView from './pages/YT_RecommendationView';

import Register from './components/Register';
import Username from './components/Username';
import Password from './components/Password';
import Profile from './components/Profile';
import Reset from './components/Reset';
import Recovery from './components/Recovery';
import PageNotFound from './components/PageNotFound';
import { AuthorizeUser, ProtectRoute } from './middleware/auth';
import YoutubePreferences from "./components/YoutubePreferences";


/* root routes */
const router = createBrowserRouter(
   createRoutesFromElements(
      <Route path="/">
         <Route  element={<Username/>} />
         
         <Route path="/assistant" element={<AI />} />
         <Route path="/music-therapy" element={<MusicTherapy />} />
         <Route path="/profile" element={<TreatmentPlan />} />
         <Route path="/yt-recommendation" element={<YT_RecommendationView />} />
         <Route path="/preferences" element={<YoutubePreferences />} />

         {/* <Route path="/username" element={<Username />} /> */}
         <Route path="/register" element={<Register />} />
         <Route path="/password" element={<Password />} />
         <Route path="/status" element={<Profile />} />
         <Route path="/reset" element={<Reset />} />
         <Route path="/recovery" element={<Recovery />} />
         <Route path="/pagenotfound" element={<PageNotFound />} />
         <Route  index  element={<Home />} />
      </Route>
   )
);

function App() {
   return (
      <>
         {/* <ClerkProvider publishableKey={clerkPubKey}> */}
         <RouterProvider router={router} />
         {/* </ClerkProvider> */}
      </>
   );
}

export default App;

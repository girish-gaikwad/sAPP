import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MusicCarousel from '../components/MusicCarousel';
import '../styles/MusicTherapy.scss';
import '../styles/Base.scss';
// import depLogo from '../images/depresio-logo-bg-removed.jpeg';
import mtHome from '../images/mt-home.svg';
import mtSearch from '../images/mt-search.svg';
import mtLibrary from '../images/mt-library.svg';
// import mtLogo from '../images/mt-logo.svg';
import preSong from '../images/pre-song.png';
import nextSong from '../images/next-song.png';
import playBtn from '../images/play-pause.png';
import playerTimeline from '../images/mt-player-timeline.png';
import soundHigh from '../images/sound-high.png';
import mtShuffle from '../images/mt_shuffle.png';
import hippop from '../images/hipop-cover.png';
import bluePlayBtn from '../images/bluePlayBtn.png';
import mood1 from '../images/mood1.png';
import mood2 from '../images/mood2.png';
import mood3 from '../images/mood3.png';
import mood4 from '../images/mood4.png';
import mood5 from '../images/mood5.png';
import mood6 from '../images/mood6.png';
import profileImg from '../images/chat-user.svg';
import chevronDown from '../images/chevron-down.svg';
import { useEffect, useState } from 'react';
import { Buffer } from 'buffer';
import { getUsername } from '../helper/helper'
import { getRecommendation } from '../helper/helper'
import useFetch from '../hooks/fetch.hook';
import { useAuthStore } from '../store/store';

// import 'dotenv/config';

import axios from 'axios';
import { Link } from 'react-router-dom';
const qs = require('qs');

const client_id = '85828d1937e346c8a174c74766c1bb89'; // Your client id
const client_secret = 'de99228ea35a4287bd2f1e25d35dec36'; // Your secret
// const client_id = process.env.SPOTIFY_CLIENT_ID; // Your client id
// const client_secret = process.env.SPOTIFY_CLIENT_SECRET; // Your secret
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;
const auth_token = Buffer.from(`${client_id}:${client_secret}`, 'utf-8').toString('base64');

const MusicTherapy = () => {
   // const { username } = useAuthStore((state) => state.auth);
   // const [{ isLoading, apiData, serverError }] = useFetch(`/user/${username}`);

   const [accessToken, setAccessToken] = useState('');
   const [username, setUsername] = useState(''); // State for the username
   const [emotion, setEmotion] = useState('');
   const [recommendations, setRecommendations] = useState('');


   useEffect(() => {
      getUsernameAndFetchData();
      // getRecommendation(apiData.username)
   }, []);

   const getUsernameAndFetchData = async () => {
      try {
         // Fetch the username
         // const userData = await getUsername();
         const { username } = await getUsername();
         // const fetchedUsername = userData.username;
         // setUsername(fetchedUsername); // Update the username state
         console.log(username)
   
         const emotionData = await getRecommendation({username});
         const emotion = emotionData.data;
         setEmotion(emotion)
         console.log(emotion)
   
      } catch (error) {
         console.error('Error fetching username', error);
      }       
   };

   // useEffect(() => {

   //    const getUsernameAndFetchData = async () => {

   //       try {
   //          // Fetch the username
   //          const userData = await getUsername();
   //          const fetchedUsername = userData.username;
   //          setUsername(fetchedUsername); // Update the username state
   //          console.log(username)

   //          const emotionData = await getRecommendation({username});
   //          const emotion = emotionData.data;
   //          setEmotion(emotion)
   //          console.log(emotion)

   //       } catch (error) {
   //          console.error('Error fetching username', error);
   //       }
         
   //    };

   //    getUsernameAndFetchData();
   // }, []);
    

    


 

   

   // const [trackData, setTrackData] = useState(null);
   const [trackIds, setTrackIds] = useState(['1ei3hzQmrgealgRKFxIcWn', '7eJMfftS33KTjuF7lTsMCx']);
   // const [trackIds, setTrackIds] = useState([]);
   const [trackData, setTrackData] = useState([]);

   
   const getTrackData = async (accessToken, trackIds) => {
      try {
         const promises = trackIds.map(async (trackId) => {
            const response = await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, {
               headers: {
                  Authorization: `Bearer ${accessToken}`,
               },
            });
            return response.data;
         });

         const trackDetails = await Promise.all(promises);
         return trackDetails;
      } catch (error) {
         console.error('Error fetching track data:', error);
         return [];
      }
   };

   useEffect(() => {
      getUsernameAndFetchData();

      // Retrieve access token from Spotify
      axios('https://accounts.spotify.com/api/token', {
         headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'Basic ' + btoa(client_id + ':' + client_secret),
         },
         data: 'grant_type=client_credentials',
         method: 'POST',
      })
         .then((tokenResponse) => {
            setAccessToken(tokenResponse.data.access_token);
            // console.log(client_id)
            // console.log(client_secret)
            
         })
         .catch((error) => {
            console.error('Error retrieving access token:', error);
         });
      
      
   }, []);

   useEffect(() => {
      // If we have an access token and track IDs, make API requests to retrieve track data
      if (accessToken && trackIds.length > 0) {
         getTrackData(accessToken, trackIds)
            .then((trackDetails) => {
               setTrackData(trackDetails);
            })
            .catch((error) => {
               console.error('Error fetching track data:', error);
            });
      }
   }, [accessToken, trackIds]);

   return (
      <>
         <Header />
         <div className="container">
            <div className="mt-main-container mt--24 mb--48">
               <div className="mt-second-col">
                  <div>
                     
                     <h2 className="mb--16">Music recommended for you based on your emotions.</h2>
                     <div className="music-flex-cont">
                        {trackData.length > 0 ? (
                           trackData.map((track, index) => (
                              <div key={index}>
                                 <iframe src={`https://open.spotify.com/embed/track/${track.id}`} width="300" height="80" frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>
                              </div>
                           ))
                        ) : (
                           <p>No recommended songs...</p>
                        )}
                     </div>

<Link to={'/yt-recommendation'}>
                     <button className='btn'>View your recommendations</button>
</Link>

                  
                  </div>
               </div>
            </div>
         </div>
         <Footer />
      </>
   );
};

export default MusicTherapy;

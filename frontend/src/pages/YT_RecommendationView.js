import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/YT_RecommendationView.scss';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getUsername } from '../helper/helper'
import { getRecommendation } from '../helper/helper'
// import 'dotenv/config';

// get_youtube_videos_from_preferences

/** POST: http://localhost:5001/api/youtube_list */
/** 
 * @param : {
  "categories" : ["Gaming"],
}
*/

const YT_RecommendationView = () => {
   const [videoIds, setVideoIds] = useState([]);
   const [emotion, setEmotion] = useState('');
   // const [videoTrack, setVideoTrack] = useState([]);
   const [isReviewDialogVisible, setIsReviewDialogVisible] = useState(false);
   const [rating, setRating] = useState(0);
   const [recommendations, setRecommendations] = useState('');

   const emotionCategories = {
      'sadness': ['Music', 'Comedy', 'Entertainment', 'Classics', 'Family', 'Pets & Animals', 'People & Blogs'],
      'fear': ['Comedy', 'Entertainment', 'Drama', 'Action/Adventure', 'Gaming', 'Pets & Animals'],
      'joy': ['Autos & Vehicles', 'Film & Animation', 'Sports', 'Gaming', 'Entertainment', 'Comedy', 'Horror', 'Documentary', 'Videoblogging', 'Travel & Events', 'Science & Technology'],
      'surprise': ['Entertainment', 'Pets & Animals', 'Autos & Vehicles', 'Family', 'Sci-Fi/Fantasy', 'Action/Adventure', 'Sports', 'Foreign', 'Thriller', 'Trailers', 'Classics'],
      'love': ['Family', 'Pets & Animals', 'Sports', 'People & Blogs', 'Movies', 'Shows', 'Classics'],
      'anger': ['Music', 'Short Movies', 'Travel & Events', 'Gaming', 'Science & Technology', 'Entertainment', 'Classics']
  };

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
  
  

//   }, [emotion]);

   // useEffect(() => {
   //    getUsernameAndFetchData();
   // }, []);

   // const getUsernameAndFetchData = async () => {
   //    try {
   //       // Fetch the username
   //       // const userData = await getUsername();
   //       const { username } = await getUsername();
   //       // const fetchedUsername = userData.username;
   //       // setUsername(fetchedUsername); // Update the username state
   //       console.log(username)
   
   //       const emotionData = await getRecommendation({username});
   //       const emotion = emotionData.data;
   //       setEmotion(emotion)
   //       console.log(emotion)
   
   //    } catch (error) {
   //       console.error('Error fetching username', error);
   //    }       
   // };

   // useEffect(() => {
      // getVideoIdsByCategory('music')
      // .then((videoIds) => {
      //    console.log("hi", videoIds);
      //    videoIds.map((videoId) => {
      //       console.log(videoId);
      //       console.log(`https://www.youtube.com/embed/${videoId}`);
            
      //    }); 
      // })
   //    .catch(error => console.error(error));
   // }, []);   

   async function getVideoIdsByCategory(category) {
      const baseUrl = "https://www.googleapis.com/youtube/v3/search";
      // AIzaSyAVaTDu0itvwcxZFnSFDXzjJXwmRjHUmFM
      // const API_KEY = "AIzaSyA3Yj4sKRset4eC-KWDDkiiFckWNdBXdaw";
      const API_KEY = "AIzaSyAVaTDu0itvwcxZFnSFDXzjJXwmRjHUmFM";
      const videoIds = [];
   
      const params = {
          part: 'snippet',
          q: category,
          type: 'video',
          maxResults: 5,
          key: API_KEY
      };
   
      try {
          const response = await axios.get(baseUrl, { params: params });
          const data = response.data;
   
          if ('items' in data) {
              for (const item of data.items) {
                  videoIds.push(item.id.videoId);
              }
          } else {
              console.log(`No items found for category '${category}'.`);
          }
      } catch (error) {
          console.error(`Error fetching videos for category '${category}': ${error}`);
      }
      setVideoIds(videoIds);
      return videoIds;
   }


   const storedData = localStorage.getItem('selectedCategories');

   useEffect(() => {
      // getVideoIdsByCategory(storedData)
      const categories = JSON.parse(storedData);
      console.log(categories);
      
      categories.forEach(category=> {
         getVideoIdsByCategory(category)
            .then(videoIds => {
               console.log(`Video IDs for category '${category}':`, videoIds);
               videoIds.map((videoId) => {
                    console.log(videoId);
                    console.log(`https://www.youtube.com/embed/${videoId}`);
               });         
            })
      });

      // return videoIds;

   }, [storedData])


   const handleRating = (selectedRating) => {
      setRating(selectedRating);
      console.log(selectedRating);
   };

   useEffect(() => {
      if (isReviewDialogVisible) {
         document.body.classList.add('no-scroll');
      } else {
         document.body.classList.remove('no-scroll');
      }
      return () => {
         document.body.classList.remove('no-scroll');
      };
   }, [isReviewDialogVisible]);

   useEffect(() => {
      localStorage.setItem('rating', rating);
   }, [rating]);

   // useEffect(() => {
   //    const requestOptions = {
   //       method: 'POST',
   //       headers: { 'Content-Type': 'application/json' },
   //       body: storedData,
   //    };
   //    axios
   //       .post(`${process.env.REACT_APP_SERVER_ENDPOINT}/api/youtube_list`, storedData)
   //       .then((response) => {
   //          console.log(response.data.result);
   //          // const parsedArray = JSON.parse(response.data.replace(/\n/g, ''));
   //          // const videoIdsArray = response.data.split('\n').map(line => line.replace(/[[\]']/g, '')).filter(id => id !== 'undefined');
   //          // videoIdsArray = videoIdsArray.split(', ');
   //          // var videoUrls = JSON.parse(response.data);
   //          // console.log(videoIdsArray)
   //          setVideoIds(JSON.parse(response.data.result));
   //       })
   //       .catch((error) => {
   //          console.log(error);
   //       });
   // }, [storedData]);


   // async function getYoutubeVideosFromPreferences(apiKey, categories, maxResults = 5) {
   
   //    const baseUrl = 'https://www.googleapis.com/youtube/v3/search';
   //    const videoLinks = [];

   //    for (const category of categories) {
   //       const params = {
   //          part: 'snippet',
   //          q: category,
   //          type: 'video',
   //          maxResults: maxResults,
   //          key: apiKey,
   //       };

   //       try {
   //          const response = await axios.get(baseUrl, { params });
   //          const data = response.data;

   //          if (!data.items) {
   //          console.error(`Error fetching videos for category '${category}':`);
   //          continue;
   //          }

   //          for (const item of data.items) {
   //             const videoId = item.id.videoId;
   //             // const link = `https://www.youtube.com/watch?v=${videoId}`;
   //             const link = videoId;
   //             videoLinks.push(link);
   //          }
   //       } catch (error) {
   //          console.error(`Error fetching videos for category '${category}':`, error);
   //       }
   //    }

   //    return videoLinks;
   // }

   // let videoLinks = getYoutubeVideosFromPreferences(process.env.YOUTUBE_API_KEY, storedData)

   // console.log(videoLinks);
   // Convert the list to a JSON array
   // videoIds = JSON.parse(videoIds);
   // videoIds = JSON.parse(videoIds)
   // console.log(typeof videoIds)
   // const listData = JSON.parse(videoIds.replace(/'/g, '"'));

   // console.log(listData);
   console.log(videoIds)
   // console.log('Loaded Ids ', typeof videoUrls);

   return (
      <>
         <Header />
         <div className="AI mt--24 mb--48">
            <div className="container">
               <div className="AI__wrapper">
                  <div className=" AI__wrapper__inner__2">
                     <div className="AI__wrapper__inner__2__header">
                        <h2>Videos recommended for you based on your preferences.</h2>
                     </div>

                     <div className="">
                        {/* console.log(videoIds); */}
                        <div className="yt-container">
                           {videoIds.map((videoId) => {
                              return (
                                 <>
                                    <div className="yt-recommendation-item">
                                       <iframe width="560" height="315" src={`https://www.youtube.com/embed/${videoId}`} title={`YouTube video player for ${videoId}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                                       {/* <div className="button-container">
                                          <button
                                             style={{
                                                backgroundColor: 'transparent',
                                                color: 'white',
                                                border: 'none',
                                                cursor: 'pointer',
                                                fontSize: '20px',
                                             }}
                                             onClick={() => setIsReviewDialogVisible(true)}
                                          >
                                             Rate this Video
                                          </button>
                                       </div> */}
                                    </div>
                                 </>
                              );
                           })}
                        </div>
                        <div className="popup-inner__button"></div>
                     </div>

                     <Link className="btn select-new-pref" to="/preferences">
                        Select Your New Preferences
                     </Link>

                     {isReviewDialogVisible && (
                        <div className="review-dialog">
                           <div className="review-dialog-content">
                              <button className="close-button" onClick={() => setIsReviewDialogVisible(false)}>
                                 X
                              </button>
                              <h2
                                 style={{
                                    textAlign: 'center',
                                    color: 'black',
                                 }}
                              >
                                 Rate the Recommendations
                              </h2>
                              <div className="stars">
                                 {/* {[...Array(5)].map((star, index) => {
                                    return (
                                       <span
                                          key={index}
                                          className={`star ${index < rating ? 'filled' : ''}`}
                                          onClick={() => {
                                             handleRating(index + 1);
                                          }}
                                       >
                                          {index < rating ? '★' : '☆'}
                                       </span>
                                    );
                                 })} */}
                              </div>
                              <button className="review-submit btn" onClick={() => setIsReviewDialogVisible(false)}>
                                 Submit
                              </button>
                           </div>
                        </div>
                     )}

                     {/* <button className='btn' >View your recommendations</button>  */}

                  </div>
               </div>
            </div>
         </div>

         <Footer />
      </>
   );
};

export default YT_RecommendationView;

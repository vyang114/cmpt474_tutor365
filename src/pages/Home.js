import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './css/home.css';

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [bookmarkedCourses, setBookmarkedCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const colours = ["#EDAA6C", "#EA713D", "#D83E27", "#152B53", "#1F6E8E", "#2C8B98", "#82A8A0"];
  var username = localStorage.getItem("username");

  useEffect(() => {
    // Check if user is logged in by checking if username exists in localStorage
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // fetch courses and bookmarked courses on mount
  useEffect(() => {
    const fetchData = async () => {
      // fetch courses
      const response = await fetch("https://56j70ao9r7.execute-api.us-east-1.amazonaws.com/dev", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({"action": "SCAN"}),
        redirect: 'follow'
      });
      const data = await response.json();
      const obj = JSON.parse(data.body);
      setCourses(obj.Items);

      // fetch bookmarked courses
      const bookmarkResponse = await fetch(`https://v9v2zwoza6.execute-api.us-east-2.amazonaws.com/prod/bookmarks?username=${username}`);
      const bookmarks = await bookmarkResponse.json();
      console.log(bookmarks);
      setBookmarkedCourses(bookmarks.map(b => b.courseID));
    }
    fetchData();
    
    // process course detail
    // for(let i = 0; i < courses.length; i++){
    //   let course = courses[i].detail.M
    //   // console.log("items", items)
    //   for (const chapter in course){
    //     let ch = course[chapter].SS
    //     console.log("chapter", chapter, ch)
    //   }
    // }
    // console.log(courses)
  }, [username]);


  // toggle bookmark
  const toggleBookmark = async (course, index) => {
    const bookmark = {
      username: username,
      courseID: course.courseID.S,
      courseName: course.courseName.S,
      description: course.description.S,
      price: course.price.S
    };

    if (bookmarkedCourses.includes(bookmark.courseID)) {
      // if bookmark is already saved, delete it
      try {
        const existingBookmark = {
          username: bookmark.username,
          courseID: bookmark.courseID
        };
        await fetch(`https://v9v2zwoza6.execute-api.us-east-2.amazonaws.com/prod/bookmarks`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(existingBookmark)
        });
        console.log("Bookmark deleted");
        setBookmarkedCourses(bookmarkedCourses.filter(id => id !== bookmark.courseID));
      } catch (error) {
        console.error(error);
        alert("Failed to delete bookmark. Please try again later.");
      }
    } else {
      // if bookmark is not saved yet, save it
      try {
        await fetch('https://v9v2zwoza6.execute-api.us-east-2.amazonaws.com/prod/bookmarks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(bookmark)
        });
        console.log("Bookmark saved");
        setBookmarkedCourses([...bookmarkedCourses, bookmark.courseID]);
      } catch (error) {
        console.error(error);
        alert("Failed to save bookmark. Please try again later.");
      }
    }
  };

  return (
    <>
      <title>Home</title>
      <div className="wrapper">
        <h1>Courses</h1>
        <h4>HELLO YASAMAN!!</h4>
        <div className="separator"></div>
        <div className="courses-container">
          {courses.map((course, index) => {
            const isBookmarked = bookmarkedCourses.includes(course.courseID.S);
            return (
              <div className="course-item" key={index}>
                <div className="course-header" style={{ background: `${colours[index]}` }}>
                { isLoggedIn ?
                <button className="bookmark" onClick={() => toggleBookmark(course, index)}> 
                    <i className={`fa ${isBookmarked ? "fa-bookmark" : "fa-bookmark-o"} fa-3x`}></i>
                  </button> 
                  : <span></span>
                }
                </div>
                <div className="course-item-text">
                <h4>{course.courseName.S}</h4>
                <p className="course-desc">{course.description.S}</p>
                <div className="link-price">
                  <p className="price">{"$" + course.price.S}</p>
                  <Link className="nav-link" to="/coursedetail" state={{ from: course.courseID.S }}>View Course</Link>
                </div>
              </div>
            </div>
          )})}
        </div>
      </div>
    </>
  );
}
  
export default Home;
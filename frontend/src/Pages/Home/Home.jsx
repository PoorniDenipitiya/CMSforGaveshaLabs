import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Home.css";
import octopus from "../Home/Assets/space.png";
import resources1 from "./Assets/r1.png";
import forum1 from "../Home/Assets/f1.png";
import project1 from "../Home/Assets/octopus.png";
import blog1 from "../Home/Assets/b1.png";
import shopping1 from "../Home/Assets/s1.png";
import aboutus from "../Home/Assets/AboutUs.jpg";
import CIcon from "@coreui/icons-react";
import * as icon from "@coreui/icons";
import {Search} from '../../Component/Search/Search'


gsap.registerPlugin(ScrollTrigger);

export const Home = () => {
  const navigate = useNavigate(); 

 

  const handleGetStartedClick = () => {
    navigate("/signup");
  };

  const handleExploreResourcesClick = () => {
    navigate("/resources");
  };

  const handleExploreForumClick = () => {
    navigate("/forum");
  };

  const handleExploreProjectsClick = () => {
    navigate("/project");
  };

  const handleExploreBlogsClick = () => {
    navigate("/blogs");
  };

  const handleExploreShoppingClick = () => {
    navigate("/shopping");
  };
  useEffect(() => {
    const sections = document.querySelectorAll("section");
  
    sections.forEach((section) => {
      gsap.fromTo(
        section,
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });
  }, []);
  
  return (
    <div className="Home">
      <div className="HomeMainDiv">
        <div className="homeDiv1">
          <p className="TriviaAPP"> Empower Your DIY Electronics ! </p>
          <p className="HomeMainSubText">
            Unleash your creativity with our Content Management System your
            personal genie for electronic tinkering, making every project a
            breeze.
          </p>
          <button
            className="HomeGetStartedButton"
            onClick={handleGetStartedClick}
          >
            Get Started
          </button>
        </div>
        <div className="homeDiv2">
          <div className="HomeText">
            <Search/>
             
          </div>
          <img src={octopus} alt="octo" className="mainocto"/>
        </div>
      </div>

      <section id="section2" className="HomeResourseDiv">
        <div className="HomeResourceSub1">
          <img src={resources1} alt="resourcesimg" className="resourseImage" />
        </div>
        <div className="HomeResourceSub2">
          <p className="ResourcesTopic"> Resources </p>
          <p className="HomeResourceSubText">
            Looking for the encyclopedia of IOT ?<br></br>
            We got you all the knowledge you need to know about IOT when
            building your project and you can be a part of this encyclopedia by
            sharing your knowledge.
          </p>
          <button
            className="HomeGetStartedButton"
            onClick={handleExploreResourcesClick}
          >
            Explore
          </button>
        </div>
      </section>

      <section id="section3" className="HomeResourseDiv">
        <div className="HomeForumSub1">
          <p className="ForumTopic"> Forum </p>
          <p className="HomeForumSubText">
            A Friend in need is a friend in deed ! Solve your IOT problems by
            connecting with other IOT Tinkers like you and help them with their
            projects also. Join the Community !
          </p>
          <button
            className="HomeGetStartedButton"
            onClick={handleExploreForumClick}
          >
            Explore
          </button>
        </div>
        <div className="HomeForumSub2">
          <img src={forum1} alt="forumimage" className="resourseImage" />
        </div>
      </section>

      <section id="section4" className="HomeResourseDiv">
        <div className="HomeResourceSub1">
          <img src={project1} alt="projectsimage" className="resourseImage" />
        </div> 
        <div className="HomeResourceSub2">
          <p className="ResourcesTopic"> Projects </p>
          <p className="HomeResourceSubText">
            If you are running out of ideas for your IOT project we got you !
            <br></br>
            Follow the step-by-step guidelines provided to build your project.
            <br></br>
            As well as if you are an innovator who wants to share your new
            project with others you are at the right place.
          </p>
          <button
            className="HomeGetStartedButton"
            onClick={handleExploreProjectsClick}
          >
            Explore
          </button>
        </div>
      </section>

      <section id="section5" className="HomeResourseDiv">
        <div className="HomeForumSub1">
          <p className="ForumTopic"> Blog </p>
          <p className="HomeForumSubText">
            See what others are doing by clicking our Blogs !<br></br>and share
            your creative ideas and experience about your IOT life with our
            tinkers by discovering the blog feature
          </p>
          <button
            className="HomeGetStartedButton"
            onClick={handleExploreBlogsClick}
          >
            Explore
          </button>
        </div>
        <div className="HomeForumSub2">
          <img src={blog1} alt="blogimage" className="" />
        </div>
      </section>

      <section id="section6" className="HomeResourseDiv">
        <div className="HomeResourceSub1">
          <img src={shopping1} alt="projectsimage" className="resourseImage" />
        </div>
        <div className="HomeResourceSub2">
          <p className="ResourcesTopic"> Shopping </p>
          <p className="HomeResourceSubText">
            Don't know where to buy IOT components or wanna sell those used
            components ? <br></br>
            Check out our classified website ; A place where you can buy and
            sell !
          </p>
          <button
            className="HomeGetStartedButton"
            onClick={handleExploreShoppingClick}
          >
            Explore
          </button>
        </div>
      </section>

      <section id="section7" className="HomeResourseDiv">
      <div className="HomeForumSub2">
          <img src={aboutus} alt="AboutUsimage" className="" />
        </div>
        <div className="HomeForumSub1">
          <p className="ForumTopic"> About us </p>
          <p className="HomeForumSubText">
          Welcome to Gavesha, the ultimate destination for young innovators! 🌟
          <br/> <br/>
          Is your child fascinated by electronics, Arduino, and DIY projects? Or
          perhaps you're an adult who's still young at heart? Gavesha is perfect
          for all ages with a passion for hands-on learning and creativity.
          </p>
       
        </div>
      </section>
    </div>
  );
};
import React, { useEffect, useState  } from "react";
import "./Resources.css";
import read from "../Resources/Assets/read1.png"; // Import icon image
import pen from "../Resources/Assets/pen1.png"; // Import icon image
import { Link , useNavigate } from "react-router-dom";
import { useUsers } from "../../Context/UserContext"; // Import user context
import Alert from "../../Component/Alert/Alert";

import sensors from "../Resources/Assets/sensors.png";
import pcb from "../Resources/Assets/pcb.png";
import datasheet from "../Resources/Assets/datasheet.jpg"; 
import communi from "../Resources/Assets/com.png";
import cloud from "../Resources/Assets/cloud.jpg";
import kit from "../Resources/Assets/kit.jpg";
import iot from "../Resources/Assets/iot.jpg";
import micro from "../Resources/Assets/micro.png";

import searchIcon from '../../Component/Assets/search.png'; // Importing the search icon image

export const Resources = ({ defaultValue = "" }) => {

  const { user } = useUsers(); // Access user data from context
  const navigate = useNavigate(); // Use useNavigate hook
  const [showAlert, setShowAlert] = useState(false);

  const [prompt, setPrompt] = useState(defaultValue); // State variable to hold the search query

  useEffect(() => {  
    setPrompt(defaultValue); // Set the default value when it changes
  }, [defaultValue]);

  const handleSearch = () => {
    if (prompt) {
      navigate(`/resosearch?query=${prompt}`);
    } else {
      navigate("/resources");
    }
  };


  // Function to handle create button click
  const handleCreateClick = () => {
    if (!user) {
      setShowAlert(true);
    } else {
      navigate('/writepost');
    }
  };

  const handleAlertClose = () => {
    setShowAlert(false);
    navigate('/login');
  };

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5, // Change this threshold as needed for the desired effect
    };

    const handleIntersect = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        } else {
          entry.target.classList.remove("active");
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, options);

    const elements = document.querySelectorAll(".rescollect");
    elements.forEach((element) => {
      observer.observe(element);
    });

    // Clean up
    return () => {
      observer.disconnect();
    };
  }, []);

  const scrollToContent = () => {
    const content = document.getElementById("resobanner-content");
    if (content) {
      const scrollOffset = content.getBoundingClientRect().height * 1.85;
            window.scrollBy({ top: scrollOffset, behavior: "smooth" });
    }
  };

  return (
    <div className="resoCollect">
      <div className="resobanner">

        <div className="resobanner-content" id="resobanner-content">
        <div className="ResoSearchDiv">
          <input
            type="text"
            className="searchBar" // CSS class for the search bar input
            placeholder="Search for more.." // Placeholder text for the search bar
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)} // Function to update the search query state on input change
          />
          <img
            src={searchIcon} // Source of the search icon image
            className="searchIcon" // CSS class for the search icon
            onClick={handleSearch} // Function to navigate based on the search query
            alt="Search Icon" // Alt text for the search icon image
          />
        </div>
          <h1>Welcome to Our Resource Hub</h1>
          <p>
            Explore a vast collection of resources to enhance your electronic
            projects
          </p>
        
            <div className="button-container">
              <button onClick={scrollToContent}>
              {read && (
                  <img src={read} alt="read" className="button-icon" />
                )} Learn
              </button> 
             
              <button onClick={handleCreateClick}> 
                {pen && (
                  <img src={pen} alt="pen" className="button-icon" />
                )} Write

              </button>
              {showAlert && (
            <Alert
              message="Please login to create a post."
              onClose={handleAlertClose}
            />
          )}
            </div>
   
        </div>
      </div>

      

      <div className="rescollect" id="collect1">
        <div className="resoimg">
          <img src={sensors} alt="" className="resoimg" />
        </div>
        <div className="resopara">
          <h3>Sensors : </h3>
          <br />
          <p>
            The sensors section includes motion, temperature, light, proximity,
            gas,sound, image, and environmental sensors, each serving specific
            purposes in detecting movement, measuring temperature, gauging light
            levels, identifying nearby objects, monitoring gases, capturing
            sound, imaging, and assessing environmental factors like humidity.
          </p>
        </div>
        <div className="seemore">
          <Link to="/Sensors?category=Motion Sensors" >
            {" "}
            <button>See more</button>
          </Link>
        </div>
      </div>

      <div className="rescollect" id="collect2">
        <div className="resoimg">
          <img src={pcb} alt="" className="resoimg" />
        </div>
        <div className="resopara">
          <h3>PCB (Printed Circuit Board) :</h3>
          <br />
          <p>
          Navigate the intricacies of PCBs with resources on Design Software, Manufacturing Services, and
          Components Sourcing. Learn about PCB Layout Techniques, Assembly and Soldering processes, and
          Testing and Validation methods to ensure the reliability and efficiency of your electronic circuits.
          </p>
        </div>
        <div className="seemore">
        <Link to="/pcb?category=Design Software">
            {" "}
            <button>See more</button>
          </Link>
        </div>
      </div>

      <div className="rescollect" id="collect3">
        <div className="resoimg">
          <img src={datasheet} alt="" className="resoimg" />
        </div>
        <div className="resopara">
          <h3>Data Sheets :</h3>
          <br />
          <p>
          Access comprehensive data sheets for various electronic components. Categories include Sensor 
          Data Sheets, Microcontroller Data Sheets, Communication Module Data Sheets, Power Management IC Data 
          Sheets, and detailed Component Specifications, providing all the technical information needed for your 
          projects.
          </p>
        </div>
        <div className="seemore">
        <Link to="/dataSheet?category=Sensor Data Sheets">
            {" "}
            <button>See more</button>
          </Link>
        </div>
      </div>


      <div className="rescollect" id="collect5">
        <div className="resoimg">
          <img src={communi} alt="" className="resoimg" />
        </div>
        <div className="resopara">
          <h3>Communication Modules :</h3>
          <br />
          <p>
          Explore a variety of communication modules essential for connectivity in modern electronics. 
          Categories include Wi-Fi Modules, Bluetooth Modules, Zigbee Modules, LoRa Modules, Cellular Modules, 
          and RFID and NFC Modules, each offering unique features and capabilities for different communication needs.
          </p>
        </div>
        <div className="seemore">
        <Link to="/communi?category=Wi-Fi Modules">
            {" "}
            <button>See more</button>
          </Link>
        </div>
      </div>


      <div className="rescollect" id="collect11">
        <div className="resoimg">
          <img src={micro} alt="" className="resoimg" />
        </div>
        <div className="resopara">
          <h3>Microcontrollers :</h3>
          <br />
          <p>
          Delve into the world of microcontrollers with a focus on Popular Microcontroller Families such as 
          Arduino and ESP32. Learn about Development Environments (IDEs), Programming Microcontrollers, Power 
          Management for Microcontrollers, and how to leverage Interfaces and Peripherals for enhanced functionality.
          </p>
        </div>
        <div className="seemore">
        <Link to="/micro?category=Popular Microcontroller Families">
            {" "}
            <button>See more</button>
          </Link>
        </div>
      </div>

      <div className="rescollect" id="collect12">
        <div className="resoimg">
          <img src={cloud} alt="" className="resoimg" />
        </div>
        <div className="resopara">
          <h3>IoT Platforms and Cloud Services : </h3>
          <br />
          <p>
          Uncover the potential of IoT Platforms like AWS IoT and Azure IoT, along with Cloud Storage Solutions 
          and Data Analytics. Manage your devices efficiently with Device Management tools and explore Integration 
          and APIs to seamlessly connect your IoT ecosystem.
          </p>
        </div>
        <div className="seemore">
        <Link to="/IotPlat?category=IoT Platforms">
            {" "}
            <button>See more</button>
          </Link>
        </div>
      </div>


      <div className="rescollect" id="collect15">
        <div className="resoimg">
          <img src={kit} alt="" className="resoimg" />
        </div>
        <div className="resopara">
          <h3>IoT Prototyping and Development Kits :</h3>
          <br />
          <p>
          Jumpstart your IoT projects with a variety of prototyping and development kits. Categories include 
          Arduino Kits, Raspberry Pi Kits, ESP32 Development Kits, Sensor Kits, and Wireless Communication Kits, 
          providing everything you need to prototype and develop IoT solutions.
          </p>
        </div>
        <div className="seemore">
        <Link to="/IotProto?category=Arduino Kits">
            {" "}
            <button>See more</button>
          </Link>
        </div>
      </div>


      <div className="rescollect" id="collect17">
        <div className="resoimg">
          <img src={iot} alt="" className="resoimg" />
        </div>
        <div className="resopara">
          <h3>Others :</h3>
          <br />
          <p>
          Find additional resources and tools to support your projects. Explore Codes/Programming, Power Management 
          techniques, Prototyping Tools, Enclosures and Cases for your devices, Networking essentials, Wireless 
          Communication options, and the integration of Machine Learning and AI for IoT. This category also includes 
          miscellaneous resources.
          </p>
        </div>
        <div className="seemore">
        <Link to="/others?category=Codes/Programming">
            {" "}
            <button>See more</button>
          </Link>
        </div>
      </div>
    </div>
  );
};
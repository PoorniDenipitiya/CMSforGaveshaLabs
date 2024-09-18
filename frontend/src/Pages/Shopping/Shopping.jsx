import React, { useEffect, useState, useRef } from "react";
import "./Shopping.css";
import { Link, useNavigate } from "react-router-dom";
import { Shopcard } from "./Shopcard";
import { useUsers } from "../../Context/UserContext"; // Import user context
import Alert from "../../Component/Alert/Alert";
import drone from "./Assets/drone.png"; 
import searchIcon from '../../Component/Assets/search.png'; // Importing the search icon image

export const Shopping = ({ defaultValue = "" }) => { 
  const shopBannerRef = useRef(null);
  const [shopposts, setShopposts] = useState([]); 
  const { user } = useUsers(); // Access user data from context
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate(); 
  const [prompt, setPrompt] = useState(defaultValue);
  const [isFocused, setIsFocused] = useState(false); 
  
  useEffect(() => {  
    setPrompt(defaultValue); // Set the default value when it changes
  }, [defaultValue]);

  const handleSearch = () => {
    if (prompt) {
      navigate(`/shopsearch?query=${prompt}`);
    } else {
      navigate("/shopping");
    }
  };


  useEffect(() => {
    fetch("http://localhost:5000/", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "shoppost");
        setShopposts(data.data); // Update shopposts state with fetched data
      });
  }, []); // Fetch shop posts only once on component mount

  // const handleCreateClick = () => {
  //   if (!user) {
  //     setShowAlert(true);
  //     setTimeout(() => {
  //       setShowAlert(false);
  //       navigate("/login");
  //     }, 2000);
  //   } else { 
  //     navigate("/shoppingpost");
  //   }
  // }; 
  const handleCreateClick = () => {
    if (!user) {
      setShowAlert(true);
    } else {
      navigate('/shoppingpost');
    }
  };

  const handleAlertClose = () => {
    setShowAlert(false);
    navigate('/login');
  };
  const scrollToContent = () => {
    if (shopBannerRef.current) {
      const offsetTop = shopBannerRef.current.getBoundingClientRect().top + window.scrollY;
      const additionalOffset = 300; // Adjust this value to scroll more
      window.scrollTo({ top: offsetTop + additionalOffset, behavior: 'smooth' });
    } else {
      console.log("Element 'shopbanner' ref not found."); 
    }
  };

  
  

  return (
    <div className="shopmain">
      <div className="shopup">
        <div  className="shopbanner" ref={shopBannerRef}>
          <div className="bannerimg">
            <img src={drone} alt="" />
          </div>
          <div className="bannertext">
            <p>Looking for components at low price?</p> 
            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This is the place...</p>
            <button className="shopmore" onClick={scrollToContent}>Shop</button>
          </div>
        </div>
        <div className="shopsearch" style={{ height: '30px',
    width: '300px',
    border: 'none',
    display: 'flex',
    marginTop:'30px',
    backgroundColor: 'white',
    color: '#000',
    fontWeight:'600',
    fontSize: '13px',
    fontFamily: 'cursive',
    paddingLeft: '20px',
    margin: '0',
    boxShadow:'4px 2px 10px black'}}>
       <input
        type="text"
        className="searchBar"
        placeholder="Search for more.."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{
          height: '30px',
          width: '300px',
          border: isFocused ? '1px solid white' : 'none',
          backgroundColor: 'white',
          color: '#000',
          fontSize: '13px',
          fontFamily: 'cursive',
          paddingLeft: '20px',
          margin: '0',
          outline: 'none',
        }}
      />
          <img
            src={searchIcon} // Source of the search icon image
            className="searchshopIcon" // CSS class for the search icon
            onClick={handleSearch} // Function to navigate based on the search query
            alt="Search Icon" 
            style={{
              height: '20px',
              width: '30px',
              backgroundColor: 'transparent',
              marginTop: '5px',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              paddingRight:'2px'
            }}
          />
        </div>
        <div className="postbutton">
          <button onClick={handleCreateClick}>Create Ad</button>
          {showAlert && (
            <Alert
              message="Please login to create an advertisement."
              onClose={handleAlertClose}
            />
          )}
        </div>
      </div>
      <div className="postsection">
        {shopposts.map((shoppost) => (
          <Link
            key={shoppost._id} // Key should be placed on the outermost JSX element inside map
            style={{ textDecoration: "none" }}
            to={`/productdescription/${shoppost._id}`}
          >
            <Shopcard shoppost={shoppost} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Shopping;

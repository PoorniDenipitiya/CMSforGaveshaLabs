import React, { useState, useEffect } from "react";

export const Shopcard = ({ shoppost }) => {
  const [author, setAuthor] = useState(null);

  const fetchUserData = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/details/${userId}`
      );
      if (!response.ok) {
        throw new Error("network response was not ok");
      }
      const userData = await response.json();
      return userData;
    } catch (error) {
      console.error("error fetching user data", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const userData = await fetchUserData(shoppost.postedBy);
        setAuthor(userData);
        console.log(userData);
      } catch (error) {
        console.error("error fetching author", error);
      }
    };
    fetchAuthor();
  }, [shoppost.postedBy]);

  // Check if shoppost is defined and contains the _id property
  if (!shoppost || !shoppost._id) {
    return null; // Or render a placeholder or loading indicator
  }

  return (
    <div className="shoppingcard" key={shoppost._id}> 
      <img src={shoppost.imageUrl} alt="" />
      <div className="shopcardtext">
        <div className="shopcardtitle">{shoppost.name}</div>
        <div className="shopcardprice">{shoppost.price}</div>
        <div className="shopprofile">
          {author&&(
            <div className="shopprofilepic">
              <img src={author.profilePicture} alt={author.username} className="authorProfilePicture"/>
            </div>

          )}
        </div>
      </div>
    </div>
  );
};

export default Shopcard;

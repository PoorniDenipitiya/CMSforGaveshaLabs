import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; //useParams hook for accessing route parameters.

export const Productdescription = () => {
  const [shoppost, setShoppost] = useState(null); //initializes a state variable shoppost.this hold the data get from form
  const { id } = useParams();

  useEffect(() => {
    fetch(`http://localhost:5000/getpost/${id}`, {
      // Using template literal to include the ID in the URL. this is fetch using relevant id
      method: "GET",
    })
      .then((res) => res.json()) 
      .then((data) => {
        console.log(data, "shoppost");
        setShoppost(data); // show the data
      })
      .catch((error) => {
        console.error("Error fetching shoppost:", error);
      });
  }, [id]); // depend on 'id' so that the effect re-runs when 'id' changes
  // useEffect(() => {
  //   // Reinitialize Google Translate after data is fetched and rendered
  //   if (window.googleTranslateElementInit) {
  //     try {
  //       window.googleTranslateElementInit();
  //     } catch (error) {
  //       console.error('Error reinitializing Google Translate:', error);
  //     }
  //   }
  // }, []);


  return (
    <div className="pdescrip">
      {shoppost ? ( 
        <tbody>
          <tr className="descup">
            <td className="descphoto">
              <img src={shoppost.imageUrl} alt="" />
            </td>
            <td className="desctext">
              <tr className="desccomname">{shoppost.name}</tr>

              <tr className="desccomprice">{shoppost.price}</tr>
            </td>
          </tr>
          <hr style={{ color: "black", marginBottom: "5px" }} />
          <div className="descdown">
            <tr
              className="desccomdesc"
              style={{ fontSize: "18px", textAlign: "justify" }}
            >
              <td>{shoppost.description}</td>
            </tr>
            <hr
              style={{
                color: "black",
                marginBottom: "10px",
                marginTop: "10px",
              }}
            />
            <tr
              className="descconcontact"
              style={{ fontSize: "22px", color: "purple" }}
            >
              <td> Contact for more information&nbsp; {shoppost.contact}</td>
            </tr>
          </div>
        </tbody>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Productdescription;

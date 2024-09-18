
import React, { createContext, useEffect, useState, useContext } from "react";


const DEFAULT_PROFILE_PICTURE_URL = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBhARBxAREBUVFRUTFRASDRIPERUTFRUWFyAWExMYHSggJBolHRMYITEhJSkuMjAuFx83ODMtOigtLisBCgoKDQ0NDg8QDisZFRkrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrK//AABEIAOEA4QMBIgACEQEDEQH/xAAbAAEBAQEBAQEBAAAAAAAAAAAABgQFAgMBB//EADMQAQABAgEJBgUEAwAAAAAAAAABAgQDBREUITFBUVOREiJhcaHRFSMygZITUsHwQrHh/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAH/xAAWEQEBAQAAAAAAAAAAAAAAAAAAEQH/2gAMAwEAAhEDEQA/AP60AqAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM93d4VrR8yde6mNsg0PyZiNqfuMp3GNPdnsRwp2/edrHVVNU96ZnznOQqsiYnZrfqSiZjY1W+ULnBn6u1HCrX67VhVGMllfYV1GaO7V+2Z/1LWgAAAAAAAAAAAAAAAAAAAAAA+F7c02uBNU652RHGU3i4leNiTViTnmWvK+POLdzEbKdX33/wB8GFUAAAAftNU0VRNM5pjXEwosm3cXWD3vqjb7pxpsMebe6pndsnykFKAigAAAAAAAAAAAAAAAAABG0I2gk66prrmZ3zM9Xl6qpmiqYndMx0eVQAAAAABVW9Xbt6JnfTTPWH0fO3p7FvRE7qaY9H0RQAAAAAAAAAAAAAAAAAAAE9lfB/SvJmNlWuP5/vixKW+tYusDNvjXE+PsnMSirDrmK4zTG2FR5AAAAaLHB0i6pp3Z88+UPhETM6lBkyz0XCz1/VO3wjgDaAigAAAAAAAAAAAAAAAAAAADNeWWHd097VO6qNv38GkBOXGT7nAnXT2o406/TayK55roor+uInziJWkSbRgWVxj/AEUzm/dOqFHTh4dE92mI8qYh7KkY7HJ+Ha6571XHNqjyhsBFAAAAAAAAAAAAAAAAAAAYco38W0dnD11ekefsDTj3GFb058aqI8N8+UOdjZZpifk0Z/Gqc3pDlYmJXiV58SZmeMvCxHRnLFxuinpPufF7nhR+M+7nAOj8XueFH4z7nxe54UfjPu5wDo/F7nhR+M+58XueFH4z7ucA6Pxe54UfjPufGLnhR0n3c4B18LLWv51H3pn+JdG3usG5j5U/bZV0S79pqmmrPTOaeMapIVWjmZNyl+tMUXG3dVx8J8XTRQAAAAAAAAAAAAAHwvbiLa3mrfsiPFNVVVV1TNU55nXMuhlzF7VxFMf4x6z/AMzOauJoAAAAAAAAAAAD9UOTLrSbfv8A1U6p8eEp1syTi/pXscKu712eoYogEUAAAAAAAAAAABNZRmar7Ez8c3TV/DOpqrS3rqmaqKZmd+Z+aFa8unotSJoUuhWvLp6GhWvLp6FImhS6Fa8unoaFa8unoUiaFLoVry6ehoVry6ehSJoUuhWvLp6GhWvLp6FImhS6Fa8unoaFa8unoUiaFLoVry6ehoVry6ehSJp6wp7OLTMbpiekqPQrXl09DQrXl09CkaAEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB//9k=";

export const UserContext = createContext(null);

export const useUsers = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUsers must be used within a UserContextProvider");
  }
  return context;
};

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login/success",
        {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
          },
        }
      );

      if (response.status === 200) {
        const resObject = await response.json();
        setUser(resObject.user);
      } else {
        const token = localStorage.getItem("token");
        const res = await fetch(
          "http://localhost:5000/api/auth/login/profile",
          {
            method: "GET",
            credentials: "include",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "Access-Control-Allow-Credentials": true,
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("user in context",res);
        if (res.status === 200) {
          const resObject2 = await res.json();
          setUser(resObject2.user);
        }
      }
    } catch (err) {
      console.error("Error fetching authentication status:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []); // Fetch authentication status on component mount

  // Apply default profile picture if user doesn't have one
  useEffect(() => {
    if (user && !user.profilePicture) {
      setUser({ ...user, profilePicture: DEFAULT_PROFILE_PICTURE_URL });
    }
  }, [user]);

  const value = {
    user,
    fetchUsers,
  };

  // Return the user context provider
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export default UserContext;

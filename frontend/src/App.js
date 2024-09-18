import "./App.css";
import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { UserContextProvider } from "./Context/UserContext";

import ErrorBoundary from './ErrorBoundary';

import { Home } from "./Pages/Home/Home";
import SignUp from "./Pages/LogIn/SignUp";
import Login from "./Pages/LogIn/LogIn";
import ForgotPassword from "./Pages/LogIn/ForgotPassword";
import ResetPassword from './Pages/LogIn/ResetPassword';

import Loader from "./Component/Loader/Loader";
import {SearchResults} from './Component/Search/SearchResults';
import {BlogSearch} from './Pages/Blogs/BlogSearch';
import {ResoSearch} from './Pages/Resources/ResoSearch';
import {ProjectSearch} from './Pages/Project/ProjectSearch';
import {Shopsearch} from './Pages/Shopping/Shopsearch';
import { QuestionSearch } from "./Pages/Forum/QuestionSearch";

import {Resources} from './Pages/Resources/Resources';
import {Sensors} from './Pages/Resources/Sensors/Sensors';
import {Pcb} from './Pages/Resources/Sensors/pcb';
import {Communi} from './Pages/Resources/Sensors/communi';
import {DataSheet} from './Pages/Resources/Sensors/datasheets/dataSheet';
import {DataSheetWrite} from './Pages/Resources/Sensors/datasheets/DataSheetWrite';
import {IotPlat} from './Pages/Resources/Sensors/IotPlat';
import {IotProto} from './Pages/Resources/Sensors/IotProto';
import {Micro} from './Pages/Resources/Sensors/micro';
import {Others} from './Pages/Resources/Sensors/others';
import {Writepost} from './Pages/Resources/Writepost';
import {ResoPostdetails} from './Pages/Resources/ResoPostdetails';
import {ResoEditpost} from './Pages/Resources/ResoEditpost';

import Project from "./Pages/Project/Project";
import { ProjectForm } from "./Pages/Project/ProjectForm";
import { ProjectCard } from "./Pages/Project/ProjectCard";
import { ProjectSeeMore } from "./Pages/Project/ProjectSeeMore";
import { ProjectPgNavi } from "./Pages/Project/ProjectPgNavi";
import ProjectViewAll from "./Pages/Project/ProjectViewAll";

import { Blogs } from "./Pages/Blogs/Blogs";
import { WriteBlog } from "./Pages/Blogs/WriteBlog";
import { InsidePost } from "./Pages/Blogs/InsidePost";
import { UpdateBlog } from "./Pages/Blogs/UpdateBlog";
import AuthorPage from "./Pages/Blogs/AuthorPage";

import { Shopping } from "./Pages/Shopping/Shopping";
import { Shoppingpost } from "./Pages/Shopping/Shoppingpost";
import { Productdescription } from "./Pages/Shopping/Productdescription";

import { Forum } from "./Pages/Forum/Forum";
import QuestionForm from "./Pages/Forum/QuestionForm";
import ViewQuestion from "./Pages/Forum/ViewQuestion";

import MySaves from "./Pages/Profile/MySaves";
import MyCollections from "./Pages/Profile/MyCollections";
import MyQuestions from "./Pages/Profile/MyQuestions";
import EditProfile from "./Pages/Profile/EditProfile";

import  Admin  from "./Pages/Admin/Admin";
import BlogsAdmin from "./Pages/Admin/BlogsAdmin";
import ProjectsAdmin from "./Pages/Admin/ProjectsAdmin";
import ProAdmin from './Pages/Admin/ProAdmin';
import ResourcesAdmin from "./Pages/Admin/ResourcesAdmin";
import ShoppingAdmin from "./Pages/Admin/ShoppingAdmin";
import UsersAdmin from "./Pages/Admin/UsersAdmin";
import PerformanceAdmin from "./Pages/Admin/PerformanceAdmin";
import ViewProjectAdmin from "./Pages/Admin/ViewProjectAdmin";
import PostCounts from "./Pages/Admin/PostCounts";
import AdStatsChart from './Pages/Admin/AdStatsChart';
import AdminNavi from './Pages/Admin/AdminNavi';
import ViewResourceAdmin from "./Pages/Admin/ViewResourceAdmin";
import ResoAdmin from './Pages/Admin/ResoAdmin';
import ViewBlogsAdmin from './Pages/Admin/ViewBlogsAdmin';

import MainLayout from "./Layouts/MainLayout";
import AdminLayout from "./Layouts/AdminLayout";


import "animate.css/animate.min.css";

import AOS from "aos";
import "aos/dist/aos.css";




const AppWithLoader = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1000); // Adjust the timeout as needed
    return () => clearTimeout(timer);
  }, [location]);

  useEffect(() => {
    AOS.init({
      duration: 1200, // Animation duration
      once: false, // Whether animation should happen only once
      mirror: true, // Whether elements should animate out while scrolling past them
    });
  }, []);

  return (

    <div>
      {loading && <Loader />}
      {!loading && (
        <>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/home" element={<Home />} />
              <Route path="/search" element={<SearchResults />} />
           <Route path="/blogsearch" element={<BlogSearch/>} />
           <Route path="/resosearch" element={<ResoSearch/>} />
           <Route path="/projectsearch" element={<ProjectSearch/>} />
<Route path="/shopsearch" element={<Shopsearch/>}/>
<Route path="/questionsearch" element={<QuestionSearch/>}/>


              <Route path='/resources'element={<Resources/>}/>
            <Route path='/sensors' element={<Sensors/>}/>
            <Route path='/pcb' element={<Pcb/>}/>
            <Route path='/communi' element={<Communi/>}/>
            <Route path='/dataSheet' element={<DataSheet/>}/>
            <Route path='/DataSheetWrite' element={<DataSheetWrite/>}/>
            <Route path='/IotPlat' element={<IotPlat/>}/>
            <Route path='/IotProto' element={<IotProto/>}/>
            <Route path='/micro' element={<Micro/>}/>
            <Route path='/others' element={<Others/>}/>
              <Route path='/writepost' element={<Writepost/>}/>
              <Route path='/resopostdetails/:id' element={<ResoPostdetails/>}/>
              <Route path='/resoeditpost/:id' element={<ResoEditpost/>}/>
             
              <Route path="/projectseemore" element={<ProjectSeeMore />} />
              <Route path="/projectcard" element={<ProjectCard />} />
              <Route path="/projectform" element={<ProjectForm />} />
              <Route path="/project" element={<Project />} />
              <Route path="/projectpgnavi" element={<ProjectPgNavi />} />
              <Route path="/projectseemore/:id" element={<ProjectSeeMore />} />
              <Route path="/projectviewall" element={<ProjectViewAll />} />


              <Route path="/blogs" element={<Blogs />} />
              <Route path="/WriteBlog" element={<WriteBlog />} />
              <Route path="/insidePost/:id" element={<InsidePost />} />
              <Route path="/authorpage/:id" element={<AuthorPage />} />
              <Route path="/UpdateBlog/:id" element={<UpdateBlog />} />


              <Route path="/shopping" element={<Shopping />} />
              <Route path="/shoppingpost" element={<Shoppingpost />} />
              <Route
                path="/productdescription/:id"
                element={<Productdescription />}
              />


              <Route path="/forum" element={<Forum />} />
              <Route path="/questionform" element={<QuestionForm />} />
              <Route path="/viewquestion/:id" element={<ViewQuestion />} />


             


              <Route path="/MySaves" element={<MySaves />} />
              <Route path="/MyCollections" element={<MyCollections />} />
              <Route path="/MyQuestions" element={<MyQuestions />} />
              <Route path="/EditProfile" element={<EditProfile />} />
             

              <Route path="/" element={<Navigate to="/home" />} />
            </Route>

            <Route element={<AdminLayout />}>
              <Route path="/Admin" element={<Admin />} />
              <Route
                path="/projectsadmin/:status"
                element={<ProjectsAdmin />}
              />
              <Route path="/projectsresources" element={<ResourcesAdmin />} />
              <Route path="/blogsadmin" element={<BlogsAdmin />} />
              <Route path="/shoppingsadmin" element={<ShoppingAdmin />} />
              <Route path="/usersadmin" element={<UsersAdmin />} />
              <Route path="/performanceadmin" element={<PerformanceAdmin />} />
              <Route path="/resourcesadmin/:status" element={<ResourcesAdmin />} />
              <Route
                path="/viewprojectadmin/:id"
                element={<ViewProjectAdmin />}
              />
              <Route path='/adminnavi' element={<AdminNavi />} />
              <Route
                path="/viewresourceadmin/:id"
                element={<ViewResourceAdmin />}
              />
              <Route
                path="/viewblogsadmin/:id"
                element={<ViewBlogsAdmin />}
              />
              <Route path="/resoadmin" element={<ResoAdmin />} />

              <Route path="/postcounts" element={<PostCounts />} />
              <Route path="/proadmin" element={<ProAdmin />} />
              <Route path='/adstatschart' element={<AdStatsChart />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
              <Route path="/ForgotPassword" element={<ForgotPassword />} />
              <Route path='/ResetPassword/:token' element={<ResetPassword />} />
            </Route>
          </Routes>
        </>
      )}
    </div>
  );
};

const App = () => (
  <BrowserRouter>
    <UserContextProvider>
      <ErrorBoundary>
        <AppWithLoader />
      </ErrorBoundary>
    </UserContextProvider>
  </BrowserRouter>
);

export default App;

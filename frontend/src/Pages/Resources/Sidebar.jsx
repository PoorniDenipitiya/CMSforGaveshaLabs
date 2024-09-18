import React from 'react'
import { Link } from 'react-router-dom';
import './Sidebar.css'

export const Sidebar = () => {
  return (
    <div className='sidebar'>
          <table className='restable'>
          <thead>
            <tr>
              <td >All Categories</td>
            </tr>
          </thead>
          <tbody>
           <tr>
              <Link to='/MotionSen' className="nav"><td>Motion Sensors</td></Link>
            </tr>
           <tr>
              <Link to='/MotionSen' className="nav"><td>Temperature Sensors</td></Link>
            </tr>
            <tr>
              <Link to='/MotionSen' className="nav"><td>Light Sensors</td></Link>
            </tr>
            <tr>
            <Link to='/MotionSen' className="nav"><td>Proximity Sensors</td></Link>
            </tr>
            <tr>
            <Link to='/MotionSen' className="nav"><td>Gas Sensors</td></Link>
            </tr>
            <tr>
            <Link to='/MotionSen' className="nav"><td>Sound Sensors</td></Link>
            </tr>
            <tr>
            <Link to='/MotionSen' className="nav"><td>Image Sensors/Cameras</td></Link>
            </tr>
            <tr>
            <Link to='/MotionSen' className="nav"><td>Environmental Sensors</td></Link>
            </tr>
          </tbody>
        </table>
        </div>
  )
}

export default Sidebar;
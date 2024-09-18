// ErrorBoundary.js
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Error from './Assets/Error.png';
import './ErrorBoundary.css';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error Boundary Caught an error", error, errorInfo);
    // You can also log the error to an error reporting service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className='MainErrorDiv'>
            <div className='subErrorDiv'>
                <img src={Error}/>
            </div>
            <div className='subErrorDiv'>
            <h1>Something went wrong.</h1>
            <p>We are sorry for the inconvenience. Please try refreshing the page or go back to the <Link to="/home">homepage</Link>.</p>
            </div>
          
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
//TODO: Export the Footer
import React from "react";
import fire from './firebase.png'

const Footer = () => {
  return (
    <footer className="bg-info text-center pt-3 pb-2 mt-5 sticky-bottom text-white">
    Contact App Using <img src={fire} style={{height:"40" + "px"}}/> Realtime Database
    </footer>
  );
};

export default Footer
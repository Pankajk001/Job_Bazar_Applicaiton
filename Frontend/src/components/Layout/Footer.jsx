import React, { useContext } from "react";
import { Context } from "../../main";
import { Link } from "react-router-dom";
import { FaFacebookF, FaYoutube, FaLinkedin } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";

const Footer = () => {
  const { isAuthorized } = useContext(Context);
  return (
    <footer className={isAuthorized ? "footerShow" : "footerHide"}>
      <div>&copy; All Rights Reserved By Pankaj and Team.</div>
      <div>
        <Link to={"https://www.facebook.com/home.php"} target="_blank">
          <FaFacebookF />
        </Link>
        <Link to={"https://www.youtube.com/"} target="_blank">
          <FaYoutube />
        </Link>
        <Link to={"https://www.linkedin.com/in/pankaj-kumar-2b8b9022a/"} target="_blank">
          <FaLinkedin />
        </Link>
        <Link to={"https://www.instagram.com/"} target="_blank">
          <RiInstagramFill />
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
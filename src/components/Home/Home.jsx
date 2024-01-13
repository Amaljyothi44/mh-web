import React, { useState } from "react";
import "../Home/Home.css";
import { animated, useSpring } from "@react-spring/web";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import UserDetails from "../UserDetails/UserDetails";
import { useEffect } from "react";
import Loading from "../Loading/Loading";
import ClipLoader from "react-spinners/ClipLoader";

const MobileMenu = ({ menu, setMenu }) => {
  const MenuFade = useSpring({
    from: {
      opacity: 0,
      position: "fixed",
    },
    to: {
      opacity: 1,
      right: "0",
      zIndex: 99,
    },
  });

  const MenuStyles = useSpring({
    from: { opacity: 0, position: "fixed", left: "-75%", top: "0" },
    to: {
      opacity: 1,
      left: "0",
    },
  });

  return (
    <>
      <animated.div style={MenuStyles} className="mobile_menu">
        <div className="container">
          <div className="mobile_navbar">
            <div>
              <div className="mobile_menu_icons">
                <i
                  onClick={() => {
                    setMenu((prev) => !prev);
                  }}
                  className="bi bi-x icon"
                ></i>
                <p>Men's Hostel</p>
              </div>
              <div className="button m-3">
                <ButtonGrid />
              </div>
            </div>

            <div className="mb-5">
              <Footer />
            </div>
          </div>
        </div>
      </animated.div>

      <animated.div
        style={MenuFade}
        onClick={() => setMenu(!menu)}
        className="mobile_menu_dim"
      ></animated.div>
    </>
  );
};

const ButtonGrid = () => {
  const { user, setUser } = useContext(AuthContext);
  return (
    <>
      <MessButton title="Home" href="/" />
      {!user && (
        <>
          <MessButton title="Mess Login" href={"/login"} />
          <MessButton title="Admin Login" href="/admin-login" />
        </>
      )}
      {user && <MessButton title="Dashboard" href="/dashboard" />}
      <MessButton title="Rules" href="/rules" />
      <MessButton title="Notifications" href="/notification" />

      <MessButton title="Mess Bill" href="/messfee" />

    </>
  );
};

export const MessButton = ({ title, href, type, action, loading }) => {
  if (type === "submit") {
    return (
      <button
        onClick={action}
        className={`mess_button ${loading && "mess_button_active"}`}
      >
        {loading ? (
          <ClipLoader size={20} color="#fff" className="mt-2" />
        ) : (
          <>
            <p>{title}</p>
            <i className="bi bi-arrow-up-right"></i>
          </>
        )}
      </button>
    );
  }
  return (
    <Link to={href}>
      <div className="mess_button">
        <p>{title}</p>
        <i className="bi bi-arrow-up-right"></i>
      </div>
    </Link>
  );
};

export const Footer = () => {
  return (
    <>
      <p className="footer">
        Made with love by,
        <span>
          <b>Studio</b>One
        </span>
      </p>
    </>
  );
};

export const PageRoute = ({ title }) => {
  return (
    <Link style={{ textDecoration: "none" }} to="/">
      <p className="page_routes">{title}</p>
    </Link>
  );
};

export const DesktopNavbar = () => {
  return (
    <>
      <div className="col-lg-3 col-md-4 d-none d-md-block">
        <div className="container left_section pt-4 pb-4">
          <div>
            <h1>Government Engineering College, Sreekrishnapuram, Palakkad</h1>
            <p>Men's Hostel</p>
            <div className="line_section">
              <div className="line"></div>
            </div>
            <ButtonGrid />
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
};

export const MobileNavbar = () => {
  const [menu, setMenu] = useState(false);
  return (
    <div className="navbar_section">
      <div className="container navbar d-lg-none d-md-none">
        <i
          onClick={() => {
            setMenu(!menu);
          }}
          className="bi bi-list menu_icon"
        ></i>
        <div className="mobile_heading">
          <h1>Government Engineering College, Sreekrishnapuram, Palakkad</h1>
          <p>Men's Hostel</p>
        </div>
      </div>
      {menu ? <MobileMenu menu={menu} setMenu={setMenu} /> : null}
    </div>
  );
};

const Home = () => {
  
  const {user} = useContext(AuthContext)
  return (
    <>
      <div className="home">
        <div className="row">
          <DesktopNavbar />
          <div className="col-lg-9 col-md-8">
            <MobileNavbar />
            <div className="container pt-4 pb-4 right_section">
              <div className="routes">
                {user ? <UserDetails /> : null}
                <PageRoute title={"Men's Hostel"} />
              </div>
              <div className="">
                <div className="col-lg-12 body mt-5">
                  <h3 className="">Location</h3>
                  <p
                    style={{
                      lineHeight: "2",
                    }}
                    className="mt-3"
                  >
                    Govt.Engineering College Palakkad, Sreekrishnapuram <br />
                    Mannampatta PO, Palakkad, Kerala 678633
                  </p>
                  <h3 className="mt-5">Contact</h3>
                  <p className="mt-4">
                    Amaljyothi :
                    <a
                      className="text-decoration-none text-black"
                      href="tel:8848508084"
                    >
                      &nbsp;+91 8848508084 (Hostel secretary)
                    </a>
                  </p>
                  <p>
                    Stepin :
                    <a
                      className="text-decoration-none text-black"
                      href="tel:9188136839"
                    >
                      &nbsp;+91 9188136839 (Mess secretary)
                    </a>
                  </p>
                  <p>
                    Email :
                    <a
                      className="text-decoration-none text-black"
                      href="mailto:mh@gecskp.ac.in"
                    >
                      &nbsp;mh@gecskp.ac.in
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const Layout = ({ children, pageRoute, isHome }) => {
  const { user, setUser } = useContext(AuthContext);

  // useEffect(() => {
  //   setUser(JSON.parse(localStorage.getItem("user")));
  // }, []);

  return (
    <div className="home">
      {isHome && (
        <div className="background_img">
          <div className="background_img_grdient"></div>
        </div>
      )}
      <div className="row">
        <DesktopNavbar />
        <div className="col-lg-9 col-md-8">
          <MobileNavbar />
          <div className="container pt-4 pb-4 right_section">
            <div className="routes">
              {user ? <UserDetails /> : null}
              <PageRoute title={pageRoute} />
            </div>
            <div className="row details_section">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

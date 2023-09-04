// ProfileButton.js
import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import "./ProfileButton.css";
import { NavLink } from "react-router-dom";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const [initialHover, setInitialHover] = useState(false);

  const openMenu = () => {
    setShowMenu(true);
  };

  const closeMenu = () => {
    setShowMenu(false);
  };

  useEffect(() => {
    if (showMenu) {
      document.addEventListener('click', closeMenu);
    } else {
      document.removeEventListener('click', closeMenu);
    }

    return () => document.removeEventListener('click', closeMenu);
  }, [showMenu]);

  const toggleMenu = () => {
    if (!showMenu) {
      openMenu();
    } else {
      closeMenu();
    }
  };

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
  };

  const ulClassName = `profile-dropdown ${showMenu || initialHover ? 'active' : ''}`;

  useEffect(() => {
    // Initialize the dropdown as open when the component mounts
    setShowMenu(true);
  }, []);

  return (
    <div className="profile-button" onMouseEnter={() => setInitialHover(true)} onClick={toggleMenu}>
      <button className="profile-button-icon">
        <i className="fas fa-user-circle" />
      </button>
      <div className={ulClassName} ref={ulRef}>
        {showMenu && (
          <ul className="profile-dropdown-list">
            <li className="profile-dropdown-item">{user.username}</li>
            <li className="profile-dropdown-item">{user.firstName} {user.lastName}</li>
            <li className="profile-dropdown-item">{user.email}</li>
            <li className="profile-dropdown-item">
            <NavLink to={`/user-spots/${user.id}`}>
                Manage spots
              </NavLink>
            </li>
            <li>
              <button className="logout-btn" onClick={logout}>Log Out</button>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}

export default ProfileButton;

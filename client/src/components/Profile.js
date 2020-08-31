import React, { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";

import { GiSunflower } from "react-icons/gi";
import { IoIosRose } from "react-icons/io";
import { FiUser } from "react-icons/fi";
import { COLORS } from "../constants";
import { CurrentUserContext } from "./CurrentUserContext";
import { CircularProgress } from "@material-ui/core";

const Profile = () => {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const [userProfile, setUserProfile] = useState(null);
  const [status, setStatus] = useState("loading");
  const [guestProfile, setGuestProfile] = useState(false);
  const { profileId } = useParams();
  const history = useHistory();

  const getProfile = (allUsers) => {
    allUsers.forEach((user) => {
      if (profileId === user.username) {
        setUserProfile(user);
        setStatus("idle");
      }
    });
  };

  useEffect(() => {
    if (profileId.slice(0, 5) === "guest") {
      setGuestProfile(true);
      setStatus("idle");
    } else {
      fetch("/account/login", {})
        .then((res) => res.json())
        .then((users) => getProfile(users.data));
    }
  }, [profileId]);

  const logout = (event) => {
    event.preventDefault();
    setCurrentUser(null);
    history.push("/");
  };

  return (
    <ProfilePageWrapper>
      <ProfilePageTitle>User Profile</ProfilePageTitle>
      {status === "idle" ? (
        <>
          {currentUser &&
            guestProfile &&
            profileId !== currentUser.username && (
              <GuestProfileText>
                Sorry, you cannot view a guest profile.
              </GuestProfileText>
            )}
          {currentUser && profileId === currentUser.username && (
            <>
              <ProfilePageElement className="user">
                <StyledUserIcon />
                <Username>{currentUser.username}</Username>
              </ProfilePageElement>
              <ProfilePageElement className="rose">
                <StyledRose />
                <NumRoses>{currentUser.roses}</NumRoses>
              </ProfilePageElement>
              <BuyRoseButton>Buy a Rose (Cost: 1000 Sunflowers)</BuyRoseButton>
              <ProfilePageElement className="sunflower">
                <StyledSunflower />
                <NumSunflowers>{currentUser.sunflowers}</NumSunflowers>
              </ProfilePageElement>
              <BuySunflowerButton>
                Buy 1000 Sunflowers (Cost: 1 Rose)
              </BuySunflowerButton>
            </>
          )}
          {((currentUser &&
            !guestProfile &&
            profileId !== currentUser.username) ||
            (!currentUser && !guestProfile)) && (
            <>
              <ProfilePageElement className="user">
                <StyledUserIcon />
                <Username>{userProfile.username}</Username>
              </ProfilePageElement>
              <ProfilePageElement className="rose">
                <StyledRose />
                <NumRoses>{userProfile.roses}</NumRoses>
              </ProfilePageElement>
              <ProfilePageElement className="sunflower">
                <StyledSunflower />
                <NumSunflowers>{userProfile.sunflowers}</NumSunflowers>
              </ProfilePageElement>
            </>
          )}

          {currentUser && profileId === currentUser.username && (
            <ProfilePageElement>
              <LogoutButton onClick={logout}>Log out</LogoutButton>
            </ProfilePageElement>
          )}
        </>
      ) : (
        <CircularProgress color="secondary" />
      )}
    </ProfilePageWrapper>
  );
};

const ProfilePageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ProfilePageTitle = styled.h1`
  color: Brown;
  margin-bottom: 2vh;
`;

const GuestProfileText = styled.p`
  color: ${COLORS.secondary};
  font-weight: bold;
`;

const ProfilePageElement = styled.div`
  display: flex;
  align-items: center;
  margin: 2vh 0;
  font-size: 1.8rem;
  &.user {
    color: ${COLORS.primary};
  }
  &.rose {
    color: red;
  }
  &.sunflower {
    color: ${COLORS.orange};
  }
`;

const StyledUserIcon = styled(FiUser)`
  font-size: 2.5rem;
  margin-right: 1vw;
`;

const Username = styled.div``;

const StyledRose = styled(IoIosRose)`
  font-size: 2.5rem;
  margin-right: 1vw;
`;
const NumRoses = styled.div``;

const BuyRoseButton = styled.button`
  background-color: ${COLORS.red};
  color: white;
`;

const StyledSunflower = styled(GiSunflower)`
  font-size: 2.5rem;
  margin-right: 1vw;
`;
const NumSunflowers = styled.div``;

const BuySunflowerButton = styled.button`
  background-color: ${COLORS.orange};
  color: white;
`;

const LogoutButton = styled.button`
  margin-top: 4vh;
  background-color: ${COLORS.blue};
  color: white;
`;

export default Profile;

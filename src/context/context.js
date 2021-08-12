import React, { useState, useEffect } from "react";
import mockUser from "./mockData.js/mockUser";
import mockRepos from "./mockData.js/mockRepos";
import mockFollowers from "./mockData.js/mockFollowers";
import axios from "axios";
import { User } from "../components";

const rootUrl = "https://api.github.com";

const GithubContext = React.createContext();

const GithubProvider = ({ children }) => {
  const [githubUser, setGithubUser] = useState(mockUser);
  const [repos, setRepos] = useState(mockRepos);
  const [followers, setFollowers] = useState(mockFollowers);

  /// requests and loading
  const [requests, setRequests] = useState("Loading..");
  const [isloading, setisLoading] = useState(false);

  const searchGithubUser = async (user) => {
    toggleError();
    setisLoading("true");
    const response = await axios(`${rootUrl}/users/${user}`).catch((err) =>
      console.log(err)
    );
    console.log(response);
    if (response) {
        setGithubUser(response.data);
        const { login, followers_url } = response.data
        await Promise.allSettled([
        axios(`${rootUrl}/users/${login}/repos?per_page=100`),
        axios(`${followers_url}?per_page=100`),
      ])
        .then((results) => {
          const [repos, followers] = results;
          const status = "fulfilled";
          if (repos.status === "fulfilled") {
            setRepos(repos.value.data);
          }
          if (followers.status === "fulfilled") {
            setFollowers(followers.value.data);
          }
        })
        .catch((err) => console.log(err));
    } else {
      toggleError(true, "invalid usernmae");
    }

    checkRequests();
    setisLoading();
  };

  // check rate

  const checkRequests = () => {
    axios(`${rootUrl}/rate_limit`)
      .then(({ data }) => {
        let {
          rate: { remaining },
        } = data;
        setRequests(remaining);
        if (remaining === 0) {
          toggleError(true, "sorry, you've exceeded hourly rate limit :( ");
        }
      })
      .catch((err) => console.log(err));
  };
  const toggleError = (show = false, msg = "") => {
    setError({ show, msg });
  };

  //errors
  const [error, setError] = useState({
    show: false,
    msg: "",
  });

  useEffect(checkRequests, []);

  return (
    <GithubContext.Provider
      value={{
        githubUser,
        repos,
        followers,
        requests,
        error,
        searchGithubUser,
        isloading,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export { GithubProvider, GithubContext };

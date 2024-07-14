import './App.css';
import { useEffect, useState } from 'react';

const CLIENT_ID = "Ov23liqjm1vU7RSIfN3J";

function App() {
  const [rerender, setRerender] = useState(false);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const codeParam = urlParams.get("code");
    console.log("Code param: ", codeParam);

    if (codeParam && (localStorage.getItem("accessToken") == null)) {
      async function getAccessToken() {
        try {
          const response = await fetch(`http://localhost:4000/getAccessToken?code=${codeParam}`, {
            method: "GET"
          });
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          console.log(data);
          if (data.access_token) {
            localStorage.setItem("accessToken", data.access_token);
            setRerender(!rerender);
          }
        } catch (error) {
          console.error("Failed to fetch access token: ", error);
        }
      }
      getAccessToken();
    }
  }, [rerender]);

  async function getUserData() {
    try {
      const response = await fetch("http://localhost:4000/getUserData", {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("accessToken")
        }
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(data);
      setUserData(data);
    } catch (error) {
      console.error("Failed to fetch user data: ", error);
    }
  }

  function loginWithGitHub() {
    window.location.assign("https://github.com/login/oauth/authorize?client_id=" + CLIENT_ID);
  }

  function logout() {
    localStorage.removeItem("accessToken");
    setRerender(!rerender);
  }

  return (
    <div className="App">
      <header className="App-header">
        {localStorage.getItem("accessToken") ? 
          <>
            <h1>We have an access token</h1>
            <button onClick={logout}>
              Log out
            </button>
            <h3>Get User Data from Github API</h3>
            <button onClick={getUserData}>Get Data</button>
            {Object.keys(userData).length !== 0 && (
              <>
                <h4>Hey there {userData.login}</h4>
                <img width="100px" height="100px" src={userData.avatar_url} alt="avatar"></img>
                <a href={userData.html_url} style={{"color":"white"}}>Link to your Github profile</a>
                <h4>{userData.company}</h4>
              </>
            )}
          </>
         : 
          <>
            <h3>User is not logged in</h3>
            <button onClick={loginWithGitHub}>
              Login with GitHub
            </button>
          </>
        }
      </header>
    </div>
  );
}

export default App;

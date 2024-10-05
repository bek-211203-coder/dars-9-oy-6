import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const usernameRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  function validate() {
    if (usernameRef.current.value.trim().length < 3) {
      alert("Usernamei qayta kiriting");
      usernameRef.current.focus();
      usernameRef.current.style.outline = "2px solid red";
      return false;
    } else {
      usernameRef.current.style.outline = "";
    }
    if (passwordRef.current.value.trim().length < 4) {
      alert("Parolni tekshirib qayta kiriting");
      passwordRef.current.focus();
      passwordRef.current.style.outline = "2px solid red";
      return false;
    } else {
      passwordRef.current.style.outline = "";
    }

    return true;
  }

  function handleLogin(event) {
    event.preventDefault();

    const isValid = validate();
    if (!isValid) {
      return;
    }

    const user = {
      username: usernameRef.current.value.trim(),

      password: passwordRef.current.value.trim(),
    };

    fetch("https://auth-rg69.onrender.com/api/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(` ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (
          data.message === "User Not found." ||
          data.message === "Invalid Password!"
        ) {
          alert(data.message);
        }
        if (data.id) {
          localStorage.setItem("token", data.accessToken);
          localStorage.setItem("user", JSON.stringify(data));
          navigate("/home");
        }
      })
      .catch((err) => {
        console.log(err);
        alert(`${err.message}`);
      });
  }

  return (
    <div>
      <form className="w-1/3 mt-60 flex flex-col mx-auto rounded-md gap-5 bg-green-200  p-5">
        <input
          className="border rounded-md p-3 w-full"
          ref={usernameRef}
          type="text"
          placeholder="Enter username"
        />

        <input
          className="border rounded-md p-3 w-full"
          ref={passwordRef}
          type="password"
          placeholder="Enter password"
        />
        <button
          className="border rounded-md p-3 bg-yellow-500 w-full text-white text-xl"
          onClick={handleLogin}
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;

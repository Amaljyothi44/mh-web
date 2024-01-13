import { useState } from "react";
import { MessButton, Layout } from "../components/Home/Home";
import "../components/Home/Home.css";
import { auth } from "../firebse/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { LoadingContext } from "../context/LoadingContext";
import isEmail from "validator/lib/isEmail";

const LoginPage = () => {
  return (
    <>
      <Layout pageRoute="Men's Hostel / Login">
        <div className="col-lg-12 body ">
          <h1 className="mb-5 text-black">Login</h1>
          <Form />
        </div>
      </Layout>
    </>
  );
};


export const Form = () => {
  const { loading, setLoading } = useContext(LoadingContext);
  const { user, setUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isEmail(email) || password.length < 5) {
      setError("Invalid Email or Password");
      return;
    }
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const UserDetails = userCredential.user;
        const email = UserDetails && UserDetails.email;
        const token = UserDetails && UserDetails.accessToken;
        const uid = UserDetails && UserDetails.uid;
        const name = UserDetails && UserDetails.displayName;
        localStorage.setItem(
          "user",
          JSON.stringify({ email, token, uid, name })
        );
        setUser(JSON.parse(localStorage.getItem("user")));
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setError("Invalid credentials");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <div className="row">
        <div className="col-lg-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value), setError("");
                }}
                type="email"
                className="form-control"
                id="email"
                aria-describedby="emailHelp"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                pattern=".{5,}"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value), setError("");
                }}
                type="password"
                className="form-control"
                id="password"
              />
            </div>
            {error && <p className="error">{error}</p>}
            <MessButton
              loading={loading}
              setLoading={setLoading}
              title="Submit"
              type="submit"
              action={handleSubmit}
            />
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;

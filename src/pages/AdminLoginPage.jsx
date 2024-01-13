import { useState, useContext } from "react";
import { Layout } from "../components/Home/Home";
import { MessButton } from "../components/Home/Home";
import { auth } from "../firebse/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { LoadingContext } from "../context/LoadingContext";
import { useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";

const AdminLoginPage = () => {
  return (
    <Layout pageRoute="Men's Hostel / Admin Login">
      <div className="col-lg-12 body ">
        <h1 className="mb-5 text-black">Admin Login</h1>
        <AdminLogin />
      </div>
    </Layout>
  );
};

const AdminLogin = () => {
  const { setUser } = useContext(AuthContext)
  const navigate = useNavigate()
  const { loading, setLoading } = useContext(LoadingContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    if (email === "menshostelgecskp@gmail.com") {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const UserDetails = userCredential.user;
          const email = UserDetails && UserDetails.email;
          const token = UserDetails && UserDetails.accessToken;
          const name = UserDetails && UserDetails.displayName;
          const user = { email, token,name }
          localStorage.setItem("user", JSON.stringify(user));
          setUser(user)
          navigate('/dashboard')
        })
        .catch((error) => {
          // const errorCode = error.code;
          // const errorMessage = error.message;
          setError("Invalid Credentials");
          // console.log(errorCode);
          // console.log(errorMessage);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setError("Invalid Credentials");
      setLoading(false)
    }
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
              <label htmlFor="email" className="form-label">
                Password
              </label>
              <input
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value), setError("");
                }}
                type="password"
                className="form-control"
                id="email"
                aria-describedby="emailHelp"
              />
            </div>
            {error && <p className="error">{error}</p>}
            <MessButton loading={loading} title="Submit" type="submit" action={handleSubmit} />
          </form>
        </div>
      </div>
    </>
  );
};

export default AdminLoginPage;

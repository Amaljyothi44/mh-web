import React, { useEffect, useState } from "react";
import { Layout } from "../../components/Home/Home";
import * as firebaseui from "firebaseui";
import { auth, db, storage } from "../../firebse/config";
import { EmailAuthProvider } from "firebase/auth";
import "firebaseui/dist/firebaseui.css";
import "../NewUserPage/NewUserPage.css";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import {
  collection,
  addDoc,
  Timestamp,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { ClipLoader } from "react-spinners";

const NewUserPage = () => {
  const [file, setFile] = useState("");
  const [heading, setHeading] = useState("");
  const [error, setError] = useState("");
  const [progresspercent, setProgresspercent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const ui =
      firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);
    ui.start(".auth-container", {
      signInOptions: [EmailAuthProvider.PROVIDER_ID],
      signInSuccessUrl: "/dashboard",
    });

    const files = query(
      collection(db, "Notifications"),
      orderBy("created", "desc")
    );
    onSnapshot(files, (QuerySnapshot) => {
      setFiles(
        QuerySnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });
  }, []);

  const types = ["application/pdf"];
  const setPdfFile = (e) => {
    let selectedFile = e.target.files[0];
    //console.log(selectedFile)
    if (selectedFile && types.includes(selectedFile.type)) {
      setFile(selectedFile);
      setError("");
    } else {
      setFile(null);
      setError("Please choose a pdf file");
    }
  };

  const handleSubmit = (e) => {
    file && setLoading(true);
    e.preventDefault();
    if (file && heading) {
      setError("");
      const storageRef = ref(storage, `Notifications/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(progress);
          setProgresspercent(progress);
        },
        (error) => {
          alert(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log(downloadURL);
            addDoc(collection(db, "Notifications"), {
              heading,
              pdfUrl: downloadURL,
              created: Timestamp.now(),
            }).then(() => {
              setLoading(false);
              setHeading('')
              setFile('')
            });
          });
        }
      );
    } else {
      setLoading(false);
      setError("All fields required");
    }
  };

  const handleDelete = async (id) => {
    const taskDocRef = doc(db, "Notifications", id);
    try {
      await deleteDoc(taskDocRef);
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div>
      <Layout>
        <div className="contaianer">
          <div className="row">
            <div className="col-lg-4 mt-4">
              <div className="auth-container"></div>
            </div>
            <div className="col-lg-4 mt-4">
              <div className="admin_data p-4">
                <input
                  onChange={(e) => setHeading(e.target.value)}
                  value={heading}
                  type="text"
                  placeholder="Notification heading"
                />
                <input
                  onChange={setPdfFile}
                  name="file"
                  type="file"
                  className="mt-3"
                />
                {error && <div className="error mt-2">{error}</div>}
                <button onClick={handleSubmit} className="btn btn-primary mt-3">
                  {loading ? <ClipLoader size={20} color="#fff" /> : "Submit"}
                </button>
              </div>
            </div>
            <div className="col-lg-4 mt-4">
              <div className="admin_data notifications p-4">
                <h2>Notifiations</h2>

                {files?.map((doc) => (
                  <div key={doc.id} className="notification p-2 mt-3">
                    <p>{doc.data.heading}</p>
                    <span></span>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="btn btn-primary"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default NewUserPage;

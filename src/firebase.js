
import { getApp, getApps, initializeApp } from "firebase/app";
import React,{useState,useEffect} from "react";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyCbn15UJcYvwObm0OryOyXWaqmXrslj4Ec",
  authDomain: "upload-documents-3f71b.firebaseapp.com",
  projectId: "upload-documents-3f71b",
  storageBucket: "upload-documents-3f71b.appspot.com",
  messagingSenderId: "931839699207",
  appId: "1:931839699207:web:42b9eb7b27b5e6ae78fda2",
  measurementId: "G-PWBCJMX6ZH"
};

const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);
const storage = getStorage(app);


export const GetUrlFromFireBase = ({ setUrl }) => {
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState("");
  const [uploadAlertModel, setuploadAlertModel] = useState(false);
  const handleChange = (e) => {
    const uploadfile = e.target.files[0];
    if (uploadfile) {
      setFile(uploadfile);
      setUrl("");
      const storageRef = ref(
        storage,
        `images/${uploadfile.name}`
      );
      const uploadTask = uploadBytesResumable(storageRef, uploadfile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        },
        (error) => {},
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setUrl(downloadURL);
            console.log("downloadURL", downloadURL);
            setuploadAlertModel(true);
            setTimeout(() => {
              setuploadAlertModel(false);
            }, 4000);
          });
        }
      );
    }
  };
  return (
    <> 
      <>
        <label
          style={{
            display: "grid",
            justifyContent: "center",
            margin: "1rem 0",
            fontSize: "1rem",
            cursor: "pointer",
            alignItems: "center",
            boxShadow:
              " box-shadow: 0 6px 16px -8px #00000014, 0 9px 28px #0000000d, 0 12px 48px 16px #00000008",
            paddingBottom: "3rem",
            paddingTop: "1rem",
            background: "white",
            position: "relative",
          }}
        >
           
          <input
            type="file"
            name="Upload-file"
            // accept={`${type === "image" ? "image/*" : "audio/*"}`}
            accept="image/*"
            className={"w-0 h-0"}
            onChange={handleChange}
          />
          <p
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "0",
              fontSize: "1rem",
            }}
          >
            {file.name}
          </p>
        </label>
      </>
    </>
  );
};
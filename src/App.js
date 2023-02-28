import { Input, Card, Button } from "antd";
import { v4 as uuidv4 } from "uuid";
import React, { useState, useEffect } from "react";
import "./App.scss";
import * as $ from "jquery";
import { GetUrlFromFireBase } from "./firebase";
import BWMlogo from "./Assests/bwm.jpeg";
import html2canvas from "html2canvas";
import { getApp, getApps, initializeApp } from "firebase/app";
// import React,{useState,useEffect} from "react";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import { textAlign } from "@mui/system";
const firebaseConfig = {
  apiKey: "AIzaSyCbn15UJcYvwObm0OryOyXWaqmXrslj4Ec",
  authDomain: "upload-documents-3f71b.firebaseapp.com",
  projectId: "upload-documents-3f71b",
  storageBucket: "upload-documents-3f71b.appspot.com",
  messagingSenderId: "931839699207",
  appId: "1:931839699207:web:42b9eb7b27b5e6ae78fda2",
  measurementId: "G-PWBCJMX6ZH",
};

const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);
const storage = getStorage(app);
const { TextArea } = Input;
const { Meta } = Card;
const colorArr = [
  "#a9acb6",
  "#e52b50",
  "#f19cbb",
  "#ab274f",
  "#d3212d",
  "#3b7a57",
  "#ffbf00",
  "#ff033e",
  "#87756e",
  "#9966cc",
];
const stateInitialData = {
  category: [
    {
      value: "Learn Angular",
      section: "static",
      id: uuidv4(),
      type: "input",
      height: "15",
      width: "15",
    },
    {
      value: "React",
      section: "static",
      id: uuidv4(),
      type: "image",
      height: "15",
      width: "15",
      url: BWMlogo,
    },
  ],
};
const rcInitialData = {
  static: [],
  container: [],
};
const AppDragDropDemo = () => {
  const [bg, setBg] = useState("red");
  const [url, setUrl] = useState("");
  const [state, setState] = useState(stateInitialData);
  const [rendingCategory, setrendingCategory] = useState(rcInitialData);
  const [cImage, setCImage] = useState("");
  useEffect(() => {
    if (url) {
      const newState = state.category.map((obj) => {
        if (obj.section == "static" && obj.type == "image") {
          return {
            ...obj,
            url,
          };
        }
        return obj;
      });
      setState({ category: newState });
    }
  }, [url]);
  useEffect(() => {
    let rendingCategory = {
      static: [],
      container: [],
    };
    state.category.forEach((t) => {
      console.log("tttttttttttttt",t)
      if (t.section == "static") {
        rendingCategory[t.section].push(
          <div
            key={t.id}
            onDragStart={(e) => onDragStart(e, t.id)}
            draggable
            className="draggable"
          >
            {t.type == "image" ? (
              <>
                {" "}
                <img className="imageUploaded" src={t.url} alt="img" />
              </>
            ) : (
              <TextArea defaultValue={t.value} />
            )}
          </div>
        );
      } else {
        rendingCategory[t.section].push(
          <div
            key={t.id}
            onDragStart={(e) => onDragStart(e, t.id)}
            draggable
            className="draggable"
            style={{
              height: t.height + "rem",
              width: t.width + "rem",
              left: t.left,
              top: t.top,
              position: "absolute",
            }}
          >
            {t.type == "image" ? (
              <>
                {" "}
                <img className="imageUploaded" src={t.url} alt="img" />
              </>
            ) : (
              <div
              contentEditable
                style={{
                  color: bg,
                  height: t.height + "rem",
                  width: t.width + "rem",
                  fontWeight: t.fontWeight,
                  lineHeight:"2.2rem",
                  fontSize:t.fontSize+ "rem",
                  // textAlign: "center",
                  // display: "flex",
                  // justifyContent: "center",
                  // alignItems: "center",
                }}
                
              > {t.value?t.value :""} </div>
            )}
          </div>
        );
      }
    });
    setrendingCategory(rendingCategory);
  }, [state, bg]);
  useEffect(() => {
    console.log("cImagecImage", cImage);
  }, [cImage]);
  const onDragStart = (ev, id) => {
    ev.dataTransfer.setData("id", id);
    ev.dataTransfer.setData(
      "application/json",
      JSON.stringify([
        ev.target.id,
        ev.offsetX || ev.clientX - $(ev.target).offset().left,
        ev.offsetY || ev.clientY - $(ev.target).offset().top,
      ])
    );
  };

  const onDragOver = (ev) => {
    ev.preventDefault();
  };

  const onDrop = (ev, cat) => {
    var data = JSON.parse(ev.dataTransfer.getData("application/json"));
    // ev.target.appendChild(document.getElementById(data[0]));
    //window.alert( ev.clientX + ',' + ev.clientY);

    let id = ev.dataTransfer.getData("id");
    let left =
      ev.clientX - data[1] > 0 ? ev.clientX - data[1] + "px" : 0 + "px";
    let top = ev.clientY - data[2] > 0 ? ev.clientY - data[2] + "px" : 0 + "px";
    console.log(left, top);

    let draggedTasks = { ...state.category.find((task) => task.id == id) };
    console.log("updatedTask",draggedTasks,cat)
    if (cat == "static" && draggedTasks.section == cat) return;
    if (cat == "static") {

      let updatedTask = state.category.filter((task) => task.id !== id);
      setState((prev) => ({ ...prev, category: updatedTask }));
      return;
    }

    if (draggedTasks.section == cat) {
      let updatedTask = state.category.map((task) => {
        if (task.id == id) {
          return {
            ...task,
            left,
            top,
          };
        }
        return task;
      });
      setState((prev) => ({ ...prev, category: updatedTask }));
    } else {
      draggedTasks.section = cat;
      draggedTasks.id = uuidv4();
      draggedTasks.left = left;
      draggedTasks.top = top;
      const updatedTask = [...state.category, draggedTasks];
      setState((prev) => ({ ...prev, category: updatedTask }));
    }
  };

  const adjustWidthHeight = (value, id, label) => {
    const newState = state.category.map((obj) => {
      if (obj.id == id) {
        return {
          ...obj,
          [label]: value,
        };
      }
      return obj;
    });
    setState({ category: newState });
  };

  const handleChangeUploader = (uploadfile) => {
    if (uploadfile) {
      setCImage("");
      const storageRef = ref(storage, `images/${uploadfile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, uploadfile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {},
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setCImage(downloadURL);
            console.log("downloadURL", downloadURL);
          });
        }
      );
    }
  };
  function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  const convertToImage = () => {
    html2canvas(document.getElementById("imageConvertingDiv")).then(function (
      canvas
    ) {
      var jpegUrl = canvas.toDataURL("image/jpeg");
      var blob = dataURLtoBlob(jpegUrl);
      handleChangeUploader(blob);
    });
  };
  var loadFile = function (event) {
    const src = URL.createObjectURL(event.target.files[0]);
    setUrl(src);
  };
  return (
    <>
      <div id="harish"></div>
      <div className="container_drag">
        <div>
          <h1>Draggable Items</h1>
          <div
            className="static"
            onDragOver={(e) => onDragOver(e)}
            onDrop={(e) => {
              onDrop(e, "static");
            }}
          >
            {rendingCategory.static}
          </div>
        </div>
        <div>
          <Button onClick={convertToImage}>Save</Button>
          <div
            id="imageConvertingDiv"
            className="droppable"
            onDragOver={(e) => onDragOver(e)}
            onDrop={(e) => onDrop(e, "container")}
          >
            {rendingCategory.container}
          </div>
        </div>
        <div>
          <h1> Tools</h1>
          <div className="centerTheContext">
            <p>
              <input
                type="file"
                accept="image/*"
                name="image"
                id="file"
                onChange={(event) => {
                  loadFile(event);
                }}
                style={{
                  display: "none",
                }}
              />
            </p>
            <p>
              <label
                htmlFor="file"
                style={{
                  cursor: "pointer",
                }}
              >
                Upload Image
              </label>
            </p>
            <div>
              {colorArr.map((val) => {
                return (
                  <div
                    onClick={() => {
                      setBg(val);
                    }}
                    className="colorDiv"
                    style={{
                      background: val,
                    }}
                  ></div>
                );
              })}
            </div>
          </div>
          <div className="centerTheContext">
            {state.category
              .filter(({ section }) => section === "container")
              .map((obj) => {
                console.log(obj);
                return (
                  <>
                    <div className="cardofHeight">
                      {obj.type == "image" ? (
                        <img alt="example" src={obj.url} />
                      ) : (
                        "textArea"
                      )}
                      {obj.type != "image" && (
                        <>
                          <p>
                            fw:&nbsp;&nbsp;
                            <Input
                              type={"number"}
                              onChange={(e) => {
                                const { value } = e.target;
                                adjustWidthHeight(value, obj.id, "fontWeight");
                              }}
                              value={obj.fontWeight}
                            />
                          </p>
                          <p>
                            fs:&nbsp;&nbsp;
                            <Input
                              type={"number"}
                              onChange={(e) => {
                                const { value } = e.target;
                                adjustWidthHeight(value, obj.id, "fontSize");
                              }}
                              value={obj.fontSize}
                            />{" "}
                          </p>
                        </>
                      )}
                      <div className="inputWH">
                        <p>
                          w:&nbsp;&nbsp;
                          <Input
                            type={"number"}
                            onChange={(e) => {
                              const { value } = e.target;
                              adjustWidthHeight(value, obj.id, "width");
                            }}
                            value={obj.width}
                          />
                        </p>
                        <p>
                          h:&nbsp;&nbsp;
                          <Input
                            type={"number"}
                            onChange={(e) => {
                              const { value } = e.target;
                              adjustWidthHeight(value, obj.id, "height");
                            }}
                            value={obj.height}
                          />{" "}
                        </p>
                      </div>
                    </div>
                  </>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
};

export default AppDragDropDemo;

import { Input } from "antd";
import { v4 as uuidv4 } from "uuid";
import React, { useState, useEffect } from "react";
import "./App.scss";
import * as $ from "jquery";
import { GetUrlFromFireBase } from "./firebase";

const AppDragDropDemo = () => {
  const [state, setState] = useState({
    category: [
      {
        value: "Learn Angular",
        section: "static",
        bgcolor: "yellow",
        id: uuidv4(),
      },
      { value: "React", section: "static", bgcolor: "pink", id: uuidv4() },
      { value: "Vue", section: "container", bgcolor: "skyblue", id: uuidv4() },
    ],
  });

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
    // console.log(ev.clientX);
    // console.log(ev.clientY);

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
    if (cat == "static") {
      let updatedTask = state.category.filter((task) => task.id !== id);

      setState((prev) => ({ ...prev, category: updatedTask }));
      return;
    }
    let draggedTasks = { ...state.category.find((task) => task.id == id) };
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
  const [rendingCategory, setrendingCategory] = useState({
    static: [],
    container: [],
  });
  useEffect(() => {
    let rendingCategory = {
      static: [],
      container: [],
    };
    state.category.forEach((t) => {
      if (t.section == "static") {
        rendingCategory[t.section].push(
          <div
            key={t.id}
            onDragStart={(e) => onDragStart(e, t.id)}
            draggable
            className="draggable"
            style={{ backgroundColor: t.bgcolor }}
          >
            <Input defaultValue={t.value} />
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
              backgroundColor: t.bgcolor,
              left: t.left,
              top: t.top,
              position: "absolute",
            }}
          >
            <Input defaultValue={t.value} />
          </div>
        );
      }
    });
    setrendingCategory(rendingCategory);
  }, [state]);
  const [url, setUrl] = useState("");
  useEffect(() => {
    console.log(url);
  }, [url]);
  return (
    <>
      <GetUrlFromFireBase setUrl={setUrl} />
      <div className="container_drag">
        <div
          className="static"
          onDragOver={(e) => onDragOver(e)}
          onDrop={(e) => {
            onDrop(e, "static");
          }}
        >
          {rendingCategory.static}
        </div>
        <div
          className="droppable"
          onDragOver={(e) => onDragOver(e)}
          onDrop={(e) => onDrop(e, "container")}
        >
          {rendingCategory.container}
        </div>
      </div>
    </>
  );
};

export default AppDragDropDemo;

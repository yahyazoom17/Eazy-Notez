import axios from "axios";
import { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import NoteCard from "./components/NoteCard";

function App() {
  const [allNotes, setAllNotes] = useState([]);

  //TODO: Make a JSON File and store the current notes into it.

  const fetchNotesData = async () => {
    axios
      .get("http://127.0.0.1:8000/allnotes")
      //.then((res) => {
      //if (!res.ok) {
      //throw new Error(res.error);
      //}
      //return res.json();
      //})
      //.then((data) => setAllNotes(data.allNotes))
      //.catch((error) => console.log("Unable to fetch data:", error));
      .then((result) => setAllNotes(result.data.allnotes));
  };

  useEffect(() => {
    fetchNotesData();
  }, []);

  return (
    <>
      <Navbar setAllNotes={setAllNotes} allNotes={allNotes} />
      {allNotes
        ? allNotes.map((note, index) => {
            return (
              <NoteCard
                key={index}
                title={note.title}
                description={note.description}
                createdTime={note.createdTime}
                bookMark={note.bookmark}
                note={note}
              />
            );
          })
        : ""}
    </>
  );
}

export default App;

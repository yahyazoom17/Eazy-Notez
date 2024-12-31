/* eslint-disable react/prop-types */
import { IconButton } from "@material-tailwind/react";
import axios from "axios";
import { useState } from "react";
import { FaRegBookmark } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa6";
import { MdDelete, MdModeEditOutline } from "react-icons/md";
import { toast } from "react-toastify";
import EditNote from "./EditNote";

// eslint-disable-lines react/prop-types
function NoteCard({ title, description, createdTime, bookMark, note }) {
  const [isSaved, setIsSaved] = useState(bookMark);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen((cur) => !cur);

  const bookMarkNote = {
    note_id: note.note_id,
    title: note.title,
    description: note.description,
    createdTime: note.createdTime,
    bookmark: true,
  };

  const handleBookmark = () => {
    axios
      .post("http://127.0.0.1:8000/addbookmark", bookMarkNote)
      .then(function (response) {
        setIsSaved(true);
        toast(response.data.message);
        console.log(response.data);
        setTimeout(window.location.reload(), 9000);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleDelete = () => {
    axios
      .delete(`http://127.0.0.1:8000/deletenote/${note.note_id}`)
      .then(function (response) {
        toast(response.data.message);
        console.log(response.data);
        setTimeout(window.location.reload(), 9000);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <div className="flex justify-center my-10">
      <div className="container p-5 transition ease-in-out bg-white rounded-md shadow-md group hover:shadow-lg">
        <div className="flex justify-between my-2">
          <div className="my-2 text-xl text-semibold">{title}</div>
          <div className="flex justify-between">
            <div className="group-hover:transition sm:hidden group-hover:block">
              <IconButton className="mx-1" variant="text" onClick={handleOpen}>
                <MdModeEditOutline className="size-5" />
              </IconButton>
              <EditNote
                onButtonClick={handleOpen}
                openParam={open}
                note={note}
              />
              <IconButton
                variant="text"
                className="mx-1"
                onClick={handleBookmark}
              >
                {isSaved ? (
                  <FaBookmark className="mx-2 my-2 size-5" />
                ) : (
                  <FaRegBookmark className="mx-2 my-2 size-5" />
                )}
              </IconButton>
            </div>
          </div>
        </div>
        <div className="my-1 overflow-hidden text-md">{description}</div>
        <div className="flex justify-between my-5">
          <div className="overflow-hidden text-sm text-gray-500 ">
            {createdTime}
          </div>
          <div className="sm:hidden group-hover:block">
            <IconButton
              variant="text"
              className="mx-1"
              color="red"
              onClick={handleDelete}
            >
              <MdDelete className="size-6" />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NoteCard;

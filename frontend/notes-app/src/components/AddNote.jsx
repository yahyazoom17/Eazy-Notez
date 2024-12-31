import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Dialog,
  Input,
  Textarea,
  Typography,
} from "@material-tailwind/react";
import axios from "axios";
import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { toast } from "react-toastify";
import "../helper";

var currentdate = new Date();
var datetime =
  currentdate.getDate() +
  "/" +
  (currentdate.getMonth() + 1) +
  "/" +
  currentdate.getFullYear() +
  " at " +
  currentdate.getHours() +
  ":" +
  currentdate.getMinutes();

if (currentdate.getHours() > 12) {
  datetime = datetime + " PM";
} else {
  datetime = datetime + " AM";
}

/* eslint-disable react/prop-types */
function AddNote({ onButtonClick, openHandler }) {
  const [newNote, setNewNote] = useState({
    note_id: "",
    title: "",
    description: "",
    createdTime: datetime,
    bookmark: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://127.0.0.1:8000/addnote", newNote)
      .then(function (response) {
        toast(response.data.message);
        console.log(response);
        setTimeout(window.location.reload(), 9000);
      })
      .catch(function (error) {
        console.log(error);
      });
    onButtonClick();
  };

  return (
    <>
      <Dialog
        size="xs"
        open={openHandler}
        handler={onButtonClick}
        className="bg-transparent shadow-none"
      >
        <Card className="mx-auto w-full max-w-[24rem]">
          <form>
            <CardBody className="flex flex-col gap-4">
              <Typography variant="h4" color="blue-gray">
                Add A Note
              </Typography>
              <Typography className="mt-3 -mb-2" variant="h6">
                Title
              </Typography>
              <Input
                size="lg"
                id="title"
                name="title"
                value={newNote.title}
                onChange={(event) => {
                  setNewNote({
                    ...newNote,
                    title: event.target.value,
                  });
                }}
              />
              <Typography className="-mb-2" variant="h6">
                Note
              </Typography>
              <Textarea
                size="lg"
                value={newNote.description}
                onChange={(event) => {
                  setNewNote({
                    ...newNote,
                    description: event.target.value,
                  });
                }}
                placeholder="Go on taking your note..."
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                id="description"
                name="description"
              />
            </CardBody>
            <CardFooter className="pt-0">
              <Button
                type="submit"
                className="flex justify-center gap-3 mt-5"
                fullWidth
                onClick={handleSubmit}
              >
                <IoMdAdd className="size-4" />
                <span className="poppins-regular">Add Note</span>
              </Button>
            </CardFooter>
          </form>
        </Card>
      </Dialog>
    </>
  );
}

export default AddNote;

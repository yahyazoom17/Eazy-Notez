/* eslint-disable react/prop-types */
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
import { MdEdit } from "react-icons/md";
import { toast } from "react-toastify";

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
function EditNote({ onButtonClick, openParam, note }) {
  const [updateNote, setUpdateNote] = useState({
    note_id: note.note_id,
    title: note.title,
    description: note.description,
    createdTime: "Edited: " + datetime,
    bookmark: note.bookmark,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put("http://127.0.0.1:8000/editnote", updateNote)
      .then(function (response) {
        toast(response.data.message);
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
    onButtonClick();
    window.location.reload();
  };

  return (
    <>
      <Dialog
        size="xs"
        open={openParam}
        handler={onButtonClick}
        className="bg-transparent shadow-none"
      >
        <Card className="mx-auto w-full max-w-[24rem]">
          <form>
            <CardBody className="flex flex-col gap-4">
              <Typography variant="h4" color="blue-gray">
                Edit Note
              </Typography>
              <Typography className="mb-2 text-sm" variant="paragraph">
                ID: {note.note_id}
              </Typography>
              <Typography className="-mb-2" variant="h6">
                Title
              </Typography>
              <Input
                size="lg"
                id="title"
                name="title"
                value={updateNote.title}
                onChange={(event) => {
                  setUpdateNote({
                    ...updateNote,
                    title: event.target.value,
                  });
                }}
              />
              <Typography className="-mb-2" variant="h6">
                Description
              </Typography>
              <Textarea
                size="lg"
                value={updateNote.description}
                onChange={(event) => {
                  setUpdateNote({
                    ...updateNote,
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
                <MdEdit className="size-4" />
                <span className="poppins-regular">Save Note</span>
              </Button>
            </CardFooter>
          </form>
        </Card>
      </Dialog>
    </>
  );
}

export default EditNote;

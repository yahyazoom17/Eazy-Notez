import { useState } from "react";
import { FaPlusSquare } from "react-icons/fa";
import AddNote from "./AddNote";

function Navbar() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen((cur) => !cur);

  return (
    <div>
      <nav className="block w-full max-w-screen-lg px-4 py-2 mx-auto mt-10 bg-white rounded-md shadow-md lg:px-8 lg:py-3">
        <div className="container flex flex-wrap items-center justify-between mx-auto text-slate-800">
          <div>
            <a
              href="#"
              className="mr-4 block cursor-pointer py-1.5 text-2xl text-slate-800 font-bold"
            >
              Eazy Notez
            </a>
          </div>

          <div className="hidden lg:block">
            <ul className="flex flex-col gap-2 mt-2 mb-4 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
              <li className="flex items-center p-1 font-semibold text-md gap-x-2 text-slate-600">
                <button onClick={handleOpen} className="flex items-center">
                  <FaPlusSquare className="mx-2" />
                  Add Note
                </button>
              </li>
            </ul>
          </div>
          <button
            className="relative ml-auto text-xl text-center uppercase align-middle transition-all rounded-lg select-none font-xlmedium text- text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none lg:hidden"
            type="button"
            onClick={handleOpen}
          >
            <span className="size-16">
              <FaPlusSquare />
            </span>
          </button>
        </div>
      </nav>
      <div>
        <AddNote onButtonClick={handleOpen} openHandler={open} />
      </div>
    </div>
  );
}

export default Navbar;

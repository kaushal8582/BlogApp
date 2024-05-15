import { Fragment, useContext, useEffect, useState } from "react";
import {useNavigate} from "react-router-dom"
import { Dialog, DialogBody, Input } from "@material-tailwind/react";
import myContext from "../../context/data/myContext";
import { AiOutlineSearch } from "react-icons/ai";

export default function SearchDialog() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(!open);

  const context = useContext(myContext);
  const { mode, searchKey, setSearchKey, getAllBlog } = context;
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0)
}, [])
  
  return (
    <Fragment>
      {/* Search Icon  */}
      <div onClick={handleOpen}>
        <AiOutlineSearch size={20} color="white" />
      </div>
      {/* Dialog  */}
      <Dialog
        className=" relative right-[1em] w-[25em]  md:right-0 md:w-0 lg:right-0 lg:w-0"
        open={open}
        handler={handleOpen}
        style={{
          background: mode === "light" ? "#2f3542" : "#2f3542",
          color: mode === "dark" ? "white" : "black",
        }}
      >
        {/* Dialog Body  */}
        <DialogBody>
          <div className="flex w-full   justify-center">
            {/* Input  */}
            <Input
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              color="white"
              type="search"
              label="Type here..."
              className=" bg-[#2C3A47]"
              name="searchkey"
              containerProps={{
                className: "min-w-[288px]",
              }}
            />
          </div>

          {/* Blog Card  */}

         

          <div className="flex justify-center flex-wrap   sm:mx-auto sm:mb-2 -mx-2  mt-4 mb-2 ">
            <div className="p-2 sm:w-1/4 w-full flex gap-2  ">
              {getAllBlog
                .filter((obj) => obj.title.toLowerCase().includes(searchKey))
                .map((item, index) => (
                  <div
                  onClick={(e)=>navigate(`/bloginfo/${item.id}`)}
                    className="container mt-2  mx-auto px-4 bg-gray-200 p-2 rounded-lg"
                    key={index}
                  >
                    {/* Blog Thumbnail */}
                    <img
                      className="w-20 mb-2 rounded-lg"
                      src={item.thumbnail}
                      alt=""
                    />

                    {/* Blog Date */}
                    <p className="w-40 text-sm">{item.date}</p>

                    {/* Blog Title */}
                    <h1>{item.title}</h1>
                  </div>
                ))}
            </div>
          </div>

          {/* Heading  */}
          <div className=" text-center">
            <h1 className=" text-gray-600">Powered By kaushal</h1>
          </div>
        </DialogBody>
      </Dialog>
    </Fragment>
  );
}

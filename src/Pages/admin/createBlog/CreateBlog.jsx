import React, { useState, useContext, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import myContext from "../../../context/data/myContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Typography } from "@material-tailwind/react";
import { toast } from "react-hot-toast";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { fireDb, storage } from "../../../firebase/FirebaseConfig";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

function CreateBlog() {
  const context = useContext(myContext);
  const { mode } = context;
  const navigate = useNavigate();
  const {id} = useParams();
  const [imageUrl,setImageUrl] = useState('')

  const [blogs, setBlogs] = useState({
    title: "",
    categories: "",
    content: "",
    time: Timestamp.now(),
  });
  const [thumbnail, setthumbnail] = useState();
  const [text, settext] = useState("");

  const addOrUpdateBlog = async () => {
    if (
      blogs.title === "" ||
      blogs.categories === "" ||
      blogs.content === "" ||
      thumbnail === ""
    ) {
      toast.error("Please fill All Fields");
    }

    if (id) {
      await updateBlog();
    } else {
      await addBlog();
    }
  };

  const updateBlog = async () => {
    let url = imageUrl;
    console.log("thum",thumbnail);
    if(thumbnail){
      url = await uploadImage();
    }

    console.log("url",url,imageUrl);
    const docRef = doc(fireDb, "blogPosts", id);
    console.log("doc ref", docRef);
    try {
      await updateDoc(docRef, {
        title: blogs.title,
        categories: blogs.categories,
        content: blogs.content,
        thumbnail:url,
      });

      toast.success("Update Blog Successfyll");
      navigate("/dashboard")

    } catch (error) {
      toast.error("Not update post");
      navigate("/dashboard");
    }

   
  };

  const addBlog = async () => {
    const url = await uploadImage();
    const productRef = collection(fireDb, "blogPosts");
    try {
      addDoc(productRef, {
        title: blogs.title,
        categories: blogs.categories,
        content: blogs.content,
        thumbnail: url,
        time: Timestamp.now(),
        date: new Date().toLocaleString("es-us", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
      });

      navigate("/dashboard");
      toast.success("Add Post Successfully");
    } catch (error) {
      toast.error("error");
      console.log(error);
    }
  };

  const uploadImage = async () => {
  if (!thumbnail || !thumbnail.name) {
    console.error("No thumbnail selected");
    return imageUrl; // Return null if thumbnail is not defined or has no name property
  }

  try {
    const imgRef = ref(storage, `blogimage/${thumbnail.name}`);
    const snapshot = await uploadBytes(imgRef, thumbnail);
    const url = await getDownloadURL(snapshot.ref);
    setImageUrl(url); // Set the imageUrl state here
    return url;
  } catch (error) {
    console.error("Error uploading image:", error);
    return imageUrl; // Return null if upload fails
  }
};


  // Create markup function
  
  function createMarkup(c) {
    return { __html: c };
  }
  useEffect(() => {
    window.scrollTo(0, 0);
    if (id) {
      const fetchBlogPost = async () => {
        const docRef = doc(fireDb, "blogPosts", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log(data);
          setBlogs({
            title: data.title,
            categories: data.categories,
            content: data.content,
            // :data.thumbnail
          });
          setImageUrl(data.thumbnail);
        } else {
          toast.error("BlogPost not found 😕");
          navigate("/dashboard");
        }
      };
      fetchBlogPost();
      console.log(blogs);
    }
  }, [id, navigate]);

  return (
    <div className=" container mx-auto max-w-5xl py-6">
      <div
        className="p-5"
        style={{
          background: mode === "dark" ? "#353b48" : "rgb(226, 232, 240)",
          borderBottom:
            mode === "dark"
              ? " 4px solid rgb(226, 232, 240)"
              : " 4px solid rgb(30, 41, 59)",
        }}
      >
        {/* Top Item  */}
        <div className="mb-2 flex justify-between">
          <div className="flex gap-2 items-center">
            {/* Dashboard Link  */}
            <Link to={"/dashboard"}>
              <BsFillArrowLeftCircleFill size={25} />
            </Link>

            {/* Text  */}
            <Typography
              variant="h4"
              style={{
                color: mode === "dark" ? "white" : "black",
              }}
            >
              Create blog
            </Typography>
          </div>
        </div>

        {/* main Content  */}
        <div className="mb-3">
          {/* Thumbnail  */}
          {thumbnail && (
            <img
              className=" w-full rounded-md mb-3 "
              src={thumbnail ? URL.createObjectURL(thumbnail) : ""}
              alt="thumbnail"
            />
          )}

          {/* Text  */}
          <Typography
            variant="small"
            color="blue-gray"
            className="mb-2 font-semibold"
            style={{ color: mode === "dark" ? "white" : "black" }}
          >
            Upload Thumbnail
          </Typography>

          {/* First Thumbnail Input  */}
          <input
            type="file"
            label="Upload thumbnail"
            className="shadow-[inset_0_0_4px_rgba(0,0,0,0.6)] placeholder-black w-full rounded-md p-1"
            style={{
              background: mode === "dark" ? "#dcdde1" : "rgb(226, 232, 240)",
            }}
            onChange={(e) => {
              setthumbnail(e.target.files[0])
              setImageUrl('')
            }}
          />
        </div>

        {/* Second Title Input */}
        <div className="mb-3">
          <input
            label="Enter your Title"
            className={`shadow-[inset_0_0_4px_rgba(0,0,0,0.6)] w-full rounded-md p-1.5 
                 outline-none ${
                   mode === "dark" ? "placeholder-black" : "placeholder-black"
                 }`}
            placeholder="Enter Your Title"
            style={{
              background: mode === "dark" ? "#dcdde1" : "rgb(226, 232, 240)",
            }}
            name="title"
            value={blogs.title}
            onChange={(e) => setBlogs({ ...blogs, title: e.target.value })}
          />
        </div>

        {/* Third Category Input  */}
        <div className="mb-3">
          <input
            label="Enter your Category"
            className={`shadow-[inset_0_0_4px_rgba(0,0,0,0.6)] w-full rounded-md p-1.5 
                 outline-none ${
                   mode === "dark" ? "placeholder-black" : "placeholder-black"
                 }`}
            placeholder="Enter Your Category"
            style={{
              background: mode === "dark" ? "#dcdde1" : "rgb(226, 232, 240)",
            }}
            name="category"
            value={blogs.categories}
            onChange={(e) => setBlogs({ ...blogs, categories: e.target.value })}
          />
        </div>

        {/* Four Editor  */}
        <Editor
        value={blogs.content}
          apiKey="1rj6btx6rtbligax3rgw1j729rwbddpcnzyt79iubgxfxehl"
          onEditorChange={(newValue, editor) => {
            setBlogs({ ...blogs, content: newValue });
            settext(editor.getContent({ format: "text" }));
          }}
          onInit={(evt, editor) => {
            settext(editor.getContent({ format: "text" }));
          }}
          init={{
            plugins:
              "a11ychecker advcode advlist advtable anchor autocorrect autolink autoresize autosave casechange charmap checklist code codesample directionality editimage emoticons export footnotes formatpainter fullscreen help image importcss inlinecss insertdatetime link linkchecker lists media mediaembed mentions mergetags nonbreaking pagebreak pageembed permanentpen powerpaste preview quickbars save searchreplace table tableofcontents template  tinydrive tinymcespellchecker typography visualblocks visualchars wordcount",
          }}
        />

        {/* Five Submit Button  */}
        <Button
          onClick={addOrUpdateBlog}
          className=" w-full mt-5"
          style={{
            background:
              mode === "dark" ? "rgb(226, 232, 240)" : "rgb(30, 41, 59)",
            color: mode === "dark" ? "rgb(30, 41, 59)" : "rgb(226, 232, 240)",
          }}
        >
          {id ? "Update Blog" : "Add Blog"}
        </Button>

        {/* Six Preview Section  */}
        <div className="">
          <h1 className=" text-center mb-3 text-2xl">Preview</h1>
          <div className="content">
            <div
              className={`[&> h1]:text-[32px] [&>h1]:font-bold  [&>h1]:mb-2.5
                        ${
                          mode === "dark"
                            ? "[&>h1]:text-[#ff4d4d]"
                            : "[&>h1]:text-black"
                        }

                        [&>h2]:text-[24px] [&>h2]:font-bold [&>h2]:mb-2.5
                        ${
                          mode === "dark"
                            ? "[&>h2]:text-white"
                            : "[&>h2]:text-black"
                        }

                        [&>h3]:text-[18.72] [&>h3]:font-bold [&>h3]:mb-2.5
                        ${
                          mode === "dark"
                            ? "[&>h3]:text-white"
                            : "[&>h3]:text-black"
                        }

                        [&>h4]:text-[16px] [&>h4]:font-bold [&>h4]:mb-2.5
                        ${
                          mode === "dark"
                            ? "[&>h4]:text-white"
                            : "[&>h4]:text-black"
                        }

                        [&>h5]:text-[13.28px] [&>h5]:font-bold [&>h5]:mb-2.5
                        ${
                          mode === "dark"
                            ? "[&>h5]:text-white"
                            : "[&>h5]:text-black"
                        }

                        [&>h6]:text-[10px] [&>h6]:font-bold [&>h6]:mb-2.5
                        ${
                          mode === "dark"
                            ? "[&>h6]:text-white"
                            : "[&>h6]:text-black"
                        }

                        [&>p]:text-[16px] [&>p]:mb-1.5
                        ${
                          mode === "dark"
                            ? "[&>p]:text-[#7efff5]"
                            : "[&>p]:text-black"
                        }

                        [&>ul]:list-disc [&>ul]:mb-2
                        ${
                          mode === "dark"
                            ? "[&>ul]:text-white"
                            : "[&>ul]:text-black"
                        }

                        [&>ol]:list-decimal [&>li]:mb-10
                        ${
                          mode === "dark"
                            ? "[&>ol]:text-white"
                            : "[&>ol]:text-black"
                        }

                        [&>li]:list-decimal [&>ol]:mb-2
                        ${
                          mode === "dark"
                            ? "[&>ol]:text-white"
                            : "[&>ol]:text-black"
                        }

                        [&>img]:rounded-lg
                        `}
              dangerouslySetInnerHTML={createMarkup(blogs.content)}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateBlog;

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
  const { id } = useParams();
  const [imageUrl, setImageUrl] = useState('');

  const [blogs, setBlogs] = useState({
    title: "",
    categories: "",
    content: "",
    time: Timestamp.now(),
  });
  const [thumbnail, setthumbnail] = useState();
  const [text, settext] = useState("");
  const [imgUrl,setImgUrl] = useState('');
  const [copyUrl,setCopyUrl] = useState('');

  const addOrUpdateBlog = async () => {
    if (
      blogs.title === "" ||
      blogs.categories === "" ||
      blogs.content === "" ||
      thumbnail === ""
    ) {
      toast.error("Please fill All Fields");
    }

    else{
      if (id) {
        await updateBlog();
      } else {
        await addBlog();
      }
    }
   
  };

  const updateBlog = async () => {
    let url = imageUrl;
    if (thumbnail) {
      url = await uploadImage();
    }

    const docRef = doc(fireDb, "blogPosts", id);
    try {
      await updateDoc(docRef, {
        title: blogs.title,
        categories: blogs.categories,
        content: blogs.content,
        thumbnail: url,
      });

      toast.success("Blog updated successfully");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Failed to update blog post");
      navigate("/dashboard");
    }
  };

  const addBlog = async () => {
    const url = await uploadImage();
    const productRef = collection(fireDb, "blogPosts");
    try {
      await addDoc(productRef, {
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
      toast.success("Blog post added successfully");
    } catch (error) {
      toast.error("Failed to add blog post");
      console.error(error);
    }
  };

  function copyUrlfunction(){
    navigator.clipboard.writeText(copyUrl)
    .then(() => {
     toast.success("copy link successfully")
    })
    .catch((error) => {
      toast.error("error to copy link")
    });
  }

  async function uploadImageFuncitoForTextarea(){
    if(!imgUrl || !imgUrl.name){
      console.log("plz select img");
      toast.error("plz select img")
      return;
    }
    try {
      const imgRef = ref(storage, `blogimage/${imgUrl.name}`);
      const snapshot = await uploadBytes(imgRef, imgUrl);
      const url = await getDownloadURL(snapshot.ref);
      setCopyUrl(url)
      console.log(url);
      toast.success("Upload image success")
    } catch (error) {
      console.log(error);
      toast.error("not upload image");
    }
  }

  const uploadImage = async () => {
    if (!thumbnail || !thumbnail.name) {
      console.error("No thumbnail selected");
      return imageUrl;
    }

    try {
      const imgRef = ref(storage, `blogimage/${thumbnail.name}`);
      const snapshot = await uploadBytes(imgRef, thumbnail);
      const url = await getDownloadURL(snapshot.ref);
      setImageUrl(url);
      return url;
    } catch (error) {
      console.error("Error uploading image:", error);
      return imageUrl;
    }
  };



  const handleEditorImageUpload = async (blobInfo, success, failure) => {
    try {
      const file = blobInfo.blob();
      const imgRef = ref(storage, `blogimage/${file.name}`);
      const snapshot = await uploadBytes(imgRef, file);
      const url = await getDownloadURL(snapshot.ref);
      success(url);
    } catch (error) {
      console.error("Error uploading image:", error);
      failure("Image upload failed");
    }
  };

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
          setBlogs({
            title: data.title,
            categories: data.categories,
            content: data.content,
          });
          setImageUrl(data.thumbnail);
          console.log(imageUrl);
        } else {
          toast.error("Blog post not found");
          navigate("/dashboard");
        }
      };
      fetchBlogPost();
    }
  }, [id, navigate]);

  return (
    <div className="container mx-auto max-w-5xl py-6">
      <div
        className="p-5"
        style={{
          background: mode === "dark" ? "#353b48" : "rgb(226, 232, 240)",
          borderBottom:
            mode === "dark"
              ? "4px solid rgb(226, 232, 240)"
              : "4px solid rgb(30, 41, 59)",
        }}
      >
        <div className="mb-2 flex justify-between">
          <div className="flex gap-2 items-center">
            <Link to={"/dashboard"}>
              <BsFillArrowLeftCircleFill size={25} />
            </Link>
            <Typography
              variant="h4"
              style={{
                color: mode === "dark" ? "white" : "black",
              }}
            >
              Create blog
            </Typography>
          </div>
          <div className="w-[20rem] h-[7rem] bg-gray-600">
            <input type="file" onChange={(e)=>setImgUrl(e.target.files[0])} />
              <Button onClick={uploadImageFuncitoForTextarea} >Upload</Button>
              {copyUrl?<Button onClick={copyUrlfunction} >Copy URL</Button>:""}
          </div>
        </div>

        <div className="mb-3">
          {thumbnail && (
            <img
              className="w-full rounded-md mb-3"
              src={URL.createObjectURL(thumbnail)}
              alt="thumbnail"
            />
          )}

          <Typography
            variant="small"
            color="blue-gray"
            className="mb-2 font-semibold"
            style={{ color: mode === "dark" ? "white" : "black" }}
          >
            Upload Thumbnail
          </Typography>

          <input
            type="file"
            label="Upload thumbnail"
            className="shadow-[inset_0_0_4px_rgba(0,0,0,0.6)] placeholder-black w-full rounded-md p-1"
            style={{
              background: mode === "dark" ? "#dcdde1" : "rgb(226, 232, 240)",
            }}
            onChange={(e) => {
              setthumbnail(e.target.files[0]);
              setImageUrl("");
            }}
          />
        </div>

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

        <Editor
          value={blogs.content}
          apiKey='1rj6btx6rtbligax3rgw1j729rwbddpcnzyt79iubgxfxehl'
          onEditorChange={(newValue, editor) => {
            setBlogs({ ...blogs, content: newValue });
            settext(editor.getContent({ format: "text" }));
          }}
          onInit={(evt, editor) => {
            settext(editor.getContent({ format: "text" }));
          }}
          init={{
            plugins:
              "link image imagetools media table codesample code textcolor colorpicker lists",
            toolbar:
              "undo redo | formatselect | bold italic forecolor backcolor | \
                        alignleft aligncenter alignright alignjustify | \
                        bullist numlist outdent indent | removeformat | image code",
            images_upload_handler: handleEditorImageUpload,
            images_upload_credentials: true,
            automatic_uploads: true,
          }}
        />
        <Button
          className="mt-4"
          onClick={() => {
            addOrUpdateBlog();
          }}
        >
          {id ? "Update" : "Create"}
        </Button>
      </div>
    </div>
  );
}

export default CreateBlog;

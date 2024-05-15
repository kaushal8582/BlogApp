import React, { useEffect, useState } from "react";
import MyContext from "./myContext";
import { query, collection, orderBy, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { fireDb } from "../../firebase/FirebaseConfig";
import toast from "react-hot-toast";

function MyState(props) {
  const [loading, setLoading] = useState(false);
  const [searchKey, setSearchKey] = useState("");

  const [getAllBlog, setGetAllBlog] = useState([]);

  function getAllBlogs() {
    setLoading(true);
    try {
      const q = query(collection(fireDb, "blogPosts"), orderBy("time"));
      const data = onSnapshot(q, (QuerySnapshot) => {
        let blogArray = [];
        QuerySnapshot.forEach((doc) => {
          blogArray.push({ ...doc.data(), id: doc.id });
        });

        setGetAllBlog(blogArray);
        // console.log(productsArray)
        setLoading(false);
      });
      return () => data;
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    getAllBlogs();
  }, []);


  const deleteBlog = async(id)=>{
    try {
      await deleteDoc(doc(fireDb,"blogPosts",id))
      // getAllBlog();
      toast.success("Delete Post successfully");
    } catch (error) {
      console.log(error);
      toast.error("Error")
    }
  }

  const [mode, setMode] = useState("light"); // Whether dark mode is enabled or not
  const toggleMode = () => {
    if (mode === "light") {
      setMode("dark");
      document.body.style.backgroundColor = "rgb(17, 24, 39)";
    } else {
      setMode("light");
      document.body.style.backgroundColor = "white";
    }
  };
  return (
    <MyContext.Provider
      value={{
        mode,
        toggleMode,
        searchKey,
        setSearchKey,
        loading,
        setLoading,
        getAllBlog,
        deleteBlog,
      }}
    >
      {props.children}
    </MyContext.Provider>
  );
}

export default MyState;

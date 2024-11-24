import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import appwriteService from "../appwrite/appwriteService";
import Container from "../components/container/Container";
import Button from "../components/Buton";
import parse from "html-react-parser/lib/index";

const Post = () => {
  const [post, setPost] = useState(null);
  const { slug } = useParams();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const isAuthor = post && userData ? post.userId === userData.$id : false;

  const deletePost = () => {
    appwriteService.deletePost(post.$id).then((status) => {
      if (status) {
        appwriteService.deleteFile(post.featuredImage);
        navigate("/");
      }
    });
  };

  useEffect(() => {
    if (slug) {
      appwriteService.getPost(slug).then((post) => {
        if (post) {
          setPost(post);
          console.log("featuredImage: ", post.featuredImage);
          console.log("File Preview URL:", appwriteService.getFilePreview(post.featuredImage));
        } else navigate("/");
      });
    }
  }, [slug, navigate]);
  return post ? (
    <div className="py-8">
      <Container>
        <Link to="/all-post" className=" text-2xl hover:text-blue-400"> &lt;--  Back</Link>
        <div className="w-full flex justfy-center my-4 relative border rounded-xl p-2">
          <img
            src={appwriteService.getFilePreview(post.featuredImage)}
            alt={post.title}
            className="rounded-xl"
          />
          
        </div>
        {isAuthor && (
            <div className="top-6">
              <Link to={`/edit-post/${post.$id}`}>
                <Button bgcolor="bg-green-500" className="mr-3">
                  Edit
                </Button>
              </Link>
              <Button bgcolor="bg-red-500" onClick={deletePost}>
                Delete
              </Button>
            </div>
          )}
        <div className="w-full mb-6 py-4">
          <h1 className="text-2xl font-bold ">{post.title}</h1>
          <div className="browser-css py-3">{parse(post.content)}</div>
        </div>
      </Container>
    </div>
  ) : null;
};

export default Post;

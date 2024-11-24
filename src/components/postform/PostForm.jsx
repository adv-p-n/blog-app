import React, { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import appwriteService from "../../appwrite/appwriteService";
import Input from "../Input"
import RTE from "../RTE"
import Select from "../Select"
import Button from "../Buton"

function PostForm({ post }) {
  const { register, handleSubmit, watch, getValues, control, setValue } =
    useForm({
      defaultValues: {
        title: post?.title || "",
        slug: post?.slug || "",
        content: post?.content || "",
        status: post?.status || true,
      },
    });
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    if (post) {
      setValue("title", post.title);
      setValue("slug", post.slug);
      setValue("content", post.content);
      setValue("status", post.status);
    }
  }, [post, setValue]);

  const submit = async (data) => {
    data.status = data.status === "true" || data.status === true;
    console.log("Data: ",data)
    if (post) {
      //Edit post
      console.log("BEFORE: ",post);
      const file = data.image[0]
        ? await appwriteService.uploadFile(data.image[0]) 
        : null;
        console.log("UPLOADED FILE: ",file);
      // If a new file is uploaded, delete the old one
      if (file) {
        appwriteService.deleteFile(post.featuredImage);
        data.featuredImage = file.$id;
      } else {
        data.featuredImage = post.featuredImage; // Keep existing image if not updating
      }
      const updatedPostData = {
        ...data,
        featuredImage: data.featuredImage, // Ensure featuredImage is always part of the payload
    };
    
    const dbPost = await appwriteService.updatePost(post.$id, updatedPostData);
      console.log("AFTER: ",dbPost);
      if (dbPost) {
        navigate(`/post/${dbPost.$id}`);
      }
    } else {
      //New Post
      const file = await appwriteService.uploadFile(data.image[0]);
      if (file) {
        const fileId = file.$id;
        data.featuredImage = fileId;
        const dbPost = await appwriteService.createPost({
          ...data,
          userId: userData.$id,
        });

        if (dbPost) {
          navigate(`/post/${dbPost.$id}`);
        }
      }
    }
  };

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string")
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, "-")
        .replace(/\s/g, "-");
  }, []);

  React.useEffect(()=>{
    watch((value,{name})=>{
      if(name==="title"){
          setValue("slug",slugTransform(value.title),{shouldValidate:true})
      }
    })
  },[watch,slugTransform,setValue])

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
       <div className="w-2/3 px-2">
        <Input label="Title" placeholder="Title" className="mb-4" {...register("title",{required:true})} />
        <Input label="Slug" placeholder="Slug" className="mb-4" {...register('slug',{required:true})} onInput={(e)=>{setValue("slug",slugTransform(e.currentTarget.value),{shouldValidate:true})}} />
        <RTE label="Content" name="content" control={control} defaultValue={getValues("content")} />
       </div>
       <div className="w-1/3 px-2"> 
        <Input label="Featured Image" type='file' className="mb-4" accept="image/png,image/jpeg,image/jpg" {...register("image",{required:!post})} />
        {post && (
          <div className="w-full mb-4">
            <img src={`${appwriteService.getFilePreview(post.featuredImage)}?timestamp=${Date.now()}`} alt={post.title} />
          </div>
        )}
        <Select label="Status" options={[true,false]} className="mb-4" {...register("status",{required:true})} />
        <Button type="submit" bgcolor={post? "bg-green-600 hover:bg-green-700" : undefined} className="w-full">{ post? "Update":"Submit"}</Button>
       </div>
    </form>
  );
}

export default PostForm;

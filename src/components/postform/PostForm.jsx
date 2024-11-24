import React, { useCallback } from "react";
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

  const submit = async (data) => {
    data.status = data.status === "true" || data.status === true;
    console.log(data)
    if (post) {
      //Edit post
      const file = data.image[0]
        ? await appwriteService.uploadFile(data.image[0])
        : null;
      if (file) {
        appwriteService.deleteFile(post.featuredImage);
      }
      const dbPost = await appwriteService.updatePost(post.$id, {
        ...data,
        featuredImage: file ? file.$id : undefined,
      });
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
        <Input label="Featured Image" type='file' className="mb-4" accept="image/png,image/jpeg,image/jpg" {...register("image",{required:true})} />
        {post && (
          <div className="w-full mb-4">
            <img src={appwriteService.getFilePreview(post.featuredImage)} alt={post.title} />
          </div>
        )}
        <Select label="Status" options={[true,false]} className="mb-4" {...register("status",{required:true})} />
        <Button type="submit" bgcolor={post? "bg-green-400" : undefined} className="w-full">{ post? "Update":"Submit"}</Button>
       </div>
    </form>
  );
}

export default PostForm;

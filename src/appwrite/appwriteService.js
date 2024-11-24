import { Client, Databases, ID, Query, Storage } from "appwrite";
import conf from "../conf/conf";

export class Service{
    client=new Client();
    databases;
    storage;

    constructor(){
        this.client.setEndpoint(conf.appwriteUrl).setProject(conf.appwriteProjectId);
        this.databases=new Databases(this.client);
        this.storage=new Storage(this.client);
    }


    //Database Service
    async createPost({title,slug = ID.unique(),content,featuredImage,status,userId}){
        try {
            return await this.databases.createDocument(conf.appwriteDatabaseId,conf.appwriteCOllectionId,slug,{title,content,featuredImage,status,userId});
        } catch (error) {
            console.log("Error: createDocument--",error)
            return false;
        }
    }
    async updatePost(slug,{title,content,featuredImage,status}){
        try {
            return await this.databases.updateDocument(conf.appwriteDatabaseId,conf.appwriteCOllectionId,slug,{title,content,featuredImage,status});
        } catch (error) {
            console.log("Error: updateDocument--",error)
            return false;
        }
    }
    async deletePost(slug){
        try {
            await this.databases.deleteDocument(conf.appwriteDatabaseId,conf.appwriteCOllectionId,slug);
            return true;
        } catch (error) {
            console.log("Error: deleteDocument--",error);
            return false;
        }
    }
    async getPost(slug){
        try {
            return await this.databases.getDocument(conf.appwriteDatabaseId,conf.appwriteCOllectionId,slug);
        } catch (error) {
            console.log("Error: getDocument--",error);
            return false;
        }
    }
    async getPosts(query=[Query.equal("status",[true])]){
        try {
            return await this.databases.listDocuments(conf.appwriteDatabaseId,conf.appwriteCOllectionId,query);
        } catch (error) {
            console.log("Error: getDocuments--",error);
            return false;
        }
    }

    //Storage Service
    async uploadFile(file){
        try {
            return await this.storage.createFile(conf.appwriteBucketId,ID.unique(),file)
        } catch (error) {
            console.log("Error: createFile--",error);
            return false;
        }
    }
    async deleteFile(fileId){
        try {
            return await this.storage.deleteFile(conf.appwriteBucketId,fileId)
            return true;
        } catch (error) {
            console.log("Error: createFile--",error);
            return false;
        }
    }
    getFilePreview(fileId) {
        
        const previewUrl = this.storage.getFilePreview(conf.appwriteBucketId, fileId);
        //console.log("Preview URL:", previewUrl);
      
        return previewUrl;
      }

}
const appwriteService = new Service();
export default appwriteService;
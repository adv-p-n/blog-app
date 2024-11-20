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
    async createDocument({title,docId,content,imageUrl,status,userId}){
        try {
            return await this.databases.createDocument(conf.appwriteDatabaseId,conf.appwriteCOllectionId,docId,{title,content,imageUrl,status,userId});
        } catch (error) {
            console.log("Error: createDocument--",error)
            return false;
        }
    }
    async updateDocument(docId,{title,content,imageUrl,status}){
        try {
            return await this.databases.updateDocument(conf.appwriteDatabaseId,conf.appwriteCOllectionId,docId,{title,content,imageUrl,status});
        } catch (error) {
            console.log("Error: updateDocument--",error)
            return false;
        }
    }
    async deleteDocument(docId){
        try {
            await this.databases.deleteDocument(conf.appwriteDatabaseId,conf.appwriteCOllectionId,docId);
            return true;
        } catch (error) {
            console.log("Error: deleteDocument--",error);
            return false;
        }
    }
    async getDocument(docId){
        try {
            return await this.databases.getDocument(conf.appwriteDatabaseId,conf.appwriteCOllectionId,docId);
        } catch (error) {
            console.log("Error: getDocument--",error);
            return false;
        }
    }
    async getDocuments(query=[Query.equal("status",[true])]){
        try {
            return await this.databases.listDocumentsDocument(conf.appwriteDatabaseId,conf.appwriteCOllectionId,query);
        } catch (error) {
            console.log("Error: getDocuments--",error);
            return false;
        }
    }

    //Storage Service
    async createFile(file){
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
    getFilePreview(fileId){
        return this.storage.getFilePreview(conf.appwriteBucketId,fileId).href
    }

}
const service = new Service();
export default service;
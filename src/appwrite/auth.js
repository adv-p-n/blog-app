import { Account, Client, ID } from "appwrite"
import conf from "../conf/conf.js"

export class AuthService {
    client=new Client()
    account;
    constructor() {
        this.client.setEndpoint(conf.appwriteUrl).setProject(conf.appwriteProjectId);
        this.account=new Account(this.client);
    }
    async createAccount(username,email,password){
        try {
            await this.account.create(ID.unique(),email,password,username);
        } catch (error) {
            console.log("Error: CreateAccount--",error)
        }
    }
    async login(email,password){
        try {
            await this.account.createEmailPasswordSession(email,password);
        } catch (error) {
            console.log("Error: Login--",error)
        }
    }
    async getCurrentUSer(){
        try {
            await this.account.get();
        } catch (error) {
            console.log("Error: GetUser--",error)
        }
    }
    async logOut(){
        try {
            await this.account.deleteSessions();
        } catch (error) {
            console.log("Error: LogOut--",error)
        }
    }
}
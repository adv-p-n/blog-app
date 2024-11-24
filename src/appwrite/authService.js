import { Account, Client, ID } from "appwrite";
import conf from "../conf/conf.js";

export class AuthService {
  client = new Client();
  account;
  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.account = new Account(this.client);
  }
  async createAccount(username, email, password) {
    try {
      const userAccount = await this.account.create(
        ID.unique(),
        email,
        password,
        username
      );
      if (userAccount) {
        const currentUser = await this.getCurrentUSer();

        // If the user is already logged in, don't try to log them in again
        if (!currentUser) {
          return this.login(email, password);
        } else {
          return currentUser;
        }
      } else {
        return userAccount;
      }
    } catch (error) {
      console.log("Error: CreateAccount--", error);
    }
  }
  async login(email, password) {
    try {
        const currentUser = await this.getCurrentUSer();

        // If a user is already logged in, return the current session/user without creating a new one
        if (currentUser) {
          return currentUser;
        }
    
        // If no session exists, create a new session
        return await this.account.createEmailPasswordSession(email, password);
    } catch (error) {
      console.log("Error: Login--", error);
    }
  }
  async getCurrentUSer() {
    try {
      return await this.account.get();
    } catch (error) {
      console.log("Error: GetUser--", error);
    }
  }
  async logOut() {
    try {
      await this.account.deleteSessions();
    } catch (error) {
      console.log("Error: LogOut--", error);
    }
  }
}

const authService = new AuthService();
export default authService;

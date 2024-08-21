import { User } from "../models/definition";

export let staticUser: User | null;

export function setStaticUser(user: User) {
  staticUser = user;
}

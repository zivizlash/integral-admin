import { User } from "../models/definition";

export let staticApiBase: string | null;
export let staticUser: User | null;

export function setStaticApiBase(apiBase: string) {
  staticApiBase = apiBase;
}

export function setStaticUser(user: User) {
  staticUser = user;
}

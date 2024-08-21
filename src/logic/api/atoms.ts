import { atom } from "jotai";
import { User } from "../models/definition";

export const accessTokenAtom = atom("");
export const userAtom = atom<User>();

import { atom } from "jotai";
import { User } from "../models/definition";

export const userAtom = atom<User>();
export const apiBaseAtom = atom<string>();

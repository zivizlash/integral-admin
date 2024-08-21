"use client";

import { useState, useEffect } from "react";

const refreshTokenKey = "userRefreshToken";
const accessTokenKey = "userAccessToken";
const lastAccessedRefreshTokenKey = "userLastRefreshToken";

let accessToken: string | null = null;

export function getRefreshToken(): string | null {
  return localStorage.getItem(refreshTokenKey);
}

export function getAccessToken(): string | null {
  if (accessToken != null) {
    return accessToken;
  }

  if (typeof window !== 'undefined')
  {
    const storageAccessToken = localStorage.getItem(accessTokenKey);

    if (storageAccessToken != null) {
      accessToken = storageAccessToken;
      return accessToken;
    }
  }

  return null;
}

export function setLastAccessedRefreshToken(refresh: string) {
  localStorage.setItem(lastAccessedRefreshTokenKey, refresh);
}

export function isRefreshTokenAlreadyAccessed(): boolean {
  const refreshToken = localStorage.getItem(refreshTokenKey) ?? "";

  if (refreshToken === "") {
    return true;
  }

  const lastToken = localStorage.getItem(lastAccessedRefreshTokenKey) ?? "";
  return lastToken === refreshToken;
}

export function setStorageTokens(access: string, refresh: string) {
  localStorage.setItem(accessTokenKey, access);
  localStorage.setItem(refreshTokenKey, refresh);
}

import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "./DecodedToken";

export const getUserIdFromJWT = (token: string): string | null => {
  try {
    const decoded: DecodedToken = jwtDecode(token);
    return decoded.userId;
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return null;
  }
};

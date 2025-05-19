/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useState, useEffect } from "react";

export function useUser() {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const { data } = await axios.get(
          `https://devdistruct.com/api/api/auth/me`,
          {
            withCredentials: true
          }
        );
        setUser(data);
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  return { user, isAuthenticated, loading };
}

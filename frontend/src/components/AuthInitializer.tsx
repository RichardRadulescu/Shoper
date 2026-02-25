import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchCurrentUser } from "../slices/authSlice";

export default function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchCurrentUser() as any);
  }, [dispatch]);
  return <>{children}</>;
}

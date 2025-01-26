"use client";

// import { clientApi } from "../../lib/api/clientApi";
import { useUser } from "../../components/provider/UserContext";

export default function LikesPage() {
  const { userId } = useUser();

  console.log(userId);

  return (
    <div>
      <h1>Likes</h1>
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { clientApi } from "../api/clientApi";
import type { KeymapToShare, User } from "../../app/api/types";

interface UseMyPageDataOptions {
  userId?: string | null;
}

interface KeymapSummaryItem {
  keymap_id: string;
  keymap_name: string;
  updated_at: string;
  created_at: string;
}

interface LikeSummaryItem {
  share_id: string;
  keymap_name: string;
  author_id: string;
}

interface SharedSummaryItem {
  share_id: string;
  keymap_name: string;
  created_at: string;
  updated_at?: string;
}

interface UserProfile {
  user_id: string;
  user_email: string;
  user_name: string;
  created_at: string;
  updated_at?: string;
}

interface UseMyPageDataResult {
  isLoading: boolean;
  error: unknown;
  keymaps: KeymapSummaryItem[];
  sharedKeymaps: SharedSummaryItem[];
  likedKeymaps: LikeSummaryItem[];
  userProfile: UserProfile | null;
}

const sortByRecent = <T extends { updated_at?: string; created_at?: string }>(
  items: T[]
): T[] => {
  return [...items].sort((a, b) => {
    const dateB = new Date(b.updated_at ?? b.created_at ?? 0).getTime();
    const dateA = new Date(a.updated_at ?? a.created_at ?? 0).getTime();
    return dateB - dateA;
  });
};

export const useMyPageData = ({
  userId,
}: UseMyPageDataOptions): UseMyPageDataResult => {
  const api = useMemo(() => clientApi(), []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [keymaps, setKeymaps] = useState<KeymapSummaryItem[]>([]);
  const [sharedKeymaps, setSharedKeymaps] = useState<SharedSummaryItem[]>([]);
  const [likedKeymaps, setLikedKeymaps] = useState<LikeSummaryItem[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!userId) return;

    let cancelled = false;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [userResRaw, keymapRes, sharedResRaw, likedRes] =
          await Promise.all([
            api.users.getUser({ user_id: userId }),
            api.keymaps.getKeymapsByUser({ user_id: userId }),
            api.keymaps_to_share.getKeymapsToShareByUser({ author_id: userId }),
            api.likes.getLikesByUser({ user_id: userId }),
          ]);

        if (cancelled) return;

        const userRes = userResRaw as User;
        const sharedRes = sharedResRaw as unknown as KeymapToShare[];

        setUserProfile({
          user_id: userRes.user_id,
          user_email: userRes.user_email,
          user_name: userRes.user_name,
          created_at: userRes.created_at,
          updated_at: userRes.updated_at,
        });

        setKeymaps(
          sortByRecent(
            keymapRes.map((item) => ({
              keymap_id: item.keymap_id,
              keymap_name: item.keymap_name,
              created_at: item.created_at,
              updated_at: item.updated_at,
            }))
          )
        );

        setSharedKeymaps(
          sortByRecent(
            sharedRes.map((item) => ({
              share_id: item.share_id,
              keymap_name: item.keymap_name,
              created_at: item.created_at,
              updated_at: item.updated_at,
            }))
          )
        );

        setLikedKeymaps(
          sortByRecent(
            likedRes.map((item) => ({
              share_id: item.share_id,
              keymap_name: item.keymap_name,
              author_id: item.author_id,
              created_at: item.created_at,
              updated_at: item.updated_at,
            }))
          )
        );
      } catch (err) {
        if (cancelled) return;
        setError(err);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [api, userId]);

  return {
    isLoading,
    error,
    keymaps,
    sharedKeymaps,
    likedKeymaps,
    userProfile,
  };
};

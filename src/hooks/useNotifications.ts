import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface AppNotification {
  id: string;
  user_id: string;
  event_key: string;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  read_at: string | null;
  created_at: string;
}

export const useNotifications = () => {
  const { user } = useAuth();
  const qc = useQueryClient();
  const key = ["notifications", user?.id];

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: key,
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return (data ?? []) as AppNotification[];
    },
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: key });

  const markAsRead = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("notifications")
        .update({ read_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const markAsUnread = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("notifications")
        .update({ read_at: null })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const markAllAsRead = useMutation({
    mutationFn: async () => {
      if (!user) return;
      const { error } = await supabase
        .from("notifications")
        .update({ read_at: new Date().toISOString() })
        .eq("user_id", user.id)
        .is("read_at", null);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("notifications").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const unreadCount = notifications.filter((n) => !n.read_at).length;

  return {
    notifications,
    isLoading,
    unreadCount,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    remove,
    invalidate,
  };
};

/**
 * Cria uma notificação idempotente (dedupe por event_key + user_id).
 */
export const createNotification = async (params: {
  userId: string;
  eventKey: string;
  title: string;
  body?: string;
  link?: string;
  type?: string;
}) => {
  const { error } = await supabase.from("notifications").insert({
    user_id: params.userId,
    event_key: params.eventKey,
    title: params.title,
    body: params.body ?? null,
    link: params.link ?? null,
    type: params.type ?? "info",
  });
  // 23505 = violação de unicidade (notificação já registrada)
  if (error && error.code !== "23505") throw error;
  return !error;
};

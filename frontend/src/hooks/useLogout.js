import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../lib/api";
import { useUnreadStore } from "../store/useUnreadStore";

const useLogout = () => {
  const queryClient = useQueryClient();

  const { clearAllUnread } = useUnreadStore();

  const {
    mutate: logoutMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clearAllUnread();
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  return { logoutMutation, isPending, error };
};
export default useLogout;
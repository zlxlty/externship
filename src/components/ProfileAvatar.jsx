/* eslint-disable react/prop-types */
import { useLogin } from "../hooks/auth/useLogin";
import { useAuthStore } from "../stores/authStore";
import { useShallow } from "zustand/react/shallow";

export default function ProfileAvatar({ className }) {
  const googleLogin = useLogin();
  const [currentUser, logoutUser] = useAuthStore(
    useShallow((state) => [state.currentUser, state.logoutUser])
  );

  return (
    <main className={className}>
      {!currentUser ? (
        <button onClick={() => googleLogin()} className="btn">
          Log in
        </button>
      ) : (
        <>
          <div className="dropdown dropdown-hover dropdown-end">
            <img
              src={currentUser.picture}
              tabIndex={0}
              role="button"
              className="btn w-12 h-12 p-0 rounded-full"
            />
            <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-40">
              <li>
                <a>Settings</a>
              </li>
              <li>
                <a onClick={logoutUser}>Sign Out</a>
              </li>
            </ul>
          </div>
        </>
      )}
    </main>
  );
}

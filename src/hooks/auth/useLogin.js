import { useGoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '../../stores/authStore';
import axios from 'axios';

export function useLogin() {

  const loginUser = useAuthStore(state => state.loginUser);
  const googleLogin = useGoogleLogin({
    onSuccess: async tokenResponse => {
      console.log(tokenResponse);
      // fetching userinfo can be done on the client or the server
      const userInfo = await axios
        .get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        })
        .then(res => res.data);

      loginUser(userInfo)
      console.log(userInfo);
    },
    // flow: 'implicit', // implicit is the default
  });

  return googleLogin;
}

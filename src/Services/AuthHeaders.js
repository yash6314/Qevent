import Cookies from 'js-cookie';

export const getAuthHeaders = () => {
  const headers = Cookies.get('token');
  if (headers) {
    return {
      token: headers,
    };
  } else {
    return {};
  }
};

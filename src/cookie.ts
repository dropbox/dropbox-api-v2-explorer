/* The files contains helper functions to interact with cookie storage. This will be
   used a fallback when session/local storage is not allowed (safari private browsing
   mode etc.)
 */

type StringMap = { [index: string]: string };

export const setItem = (key: string, item: string): void => {
  document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(item)}`;
};

export const getItem = (key: string) : any => {
  const dict = getAll();
  return dict[key];
};

export const getAll = (): StringMap => {
  const dict : StringMap = {};
  const cookies: string[] = document.cookie.split('; ');

  cookies.forEach((value) => {
    if (value.length > 0) {
      const items: string[] = value.split('=');
      dict[decodeURIComponent(items[0])] = decodeURIComponent(items[1]);
    }
  });

  return dict;
};

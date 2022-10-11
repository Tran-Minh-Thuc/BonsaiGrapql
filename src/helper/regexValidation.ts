export const phoneRegex = new RegExp("^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$");
export const passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})");
export const emailRegex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
export const usernameRegex = new RegExp('^[a-zA-Z ]+$');
export const activeCodeRegex = new RegExp("^[0-9]{6,}");
export const imageRegex = new RegExp("\.(jpg|jpeg|png|svg)");
export const fetchUser = () => {
    const user = localStorage.getItem('user') !== 'undefined' ? JSON.parse(localStorage.getItem("user")): localStorage.clear()


    return user;
}

export const baseUrl = "https://pixel-2eyf.onrender.com/";
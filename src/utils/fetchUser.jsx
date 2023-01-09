export const fetchUser = () => {
    const user = localStorage.getItem('user') !== 'undefined' ? JSON.parse(localStorage.getItem("user")): localStorage.clear()


    return user;
}

export const baseUrl = "http://13.233.150.234:5000/";
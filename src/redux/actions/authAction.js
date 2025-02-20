import { getDataAPI, patchDataAPI, postDataAPI } from '../../api/fetchData';
import GetNotification from '../../utils/GetNotification';
import axios from 'axios';
export const TYPES = {
    AUTH: 'AUTH',
    CART: 'CART',
    DE_CART: 'DE_CART',
    UPDATE_USER: 'UPDATE_USER',
    SOCKET: 'SOCKET',
};

export const login = (data) => async (dispatch) => {
    try {
        dispatch({ type: 'LOADING', payload: true });

        const res = await postDataAPI('login', { email: data.username, password: data.password });

        if (res.status === 200) {
            dispatch({ type: 'AUTH', payload: { token: res.data.access_token, user: res.data.user } });
            localStorage.setItem('firstLogin', true);
            GetNotification(res.data.msg);
        }
        dispatch({ type: 'LOADING', payload: false });
    } catch (err) {
        dispatch({ type: 'LOADING', payload: false });
        GetNotification(err.response.data.msg, 'error');
    }
};

// create function register
export const register = (data) => async (dispatch) => {
    const { re_password, showPassword, showRePassword, ...rest } = data;
    try {
        dispatch({ type: 'LOADING', payload: true });
        // call api register
        const res = await postDataAPI('register', rest);
        // if success
        if (res.status === 200) {
            dispatch({ type: 'AUTH', payload: { token: res.data.access_token, user: res.data.user } });
            localStorage.setItem('firstLogin', true);
            GetNotification(res.data.msg);
        }
        dispatch({ type: 'LOADING', payload: false });
    } catch (err) {
        dispatch({ type: 'LOADING', payload: false });
        GetNotification(err.response.data.msg, 'error');
    }
};

// create function logout
export const logout = () => async (dispatch) => {
    try {
        // dispatch({ type: 'LOADING', payload: true });
        // call api logout
        const res = await postDataAPI('logout');
        // if success
        if (res.status === 200) {
            localStorage.removeItem('firstLogin');
            window.location.href = '/';
        }
        // dispatch({ type: 'LOADING', payload: false });
    } catch (err) {
        dispatch({ type: 'LOADING', payload: false });
        GetNotification(err.response.data.msg, 'error');
    }
};

export const refreshToken = () => async (dispatch) => {
    const firstLogin = localStorage.getItem('firstLogin');
    if (firstLogin) {
        dispatch({ type: 'LOADING', payload: true });
        try {
            const res = await getDataAPI('refresh_token');
            if (res.status === 200) {
                dispatch({ type: 'AUTH', payload: { token: res.data.access_token, user: res.data.user } });
            }
            dispatch({ type: 'LOADING', payload: false });
        } catch (err) {
            dispatch({ type: 'LOADING', payload: false });
            GetNotification(err.response.data.msg, 'error');
        }
    }
};

export const addCart = (data) => async (dispatch) => {
    const { loged, product, cart, token } = data;
    if (!loged) {
        GetNotification('Hãy đăng nhập trước khi mua sản phẩm', 'error');
    }

    const check = cart.every((item) => {
        return item._id !== product._id;
    });

    if (check) {
        product
            ? dispatch({ type: 'CART', payload: { ...product, quantity: 1 } })
            : dispatch({ type: 'DE_CART', payload: cart });

        const res = await patchDataAPI(
            'addcart',
            { cart: product ? [...cart, { ...product, quantity: 1 }] : cart },
            token
        );
        if (res.status === 200) {
            product && GetNotification(res.data.msg, 'success');
        }
    } else {
        GetNotification('Sản phẩm đã có trong giỏ hàng!', 'warning');
    }
};

export const rmCart = (token) => async (dispatch) => {
    dispatch({ type: 'DE_CART', payload: [] });
    await patchDataAPI('addcart', { cart: [] }, token);
};

export const addSocket = (socket) => async (dispatch) => {
    dispatch({ type: 'SOCKET', payload: socket });
};

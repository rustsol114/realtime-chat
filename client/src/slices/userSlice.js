import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import userService from '../services/userService'

const initialState = {
    allUsers: [],
    activeUrl: '',
    profileSidebar: false,
    menuSidebar: false,
    serverSidebar: false
}

//all users
export const getUsers = createAsyncThunk(
    'usersSlice/all',
    async (_, thunkApi) => {
        try {
            const userId = thunkApi.getState().auth.user._id
            return await userService.allUsers(`/user/${userId}`)
        } catch (err) {
            const message = (err.response && err.response.data && err.response.data.message) || err.message || err.toString()
            return thunkApi.rejectWithValue(message)
        }
    }
)

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setUrl: (state, action) => {
            state.activeUrl = action.payload
        },
        setProfileSidebar: (state, action) => {
            state.profileSidebar = action.payload
        },
        setMenuSidebar: (state, action) => {
            state.menuSidebar = action.payload
        },
        setServerSidebar: (state, action) => {
            state.serverSidebar = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUsers.fulfilled, (state, action) => {
                state.allUsers = action.payload
            })
            .addCase('auth/logout', (state) => {
                state.allUsers = []
            })
    }
})

export const { setUrl, setServerSidebar, setMenuSidebar, setProfileSidebar } = usersSlice.actions
export default usersSlice.reducer
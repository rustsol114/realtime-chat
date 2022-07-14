import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import requestService from '../services/requestService'

const initialState = {
    requests: [],
    requestLoading: false,
    requestSuccess: false,
    requestError: false,
    requestMessage: '',
    deleteRequest: null
}

//all requests
export const allRequests = createAsyncThunk(
    'requestSlice/all',
    async (_, thunkApi) => {
        try {
            const userId = thunkApi.getState().auth.user._id
            return await requestService.allRequests(`/request/${userId}`)
        } catch (err) {
            const message = (err.response && err.response.data && err.response.data.message) || err.message || err.toString()
            return thunkApi.rejectWithValue(message)
        }
    }
)

//delete request
export const deleteRequest = createAsyncThunk(
    'requestSlice/delete',
    async (reqData, thunkApi) => {
        try {
            const userId = thunkApi.getState().auth.user._id
            return await requestService.deleteRequest(`/request/${userId}`, reqData)
        } catch (err) {
            const message = (err.response && err.response.data && err.response.data.message) || err.message || err.toString()
            return thunkApi.rejectWithValue(message)
        }
    }
)

const requestSlice = createSlice({
    name: 'request',
    initialState,
    reducers: {
        requestReset: (state) => {
            state.requestError = false
            state.requestLoading = false
            state.requestSuccess = false
            state.requestMessage = ''
        },
        newRequest: (state, action) => {
            state.requests = [...state.requests, action.payload]
        },
        requestDelete: (state, action) => {
            state.requests = state.requests.filter(req => req._id !== action.payload)
        },
        requestDeleteReset: (state) => {
            state.deleteRequest = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(allRequests.pending, (state) => {
                state.requestLoading = true
            })
            .addCase(allRequests.fulfilled, (state, action) => {
                state.requestLoading = false
                state.requests = action.payload
            })
            .addCase(deleteRequest.fulfilled, (state, action) => {
                const req = state.requests.find(r => r._id === action.payload.reqId)

                state.requestSuccess = true
                state.requestMessage = action.payload.message.msgForReceiver
                state.requests = state.requests.filter(req => req._id !== action.payload.reqId)

                state.deleteRequest = { requestId: req._id, senderId: req.senderId, reqMsg: action.payload.message.msgForSender }
            })
            .addCase(deleteRequest.rejected, (state, action) => {
                state.requestError = true
                state.requestMessage = action.payload
            })
            .addCase('auth/logout', (state) => {
                state.requests = []
            })
    }
})

export const { requestReset, newRequest, requestDelete, requestDeleteReset } = requestSlice.actions
export default requestSlice.reducer
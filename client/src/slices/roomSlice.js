import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import roomService from '../services/roomService'

const initialState = {
    rooms: [],
    roomSuccess: false,
    roomError: false,
    roomMessage: '',
    currentRoomId: '',
    leaveRoomSuccess: false,
    leaveRoomError: false,
    leaveRoomMessage: '',
    leavedRoom: null
}

//get rooms
export const allRooms = createAsyncThunk(
    'roomSlice/all',
    async (_, thunkApi) => {
        try {
            const userId = thunkApi.getState().auth.user._id
            return await roomService.allRooms(`/room/${userId}`)
        } catch (err) {
            const message = (err.response && err.response.data && err.response.data.message) || err.message || err.toString()
            return thunkApi.rejectWithValue(message)
        }
    }
)

//create a room
export const newRoom = createAsyncThunk(
    'roomSlice/new',
    async (roomData, thunkApi) => {
        try {
            const userId = thunkApi.getState().auth.user._id
            return await roomService.createRoom(`/room/${userId}`, roomData)
        } catch (err) {
            const message = (err.response && err.response.data && err.response.data.message) || err.message || err.toString()
            return thunkApi.rejectWithValue(message)
        }
    }
)

//join a room
export const joinARoom = createAsyncThunk(
    'roomSlice/join',
    async (roomId, thunkApi) => {
        try {
            const userId = thunkApi.getState().auth.user._id
            return await roomService.joinRoom(`/room/${userId}`, roomId)
        } catch (err) {
            const message = (err.response && err.response.data && err.response.data.message) || err.message || err.toString()
            return thunkApi.rejectWithValue(message)
        }
    }
)

//leave a room
export const leaveRoom = createAsyncThunk(
    'roomSlice/leave',
    async (roomId, thunkApi) => {
        try {
            const userId = thunkApi.getState().auth.user._id
            return await roomService.leaveRoom(`/room/${userId}/${roomId}`)
        } catch (err) {
            const message = (err.response && err.response.data && err.response.data.message) || err.message || err.toString()
            return thunkApi.rejectWithValue(message)
        }
    }
)

const roomSlice = createSlice({
    name: 'room',
    initialState,
    reducers: {
        roomReset: (state) => {
            state.roomSuccess = false
            state.roomError = false
            state.roomMessage = ''
            state.currentRoomId = ''
        },
        leaveRoomReset: (state) => {
            state.leaveRoomSuccess = false
            state.leaveRoomError = false
            state.leaveRoomMessage = ''
        },
        joinRoom: (state, action) => {
            state.rooms = state.rooms.map(room => {
                if (room._id === action.payload._id) return action.payload
                return room
            })
        },
        leavedRoomReset: (state) => {
            state.leavedRoom = null
        },
        leavedRoom: (state, action) => {
            state.rooms = state.rooms.map(room => {
                if (room._id === action.payload.room._id) {
                    room.members.splice(room.members.indexOf(action.payload.userId), 1)
                    return room
                }
                return room
            })
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(newRoom.fulfilled, (state, action) => {
                state.rooms = [...state.rooms, action.payload.newRoom]
                state.roomSuccess = true
                state.roomMessage = action.payload.message
                state.currentRoomId = action.payload.newRoom._id
            })
            .addCase(newRoom.rejected, (state, action) => {
                state.roomError = true
                state.roomMessage = action.payload
            })
            .addCase(joinARoom.fulfilled, (state, action) => {
                state.rooms = [...state.rooms, action.payload.room]
                state.roomSuccess = true
                state.roomMessage = action.payload.message
                state.currentRoomId = action.payload.room._id
            })
            .addCase(joinARoom.rejected, (state, action) => {
                state.roomError = true
                state.roomMessage = action.payload
            })
            .addCase(allRooms.fulfilled, (state, action) => {
                state.rooms = action.payload
            })
            .addCase(leaveRoom.fulfilled, (state, action) => {
                const room = state.rooms.find(r => r._id === action.payload.roomId)
                state.rooms = state.rooms.filter(r => r._id !== action.payload.roomId)
                state.leaveRoomSuccess = true
                state.leaveRoomMessage = action.payload.message
                state.leavedRoom = room
            })
            .addCase(leaveRoom.rejected, (state, action) => {
                state.leaveRoomError = true
                state.leaveRoomMessage = action.payload
            })
            .addCase('auth/logout', (state) => {
                state.rooms = []
            })
    }
})

export const { roomReset, leaveRoomReset, joinRoom, leavedRoomReset, leavedRoom } = roomSlice.actions
export default roomSlice.reducer
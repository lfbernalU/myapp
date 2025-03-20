import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchHabits } from './habitsAPI';


type Habit = {
    _id: string;
    title: string;
    description: string;
    createdAt: Date;
    days: number;
    lastDone: Date;
    lastUpdated: Date;
}

type HabitState = {
    habits: Habit[];
    status: Record<string, "idle" | "loading" | "success" | "failed">;
    error: Record<string, string | null>;
}

const initialState: HabitState = {
    habits: [],
    status: {},
    error: {},
}

export const fetchHabitsThunk = createAsyncThunk('habit/fetchHabits', async () => {
    const response = await fetchHabits();
    const responseJSON = await response.json();
    return responseJSON;
});

export const markAsDoneThunk = createAsyncThunk('habit/markHabitDone', async (habitId: string, { rejectWithValue }) => {

    const response = await fetch(`http://localhost:3000/habits/markasdone/${habitId}`, {
        method: 'PATCH',
    });

    const responseJson = await response.json();
    if (!response.ok) {
        return rejectWithValue('Failed to mark habit as done');
    } else if (responseJson.message.toString === 'Habit restarted') {
        return rejectWithValue(responseJson.message);
    } else {
        return responseJson.message;
    }

});

const habitSlice = createSlice({
    name: 'habits',
    initialState,
    reducers: {
        addHabits: (state, action) => {
            state.habits = action.payload;
        }
    },
    extraReducers: builder => {
        builder.addCase(fetchHabitsThunk.fulfilled, (state, action) => {
            state.habits = action.payload;
        }).addCase(markAsDoneThunk.fulfilled, (state, action) => {
            state.status[action.meta.arg] = 'success';
            state.error[action.meta.arg] = null;
        }).addCase(markAsDoneThunk.rejected, (state, action) => {
            state.status[action.meta.arg] = 'failed';
            state.error[action.meta.arg] = action.payload as string;
        })
    }
})

export const { addHabits } = habitSlice.actions;
export default habitSlice.reducer;

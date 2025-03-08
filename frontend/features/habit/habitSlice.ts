import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchHabits } from './habitsAPI';


type Habit = {
    _id: string;
    title: string;
    description: string;
    done: boolean;
}

type HabitState = {
    habits: Habit[];
}

const initialState: HabitState = {
    habits: []
}

export const fetchHabitsThunk = createAsyncThunk('habit/fetchHabits', async () => {
    const response = await fetchHabits();
    const responseJSON = await response.json();
    return responseJSON;
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
        }
    )} 
})

export const { addHabits } = habitSlice.actions;
export default habitSlice.reducer;

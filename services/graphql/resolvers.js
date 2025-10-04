import mongoose from "mongoose";
import Habit from "../../models/habit.js";
import User from "../../models/user.js";

const resolvers = {
  Query: {
    getUser: async (parent, args, context) => {
      const { user } = context;
      const getUser = await User.findById(user.id);
      if (getUser) {
        return getUser;
      }
    },

    getHabits: async (parent, args, context) => {
      const { user } = context;
      if (user) {
        const habits = await Habit.find({
          userId: new mongoose.Types.ObjectId(user.id),
        });
        if (habits) {
          return habits;
        }
      }
    },
    getHabit: async (parent, { id }, context) => {
      const { user } = context;
      if (user) {
        const habit = await Habit.findById(id);
        if (habit) {
          return habit;
        }
      }
    },
  },
  Mutation: {
    createUser: async (parent, args, context) => {
      const { name, email, password } = args.input;

      const createUser = await User.create({
        name,
        email,
        password,
      });
      return createUser;
    },
    loginUser: async (parent, args, context) => {
      const { email, password } = args.input;
      const { res } = context;
      const token = await User.matchPassordAndValidateToken(email, password);
      res.cookie("token", token, {
        httpOnly: true, // client-side JS cannot access
        secure: true, // must be true for HTTPS
        sameSite: "None", // allows cross-site cookie
      });
      return true;
    },
    logoutUser: async (parent, args, context) => {
      const { user, req, res } = context;
      if (user) {
          res.setHeader("Set-Cookie", "token=; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=0");
        return true;
      }
    },
    createHabit: async (parent, args, context) => {
      const { user } = context;
      const { title, category, frequency, selectedDays } = args.input;
      if (user) {
        const createHabit = await Habit.create({
          userId: user.id,
          title,
          category,
          frequency,
          selectedDays:
            frequency === "Daily"
              ? [
                  "sunday",
                  "monday",
                  "tuesday",
                  "wednesday",
                  "thursday",
                  "friday",
                  "saturday",
                ]
              : selectedDays,
          completedDates: [],
        });
        return createHabit;
      }
    },
    editHabit: async (parent, args, context) => {
      const { user } = context;
      const { id, title, category, frequency, selectedDays, completedDates } =
        args.input;
      if (user) {
        const editHabit = await Habit.findByIdAndUpdate(
          id,
          {
            $set: {
              title,
              category,
              frequency,
              selectedDays:
                frequency === "Daily"
                  ? [
                      "sunday",
                      "monday",
                      "tuesday",
                      "wednesday",
                      "thursday",
                      "friday",
                      "saturday",
                    ]
                  : selectedDays,
            },
          },
          { new: true }
        );

        return editHabit;
      }
    },
    updateCompleteDates: async (parent, args, context) => {
      const { user } = context;
      const { completedDates, id } = args.input;
      const habit = await Habit.findById(id);
      const updatedCompletedDates = [...habit.completedDates, completedDates];
      if (user) {
        const updateHabit = await Habit.findByIdAndUpdate(
          id,
          {
            completedDates: updatedCompletedDates,
          },
          { new: true }
        );
        return updateHabit;
      }
    },
    updateStreak: async (parent, args, context) => {
      const { id, streak, longestStreak } = args.input;
      const { user } = context;
      if (user) {
        const updateStreak = await Habit.findByIdAndUpdate(
          id,
          {
            streak: streak,
            longestStreak: longestStreak,
          },
          { new: true }
        );
        return updateStreak;
      }
    },
    deleteHabit: async (parent, args, context) => {
      const { id } = args;
      const { user } = context;
      if (user && id) {
        const deleteHabit = await Habit.findByIdAndDelete(id, { new: true });
        return deleteHabit;
      }
    },
  },
};
export default resolvers;

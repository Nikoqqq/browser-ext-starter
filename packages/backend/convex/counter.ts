import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: { name: v.string() },
  handler: async (ctx, { name }) => {
    const counter = await ctx.db
      .query("counters")
      .withIndex("by_name", (q) => q.eq("name", name))
      .unique();
    return counter ?? { name, value: 0 };
  },
});

export const increment = mutation({
  args: { name: v.string() },
  handler: async (ctx, { name }) => {
    const counter = await ctx.db
      .query("counters")
      .withIndex("by_name", (q) => q.eq("name", name))
      .unique();
    if (counter) {
      await ctx.db.patch(counter._id, { value: counter.value + 1 });
    } else {
      await ctx.db.insert("counters", { name, value: 1 });
    }
  },
});

export const decrement = mutation({
  args: { name: v.string() },
  handler: async (ctx, { name }) => {
    const counter = await ctx.db
      .query("counters")
      .withIndex("by_name", (q) => q.eq("name", name))
      .unique();
    if (counter) {
      await ctx.db.patch(counter._id, { value: counter.value - 1 });
    } else {
      await ctx.db.insert("counters", { name, value: -1 });
    }
  },
});

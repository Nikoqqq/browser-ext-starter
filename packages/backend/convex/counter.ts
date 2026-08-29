import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: { name: v.string() },
  returns: v.object({ name: v.string(), value: v.number() }),
  handler: async (ctx, { name }) => {
    const counter = await ctx.db
      .query("counters")
      .withIndex("by_name", (q) => q.eq("name", name))
      .unique();
    return { name, value: counter?.value ?? 0 };
  },
});

export const increment = mutation({
  args: { name: v.string() },
  returns: v.null(),
  handler: async (ctx, { name }) => {
    const counter = await ctx.db
      .query("counters")
      .withIndex("by_name", (q) => q.eq("name", name))
      .unique();
    if (counter) {
      await ctx.db.patch("counters", counter._id, {
        value: counter.value + 1,
      });
    } else {
      await ctx.db.insert("counters", { name, value: 1 });
    }
    return null;
  },
});

export const decrement = mutation({
  args: { name: v.string() },
  returns: v.null(),
  handler: async (ctx, { name }) => {
    const counter = await ctx.db
      .query("counters")
      .withIndex("by_name", (q) => q.eq("name", name))
      .unique();
    if (counter) {
      await ctx.db.patch("counters", counter._id, {
        value: counter.value - 1,
      });
    } else {
      await ctx.db.insert("counters", { name, value: -1 });
    }
    return null;
  },
});

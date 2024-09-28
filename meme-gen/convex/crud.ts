import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const UploadMeme = mutation({
  // Define the structure for the mutation input
  args: { 
    body: v.string() 
  },
  
  // The handler function that interacts with the database
  handler: async (ctx, { body }) => {
    // Insert the meme into the "meme" table
    const data = await ctx.db.insert("meme", {
      body: body
    });

    return data;
  },
});

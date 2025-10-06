import express from "express";
import Idea from "../models/Idea.js";
import mongoose from "mongoose";

const router = express.Router();

// @route           GET /api/ideas
// @description     Get all ideas
// @access          Public
// @query           _limit (optional limit for ideas returned) 
router.get("/", async (req, res, next) => {
  try {
    const limit = parseInt(req.query._limit);
    const query = Idea.find().sort({createdAt: -1});

    if(!isNaN(limit)) {
        query.limit(limit);
    }

    const ideas = await query.exec();
    res.json(ideas);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// @route           GET /api/ideas/:id
// @description     Get single idea
// @access          Public
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404);
      throw new Error("Idea Not Found");
    }

    const idea = await Idea.findById(id);

    if (!idea) {
      res.status(404);
      throw new Error("Idea Not Found");
    }

    res.json(idea);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// @route           POST /api/ideas
// @description     Create new idea
// @access          Public
router.post("/", async (req, res, next) => {
  try {
    const { title, summary, description, tags } = req.body;

    if (!title?.trim() || !summary?.trim() || !description?.trim()) {
      res.status(400);
      throw new Error("Title, summary and description are required");
    }

    const newIdea = new Idea({
      title: title,
      summary: summary,
      description: description,
      tags:
        typeof tags === "string"
          ? tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
          : Array.isArray(tags)
          ? tags
          : [],
    });

    const savedIdea = await newIdea.save();
    res.status(201).json(savedIdea);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// @route           DELETE /api/ideas/:id
// @description     DELETE single idea
// @access          Public
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404);
      throw new Error("Idea Not Found");
    }

    const idea = await Idea.findByIdAndDelete(id);

    if (!idea) {
      res.status(404);
      throw new Error("Idea Not Found");
    }

    res.json({ message: "Idea deleted successfully" });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// @route           PUT /api/ideas/:id
// @description     Edit single idea
// @access          Public
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404);
      throw new Error("Idea Not Found");
    }

    const { title, summary, description, tags } = req.body;

    if (!title?.trim() || !summary?.trim() || !description?.trim()) {
      res.status(400);
      throw new Error("Title, summary and description are required");
    }

    const updatedIda = await Idea.findByIdAndUpdate(
      id,
      {
        title,
        summary,
        description,
        tags: Array.isArray(tags)
          ? tags
          : tags.split(",").map((tag) => tag.trim()),
      },
      { new: true, runValidators: true }
    );

    if (!updatedIda) {
      res.status(404);
      throw new Error("Idea not found");
    }

    res.json(updatedIda);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

export default router;

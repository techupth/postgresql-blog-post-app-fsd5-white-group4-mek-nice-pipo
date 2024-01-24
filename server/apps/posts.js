import { Router } from "express";
import { pool } from "../utils/db.js";

const postRouter = Router();

postRouter.get("/", async (req, res) => {
  /* const status = req.query.status;
  const keywords = req.query.keywords;
  const page = req.query.page; */

  try {
    const result = await pool.query("SELECT * FROM posts");
    return res.json({
      data: result.rows,
    });
  } catch (error) {
    return res.json({
      message: "Post not found.",
    });
  }
});

postRouter.get("/:id", async (req, res) => {
  const postId = req.params.id;
  try {
    const result = await pool.query("SELECT * FROM posts WHERE post_id=$1", [
      postId,
    ]);

    return res.json({
      data: result.rows[0],
    });
  } catch (error) {
    return res.json({
      message: "Post not found.",
    });
  }
});

postRouter.post("/", async (req, res) => {
  const hasPublished = req.body.status === "published";
  const newPost = {
    ...req.body,
    created_at: new Date(),
    updated_at: new Date(),
    published_at: hasPublished ? new Date() : null,
  };
  const category = "asdasd";

  await pool.query(
    `INSERT INTO posts (post_title, content, status, created_at, updated_at, published_at)
  VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      newPost.title,
      newPost.content,
      newPost.status,
      newPost.created_at,
      newPost.updated_at,
      newPost.published_at,
    ]
  );

  return res.json({
    message: "Post has been created.",
  });
});

postRouter.put("/:id", async (req, res) => {
  const hasPublished = req.body.status === "published";
  const postId = req.params.id;

  const updatedPost = {
    ...req.body,
    updated_at: new Date(),
    published_at: hasPublished ? new Date() : null,
  };

  try {
    await pool.query(
      "UPDATE posts SET post_title=$1, content=$2, status=$3, updated_at=$4, published_at=$5 WHERE post_id=$6",
      [
        updatedPost.title,
        updatedPost.content,
        updatedPost.status,
        updatedPost.updated_at,
        updatedPost.published_at,
        postId,
      ]
    );
    return res.json({
      message: `Post ${postId} has been updated.`,
    });
  } catch (error) {
    return res.json({
      message: `Post ${postId} not found.`,
    });
  }
});

postRouter.delete("/:id", async (req, res) => {
  const postId = req.params.id;

  try {
    await pool.query("DELETE FROM posts WHERE post_id=$1", [postId]);
    return res.json({
      message: `Post ${postId} has been deleted.`,
    });
  } catch (error) {
    return res.json({
      message: `Post ${postId} not found.`,
    });
  }
});

export default postRouter;

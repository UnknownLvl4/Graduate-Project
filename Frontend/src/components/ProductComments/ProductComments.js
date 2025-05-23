import React, { useState, useEffect } from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  TextField,
  Button,
} from "@mui/material";
import * as CustomerService from "../../services/customerService";

function ProductComments({ productId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = React.useCallback(async () => {
    try {
      const response = await CustomerService.default.getProductComments(
        productId
      );
      setComments(response);
    } catch (err) {
      setError(err.message || "Failed to fetch comments");
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    if (productId) fetchComments();
  }, [productId, fetchComments]);

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const response = await CustomerService.default.addProductComment({
        review_id: crypto.randomUUID(),
        product_id: productId,
        user_id: JSON.parse(localStorage.getItem("user")).id,
        comment: newComment,
      });
      setComments((prevComments) => [...prevComments, response]);
      setNewComment("");
    } catch (err) {
      setError(err.message || "Failed to submit comment");
    } finally {
      setSubmitting(false);
      fetchComments();
    }
  };

  if (loading) return <CircularProgress />;
  if (error || !JSON.parse(localStorage.getItem("user"))?.id)
    return (
      <Typography color="error">
        Xin hãy đăng nhập để có thể xem comment
      </Typography>
    );

  return (
    <>
      {comments.length === 0 && (
        <Typography>Hiện không có nhận xét nào</Typography>
      )}
      <List>
        {comments.map((comment, index) => (
          <React.Fragment key={comment.id}>
            <ListItem alignItems="flex-start">
              <ListItemText
                primary={
                  <>
                    <Typography variant="body1" component="span">
                      {comment.email}
                    </Typography>
                  </>
                }
                secondary={
                  <>
                    {new Date(comment.created_at).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    <br />
                    <Typography
                      component="span"
                      variant="body1"
                      color="textPrimary">
                      {comment.comment}
                    </Typography>
                  </>
                }
              />
            </ListItem>
            {index < comments.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
      <div style={{ marginTop: "1rem" }}>
        <TextField
          label="Nhập nhận xét của bạn"
          variant="outlined"
          fullWidth
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={submitting}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleCommentSubmit}
          style={{ marginTop: "0.5rem" }}
          disabled={submitting}>
          {submitting ? "Đang gửi nhận xét..." : "Gửi"}
        </Button>
      </div>
    </>
  );
}

export default ProductComments;

import Blog from "../models/Blog"

const fetchBlogs = async (): Promise<any> => {
  const blogsRes = await fetch('http://localhost:4000/api/blogs') as any;
  return await blogsRes.json();
}

const createBlog = async (blog: Blog)  => {
  await fetch('http://localhost:4000/api/blogs', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(blog),
  })
}

const deleteBlog = async (_id: string) => {
  await fetch(`http://localhost:4000/api/blogs/${_id}`, {
    method: "DELETE",
    headers: {
      'Content-Type': 'application/json',
    }
  })
}

const updateBlog = async (updatedBlog: Blog) => {
  await fetch(`http://localhost:4000/api/blogs/${updatedBlog._id}`, {
    method: "PUT",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedBlog),
  })
}

export { fetchBlogs, createBlog, deleteBlog, updateBlog }

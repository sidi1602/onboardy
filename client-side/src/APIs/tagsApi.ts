import Tag from "../models/Tag"

const fetchTags = async (): Promise<Tag[]> => {
  const tagsRes = await fetch('http://localhost:4000/api/tags') as any;
  return await tagsRes.json()
}

const createTag = async (tag: Tag)  => {
  await fetch('http://localhost:4000/api/tags', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(tag),
  })
}

const deleteTag = async (_id: string) => {
  await fetch(`http://localhost:4000/api/tags/${_id}`, {
    method: "DELETE",
    headers: {
      'Content-Type': 'application/json',
    }
  })
}

const updateTag = async (updatedTag: Tag) => {
  await fetch(`http://localhost:4000/api/tags/${updatedTag._id}`, {
    method: "PUT",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedTag),
  })
}

export { fetchTags, createTag, deleteTag, updateTag }

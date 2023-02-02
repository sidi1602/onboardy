import FAQ from "../models/FAQ"

const fetchFAQs = async (): Promise<FAQ[]> => {
  const faqsRes = await fetch('http://localhost:4000/api/faqs') as any;
  return await faqsRes.json();
}

const createFAQ = async (faq: FAQ) => {
  await fetch('http://localhost:4000/api/faqs', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(faq),
  })
}

const deleteFAQ = async (_id: string) => {
  await fetch(`http://localhost:4000/api/faqs/${_id}`, {
    method: "DELETE",
    headers: {
      'Content-Type': 'application/json',
    }
  })
}

const updateFAQ = async (updatedFAQ: FAQ) => {
  await fetch(`http://localhost:4000/api/faqs/${updatedFAQ._id}`, {
    method: "PUT",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedFAQ),
  })
}

export { fetchFAQs, createFAQ, deleteFAQ, updateFAQ }

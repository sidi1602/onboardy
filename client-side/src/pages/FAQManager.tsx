import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import EditIcon from '../assets/edit.icon'
import TrashIcon from '../assets/trash.icon'
import Button from '../components/Button'
import Card from '../components/Card'
import Input from '../components/Input'
import PopupMenu from '../components/PopupMenu'
import SearchBar from '../components/SearchBar'
import Typography from '../components/Typography'
import FAQ from '../models/FAQ'
import { useFAQsStore } from '../stores'

const StyledFAQManager = styled.div`
  .faqs-manager-wrapper {
    max-width: 768px;
    width: 100%;
    margin: auto;

    .faqs-search-bar {
      margin-bottom: 24px;
    }

  }

  table {
    width: 100%;
    border-collapse: collapse;

    th {
      font-weight: bold;
      padding: 16px;
      white-space: nowrap;
    }
    
    td {
      padding: 16px;
      border-top: solid 1px var(--text-secondary);
      vertical-align: middle;

      &:not(:nth-of-type(3)) {
        width: 45%;
      }

      &:nth-child(3) div{
        display: flex;
      }
    }
  }

  .create-button {
    margin-bottom: 24px;
    width: 100%;
    padding: 16px;
  }
`

const FAQManager: React.FunctionComponent = () => {
  const faqs = useFAQsStore((state) => state.FAQs);
  const getFAQs = useFAQsStore((state) => state.getFAQs);
  const addFAQ = useFAQsStore((state) => state.addFAQ);
  const removeFAQ = useFAQsStore((state) => state.removeFAQ);
  const editFAQ = useFAQsStore((state) => state.editFAQ);

  useEffect(() => {
    getFAQs()
  }, [])
  

  const [isCreating, setIsCreating] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');


  const handleFaqCreate = (newFaq: FAQ) => {
    addFAQ(newFaq)
  }

  const handleFaqRemove = (targetFaq: FAQ) => {
    const isConfirmed = confirm(`Are you sure you want to delete the following question? \n\n"${targetFaq.question}"`)
    if (!isConfirmed) return
    removeFAQ(targetFaq._id)
  }
  
  const handleFaqEdit = (editedTag: FAQ) => {
    editFAQ(editedTag)
  }

  return (
    <StyledFAQManager>
      <Card>
        <div className='faqs-manager-wrapper'>
          <SearchBar className='faqs-search-bar' placeholder='Search FAQs' onChange={({target}) => setSearchQuery(target.value)} />
          <Button onClick={() => setIsCreating(true)} className="create-button">Create new FAQ</Button>
          <table>
            <thead>
              <tr>
                <th>Questions</th>
                <th>Answers</th>
              </tr>
            </thead>
            <tbody>
              {faqs.filter((faq) => faq.question.toLowerCase().includes(searchQuery)).map((faq) => <tr key={faq.id}>
                <td>
                  <Typography size={16}>{faq.question}</Typography>
                </td>
                <td>
                  <Typography size={16}>{faq.answer}</Typography>
                </td>
                <td>
                  <div>
                    <Button minimal onClick={() => setEditing(faq)}><EditIcon /></Button>
                    <Button minimal onClick={() => handleFaqRemove(faq)}><TrashIcon /></Button>
                  </div>
                </td>
              </tr>)}
            </tbody>
          </table>
          {isCreating && <EditFaqPopup onComplete={handleFaqCreate} onClose={() => setIsCreating(false)}/>}
          {editing && <EditFaqPopup faq={editing} onComplete={handleFaqEdit} onClose={() => setEditing(false)}/>}
        </div>
      </Card>
    </StyledFAQManager>
  )
}

const EditFaqPopup = ({onComplete, onClose, faq = {}}: any) => {
  const labelRef = useRef<any>(null);
  const descriptionRef = useRef<any>(null);

  const handleComplete = () => {
    if (!labelRef.current.value) return;
    onComplete({
      ...faq,
      id: faq?.id || crypto.randomUUID(),
      question: labelRef.current.value,
      answer: descriptionRef.current.value
    });
    onClose();
  }

  return(
    <PopupMenu onClose={onClose}>
      <Typography size={24} weight="600"  styles={{ marginBottom: "24px" }}>{faq ? "Editing" : "Creating new"} FAQ</Typography>

      <Typography size={16} weight="600" styles={{ marginBottom: "8px" }}>Question</Typography>
      <Input ref={labelRef} defaultValue={faq?.question} style={{ marginBottom: "16px" }} />

      <Typography size={16} weight="600" styles={{ marginBottom: "8px" }}>Answer</Typography>
      <Input ref={descriptionRef} defaultValue={faq?.answer} style={{ marginBottom: "16px" }}/>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "15px" }}>
        <Button onClick={handleComplete}>{faq ? "Apply Changes" : "Create"}</Button>
        <Button onClick={onClose}>Close</Button>
      </div>
    </PopupMenu>
  )
}

export default FAQManager
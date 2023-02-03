import React from 'react'
import styled from 'styled-components'
import { generateStockImage } from '../helpers'
import Tasks from '../pages/Tasks'
import Card from './Card'
import ProgressBar from './ProgressBar'
import Typography from './Typography'

const StyledStudentCard = styled(Card)`
  cursor: pointer;

  .student-details {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;

    img {
      height: 45px;
      width: 45px;
      border-radius: 50%;
    }
  }

  .tasks-progress {
    margin-top: 15px;
  }

`

interface StudentCardProps {
  student: any
  onClick?: () => void
}

const StudentCard: React.FunctionComponent<StudentCardProps> = ({ student, onClick }) => {
  return (
    <StyledStudentCard onClick={onClick}>
      <div className='student-details'>
        <img src={generateStockImage(student.firstName, student.lastName)} />
        <div>
          <Typography size={18} weight="600">{student.firstName} {student.lastName}</Typography>
          <Typography>{student.email}</Typography>
        </div>
      </div>
      <ProgressBar label="Tasks Completion" value={student.tasksCompletion} className="tasks-progress" />
    </StyledStudentCard>
  )
}

export default StudentCard
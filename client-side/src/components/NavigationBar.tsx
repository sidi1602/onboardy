import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import Typography from './Typography'
import IntroIcon from './../assets/intro.icon'
import TasksIcon from './../assets/tasks.icon'
import FAQsIcon from './../assets/faqs.icon'
import StudentIcon from './../assets/student.icon'
import TagIcon from '../assets/tag.icon'
import BlogIcon from '../assets/blog.icon'
import { useStudentsStore, useUserStore } from '../stores'
import { generateStockImage } from '../helpers'
import MessageIcon from '../assets/message.icon'
import OnboardyLogo from './../assets/OnBoardy.png'

const StyledNavBar = styled.div`
  background: white;
  height: 100vh;
  width: 290px;
  border-right: 1px solid #F5F5F7;
  padding: 32px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: auto;
  
  .nav-links {
    margin: 60px 0;
    padding: 0;
    list-style: none;
    
    li {
      color: var(--text-secondary);
      margin-bottom: 20px;
      padding: 10px 20px;
      cursor: pointer;
      user-select: none;
      border-radius: 10px;
      min-height: 45px;
      display: flex;
      align-items: center;
      gap: 15px;
      transition: .2s ease;

      svg {
        font-size: 24px;
      }

      &.active {
        background: #F5F5F7;
        color: black;
      }
    }
  }

  .profile-details {
    padding: 10px 20px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    gap: 15px;

    img {
      height: 40px;
      width: 40px;
      border-radius: 50%;

    }
  }
`

const studentNavLinks = [
  { label: "Introduction", path: "introduction", icon: IntroIcon },
  { label: "Assigned Tasks", path: "assigned-tasks", icon: TasksIcon },
  { label: "FAQs", path: "faqs", icon: FAQsIcon },
]


const staffNavLinks = [
  { label: "Latest Updates", path: "latest", icon: MessageIcon },
  { label: "Students", path: "students", icon: StudentIcon },
  { label: "FAQs Manager", path: "faqs-manager", icon: FAQsIcon },
  { label: "Tags Manager", path: "tags-manager", icon: TagIcon },
  { label: "Tasks Manager", path: "tasks", icon: TasksIcon },
  { label: "Blogs", path: "blogs", icon: BlogIcon },
]

const staffMember = {
  id: "123",
  firstName: "EPITA",
  lastName: "Admin",
  email: "alexa.bob@epita.fr",
  type: "staff"
}

const student = {
  "_id": "63dbc8e8c6ef6d8dafd1dc09",
  "id": "8125676e-8c04-4501-8ef7-6d58f4eee329",
  "firstName": "Anais",
  "lastName": "Boehm",
  "email": "Everette.Mann11@example.com",
  "dob": "2000-05-04",
  "gender": "M",
  "nationality": "Ireland",
  "tags": [],
  "assignedTasks": [],
  "__v": 0,
  "tasksCompletion": 0
}

const NavigationBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [navLinks, setNavLinks] = useState<any>([]);
  const getStudents = useStudentsStore((state) => state.getStudents);

  useEffect(() => {
    getStudents()
  }, [])

  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    setUser({...student, student,type: "student"})
  }, []);

  useEffect(() => {
    setNavLinks(user?.type === "staff" ? staffNavLinks : studentNavLinks || [])
  }, [user])

  const handleProfileSwitch = () => {
    if (user?.type === "student") {
      setUser(staffMember)
      navigate("/latest");
    } else {
      setUser({...student, type: "student"});
      navigate("/introduction");
    }
  }

  return (
    <StyledNavBar>
      <div>
        <div className='onboardy-logo'>
          <Typography size={32} weight={"600"}><img src={OnboardyLogo} alt="onboardy-logo" /></Typography>
        </div>
        <ul className='nav-links'>
          {navLinks.map((nav: any, idx: number) => (
            <Link key={nav.label} to={nav.path}>
              <li className={location.pathname.includes(nav.path) ? 'active' : ''} key={idx}>
                <><nav.icon /> <Typography size={16} weight="600">{nav.label}</Typography></>
              </li>
            </Link>
          ))}
        </ul>
      </div>
      <div className='profile-details' onClick={handleProfileSwitch} style={{ cursor: "pointer" }}>
        <img src={generateStockImage(user?.firstName || "", user?.lastName || "")} alt="profile" />
        <Typography size={16} weight="600">{user?.firstName} {user?.lastName}</Typography>
      </div>
    </StyledNavBar>
  )
}

export default NavigationBar
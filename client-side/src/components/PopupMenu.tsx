import React from 'react'
import styled, { css } from 'styled-components'

const StyledPopupMenu = styled.div<{ staticMode?: boolean }>`
  ${({staticMode}) => staticMode ? '' : css`
    position: fixed;
    min-height: 250px;
    max-height: 80%;
    width: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 10px;
    padding: 32px;
    background: white;
    z-index: 3;
    overflow: overlay;
  `}
`

const StyledPopupMenuBlocker = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: rgba(0,0,0,0.5);
  z-index: 2;
`

interface PopupMenuProps {
  children: React.ReactNode,
  onClose?: () => void
  style?: React.CSSProperties
  staticMode?: boolean
}

const PopupMenu: React.FunctionComponent<PopupMenuProps> = ({ children, onClose, style, staticMode }) => {
  return (
    <>
      <StyledPopupMenu style={style} staticMode={staticMode} >
        {children}
      </StyledPopupMenu>
      {!staticMode && <StyledPopupMenuBlocker onClick={onClose} />}
    </>
  )
}

export default PopupMenu
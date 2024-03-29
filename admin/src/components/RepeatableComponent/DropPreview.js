
// React
import React from "react"

// Misc
import styled from "styled-components"

const Filler = styled.span`
  display: block;
  background-color: ${({ theme }) => theme.colors.primary100};
  outline: 1px dashed ${({ theme }) => theme.colors.primary500};
  outline-offset: -1px;
  padding: ${({ theme }) => theme.spaces[6]};
`

const DropPreview = () => {
  return <Filler padding={6} background="primary100" />
};

export default DropPreview

export { DropPreview }
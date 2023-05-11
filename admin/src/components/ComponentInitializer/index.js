
// React
import React from "react"
import PropTypes from "prop-types"

// Strapi
import { Box } from "@strapi/design-system/Box"
import { Stack } from "@strapi/design-system/Stack"
import { Flex } from "@strapi/design-system/Flex"
import { Typography } from "@strapi/design-system/Typography"
import PlusCircle from "@strapi/icons/PlusCircle"
import { pxToRem } from "@strapi/helper-plugin"

// Utils
import styled from "styled-components"

const IconWrapper = styled.span`
  > svg {
    width: ${pxToRem(24)};
    height: ${pxToRem(24)};
    > circle {
      fill: ${({ theme }) => theme.colors.primary200};
    }
    > path {
      fill: ${({ theme }) => theme.colors.primary600};
    }
  }
`;

const ComponentInitializer = ({ onClick, error }) => (
  <>
    <Box
      as="button"
      background="neutral100"
      borderColor={error ? "danger600" : "neutral200"}
      disabled={false}
      hasRadius
      onClick={onClick}
      paddingTop={9}
      paddingBottom={9}
      width="100%"
      type="button"
    >
      <Stack spacing={2}>
        <Flex justifyContent="center" style={{ cursor: "inherit" }}>
          <IconWrapper>
            <PlusCircle />
          </IconWrapper>
        </Flex>
        <Flex justifyContent="center">
          <Typography textColor="primary600" variant="pi" fontWeight="bold">
            {/* {formatMessage({
              id: getTrad("components.empty-repeatable"),
              defaultMessage: "No entry yet. Click on the button below to add one.",
            })} */}
            {"No entry yet. Click on the button below to add one."}
          </Typography>
        </Flex>
      </Stack>
    </Box>
    {error && (
      <Typography textColor="danger600" variant="pi">
        {error}
      </Typography>
    )}
  </>
)

ComponentInitializer.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default ComponentInitializer
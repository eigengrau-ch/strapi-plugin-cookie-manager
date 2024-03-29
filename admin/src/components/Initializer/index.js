
// React
import { useEffect, useRef } from "react"
import PropTypes from "prop-types"

// Utils
import { pluginId } from "../../utils"

const Initializer = ({ setPlugin }) => {
  const ref = useRef()
  ref.current = setPlugin

  useEffect(() => {
    ref.current(pluginId)
  }, [])

  return null
}

Initializer.propTypes = {
  setPlugin: PropTypes.func.isRequired,
}

export default Initializer

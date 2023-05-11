
// React
import React, { useState, useEffect } from "react"
import { useIntl } from "react-intl"

// Strapi
import { LoadingIndicatorPage } from "@strapi/helper-plugin"
import { EmptyStateLayout } from "@strapi/design-system/EmptyStateLayout"
import { Button } from "@strapi/design-system/Button"
import Plus from "@strapi/icons/Plus"

// Components
import Illo from "../Illo"
import PopupTable from "../PopupTable"
import { CreatePopupModal, UpdatePopupModal, DeletePopupModal, DeleteAllPopupModal, DuplicatePopupModal } from "../PopupModal"

// Utils
import { getTrad } from "../../utils"

// Api
import cookieManagerRequests from "../../api/cookie-manager"

const PopupTab = ({ currentLocale }) => {

  const { formatMessage } = useIntl()

  const [popupData, setPopupData] = useState([])

  const [showCreatePopupModal, setShowCreatePopupModal] = useState(false)
  const [showUpdatePopupModal, setShowUpdatePopupModal] = useState(false)
  const [showDeletePopupModal, setShowDeletePopupModal] = useState(false)
  const [showDuplicatePopupModal, setShowDuplicatePopupModal] = useState(false)
  const [showDeleteAllPopupModal, setShowDeleteAllPopupModal] = useState(false)

  const [popupIsLoading, setPopupIsLoading] = useState(true)

  const [currentPopup, setCurrentPopup] = useState(null)
  const [currentPopups, setCurrentPopups] = useState([])

  const setPopups = async () => {
    setPopupIsLoading(true)
    const popups = await cookieManagerRequests.getPopups(currentLocale)
    setPopupData(popups)
    setPopupIsLoading(false)
  }

  const createPopup = async (data) => {
    await cookieManagerRequests.createPopup(data)
    await setPopups()
  }

  const deletePopup = async (data) => {
    await cookieManagerRequests.deletePopup(data.id)
    await setPopups()
  }

  const deleteAllPopup = async (data) => {
    for (const popup of data) {
      await cookieManagerRequests.deletePopup(popup.id)
    }
    await setPopups()
  }

  const updatePopup = async (data) => {
    await cookieManagerRequests.updatePopup(data.id, data)
    await setPopups()
  }

  useEffect(async () => {
    await setPopups()
  }, [])

  useEffect(async () => {
    await setPopups()
  }, [currentLocale])

  const isLoading = !(!popupIsLoading)

  return (
    (!isLoading) ? (
      <>
        {(popupData.length > 0)
          ? 
          <PopupTable
            popups={popupData}
            setPopup={setCurrentPopup}
            setPopups={setCurrentPopups}
            updatePopup={updatePopup}
            setShowCreatePopupModal={setShowCreatePopupModal}
            setShowUpdatePopupModal={setShowUpdatePopupModal}
            setShowDeletePopupModel={setShowDeletePopupModal}
            setShowDuplicatePopupModal={setShowDuplicatePopupModal}
            setShowDeleteAllPopupModal={setShowDeleteAllPopupModal}
          />
          : <EmptyStateLayout
            icon={<Illo />}
            content={formatMessage({
              id: getTrad("empty.popup"),
              defaultMessage: "You don't have any popups yet..."
            })}
            action={
              <Button
                startIcon={<Plus />}
                variant="secondary"
                onClick={() => {
                  setShowCreatePopupModal(true)
                }
              }>
                {formatMessage({
                  id: getTrad("empty.popup.cta"),
                  defaultMessage: "Add your first popup"
                })}
              </Button>
            }
            shadow={"none"}
          />
        }

        {showCreatePopupModal && <CreatePopupModal setShowModal={setShowCreatePopupModal} createPopup={createPopup} locale={currentLocale} />}
        {showUpdatePopupModal && <UpdatePopupModal setShowModal={setShowUpdatePopupModal} updatePopup={updatePopup} popup={currentPopup} />}
        {showDeletePopupModal && <DeletePopupModal setShowModal={setShowDeletePopupModal} deletePopup={deletePopup} popup={currentPopup} showModal={showDeletePopupModal} />}
        {showDuplicatePopupModal && <DuplicatePopupModal setShowModal={setShowDuplicatePopupModal} createPopup={createPopup} popup={currentPopup} locale={currentLocale} />}
        {showDeleteAllPopupModal && <DeleteAllPopupModal setShowModal={setShowDeleteAllPopupModal} deleteAllPopup={deleteAllPopup} popups={currentPopups} showModal={showDeleteAllPopupModal} />}
      </>
    ) : (
      <LoadingIndicatorPage />
    )
  )
}

export default PopupTab
